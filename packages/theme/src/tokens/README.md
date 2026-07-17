<h1 align="center">azion-theme · tokens</h1>

Design tokens organized as JavaScript modules, compiled into CSS custom properties and a Tailwind config. The pipeline emits **two parallel targets** from the same source:

- **`dist/v3/`** — Tailwind v3 preset (`tailwind-preset.js` / `tailwind.config.js`) + a self-contained `globals.css` with `@tailwind` directives, `:root` / `[data-theme=dark]` blocks, responsive `@media` overrides, and the component classes.
- **`dist/v4/`** — Tailwind v4 CSS-first output: `globals.css` with `@import "tailwindcss"` + `@theme { … }` + plain `:root` for shape/typography semantics + `@layer components`.

Tokens live in JS as the source-of-truth and are compiled at package build time, not in the browser.

## 📋 Table of contents

- [Architecture overview](#-architecture-overview)
- [File structure](#-file-structure)
- [Token types](#-token-types)
- [Building & consuming](#-building--consuming)
- [How to add a new token](#-how-to-add-a-new-token)
- [Token references (`tokenRef`)](#-token-references-tokenref)
- [Test pages](#-test-pages)
- [Theme switching](#-theme-switching)

---

## 🏗 Architecture overview

Three layers:

1. **Primitives** — raw, theme-invariant values (color hexes, px sizes, font sizes, durations).
2. **Semantic / theme** — light/dark variants and responsive (per-breakpoint) tokens that **reference** primitives via `tokenRef(...)`.
3. **Output bundles** — `dist/v3/` and `dist/v4/` artifacts emitted by `scripts/build-tokens.mjs`.

Compile pipeline:

```
tokens/primitives/**          ─┐
                               │
tokens/semantic/colors.js     ─┤
tokens/semantic/*.data.js     ─┼──►  scripts/build-tokens.mjs  ──►  dist/v3/{globals.css,tailwind-preset.js,tailwind.config.js}
tokens/theme/**               ─┤                                    dist/v4/globals.css
                               │
scripts/{compile-primitives,  ─┘
        compile-theme,
        resolve,
        css-vars,
        refs}.js  (building blocks used by build-tokens.mjs)
```

- Primitives emit a single block (values don't change between themes).
- Semantic colors flip between `:root, [data-theme=light]` and `[data-theme=dark], .dark, .azion.azion-dark`.
- Responsive semantic tokens (containers, spacings, texts) emit `@media (min-width: …)` overrides.

---

## 📂 File structure

```
src/
├── tokens/
│   ├── primitives/
│   │   ├── colors/
│   │   │   ├── colors.js        # base, blue, gray, violet, orange, slate, yellow,
│   │   │   │                    # green, red + surface palettes + brand re-export
│   │   │   ├── brand.js         # primary, accent, surfaces, absolute
│   │   │   └── alpha.js         # alpha variants for each palette
│   │   ├── shape/
│   │   │   ├── aspect-video.js
│   │   │   ├── container.js     # container-3xs … container-7xl
│   │   │   ├── height.js        # h-2 … h-96
│   │   │   ├── radius.js        # none, sm, DEFAULT, md, lg, xl, 2xl, 3xl, full
│   │   │   ├── shape.js         # shape aliases (`max-w-*`, etc.)
│   │   │   ├── size.js          # size-2 … size-96
│   │   │   ├── spacing.js       # spacing-1 … spacing-96
│   │   │   └── width.js         # w-3xs … w-7xl (alias → container.X)
│   │   ├── typography/
│   │   │   ├── font-family.js   # sans, mono, code
│   │   │   ├── font-size.js     # text-xs … text-9xl
│   │   │   ├── font-weight.js   # 100 … 900
│   │   │   ├── leading.js       # leading-3 … leading-10
│   │   │   ├── line-height.js   # line-height-none … line-height-loose
│   │   │   └── tracking.js      # tracking-tighter … tracking-widest
│   │   ├── effects/
│   │   │   ├── blur.js          # blur-xs … blur-3xl
│   │   │   ├── drop-shadow.js
│   │   │   ├── inset-shadow.js
│   │   │   ├── opacity.js       # opacity-0 … opacity-100
│   │   │   ├── perspective.js
│   │   │   └── shadow.js        # box-shadow scale
│   │   ├── animations/
│   │   │   ├── animate.js       # named keyframe animations
│   │   │   └── ease.js          # easing curves
│   │   ├── border-widths.js     # border-0 … border-4
│   │   ├── breakpoints.js       # sm, md, lg, xl, 2xl
│   │   └── ring-offset.js
│   ├── theme/
│   │   ├── primary.js           # primary, primary-mask/hover/contrast
│   │   ├── secondary.js
│   │   ├── accent.js
│   │   ├── surfaces.js          # surface-0 … surface-950 (alias for gray)
│   │   ├── background.js        # bg-canvas, bg-surface, bg-mask, …
│   │   ├── border.js            # border-default/muted/strong/selected
│   │   ├── text.js              # text-default, text-muted
│   │   ├── ring.js              # ring-color
│   │   └── feedback/
│   │       ├── success.js
│   │       ├── warning.js
│   │       ├── danger.js
│   │       └── info.js
│   ├── semantic/
│   │   ├── colors.js            # text/background/border semantic refs (consumed by v3 preset)
│   │   ├── containers.js        # static + responsive container tokens
│   │   ├── containers.data.js   # `{ key: { sm, md, lg, … } }` data table
│   │   ├── spacings.js
│   │   ├── spacings.data.js
│   │   ├── texts.js
│   │   ├── texts.data.js        # font-size + line-height + letter-spacing bundles
│   │   └── animations.js
│   ├── theme.js                 # Tailwind theme.extend (colors + semantic mappings)
│   └── index.js                 # public re-exports
├── scripts/
│   ├── refs.js                  # tokenRef helper + isTokenRef guard
│   ├── resolve.js               # resolves `tokenRef` paths to literal values
│   ├── css-vars.js              # builds light/dark CSS var maps from semantic refs
│   ├── compile-primitives.js    # flattens primitive trees into CSS vars
│   ├── compile-theme.js         # legacy theme compiler (used by the harness pages)
│   └── build-tokens.mjs         # main entrypoint: emits dist/v3 and dist/v4 bundles
└── tests/
    ├── primitives.html          # visual harness for all primitives
    ├── theme.html               # semantic tokens with light/dark toggle
    └── tokens.html              # combined view
```

---

## 🎨 Token types

### Primitives

Plain JS objects with literal values. Theme-invariant.

```js
// tokens/primitives/colors/brand.js
export const brandPrimitives = {
  primary: { 50: '#FFF5EF', 100: '#FFE7D8', /* … */ 500: '#FE601F', /* … */ 950: '#401602' },
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
// tokens/theme/primary.js
import { tokenRef } from '../../scripts/refs.js'

export const primary = {
  light: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.100'),
    'primary-hover': tokenRef('brand.primary.primary-600'),
    'primary-contrast': tokenRef('primitives.base.black')
  },
  dark: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.100'),
    'primary-hover': tokenRef('brand.primary.primary-600'),
    'primary-contrast': tokenRef('primitives.base.white')
  }
}
```

### Responsive semantic data (`*.data.js`)

Containers, spacings, and texts use a per-breakpoint table that `build-tokens.mjs` flattens into `@media` overrides plus matching component classes (`.gap-…`, `.p-…`, `.text-…`, `.px-container`, `.py-container`, `.max-container-width`).

```js
// tokens/semantic/spacings.data.js
export const spacingsData = {
  'gap-sm': { _: '8px', md: '12px', xl: '16px' },
  'gap-md': { _: '12px', md: '16px', xl: '24px' }
  // …
}
```

`_` is the base value emitted in `:root`; the breakpoint keys (`sm`, `md`, `lg`, `xl`, `2xl`) become media-query overrides.

---

## 🔧 Building & consuming

### Building the package

```bash
# emit both v3 and v4 bundles
pnpm --filter @aziontech/theme build:tokens

# only one target
pnpm --filter @aziontech/theme build:tokens:v3
pnpm --filter @aziontech/theme build:tokens:v4

# v3 + compile final CSS with tailwindcss
pnpm --filter @aziontech/theme build:css:v3
```

Outputs land in `packages/theme/dist/v3/` and `packages/theme/dist/v4/`.

### Consuming in a Tailwind v3 project

```js
// tailwind.config.js
import themePreset from '@aziontech/theme/tailwind-preset/v3'

export default {
  presets: [themePreset],
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class']
}
```

```css
/* main.css */
@import '@aziontech/theme/v3/globals.css';
```

Utilities like `text-default`, `bg-surface`, `border-default`, `text-primary`, `gap-md`, `p-md`, `.text-heading-lg`, etc. are then available everywhere.

### Consuming in a Tailwind v4 project

```css
/* main.css */
@import '@aziontech/theme/v4/globals.css';
```

No `tailwind.config.js` needed — v4 reads `@theme { … }` directly from the imported CSS.

### As JS objects (Node / build steps)

```js
import { createCssVars, cssVarsString } from '@aziontech/theme'

createCssVars() // → { light: { '--text-default': '#1A1A1A', … }, dark: { … } }
cssVarsString() // → ':root, [data-theme=light], .azion.azion-light { … } [data-theme=dark], … { … }'
```

### Injecting at runtime (browser)

```js
import { injectCssVars } from '@aziontech/theme'

injectCssVars() // appends a <style data-azion-tokens> element to <head>
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

1. Pick the right file (`tokens/theme/*.js` or `tokens/theme/feedback/*.js`).
2. Add the key with `tokenRef(...)` for both `light` and `dark`:

   ```js
   // tokens/theme/border.js
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

3. Rebuild. The new variable lands in both `:root` and `[data-theme=dark]` blocks.

### Add a new responsive semantic token

1. Add an entry to the relevant `*.data.js` file in `tokens/semantic/`:

   ```js
   // tokens/semantic/spacings.data.js
   export const spacingsData = {
     /* … */
     'gap-2xl': { _: '32px', md: '40px', xl: '56px' }
   }
   ```

2. Rebuild. `build-tokens.mjs` emits the base var in `:root`, per-breakpoint `@media` overrides, **and** a matching `.gap-2xl { gap: var(--gap-2xl) }` utility.

For typography bundles that need hover/focus without Tailwind utilities, add an optional `states` object (not flattened to CSS vars). Example — inline prose links in `texts.data.js`:

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

`tokenRef(path)` returns a marker object `{ __ref: path }` that the compiler resolves at build time. Supported path prefixes (see `scripts/resolve.js`):

| Prefix                        | Looks up                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `primitives.X.Y.Z`            | `tokens/primitives/colors/colors.js` tree (e.g., `primitives.gray.900`, `primitives.alpha.orange.100`) |
| `surfacePrimitives.surface.N` | the surface palette (used internally; usually referenced via `brand.surfaces.…`)                       |
| `brand.surfaces.surface-N`    | `surfacePrimitives.surface[N]` (e.g., `brand.surfaces.surface-100` → `#F5F5F5`)                        |
| `brand.primary.primary-N`     | `brandPrimitives.primary[N]` (e.g., `brand.primary.primary-500` → `#FE601F`)                           |
| `brand.accent.accent-N`       | `brandPrimitives.accent[N]`                                                                            |
| `brand.absolute.X`            | `brandPrimitives.absolute.X` (`black` / `white`)                                                       |

Refs of unknown prefixes are left as the raw path string in the output — flag for "this needs resolver support".

---

## 🧪 Test pages

Local visual harnesses (require a static server because of ESM imports):

```bash
npx http-server packages/theme/src -p 8080
```

- `http://localhost:8080/tests/primitives.html` — every primitive rendered as a swatch / scale.
- `http://localhost:8080/tests/theme.html` — semantic tokens with a **light/dark toggle**.
- `http://localhost:8080/tests/tokens.html` — combined view.

---

## 🌗 Theme switching

The compiled CSS targets multiple hooks so the runtime can pick whichever convention the consumer uses:

```css
:root,
[data-theme='light'],
.azion.azion-light {
  /* light theme vars */
}

[data-theme='dark'],
.dark,
.azion.azion-dark {
  /* dark theme vars */
}
```

Switching is a one-liner:

```js
// data-attribute strategy
document.documentElement.setAttribute('data-theme', 'dark') // or 'light'

// Tailwind class strategy
document.documentElement.classList.toggle('dark')

// Azion namespaced classes (use one or the other)
document.documentElement.classList.add('azion', 'azion-dark')
```

All three strategies hit the same set of CSS variables.

---

## 🔗 Links

- [Figma Global Tokens](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Global-Tokens?node-id=0-1)
