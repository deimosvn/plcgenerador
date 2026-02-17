// ─────────────────────────────────────────────────────────────
// Hook: useToast — Sistema de notificaciones
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = `toast-${++counterRef.current}`;
    const toast: ToastItem = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg: string) => addToast(msg, 'error', 6000), [addToast]);
  const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);
  const warning = useCallback((msg: string) => addToast(msg, 'warning', 5000), [addToast]);

  return { toasts, addToast, removeToast, success, error, info, warning };
}
