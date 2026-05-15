# `@aziontech/theme` — Design tokens builder

Pipeline declarativo de design tokens com saída dual para Tailwind v3 e v4.
Este documento descreve a arquitetura, a estrutura dos arquivos, o pipeline
do builder, os formatos de saída para v3/v4, e a matriz de integração dos
consumidores conhecidos no monorepo Azion.

---

## 1. Visão geral

```
src/tokens/                              fonte declarativa (JS puro)
├── primitives/                          tokens crus (cor, shape, tipografia, efeitos)
│   ├── colors/colors.js                 paletas (gray, violet, …), brand, alpha
│   ├── breakpoints.js                   sm/md/lg/xl/2xl em pixels
│   ├── shape/{radius,spacing,…}.js      escalas geométricas
│   └── typography/{font-family,…}.js    fontes, escalas tipográficas
├── semantic/                            tokens compostos (alias para primitives)
│   ├── colors.js                        cores semânticas (resolvem em runtime)
│   ├── containers.data.js               px/py/max-width responsivos
│   ├── spacings.data.js                 gap/padding elements responsivos
│   ├── texts.data.js                    estilos de texto (bundle responsivo)
│   └── animations.js                    keyframes estáticos
└── theme/                               temas (light/dark)
    └── {primary,secondary,…}.js         refs entre semantic e primitive

src/scripts/
├── build-tokens.mjs                     o builder (este doc)
├── compile-primitives.js                emite primitives → CSS vars planas
├── compile-theme.js                     emite light/dark semantic → CSS vars
├── css-vars.js                          helper de injeção runtime
└── refs.js / resolve.js                 tokenRef('a.b.c') → resolução

dist/                                    artefatos gerados (gitignorable)
├── v3/
│   ├── globals.css                      @tailwind base/components/utilities + @layer
│   ├── globals.scss                     idêntico ao .css
│   ├── tailwind.config.js               CJS, content+theme.extend completo
│   └── tailwind-preset.js               ESM, theme.extend apenas (preset)
└── v4/
    ├── globals.css                      @import "tailwindcss" + @theme
    └── globals.scss                     idêntico ao .css

docs/
└── IMPLEMENTATION.md                    este arquivo
```

### Princípios

1. **Dados declarativos**. Todos os tokens — incluindo os responsivos — são
   objetos JS planos. Nenhum plugin imperativo decide os valores em runtime.
2. **CSS variables como veículo único**. Toda variação responsiva ou temática
   acontece via redefinição de variáveis CSS. Utilities/components do Tailwind
   apenas consomem `var(--…)`.
3. **Builder agnóstico de Tailwind**. O mesmo modelo gera saídas para Tailwind
   v3 (preset + `@layer`) e v4 (`@theme`). O JS dos tokens não muda.
4. **Retrocompat preservada**. As classes públicas (`.text-heading-xl`,
   `.gap-spacing-elements-xl`, `.px-container`, …) continuam idênticas em
   ambas as saídas.

---

## 2. Schema dos tokens responsivos

Cada arquivo em `src/tokens/semantic/*.data.js` exporta um objeto cujas chaves
são tokens e cujos valores são **escalares responsivos** ou **bundles**.

### 2.1. Escalar responsivo

```js
// containers.data.js
export const containersData = {
  px:          { _: '1rem',  sm: '2.5rem', xl: '0' },
  py:          { _: '4rem',  sm: '8rem',   xl: '12rem' },
  'max-width': { _: '28rem', sm: '64rem',  xl: '80rem' },
};
```

- `_` é o default (mobile-first).
- As chaves seguintes devem existir em `tokens/primitives/breakpoints.js`.
- Pode-se passar uma string em vez de objeto se o valor for estático
  (`'1rem'` equivalente a `{ _: '1rem' }`).

### 2.2. Bundle responsivo

```js
// texts.data.js
export const textsData = {
  'text-heading-xl': {
    fontSize:    { _: '1.25rem', sm: '1.875rem', md: '2.25rem' },
    lineHeight:  '1.2',                  // estático
  },
  'text-body-md': {
    fontSize:    '1rem',                 // estático
    lineHeight:  '1.5',
  },
  // ...
};
```

Cada propriedade do bundle é tratada individualmente. Cada uma vira uma var
CSS (`--text-heading-xl-font-size`, `--text-heading-xl-line-height`) e pode
ser responsiva ou estática.

### 2.3. Mapeamento camelCase → kebab-case

Propriedades JS em camelCase (`fontSize`, `lineHeight`, `letterSpacing`,
`textTransform`) viram kebab-case no nome da CSS var e na declaração CSS.

---

## 3. Pipeline do builder

```
                          ┌── flattenPrimitives ──┐
                          │                       │
buildFlatModel() ─────────┼── flattenSingleValue ─┼─► { primitives, containers,
                          │                       │     spacings, texts }
                          └── flattenBundle ──────┘
                                                            │
              ┌─────────────────────────────────────────────┤
              │                                             │
       emitCssV3 ()                                  emitCssV4 ()
       emitPresetV3 ()                                 (sem preset)
       emitTailwindConfigV3 ()
              │                                             │
              ▼                                             ▼
       dist/v3/*                                      dist/v4/*
```

### 3.1. Flattening de primitives

Reusa `buildTrees()` + `flatten()` de `compile-primitives.js`. Resultado:
um mapa plano `{ '--color-gray-500': '#808080', '--shape-radius-rounded':
'4px', '--breakpoint-md': '768px', … }`.

### 3.2. Flattening de semantics

- **Escalar** (`flattenSingleValue`): para cada `{key, value}`, expande o
  valor (string ou breakpoint-map) num índice por breakpoint:
  `{ _: { '--var': 'val' }, sm: { '--var': 'val' }, … }`.
- **Bundle** (`flattenBundle`): para cada propriedade do bundle, gera uma var
  separada (`--text-<token>-<kebab-prop>`), preservando a estrutura por
  breakpoint.

### 3.3. Emissão CSS — v3 (Tailwind 3)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root, [data-theme=light], .azion.azion-light {
    /* primitives + defaults de semantics */
  }

  @media (min-width: 640px) {
    :root, [data-theme=light], .azion.azion-light {
      /* overrides em sm */
    }
  }
  /* … outros breakpoints … */
}

@layer components {
  .px-container { padding-left: var(--container-px); … }
  .text-heading-xl { font-size: var(--text-heading-xl-font-size); … }
  /* … */
}
```

Tudo dentro de `:root` com os 3 seletores combinados (`:root`,
`[data-theme=light]`, `.azion.azion-light`) — mesmo padrão usado por
`compile-theme.js` para o tema light. Isto permite coexistência sem
conflito com o tema dark (que vive em `[data-theme=dark]`).

### 3.4. Emissão CSS — v4 (Tailwind 4)

```css
@import "tailwindcss";

@theme {
  --color-gray-50: #FCFCFC;
  --color-violet-500: #8A84EC;
  --breakpoint-md: 768px;
  /* … só primitives de cor e breakpoints aqui … */
}

:root, [data-theme=light], .azion.azion-light {
  /* primitives não-cor (shape, typography, border, ring-offset, effects) */
  /* + defaults de semantics */

  @media (min-width: 640px) {
    /* overrides */
  }
}

@layer components {
  .px-container { … }
  .text-heading-xl { … }
}
```

Diferenças importantes:

- **`@theme` recebe apenas o que precisa virar utility automática do
  Tailwind v4**: cores (`--color-*`) e breakpoints (`--breakpoint-*`). A
  partir desses Tailwind v4 gera `bg-gray-50`, `text-violet-500`,
  `md:flex`, etc.
- **Shape, tipografia e demais primitives** ficam fora de `@theme`, em
  `:root`, porque não queremos que Tailwind gere `text-fontsize-xl` ou
  similar automaticamente — controlamos via componentes nossos.
- **Tokens responsivos semânticos** vivem em `:root` + `@media` aninhado
  (sintaxe v4 nativa). O Tailwind 4 aceita nested `@media` em qualquer
  ruleset.
- **Classes componente** (`.text-heading-xl`, `.px-container`, …) ficam
  em `@layer components` exatamente como em v3, garantindo nomes idênticos.

### 3.5. Saídas auxiliares v3

- **`tailwind.config.js` (CJS)**: full config com `content`, `darkMode`,
  `theme.extend.colors`, `theme.extend.fontSize`. Pronto para uso isolado
  no harness ou em apps que ainda não migraram.
- **`tailwind-preset.js` (ESM)**: só `theme.extend`. Para apps que já têm
  `tailwind.config.js` próprio — usam `presets: [require(…)]`.

Não há `tailwind.config.js` em `dist/v4/` — em v4 toda a configuração mora
no próprio CSS (`@theme`).

---

## 4. CLI do builder

```bash
node src/scripts/build-tokens.mjs               # emite v3 e v4
node src/scripts/build-tokens.mjs --target=v3   # só v3
node src/scripts/build-tokens.mjs --target=v4   # só v4
```

Scripts npm equivalentes:

| Script              | Faz                                                                |
| ------------------- | ------------------------------------------------------------------ |
| `build:tokens`      | builder completo (v3 + v4)                                         |
| `build:tokens:v3`   | só v3                                                              |
| `build:tokens:v4`   | só v4                                                              |
| `build:css:v3`      | builder v3 + roda `tailwindcss` CLI gerando `dist/v3/output.css`   |
| `test:tokens:v3`    | `build:css:v3` e abre `src/tests/tokens.html` no navegador         |

### Determinismo

O builder é **idempotente**: rodar duas vezes seguidas produz arquivos
byte-idênticos (mesmo MD5). Isto é garantido por:

- Iteração na ordem de inserção dos objetos JS.
- Ordem fixa de breakpoints: `['sm', 'md', 'lg', 'xl', '2xl']`.
- Sem dependência de hora, hash dinâmico ou ambiente.

---

## 5. Matriz de integração — consumidores

Levantamento feito em **2026-05-15** nos projetos do monorepo Azion.

### 5.1. `site/apps/site` (Astro)

- **Stack**: Astro 5.18 + `@astrojs/tailwind` 6.0.2 + Tailwind v3.4.1.
- **Config**: `tailwind.config.js` herda de `site/packages/shared/tailwind.config.js`.
- **Imports atuais**:
  ```js
  // site/packages/shared/tailwind.config.js
  import { theme, animations, spacingElements, semanticTexts } from '@aziontech/theme/…';
  plugins: [semanticTexts(), spacingElements(), animations(), /* … */]
  ```
- **Global CSS**: importa `@aziontech/theme` + componentes.
- **Migração v3 (drop-in)**:
  - Substituir os imports de plugins (`semanticTexts`, `spacingElements`)
    por `presets: [require('@aziontech/theme/tailwind-preset')]` no shared
    config.
  - Substituir os `@aziontech/theme/styles/*` por
    `@aziontech/theme/globals.css` no entry CSS.
  - `animations()` permanece como plugin (não foi migrado para data).
- **Migração v4 (futuro)**: trocar import por
  `@aziontech/theme/v4/globals.css` e remover o `tailwind.config.js`.

### 5.2. `site/apps/lp` (Astro)

Configuração idêntica ao `site` — herda o mesmo shared config. Mesmas
instruções de migração.

### 5.3. `site/apps/storybook` (Storybook 10 + Vite)

- Herda shared config + injeta CSS vars via decorator usando `cssVarsString()`.
- **Migração v3**: ao migrar o shared config, o storybook segue
  automaticamente. O decorator que injeta `cssVarsString()` continua
  válido (essas vars já saem do `compile-theme.js`).
- **Migração v4**: substituir o decorator por um import único de
  `@aziontech/theme/v4/globals.css` no `.storybook/preview.ts`.

### 5.4. `webkit/apps/storybook` (Storybook 8 + Vite, standalone)

- **Stack**: Tailwind v3.3.3.
- **Config**: `tailwind.config.js` **não** herda de shared — importa direto
  de `../../packages/theme/src/tokens/*.js`.
  ```js
  import { theme, semanticTexts, semanticSpacing, semanticAnimations }
    from '../../packages/theme/src/tokens/…';
  ```
- **Migração v3**:
  - Adicionar `presets: [require('@aziontech/theme/tailwind-preset')]` ao
    config local.
  - Remover `semanticTexts()` e `semanticSpacing()` do array `plugins:`
    (substituídos pelo `dist/v3/globals.css`).
  - Manter `semanticAnimations()` (não migrado).
  - Em `.storybook/preview.js`, importar `@aziontech/theme/globals.css`.
- **Migração v4**: análoga à do `site/storybook`.

### 5.5. `azion-console-kit` (Vue 3 + Vite)

- **Stack**: Tailwind v3.3.3.
- **Config atual** (`tailwind.config.js`):
  ```js
  import { theme } from '@aziontech/theme/tailwind/tailwind-theme';
  import semanticColors  from '@aziontech/theme/tailwind/semantic-colors-plugin';
  import semanticTexts   from '@aziontech/theme/tailwind/semantic-texts-plugin';
  import semanticSpacing from '@aziontech/theme/tailwind/semantic-spacing-plugin';
  ```
  ⚠️ **Os paths `@aziontech/theme/tailwind/*` não existem no `exports` atual
  do `package.json` deste pacote**. Significa que o console-kit consome
  uma versão publicada **anterior** à refatoração v4-tokens. Quando o
  console-kit fizer bump, a migração precisa:
  - Substituir os 4 imports por
    `presets: [require('@aziontech/theme/tailwind-preset')]`.
  - Remover a chamada `injectCssVars()` em `src/main.js` e substituir por
    `import '@aziontech/theme/globals.css'` (ou manter a injeção runtime —
    funcionam paralelamente).
- **Uso de classes**: alta concentração de `text-color-secondary`,
  `surface-border`, `surface-section`, `bg-header`. Essas continuam
  funcionando pois vêm das CSS vars do `compile-theme.js`, intactas nesta
  refatoração.

### 5.6. Tabela resumo

| Projeto                 | Tailwind | Path da config                                     | Esforço v3 | Esforço v4 |
| ----------------------- | -------- | -------------------------------------------------- | ---------- | ---------- |
| site/apps/site          | 3.4.1    | shared (`site/packages/shared/tailwind.config.js`) | baixo      | médio      |
| site/apps/lp            | 3.4.1    | shared (mesmo)                                     | baixo      | médio      |
| site/apps/storybook     | 3.4.1    | shared (mesmo)                                     | baixo      | médio      |
| webkit/apps/storybook   | 3.3.3    | standalone                                         | médio      | médio      |
| azion-console-kit       | 3.3.3    | standalone                                         | alto¹      | alto¹      |

¹ Alto porque os paths atuais (`@aziontech/theme/tailwind/*`) não batem com
o `exports` corrente — exige bump coordenado.

---

## 6. Bugs conhecidos corrigidos na refatoração

- `containers.js` legado usava `@media (max-width: ${theme('screens.xl')})` no
  bloco `large`. Como `xl` é o próprio breakpoint, o bloco ficava órfão.
  Corrigido para `min-width: xl` no `containers.data.js`.
- `texts.js` legado era desktop-first (`max-width: md/sm`). Invertido para
  mobile-first no `texts.data.js`. Mapeamento aplicado:
  - bloco `large` (≤640) → `_`
  - bloco `medium` (≤768) → `sm` (≥640)
  - bloco `mobile` (default) → `md` (≥768)

---

## 7. Testes

Harness HTML em `src/tests/tokens.html` exercita classes semânticas
responsivas + utilities geradas do preset. Roda com:

```bash
npm run test:tokens:v3
```

Para validar o output v4 manualmente (Tailwind v4 ainda não está instalado
neste pacote):

```bash
npx @tailwindcss/cli@next -i dist/v4/globals.css -o /tmp/out.css
```

---

## 8. Roadmap

- [ ] Instalar `@tailwindcss/cli` v4 como devDep e adicionar `build:css:v4`.
- [ ] Migrar `animations.js` para um arquivo `.data.js` declarativo (hoje
      ainda é plugin imperativo).
- [ ] Validação de schema dos `*.data.js` (Zod) — proteger contra
      breakpoints inexistentes ou estruturas malformadas.
- [ ] Watch mode no builder.
- [ ] Bump coordenado do `@aziontech/theme` no `azion-console-kit` após a
      refatoração ser publicada (caminho `@aziontech/theme/tailwind/*` →
      `@aziontech/theme/tailwind-preset`).
