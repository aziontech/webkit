# `@aziontech/theme` — Benchmark de tokens multi-produto

Levantamento de como design systems de referência e concorrentes diretos
da Azion estruturam tokens quando **um único sistema serve múltiplos
produtos** (console, marketing, docs, sub-brands). O objetivo é duplo:
fazer um *gap analysis* honesto do estado atual do `@aziontech/theme` e
extrair padrões aplicáveis ao refactor em curso na branch
`refactoring-tokens` — sem propor reescrita ampla.

Companheiro de leitura: [`IMPLEMENTATION.md`](./IMPLEMENTATION.md)
descreve a arquitetura atual em detalhe.

---

## 1. Estado atual do `@aziontech/theme`

A refatoração em andamento já estabelece uma base sólida:

- **Três camadas**: `primitives/` (cores, shape, tipografia, efeitos) →
  `semantic/` (containers, spacings, texts em `.data.js` declarativos) →
  `theme/` (refs light/dark resolvidos via `tokenRef()`).
- **Builder unificado** (`src/scripts/build-tokens.mjs`) emite v3 e v4
  a partir dos mesmos dados, mantendo paridade de classes públicas.
- **Scoping de tema** via `data-theme=light|dark` e classes
  `.azion-light` / `.azion-dark`.
- **Outputs**: CSS vars, Tailwind v3 (`tailwind.config.js` +
  `tailwind-preset.js`), Tailwind v4 (`@theme` + `:root`), além de
  `globals.css/scss`.

Limites conhecidos (ponto de partida deste benchmark):

- **Brand monolítico**: `src/tokens/primitives/colors/brand.js` define
  uma única paleta Azion. Não há parametrização.
- **Sem entry points por produto**: `package.json` exporta um único
  pacote consumido integralmente. Console, site institucional e docs
  recebem exatamente os mesmos tokens.
- **Override só ad-hoc**: consumidores podem sobrescrever CSS vars no
  app, mas sem API formal — frágil e não documentado.
- **`data-theme` só cobre claro/escuro**: não há eixo de brand,
  densidade ou compliance.

---

## 2. Top-tier design systems

### 2.1 Material Design 3 (Google)

**Camadas explícitas:** `md.ref.*` (palette/typography primitivos),
`md.sys.*` (semantic role tokens — `md.sys.color.primary`,
`md.sys.typescale.body-large`), `md.comp.*` (component-level).

**Multi-produto:** Material roda em Android, Flutter, web, Wear OS e
apps de terceiros. Em vez de pacotes por produto, M3 adota um **modelo
gerador**: cada produto (ou cada dispositivo) injeta uma *seed color* e
o algoritmo **HCT-based dynamic color** deriva todo o conjunto
`md.sys` (tonal palettes → schemes). Brands/sub-brands plugam-se via
seed + cores customizadas; a camada de componente nunca muda.

**Distribuição & build:** JSON como fonte; **Material Theme Builder**
(web + plugin Figma) exporta para Android XML, Compose Kotlin, Flutter
e web/CSS. Tema escolhido em build (`MaterialTheme` no Compose) ou
runtime (dynamic color, Android 12+).

🔗 https://m3.material.io/foundations/design-tokens

### 2.2 Polaris (Shopify)

**Camadas:** pacote único `@shopify/polaris-tokens` (e gem
`polaris_tokens`). Organização por **categoria** — color, spacing,
font, shape, motion, z-index, breakpoints — em vez de tiers
primitive/semantic/component. As semânticas vivem dentro da camada de
cor (`color-bg-surface`, `color-text-emphasis`,
`color-border-critical`). Component tokens não são first-class;
componentes consomem o color/space semântico diretamente.

**Multi-produto:** Polaris é intencionalmente *single-product-shaped*
(o admin Shopify e apps que embutem nele). Sub-produtos (Hydrogen,
Shop) divergiam historicamente. Convergência atual via **Polaris Web
Components** (GA Out/2025) — elementos framework-agnósticos que leem
CSS custom properties, permitindo theming por override no host. Sem
pacotes por produto; temas como arquivos dentro do pacote único.

**Distribuição & build:** CSS custom properties, Sass (variables +
maps), JSON (kebab-case), JS (lowerCamelCase) e exports nativos
(Android, iOS, Sketch, ASE). Tema selecionado em runtime via scoping
de CSS vars / data-attributes.

🔗 https://github.com/Shopify/polaris-tokens

### 2.3 Primer (GitHub)

**Camadas (modelo mais limpo do grupo):**

- **Base / primitive** — escalas cruas.
- **Functional / semantic** — `fgColor.default`, `bgColor.muted`,
  `borderColor.danger`. É o contrato consumido por `@primer/react`,
  `@primer/view-components`, `@primer/css`.
- **Component** — tokens consumidos pelas bibliotecas de componentes.

Temas são **deltas sobre a base**: cada theme file declara só seu
delta. Nove temas em produção: light, dark, light/dark
high-contrast, light/dark colorblind, light/dark tritanopia, dark
dimmed.

**Multi-produto:** repo único (`primer/primitives`) alimenta **múltiplas
superfícies**: github.com (React + ViewComponents + CSS), GitHub
Mobile, GitHub Desktop, Docs. A mesma árvore JSON é **transformada por
plataforma via Style Dictionary**. Tema na web via
`data-color-mode` / `data-light-theme` / `data-dark-theme` no `<html>`.

**Distribuição & build:** JSON/JSON5 → Style Dictionary com transforms
customizados → CSS vars, Sass, JS, JSON, Figma variables, arquivos
nativos.

🔗 https://github.com/primer/primitives

### 2.4 Spectrum (Adobe)

**Camadas:** `@adobe/spectrum-tokens` (renomeado
`@adobe/spectrum-design-data`) é **DTCG/W3C-aligned** nativamente:
`$value`/`$type` com resolver estilo **sets + modifiers** — base + um
modifier por color theme (light/dark/darkest), scale (medium/large
para touch) e plataforma. Layers: global → alias → component.

**Multi-produto:** o caso canônico de "um engine, N temas com brand".
Adobe ship **duas famílias paralelas** em cima do mesmo motor —
**Spectrum** (Creative Cloud / enterprise) e **Express** (Adobe Express
consumer). Apps escolhem combinação theme + scale + color em runtime
via `<sp-theme theme="spectrum" color="dark" scale="medium">`.

**Distribuição & build:** DTCG JSON → Style Dictionary → CSS custom
properties (por theme/scale/color), Sass, JS. Seleção em runtime por
scoping de atributo.

🔗 https://github.com/adobe/spectrum-design-data

### 2.5 Carbon (IBM)

**Camadas:** semantic tokens *são* o contrato; valores crus são
implementação. Layers: primitivos (color/type/spacing/motion) →
semantic (`background`, `layer-01`, `text-primary`, `interactive`,
`support-error`) → component. Pacotes: `@carbon/themes`,
`@carbon/styles`, `@carbon/react`, `@carbon/elements`.

**Multi-produto:** o modelo é **white-label by design**. Quatro temas
built-in — **White**, **Gray 10**, **Gray 90**, **Gray 100** — todos
com os mesmos nomes semânticos, só valores diferentes. Produtos IBM
(Cloud, Watson, Db2) escolhem um tema base e reescrevem valores
mantendo a API semântica.

**Distribuição & build:** Sass-first
(`@carbon/styles/scss/themes`) + JS exports
(`import { g100 } from '@carbon/themes'`). Tema em build via mixin Sass
**ou** em runtime via `<Theme>` / `<GlobalTheme>` que escrevem
`data-carbon-theme` e escopam variáveis.

🔗 https://carbondesignsystem.com/elements/themes/overview/

---

## 3. Concorrentes diretos (cloud / edge / CDN)

### 3.1 Cloudflare — `@cloudflare/kumo`

**Pública.** Lib React + Tailwind v4 open-source (`cloudflare/kumo`,
npm `@cloudflare/kumo`). Substitui `cf-ui` e
`@cloudflare/component-*`. Inclui plugin Figma no mesmo monorepo.

**Camadas:** três tiers explícitos —
(1) **primitivos** (~40 re-exports do Base UI headless),
(2) **semantic tokens** (única superfície sancionada para estilizar:
`bg-kumo-base`, `bg-kumo-elevated`, `bg-kumo-recessed`,
`text-kumo-default`, `border-kumo-line`); Tailwind raw é bloqueado por
lint,
(3) **componentes** sobre o semantic. Geração via
`scripts/theme-generator/config.ts` → `src/styles/theme-kumo.css`.

**Multi-produto:** mode e tema via `data-mode="light|dark"` e
`data-theme="fedramp"` em um parent — a mesma árvore de componentes é
reskinada sem duplicação de seletor. É exatamente como tratam
deployment regulado (FedRAMP) ao lado do dashboard padrão. Marketing
e docs não consomem Kumo diretamente; é *dashboard-led*.

**Stack:** Tailwind v4.1, CSS custom properties usando `light-dark()`
moderno (sem prefixos `dark:`). Sem Style Dictionary / DTCG — script
custom TS.

🔗 https://github.com/cloudflare/kumo

### 3.2 Vercel — Geist

**Parcialmente público.** A linguagem Geist está documentada em
`vercel.com/geist`; `vercel/geist-font` é OSS. **Não existe pacote
público oficial de componentes/tokens Geist** — a implementação React
que roda vercel.com, dashboard e v0 é interna. O popular
`geist-org/geist-ui` é port da comunidade, não-afiliado.

**Camadas:** docs públicas tratam foundations — Colors, Typography,
Materials (elevation), Motion, Iconography. Padrão semelhante a
shadcn/ui: escalas primitivas (gray-1…gray-12, estilo Radix Colors)
referenciadas por semantic aliases (background, foreground, accents).
Sem JSON / Style Dictionary público.

**Multi-produto:** as mesmas primitivas atravessam marketing
(vercel.com), dashboard, v0.dev e templates. A ponte marketing↔produto
é principalmente tipográfica + grayscale neutra; superfícies de
produto reusam o mesmo accent ramp em densidade maior. v0 usa o
sistema para *gerar* UI fiel ao token.

**Stack:** Tailwind + CSS vars (font vars `--font-geist-sans`,
`--font-geist-mono` expostas). Next.js.

🔗 https://vercel.com/geist/introduction

### 3.3 Netlify — `@netlify/netlify-design-tokens`

**Público mas tokens-only — sem lib de componentes pública.** Dois
pacotes npm distintos:

- `@netlify/netlify-design-tokens` — tokens de produto, **v7.1.0**,
  ativamente mantido.
- `@netlify/netlify-marketing-tokens` — tokens de marketing,
  **v1.1.0**, último publish ~2 anos, em grande parte stale.

Esse split explícito é incomum e valida o eixo marketing-vs-produto.

**Camadas:** organização flat-ish — color, typography, categorias
diversas. Naming camelCase JS (`colorFacetsTeal500`,
`typographyWeightBold`) + CSS vars. Há "facet" ramps (Teal 100–900)
sugerindo camada primitiva, mas a separação primitive/semantic não é
documentada publicamente. Sem component tokens.

**Multi-produto:** o split em dois pacotes substitui um sistema único
temado. Distribuído em `dist/css/` (CSS vars, incluindo formato
`rgb()` para opacidade) e módulo JS/TS — site Next.js marketing e
dashboard React consomem a mesma fonte.

**Stack:** CSS custom properties + JS modules. Build provavelmente
estilo Style Dictionary, mas não anunciado como DTCG-compliant.

🔗 https://www.npmjs.com/package/@netlify/netlify-design-tokens

### 3.4 AWS — Cloudscape

**Mais maduro dos quatro.** Open-source desde Jul/2022 em
`cloudscape.design`. Pacote: `@cloudscape-design/design-tokens` (legacy
`@awsui/design-tokens`).

**Camadas:** **CTI naming** estrito (Category > Type > Item >
Sub-item > State): `color-text-body-secondary`,
`color-background-button-primary-hover`. Tokens carregam **valores
multidimensionais** nativamente:

- Color: `{ light, dark }`
- Spacing: `{ comfortable, compact }` (densidades)
- Motion: `{ default, disabled }` (reduced motion)

Categorias: typography, color, border-radius, spacing, motion.
Distribuído como Sass vars, JS vars e JSON.

**Multi-produto:** dois caminhos de theming:

- **Build-time** via `buildThemedComponents()` — pacote de
  componentes pré-temado por sub-propriedade AWS. Melhor performance,
  CSP-friendly, SSR-safe.
- **Runtime** via `applyTheme()` — injeta stylesheet de override para
  consoles multi-tenant trocarem tema por usuário sem rebuild.

Só color, typography e border-radius são themáveis; o resto é travado
para manter coerência visual entre serviços (console do EC2 deve
parecer com o do Lambda).

**Stack:** Sass + JS + JSON; build tool próprio
(`cloudscape-design/theming-core`). Pré-DTCG mas a arquitetura mapeia
limpamente.

🔗 https://cloudscape.design/foundation/visual-foundation/design-tokens/

---

## 4. Padrões recorrentes

1. **Modelo de 3 camadas é consenso**: primitive/reference →
   semantic/alias/system → component. Material, Primer, Spectrum,
   Carbon, Cloudflare e Cloudscape fazem explicitamente; Polaris faz
   implicitamente dentro da camada de cor.
2. **Semantic tokens são a API pública.** Temas/brands mudam valores,
   nunca nomes. É o que viabiliza white-label (Carbon), dynamic color
   (Material) e multi-theme rendering (Spectrum) sem forkar
   componentes.
3. **Style Dictionary domina** a transformação. Primer, Spectrum,
   Carbon e Material Theme Builder convergem nele (ou em pipelines
   equivalentes) para emitir CSS vars, Sass, JS/TS, native, Figma.
4. **DTCG / W3C JSON virou lingua franca.** Spectrum já está 100% no
   formato; spec estabilizada em fim de 2025. Todo trabalho novo de
   tokens em 2025–2026 deveria nascer DTCG-shaped (`$value`, `$type`,
   `$description`).
5. **Temas como deltas, nunca árvores paralelas.** Primer
   high-contrast só declara delta; Carbon g10/g90/g100 reassinala
   valores nos mesmos nomes; Material deriva tudo de uma seed.
6. **Multi-produto = CSS custom props + atributo raiz.**
   `data-color-mode` (Primer), `data-carbon-theme` (Carbon),
   `<sp-theme>` (Spectrum), `data-mode` + `data-theme="fedramp"`
   (Cloudflare). Runtime switching é universal; build-time é otimização
   opcional.
7. **Pacotes por produto são raros; arquivos por tema dominam.** Só
   Spectrum chega a quebrar pacote (Spectrum vs Express) — e ainda
   compartilham o engine. Todos os outros têm um pacote, vários temas.
8. **CSS vars mapeiam diretamente para Tailwind v4 `@theme`.** Nenhum
   dos sistemas ship Tailwind plugins como output canônico, mas o
   layer de CSS variables se encaixa nativamente no `@theme` da v4 —
   é o caminho natural se a fonte está em DTCG.

---

## 5. O que muda em cloud/CDN vs. produto puro

1. **Split marketing↔dashboard é first-class, não consequência.**
   Netlify chega a publicar dois pacotes npm; Vercel mantém Geist
   como linguagem aberta mas só formaliza *foundations* (fonte, color
   ramp) para que marketing possa divergir tipograficamente. Material
   e Polaris assumem uma única superfície de produto.
2. **Compliance / regional / tenant theming.** Cloudflare expõe
   `data-theme="fedramp"`; Cloudscape suporta tenant theming em
   runtime via `applyTheme()`. Edge/cloud precisam reskinar o mesmo
   produto para deployments regulados e embeds de cliente — Material
   não precisa.
3. **Densidade e motion como dimensões themáveis, não só cor.**
   Cloudscape codifica `comfortable`/`compact` e
   `default`/`disabled` no nível de token porque consoles têm tabelas
   data-dense. Product DSs tipicamente hard-codam uma densidade só.
4. **Light/dark é table-stakes e agora CSS-native.** Cloudflare usa
   `light-dark()` direto nas custom properties (Tailwind v4);
   Cloudscape carrega `{light, dark}` na shape do token. Product DSs
   foram mais lentos aqui.
5. **Tokens-only distribution é estratégia válida.** Netlify ship
   tokens sem lib de componentes; Vercel mantém componentes privados
   expondo só tokens/foundations + a fonte. Isso desacopla
   marketing/docs/dashboard que escolhem sua própria camada de
   componente (shadcn, custom, MDX) mantendo a marca. Material e
   Polaris embutem tokens dentro dos componentes.

---

## 6. Gap analysis — `@aziontech/theme` vs benchmarks

| Dimensão | Status atual | Padrão da indústria | Gap | Prioridade |
|----------|--------------|----------------------|------|------------|
| Camadas primitive / semantic / component | ✓ 3 camadas (`primitives/semantic/theme`) | 3 camadas explícitas (Primer, Material, Cloudflare, Cloudscape) | Componentes não distinguidos como tier (semantic é o contrato — ok) | OK — documentar como contrato |
| Formato fonte | JS puro arbitrário | DTCG / W3C JSON (Spectrum, tendência geral 2025+) | Sem `$value`/`$type`/`$description`; impede Style Dictionary plug-and-play e Figma sync | Médio prazo |
| Engine de build | Script custom (`build-tokens.mjs`) | Style Dictionary domina; ferramentas próprias (Cloudscape) são exceção | Script funciona hoje; troca só compensa quando matrix de outputs crescer | Reavaliar quando precisar de outputs nativos |
| Multi-brand / multi-produto | ✗ Brand único hardcoded em `primitives/colors/brand.js` | White-label (Carbon), dynamic seed (Material), themes como deltas (Primer, Spectrum) | Sem mecanismo de override formal; consumidores patcham CSS var no app | **Alto — gap mais crítico** |
| Scoping de tema | `data-theme=light\|dark` + `.azion-light/-dark` | Mesmo padrão (`data-*-theme`) — todos os benchmarks convergem | OK estruturalmente; falta extensibilidade (brand, density) no mesmo atributo | Médio — generalizar para `data-azion-theme` |
| Densidade como token | ✗ Não modelada | Cloudscape: `{comfortable, compact}` nativo | Sem caminho para console denso vs marketing arejado | Baixo — só se divergência aparecer |
| Outputs (CSS vars, Tailwind v3, v4) | ✓ Todos emitidos | CSS vars universais; Tailwind raro como output canônico (Cloudflare é exceção) | Nenhum — paridade v3/v4 é diferencial | OK |
| Distinção marketing vs produto | ✗ Pacote único | Netlify quebra em 2 pacotes; Vercel só compartilha foundations | Site, console e docs recebem os mesmos tokens — pode virar limite | Baixo — observar evolução |
| Light/dark CSS-native (`light-dark()`) | ✗ Usa override por seletor/atributo | Cloudflare em produção; tendência clara em Tailwind v4 | Tailwind v4 já permite; refactor de v4 pode adotar | Médio (somente v4) |
| Tema como delta vs árvore paralela | ✓ Refs `tokenRef()` permitem | Universal nos benchmarks | OK; só formalizar quando entrar terceiro tema | OK |

---

## 7. Recomendações acionáveis

### Curto prazo (cabe nesta branch ou follow-up imediato)

- **Generalizar o atributo de scoping** de `data-theme` para
  `data-azion-theme` (padrão Carbon/Cloudflare). Mantém a semântica
  atual (`light`/`dark`) mas abre espaço para um eixo de brand sem
  breaking change futuro.
- **Documentar `semantic/` como API pública contratual** e
  `primitives/` como interno. Hoje o `README.md` já caminha nessa
  direção; explicitar no público (`README.md` do pacote + JSDoc dos
  arquivos exportados) reduz risco de consumidor amarrar em primitivo.
- **Preparar a estrutura de arquivo para temas como deltas.** Mesmo
  com só light/dark hoje, organizar `theme/{light,dark}.js` (em vez
  de `light` e `dark` co-existindo em cada arquivo de grupo) facilita
  adicionar `theme/azion-marketplace.js` futuramente sem refatorar
  builder. Decisão de não fazer agora é razoável; deixar registrado
  como dívida.

### Médio prazo (próximas iterações)

- **Migrar o formato fonte para shape DTCG** (`$value`/`$type`/
  `$description`). É a mudança que mais destrava integrações
  (Style Dictionary, Tokens Studio, Figma Variables). Pode ser feita
  incrementalmente — começar pelos primitivos, que mudam menos.
- **Parametrizar `brand`** para suportar override por produto.
  Caminhos possíveis (escolher um quando o primeiro caso real
  aparecer):
  - Entry points por brand: `@aziontech/theme/brands/azion`,
    `@aziontech/theme/brands/marketplace`.
  - Flag de build: `build-tokens.mjs --brand=marketplace`.
  - Scope runtime: `data-azion-theme="marketplace-light"`.
- **Reavaliar Style Dictionary** quando o número de outputs crescer
  (Figma sync, JSON cross-platform, native). Enquanto a matriz for
  CSS + Tailwind v3 + Tailwind v4, o `build-tokens.mjs` atual entrega
  com menos código que adotar Style Dictionary inteiro.

### Longo prazo / a discutir

- **Densidade como dimensão de token** (modelo Cloudscape) — só se a
  divergência console-denso vs marketing-arejado virar problema real.
- **Split marketing/produto** (modelo Netlify) — só se site e console
  divergirem além do que `data-azion-theme` consegue absorver.
- **`light-dark()` em CSS** para a saída v4, dispensando o seletor
  duplicado. Tailwind v4.1+ permite; vale acompanhar adoção interna
  antes de migrar.

---

## Fontes

- Material 3 — https://m3.material.io/foundations/design-tokens
- Polaris — https://github.com/Shopify/polaris-tokens
- Primer — https://github.com/primer/primitives
- Spectrum — https://github.com/adobe/spectrum-design-data
- Carbon — https://carbondesignsystem.com/elements/themes/overview/
- Cloudflare Kumo — https://github.com/cloudflare/kumo
- Geist (Vercel) — https://vercel.com/geist/introduction
- Geist Font — https://github.com/vercel/geist-font
- Netlify Design Tokens — https://www.npmjs.com/package/@netlify/netlify-design-tokens
- Netlify Marketing Tokens — https://www.npmjs.com/package/@netlify/netlify-marketing-tokens
- AWS Cloudscape — https://cloudscape.design/foundation/visual-foundation/design-tokens/
- Cloudscape Theming — https://cloudscape.design/foundation/visual-foundation/theming/
- DTCG Spec — https://www.designtokens.org/tr/drafts/format/
