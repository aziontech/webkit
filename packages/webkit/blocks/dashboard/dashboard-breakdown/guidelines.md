# Composition dashboard

The page that answers "what is this total made of, and how did the mix move?". The block's example is
the organization's monthly spend: the total and its three largest categories first, then the mix over
12 months, the current month's split, and the resources that drive it, ranked. The same shape fits any
total that breaks down into exclusive parts (storage by type, requests by product, seats by team).

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-breakdown when a total breaks into categories over time.
- One total splits into a small number of exclusive categories (up to six, plus Other).
- The reader needs both the current split and how it changed over time.
- The reader has to find the individual items that drive the largest share.

## When not to use

- The parts are not exclusive or do not sum to the total: use a multi-series line in
  `dashboard/dashboard-analytics` instead of a stack or a donut.
- The reader tracks progress against targets: use `dashboard/dashboard-executive-summary`.
- Changing the plan that drives the spend: use `account/account-change-plan-drawer`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Cost breakdown` with one sentence on what it shows. Its actions hold the period and the export.

### B. Period — `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

`Last 12 months` or `Last 6 months`, labelled `Period`. It scopes the Spend by category trend and the sparklines; the tiles, Current split and Top contributors always read this month, and say so on screen (a `This month` heading over the tiles and `this month vs previous month` under each figure), never only in a hint, so the header select is not read as scoping them. The ghost trigger sizes to its label, so it sits next to Export CSV with no gap.

### C. Export — `Button` (optional)

`Export CSV` in the page heading downloads the whole breakdown (spend per category per month, `spend-by-category-last-12-months.csv`). Per-card exports live in each card's menu. Each export confirms with a success toast naming the file, or an error toast when it fails, and is disabled while loading and when the period failed or has no data.

### D. Total and top categories — `StatTile` (required)

Four tiles: `Total spend` first, then the three largest categories. Each shows the change against the
previous month and a 12-month sparkline. A rise in spend is bad, so every tile passes `inverse`.

### E. Metric definitions — `Hint` (required)

Each tile and card title carries a `Hint` (`Everything billed to the organization this month.`).

### F. Cards — `ChartCard` (required)

`Spend by category` and `Current split` share a row; `Top contributors` spans the full width.

### G. Area or Bar — `ToggleGroup` (optional)

Switches the stacked trend between Area and Bar. Labelled `Chart form for Spend by category`.

### H. More options — `DropdownMenu` (optional)

Per-card secondary actions such as `Export CSV`, behind the more-options button; it downloads that card's rows.

### I. More options trigger — `IconButton` (optional)

Opens the card's `DropdownMenu`. Icon-only, with an `aria-label` that names the card
(`More options for Spend by category`).

### J. Spend by category — `Chart` (required)

A stacked chart over 12 months, one series per category in the categorical role, with a crosshair, one
tooltip that lists every category for the hovered month, and a legend with range totals. A seventh
category folds into Other; never invent a hue.

### K. Current split — `DonutChart` (required)

This month's split with the total in its center (`This month`). Same category order and colors as the
stacked chart, so the two read as one.

### L. Top contributors — `DataTable` (required)

Rank, the resource behind its category glyph, the category, the amount, its share of the total and the
change against last month. Amounts and shares use tabular numbers and align right.

### M. Empty regions — `EmptyState` (required)

When the whole period is empty, the tiles print `$0` (nothing was billed, so zero is the truth) and
one bordered page-level `EmptyState` (`No spend in this period`, with `Show the last 12 months` when a
shorter period is picked) replaces the cards. When only some regions are empty, each chart and the
table keep their box with an empty state: `No spend in this range` /
`Nothing was billed to the organization in the selected period.`

### N. Category and change — `Tag` (required)

The category of each contributor, and its change against last month, are `Tag`s. A rise in spend reads
as bad in the change tag too.

### O. Share of total — `Progress` (required)

Each contributor's share as a `Progress` beside the percentage, with an `aria-label` naming the
resource (`web-app share of total`). The bar is a visual aid; the number is the value.

### P. Load failure — `Alert` (required)

When `error` is set, one danger `Alert` under the page heading says `Couldn't load <page>.` followed by the message, with Retry, which emits `retry`. Every region keeps its header and shows a quiet `Not available.` line in place of its content, and each tile shows a dash over a neutral `Couldn't load` band, so one failed request reads as one problem instead of a wall of red banners.

## Data

The block takes its figures and records through props and emits every action; it fetches nothing. `BreakdownDashboardProps` and the record types (`BreakdownDashboardKpis`, `BreakdownDashboardContributor`) are exported from `dashboard-breakdown.vue`, and `sample.ts` holds the sample year the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop             | Type                              | What it does                                                                                                                           |
| ---------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `kpis`           | `BreakdownDashboardKpis`          | The value, delta and sparkline of each tile, by metric (`total`, `compute`, `database`, `storage`). A metric left out reads as a dash. |
| `labels`         | `string[]`                        | The month labels of Spend by category.                                                                                                 |
| `series`         | `ChartSeries[]`                   | Monthly spend, one series per category. `[]` shows the chart's empty state.                                                            |
| `split`          | `ChartSeries[]`                   | This month's spend by category, one value per series, for the donut.                                                                   |
| `contributors`   | `BreakdownDashboardContributor[]` | The Top contributors rows. `[]` shows No spend in this range.                                                                          |
| `loading`        | `boolean`                         | The period is loading; every tile, both charts and the table show their skeleton, and the exports disable.                             |
| `error`          | `string`                          | Why the period could not load; one danger `Alert` under the heading shows it with Retry, and the regions show `Not available.`         |
| `v-model:period` | `string`                          | The selected period (`12m`, `6m`, `ytd`); default `12m`. Refetch when it changes.                                                      |

| Event           | Payload         | When                                                                                                             |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `retry`         | `(event)`       | Retry in the page's error alert.                                                                                 |
| `export`        | `(event, card)` | Export CSV in the header (`spend-by-category`) or a card menu; the block downloads the CSV of the data it shows. |
| `update:period` | `(value)`       | The reader picked another period.                                                                                |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import DashboardBreakdown from './dashboard-breakdown.vue'

  const period = ref('12m')
  const { data, pending, error, refresh } = useSpendBreakdown(period)
</script>

<template>
  <DashboardBreakdown
    v-model:period="period"
    :kpis="data?.kpis ?? {}"
    :labels="data?.labels ?? []"
    :series="data?.series ?? []"
    :split="data?.split ?? []"
    :contributors="data?.contributors ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep the category order and colors identical across tiles, stacked chart, donut and table.
- Put the total first in the tile row, then the parts.
- Show a percentage next to every share bar.
- Mark spend tiles as `inverse`.

## Don't

- Don't use a donut for more than six slices; fold the tail into Other.
- Don't stack series that overlap or do not sum to the total.
- Don't color categories with status tokens; a category is not a state.
- Don't drop the absolute amount and show only the share.

## Copy

- **Title:** `Cost breakdown`.
- **Description:** `How the organization’s spend splits across categories and the resources that drive it.`
- **Tile labels:** the category name only. `Total spend`, `Compute`, `Database`, `Storage`.
- **Card titles:** `Spend by category`, `Current split`, `Top contributors`.
- **Donut center label:** the period it shows. `This month`.
- **Empty state:** `No spend in this range` / `Nothing was billed to the organization in the selected period.`

## Accessibility

- The period `Select` has `aria-label="Period"`; icon-only controls name their card.
- The donut has an `aria-label` (`Current split`) and its legend lists every category with its value.
- Each `Progress` names its resource; the percentage is visible text, not only the bar.
- Amounts and shares use `tabular-nums`.

## States

- Default: the populated breakdown for the period (`v-model:period`).
- Loading: `loading` is set; every tile, both charts and the table hold their place with a `Skeleton`.
- Empty: nothing billed in the period (every kpi `0` and every list `[]`); tiles print `$0` with no delta or trend, the exports disable, and one page-level `EmptyState` replaces the stacked chart, the donut and the table.
- Error: `error` is set; one danger `Alert` under the heading names what did not load, carries the message and offers Retry; tiles show a dash over a quiet band and every region keeps its header over `Not available.`

## Related

- `dashboard/dashboard-executive-summary` — targets and trends instead of parts.
- `dashboard/dashboard-analytics` — non-exclusive series as lines.
- `account/account-change-plan-drawer` — where a reader acts on the spend.
- `DonutChart` / `Chart` — share now, mix over time.
