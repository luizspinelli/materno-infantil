"use client";

import { useEffect, useState } from "react";

type Props = {
  totalSeconds: number;
  onContinue: () => void;
};

export function IdleWarning({ totalSeconds, onContinue }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [totalSeconds]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center flex flex-col items-center gap-3">
        <span className="text-4xl" aria-hidden>
          ⏳
        </span>
        <h3 className="text-lg font-bold text-slate-800">Ainda está aí?</h3>
        <p className="text-sm text-slate-600">
          Voltando à tela inicial em{" "}
          <strong className="text-emerald-700 text-base">{secondsLeft}s</strong>
          .
        </p>
        <button
          onClick={onContinue}
          className="mt-2 w-full rounded-xl bg-emerald-600 px-6 py-3 text-base font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-transform"
        >
          Continuar jogando
        </button>
      </div>
    </div>
  );
}
