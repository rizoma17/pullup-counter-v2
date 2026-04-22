import { useToast } from './useToast';
import { usePullupStore } from './store';

export function SettingsPanel() {
  const dailyGoal = usePullupStore((s) => s.settings.dailyGoal);
  const vibrationEnabled = usePullupStore((s) => s.settings.vibrationEnabled);
  const soundEnabled = usePullupStore((s) => s.settings.soundEnabled);
  const sensorMode = usePullupStore((s) => s.settings.sensorMode);

  const setDailyGoal = usePullupStore((s) => s.setDailyGoal);
  const setVibrationEnabled = usePullupStore((s) => s.setVibrationEnabled);
  const setSoundEnabled = usePullupStore((s) => s.setSoundEnabled);
  const setSensorMode = usePullupStore((s) => s.setSensorMode);
  const pushToast = useToast((s) => s.pushToast);

  return (
    <div className="space-y-4 rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-900">Settings</h2>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm text-slate-600">Daily Goal</label>
          <span className="text-xs text-slate-400">Recommended 20–50</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input
            type="number"
            min={1}
            max={500}
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Math.min(Math.max(Number(e.target.value) || 1, 1), 500))}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none"
          />
          <button
            type="button"
            className="h-12 rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white"
            onClick={() => pushToast({ title: `Daily goal saved: ${dailyGoal} reps`, tone: 'success' })}
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
        <div>
          <p className="font-medium text-slate-900">Vibration</p>
          <p className="text-xs text-slate-500">Haptic feedback on rep logging</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVibrationEnabled(!vibrationEnabled);
            pushToast({ title: `Vibration ${!vibrationEnabled ? 'enabled' : 'disabled'}`, tone: 'success' });
          }}
          className={`relative h-7 w-12 rounded-full transition ${vibrationEnabled ? 'bg-slate-900' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${vibrationEnabled ? 'left-6' : 'left-1'}`} />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
        <div>
          <p className="font-medium text-slate-900">Sound</p>
          <p className="text-xs text-slate-500">Reserved for future audio cue support</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            pushToast({ title: `Sound ${!soundEnabled ? 'enabled' : 'disabled'}`, tone: 'success' });
          }}
          className={`relative h-7 w-12 rounded-full transition ${soundEnabled ? 'bg-slate-900' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${soundEnabled ? 'left-6' : 'left-1'}`} />
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-600">Input Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {['manual', 'camera'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setSensorMode(mode as 'manual' | 'camera');
                pushToast({ title: `Input mode: ${mode}`, tone: 'success' });
              }}
              className={`h-12 rounded-2xl text-sm font-medium ${
                sensorMode === mode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {mode === 'manual' ? 'Manual' : 'Camera'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
