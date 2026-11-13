---
name: spark-chart
category: chart
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
checksum: fae8bc76a8e9829e77f1f5820ba5aa80831187c15dd0fa45b23c9b70015cb730
---

# SparkChart — Component Spec

## Purpose

A word-sized chart: one series drawn as an area, a line or bars, with no axes, grid, legend or tooltip, filling the width of its container at a fixed height. It shows the shape of a recent history next to a number — in a stat tile, a table row or a ticker card — where a full `chart` would be too much.

## When to use

- The shape of a metric's recent history beside its current value: requests in the last hour, latency over the day.
- Rows of comparable items, each with its own trend: one SparkChart per row of a list or table.
- The trend inside a `stat-tile`, which draws its `trend` through this component.

## When NOT to use

- The reader needs exact values, a time axis or several series → use `chart`.
- A ranking across categories → use `bar-list`.
- Up/down status over discrete periods → use `tracker`.

## Related

- `stat-tile` — the KPI tile that renders its sparkline with SparkChart.
- `chart` — the full history with axes, tooltip and legend.
- `tracker` — a strip of status blocks rather than a measured shape.

## Best practices

- Pair it with the number it describes; a spark alone has no scale and says nothing exact.
- Use the same buckets as the chart behind it, about twelve to thirty points.
- Leave `fromZero` off for prices and latencies, where the shape matters more than the magnitude; turn it on for counts that are meaningful from zero.
- Give it an `ariaLabel` only when it stands without a nearby number; otherwise keep it decorative.

## Usage

```vue
<script setup>
import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <SparkChart :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `values` | `(number \| null)[]` | `[]` | false | The series, oldest first; null leaves a gap. |
| `kind` | `'area' \| 'line' \| 'bar'` | `'area'` | false | Mark drawn for the series. |
| `color` | `ChartColor` | `1` | false | Hue of the mark: a categorical slot (1–6), `other`, or a status. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Height: 32, 48 or 64 pixels. Width follows the container. |
| `fromZero` | `boolean` | `false` | false | Starts the value range at zero instead of the lowest value; bars always start at zero. |
| `ariaLabel` | `string` | `''` | false | Accessible name; when set the chart is an image, when empty it is decorative. |

## Events

_No events — a spark is a glyph; wrap it in a link or button to make it interactive._

## Slots

_No slots._

## States

- Visual states: `default`, `empty` (no finite value — renders nothing at its reserved height)
- `data-kind`: `area` | `line` | `bar`
- `data-size`: `small` | `medium` | `large`
- Lines and area edges are linear segments with round joins and caps; 2px stroke; the area fill fades from the hue to transparent. Bars have a 1px rounded data end and a 1px gap between them.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| line / area entrance | `transition-[stroke-dashoffset] duration-slow-02 ease-productive-entrance`, `pathLength="1"` on `data-entered` | `slow-02` · `productive-entrance` | `motion-reduce:transition-none` |
| area fill entrance | `transition-opacity duration-slow-01 ease-productive-entrance` on `data-entered` | `slow-01` · `productive-entrance` | `motion-reduce:transition-none` |
| bar entrance | `transition-[scale] duration-slow-01 ease-productive-entrance` from the baseline on `data-entered` | `slow-01` · `productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| mark | the `color` role (`var(--chart-series-1)` … `var(--chart-series-6)`, `var(--chart-series-other)`, `var(--chart-status-success)`, `var(--chart-status-warning)`, `var(--chart-status-danger)`, `var(--chart-status-info)`) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- With `ariaLabel` the SVG is `role="img"` named by it; without, it is `aria-hidden` and the number beside it carries the information.
- Not focusable; no keyboard map.
- The mark clears 3:1 against the chart surfaces in both themes (the `--chart-*` role guarantees it).

## Stories (Storybook)

- Default — an area spark.
- Types — composite: `area`, `line`, `bar` side by side.
- Sizes — composite: `small`, `medium`, `large`.
- Cards — a list of ticker rows (name, SparkChart, value, delta); justified because a spark is only legible beside its number, and this is the reference composition.

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
