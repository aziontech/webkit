# Donut Chart

> A part-to-whole chart drawn as a ring (donut) or a disc (pie): one slice per series, the total in the center, a legend beside it. It shares the cartesian chart's data model, palette, legend behavior and loading / empty / error surface, so a dashboard reads as one system. Each slice is the sum of its series values, so a time series passes straight in as its share of the range.

- Import: `import DonutChart from '@aziontech/webkit/donut-chart'`
- Category: chart · Surface: product · Structure: monolithic
- API as JSON: [donut-chart.json](https://github.com/aziontech/webkit/blob/main/.specs/donut-chart.json)

## When to use

- Share of a small whole at a glance: top countries by blocked threats, traffic by protocol, cache hit versus miss.
- A dashboard card where the total is the headline and the split is the context.

## Do

- Keep it to six slices or fewer; the seventh and beyond fold into Other automatically.
- Order series by size so the largest slice starts at the top.
- Use the center for the total and let hover or focus swap it to the active slice.
- Pair it with the bar form of the same data when exact ranks matter (the console's country pie plus ordered bar).

## Don’t

- Comparing close values or more than six slices → use `chart` with horizontal bars; angles are hard to compare.
- Two slices → use `stat-tile` with the ratio; a two-slice pie says less than the number.
- Change over time → use `chart`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chart](chart.md) — the cartesian sibling; same series model, so a dataset moves between them without reshaping.
- chart-card` — the box a dashboard donut sits in.
- [stat-tile](stat-tile.md) — the total alone, with a delta.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `series` | `ChartSeries[]` | `[]` | false | One slice per series; a slice is the sum of its values. The first six take the categorical slots, the rest fold into Other. |
| `kind` | `'donut' \| 'pie'` | `'donut'` | false | Ring or solid disc. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Diameter of the ring: 128, 176 or 240 pixels. |
| `cap` | `number` | `6` | false | Slices kept before the rest fold into Other. |
| `otherLabel` | `string` | `''` | false | Name of the folded slice. Empty uses the locale catalog (`Other`). |
| `totalLabel` | `string` | `''` | false | Caption under the total in the center. Empty uses the locale catalog (`Total`). |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats the center value and legend values. |
| `loading` | `boolean` | `false` | false | Renders a circular Skeleton and suppresses interaction. |
| `refetching` | `boolean` | `false` | false | Holds the previous render at reduced opacity while new data loads. |
| `error` | `string` | `''` | false | Error message; when set, a danger Alert replaces the ring. |
| `emptyTitle` | `string` | `''` | false | Title of the empty state shown when every slice is zero. Empty uses the locale catalog (`No data available`). |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title: why the range is empty, or what to do next. |
| `tableView` | `boolean` | `false` | false | Shows the data table in place of the ring. The table is always present for assistive tech. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the chart. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `slice-click` | `(event: MouseEvent \| KeyboardEvent, series: ChartSeries)` | Click on a slice, or Enter / Space on the focused chart; `series` is the consumer's own series object. |
| `legend-toggle` | `(event: MouseEvent, series: ChartSeries)` | A legend entry toggled. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `center` | { total: number; active: ChartSeries | null }` \| Replaces the center readout. |
| `empty` | — | Replaces the default EmptyState. |
| `empty-actions` | — | Actions under the default EmptyState, such as a Clear filters button or a setup link. Ignored when `empty` replaces it. |
| `error` | — | Replaces the default danger Alert. |

## v-model

| Model                  | Type             | Default | Emits                 | Notes                                          |
| ---------------------- | ---------------- | ------- | --------------------- | ---------------------------------------------- |
| `v-model:activeIndex`  | `number \| null` | `null`  | `update:activeIndex`  | The slice under the pointer or keyboard focus. |
| `v-model:hiddenSeries` | `string[]`       | `[]`    | `update:hiddenSeries` | Ids of slices the legend has hidden.           |

## States

- Visual states: `default`, `loading` (circular Skeleton), `error` (Alert), `empty` (EmptyState with a chart icon, the title, the optional description and actions, holding the ring's footprint), `refetching`, `table-view`, `active` (a slice hovered or focused)
- `data-kind`: `donut` | `pie`; `data-size`: `small` | `medium` | `large`
- `data-loading`, `data-error`, `data-empty`, `data-refetching`, `data-table-view` mirror the state
- `data-entered` on each slice flips after two animation frames to run the sweep
- `data-active` on the active slice, `data-dimmed` on the others
- Reflow: the visually hidden table twin sits inside an `sr-only` box so its intrinsic width never adds horizontal overflow at 320 px.

## Accessibility

- Root is a `<figure>`; the ring is one tab stop, `role="group"` with `aria-roledescription="chart"`, named by `ariaLabel`.
- Keyboard map: Left / Right (or Up / Down) move between slices, Home / End jump, Enter / Space fire `slice-click`, Escape clears.
- A polite live region announces the active slice name, value and share.
- A data table twin is always rendered, visually hidden unless `tableView`.
- The ring SVG is `aria-hidden`; the legend names every slice with its value and share, so identity never rests on color.
- Legend entries are buttons with `aria-pressed`, at least 24px tall; visible focus ring `focus-visible:ring-(--ring-color)`.
- `motion-reduce:transition-none` on every transition.

## Examples

### Default

```vue
<script setup>
  import DonutChart from '@aziontech/webkit/donut-chart'

  const series = [
    {
      id: 'Brazil',
      name: 'Brazil',
      values: [48210]
    },
    {
      id: 'United States',
      name: 'United States',
      values: [31620]
    },
    {
      id: 'Germany',
      name: 'Germany',
      values: [18930]
    },
    {
      id: 'India',
      name: 'India',
      values: [12480]
    },
    {
      id: 'Netherlands',
      name: 'Netherlands',
      values: [9370]
    },
    {
      id: 'Singapore',
      name: 'Singapore',
      values: [6120]
    }
  ]
</script>

<template>
  <DonutChart
    :series="series"
    total-label="Blocked threats"
    aria-label="Top WAF threat requests by country"
  />
</template>
```

### Types

```vue
<script setup>
  import DonutChart from '@aziontech/webkit/donut-chart'

  const series = [
    {
      id: 'Brazil',
      name: 'Brazil',
      values: [48210]
    },
    {
      id: 'United States',
      name: 'United States',
      values: [31620]
    },
    {
      id: 'Germany',
      name: 'Germany',
      values: [18930]
    },
    {
      id: 'India',
      name: 'India',
      values: [12480]
    },
    {
      id: 'Netherlands',
      name: 'Netherlands',
      values: [9370]
    },
    {
      id: 'Singapore',
      name: 'Singapore',
      values: [6120]
    }
  ]
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-xl)">
    <DonutChart
      :series="series"
      kind="donut"
      total-label="Blocked threats"
      aria-label="Donut"
    />
    <DonutChart
      :series="series"
      kind="pie"
      aria-label="Pie"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import DonutChart from '@aziontech/webkit/donut-chart'

  const series = [
    {
      id: 'Brazil',
      name: 'Brazil',
      values: [48210]
    },
    {
      id: 'United States',
      name: 'United States',
      values: [31620]
    },
    {
      id: 'Germany',
      name: 'Germany',
      values: [18930]
    },
    {
      id: 'India',
      name: 'India',
      values: [12480]
    },
    {
      id: 'Netherlands',
      name: 'Netherlands',
      values: [9370]
    },
    {
      id: 'Singapore',
      name: 'Singapore',
      values: [6120]
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <DonutChart
      :series="series"
      size="small"
      aria-label="Small"
    />
    <DonutChart
      :series="series"
      size="medium"
      aria-label="Medium"
    />
    <DonutChart
      :series="series"
      size="large"
      aria-label="Large"
    />
  </div>
</template>
```
