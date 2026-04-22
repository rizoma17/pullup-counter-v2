import type { Achievement } from './app';

export function getAchievements(totalReps: number, streak: number, weeklyTotal: number): Achievement[] {
  return [
    {
      key: 'first10',
      label: 'First 10',
      hint: 'Accumulate 10 total reps',
      unlocked: totalReps >= 10
    },
    {
      key: 'first50',
      label: 'First 50',
      hint: 'Accumulate 50 total reps',
      unlocked: totalReps >= 50
    },
    {
      key: 'weekly100',
      label: 'Weekly 100',
      hint: 'Reach 100 reps in 7 days',
      unlocked: weeklyTotal >= 100
    },
    {
      key: 'streak3',
      label: '3-Day Streak',
      hint: 'Train 3 consecutive days',
      unlocked: streak >= 3
    },
    {
      key: 'streak7',
      label: '7-Day Streak',
      hint: 'Train 7 consecutive days',
      unlocked: streak >= 7
    },
    {
      key: 'thousand',
      label: '1000 Club',
      hint: 'Accumulate 1000 total reps',
      unlocked: totalReps >= 1000
    }
  ];
}
