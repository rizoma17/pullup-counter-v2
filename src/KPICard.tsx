import type { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  value: string | number;
  hint: string;
};

export function KPICard({ icon, title, value, hint }: Props) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-2">{icon}</div>
      </div>
    </div>
  );
}
