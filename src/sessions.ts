import type { DailyRecord, TrainingSession } from './app';

export type SessionGroup = {
  date: string;
  totalReps: number;
  items: TrainingSession[];
};

export function groupSessionsByDate(
  sessions: TrainingSession[],
  dailyLog: Record<string, DailyRecord> = {}
): SessionGroup[] {
  const map = new Map<string, TrainingSession[]>();

  for (const session of sessions) {
    const current = map.get(session.date) ?? [];
    current.push(session);
    map.set(session.date, current);
  }

  const dates = new Set([...Object.keys(dailyLog), ...map.keys()]);

  return [...dates]
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const items = (map.get(date) ?? []).sort((a, b) => b.createdAt - a.createdAt);
      return {
        date,
        // Daily totals include manual corrections and imported aggregate records.
        totalReps: dailyLog[date]?.reps ?? items.reduce((sum, item) => sum + item.reps, 0),
        items
      };
    });
}
