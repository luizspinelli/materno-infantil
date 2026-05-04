"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Alimento } from "../lib/foods";
import { FoodIcon } from "./FoodIcon";

type Props = {
  alimento: Alimento;
  origem: "pool" | "prato";
  size?: number;
  showName?: boolean;
  onClick?: (alimento: Alimento) => void;
};

export function DraggableFood({
  alimento,
  origem,
  size = 64,
  showName = true,
  onClick,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${origem}:${alimento.id}`,
    data: { alimento, origem },
    disabled: !!onClick, // se onClick está ativo (modo descoberta), desativa drag
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: onClick ? "pointer" : isDragging ? "grabbing" : "grab",
    // manipulation deixa o navegador tratar gestos comuns (scroll, tap),
    // só interceptando double-tap-zoom. O TouchSensor com delay e
    // tolerance decide se o gesto vira drag ou scroll.
    touchAction: "manipulation",
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(alimento)}
        className="flex flex-col items-center justify-center gap-1 select-none rounded-xl bg-white p-2 shadow-sm hover:shadow-md hover:ring-2 hover:ring-emerald-300 transition-all border border-slate-200 cursor-pointer"
        title={`Tocar para detalhes de ${alimento.nome}`}
      >
        <FoodIcon alimento={alimento} size={size} />
        {showName && (
          <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
            {alimento.nome}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-center gap-1 select-none rounded-xl bg-white p-2 shadow-sm hover:shadow-md transition-shadow border border-slate-200"
      title={alimento.nome}
    >
      <FoodIcon alimento={alimento} size={size} />
      {showName && (
        <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
          {alimento.nome}
        </span>
      )}
    </div>
  );
}
