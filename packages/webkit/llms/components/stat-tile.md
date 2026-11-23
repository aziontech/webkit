# Stat Tile

> Use StatTile to show one headline metric (figure, delta, sparkline) in product UI; the strip of related metrics is a StatTileGroup, one value against a range with thresholds is a GaugeChart, and a money amount on its own is a CurrencyAmount. A KPI tile: a label, one big figure that counts up into place with an optional muted unit, an optional delta `Tag` against a named period, and an optional sparkline that bleeds to the tile's edges along its bottom. The delta reads good or bad for the metric, not merely up or down: `inverse` flips the polarity for metrics where a rise is bad (threats, errors, latency). A row of tiles sits above a dashboard's charts; without a `trend` the tile is the figure alone, the shape a usage strip uses. Inside a `StatTileGroup` the tiles become the cells of one card, split by dividers, with the delta aligned to the cell's end. `variant` picks the figure face: `mono` (the big-number mono figure of a usage strip) or `sans` (the large heading figure of a traffic summary).

- Import: `import StatTile from '@aziontech/webkit/stat-tile'`
- Category: chart · Surface: app · Structure: monolithic
- API as JSON: [stat-tile.json](stat-tile.json)

## When to use

- The headline numbers of a dashboard: total requests, blocked threats, cache hit ratio, error rate.
- A single value whose change matters more than its history; the sparkline adds the shape of that history.

## Do

- Name the comparison period in `deltaLabel` ("vs previous 24 hours"); a bare percentage is ambiguous.
- Set `inverse` on every metric where a rise is bad, so a growing threat count reads as a regression.
- Keep the label in sentence case with no trailing colon.
- Put the unit in `unit` ("GB", "ms", "%"), not inside `formatValue`, so it reads muted beside the figure.
- Leave `trend` out for a strip of figures with no history; the tile then has no chart band.
- Give the sparkline the same buckets as the chart below it, about twelve points.
- For a KPI strip that reads as one band (an overview's usage row), put the tiles in a `StatTileGroup`; do not hand-build the card, the grid or the dividers. Separate tiles are for figures that stand alone.
- Use `variant="mono"` (default) for usage figures with a delta, `variant="sans"` for a summary row of plain figures (requests, data transferred, error rate) above its charts. Keep one variant per row.
- Pass the delta as the raw percentage (`12.4`); the tile prints at most two decimals and drops trailing zeros (`+12.4%`, `+3%`).

## Don’t

- The history itself is the point → use `chart`.
- A share of a whole → use `donut-chart`.
- Marketing figures on a site band → use `stats`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chart](chart.md) — the full history behind a tile.
- [chart-card](chart-card.md) — the box for a chart; a tile is its own small surface and does not sit in one.
- [stats](stats.md) — the marketing figure band, with no delta and no live data.
- [spark-chart](spark-chart.md) — the sparkline the tile draws its `trend` with; use it alone for a trend beside a number in a list or table.
- [tag](tag.md) — the delta renders as a `Tag`; the empty band's "No data" is a `Tag` too.
- [separator](separator.md) — carries the "No data" `Tag` across the empty band.
- [stat-tile-group](stat-tile-group.md) — one card split into cells, one per tile: the KPI strip of an overview.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Metric name, in sentence case. Fallback for the default slot. |
| `value` | `number \| null` | `null` | false | The current value. It counts up from the previous value on change; null renders a dash. |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats the figure. |
| `variant` | `StatTileVariant` | `'mono'` | false | Figure face: `mono` is the big-number mono figure, `sans` the large heading figure. |
| `unit` | `string` | `''` | false | Unit read after the figure, smaller and in a muted sans tone. Empty hides it. |
| `delta` | `number \| null` | `null` | false | Signed change against the named period, in percent, printed with at most two decimals and no trailing zeros. Null hides the delta. |
| `deltaLabel` | `string` | `''` | false | The comparison period, read after the delta. |
| `inverse` | `boolean` | `false` | false | A rise is bad for this metric; flips the delta between success and danger. |
| `trend` | `(number \| null)[]` | `[]` | false | Sparkline values, oldest first; `null` leaves a gap, as in `spark-chart`. Empty hides the sparkline. |
| `loading` | `boolean` | `false` | false | Renders Skeleton lines in place of the figure, delta and sparkline. |
| `error` | `string` | `''` | false | Why the value failed to load. When set, the tile shows a dash and a danger band that says it could not load, never No data. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Replaces the label text. |
| `aside` | — | Trailing content beside the label, such as an info icon or a menu. |

## States

- Visual states: `default`, `loading` (Skeleton), `error` (a dash over the same band with a `danger` "Couldn't load" `Tag` in place of "No data"; the delta and the sparkline hide, `data-error` is set and the figure's accessible text reads "Couldn't load." followed by the `error` message; `loading` wins over `error`), `empty value` (a dash when `value` is null, over a no-data band: a `Separator` carrying a "No data" `Tag`, the height of the sparkline so the tile keeps its row's shape; no placeholder curve is drawn, since a curve reads as data)
- The delta `Tag` severity follows the trend: `success` when good, `danger` when bad, `neutral` when flat
- `data-loading` mirrors `loading`; `data-variant` mirrors `variant` (`mono` | `sans`)
- `data-grouped` is set when the tile sits in a `StatTileGroup` (injected, no prop): the tile drops its own border, radius and surface, draws its end and bottom edges as the cell dividers, and aligns the delta to the end of the figure row
- `data-carded` is set when the tile sits in a `ChartCard` and not in a group (injected, no prop): the card owns the only frame, so the tile drops its own border, radius and surface; put it in an unpadded `ChartCard.Content` (`:padded="false"`), since the tile keeps its own padding
- `data-trend` on the delta: `good` | `bad` | `flat` — `flat` when the change rounds to zero
- Responsive: the root is the `@container/stat-tile`; below `@3xs` of the tile the padding tightens to `--spacing-sm`.
- Server render and hydration: the first render shows the final figure on the server and in the browser, so the two match and the HTML carries the value. The count-up from 0 starts on mount (skipped under `prefers-reduced-motion`); later changes count up from the previous value.

- Its root carries `data-plain-ground`: it is content that must sit on a plain ground, so a `Texture` beside it hides itself, and the texture-backdrop check blocks placing it on a textured band (a texture is a backdrop for text only, RV-T2-1).

## Accessibility

- The tile is a `role="group"` named by its label (`aria-labelledby`), not a region landmark, so a strip of KPI tiles adds no landmarks.
- The animated figure and its unit are `aria-hidden`; a visually hidden copy holds the final formatted value with its unit, so assistive tech never reads a ticking number.
- The delta pairs an arrow icon and a signed value with its period, and a visually hidden word (better / worse), so its meaning never rests on color.
- The sparkline is a decorative `spark-chart` (`aria-hidden`); the figure and delta carry the information.
- Proportional figures on the big number; `tabular-nums` on the delta.
- Text contrast at least 4.5:1 in both themes.

## Examples

### Default

```vue
<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <StatTile
    label="Blocked threats"
    :value="48210"
    :delta="12.4"
    delta-label="vs previous 24 hours"
    inverse
    :trend="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
  />
</template>
```

### Deltas

```vue
<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2 lg:grid-cols-4">
    <StatTile
      label="Data transferred"
      :value="842"
      unit="GB"
      :delta="8.2"
      delta-label="vs previous 24 hours"
    />
    <StatTile
      label="Blocked threats"
      :value="48210"
      :delta="12.4"
      delta-label="vs previous 24 hours"
      inverse
    />
    <StatTile
      label="Cache hit ratio"
      :value="96.2"
      unit="%"
      :delta="0"
      delta-label="vs previous 24 hours"
    />
    <StatTile
      label="Data centers"
      :value="120"
    />
  </div>
</template>
```

### Variants

```vue
<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <StatTile
      label="Data transferred"
      :value="842"
      unit="GB"
      :delta="12.4"
    />
    <StatTile
      variant="sans"
      label="Requests"
      :value="48.2"
      unit="M"
    />
  </div>
</template>
```
