import { motion } from 'framer-motion';

export function AvatarEvolution({ stage, label }: { stage: number; label: string }) {
  const scale = 1 + stage * 0.08;
  const shoulder = 58 + stage * 10;
  const arm = 12 + stage * 2;
  const chest = 36 + stage * 7;

  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800">
      <motion.div
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      >
        <svg width="190" height="220" viewBox="0 0 190 220" className="drop-shadow-2xl">
          <circle cx="95" cy="35" r="18" fill="#f8c9a0" />
          <rect x={95 - shoulder / 2} y="60" rx="18" ry="18" width={shoulder} height={chest} fill="#60a5fa" />
          <rect x={95 - shoulder / 2 - arm + 2} y="64" rx="8" width={arm} height="62" fill="#f8c9a0" />
          <rect x={95 + shoulder / 2 - 2} y="64" rx="8" width={arm} height="62" fill="#f8c9a0" />
          <rect x="78" y={60 + chest - 2} rx="8" width="16" height="68" fill="#1e293b" />
          <rect x="96" y={60 + chest - 2} rx="8" width="16" height="68" fill="#1e293b" />
        </svg>
      </motion.div>

      <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
        {label}
      </div>
    </div>
  );
}
