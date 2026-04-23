import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function WeeklyTrendChart({ data }: { data: Array<{ date: string; reps: number }> }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">每週趨勢</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} 下`, '次數']} />
            <Line type="monotone" dataKey="reps" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
