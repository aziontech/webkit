# DashboardAnalytics (`dashboard/dashboard-analytics`)

> The analytics dashboard pattern: KPI tiles, charts and a table that all read the same period, so one change of range moves every region together: the Period Select in the PageHeader actions sets the comparison of every delta and the period in each exported CSV name. A StatTileGroup of four StatTiles (requests, data transferred, success rate and status 5xx, each with a sparkline and its change against the previous period) sits over a 12-column grid of ChartCards. Requests over time spans the grid as an area Chart, status codes as a multi-series line and requests by country as labeled horizontal bars share a row, and a searchable, paginated DataTable of top hosts closes it. Every card carries the same header: title with a Hint, the aggregation as muted text and the variation Tag, a Line or Bar ToggleGroup for time series, an Expand IconButton that opens the card in a large Dialog, and a DropdownMenu whose Copy query copies the card's GraphQL query and Export CSV downloads its rows, each confirmed by a toast. Built from `PageHeader`, `StatTileGroup`, `StatTile`, `ChartCard`, `Chart`, `DataTable`, `Tag`, `Hint`, `ToggleGroup`, `IconButton`, `Tooltip`, `DropdownMenu`, `Dialog`, `toast`, `Input` and `EmptyState`. The Usage variant applies the same grammar to consumption: six usage tiles, this period against the previous one, a ranking of projects and a table of usage per project. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-analytics/dashboard-analytics.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-analytics")`
- Components: [Alert](../../components/alert.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelHeader`, [Select](../../components/select.md), [Spinner](../../components/spinner.md), [StatTile](../../components/stat-tile.md), [StatTileGroup](../../components/stat-tile-group.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-collection`, `use-locale`, `utils/clipboard`, `utils/csv`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

metrics; metric panel; kpi tiles; sparkline; real-time metrics; analytics dashboard; painel de métricas; indicadores; analytics; traffic analytics; requests over time; period comparison; painel analítico; análise de tráfego; real-time metrics per product; product metrics; metrics by product; period filter; métricas por produto; métricas en tiempo real; expand chart; chart dialog; export csv; copy query; metrics overview; metrics landing; sub-dashboards; status class filter; visão geral de métricas; data dashboard; metrics dashboard; kpi dashboard; stat tiles; data transferred; usage dashboard; usage per project; consumption; breakdown charts; métricas; painel de dados; painel de uso; traffic and usage dashboard

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
`toCsv` and saves them with `downloadCsv` from `@aziontech/webkit/utils/csv` as
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

## Variants

- `Default` — primary (the code below)
- `Loading` — While the first response loads, every tile, chart and the table hold their place with a Skeleton, so the grid does not reflow when data arrives.
- `Refetching` — The period reloads over figures already shown (a new period, a Refresh): the tiles, charts and table keep their data and every chart holds its previous render at reduced opacity, so nothing jumps to a Skeleton.
- `Empty` — No traffic in the period. The tiles show a dash with no delta or trend, and each card keeps its box with an EmptyState that says nothing was recorded.
- `Error` — The request for the period failed: one danger `Alert` under the page heading names what did not load and offers Retry; the tiles read as dashes over a quiet band and every card keeps its header over a quiet `Not available.` line.
- `Metrics` — Real-time metrics per product: a PageTabs strip switches between Applications, Functions, Firewall, DNS and Data stream, and a Period Select in the page header (Last hour, Last 24 hours, Last 7 days, Last 30 days) drives every region. Each product shows its own four StatTiles with sparkline and change against the previous period, over four ChartCards of area, line or stacked bar Charts that share one crosshair. Products with more than one dashboard add a ToggleGroup under the tabs: Applications switches between Overview, Status codes (the status card over a status and upstream status table with search and an All, 2xx, 3xx, 4xx, 5xx status-class filter) and Request breakdown (an IP address table with search); Firewall adds Denied sources. Every card menu copies its GraphQL query and exports its rows as CSV.
- `Expanded` — The Requests over time card opened from its Expand button: a large Dialog with the card title and its description, the Line or Bar ToggleGroup shared with the card, and the chart at a 420px plot (the table card opens with ten rows per page). Closing it returns focus to Expand. Every card's menu works: Copy query copies the card's GraphQL query and Export CSV downloads its rows, each confirmed by a toast.
- `MetricsOverview` — The real-time metrics landing page across products: a Period Select and a Refresh button in the page header, six StatTiles (requests, data transferred, cache offload, status 5xx, requests denied, function invocations) with sparkline and change, and six highlight ChartCards from Applications, Firewall and Functions. Each card keeps the full header (Sum Tag, Line or Bar ToggleGroup, Expand into a large Dialog, Copy query and Export CSV) and ends in a footer Link to its product dashboard (Open Applications dashboard).
- `Usage` — Consumption instead of traffic quality: the Data usage page, whose Period Select drives six StatTiles (requests, data transferred, jobs run, images processed, requests inspected, logs exported) with a sparkline and the change against the previous period, then data transferred this period over the previous one as two series, a labeled horizontal bar Chart ranking projects by data transferred, and a searchable, paginated DataTable of requests and data transferred per project.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-analytics", { variant })`, or the file under `blocks/dashboard/dashboard-analytics/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChartLabel, ChartSeries } from '@aziontech/webkit/chart'
  import Hint from '@aziontech/webkit/hint'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import { type FigureFormat, hostColumns, trafficCards, trafficFigures } from './analytics-cards'
  import {
    chartForms,
    comparedPeriod,
    comparedPeriods,
    fixedFormatter,
    metricFormatters,
    metricQuery,
    periodSlug,
    runCardOption,
    seriesRows
  } from './analytics-report'
  import ExpandedDialog from './parts/expanded-dialog.vue'
  import ExpandedTable from './parts/expanded-table.vue'
  import MetricCard, { type MetricCardVariation } from './parts/metric-card.vue'
  import PeriodHeader from './parts/period-header.vue'
  import SearchTable from './parts/search-table.vue'
  import SeriesChart from './parts/series-chart.vue'
  import {
    sampleChanges,
    sampleCountries,
    sampleHosts,
    sampleIntervals,
    sampleKpis,
    sampleRange,
    sampleRequestSeries,
    sampleStatusSeries
  } from './sample'

  /** The four figures of the KPI row, in the order they render. */
  export type AnalyticsDashboardKpiId =
    'requests' | 'data-transferred' | 'success-rate' | 'status-5xx'

  /** The measured part of one KPI tile. */
  export interface AnalyticsDashboardKpi {
    /** The figure for the period; null reads as a dash. */
    value: number | null
    /** Change against the previous period, in percent; null hides the delta. */
    delta: number | null
    /** The sparkline, one value per interval, null for an interval with no data; empty hides it. */
    trend: (number | null)[]
  }

  /** The KPI figures by tile; a tile left out reads as a dash. */
  export type AnalyticsDashboardKpis = Partial<
    Record<AnalyticsDashboardKpiId, AnalyticsDashboardKpi>
  >

  /** Requests from one country of origin. */
  export interface AnalyticsDashboardCountry {
    /** Country name, the bar label. */
    country: string
    /** Requests from it in the period. */
    requests: number
  }

  /** One row of the Top hosts table. */
  export interface AnalyticsDashboardHost {
    /** Stable row key. */
    id: string
    /** The hostname that served the requests. */
    host: string
    /** The service behind the host. */
    service: string
    /** Requests served in the period. */
    requests: number
  }

  /** Change of each time-series total against the previous period, in percent. */
  export interface AnalyticsDashboardChanges {
    /** Change of the Requests over time total; null hides the tag. */
    requests: number | null
    /** Change of the Status codes total; null hides the tag. */
    statusCodes: number | null
  }

  /** The window the period covers, as ISO timestamps, written into each copied query. */
  export interface AnalyticsDashboardRange {
    /** Start of the window. */
    begin: string
    /** End of the window. */
    end: string
  }

  /** A card that opens in the expanded dialog. */
  export type AnalyticsDashboardCardId = 'requests' | 'status-codes' | 'countries' | 'hosts'

  export interface AnalyticsDashboardProps {
    /** The KPI figures for the period. Left out, the sample renders. */
    kpis?: AnalyticsDashboardKpis
    /** One label per interval of the two time series: a string, a number or a Date. */
    intervals?: ChartLabel[]
    /** Series of the Requests over time card, one value per interval. */
    requestSeries?: ChartSeries[]
    /** Series of the Status codes card, one per status class. */
    statusSeries?: ChartSeries[]
    /** Rows of the Requests by country card, top countries first. */
    countries?: AnalyticsDashboardCountry[]
    /** Rows of the Top hosts table. */
    hosts?: AnalyticsDashboardHost[]
    /** Change tags in the headers of the two time-series cards. */
    changes?: AnalyticsDashboardChanges
    /** The window of the period, written into the queries the card menus copy. */
    range?: AnalyticsDashboardRange
    /** The card whose expanded dialog is open on first render; empty opens none. */
    defaultExpanded?: AnalyticsDashboardCardId | ''
    /** The figures for the period are loading; every tile, chart and the table hold a skeleton. */
    loading?: boolean
    /** Why the period could not load; each card shows it in a danger alert with Retry. */
    error?: string
    /** The period is reloading over figures already shown: the data stays and every chart holds its previous render at reduced opacity. */
    refetching?: boolean
  }

  const props = withDefaults(defineProps<AnalyticsDashboardProps>(), {
    kpis: undefined,
    intervals: undefined,
    requestSeries: undefined,
    statusSeries: undefined,
    countries: undefined,
    hosts: undefined,
    changes: undefined,
    range: undefined,
    defaultExpanded: '',
    loading: false,
    error: '',
    refetching: false
  })

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const period = defineModel<string>('period', { default: '24h' })

  const currentPeriod = computed(() => comparedPeriod(period.value))

  const failed = computed(() => props.error !== '')
  const blank = computed(() => props.loading || failed.value)
  const fallback = <T,>(value: T | undefined, sample: T, empty: T): T =>
    value ?? (blank.value ? empty : sample)

  const kpiValues = computed(() => fallback(props.kpis, sampleKpis, {}))
  const figures = computed(() =>
    trafficFigures.map((definition) => ({
      ...definition,
      ...(kpiValues.value[definition.id] ?? { value: null, delta: null, trend: [] })
    }))
  )

  const labels = computed(() => fallback(props.intervals, sampleIntervals, []))
  const requests = computed(() => fallback(props.requestSeries, sampleRequestSeries, []))
  const statusCodes = computed(() => fallback(props.statusSeries, sampleStatusSeries, []))
  const countryRows = computed(() => fallback(props.countries, sampleCountries, []))
  const countryLabels = computed(() => countryRows.value.map((row) => row.country))
  const countryRequests = computed<ChartSeries[]>(() =>
    countryRows.value.length
      ? [
          {
            id: 'requests',
            name: 'Requests by country',
            values: countryRows.value.map((row) => row.requests)
          }
        ]
      : []
  )
  const hosts = computed(() => fallback(props.hosts, sampleHosts, []))
  const range = computed(() => props.range ?? sampleRange)

  const { formatNumber } = useLocale()
  const fixed = fixedFormatter(formatNumber)

  const variation = (change: number | null): MetricCardVariation | null =>
    change === null
      ? null
      : {
          label: `${change >= 0 ? '+' : ''}${fixed(change, 2)}%`,
          severity: change >= 0 ? 'success' : 'danger',
          icon: change >= 0 ? 'az az-arrow-up-right' : 'az az-arrow-down-right'
        }
  const variations = computed(() => {
    const changes = fallback(props.changes, sampleChanges, { requests: null, statusCodes: null })
    return { requests: variation(changes.requests), statusCodes: variation(changes.statusCodes) }
  })

  const metric = metricFormatters(formatNumber)
  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: metric.count,
    bytes: metric.bytes,
    percentage: (value) => `${fixed(value, 0)}%`
  }

  const requestsForm = ref('line')
  const statusForm = ref('bar')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  const cardRows: Record<AnalyticsDashboardCardId, () => object[]> = {
    requests: () => seriesRows(requests.value, labels.value),
    'status-codes': () => seriesRows(statusCodes.value, labels.value),
    countries: () => countryRows.value,
    hosts: () => hosts.value
  }
  const cardEmpty = (id: AnalyticsDashboardCardId) =>
    ({ requests, 'status-codes': statusCodes, countries: countryRows, hosts })[id].value.length ===
    0

  const card = (id: AnalyticsDashboardCardId) => ({
    title: trafficCards[id].label,
    hint: trafficCards[id].description,
    blank: blank.value,
    exportDisabled: blank.value || cardEmpty(id),
    error: props.error
  })

  const empty = {
    emptyTitle: 'No traffic yet',
    emptyDescription: 'Metrics appear here once a service serves requests.'
  }

  const expanded = ref(props.defaultExpanded !== '')
  const expandedId = ref<AnalyticsDashboardCardId>(props.defaultExpanded || 'requests')
  const expandedReport = computed(() => trafficCards[expandedId.value])
  const expandedForms = computed(() =>
    expandedId.value === 'requests' || expandedId.value === 'status-codes' ? chartForms : []
  )

  const openExpanded = (id: AnalyticsDashboardCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const onCardOption = (id: AnalyticsDashboardCardId, value: string | number) => {
    const report = trafficCards[id]
    runCardOption(value, {
      query: metricQuery({
        dataset: 'workloadMetrics',
        measure: 'requests',
        limit: report.limit,
        groupBy: report.groupBy,
        orderBy: report.orderBy,
        begin: range.value.begin,
        end: range.value.end
      }),
      filename: `${id}-${periodSlug(currentPeriod.value)}.csv`,
      columns: report.columns,
      rows: cardRows[id]
    })
  }

  const expandedForm = computed({
    get: () => (expandedId.value === 'status-codes' ? statusForm.value : requestsForm.value),
    set: (value: string) => {
      if (expandedId.value === 'status-codes') statusForm.value = value
      else requestsForm.value = value
    }
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PeriodHeader
        v-model:period="period"
        title="Analytics"
        description="Requests, data transferred and errors your services handled in the period."
        :options="comparedPeriods"
        :refetching="refetching"
      />
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load analytics. ${error}`"
        action-label="Retry"
        data-testid="dashboard-analytics__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
      <StatTileGroup
        aria-label="Key figures"
        :aria-busy="refetching || undefined"
      >
        <StatTile
          v-for="figure in figures"
          :key="figure.id"
          :label="figure.label"
          :value="figure.value"
          :format-value="formatters[figure.format]"
          :delta="figure.delta"
          :delta-label="currentPeriod.comparison"
          :inverse="figure.inverse"
          :trend="figure.trend"
          :loading="loading"
          :error="error"
        >
          <template #aside>
            <Hint :content="figure.description" />
          </template>
        </StatTile>
      </StatTileGroup>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <MetricCard
          v-model:form="requestsForm"
          :span="12"
          v-bind="card('requests')"
          :variation="variations.requests"
          :forms="chartForms"
          wide
          @expand="openExpanded('requests')"
          @select="(_event, value) => onCardOption('requests', value)"
        >
          <SeriesChart
            v-model:active-index="activeIndex"
            :series="requests"
            :labels="labels"
            :format-value="formatters.count"
            :bar="requestsForm === 'bar'"
            shape="area"
            :loading="loading"
            :refetching="refetching"
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          v-model:form="statusForm"
          :span="6"
          v-bind="card('status-codes')"
          :variation="variations.statusCodes"
          :forms="chartForms"
          @expand="openExpanded('status-codes')"
          @select="(_event, value) => onCardOption('status-codes', value)"
        >
          <SeriesChart
            v-model:active-index="activeIndex"
            :series="statusCodes"
            :labels="labels"
            :format-value="formatters.count"
            :bar="statusForm === 'bar'"
            stacked
            :loading="loading"
            :refetching="refetching"
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          :span="6"
          v-bind="card('countries')"
          @expand="openExpanded('countries')"
          @select="(_event, value) => onCardOption('countries', value)"
        >
          <SeriesChart
            ranking
            :series="countryRequests"
            :labels="countryLabels"
            :format-value="formatters.count"
            :height="240"
            :loading="loading"
            :refetching="refetching"
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          :span="12"
          v-bind="card('hosts')"
          wide
          @expand="openExpanded('hosts')"
          @select="(_event, value) => onCardOption('hosts', value)"
        >
          <SearchTable
            v-model:search="search"
            :rows="hosts"
            :columns="hostColumns"
            search-label="Search hosts or services"
            :format-count="formatters.count"
            :loading="loading"
            :aria-busy="refetching || undefined"
            v-bind="empty"
          />
        </MetricCard>
      </div>
    </div>
    <ExpandedDialog
      v-model:open="expanded"
      v-model:form="expandedForm"
      :title="expandedReport.label"
      :description="expandedReport.description"
      :forms="expandedForms"
    >
      <SeriesChart
        key="chart-1"
        v-if="expandedId === 'requests'"
        :series="requests"
        :labels="labels"
        :format-value="formatters.count"
        :bar="requestsForm === 'bar'"
        shape="area"
        :height="420"
        :refetching="refetching"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <SeriesChart
        key="chart-2"
        v-else-if="expandedId === 'status-codes'"
        :series="statusCodes"
        :labels="labels"
        :format-value="formatters.count"
        :bar="statusForm === 'bar'"
        stacked
        :height="420"
        :refetching="refetching"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <SeriesChart
        key="chart-3"
        v-else-if="expandedId === 'countries'"
        ranking
        :series="countryRequests"
        :labels="countryLabels"
        :format-value="formatters.count"
        :height="420"
        :refetching="refetching"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <ExpandedTable
        v-else
        :rows="hosts"
        :columns="hostColumns"
        :format-count="formatters.count"
        v-bind="empty"
      />
    </ExpandedDialog>
  </div>
</template>
```

## `sample.ts`

```ts
import type { ChartSeries } from '@aziontech/webkit/chart'

import type {
  AnalyticsDashboardChanges,
  AnalyticsDashboardCountry,
  AnalyticsDashboardHost,
  AnalyticsDashboardKpis,
  AnalyticsDashboardRange
} from './dashboard-analytics.vue'

export const sampleRange: AnalyticsDashboardRange = {
  begin: '2026-11-13T11:00:00Z',
  end: '2026-11-14T10:59:59Z'
}

export const sampleKpis: AnalyticsDashboardKpis = {
  requests: {
    value: 24631177,
    delta: 10.03,
    trend: [
      2278608, 2368220, 2548427, 2385746, 2112152, 2214745, 1795004, 1575175, 1640830, 1634383,
      1933593, 2144294
    ]
  },
  'data-transferred': {
    value: 110467764814,
    delta: -13.26,
    trend: [
      7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
      9768346098, 10386911277, 8642195236, 7365365394, 8004529693
    ]
  },
  'success-rate': {
    value: 96.72,
    delta: -0.42,
    trend: [98, 97.7, 97.8, 97.5, 96.9, 96.5, 95.3, 94.3, 95, 95.7, 96.4, 97.7]
  },
  'status-5xx': {
    value: 79347,
    delta: 5.47,
    trend: [4785, 5447, 4587, 5964, 5280, 7973, 8616, 9609, 8368, 7191, 6381, 5146]
  }
}

export const sampleIntervals: string[] = [
  '11:00',
  '13:00',
  '15:00',
  '17:00',
  '19:00',
  '21:00',
  '23:00',
  '01:00',
  '03:00',
  '05:00',
  '07:00',
  '09:00'
]

export const sampleRequestSeries: ChartSeries[] = [
  {
    id: 'requests',
    name: 'Requests',
    values: [
      2278608, 2368220, 2548427, 2385746, 2112152, 2214745, 1795004, 1575175, 1640830, 1634383,
      1933593, 2144294
    ]
  }
]

export const sampleStatusSeries: ChartSeries[] = [
  {
    id: '2xx',
    name: 'Status 2xx',
    color: 1,
    values: [
      1970768, 2045431, 2207447, 2043392, 1792162, 1894493, 1522523, 1327714, 1397824, 1400013,
      1662309, 1853957
    ]
  },
  {
    id: '3xx',
    name: 'Status 3xx',
    color: 2,
    values: [
      262040, 267609, 285424, 281518, 253458, 243622, 188475, 157518, 160801, 163438, 201094, 240161
    ]
  },
  {
    id: '4xx',
    name: 'Status 4xx',
    color: 'warning',
    values: [41015, 49733, 50969, 54872, 61252, 68657, 75390, 80334, 73837, 63741, 63809, 45030]
  },
  {
    id: '5xx',
    name: 'Status 5xx',
    color: 'danger',
    values: [4785, 5447, 4587, 5964, 5280, 7973, 8616, 9609, 8368, 7191, 6381, 5146]
  }
]

export const sampleCountries: AnalyticsDashboardCountry[] = [
  { country: 'United States', requests: 11488380 },
  { country: 'Brazil', requests: 5826560 },
  { country: 'Germany', requests: 1303470 },
  { country: 'India', requests: 1013580 },
  { country: 'Mexico', requests: 765780 },
  { country: 'Argentina', requests: 530680 }
]

export const sampleHosts: AnalyticsDashboardHost[] = [
  { id: 'www.example.com', host: 'www.example.com', service: 'Storefront', requests: 9760760 },
  { id: 'api.example.com', host: 'api.example.com', service: 'Checkout API', requests: 5414850 },
  { id: 'shop.example.com', host: 'shop.example.com', service: 'Storefront', requests: 3786400 },
  { id: 'docs.example.com', host: 'docs.example.com', service: 'Docs', requests: 1760460 },
  {
    id: 'status.example.com',
    host: 'status.example.com',
    service: 'Status page',
    requests: 730510
  },
  { id: 'cdn.example.com', host: 'cdn.example.com', service: 'Media', requests: 470210 },
  { id: 'blog.example.com', host: 'blog.example.com', service: 'Docs', requests: 219940 }
]

export const sampleChanges: AnalyticsDashboardChanges = {
  requests: 10.03,
  statusCodes: 10.03
}

/** One usage tile of the Usage variant. */
export interface UsageFigure {
  /** Stable key. */
  id: string
  /** The tile label. */
  label: string
  /** One sentence that defines the figure. */
  description: string
  /** The unit the figure is written in. */
  unit: 'count' | 'bytes'
  /** The figure for the period. */
  value: number
  /** Change against the previous period, in percent. */
  delta: number
  /** The sparkline, one value per interval. */
  trend: number[]
}

/** One row of the Usage by project table. */
export interface UsageProject {
  /** Stable row key. */
  id: string
  /** The project name. */
  project: string
  /** Requests served in the period. */
  requests: number
  /** Data transferred in the period, written. */
  dataTransferred: string
}

/** Labels and series of one usage chart. */
export interface UsageSeries {
  /** One label per interval or bar. */
  labels: string[]
  /** The series. */
  series: ChartSeries[]
}

export const sampleUsageFigures: UsageFigure[] = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Requests served by every project in the period.',
    unit: 'count',
    value: 49330393,
    delta: -1.83,
    trend: [
      1806444, 1576992, 1869283, 1891454, 1893374, 2012867, 2036776, 1980797, 2313210, 2444662,
      2507165, 2238034, 2315013, 2246445, 2351171, 2177971, 2295207, 2157832, 1993248, 2027048,
      1952960, 1940554, 1585246, 1716640
    ]
  },
  {
    id: 'data-transferred',
    label: 'Data transferred',
    description: 'Data delivered to clients, in and out, by every project in the period.',
    unit: 'bytes',
    value: 821729544000,
    delta: 8.98,
    trend: [
      37987787300, 41596689512, 40096114032, 42509594088, 39693463193, 38541437265, 34997200644,
      32832653647, 35896619893, 34695695753, 32560234611, 29835955559, 26447312700, 29730754488,
      27630321968, 25403501912, 30485256807, 28642766735, 30894459356, 31267070353, 35973056107,
      35248016247, 39016905389, 39746676441
    ]
  },
  {
    id: 'jobs-run',
    label: 'Jobs run',
    description: 'Background jobs that ran to completion in the period.',
    unit: 'count',
    value: 14546636,
    delta: 18.58,
    trend: [
      578482, 549084, 505643, 524549, 522829, 541220, 532059, 511331, 558322, 540484, 616959,
      622771, 614122, 697060, 666023, 646019, 673706, 678263, 739613, 667428, 662645, 668657,
      596124, 633243
    ]
  },
  {
    id: 'images-processed',
    label: 'Images processed',
    description: 'Images resized, cropped or converted in the period.',
    unit: 'count',
    value: 2002933,
    delta: 16.72,
    trend: [
      93274, 93157, 98234, 94141, 104108, 92749, 86064, 94234, 87803, 85279, 79578, 69276, 71356,
      63808, 62459, 74165, 76690, 67994, 79899, 83824, 78724, 85140, 92196, 88781
    ]
  },
  {
    id: 'requests-inspected',
    label: 'Requests inspected',
    description: 'Requests checked against security rules in the period.',
    unit: 'count',
    value: 30771941,
    delta: 2.78,
    trend: [
      1502207, 1457618, 1405860, 1393149, 1339849, 1286141, 1261605, 1252293, 1140520, 1185385,
      992858, 963099, 1082325, 1160330, 1160070, 1229994, 1202329, 1187616, 1405599, 1445636,
      1385091, 1402142, 1447647, 1482578
    ]
  },
  {
    id: 'logs-exported',
    label: 'Logs exported',
    description: 'Log data sent to external destinations in the period.',
    unit: 'bytes',
    value: 61800164400,
    delta: -7.73,
    trend: [
      2810255726, 2418807359, 2364529874, 2399632871, 2117725975, 1965392203, 2243329246,
      1954529809, 2216724649, 2190530044, 2115350572, 2338212538, 2503000274, 2614725041,
      2827373726, 2886198329, 3127436025, 3201613797, 2880012354, 3108954591, 2945086551,
      2856059556, 2936199828, 2778483462
    ]
  }
]

export const sampleUsageComparison: UsageSeries & { delta: number | null } = {
  delta: 8.98,
  labels: [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ],
  series: [
    {
      id: 'current',
      name: 'This period',
      values: [
        37987787300, 41596689512, 40096114032, 42509594088, 39693463193, 38541437265, 34997200644,
        32832653647, 35896619893, 34695695753, 32560234611, 29835955559, 26447312700, 29730754488,
        27630321968, 25403501912, 30485256807, 28642766735, 30894459356, 31267070353, 35973056107,
        35248016247, 39016905389, 39746676441
      ]
    },
    {
      id: 'previous',
      name: 'Previous period',
      values: [
        36311824255, 36364065729, 35671651702, 38220818870, 34170491149, 39019034176, 35328541542,
        37510349711, 33962134894, 30438098447, 29382417841, 27076008841, 29470299745, 28487872271,
        27983934298, 25646807130, 25926728851, 25537721824, 27160266458, 25172084289, 28466967106,
        30258971553, 33662716159, 32759509159
      ]
    }
  ]
}

export const sampleUsageRanking: UsageSeries = {
  labels: [
    'web-app-prod',
    'web-app-eu-prod',
    'storefront-checkout',
    'marketing-site',
    'payments-api',
    'campaign-landing',
    'status-page',
    'web-app-staging'
  ],
  series: [
    {
      id: 'requests',
      name: 'Data transferred by project',
      values: [
        340000000000, 190000000000, 120000000000, 76000000000, 41000000000, 23000000000, 9800000000,
        3200000000
      ]
    }
  ]
}

export const sampleUsageProjects: UsageProject[] = [
  {
    id: 'web-app-prod',
    project: 'web-app-prod',
    requests: 18420000,
    dataTransferred: '340 GB'
  },
  {
    id: 'web-app-eu-prod',
    project: 'web-app-eu-prod',
    requests: 11730000,
    dataTransferred: '190 GB'
  },
  {
    id: 'storefront-checkout',
    project: 'storefront-checkout',
    requests: 7910000,
    dataTransferred: '120 GB'
  },
  {
    id: 'marketing-site',
    project: 'marketing-site',
    requests: 4380000,
    dataTransferred: '76.0 GB'
  },
  {
    id: 'payments-api',
    project: 'payments-api',
    requests: 6240000,
    dataTransferred: '41.0 GB'
  },
  {
    id: 'campaign-landing',
    project: 'campaign-landing',
    requests: 1570000,
    dataTransferred: '23.0 GB'
  },
  { id: 'status-page', project: 'status-page', requests: 860000, dataTransferred: '9.8 GB' },
  {
    id: 'web-app-staging',
    project: 'web-app-staging',
    requests: 210000,
    dataTransferred: '3.2 GB'
  }
]
```

## `analytics-cards.ts`

```ts
import type { TableColumn } from '@aziontech/webkit/data-table'
import type { CsvColumn } from '@aziontech/webkit/utils/csv'

import type { AnalyticsDashboardCardId, AnalyticsDashboardKpiId } from './dashboard-analytics.vue'

export type FigureFormat = 'count' | 'bytes' | 'percentage'

export interface FigureDefinition {
  id: AnalyticsDashboardKpiId
  label: string
  description: string
  format: FigureFormat
  inverse: boolean
}

export const trafficFigures: FigureDefinition[] = [
  {
    label: 'Requests',
    id: 'requests',
    description: 'Sum of requests served by every service in the period.',
    format: 'count',
    inverse: false
  },
  {
    label: 'Data transferred',
    id: 'data-transferred',
    description: 'Sum of data delivered to users by every service in the period.',
    format: 'bytes',
    inverse: false
  },
  {
    label: 'Success rate',
    id: 'success-rate',
    description: 'Share of requests that ended in a 2xx or 3xx status.',
    format: 'percentage',
    inverse: false
  },
  {
    label: 'Status 5xx',
    id: 'status-5xx',
    description: 'Requests that ended in a server error. A rise is a regression.',
    format: 'count',
    inverse: true
  }
]

const hostColumn = (id: string, header: string, align: 'start' | 'end'): TableColumn => ({
  accessorKey: id,
  id,
  header,
  align,
  sortable: true,
  ...(id === 'host' ? { principal: true } : {})
})
export const hostColumns: TableColumn[] = [
  hostColumn('host', 'Host', 'start'),
  hostColumn('service', 'Service', 'start'),
  hostColumn('requests', 'Requests', 'end')
]

export interface TrafficCard {
  label: string
  description: string
  limit: number
  groupBy: string[]
  orderBy: string
  columns: CsvColumn[]
}

const timeColumn: CsvColumn = { header: 'Time', id: 'ts' }

export const trafficCards: Record<AnalyticsDashboardCardId, TrafficCard> = {
  requests: {
    label: 'Requests over time',
    description: 'Sum of requests served by every service, per interval.',
    limit: 10000,
    groupBy: ['ts'],
    orderBy: 'ts_ASC',
    columns: [timeColumn, { header: 'Requests', id: 'requests' }]
  },
  'status-codes': {
    label: 'Status codes',
    description:
      'Sum of requests per status class, stacked as bars so 4xx and 5xx show as their part of every interval. Switch to Line to compare the classes on one scale.',
    limit: 10000,
    groupBy: ['ts', 'status'],
    orderBy: 'ts_ASC',
    columns: [
      timeColumn,
      ...['2xx', '3xx', '4xx', '5xx'].map((id) => ({ header: `Status ${id}`, id }))
    ]
  },
  countries: {
    label: 'Requests by country',
    description: 'Sum of requests per country of origin, top countries first.',
    limit: 10,
    groupBy: ['geolocCountryName'],
    orderBy: 'sum_DESC',
    columns: [
      { header: 'Country', id: 'country' },
      { header: 'Requests', id: 'requests' }
    ]
  },
  hosts: {
    label: 'Top hosts',
    description: 'Hosts that served the most requests in the period, with their service.',
    limit: 1000,
    groupBy: ['host', 'configurationId'],
    orderBy: 'sum_DESC',
    columns: [
      { header: 'Host', id: 'host' },
      { header: 'Service', id: 'service' },
      { header: 'Requests', id: 'requests' }
    ]
  }
}
```

## `analytics-report.ts`

```ts
import type { ChartLabel, ChartSeries } from '@aziontech/webkit/chart'
import { toast } from '@aziontech/webkit/toast'
import { copyText } from '@aziontech/webkit/utils/clipboard'
import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'

/** The unit a figure is written in. */
export type MetricFormat = 'count' | 'bytes' | 'percentage' | 'ms' | 'seconds'

/** The parts of a Real-Time Metrics API query a card copies. */
export interface MetricQuery {
  /** Dataset the query reads. */
  dataset: string
  /** Field the query sums. */
  measure: string
  /** Most rows returned. */
  limit: number
  /** Fields the rows are grouped by. */
  groupBy: string[]
  /** Order of the rows. */
  orderBy: string
  /** Start of the window, as an ISO timestamp. */
  begin: string
  /** End of the window, as an ISO timestamp. */
  end: string
}

/** What a card menu copies and exports. */
export interface CardExport {
  /** The query Copy query writes to the clipboard. */
  query: string
  /** The file name Export CSV downloads. */
  filename: string
  /** The CSV columns. */
  columns: CsvColumn[]
  /** The CSV rows, read when the export runs. */
  rows: () => object[]
}

const byteUnits = ['B', 'KB', 'MB', 'GB', 'TB']

const apiTime = (iso: string): string => iso.replace(/(\.\d+)?Z$/, '')

export const metricQuery = (query: MetricQuery): string =>
  [
    'query {',
    `  ${query.dataset}(`,
    `    limit: ${query.limit}`,
    `    filter: { tsRange: { begin: "${apiTime(query.begin)}", end: "${apiTime(query.end)}" } }`,
    `    aggregate: { sum: ${query.measure} }`,
    `    groupBy: [${query.groupBy.join(', ')}]`,
    `    orderBy: [${query.orderBy}]`,
    '  ) {',
    ...[...query.groupBy, 'sum'].map((field) => `    ${field}`),
    '  }',
    '}'
  ].join('\n')

export const copyQuery = async (query: string): Promise<void> => {
  if (!(await copyText(query))) {
    toast.error('The query could not be copied.')
    return
  }
  toast.success('Query copied.', {
    description: 'Paste it into any GraphQL client that sends your token.'
  })
}

export const exportCsv = (filename: string, columns: CsvColumn[], rows: object[]): void => {
  downloadCsv(filename, toCsv({ columns, rows }))
  toast.success('CSV exported.', { description: filename })
}

export const runCardOption = (value: string | number, card: CardExport): void => {
  if (value === 'query') {
    copyQuery(card.query)
    return
  }
  exportCsv(card.filename, card.columns, card.rows())
}

export const seriesRows = (
  series: readonly ChartSeries[],
  axis: readonly ChartLabel[]
): Record<string, string | number | null>[] =>
  axis.map((label, index) => ({
    ts: label instanceof Date ? label.toISOString() : label,
    ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
  }))

export const seriesColumns = (series: readonly ChartSeries[]): CsvColumn[] => [
  { id: 'ts', header: 'Time' },
  ...series.map((entry) => ({ id: entry.id, header: entry.name }))
]

type FormatNumber = (value: number, options?: Intl.NumberFormatOptions) => string

export type FormatFixed = (value: number, digits: number) => string

export const fixedFormatter =
  (formatNumber: FormatNumber): FormatFixed =>
  (value, digits) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const formatBytes = (
  value: number,
  fixed: FormatFixed,
  units: readonly string[] = byteUnits
): string => {
  let current = value
  let index = 0
  while (current >= 1000 && index < units.length - 1) {
    current /= 1000
    index += 1
  }
  return `${fixed(current, current >= 100 || index === 0 ? 0 : 1)} ${units[index]}`
}

export const metricFormatters = (
  formatNumber: FormatNumber
): Record<MetricFormat, (value: number) => string> => {
  const fixed = fixedFormatter(formatNumber)
  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  return {
    count: (value) => compact(value),
    bytes: (value) => formatBytes(value, fixed),
    percentage: (value) => `${fixed(value, 1)}%`,
    ms: (value) => `${formatNumber(value, { maximumFractionDigits: 1 })} ms`,
    seconds: (value) => `${compact(value)} s`
  }
}

/** A period of the Period Select, with the comparison label of its deltas. */
export interface ComparedPeriod {
  /** The period key. */
  value: string
  /** The label the Select shows. */
  label: string
  /** The comparison label of every delta. */
  comparison: string
}

export const comparedPeriods: ComparedPeriod[] = [
  { value: '1h', label: 'Last hour', comparison: 'vs previous hour' },
  { value: '24h', label: 'Last 24 hours', comparison: 'vs previous 24 hours' },
  { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days' },
  { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' }
]

export const comparedPeriod = (value: string): ComparedPeriod =>
  comparedPeriods.find((entry) => entry.value === value) ?? comparedPeriods[1]!

export const periodSlug = (period: ComparedPeriod): string =>
  period.label.toLowerCase().replaceAll(' ', '-')

export const chartForms = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' }
]
```

## `parts/expanded-dialog.vue`

```ts
<script setup lang="ts">
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'

  export interface ExpandedDialogProps {
    /** Title of the expanded card. */
    title: string
    /** Description of the expanded card. */
    description: string
    /** The chart forms of the toggle; empty hides it. */
    forms?: ToggleGroupOption[]
  }

  withDefaults(defineProps<ExpandedDialogProps>(), { forms: () => [] })

  const open = defineModel<boolean>('open', { default: false })
  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <Dialog
    v-model:open="open"
    size="large"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>{{ description }}</DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <div v-if="forms.length">
            <ToggleGroup
              v-model="form"
              :options="forms"
              size="small"
              :aria-label="`Chart form for ${title}`"
            />
          </div>
          <slot />
        </div>
      </PanelBody>
    </DialogContent>
  </Dialog>
</template>
```

## `parts/expanded-table.vue`

```ts
<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'

  export interface ExpandedTableProps {
    /** The rows; each has an id and a requests count. */
    rows: object[]
    /** The table columns. */
    columns: TableColumn[]
    /** Writes the requests count of a row. */
    formatCount: (value: number) => string
    /** Title of the empty state. */
    emptyTitle: string
    /** Description of the empty state. */
    emptyDescription: string
  }

  defineProps<ExpandedTableProps>()
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    sortable
    density="compact"
    bordered
  >
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-chart-line"
        :title="emptyTitle"
        :description="emptyDescription"
      />
    </template>

    <template #cell-requests="{ row }">
      <span class="tabular-nums">{{
        formatCount('requests' in row ? Number(row.requests) : 0)
      }}</span>
    </template>
    <template #footer>
      <DataTablePagination :page-size="10" />
    </template>
  </DataTable>
</template>
```

## `parts/metric-card.vue`

```ts
<script setup lang="ts">
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** The change tag in a card header. */
  export interface MetricCardVariation {
    /** The change, written with its sign. */
    label: string
    /** Success for a rise, danger for a fall. */
    severity: TagSeverity
    /** The arrow glyph. */
    icon: string
  }

  /** From which width the header tags and the form toggle show. */
  export type MetricCardFit = 'wide' | 'xl' | 'sm'

  export interface MetricCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title. */
    title: string
    /** One sentence that defines the metric. */
    hint: string
    /** The aggregation, written as muted text beside the title. */
    aggregation?: string
    /** The change tag; null hides it. */
    variation?: MetricCardVariation | null
    /** The chart forms of the toggle; empty hides it. */
    forms?: ToggleGroupOption[]
    /** Marks the header actions as the ones of a full-width card. */
    wide?: boolean
    /** From which width the header tags and the toggle show. */
    fit?: MetricCardFit
    /** Shows the Expand button. */
    expandable?: boolean
    /** Disables the Expand button. */
    blank?: boolean
    /** Disables Export CSV. */
    exportDisabled?: boolean
    /** Why the card could not load; shows a danger alert with Retry. */
    error?: string
    /** Text of the footer link; empty hides the footer. */
    footerLabel?: string
    /** Target of the footer link. */
    footerHref?: string
  }

  withDefaults(defineProps<MetricCardProps>(), {
    aggregation: 'Sum',
    variation: null,
    forms: () => [],
    wide: false,
    fit: 'wide',
    expandable: true,
    blank: false,
    exportDisabled: false,
    error: '',
    footerLabel: '',
    footerHref: ''
  })

  const emit = defineEmits<{
    expand: [event: MouseEvent]
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 flex-1 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
      <ChartCard.Action>
        <span
          :data-wide="wide ? '' : undefined"
          class="hidden items-center gap-(--spacing-xs) sm:flex"
          :class="{ 'lg:hidden xl:flex': fit !== 'sm', 'data-wide:lg:flex': fit === 'wide' }"
        >
          <span
            class="text-label-sm text-(--text-muted)"
            data-testid="metric-card__aggregation"
            >{{ aggregation }}</span
          >
          <Tag
            v-if="variation"
            :label="variation.label"
            :severity="variation.severity"
            :icon="variation.icon"
            size="small"
          />
          <ToggleGroup
            v-if="forms.length"
            v-model="form"
            :options="forms"
            size="small"
            :aria-label="`Chart form for ${title}`"
          />
        </span>
        <Tooltip
          v-if="expandable"
          content="Expand"
        >
          <IconButton
            icon="az az-app-window"
            variant="ghost"
            size="small"
            :aria-label="`Expand ${title}`"
            :disabled="blank"
            @click="(event: MouseEvent) => emit('expand', event)"
          />
        </Tooltip>
        <DropdownMenu
          side="bottom"
          align="end"
          @select="(event, value) => emit('select', event, value)"
        >
          <DropdownMenu.Trigger>
            <IconButton
              icon="az az-ellipsis"
              variant="ghost"
              size="small"
              :aria-label="`More options for ${title}`"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="query"
              label="Copy query"
            />
            <DropdownMenu.Item
              value="export"
              label="Export CSV"
              :disabled="exportDisabled"
            />
          </DropdownMenu.Group>
        </DropdownMenu>
      </ChartCard.Action>
    </ChartCard.Header>
    <ChartCard.Content>
      <p
        v-if="error"
        class="text-body-sm text-(--text-muted)"
      >
        Not available.
      </p>
      <slot v-else />
    </ChartCard.Content>
    <ChartCard.Footer v-if="footerLabel">
      <Link
        :label="footerLabel"
        :href="footerHref"
        size="medium"
      />
    </ChartCard.Footer>
  </ChartCard>
</template>
```

## `parts/period-header.vue`

```ts
<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Spinner from '@aziontech/webkit/spinner'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** One entry of the Period Select. */
  export interface PeriodOption {
    /** The period key the Select writes. */
    value: string
    /** The label the Select shows. */
    label: string
  }

  export interface PeriodHeaderProps {
    /** The page title. */
    title: string
    /** One sentence on what the page shows. */
    description: string
    /** The periods the Select offers. */
    options: PeriodOption[]
    /** Adds a Refresh button after the Select. */
    refreshable?: boolean
    /** The page is reloading; the Refresh button shows its spinner. */
    refetching?: boolean
  }

  const props = withDefaults(defineProps<PeriodHeaderProps>(), {
    refreshable: false,
    refetching: false
  })

  const emit = defineEmits<{ refresh: [event: MouseEvent] }>()

  const period = defineModel<string>('period', { required: true })

  const periodLabel = (value: string) =>
    props.options.find((entry) => entry.value === value)?.label ?? ''
</script>

<template>
  <PageHeader
    :title="title"
    :description="description"
  >
    <template #actions>
      <span
        v-if="refetching && !refreshable"
        class="inline-flex items-center gap-(--spacing-2xs) text-body-sm text-(--text-muted)"
        role="status"
        data-testid="period-header__updating"
      >
        <Spinner class="size-4" />
        Updating
      </span>
      <Select
        variant="ghost"
        v-model="period"
        size="medium"
        :display-value="periodLabel"
      >
        <Select.Trigger aria-label="Period" />
        <Select.Content>
          <Select.Item
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Item>
        </Select.Content>
      </Select>
      <Tooltip
        v-if="refreshable"
        content="Refresh"
      >
        <IconButton
          icon="az az-refresh"
          variant="outline"
          size="medium"
          aria-label="Refresh metrics"
          :loading="refetching"
          @click="(event: MouseEvent) => emit('refresh', event)"
        />
      </Tooltip>
    </template>
  </PageHeader>
</template>
```

## `parts/search-table.vue`

```ts
<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import { matchesText } from '@aziontech/webkit/use-collection'
  import { computed } from 'vue'

  export interface SearchTableProps {
    /** The rows; each has an id and a requests count. */
    rows: object[]
    /** The table columns. */
    columns: TableColumn[]
    /** Placeholder and accessible name of the search field. */
    searchLabel: string
    /** Writes the requests count of a row. */
    formatCount: (value: number) => string
    /** The rows are loading. */
    loading?: boolean
    /** Title of the empty state when there are no rows; empty never shows it. */
    emptyTitle?: string
    /** Description of the empty state when there are no rows. */
    emptyDescription?: string
    /** The options of the filter toggle beside the search; empty hides it. */
    filters?: ToggleGroupOption[]
    /** Accessible name of the filter toggle. */
    filterLabel?: string
  }

  const props = withDefaults(defineProps<SearchTableProps>(), {
    loading: false,
    emptyTitle: '',
    emptyDescription: '',
    filters: () => [],
    filterLabel: ''
  })

  const search = defineModel<string>('search', { default: '' })
  const filter = defineModel<string>('filter', { default: 'all' })

  const onFilter = (value: string | number | undefined) => {
    filter.value = value === undefined ? 'all' : String(value)
  }

  const noMatch = () =>
    props.filters.length ? 'Change the search or the status class.' : 'Change the search.'
  const matchingRows = computed(() =>
    props.rows.filter((row) =>
      matchesText(
        row,
        search.value,
        props.columns.flatMap((column) => column.accessorKey ?? [])
      )
    )
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <div class="min-w-36 grow basis-(--container-3xs)">
        <Input
          v-model="search"
          size="medium"
          :placeholder="searchLabel"
          :aria-label="searchLabel"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <ToggleGroup
        v-if="filters.length"
        :model-value="filter"
        :options="filters"
        size="medium"
        :aria-label="filterLabel"
        @update:model-value="onFilter"
      />
    </div>

    <DataTable
      :data="matchingRows"
      :columns="columns"
      row-key="id"
      sortable
      density="compact"
      stackable
      bordered
      :loading="loading"
    >
      <template #empty>
        <EmptyState
          key="empty-state-1"
          v-if="emptyTitle && !rows.length"
          size="small"
          icon="az az-chart-line"
          :title="emptyTitle"
          :description="emptyDescription"
        />
        <EmptyState
          key="empty-state-2"
          v-else
          size="small"
          icon="az az-search"
          title="No matching rows"
          :description="noMatch()"
        />
      </template>

      <template #cell-requests="{ row }">
        <span class="tabular-nums">{{
          formatCount('requests' in row ? Number(row.requests) : 0)
        }}</span>
      </template>
      <template #footer>
        <DataTablePagination
          :page-size="5"
          :page-size-options="[5, 10, 25]"
        />
      </template>
    </DataTable>
  </div>
</template>
```

## `parts/series-chart.vue`

```ts
<script setup lang="ts">
  import Chart, { type ChartLabel, type ChartSeries } from '@aziontech/webkit/chart'

  /** How the series draw while the chart is not in its bar form. */
  export type SeriesChartShape = 'area' | 'line'

  export interface SeriesChartProps {
    /** The series, one value per interval or per bar. */
    series: ChartSeries[]
    /** One label per interval. */
    labels: ChartLabel[]
    /** Writes a value in the axis, the tooltip and the legend. */
    formatValue: (value: number) => string
    /** Draws one labeled horizontal bar per label, a ranking. */
    ranking?: boolean
    /** Draws the series as bars. */
    bar?: boolean
    /** Stacks the bars. */
    stacked?: boolean
    /** How the series draw while not in bars. */
    shape?: SeriesChartShape
    /** Shows the total in the legend. */
    total?: boolean
    /** Minimum plot height in pixels; left out, the chart default. */
    height?: number
    /** The data is loading. */
    loading?: boolean
    /** The data is reloading over the previous render. */
    refetching?: boolean
    /** Accessible name of the chart. */
    ariaLabel?: string
    /** Title of the empty state. */
    emptyTitle: string
    /** Description of the empty state. */
    emptyDescription: string
  }

  withDefaults(defineProps<SeriesChartProps>(), {
    ranking: false,
    bar: false,
    stacked: false,
    shape: 'line',
    total: true,
    height: undefined,
    loading: false,
    refetching: false,
    ariaLabel: ''
  })

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })
</script>

<template>
  <Chart
    v-model:active-index="activeIndex"
    :series="series"
    :labels="labels"
    :orientation="ranking ? 'horizontal' : undefined"
    :format-value="formatValue"
    :height="height"
    :loading="loading"
    :refetching="refetching"
    :aria-label="ariaLabel || undefined"
    :empty-title="emptyTitle"
    :empty-description="emptyDescription"
  >
    <Chart.Grid />
    <Chart.Axis type="y" />
    <Chart.Axis type="x" />
    <Chart.Bar
      key="ranking-bar"
      v-if="ranking"
      show-labels
    />
    <Chart.Bar
      key="series-bar"
      v-else-if="bar"
      :stacked="stacked"
    />
    <Chart.Area v-else-if="shape === 'area'" />
    <Chart.Line v-else />
    <Chart.Crosshair v-if="!ranking" />
    <Chart.Tooltip />
    <Chart.Legend
      v-if="!ranking"
      :total="total"
    />
  </Chart>
</template>
```
