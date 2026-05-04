"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { ALIMENTOS, CATEGORIAS, Categoria, validarPrato } from "../lib/foods";
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
import { Snackbar } from "./Snackbar";
import type { Alimento, Resultado } from "../lib/foods";

const IDLE_TIMEOUT_MS = 3 * 60 * 1000;
const IDLE_WARNING_MS = 10 * 1000;

const ZONAS: Categoria[] = [
  "cereais",
  "feijoes",
  "carnes-ovos",
  "legumes-verduras",
  "frutas",
];

const OBRIGATORIAS: Categoria[] = ["cereais", "feijoes", "carnes-ovos", "legumes-verduras"];

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

function vibrar(ms: number) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  } catch {
    // sem suporte
  }
}

export default function Game() {
  const [iniciado, setIniciado] = useState(false);
  const [prato, setPrato] = useState<PratoState>(PRATO_VAZIO);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [modoDescoberta, setModoDescoberta] = useState(false);
  const [dicasAtivas, setDicasAtivas] = useState(false);
  const [alimentoInspecao, setAlimentoInspecao] = useState<Alimento | null>(null);
  const [avisoIdle, setAvisoIdle] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 15 } }),
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

    if (destino !== "pool") {
      vibrar(20); // vibração curta confirmando o drop
    }
  }

  function validar() {
    const r = validarPrato(prato);
    setResultado(r);
    registrarValidacao(r.nivel === "perfeito");
    if (r.nivel === "perfeito") vibrar(60);
  }

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

  function limparComUndo() {
    if (idsNoPrato.size === 0) return;
    const snapshot = prato;
    resetar();
    setSnackbar({
      message: "Prato limpo.",
      actionLabel: "Desfazer",
      onAction: () => setPrato(snapshot),
    });
  }

  function voltarAoInicio() {
    resetar();
    setModoDescoberta(false);
    setDicasAtivas(false);
    setIniciado(false);
    setAvisoIdle(false);
    setSnackbar(null);
  }

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

  // Progresso: quantos grupos obrigatórios já têm um alimento APROPRIADO
  const progresso = useMemo(() => {
    const lookup = new Map(ALIMENTOS.map((a) => [a.id, a]));
    return OBRIGATORIAS.map((cat) => {
      const ids = prato[cat];
      const valido = ids.some((id) => {
        const a = lookup.get(id);
        return a?.apropriado === true;
      });
      return { cat, valido };
    });
  }, [prato]);

  const gruposCompletos = progresso.filter((g) => g.valido).length;

  // Tutorial inicial: anima o primeiro card até primeiro drag-end ou clique
  const [tutorial, setTutorial] = useState(true);
  const tutorialAcabouRef = useRef(false);
  function dispensarTutorial() {
    if (!tutorialAcabouRef.current) {
      tutorialAcabouRef.current = true;
      setTutorial(false);
    }
  }

  if (!iniciado) {
    return <Welcome onStart={() => setIniciado(true)} />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => {
        dispensarTutorial();
        handleDragStart(e);
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Skip-link visível ao foco para usuários de teclado */}
      <a
        href="#prato"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        Pular para o prato
      </a>

      <main
        className={
          "min-h-screen w-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-rose-50 animate-fade-in " +
          "landscape:h-screen landscape:overflow-hidden md:h-screen md:overflow-hidden"
        }
      >
        <div className="w-full flex flex-col px-2 sm:px-4 py-2 sm:py-3 landscape:h-full md:h-full">
          <header className="flex flex-col landscape:flex-row sm:flex-row landscape:items-center sm:items-center landscape:justify-between sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={voltarAoInicio}
                aria-label="Voltar à tela inicial"
                className="rounded-lg border border-slate-300 bg-white w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 text-sm sm:text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center sm:gap-1.5 shrink-0"
                title="Voltar à tela inicial"
              >
                <span aria-hidden>←</span>
                <span className="hidden sm:inline">Início</span>
              </button>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 min-w-0">
                <h1 className="text-base sm:text-2xl font-extrabold text-emerald-700 leading-none truncate">
                  Monte o Prato da Criança
                </h1>
                <p className="hidden sm:inline text-xs text-slate-600 truncate">
                  Crianças de <strong>7 a 8 meses</strong> · Guia Alimentar MS
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <ProgressoGrupos progresso={progresso} total={gruposCompletos} />
              <ToggleSwitch
                label="Dicas"
                description="Mostra ícones nas zonas vazias do prato"
                checked={dicasAtivas}
                onChange={setDicasAtivas}
              />
              <ToggleSwitch
                label="Modo descoberta"
                description="Tocar em um alimento abre detalhes em vez de arrastar"
                checked={modoDescoberta}
                onChange={setModoDescoberta}
              />
            </div>
          </header>

          <div className="flex-1 flex portrait:flex-col landscape:flex-row gap-2 md:gap-4 min-h-0">
            <section
              id="prato"
              className={
                "flex flex-col rounded-2xl bg-gradient-to-br from-amber-50/80 to-rose-50/80 " +
                "border border-amber-200/40 p-2 sm:p-4 shadow-inner min-h-0 min-w-0 " +
                "portrait:h-[52vh] " +
                "landscape:flex-1"
              }
            >
              <div className="flex-1 flex portrait:flex-col landscape:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 min-h-0">
                <div
                  className={
                    "shrink-0 " +
                    "portrait:w-[min(40vh,75vw,420px)] portrait:h-[min(40vh,75vw,420px)] " +
                    "landscape:w-[min(70vh,50vw,460px)] landscape:h-[min(70vh,50vw,460px)]"
                  }
                >
                  <Plate
                    alimentosPorZona={alimentosPorZona}
                    onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
                    mostrarDicas={dicasAtivas}
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
                    mostrarDica={dicasAtivas}
                  />
                </div>
              </div>

              <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <span className="text-[11px] sm:text-sm text-slate-700">
                  <strong>{totalNoPrato}</strong> alimento(s) no prato
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={limparComUndo}
                    disabled={totalNoPrato === 0}
                    className="rounded-lg border border-slate-300 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={validar}
                    disabled={totalNoPrato === 0}
                    aria-disabled={totalNoPrato === 0}
                    title={
                      totalNoPrato === 0
                        ? "Adicione alimentos ao prato primeiro"
                        : "Validar o prato montado"
                    }
                    className="rounded-lg px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none transition-colors bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800"
                  >
                    Validar prato
                  </button>
                </div>
              </div>
            </section>

            <section
              className={
                "shrink-0 min-h-0 " +
                "portrait:w-full portrait:h-[38vh] " +
                "landscape:w-[40%] landscape:max-w-[460px] landscape:min-w-[260px] landscape:h-auto"
              }
            >
              <Pool
                alimentos={alimentosPool}
                onAlimentoClick={modoDescoberta ? handleAlimentoClick : undefined}
                tutorialAtivo={tutorial}
                onTutorialDismiss={dispensarTutorial}
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

        {snackbar && (
          <Snackbar
            message={snackbar.message}
            actionLabel={snackbar.actionLabel}
            onAction={snackbar.onAction}
            onDismiss={() => setSnackbar(null)}
          />
        )}
      </main>
    </DndContext>
  );
}

function ProgressoGrupos({
  progresso,
  total,
}: {
  progresso: { cat: Categoria; valido: boolean }[];
  total: number;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shrink-0"
      title={`${total} de ${progresso.length} grupos obrigatórios completos`}
      aria-label={`${total} de ${progresso.length} grupos obrigatórios completos`}
    >
      <span className="text-[11px] sm:text-xs font-bold text-slate-700">
        {total}/{progresso.length}
      </span>
      <span className="flex gap-0.5">
        {progresso.map((g) => {
          const meta = CATEGORIAS[g.cat];
          return (
            <span
              key={g.cat}
              aria-hidden
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: g.valido ? meta.cor : "#cbd5e1" }}
            />
          );
        })}
      </span>
    </div>
  );
}

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      title={description}
      className={
        "flex items-center gap-2 text-[11px] sm:text-xs select-none shrink-0 " +
        "rounded-full border px-3 py-1.5 transition-colors min-h-[36px] " +
        "focus:outline-none focus:ring-2 focus:ring-emerald-500 " +
        (checked
          ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")
      }
    >
      <span
        aria-hidden
        className={
          "inline-block w-7 h-4 rounded-full relative transition-colors " +
          (checked ? "bg-emerald-200" : "bg-slate-300")
        }
      >
        <span
          className={
            "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all " +
            (checked ? "left-3.5" : "left-0.5")
          }
        />
      </span>
      {label}
    </button>
  );
}
