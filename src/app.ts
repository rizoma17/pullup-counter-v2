export type SensorMode = 'manual' | 'camera';

export type DailyRecord = {
  date: string;
  reps: number;
  sessions: number;
};

export type AchievementKey =
  | 'first10'
  | 'first50'
  | 'weekly100'
  | 'streak3'
  | 'streak7'
  | 'thousand';

export type Achievement = {
  key: AchievementKey;
  label: string;
  hint: string;
  unlocked: boolean;
};

export type AppSettings = {
  dailyGoal: number;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  sensorMode: SensorMode;
};

export type AppState = {
  totalReps: number;
  todayReps: number;
  lastTrackedDate: string;
  dailyLog: Record<string, DailyRecord>;
  settings: AppSettings;
};

export type LevelInfo = {
  label: 'Starter' | 'Rookie' | 'Intermediate' | 'Advanced' | 'Beast' | 'Elite';
  stage: number;
};

export type TrainingSession = {
  id: string;
  date: string;
  reps: number;
  createdAt: number;
  source: 'manual' | 'import' | 'camera';
};
