type Props = {
  levelLabel: string;
  onLogOne: () => void | Promise<void>;
};

export function BottomActionBar({ levelLabel, onLogOne }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs text-slate-500">目前等級</p>
          <p className="font-semibold text-slate-900">{levelLabel}</p>
        </div>
        <button
          type="button"
          className="h-12 rounded-2xl bg-slate-900 px-6 font-semibold text-white"
          onClick={() => void onLogOne()}
        >
          記錄 1 下
        </button>
      </div>
    </div>
  );
}
