export type PoseFrame = {
  timestamp: number;
  chinY?: number;
  leftElbowAngle?: number;
  rightElbowAngle?: number;
  shoulderCenterY?: number;
};

export type RepState = 'idle' | 'pulling' | 'top' | 'descending';

export type RepDetectionResult = {
  repCountDelta: number;
  state: RepState;
  confidence: number;
};

export interface PoseEngineAdapter {
  init(): Promise<void>;
  start(onFrame: (frame: PoseFrame) => void): Promise<void>;
  stop(): Promise<void>;
}
