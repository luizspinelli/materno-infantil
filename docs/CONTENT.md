# Conteúdo nutricional

Este documento descreve a base nutricional do dataset, suas fontes e os critérios usados para classificar cada alimento como adequado ou inadequado para crianças de **7 a 8 meses**.

> ⚠️ **Validação clínica pendente.** O dataset foi construído por engenharia, com base em interpretação do guia oficial. Antes de usar em feira ou em qualquer contexto educativo, peça à nutricionista responsável (Amanda) para revisar `app/lib/foods.ts` linha por linha.

## Fonte primária

**[Guia Alimentar para Crianças Brasileiras Menores de 2 Anos](https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_criancas_brasileiras_2anos.pdf)** — Ministério da Saúde, 2019.

Especificamente a página 7, que define a estrutura do almoço/jantar para crianças entre 7 e 8 meses:

> É recomendado que o prato da criança tenha:
> - 1 alimento do grupo dos cereais ou raízes e tubérculos;
> - 1 alimento do grupo dos feijões;
> - 1 ou mais alimentos do grupo dos legumes e verduras;
> - 1 alimento do grupo das carnes e ovos.
>
> Junto à refeição, pode ser dado um pedaço pequeno de fruta.
> Quantidade aproximada: 3 a 4 colheres de sopa no total.

## Modelo do prato

Esta diretriz se traduz no jogo como:

| Zona | Grupo | Obrigatório? |
|---|---|---|
| Top-left | Cereais ou raízes e tubérculos | ✅ Sim |
| Top-right | Feijões | ✅ Sim |
| Bottom-left | Legumes e verduras | ✅ Sim |
| Bottom-right | Proteínas (carnes e ovos) | ✅ Sim |
| Pratinho lateral | Frutas | ⚪ Opcional |

> Nota: o **rótulo** "Carnes e ovos" foi simplificado para **"Proteínas"** na UI (decisão do stakeholder), mas o ID interno permanece `"carnes-ovos"`.

## Critérios de classificação

### Apropriados para 7-8 meses

Um alimento é classificado como **`apropriado: true`** quando:

1. **Pertence a um dos 5 grupos** acima (tem `categoria` definida)
2. **Pode ser oferecido na textura adequada** (amassado, raspado, desfiado, picado fino — não inteiro)
3. **Não contém açúcar adicionado**, sódio em excesso, conservantes ou ingredientes proibidos para a idade

Os 37 apropriados incluem alimentos brasileiros comuns:

- **Cereais/tubérculos**: arroz, batata, mandioca, batata-doce, inhame, macarrão bem cozido, polenta, mingau de aveia
- **Feijões**: feijão amassado, lentilha, grão-de-bico amassado, feijão preto, feijão branco, ervilha
- **Carnes e ovos**: frango desfiado, ovo cozido, carne moída, peixe sem espinha, fígado de boi, carne bovina, salmão
- **Legumes/verduras**: brócolis cozido, cenoura cozida, abóbora amassada, chuchu, abobrinha, beterraba, couve-flor, espinafre cozido
- **Frutas**: banana amassada, maçã raspada, mamão amassado, pera amassada, abacate amassado, manga, melancia, laranja em gomos

### Inapropriados para 7-8 meses

Os 16 inapropriados foram escolhidos por serem alimentos comuns na vida cotidiana brasileira que, segundo o guia, **não devem ser oferecidos** a crianças menores de 2 anos. Cada um carrega um campo `motivo` exibido no modal de validação.

| Alimento | Motivo |
|---|---|
| Salsicha | Ultraprocessado: excesso de sódio, gorduras e conservantes |
| Refrigerante | Açúcar, cafeína e corantes |
| Biscoito recheado | Ultraprocessado com açúcar, gordura e aditivos |
| **Mel** | Risco de **botulismo infantil** — proibido para menores de 1 ano |
| Açúcar | Não deve ser oferecido a menores de 2 anos |
| Bala | Açúcar puro e risco de engasgo |
| Chocolate | Açúcar e cafeína |
| Achocolatado em pó | Ultraprocessado rico em açúcar |
| Iogurte com açúcar | Açúcar adicionado e aromatizantes |
| Cereal matinal açucarado | Ultraprocessado |
| Macarrão instantâneo | Excesso de sódio e aditivos |
| Nuggets | Ultraprocessado com sódio, gorduras e aditivos |
| Salgadinho de pacote | Excesso de sódio + risco de engasgo |
| Café | Cafeína |
| Suco de caixinha | Açúcar adicionado e poucos nutrientes da fruta |
| Bolo industrializado | Ultraprocessado |

## Lógica de validação

A função `validarPrato` (em `app/lib/foods.ts`) classifica o prato em 5 níveis:

| Nível | Condição | Mensagem geral |
|---|---|---|
| 🌟 **Perfeito** | 4 grupos obrigatórios + 0 inapropriados | "Prato perfeito! Contém os 4 grupos obrigatórios..." |
| ✓ **Completo** | 4 grupos obrigatórios + algum inapropriado | "Os 4 grupos obrigatórios estão presentes, mas..." |
| ⚠️ **Incompleto** | Falta algum grupo obrigatório, sem inapropriados | "Os alimentos escolhidos são adequados, mas faltam X grupo(s)..." |
| ❌ **Inadequado** | Falta grupo + tem inapropriados | "Faltam X grupo(s) obrigatório(s) e há Y item(ns) inapropriado(s)..." |
| · **Vazio** | 0 alimentos | "Arraste alguns alimentos antes de validar!" |

A presença de **fruta** muda apenas a mensagem do nível Perfeito (celebra a inclusão), não afeta a classificação.

## Como adicionar/alterar alimentos

1. Edite `app/lib/foods.ts`, array `ALIMENTOS`
2. Para apropriados: defina `categoria` e `apropriado: true`
3. Para inapropriados: `categoria: null`, `apropriado: false`, **obrigatório** preencher `motivo` (frase curta explicando por quê)
4. Para imagem: prefira `img: openmoji("CODEPOINT")`. Codepoints disponíveis em <https://openmoji.org>. Codepoints sem suporte na CDN: `1FADD`, `1FADC` (estado em 2026-05).
5. Se não houver emoji adequado, use `emoji: "🍯"` ou crie um SVG inline em `FoodIcon.tsx`
6. Rode `npm test` — o dataset tem invariantes testadas (ids únicos, motivo obrigatório em inapropriados, categoria obrigatória em apropriados)

## Limitações conhecidas

1. **Apenas 7-8 meses.** O guia define regras diferentes para 6m, 9-11m, 12m+. Implementar variações multiplica o dataset e a lógica.
2. **Não diferencia "ok com moderação" vs "ok à vontade".** A classificação é binária (apropriado/inapropriado). Itens como "fígado" são apropriados mas idealmente oferecidos 1×/semana, e isso não é refletido.
3. **Não considera alergênicos.** Ovo, peixe, leite, oleaginosas têm protocolos de introdução próprios que o jogo não aborda.
4. **Texturas não validadas.** O nome do alimento sugere a textura ("Banana amassada", "Frango desfiado"), mas o jogo não valida se a pessoa "preparou direito".

Esses pontos são adequados para uma dinâmica educativa rápida (1-3 min), mas não substituem orientação nutricional individualizada.

## Próximos passos sugeridos

- Take-away pós-validação (frases-bala "Para levar pra casa")
- Adicionar regionalismos (cuscuz, açaí, tapioca)
- Diferenciar cores/marcadores para alimentos de "alta atenção alérgica"
- Faixas etárias selecionáveis
