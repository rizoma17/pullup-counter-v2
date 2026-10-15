import { usePullupStore } from './store';
import { useSessionHistory } from './useSessionHistory';
import { groupSessionsByDate } from './sessions';
import { getWeekdayLabel } from './dates';

export function RecentTrainingCard({ onViewAll }: { onViewAll: () => void }) {
  const dailyLog = usePullupStore((s) => s.dailyLog);
  const { sessions, loading, error } = useSessionHistory();
  const groups = groupSessionsByDate(sessions, dailyLog).slice(0, 3);
  return (
    <section className="rounded-3xl bg-white px-4 py-3 shadow-soft" aria-label="最近訓練">
      <div className="flex items-center justify-between"><h2 className="font-semibold">最近訓練</h2><button className="min-h-10 text-sm text-blue-600" onClick={onViewAll}>查看全部</button></div>
      {groups.map((group) => <div key={group.date} className="flex items-center justify-between border-t border-slate-100 py-2 text-sm"><span><time dateTime={group.date}>{group.date.replace(/-/g, '/')}</time><span className="ml-2 text-slate-400">週{getWeekdayLabel(group.date)}</span></span><span className="font-semibold tabular-nums">{group.totalReps} 下</span></div>)}
      {groups.length === 0 && <p className="py-2 text-sm text-slate-500">{loading ? '讀取紀錄中…' : '還沒有紀錄，從今天的第一下開始！'}</p>}
      {error && <p className="text-xs text-amber-700">{error}</p>}
    </section>
  );
}
