# AnalyticsDashboard (`dashboard/analytics-dashboard`)

> The analytics dashboard pattern: KPI tiles, charts and a table that all read the same period, so one change of range moves every region together: the Period Select in the PageHeader actions sets the comparison of every delta and the period in each exported CSV name. A StatTileGroup of four StatTiles (requests, data transferred, success rate and status 5xx, each with a sparkline and its change against the previous period) sits over a 12-column grid of ChartCards. Requests over time spans the grid as an area Chart, status codes as a multi-series line and requests by country as labeled horizontal bars share a row, and a searchable, paginated DataTable of top hosts closes it. Every card carries the same header: title with a Hint, the aggregation and variation Tags, a Line or Bar ToggleGroup for time series, an Expand IconButton that opens the card in a large Dialog, and a DropdownMenu whose Copy query copies the card's GraphQL query and Export CSV downloads its rows, each confirmed by a toast. Built from `PageHeader`, `StatTileGroup`, `StatTile`, `ChartCard`, `Chart`, `DataTable`, `Tag`, `Hint`, `ToggleGroup`, `IconButton`, `Tooltip`, `DropdownMenu`, `Dialog`, `toast`, `Input` and `EmptyState`. The Usage variant applies the same grammar to consumption: six usage tiles, this period against the previous one, a ranking of projects and a table of usage per project. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/analytics-dashboard/analytics-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/analytics-dashboard")`
- Components: [Alert](../../components/alert.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelHeader`, [Select](../../components/select.md), [StatTile](../../components/stat-tile.md), [StatTileGroup](../../components/stat-tile-group.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-locale`, `utils/clipboard`, `utils/csv`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

metrics; metric panel; kpi tiles; sparkline; real-time metrics; analytics dashboard; painel de métricas; indicadores; analytics; traffic analytics; requests over time; period comparison; painel analítico; análise de tráfego; real-time metrics per product; product metrics; metrics by product; period filter; métricas por produto; métricas en tiempo real; expand chart; chart dialog; export csv; copy query; metrics overview; metrics landing; sub-dashboards; status class filter; visão geral de métricas; data dashboard; metrics dashboard; kpi dashboard; stat tiles; data transferred; usage dashboard; usage per project; consumption; breakdown charts; métricas; painel de dados; painel de uso; traffic and usage dashboard

The page a developer or operator opens to see how much traffic their services handled and how well
they handled it: requests, data transferred, success rate and server errors for the period, then the
charts and the table that explain those totals. Every tile, chart and the table read the same period,
so one change of range moves every region together. It is the reference grammar for the other
dashboards: KPI row first, a 12-column grid of `ChartCard`s below, one shared card header.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

## When to use

- Use analytics-dashboard for KPI tiles, charts and a table over one shared period: Traffic (requests, status codes) by default, Usage for consumption per product or project.
- The reader monitors volume and quality of traffic (requests, bytes, status codes) over a period.
- Several metrics share one time window and one set of dimensions (host, country, status code).
- The reader needs to move from a total to the breakdown and then to the rows behind it.

## When not to use

- Latency percentiles and live service health with an alert rail: use
  `dashboard/service-monitoring-dashboard`.
- Blocked and allowed requests and the rules behind them: use `dashboard/security-dashboard`.
- The reader arranges the cards themselves: use `dashboard/configurable-dashboard`.
- Money split by category over time: use `dashboard/breakdown-dashboard`.
- Real-user web vitals or one banded score: use `dashboard/health-score-dashboard`.

## Building blocks

### A. Page heading and period — `PageHeader`, `Select` (required)

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

`Sum` names the aggregation; a second tag states the change for the period (`+10.03%`). Tags state
facts; they are not buttons.

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

`Requests over time` as an area, `Status codes` as a multi-series line (2xx, 3xx, 4xx, 5xx), and
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
Refresh holds the charts at reduced opacity (`refetching`) while the data reloads.

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

When the period cannot load (`error`), every card keeps its header and shows a danger `Alert` with
Retry in place of its chart or table, naming what did not load
(`Couldn't load top hosts. Check your connection and retry.`); Expand and Export CSV disable.

## Data

The block takes its figures through props and emits its actions; it fetches nothing. `AnalyticsDashboardProps` and the record types (`AnalyticsDashboardKpis`, `AnalyticsDashboardCountry`, `AnalyticsDashboardHost`, `AnalyticsDashboardChanges`, `AnalyticsDashboardRange`) are exported from `analytics-dashboard.vue`, and `sample.ts` holds the sample figures the block renders when a data prop is left out (and never while `loading` or `error` is set). The tile labels, hints and formats, the card titles and the period options stay in the SFC.

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
| `error`           | `string`                         | Why the period could not load; each card shows `Couldn't load <card>.` and the message in a danger `Alert`.                                            |
| `refetching`      | `boolean`                        | The period is reloading over figures already shown: the data stays and every chart holds its previous render at reduced opacity.                       |

| Event           | Payload   | When                             |
| --------------- | --------- | -------------------------------- |
| `update:period` | `(value)` | The Period `Select` changed.     |
| `retry`         | `(event)` | Retry in any card's error alert. |

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

  import AnalyticsDashboard from './analytics-dashboard.vue'

  const period = ref('24h')
  const { data, pending, error, refresh } = useWorkloadMetrics(period)
</script>

<template>
  <AnalyticsDashboard
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
- **Metrics:** title `Real-time metrics`; tab labels are product names; aggregation tags name the math (`Sum`, `Median`, `Percentile`).
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
- Error: `error` holds the message; the request for the period failed, tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `dashboard/breakdown-dashboard` — when the total is money split by category.
- `dashboard/health-score-dashboard` — real-user web vitals and banded scores.
- `account/change-plan-drawer` — where usage limits are changed.
- `dashboard/configurable-dashboard` — when the reader arranges the cards.
- `dashboard/service-monitoring-dashboard` — latency percentiles and an alert rail.
- `ChartCard` / `StatTile` — the card and tile every dashboard shares.
- `view/events-explorer` — the events behind these numbers, row by row.
- `edit/edit-resource` (DataStream) — where the streams counted under Data stream are set up.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the first response loads, every tile, chart and the table hold their place with a Skeleton, so the grid does not reflow when data arrives.
- `Refetching` — The period reloads over figures already shown (a new period, a Refresh): the tiles, charts and table keep their data and every chart holds its previous render at reduced opacity, so nothing jumps to a Skeleton.
- `Empty` — No traffic in the period. The tiles show a dash with no delta or trend, and each card keeps its box with an EmptyState that says nothing was recorded.
- `Error` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.
- `Metrics` — Real-time metrics per product: a PageTabs strip switches between Applications, Functions, Firewall, DNS and Data stream, and a Period Select in the page header (Last hour, Last 24 hours, Last 7 days, Last 30 days) drives every region. Each product shows its own four StatTiles with sparkline and change against the previous period, over four ChartCards of area, line or stacked bar Charts that share one crosshair. Products with more than one dashboard add a ToggleGroup under the tabs: Applications switches between Overview, Status codes (the status card over a status and upstream status table with search and an All, 2xx, 3xx, 4xx, 5xx status-class filter) and Request breakdown (an IP address table with search); Firewall adds Denied sources. Every card menu copies its GraphQL query and exports its rows as CSV.
- `Expanded` — The Requests over time card opened from its Expand button: a large Dialog with the card title and its description, the Line or Bar ToggleGroup shared with the card, and the chart at a 420px plot (the table card opens with ten rows per page). Closing it returns focus to Expand. Every card's menu works: Copy query copies the card's GraphQL query and Export CSV downloads its rows, each confirmed by a toast.
- `MetricsOverview` — The real-time metrics landing page across products: a Period Select and a Refresh button in the page header, six StatTiles (requests, data transferred, cache offload, status 5xx, requests denied, function invocations) with sparkline and change, and six highlight ChartCards from Applications, Firewall and Functions. Each card keeps the full header (Sum Tag, Line or Bar ToggleGroup, Expand into a large Dialog, Copy query and Export CSV) and ends in a footer Link to its product dashboard (Open Applications dashboard).
- `Usage` — Consumption instead of traffic quality: the Data usage page, whose Period Select drives six StatTiles (requests, data transferred, jobs run, images processed, requests inspected, logs exported) with a sparkline and the change against the previous period, then data transferred this period over the previous one as two series, a labeled horizontal bar Chart ranking projects by data transferred, and a searchable, paginated DataTable of requests and data transferred per project.

Each variant is the same screen in another state: `get_block("dashboard/analytics-dashboard", { variant })`, or the file under `blocks/dashboard/analytics-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Chart, { type ChartLabel, type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { copyText } from '@aziontech/webkit/utils/clipboard'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

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

  const fallbackPeriod = {
    value: '24h',
    label: 'Last 24 hours',
    comparison: 'vs previous 24 hours'
  }
  const periods = [
    { value: '1h', label: 'Last hour', comparison: 'vs previous hour' },
    fallbackPeriod,
    { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days' },
    { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' }
  ]
  const periodLabel = (value: string) => periods.find((entry) => entry.value === value)?.label ?? ''
  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? fallbackPeriod
  )
  const periodComparison = computed(() => currentPeriod.value.comparison)
  const periodSlug = computed(() => currentPeriod.value.label.toLowerCase().replaceAll(' ', '-'))

  type FigureFormat = 'count' | 'bytes' | 'percentage'

  interface FigureDefinition {
    id: AnalyticsDashboardKpiId
    label: string
    description: string
    format: FigureFormat
    inverse: boolean
  }

  interface Variation {
    label: string
    severity: TagSeverity
    icon: string
  }

  const failed = computed(() => props.error !== '')
  const blank = computed(() => props.loading || failed.value)
  const fallback = <T,>(value: T | undefined, sample: T, empty: T): T =>
    value ?? (blank.value ? empty : sample)

  const definitions: FigureDefinition[] = [
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

  const kpiValues = computed(() => fallback(props.kpis, sampleKpis, {}))
  const figures = computed(() =>
    definitions.map((definition) => ({
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

  const variation = (change: number | null): Variation | null =>
    change === null
      ? null
      : {
          label: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
          severity: change >= 0 ? 'success' : 'danger',
          icon: change >= 0 ? 'az az-arrow-up-right' : 'az az-arrow-down-right'
        }
  const variations = computed(() => {
    const changes = fallback(props.changes, sampleChanges, { requests: null, statusCodes: null })
    return { requests: variation(changes.requests), statusCodes: variation(changes.statusCodes) }
  })

  const hostColumns: TableColumn[] = [
    {
      accessorKey: 'host',
      id: 'host',
      header: 'Host',
      align: 'start',
      sortable: true,
      principal: true
    },
    {
      accessorKey: 'service',
      id: 'service',
      header: 'Service',
      align: 'start',
      sortable: true
    },
    {
      accessorKey: 'requests',
      id: 'requests',
      header: 'Requests',
      align: 'end',
      sortable: true
    }
  ]

  const forms: ToggleGroupOption[] = [
    {
      label: 'Line',
      value: 'line'
    },
    {
      label: 'Bar',
      value: 'bar'
    }
  ]

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: (value) => compact(value),
    bytes: (value) => {
      const steps = ['B', 'KB', 'MB', 'GB', 'TB']
      let current = value
      let index = 0
      while (current >= 1000 && index < steps.length - 1) {
        current /= 1000
        index += 1
      }
      return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
    },
    percentage: (value) => `${value.toFixed(0)}%`
  }

  const requestsForm = ref('line')
  const statusForm = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  interface CardQuery {
    dataset: string
    limit: number
    groupBy: string[]
    orderBy: string
  }

  const apiTime = (iso: string) => iso.replace(/(\.\d+)?Z$/, '')

  const cardQuery = (report: CardQuery) =>
    [
      'query {',
      `  ${report.dataset}(`,
      `    limit: ${report.limit}`,
      `    filter: { tsRange: { begin: "${apiTime(range.value.begin)}", end: "${apiTime(range.value.end)}" } }`,
      '    aggregate: { sum: requests }',
      `    groupBy: [${report.groupBy.join(', ')}]`,
      `    orderBy: [${report.orderBy}]`,
      '  ) {',
      ...[...report.groupBy, 'sum'].map((field) => `    ${field}`),
      '  }',
      '}'
    ].join('\n')

  const copyQuery = async (report: CardQuery) => {
    if (!(await copyText(cardQuery(report)))) {
      toast.error('The query could not be copied.')
      return
    }
    toast.success('Query copied.', {
      description: 'Paste it into any GraphQL client that sends your token.'
    })
  }

  const queries: Record<AnalyticsDashboardCardId, CardQuery> = {
    requests: { dataset: 'workloadMetrics', limit: 10000, groupBy: ['ts'], orderBy: 'ts_ASC' },
    'status-codes': {
      dataset: 'workloadMetrics',
      limit: 10000,
      groupBy: ['ts', 'status'],
      orderBy: 'ts_ASC'
    },
    countries: {
      dataset: 'workloadMetrics',
      limit: 10,
      groupBy: ['geolocCountryName'],
      orderBy: 'sum_DESC'
    },
    hosts: {
      dataset: 'workloadMetrics',
      limit: 1000,
      groupBy: ['host', 'configurationId'],
      orderBy: 'sum_DESC'
    }
  }

  interface CardReport extends CardQuery {
    label: string
    description: string
    columns: CsvColumn[]
    rows: () => object[]
    empty: () => boolean
  }

  const seriesRows = (series: readonly ChartSeries[], axis: readonly ChartLabel[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : label,
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const expanded = ref(props.defaultExpanded !== '')
  const expandedId = ref<AnalyticsDashboardCardId>(props.defaultExpanded || 'requests')
  const expandedReport = computed(() => reports[expandedId.value])

  const openExpanded = (id: AnalyticsDashboardCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const exportDisabled = (id: AnalyticsDashboardCardId) => blank.value || reports[id].empty()

  const onCardOption = (id: AnalyticsDashboardCardId, value: string | number) => {
    const report = reports[id]
    if (value === 'query') {
      copyQuery(report)
      return
    }
    const filename = `${id}-${periodSlug.value}.csv`
    downloadCsv(filename, toCsv({ columns: report.columns, rows: report.rows() }))
    toast.success('CSV exported.', { description: filename })
  }

  const reports: Record<AnalyticsDashboardCardId, CardReport> = {
    requests: {
      ...queries.requests,
      label: 'Requests over time',
      description: 'Sum of requests served by every service, per interval.',
      columns: [
        { header: 'Time', id: 'ts' },
        { header: 'Requests', id: 'requests' }
      ],
      rows: () => seriesRows(requests.value, labels.value),
      empty: () => requests.value.length === 0
    },
    'status-codes': {
      ...queries['status-codes'],
      label: 'Status codes',
      description: 'Sum of requests per status class. Switch to Bar to stack the classes.',
      columns: [
        { header: 'Time', id: 'ts' },
        { header: 'Status 2xx', id: '2xx' },
        { header: 'Status 3xx', id: '3xx' },
        { header: 'Status 4xx', id: '4xx' },
        { header: 'Status 5xx', id: '5xx' }
      ],
      rows: () => seriesRows(statusCodes.value, labels.value),
      empty: () => statusCodes.value.length === 0
    },
    countries: {
      ...queries.countries,
      label: 'Requests by country',
      description: 'Sum of requests per country of origin, top countries first.',
      columns: [
        { header: 'Country', id: 'country' },
        { header: 'Requests', id: 'requests' }
      ],
      rows: () => countryRows.value,
      empty: () => countryRows.value.length === 0
    },
    hosts: {
      ...queries.hosts,
      label: 'Top hosts',
      description: 'Hosts that served the most requests in the period, with their service.',
      columns: [
        { header: 'Host', id: 'host' },
        { header: 'Service', id: 'service' },
        { header: 'Requests', id: 'requests' }
      ],
      rows: () => hosts.value,
      empty: () => hosts.value.length === 0
    }
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
      <PageHeader
        title="Analytics"
        description="Requests, data transferred and errors your services handled in the period."
      >
        <template #actions>
          <Select
            v-model="period"
            size="medium"
            :display-value="periodLabel"
          >
            <Select.Trigger aria-label="Period" />
            <Select.Content>
              <Select.Item
                v-for="option in periods"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Item>
            </Select.Content>
          </Select>
        </template>
      </PageHeader>
      <StatTileGroup aria-label="Key figures">
        <StatTile
          v-for="figure in figures"
          :key="figure.id"
          :label="figure.label"
          :value="figure.value"
          :format-value="formatters[figure.format]"
          :delta="figure.delta"
          :delta-label="periodComparison"
          :inverse="figure.inverse"
          :trend="figure.trend"
          :loading="loading"
        >
          <template #aside>
            <Hint :content="figure.description" />
          </template>
        </StatTile>
      </StatTileGroup>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Requests over time</ChartCard.Title>
              <Hint content="Sum of requests served by every service, per interval." />
            </span>
            <ChartCard.Action>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="az az-calculator"
                />
                <Tag
                  v-if="variations.requests"
                  :label="variations.requests.label"
                  :severity="variations.requests.severity"
                  :icon="variations.requests.icon"
                  size="small"
                />
                <ToggleGroup
                  v-model="requestsForm"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Requests over time"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Requests over time"
                  :disabled="blank"
                  @click="openExpanded('requests')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('requests', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Requests over time"
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
                    :disabled="exportDisabled('requests')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load requests over time. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              v-model:active-index="activeIndex"
              :series="requests"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
              :refetching="refetching"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar v-if="requestsForm === 'bar'" />
              <Chart.Area v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Status codes</ChartCard.Title>
              <Hint
                content="Sum of requests per status class. Switch to Bar to stack the classes."
              />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="az az-calculator"
                />
                <Tag
                  v-if="variations.statusCodes"
                  :label="variations.statusCodes.label"
                  :severity="variations.statusCodes.severity"
                  :icon="variations.statusCodes.icon"
                  size="small"
                />
                <ToggleGroup
                  v-model="statusForm"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Status codes"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Status codes"
                  :disabled="blank"
                  @click="openExpanded('status-codes')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('status-codes', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Status codes"
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
                    :disabled="exportDisabled('status-codes')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load status codes. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              v-model:active-index="activeIndex"
              :series="statusCodes"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
              :refetching="refetching"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar
                v-if="statusForm === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Requests by country</ChartCard.Title>
              <Hint content="Sum of requests per country of origin, top countries first." />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="az az-calculator"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Requests by country"
                  :disabled="blank"
                  @click="openExpanded('countries')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('countries', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Requests by country"
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
                    :disabled="exportDisabled('countries')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load requests by country. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              :series="countryRequests"
              :labels="countryLabels"
              orientation="horizontal"
              :format-value="formatters.count"
              :height="240"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
              :refetching="refetching"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar show-labels />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Top hosts</ChartCard.Title>
              <Hint
                content="Hosts that served the most requests in the period, with their service."
              />
            </span>
            <ChartCard.Action>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="az az-calculator"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Top hosts"
                  :disabled="blank"
                  @click="openExpanded('hosts')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('hosts', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Top hosts"
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
                    :disabled="exportDisabled('hosts')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load top hosts. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search hosts or services"
                    aria-label="Search hosts or services"
                  >
                    <template #leading>
                      <i
                        class="az az-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </div>

              <DataTable
                v-model:global-filter="search"
                :data="hosts"
                :columns="hostColumns"
                row-key="id"
                sortable
                paginated
                :page-size="5"
                :page-size-options="[5, 10, 25]"
                density="compact"
                bordered
                :loading="loading"
              >
                <template #empty>
                  <EmptyState
                    key="empty-state-1"
                    v-if="!hosts.length"
                    size="small"
                    icon="az az-chart-line"
                    title="No traffic yet"
                    description="Metrics appear here once a service serves requests."
                  />
                  <EmptyState
                    key="empty-state-2"
                    v-else
                    size="small"
                    icon="az az-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>

                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
                </template>
              </DataTable>
            </div>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
    <Dialog
      v-model:open="expanded"
      size="large"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{ expandedReport.label }}</DialogTitle>
            <DialogDescription>{{ expandedReport.description }}</DialogDescription>
          </div>
        </PanelHeader>
        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-md)">
            <div v-if="expandedId === 'requests' || expandedId === 'status-codes'">
              <ToggleGroup
                v-model="expandedForm"
                :options="forms"
                size="small"
                :aria-label="`Chart form for ${expandedReport.label}`"
              />
            </div>
            <Chart
              key="chart-1"
              v-if="expandedId === 'requests'"
              :series="requests"
              :labels="labels"
              :format-value="formatters.count"
              :height="420"
              :refetching="refetching"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :aria-label="expandedReport.label"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar v-if="requestsForm === 'bar'" />
              <Chart.Area v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
            <Chart
              key="chart-2"
              v-else-if="expandedId === 'status-codes'"
              :series="statusCodes"
              :labels="labels"
              :format-value="formatters.count"
              :height="420"
              :refetching="refetching"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :aria-label="expandedReport.label"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar
                v-if="statusForm === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
            <Chart
              key="chart-3"
              v-else-if="expandedId === 'countries'"
              :series="countryRequests"
              :labels="countryLabels"
              orientation="horizontal"
              :format-value="formatters.count"
              :height="420"
              :refetching="refetching"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :aria-label="expandedReport.label"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar show-labels />
              <Chart.Tooltip />
            </Chart>
            <DataTable
              v-else
              :data="hosts"
              :columns="hostColumns"
              row-key="id"
              sortable
              paginated
              :page-size="10"
              density="compact"
              bordered
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="az az-chart-line"
                  title="No traffic yet"
                  description="Metrics appear here once a service serves requests."
                />
              </template>

              <template #cell-requests="{ row }">
                <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
              </template>
            </DataTable>
          </div>
        </PanelBody>
      </DialogContent>
    </Dialog>
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
} from './analytics-dashboard.vue'

export const sampleRange: AnalyticsDashboardRange = {
  begin: '2026-11-13T11:00:00Z',
  end: '2026-11-14T10:59:59Z'
}

export const sampleKpis: AnalyticsDashboardKpis = {
  requests: {
    value: 48920000,
    delta: -1.83,
    trend: [
      2029738, 1799252, 1910217, 1633835, 1757364, 1722765, 2157932, 2151290, 2283541, 2397218,
      2545994, 2347243
    ]
  },
  'data-transferred': {
    value: 222000000000,
    delta: -13.26,
    trend: [
      7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
      9768346098, 10386911277, 8642195236, 7365365394, 8004529693
    ]
  },
  'success-rate': {
    value: 98,
    delta: 0.42,
    trend: [99, 99, 99, 99, 98, 98, 97, 97, 97, 97, 97, 99]
  },
  'status-5xx': {
    value: 158600,
    delta: -5.47,
    trend: [4580, 5509, 4940, 5670, 7151, 9279, 8251, 8242, 8497, 6207, 5685, 5352]
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
    values: [
      1524883, 1531611, 1348641, 1583433, 1898319, 1802251, 1954175, 1996970, 1957306, 1701833,
      1509664, 1620625
    ]
  },
  {
    id: '3xx',
    name: 'Status 3xx',
    values: [
      266730, 270925, 287218, 296721, 286635, 245627, 230388, 201140, 188038, 184104, 197071, 244404
    ]
  },
  {
    id: '4xx',
    name: 'Status 4xx',
    values: [40942, 51712, 52096, 55261, 61739, 68992, 75656, 80310, 74603, 63564, 63640, 45548]
  },
  {
    id: '5xx',
    name: 'Status 5xx',
    values: [4709, 5417, 4551, 5950, 5281, 8024, 8695, 9676, 8359, 7225, 6456, 5222]
  }
]

export const sampleCountries: AnalyticsDashboardCountry[] = [
  { country: 'United States', requests: 1048210 },
  { country: 'Brazil', requests: 531620 },
  { country: 'Germany', requests: 118930 },
  { country: 'India', requests: 92480 },
  { country: 'Mexico', requests: 69870 },
  { country: 'Argentina', requests: 48420 }
]

export const sampleHosts: AnalyticsDashboardHost[] = [
  { id: 'www.example.com', host: 'www.example.com', service: 'Storefront', requests: 1284310 },
  { id: 'api.example.com', host: 'api.example.com', service: 'Checkout API', requests: 712480 },
  { id: 'shop.example.com', host: 'shop.example.com', service: 'Storefront', requests: 498210 },
  { id: 'docs.example.com', host: 'docs.example.com', service: 'Docs', requests: 231640 },
  { id: 'status.example.com', host: 'status.example.com', service: 'Status page', requests: 96120 },
  { id: 'cdn.example.com', host: 'cdn.example.com', service: 'Media', requests: 61870 },
  { id: 'blog.example.com', host: 'blog.example.com', service: 'Docs', requests: 28940 }
]

export const sampleChanges: AnalyticsDashboardChanges = {
  requests: 10.03,
  statusCodes: 14.66
}
```
