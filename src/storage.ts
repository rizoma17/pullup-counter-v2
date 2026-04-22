import type { AppState } from './app';
import { formatDate } from './dates';

export const STORAGE_KEY = 'pullup-counter-v1';

export function createInitialState(): AppState {
  return {
    totalReps: 0,
    todayReps: 0,
    lastTrackedDate: formatDate(new Date()),
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
    return JSON.parse(raw) as AppState;
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
