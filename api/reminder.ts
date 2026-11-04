import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get, put, del } from '@vercel/blob';

const PREFIX = 'reminders-v1/';
type Stored = {
  id: string;
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
  enabled: boolean;
  date: string;
  reps: number;
  restDate: string | null;
  window: 'day' | 'evening';
  notifiedDate?: string;
  updatedAt: number;
};

function validId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-f0-9-]{36}$/.test(id);
}
function validateSubscription(data: unknown): data is Stored['subscription'] {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as Stored['subscription'];
  try {
    const url = new URL(candidate.endpoint);
    return url.protocol === 'https:' && candidate.endpoint.length < 2000 &&
      typeof candidate.keys?.p256dh === 'string' && candidate.keys.p256dh.length < 300 &&
      typeof candidate.keys?.auth === 'string' && candidate.keys.auth.length < 200;
  } catch { return false; }
}
async function read(id: string): Promise<Stored | null> {
  const data = await get(PREFIX + id + '.json', { access: 'private' });
  if (!data) return null;
  return JSON.parse(await new Response(data.stream).text()) as Stored;
}
async function write(data: Stored): Promise<void> {
  await put(PREFIX + data.id + '.json', JSON.stringify(data), {
    access: 'private', allowOverwrite: true, contentType: 'application/json'
  });
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body ?? {};
  const { id, action } = body;
  if (!validId(id)) return res.status(400).json({ error: 'Invalid device identifier' });
  try {
    if (action === 'unsubscribe') {
      await del(PREFIX + id + '.json');
      return res.status(200).json({ ok: true });
    }
    if (action === 'subscribe') {
      if (!validateSubscription(body.subscription)) return res.status(400).json({ error: 'Invalid push subscription' });
      const existing = await read(id);
      const data: Stored = {
        id, subscription: body.subscription,
        enabled: true,
        date: typeof body.date === 'string' ? body.date.slice(0, 10) : '',
        reps: Math.max(0, Number(body.reps) || 0),
        restDate: typeof body.restDate === 'string' ? body.restDate.slice(0, 10) : null,
        window: body.window === 'evening' ? 'evening' : 'day',
        notifiedDate: existing?.notifiedDate,
        updatedAt: Date.now()
      };
      await write(data);
      return res.status(200).json({ ok: true });
    }
    if (action === 'status') {
      const existing = await read(id);
      if (!existing) return res.status(404).json({ error: 'Subscription not found' });
      const next: Stored = {
        ...existing,
        date: typeof body.date === 'string' ? body.date.slice(0, 10) : existing.date,
        reps: Math.max(0, Number(body.reps) || 0),
        restDate: typeof body.restDate === 'string' ? body.restDate.slice(0, 10) : null,
        window: body.window === 'evening' ? 'evening' : 'day',
        updatedAt: Date.now()
      };
      await write(next);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Reminder API failed', error instanceof Error ? error.message : 'unknown');
    return res.status(500).json({ error: 'Unable to save notification settings' });
  }
}
