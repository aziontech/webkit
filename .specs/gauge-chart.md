---
name: gauge-chart
category: chart
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: c7a28e996223d1ff37b980f794728450083967bfc3f55f6673e55a30049b0f02
created: 2026-11-12
last_updated: 2026-11-12
---

# GaugeChart — Component Spec

## Purpose

One reading against a known range, drawn as a half-circle dial with the value under the arc and the scale ends beside it. Bands (thresholds) name what the value means and color the arc. It shares the chart palette, the loading, empty and error surface and the `ChartCard` naming with the rest of the chart family, and is rendered in-house SVG.

## When to use

- A utilization or ratio with a fixed range: CPU, memory, cache hit ratio, quota used.
- A latency or score against a target, where bands (healthy, busy, critical) carry the meaning.
- A headline reading on a detail page or in a dashboard card, beside the time series that explains it.

## When NOT to use

- A number with a change against a period and a trend → use `stat-tile`.
- A value over time → use `chart` (line or area).
- Progress of a task toward done → use `progress-bar`.
- Several readings to compare with each other → use `bar-list` or `chart` with horizontal bars; dials side by side compare badly.

## Related

- `stat-tile` — one figure with a delta and a sparkline, for a KPI row.
- `chart-card` — the box a dashboard gauge sits in; the gauge takes its accessible name from the card title.
- `progress-bar` — completion of a task, not a reading.

## Best practices

- Give the range that means something for the reading (0 to 100 for a ratio, 0 to the quota for usage); the dial is meaningless without it.
- Name every band (`label`) so the value is read with its meaning, not only with a color.
- Use status colors for bands (`success`, `warning`, `danger`) and severity colors only when the reading is a severity.
- Put the unit in `formatValue` (`74%`, `92 ms`) and what is measured in `label`.

## Usage

```vue
<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

  const thresholds = [
    { value: 0, color: 'success', label: 'Healthy' },
    { value: 70, color: 'warning', label: 'Busy' },
    { value: 90, color: 'danger', label: 'Critical' }
  ]
</script>

<template>
  <GaugeChart
    :value="74"
    label="Cache hit ratio"
    :thresholds="thresholds"
    :format-value="(value) => `${value}%`"
  />
</template>
```

## Props

| Prop               | Type                             | Default         | Required | JSDoc                                                                                                                       |
| ------------------ | -------------------------------- | --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `value`            | `number \| null`                 | `null`          | false    | The reading. Null or absent renders the empty state.                                                                        |
| `min`              | `number`                         | `0`             | false    | Start of the scale.                                                                                                         |
| `max`              | `number`                         | `100`           | false    | End of the scale.                                                                                                           |
| `label`            | `string`                         | `''`            | false    | Caption under the reading: what is measured, or the unit.                                                                   |
| `thresholds`       | `GaugeChartThreshold[]`          | `[]`            | false    | Bands from low to high; the arc takes the color of the band the value falls in, and each band start is marked on the track. |
| `formatValue`      | `(value: number) => string`      | `formatCompact` | false    | Formats the reading and the scale ends.                                                                                     |
| `size`             | `'small' \| 'medium' \| 'large'` | `'medium'`      | false    | Width of the dial: 160, 224 or 288 pixels.                                                                                  |
| `loading`          | `boolean`                        | `false`         | false    | Renders a Skeleton sized to the dial.                                                                                       |
| `refetching`       | `boolean`                        | `false`         | false    | Holds the previous reading at reduced opacity while new data loads.                                                         |
| `error`            | `string`                         | `''`            | false    | Error message; when set, a danger Alert replaces the dial.                                                                  |
| `emptyTitle`       | `string`                         | `''`            | false    | Title of the empty state shown when there is no reading. Empty uses the locale catalog (`No data available`).               |
| `emptyDescription` | `string`                         | `''`            | false    | Supporting line under the empty title: why there is no reading, or what to do next.                                         |
| `ariaLabel`        | `string`                         | `''`            | false    | Accessible name of the meter when it is not inside a ChartCard with a title.                                                |

`GaugeChartThreshold` is `{ value: number; color: ChartStatus | ChartSeverity; label?: string }`.

## Events

| Event  | Payload | Notes                                           |
| ------ | ------- | ----------------------------------------------- |
| _none_ | —       | The gauge is a read-out; it has no interaction. |

## Slots

| Slot            | Scope                                             | Notes                                           |
| --------------- | ------------------------------------------------- | ----------------------------------------------- |
| `value`         | `{ value: number; text: string; status: string }` | Replaces the reading and caption under the arc. |
| `empty`         | —                                                 | Replaces the default EmptyState.                |
| `empty-actions` | —                                                 | Actions under the default EmptyState.           |
| `error`         | —                                                 | Replaces the default danger Alert.              |

## States

- Visual states: `default`, `loading` (Skeleton at the dial ratio), `error` (Alert), `empty` (EmptyState), `refetching` (reduced opacity)
- `data-loading`, `data-error`, `data-empty`, `data-refetching` on the root; priority loading, then error, then empty, then the dial
- `data-size`: `small` | `medium` | `large`
- `data-status` on the meter: the color of the band the value falls in
- `data-entered` on the arc flips after two animation frames to run its entrance

## Motion & Animations

| Trigger                    | Animation / Transition                                                                                                       | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| arc entrance, value change | `transition-[stroke-dasharray,stroke] duration-slow-02 ease-productive-entrance`, dash from 0 to the share on `data-entered` | `slow-02` · `productive-entrance`                 | `motion-reduce:transition-none` (drawn at once) |
| refetch hold               | `transition-opacity duration-moderate-01`                                                                                    | `moderate-01`                                     | `motion-reduce:transition-none`                 |

## Tokens

| Region           | Token (DESIGN.md)                                                                       |
| ---------------- | --------------------------------------------------------------------------------------- |
| track            | `var(--chart-grid)`                                                                     |
| arc, no band     | `var(--chart-series-1)`                                                                 |
| arc in a band    | `var(--chart-status-*)`, `var(--severity-*)`                                            |
| band marks       | `var(--bg-surface)`                                                                     |
| reading          | `.text-big-number-md`, `.text-big-number-sm`, `.text-heading-sm`, `var(--text-default)` |
| caption and ends | `.text-body-sm`, `.text-label-sm`, `var(--text-muted)`                                  |

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

- Formatting: `Intl.NumberFormat` compact values with the locale from `WebkitProvider`, unless `formatValue` is passed.

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

## Stories (Storybook)

- Default — a cache hit ratio with three named bands.
- Sizes — composite: small, medium and large dials.
- States — composite: loading, empty and error (the gauge has no `disabled`; its three data states share one frame, as in the examples).

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
