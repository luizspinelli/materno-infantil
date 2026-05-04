"use client";

import { useEffect, useState } from "react";
import { useFocusTrap } from "../lib/useFocusTrap";
import {
  type AppConfig,
  type Stats,
  lerStats,
  resetarStats,
  salvarConfig,
} from "../lib/stats";

type Props = {
  config: AppConfig;
  onConfigChange: (c: AppConfig) => void;
  onDemonstrar: () => void;
  onClose: () => void;
};

const IDLE_OPCOES: { label: string; value: number | null }[] = [
  { label: "1 min", value: 60_000 },
  { label: "3 min", value: 3 * 60_000 },
  { label: "5 min", value: 5 * 60_000 },
  { label: "10 min", value: 10 * 60_000 },
  { label: "Desligado", value: null },
];

export function PresenterPanel({ config, onConfigChange, onDemonstrar, onClose }: Props) {
  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: true, onEscape: onClose });
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(lerStats());
  }, []);

  function aplicarConfig(parcial: Partial<AppConfig>) {
    const next = { ...config, ...parcial };
    onConfigChange(next);
    salvarConfig(next);
  }

  function resetar() {
    const ok = window.confirm("Apagar as estatísticas de hoje? Esta ação não pode ser desfeita.");
    if (!ok) return;
    setStats(resetarStats());
  }

  const taxaPerfeito =
    stats && stats.totalValidacoes > 0
      ? Math.round((stats.pratosPerfeitos / stats.totalValidacoes) * 100)
      : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="presenter-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
    >
      <div
        ref={trapRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl flex flex-col gap-4"
      >
        <button
          onClick={onClose}
          aria-label="Fechar painel da apresentadora"
          className="absolute top-2 right-2 w-11 h-11 rounded-full text-base text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center"
        >
          ✕
        </button>

        <div>
          <h2 id="presenter-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            🎙️ Painel da Apresentadora
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acessível via triplo toque no título do jogo. Não é mostrado aos visitantes.
          </p>
        </div>

        {/* Stats */}
        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
            Estatísticas de hoje
          </h3>
          {stats && stats.totalValidacoes > 0 ? (
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Validações" value={String(stats.totalValidacoes)} cor="#475569" />
              <Stat label="Perfeitos" value={String(stats.pratosPerfeitos)} cor="#15803d" />
              <Stat label="Taxa" value={`${taxaPerfeito}%`} cor="#0ea5e9" />
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">Nenhuma validação registrada ainda.</p>
          )}
          <button
            onClick={resetar}
            disabled={!stats || stats.totalValidacoes === 0}
            className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resetar contador
          </button>
        </section>

        {/* Configurações */}
        <section className="rounded-xl border border-slate-200 p-4 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">
            Configurações
          </h3>

          {/* Idle timeout */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Tempo de inatividade
              </label>
              <span className="text-[11px] text-slate-500">volta à tela inicial</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {IDLE_OPCOES.map((op) => {
                const ativo = config.idleTimeoutMs === op.value;
                return (
                  <button
                    key={op.label}
                    type="button"
                    onClick={() => aplicarConfig({ idleTimeoutMs: op.value })}
                    aria-pressed={ativo}
                    className={
                      "rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 " +
                      (ativo
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")
                    }
                  >
                    {op.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pular Welcome */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.pularWelcome}
              onChange={(e) => aplicarConfig({ pularWelcome: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div>
              <div className="text-sm font-semibold text-slate-700">
                Pular tela de boas-vindas
              </div>
              <div className="text-[11px] text-slate-500">
                No auto-reset, vai direto para o jogo (sem passar pela Welcome)
              </div>
            </div>
          </label>
        </section>

        {/* Demonstração */}
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800 mb-2">
            Demonstração
          </h3>
          <p className="text-xs text-slate-700 mb-3">
            Monta automaticamente um prato perfeito (1 alimento de cada grupo obrigatório + 1 fruta)
            para você usar como exemplo durante a apresentação.
          </p>
          <button
            onClick={() => {
              onDemonstrar();
              onClose();
            }}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            Montar prato exemplo
          </button>
        </section>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, cor }: { label: string; value: string; cor: string }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-500 leading-tight">
        {label}
      </div>
      <div className="text-xl font-bold leading-tight" style={{ color: cor }}>
        {value}
      </div>
    </div>
  );
}
