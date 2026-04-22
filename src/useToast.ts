import { create } from 'zustand';

export type ToastItem = {
  id: string;
  title: string;
  tone?: 'default' | 'success' | 'error';
};

type ToastStore = {
  toasts: ToastItem[];
  pushToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [...state.toasts, { id, ...toast }]
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id)
      }));
    }, 2200);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id)
    }));
  }
}));
