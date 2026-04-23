import type { AppState } from './app';
import { formatDate } from './dates';

export const STORAGE_KEY = 'pullup-counter-v1';

export function createInitialState(): AppState {
  return {
    totalReps: 0,
    todayReps: 0,
    lastTrackedDate: formatDate(new Date()),
    lastSavedAt: Date.now(),
    dailyLog: {},
    settings: {
      dailyGoal: 30,
      vibrationEnabled: true,
      soundEnabled: false,
      sensorMode: 'manual'
    }
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    const parsed = JSON.parse(raw) as Partial<AppState>;
    const initial = createInitialState();

    return {
      ...initial,
      ...parsed,
      settings: {
        ...initial.settings,
        ...parsed.settings
      },
      lastSavedAt: parsed.lastSavedAt ?? Date.now()
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
