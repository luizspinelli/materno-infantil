const STORAGE_KEY = "monte-o-prato-stats";
const CONFIG_KEY = "monte-o-prato-config";

export type Stats = {
  date: string;
  pratosPerfeitos: number;
  totalValidacoes: number;
};

export type AppConfig = {
  // Idle timeout em ms; null = desligado
  idleTimeoutMs: number | null;
  // Pular a tela de Welcome no auto-reset (vai direto pro jogo)
  pularWelcome: boolean;
};

const CONFIG_DEFAULT: AppConfig = {
  idleTimeoutMs: 3 * 60 * 1000,
  pularWelcome: false,
};

export function lerConfig(): AppConfig {
  if (typeof window === "undefined") return CONFIG_DEFAULT;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return CONFIG_DEFAULT;
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return { ...CONFIG_DEFAULT, ...parsed };
  } catch {
    return CONFIG_DEFAULT;
  }
}

export function salvarConfig(config: AppConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignora
  }
}

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
