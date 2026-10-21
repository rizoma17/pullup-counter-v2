import { useState } from 'react';
import { formatDate } from './dates';

type Props = { dailyLog: Record<string, { reps: number }>; today: string };

function getIntensity(reps: number) {
  if (reps >= 30) return 'bg-slate-900 text-white';
  if (reps >= 15) return 'bg-slate-700 text-white';
  if (reps >= 1) return 'bg-slate-400 text-white';
  return 'bg-slate-100 text-slate-600';
}

export function StreakHeatmap({ dailyLog, today }: Props) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [year, month] = today.split('-').map(Number);
  const months = [0, 1, 2].map((offset) => new Date(year, month - 1 - offset, 1));

  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">訓練強度</h2>
        <p className="text-xs text-slate-500">本月與前 2 個月</p>
      </div>
      <p className="mt-1 text-xs text-slate-500">依每日總次數顯示深淺，點選日期查看紀錄。</p>
      <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm" aria-live="polite" aria-atomic="true">
        {selectedDate.replace(/-/g, '/')} · <strong>{dailyLog[selectedDate]?.reps ?? 0} 下</strong>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs text-slate-500">
        {[[0, '0 下'], [1, '1–14 下'], [15, '15–29 下'], [30, '30 下以上']].map(([reps, label]) => (
          <span key={reps} className="inline-flex items-center gap-1">
            <span className={`h-3 w-3 rounded ${getIntensity(Number(reps))}`} />{label}
          </span>
        ))}
      </div>
      <div className="mt-5 space-y-6">
        {months.map((firstDay) => {
          const monthKey = formatDate(firstDay).slice(0, 7);
          const count = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();
          return (
            <div key={monthKey}>
              <h3 className="mb-3 text-sm font-semibold">{firstDay.getFullYear()} 年 {firstDay.getMonth() + 1} 月</h3>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['日', '一', '二', '三', '四', '五', '六'].map((label) => (
                  <span key={label} className="pb-1 text-xs text-slate-500">{label}</span>
                ))}
                {Array.from({ length: firstDay.getDay() }, (_, index) => <span key={`blank-${index}`} />)}
                {Array.from({ length: count }, (_, index) => {
                  const day = index + 1;
                  const date = `${monthKey}-${String(day).padStart(2, '0')}`;
                  const reps = dailyLog[date]?.reps ?? 0;
                  const future = date > today;
                  return (
                    <button key={date} type="button" disabled={future}
                      onClick={() => setSelectedDate(date)}
                      aria-label={`${date}：${future ? '尚未到來' : `${reps} 下`}`}
                      aria-pressed={selectedDate === date}
                      aria-current={date === today ? 'date' : undefined}
                      title={`${date}：${future ? '尚未到來' : `${reps} 下`}`}
                      className={`relative min-w-0 min-h-11 rounded-xl text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${future ? 'bg-slate-50 text-slate-300' : getIntensity(reps)} ${selectedDate === date ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                    >
                      {day}
                      {date === today && <span aria-hidden="true" className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
