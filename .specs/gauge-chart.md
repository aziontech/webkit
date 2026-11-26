---
name: gauge-chart
category: chart
structure: monolithic
status: implemented
spec_version: 6
template: 2
checksum: 8fa57c02959e2d2175b67e3eb1af8d79c33417076930814fb54f254fa8406df2
created: 2026-11-11
last_updated: 2026-11-18
---

# GaugeChart — Component Spec

## Purpose

Use GaugeChart for one value against a known range with thresholds; for threshold lines or bands inside a Chart use Chart.Reference, and for one headline metric with a delta use StatTile. Both thresholds share one model, `ChartThreshold`.

One reading against a known range, drawn as a half-circle dial with the value under the arc and the scale ends beside it. Bands (thresholds) name what the value means and color the arc. It shares the chart palette, the loading, empty and error surface and the `ChartCard` naming with the rest of the chart family, and is rendered in-house SVG.

## When to use

- A utilization or ratio with a fixed range: CPU, memory, cache hit ratio, quota used.
- A latency or score against a target, where bands (healthy, busy, critical) carry the meaning.
- A headline reading on a detail page or in a dashboard card, beside the time series that explains it.

## When NOT to use

- A number with a change against a period and a trend → use `stat-tile`.
- A value over time → use `chart` (line or area).
- Progress of a task toward done → use `progress`.
- Several readings to compare with each other → use `bar-list` or `chart` with horizontal bars; dials side by side compare badly.

## Related

- `stat-tile` — one figure with a delta and a sparkline, for a KPI row.
- `chart-card` — the box a dashboard gauge sits in; the gauge takes its accessible name from the card title.
- `progress` — completion of a task, not a reading.

## Best practices

- Give the range that means something for the reading (0 to 100 for a ratio, 0 to the quota for usage); the dial is meaningless without it.
- Add bands only when the range has agreed limits (a quota, an SLO, a CPU ceiling); without them the arc draws in `--chart-series-1`, the default chart color, and the reading carries no judgment.
- Name every band (`label`) so the value is read with its meaning, not only with a color.
- Use status severities for bands (`success`, `warning`, `danger`) and the findings levels (`severity-critical` … `severity-info`) only when the reading is a severity.
- Put the unit in `formatValue` (`74%`, `92 ms`) and what is measured in `label`. A unit word after a space (`92 ms`) is set apart in the muted sans text face, so the display figure face never turns it into capitals.

## Usage

```vue
<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

</script>

<template>
  <GaugeChart
    :value="74"
    label="Cache hit ratio"
    :format-value="(value) => `${value}%`"
  />
</template>
```

With bands, when the reading means a state (the arc takes the color of the band the value falls in):

```vue
<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

  const thresholds = [
    { value: 0, severity: 'success', label: 'Healthy' },
    { value: 70, severity: 'warning', label: 'Busy' },
    { value: 90, severity: 'danger', label: 'Critical' }
  ]
</script>

<template>
  <GaugeChart
    :value="74"
    label="CPU usage"
    :thresholds="thresholds"
    :format-value="(value) => `${value}%`"
  />
</template>
```

**Three ways in** (decision RV-C2-1, rule `webkit-content-channels`). The same data renders from a docs page as a tag (`DocMarkdown`, braced attribute values are JSON) and from the site's page JSON as the `GaugeChart` scene a band draws by name (a `console-showcase-section` with `variant: "diagram"` in its `scene` slot):

```mdx
<GaugeChart aria-label="Cache hit ratio" value={74} label="Cache hit ratio, %" />
```

```json
{ "component": "GaugeChart", "props": { "value": 74, "label": "Cache hit ratio, %" } }
```

The function props (`formatValue`) and the events stay Vue. `DocMarkdown` and the scene registry load the component as an async chunk, so neither grows unless a page uses it.

## Props

| Prop               | Type                             | Default         | Required | JSDoc                                                                                                                       |
| ------------------ | -------------------------------- | --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `value`            | `number \| null`                 | `null`          | false    | The reading. Null or absent renders the empty state.                                                                        |
| `min`              | `number`                         | `0`             | false    | Start of the scale.                                                                                                         |
| `max`              | `number`                         | `100`           | false    | End of the scale.                                                                                                           |
| `label`            | `string`                         | `''`            | false    | Caption under the reading: what is measured, or the unit.                                                                   |
| `thresholds`       | `ChartThreshold[]`               | `[]`            | false    | Bands from low to high; the arc takes the color of the band the value falls in, and each band start is marked on the track. |
| `formatValue`      | `(value: number) => string`      | `formatCompact` | false    | Formats the reading and the scale ends.                                                                                     |
| `size`             | `'small' \| 'medium' \| 'large'` | `'medium'`      | false    | Width of the dial: 160, 224 or 288 pixels.                                                                                  |
| `loading`          | `boolean`                        | `false`         | false    | Renders a Skeleton sized to the dial.                                                                                       |
| `refetching`       | `boolean`                        | `false`         | false    | Holds the previous reading at reduced opacity while new data loads.                                                         |
| `error`            | `string`                         | `''`            | false    | Error message; when set, a danger Alert replaces the dial.                                                                  |
| `emptyTitle`       | `string`                         | `''`            | false    | Title of the empty state shown when there is no reading. Empty uses the locale catalog (`No data available`).               |
| `emptyDescription` | `string`                         | `''`            | false    | Supporting line under the empty title: why there is no reading, or what to do next.                                         |
| `ariaLabel`        | `string`                         | `''`            | false    | Accessible name of the meter when it is not inside a ChartCard with a title.                                                |

`ChartThreshold` is `{ value: number; severity: ChartThresholdSeverity; label?: string }`, with `ChartThresholdSeverity` = `'neutral' | ChartSemanticSeverity | ChartSeverity`; it is the same type `Chart.Reference` takes its `severity` from, so a band and a reference line read one severity map (`neutral` draws in `var(--chart-label)`, a status in `var(--chart-status-*)`, a findings level in `var(--severity-*)`).

## Events

_No events — the gauge is a read-out; wrap it in a link or button to make it interactive._

## Slots

| Slot            | Scope                                             | Notes                                           |
| --------------- | ------------------------------------------------- | ----------------------------------------------- |
| `value`         | `{ value: number; text: string; status: string }` | Replaces the reading and caption under the arc. |
| `empty`         | —                                                 | Replaces the default EmptyState.                |
| `empty-actions` | —                                                 | Actions under the default EmptyState.           |
| `error`         | —                                                 | Replaces the default danger Alert.              |

## States

- Error pattern of the chart family: a chart tall enough for it shows the centred error card (a bordered small `EmptyState` with the cause and a secondary `Try again` button, as BarList, DonutChart and DataTable do) through its `error` slot; only a strip too short for the card (Tracker) keeps an inline banner. The retry label is always `Try again`.
- Visual states: `default`, `loading` (Skeleton at the dial ratio), `error` (Alert), `empty` (EmptyState), `refetching` (reduced opacity)
- `data-loading`, `data-error`, `data-empty`, `data-refetching` on the root; priority loading, then error, then empty, then the dial
- `data-size`: `small` | `medium` | `large`
- `data-severity` on the meter: the severity of the band the value falls in
- `data-entered` on the arc flips after two animation frames to run its entrance

- Its root carries `data-plain-ground`: it is content that must sit on a plain ground, so a `Texture` beside it hides itself, and the texture-backdrop check blocks placing it on a textured band (a texture is a backdrop for text only, RV-T2-1).

## Motion & Animations

| Trigger                    | Animation / Transition                                                                                                       | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| arc entrance, value change | `transition-[stroke-dasharray,stroke] duration-slow-02 ease-productive-entrance`, dash from 0 to the share on `data-entered` | `slow-02` · `productive-entrance`                      | `motion-reduce:transition-none` (drawn at once) |
| refetch hold               | `transition-opacity duration-moderate-01`                                                                                    | `moderate-01`                                          | `motion-reduce:transition-none`                 |

## Tokens

| Region           | Token (TOKENS.md)                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| track            | `var(--border-muted)`                                                                                                                              |
| arc, no band     | `var(--chart-series-1)`                                                                                                                            |
| arc in a band    | `var(--chart-status-*)`, `var(--severity-*)`                                                                                                       |
| band marks       | `var(--bg-surface)`                                                                                                                                |
| reading          | `.text-big-number-md`, `.text-big-number-sm`, `.text-heading-sm`, `var(--text-default)`; a trailing unit word `.text-body-sm`, `var(--text-muted)` |
| caption and ends | `.text-body-sm`, `.text-label-sm`, `var(--text-muted)`                                                                                             |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up                  |
| -------------- | ------------------- | -------------------------- |
| _none_         | —                   | Uses the `--chart-*` role. |

## Accessibility (WCAG 2.1 AA)

- The dial is `role="meter"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext` (the formatted value, then the band name: `93%, Critical`).
- Named by `ariaLabel`, else by `label`, else by the enclosing ChartCard title (`aria-labelledby`); described by the range (`Range 0 to 100`).
- The SVG is `aria-hidden`; the meaning never rests on color alone — the band name is read and shown with the value.
- The meter is not focusable: it has no interaction (the value is reachable as text).
- Arc colors clear 3:1 on the surface in both themes (status and series tokens, pinned by the theme chart role test).
- `motion-reduce:transition-none` on every transition.

## Internationalization

| Key                          | English source         | Override prop        |
| ---------------------------- | ---------------------- | -------------------- |
| `gaugeChart.emptyTitle`      | `No data available`    | `emptyTitle`         |
| `gaugeChart.valueWithStatus` | `{value}, {status}`    | `thresholds[].label` |
| `gaugeChart.range`           | `Range {min} to {max}` | —                    |

- Formatting: `Intl.NumberFormat` compact values with the locale from `ConfigProvider`, unless `formatValue` is passed.

## Right-to-left

- Layout: the dial is mirrored (`scale(-1 1)` on the arc group), so it fills from the inline start; the scale ends swap sides through flex order. Logical utilities only.
- Icons: none.
- Keyboard: none (not interactive).
- User data: none.

## Responsive

- Container queries: none: the dial takes the container width up to its size (160, 224 or 288 px) and keeps a 15:8 ratio.
- Narrow (≤ 640 px or a narrow container): the dial shrinks with its container; the caption clamps to two lines.
- Touch: no targets.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: `gauge-chart` 11 KB gzip (`.size-limit.json`; most of it is the shared Alert, EmptyState and Skeleton).
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default — a cache hit ratio with no bands, so the arc takes the first categorical slot.
- Bands — CPU usage with three named status bands; the one example with semantic colors.
- Sizes — composite: small, medium and large dials.
- States — composite: loading, empty and error (the gauge has no `disabled`; its three data states share one frame, as in the examples).
- Markdown — the same data as a `<GaugeChart>` tag rendered by `DocMarkdown`. Justified: the docs channel (RV-C2-1).
- Page JSON — the same data as a `GaugeChart` scene in a `console-showcase-section` entry rendered by `SitePage`, with the JSON shown. Justified: the site channel (RV-C2-1).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
