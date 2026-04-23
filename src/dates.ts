export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getPastNDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(formatDate(d));
  }

  return out;
}

export function getWeekdayLabel(dateString: string): string {
  const d = new Date(dateString);
  return ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
}

export function getStreak(dailyLog: Record<string, { reps: number }>): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDate(d);

    if ((dailyLog[key]?.reps ?? 0) > 0) {
      streak += 1;
      continue;
    }

    if (i === 0) {
      continue;
    }

    break;
  }

  return streak;
}
