"use client";

import type { NivelPrato, Resultado } from "../lib/foods";
import { CATEGORIAS } from "../lib/foods";
import { FoodIcon } from "./FoodIcon";

type Props = {
  resultado: Resultado;
  onClose: () => void;
};

const ESTILO_NIVEL: Record<NivelPrato, { titulo: string; cor: string; bg: string; icone: string }> = {
  perfeito: { titulo: "Prato Perfeito", cor: "#15803d", bg: "#dcfce7", icone: "🌟" },
  bom: { titulo: "Prato Completo", cor: "#b45309", bg: "#fef3c7", icone: "✓" },
  incompleto: { titulo: "Prato Incompleto", cor: "#b45309", bg: "#fef3c7", icone: "⚠" },
  ruim: { titulo: "Prato Inadequado", cor: "#b91c1c", bg: "#fee2e2", icone: "✕" },
  vazio: { titulo: "Prato Vazio", cor: "#475569", bg: "#f1f5f9", icone: "·" },
};

export function ValidationPanel({ resultado, onClose }: Props) {
  const { itens, grupos, apropriados, inapropriados, total, mensagem, nivel } = resultado;
  const estilo = ESTILO_NIVEL[nivel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>

        {/* Cabeçalho com nível */}
        <div
          className="mb-4 rounded-xl p-4 border-l-4"
          style={{ backgroundColor: estilo.bg, borderColor: estilo.cor }}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{estilo.icone}</span>
            <h2 className="text-xl font-bold" style={{ color: estilo.cor }}>
              {estilo.titulo}
            </h2>
          </div>
          <p className="text-sm text-slate-700">{mensagem}</p>
        </div>

        {/* Métricas */}
        <div className="mb-5 grid grid-cols-4 gap-2 text-center">
          <Stat
            label="Obrigatórios"
            value={`${grupos.filter((g) => g.obrigatorio && g.presente).length}/4`}
            cor="#0ea5e9"
          />
          <Stat label="Total" value={String(total)} cor="#475569" />
          <Stat label="Adequados" value={String(apropriados)} cor="#15803d" />
          <Stat label="Inadequados" value={String(inapropriados)} cor="#b91c1c" />
        </div>

        {/* Status dos grupos obrigatórios */}
        <div className="mb-3">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
            Grupos obrigatórios (almoço/jantar)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {grupos
              .filter((g) => g.obrigatorio)
              .map((g) => {
                const meta = CATEGORIAS[g.categoria];
                return (
                  <div
                    key={g.categoria}
                    className="flex flex-col items-center justify-center rounded-lg p-3 text-center border-2"
                    style={{
                      borderColor: g.presente ? meta.cor : "#e2e8f0",
                      backgroundColor: g.presente ? `${meta.cor}15` : "#f8fafc",
                    }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: g.presente ? meta.cor : "#94a3b8" }}
                    >
                      {g.presente ? "✓" : "✕"}
                    </span>
                    <span
                      className="text-[11px] font-semibold leading-tight mt-1"
                      style={{ color: g.presente ? meta.cor : "#94a3b8" }}
                    >
                      {meta.titulo}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Frutas (opcional) */}
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
            Complemento opcional
          </h3>
          {grupos
            .filter((g) => !g.obrigatorio)
            .map((g) => {
              const meta = CATEGORIAS[g.categoria];
              return (
                <div
                  key={g.categoria}
                  className="flex items-center gap-3 rounded-lg p-3 border-2"
                  style={{
                    borderColor: g.presente ? meta.cor : "#e2e8f0",
                    backgroundColor: g.presente ? `${meta.cor}15` : "#f8fafc",
                  }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: g.presente ? meta.cor : "#94a3b8" }}
                  >
                    {g.presente ? "✓" : "○"}
                  </span>
                  <div className="flex-1">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: g.presente ? meta.cor : "#64748b" }}
                    >
                      {meta.titulo}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {g.presente
                        ? "Fruta incluída como complemento — ótima prática!"
                        : "Pode ser oferecido um pedaço pequeno de fruta junto à refeição."}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Lista de alimentos */}
        {total > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
              Alimentos no prato
            </h3>
            <ul className="space-y-2">
              {itens.map((item) => {
                const cores =
                  item.status === "apropriado"
                    ? { bg: "#dcfce7", border: "#15803d", icon: "✓" }
                    : { bg: "#fee2e2", border: "#b91c1c", icon: "✕" };

                return (
                  <li
                    key={item.alimento.id}
                    className="flex items-start gap-3 rounded-lg border-l-4 p-3"
                    style={{ backgroundColor: cores.bg, borderColor: cores.border }}
                  >
                    <FoodIcon alimento={item.alimento} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ color: cores.border }} className="font-bold">
                          {cores.icon}
                        </span>
                        <strong className="text-slate-800">{item.alimento.nome}</strong>
                      </div>
                      <p className="mt-1 text-xs text-slate-700 leading-snug">
                        {item.status === "apropriado"
                          ? "Alimento adequado para crianças de 7 a 8 meses."
                          : item.alimento.motivo}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, cor }: { label: string; value: string; cor: string }) {
  return (
    <div className="rounded-lg border bg-slate-50 p-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-xl font-bold" style={{ color: cor }}>
        {value}
      </div>
    </div>
  );
}
