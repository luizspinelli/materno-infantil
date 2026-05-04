"use client";

import { useEffect, useRef } from "react";

const EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "pointermove",
  "keydown",
  "touchstart",
  "wheel",
];

type Options = {
  warningMs?: number;
  onWarning?: () => void;
  onActive?: () => void;
};

export function useIdleTimer(
  timeoutMs: number,
  onIdle: () => void,
  enabled: boolean,
  options?: Options
) {
  const onIdleRef = useRef(onIdle);
  const optionsRef = useRef(options);
  onIdleRef.current = onIdle;
  optionsRef.current = options;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let warningTimer: ReturnType<typeof setTimeout> | undefined;

    const reset = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (warningTimer) clearTimeout(warningTimer);
      const opts = optionsRef.current;
      opts?.onActive?.();
      if (opts?.warningMs && opts.warningMs < timeoutMs && opts.onWarning) {
        warningTimer = setTimeout(() => {
          optionsRef.current?.onWarning?.();
        }, timeoutMs - opts.warningMs);
      }
      idleTimer = setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (warningTimer) clearTimeout(warningTimer);
      EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeoutMs, enabled]);
}
