"use client";

import type { Alimento } from "../lib/foods";
import { CATEGORIAS } from "../lib/foods";
import { FoodIcon } from "./FoodIcon";

type Props = {
  alimento: Alimento;
  onClose: () => void;
};

export function FoodInfoPopover({ alimento, onClose }: Props) {
  const cor = alimento.apropriado
    ? alimento.categoria
      ? CATEGORIAS[alimento.categoria].cor
      : "#16a34a"
    : "#b91c1c";
  const meta = alimento.categoria ? CATEGORIAS[alimento.categoria] : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border-t-4"
        style={{ borderColor: cor }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-sm text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>
        <div className="flex flex-col items-center text-center gap-3">
          <FoodIcon alimento={alimento} size={88} />
          <h3 className="text-lg font-bold text-slate-800">{alimento.nome}</h3>
          {meta && (
            <span
              className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: `${cor}20`, color: cor }}
            >
              {meta.titulo}
            </span>
          )}
          <p className="text-sm text-slate-700 leading-snug">
            {alimento.apropriado
              ? "Alimento adequado para crianças de 7 a 8 meses."
              : alimento.motivo}
          </p>
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: cor }}
          >
            {alimento.apropriado ? "✓ Apropriado" : "✕ Inapropriado"}
          </span>
        </div>
      </div>
    </div>
  );
}
