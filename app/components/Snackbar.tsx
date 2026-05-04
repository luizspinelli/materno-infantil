"use client";

import { useEffect } from "react";

type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  durationMs?: number;
};

export function Snackbar({
  message,
  actionLabel,
  onAction,
  onDismiss,
  durationMs = 5000,
}: Props) {
  useEffect(() => {
    const id = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] w-[min(92vw,420px)] animate-fade-in"
    >
      <div className="flex items-center gap-3 rounded-xl bg-slate-800 text-white shadow-2xl px-4 py-3">
        <span className="flex-1 text-sm">{message}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={() => {
              onAction();
              onDismiss();
            }}
            className="text-sm font-bold uppercase tracking-wide text-emerald-300 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded px-2 py-1"
          >
            {actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
