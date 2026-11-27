# Analytics dashboard

The page a developer or operator opens to see how much traffic their services handled and how well
they handled it: requests, data transferred, success rate and server errors for the period, then the
charts and the table that explain those totals. Every tile, chart and the table read the same period,
so one change of range moves every region together. It is the reference grammar for the other
dashboards: KPI row first, a 12-column grid of `ChartCard`s below, one shared card header.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-analytics for KPI tiles, charts and a table over one shared period: Traffic (requests, status codes) by default, Usage for consumption per product or project.
- The reader monitors volume and quality of traffic (requests, bytes, status codes) over a period.
- Several metrics share one time window and one set of dimensions (host, country, status code).
- The reader needs to move from a total to the breakdown and then to the rows behind it.

## When not to use

- Latency percentiles and live service health with an alert rail: use
  `dashboard/dashboard-service-monitoring`.
- Blocked and allowed requests and the rules behind them: use `dashboard/dashboard-security`.
- The reader arranges the cards themselves: use `dashboard/dashboard-configurable`.
- Money split by category over time: use `dashboard/dashboard-breakdown`.
- Real-user web vitals or one banded score: use `dashboard/dashboard-health-score`.

## Building blocks

### A. Page heading and period — `PageHeader`, `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

Title `Analytics` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`. The header actions hold one medium `Select` named `Period` by its `aria-label`
(`Last hour`, `Last 24 hours`, `Last 7 days`, `Last 30 days`); it sets the comparison label of every
delta (`vs previous 7 days`) and the period in the exported CSV file name
(`requests-last-7-days.csv`). No card has a period control of its own.

### B. KPI row — `StatTileGroup`, `StatTile` (required)

Four tiles: `Requests`, `Data transferred`, `Success rate`, `Status 5xx`, the cells of one
`StatTileGroup` (`aria-label="Key figures"`): it draws the card and the dividers, stacks the cells in a
narrow box and keeps every cell of a row the same height, whether or not a tile has a change figure or a
sparkline. Each shows the period total, a sparkline (a `null` point is a gap) and the change against the
previous period. `Status 5xx` passes `inverse`, because a rise is a regression.

### C. Metric definitions — `Hint` (required)

Each tile and card title carries a `Hint` with a one-sentence definition
(`Share of requests that ended in a 2xx or 3xx status.`).

### D. Cards — `ChartCard` (required)

Every chart and the table sit in a `ChartCard` on the 12-column grid. `Requests over time` spans the
grid; `Status codes` and `Requests by country` share a row; `Top hosts` closes it. Every card carries
the same header: title with `Hint`, tags, form toggle where it applies, Expand, and the more-options
menu.

### E. Aggregation and variation — `Tag` (required)

`Sum` names the aggregation as muted text with no frame and no icon, so it never reads as a button;
a tag states the change for the period (`+10.03%`). Tags state facts; they are not buttons. On a
phone the header actions stay on the title row, at its end, and the title truncates. A tile and the card that charts the same metric come from one series:
the Requests tile is the sum of the Requests over time points, its delta is the card's change tag,
and the Status codes classes add up to the same requests, so no number on the page contradicts
another.

### F. Line or Bar — `ToggleGroup` (optional)

Switches a time series between Line and Bar. Only on time series, never on a ranked bar chart. Its
`aria-label` names the card (`Chart form for Requests over time`).
`Status codes` adds a third option, `Errors`: stacked bars of the 4xx and 5xx classes only (2xx and 3xx
are hidden in the legend), so the value axis rescales to the error classes a reader opens the card for
instead of drawing them as slivers on the 2xx scale. The Status codes cards of the Metrics and Metrics overview pages offer
the same option.

### G. Control labels — `Tooltip` (required)

Names each icon-only control on hover and focus (`Expand`, `More options`).

### H. Expand — `IconButton`, `Dialog`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `PanelBody` (optional)

Opens the card at full size. Icon-only, with an `aria-label` that names the card
(`Expand Requests over time`). It opens one large `Dialog` for the page: the card title as the
`DialogTitle`, its Hint sentence as the `DialogDescription`, the same Line or Bar `ToggleGroup`
(time series only, sharing the card's choice), and the chart at a 420px plot, or the table with ten
rows per page. Closing it returns focus to the Expand button that opened it. While the page loads or
after it failed there is nothing to enlarge, so Expand is disabled.

### I. More options — `DropdownMenu`, `toast` (optional)

`Copy query` and `Export CSV`. Secondary actions go here so the header stays one line. Copy query
writes the Real-Time Metrics GraphQL query behind the card (dataset `workloadMetrics`, the period
as `tsRange`, `aggregate: { sum: requests }`, the `groupBy` dimensions, the order and the fields) to
the clipboard and confirms with a success toast (`Query copied.`), or an
error toast when the clipboard is not available. Export CSV serializes the card's rows with
`toCsv` and saves them with `downloadCsv` from `@aziontech/ui/utils/csv` as
`<card>-last-24-hours.csv`, then confirms with `CSV exported.` and the file name. Export CSV is
disabled when the card has no rows (Empty, Loading, Error); Copy query always works. The app
mounts the toast region; this page body never renders a `Toaster`.

### J. Charts — `Chart` (required)

`Requests over time` as an area, `Status codes` as stacked bars by default (2xx, 3xx, 4xx, 5xx), so the error classes read as their
part of each interval instead of flat lines on the 2xx scale (Line stays one toggle away), and
`Requests by country` as labeled horizontal bars. The series take the categorical role in declaration
order; reserve the status role for a series whose color means a state.

### K. Table search — `Input` (optional)

Searches `Top hosts` (`Search hosts or services`). It filters this table only, so it sits inside the
card, not in the page header.

### L. Top hosts — `DataTable` (required)

A searchable, paginated table of hosts with tabular figures, right-aligned numbers.

### M. Empty regions — `EmptyState` (required)

Each card keeps its box with its own empty state: `No traffic yet` /
`Metrics appear here once a service serves requests.` for charts, and `No matching rows` /
`Change the search.` when the table search matches nothing.

### N. Product and period — `PageHeader` (optional)

In the Metrics variant one page holds the dashboards of several products. A `PageTabs` strip of `Tabs.Trigger`s under the `PageHeader` switches the product (`Applications`, `Functions`, `Firewall`, `DNS`, `Data stream`); each product brings its own four tiles and four cards, and the header description changes with it. One `Select` in the header actions (`Last hour`, `Last 24 hours`, `Last 7 days`, `Last 30 days`), named `Period` by its `aria-label`, drives every tile, card and the comparison label of the deltas (`vs previous 7 days`). The interval of the points follows the period: 5 minutes for an hour, 2 hours for a day, a day for a week, 3 days for a month. The period stays when the product changes.

### O. Sub-dashboards and breakdowns — `ToggleGroup`, `Input`, `DataTable`, `EmptyState` (optional)

In the Metrics variant a product with more than one dashboard shows a medium `ToggleGroup` under the
product tabs, named `<Product> dashboards`. Applications offers `Overview`, `Status codes` and
`Request breakdown`; Firewall offers `Overview` and `Denied sources`. A dashboard picks which cards
it shows and adds breakdown cards: a full-width `ChartCard` with a search `Input` and a paginated
`DataTable` (five rows, sorted columns). The status breakdown adds a second `ToggleGroup` that
filters by status class (`All`, `2xx`, `3xx`, `4xx`, `5xx`). Changing the product returns to its
Overview; the period stays.

### P. Overview landing — `StatTile`, `ChartCard`, `IconButton`, `Tooltip` (optional)

The MetricsOverview variant is the page before the product dashboards. Six `StatTile`s across
products, then six highlight cards in two columns. Each card keeps the full header (Sum, Line or
Bar, Expand, the more-options menu) and ends in a `ChartCard.Footer` holding one medium `Link`
without icon, `Open <Product> dashboard`, to the product dashboard and view the card came from.
The header actions hold the `Period` `Select` and an outlined Refresh `IconButton` in a `Tooltip`;
Refresh emits `refresh` and fakes no reload: the page fetches again and passes `refetching`, which
holds the charts at reduced opacity until the new figures arrive.

### Q. Usage — `StatTile`, `ChartCard`, `Chart`, `DataTable`, `Hint`, `Input`, `EmptyState` (optional)

Variant Usage only: what the account's projects consumed in the period, against the previous period.
Title `Data usage`. Six tiles: `Requests`, `Data transferred`, `Jobs run`, `Images processed`,
`Requests inspected`, `Logs exported`, each with its period total, a sparkline and the change
`vs previous 24 hours`. Consumption is neither good nor bad by itself, so these tiles do not pass
`inverse`; pass it only on a metric where a rise is bad. Three cards follow:
`Data transferred, this period vs previous` draws `This period` and `Previous period` as two series of
the same metric (the current period declared first, so it takes the first series color), with the Line
or Bar `ToggleGroup`; `Data transferred by project` is a labeled horizontal bar chart, largest first;
`Usage by project` is a searchable (`Search projects`), paginated `DataTable` of requests and data
transferred per project. The empty copy is `No usage yet` /
`Usage appears here once a project serves requests.`

### R. Failure — `Alert` (required)

When `error` is set, one danger `Alert` under the page heading says `Couldn't load <page>.` followed by the message, with Retry, which emits `retry`. Every region keeps its header and shows a quiet `Not available.` line in place of its content, and each tile shows a dash over a neutral `Couldn't load` band, so one failed request reads as one problem instead of a wall of red banners. Expand and Export CSV disable.

## Data

The block takes its figures through props and emits its actions; it fetches nothing. `AnalyticsDashboardProps` and the record types (`AnalyticsDashboardKpis`, `AnalyticsDashboardCountry`, `AnalyticsDashboardHost`, `AnalyticsDashboardChanges`, `AnalyticsDashboardRange`) are exported from `dashboard-analytics.vue`, and `sample.ts` holds the sample figures the block renders when a data prop is left out (and never while `loading` or `error` is set). The tile labels, hints and formats, the card titles and the period options stay in the SFC.

| Prop              | Type                             | What it does                                                                                                                                           |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model:period`  | `string`                         | The selected period (`1h`, `24h`, `7d`, `30d`); defaults to `24h`. Refetch when it changes.                                                            |
| `kpis`            | `AnalyticsDashboardKpis`         | The value, delta and sparkline (`(number \| null)[]`, `null` is a gap) of each tile, keyed by tile id; a tile left out reads as a dash. `{}` is empty. |
| `intervals`       | `ChartLabel[]`                   | One label per interval of the two time series (a string, a number or a `Date`).                                                                        |
| `requestSeries`   | `ChartSeries[]`                  | The Requests over time series.                                                                                                                         |
| `statusSeries`    | `ChartSeries[]`                  | The Status codes series, one per status class.                                                                                                         |
| `countries`       | `AnalyticsDashboardCountry[]`    | The Requests by country bars, top countries first.                                                                                                     |
| `hosts`           | `AnalyticsDashboardHost[]`       | The Top hosts rows; searched, sorted and paged in the browser.                                                                                         |
| `changes`         | `AnalyticsDashboardChanges`      | The change tags of the two time-series cards, in percent; `null` hides a tag.                                                                          |
| `range`           | `AnalyticsDashboardRange`        | The period's window as ISO timestamps, written into the query each card menu copies.                                                                   |
| `defaultExpanded` | `AnalyticsDashboardCardId \| ''` | The card whose expanded dialog is open on first render.                                                                                                |
| `loading`         | `boolean`                        | The period is loading: every tile, chart and the table hold a `Skeleton`, Expand and Export CSV disable.                                               |
| `error`           | `string`                         | Why the period could not load; one danger `Alert` under the heading shows it with Retry, and the regions show `Not available.`                         |
| `refetching`      | `boolean`                        | The period is reloading over figures already shown: the data stays and every chart holds its previous render at reduced opacity.                       |

| Event           | Payload   | When                             |
| --------------- | --------- | -------------------------------- |
| `update:period` | `(value)` | The Period `Select` changed.     |
| `retry`         | `(event)` | Retry in the page's error alert. |

The queries the card menus copy run as-is against the Azion Real-Time Metrics API
(`POST /v4/metrics/graphql`). What the API expects, so a live page asks for the right shapes:

| Card                | Query                                                                                                                               | Maps to                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Requests over time  | `workloadMetrics(aggregate: { sum: requests }, groupBy: [ts], orderBy: [ts_ASC]) { ts sum }`                                        | `requestSeries`                                                  |
| Status codes        | `workloadMetrics(aggregate: { sum: requests }, groupBy: [ts, status], orderBy: [ts_ASC]) { ts status sum }`                         | `statusSeries`                                                   |
| Requests by country | `workloadMetrics(aggregate: { sum: requests }, groupBy: [geolocCountryName], orderBy: [sum_DESC]) { geolocCountryName sum }`        | `countries.country`                                              |
| Top hosts           | `workloadMetrics(aggregate: { sum: requests }, groupBy: [host, configurationId], orderBy: [sum_DESC]) { host configurationId sum }` | `hosts`: `host`, `service` (the configuration's name, or its id) |

- Every query takes `limit` and `filter: { tsRange: { begin, end } }`; an aggregate needs `groupBy`, and a ranked list orders by the aggregate (`sum_DESC`), never by the measured field (`requests_DESC` is rejected).
- Timestamps are ISO 8601 in UTC **without** the trailing `Z` (`2026-11-13T11:00:00`); the block strips a `Z` and milliseconds from `range` before it writes the query.
- `resample: { function: sum, points: 96 }` returns a fixed number of points for a time series, so a long period does not come back as thousands of rows.
- One query returns at most 10,000 rows (`limit: 10000`).
- Data transferred is `aggregate: { sum: bytesSent }`; the Functions product reads `functionsMetrics` (`sum: invocations`) and Edge DNS reads `idnsQueriesMetrics`.

Copy query and Export CSV run in the browser on the figures the block holds. To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'

  import DashboardAnalytics from './dashboard-analytics.vue'

  const period = ref('24h')
  const { data, pending, error, refresh } = useWorkloadMetrics(period)
</script>

<template>
  <DashboardAnalytics
    v-model:period="period"
    :kpis="data?.kpis ?? {}"
    :intervals="data?.intervals ?? []"
    :request-series="data?.requests ?? []"
    :status-series="data?.statusCodes ?? []"
    :countries="data?.countries ?? []"
    :hosts="data?.hosts ?? []"
    :changes="data?.changes"
    :range="data?.range"
    :loading="pending && !data"
    :refetching="pending && !!data"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep the KPI row to the four numbers the reader checks first; put the rest in cards.
- Use one card header layout for every card, so the controls are in the same place.
- Let one period drive every region.
- Keep the period when the product tab changes, so the reader compares products over the same window.
- Give each product the same grammar: four tiles, then cards of two per row.
- Distinguish "nothing recorded" from "nothing matches the search" in the empty copy.

## Don't

- Don't give a card its own period selector.
- Don't offer Line or Bar on a ranked breakdown; bars are the only form there.
- Don't put more than one search on the page header; table search belongs to its table.
- Don't use status colors for categorical series such as countries or hosts.
- Don't sum a rate or a percentile in a legend total; Metrics turns totals off for those cards.
- Don't nest product tabs inside a card; the product is a page-level choice.
- Don't put a product's sub-dashboard switch inside a card; it sits under the product tabs and changes the whole page.

## Copy

- **Title:** `Analytics`. **Description:** `Requests, data transferred and errors your services handled in the period.`
- **Card titles:** noun phrase, sentence case. `Requests over time`, `Status codes`, `Top hosts`.
- **Tile labels:** the metric name only. `Data transferred`, never `Data transferred (GB)`; the unit belongs to the value.
- **Hint:** one sentence ending with a period. `Requests that ended in a server error. A rise is a regression.`
- **Menu items:** verb first. `Copy query`, `Export CSV`.
- **Overview:** footer links read `Open <Product> dashboard`; breakdown searches name what they match (`Search addresses, networks or countries`).
- **Toasts:** `Query copied.` / `Paste it into any GraphQL client that sends your token.`; `The query could not be copied.`; `CSV exported.` with the file name.
- **Metrics:** title `Real-time metrics`; tab labels are product names; the aggregation names the math in muted text (`Sum`, `Median`, `Percentile`).
- **Usage:** title `Data usage`, description `What your projects consumed in the period, against the previous period.`; card titles say what is compared (`Data transferred, this period vs previous`); series `This period`, `Previous period`.
- **Empty state:** `No traffic yet` / `Metrics appear here once a service serves requests.`
- **No-match state:** `No matching rows` / `Change the search.`

## Accessibility

- Every icon-only control has an `aria-label` that names its card, plus a `Tooltip`.
- The expanded `Dialog` traps focus, closes on Escape and returns focus to the Expand button; its title and description name the card.
- The `ToggleGroup` is labelled with the card it controls.
- The search `Input` has an `aria-label` equal to its placeholder, since there is no visible label.
- Figures use `tabular-nums`; deltas carry a sign and a word, not color alone.
- The product strip is a tab list (`PageTabs`); the region under it is named after the product and the period (`Functions metrics, Last 24 hours`).
- Charts expose their table twin and keyboard model through `Chart`; do not replace them with a bare SVG.

## States

- Default: the populated dashboard for the period (`kpis`, `intervals`, `requestSeries`, `statusSeries`, `countries`, `hosts`, `changes`).
- Loading: `loading`; every tile, chart and the table hold their place with a `Skeleton`; the grid does not reflow.
- Refetching: `refetching`; the period reloads (a new period, a Refresh) over figures already shown: the tiles, charts and table keep their data and every chart holds its previous render at reduced opacity until the new figures arrive. Use `loading` only for the first response.
- Empty: `kpis` is `{}` and the series and rows are `[]`; no traffic in the period, tiles show a dash with no delta or trend, and each card keeps its box with an `EmptyState`.
- Metrics: real-time metrics per product, a `PageTabs` strip of products and a `Period` `Select` in the header; each product shows four tiles and four area, line or stacked bar cards, and products with sub-dashboards switch them with a `ToggleGroup`, adding breakdown table cards.
- Expanded: `defaultExpanded="requests"`; the Requests over time card open in the large `Dialog`, with the Line or Bar choice and a 420px plot.
- MetricsOverview: six cross-product tiles and six highlight cards, each with a footer link to its product dashboard.
- Usage: the Data usage page, consumption per meter and per project against the previous period.
- Error: `error` is set; one danger `Alert` under the heading names what did not load, carries the message and offers Retry; tiles show a dash over a quiet band and every region keeps its header over `Not available.`

## Related

- `dashboard/dashboard-breakdown` — when the total is money split by category.
- `dashboard/dashboard-health-score` — real-user web vitals and banded scores.
- `account/account-change-plan-drawer` — where usage limits are changed.
- `dashboard/dashboard-configurable` — when the reader arranges the cards.
- `dashboard/dashboard-service-monitoring` — latency percentiles and an alert rail.
- `ChartCard` / `StatTile` — the card and tile every dashboard shares.
- `view/view-events-explorer` — the events behind these numbers, row by row.
- `edit/edit-resource` (DataStream) — where the streams counted under Data stream are set up.
