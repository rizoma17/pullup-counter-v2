import { useToast } from './useToast';
import { useInstallPrompt } from './useInstallPrompt';

export function InstallPromptCard() {
  const { isInstallable, install } = useInstallPrompt();
  const pushToast = useToast((s) => s.pushToast);

  if (!isInstallable) {
    return (
      <div className="rounded-3xl bg-white p-4 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Install App</h2>
        <p className="mt-2 text-sm text-slate-500">
          When supported by the browser, an install prompt will appear here so the app can be added to the home screen.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft">
      <h2 className="text-lg font-semibold text-slate-900">Install App</h2>
      <p className="mt-2 text-sm text-slate-500">
        Install this app for faster launch, full-screen experience, and better gym usability.
      </p>
      <button
        type="button"
        className="mt-4 h-12 rounded-2xl bg-slate-900 px-4 font-medium text-white"
        onClick={async () => {
          const ok = await install();
          pushToast({ title: ok ? 'App installed' : 'Install dismissed', tone: ok ? 'success' : 'default' });
        }}
      >
        Install PWA
      </button>
    </div>
  );
}
