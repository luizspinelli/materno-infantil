# Monte o Prato da Criança

Jogo educativo de _drag and drop_ para uma dinâmica de feira de nutrição. O participante monta o prato de almoço/jantar de uma criança de **7 a 8 meses** arrastando alimentos para as zonas corretas, e ao final recebe uma avaliação baseada nas regras do **Guia Alimentar para Crianças Brasileiras Menores de 2 Anos** (Ministério da Saúde).

PWA otimizado para tablet em modo paisagem (cenário principal de uso), com responsividade completa para celular (portrait/landscape) e desktop.

## Como funciona

A tela apresenta dois pratos:

- **Prato grande** dividido em 4 quadrantes (1 alimento por zona):
  - Cereais ou raízes e tubérculos
  - Feijões
  - Legumes e verduras
  - Carnes e ovos
- **Pratinho menor** ao lado/abaixo, para uma fruta (complemento opcional)

A coluna direita lista 53 alimentos disponíveis (apropriados e inapropriados, embaralhados a cada carregamento) que o participante arrasta para os pratos. Cada zona aceita **1 alimento por vez** — soltar outro substitui o anterior.

Ao clicar em **Validar prato**, o jogo classifica o resultado em:

| Nível | Condição |
|---|---|
| 🌟 Perfeito | 4 grupos obrigatórios + nenhum inapropriado (confete!) |
| ✓ Completo | 4 grupos obrigatórios, mas com algum inapropriado |
| ⚠ Incompleto | Falta algum grupo obrigatório |
| ✕ Inadequado | Falta grupo + tem inapropriados |

E exibe, para cada alimento escolhido, se é adequado para a idade ou o motivo da inadequação (botulismo, açúcar, sódio, ultraprocessado etc.).

## Recursos

- 🎯 **Drag and drop** com `@dnd-kit` (mouse + touch, com long-press de 300ms para diferenciar de scroll)
- 🎉 **Confete animado** quando a validação retorna prato perfeito
- 🔍 **Modo descoberta** — toggle no header que troca o drag por _tap to read_: tocar em qualquer alimento abre um popover com nome, grupo e motivo (ideal para apresentadora explicar item por item)
- 🏷️ **Hints visuais** — cada zona vazia mostra um emoji + label da categoria com a cor correspondente
- 🔄 **Auto-reset por inatividade** — após 3 minutos sem interação, mostra um aviso de 10s ("Voltando à tela inicial em Xs · Continuar jogando") e volta para a Welcome (próximo visitante encontra estado limpo)
- 🏠 **Botão Início** sempre visível no header
- 📊 **Stats diárias em localStorage** — registra `pratosPerfeitos` e `totalValidacoes`, reseta automaticamente ao virar o dia, mostradas na Welcome
- 📱 **Responsivo** — adapta layout entre portrait/landscape em qualquer dispositivo
- 📲 **PWA instalável** — manifest + service worker com cache do app shell e dos ícones OpenMoji para funcionar offline
- 🧪 **Testes unitários** com Vitest cobrindo a lógica de validação e o dataset

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [@dnd-kit](https://dndkit.com) para o drag-and-drop
- [canvas-confetti](https://github.com/catdad/canvas-confetti) para o efeito do prato perfeito
- [OpenMoji](https://openmoji.org) (CDN via jsDelivr) para os ícones de alimentos
- [Vitest](https://vitest.dev) para os testes

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Outros scripts:

```bash
npm run build         # build de produção
npm run start         # servidor de produção
npm run lint          # ESLint
npm test              # roda os testes uma vez
npm run test:watch    # modo watch
```

### Testar offline (PWA)

O service worker só registra em produção:

```bash
npm run build && npm run start
```

Abra no navegador, vá em DevTools → Application → Service Workers (deve estar `activated`), depois desligue o wifi e dê F5 — o app continua funcionando, com ícones cacheados.

## Estrutura

```
app/
├── components/
│   ├── Game.tsx                 # Componente raiz (DnD context, estado, idle timer)
│   ├── Welcome.tsx              # Tela inicial com instruções e contador de stats
│   ├── Plate.tsx                # Prato circular com 4 quadrantes
│   ├── Pot.tsx                  # Pratinho lateral (frutas)
│   ├── PlateZone.tsx            # Zona droppable (com hint visual quando vazia)
│   ├── Pool.tsx                 # Lista de alimentos disponíveis com scroll
│   ├── DraggableFood.tsx        # Card de alimento (arrastável ou clicável)
│   ├── FoodIcon.tsx             # Renderiza img/svg/emoji do alimento
│   ├── ValidationPanel.tsx      # Modal de resultado da validação (responsivo)
│   ├── FoodInfoPopover.tsx      # Popover do modo descoberta
│   ├── IdleWarning.tsx          # Overlay com countdown antes do auto-reset
│   └── ServiceWorkerRegister.tsx # Registra o SW em produção
├── lib/
│   ├── foods.ts                 # Dataset de alimentos + validarPrato
│   ├── foods.test.ts            # 13 testes unitários
│   ├── stats.ts                 # Contador diário em localStorage
│   └── useIdleTimer.ts          # Hook de inatividade (com warning opcional)
├── layout.tsx                   # Metadata, manifest, registro do SW
└── page.tsx                     # Importa Game dinamicamente (ssr: false)

public/
├── manifest.json                # PWA manifest
├── sw.js                        # Service worker (cache do app shell + ícones)
├── icon-192.svg                 # Ícone PWA 192px
└── icon-512.svg                 # Ícone PWA 512px
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

Para alimentos sem equivalente direto no OpenMoji, o `FoodIcon` aceita `emoji: "🍯"` (emoji nativo) ou `svgId: "..."` (SVG inline definido em `FoodIcon.tsx`) como fallbacks.

## Operação na feira

- **Tela cheia**: clique no botão de fullscreen do navegador (F11 / ícone de expandir) para esconder a barra de endereço
- **Layout ideal**: tablet em paisagem
- **Auto-reset**: 3 minutos sem interação → aviso de 10s → volta à Welcome
- **Modo descoberta** ajuda a apresentadora a explicar alimentos individuais sem precisar montar o prato
- **Stats** acumulam por dia (até virar o dia ou limpar o localStorage)

## Testes

```bash
npm test
```

Cobertura: 13 testes para `validarPrato` (todos os níveis de resultado, deduplicação, ids inválidos) + invariantes do dataset (ids únicos, motivo presente em inapropriados, categoria presente em apropriados).

## Créditos

- **Conteúdo nutricional**: [Guia Alimentar para Crianças Brasileiras Menores de 2 Anos](https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_criancas_brasileiras_2anos.pdf) — Ministério da Saúde, 2019
- **Ícones**: [OpenMoji](https://openmoji.org) (CC BY-SA 4.0)
