import type { LevelInfo } from './app';

export function getLevel(totalReps: number): LevelInfo {
  if (totalReps >= 1500) return { label: '菁英', stage: 5 };
  if (totalReps >= 800) return { label: '猛者', stage: 4 };
  if (totalReps >= 400) return { label: '高手', stage: 3 };
  if (totalReps >= 150) return { label: '進階', stage: 2 };
  if (totalReps >= 50) return { label: '入門', stage: 1 };
  return { label: '新手', stage: 0 };
}
