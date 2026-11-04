import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list, get, put, del } from '@vercel/blob';
import webpush from 'web-push';
import { createHash, timingSafeEqual } from 'node:crypto';

const PREFIX = 'reminders-v1/';
const sentences = [
  '今天還沒做引體向上嗎？先做 5 下就好。',
  '今天還沒有訓練紀錄。先從第一組開始！',
  '不用等有動力，做完第一組再決定下一組。',
  '你的單槓訓練還沒打卡，今天動一動吧。'
];

function taiwanDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
function isAuthorized(auth: string | undefined) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !auth) return false;
  const expected = Buffer.from('Bearer ' + secret);
  const actual = Buffer.from(auth);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAuthorized(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' });
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return res.status(503).json({ error: 'Push not configured' });
  webpush.setVapidDetails('https://pullup-counter-v2-la2k.vercel.app', publicKey, privateKey);
  const date = taiwanDate();
  let checked = 0;
  let sent = 0;
  let failures = 0;
  try {
    let cursor: string | undefined;
    do {
      const batch = await list({ prefix: PREFIX, limit: 500, cursor });
      cursor = batch.hasMore ? batch.cursor : undefined;
      for (const blob of batch.blobs) {
        checked++;
        try {
          const content = await get(blob.pathname, { access: 'private' });
          if (!content) continue;
          const device = JSON.parse(await new Response(content.stream).text()) as {
            id: string;
            subscription: webpush.PushSubscription;
            enabled: boolean;
            date: string;
            reps: number;
            restDate: string | null;
            window: string;
            notifiedDate?: string;
            updatedAt?: number;
          };
          if (!device.enabled || device.notifiedDate === date ||
            device.restDate === date || (device.date === date && device.reps > 0)) continue;
          // The device must have synced recently, otherwise training status is uncertain.
          if (!device.updatedAt || Date.now() - device.updatedAt > 7 * 86400000) continue;
          const digest = createHash('sha256').update(device.id + ':' + date).digest();
          // Vary the days on which a reminder arrives, to avoid a repetitive fixed alert.
          if (digest[0] >= 230) continue;
          const index = digest[1] % sentences.length;
          await webpush.sendNotification(device.subscription, JSON.stringify({
            title: '引體向上 · 訓練提醒',
            body: sentences[index],
            url: '/'
          }), { TTL: 7200, urgency: 'normal' });
          device.notifiedDate = date;
          await put(blob.pathname, JSON.stringify(device), {
            access: 'private', allowOverwrite: true, contentType: 'application/json'
          });
          sent++;
        } catch (error) {
          failures++;
          const status = (error as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) {
            try { await del(blob.pathname); } catch { /* ignore stale cleanup failure */ }
          } else {
            console.error('Failed push for one subscription', status ?? 'unknown');
          }
        }
      }
    } while (cursor);
    return res.status(200).json({ checked, sent, failures });
  } catch (error) {
    console.error('Cron failed', error instanceof Error ? error.message : 'unknown');
    return res.status(500).json({ error: 'Unable to run reminders' });
  }
}
