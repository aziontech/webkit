# @aziontech/theme

Azion's design-token system, compiled into a single **Tailwind CSS v4** stylesheet: primitive palettes, brand colors, light/dark semantic tokens, the full text-style scale, motion utilities and `@keyframes`, and the `@font-face` set — plus the raw token data as importable JavaScript.

The package ships one prebuilt artifact (`dist/v4/globals.css`) and four small JS entry points. There is no Tailwind preset, plugin, or `tailwind.config.js` step — v4 reads the `@theme` / `@utility` definitions directly from the imported CSS.

## Installation

```bash
npm install @aziontech/theme
# or
pnpm add @aziontech/theme
# or
yarn add @aziontech/theme
```

Tailwind CSS v4 must be present in the consuming build — the stylesheet begins with `@import "tailwindcss"`.

## Quick start

### 1. Import the stylesheet

In your app's root CSS:

```css
@import '@aziontech/theme';
```

or from JavaScript (Vite and friends):

```javascript
import '@aziontech/theme'
```

That single import provides:

- the `@font-face` declarations for the Azion type system (no separate font imports needed);
- every primitive CSS variable (colors, spacing, shape, typography, effects, breakpoints);
- the semantic light/dark variables (`--primary`, `--text-default`, `--surface-0`…);
- text-style utilities (`text-heading-2xl`, `text-big-number-md`, …) with responsive sizes;
- animation utilities and their `@keyframes` (consumers pair every motion class with a `motion-reduce:` fallback).

### 2. Switch themes

Light is the default (`:root`). Dark mode activates on any of these hooks:

```html
<html data-theme="dark">
  <!-- or -->
  <body class="dark">
    <!-- or the legacy pair -->
    <div class="azion azion-dark"></div>
  </body>
</html>
```

```javascript
// Toggle at runtime
document.documentElement.dataset.theme = 'dark' // or 'light'
```

Light-mode selectors: `:root`, `[data-theme='light']`, `.azion.azion-light`.
Dark-mode selectors: `[data-theme='dark']`, `.dark`, `.azion.azion-dark`.

## Exports

The entire public surface, from `package.json#exports`:

| Path                            | What it is                                                                 |
| ------------------------------- | -------------------------------------------------------------------------- |
| `@aziontech/theme`              | the compiled stylesheet (`dist/v4/globals.css`)                            |
| `@aziontech/theme/colors`       | color primitives: `primitives`, `brandPrimitives`, `surfacePrimitives`     |
| `@aziontech/theme/animations`   | motion primitives: `animate`, `curve`, `duration`, `useWhen`               |
| `@aziontech/theme/texts`        | `textsData` — font-size/line-height/weight bundles per text style          |
| `@aziontech/theme/theme-colors` | semantic compiler: `compileThemeVars`, `compileThemeCss`, `injectThemeCss` |

## JavaScript token access

### Color primitives

```javascript
import { primitives, brandPrimitives, surfacePrimitives } from '@aziontech/theme/colors'

primitives.orange[600] // '#D94A03' — primary brand
primitives.blue[500] // '#0072F5' — accent
primitives.violet[500] // '#8A84EC' — brand.accent palette
primitives.gray[900] // '#141414'

brandPrimitives.primary[600] // '#D94A03'
brandPrimitives.absolute.white // '#FFFFFF'

surfacePrimitives.surface[0] // '#FFFFFF'
surfacePrimitives.surface[950] // '#0A0A0A'
```

Available palettes: `base`, `blue`, `gray`, `slate`, `orange`, `violet`, `yellow`, `green`, `red` — plus the `brand`, `surface`, and `alpha` groups.

### Motion primitives

```javascript
import { curve, duration, animate } from '@aziontech/theme/animations'

curve['productive-exit'] // easing cubic-bezier
duration['fast-02'] // ms value
animate.shimmer // keyframe-backed animation definition
```

### Text styles

```javascript
import { textsData } from '@aziontech/theme/texts'

textsData['text-heading-2xl']
// { fontSize: { _: '1.875rem', sm: '3rem', md: '3.5rem' }, lineHeight: 1.25, fontWeight: 400 }
```

Responsive `fontSize` keys (`_`, `sm`, `md`, …) become `@media (min-width: …)` overrides in the compiled utilities.

### Semantic variables as JS (Node / build steps / runtime)

```javascript
import { compileThemeVars, compileThemeCss, injectThemeCss } from '@aziontech/theme/theme-colors'

compileThemeVars()
// → { light: { '--primary': '#D94A03', '--text-default': '#141414', … }, dark: { … } }

compileThemeCss()
// → ':root, [data-theme=light], .azion.azion-light { … }\n\n[data-theme=dark], .dark, … { … }'

injectThemeCss() // appends a <style data-azion-theme> element to <head>
```

Only useful when you can't precompile — production usage should prefer the static stylesheet.

## CSS variables

The semantic layer flips automatically between modes:

```css
:root,
[data-theme='light'],
.azion.azion-light {
  --primary: #d94a03;
  --text-default: #141414;
  /* … */
}

[data-theme='dark'],
.dark,
.azion.azion-dark {
  --text-default: #fafafa;
  /* … */
}
```

Use them directly:

```css
.custom-component {
  color: var(--text-default);
  border-color: var(--primary);
}
```

Utility equivalents are generated in the same stylesheet (e.g. `@utility text-default`), so `class="text-default"` works wherever Tailwind runs.

## Breakpoints and container sizes

Two scales answer two different questions. Both ship in `dist/v4/globals.css` and Tailwind v4 reads
them directly.

**Viewport breakpoints** (`sm:`, `md:` … and `max-sm:`, `max-md:` …) say how big the **window** is.
Use them only for what belongs to the window: the app shell (sidebar or navigation drawer), dialogs
and drawers turning into sheets, the page boundary.

| Variant | Token              | Width   | What changes there                                                                |
| ------- | ------------------ | ------- | --------------------------------------------------------------------------------- |
| `sm`    | `--breakpoint-sm`  | 640 px  | Below it: phones. Dialogs and drawers are full-height, full-width sheets.         |
| `md`    | `--breakpoint-md`  | 768 px  | Below it: dialogs and drawers are bottom sheets; the console sidebar is a drawer. |
| `lg`    | `--breakpoint-lg`  | 1024 px | Tablets in landscape and small laptops.                                           |
| `xl`    | `--breakpoint-xl`  | 1280 px | Laptops: the site header shows its navigation inline.                             |
| `2xl`   | `--breakpoint-2xl` | 1536 px | Desktops.                                                                         |

Wider screens (1920, 2560 px) add margin, not line length: every page column is capped by a
`--layout-measure*` token (the widest is `--container-7xl`, 1620 px) through the `layout-column*`
utilities.

**Container sizes** (`@container`, then `@sm:`, `@md:` … and `@max-sm:` …) say how big the
**component's own box** is. A table in a drawer, a header in a split view, a field in a card lay out
for that box, not for the window. The variants read the same `--container-*` scale used for widths:
the theme declares the scale in `@theme`, which replaces Tailwind's default container scale (where
`@md` would be 448 px and `@2xl` 672 px), so `@md:` means "my container is at least 472 px" and
`@2xl:` 752 px. Write the variant, never a raw `@min-[47rem]:` for a size the scale already has.
`test/standards/container-scale.test.mjs` in `@aziontech/webkit` compiles every variant against
this stylesheet and fails if one drifts from the table below.

| Variant | Token             | Width  | Variant | Token             | Width   |
| ------- | ----------------- | ------ | ------- | ----------------- | ------- |
| `@3xs`  | `--container-3xs` | 256 px | `@2xl`  | `--container-2xl` | 752 px  |
| `@2xs`  | `--container-2xs` | 300 px | `@3xl`  | `--container-3xl` | 876 px  |
| `@xs`   | `--container-xs`  | 348 px | `@4xl`  | `--container-4xl` | 1024 px |
| `@sm`   | `--container-sm`  | 408 px | `@5xl`  | `--container-5xl` | 1192 px |
| `@md`   | `--container-md`  | 472 px | `@6xl`  | `--container-6xl` | 1388 px |
| `@lg`   | `--container-lg`  | 552 px | `@7xl`  | `--container-7xl` | 1620 px |
| `@xl`   | `--container-xl`  | 644 px |         |                   |         |

Name a container when a nested one could answer first: `@container/card` on the box, then
`@md/card:grid-cols-2` inside. Only put `@container` on a box whose width comes from its parent
(a block, a grid track, a `flex-1` item): inline-size containment gives the box no intrinsic width,
so a shrink-to-fit box (`inline-flex`, `w-fit`, an absolutely positioned popover) collapses.

**Touch and pointer.** Interactive targets are at least 24 × 24 px everywhere and 44 × 44 px on a
coarse pointer: grow the hit area with `pointer-coarse:` (built into Tailwind v4.1+) rather than the
drawn size where the drawn size is part of a dense layout. Tailwind v4 already limits `hover:` to
`@media (hover: hover)`; anything revealed on hover must also be revealed on focus and under
`[@media(hover:none)]:`, so no affordance is hover-only.

## Token resolution

Tokens use a reference system for maintainability:

```javascript
// Define token reference
const textColor = tokenRef('primitives.gray.900')

// The compilers (scripts/compile-primitives.js, scripts/compile-theme.js)
// resolve refs to literal values at build time — and throw, listing every
// miss, if a ref does not resolve.
compileThemeVars()
// Output: { light: { '--text-default': '#141414', … }, dark: { … } }
```

The full reference — supported `tokenRef` prefixes, the build pipeline, how to add a token — lives in [`src/tokens/README.md`](./src/tokens/README.md).

## Development

```bash
pnpm build:tokens # node src/scripts/build-tokens.mjs → dist/v4/globals.{css,scss}
pnpm build:dts    # vue-tsc --declaration (emit .d.ts next to sources)
pnpm format       # prettier over scripts/ and src/
pnpm pack:dry     # inspect the tarball contents
```

`dist/` is committed, and `prepack` reruns `build:tokens` + `build:dts` — every publish rebuilds the artifact from source, so a stale or hand-edited `dist/` can never ship.

### Project structure

```
packages/theme/
├── tokens.js                    # in-repo JS barrel (not shipped — use the subpath exports)
├── src/
│   ├── tokens/
│   │   ├── primitives/          # colors (brand/surface/alpha), typography, shape, effects, animations, …
│   │   ├── semantic/            # texts/containers/spacings/z-indices data + semantic color refs
│   │   ├── theme/               # light/dark semantic groups (primary, background, text, ring, feedback/…)
│   │   └── README.md            # in-depth token documentation
│   └── scripts/
│       ├── refs.js              # tokenRef + isTokenRef + assertResolvedRefs
│       ├── compile-primitives.js
│       ├── compile-theme.js     # exported as ./theme-colors
│       └── build-tokens.mjs     # main entrypoint: emits dist/v4
├── dist/v4/globals.css          # the shipped stylesheet (committed; rebuilt on publish)
└── package.json
```

## Browser support

Modern evergreen browsers with CSS custom-properties support (Chrome, Firefox, Safari, Edge).

## Versioning

This package follows [Semantic Versioning](https://semver.org/). Versions are managed by [release-please](https://github.com/googleapis/release-please): merges to `main` update a Release PR, and merging that Release PR cuts the version and publishes.

## Contributing

This package is part of the Azion WebKit monorepo. Please see the main repository for contribution guidelines.

## License

MIT © Azion Technologies

## Links

- [GitHub Repository](https://github.com/aziontech/webkit)
- [NPM Package](https://www.npmjs.com/package/@aziontech/theme)
- [Issue Tracker](https://github.com/aziontech/webkit/issues)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
