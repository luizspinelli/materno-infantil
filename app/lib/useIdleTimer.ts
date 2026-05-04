"use client";

import { useEffect, useRef } from "react";

const EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "pointermove",
  "keydown",
  "touchstart",
  "wheel",
];

export function useIdleTimer(timeoutMs: number, onIdle: () => void, enabled: boolean) {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const reset = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      if (timer) clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeoutMs, enabled]);
}
