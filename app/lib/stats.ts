const STORAGE_KEY = "monte-o-prato-stats";

export type Stats = {
  date: string;
  pratosPerfeitos: number;
  totalValidacoes: number;
};

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function vazio(): Stats {
  return { date: hoje(), pratosPerfeitos: 0, totalValidacoes: 0 };
}

export function lerStats(): Stats {
  if (typeof window === "undefined") return vazio();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return vazio();
    const stats = JSON.parse(raw) as Stats;
    // Reseta se mudou de dia
    if (stats.date !== hoje()) return vazio();
    return stats;
  } catch {
    return vazio();
  }
}

function salvar(stats: Stats) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignora se localStorage não disponível (modo privado, etc.)
  }
}

export function registrarValidacao(perfeito: boolean): Stats {
  const atual = lerStats();
  const proxima: Stats = {
    date: hoje(),
    totalValidacoes: atual.totalValidacoes + 1,
    pratosPerfeitos: atual.pratosPerfeitos + (perfeito ? 1 : 0),
  };
  salvar(proxima);
  return proxima;
}

export function resetarStats(): Stats {
  const v = vazio();
  salvar(v);
  return v;
}
