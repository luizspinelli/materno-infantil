export type Categoria =
  | "cereais"
  | "feijoes"
  | "carnes-ovos"
  | "legumes-verduras"
  | "frutas";

export type Alimento = {
  id: string;
  nome: string;
  emoji?: string;
  svgId?: string;
  img?: string;
  categoria: Categoria | null;
  apropriado: boolean;
  motivo?: string;
};

export const CATEGORIAS: Record<
  Categoria,
  { titulo: string; descricao: string; cor: string; obrigatorio: boolean }
> = {
  cereais: {
    titulo: "Cereais ou raízes e tubérculos",
    descricao: "Arroz, batata, macarrão, mandioca…",
    cor: "#b45309",
    obrigatorio: true,
  },
  feijoes: {
    titulo: "Feijões",
    descricao: "Feijão, lentilha, grão-de-bico…",
    cor: "#92400e",
    obrigatorio: true,
  },
  "carnes-ovos": {
    titulo: "Carnes e ovos",
    descricao: "Frango, ovo, carne, peixe, fígado…",
    cor: "#b91c1c",
    obrigatorio: true,
  },
  "legumes-verduras": {
    titulo: "Legumes e verduras",
    descricao: "Brócolis, cenoura, abóbora, abobrinha…",
    cor: "#15803d",
    obrigatorio: true,
  },
  frutas: {
    titulo: "Frutas (opcional)",
    descricao: "Banana, maçã, mamão, pera, abacate…",
    cor: "#7e22ce",
    obrigatorio: false,
  },
};

const openmoji = (codepoint: string) =>
  `https://cdn.jsdelivr.net/npm/openmoji@15.1.0/color/svg/${codepoint.toUpperCase()}.svg`;

export const ALIMENTOS: Alimento[] = [
  // ===== CEREAIS, RAÍZES E TUBÉRCULOS =====
  { id: "arroz", nome: "Arroz papinha", img: openmoji("1F35A"), categoria: "cereais", apropriado: true },
  { id: "batata", nome: "Batata amassada", img: openmoji("1F954"), categoria: "cereais", apropriado: true },
  { id: "mandioca", nome: "Mandioca cozida", img: openmoji("1F954"), categoria: "cereais", apropriado: true },
  { id: "batata-doce", nome: "Batata-doce", img: openmoji("1F360"), categoria: "cereais", apropriado: true },
  { id: "inhame", nome: "Inhame cozido", img: openmoji("1F954"), categoria: "cereais", apropriado: true },
  { id: "macarrao", nome: "Macarrão bem cozido", img: openmoji("1F35D"), categoria: "cereais", apropriado: true },
  { id: "polenta", nome: "Polenta", img: openmoji("1F33D"), categoria: "cereais", apropriado: true },
  { id: "aveia", nome: "Mingau de aveia", img: openmoji("1F963"), categoria: "cereais", apropriado: true },

  // ===== FEIJÕES =====
  { id: "feijao", nome: "Feijão amassado", img: openmoji("1FAD8"), categoria: "feijoes", apropriado: true },
  { id: "lentilha", nome: "Lentilha", img: openmoji("1FAD8"), categoria: "feijoes", apropriado: true },
  { id: "grao-de-bico", nome: "Grão-de-bico amassado", img: openmoji("1FAD8"), categoria: "feijoes", apropriado: true },
  { id: "feijao-preto", nome: "Feijão preto", img: openmoji("1FAD8"), categoria: "feijoes", apropriado: true },
  { id: "feijao-branco", nome: "Feijão branco", img: openmoji("1FAD8"), categoria: "feijoes", apropriado: true },
  { id: "ervilha", nome: "Ervilha", img: openmoji("1FAD8"), categoria: "feijoes", apropriado: true },

  // ===== CARNES E OVOS =====
  { id: "frango", nome: "Frango desfiado", img: openmoji("1F357"), categoria: "carnes-ovos", apropriado: true },
  { id: "ovo", nome: "Ovo cozido", img: openmoji("1F95A"), categoria: "carnes-ovos", apropriado: true },
  { id: "carne-moida", nome: "Carne moída", img: openmoji("1F969"), categoria: "carnes-ovos", apropriado: true },
  { id: "peixe", nome: "Peixe sem espinha", img: openmoji("1F41F"), categoria: "carnes-ovos", apropriado: true },
  { id: "figado", nome: "Fígado de boi", img: openmoji("1F969"), categoria: "carnes-ovos", apropriado: true },
  { id: "carne-bovina", nome: "Carne bovina", img: openmoji("1F969"), categoria: "carnes-ovos", apropriado: true },
  { id: "salmao", nome: "Salmão", img: openmoji("1F41F"), categoria: "carnes-ovos", apropriado: true },

  // ===== FRUTAS (opcional) =====
  { id: "banana", nome: "Banana amassada", img: openmoji("1F34C"), categoria: "frutas", apropriado: true },
  { id: "maca", nome: "Maçã raspada", img: openmoji("1F34E"), categoria: "frutas", apropriado: true },
  { id: "mamao", nome: "Mamão amassado", img: openmoji("1F96D"), categoria: "frutas", apropriado: true },
  { id: "pera", nome: "Pera amassada", img: openmoji("1F350"), categoria: "frutas", apropriado: true },
  { id: "abacate", nome: "Abacate amassado", img: openmoji("1F951"), categoria: "frutas", apropriado: true },
  { id: "manga", nome: "Manga", img: openmoji("1F96D"), categoria: "frutas", apropriado: true },
  { id: "melancia", nome: "Melancia", img: openmoji("1F349"), categoria: "frutas", apropriado: true },
  { id: "laranja", nome: "Laranja em gomos", img: openmoji("1F34A"), categoria: "frutas", apropriado: true },

  // ===== LEGUMES E VERDURAS =====
  { id: "brocolis", nome: "Brócolis cozido", img: openmoji("1F966"), categoria: "legumes-verduras", apropriado: true },
  { id: "cenoura", nome: "Cenoura cozida", img: openmoji("1F955"), categoria: "legumes-verduras", apropriado: true },
  { id: "abobora", nome: "Abóbora amassada", img: openmoji("1F383"), categoria: "legumes-verduras", apropriado: true },
  { id: "chuchu", nome: "Chuchu cozido", img: openmoji("1F952"), categoria: "legumes-verduras", apropriado: true },
  { id: "abobrinha", nome: "Abobrinha cozida", img: openmoji("1F952"), categoria: "legumes-verduras", apropriado: true },
  { id: "beterraba", nome: "Beterraba", img: openmoji("1F345"), categoria: "legumes-verduras", apropriado: true },
  { id: "couve-flor", nome: "Couve-flor", img: openmoji("1F966"), categoria: "legumes-verduras", apropriado: true },
  { id: "espinafre", nome: "Espinafre cozido", img: openmoji("1F96C"), categoria: "legumes-verduras", apropriado: true },

  // ===== INAPROPRIADOS =====
  {
    id: "salsicha",
    nome: "Salsicha",
    img: openmoji("1F32D"),
    categoria: null,
    apropriado: false,
    motivo: "Ultraprocessado: excesso de sódio, gorduras e conservantes.",
  },
  {
    id: "refrigerante",
    nome: "Refrigerante",
    img: openmoji("1F964"),
    categoria: null,
    apropriado: false,
    motivo: "Açúcar, cafeína e corantes — não recomendado em nenhuma idade infantil.",
  },
  {
    id: "biscoito-recheado",
    nome: "Biscoito recheado",
    img: openmoji("1F36A"),
    categoria: null,
    apropriado: false,
    motivo: "Ultraprocessado com açúcar, gordura e aditivos.",
  },
  {
    id: "mel",
    nome: "Mel",
    img: openmoji("1F36F"),
    categoria: null,
    apropriado: false,
    motivo: "Risco de botulismo infantil — proibido para menores de 1 ano.",
  },
  {
    id: "acucar",
    nome: "Açúcar",
    img: openmoji("1F36C"),
    categoria: null,
    apropriado: false,
    motivo: "Açúcar não deve ser oferecido a menores de 2 anos (Guia Alimentar MS).",
  },
  {
    id: "bala",
    nome: "Bala",
    img: openmoji("1F36C"),
    categoria: null,
    apropriado: false,
    motivo: "Açúcar puro e risco de engasgo.",
  },
  {
    id: "chocolate",
    nome: "Chocolate",
    img: openmoji("1F36B"),
    categoria: null,
    apropriado: false,
    motivo: "Açúcar e cafeína — não recomendado para menores de 2 anos.",
  },
  {
    id: "achocolatado",
    nome: "Achocolatado em pó",
    img: openmoji("1F36B"),
    categoria: null,
    apropriado: false,
    motivo: "Ultraprocessado rico em açúcar.",
  },
  {
    id: "iogurte-acucar",
    nome: "Iogurte com açúcar",
    img: openmoji("1F366"),
    categoria: null,
    apropriado: false,
    motivo: "Açúcar adicionado e aromatizantes.",
  },
  {
    id: "cereal-acucarado",
    nome: "Cereal matinal açucarado",
    img: openmoji("1F963"),
    categoria: null,
    apropriado: false,
    motivo: "Ultraprocessado rico em açúcar.",
  },
  {
    id: "miojo",
    nome: "Macarrão instantâneo",
    img: openmoji("1F35C"),
    categoria: null,
    apropriado: false,
    motivo: "Excesso de sódio e aditivos químicos.",
  },
  {
    id: "nuggets",
    nome: "Nuggets",
    img: openmoji("1F357"),
    categoria: null,
    apropriado: false,
    motivo: "Ultraprocessado com sódio, gorduras e aditivos.",
  },
  {
    id: "salgadinho",
    nome: "Salgadinho de pacote",
    img: openmoji("1F968"),
    categoria: null,
    apropriado: false,
    motivo: "Excesso de sódio, gorduras e aditivos. Risco de engasgo.",
  },
  {
    id: "cafe",
    nome: "Café",
    img: openmoji("2615"),
    categoria: null,
    apropriado: false,
    motivo: "Cafeína não é recomendada para crianças pequenas.",
  },
  {
    id: "suco-caixinha",
    nome: "Suco de caixinha",
    img: openmoji("1F9C3"),
    categoria: null,
    apropriado: false,
    motivo: "Açúcar adicionado e poucos nutrientes da fruta.",
  },
  {
    id: "bolo-industrial",
    nome: "Bolo industrializado",
    img: openmoji("1F370"),
    categoria: null,
    apropriado: false,
    motivo: "Ultraprocessado com açúcar, gorduras e conservantes.",
  },
];

export type ResultadoItem = {
  alimento: Alimento;
  status: "apropriado" | "inapropriado";
};

export type ResultadoGrupo = {
  categoria: Categoria;
  presente: boolean;
  obrigatorio: boolean;
};

export type NivelPrato = "perfeito" | "bom" | "incompleto" | "ruim" | "vazio";

export type Resultado = {
  itens: ResultadoItem[];
  grupos: ResultadoGrupo[];
  apropriados: number;
  inapropriados: number;
  total: number;
  obrigatoriosPresentes: number;
  obrigatoriosFaltando: Categoria[];
  pratoCompleto: boolean;
  temFruta: boolean;
  nivel: NivelPrato;
  mensagem: string;
};

const TODAS_CATEGORIAS: Categoria[] = [
  "cereais",
  "feijoes",
  "carnes-ovos",
  "legumes-verduras",
  "frutas",
];

export function validarPrato(
  prato: Record<Categoria, string[]>,
  alimentos: Alimento[] = ALIMENTOS
): Resultado {
  const porId = new Map(alimentos.map((a) => [a.id, a]));
  const itens: ResultadoItem[] = [];
  const vistos = new Set<string>();
  const apropriadosPorCategoria = new Map<Categoria, number>();

  (Object.keys(prato) as Categoria[]).forEach((zona) => {
    prato[zona].forEach((id) => {
      if (vistos.has(id)) return;
      vistos.add(id);
      const alimento = porId.get(id);
      if (!alimento) return;
      const status: ResultadoItem["status"] = alimento.apropriado
        ? "apropriado"
        : "inapropriado";
      itens.push({ alimento, status });
      if (alimento.apropriado && alimento.categoria) {
        apropriadosPorCategoria.set(
          alimento.categoria,
          (apropriadosPorCategoria.get(alimento.categoria) ?? 0) + 1
        );
      }
    });
  });

  const grupos: ResultadoGrupo[] = TODAS_CATEGORIAS.map((categoria) => ({
    categoria,
    presente: (apropriadosPorCategoria.get(categoria) ?? 0) > 0,
    obrigatorio: CATEGORIAS[categoria].obrigatorio,
  }));

  const obrigatorios = grupos.filter((g) => g.obrigatorio);
  const obrigatoriosPresentes = obrigatorios.filter((g) => g.presente).length;
  const obrigatoriosFaltando = obrigatorios
    .filter((g) => !g.presente)
    .map((g) => g.categoria);
  const pratoCompleto = obrigatoriosPresentes === obrigatorios.length;
  const temFruta = grupos.find((g) => g.categoria === "frutas")?.presente ?? false;
  const apropriados = itens.filter((i) => i.status === "apropriado").length;
  const inapropriados = itens.filter((i) => i.status === "inapropriado").length;
  const total = itens.length;

  let nivel: NivelPrato;
  let mensagem: string;
  if (total === 0) {
    nivel = "vazio";
    mensagem = "O prato está vazio. Arraste alguns alimentos antes de validar!";
  } else if (pratoCompleto && inapropriados === 0) {
    nivel = "perfeito";
    mensagem = temFruta
      ? "Prato perfeito! Contém os 4 grupos obrigatórios e ainda incluiu fruta como complemento — exatamente como recomenda o Guia Alimentar."
      : "Prato perfeito! Contém os 4 grupos obrigatórios. Você ainda pode adicionar uma fruta como complemento da refeição.";
  } else if (pratoCompleto && inapropriados > 0) {
    nivel = "bom";
    mensagem = `Os 4 grupos obrigatórios estão presentes, mas o prato contém ${inapropriados} alimento(s) que não devem ser oferecidos a crianças de 7 a 8 meses. Veja os detalhes abaixo.`;
  } else if (!pratoCompleto && inapropriados === 0) {
    nivel = "incompleto";
    mensagem = `Os alimentos escolhidos são adequados, mas faltam ${obrigatoriosFaltando.length} grupo(s) obrigatório(s) para o almoço/jantar.`;
  } else {
    nivel = "ruim";
    mensagem = `O prato está incompleto e contém alimentos inadequados. Faltam ${obrigatoriosFaltando.length} grupo(s) obrigatório(s) e há ${inapropriados} item(ns) que não devem ser oferecidos.`;
  }

  return {
    itens,
    grupos,
    apropriados,
    inapropriados,
    total,
    obrigatoriosPresentes,
    obrigatoriosFaltando,
    pratoCompleto,
    temFruta,
    nivel,
    mensagem,
  };
}
