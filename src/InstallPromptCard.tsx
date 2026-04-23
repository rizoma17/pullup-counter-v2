import { useToast } from './useToast';
import { useInstallPrompt } from './useInstallPrompt';

export function InstallPromptCard() {
  const { isInstallable, install } = useInstallPrompt();
  const pushToast = useToast((s) => s.pushToast);

  if (!isInstallable) {
    return (
      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">安裝到手機主畫面</h2>
        <p className="mt-2 text-sm text-slate-500">
          若瀏覽器支援，這裡會顯示安裝按鈕。安裝後會更像 App，開啟也更方便。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-900">安裝到手機主畫面</h2>
      <p className="mt-2 text-sm text-slate-500">安裝後可更快開啟、全螢幕顯示，健身時使用更順手。</p>
      <button
        type="button"
        className="mt-4 h-12 rounded-2xl bg-slate-900 px-4 font-medium text-white"
        onClick={async () => {
          const ok = await install();
          pushToast({ title: ok ? '已開始安裝 App' : '已取消安裝', tone: ok ? 'success' : 'default' });
        }}
      >
        安裝 App
      </button>
    </div>
  );
}
