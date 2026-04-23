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
  lastSavedAt: number;
  dailyLog: Record<string, DailyRecord>;
  settings: AppSettings;
};

export type LevelInfo = {
  label: '新手' | '入門' | '進階' | '高手' | '猛者' | '菁英';
  stage: number;
};

export type TrainingSession = {
  id: string;
  date: string;
  reps: number;
  createdAt: number;
  source: 'manual' | 'import' | 'camera';
};
