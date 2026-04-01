# Foundations Documentation Layer — Storybook

## Context

The webkit monorepo has 81 component stories but zero design system foundations documentation. The theme package has a complete 3-layer token system (Primitives → Semantic → CSS Vars → Tailwind), and the icons package has 402 icons with a catalog.json. This plan adds a `Foundations/` category in Storybook documenting Colors, Typography, Spacing, and Iconography — sourced dynamically from the existing packages, with reusable Vue 3 documentation components.

---

## Architecture Decisions

- **CSF2 `.stories.js` over MDX** — consistent with the 81 existing stories; MDX has no established pattern in this codebase
- **Dynamic token data** — `createCssVars()` from `@aziontech/theme/tokens` is called once at module load to get all resolved hex values; no hardcoding
- **Vue SFC components** — all documentation components are `.vue` files in `src/components/foundations/`
- **No new dependencies** — zero new `npm install` operations

---

## File Structure

### New files to create

```
apps/storybook/src/
├── foundations-data/
│   ├── tokens.js          ← derives color data from @aziontech/theme/tokens
│   ├── typography.js      ← mirrors semantic-texts-plugin values as JS array
│   └── spacing.js         ← mirrors semantic-spacing-plugin values as JS array
├── components/foundations/
│   ├── ColorSwatch.vue    ← single color chip (inline style for bg)
│   ├── ColorPalette.vue   ← grid of swatches under a heading
│   ├── TokenTable.vue     ← generic table, reused across all sections
│   ├── TypographyPreview.vue
│   ├── SpacingPreview.vue
│   └── IconGrid.vue       ← searchable icon gallery
└── stories/foundations/
    ├── Colors.stories.js
    ├── Typography.stories.js
    ├── Spacing.stories.js
    └── Iconography.stories.js
```

### Existing files to modify

```
apps/storybook/.storybook/preview.js   → storySort.order: add 'Foundations'
```

---

## Data Extraction Strategy

### Colors
```js
// In foundations-data/tokens.js
import {
  createCssVars,
  primitives,
  brandPrimitives,
  surfacePrimitives,
  textSemantic,
  backgroundSemantic,
  borderSemantic
} from '@aziontech/theme/tokens'

const { light, dark } = createCssVars()
// light/dark are flat objects: { '--text-default': '#111827', ... }
```

- **Primitive groups**: Walk `primitives` (gray, orange, violet, etc.) and `surfacePrimitives`
- **Brand groups**: Walk `brandPrimitives.primary`, `.accent`, `.absolute`
- **Semantic groups**: Walk `textSemantic.light` keys → look up `light['--text-' + key]` and `dark['--text-' + key]`

### Typography
Static JS array in `typography.js` mirroring the CSS values from `packages/theme/src/tailwind/semantic-texts-plugin`. Class name strings must appear as literals (not dynamically constructed) so Tailwind's scanner includes them.

### Spacing
Same approach as Typography — static array mirroring `semantic-spacing-plugin`.

### Icons
```js
import icons from '@aziontech/icons/catalog'
// [{ icon: 'ai ai-angular', name: 'ai-angular', keywords: '' }, ...]
```
Passed directly as a prop to `IconGrid.vue`. Filtering done via `computed` inside the component.

---

## Component APIs

### `ColorSwatch.vue`
```js
props: {
  name: String,        // 'gray-500'
  value: String,       // '#6b7280'
  darkValue: String,   // optional, for semantic tokens
  cssVar: String,      // optional, '--text-default'
  size: { type: String, default: 'md' }  // 'sm' | 'md' | 'lg'
}
```
Renders a color chip using **inline `style`** binding (not Tailwind class) for background. Shows both light/dark values simultaneously — no dependency on Storybook theme toggle.

### `ColorPalette.vue`
```js
props: {
  title: String,
  description: String,
  tokens: Array  // [{ name, value, darkValue?, cssVar? }]
}
```
Wraps `ColorSwatch` in a responsive grid (`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3`).

### `TokenTable.vue`
```js
props: {
  columns: Array,  // [{ key, label, type? }] — type: 'swatch' renders inline ColorSwatch
  rows: Array,     // array of objects matching column keys
  caption: String  // optional
}
```
Generic table. The `type: 'swatch'` column type triggers inline `ColorSwatch` rendering via `v-if="col.type === 'swatch'"`. Used by: Colors (semantic section), Typography, Spacing.

### `TypographyPreview.vue`
```js
props: {
  name, className, fontSize, lineHeight,
  fontFamily, letterSpacing, textTransform, sample
}
```
Two-column row: left = metadata in `font-mono text-body-xs`, right = sample text with `:class="className"` applied.

### `SpacingPreview.vue`
```js
props: {
  name, className, property,
  desktopValue, tabletValue, mobileValue, description
}
```
Visual demo using **inline `style`** (not the semantic class) to isolate the spacing value. Below it, a 3-column responsive values table.

### `IconGrid.vue`
```js
props: {
  icons: Array,           // from @aziontech/icons/catalog
  initialSize: { type: Number, default: 24 }
}
```
Internal state: `searchQuery ref`, `iconSize ref`. `filteredIcons` computed. Split into `azionIcons` (ai prefix) and `primeIcons` (pi prefix). Plain `<input type="text">` for search, `<input type="range" min="12" max="64" step="4">` for size. Grid: `grid-cols-4 md:grid-cols-6 lg:grid-cols-8`. No copy or download in Phase 1.

---

## Story File Structure

Each story uses `title: 'Foundations/[Name]'` and `parameters: { layout: 'fullscreen' }`.

| Story file | Named exports (sidebar entries) |
|---|---|
| `Colors.stories.js` | `PrimitiveColors`, `BrandColors`, `SemanticColors` |
| `Typography.stories.js` | `TypeScale` |
| `Spacing.stories.js` | `SemanticSpacing` |
| `Iconography.stories.js` | `AllIcons` (with `argTypes.initialSize` control) |

---

## `preview.js` Change

```js
// Line 79 — current:
order: ['Introduction', 'Core', 'Components']

// Updated:
order: ['Introduction', 'Foundations', 'Core', 'Components', 'Site']
```

---

## Delivery Phases

### Phase 1 — Colors ← START HERE
Creates the entire infrastructure. All subsequent phases reuse it.

1. `foundations-data/tokens.js`
2. `components/foundations/ColorSwatch.vue`
3. `components/foundations/ColorPalette.vue`
4. `components/foundations/TokenTable.vue`
5. `stories/foundations/Colors.stories.js`
6. Modify `preview.js` → update `storySort.order`

### Phase 2 — Typography
1. `foundations-data/typography.js`
2. `components/foundations/TypographyPreview.vue`
3. `stories/foundations/Typography.stories.js`

### Phase 3 — Spacing
1. `foundations-data/spacing.js`
2. `components/foundations/SpacingPreview.vue`
3. `stories/foundations/Spacing.stories.js`

### Phase 4 — Iconography
1. `components/foundations/IconGrid.vue`
2. `stories/foundations/Iconography.stories.js`

---

## Verification

- `pnpm dev` inside `apps/storybook/` → navigate to Foundations/ in sidebar
- Colors: verify primitive palettes render, semantic table shows correct hex values for both light/dark
- Toggle light/dark theme → ColorSwatch values remain static (by design), Storybook UI theme changes
- Typography: verify sample text renders in correct style (check font size/weight visually)
- Iconography: search filters icons reactively; size slider updates all icons
- No new lint errors; no new npm packages added

---

## Critical Files Reference

- `apps/storybook/.storybook/preview.js` — modify `storySort.order`
- `packages/theme/src/tokens/build/css-vars.js` — `createCssVars()` source
- `packages/theme/src/tokens/index.js` — re-exports all token primitives and utilities
- `packages/theme/src/tailwind/semantic-texts-plugin` — typography CSS values
- `packages/theme/src/tailwind/semantic-spacing-plugin` — spacing CSS values
- `packages/icons/dist/catalog.json` — icon manifest (87 ai + 315 pi)
