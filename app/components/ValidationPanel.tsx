"use client";

import type { NivelPrato, Resultado } from "../lib/foods";
import { CATEGORIAS } from "../lib/foods";
import { FoodIcon } from "./FoodIcon";

type Props = {
  resultado: Resultado;
  onClose: () => void;
  onTentarNovamente?: () => void;
};

const ESTILO_NIVEL: Record<NivelPrato, { titulo: string; cor: string; bg: string; icone: string }> = {
  perfeito: { titulo: "Prato Perfeito", cor: "#15803d", bg: "#dcfce7", icone: "🌟" },
  bom: { titulo: "Prato Completo", cor: "#b45309", bg: "#fef3c7", icone: "✓" },
  incompleto: { titulo: "Prato Incompleto", cor: "#b45309", bg: "#fef3c7", icone: "⚠" },
  ruim: { titulo: "Prato Inadequado", cor: "#b91c1c", bg: "#fee2e2", icone: "✕" },
  vazio: { titulo: "Prato Vazio", cor: "#475569", bg: "#f1f5f9", icone: "·" },
};

export function ValidationPanel({ resultado, onClose, onTentarNovamente }: Props) {
  const { itens, grupos, apropriados, inapropriados, total, mensagem, nivel } = resultado;
  const estilo = ESTILO_NIVEL[nivel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-6xl rounded-2xl bg-white p-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-sm text-slate-500 hover:bg-slate-100 z-10"
        >
          ✕
        </button>

        {/* Banner topo */}
        <div
          className="rounded-xl p-3 border-l-4 flex items-center gap-3 mb-4"
          style={{ backgroundColor: estilo.bg, borderColor: estilo.cor }}
        >
          <span className="text-3xl leading-none shrink-0">{estilo.icone}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold leading-tight" style={{ color: estilo.cor }}>
              {estilo.titulo}
            </h2>
            <p className="text-sm text-slate-700 leading-snug mt-0.5">{mensagem}</p>
          </div>
        </div>

        {/* Layout horizontal: esquerda (resumo) | direita (alimentos) */}
        <div className="grid grid-cols-[minmax(360px,1fr)_2fr] gap-5">
          {/* Coluna esquerda: métricas + grupos */}
          <div className="flex flex-col gap-4">
            {/* Métricas */}
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                Resumo
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <Stat
                  label="Obrigatórios"
                  value={`${grupos.filter((g) => g.obrigatorio && g.presente).length}/4`}
                  cor="#0ea5e9"
                />
                <Stat label="Total" value={String(total)} cor="#475569" />
                <Stat label="Adequados" value={String(apropriados)} cor="#15803d" />
                <Stat label="Inadequados" value={String(inapropriados)} cor="#b91c1c" />
              </div>
            </div>

            {/* Grupos alimentares */}
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                Grupos alimentares
              </h3>
              <div className="grid grid-cols-1 gap-1.5">
                {grupos.map((g) => {
                  const meta = CATEGORIAS[g.categoria];
                  const ativo = g.presente;
                  return (
                    <div
                      key={g.categoria}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 border-2"
                      style={{
                        borderColor: ativo ? meta.cor : "#e2e8f0",
                        backgroundColor: ativo ? `${meta.cor}15` : "#f8fafc",
                      }}
                    >
                      <span
                        className="text-lg font-bold leading-none w-5 text-center"
                        style={{ color: ativo ? meta.cor : "#94a3b8" }}
                      >
                        {ativo ? "✓" : g.obrigatorio ? "✕" : "○"}
                      </span>
                      <span
                        className="text-xs font-semibold flex-1"
                        style={{ color: ativo ? meta.cor : "#64748b" }}
                      >
                        {meta.titulo}
                      </span>
                      {!g.obrigatorio && (
                        <span className="text-[10px] uppercase tracking-wide text-slate-400">
                          opcional
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna direita: lista de alimentos */}
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
              Alimentos no prato {total > 0 && <span className="text-slate-400">({total})</span>}
            </h3>
            {total === 0 ? (
              <div className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
                Nenhum alimento foi colocado no prato.
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-2 content-start">
                {itens.map((item) => {
                  const cores =
                    item.status === "apropriado"
                      ? { bg: "#dcfce7", border: "#15803d", icon: "✓" }
                      : { bg: "#fee2e2", border: "#b91c1c", icon: "✕" };

                  return (
                    <li
                      key={item.alimento.id}
                      className="flex items-start gap-2 rounded-lg border-l-4 p-2.5"
                      style={{ backgroundColor: cores.bg, borderColor: cores.border }}
                    >
                      <FoodIcon alimento={item.alimento} size={36} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            style={{ color: cores.border }}
                            className="font-bold text-sm leading-none"
                          >
                            {cores.icon}
                          </span>
                          <strong className="text-xs text-slate-800 truncate">
                            {item.alimento.nome}
                          </strong>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-700 leading-tight">
                          {item.status === "apropriado"
                            ? "Adequado para 7-8 meses."
                            : item.alimento.motivo}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {onTentarNovamente && (
            <button
              onClick={() => {
                onTentarNovamente();
                onClose();
              }}
              className="rounded-lg border border-emerald-600 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Tentar novamente
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
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
      <div className="text-[9px] uppercase tracking-wide text-slate-500 leading-tight">
        {label}
      </div>
      <div className="text-lg font-bold leading-tight" style={{ color: cor }}>
        {value}
      </div>
    </div>
  );
}
