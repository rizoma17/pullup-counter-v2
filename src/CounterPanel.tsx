import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { usePullupStore } from './store';
import { useToast } from './useToast';

export function CounterPanel() {
  const addReps = usePullupStore((s) => s.addReps);
  const removeRep = usePullupStore((s) => s.removeRep);
  const pushToast = useToast((s) => s.pushToast);
  const [customInput, setCustomInput] = useState('');

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <div className="grid grid-cols-3 gap-3">
        {[1, 5, 10].map((n) => (
          <button
            key={n}
            type="button"
            className="h-14 rounded-2xl bg-slate-900 text-lg font-semibold text-white"
            onClick={async () => {
              await addReps(n);
              pushToast({ title: `已新增 ${n} 下，並儲存到此裝置`, tone: 'success' });
            }}
          >
            +{n}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
        <input
          inputMode="numeric"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="自訂次數"
          className="h-12 rounded-2xl border border-slate-200 px-4 outline-none"
        />
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"
          onClick={async () => {
            const value = Number(customInput);
            if (!value) return;
            await addReps(value);
            setCustomInput('');
            pushToast({ title: `已新增 ${value} 下，並儲存到此裝置`, tone: 'success' });
          }}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200"
          onClick={() => {
            removeRep();
            pushToast({ title: '已減少 1 下，並更新儲存資料', tone: 'default' });
          }}
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
