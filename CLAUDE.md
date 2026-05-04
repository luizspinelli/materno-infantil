@AGENTS.md

# Monte o Prato da Criança — guia para o Claude

PWA Next.js de drag-and-drop educativo, baseado no **Guia Alimentar para Crianças Brasileiras Menores de 2 Anos** (Ministério da Saúde). Usado como dinâmica em feira de nutrição. Stakeholder principal: Amanda (nutricionista).

## Decisões importantes (não sobrescrever sem checar)

- **`page.tsx` importa `Game` via `next/dynamic` com `ssr: false`** — necessário porque o `@dnd-kit` gera IDs incrementais que causam hydration mismatch entre servidor e cliente. Não tente voltar para SSR.
- **Idade-alvo: 7-8 meses fixo.** Faixas etárias diferentes (6m, 9-11m, 12m+) têm regras diferentes no guia e não estão implementadas.
- **4 grupos obrigatórios** (cereais, feijões, carnes-ovos, legumes-verduras) + **frutas opcional** — esse é o modelo do guia para almoço/jantar a partir de 7-8 meses, não invente outras categorias.
- **1 alimento por zona.** Soltar outro substitui o anterior. Comportamento intencional, não bug.
- **ID interno `"carnes-ovos"` foi mantido** mesmo após o rótulo virar "Proteínas". Renomear o ID quebra 13 testes e o estado.
- **OpenMoji via CDN jsDelivr** com fallback para emoji nativo / SVG inline. Quando adicionar alimento novo, valide o codepoint contra `https://cdn.jsdelivr.net/npm/openmoji@15.1.0/color/svg/<HEX>.svg` antes — `1FADD` e `1FADC` retornam 404, evite.
- **Stack**: Next.js 16 (App Router) + Tailwind v4 + @dnd-kit + canvas-confetti + Vitest. Não adicionar libs pesadas (framer-motion, etc.) sem motivo forte; CSS keyframes em `globals.css` resolvem a maioria dos casos.

## Arquitetura mental

```
page.tsx → dynamic Game (ssr:false)
  Game.tsx
    ├── DndContext (PointerSensor + TouchSensor delay 300ms + KeyboardSensor)
    ├── Welcome (até iniciar)
    ├── Skip-link
    ├── Header (Início + título + ProgressoGrupos + 2 ToggleSwitch)
    ├── section "prato" (Plate + Pot + controles)
    ├── section pool (Pool com scroll interno)
    ├── DragOverlay rotacionado
    ├── ValidationPanel | FoodInfoPopover | IdleWarning | Snackbar
    └── aria-live anunciando drag
```

## Padrões a seguir

- **Sempre fazer commit + push após concluir alterações** (memória do usuário). Mensagens em inglês, descritivas, com co-author do Claude.
- **Mantendo dois toggles independentes** ("Dicas" e "Modo descoberta"). Ambos default `false` e resetam ao voltar à Welcome.
- **Modais** seguem o mesmo padrão: `useFocusTrap`, `role="dialog"` (ou `"alertdialog"`), `aria-modal`, `aria-labelledby`, botão fechar 44×44px, fechar com ESC.
- **Responsividade** usa `portrait:` / `landscape:` modifiers do Tailwind, não breakpoints `sm:/md:` para o split principal — porque a divisão real é orientação (landscape = lado a lado, portrait = empilhado), não largura.
- **Tamanhos de prato/pote** usam `min(vh, vw, max-px)` para respeitar altura E largura disponíveis.
- **Acessibilidade WCAG 2.1 AA** já é a baseline. Antes de mexer em qualquer botão/input/modal, garantir focus ring visível, aria-label, touch target ≥44px.
- **Animações** respeitam `prefers-reduced-motion` (definido em `globals.css`).
- **Antes de mudar a lógica de `validarPrato`**, rodar `npm test` — 13 testes cobrem todos os níveis e invariantes do dataset.

## Comandos úteis

```bash
npm run dev          # dev server
npm run build        # build (também é onde o SW vira ativo)
npm run start        # servidor de produção (testar PWA offline aqui)
npm test             # vitest run (rápido, sem watch)
npm run test:watch   # vitest watch
npx tsc --noEmit     # type check
```

## Onde NÃO mexer sem motivo

- `app/lib/foods.ts` linha 1-65 (tipos e CATEGORIAS) — usado em todos os componentes e nos testes
- `app/page.tsx` — só faz dynamic import do Game; mexer aqui pode reintroduzir hydration mismatch
- `public/sw.js` — service worker tem versão; mudar a estratégia de cache pode quebrar o offline
- `next.config.ts` — está com defaults; adicionar config sem necessidade pode quebrar Turbopack

## Próximos passos plausíveis (backlog mental)

- Take-away pós-validação perfeita (frases-bala "para levar pra casa")
- Faixas etárias (6m, 9-11m, 12m+) — multiplica dataset
- Gerar PNG do prato montado pra "compartilhar/salvar"
- Dashboard de stats com gráfico do dia
- GitHub Actions rodando lint+test em PRs
- Pré-cache dos OpenMojis no install do SW (hoje só cacheia após primeira carga)
