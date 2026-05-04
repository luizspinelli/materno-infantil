"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ALIMENTOS, Categoria, validarPrato } from "../lib/foods";
import { Pool } from "./Pool";
import { Plate } from "./Plate";
import { Pot } from "./Pot";
import { FoodIcon } from "./FoodIcon";
import { ValidationPanel } from "./ValidationPanel";
import type { Resultado } from "../lib/foods";

const ZONAS: Categoria[] = [
  "cereais",
  "feijoes",
  "carnes-ovos",
  "legumes-verduras",
  "frutas",
];

type PratoState = Record<Categoria, string[]>;

const PRATO_VAZIO: PratoState = {
  cereais: [],
  feijoes: [],
  "carnes-ovos": [],
  "legumes-verduras": [],
  frutas: [],
};

export default function Game() {
  const [prato, setPrato] = useState<PratoState>(PRATO_VAZIO);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const idsNoPrato = useMemo(
    () => new Set(ZONAS.flatMap((z) => prato[z])),
    [prato]
  );

  // Embaralha a ordem dos alimentos uma vez ao montar o componente
  const alimentosEmbaralhados = useMemo(() => {
    const arr = [...ALIMENTOS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const alimentosPool = useMemo(
    () => alimentosEmbaralhados.filter((a) => !idsNoPrato.has(a.id)),
    [idsNoPrato, alimentosEmbaralhados]
  );

  const alimentoAtivo = useMemo(() => {
    if (!activeId) return null;
    const id = activeId.split(":")[1];
    return ALIMENTOS.find((a) => a.id === id) ?? null;
  }, [activeId]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as
      | { alimento: { id: string }; origem: "pool" | "prato" }
      | undefined;
    const overData = over.data.current as { zona: Categoria | "pool" } | undefined;
    if (!activeData || !overData) return;

    const alimentoId = activeData.alimento.id;
    const destino = overData.zona;

    setPrato((prev) => {
      const next: PratoState = {
        cereais: prev.cereais.filter((id) => id !== alimentoId),
        feijoes: prev.feijoes.filter((id) => id !== alimentoId),
        "carnes-ovos": prev["carnes-ovos"].filter((id) => id !== alimentoId),
        "legumes-verduras": prev["legumes-verduras"].filter((id) => id !== alimentoId),
        frutas: prev.frutas.filter((id) => id !== alimentoId),
      };
      if (destino === "pool") return next;
      // Apenas 1 alimento por zona — substitui o existente
      next[destino] = [alimentoId];
      return next;
    });
  }

  function validar() {
    setResultado(validarPrato(prato));
  }

  function resetar() {
    setPrato(PRATO_VAZIO);
    setResultado(null);
  }

  const alimentosPorZona = useMemo(() => {
    const lookup = new Map(ALIMENTOS.map((a) => [a.id, a]));
    return {
      cereais: prato.cereais.map((id) => lookup.get(id)!).filter(Boolean),
      feijoes: prato.feijoes.map((id) => lookup.get(id)!).filter(Boolean),
      "carnes-ovos": prato["carnes-ovos"].map((id) => lookup.get(id)!).filter(Boolean),
      "legumes-verduras": prato["legumes-verduras"].map((id) => lookup.get(id)!).filter(Boolean),
      frutas: prato.frutas.map((id) => lookup.get(id)!).filter(Boolean),
    };
  }, [prato]);

  const totalNoPrato = idsNoPrato.size;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="h-screen w-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-amber-50 to-rose-50">
        <div className="h-full w-full flex flex-col px-4 py-3">
          {/* Header em uma linha */}
          <header className="flex items-baseline justify-between gap-4 mb-3 shrink-0">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-extrabold text-emerald-700 leading-none">
                Monte o Prato da Criança
              </h1>
              <p className="text-xs text-slate-600">
                Crianças de <strong>7 a 8 meses</strong> · Guia Alimentar MS
              </p>
            </div>
            <p className="text-xs italic text-slate-500">
              Arraste os alimentos e clique em <em>Validar</em>.
            </p>
          </header>

          {/* Conteúdo principal: prato à esquerda, pool à direita */}
          <div className="flex-1 flex gap-4 min-h-0">
            {/* Coluna esquerda: prato + pote + controles */}
            <section className="flex-1 flex flex-col rounded-2xl bg-gradient-to-br from-amber-50/80 to-rose-50/80 border border-amber-200/40 p-4 shadow-inner min-h-0 min-w-0">
              <div className="flex-1 flex items-center justify-center gap-6 min-h-0">
                <div
                  className="shrink-0"
                  style={{
                    width: "min(60vh, 480px)",
                    height: "min(60vh, 480px)",
                  }}
                >
                  <Plate alimentosPorZona={alimentosPorZona} />
                </div>
                <div
                  className="shrink-0"
                  style={{
                    width: "min(22vh, 180px)",
                    height: "min(22vh, 180px)",
                  }}
                >
                  <Pot alimentos={alimentosPorZona.frutas} />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 shrink-0">
                <span className="text-sm text-slate-700">
                  <strong>{totalNoPrato}</strong> alimento(s) no prato
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={resetar}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={validar}
                    className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow hover:bg-emerald-700"
                  >
                    Validar prato
                  </button>
                </div>
              </div>
            </section>

            {/* Coluna direita: pool */}
            <section className="w-[460px] shrink-0 min-h-0">
              <Pool alimentos={alimentosPool} />
            </section>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {alimentoAtivo ? (
            <div className="rounded-xl bg-white p-2 shadow-xl border border-slate-300">
              <FoodIcon alimento={alimentoAtivo} size={72} />
            </div>
          ) : null}
        </DragOverlay>

        {resultado && <ValidationPanel resultado={resultado} onClose={() => setResultado(null)} />}
      </main>
    </DndContext>
  );
}
