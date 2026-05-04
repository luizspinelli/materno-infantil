"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Alimento } from "../lib/foods";
import { DraggableFood } from "./DraggableFood";

type Props = {
  alimentos: Alimento[];
  onAlimentoClick?: (alimento: Alimento) => void;
  tutorialAtivo?: boolean;
  onTutorialDismiss?: () => void;
};

export function Pool({
  alimentos,
  onAlimentoClick,
  tutorialAtivo = false,
  onTutorialDismiss,
}: Props) {
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
      <h2 className="mb-3 text-base font-bold text-slate-700 shrink-0 flex items-baseline justify-between gap-2">
        <span>
          Alimentos disponíveis
          <span className="ml-2 text-xs font-normal text-slate-500">({alimentos.length})</span>
        </span>
        {tutorialAtivo && (
          <span className="text-[10px] font-normal text-emerald-700 italic">
            ↓ arraste daqui pro prato
          </span>
        )}
      </h2>
      <div className="relative flex-1 min-h-0">
        <div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3 overflow-y-auto pr-1 h-full content-start overscroll-contain"
          style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
          onScroll={onTutorialDismiss}
        >
          {alimentos.map((a, idx) => (
            <DraggableFood
              key={a.id}
              alimento={a}
              origem="pool"
              size={64}
              onClick={onAlimentoClick}
              pulse={tutorialAtivo && idx === 0}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-t from-white/90 to-transparent rounded-b-2xl"
        />
      </div>
    </div>
  );
}
