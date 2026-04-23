import type { Achievement } from './app';

export function getAchievements(totalReps: number, streak: number, weeklyTotal: number): Achievement[] {
  return [
    {
      key: 'first10',
      label: '初試身手',
      hint: '累積完成 10 下引體向上',
      unlocked: totalReps >= 10
    },
    {
      key: 'first50',
      label: '漸入佳境',
      hint: '累積完成 50 下引體向上',
      unlocked: totalReps >= 50
    },
    {
      key: 'weekly100',
      label: '本週破百',
      hint: '7 天內累積 100 下',
      unlocked: weeklyTotal >= 100
    },
    {
      key: 'streak3',
      label: '連練 3 天',
      hint: '連續 3 天都有訓練',
      unlocked: streak >= 3
    },
    {
      key: 'streak7',
      label: '連練 7 天',
      hint: '連續 7 天都有訓練',
      unlocked: streak >= 7
    },
    {
      key: 'thousand',
      label: '千下俱樂部',
      hint: '累積完成 1000 下',
      unlocked: totalReps >= 1000
    }
  ];
}
