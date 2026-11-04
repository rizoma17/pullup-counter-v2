import { Bell, BellOff, CheckCircle2, Clock3, Moon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatDate } from './dates';
import { useToast } from './useToast';

type WindowChoice = 'day' | 'evening';
type Frequency = 1 | 2;

type ReminderState = {
  enabled: boolean;
  frequency: Frequency;
  window: WindowChoice;
  planDate: string;
  planTimes: number[];
  delivered: number[];
  restDate: string | null;
};

const STORAGE_KEY = 'pullup-training-reminder-v1';
const DEFAULTS: ReminderState = {
  enabled: false,
  frequency: 2,
  window: 'day',
  planDate: '',
  planTimes: [],
  delivered: [],
  restDate: null
};

const MESSAGES = [
  '今天還沒有訓練紀錄。先做 5 下，讓自己動起來！',
  '不用等到有動力才開始，先做第一組引體向上吧。',
  '今天的單槓還在等你。花幾分鐘完成一組？',
  '保持規律比一次做很多更重要。今天練了嗎？'
];

function readReminder(): ReminderState {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<ReminderState> | null;
    if (!value) return { ...DEFAULTS };
    return {
      enabled: value.enabled === true,
      frequency: value.frequency === 1 ? 1 : 2,
      window: value.window === 'evening' ? 'evening' : 'day',
      planDate: typeof value.planDate === 'string' ? value.planDate : '',
      planTimes: Array.isArray(value.planTimes) ? value.planTimes.filter((v): v is number => typeof v === 'number' && Number.isFinite(v)) : [],
      delivered: Array.isArray(value.delivered) ? value.delivered.filter((v): v is number => typeof v === 'number' && Number.isFinite(v)) : [],
      restDate: typeof value.restDate === 'string' ? value.restDate : null
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function buildPlan(state: ReminderState, now: Date): ReminderState {
  const date = formatDate(now);
  if (state.planDate === date) return state;
  const startHour = state.window === 'evening' ? 17 : 12;
  const endHour = state.window === 'evening' ? 22 : 21;
  const begin = new Date(now);
  begin.setHours(startHour, 0, 0, 0);
  const end = new Date(now);
  end.setHours(endHour, 0, 0, 0);
  const start = Math.max(begin.getTime(), now.getTime() + 5 * 60_000);
  const available = end.getTime() - start;
  const count = available >= 150 * 60_000 ? state.frequency : available >= 15 * 60_000 ? 1 : 0;
  const interval = count > 0 ? available / count : 0;
  const planTimes = Array.from({ length: count }, (_, index) => {
    return Math.floor(start + index * interval + interval * (0.25 + Math.random() * 0.5));
  }).sort((a, b) => a - b);
  return { ...state, planDate: date, planTimes, delivered: [] };
}

async function showSystemNotification(message: string, day: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const registration = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    const options: NotificationOptions = {
      body: message,
      icon: '/icons/icon-192.png',
      tag: 'pullup-reminder-' + day
    };
    if (registration?.active) {
      await registration.showNotification('引體向上 · 今日訓練提醒', options);
    } else {
      // Desktop browsers may support page-based notifications; most mobile browsers do not.
      new Notification('引體向上 · 今日訓練提醒', options);
    }
  } catch {
    // Some platforms deny page-triggered notifications even after permission was granted.
  }
}

export function TrainingReminder({ todayReps }: { todayReps: number }) {
  const pushToast = useToast((state) => state.pushToast);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ReminderState>(readReminder);
  const dataRef = useRef(state);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    () => 'Notification' in window ? Notification.permission : 'unsupported'
  );

  function commit(next: ReminderState) {
    dataRef.current = next;
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      pushToast({ title: '瀏覽器無法儲存提醒設定，請檢查儲存空間', tone: 'error' });
    }
  }

  function updateConfig(changes: Partial<Pick<ReminderState, 'enabled' | 'frequency' | 'window'>>) {
    commit({ ...dataRef.current, ...changes, planDate: '', planTimes: [], delivered: [] });
  }

  useEffect(() => {
    if (!state.enabled) return;

    function check() {
      let current = dataRef.current;
      const now = new Date();
      const today = formatDate(now);
      if (current.planDate !== today) {
        current = buildPlan(current, now);
        dataRef.current = current;
        setState(current);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      }
      if (todayReps > 0 || current.restDate === today) return;
      const overdue = current.planTimes.filter((time) => time <= now.getTime() && !current.delivered.includes(time));
      if (!overdue.length) return;

      const endHour = current.window === 'evening' ? 22 : 21;
      if (now.getHours() >= endHour) {
        commit({ ...current, delivered: [...current.delivered, ...overdue] });
        return;
      }

      // A hidden browser without notification permission should wait until the app is visible.
      if (document.visibilityState !== 'visible' && permission !== 'granted') return;

      commit({ ...current, delivered: [...current.delivered, ...overdue] });
      const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      if (document.visibilityState === 'visible') {
        pushToast({ title: message, tone: 'success' });
      } else {
        void showSystemNotification(message, today);
      }
    }

    check();
    const timer = window.setInterval(check, 30_000);
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
    };
  }, [state.enabled, state.frequency, state.window, todayReps, permission, pushToast]);

  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open]);

  const today = formatDate(new Date());
  const resting = state.restDate === today;
  const hasTrained = todayReps > 0;

  async function requestNotifications() {
    if (!('Notification' in window)) return;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      pushToast({
        title: result === 'granted' ? '已允許系統通知（僅在網頁仍執行時可能顯示）' : '尚未取得系統通知權限，仍會顯示網頁內提醒',
        tone: result === 'granted' ? 'success' : 'error'
      });
    } catch {
      pushToast({ title: '此瀏覽器暫不支援系統通知，仍可使用網頁內提醒', tone: 'error' });
    }
  }

  function testReminder() {
    const message = '測試提醒：今天做幾下引體向上，從第一組開始！';
    pushToast({ title: message, tone: 'success' });
    if (permission === 'granted') void showSystemNotification(message, today);
  }

  return (
    <>
      <button type="button" aria-label="訓練提醒設定" title="訓練提醒設定"
        onClick={() => setOpen(true)}
        className={'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ' + (state.enabled ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500')}>
        {state.enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
        {state.enabled && !hasTrained && !resting && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />}
      </button>

      {open && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center" onClick={() => setOpen(false)}>
        <section role="dialog" aria-modal="true" aria-label="訓練提醒設定"
          className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl"
          onClick={(event) => event.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Bell className="h-5 w-5" /> 訓練提醒</h2>
            <button type="button" aria-label="關閉設定" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <div className="font-semibold text-slate-900">不定時提醒我訓練</div>
              <p className="mt-1 text-xs text-slate-500">當天已有訓練紀錄，就不再提醒</p>
            </div>
            <button type="button" role="switch" aria-checked={state.enabled}
              onClick={() => updateConfig({ enabled: !state.enabled })}
              className={'relative h-8 w-14 shrink-0 rounded-full transition ' + (state.enabled ? 'bg-emerald-600' : 'bg-slate-300')}>
              <span className={'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ' + (state.enabled ? 'left-7' : 'left-1')} />
            </button>
          </div>

          {state.enabled && <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-sm font-medium text-slate-700">提醒次數
                <select value={state.frequency} onChange={(event) => updateConfig({ frequency: Number(event.target.value) === 1 ? 1 : 2 })}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">
                  <option value={1}>每天最多 1 次</option>
                  <option value={2}>每天最多 2 次</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">隨機時段
                <select value={state.window} onChange={(event) => updateConfig({ window: event.target.value === 'evening' ? 'evening' : 'day' })}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">
                  <option value="day">12:00–21:00</option>
                  <option value="evening">17:00–22:00</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
              <div className="flex items-center gap-2 text-sm">
                {hasTrained ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : resting ? <Moon className="h-4 w-4 text-blue-600" /> : <Clock3 className="h-4 w-4 text-amber-600" />}
                {hasTrained ? '今天已訓練，提醒自動停止' : resting ? '今日休息，明天恢復提醒' : '今天尚未訓練'}
              </div>
              {!hasTrained && <button type="button" className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium"
                onClick={() => commit({ ...dataRef.current, restDate: resting ? null : today })}>
                {resting ? '取消休息' : '今天休息'}
              </button>}
            </div>
          </>}

          <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs leading-5 text-sky-900">
            本版會在網頁開啟、仍持續執行時依隨機時間提醒；關閉網頁後無法保證發送系統通知。真正的背景推播需要另外建立推播服務。
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {permission === 'default' && <button type="button" onClick={requestNotifications} className="min-h-11 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white">允許系統通知</button>}
            <button type="button" onClick={testReminder} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700">測試提醒</button>
          </div>
          {permission === 'denied' && <p className="mt-2 text-xs text-rose-600">系統通知已被封鎖，請從瀏覽器或手機設定中手動開啟。</p>}
          {permission === 'unsupported' && <p className="mt-2 text-xs text-slate-500">此環境不支援系統通知，但仍可使用網頁內提醒。</p>}
        </section>
      </div>}
    </>
  );
}
