import type { LevelInfo } from './app';

export function getLevel(totalReps: number): LevelInfo {
  if (totalReps >= 1500) return { label: 'Elite', stage: 5 };
  if (totalReps >= 800) return { label: 'Beast', stage: 4 };
  if (totalReps >= 400) return { label: 'Advanced', stage: 3 };
  if (totalReps >= 150) return { label: 'Intermediate', stage: 2 };
  if (totalReps >= 50) return { label: 'Rookie', stage: 1 };
  return { label: 'Starter', stage: 0 };
}
