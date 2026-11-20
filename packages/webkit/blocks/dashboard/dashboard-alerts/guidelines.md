# Alerts dashboard

The page a security or operations lead opens to triage: what is open, how severe it is, what kind of
alert it is and which entities are involved. It leads with the open counts, shows how many alerts were
raised each day by severity, and ends in the open alerts table, ordered from critical to info, where
the reader picks what to work on next. Severity reads on one scale everywhere: tiles, chart, tags
and tables.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-alerts to triage open alerts by severity.
- Alerts carry a severity level and the reader has to decide which to handle first.
- The reader needs both the trend (are we raising more?) and the queue (what is open now?) on one page.
- Alerts name entities (hosts, users, accounts) whose accumulated risk is worth ranking.

## When not to use

- Every request and the rule that decided it, not only alerts: use
  `dashboard/dashboard-security` (ByActor).
- Service health with latency and error thresholds and a short alert rail: use
  `dashboard/dashboard-service-monitoring`.
- Items waiting for a verdict from an analysis engine: use `dashboard/dashboard-scan-results`.
- Only the list of alerts with filters: use `view/view-table`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Alerts` with a one-sentence description. The period control sits in its actions slot because
it scopes every region on the page.

### B. Period — `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

`Last 7 days`, `Last 30 days`, `Last 90 days`, labelled `Period`. One period for the whole page; never
a per-card period.

### C. Summary tiles — `StatTile` (required)

Four tiles in a region labelled `Summary`: open, critical or high open, alerts in the period and
false positives (a share of the closed alerts). Each has the delta against the previous period. Every one of these is a metric
where a rise is bad, so each tile passes `inverse`.

### D. Metric definitions — `Hint` (required)

Each tile and card title carries a `Hint` that defines the metric in one sentence
(`Open alerts at the two highest severity levels.`).

### E. Alerts per day — `ChartCard` (required)

Holds the stacked chart, spanning 8 of 12 columns beside Open by severity, and the other ranked
regions. The card keeps its box in every state.

### F. Daily stack — `Chart` (required)

Stacked bars of alerts raised per day, one series per severity level, colored from the severity ramp so
the bars, legend and tooltip match the `SeverityTag`s.

### G. Open by severity — `Card` (required)

A plain `Card` titled `Open by severity`, not a chart: one row per level with its open count and its
share of open alerts. A list reads faster than a donut when the reader wants the exact number.

### H. Loading rows — `Skeleton` (required)

Holds the Open by severity rows while the period loads, so the column keeps its height.

### I. Severity — `SeverityTag` (required)

The level, on the severity ramp, in Open by severity, Highest risk and as the lead column of Open
alerts. The word is always visible; color never carries severity alone.

### J. Empty regions — `EmptyState` (required)

Every region renders its own empty state with a reason and the next step: the chart
(`No alerts in this period` / `Select a longer period.`), Open by severity (`No open alerts`), Highest
risk (`No entities at risk yet`) and the table.

### K. Alerts by type — `BarList` (required)

Ranks alert types by count, largest first, labelled `Alerts by type`.

### L. Highest risk and Open alerts — `DataTable` (required)

Highest risk pairs each entity with its risk score and the `SeverityTag` of its worst open alert.
Open alerts leads every row with its `SeverityTag` and sorts from critical to info by default.
Figures use tabular numbers.

### M. Alert status — `TableCellStatus`, `Tag` (required)

The status of an alert in the Open alerts table (`Open`, `Investigating`). It is a state,
so it is a `TableCellStatus` (one semantic `Tag`), separate from severity. The alert type beside it stays a plain neutral `Tag`: it is a category, not a state.

### N. Load failure — `Alert` (required)

When `error` is set, every region keeps its header and shows a danger `Alert` in place of its content: `Couldn't load <region>.` followed by the message, with Retry, which emits `retry`.

## Data

The block takes its figures and records through props and emits every action; it fetches nothing. `AlertsDashboardProps` and the record types (`AlertsDashboardKpis`, `AlertsDashboardLevelCount`, `AlertsDashboardEntity`, `AlertsDashboardAlert`) are exported from `dashboard-alerts.vue`, and `sample.ts` holds the sample period the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop             | Type                          | What it does                                                                                                                                   |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `kpis`           | `AlertsDashboardKpis`         | The value and delta of each summary tile, by metric (`open`, `critical-high`, `raised`, `false-positives`). A metric left out reads as a dash. |
| `labels`         | `string[]`                    | The day labels of Alerts per day.                                                                                                              |
| `series`         | `ChartSeries[]`               | Alerts per day, one series per severity level, colored from the severity ramp. `[]` shows the chart's empty state.                             |
| `openByLevel`    | `AlertsDashboardLevelCount[]` | Open alerts per severity level; the shares are computed from their sum. `[]` shows No open alerts.                                             |
| `types`          | `BarListItem[]`               | Alerts raised in the period, by type.                                                                                                          |
| `entities`       | `AlertsDashboardEntity[]`     | The Highest risk rows. `[]` shows No entities at risk yet.                                                                                     |
| `alerts`         | `AlertsDashboardAlert[]`      | The Open alerts rows. `[]` shows No open alerts.                                                                                               |
| `loading`        | `boolean`                     | The period is loading; every region shows its skeleton.                                                                                        |
| `error`          | `string`                      | Why the period could not load; each region shows `Couldn't load <region>.` and this message in a danger `Alert` with Retry.                    |
| `v-model:period` | `string`                      | The selected period (`7d`, `30d`, `90d`); default `30d`. Refetch when it changes.                                                              |

| Event           | Payload   | When                               |
| --------------- | --------- | ---------------------------------- |
| `retry`         | `(event)` | Retry in any region's error alert. |
| `update:period` | `(value)` | The reader picked another period.  |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import DashboardAlerts from './dashboard-alerts.vue'

  const period = ref('30d')
  const { data, pending, error, refresh } = useAlertsSummary(period)
</script>

<template>
  <DashboardAlerts
    v-model:period="period"
    :kpis="data?.kpis ?? {}"
    :labels="data?.labels ?? []"
    :series="data?.series ?? []"
    :open-by-level="data?.openByLevel ?? []"
    :types="data?.types ?? []"
    :entities="data?.entities ?? []"
    :alerts="data?.alerts ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Use one severity ramp for every severity on the page, in the same order.
- Sort the open queue by severity first, then by age.
- Mark every count where growth is bad as `inverse`.
- Give each region its own empty state that says why it is empty.

## Don't

- Don't color severity with categorical series tokens, and don't use the severity ramp for anything else.
- Don't show a donut for open by severity; the reader needs exact counts.
- Don't add a per-card period selector.
- Don't collapse the page into one empty state when only some regions are empty; each region speaks for itself.

## Copy

- **Title:** `Alerts`.
- **Description:** one sentence on the page's job. `What is open, how severe it is, what kind it is and who is involved.`
- **Tile labels:** sentence case, no parentheses. `Critical or high open`, `False positives`.
- **Hint:** one sentence definition ending with a period. `Alerts nobody has closed yet, at any severity.`
- **Empty states:** state the fact, then the next step. `No alerts in this period` / `Nothing was raised in the last 30 days. Select a longer period.`, with the chosen period named in the sentence
- **Severity labels:** the level only. `Critical`, `High`, `Medium`, `Low`, `Info`.

## Accessibility

- The period `Select` has `aria-label="Period"`; the tile row is a region labelled `Summary`.
- Severity is always a word in the `SeverityTag`, never a color alone; the chart tooltip lists every level by name.
- Counts and shares use `tabular-nums`.
- The `BarList` carries an `aria-label` naming what it ranks.

## States

- Default: the populated page for the selected period (`v-model:period`).
- Loading: `loading` is set; tiles, chart, bar list and both tables render their own `Skeleton`; Open by severity holds Skeleton rows.
- Empty: a period with no alerts (`kpis` is `{}` and every list is `[]`); tiles show a dash with no delta, and every region keeps its box with an `EmptyState` that says why and what to do next.
- Error: the request for the period failed (`error` is set); tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load, carries the message and offers Retry.

## Related

- `dashboard/dashboard-security` (ByActor) — every request and its outcome, not only alerts.
- `dashboard/dashboard-security` — blocked traffic and the rules that block it.
- `dashboard/dashboard-service-monitoring` — threshold alerts beside service health.
- `SeverityTag` — the one severity scale the page shares.
