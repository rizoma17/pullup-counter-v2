import { Activity, Dumbbell, Flame, Trophy, CheckCircle2, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AvatarEvolution } from './AvatarEvolution';
import { WeeklyTrendChart } from './WeeklyTrendChart';
import { StreakHeatmap } from './StreakHeatmap';
import { AchievementGrid } from './AchievementGrid';
import { CounterPanel } from './CounterPanel';
import { RecentTrainingCard } from './RecentTrainingCard';
import { useDayRollover } from './useDayRollover';
import { ToastViewport } from './ToastViewport';
import { GroupedSessionHistoryCard } from './GroupedSessionHistoryCard';
import { BottomActionBar } from './BottomActionBar';
import { KPICard } from './KPICard';
import { getAchievements } from './achievementRules';
import { getWeeklyChartData } from './selectors';
import { usePullupStore } from './store';
import { getStreak } from './dates';
import { getLevel } from './level';
import { useToast } from './useToast';

function formatSavedTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function App() {
  useDayRollover();
  const currentDate = usePullupStore((s) => s.lastTrackedDate);
  const resetToday = usePullupStore((s) => s.resetToday);
  const totalReps = usePullupStore((s) => s.totalReps);
  const todayReps = usePullupStore((s) => s.todayReps);
  const dailyLog = usePullupStore((s) => s.dailyLog);
  const dailyGoal = usePullupStore((s) => s.settings.dailyGoal);
  const lastSavedAt = usePullupStore((s) => s.lastSavedAt);
  const addReps = usePullupStore((s) => s.addReps);
  const pushToast = useToast((s) => s.pushToast);
  const [tab, setTab] = useState<'counter' | 'analytics' | 'awards' | 'intensity'>('counter');

  const weeklyData = useMemo(() => getWeeklyChartData(dailyLog), [dailyLog, currentDate]);
  const weeklyTotal = weeklyData.reduce((sum, item) => sum + item.reps, 0);
  const streak = getStreak(dailyLog);
  const level = getLevel(totalReps);
  const achievements = getAchievements(totalReps, streak, weeklyTotal);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ToastViewport />

      <div className="mx-auto max-w-md space-y-3 px-4 pb-28 pt-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">引體向上計數器</h1>
          <span className="flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 className="h-3 w-3" />已儲存 {formatSavedTime(lastSavedAt)}</span>
        </header>

        <div className="grid h-12 grid-cols-4 rounded-2xl bg-white p-1 shadow-soft">
          {[
            ['counter', '計數'],
            ['analytics', '分析'],
            ['awards', '成就'],
            ['intensity', '訓練強度']
          ].map(([item, label]) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item as typeof tab)}
              className={`rounded-2xl text-xs font-medium ${tab === item ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'counter' && <>
          <AvatarEvolution stage={level.stage} label={level.label} totalReps={totalReps} />
          <section className="rounded-3xl bg-white p-4 shadow-soft" aria-label="今日紀錄">
            <div className="flex items-center justify-between"><h2 className="text-sm text-slate-500">今日 · {currentDate.replace(/-/g, '/')}</h2><button type="button" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 active:bg-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2" onClick={() => {
              if (window.confirm('將今天的次數歸零？其他日期的紀錄會保留，累積次數也會同步扣除今天的次數。')) {
                resetToday();
                pushToast({ title: '今日已歸零，其他日期紀錄已保留', tone: 'success' });
              }
            }}><RotateCcw aria-hidden="true" className="h-4 w-4" />今日歸零</button></div>
            <div className="mb-3 flex items-baseline gap-2"><strong data-testid="today-reps" className="text-4xl tabular-nums">{todayReps}</strong><span className="text-sm text-slate-500">下 / 目標 {dailyGoal} 下</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${Math.min(100, todayReps / Math.max(1, dailyGoal) * 100)}%` }} /></div>
          </section>
          <CounterPanel />
          <RecentTrainingCard onViewAll={() => setTab('analytics')} />
        </>}
        {tab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <KPICard icon={<Dumbbell className="h-5 w-5" />} title="今日" value={todayReps} hint={`目標 ${dailyGoal} 下`} />
              <KPICard icon={<Trophy className="h-5 w-5" />} title="總累積" value={totalReps} hint={level.label} />
              <KPICard icon={<Flame className="h-5 w-5" />} title="連續天數" value={`${streak} 天`} hint="連續有訓練的天數" />
              <KPICard icon={<Activity className="h-5 w-5" />} title="本週" value={weeklyTotal} hint="近 7 天總和" />
            </div>
            <GroupedSessionHistoryCard />
            <WeeklyTrendChart data={weeklyData} />
          </div>
        )}
        {tab === 'awards' && <AchievementGrid achievements={achievements} />}
        {tab === 'intensity' && <StreakHeatmap dailyLog={dailyLog} today={currentDate} />}
      </div>

      {tab !== 'counter' && <BottomActionBar
        levelLabel={level.label}
        onLogOne={async () => {
          await addReps(1);
          pushToast({ title: '已新增 1 下，並儲存到此裝置', tone: 'success' });
        }}
      />}
    </div>
  );
}
