---
name: donut-chart
category: chart
structure: monolithic
status: approved
checksum: 7c9333654dcef295b13574be4dd9f45e84926cda2ed400572e1ce5e6426e5a4b
spec_version: 1
created: 2026-10-20
last_updated: 2026-11-09
---

# DonutChart — Component Spec

## Purpose

A part-to-whole chart drawn as a ring (donut) or a disc (pie): one slice per series, the total in the center, a legend beside it. It shares the cartesian chart's data model, palette, legend behavior and loading / empty / error surface, so a dashboard reads as one system. Each slice is the sum of its series values, so a time series passes straight in as its share of the range.

## When to use

- Share of a small whole at a glance: top countries by blocked threats, traffic by protocol, cache hit versus miss.
- A dashboard card where the total is the headline and the split is the context.

## When NOT to use

- Comparing close values or more than six slices → use `chart` with horizontal bars; angles are hard to compare.
- Two slices → use `stat-tile` with the ratio; a two-slice pie says less than the number.
- Change over time → use `chart`.

## Related

- `chart` — the cartesian sibling; same series model, so a dataset moves between them without reshaping.
- `chart-card` — the box a dashboard donut sits in.
- `stat-tile` — the total alone, with a delta.

## Best practices

- Keep it to six slices or fewer; the seventh and beyond fold into Other automatically.
- Order series by size so the largest slice starts at the top.
- Use the center for the total and let hover or focus swap it to the active slice.
- Pair it with the bar form of the same data when exact ranks matter (the console's country pie plus ordered bar).

## Usage

```vue
<script setup>
import DonutChart from '@aziontech/webkit/donut-chart'

const series = [
  { id: 'br', name: 'Brazil', values: [48200] },
  { id: 'us', name: 'United States', values: [31600] },
  { id: 'de', name: 'Germany', values: [18900] }
]
</script>

<template>
  <DonutChart :series="series" total-label="Blocked threats" aria-label="Top WAF threat requests by country" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `series` | `ChartSeries[]` | `[]` | false | One slice per series; a slice is the sum of its values. The first six take the categorical slots, the rest fold into Other. |
| `kind` | `'donut' \| 'pie'` | `'donut'` | false | Ring or solid disc. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Diameter of the ring: 128, 176 or 240 pixels. |
| `cap` | `number` | `6` | false | Slices kept before the rest fold into Other. |
| `otherLabel` | `string` | `'Other'` | false | Name of the folded slice. |
| `totalLabel` | `string` | `'Total'` | false | Caption under the total in the center. |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats the center value and legend values. |
| `loading` | `boolean` | `false` | false | Renders a circular Skeleton and suppresses interaction. |
| `refetching` | `boolean` | `false` | false | Holds the previous render at reduced opacity while new data loads. |
| `error` | `string` | `''` | false | Error message; when set, a danger Message replaces the ring. |
| `emptyTitle` | `string` | `'No data available'` | false | Title of the empty state shown when every slice is zero. |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title: why the range is empty, or what to do next. |
| `tableView` | `boolean` | `false` | false | Shows the data table in place of the ring. The table is always present for assistive tech. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the chart. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model:activeIndex` | `number \| null` | `null` | `update:activeIndex` | The slice under the pointer or keyboard focus. |
| `v-model:hiddenSeries` | `string[]` | `[]` | `update:hiddenSeries` | Ids of slices the legend has hidden. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `slice-click` | `(event: MouseEvent \| KeyboardEvent, series: ChartSeries)` | Click on a slice, or Enter / Space on the focused chart; `series` is the consumer's own series object. |
| `legend-toggle` | `(event: MouseEvent, series: ChartSeries)` | A legend entry toggled. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `center` | `{ total: number; active: ChartSeries \| null }` | Replaces the center readout. |
| `empty` | — | Replaces the default EmptyState. |
| `empty-actions` | — | Actions under the default EmptyState, such as a Clear filters button or a setup link. Ignored when `empty` replaces it. |
| `error` | — | Replaces the default danger Message. |

## States

- Visual states: `default`, `loading` (circular Skeleton), `error` (Message), `empty` (EmptyState with a chart icon, the title, the optional description and actions, holding the ring's footprint), `refetching`, `table-view`, `active` (a slice hovered or focused)
- `data-kind`: `donut` | `pie`; `data-size`: `small` | `medium` | `large`
- `data-loading`, `data-error`, `data-empty`, `data-refetching`, `data-table-view` mirror the state
- `data-entered` on each slice flips after two animation frames to run the sweep
- `data-active` on the active slice, `data-dimmed` on the others

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| slice sweep on entrance | `transition-[stroke-dasharray,opacity] duration-slow-02 ease-productive-entrance`, each arc grows from zero length on `data-entered`, staggered per slice by `transition-delay` | `slow-02` · `productive-entrance` | `motion-reduce:transition-none` |
| active slice lift, others dim | `transition-[stroke-width,opacity] duration-fast-02 ease-productive-entrance` | `fast-02` · `productive-entrance` | `motion-reduce:transition-none` |
| refetch hold | `transition-opacity duration-moderate-01` | `moderate-01` | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| slices | `var(--chart-series-1)` … `var(--chart-series-6)`, `var(--chart-series-other)` |
| status slices | `var(--chart-status-danger)`, `var(--chart-status-success)`, `var(--chart-status-warning)`, `var(--chart-status-info)` |
| slice gap | `var(--bg-surface)` |
| center value | `.text-heading-md` |
| center caption, legend | `.text-body-sm`, `var(--text-muted)`, `var(--text-default)` |
| spacing | `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)` |
| focus | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | The `--chart-*` role ships with the chart category. |

## Accessibility (WCAG 2.1 AA)

- Root is a `<figure>`; the ring is one tab stop, `role="group"` with `aria-roledescription="chart"`, named by `ariaLabel`.
- Keyboard map: Left / Right (or Up / Down) move between slices, Home / End jump, Enter / Space fire `slice-click`, Escape clears.
- A polite live region announces the active slice name, value and share.
- A data table twin is always rendered, visually hidden unless `tableView`.
- The ring SVG is `aria-hidden`; the legend names every slice with its value and share, so identity never rests on color.
- Legend entries are buttons with `aria-pressed`, at least 24px tall; visible focus ring `focus-visible:ring-(--ring-color)`.
- `motion-reduce:transition-none` on every transition.

## Stories (Storybook)

- Default — donut of the top countries with the total in the center.
- Types — composite: `donut` and `pie` side by side.
- Sizes — composite: `small`, `medium`, `large`.
- Loading — `loading`.
- Empty — composite: every slice zero, once with the default copy and once filtered to nothing with a Clear filters action.

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
