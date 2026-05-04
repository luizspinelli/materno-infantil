# Monte o Prato da Criança

Jogo educativo de _drag and drop_ para uma dinâmica de feira de nutrição. O participante monta o prato de almoço/jantar de uma criança de **7 a 8 meses** arrastando alimentos para as zonas corretas, e ao final recebe uma avaliação baseada nas regras do **Guia Alimentar para Crianças Brasileiras Menores de 2 Anos** (Ministério da Saúde).

> Otimizado para tablet em modo paisagem (testado no Galaxy Tab S9 FE, ~1280×800).

## Como funciona

A tela apresenta dois pratos:

- **Prato grande** dividido em 4 quadrantes (1 alimento por zona):
  - Cereais ou raízes e tubérculos
  - Feijões
  - Legumes e verduras
  - Carnes e ovos
- **Pratinho menor** ao lado, para uma fruta (complemento opcional)

A coluna direita lista 53 alimentos disponíveis (apropriados e inapropriados, embaralhados a cada carregamento) que o participante arrasta para os pratos.

Ao clicar em **Validar prato**, o jogo classifica o resultado em:

| Nível | Condição |
|---|---|
| 🌟 Perfeito | 4 grupos obrigatórios + nenhum inapropriado |
| ✓ Completo | 4 grupos obrigatórios, mas com algum inapropriado |
| ⚠ Incompleto | Falta algum grupo obrigatório |
| ✕ Inadequado | Falta grupo + tem inapropriados |

E exibe, para cada alimento escolhido, se é adequado para a idade ou o motivo da inadequação (botulismo, açúcar, sódio, ultraprocessado etc.).

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [@dnd-kit](https://dndkit.com) para o drag-and-drop
- [OpenMoji](https://openmoji.org) (CDN) para os ícones de alimentos

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Outros scripts:

```bash
npm run build   # build de produção
npm run start   # servidor de produção
npm run lint    # ESLint
```

## Estrutura

```
app/
├── components/
│   ├── Game.tsx              # Componente raiz do jogo (DnD context, estado)
│   ├── Plate.tsx             # Prato circular com 4 quadrantes
│   ├── Pot.tsx               # Pratinho lateral (frutas)
│   ├── PlateZone.tsx         # Zona droppable genérica
│   ├── Pool.tsx              # Lista de alimentos disponíveis
│   ├── DraggableFood.tsx     # Card de alimento arrastável
│   ├── FoodIcon.tsx          # Renderiza img/svg/emoji do alimento
│   └── ValidationPanel.tsx   # Modal de resultado da validação
├── lib/
│   └── foods.ts              # Dataset de alimentos + validação
├── layout.tsx
└── page.tsx                  # Importa Game dinamicamente (ssr: false)
```

O `Game` é importado via `next/dynamic` com `ssr: false` para evitar _hydration mismatch_ do `@dnd-kit` (gera IDs incrementais entre servidor e cliente).

## Adicionando alimentos

Edite `app/lib/foods.ts` e adicione uma entrada ao array `ALIMENTOS`:

```ts
{
  id: "novo-alimento",
  nome: "Nome exibido no card",
  img: openmoji("1F34E"),       // codepoint hexadecimal do emoji
  categoria: "frutas",          // ou null se inapropriado
  apropriado: true,             // ou false
  motivo: "...",                // obrigatório se apropriado=false
}
```

Codepoints OpenMoji disponíveis em <https://openmoji.org>.

## Créditos

- **Conteúdo nutricional**: [Guia Alimentar para Crianças Brasileiras Menores de 2 Anos](https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_criancas_brasileiras_2anos.pdf) — Ministério da Saúde, 2019
- **Ícones**: [OpenMoji](https://openmoji.org) (CC BY-SA 4.0)
