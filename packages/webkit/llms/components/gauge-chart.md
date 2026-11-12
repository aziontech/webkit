# Gauge Chart

> One reading against a known range, drawn as a half-circle dial with the value under the arc and the scale ends beside it. Bands (thresholds) name what the value means and color the arc. It shares the chart palette, the loading, empty and error surface and the `ChartCard` naming with the rest of the chart family, and is rendered in-house SVG.

- Import: `import GaugeChart from '@aziontech/webkit/gauge-chart'`
- Category: chart · Surface: product · Structure: monolithic
- API as JSON: [gauge-chart.json](https://github.com/aziontech/webkit/blob/main/.specs/gauge-chart.json)

## When to use

- A utilization or ratio with a fixed range: CPU, memory, cache hit ratio, quota used.
- A latency or score against a target, where bands (healthy, busy, critical) carry the meaning.
- A headline reading on a detail page or in a dashboard card, beside the time series that explains it.

## Do

- Give the range that means something for the reading (0 to 100 for a ratio, 0 to the quota for usage); the dial is meaningless without it.
- Name every band (`label`) so the value is read with its meaning, not only with a color.
- Use status colors for bands (`success`, `warning`, `danger`) and severity colors only when the reading is a severity.
- Put the unit in `formatValue` (`74%`, `92 ms`) and what is measured in `label`.

## Don’t

- A number with a change against a period and a trend → use `stat-tile`.
- A value over time → use `chart` (line or area).
- Progress of a task toward done → use `progress-bar`.
- Several readings to compare with each other → use `bar-list` or `chart` with horizontal bars; dials side by side compare badly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [stat-tile](stat-tile.md) — one figure with a delta and a sparkline, for a KPI row.
- [chart-card](chart-card.md) — the box a dashboard gauge sits in; the gauge takes its accessible name from the card title.
- progress-bar` — completion of a task, not a reading.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number \| null` | `null` | false | The reading. Null or absent renders the empty state. |
| `min` | `number` | `0` | false | Start of the scale. |
| `max` | `number` | `100` | false | End of the scale. |
| `label` | `string` | `''` | false | Caption under the reading: what is measured, or the unit. |
| `thresholds` | `GaugeChartThreshold[]` | `[]` | false | Bands from low to high; the arc takes the color of the band the value falls in, and each band start is marked on the track. |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats the reading and the scale ends. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Width of the dial: 160, 224 or 288 pixels. |
| `loading` | `boolean` | `false` | false | Renders a Skeleton sized to the dial. |
| `refetching` | `boolean` | `false` | false | Holds the previous reading at reduced opacity while new data loads. |
| `error` | `string` | `''` | false | Error message; when set, a danger Alert replaces the dial. |
| `emptyTitle` | `string` | `''` | false | Title of the empty state shown when there is no reading. Empty uses the locale catalog (`No data available`). |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title: why there is no reading, or what to do next. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the meter when it is not inside a ChartCard with a title. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `value` | { value: number; text: string; status: string } | Replaces the reading and caption under the arc. |
| `empty` | — | Replaces the default EmptyState. |
| `empty-actions` | — | Actions under the default EmptyState. |
| `error` | — | Replaces the default danger Alert. |

## States

- Visual states: `default`, `loading` (Skeleton at the dial ratio), `error` (Alert), `empty` (EmptyState), `refetching` (reduced opacity)
- `data-loading`, `data-error`, `data-empty`, `data-refetching` on the root; priority loading, then error, then empty, then the dial
- `data-size`: `small` | `medium` | `large`
- `data-status` on the meter: the color of the band the value falls in
- `data-entered` on the arc flips after two animation frames to run its entrance

## Accessibility

- The dial is `role="meter"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext` (the formatted value, then the band name: `93%, Critical`).
- Named by `ariaLabel`, else by `label`, else by the enclosing ChartCard title (`aria-labelledby`); described by the range (`Range 0 to 100`).
- The SVG is `aria-hidden`; the meaning never rests on color alone — the band name is read and shown with the value.
- The meter is not focusable: it has no interaction (the value is reachable as text).
- Arc colors clear 3:1 on the surface in both themes (status and series tokens, pinned by the theme chart role test).
- `motion-reduce:transition-none` on every transition.

## Right-to-left

- Layout: the dial is mirrored (`scale(-1 1)` on the arc group), so it fills from the inline start; the scale ends swap sides through flex order. Logical utilities only.
- Icons: none.
- Keyboard: none (not interactive).
- User data: none.

## Internationalization

| Key                          | English source         | Override prop        |
| ---------------------------- | ---------------------- | -------------------- |
| `gaugeChart.emptyTitle`      | `No data available`    | `emptyTitle`         |
| `gaugeChart.valueWithStatus` | `{value}, {status}`    | `thresholds[].label` |
| `gaugeChart.range`           | `Range {min} to {max}` | —                    |

- Formatting: `Intl.NumberFormat` compact values with the locale from `WebkitProvider`, unless `formatValue` is passed.

## Responsive

- Container queries: none: the dial takes the container width up to its size (160, 224 or 288 px) and keeps a 15:8 ratio.
- Narrow (≤ 640 px or a narrow container): the dial shrinks with its container; the caption clamps to two lines.
- Touch: no targets.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

  const thresholds = [
    { value: 0, color: 'success', label: 'Healthy' },
    { value: 70, color: 'warning', label: 'Busy' },
    { value: 90, color: 'danger', label: 'Critical' }
  ]
  const formatValue = (value) => `${value}%`
</script>

<template>
  <GaugeChart
    :value="74"
    label="Cache hit ratio"
    :thresholds="thresholds"
    :format-value="formatValue"
  />
</template>
```

### Sizes

```vue
<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

  const formatValue = (value) => `${value} ms`
</script>

<template>
  <div class="flex flex-wrap items-end gap-(--spacing-lg)">
    <GaugeChart
      :value="38"
      :max="200"
      size="small"
      label="Edge latency, p50"
      :format-value="formatValue"
    />
    <GaugeChart
      :value="92"
      :max="200"
      size="medium"
      label="Edge latency, p95"
      :format-value="formatValue"
    />
    <GaugeChart
      :value="164"
      :max="200"
      size="large"
      label="Edge latency, p99"
      :format-value="formatValue"
    />
  </div>
</template>
```

### States

```vue
<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3">
    <GaugeChart
      loading
      aria-label="Cache hit ratio"
    />
    <GaugeChart
      :value="null"
      label="Cache hit ratio"
      empty-description="No request reached this application in the last hour."
    />
    <GaugeChart
      label="Cache hit ratio"
      error="Could not load the cache hit ratio. Try again in a few seconds."
    />
  </div>
</template>
```
