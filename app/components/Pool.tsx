"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Alimento } from "../lib/foods";
import { DraggableFood } from "./DraggableFood";

type Props = {
  alimentos: Alimento[];
  onAlimentoClick?: (alimento: Alimento) => void;
};

export function Pool({ alimentos, onAlimentoClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: "zona:pool",
    data: { zona: "pool" },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col h-full rounded-2xl bg-white/80 p-4 shadow-sm border-2 transition-colors"
      style={{ borderColor: isOver ? "#94a3b8" : "transparent" }}
    >
      <h2 className="mb-3 text-base font-bold text-slate-700 shrink-0">
        Alimentos disponíveis
        <span className="ml-2 text-xs font-normal text-slate-500">({alimentos.length})</span>
      </h2>
      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1 min-h-0 content-start overscroll-contain"
        style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
      >
        {alimentos.map((a) => (
          <DraggableFood
            key={a.id}
            alimento={a}
            origem="pool"
            size={64}
            onClick={onAlimentoClick}
          />
        ))}
      </div>
    </div>
  );
}
