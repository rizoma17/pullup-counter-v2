import { create } from 'zustand';
import type { AppState, SensorMode, TrainingSession } from './app';
import { formatDate } from './dates';
import { createInitialState, loadState, saveState } from './storage';
import { vibrate } from './vibration';
import { addSession, clearSessions } from './db';

type PullupStore = AppState & {
  addReps: (count: number, source?: TrainingSession['source']) => Promise<void>;
  removeRep: () => void;
  resetAll: () => Promise<void>;
  importData: (payload: AppState) => void;
  setSensorMode: (mode: SensorMode) => void;
  setDailyGoal: (goal: number) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
};

const today = () => formatDate(new Date());

export const usePullupStore = create<PullupStore>((set, get) => ({
  ...loadState(),

  addReps: async (count, source = 'manual') => {
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
      todayReps: state.lastTrackedDate === currentDate ? state.todayReps + count : count,
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
      source
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
      todayReps: Math.max(state.todayReps - 1, 0),
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

  resetAll: async () => {
    const nextState = createInitialState();
    saveState(nextState);
    set(nextState);
    await clearSessions();
  },

  importData: (payload) => {
    const nextState = {
      ...payload,
      lastSavedAt: Date.now()
    };
    saveState(nextState);
    set(nextState);
  },

  setSensorMode: (mode) => {
    const state = get();
    const nextState: AppState = {
      ...state,
      lastSavedAt: Date.now(),
      settings: {
        ...state.settings,
        sensorMode: mode
      }
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
