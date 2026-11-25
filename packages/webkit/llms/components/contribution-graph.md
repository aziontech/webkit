# Contribution Graph

> Use ContributionGraph for a 52-week × 7-day calendar heatmap of daily activity intensity (platform contributions, deployments, builds, Copilot tasks) across a year. Each day renders as a cell shaded across five sequential intensity levels (0–4), with month and weekday axes, a hover and keyboard-focus readout, an intensity legend, and optional day selection so clicking a cell filters a sibling history list. Unlike `Tracker` (a 1D status strip of discrete severities for uptime) or `Chart` (a continuous time-series plot), `ContributionGraph` reveals weekly and seasonal cadence of daily counts at a glance.

- Import: `import ContributionGraph from '@aziontech/webkit/contribution-graph'`
- Category: chart · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [contribution-graph.json](contribution-graph.json)

## When to use

- User profile platform contributions across a year, paired with a year-over-year selector and a `Timeline` of contribution history.
- Daily deployment, build, or AI workflow cadence over a 12-month period where streaks and active days matter.
- Any calendar-aligned daily intensity heatmap with up to 366 days where selecting a day filters activity details.

## Do

- Supply ISO date strings (`YYYY-MM-DD`) in `items`; days without an entry render as level `0` (zero activity) so the calendar grid stays continuous.
- Pass `year` (e.g. `2026`) when showing a calendar year paired with a year-over-year selector; omit `year` to render the rolling 52 weeks ending at `endDate` (or the latest item date).
- Bind `v-model:selected-date` to filter a sibling `Timeline` or list to that day, and provide a visible clear control when a date is selected.
- Pick `variant="square"` (default) for dense developer activity grids, or `variant="dot"` for softer editorial/profile summaries.
- Always supply `ariaLabel` naming the subject and period (e.g. `"Platform contributions in 2026"`).

## Don’t

- Uptime or pass/fail severity history across discrete periods → use `tracker`.
- A continuous measured trend over time (requests/sec, latency, bandwidth) → use `chart` or `spark-chart`.
- Comparing totals across named categories → use `bar-list`.
- Picking a single date or date range in a form → use `date-picker` or `date-range-picker`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tracker](tracker.md) — 1D severity strip for service uptime; `contribution-graph` is a 2D calendar grid of quantitative intensity.
- [timeline](timeline.md) — chronological activity feed commonly paired below `contribution-graph` and filtered by its `v-model:selected-date`.
- [stat-tile-group](stat-tile-group.md) — summary KPI strip placed above `contribution-graph` (total contributions, streaks, deployments).
- [card](card.md) — the surface `contribution-graph` usually sits inside; the graph itself has no outer card chrome.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `ContributionGraphItem[]` | `[]` | false | Daily contribution entries (`{ date: string; count: number; level?: ContributionGraphLevel; label?: string }`). Missing days render at level 0. |
| `year` | `number` | `undefined` | false | Calendar year to display (Jan 1 – Dec 31). When omitted, displays 52 weeks ending at `endDate` or the latest item date. |
| `endDate` | `string` | `''` | false | ISO date (`YYYY-MM-DD`) ending a rolling 52-week window when `year` is omitted. |
| `variant` | `ContributionGraphVariant` | `'square'` | false | Cell shape: `'square'` (rounded square) or `'dot'` (circular dot). |
| `showLegend` | `boolean` | `true` | false | Renders the `Less … More` intensity legend in the footer. |
| `loading` | `boolean` | `false` | false | Renders a Skeleton placeholder in place of the calendar grid. |
| `error` | `string` | `''` | false | Error message; when set, renders an `EmptyState` with the message inside a `role="alert"` region in place of the grid. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the contribution grid. |
| `selectedDate` | `string \| null` | `null` | false | Two-way value (`v-model:selectedDate`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `(event: MouseEvent \| KeyboardEvent, item: ContributionGraphDay)` | Fires when a day cell is activated by pointer click or Enter/Space. |

## v-model

| Model                   | Type             | Default | Emits                 | Notes                                                                                               |
| ----------------------- | ---------------- | ------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| `v-model:selected-date` | `string \| null` | `null`  | `update:selectedDate` | ISO date (`YYYY-MM-DD`) of the selected day, or `null`. Clicking an already-selected day clears it. |

## States

- Visual states: `default`, `hover` / `focus-visible` (active cell readout), `selected` (`aria-selected="true"` / `data-selected`), `loading` (Skeleton placeholder), `empty` (a small bordered `EmptyState` when `items` is empty and no `year` is set; with a `year` the grid renders all at level 0), `error` (a small bordered `EmptyState` with the message inside a `role="alert"` region).
- `data-variant` mirrors `variant` (`square` | `dot`) on the root.
- `data-loading` mirrors `loading` on the root; `data-error` is set when `error` is non-empty and not loading.
- `data-level` (`0` | `1` | `2` | `3` | `4`) on each day cell; `data-selected` when the cell matches `selectedDate`.
- Root carries `data-plain-ground` so a `Texture` beside it hides itself.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)` on each focusable cell (roving `tabindex`).
- Keyboard map: `Tab` focuses the active/selected cell in the grid; `ArrowUp` / `ArrowDown` moves by 1 day; `ArrowRight` / `ArrowLeft` moves by 1 week (mirrored under `dir="rtl"` via `logicalArrowKey`); `Home` / `End` jumps to the first/last day; `Enter` / `Space` toggles selection of the focused day; `Escape` clears `selectedDate`.
- ARIA: `role="grid"` with `aria-label` on the calendar grid, one `role="row"` per weekday, and each day a focusable `button` with `role="gridcell"`, a full localized `aria-label` (`"14 contributions on Oct 12, 2026"`) and `aria-selected` for selection; the padding days before the first and after the last day of the period are inert `aria-hidden` spacers, never cells; polite `aria-live` region announces hover/focus/selection; `role="alert"` on error; `aria-busy="true"` while loading.
- Contrast: all intensity steps use `--chart-sequential-*` tokens and `forced-color-adjust-none` so cells remain distinguishable in light, dark, and forced-colors modes.
- `motion-reduce:transition-none` on cell transitions.

## Right-to-left

- Layout: logical utilities only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`); the grid flows along the inline axis so weeks progress right-to-left under `dir="rtl"`.
- Icons: the error (`az-triangle-alert`) and empty (`az-calendar`) icons are non-directional.
- Keyboard: `logicalArrowKey` swaps `ArrowLeft` and `ArrowRight` under `dir="rtl"` so inline-forward advances one week.
- User data: custom `item.label` text renders inside natural document flow.

## Internationalization

| Key                                 | English source                                                       | Override prop |
| ----------------------------------- | -------------------------------------------------------------------- | ------------- |
| `contributionGraph.roleDescription` | `contribution calendar`                                              | —             |
| `contributionGraph.noData`          | `No activity recorded`                                               | —             |
| `contributionGraph.errorTitle`      | `Contributions didn't load`                                          | —             |
| `contributionGraph.hint`            | `Hover or select a day to inspect activity`                          | —             |
| `contributionGraph.less`            | `Less`                                                               | —             |
| `contributionGraph.more`            | `More`                                                               | —             |
| `contributionGraph.dayLabel`        | `{count} contribution on {date}` / `{count} contributions on {date}` | `item.label`  |
| `contributionGraph.dayZero`         | `No contributions on {date}`                                         | `item.label`  |

- Formatting: `Intl.DateTimeFormat` (short month names, short weekday names, localized cell dates) and `Intl.NumberFormat` via `useLocale()` from `ConfigProvider`.

## Responsive

- Container queries: none on the cell grid itself; the calendar sits inside an `overflow-x-auto` scroll container so all 52 weeks stay readable and crisp on narrow viewports without squashing cells below 10 px.
- Narrow (≤ 640 px): horizontal scroll on the calendar region; footer readout and legend wrap cleanly.
- Touch: tapping any cell updates the readout and selects/toggles that date without requiring hover.
- Reflow: the outer component never forces page-level horizontal overflow; only the calendar strip scrolls when narrower than 52 weeks.

## Examples

### Default

```vue
<script setup lang="ts">
  import ContributionGraph, {
    type ContributionGraphItem
  } from '@aziontech/webkit/contribution-graph'
  import { ref } from 'vue'

  const selectedDate = ref<string | null>(null)

  const items: ContributionGraphItem[] = Array.from({ length: 365 }, (_, index) => {
    const dt = new Date(Date.UTC(2026, 0, 1 + index))
    const date = dt.toISOString().slice(0, 10)
    const count = (index * 7 + (index % 5)) % 13 === 0 ? 0 : (index * 3) % 14
    return { date, count }
  })
</script>

<template>
  <ContributionGraph
    v-model:selected-date="selectedDate"
    :items="items"
    :year="2026"
    aria-label="Platform contributions in 2026"
  />
</template>
```

### Variants

```vue
<script setup lang="ts">
  import ContributionGraph, {
    type ContributionGraphItem
  } from '@aziontech/webkit/contribution-graph'

  const items: ContributionGraphItem[] = Array.from({ length: 365 }, (_, index) => {
    const dt = new Date(Date.UTC(2026, 0, 1 + index))
    const date = dt.toISOString().slice(0, 10)
    const count = (index * 5) % 11 === 0 ? 0 : (index * 2) % 12
    return { date, count }
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <ContributionGraph
      :items="items"
      :year="2026"
      variant="square"
      aria-label="Square contribution graph"
    />
    <ContributionGraph
      :items="items"
      :year="2026"
      variant="dot"
      aria-label="Dot contribution graph"
    />
  </div>
</template>
```

### Loading

```vue
<script setup lang="ts">
  import ContributionGraph from '@aziontech/webkit/contribution-graph'
</script>

<template>
  <ContributionGraph
    loading
    aria-label="Loading platform contributions"
  />
</template>
```
