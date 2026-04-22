import type { PoseFrame, RepState } from './sensorTypes';

type RepMachineContext = {
  state: RepState;
  lastTopTimestamp?: number;
};

export function evaluateRep(
  frame: PoseFrame,
  ctx: RepMachineContext
): { next: RepMachineContext; repDelta: number } {
  const chinAboveBar = typeof frame.chinY === 'number' && frame.chinY < 120;
  const armsBent =
    (frame.leftElbowAngle ?? 180) < 95 ||
    (frame.rightElbowAngle ?? 180) < 95;
  const armsExtended =
    (frame.leftElbowAngle ?? 0) > 150 &&
    (frame.rightElbowAngle ?? 0) > 150;

  if (ctx.state === 'idle' && armsBent) {
    return { next: { ...ctx, state: 'pulling' }, repDelta: 0 };
  }

  if (ctx.state === 'pulling' && chinAboveBar) {
    return {
      next: { ...ctx, state: 'top', lastTopTimestamp: frame.timestamp },
      repDelta: 0
    };
  }

  if (ctx.state === 'top' && !chinAboveBar) {
    return { next: { ...ctx, state: 'descending' }, repDelta: 0 };
  }

  if (ctx.state === 'descending' && armsExtended) {
    return { next: { state: 'idle' }, repDelta: 1 };
  }

  return { next: ctx, repDelta: 0 };
}
