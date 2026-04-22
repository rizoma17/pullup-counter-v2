import type { PoseEngineAdapter, PoseFrame } from './sensorTypes';

export class PlaceholderPoseAdapter implements PoseEngineAdapter {
  async init(): Promise<void> {
    return Promise.resolve();
  }

  async start(onFrame: (frame: PoseFrame) => void): Promise<void> {
    console.info('Pose adapter placeholder started');
    onFrame({ timestamp: Date.now() });
  }

  async stop(): Promise<void> {
    console.info('Pose adapter placeholder stopped');
  }
}
