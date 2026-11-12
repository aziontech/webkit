---
name: stat-tile-group
category: chart
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: d7ece73839205cebbb3d4f6011f7afb1baeda6bdf7c374b7b714685d5de9e9e5
created: 2026-11-12
last_updated: 2026-11-12
---

# StatTileGroup — Component Spec

## Purpose

One card split into cells, one `StatTile` per cell: the KPI strip at the top of an overview (data transferred, requests per second, bandwidth saving, data offload). The group draws the card (surface, border, radius) and the grid; each tile inside it drops its own card and draws its end and bottom edges as the dividers, with its delta aligned to the end of the figure row. The cells sit one per row in a narrow box, two per row from the group's `@md`, and all in one row from its `@3xl`.

## When to use

- The usage or KPI row of an overview, where the figures read as one band.
- Two to six related figures for the same period.

## When NOT to use

- Figures that stand alone or carry their own sparkline history at different periods → separate `StatTile`s in a grid.
- Marketing figures on a site band → use `big-numbers`.
- Label/value details of one resource → use `key-value-pairs`.

## Related

- `stat-tile` — the cell; the group changes its chrome through an injected context, so the tiles take no extra prop.
- `card` — a plain surface; do not hand-build a strip by putting tiles in a `Card` grid.
- `key-value-pairs` — static label/value details.

## Best practices

- Put only `StatTile`s in the default slot, in reading order.
- Name the strip with `ariaLabel` when the page has more than one (`Usage`, `Traffic`).
- Give every tile in a strip the same `kind` and the same period.
- Prefer four cells: they fill one row on a desktop and two rows of two on a tablet.
- Next to a taller card in a row (a dashboard's usage band beside a chart), let the row stretch the group: it fills the height and the cells grow with it. Do not pin a height. Inside a wrapper element, give the group `h-full` (or make the wrapper a flex column) so the stretch reaches it.

## Usage

```vue
<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
</script>

<template>
  <StatTileGroup aria-label="Usage">
    <StatTile
      label="Data transferred"
      :value="842"
      unit="GB"
      :delta="12.4"
    />
    <StatTile
      label="Requests / second"
      :value="1240"
      unit="/s"
      :delta="3.8"
    />
    <StatTile
      label="Bandwidth saving"
      :value="588"
      unit="GB"
      :delta="6.2"
    />
    <StatTile
      label="Data offload"
      :value="70"
      unit="%"
      :delta="-1.5"
      inverse
    />
  </StatTileGroup>
</template>
```

## Props

| Prop        | Type     | Default | Required | JSDoc                                                                        |
| ----------- | -------- | ------- | -------- | ---------------------------------------------------------------------------- |
| `ariaLabel` | `string` | `''`    | false    | Accessible name of the strip, such as Usage; empty leaves the group unnamed. |

## Events

_No events — the group is layout; each tile is content._

## Slots

| Slot      | Scope | Notes                                 |
| --------- | ----- | ------------------------------------- |
| `default` | —     | The StatTile cells, in reading order. |

## States

- Visual states: `default` only; loading and empty are each tile's own (`loading`, a null `value`).
- The group provides an injected context (`StatTileGroupInjectionKey`); a `StatTile` inside it sets `data-grouped`, drops its border, radius and surface, and draws `border-e` + `border-b` as dividers. The inner grid is pulled out by `-me-px -mb-px` and the root clips it (`overflow-hidden`), so the last column's end edge and the last row's bottom edge fall under the card border and every column count gets correct dividers with no `nth-child` rules.
- Not applicable: `disabled`, `readonly`, `invalid`, `open`/`closed`, `error`.

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
| ------- | ---------------------- | ----- | ----------------------- |
| _none_  | —                      | —     | —                       |

## Tokens

| Region  | Token (DESIGN.md)                                           |
| ------- | ----------------------------------------------------------- |
| surface | `var(--bg-surface)`                                         |
| border  | `var(--border-default)` (card edge and the tiles' dividers) |
| shape   | `var(--shape-card)`                                         |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Pattern: a `role="group"` container named by `ariaLabel` when set; each cell stays a `StatTile` `<section>` named by its label, so the reading order is the slot order.
- Keyboard map: none of its own; focusable content inside the tiles (an info `Tooltip` in `aside`) keeps its own.
- Dividers are borders, not content; they carry no meaning.
- Contrast: the divider and card border use `--border-default`, the same as a separate tile.

## Internationalization

| Key    | English source | Override prop |
| ------ | -------------- | ------------- |
| _none_ | —              | —             |

- No built-in strings: the name comes from `ariaLabel`; the tiles carry their own.

## Right-to-left

- Layout: logical utilities only (`-me-px`, `border-e`), so the dividers sit between the cells under `dir="rtl"` too.
- Icons: none.
- Keyboard: no arrow keys.
- User data: none.

## Responsive

- Container queries: the root is the `@container/stat-tile-group`; one cell per row below its `@md`, two per row from `@md`, every cell in one row (`grid-flow-col auto-cols-fr`) from `@3xl`.
- Height: the root is a flex column and the cell grid is `flex-1`, so when a grid or flex row stretches the group to a taller neighbour, the cell rows share the extra height instead of leaving an empty band under them.
- Touch: no targets of its own.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the cells stack.

## Performance

- Bundle budget: 0.75 KB gzip for `./stat-tile-group` in `.size-limit.json` (a provide and one grid; `StatTile` is the consumer's own import).
- Runtime budget: none.
- Heavy parts: none.

## Examples

- Default — four tiles with deltas in one card: the overview's usage strip.
- BesideCard — justification: the stretch to a taller neighbour is layout behaviour no prop shows; the strip sits beside a taller card in a dashboard row and fills its height.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
