import { Activity, Dumbbell, Flame, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AvatarEvolution } from './AvatarEvolution';
import { WeeklyTrendChart } from './WeeklyTrendChart';
import { StreakHeatmap } from './StreakHeatmap';
import { AchievementGrid } from './AchievementGrid';
import { CounterPanel } from './CounterPanel';
import { DailyProgressCard } from './DailyProgressCard';
import { ToastViewport } from './ToastViewport';
import { GroupedSessionHistoryCard } from './GroupedSessionHistoryCard';
import { DataControlCard } from './DataControlCard';
import { InstallPromptCard } from './InstallPromptCard';
import { SettingsPanel } from './SettingsPanel';
import { BottomActionBar } from './BottomActionBar';
import { KPICard } from './KPICard';
import { SensorRoadmapCard } from './SensorRoadmapCard';
import { getAchievements } from './achievementRules';
import { getWeeklyChartData } from './selectors';
import { usePullupStore } from './store';
import { getStreak } from './dates';
import { getLevel } from './level';
import { useToast } from './useToast';

export default function App() {
  const totalReps = usePullupStore((s) => s.totalReps);
  const todayReps = usePullupStore((s) => s.todayReps);
  const dailyLog = usePullupStore((s) => s.dailyLog);
  const dailyGoal = usePullupStore((s) => s.settings.dailyGoal);
  const addReps = usePullupStore((s) => s.addReps);
  const pushToast = useToast((s) => s.pushToast);
  const [tab, setTab] = useState<'counter' | 'analytics' | 'awards' | 'sensor' | 'settings'>('counter');

  const weeklyData = useMemo(() => getWeeklyChartData(dailyLog), [dailyLog]);
  const weeklyTotal = weeklyData.reduce((sum, item) => sum + item.reps, 0);
  const streak = getStreak(dailyLog);
  const level = getLevel(totalReps);
  const achievements = getAchievements(totalReps, streak, weeklyTotal);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ToastViewport />

      <div className="mx-auto max-w-md space-y-4 px-4 pb-28 pt-5">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pull-Up Counter</h1>
            <p className="mt-1 text-sm text-slate-500">Gamified, mobile-first repetition tracker</p>
          </div>
          <div className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            Offline-ready
          </div>
        </header>

        <AvatarEvolution stage={level.stage} label={level.label} />

        <div className="grid grid-cols-2 gap-3">
          <KPICard icon={<Dumbbell className="h-5 w-5" />} title="Today" value={todayReps} hint={`Goal ${dailyGoal} reps`} />
          <KPICard icon={<Trophy className="h-5 w-5" />} title="Total" value={totalReps} hint={level.label} />
          <KPICard icon={<Flame className="h-5 w-5" />} title="Streak" value={`${streak} d`} hint="Consecutive active days" />
          <KPICard icon={<Activity className="h-5 w-5" />} title="Weekly" value={weeklyTotal} hint="Last 7 days" />
        </div>

        <DailyProgressCard todayReps={todayReps} dailyGoal={dailyGoal} />

        <div className="grid h-12 grid-cols-5 rounded-2xl bg-white p-1 shadow-soft">
          {['counter', 'analytics', 'awards', 'sensor', 'settings'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item as typeof tab)}
              className={`rounded-2xl text-xs font-medium ${tab === item ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
            >
              {item === 'awards' ? 'Awards' : item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'counter' && <CounterPanel />}
        {tab === 'analytics' && (
          <div className="space-y-4">
            <WeeklyTrendChart data={weeklyData} />
            <StreakHeatmap dailyLog={dailyLog} days={28} />
            <GroupedSessionHistoryCard />
          </div>
        )}
        {tab === 'awards' && <AchievementGrid achievements={achievements} />}
        {tab === 'sensor' && <SensorRoadmapCard />}
        {tab === 'settings' && (
          <div className="space-y-4">
            <SettingsPanel />
            <InstallPromptCard />
            <DataControlCard />
          </div>
        )}
      </div>

      <BottomActionBar
        levelLabel={level.label}
        onLogOne={async () => {
          await addReps(1);
          pushToast({ title: 'Added 1 rep', tone: 'success' });
        }}
      />
    </div>
  );
}
