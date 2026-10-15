import { create } from 'zustand';
import type { AppState } from './app';
import { formatDate } from './dates';
import { createInitialState, loadState, normalizeState, saveState } from './storage';
import { vibrate } from './vibration';
import { addSession, clearSessions } from './db';

type PullupStore = AppState & {
  addReps: (count: number) => Promise<void>;
  removeRep: () => void;
  syncToday: () => void;
  resetToday: () => void;
  resetAll: () => Promise<void>;
  importData: (payload: AppState) => void;
  setDailyGoal: (goal: number) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
};

const today = () => formatDate(new Date());

export const usePullupStore = create<PullupStore>((set, get) => ({
  ...loadState(),

  addReps: async (count) => {
    if (count <= 0) return;

    const state = get();
    const currentDate = today();
    const existing = state.dailyLog[currentDate];

    if (state.settings.vibrationEnabled) {
      vibrate(18);
    }

    const nextState: AppState = {
      ...state,
      totalReps: state.totalReps + count,
      todayReps: (existing?.reps ?? 0) + count,
      lastTrackedDate: currentDate,
      lastSavedAt: Date.now(),
      dailyLog: {
        ...state.dailyLog,
        [currentDate]: {
          date: currentDate,
          reps: (existing?.reps ?? 0) + count,
          sessions: (existing?.sessions ?? 0) + 1
        }
      }
    };

    saveState(nextState);
    set(nextState);

    await addSession({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: currentDate,
      reps: count,
      createdAt: Date.now(),
      source: 'manual'
    });
  },

  removeRep: () => {
    const state = get();
    const currentDate = today();
    const current = state.dailyLog[currentDate];

    if (!current || current.reps <= 0 || state.totalReps <= 0) return;

    const nextReps = Math.max(current.reps - 1, 0);

    const nextState: AppState = {
      ...state,
      totalReps: Math.max(state.totalReps - 1, 0),
      todayReps: nextReps,
      lastTrackedDate: currentDate,
      lastSavedAt: Date.now(),
      dailyLog: {
        ...state.dailyLog,
        [currentDate]: {
          ...current,
          reps: nextReps,
          sessions: current.sessions
        }
      }
    };

    saveState(nextState);
    set(nextState);
  },

  syncToday: () => {
    const state = get();
    const currentDate = today();
    const todayReps = state.dailyLog[currentDate]?.reps ?? 0;
    if (state.lastTrackedDate === currentDate && state.todayReps === todayReps) return;
    const nextState = { ...state, todayReps, lastTrackedDate: currentDate };
    saveState(nextState);
    set(nextState);
  },

  resetToday: () => {
    const state = get();
    const currentDate = today();
    // Keep a zero aggregate as the authoritative correction, preserving the audit history.
    const nextState = {
      ...state,
      totalReps: Math.max(0, state.totalReps - (state.dailyLog[currentDate]?.reps ?? 0)),
      todayReps: 0,
      lastTrackedDate: currentDate,
      lastSavedAt: Date.now(),
      dailyLog: { ...state.dailyLog, [currentDate]: { date: currentDate, reps: 0, sessions: 0 } }
    };
    saveState(nextState);
    set(nextState);
  },

  resetAll: async () => {
    const nextState = createInitialState();
    saveState(nextState);
    set(nextState);
    await clearSessions();
  },

  importData: (payload) => {
    const nextState = {
      ...normalizeState(payload),
      lastSavedAt: Date.now()
    };
    saveState(nextState);
    set(nextState);
  },

  setDailyGoal: (goal) => {
    const state = get();
    const nextState: AppState = {
      ...state,
      lastSavedAt: Date.now(),
      settings: {
        ...state.settings,
        dailyGoal: goal
      }
    };
    saveState(nextState);
    set(nextState);
  },

  setVibrationEnabled: (enabled) => {
    const state = get();
    const nextState: AppState = {
      ...state,
      lastSavedAt: Date.now(),
      settings: {
        ...state.settings,
        vibrationEnabled: enabled
      }
    };
    saveState(nextState);
    set(nextState);
  },

  setSoundEnabled: (enabled) => {
    const state = get();
    const nextState: AppState = {
      ...state,
      lastSavedAt: Date.now(),
      settings: {
        ...state.settings,
        soundEnabled: enabled
      }
    };
    saveState(nextState);
    set(nextState);
  }
}));
