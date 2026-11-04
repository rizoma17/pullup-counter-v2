import { useEffect, useState } from 'react';
import { formatDate } from './dates';

type Props = { enabled: boolean; todayReps: number; restDate: string | null; windowChoice: 'day' | 'evening' };
const DEVICE_KEY = 'pullup-push-device-v1';
const FLAG_KEY = 'pullup-push-enabled-v1';

function getDeviceId(): string {
  const previous = localStorage.getItem(DEVICE_KEY);
  if (previous && /^[a-f0-9-]{36}$/.test(previous)) return previous;
  const id = crypto.randomUUID();
  localStorage.setItem(DEVICE_KEY, id);
  return id;
}
function toBytes(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
}
async function send(action: string, data: Record<string, unknown> = {}) {
  const response = await fetch('/api/reminder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: getDeviceId(), action, ...data })
  });
  if (!response.ok) throw new Error('伺服器無法儲存提醒設定');
}
function isInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}
export function BackgroundPushControl({ enabled, todayReps, restDate, windowChoice }: Props) {
  const [subscribed, setSubscribed] = useState(() => localStorage.getItem(FLAG_KEY) === 'true');
  const [permission, setPermission] = useState(() => 'Notification' in window ? Notification.permission : 'unsupported');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const installed = isInstalled();
  const date = formatDate(new Date());

  useEffect(() => {
    if (!subscribed) return;
    const payload = { date: formatDate(new Date()), reps: todayReps, restDate, window: windowChoice };
    let cancelled = false;
    const sync = () => {
      if (cancelled) return;
      void send('status', payload).catch(() => {
        if (!cancelled) setError('暫時無法同步訓練狀態，請確認網路連線');
      });
    };
    sync();
    window.addEventListener('focus', sync);
    window.addEventListener('online', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', sync);
      window.removeEventListener('online', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [subscribed, todayReps, restDate, windowChoice]);

  async function activate() {
    setBusy(true);
    setError('');
    try {
      if (!supported) throw new Error('這個瀏覽器不支援背景推播');
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      if (permissionResult !== 'granted') throw new Error('必須在手機設定允許通知');
      // The existing PWA worker is used for both offline support and push events.
      const registration = await navigator.serviceWorker.ready;
      const configResponse = await fetch('/api/push-config', { cache: 'no-store' });
      if (!configResponse.ok) throw new Error('推播服務尚未準備完成');
      const config = await configResponse.json() as { publicKey: string };
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toBytes(config.publicKey)
        });
      }
      await send('subscribe', {
        subscription: subscription.toJSON(),
        date, reps: todayReps, restDate, window: windowChoice
      });
      localStorage.setItem(FLAG_KEY, 'true');
      setSubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法啟用推播');
    } finally { setBusy(false); }
  }

  async function deactivate() {
    setBusy(true);
    setError('');
    try {
      await send('unsubscribe');
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager?.getSubscription();
        await subscription?.unsubscribe();
      }
      localStorage.removeItem(FLAG_KEY);
      setSubscribed(false);
    } catch {
      setError('無法停用推播，請重新連線再試');
    } finally { setBusy(false); }
  }

  return <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
    <div className="text-sm font-semibold text-indigo-950">關閉網頁後仍可收到推播</div>
    <p className="mt-1 text-xs leading-5 text-indigo-800">
      iPhone 請先用 Safari「分享 → 加入主畫面」，再從主畫面開啟本程式。
      啟用後每日約 20:00 檢查當天紀錄，未訓練才可能收到提醒；此時段目前不是隨機的。
    </p>
    {!installed && <p className="mt-2 text-xs font-semibold text-amber-800">
      若使用 iPhone，請先加入主畫面並從主畫面開啟，才能允許推播。
    </p>}
    {subscribed && <p className="mt-2 text-xs text-emerald-700">背景推播已啟用；今天訓練後會自動同步停止提醒。</p>}
    {permission === 'denied' && <p className="mt-2 text-xs text-rose-700">通知已被封鎖，請到手機設定開啟通知權限。</p>}
    {error && <p role="alert" className="mt-2 text-xs text-rose-700">{error}</p>}
    <button type="button" disabled={busy || !enabled || (!installed && /iPhone|iPad|iPod/.test(navigator.userAgent))}
      className="mt-3 min-h-11 rounded-xl bg-indigo-900 px-4 text-sm font-semibold text-white disabled:opacity-50"
      onClick={subscribed ? deactivate : activate}>
      {busy ? '處理中…' : subscribed ? '停用背景推播' : '啟用背景推播'}
    </button>
    {!enabled && <p className="mt-2 text-xs text-indigo-800">先開啟上方「不定時提醒我訓練」，才能設定背景推播。</p>}
  </div>;
}
