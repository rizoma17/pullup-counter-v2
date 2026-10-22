import { motion } from 'framer-motion';
import { getLevelProgress } from './level';

export function AvatarEvolution({ stage, label, totalReps = 0 }: { stage: number; label: string; totalReps?: number }) {
  const visualStage = Math.min(stage, 5);
  const progress = getLevelProgress(totalReps);
  const scale = 1 + visualStage * 0.08;
  const shoulder = 58 + visualStage * 10;
  const arm = 12 + visualStage * 2;
  const chest = 36 + visualStage * 7;

  return (
    <div className="relative flex h-20 items-center gap-3 px-3 overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800">
      <motion.div
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      >
        <svg width="60" height="70" viewBox="0 0 190 220" className="drop-shadow-2xl">
          <circle cx="95" cy="35" r="18" fill="#f8c9a0" />
          <rect x={95 - shoulder / 2} y="60" rx="18" ry="18" width={shoulder} height={chest} fill="#60a5fa" />
          <rect x={95 - shoulder / 2 - arm + 2} y="64" rx="8" width={arm} height="62" fill="#f8c9a0" />
          <rect x={95 + shoulder / 2 - 2} y="64" rx="8" width={arm} height="62" fill="#f8c9a0" />
          <rect x="78" y={60 + chest - 2} rx="8" width="16" height="68" fill="#1e293b" />
          <rect x="96" y={60 + chest - 2} rx="8" width="16" height="68" fill="#1e293b" />
        </svg>
      </motion.div>

      <div className="min-w-0 flex-1 text-white">
        <div className="flex items-center justify-between text-sm"><span className="font-semibold">{label} · Lv.{stage + 1}</span><span className="text-xs text-slate-300">累積 {totalReps} 下</span></div>
        <div className="my-2 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-blue-400" style={{ width: `${progress.percent}%` }} /></div>
        <p className="text-xs text-slate-300">{`距離下一級還有 ${progress.remaining} 下`}</p>
      </div>
    </div>
  );
}
