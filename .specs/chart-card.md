---
name: chart-card
category: chart
structure: composition
status: approved
checksum: 6c02678af768bd21a64cd92315389f261fb468d6fbd74be48aff55624ee68f91
spec_version: 1
created: 2026-10-20
last_updated: 2026-10-20
---

# ChartCard — Component Spec

## Purpose

The box a dashboard chart lives in: a header with the title, the description and a controls zone, a content area padded or flush, an optional footer, and two optional handles that let the person move the card and resize it on a dashboard grid. The span (grid columns) and height are two-way models applied through custom properties, so the consumer's grid lays cards out with no script, and the reorder state stays with the page that owns the grid.

## When to use

- Every chart on a metrics dashboard, so title, description, menu and size read the same everywhere.
- A dashboard the person arranges: drag a card to reorder it, drag a corner to make it wider or taller.

## When NOT to use

- A KPI figure → use `stat-tile`, which is its own surface.
- A general content card with no chart → use `card-box`.
- A chart inline in a page section with its own heading → render `chart` alone.

## Related

- `chart`, `donut-chart` — what goes inside the content area; a chart inside a card takes its accessible name from the card title.
- `card-box` — the general-purpose card; ChartCard shares its surface tokens.
- `dropdown` — the "More options" menu (Copy query, Export CSV) composed into the controls zone.

## Best practices

- Put the aggregation tag (Sum, Average) and the variation tag in `ChartCard.Controls`, before the menu.
- Keep filters and the time range above the grid, never inside a card.
- Use `flush` content for a plot that should run edge to edge, padded for everything else.
- Give the page's grid `--chart-grid-columns` per breakpoint so a 6-column card never overflows a 1-column phone layout.
- Persist `span` and `height` with the dashboard layout; they are plain numbers.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import ChartCard from '@aziontech/webkit/chart-card'

const span = ref(6)
const height = ref(552)
</script>

<template>
  <div class="grid grid-cols-12 gap-(--spacing-md)">
    <ChartCard v-model:span="span" v-model:height="height" draggable resizable>
      <ChartCard.Header>
        <ChartCard.DragHandle />
        <ChartCard.Title>Threats vs requests</ChartCard.Title>
        <ChartCard.Controls>Sum</ChartCard.Controls>
      </ChartCard.Header>
      <ChartCard.Description>Requests WAF analyzed, split into blocked, logged and allowed.</ChartCard.Description>
      <ChartCard.Content>Chart goes here</ChartCard.Content>
      <ChartCard.Footer>Last 24 hours</ChartCard.Footer>
      <ChartCard.ResizeHandle />
    </ChartCard>
  </div>
</template>
```

Tree-shaking alternative:

```vue
<script setup>
import ChartCard from '@aziontech/webkit/chart-card-root'
import ChartCardHeader from '@aziontech/webkit/chart-card-header'
import ChartCardContent from '@aziontech/webkit/chart-card-content'
</script>
```

## Sub-components

The root `chart-card.vue` renders a `<section>` with the card surface. It provides a context (`injection-key.ts` + `composables/use-chart-card-context.ts`) holding the test id, the title and description ids (picked up by a nested `chart` for `aria-labelledby` / `aria-describedby`), `draggable`, `resizable`, the span and height bounds, the current span and height, and the functions `armDrag`, `move`, `startResize`, `resizeTo` and `endResize`. Every part throws a clear error when used outside `<ChartCard>`.

- `chart-card.vue` — the root: surface, span and height models, native drag arming, resize bookkeeping.
- `chart-card-header/chart-card-header.vue` — the header row, at least 56px tall, hairline under it.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — handle, title and controls in reading order.
- `chart-card-title/chart-card-title.vue` — the title (`.text-label-md`), an `<h3>` whose id names the card and the chart inside.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text title.
- `chart-card-description/chart-card-description.vue` — one line of context under the header (`.text-body-sm`, `var(--text-muted)`), whose id describes the chart inside.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text description.
- `chart-card-controls/chart-card-controls.vue` — the trailing zone of the header for tags and the options menu.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the consumer's tags, buttons and dropdown.
- `chart-card-drag-handle/chart-card-drag-handle.vue` — a grip button that arms native drag on the card while pressed; arrow keys emit the root's `move`. Renders nothing unless the root is `draggable`.
  - Props: `ariaLabel?: string` (default `'Move card'`).
  - Events: _none_ (flows through the root's `move`, `drag-start`, `drag-end`).
  - Slots: _none_.
- `chart-card-content/chart-card-content.vue` — the body; fills the remaining height.
  - Props: `flush?: boolean` (default `false` — no inner padding, for an edge-to-edge plot).
  - Events: _none_.
  - Slots: `default` — the chart.
- `chart-card-footer/chart-card-footer.vue` — an optional row under the content, hairline above it.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — period, source, or a link.
- `chart-card-resize-handle/chart-card-resize-handle.vue` — the corner grip that resizes the card: pointer drag with pointer capture, arrow keys from the keyboard. A `role="separator"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` on the span and `aria-valuetext` naming columns and height. Renders nothing unless the root is `resizable`.
  - Props: `ariaLabel?: string` (default `'Resize card'`).
  - Events: _none_ (flows through the root's `update:span`, `update:height`, `resize-start`, `resize-end`).
  - Slots: _none_.

<!-- Resulting layout:

  packages/webkit/src/components/chart/chart-card/
  ├── chart-card.vue
  ├── index.ts
  ├── injection-key.ts
  ├── composables/use-chart-card-context.ts
  ├── chart-card-header/chart-card-header.vue
  ├── chart-card-title/chart-card-title.vue
  ├── chart-card-description/chart-card-description.vue
  ├── chart-card-controls/chart-card-controls.vue
  ├── chart-card-drag-handle/chart-card-drag-handle.vue
  ├── chart-card-content/chart-card-content.vue
  ├── chart-card-footer/chart-card-footer.vue
  └── chart-card-resize-handle/chart-card-resize-handle.vue
-->

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `draggable` | `boolean` | `false` | false | Shows the drag handle and lets the card be dragged to a new position. |
| `resizable` | `boolean` | `false` | false | Shows the resize handle. |
| `minSpan` | `number` | `3` | false | Fewest grid columns the card may span. |
| `maxSpan` | `number` | `12` | false | Most grid columns the card may span. |
| `minHeight` | `number` | `240` | false | Smallest height in pixels the resize handle allows. |
| `maxHeight` | `number` | `960` | false | Largest height in pixels the resize handle allows. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the card when it has no title. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model:span` | `number` | `6` | `update:span` | Grid columns the card spans, applied as `--chart-card-span` and capped by the grid's `--chart-grid-columns`. |
| `v-model:height` | `number \| undefined` | `undefined` | `update:height` | Height in pixels, applied as `--chart-card-height`; absent means the content decides. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `move` | `(event: KeyboardEvent, direction: 'up' \| 'down' \| 'left' \| 'right')` | An arrow key on the drag handle; the page moves the card in its own order. |
| `drag-start` | `(event: DragEvent)` | Native drag began from the handle; the page records the source. |
| `drag-end` | `(event: DragEvent)` | Native drag ended, dropped or cancelled. |
| `resize-start` | `(event: PointerEvent)` | A pointer resize began on the handle. |
| `resize-end` | `(event: PointerEvent \| KeyboardEvent)` | A resize finished: pointer released, or a keyboard nudge committed. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The parts: Header, Description, Content, Footer, ResizeHandle. |

## States

- Visual states: `default`, `dragging` (the card dims while it travels), `resizing`, `focus-visible` on each handle
- `data-draggable`, `data-resizable` mirror the props
- `data-dragging` while a native drag runs; `data-resizing` while a pointer resize runs
- `data-flush` on the content mirrors `flush`

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| dragging dim | `transition-opacity duration-fast-02 ease-productive-entrance` | `fast-02` · `productive-entrance` | `motion-reduce:transition-none` |
| handle hover / focus | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` · `productive-entrance` | `motion-reduce:transition-none` |

A pointer resize follows the pointer 1:1 with no transition; it is direct manipulation, not motion.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)` |
| title | `.text-label-md`, `var(--text-default)` |
| description, footer | `.text-body-sm`, `var(--text-muted)` |
| handles | `var(--text-muted)`, `var(--bg-hover)`, `var(--shape-button)` |
| spacing | `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)` |
| focus | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- The card is a `<section>` named by its title (`aria-labelledby`) or by `ariaLabel`.
- Drag handle: a real `<button>` named "Move card". Keyboard map: arrow keys emit `move` with the direction; the page reorders and keeps focus on the handle. Dragging never requires a pointer.
- Resize handle: `role="separator"`, one tab stop, `aria-valuenow` / `aria-valuemin` / `aria-valuemax` on the span and `aria-valuetext` such as "6 of 12 columns, 552 pixels tall". Keyboard map: Left / Right change the span by one column, Up / Down change the height by 24 pixels, Home / End jump to the smallest and largest span, Escape cancels a pointer resize in progress.
- Both handles are at least 24px with a visible focus ring `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- `motion-reduce:transition-none` on every transition.

## Stories (Storybook)

- Default — a padded card around a chart, with title, description and footer.
- Content — composite: padded and `flush` content side by side.
- WithControls — aggregation and variation tags plus the options menu (Copy query, Export CSV) in the controls zone.
- Resizable — `resizable` in a 12-column grid, span and height bound with `v-model`.
- Draggable — three cards in a 12-column grid, reordered by drag and by keyboard.

Justification: ChartCard has no `kind` / `size` axis; its axes are the content inset and the two optional handles, and each handle is a behavior the consumer must see wired to a grid.

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
