export function DailyProgressCard({ todayReps, dailyGoal }: { todayReps: number; dailyGoal: number }) {
  const progress = Math.min((todayReps / dailyGoal) * 100, 100);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">今日目標進度</span>
        <span className="font-medium text-slate-900">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
