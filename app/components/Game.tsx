"use client";

import { useEffect, useMemo, useState } from "react";
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
import confetti from "canvas-confetti";
import { ALIMENTOS, Categoria, validarPrato } from "../lib/foods";
import { useIdleTimer } from "../lib/useIdleTimer";
import { registrarValidacao } from "../lib/stats";
import { Pool } from "./Pool";
import { Plate } from "./Plate";
import { Pot } from "./Pot";
import { FoodIcon } from "./FoodIcon";
import { ValidationPanel } from "./ValidationPanel";
import { Welcome } from "./Welcome";
import { FoodInfoPopover } from "./FoodInfoPopover";
import type { Alimento, Resultado } from "../lib/foods";

const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutos sem interação → volta à tela inicial

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

function dispararConfete() {
  const fim = Date.now() + 1500;
  const cores = ["#16a34a", "#f59e0b", "#dc2626", "#9333ea", "#0ea5e9"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: cores,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: cores,
    });
    if (Date.now() < fim) requestAnimationFrame(frame);
  })();
}

export default function Game() {
  const [iniciado, setIniciado] = useState(false);
  const [prato, setPrato] = useState<PratoState>(PRATO_VAZIO);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [modoDescoberta, setModoDescoberta] = useState(false);
  const [alimentoInspecao, setAlimentoInspecao] = useState<Alimento | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const idsNoPrato = useMemo(
    () => new Set(ZONAS.flatMap((z) => prato[z])),
    [prato]
  );

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
      next[destino] = [alimentoId];
      return next;
    });
  }

  function validar() {
    const r = validarPrato(prato);
    setResultado(r);
    registrarValidacao(r.nivel === "perfeito");
  }

  // Dispara confete quando o resultado é "perfeito"
  useEffect(() => {
    if (resultado?.nivel === "perfeito") {
      dispararConfete();
    }
  }, [resultado]);

  function resetar() {
    setPrato(PRATO_VAZIO);
    setResultado(null);
    setAlimentoInspecao(null);
  }

  function tentarNovamente() {
    resetar();
  }

  function voltarAoInicio() {
    resetar();
    setModoDescoberta(false);
    setIniciado(false);
  }

  // Volta à tela inicial após inatividade (cobre o cenário de feira:
  // visitante sai sem clicar em nada e o próximo encontra estado limpo)
  useIdleTimer(IDLE_TIMEOUT_MS, voltarAoInicio, iniciado);

  function handleAlimentoClick(alimento: Alimento) {
    if (modoDescoberta) {
      setAlimentoInspecao(alimento);
    }
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

  if (!iniciado) {
    return <Welcome onStart={() => setIniciado(true)} />;
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="min-h-screen md:h-screen w-screen md:overflow-hidden bg-gradient-to-b from-emerald-50 via-amber-50 to-rose-50">
        <div className="md:h-full w-full flex flex-col px-3 sm:px-4 py-3">
          {/* Header — empilha em mobile, lado a lado em md+ */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={voltarAoInicio}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
                title="Voltar à tela inicial"
              >
                <span aria-hidden>←</span>
                <span className="hidden sm:inline">Início</span>
              </button>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
                <h1 className="text-lg sm:text-2xl font-extrabold text-emerald-700 leading-none">
                  Monte o Prato da Criança
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  Crianças de <strong>7 a 8 meses</strong> · Guia Alimentar MS
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={modoDescoberta}
                onChange={(e) => setModoDescoberta(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
              Modo descoberta <span className="hidden sm:inline text-slate-400">(toque para ler)</span>
            </label>
          </header>

          {/* Container principal — empilha em mobile, lado a lado em md+ */}
          <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 min-h-0">
            {/* Coluna prato */}
            <section className="flex-1 flex flex-col rounded-2xl bg-gradient-to-br from-amber-50/80 to-rose-50/80 border border-amber-200/40 p-3 sm:p-4 shadow-inner min-h-0 min-w-0">
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 min-h-0">
                <div
                  className="shrink-0"
                  style={{
                    width: "min(60vh, 75vw, 480px)",
                    height: "min(60vh, 75vw, 480px)",
                  }}
                >
                  <Plate
                    alimentosPorZona={alimentosPorZona}
                    onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
                  />
                </div>
                <div
                  className="shrink-0"
                  style={{
                    width: "min(22vh, 30vw, 180px)",
                    height: "min(22vh, 30vw, 180px)",
                  }}
                >
                  <Pot
                    alimentos={alimentosPorZona.frutas}
                    onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <span className="text-xs sm:text-sm text-slate-700">
                  <strong>{totalNoPrato}</strong> alimento(s) no prato
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={resetar}
                    className="rounded-lg border border-slate-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={validar}
                    className="rounded-lg bg-emerald-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white shadow hover:bg-emerald-700"
                  >
                    Validar prato
                  </button>
                </div>
              </div>
            </section>

            {/* Coluna pool — em mobile altura fixa para o scroll interno funcionar; em md+ estica com o flex parent */}
            <section className="w-full h-[50vh] md:h-auto md:w-[420px] lg:w-[460px] shrink-0 min-h-0">
              <Pool
                alimentos={alimentosPool}
                onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
              />
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

        {resultado && (
          <ValidationPanel
            resultado={resultado}
            onClose={() => setResultado(null)}
            onTentarNovamente={tentarNovamente}
          />
        )}

        {alimentoInspecao && (
          <FoodInfoPopover
            alimento={alimentoInspecao}
            onClose={() => setAlimentoInspecao(null)}
          />
        )}
      </main>
    </DndContext>
  );
}
