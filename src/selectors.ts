import { getPastNDays, getWeekdayLabel } from './dates';

export function getWeeklyChartData(dailyLog: Record<string, { reps: number }>) {
  return getPastNDays(7).map((date) => ({
    date: getWeekdayLabel(date),
    reps: dailyLog[date]?.reps ?? 0
  }));
}
