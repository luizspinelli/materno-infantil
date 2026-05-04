# Arquitetura

Documento técnico explicando como o projeto está organizado e por quê. Para entender _o quê_ o jogo faz, leia o [README.md](../README.md).

## Visão geral

```
┌─────────────────────────────────────────────────────────┐
│  Browser (PWA instalável)                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Service Worker (sw.js)                          │   │
│  │  - Network-first: app shell                      │   │
│  │  - Cache-first: ícones do OpenMoji               │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js App Router (Client Components)          │   │
│  │                                                  │   │
│  │  page.tsx ── dynamic ssr:false ──► Game.tsx      │   │
│  │                                                  │   │
│  │  Game ── DndContext ── Plate / Pot / Pool        │   │
│  │       ├── ValidationPanel                        │   │
│  │       ├── FoodInfoPopover                        │   │
│  │       ├── IdleWarning                            │   │
│  │       └── Snackbar                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  localStorage: stats diárias                            │
└─────────────────────────────────────────────────────────┘
```

## Por que `ssr: false` no `Game`?

`@dnd-kit` gera IDs incrementais (`DndDescribedBy-N`) durante o render. Quando o Next.js renderiza o componente no servidor e depois no cliente, o contador começa de pontos diferentes → IDs divergentes → `Hydration mismatch`.

**Solução adotada:** `app/page.tsx` importa `Game` via `next/dynamic` com `ssr: false`. O bundle do jogo só roda no cliente, eliminando o conflito.

**Trade-off:** primeira tela (a Welcome) também precisa esperar o JS carregar. Em troca, a confiabilidade é total.

## Modelo de estado

Tudo vive em `Game.tsx` via `useState`. Não há Redux/Zustand/Context API; o jogo é simples o bastante para que prop drilling de 1-2 níveis seja saudável.

### Estado principal

```ts
type PratoState = {
  cereais: string[];          // sempre 0 ou 1 item (1 alimento por zona)
  feijoes: string[];
  "carnes-ovos": string[];
  "legumes-verduras": string[];
  frutas: string[];
};
```

### Estados auxiliares

| Estado | Função |
|---|---|
| `iniciado` | Controla se mostra Welcome ou Game |
| `activeId` | ID do alimento sendo arrastado (drag overlay) |
| `resultado` | Resultado da última validação (abre o modal quando truthy) |
| `modoDescoberta` | Liga tap-to-read e desabilita o drag |
| `dicasAtivas` | Mostra hints visuais nas zonas vazias |
| `alimentoInspecao` | Alimento sendo lido no popover (modo descoberta) |
| `avisoIdle` | Mostra o overlay de countdown antes do auto-reset |
| `snackbar` | Mensagem transitória (ex: "Limpar · Desfazer") |
| `tutorial` | Anima o primeiro card até primeira interação |

## Fluxos principais

### 1. Drag and drop

```
useDraggable (DraggableFood)
  └─► onDragStart: setActiveId
  └─► onDragEnd: setPrato
                 ├── remove o id de qualquer zona anterior
                 ├── se destino === "pool", para aqui (devolve ao pool)
                 └── senão, sobrescreve a zona destino com [id]
                 └── vibrar(20) se foi pra uma zona do prato
```

### 2. Validação

```
botão Validar → validarPrato(prato)
                 ├── conta apropriados/inapropriados/grupos presentes
                 ├── decide nível (perfeito/bom/incompleto/ruim/vazio)
                 └── monta mensagem
                 └── retorna Resultado
              → setResultado(r)
              → registrarValidacao(perfeito) → atualiza localStorage
              → useEffect dispara confete se nivel === "perfeito"
              → vibrar(60) se perfeito
```

### 3. Auto-reset

```
useIdleTimer (3 min com warning de 10s antes)
  ├── qualquer evento (pointer/key/touch/wheel) reseta o timer
  ├── 10s antes do reset → onWarning → mostra IdleWarning overlay
  ├── interação cancela o warning E o reset
  └── se timer estourar → voltarAoInicio (limpa tudo, vai pra Welcome)
```

## Componentes

| Componente | Responsabilidade |
|---|---|
| `Game` | Orquestrador: estado, sensors, handlers, monta header e seções |
| `Welcome` | Tela inicial, exibe stats diárias |
| `Plate` | SVG do prato circular + 4 PlateZones absolutamente posicionados |
| `Pot` | SVG do pratinho + 1 PlateZone (frutas) |
| `PlateZone` | Zona droppable; renderiza alimentos OU hint quando vazia + dicas ativas |
| `Pool` | Lista scrollável; passa flag `pulse` pra primeiro card durante tutorial |
| `DraggableFood` | Card arrastável (ou button quando em modo descoberta) |
| `FoodIcon` | Decide entre `<img>` (OpenMoji), SVG inline ou emoji nativo |
| `ValidationPanel` | Modal de resultado (responsivo, focus trap) |
| `FoodInfoPopover` | Popover do modo descoberta |
| `IdleWarning` | Overlay com countdown |
| `Snackbar` | Aviso transitório no canto inferior |
| `ServiceWorkerRegister` | Registra `/sw.js` apenas em produção |
| `PresenterPanel` | Painel oculto da apresentadora (acesso por triplo toque no título); ajusta idle timeout, pular Welcome, monta prato exemplo, reseta stats |

## Hooks customizados

### `useIdleTimer(timeoutMs, onIdle, enabled, options?)`

Hook único que gerencia inatividade. Aceita opcionalmente `warningMs`, `onWarning`, `onActive` para emitir um aviso N ms antes do `onIdle` e notificar quando há atividade (pra fechar o aviso).

### `useTripleTap(onTriple, windowMs?)`

Retorna um handler `onClick` que dispara `onTriple` quando 3 cliques acontecem dentro de `windowMs` (padrão 1000 ms). Usado pra acessar o `PresenterPanel` sem expor controle na UI.

### `useFocusTrap({ enabled, onEscape })`

Retorna uma `ref` para anexar ao container do modal. Quando montado:
1. Move o foco para o primeiro elemento focável dentro do container
2. Tab/Shift+Tab cicla apenas dentro do container
3. Esc dispara `onEscape`
4. Ao desmontar, restaura o foco para o elemento que estava ativo antes

## Dataset (`app/lib/foods.ts`)

53 alimentos, divididos em:

- **37 apropriados** (8 cereais + 6 feijões + 7 carnes/ovos + 8 legumes + 8 frutas)
- **16 inapropriados** (com `motivo` obrigatório)

Cada alimento aponta para uma imagem de duas formas:

- `img: openmoji("1F35A")` — preferido, vai pro CDN jsDelivr
- `emoji: "🍯"` — fallback nativo
- `svgId: "refrigerante"` — fallback inline (ver `FoodIcon.tsx`)

A função `validarPrato` é **pura e testada** (13 testes em `foods.test.ts`).

## Service worker

Estratégia em `public/sw.js`:

| Recurso | Estratégia |
|---|---|
| App shell (HTML, JS, CSS, manifest, ícones do PWA) | Network-first + fallback ao cache |
| `cdn.jsdelivr.net/npm/openmoji@*` | Cache-first (imagens são imutáveis) |

Versão do cache em `VERSION = "v1"`. Bumping invalida e re-popula.

> ⚠️ Cache dos OpenMojis é **lazy** — só popula após o primeiro carregamento. A primeira visita offline não terá os ícones se ainda não tiverem sido cacheados antes. Item de backlog para pré-cachear no `install`.

## Testes

```bash
npm test
```

Cobertura em `app/lib/foods.test.ts`:

- `validarPrato`: todos os 5 níveis (perfeito, bom, incompleto, ruim, vazio)
- Deduplicação de alimentos repetidos
- Tratamento de IDs inválidos
- Inclusão de motivo nos inapropriados
- Invariantes do dataset (ids únicos, motivo obrigatório, etc.)

**Não há testes E2E** ainda. Para a feira, foi priorizado validação humana.

## Build e deploy

- `npm run build` → output em `.next/`
- `npm run start` → servidor de produção (necessário pra testar SW)
- Pode ser hospedado em **Vercel**, **Cloudflare Pages**, ou qualquer Node host
- Funciona offline após primeira visita (PWA)

Veja [DEPLOYMENT.md](DEPLOYMENT.md) para detalhes operacionais.
