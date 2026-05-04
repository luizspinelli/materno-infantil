"use client";

import type { Alimento } from "../lib/foods";
import { PlateZone } from "./PlateZone";

type Props = {
  alimentos: Alimento[];
  onAlimentoClick?: (alimento: Alimento) => void;
};

export function Pot({ alimentos, onAlimentoClick }: Props) {
  return (
    <div className="relative h-full w-full" style={{ aspectRatio: "1 / 1" }}>
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full drop-shadow-lg"
        aria-hidden
      >
        <ellipse cx="300" cy="320" rx="285" ry="280" fill="#000" opacity="0.08" />
        <circle cx="300" cy="300" r="290" fill="#fef9f3" stroke="#e7d5b8" strokeWidth="2" />
        <circle cx="300" cy="300" r="278" fill="#ffffff" stroke="#e7d5b8" strokeWidth="1" />
        <defs>
          <radialGradient id="potGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </radialGradient>
        </defs>
        <circle
          cx="300"
          cy="300"
          r="260"
          fill="url(#potGrad)"
          stroke="#cbd5e1"
          strokeWidth="3"
        />
        <ellipse cx="170" cy="160" rx="55" ry="22" fill="#ffffff" opacity="0.7" />
      </svg>

      <div className="absolute inset-[8%]">
        <PlateZone zona="frutas" alimentos={alimentos} onAlimentoClick={onAlimentoClick} />
      </div>
    </div>
  );
}
