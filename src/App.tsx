import { Activity, Dumbbell, Flame, Trophy, CheckCircle2 } from 'lucide-react';
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

function formatSavedTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function App() {
  const totalReps = usePullupStore((s) => s.totalReps);
  const todayReps = usePullupStore((s) => s.todayReps);
  const dailyLog = usePullupStore((s) => s.dailyLog);
  const dailyGoal = usePullupStore((s) => s.settings.dailyGoal);
  const lastSavedAt = usePullupStore((s) => s.lastSavedAt);
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
            <h1 className="text-2xl font-bold tracking-tight">引體向上計數器</h1>
            <p className="mt-1 text-sm text-slate-500">手機優先、遊戲化的訓練紀錄工具</p>
          </div>
          <div className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            離線可用
          </div>
        </header>

        <div className="flex items-center justify-between rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-soft">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">資料已自動儲存</span>
          </div>
          <span>最後儲存 {formatSavedTime(lastSavedAt)}</span>
        </div>

        <AvatarEvolution stage={level.stage} label={level.label} />

        <div className="grid grid-cols-2 gap-3">
          <KPICard icon={<Dumbbell className="h-5 w-5" />} title="今日" value={todayReps} hint={`目標 ${dailyGoal} 下`} />
          <KPICard icon={<Trophy className="h-5 w-5" />} title="總累積" value={totalReps} hint={level.label} />
          <KPICard icon={<Flame className="h-5 w-5" />} title="連續天數" value={`${streak} 天`} hint="連續有訓練的天數" />
          <KPICard icon={<Activity className="h-5 w-5" />} title="本週" value={weeklyTotal} hint="近 7 天總和" />
        </div>

        <DailyProgressCard todayReps={todayReps} dailyGoal={dailyGoal} />

        <div className="grid h-12 grid-cols-5 rounded-2xl bg-white p-1 shadow-soft">
          {[
            ['counter', '計數'],
            ['analytics', '分析'],
            ['awards', '成就'],
            ['sensor', '感測'],
            ['settings', '設定']
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
          pushToast({ title: '已新增 1 下，並儲存到此裝置', tone: 'success' });
        }}
      />
    </div>
  );
}
