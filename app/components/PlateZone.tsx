"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Alimento, Categoria } from "../lib/foods";
import { CATEGORIAS } from "../lib/foods";
import { DraggableFood } from "./DraggableFood";

type Props = {
  zona: Categoria;
  alimentos: Alimento[];
  onAlimentoClick?: (alimento: Alimento) => void;
};

const HINTS: Record<Categoria, { emoji: string; label: string }> = {
  cereais: { emoji: "🍚", label: "Cereal" },
  feijoes: { emoji: "🫘", label: "Feijão" },
  "carnes-ovos": { emoji: "🍗", label: "Carne ou ovo" },
  "legumes-verduras": { emoji: "🥦", label: "Legume" },
  frutas: { emoji: "🍎", label: "Fruta" },
};

export function PlateZone({ zona, alimentos, onAlimentoClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zona:${zona}`,
    data: { zona },
  });

  const meta = CATEGORIAS[zona];
  const hint = HINTS[zona];
  const vazia = alimentos.length === 0;

  return (
    <div
      ref={setNodeRef}
      className="flex h-full w-full flex-wrap items-center justify-center content-center gap-1 p-2 transition-colors rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isOver ? `${meta.cor}26` : vazia ? `${meta.cor}10` : "transparent",
        outline: isOver ? `2px dashed ${meta.cor}` : "none",
        outlineOffset: "-4px",
      }}
    >
      {vazia ? (
        <div
          className="flex flex-col items-center justify-center gap-0.5 select-none pointer-events-none"
          style={{ color: meta.cor, opacity: 0.45 }}
          aria-hidden
        >
          <span className="text-3xl sm:text-4xl leading-none">{hint.emoji}</span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">
            {hint.label}
          </span>
        </div>
      ) : (
        alimentos.map((a) => (
          <DraggableFood
            key={a.id}
            alimento={a}
            origem="prato"
            size={56}
            showName={false}
            onClick={onAlimentoClick}
          />
        ))
      )}
    </div>
  );
}
