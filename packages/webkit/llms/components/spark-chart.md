# Spark Chart

> A word-sized chart: one series drawn as an area, a line or bars, with no axes, grid, legend or tooltip, filling the width of its container at a fixed height. It shows the shape of a recent history next to a number — in a stat tile, a table row or a ticker card — where a full `chart` would be too much.

- Import: `import SparkChart from '@aziontech/webkit/spark-chart'`
- Category: chart · Surface: product · Structure: monolithic
- API as JSON: [spark-chart.json](https://github.com/aziontech/webkit/blob/main/.specs/spark-chart.json)

## When to use

- The shape of a metric's recent history beside its current value: requests in the last hour, latency over the day.
- Rows of comparable items, each with its own trend: one SparkChart per row of a list or table.
- The trend inside a `stat-tile`, which draws its `trend` through this component.

## Do

- Pair it with the number it describes; a spark alone has no scale and says nothing exact.
- Use the same buckets as the chart behind it, about twelve to thirty points.
- Leave `fromZero` off for prices and latencies, where the shape matters more than the magnitude; turn it on for counts that are meaningful from zero.
- Give it an `ariaLabel` only when it stands without a nearby number; otherwise keep it decorative.

## Don’t

- The reader needs exact values, a time axis or several series → use `chart`.
- A ranking across categories → use `bar-list`.
- Up/down status over discrete periods → use `tracker`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [stat-tile](stat-tile.md) — the KPI tile that renders its sparkline with SparkChart.
- [chart](chart.md) — the full history with axes, tooltip and legend.
- [tracker](tracker.md) — a strip of status blocks rather than a measured shape.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `values` | `(number \| null)[]` | `[]` | false | The series, oldest first; null leaves a gap. |
| `kind` | `'area' \| 'line' \| 'bar'` | `'area'` | false | Mark drawn for the series. |
| `color` | `ChartColor` | `1` | false | Hue of the mark: a categorical slot (1–6), `other`, or a status. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Height: 32, 48 or 64 pixels. Width follows the container. |
| `fromZero` | `boolean` | `false` | false | Starts the value range at zero instead of the lowest value; bars always start at zero. |
| `ariaLabel` | `string` | `''` | false | Accessible name; when set the chart is an image, when empty it is decorative. |

## States

- Visual states: `default`, `empty` (no finite value — renders nothing at its reserved height)
- `data-kind`: `area` | `line` | `bar`
- `data-size`: `small` | `medium` | `large`
- Lines and area edges are linear segments with round joins and caps; 2px stroke; the area fill fades from the hue to transparent. Bars have a 1px rounded data end and a 1px gap between them.

## Accessibility

- With `ariaLabel` the SVG is `role="img"` named by it; without, it is `aria-hidden` and the number beside it carries the information.
- Not focusable; no keyboard map.
- The mark clears 3:1 against the chart surfaces in both themes (the `--chart-*` role guarantees it).

## Examples

### Default

```vue
<script setup>
  import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]" />
  </div>
</template>
```

### Types

```vue
<script setup>
  import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-lg)">
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        kind="area"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        kind="line"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        kind="bar"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import SparkChart from '@aziontech/webkit/spark-chart'
</script>

<template>
  <div class="flex flex-wrap items-end gap-(--spacing-lg)">
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        size="small"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        size="medium"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
    <div class="w-full max-w-(--container-3xs)">
      <SparkChart
        size="large"
        :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
      />
    </div>
  </div>
</template>
```
