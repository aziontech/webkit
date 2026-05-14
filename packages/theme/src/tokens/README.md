<h1 align="center">azion-theme · tokens</h1>

Design tokens organized as JavaScript modules, ready to be compiled into CSS custom properties. Architecture targets **Tailwind CSS v4** (CSS-first `@theme` / single stylesheet) — tokens live in JS as the source-of-truth and are compiled to CSS variables at build time.

## 📋 Table of contents

- [Architecture overview](#-architecture-overview)
- [File structure](#-file-structure)
- [Token types](#-token-types)
- [Compile & inject](#-compile--inject)
- [How to add a new token](#-how-to-add-a-new-token)
- [Token references (`tokenRef`)](#-token-references-tokenref)
- [Test pages](#-test-pages)
- [Theme switching](#-theme-switching)

---

## 🏗 Architecture overview

Two layers:

1. **Primitives** — raw, theme-invariant values (color hexes, px sizes, font sizes, etc.).
2. **Theme (semantic)** — light/dark variants that **reference** primitives via `tokenRef(...)`.

Compile pipeline:

```
tokens/primitives/*.js  ─┐
                         ├─►  scripts/compile-primitives.js  ─►  :root { --color-… --size-… }
tokens/theme/*.js       ─┘                                       (single block — values don't change)
                         └─►  scripts/compile-theme.js       ─►  :root, [data-theme=light] { … }
                                                                 [data-theme=dark]         { … }
```

- Primitives are **absolute** and emit one block (`:root, [data-theme=light]`).
- Theme tokens have **light** and **dark** variants and emit two blocks. Only theme vars flip between themes.

---

## 📂 File structure

```
src/
├── tokens/
│   ├── primitives/
│   │   ├── colors/
│   │   │   ├── colors.js        # base, gray, violet, orange, slate, yellow,
│   │   │   │                    # green, blue, neutral, red, surface (+ brand, alpha)
│   │   │   ├── brand.js         # primary, accent, absolute (brand colors)
│   │   │   └── alpha.js         # alpha variants for each palette
│   │   ├── shape/
│   │   │   ├── container.js     # container-3xs … container-7xl
│   │   │   ├── height.js        # h-2 … h-96
│   │   │   ├── radius.js        # rounded-none … rounded-3xl, full
│   │   │   ├── size.js          # size-2 … size-96
│   │   │   ├── spacing.js       # spacing-1 … spacing-96
│   │   │   └── width.js         # w-3xs … w-7xl (alias → container.X)
│   │   ├── typography/
│   │   │   ├── font-family.js   # sans, code, display
│   │   │   ├── font-size.js     # text-xs … text-9xl
│   │   │   └── line-height.js   # leading-none, leading-3 … leading-10
│   │   ├── effects/
│   │   │   ├── blur.js          # blur-xs … blur-3xl
│   │   │   └── opacity.js       # opacity-25/50/75/100
│   │   ├── border-widths.js     # border-0 … border-4
│   │   ├── breakpoints.js       # sm, md, lg, xl, 2xl
│   │   └── ring-offset.js       # ring-offset
│   ├── theme/
│   │   ├── primary.js           # primary, primary-mask/selected/hover/active/contrast
│   │   ├── secondary.js         # secondary, secondary-*
│   │   ├── accent.js            # accent, accent-*
│   │   ├── surfaces.js          # surface-0 … surface-950 (aliases for gray)
│   │   ├── background.js        # bg-canvas, bg-surface, bg-mask, …
│   │   ├── border.js            # border-default, border-muted, border-strong, border-selected
│   │   ├── text.js              # text-default, text-muted
│   │   ├── ring.js              # ring-color
│   │   └── feedback/
│   │       ├── success.js       # success, success-border, success-contrast
│   │       ├── warning.js
│   │       ├── danger.js
│   │       └── info.js
│   └── semantic/                # legacy semantic colors (pre-v4 pipeline)
│       └── colors.js
├── scripts/
│   ├── refs.js                  # tokenRef helper
│   ├── resolve.js               # legacy resolver (semantic/colors.js)
│   ├── css-vars.js              # legacy CSS-vars compiler
│   ├── compile-primitives.js    # NEW: flattens primitives → :root
│   └── compile-theme.js         # NEW: resolves theme refs → :root + [data-theme=dark]
└── tests/
    ├── primitives.html          # visual harness for all primitives
    └── theme.html               # visual harness with light/dark toggle
```

---

## 🎨 Token types

### Primitives

Plain JS objects with literal values. Theme-invariant.

```js
// tokens/primitives/colors/brand.js
export const brand = {
  primary: { 50: '#FFF5EF', 100: '#FFE7D8', /* … */ 500: '#FE601F', /* … */ 950: '#401602' },
  accent:  { 50: '#F6F6FF', /* … */ 500: '#8A84EC', /* … */ 950: '#0B0A19' },
  absolute: { black: '#0A0A0A', white: '#FCFCFC' },
};
```

```js
// tokens/primitives/shape/spacing.js
export const spacing = { 1: '4px', 2: '8px', /* … */ 96: '384px' };
```

### Theme (semantic)

Objects with `light` / `dark` variants. Values are `tokenRef(...)` calls that point to primitives (or to other semantic tokens like `theme.surfaces.surface-X`).

```js
// tokens/theme/primary.js
import { tokenRef } from '../../scripts/refs.js';

export const primary = {
  light: {
    primary:           tokenRef('brand.primary.primary-500'),
    'primary-mask':    tokenRef('primitives.alpha.orange.100'),
    'primary-hover':   tokenRef('brand.primary.primary-600'),
    'primary-contrast': tokenRef('primitives.base.black'),
  },
  dark: {
    primary:           tokenRef('brand.primary.primary-500'),
    'primary-mask':    tokenRef('primitives.alpha.orange.100'),
    'primary-hover':   tokenRef('brand.primary.primary-600'),
    'primary-contrast': tokenRef('primitives.base.white'),
  },
};
```

---

## 🔧 Compile & inject

### In the browser

```js
import { injectPrimitivesCss } from '@aziontech/theme/scripts/compile-primitives.js';
import { injectThemeCss }      from '@aziontech/theme/scripts/compile-theme.js';

injectPrimitivesCss();   // <style data-azion-primitives> with all primitive vars
injectThemeCss();        // <style data-azion-theme>      with light+dark theme vars
```

Then use the variables anywhere:

```css
.btn {
  background: var(--primary);
  color: var(--primary-contrast);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}
.btn:hover { background: var(--primary-hover); }
```

### As CSS strings (Node / SSR / build step)

```js
import { compilePrimitivesCss } from '@aziontech/theme/scripts/compile-primitives.js';
import { compileThemeCss }      from '@aziontech/theme/scripts/compile-theme.js';

const css = compilePrimitivesCss() + '\n' + compileThemeCss();
fs.writeFileSync('dist/theme.css', css);
```

### As JS objects

```js
import { compilePrimitivesVars } from '@aziontech/theme/scripts/compile-primitives.js';
import { compileThemeVars }      from '@aziontech/theme/scripts/compile-theme.js';

compilePrimitivesVars();  // → { '--color-orange-500': '#FE601F', '--spacing-1': '4px', … }
compileThemeVars();       // → { light: {…}, dark: {…} }
```

---

## ➕ How to add a new token

### Add a new primitive

1. Open the relevant file (e.g., `tokens/primitives/shape/spacing.js`).
2. Add the key/value:

   ```js
   export const spacing = {
     /* … */
     128: '512px',   // new
   };
   ```

3. Done. It is automatically picked up by `compile-primitives.js`, producing `--spacing-128: 512px`.

### Add a new semantic (theme) token

1. Pick the right file (`tokens/theme/*.js` or `tokens/theme/feedback/*.js`).
2. Add the key with `tokenRef(...)` for both `light` and `dark`:

   ```js
   // tokens/theme/border.js
   export const border = {
     light: {
       /* … */
       'border-emphasis': tokenRef('primitives.gray.400'),
     },
     dark: {
       /* … */
       'border-emphasis': tokenRef('primitives.gray.500'),
     },
   };
   ```

3. The compile script picks it up automatically — emits `--border-emphasis` inside both blocks.

### Add a new semantic group (new file)

1. Create `tokens/theme/<group>.js` exporting `{ light, dark }`.
2. Register it in `scripts/compile-theme.js`:

   ```js
   import { yourGroup } from '../tokens/theme/your-group.js';
   /* … inside compileVariant(variant): */
   const groups = [ /* …, */ yourGroup[variant] ];
   ```

---

## 🔗 Token references (`tokenRef`)

`tokenRef(path)` returns a marker object `{ __ref: path }` that the compiler resolves at build time.

Supported path prefixes (handled by `scripts/compile-theme.js`):

| Prefix | Looks up |
|---|---|
| `primitives.X.Y.Z` | `tokens/primitives/colors/colors.js` tree (e.g., `primitives.gray.900`, `primitives.alpha.orange.100`) |
| `brand.primary.primary-N` | `brand.primary[N]` (e.g., `brand.primary.primary-500` → `#FE601F`) |
| `brand.accent.accent-N` | `brand.accent[N]` |
| `brand.absolute.X` | `brand.absolute.X` (`black` / `white`) |
| `theme.surfaces.surface-N` | the semantic surface map (chain: surface → gray primitive) |

Refs of unknown prefixes are left as the raw path string in the output — flag for "this needs resolver support".

---

## 🧪 Test pages

Local visual harnesses (require a static server because of ESM imports):

```bash
npx http-server packages/theme/src -p 8080
```

- `http://localhost:8080/tests/primitives.html` — all primitives rendered as swatches/scales (396 vars).
- `http://localhost:8080/tests/theme.html` — semantic tokens with a **light/dark toggle button** (59 + 59 vars). Body, buttons, alerts, surfaces, and swatches all react to the toggle.

---

## 🌗 Theme switching

The compiled CSS targets multiple hooks so the runtime can pick whichever convention the consumer uses:

```css
:root, [data-theme=light], .azion.azion-light {
  /* light theme vars */
}

[data-theme=dark], .dark, .azion.azion-dark {
  /* dark theme vars */
}
```

Switching is a one-liner:

```js
document.documentElement.setAttribute('data-theme', 'dark'); // or 'light'
```

Or, if you prefer Tailwind's `dark` class strategy:

```js
document.documentElement.classList.toggle('dark');
```

Both work because the selectors cover both conventions.

---

## 🔗 Links

- [Figma Global Tokens](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Global-Tokens?node-id=0-1)
