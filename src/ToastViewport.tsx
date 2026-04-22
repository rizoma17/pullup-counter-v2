import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from './useToast';

export function ToastViewport() {
  const toasts = useToast((s) => s.toasts);
  const removeToast = useToast((s) => s.removeToast);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex max-w-md flex-col gap-2 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto rounded-2xl px-4 py-3 text-left shadow-soft ${
              toast.tone === 'success'
                ? 'bg-emerald-600 text-white'
                : toast.tone === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-white'
            }`}
          >
            <p className="text-sm font-medium">{toast.title}</p>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
