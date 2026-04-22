import { useMemo } from 'react';
import { useSessionHistory } from './useSessionHistory';
import { groupSessionsByDate } from './sessions';

export function GroupedSessionHistoryCard() {
  const { sessions, loading, refresh } = useSessionHistory(24);
  const groups = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Sessions</h2>
        <button type="button" className="text-sm text-slate-500" onClick={() => void refresh()}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-slate-500">No session history yet.</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.date} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{group.date}</p>
                <p className="text-xs text-slate-500">{group.totalReps} reps total</p>
              </div>

              <div className="space-y-2">
                {group.items.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{session.reps} reps</p>
                      <p className="text-xs text-slate-500">{session.source}</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
