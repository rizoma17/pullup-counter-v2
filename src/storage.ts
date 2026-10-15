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
      soundEnabled: false
    }
  };
}

export function normalizeState(state: Partial<AppState>): AppState {
  const initial = createInitialState();

  return {
    ...initial,
    ...state,
    todayReps: state.dailyLog?.[initial.lastTrackedDate]?.reps ?? 0,
    lastTrackedDate: initial.lastTrackedDate,
    // Retain supported settings when loading older saved data or JSON backups.
    settings: {
      dailyGoal: state.settings?.dailyGoal ?? initial.settings.dailyGoal,
      vibrationEnabled: state.settings?.vibrationEnabled ?? initial.settings.vibrationEnabled,
      soundEnabled: state.settings?.soundEnabled ?? initial.settings.soundEnabled
    },
    lastSavedAt: state.lastSavedAt ?? initial.lastSavedAt
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    return normalizeState(JSON.parse(raw) as Partial<AppState>);
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
