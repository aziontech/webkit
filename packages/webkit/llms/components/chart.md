# Chart

> A cartesian chart — lines, areas, stacked areas, bars, mixed bars and lines, and scatter dots over one category axis — composed from parts the consumer places by hand. The root owns the data model (series + labels), the scales, the hover/keyboard state and the loading / empty / error surface; each part (`Chart.Grid`, `Chart.Axis`, `Chart.Brush`, `Chart.Line`, `Chart.Area`, `Chart.Bar`, `Chart.Scatter`, `Chart.Crosshair`, `Chart.Tooltip`, `Chart.Legend`) reads that state through context, so the consumer wires nothing. Rendering is in-house SVG and every color comes from the `--chart-*` role, so a chart re-themes with no per-theme code and adds no charting dependency.

- Import: `import ChartRoot from '@aziontech/webkit/chart-root'`
- Compound import (dot notation, not tree-shakeable): `import Chart from '@aziontech/webkit/chart'`
- Category: chart · Surface: product · Structure: composition
- API as JSON: [chart.json](https://github.com/aziontech/webkit/blob/main/.specs/chart.json)

## When to use

- A measure over time — requests, threats, bandwidth per bucket — as one or more lines or areas.
- Comparing magnitudes across ordered categories — top countries, attack families — as vertical or horizontal bars.
- Parts of a total over time — allowed / blocked / logged — as stacked areas or stacked bars.
- Any chart that must read the same as Azion Console Real-Time Metrics: crosshair, one tooltip listing every series, legend toggles, totals.
- Two measures of one unit where one is the total and one a part — requests as bars, cached requests as a line (mixed).
- How one measure spreads against another — response time by object size — as scatter dots on a `linear` label scale.
- A volume histogram that filters a log or a table to a time span: add `Chart.Brush` and read `v-model:range`.

## Do

- Pass series in a stable order: the slot follows the series position, so color follows the entity. A filter that hides a series keeps the others' colors.
- Keep one value axis. Index two measures to a common base or split them into two charts.
- Let the legend carry identity for two or more series; a single series needs no legend, its title names it.
- Mark a series whose color means a state (blocked, error rate) with `color: 'danger'` and never reuse a status color as series 4.
- Color a series that counts one severity level with `color: 'severity-critical'` (`-high`, `-medium`, `-low`, `-info`) so stacked bars and legends match the `SeverityTag` in the table below the chart.
- Keep filters and the time range in one row above the dashboard, never inside a chart.
- While data reloads, set `refetching` so the previous render holds at reduced opacity instead of flashing a skeleton.
- Place `Chart.Brush` before the marks so the selection band sits under them. The page owns what a range means: bind `range` to `null` and filter on `update:range` when the data changes with the selection.
- Use `labelScale="linear"` only with numeric or Date labels; keep `category` for buckets that are evenly spaced.

## Don’t

- A single headline number with a delta → use `stat-tile`.
- Share of a small whole (six slices or fewer) with the total in the center → use `donut-chart`.
- More than about seven classes that all carry meaning → use `table`; color stops separating past the six series slots.
- Two measures on different scales → two charts side by side; this component never draws a second value axis.
- One reading against its range (CPU, cache hit ratio) → use `gauge-chart`.
- Values by country or location → use `map-chart`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- chart-card` — the box a dashboard chart sits in: title, description, controls, drag and resize.
- [donut-chart](donut-chart.md) — part-to-whole at a glance, sharing this chart's palette, legend and states.
- [stat-tile](stat-tile.md) — one figure with a delta and a sparkline, for a KPI row above the charts.
- [table](table.md) — the exact numbers; a chart's own table view is the accessible twin, a `table` is the primary surface.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `series` | `ChartSeries[]` | `[]` | false | Series to plot. The first six take the fixed categorical slots in order; the rest fold into Other. |
| `labels` | `ChartLabel[]` | `[]` | false | One category label per index: a string, a number, or a Date. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | false | Value axis direction. Horizontal lays categories down the side, for ordered bars. |
| `labelScale` | `'category' \| 'linear'` | `'category'` | false | How categories sit along their axis. `linear` places numeric or Date labels by value, for scatter plots and uneven time buckets. |
| `min` | `number` | `0` | false | Floor of the value axis. Marks grow from one baseline. |
| `max` | `number` | `undefined` | false | Ceiling of the value axis. When absent, the nice ceiling of the visible data. |
| `cap` | `number` | `6` | false | Series kept before the rest fold into Other. |
| `otherLabel` | `string` | `''` | false | Name of the folded series. Empty uses the locale catalog (`Other`). |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats ticks, tooltip values and legend totals. |
| `formatLabel` | `(label: ChartLabel) => string` | `formatLabel` | false | Formats category labels on the axis and in the tooltip. |
| `timeZone` | `string` | `''` | false | IANA time zone the default label format prints Date labels in. Empty prints UTC on the server and in the first client render, then the runtime's zone. |
| `height` | `number` | `240` | false | Minimum plot height in pixels; the plot grows to fill a taller container. |
| `loading` | `boolean` | `false` | false | Renders a Skeleton sized to the plot and suppresses interaction. |
| `refetching` | `boolean` | `false` | false | Holds the previous render at reduced opacity while new data loads. |
| `error` | `string` | `''` | false | Error message; when set, the plot renders a danger Alert instead of marks. |
| `emptyTitle` | `string` | `''` | false | Title of the empty state shown when no series has a value. Empty uses the locale catalog (`No data available`). |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title: why the range is empty, or what to do next. |
| `tableView` | `boolean` | `false` | false | Shows the data table in place of the marks. The table is always present for assistive tech. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the chart when it is not inside a ChartCard with a title. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `point-click` | `(event: MouseEvent \| KeyboardEvent, point: ChartPoint)` | Click on the plot, or Enter / Space on the focused chart, at the active index. `point` carries the index, the label and every visible series value. |
| `legend-toggle` | `(event: MouseEvent, series: ChartSeries)` | A legend entry toggled; `series` is the consumer's own series object. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The parts: Grid, Axis, Brush, Line, Area, Bar, Scatter, Crosshair, Tooltip, Legend, in paint order. |
| `empty` | — | Replaces the default EmptyState. |
| `empty-actions` | — | Actions under the default EmptyState, such as a Clear filters button or a setup link. Ignored when `empty` replaces it. |
| `error` | — | Replaces the default danger Alert. |

## Sub-component imports

- `@aziontech/webkit/chart-area`
- `@aziontech/webkit/chart-axis`
- `@aziontech/webkit/chart-bar`
- `@aziontech/webkit/chart-brush`
- `@aziontech/webkit/chart-crosshair`
- `@aziontech/webkit/chart-grid`
- `@aziontech/webkit/chart-legend`
- `@aziontech/webkit/chart-line`
- `@aziontech/webkit/chart-scatter`
- `@aziontech/webkit/chart-tooltip`
- `@aziontech/webkit/chart-card`

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
  - Props: `ids?: string[]` (default `[]` — every visible series), `curve?: 'linear' | 'monotone'` (default `'linear'`), `markers?: boolean` (default `false` — a marker on every point, not only the active one).
  - Events: _none_.
  - Slots: _none_.
- `chart-area/chart-area.vue` — a 10% wash plus a 2px edge per selected series; stacked when asked.
  - Props: `ids?: string[]` (default `[]`), `stacked?: boolean` (default `false`), `curve?: 'linear' | 'monotone'` (default `'linear'`).
  - Events: _none_.
  - Slots: _none_.
- `chart-bar/chart-bar.vue` — bars at most 24px thick, a rounded data end and a square baseline, a 2px surface gap between touching bars; grouped or stacked; horizontal when the root is horizontal.
  - Props: `ids?: string[]` (default `[]`), `stacked?: boolean` (default `false`), `labeled?: boolean` (default `false` — the formatted value at each bar end, for ordered bars).
  - Events: _none_.
  - Slots: _none_.
- `chart-scatter/chart-scatter.vue` — one dot per value (r 4, a 1.5px `var(--bg-surface)` ring), r 6 at the active index; no connecting line. With `labelScale="linear"` the dots sit at their label value, so it reads as a scatter plot.
  - Props: `ids?: string[]` (default `[]`).
  - Events: _none_.
  - Slots: _none_.
- `chart-brush/chart-brush.vue` — turns on range selection and paints the selected span as a band in `var(--bg-selected)` edged with `var(--border-selected)`. Drag across the plot, or Shift + arrows then Enter; the root reports the span through `v-model:range`.
  - Props: _none_.
  - Events: _none_ (the span flows through the root's `v-model:range`).
  - Slots: _none_.
- `chart-crosshair/chart-crosshair.vue` — the hairline at the active index in `var(--chart-crosshair)`.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.
- `chart-tooltip/chart-tooltip.vue` — the readout for the active index, inside the figure (never teleported): a header with the label, divided edge to edge from the rows, then every visible series with a 2px line key, its name, and its value at the end of the row in tabular figures. Raised surface `var(--chart-tooltip-bg)` with a `var(--chart-tooltip-border)` edge; flips to the other side past the middle of the plot.
  - Props: _none_.
  - Events: _none_.
  - Slots: _none_.
- `chart-legend/chart-legend.vue` — one toggle button per series (`aria-pressed`), a square key in the series color (the same key for every mark kind), the name, and the series total. Hover and focus emphasize the series; the other keys dim with their marks. Renders nothing for a single series.
  - Props: `totals?: boolean` (default `false` — show each series total beside its name).
  - Events: _none_ (toggles flow through the root's `legend-toggle` and `v-model:hiddenSeries`).
  - Slots: _none_.

## v-model

| Model                  | Type                       | Default | Emits                 | Notes                                                                                             |
| ---------------------- | -------------------------- | ------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| `v-model:activeIndex`  | `number \| null`           | `null`  | `update:activeIndex`  | The category index under the pointer or keyboard focus. Bind it to sync crosshairs across charts. |
| `v-model:hiddenSeries` | `string[]`                 | `[]`    | `update:hiddenSeries` | Ids of series the legend has hidden. A hidden series keeps its color slot.                        |
| `v-model:range`        | `[number, number] \| null` | `null`  | `update:range`        | The selected span of category indexes, first to last, when a `Chart.Brush` is placed.             |

## States

- Visual states: `default`, `loading` (Skeleton), `error` (Alert), `empty` (EmptyState with a chart icon, the title, the optional description and actions, filling the plot height), `refetching` (marks at reduced opacity), `table-view`, `active` (an index is hovered or focused)
- `data-loading`, `data-error`, `data-empty`, `data-refetching`, `data-table-view`, `data-active` on the root mirror the state; priority loading, then error, then empty, then marks
- `data-orientation`: `vertical` | `horizontal`
- `data-label-scale`: `category` | `linear`
- `data-brushing` on the root and the brush layer while a span is being dragged or extended from the keyboard
- `data-entered` on each mark flips after two animation frames to run its entrance transition
- `data-dimmed` on a series when another series is emphasized from the legend
- Reflow: the visually hidden table twin sits inside an `sr-only` box so its intrinsic width never adds horizontal overflow at 320 px.
- Server render and hydration: the default label format prints Date labels in `timeZone`. With no `timeZone` it prints UTC on the server and in the first client render, so the axis, tooltip title and summary match, and switches to the runtime's zone on mount. Midnight detection (day labels against clock labels) uses the same zone.

## Accessibility

- Root is a `<figure>` named by `ariaLabel` or by the enclosing ChartCard title (`aria-labelledby`) and described by its ChartCard description or a generated summary.
- The plot cell is one tab stop: `role="group"` with `aria-roledescription="chart"`. Keyboard map: Left / Right (Up / Down when horizontal) move the active index, Home / End jump to the ends, Up / Down (Left / Right when horizontal) move the focus from series to series so the live region reads only that series and the others dim, Enter / Space fire `point-click`, Escape clears the draft span, then the focused series, then the active index, then the range. With a `Chart.Brush`: Shift with the index keys extends a span from the active index, Enter commits it (or the active index alone) to `v-model:range`. The tooltip follows keyboard focus exactly as it follows the pointer.
- A polite live region announces the span while it is drawn (`Selecting from … to …`) and once committed (`Selected from … to …`).
- A polite live region announces the label and every visible series value at the active index.
- A data table twin (labels by series) is always rendered, visually hidden unless `tableView`; every value is reachable without hover. Above 1,000 categories the hidden twin keeps an even sample of at most 1,000 rows (the first and last category included) so a 10k-point chart mounts within its runtime budget; every value stays reachable with the arrow keys and the live region, and `tableView` shows every row.
- Every SVG part is `aria-hidden`; identity never rests on color alone — the legend names each series and the tooltip pairs each value with its name.
- Legend entries are buttons with `aria-pressed`, at least 24px tall.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the plot and every legend button.
- Series colors clear 3:1 on the chart surfaces and on the tooltip in both themes (pinned by `packages/theme/test/chart-role.test.mjs`).
- `motion-reduce:transition-none` on every transition.

## Right-to-left

- Layout: the category axis runs from the right (index 0 at the inline start), the value axis and its labels sit at the right edge, horizontal bars grow from the right and round their left end. SVG coordinates are physical, so the parts mirror by computing positions, and the SVG text layers set `direction="ltr"` so `text-anchor` stays physical; the tooltip is placed with a physical `left` for the same reason. The legend wraps with logical flow.
- Icons: none.
- Keyboard: ArrowLeft moves to the next index under rtl and ArrowRight to the previous (`logicalArrowKey`); series focus keeps Up / Down.
- User data: series names and labels render as given; no `bdi`.

## Internationalization

| Key                     | English source                                 | Override prop         |
| ----------------------- | ---------------------------------------------- | --------------------- |
| `chart.emptyTitle`      | `No data available`                            | `emptyTitle`          |
| `chart.noData`          | `no data`                                      | —                     |
| `chart.label`           | `Label`                                        | —                     |
| `chart.roleDescription` | `chart`                                        | —                     |
| `chart.summary`         | `{series} series over {points} points{range}.` | `ariaLabel` (caption) |
| `chart.summaryRange`    | `, from {from} to {to}`                        | —                     |
| `chart.otherSeries`     | `Other`                                        | `otherLabel`          |
| `chart.rangeDraft`      | `Selecting from {from} to {to}`                | —                     |
| `chart.rangeSelected`   | `Selected from {from} to {to}`                 | —                     |

- Formatting: `Intl.NumberFormat` (compact values) and `Intl.DateTimeFormat` (Date labels, in `timeZone`) with the locale from `WebkitProvider`.

## Responsive

- Container queries: none; the plot measures its own box and fills its container (`height` is a minimum).
- Narrow (≤ 640 px or a narrow container): category labels thin to the width they have; the legend wraps.
- Touch: legend buttons ≥ 24 px; with a brush the plot sets `touch-action: pan-y`, so a horizontal drag selects and a vertical drag scrolls the page. Hover-only readings are reachable from the keyboard and in the table twin.
- Reflow: no horizontal scroll at 320 px; the hidden twin sits in an `sr-only` box.

## Examples

### Default

```vue
<script setup>
  import Chart from '@aziontech/webkit/chart'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = [
    {
      id: 'allowed',
      name: 'WAF requests allowed',
      color: 'success',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      color: 'danger',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    },
    {
      id: 'threat',
      name: 'WAF requests threat',
      color: 'warning',
      values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
    }
  ]
</script>

<template>
  <Chart
    :series="series"
    :labels="labels"
    aria-label="Threats vs requests"
  >
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Area :ids="['allowed']" />
    <Chart.Line :ids="['blocked', 'threat']" />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend totals />
  </Chart>
</template>
```

### Forms

```vue
<script setup>
  import Chart from '@aziontech/webkit/chart'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = [
    {
      id: 'allowed',
      name: 'WAF requests allowed',
      color: 'success',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      color: 'danger',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    },
    {
      id: 'threat',
      name: 'WAF requests threat',
      color: 'warning',
      values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-3">
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Threats as lines"
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis
        kind="x"
        :ticks="4"
      />
      <Chart.Line />
      <Chart.Crosshair />
      <Chart.Tooltip />
    </Chart>
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Threats as areas"
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis
        kind="x"
        :ticks="4"
      />
      <Chart.Area />
      <Chart.Crosshair />
      <Chart.Tooltip />
    </Chart>
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Threats as bars"
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis
        kind="x"
        :ticks="4"
      />
      <Chart.Bar />
      <Chart.Tooltip />
    </Chart>
  </div>
</template>
```

### Stacked

```vue
<script setup>
  import Chart from '@aziontech/webkit/chart'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = [
    {
      id: 'allowed',
      name: 'WAF requests allowed',
      color: 'success',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      color: 'danger',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    },
    {
      id: 'threat',
      name: 'WAF requests threat',
      color: 'warning',
      values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Requests stacked as areas"
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Area stacked />
      <Chart.Crosshair />
      <Chart.Tooltip />
      <Chart.Legend />
    </Chart>
    <Chart
      :series="series"
      :labels="labels"
      aria-label="Requests stacked as bars"
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Bar stacked />
      <Chart.Tooltip />
      <Chart.Legend />
    </Chart>
  </div>
</template>
```
