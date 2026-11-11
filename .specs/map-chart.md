---
name: map-chart
category: chart
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: a7211dc403aa4c81df639bdd2e61d07e34422627681e3d78035fbf1469e66113
created: 2026-11-11
last_updated: 2026-11-11
---

# MapChart — Component Spec

## Purpose

Values by place on the dotted world map of `NetworkMap`: countries shaded on a five-step sequential scale (a choropleth on the dot grid) and locations drawn as bubbles whose area follows the value. One tab stop walks every place from the highest value down, with a tooltip, a polite announcement and a table twin, so nothing on the map needs a pointer. The country shapes are a lazy chunk; the map itself adds no dependency.

## When to use

- Requests, threats or bandwidth by country (Real-Time Metrics map card).
- Traffic by point of presence or by city, as bubbles.
- A regional view of either, framed with `view` (for example `south-america`).

## When NOT to use

- Ranking a handful of countries where the exact order matters → use `bar-list`; a map hides small countries.
- A decorative network backdrop with no data → use `network-map`.
- Values over time → use `chart`.

## Related

- `network-map` — the same dot grid as decoration in marketing and empty states.
- `bar-list` — the ranked list that usually sits beside the map.
- `chart-card` — the card a dashboard map sits in; the map takes its accessible name from the card title.

## Best practices

- Pair the map with a ranked list or a table: the map shows where, the list shows how much.
- Pass ISO 3166-1 alpha-2 codes as region ids; names come from the locale (`Intl.DisplayNames`) unless you pass `name`.
- Keep region and point ids distinct: `v-model:activeId` holds one of them.
- Give points a status color only when the color means a state; otherwise leave the series slot.

## Usage

```vue
<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const regions = [
    { id: 'BR', value: 48200 },
    { id: 'US', value: 31600 },
    { id: 'DE', value: 18900 }
  ]
  const points = [{ id: 'sao-paulo', name: 'São Paulo', lat: -23.55, lon: -46.63, value: 18400 }]
</script>

<template>
  <MapChart
    :regions="regions"
    :points="points"
    aria-label="Requests by country"
  />
</template>
```

## Props

| Prop               | Type                                                                                                         | Default         | Required | JSDoc                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `regions`          | `MapChartRegion[]`                                                                                           | `[]`            | false    | Countries shaded by value on a five-step sequential scale.                                                               |
| `points`           | `MapChartPoint[]`                                                                                            | `[]`            | false    | Locations drawn as bubbles sized by value.                                                                               |
| `view`             | `'world' \| 'americas' \| 'north-america' \| 'south-america' \| 'europe' \| 'africa' \| 'asia' \| 'oceania'` | `'world'`       | false    | Part of the world the map frames.                                                                                        |
| `formatValue`      | `(value: number) => string`                                                                                  | `formatCompact` | false    | Formats values in the tooltip, legend and table.                                                                         |
| `loading`          | `boolean`                                                                                                    | `false`         | false    | Renders a Skeleton sized to the map and suppresses interaction.                                                          |
| `refetching`       | `boolean`                                                                                                    | `false`         | false    | Holds the previous render at reduced opacity while new data loads.                                                       |
| `error`            | `string`                                                                                                     | `''`            | false    | Error message; when set, a danger Alert replaces the map.                                                                |
| `emptyTitle`       | `string`                                                                                                     | `''`            | false    | Title of the empty state shown when no region or point has a value. Empty uses the locale catalog (`No data available`). |
| `emptyDescription` | `string`                                                                                                     | `''`            | false    | Supporting line under the empty title: why the range is empty, or what to do next.                                       |
| `tableView`        | `boolean`                                                                                                    | `false`         | false    | Shows the data table in place of the map. The table is always present for assistive tech.                                |
| `ariaLabel`        | `string`                                                                                                     | `''`            | false    | Accessible name of the map when it is not inside a ChartCard with a title.                                               |

`MapChartRegion` is `{ id: string; value: number | null; name?: string }`; `MapChartPoint` is `{ id: string; name: string; lat: number; lon: number; value: number; color?: ChartColor }`.

## v-model

| Model              | Type             | Default | Emits             | Notes                                                    |
| ------------------ | ---------------- | ------- | ----------------- | -------------------------------------------------------- |
| `v-model:activeId` | `string \| null` | `null`  | `update:activeId` | The region or point under the pointer or keyboard focus. |

## Events

| Event          | Payload                                                        | Notes                                                           |
| -------------- | -------------------------------------------------------------- | --------------------------------------------------------------- |
| `region-click` | `(event: MouseEvent \| KeyboardEvent, region: MapChartRegion)` | Click on a shaded country, or Enter / Space while it is active. |
| `point-click`  | `(event: MouseEvent \| KeyboardEvent, point: MapChartPoint)`   | Click on a bubble, or Enter / Space while it is active.         |

## Slots

| Slot            | Scope | Notes                                                                 |
| --------------- | ----- | --------------------------------------------------------------------- |
| `empty`         | —     | Replaces the default EmptyState.                                      |
| `empty-actions` | —     | Actions under the default EmptyState, such as a Clear filters button. |
| `error`         | —     | Replaces the default danger Alert.                                    |

## States

- Visual states: `default`, `loading` (Skeleton at the map ratio), `error` (Alert), `empty` (EmptyState), `refetching`, `table-view`, `active` (a place is hovered or focused; the others dim)
- `data-loading`, `data-error`, `data-empty`, `data-refetching`, `data-table-view`, `data-active`, `data-view` on the root
- `data-geometry`: `loading` | `ready` while the country shapes chunk loads (only when `regions` is set)
- `data-bin` (0 to 4) on each shaded country; `data-entered` on marks after two animation frames
- Server render and hydration: the land, the bubbles, the legend and the table render on the server; the country shading appears after the shapes chunk loads on the client, so the first client render matches the server.

## Motion & Animations

| Trigger                  | Animation / Transition                                                                   | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| marks entrance           | `transition-opacity duration-slow-01 ease-productive-entrance`, 0 to 1 on `data-entered` | `slow-01` · `productive-entrance`                 | `motion-reduce:transition-none` |
| active dim, refetch hold | `transition-opacity duration-moderate-01`                                                | `moderate-01`                                     | `motion-reduce:transition-none` |

## Tokens

| Region                   | Token (DESIGN.md)                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------- |
| land dots                | `var(--chart-axis)`                                                                   |
| country steps 1 to 5     | `var(--chart-sequential-3)` … `var(--chart-sequential-7)`                             |
| bubbles                  | `var(--chart-series-*)`, `var(--chart-status-*)`                                      |
| bubble ring, active ring | `var(--bg-surface)`, `var(--text-default)`                                            |
| tooltip                  | `var(--chart-tooltip-bg)`, `var(--chart-tooltip-text)`, `var(--chart-tooltip-border)` |
| legend labels            | `.text-label-sm`, `var(--text-muted)`                                                 |
| focus                    | `var(--ring-color)`                                                                   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up                                                                                               |
| -------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| _none_         | —                   | Uses the `--chart-*` role; the sequential ramp inverts in dark so the highest step is the most visible. |

## Accessibility (WCAG 2.1 AA)

- Root is a `<figure>`; the map is one tab stop: `role="group"` with `aria-roledescription="map"`, named by `ariaLabel` or the ChartCard title, described by a summary (`5 places on the map, 104K in total.`).
- Keyboard map: Right / Down move to the next place and Left / Up to the previous (countries first, then locations, each from the highest value), Home / End jump to the ends, Enter / Space fire `region-click` or `point-click`, Escape clears.
- A polite live region announces the active place and its value; the tooltip follows focus as it follows the pointer.
- A data table twin (name, value) is always rendered, visually hidden unless `tableView`.
- The SVG is `aria-hidden`; value never rests on color alone — the legend states the range, the tooltip and table give each value.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the map.
- `motion-reduce:transition-none` on every transition.

## Internationalization

| Key                        | English source                                          | Override prop         |
| -------------------------- | ------------------------------------------------------- | --------------------- |
| `mapChart.emptyTitle`      | `No data available`                                     | `emptyTitle`          |
| `mapChart.roleDescription` | `map`                                                   | —                     |
| `mapChart.name`            | `Name`                                                  | —                     |
| `mapChart.value`           | `Value`                                                 | —                     |
| `mapChart.summary`         | `{count} places on the map, {total} in total.` (plural) | `ariaLabel` (caption) |
| `mapChart.legend`          | `From {min} to {max}`                                   | —                     |

- Formatting: `Intl.NumberFormat` compact values and `Intl.DisplayNames` (type `region`) country names, with the locale from `WebkitProvider`.

## Right-to-left

- Layout: geography is never mirrored; the legend and table follow the inline direction with logical utilities. The tooltip is placed in physical map coordinates (inline `left` plus translate), because SVG coordinates are physical.
- Icons: none.
- Keyboard: Left and Right swap under rtl (`logicalArrowKey`), so the key toward the inline end always moves to the next place.
- User data: names render as given.

## Responsive

- Container queries: none: the map takes the container width at the framed region's aspect ratio.
- Narrow (≤ 640 px or a narrow container): the map scales down; the tooltip caps at `--container-3xs`.
- Touch: tapping a country or bubble activates it; every value is in the table twin and reachable from the keyboard.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: `map-chart` 17.5 KB gzip for the initial chunk (the land grid is ~5 KB of it); the country shapes are a separate async chunk of ~4.7 KB gzip, loaded only when `regions` is set.
- Runtime budget: 128 countries and 500 bubbles render in one frame; no per-frame work.
- Heavy parts: country shapes, lazy (`import('./map-chart-countries')`). They are derived from Natural Earth country polygons (public domain) through the Console Kit map data, sampled onto the `NetworkMap` dot grid.

## Stories (Storybook)

- Default — requests by country.
- Points — requests by point of presence as bubbles.
- View — South America with countries and bubbles.
- States — composite: loading, empty, error and table view in one frame (the four data states, as in the chart).

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
