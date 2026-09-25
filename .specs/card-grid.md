---
name: card-grid
category: marketing
structure: composition
status: approved
spec_version: 2
checksum: 2c0f1322478487bd51706a83e177d0911f7cf05570c7bd0dd735f0ca28094c7b
style_seam: true
created: 2026-09-23
last_updated: 2026-09-24
---

# Card Grid — Component Spec

## Purpose

The responsive cell grid of the page language, in three registers: spaced cards separated by real gutters, a hairline box grid whose internal rules are the gaps themselves, and a framed grid whose cells are real `frame-box` elements. The `frame` register is the one that composes: each `CardGrid.Cell` draws its own rules and corner marks and carries its own fill, so the grid needs no background trick and nests flush inside a column that already owns the outer edges.

## When to use

- For a row or block of equal cells that should fan out from one column on a phone to several on a wide screen.
- With `kind` set to `frame` whenever the cells are real content — a `topic`, a claim, a figure — and should carry the page's frame language, corner marks included.
- For the hairline cell grid a `section-module` body holds, with `kind` set to `divider`.
- For a row of self-contained cards with gutters between them, with the default `gap`.

## When NOT to use

- For a mosaic whose cells claim different numbers of columns and rows → use `bento-grid`, which is this grid with spans.
- For a single framed box → use `frame-box`.
- For one card with a header, content and footer → use `card-box`.
- For the band that wraps the grid → use `section-module`.
- For tabular data a reader scans row by row → use `table`.

## Related

- `bento-grid` — the same framed grid with unequal cells; reach for it when one claim deserves more room than the rest.
- `topic` — the glyph, headline and sentence a `frame` cell usually holds.
- `section-module` — the band whose body holds this grid.
- `section-container` — the column whose vertical rules the `divider` and flush `frame` grids deliberately do not repeat.
- `frame-box` — the frame each `frame` cell is drawn with, and the framed box a `gap` cell may be built from.
- `card-box` — a padded card surface, the usual child of a `gap` grid.

## Best practices

- Prefer `frame` over `divider` for new work. The hairline register depends on every child filling its own background; the framed register draws real rules, so a cell that forgets its fill still reads correctly, and the corner marks come with it.
- Give every child of a `divider` grid its own background fill, or the gap trick has nothing to show through and the whole band goes the colour of the rule.
- Leave the perimeter to the container: the `divider` register draws no outer border, and a `frame` grid set to `flush` withholds its own top and left rules so a surrounding `frame-box` keeps one hairline per edge.
- Let the grid draw the rules. Do not add borders inside a `frame` cell, or the shared edges double.
- Give a cell `kind="none"` and `:padded="false"` when its own content paints the cell — a media layer, a brand fill, or a link that must be the whole tile.
- Reach for `mobileColumns` of `2` only for short, glyph-led cells; a cell carrying a description reads better one-up on a phone.

## Usage

```vue
<script setup>
import CardGrid from '@aziontech/webkit/card-grid'
import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <CardGrid
    kind="frame"
    :columns="3"
  >
    <CardGrid.Cell kind="canvas">
      <Topic
        icon="ai ai-edge-nodes"
        title="Consistent global speed"
        description="Serve content across hundreds of locations."
      />
    </CardGrid.Cell>
    <CardGrid.Cell kind="canvas">
      <Topic
        icon="ai ai-load-balancer"
        title="Safer high-traffic launches"
        description="Scale from routine traffic to campaign spikes."
      />
    </CardGrid.Cell>
    <CardGrid.Cell
      kind="none"
      :padded="false"
    >
      <a href="/platform">A cell that paints itself</a>
    </CardGrid.Cell>
  </CardGrid>
</template>
```

Tree-shaking alternative — the standalone root and cell from their own entries (no `Object.assign` compound pulled in):

```vue
<script setup>
import CardGrid from '@aziontech/webkit/card-grid-root'
import CardGridCell from '@aziontech/webkit/card-grid-cell'
</script>
```

## Sub-components

- `card-grid-cell/card-grid-cell.vue` — one cell of the `frame` register; wraps `frame-box` so the cell owns its own rules and corner marks, and takes the fill it carries (`kind`) and whether it pads its content (`padded`). It claims exactly one column — a cell that claims more belongs in `bento-grid`.

Cell props: `kind` (`'surface' | 'canvas' | 'none'`, default `'surface'`) — the cell's fill, where `none` leaves the surface to the composed content; `padded` (`boolean`, default `true`) — off for a cell whose content reaches its edges.

The cell's `frame-box` is set `flush` on its top and left edges, so it draws only its right and bottom rules; the grid root draws the matching top and left ones. That is what gives the block one hairline per edge instead of two at every junction.

The compound `index.ts` annotates the `Object.assign` result with an explicit `typeof CardGrid & { Cell: typeof CardGridCell }` type. Without it, declaration emit expands the root's private `Props` interface and `vue-tsc` fails with TS4082 ("default export of the module has or is using private name"). Do not simplify it back to a bare `Object.assign`.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `CardGridKind` | `'gap'` | false | Register of the grid: gutters between self-contained cards, hairline rules drawn by the gaps, or framed cells that draw their own rules and marks. |
| `columns` | `CardGridColumns` | `3` | false | How many columns the grid fans out to at the large breakpoint. |
| `mobileColumns` | `CardGridMobileColumns` | `1` | false | How many columns the grid holds below the small breakpoint. |
| `dividerColor` | `CardGridDividerColor` | `'default'` | false | Weight of the hairline rules in the `divider` register. |
| `flush` | `boolean` | `false` | false | In the `frame` register, the surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The cells, in reading order. In the `frame` register they are `CardGrid.Cell` elements; in the `divider` register each cell fills its own background. |

## States

- Visual states: `default`
- `data-kind` carries the register
- `data-columns` carries the large-breakpoint column count
- `data-mobile-columns` carries the small-breakpoint column count
- `data-divider-color` carries the hairline weight
- `data-flush` mirrors `flush`, and is what withholds the `frame` grid's own outer rules
- `data-filled` mirrors whether any cell renders, so an empty `frame` grid draws no stray rules
- `data-kind` and `data-padded` on each cell's content box mirror its fill and its padding
- Empty: a `frame` grid with no cells renders no rules, so an unfilled grid leaves no empty frame on the page

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| hairline rule | `var(--border-default)` |
| hairline rule, muted | `var(--border-muted)` |
| cell surface (`kind="surface"`) | `var(--bg-surface)` |
| cell surface (`kind="canvas"`) | `var(--bg-canvas)` |
| gutter | `var(--spacing-md)` |
| spacing (cell padding) | `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the grid and its cells are containers; controls composed into a cell keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the grid is not focusable; `Tab` order follows the cells in DOM order, which is reading order at every breakpoint.
- ARIA: the root adds no role, so a list composed into it keeps its own semantics and the cells reach the accessibility tree unchanged; a cell adds no role either, so headings composed inside it keep the document outline the page intends.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration; a `frame` cell provides `var(--bg-surface)` or `var(--bg-canvas)`, and a `kind="none"` cell hands both the fill and its contrast to the composed content.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control of its own.

## Stories (Storybook)

- Default
- Kinds — composite story rendering all three registers side-by-side (justified: gutters, hairline rules and framed cells are the same layout drawn three ways, legible only in comparison)
- Columns — composite story rendering the column counts side-by-side (justified: a column count is only legible against another)
- DividerColor — the muted hairline weight (mutually-exclusive state of the `dividerColor` prop)
- Frame — a framed grid whose cells carry a fill and an unpadded one (justified: `CardGrid.Cell`'s `kind` and `padded` only read as a set, on the register the sub-component exists for; one story shows the whole possibility space instead of three near-identical ones)

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
