"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
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
import { IdleWarning } from "./IdleWarning";
import type { Alimento, Resultado } from "../lib/foods";

const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutos sem interação → volta à tela inicial
const IDLE_WARNING_MS = 10 * 1000; // últimos 10s mostram aviso com countdown

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
  const [avisoIdle, setAvisoIdle] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // Long-press de 300ms pra iniciar drag em touch. Se o usuário mover
    // mais de 15px durante esse delay, o gesto é cancelado e o navegador
    // assume scroll/tap normal.
    useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 15 } }),
    // Keyboard: Tab pra focar, Espaço/Enter pra pegar/soltar, setas pra navegar entre zonas
    useSensor(KeyboardSensor)
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
    setAvisoIdle(false);
  }

  // Volta à tela inicial após inatividade. 10s antes do reset mostra
  // um aviso com countdown que pode ser cancelado tocando "Continuar".
  useIdleTimer(IDLE_TIMEOUT_MS, voltarAoInicio, iniciado, {
    warningMs: IDLE_WARNING_MS,
    onWarning: () => setAvisoIdle(true),
    onActive: () => setAvisoIdle(false),
  });

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
      <main
        className={
          // Em portrait mobile: deixa o body rolar. Em landscape (qualquer device) e em md+: tela cheia sem scroll do body.
          "min-h-screen w-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-rose-50 animate-fade-in " +
          "landscape:h-screen landscape:overflow-hidden md:h-screen md:overflow-hidden"
        }
      >
        <div className="w-full flex flex-col px-2 sm:px-4 py-2 sm:py-3 landscape:h-full md:h-full">
          {/* Header — sempre lado a lado em landscape, empilhado em portrait mobile */}
          <header className="flex flex-col landscape:flex-row sm:flex-row landscape:items-center sm:items-center landscape:justify-between sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-3 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={voltarAoInicio}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
                title="Voltar à tela inicial"
              >
                <span aria-hidden>←</span>
                <span className="hidden sm:inline">Início</span>
              </button>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 min-w-0">
                <h1 className="text-base sm:text-2xl font-extrabold text-emerald-700 leading-none truncate">
                  Monte o Prato da Criança
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-600 truncate">
                  Crianças de <strong>7 a 8 meses</strong> · Guia Alimentar MS
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={modoDescoberta}
              onClick={() => setModoDescoberta((v) => !v)}
              className={
                "flex items-center gap-2 text-[11px] sm:text-xs select-none shrink-0 " +
                "rounded-full border px-3 py-1.5 transition-colors min-h-[36px] " +
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 " +
                (modoDescoberta
                  ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")
              }
              title="Quando ativo, tocar em um alimento abre detalhes em vez de iniciar drag"
            >
              <span
                aria-hidden
                className={
                  "inline-block w-7 h-4 rounded-full relative transition-colors " +
                  (modoDescoberta ? "bg-emerald-200" : "bg-slate-300")
                }
              >
                <span
                  className={
                    "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all " +
                    (modoDescoberta ? "left-3.5" : "left-0.5")
                  }
                />
              </span>
              Modo descoberta
              <span className="hidden md:inline opacity-70">(tocar para ler)</span>
            </button>
          </header>

          {/* Container principal — vertical em portrait, lado a lado em landscape */}
          <div className="flex-1 flex portrait:flex-col landscape:flex-row gap-2 md:gap-4 min-h-0">
            {/* Coluna prato — altura fixa em portrait pra não sobrepor o pool */}
            <section
              className={
                "flex flex-col rounded-2xl bg-gradient-to-br from-amber-50/80 to-rose-50/80 " +
                "border border-amber-200/40 p-2 sm:p-4 shadow-inner min-h-0 min-w-0 " +
                // Portrait: altura limitada pra deixar espaço pro pool abaixo
                "portrait:h-[52vh] " +
                // Landscape: estica com o flex parent
                "landscape:flex-1"
              }
            >
              <div className="flex-1 flex portrait:flex-col landscape:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 min-h-0">
                <div
                  className={
                    "shrink-0 " +
                    // Portrait: limitado pela altura disponível dentro da section (52vh menos controles)
                    "portrait:w-[min(40vh,75vw,420px)] portrait:h-[min(40vh,75vw,420px)] " +
                    // Landscape: limitado pela altura da viewport e largura do container
                    "landscape:w-[min(70vh,50vw,460px)] landscape:h-[min(70vh,50vw,460px)]"
                  }
                >
                  <Plate
                    alimentosPorZona={alimentosPorZona}
                    onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
                  />
                </div>
                <div
                  className={
                    "shrink-0 " +
                    "portrait:w-[min(14vh,25vw,150px)] portrait:h-[min(14vh,25vw,150px)] " +
                    "landscape:w-[min(25vh,18vw,180px)] landscape:h-[min(25vh,18vw,180px)]"
                  }
                >
                  <Pot
                    alimentos={alimentosPorZona.frutas}
                    onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
                  />
                </div>
              </div>

              <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <span className="text-[11px] sm:text-sm text-slate-700">
                  <strong>{totalNoPrato}</strong> alimento(s) no prato
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={resetar}
                    className="rounded-lg border border-slate-300 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={validar}
                    disabled={totalNoPrato === 0}
                    aria-disabled={totalNoPrato === 0}
                    title={totalNoPrato === 0 ? "Adicione alimentos ao prato primeiro" : "Validar o prato montado"}
                    className="rounded-lg bg-emerald-600 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Validar prato
                  </button>
                </div>
              </div>
            </section>

            {/* Coluna pool */}
            <section
              className={
                "shrink-0 min-h-0 " +
                // Portrait: largura full, altura fixa para scroll interno engajar
                "portrait:w-full portrait:h-[38vh] " +
                // Landscape: lado a lado com largura proporcional, estica com o flex
                "landscape:w-[40%] landscape:max-w-[460px] landscape:min-w-[260px] landscape:h-auto"
              }
            >
              <Pool
                alimentos={alimentosPool}
                onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
              />
            </section>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {alimentoAtivo ? (
            <div
              className="rounded-xl bg-white p-2 shadow-2xl border border-slate-300"
              style={{ transform: "rotate(3deg) scale(1.05)" }}
            >
              <FoodIcon alimento={alimentoAtivo} size={72} />
            </div>
          ) : null}
        </DragOverlay>

        {/* Region pra leitor de tela anunciar drag/drop */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {alimentoAtivo ? `Arrastando ${alimentoAtivo.nome}` : ""}
        </div>

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

        {avisoIdle && (
          <IdleWarning
            totalSeconds={Math.round(IDLE_WARNING_MS / 1000)}
            onContinue={() => setAvisoIdle(false)}
          />
        )}
      </main>
    </DndContext>
  );
}
