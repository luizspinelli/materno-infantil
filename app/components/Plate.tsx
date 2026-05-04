"use client";

import type { Alimento, Categoria } from "../lib/foods";
import { PlateZone } from "./PlateZone";

type Props = {
  alimentosPorZona: Pick<
    Record<Categoria, Alimento[]>,
    "cereais" | "feijoes" | "carnes-ovos" | "legumes-verduras"
  >;
  onAlimentoClick?: (alimento: Alimento) => void;
  mostrarDicas?: boolean;
};

export function Plate({ alimentosPorZona, onAlimentoClick, mostrarDicas = false }: Props) {
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
          <radialGradient id="cavityGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </radialGradient>
        </defs>
        <path
          d="M 300 300 L 300 40 A 260 260 0 0 0 40 300 Z"
          fill="url(#cavityGrad)"
          stroke="#cbd5e1"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 300 300 L 560 300 A 260 260 0 0 0 300 40 Z"
          fill="url(#cavityGrad)"
          stroke="#cbd5e1"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 300 300 L 40 300 A 260 260 0 0 0 300 560 Z"
          fill="url(#cavityGrad)"
          stroke="#cbd5e1"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 300 300 L 300 560 A 260 260 0 0 0 560 300 Z"
          fill="url(#cavityGrad)"
          stroke="#cbd5e1"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <ellipse cx="170" cy="160" rx="55" ry="22" fill="#ffffff" opacity="0.7" />
      </svg>

      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-[8%] h-[42%] w-[42%]">
          <PlateZone
            zona="cereais"
            alimentos={alimentosPorZona.cereais}
            onAlimentoClick={onAlimentoClick}
            mostrarDica={mostrarDicas}
          />
        </div>
        <div className="absolute right-[8%] top-[8%] h-[42%] w-[42%]">
          <PlateZone
            zona="feijoes"
            alimentos={alimentosPorZona.feijoes}
            onAlimentoClick={onAlimentoClick}
            mostrarDica={mostrarDicas}
          />
        </div>
        <div className="absolute left-[8%] bottom-[8%] h-[42%] w-[42%]">
          <PlateZone
            zona="legumes-verduras"
            alimentos={alimentosPorZona["legumes-verduras"]}
            onAlimentoClick={onAlimentoClick}
            mostrarDica={mostrarDicas}
          />
        </div>
        <div className="absolute right-[8%] bottom-[8%] h-[42%] w-[42%]">
          <PlateZone
            zona="carnes-ovos"
            alimentos={alimentosPorZona["carnes-ovos"]}
            onAlimentoClick={onAlimentoClick}
            mostrarDica={mostrarDicas}
          />
        </div>
      </div>
    </div>
  );
}
