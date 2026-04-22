import type { TrainingSession } from './app';

export type SessionGroup = {
  date: string;
  totalReps: number;
  items: TrainingSession[];
};

export function groupSessionsByDate(sessions: TrainingSession[]): SessionGroup[] {
  const map = new Map<string, TrainingSession[]>();

  for (const session of sessions) {
    const current = map.get(session.date) ?? [];
    current.push(session);
    map.set(session.date, current);
  }

  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({
      date,
      items: items.sort((a, b) => b.createdAt - a.createdAt),
      totalReps: items.reduce((sum, item) => sum + item.reps, 0)
    }));
}
