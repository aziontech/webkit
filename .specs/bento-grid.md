---
name: bento-grid
category: marketing
structure: composition
status: implemented
spec_version: 1
checksum: 1d0d59e79ce0d8b1c4763bc108a6ab8de986da5a7f9dd12f0ac981626fc3c986
created: 2026-09-22
last_updated: 2026-09-24
---

# Bento Grid — Component Spec

## Purpose

A mosaic of unequal cells on one set of shared rules: each cell claims a number of columns and rows, and the rules between them are drawn once so the whole block reads as a single framed surface. It is the layout a marketing page uses when several claims deserve different amounts of room — the alternative to a row of identical tiles.

## When to use

- When a set of claims is genuinely unequal and one or two deserve more room than the rest.
- As the framed body of a product or platform section, under a `section-title`.
- For a logo wall, a client-story band, or any set where a few members carry a headline and the rest carry only a mark.
- Whenever the cells hold composed content — copy, media, a control — rather than one repeated shape.

## When NOT to use

- When every claim carries the same weight → use `feature-card` in a plain grid the page owns.
- For a row of measured figures → use `big-numbers`, which already draws this grid for numbers.
- For a single copy-and-media pairing → use `media-split`.
- For a list of questions → use `faq`.

## Related

- `card-grid` — the equal-cell grid with no spans, in the gap or divider register.
- `feature-card` — the equal-weight tile, laid out by the page rather than by a grid component.
- `big-numbers` — the same collapsed-rule grid, specialised for figures.
- `media-split` — the two-column band when there is one claim, not several.
- `frame-box` — the frame each cell is drawn with.

## Best practices

- Size the mosaic so the cells fill the rectangle: count the tracks (`columns` × rows) and check the spans add up, or the grid ends on a gap of bare canvas.
- Keep cells in reading order — the grid auto-places in DOM order, so that order is what a screen reader and a keyboard follow, and it is what puts a cell in the track you meant.
- Compose real elements inside a cell rather than passing a config array; the cell is a slot, and that is the point of it.
- Let the grid draw the rules. Do not add borders inside a cell, or the shared edges double.
- Give a cell `kind="none"` + `padded="false"` when its own content paints the cell — a media layer, a brand fill, or a link that must be the whole tile.
- Inside a framed page column, set `flush` so the column's rules stay one hairline each.

## Usage

```vue
<script setup>
import BentoGrid from '@aziontech/webkit/bento-grid'
</script>

<template>
  <BentoGrid columns="4" mobile-columns="2">
    <BentoGrid.Cell span="2" rows="2">
      <h3>Everything runs at the edge</h3>
    </BentoGrid.Cell>
    <BentoGrid.Cell kind="canvas">
      <h3>Deploy in seconds</h3>
    </BentoGrid.Cell>
    <BentoGrid.Cell rows="2">
      <h3>Scale without capacity planning</h3>
    </BentoGrid.Cell>
    <BentoGrid.Cell
      kind="none"
      :padded="false"
    >
      <a href="/platform">A tile that paints itself</a>
    </BentoGrid.Cell>
  </BentoGrid>
</template>
```

## Sub-components

- `bento-grid-cell/bento-grid-cell.vue` — one cell of the mosaic; owns its own frame, and takes the tracks it claims (`span`, `rows`), the fill it carries (`kind`) and whether it pads its content (`padded`).

Cell props: `span` (`'1' | '2' | '3' | '4' | 'full'`, default `'1'`) — columns claimed from the medium breakpoint up; `rows` (`'1' | '2'`, default `'1'`) — rows claimed from the medium breakpoint up; `kind` (`'surface' | 'canvas' | 'none'`, default `'surface'`) — the cell's fill, where `none` leaves the surface to the composed content; `padded` (`boolean`, default `true`) — off for a cell whose content reaches its edges.

The compound `index.ts` annotates the `Object.assign` result with an explicit `typeof BentoGrid & { Cell: typeof BentoGridCell }` type. Without it, declaration emit expands the root's private `Props` interface and `vue-tsc` fails with TS4082 ("default export of the module has or is using private name"). Do not simplify it back to a bare `Object.assign`.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `''` | false | Accessible name for the grid, when the surrounding section does not already name it. |
| `columns` | `BentoGridColumns` | `2` | false | How many columns the mosaic lays out from the medium breakpoint up. |
| `mobileColumns` | `BentoGridMobileColumns` | `1` | false | How many columns the mosaic holds below the medium breakpoint, where every cell claims one of them. |
| `flush` | `boolean` | `false` | false | The surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The grid's cells, composed as `BentoGrid.Cell` elements in reading order. |

## States

- Visual states: `default`
- `data-columns` and `data-mobile-columns` on the grid mirror the track counts it lays out at each breakpoint
- `data-flush` on the grid mirrors `flush`, and is what withholds its own outer rules
- `data-span` and `data-rows` on each cell mirror its props and drive the tracks it claims from `md` up
- `data-kind` and `data-padded` on the cell's content box mirror its fill and its padding
- Below `md` every cell claims one of the mobile columns — only `span="full"` still takes the whole row — and no cell claims a second row
- Empty: a grid with no cells renders no rules, so an unfilled grid leaves no empty frame on the page

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| grid rules and marks | `var(--border-default)` |
| cell surface (`kind="surface"`) | `var(--bg-surface)` |
| cell surface (`kind="canvas"`) | `var(--bg-canvas)` |
| spacing (cell padding) | `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the grid and its cells are containers and are not focusable; controls composed inside a cell keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` follows DOM order through whatever the cells contain. The grid is not a composite widget, so it declares no arrow-key model.
- ARIA: the grid is a plain container named by `ariaLabel` when set; cells add no role, so headings composed inside them keep the document outline the page intends.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the cells provide `var(--bg-surface)` or `var(--bg-canvas)`; a `kind="none"` cell hands both the fill and its contrast to the composed content.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the grid is static.
- Touch target ≥40×40 px — not applicable; the grid holds no interactive target of its own.

## Stories (Storybook)

- Default
- Spans — a grid mixing a wide cell with single-column ones (justified: `span` is the component's whole reason to exist, and a default grid of equal cells never shows it)
- Mosaic — a four-column grid whose cells claim two axes, with a filled cell and an unpadded one (justified: `rows`, `kind` and `padded` only read as a set, on the layout the component is named after; one story shows the whole possibility space instead of four near-identical ones)

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
