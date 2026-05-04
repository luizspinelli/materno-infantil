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

### Jogo e validação
- 🎯 **Drag and drop** com `@dnd-kit` — mouse, touch (long-press 300ms para diferenciar de scroll) e teclado (Tab + Espaço/Enter + setas)
- 📊 **Indicador de progresso** "X/4" com bolinhas coloridas das categorias no header, atualizando em tempo real
- 🎉 **Confete animado** + vibração tátil (60ms) quando a validação retorna prato perfeito
- 📳 **Haptic feedback** (20ms) ao soltar um alimento numa zona em dispositivos compatíveis

### Onboarding e exploração
- 👋 **Tutorial sutil**: o primeiro card do pool pulsa em verde até o primeiro drag/scroll/clique
- 🔍 **Modo descoberta** — toggle que troca o drag por _tap to read_: tocar em um alimento abre um popover com nome, grupo e motivo (ideal para a apresentadora explicar item por item)
- 🏷️ **Dicas opcionais** — toggle que mostra emoji + label + cor pastel em cada zona vazia, identificando os grupos

### Operação na feira
- 🔄 **Auto-reset por inatividade** — após 3 minutos sem interação, aviso de 10s ("Voltando à tela inicial em Xs · Continuar jogando"); qualquer toque cancela
- 🏠 **Botão Início** sempre visível no header (limpa tudo e volta à Welcome)
- ↩️ **Limpar com Desfazer** — clicar Limpar mostra um snackbar com opção "Desfazer" por 5s antes de perder o prato
- 📊 **Stats diárias em localStorage** — registra `pratosPerfeitos` e `totalValidacoes`, reseta automaticamente ao virar o dia, mostradas na Welcome
- 🎙️ **Painel da Apresentadora** — triplo toque no título abre painel oculto com: ajuste do tempo de inatividade (1/3/5/10 min ou desligado), opção de pular Welcome, reset do contador, e botão "Montar prato exemplo" (demonstração)

### Acessibilidade (WCAG 2.1 AA)
- ⌨️ **Drag-and-drop por teclado** completo via `KeyboardSensor`
- 🔗 **Skip-link** "Pular para o prato" visível ao foco
- 🪟 **Modais com focus trap**, `Esc` para fechar e restauração de foco no fechamento
- 📢 **Anúncios para leitor de tela** durante drag (`aria-live`)
- 🎚️ **Toggles com `role="switch"`** e `aria-checked`
- 🎯 **Touch targets ≥ 44px** e focus rings em todos elementos interativos
- 🌗 **Respeita `prefers-reduced-motion`** desligando animações

### Plataforma
- 📱 **Responsivo** — adapta layout entre portrait/landscape em qualquer dispositivo (celular, tablet, desktop)
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
│   ├── Game.tsx                 # Componente raiz (DnD, estado, idle, ToggleSwitch, ProgressoGrupos)
│   ├── Welcome.tsx              # Tela inicial com instruções e contador de stats
│   ├── Plate.tsx                # Prato circular com 4 quadrantes
│   ├── Pot.tsx                  # Pratinho lateral (frutas)
│   ├── PlateZone.tsx            # Zona droppable (animação de drop + hint opcional)
│   ├── Pool.tsx                 # Lista de alimentos com scroll, gradient e tutorial
│   ├── DraggableFood.tsx        # Card de alimento (drag handle + pulse de tutorial)
│   ├── FoodIcon.tsx             # Renderiza img/svg/emoji do alimento
│   ├── ValidationPanel.tsx      # Modal de resultado (responsivo, focus trap)
│   ├── FoodInfoPopover.tsx      # Popover do modo descoberta (focus trap)
│   ├── IdleWarning.tsx          # Overlay de countdown antes do auto-reset (focus trap)
│   ├── Snackbar.tsx             # Aviso transitório com ação opcional (Desfazer)
│   └── ServiceWorkerRegister.tsx # Registra o SW em produção
├── lib/
│   ├── foods.ts                 # Dataset de alimentos + validarPrato
│   ├── foods.test.ts            # 13 testes unitários
│   ├── stats.ts                 # Contador diário em localStorage
│   ├── useIdleTimer.ts          # Hook de inatividade (com warning opcional)
│   └── useFocusTrap.ts          # Hook que aprisiona Tab dentro do modal + Esc
├── globals.css                  # Tailwind import + keyframes (fade-in, tutorial-pulse)
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
- **Botão Início**: limpa tudo e volta à Welcome a qualquer momento
- **Limpar com Desfazer**: clique acidental em Limpar pode ser revertido pelos 5s do snackbar
- **Toggle Dicas**: ligue para mostrar emoji + cor em cada zona (útil pra explicar pra primeira vez)
- **Toggle Modo descoberta**: troca o drag por toque pra abrir explicação — bom pra discutir alimento por alimento
- **Stats** acumulam por dia (até virar o dia ou limpar o localStorage)
- **Indicador X/4** no header mostra quantos grupos obrigatórios já foram preenchidos

## Testes

```bash
npm test
```

Cobertura: 13 testes para `validarPrato` (todos os níveis de resultado, deduplicação, ids inválidos) + invariantes do dataset (ids únicos, motivo presente em inapropriados, categoria presente em apropriados).

## Documentação

A pasta [`docs/`](docs/) contém material complementar:

- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) — visão técnica do projeto, fluxos de dados, decisões de arquitetura
- [`CONTENT.md`](docs/CONTENT.md) — base nutricional, critérios de classificação dos alimentos e como adicionar novos
- [`ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) — checklist WCAG 2.1 AA, gaps conhecidos, como testar
- [`DEPLOYMENT.md`](docs/DEPLOYMENT.md) — como hospedar e checklist pré-feira

Para Claude/agentes de IA trabalhando no código, ver [`CLAUDE.md`](CLAUDE.md) com decisões importantes que não devem ser sobrescritas.

## Créditos

- **Conteúdo nutricional**: [Guia Alimentar para Crianças Brasileiras Menores de 2 Anos](https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_criancas_brasileiras_2anos.pdf) — Ministério da Saúde, 2019
- **Ícones**: [OpenMoji](https://openmoji.org) (CC BY-SA 4.0)
