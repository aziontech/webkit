<h1 align="center">azion-theme · tokens</h1>

Design tokens organized as JavaScript modules, compiled into CSS custom properties. The build emits one target: `dist/globals.css` (Tailwind v4 CSS-first: `@import "tailwindcss"` + `@theme { … }` + plain `:root` for shape/typography semantics + `@layer components`).

Tokens live in JS as the source-of-truth and are compiled at package build time, not in the browser.

## 📋 Table of contents

- [Architecture overview](#-architecture-overview)
- [File structure](#-file-structure)
- [Token types](#-token-types)
- [Building & consuming](#-building--consuming)
- [How to add a new token](#-how-to-add-a-new-token)
- [Token references (`tokenRef`)](#-token-references-tokenref)
- [Theme switching](#-theme-switching)

---

## 🏗 Architecture overview

Three layers:

1. **Primitives** — raw, theme-invariant values (color hexes, px sizes, font sizes, durations).
2. **Semantic / theme** — light/dark variants and responsive (per-breakpoint) tokens that **reference** primitives via `tokenRef(...)`.
3. **Output bundle** — `dist/globals.css` (and `fonts.css`) emitted by `packages/theme/scripts/build-tokens.mjs`.

Compile pipeline:

```
src/tokens/primitives/**      ─┐
src/tokens/semantic/**        ─┼──►  scripts/build-tokens.mjs  ──►  dist/globals.css, dist/fonts.css
src/tokens/theme-colors.js    ─┤
scripts/lib/primitives.mjs    ─┘
```

- Primitives emit a single block (values don't change between themes).
- Semantic colors flip between `:root, [data-theme=light]` and `[data-theme=dark], .dark`.
- Responsive semantic tokens (spacing, typography) emit `@media (min-width: …)` overrides.

---

## 📂 File structure

```
packages/theme/
├── scripts/
│   ├── build-tokens.mjs         # main entrypoint: emits dist/
│   └── lib/
│       ├── primitives.mjs       # flattens primitive trees into CSS vars
│       └── zero-unit.mjs        # build gate: a zero length carries no unit
└── src/tokens/
    ├── primitives/              # raw, theme-invariant scales
    │   ├── colors/              # colors.js (palettes), brand.js, alpha.js
    │   ├── shape/               # aspect-video, container (3xs … 7xl), radius, shape aliases, size, spacing
    │   ├── typography/          # font-family, font-size, font-weight, leading, tracking
    │   ├── effects/             # blur, drop-shadow, inset-shadow, opacity, perspective, shadow
    │   ├── animations/          # animate.js (named animations), keyframes.js, ease.js
    │   ├── border-width.js      # border-width-0 … border-width-4
    │   ├── breakpoints.js       # sm, md, lg, xl, 2xl
    │   └── ring-offset.js
    ├── semantic/                # one file per token family
    │   ├── primary.js           # primary, primary-mask/selected/foreground
    │   ├── secondary.js, accent.js
    │   ├── success.js, warning.js, danger.js, info.js   # feedback fills + -border + -foreground
    │   ├── background.js        # bg-canvas, bg-surface, bg-mask, …
    │   ├── border.js            # border-default/muted/strong/selected
    │   ├── text.js              # text-default, text-muted, …
    │   ├── ring.js              # ring-color
    │   ├── code-syntax.js       # code-syntax-* highlighting colours
    │   ├── chart.js, illustration.js, severity.js
    │   ├── spacing.js           # spacing-2xs … spacing-2xl (responsive)
    │   ├── typography.js        # text-* bundles: font-size + line-height + letter-spacing
    │   ├── layout.js            # layout-* tokens (var() refs only) + layout utilities
    │   ├── z-index.js           # z-control, z-control-overlay
    │   └── code.js              # code editor metrics
    ├── token-ref.js             # tokenRef helper + isTokenRef guard + assertResolvedRefs
    └── theme-colors.js          # light/dark compiler (exported as ./theme-colors)
```

---

## 🎨 Token types

### Primitives

Plain JS objects with literal values. Theme-invariant.

```js
// tokens/primitives/colors/brand.js
export const brandPrimitives = {
  primary: { 50: '#FFF5EF', 100: '#FFE7D8', /* … */ 500: '#F3652B', /* … */ 950: '#401602' },
  accent: { 50: '#F6F6FF', /* … */ 500: '#8A84EC', /* … */ 950: '#0B0A19' },
  absolute: { black: '#0A0A0A', white: '#FCFCFC' }
}
```

```js
// tokens/primitives/shape/spacing.js
export const spacing = { 1: '4px', 2: '8px', /* … */ 96: '384px' }
```

### Semantic / theme

Objects with `light` / `dark` variants. Values are `tokenRef(...)` calls that point to primitives.

```js
// tokens/semantic/primary.js
import { tokenRef } from '../token-ref.js'

export const primary = {
  light: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.100'),
    'primary-hover': tokenRef('brand.primary.primary-600'),
    'primary-foreground': tokenRef('primitives.base.black')
  },
  dark: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.100'),
    'primary-hover': tokenRef('brand.primary.primary-600'),
    'primary-foreground': tokenRef('primitives.base.white')
  }
}
```

### Responsive semantic data

Spacing and typography use a per-breakpoint table that `build-tokens.mjs` flattens into `@media` overrides plus matching classes (`.gap-…`, `.p-…`, `.text-…`).

```js
// tokens/semantic/spacing.js
export const spacing = {
  'gap-sm': { _: '8px', md: '12px', xl: '16px' },
  'gap-md': { _: '12px', md: '16px', xl: '24px' }
  // …
}
```

`_` is the base value emitted in `:root`; the breakpoint keys (`sm`, `md`, `lg`, `xl`, `2xl`) become media-query overrides. A bare string is accepted as shorthand for `{ _: value }`.

### Derived groups (`layout.js`)

`semantic/layout` is a **derived** group: every value is a `var()` reference to `--spacing-*` /
`--container-*`, never a literal length.

```js
// tokens/semantic/layout.js
export const layout = {
  'layout-boundary-inline': 'var(--spacing-lg)',
  'layout-measure': 'var(--container-7xl)'
  // …
}
```

That indirection is the whole point, and it is why these carry no breakpoint map of their own: the
spacing scale is already responsive (`--spacing-lg` is `1rem`, then `1.5rem` from `sm`), and a `var()`
is substituted at **use** time on the element — so a layout token follows the breakpoint override for
free. Giving it its own map would duplicate the spacing scale into layout and let the two drift.

`semantic/code` holds the code editor metrics: `--code-editor-line-height` is `1rem` (16 px, the
console's editor line). `CodeEditor` reads it when it creates
Monaco, which takes the line height in pixels rather than from CSS.

The layout group also ships `layoutUtilities`, the container-system classes (`.layout-column`,
`.layout-boundary`, …) emitted as Tailwind v4 `@utility` blocks so they support variants
(`md:layout-column`). Each entry is a rule body: a string value is a declaration, an object value is
a nested rule keyed by a literal selector (`'&:first-child'`).

---

## 🔧 Building & consuming

### Building the package

```bash
# emit dist/globals.css
pnpm --filter @aziontech/theme build:tokens
```

Output lands in `packages/theme/dist/`.

### Consuming (Tailwind v4)

```css
/* main.css */
@import '@aziontech/theme';
```

No `tailwind.config.js` needed — v4 reads `@theme { … }` directly from the imported CSS.

Utilities like `text-default`, `bg-surface`, `border-default`, `text-primary`, `gap-md`, `p-md`, `.text-heading-lg`, `animate-popup-scale-in`, etc. are then available everywhere.

### As JS objects (Node / build steps)

```js
import { compileThemeVars, compileThemeCss } from '@aziontech/theme/theme-colors'

compileThemeVars() // → { light: { '--primary': '…', … }, dark: { … } }
compileThemeCss() // → ':root, [data-theme=light] { … }\n\n[data-theme=dark], .dark { … }'
```

### Injecting at runtime (browser)

```js
import { injectThemeCss } from '@aziontech/theme/theme-colors'

injectThemeCss() // appends a <style data-azion-theme> element to <head>
```

Only useful if you can't precompile and import `globals.css` — production usage should prefer the static stylesheet.

---

## ➕ How to add a new token

### Add a new primitive

1. Open the relevant file (e.g., `tokens/primitives/shape/spacing.js`).
2. Add the key/value:

   ```js
   export const spacing = {
     /* … */
     128: '512px' // new
   }
   ```

3. Rebuild (`pnpm --filter @aziontech/theme build:tokens`). The compiler picks it up and emits `--spacing-128: 512px`.

### Add a new semantic (theme) token

1. Pick the family file in `tokens/semantic/` (`border.js`, `background.js`, `danger.js`, …). A fill colour ships with its `-foreground` text pair.
2. Add the key with `tokenRef(...)` for both `light` and `dark`:

   ```js
   // tokens/semantic/border.js
   export const border = {
     light: {
       /* … */
       'border-emphasis': tokenRef('primitives.gray.400')
     },
     dark: {
       /* … */
       'border-emphasis': tokenRef('primitives.gray.500')
     }
   }
   ```

3. Give it a one-line purpose in `tokens/token-purpose.js` (what the token is for, not its value).
4. Rebuild. The new variable lands in both `:root` and `[data-theme=dark]` blocks.
5. Run `pnpm --filter @aziontech/webkit build:catalog`: the token export (`tokens/token-export.js`) carries the light and dark value and the purpose into `catalog.json` and the MCP `list_tokens`.

### The token export

`buildTokenExport()` in `tokens/token-export.js` lists every semantic token (the colour families, spacing, layout, z-index, code, the shape aliases and the typography classes) with its light and dark value (colours), or its base value and breakpoints (lengths and type classes), its group, the token it aliases, and its purpose from `tokens/token-purpose.js`. `test/token-export.test.mjs` fails when a semantic token has no purpose, a purpose names a token that is gone, or a value disagrees with the compiled theme; `check:catalog` fails when `catalog.json` was not rebuilt after a token change.

### Add a new responsive semantic token

1. Add an entry to the family file in `tokens/semantic/` (`spacing.js`, `typography.js`):

   ```js
   // tokens/semantic/spacing.js
   export const spacing = {
     /* … */
     'gap-2xl': { _: '32px', md: '40px', xl: '56px' }
   }
   ```

2. Give it a one-line purpose in `tokens/token-purpose.js`, then rebuild. `build-tokens.mjs` emits the base var in `:root`, per-breakpoint `@media` overrides, **and** a matching `.gap-2xl { gap: var(--gap-2xl) }` utility.

For typography bundles that need hover/focus without Tailwind utilities, add an optional `states` object (not flattened to CSS vars). Example — inline prose links in `typography.js`:

```js
'text-link': {
  fontSize: 'inherit',
  lineHeight: 'inherit',
  color: 'var(--text-link)',
  transition: 'color 150ms ease-out',
  states: {
    hover: { color: 'var(--text-link-hover)', textDecoration: 'underline' },
    'focus-visible': { outline: '2px solid var(--ring-color)', outlineOffset: '2px' },
  },
},
```

Bundles with `fontSize: 'inherit'` are omitted from the Tailwind `fontSize` preset (avoids clashing with `textColor.link` → class `text-link`). Interaction styles are emitted under `@layer components` as `.text-link:hover`, etc.

---

## 🔗 Token references (`tokenRef`)

`tokenRef(path)` returns a marker object `{ __ref: path }` that the compilers resolve at build time. Primitive-tree refs (`scripts/lib/primitives.mjs`) resolve against the full primitives tree (e.g. `shape.container.3xs`). Semantic theme refs (`src/tokens/theme-colors.js`) support these prefixes:

| Prefix                    | Looks up                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `primitives.X.Y.Z`        | `tokens/primitives/colors/colors.js` tree (e.g., `primitives.gray.900`, `primitives.alpha.orange.100`) |
| `brand.primary.primary-N` | `brandPrimitives.primary[N]` (e.g., `brand.primary.primary-500` → `#F3652B`)                           |
| `brand.accent.accent-N`   | `brandPrimitives.accent[N]`                                                                            |
| `brand.absolute.X`        | `brandPrimitives.absolute.X` (`black` / `white`)                                                       |
| `theme.<group>.X`         | an earlier semantic token of the same variant (emitted as `var(--X)`)                                  |

A ref that does not resolve — unknown prefix or dead path — **fails the build**: the compilers collect every miss and throw one aggregated `--var → ref` list (`assertResolvedRefs` in `src/tokens/token-ref.js`).

---

## 🌗 Theme switching

The compiled CSS has one theme switch, `data-theme`, plus the `dark` class Tailwind's `dark:` variant knows:

```css
:root,
[data-theme='light'] {
  /* light theme vars */
}

[data-theme='dark'],
.dark {
  /* dark theme vars */
}
```

Switching is a one-liner:

```js
document.documentElement.setAttribute('data-theme', 'dark') // or 'light' / 'system'
```

With no `data-theme` (or `data-theme="system"`), the page follows `prefers-color-scheme`.

---

## 🔗 Links

- [Figma Global Tokens](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Global-Tokens?node-id=0-1)
