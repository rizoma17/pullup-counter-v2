import type { Achievement } from './app';

export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">成就徽章</h2>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((item) => (
          <div
            key={item.key}
            className={`rounded-2xl border p-3 ${
              item.unlocked ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            <p className="font-semibold">{item.label}</p>
            <p className="mt-1 text-xs opacity-80">{item.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
