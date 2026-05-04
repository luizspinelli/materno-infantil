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
  pulse?: boolean;
};

export function DraggableFood({
  alimento,
  origem,
  size = 64,
  showName = true,
  onClick,
  pulse = false,
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
    touchAction: "manipulation",
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(alimento)}
        aria-label={`Ver detalhes de ${alimento.nome}`}
        className="flex flex-col items-center justify-center gap-1 select-none rounded-xl bg-white p-2 shadow-sm hover:shadow-md hover:ring-2 hover:ring-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all border border-slate-200 cursor-pointer"
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
      className={
        "relative flex flex-col items-center justify-center gap-1 select-none rounded-xl bg-white p-2 shadow-sm hover:shadow-md hover:ring-2 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow border border-slate-200 group " +
        (pulse ? "animate-tutorial-pulse" : "")
      }
      title={`Arraste ${alimento.nome} para o prato`}
      aria-label={`${alimento.nome}. Arraste para uma zona do prato.`}
    >
      {/* Drag handle visual no canto */}
      <span
        aria-hidden
        className="absolute top-1 right-1 text-slate-300 group-hover:text-slate-400 text-[10px] leading-none pointer-events-none"
      >
        ⋮⋮
      </span>
      <FoodIcon alimento={alimento} size={size} />
      {showName && (
        <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
          {alimento.nome}
        </span>
      )}
    </div>
  );
}
