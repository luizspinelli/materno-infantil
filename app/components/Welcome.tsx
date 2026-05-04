"use client";

import { useEffect, useState } from "react";
import { lerStats, type Stats } from "../lib/stats";

type Props = {
  onStart: () => void;
};

export function Welcome({ onStart }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(lerStats());
  }, []);

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-amber-50 to-rose-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col items-center text-center gap-5">
        <div className="text-5xl sm:text-6xl">🍽️</div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-emerald-700 leading-tight">
            Monte o Prato da Criança
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Dinâmica baseada no <strong>Guia Alimentar para Crianças Brasileiras Menores de 2 Anos</strong> — Ministério da Saúde.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
          <Step n="1" titulo="Escolha os alimentos" texto="Arraste cards para as 4 zonas do prato grande e, se quiser, uma fruta no pratinho." />
          <Step n="2" titulo="Cada zona aceita 1" texto="Solte um novo alimento sobre a zona para substituir o anterior." />
          <Step n="3" titulo="Valide o prato" texto="Veja se montou um prato adequado para uma criança de 7 a 8 meses." />
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 w-full">
          <strong>Dica:</strong> O almoço/jantar deve ter <strong>cereal/tubérculo</strong>, <strong>feijão</strong>, <strong>carne ou ovo</strong>, e <strong>legumes/verduras</strong>. Fruta é um complemento opcional.
        </div>

        <button
          onClick={onStart}
          className="mt-2 rounded-2xl bg-emerald-600 px-10 py-4 text-lg font-bold text-white shadow-lg hover:bg-emerald-700 active:scale-[0.98] transition-transform"
        >
          Começar
        </button>

        {stats && stats.totalValidacoes > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 border-t border-slate-200 pt-4 w-full">
            <span>
              <strong className="text-emerald-700 text-sm">{stats.pratosPerfeitos}</strong>{" "}
              prato(s) perfeito(s) hoje
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-700 text-sm">{stats.totalValidacoes}</strong>{" "}
              validação(ões) no total
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ n, titulo, texto }: { n: string; titulo: string; texto: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
      <div className="flex items-center gap-2 mb-1">
        <span className="rounded-full bg-emerald-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center">
          {n}
        </span>
        <strong className="text-sm text-slate-800">{titulo}</strong>
      </div>
      <p className="text-xs text-slate-600 leading-snug">{texto}</p>
    </div>
  );
}
