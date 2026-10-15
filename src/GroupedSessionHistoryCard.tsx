import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import type { TrainingSession } from './app';
import { getWeekdayLabel } from './dates';
import { useSessionHistory } from './useSessionHistory';
import { groupSessionsByDate } from './sessions';
import { usePullupStore } from './store';

function sourceLabel(source: TrainingSession['source']) {
  if (source === 'manual') return '手動記錄';
  if (source === 'camera') return '歷史記錄';
  return '匯入記錄';
}

export function GroupedSessionHistoryCard() {
  const dailyLog = usePullupStore((s) => s.dailyLog);
  const { sessions, loading, error, refresh } = useSessionHistory();
  const groups = useMemo(() => groupSessionsByDate(sessions, dailyLog), [sessions, dailyLog]);

  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft" aria-labelledby="training-history-title">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="training-history-title" className="text-lg font-semibold text-slate-900">每日訓練紀錄</h2>
          <p className="mt-1 text-xs text-slate-500">
            {groups.length > 0 ? `共 ${groups.length} 個日期・由新到舊` : '所有已儲存日期的訓練次數'}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 py-1 text-sm text-slate-500 disabled:opacity-50"
          disabled={loading}
          onClick={() => void refresh()}
        >
          重新整理
        </button>
      </div>

      {error && <p role="status" className="mb-3 text-sm text-amber-700">{error}</p>}
      {loading && <p role="status" className="mb-3 text-sm text-slate-500">正在讀取逐筆記錄…</p>}

      {!loading && groups.length === 0 ? (
        <p className="text-sm text-slate-500">目前還沒有訓練紀錄，記錄次數後就會顯示在這裡。</p>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <details key={group.date} className="group overflow-hidden rounded-2xl border border-slate-100">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-slate-50 px-3 py-4 [&::-webkit-details-marker]:hidden">
                <div>
                  <time dateTime={group.date} className="font-semibold text-slate-900">
                    {group.date.replace(/-/g, '/')}
                  </time>
                  <p className="mt-1 text-xs text-slate-500">
                    星期{getWeekdayLabel(group.date)}・{group.items.length > 0 ? `${group.items.length} 筆明細` : '每日總數'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-lg font-bold tabular-nums text-slate-900">
                    {group.totalReps} <span className="text-xs font-normal text-slate-500">下</span>
                  </p>
                  <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                </div>
              </summary>

              <div className="space-y-2 px-3 py-3">
                {group.items.length === 0 ? (
                  <p className="text-sm text-slate-500">此日期僅保留每日總次數，沒有逐筆記錄。</p>
                ) : (
                  <>
                    {group.items.reduce((sum, item) => sum + item.reps, 0) !== group.totalReps && (
                      <p className="text-xs leading-relaxed text-slate-500">
                        每日總數包含調整或匯入結果，下方顯示目前保留的逐筆記錄。
                      </p>
                    )}
                    {group.items.map((session) => (
                      <div key={session.id} className="flex items-center justify-between gap-3 rounded-xl px-1 py-2">
                        <div>
                          <p className="font-medium text-slate-900">{session.reps} 下</p>
                          <p className="text-xs text-slate-500">{sourceLabel(session.source)}</p>
                        </div>
                        <time dateTime={new Date(session.createdAt).toISOString()} className="text-sm tabular-nums text-slate-500">
                          {new Date(session.createdAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </time>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
