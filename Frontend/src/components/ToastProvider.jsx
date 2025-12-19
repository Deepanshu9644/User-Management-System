import React, { createContext, useContext, useMemo, useState } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(() => {
    const push = (t) => {
      const id = crypto?.randomUUID?.() || String(Date.now() + Math.random());
      const toast = { id, title: t.title || 'Notice', message: t.message || '', tone: t.tone || 'info' };
      setToasts((prev) => [toast, ...prev].slice(0, 5));
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), t.ttl || 2800);
    };

    return {
      success: (message, title = 'Success') => push({ title, message, tone: 'success' }),
      error: (message, title = 'Error') => push({ title, message, tone: 'danger' }),
      info: (message, title = 'Info') => push({ title, message, tone: 'info' })
    };
  }, []);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toastHost">
        {toasts.map((t) => (
          <div key={t.id} className="toast" role="status" aria-live="polite">
            <div className="toastTitle">{t.title}</div>
            <div className="toastMsg">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
