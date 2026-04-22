import { useRef } from 'react';
import { useToast } from './useToast';
import { usePullupStore } from './store';
import { downloadJson, readJsonFile } from './exportImport';

export function DataControlCard() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pushToast = useToast((s) => s.pushToast);

  const state = usePullupStore((s) => ({
    totalReps: s.totalReps,
    todayReps: s.todayReps,
    lastTrackedDate: s.lastTrackedDate,
    dailyLog: s.dailyLog,
    settings: s.settings
  }));
  const importData = usePullupStore((s) => s.importData);
  const resetAll = usePullupStore((s) => s.resetAll);

  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-900">Data Control</h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="h-12 rounded-2xl bg-slate-900 font-medium text-white"
          onClick={() => {
            downloadJson('pullup-data.json', state);
            pushToast({ title: 'Data exported', tone: 'success' });
          }}
        >
          Export JSON
        </button>

        <button
          type="button"
          className="h-12 rounded-2xl bg-slate-100 font-medium text-slate-700"
          onClick={() => inputRef.current?.click()}
        >
          Import JSON
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const payload = await readJsonFile(file);
            importData(payload);
            pushToast({ title: 'Import successful', tone: 'success' });
          } catch {
            pushToast({ title: 'Invalid JSON file', tone: 'error' });
          }
          e.currentTarget.value = '';
        }}
      />

      <button
        type="button"
        className="h-12 w-full rounded-2xl border border-red-200 text-red-600"
        onClick={async () => {
          const confirmed = window.confirm('Reset all local data and session history?');
          if (!confirmed) return;
          await resetAll();
          pushToast({ title: 'All local data cleared', tone: 'success' });
        }}
      >
        Reset All Data
      </button>
    </div>
  );
}
