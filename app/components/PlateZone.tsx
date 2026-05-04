"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Alimento, Categoria } from "../lib/foods";
import { CATEGORIAS } from "../lib/foods";
import { DraggableFood } from "./DraggableFood";

type Props = {
  zona: Categoria;
  alimentos: Alimento[];
};

export function PlateZone({ zona, alimentos }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zona:${zona}`,
    data: { zona },
  });

  const meta = CATEGORIAS[zona];

  return (
    <div
      ref={setNodeRef}
      className="flex h-full w-full flex-wrap items-center justify-center content-center gap-1 p-2 transition-colors rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isOver ? `${meta.cor}26` : "transparent",
        outline: isOver ? `2px dashed ${meta.cor}` : "none",
        outlineOffset: "-4px",
      }}
    >
      {alimentos.map((a) => (
        <DraggableFood key={a.id} alimento={a} origem="prato" size={56} showName={false} />
      ))}
    </div>
  );
}
