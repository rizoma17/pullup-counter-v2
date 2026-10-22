import type { LevelInfo } from './app';

export const REPS_PER_LEVEL = 200;
const LEVEL_LABELS: LevelInfo['label'][] = ['新手', '入門', '進階', '高手', '猛者', '菁英'];

export function getLevel(totalReps: number): LevelInfo {
  const stage = Math.floor(Math.max(0, totalReps) / REPS_PER_LEVEL);
  return { label: LEVEL_LABELS[Math.min(stage, LEVEL_LABELS.length - 1)], stage };
}

export function getLevelProgress(totalReps: number) {
  const progressReps = Math.max(0, totalReps) % REPS_PER_LEVEL;
  return { percent: progressReps / REPS_PER_LEVEL * 100, remaining: REPS_PER_LEVEL - progressReps };
}
