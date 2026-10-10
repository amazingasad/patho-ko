'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff, X } from 'lucide-react';

interface ToastInput {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastContextValue {
  show: (toast: ToastInput) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { show: () => undefined, dismiss: () => undefined };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (toast: ToastInput) => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((list) => [...list.slice(-2), { ...toast, id }]);
      window.setTimeout(() => dismiss(id), 8000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 z-[70] flex flex-col items-center gap-2 px-4"
        style={{ bottom: 'calc(var(--nav-h) + env(safe-area-inset-bottom) + 0.75rem)' }}
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="glass-strong pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl py-2.5 pl-4 pr-2 will-change-transform"
              role="alert"
            >
              <WifiOff className="h-5 w-5 shrink-0 text-amber-gold" aria-hidden="true" />
              <p className="flex-1 text-sm text-zinc-100">{toast.message}</p>
              {toast.actionLabel && toast.onAction && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  className="tap rounded-xl bg-amber/20 px-4 text-sm font-semibold text-amber-gold"
                  onClick={() => {
                    toast.onAction?.();
                    dismiss(toast.id);
                  }}
                >
                  {toast.actionLabel}
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                aria-label="Dismiss"
                className="tap flex items-center justify-center rounded-xl text-zinc-400 hover:text-white"
                onClick={() => dismiss(toast.id)}
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
