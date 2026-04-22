import { getPastNDays } from './dates';

type Props = {
  dailyLog: Record<string, { reps: number }>;
  days?: number;
};

function getIntensity(reps: number) {
  if (reps >= 30) return 'bg-slate-900';
  if (reps >= 15) return 'bg-slate-700';
  if (reps >= 1) return 'bg-slate-400';
  return 'bg-slate-100';
}

export function StreakHeatmap({ dailyLog, days = 28 }: Props) {
  const daysList = getPastNDays(days);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Consistency</h2>
        <p className="text-xs text-slate-500">Last {days} days</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysList.map((date) => {
          const reps = dailyLog[date]?.reps ?? 0;
          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <div title={`${date}: ${reps} reps`} className={`h-8 w-8 rounded-xl ${getIntensity(reps)}`} />
              <span className="text-[10px] text-slate-400">{date.slice(8)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span>Less</span>
        <div className="h-3 w-3 rounded bg-slate-100" />
        <div className="h-3 w-3 rounded bg-slate-400" />
        <div className="h-3 w-3 rounded bg-slate-700" />
        <div className="h-3 w-3 rounded bg-slate-900" />
        <span>More</span>
      </div>
    </div>
  );
}
