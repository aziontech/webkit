---
name: chart
category: chart
structure: composition
status: approved
checksum: bfb61a48c3767ac36055e7652b533dae2c0c87660f7909a12765242ff2999b83
spec_version: 1
created: 2026-10-20
last_updated: 2026-11-09
---

# Chart — Component Spec

## Purpose

A cartesian chart — lines, areas and bars over one category axis — composed from parts the consumer places by hand. The root owns the data model (series + labels), the scales, the hover/keyboard state and the loading / empty / error surface; each part (`Chart.Grid`, `Chart.Axis`, `Chart.Line`, `Chart.Area`, `Chart.Bar`, `Chart.Crosshair`, `Chart.Tooltip`, `Chart.Legend`) reads that state through context, so the consumer wires nothing. Rendering is in-house SVG and every color comes from the `--chart-*` role, so a chart re-themes with no per-theme code and adds no charting dependency.

## When to use

- A measure over time — requests, threats, bandwidth per bucket — as one or more lines or areas.
- Comparing magnitudes across ordered categories — top countries, attack families — as vertical or horizontal bars.
- Parts of a total over time — allowed / blocked / logged — as stacked areas or stacked bars.
- Any chart that must read the same as Azion Console Real-Time Metrics: crosshair, one tooltip listing every series, legend toggles, totals.

## When NOT to use

- A single headline number with a delta → use `stat-tile`.
- Share of a small whole (six slices or fewer) with the total in the center → use `donut-chart`.
- More than about seven classes that all carry meaning → use `table`; color stops separating past the six series slots.
- Two measures on different scales → two charts side by side; this component never draws a second value axis.

## Related

- `chart-card` — the box a dashboard chart sits in: title, description, controls, drag and resize.
- `donut-chart` — part-to-whole at a glance, sharing this chart's palette, legend and states.
- `stat-tile` — one figure with a delta and a sparkline, for a KPI row above the charts.
- `table` — the exact numbers; a chart's own table view is the accessible twin, a `table` is the primary surface.

## Best practices

- Pass series in a stable order: the slot follows the series position, so color follows the entity. A filter that hides a series keeps the others' colors.
- Keep one value axis. Index two measures to a common base or split them into two charts.
- Let the legend carry identity for two or more series; a single series needs no legend, its title names it.
- Mark a series whose color means a state (blocked, error rate) with `color: 'danger'` and never reuse a status color as series 4.
- Keep filters and the time range in one row above the dashboard, never inside a chart.
- While data reloads, set `refetching` so the previous render holds at reduced opacity instead of flashing a skeleton.

## Usage

```vue
<script setup>
import Chart from '@aziontech/webkit/chart'

const labels = ['14:00', '14:05', '14:10', '14:15', '14:20', '14:25']
const series = [
  { id: 'allowed', name: 'WAF requests allowed', values: [1200, 1350, 1280, 1500, 1460, 1610] },
  { id: 'blocked', name: 'WAF requests blocked', values: [320, 410, 380, 520, 470, 430], color: 'danger' },
  { id: 'threat', name: 'WAF requests threat', values: [80, 95, 70, 120, 110, 90] }
]
</script>

<template>
  <Chart :series="series" :labels="labels" aria-label="Threats vs requests">
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Area :ids="['allowed']" />
    <Chart.Bar :ids="['threat']" />
    <Chart.Line :ids="['blocked']" />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend totals />
  </Chart>
</template>
```

Tree-shaking alternative — the standalone root plus only the parts a chart uses:

```vue
<script setup>
import Chart from '@aziontech/webkit/chart-root'
import ChartLine from '@aziontech/webkit/chart-line'
import ChartAxis from '@aziontech/webkit/chart-axis'
</script>
```

## Sub-components

The root `chart.vue` renders a `<figure>` with a CSS grid: the plot cell (every SVG part, the tooltip and the hit layer stacked in one cell) and the legend row under it. It provides a context (`injection-key.ts` + `composables/use-chart-context.ts`) holding the normalized series (slot, color token, total, hidden flag), the labels, the measured plot box and its insets, the value scale and ticks, the category positions and bandwidth, `activeIndex`, the emphasized series, the `entered` flag that drives the entrance transitions, the formatters, and the functions `setActiveIndex`, `toggleSeries`, `setEmphasized`, `registerMark` and `registerAxis`. Every part throws a clear error when used outside `<Chart>`.

- `chart.vue` — the root: data model, scales, states, keyboard and pointer model, live region, table twin.
- `chart-grid/chart-grid.vue` — hairline gridlines at the value ticks in `var(--chart-grid)`.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.
- `chart-axis/chart-axis.vue` — one axis: tick labels in `.text-label-sm` / `var(--chart-label)`, the baseline rule in `var(--chart-axis)`. Registers itself so the root reserves its inset.
  - Props: `kind: 'x' | 'y'` (required — which axis), `ticks?: number` (default `6` — the most category labels drawn; the rest are thinned).
  - Events: _none_.
  - Slots: _none_.
- `chart-line/chart-line.vue` — one 2px line per selected series, round joins, a marker (r 4, 2px `var(--bg-surface)` ring) on every series at the active index.
  - Props: `ids?: string[]` (default `[]` — every visible series), `curve?: 'linear' | 'monotone'` (default `'monotone'`), `markers?: boolean` (default `false` — a marker on every point, not only the active one).
  - Events: _none_.
  - Slots: _none_.
- `chart-area/chart-area.vue` — a 10% wash plus a 2px edge per selected series; stacked when asked.
  - Props: `ids?: string[]` (default `[]`), `stacked?: boolean` (default `false`), `curve?: 'linear' | 'monotone'` (default `'monotone'`).
  - Events: _none_.
  - Slots: _none_.
- `chart-bar/chart-bar.vue` — bars at most 24px thick, a rounded data end and a square baseline, a 2px surface gap between touching bars; grouped or stacked; horizontal when the root is horizontal.
  - Props: `ids?: string[]` (default `[]`), `stacked?: boolean` (default `false`), `labeled?: boolean` (default `false` — the formatted value at each bar end, for ordered bars).
  - Events: _none_.
  - Slots: _none_.
- `chart-crosshair/chart-crosshair.vue` — the hairline at the active index in `var(--chart-crosshair)`.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.
- `chart-tooltip/chart-tooltip.vue` — the readout for the active index, inside the figure (never teleported): the label, then every visible series with a 2px line key, value first in tabular figures. Inverse surface `var(--chart-tooltip-bg)`; flips to the other side past the middle of the plot.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.
- `chart-legend/chart-legend.vue` — one toggle button per series (`aria-pressed`), the swatch mirroring its mark, the name, and the series total. Hover and focus emphasize the series. Renders nothing for a single series.
  - Props: `totals?: boolean` (default `false` — show each series total beside its name).
  - Events: _none_ (toggles flow through the root's `legend-toggle` and `v-model:hiddenSeries`).
  - Slots: _none_.

<!-- Resulting layout:

  packages/webkit/src/components/chart/
  ├── _lib/                       (pure TS: scale, ticks, path, stack, format, series, types)
  └── chart/
      ├── chart.vue
      ├── index.ts                (Object.assign: Grid, Axis, Line, Area, Bar, Crosshair, Tooltip, Legend)
      ├── injection-key.ts
      ├── composables/use-chart-context.ts
      ├── chart-grid/chart-grid.vue
      ├── chart-axis/chart-axis.vue
      ├── chart-line/chart-line.vue
      ├── chart-area/chart-area.vue
      ├── chart-bar/chart-bar.vue
      ├── chart-crosshair/chart-crosshair.vue
      ├── chart-tooltip/chart-tooltip.vue
      └── chart-legend/chart-legend.vue
-->

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `series` | `ChartSeries[]` | `[]` | false | Series to plot. The first six take the fixed categorical slots in order; the rest fold into Other. |
| `labels` | `ChartLabel[]` | `[]` | false | One category label per index: a string, a number, or a Date. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | false | Value axis direction. Horizontal lays categories down the side, for ordered bars. |
| `min` | `number` | `0` | false | Floor of the value axis. Marks grow from one baseline. |
| `max` | `number` | `undefined` | false | Ceiling of the value axis. When absent, the nice ceiling of the visible data. |
| `cap` | `number` | `6` | false | Series kept before the rest fold into Other. |
| `otherLabel` | `string` | `'Other'` | false | Name of the folded series. |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats ticks, tooltip values and legend totals. |
| `formatLabel` | `(label: ChartLabel) => string` | `formatLabel` | false | Formats category labels on the axis and in the tooltip. |
| `height` | `number` | `240` | false | Minimum plot height in pixels; the plot grows to fill a taller container. |
| `loading` | `boolean` | `false` | false | Renders a Skeleton sized to the plot and suppresses interaction. |
| `refetching` | `boolean` | `false` | false | Holds the previous render at reduced opacity while new data loads. |
| `error` | `string` | `''` | false | Error message; when set, the plot renders a danger Message instead of marks. |
| `emptyTitle` | `string` | `'No data available'` | false | Title of the empty state shown when no series has a value. |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title: why the range is empty, or what to do next. |
| `tableView` | `boolean` | `false` | false | Shows the data table in place of the marks. The table is always present for assistive tech. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the chart when it is not inside a ChartCard with a title. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model:activeIndex` | `number \| null` | `null` | `update:activeIndex` | The category index under the pointer or keyboard focus. Bind it to sync crosshairs across charts. |
| `v-model:hiddenSeries` | `string[]` | `[]` | `update:hiddenSeries` | Ids of series the legend has hidden. A hidden series keeps its color slot. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `point-click` | `(event: MouseEvent \| KeyboardEvent, point: ChartPoint)` | Click on the plot, or Enter / Space on the focused chart, at the active index. `point` carries the index, the label and every visible series value. |
| `legend-toggle` | `(event: MouseEvent, series: ChartSeries)` | A legend entry toggled; `series` is the consumer's own series object. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The parts: Grid, Axis, Line, Area, Bar, Crosshair, Tooltip, Legend, in paint order. |
| `empty` | — | Replaces the default EmptyState. |
| `empty-actions` | — | Actions under the default EmptyState, such as a Clear filters button or a setup link. Ignored when `empty` replaces it. |
| `error` | — | Replaces the default danger Message. |

## States

- Visual states: `default`, `loading` (Skeleton), `error` (Message), `empty` (EmptyState with a chart icon, the title, the optional description and actions, filling the plot height), `refetching` (marks at reduced opacity), `table-view`, `active` (an index is hovered or focused)
- `data-loading`, `data-error`, `data-empty`, `data-refetching`, `data-table-view`, `data-active` on the root mirror the state; priority loading, then error, then empty, then marks
- `data-orientation`: `vertical` | `horizontal`
- `data-entered` on each mark flips after two animation frames to run its entrance transition
- `data-dimmed` on a series when another series is emphasized from the legend

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| line and area edge entrance | `transition-[stroke-dashoffset,opacity] duration-slow-02 ease-productive-entrance`, `pathLength="1"`, dash offset 1 to 0 on `data-entered`, staggered per series by `transition-delay` | `slow-02` · `productive-entrance` | `motion-reduce:transition-none` (drawn at once) |
| area wash entrance | `transition-opacity duration-slow-01 ease-productive-entrance`, opacity 0 to 1 on `data-entered` | `slow-01` · `productive-entrance` | `motion-reduce:transition-none` |
| bar entrance | `transition-[scale,opacity] duration-slow-01 ease-productive-entrance`, grows from the baseline on `data-entered` | `slow-01` · `productive-entrance` | `motion-reduce:transition-none` |
| crosshair and tooltip follow | `transition-[translate,opacity] duration-fast-02 ease-productive-entrance` | `fast-02` · `productive-entrance` | `motion-reduce:transition-none` |
| legend emphasis dim, refetch hold | `transition-opacity duration-moderate-01` | `moderate-01` | `motion-reduce:transition-none` |

The entrance is a composition assembling on first paint with a per-series stagger, so it is the `data-entered` transition recipe from the add-animation skill, not a catalog keyframe. No component-local `@keyframes`.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| series 1 to 6 | `var(--chart-series-1)` … `var(--chart-series-6)` |
| folded series | `var(--chart-series-other)` |
| status series | `var(--chart-status-danger)`, `var(--chart-status-success)`, `var(--chart-status-warning)`, `var(--chart-status-info)` |
| gridlines | `var(--chart-grid)` |
| axis rule | `var(--chart-axis)` |
| tick labels | `var(--chart-label)`, `.text-label-sm` |
| crosshair | `var(--chart-crosshair)` |
| tooltip surface | `var(--chart-tooltip-bg)`, `var(--chart-tooltip-text)`, `var(--chart-tooltip-muted)` |
| tooltip values | `.text-label-code-sm` |
| marker ring | `var(--bg-surface)` |
| tooltip and legend shape | `var(--shape-elements)` |
| spacing | `var(--spacing-xs)`, `var(--spacing-sm)` |
| focus | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | The `--chart-*` role ships with this component. |

## Accessibility (WCAG 2.1 AA)

- Root is a `<figure>` named by `ariaLabel` or by the enclosing ChartCard title (`aria-labelledby`) and described by its ChartCard description or a generated summary.
- The plot cell is one tab stop: `role="group"` with `aria-roledescription="chart"`. Keyboard map: Left / Right (Up / Down when horizontal) move the active index, Home / End jump to the ends, Enter / Space fire `point-click`, Escape clears. The tooltip follows keyboard focus exactly as it follows the pointer.
- A polite live region announces the label and every visible series value at the active index.
- A data table twin (labels by series) is always rendered, visually hidden unless `tableView`; every value is reachable without hover.
- Every SVG part is `aria-hidden`; identity never rests on color alone — the legend names each series and the tooltip pairs each value with its name.
- Legend entries are buttons with `aria-pressed`, at least 24px tall.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the plot and every legend button.
- Series colors clear 3:1 on the chart surfaces and on the tooltip in both themes (pinned by `packages/theme/test/chart-role.test.mjs`).
- `motion-reduce:transition-none` on every transition.

## Stories (Storybook)

The stories share one WAF fixture so every canvas tells the same story.

- Default — the Threats vs requests chart: area plus two lines, grid, axes, crosshair, tooltip, legend.
- Forms — composite: the same series as lines, as areas, as bars.
- Stacked — stacked areas and stacked bars of allowed / blocked / logged.
- MultiSeries — seven hosts, so the seventh folds into Other; legend with totals.
- Horizontal — ordered horizontal bars with value labels (top countries).
- Loading — `loading`.
- Empty — composite: the three reasons a range comes back empty, each with its own copy: nothing in the range, filters that match nothing (with a Clear filters action), and a source not set up yet (with a setup link).
- Error — `error` set.
- Refetching — `refetching`, the previous render held.
- TableView — `tableView`, the accessible twin made visible.

Justification: a chart has no `kind` / `size` axis; its axes are the mark form and the four mutually exclusive data states, and each state is its own story per the component-states rule.

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
