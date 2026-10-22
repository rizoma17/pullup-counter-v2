import { useEffect, useId, useRef } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { getLevelProgress } from './level';

const UNIFORMS = [
  { light: '#93c5fd', main: '#3b82f6', dark: '#1e40af', accent: '#bfdbfe' },
  { light: '#67e8f9', main: '#0891b2', dark: '#155e75', accent: '#a5f3fc' },
  { light: '#6ee7b7', main: '#059669', dark: '#065f46', accent: '#a7f3d0' },
  { light: '#c4b5fd', main: '#8b5cf6', dark: '#5b21b6', accent: '#ddd6fe' },
  { light: '#fda4af', main: '#e11d48', dark: '#9f1239', accent: '#fecdd3' },
  { light: '#fcd34d', main: '#d97706', dark: '#92400e', accent: '#fde68a' }
];

export function AvatarEvolution({ stage, label, totalReps = 0 }: { stage: number; label: string; totalReps?: number }) {
  const uniform = UNIFORMS[Math.min(Math.max(stage, 0), UNIFORMS.length - 1)];
  const progress = getLevelProgress(totalReps);
  const id = useId();
  const athlete = useAnimationControls();
  const glow = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const previous = useRef({ stage, totalReps });

  useEffect(() => {
    if (!reducedMotion) {
      if (totalReps > previous.current.totalReps) {
        void athlete.start({ y: [0, -3, 0], scale: [1, 1.035, 1], transition: { duration: 0.35 } });
      }
      if (stage > previous.current.stage) {
        void glow.start({ opacity: [0, 0.65, 0], scale: [0.85, 1.15, 1.25], transition: { duration: 0.9 } });
      }
    }
    previous.current = { stage, totalReps };
  }, [stage, totalReps, athlete, glow, reducedMotion]);

  return (
    <section aria-label="運動員等級" className="relative flex h-20 items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-3">
      <div className="relative h-[72px] w-16 shrink-0 self-end">
        <motion.div aria-hidden="true" initial={{ opacity: 0 }} animate={glow} className="absolute inset-0 rounded-full blur-md" style={{ backgroundColor: uniform.accent }} />
        <motion.svg aria-hidden="true" focusable="false" width="64" height="72" viewBox="0 0 96 108" animate={athlete} className="relative">
          <defs>
            <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#f6d5b6" /><stop offset="0.55" stopColor="#eab58e" /><stop offset="1" stopColor="#c78968" />
            </linearGradient>
            <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor={uniform.light} /><stop offset="0.4" stopColor={uniform.main} /><stop offset="1" stopColor={uniform.dark} />
            </linearGradient>
            <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#475569" /><stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <circle cx="48" cy="53" r="37" fill={uniform.main} opacity="0.1" />
          <path d="M15 52a34 34 0 0 1 56-26" fill="none" stroke={uniform.accent} strokeOpacity="0.24" strokeWidth="1" />
          {/* Sculpted shoulders and arms, with a fixed silhouette at every level. */}
          <path d="M34 59C22 60 14 66 11 78L7 105Q14 111 22 106L28 83H68L74 106Q82 111 89 105L85 78C82 66 74 60 62 59Z" fill={`url(#${id}-skin)`} />
          <path d="M20 78Q16 87 16 99M76 78Q80 87 80 99" fill="none" stroke="#ba7e60" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 66Q29 62 34 62M62 62Q69 63 72 67" fill="none" stroke="#ffe5c9" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 48V59L33 63Q48 78 63 63L57 59V48" fill={`url(#${id}-skin)`} />
          <path d="M39 50Q48 59 57 50V56Q48 64 39 55Z" fill="#b97859" opacity="0.4" />
          {/* Racerback-inspired tank, neckline piping, seams and chest insignia. */}
          <path d="M31 61L37 59Q39 70 48 70Q57 70 59 59L65 61L68 77L73 108H23L28 77Z" fill={`url(#${id}-shirt)`} />
          <path d="M37 60Q39 71 48 71Q57 71 59 60M31 63L28 77M65 63L68 77" fill="none" stroke={uniform.accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M30 81L26 108M66 81L70 108" fill="none" stroke={uniform.dark} strokeOpacity="0.6" strokeWidth="2" />
          <path d="M38 81Q48 85 58 81M40 97Q48 95 56 97" fill="none" stroke={uniform.light} strokeOpacity="0.3" strokeLinecap="round" />
          <path d="M56 77h7l-1 6-2.5 2L57 83Z" fill={uniform.accent} />
          <path d="m58 80 1.5 1.5 2-2.5" fill="none" stroke={uniform.dark} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          {/* Ears, face, swept hair and a calm, confident expression. */}
          <ellipse cx="32" cy="36" rx="4" ry="6" fill="#dca17e" />
          <ellipse cx="64" cy="36" rx="4" ry="6" fill="#dca17e" />
          <path d="M32 25Q32 11 48 11Q64 11 64 25L62 43Q59 55 48 57Q37 55 34 43Z" fill={`url(#${id}-skin)`} />
          <path d="M58 29Q62 39 58 46Q54 52 48 54Q57 55 62 43L64 28Z" fill="#c88c6a" opacity="0.4" />
          <path d="M31 35L29 25Q27 14 37 9Q49 2 61 11Q69 12 67 24L64 35L61 25Q50 27 41 19Q38 27 34 28L34 35Z" fill={`url(#${id}-hair)`} />
          <path d="M34 19Q43 10 56 15M41 12Q49 9 58 14" fill="none" stroke="#64748b" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m37 33 7-1m8 0 7 1" stroke="#513c35" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="41" cy="37" rx="1.4" ry="1.7" fill="#263443" />
          <ellipse cx="55" cy="37" rx="1.4" ry="1.7" fill="#263443" />
          <path d="m48 37-1 6 3 0" fill="none" stroke="#bf8263" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M43 47Q48 50 53 47" fill="none" stroke="#975e50" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M43 52Q48 54 53 52" fill="none" stroke="#b47d63" strokeOpacity="0.35" strokeLinecap="round" />
          {/* Rank badge stays readable without enlarging the athlete. */}
          <circle cx="77" cy="91" r="12" fill="#0f172a" stroke={uniform.accent} strokeWidth="1.5" />
          <path d="m77 83 2.3 4.7 5.2.7-3.7 3.7.8 5.2-4.6-2.5-4.6 2.5.8-5.2-3.7-3.7 5.2-.7Z" fill={uniform.accent} />
          {stage >= 2 && <circle cx="77" cy="91" r="3" fill={uniform.dark} />}
          {stage >= 4 && <path d="m75 91 1.4 1.4L79 89" fill="none" stroke={uniform.accent} strokeWidth="1.1" strokeLinecap="round" />}
        </motion.svg>
      </div>
      <div className="relative min-w-0 flex-1 text-white">
        <div className="flex flex-wrap items-center justify-between gap-x-2 text-sm">
          <span className="font-semibold">{label} · Lv.{stage + 1}</span>
          <span className="text-xs tabular-nums text-slate-300">累積 {totalReps} 下</span>
        </div>
        <div role="progressbar" aria-label="本級進度" aria-valuemin={0} aria-valuemax={200} aria-valuenow={200 - progress.remaining} className="my-2 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full" style={{ width: `${progress.percent}%`, backgroundColor: uniform.accent }} />
        </div>
        <p className="text-xs text-slate-300">{`距離下一級還有 ${progress.remaining} 下`}</p>
      </div>
    </section>
  );
}
