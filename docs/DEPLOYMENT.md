# Deploy e operação na feira

Como colocar o Monte o Prato no ar e prepará-lo para uso em uma feira.

## Opções de hospedagem

### 1. Vercel (recomendado, mais simples)

Por ser projeto Next.js padrão:

```bash
npx vercel
# segue o wizard, escolhe scope, projeto e ambiente
```

Cada push na branch `main` no GitHub faz deploy automático após conectar o repositório em <https://vercel.com>.

**Free tier:** suficiente. O app é leve e quase todo o tráfego é dos ícones (que vêm via CDN do jsDelivr, não da Vercel).

### 2. Cloudflare Pages

```bash
npm run build
# deploy via Cloudflare Wrangler ou conectando o repo
```

Vantagem: mais generoso em bandwidth no free tier.

### 3. Self-hosted

```bash
npm install
npm run build
npm run start
# por padrão escuta em http://localhost:3000
```

Para feira, basta rodar isso num laptop conectado à internet do estande, e abrir o IP local no tablet (`http://192.168.x.x:3000`).

> ⚠️ Necessário **HTTPS** para o Service Worker funcionar (e portanto pra ser PWA instalável). Se for hospedar você mesmo, use um proxy (Caddy, Nginx) com Let's Encrypt, ou um túnel tipo `cloudflared`/`ngrok`.

## Checklist pré-feira

### Uma semana antes

- [ ] Validar conteúdo do dataset (`app/lib/foods.ts`) com a nutricionista responsável (Amanda)
- [ ] Subir versão final em produção (Vercel ou similar)
- [ ] Acessar a URL no tablet que será usado, em paisagem
- [ ] **Instalar como PWA** (Chrome → ⋮ → "Adicionar à tela inicial")
- [ ] Abrir o app instalado e validar todos os fluxos:
  - Welcome → Começar
  - Arrastar 4 alimentos válidos + 1 fruta → Validar (espera "Prato Perfeito")
  - Adicionar 1 ultraprocessado → Validar (espera "Prato Completo" ou "Inadequado")
  - Botão Limpar → Snackbar Desfazer (espera reverter)
  - Toggle Dicas → ver hints aparecendo
  - Toggle Modo descoberta → tap em alimento → popover
  - Botão Início → volta à Welcome
  - Esperar 3 minutos → ver IdleWarning → não tocar → reset

### Um dia antes

- [ ] Carregar o tablet 100%
- [ ] Testar **modo offline** (PWA): em DevTools → Network → Offline + reload
- [ ] Levar:
  - Tablet em capa robusta + cabo de carregamento
  - Powerbank de 20.000mAh (estande sem tomada)
  - Suporte para o tablet (de mesa, ângulo confortável)
  - Pano de microfibra (limpeza de tela entre visitantes)

### No dia

- [ ] Conectar wifi do evento ANTES de abrir o app (pra primeira carga dos OpenMojis)
- [ ] Abrir em **modo paisagem** + **fullscreen** (botão de fullscreen do navegador ou do app PWA)
- [ ] Confirmar que o auto-reset está ativo (3 min sem interação)
- [ ] Bloquear rotação automática do tablet pra evitar virar acidentalmente

## Configurações do tablet recomendadas

- **Tela**: brilho máximo, suficiente para feira iluminada
- **Tempo de tela**: NUNCA dormir (Configurações → Tela → Suspensão → Nunca)
- **Rotação**: bloqueada em paisagem
- **Notificações**: silenciar todas (modo Não Perturbe / DnD)
- **Modo quiosque** (opcional, Android): apps tipo SureLock travam o tablet no app
- **Esconder barra de status** se possível (só o app visível)

## Variáveis e configurações do app

Não há `.env` necessário.

### Configurações ajustáveis pela apresentadora (em runtime)

Acessíveis pelo **Painel da Apresentadora**: triplo toque no título "Monte o Prato da Criança" no header. Persiste em `localStorage`.

| Configuração | Padrão | Opções |
|---|---|---|
| Tempo de inatividade | 3 min | 1 min · 3 min · 5 min · 10 min · Desligado |
| Pular tela de boas-vindas | Desligado | Liga/desliga (no auto-reset, vai direto pro jogo) |
| Resetar contador de stats | — | Botão (com confirmação) |
| Demonstrar prato perfeito | — | Monta automático um prato exemplo |

### Configurações fixas no código

| Variável | Onde | Padrão | Quando alterar |
|---|---|---|---|
| `IDLE_WARNING_MS` | `Game.tsx` | 10s | Mais tempo se a maioria for idoso |
| Cores das categorias | `foods.ts` | — | Branding diferente |

Se precisar mudar uma das fixas, edite, dê commit, build, deploy.

## Performance esperada

- **First Contentful Paint** < 1.5s na 4G (Vercel CDN)
- **Time to Interactive** ~2-3s (bundle tem `@dnd-kit` + `canvas-confetti`)
- **Bundle JS**: ~150 kB gzipped (estimado)
- **Imagens OpenMoji**: ~3-5 kB cada, lazy-loaded, cacheadas pelo SW após primeira visita

## Operação durante a feira

Veja [README.md → Operação na feira](../README.md#operação-na-feira).

## Plano B se algo der errado

| Problema | Solução rápida |
|---|---|
| Wifi caiu no meio do dia | App continua funcionando offline (PWA já cacheado) |
| Imagens não aparecem (SW não cacheou) | Recarregue 1-2 vezes, OpenMojis carregam e ficam cacheados |
| Tablet travou ou app não responde | Force close + reabrir; estado é em memória, perde só o prato em construção |
| Visitante anterior deixou o app num estado estranho | Botão Início no header zera tudo |
| Stats sumiram | Reset automático no virar do dia (UTC) — esperado |

## Pós-feira

- Exportar stats: abra DevTools → Console → `JSON.parse(localStorage.getItem("monte-o-prato-stats"))`
- Feedback dos visitantes: anotar manualmente perguntas frequentes pra alimentar próxima rodada de melhorias
- Backup do tablet: nada precisa ser salvo (PWA é stateless por design)
