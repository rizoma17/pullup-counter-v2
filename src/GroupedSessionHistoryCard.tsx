import { useMemo } from 'react';
import { useSessionHistory } from './useSessionHistory';
import { groupSessionsByDate } from './sessions';

function sourceLabel(source: 'manual' | 'import' | 'camera') {
  if (source === 'manual') return '手動';
  if (source === 'camera') return '相機';
  return '匯入';
}

export function GroupedSessionHistoryCard() {
  const { sessions, loading, refresh } = useSessionHistory(24);
  const groups = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">最近紀錄</h2>
        <button type="button" className="text-sm text-slate-500" onClick={() => void refresh()}>
          重新整理
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">載入中…</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-slate-500">目前還沒有訓練紀錄。</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.date} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{group.date}</p>
                <p className="text-xs text-slate-500">共 {group.totalReps} 下</p>
              </div>

              <div className="space-y-2">
                {group.items.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{session.reps} 下</p>
                      <p className="text-xs text-slate-500">{sourceLabel(session.source)}</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(session.createdAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
