"use client";

import { useDroppable } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import type { Alimento, Categoria } from "../lib/foods";
import { CATEGORIAS } from "../lib/foods";
import { DraggableFood } from "./DraggableFood";

type Props = {
  zona: Categoria;
  alimentos: Alimento[];
  onAlimentoClick?: (alimento: Alimento) => void;
  mostrarDica?: boolean;
};

const HINTS: Record<Categoria, { emoji: string; label: string }> = {
  cereais: { emoji: "🍚", label: "Cereal" },
  feijoes: { emoji: "🫘", label: "Feijão" },
  "carnes-ovos": { emoji: "🍗", label: "Carne ou ovo" },
  "legumes-verduras": { emoji: "🥦", label: "Legume" },
  frutas: { emoji: "🍎", label: "Fruta" },
};

export function PlateZone({ zona, alimentos, onAlimentoClick, mostrarDica = false }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zona:${zona}`,
    data: { zona },
  });

  const meta = CATEGORIAS[zona];
  const hint = HINTS[zona];
  const vazia = alimentos.length === 0;

  // Anima a zona quando recebe um novo alimento
  const [acabouDeReceber, setAcabouDeReceber] = useState(false);
  const previousCount = useRef(alimentos.length);

  useEffect(() => {
    if (alimentos.length > previousCount.current) {
      setAcabouDeReceber(true);
      const id = setTimeout(() => setAcabouDeReceber(false), 450);
      return () => clearTimeout(id);
    }
    previousCount.current = alimentos.length;
  }, [alimentos.length]);

  return (
    <div
      ref={setNodeRef}
      role="region"
      aria-label={`Zona ${meta.titulo}${vazia ? " (vazia)" : ""}`}
      className="flex h-full w-full flex-wrap items-center justify-center content-center gap-1 p-2 transition-all rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isOver
          ? `${meta.cor}33`
          : vazia && mostrarDica
            ? `${meta.cor}14`
            : "transparent",
        outline: isOver ? `2px dashed ${meta.cor}` : "none",
        outlineOffset: "-4px",
        animation: acabouDeReceber ? `dropPulse 450ms ease-out` : undefined,
        boxShadow: acabouDeReceber ? `0 0 0 4px ${meta.cor}55` : undefined,
      }}
    >
      <style jsx>{`
        @keyframes dropPulse {
          0% { transform: scale(1); }
          40% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
      {vazia
        ? mostrarDica && (
            <div
              className="flex flex-col items-center justify-center gap-0.5 select-none pointer-events-none"
              style={{ color: meta.cor, opacity: 0.6 }}
              aria-hidden
            >
              <span className="text-3xl sm:text-4xl leading-none">{hint.emoji}</span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide">
                {hint.label}
              </span>
            </div>
          )
        : alimentos.map((a) => (
            <DraggableFood
              key={a.id}
              alimento={a}
              origem="prato"
              size={56}
              showName={false}
              onClick={onAlimentoClick}
            />
          ))}
    </div>
  );
}
