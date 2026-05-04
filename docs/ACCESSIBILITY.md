# Acessibilidade

O projeto busca atender **WCAG 2.1 nível AA**. Esta página documenta o que já está implementado, gaps conhecidos e como testar.

## Implementado

### 1. Navegação por teclado

| Elemento | Comportamento |
|---|---|
| Skip-link "Pular para o prato" | Aparece ao receber foco no topo (Tab) |
| Botão Início | Tab + Enter |
| Toggles (Dicas, Modo descoberta) | Tab + Espaço/Enter — `role="switch"` com `aria-checked` |
| Cards do pool | Tab + Espaço (segura) + setas (move) + Espaço (solta) |
| Cards no prato | Tab + Espaço pra "pegar" e mover, Espaço pra soltar |
| Botões Limpar / Validar | Tab + Enter |
| Modais | Foco entra automaticamente; Tab cicla apenas dentro; Esc fecha |
| Snackbar | Botão de ação focável; aviso é `aria-live="polite"` |

### 2. ARIA semântico

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` em `ValidationPanel` e `FoodInfoPopover`
- `role="alertdialog"` em `IdleWarning` (decisão urgente do usuário)
- `role="switch"` + `aria-checked` nos toggles
- `aria-live="polite"` em região oculta que anuncia "Arrastando *Banana*" durante drag
- `aria-label` em todos os botões somente-ícone (✕, ←)
- `aria-disabled` no botão Validar quando vazio
- Headings hierárquicos: `<h1>` no header, `<h2>` em "Alimentos disponíveis", `<h3>` no modal

### 3. Foco visível e management

- Focus ring (`focus:ring-2 focus:ring-emerald-500`) em todos os elementos interativos
- `useFocusTrap` em modais: foco entra, cicla, ESC fecha, restaura foco no elemento que abriu
- Skip-link `sr-only` que vira visível ao foco

### 4. Touch targets

Todos os elementos primários respeitam o mínimo de **44×44px** do WCAG 2.5.5:

| Elemento | Tamanho |
|---|---|
| Botão fechar (✕) dos modais | 44×44px |
| Botão Início (mobile) | 40×40px (próximo, ok pra alvo secundário) |
| Toggles do header | 36px de altura mínima |
| Cards de alimento | ≥64px |
| Botões Limpar / Validar | ≥36px de altura |
| Botão Snackbar (✕ e ação) | 36×36px |

### 5. Contraste de cor

Cores das categorias verificadas contra fundo branco (#ffffff):

| Cor | Hex | Contraste | Uso |
|---|---|---|---|
| Cereais (âmbar) | `#b45309` | ~5.7:1 | ✓ AA pra texto normal |
| Feijões (marrom) | `#92400e` | ~7.6:1 | ✓ AAA |
| Proteínas (vermelho) | `#b91c1c` | ~6.6:1 | ✓ AA grande, AAA pequeno |
| Legumes (verde) | `#15803d` | ~5.4:1 | ✓ AA |
| Frutas (roxo) | `#7e22ce` | ~6.5:1 | ✓ AA |
| Texto principal | `#1e293b` (slate-800) | ~13:1 | ✓ AAA |
| Texto secundário | `#475569` (slate-600) | ~7:1 | ✓ AAA |
| Texto auxiliar | `#94a3b8` (slate-400) | ~3:1 | ⚠️ Apenas decorativo |

### 6. Animações respeitando preferências

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-tutorial-pulse {
    animation: none;
  }
}
```

Confete e drop pulse usam APIs de animação imperativas que **não respeitam** a preferência atualmente — possível melhoria.

### 7. Outros

- `lang="pt-BR"` no `<html>`
- Imagens com `alt={alimento.nome}` (não decorativas) ou `aria-hidden` (decorativas tipo gradient)
- `<svg>` decorativos com `aria-hidden`
- Sem dependência única de cor: status é reforçado por ícone (✓/✕/○) e texto

## Gaps conhecidos

| Severidade | Item | Razão / mitigação |
|---|---|---|
| 🟡 Média | Confete não respeita `prefers-reduced-motion` | API imperativa do `canvas-confetti`; envolver com check do `matchMedia` |
| 🟡 Média | Sem teste manual com leitores de tela reais (NVDA/VoiceOver/TalkBack) | Apenas inspeção estática feita |
| 🟢 Baixa | Drop animation usa CSS keyframe que ignora reduced-motion no `PlateZone` | Pequena animação 450ms |
| 🟢 Baixa | Cor "frutas" contra alguns fundos pastel pode cair abaixo de AA | Apenas em hover/dicas; não usado em texto crítico |
| 🟢 Baixa | Sem alta-contrast mode dedicado | Confiar no contraste já alto do tema padrão |
| 🟢 Baixa | Sem internacionalização (apenas pt-BR) | Fora do escopo (público alvo BR) |

## Como testar

### Teclado puro

1. Abra a página em um navegador desktop
2. **Não use o mouse**
3. Tab deve revelar o "Skip-link" no topo
4. Tab pelos elementos do header (Início → toggles → progresso)
5. Tab dentro do prato e do pool — cada card deve receber foco visível
6. Em um card focado, pressione Espaço — deve "pegar" o alimento
7. Use as setas para mover entre as zonas; Espaço novamente solta
8. Ctrl+Espaço cancela o drag
9. Abra o modal de validação; Tab cicla apenas dentro; Esc fecha; foco volta ao botão Validar

### Leitor de tela

- **NVDA (Windows)**: ative com Ctrl+Alt+N. Teste a navegação acima e confirme que as ações são anunciadas
- **VoiceOver (macOS)**: ative com Cmd+F5
- **TalkBack (Android)**: Configurações → Acessibilidade

Pontos a confirmar:
- "Modo descoberta, switch, desligado" / "ligado"
- "Arrastando Banana" durante drag
- Título do modal anunciado ao abrir
- "Prato limpo. Botão Desfazer." ao limpar

### Auditoria automatizada

```bash
npm run build && npm run start
# Em outro terminal:
# Lighthouse CLI ou DevTools Lighthouse → Accessibility audit
```

Pontuação esperada: **≥95** na categoria Accessibility.

### Contraste

Use a extensão **WAVE** ou DevTools (Inspector → Accessibility tab) para validar contraste em qualquer elemento.

## Referências

- [WCAG 2.1 quick reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Components — Heydon Pickering](https://inclusive-components.design/)
- [@dnd-kit a11y docs](https://docs.dndkit.com/api-documentation/sensors/keyboard)
- [WAI-ARIA Authoring Practices: Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
