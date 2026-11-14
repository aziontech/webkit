# AnalyticsDashboard (`platform/dashboard/analytics-dashboard`)

> The analytics dashboard pattern: KPI tiles, charts and a table that all read the same period, so one change of range moves every region together: the Period Select in the PageHeader actions sets the comparison of every delta and the period in each exported CSV name. A row of four StatTiles (requests, data transferred, success rate and status 5xx, each with a sparkline and its change against the previous period) sits over a 12-column grid of ChartCards. Requests over time spans the grid as an area Chart, status codes as a multi-series line and requests by country as labeled horizontal bars share a row, and a searchable, paginated TableRoot of top hosts closes it. Every card carries the same header: title with a Hint, the aggregation and variation Tags, a Line or Bar ToggleGroup for time series, an Expand IconButton that opens the card in a large Dialog, and a DropdownMenu whose Copy query copies the card's GraphQL query and Export CSV downloads its rows, each confirmed by a toast. Built from `PageHeader`, `StatTile`, `ChartCard`, `Chart`, `TableRoot`, `Tag`, `Hint`, `ToggleGroup`, `IconButton`, `Tooltip`, `DropdownMenu`, `Dialog`, `toast`, `Input` and `EmptyState`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/analytics-dashboard/analytics-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/analytics-dashboard")`
- Components: [Alert](../../../components/alert.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [Dialog](../../../components/dialog.md), `DialogClose`, `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Link](../../../components/link.md), [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), `PanelContent`, `PanelHeader`, [Select](../../../components/select.md), [StatTile](../../../components/stat-tile.md), `TableRoot`, [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md), `utils/csv`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

metrics; metric panel; kpi tiles; sparkline; real-time metrics; analytics dashboard; painel de métricas; indicadores; analytics; traffic analytics; requests over time; period comparison; painel analítico; análise de tráfego; real-time metrics per product; product metrics; metrics by product; period filter; métricas por produto; métricas en tiempo real; expand chart; chart dialog; export csv; copy query; metrics overview; metrics landing; sub-dashboards; status class filter; visão geral de métricas

The page a developer or operator opens to see how much traffic their services handled and how well
they handled it: requests, data transferred, success rate and server errors for the period, then the
charts and the table that explain those totals. Every tile, chart and the table read the same period,
so one change of range moves every region together. It is the reference grammar for the other
dashboards: KPI row first, a 12-column grid of `ChartCard`s below, one shared card header.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- The reader monitors volume and quality of traffic (requests, bytes, status codes) over a period.
- Several metrics share one time window and one set of dimensions (host, country, status code).
- The reader needs to move from a total to the breakdown and then to the rows behind it.

## When not to use

- Usage per project or product, with the previous period overlaid: use
  `platform/dashboard/data-dashboard`.
- Latency percentiles and live service health with an alert rail: use
  `platform/dashboard/service-monitoring-dashboard`.
- Blocked and allowed requests and the rules behind them: use `platform/dashboard/security-dashboard`.
- The reader arranges the cards themselves: use `platform/dashboard/configurable-dashboard`.

## Building blocks

### A. Page heading and period — `PageHeader`, `Select` (required)

Title `Analytics` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`. The header actions hold one medium `Select` named `Period` by its `aria-label`
(`Last hour`, `Last 24 hours`, `Last 7 days`, `Last 30 days`); it sets the comparison label of every
delta (`vs previous 7 days`) and the period in the exported CSV file name
(`requests-last-7-days.csv`). No card has a period control of its own.

### B. KPI row — `StatTile` (required)

Four tiles: `Requests`, `Data transferred`, `Success rate`, `Status 5xx`. Each shows the period total,
a sparkline and the change against the previous period. `Status 5xx` passes `inverse`, because a rise
is a regression.

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

### H. Expand — `IconButton`, `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `DialogClose`, `PanelContent` (optional)

Opens the card at full size. Icon-only, with an `aria-label` that names the card
(`Expand Requests over time`). It opens one large `Dialog` for the page: the card title as the
`DialogTitle`, its Hint sentence as the `DialogDescription`, the same Line or Bar `ToggleGroup`
(time series only, sharing the card's choice), and the chart at a 420px plot, or the table with ten
rows per page. Closing it returns focus to the Expand button that opened it. While the page loads or
after it failed there is nothing to enlarge, so Expand is disabled.

### I. More options — `DropdownMenu`, `toast` (optional)

`Copy query` and `Export CSV`. Secondary actions go here so the header stays one line. Copy query
writes the GraphQL query behind the card (dataset, sum aggregation, the period as `tsRange`, the
order and the fields) to the clipboard and confirms with a success toast (`Query copied.`), or an
error toast when the clipboard is not available. Export CSV serializes the card's rows with
`toCsv` and saves them with `downloadCsv` from `@aziontech/webkit/utils/csv` as
`<card>-last-24-hours.csv`, then confirms with `CSV exported.` and the file name. Export CSV is
disabled when the card has no rows (Empty, Loading, Failed); Copy query always works. The app
mounts the toast region; this page body never renders a `Toaster`.

### J. Charts — `Chart` (required)

`Requests over time` as an area, `Status codes` as a multi-series line (2xx, 3xx, 4xx, 5xx), and
`Requests by country` as labeled horizontal bars. The series take the categorical role in declaration
order; reserve the status role for a series whose color means a state.

### K. Table search — `Input` (optional)

Searches `Top hosts` (`Search hosts or services`). It filters this table only, so it sits inside the
card, not in the page header.

### L. Top hosts — `TableRoot` (required)

A searchable, paginated table of hosts with tabular figures, right-aligned numbers.

### M. Empty regions — `EmptyState` (required)

Each card keeps its box with its own empty state: `No traffic yet` /
`Metrics appear here once a service serves requests.` for charts, and `No matching rows` /
`Change the search.` when the table search matches nothing.

### N. Product and period — `PageHeader` (optional)

In the Metrics variant one page holds the dashboards of several products. A `PageTabs` strip of `Tabs.Item`s under the `PageHeader` switches the product (`Applications`, `Functions`, `Firewall`, `DNS`, `Data stream`); each product brings its own four tiles and four cards, and the header description changes with it. One `Select` in the header actions (`Last hour`, `Last 24 hours`, `Last 7 days`, `Last 30 days`), named `Period` by its `aria-label`, drives every tile, card and the comparison label of the deltas (`vs previous 7 days`). The interval of the points follows the period: 5 minutes for an hour, 2 hours for a day, a day for a week, 3 days for a month. The period stays when the product changes.

### O. Sub-dashboards and breakdowns — `ToggleGroup`, `Input`, `TableRoot`, `EmptyState` (optional)

In the Metrics variant a product with more than one dashboard shows a medium `ToggleGroup` under the
product tabs, named `<Product> dashboards`. Applications offers `Overview`, `Status codes` and
`Request breakdown`; Firewall offers `Overview` and `Denied sources`. A dashboard picks which cards
it shows and adds breakdown cards: a full-width `ChartCard` with a search `Input` and a paginated
`TableRoot` (five rows, sorted columns). The status breakdown adds a second `ToggleGroup` that
filters by status class (`All`, `2xx`, `3xx`, `4xx`, `5xx`). Changing the product returns to its
Overview; the period stays.

### P. Overview landing — `StatTile`, `ChartCard`, `IconButton`, `Tooltip` (optional)

The MetricsOverview variant is the page before the product dashboards. Six `StatTile`s across
products, then six highlight cards in two columns. Each card keeps the full header (Sum, Line or
Bar, Expand, the more-options menu) and ends in a `ChartCard.Footer` holding one medium `Link`
without icon, `Open <Product> dashboard`, to the product dashboard and view the card came from.
The header actions hold the `Period` `Select` and an outlined Refresh `IconButton` in a `Tooltip`;
Refresh holds the charts at reduced opacity (`refetching`) while the data reloads.

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

- Default: the populated dashboard for the period.
- Loading: every tile, chart and the table hold their place with a `Skeleton`; the grid does not reflow.
- Empty: no traffic in the period; tiles show a dash with no delta or trend, and each card keeps its box with an `EmptyState`.
- Metrics: real-time metrics per product, a `PageTabs` strip of products and a `Period` `Select` in the header; each product shows four tiles and four area, line or stacked bar cards, and products with sub-dashboards switch them with a `ToggleGroup`, adding breakdown table cards.
- Expanded: the Requests over time card open in the large `Dialog`, with the Line or Bar choice and a 420px plot.
- MetricsOverview: six cross-product tiles and six highlight cards, each with a footer link to its product dashboard.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/data-dashboard` — the same grammar for usage per project, with the previous period overlaid.
- `platform/dashboard/configurable-dashboard` — when the reader arranges the cards.
- `platform/dashboard/service-monitoring-dashboard` — latency percentiles and an alert rail.
- `ChartCard` / `StatTile` — the card and tile every dashboard shares.
- `platform/view/split-view` — the events behind these numbers, row by row.
- `platform/edit/edit-resource` (DataStream) — where the streams counted under Data stream are set up.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the first response loads, every tile, chart and the table hold their place with a Skeleton, so the grid does not reflow when data arrives.
- `Empty` — No traffic in the period. The tiles show a dash with no delta or trend, and each card keeps its box with an EmptyState that says nothing was recorded.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.
- `Metrics` — Real-time metrics per product: a PageTabs strip switches between Applications, Functions, Firewall, DNS and Data stream, and a Period Select in the page header (Last hour, Last 24 hours, Last 7 days, Last 30 days) drives every region. Each product shows its own four StatTiles with sparkline and change against the previous period, over four ChartCards of area, line or stacked bar Charts that share one crosshair. Products with more than one dashboard add a ToggleGroup under the tabs: Applications switches between Overview, Status codes (the status card over a status and upstream status table with search and an All, 2xx, 3xx, 4xx, 5xx status-class filter) and Request breakdown (an IP address table with search); Firewall adds Denied sources. Every card menu copies its GraphQL query and exports its rows as CSV.
- `Expanded` — The Requests over time card opened from its Expand button: a large Dialog with the card title and its description, the Line or Bar ToggleGroup shared with the card, and the chart at a 420px plot (the table card opens with ten rows per page). Closing it returns focus to Expand. Every card's menu works: Copy query copies the card's GraphQL query and Export CSV downloads its rows, each confirmed by a toast.
- `MetricsOverview` — The real-time metrics landing page across products: a Period Select and a Refresh button in the page header, six StatTiles (requests, data transferred, cache offload, status 5xx, requests denied, function invocations) with sparkline and change, and six highlight ChartCards from Applications, Firewall and Functions. Each card keeps the full header (Sum Tag, Line or Bar ToggleGroup, Expand into a large Dialog, Copy query and Export CSV) and ends in a footer Link to its product dashboard (Open Applications dashboard).

Each variant is the same screen in another state: `get_pattern("platform/dashboard/analytics-dashboard", { variant })`, or the file under `blocks/platform/dashboard/analytics-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

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
  const period = ref(fallbackPeriod.value)
  const periodLabel = (value: string) => periods.find((entry) => entry.value === value)?.label ?? ''
  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? fallbackPeriod
  )
  const periodComparison = computed(() => currentPeriod.value.comparison)
  const periodSlug = computed(() => currentPeriod.value.label.toLowerCase().replaceAll(' ', '-'))

  type FigureFormat = 'count' | 'bytes' | 'percentage'

  interface Figure {
    id: string
    label: string
    description: string
    value: number | null
    format: FigureFormat
    delta: number | null
    inverse: boolean
    trend: number[]
  }

  interface HostRow {
    id: string
    host: string
    service: string
    requests: number
  }

  interface Variation {
    label: string
    severity: TagSeverity
    icon: string
  }

  interface Variations {
    requests: Variation | null
    statusCodes: Variation | null
  }

  const loading = false

  const figures: Figure[] = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Sum of requests served by every service in the period.',
      value: 48920000,
      format: 'count',
      delta: -1.83,
      inverse: false,
      trend: [
        2029738, 1799252, 1910217, 1633835, 1757364, 1722765, 2157932, 2151290, 2283541, 2397218,
        2545994, 2347243
      ]
    },
    {
      id: 'data-transferred',
      label: 'Data transferred',
      description: 'Sum of data delivered to users by every service in the period.',
      value: 222000000000,
      format: 'bytes',
      delta: -13.26,
      inverse: false,
      trend: [
        7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
        9768346098, 10386911277, 8642195236, 7365365394, 8004529693
      ]
    },
    {
      id: 'success-rate',
      label: 'Success rate',
      description: 'Share of requests that ended in a 2xx or 3xx status.',
      value: 98,
      format: 'percentage',
      delta: 0.42,
      inverse: false,
      trend: [99, 99, 99, 99, 98, 98, 97, 97, 97, 97, 97, 99]
    },
    {
      id: 'status-5xx',
      label: 'Status 5xx',
      description: 'Requests that ended in a server error. A rise is a regression.',
      value: 158600,
      format: 'count',
      delta: -5.47,
      inverse: true,
      trend: [4580, 5509, 4940, 5670, 7151, 9279, 8251, 8242, 8497, 6207, 5685, 5352]
    }
  ]

  const labels = [
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

  const requests: ChartSeries[] = [
    {
      id: 'requests',
      name: 'Requests',
      values: [
        2278608, 2368220, 2548427, 2385746, 2112152, 2214745, 1795004, 1575175, 1640830, 1634383,
        1933593, 2144294
      ]
    }
  ]

  const statusCodes: ChartSeries[] = [
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
        266730, 270925, 287218, 296721, 286635, 245627, 230388, 201140, 188038, 184104, 197071,
        244404
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

  const countries: string[] = ['United States', 'Brazil', 'Germany', 'India', 'Mexico', 'Argentina']

  const countryRequests: ChartSeries[] = [
    {
      id: 'requests',
      name: 'Requests by country',
      values: [1048210, 531620, 118930, 92480, 69870, 48420]
    }
  ]

  const hosts: HostRow[] = [
    {
      id: 'www.example.com',
      host: 'www.example.com',
      service: 'Storefront',
      requests: 1284310
    },
    {
      id: 'api.example.com',
      host: 'api.example.com',
      service: 'Checkout API',
      requests: 712480
    },
    {
      id: 'shop.example.com',
      host: 'shop.example.com',
      service: 'Storefront',
      requests: 498210
    },
    {
      id: 'docs.example.com',
      host: 'docs.example.com',
      service: 'Docs',
      requests: 231640
    },
    {
      id: 'status.example.com',
      host: 'status.example.com',
      service: 'Status page',
      requests: 96120
    },
    {
      id: 'cdn.example.com',
      host: 'cdn.example.com',
      service: 'Media',
      requests: 61870
    },
    {
      id: 'blog.example.com',
      host: 'blog.example.com',
      service: 'Docs',
      requests: 28940
    }
  ]

  const hostColumns: TableColumn[] = [
    {
      id: 'host',
      accessorKey: 'host',
      header: 'Host',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'service',
      accessorKey: 'service',
      header: 'Service',
      align: 'start',
      enableSorting: true
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Requests',
      align: 'end',
      enableSorting: true
    }
  ]

  const variations: Variations = {
    requests: {
      label: '+10.03%',
      severity: 'success',
      icon: 'pi pi-arrow-up-right'
    },
    statusCodes: {
      label: '+14.66%',
      severity: 'success',
      icon: 'pi pi-arrow-up-right'
    }
  }

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

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: (value) => compact.format(value),
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
    fields: string[]
    orderBy: string
  }

  const periodStart = '2026-11-13T11:00:00Z'
  const periodEnd = '2026-11-14T10:59:59Z'

  const cardQuery = (report: CardQuery) =>
    [
      'query {',
      `  ${report.dataset}(`,
      '    limit: 5000',
      '    aggregate: { sum: requests }',
      `    filter: { tsRange: { begin: "${periodStart}", end: "${periodEnd}" } }`,
      `    orderBy: [${report.orderBy}]`,
      '  ) {',
      ...report.fields.map((field) => `    ${field}`),
      '  }',
      '}'
    ].join('\n')

  const copyQuery = async (report: CardQuery) => {
    try {
      await globalThis.navigator.clipboard.writeText(cardQuery(report))
      toast.success('Query copied.', {
        description: 'Paste it into any GraphQL client that sends your token.'
      })
    } catch {
      toast.error('The query could not be copied.')
    }
  }

  type CardId = 'requests' | 'status-codes' | 'countries' | 'hosts'

  const queries: Record<CardId, CardQuery> = {
    requests: { dataset: 'httpMetrics', fields: ['ts', 'requests'], orderBy: 'ts_ASC' },
    'status-codes': {
      dataset: 'httpMetrics',
      fields: ['ts', 'status', 'requests'],
      orderBy: 'ts_ASC'
    },
    countries: {
      dataset: 'httpMetrics',
      fields: ['country', 'requests'],
      orderBy: 'requests_DESC'
    },
    hosts: {
      dataset: 'httpMetrics',
      fields: ['host', 'service', 'requests'],
      orderBy: 'requests_DESC'
    }
  }

  interface CardReport extends CardQuery {
    label: string
    description: string
    columns: CsvColumn[]
    rows: () => object[]
  }

  const seriesRows = (series: readonly ChartSeries[], axis: readonly (string | Date)[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : label,
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const expanded = ref(false)
  const expandedId = ref<CardId>('requests')
  const expandedReport = computed(() => reports[expandedId.value])

  const openExpanded = (id: CardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const onCardOption = (id: CardId, value: string | number) => {
    const report = reports[id]
    if (value === 'query') {
      copyQuery(report)
      return
    }
    const filename = `${id}-${periodSlug.value}.csv`
    downloadCsv(filename, toCsv({ columns: report.columns, rows: report.rows() }))
    toast.success('CSV exported.', { description: filename })
  }

  const reports: Record<CardId, CardReport> = {
    requests: {
      ...queries.requests,
      label: 'Requests over time',
      description: 'Sum of requests served by every service, per interval.',
      columns: [
        { id: 'ts', header: 'Time' },
        { id: 'requests', header: 'Requests' }
      ],
      rows: () => seriesRows(requests, labels)
    },
    'status-codes': {
      ...queries['status-codes'],
      label: 'Status codes',
      description: 'Sum of requests per status class. Switch to Bar to stack the classes.',
      columns: [
        { id: 'ts', header: 'Time' },
        { id: '2xx', header: 'Status 2xx' },
        { id: '3xx', header: 'Status 3xx' },
        { id: '4xx', header: 'Status 4xx' },
        { id: '5xx', header: 'Status 5xx' }
      ],
      rows: () => seriesRows(statusCodes, labels)
    },
    countries: {
      ...queries.countries,
      label: 'Requests by country',
      description: 'Sum of requests per country of origin, top countries first.',
      columns: [
        { id: 'country', header: 'Country' },
        { id: 'requests', header: 'Requests' }
      ],
      rows: () =>
        countries.map((country, index) => ({
          country,
          requests: countryRequests[0]?.values[index] ?? ''
        }))
    },
    hosts: {
      ...queries.hosts,
      label: 'Top hosts',
      description: 'Hosts that served the most requests in the period, with their service.',
      columns: [
        { id: 'host', header: 'Host' },
        { id: 'service', header: 'Service' },
        { id: 'requests', header: 'Requests' }
      ],
      rows: () => hosts
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
              <Select.Option
                v-for="option in periods"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </template>
      </PageHeader>
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="figure in figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
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
              <Hint :text="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Requests over time</ChartCard.Title>
              <Hint text="Sum of requests served by every service, per interval." />
            </span>
            <ChartCard.Controls>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="secondary"
                  size="small"
                  icon="pi pi-calculator"
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
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Requests over time"
                  :disabled="loading"
                  @click="openExpanded('requests')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('requests', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Requests over time"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                    :disabled="loading"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="requests"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar v-if="requestsForm === 'bar'" />
              <Chart.Area v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend totals />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Status codes</ChartCard.Title>
              <Hint text="Sum of requests per status class. Switch to Bar to stack the classes." />
            </span>
            <ChartCard.Controls>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="secondary"
                  size="small"
                  icon="pi pi-calculator"
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
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Status codes"
                  :disabled="loading"
                  @click="openExpanded('status-codes')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('status-codes', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Status codes"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                    :disabled="loading"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="statusCodes"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar
                v-if="statusForm === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend totals />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Requests by country</ChartCard.Title>
              <Hint text="Sum of requests per country of origin, top countries first." />
            </span>
            <ChartCard.Controls>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="secondary"
                  size="small"
                  icon="pi pi-calculator"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Requests by country"
                  :disabled="loading"
                  @click="openExpanded('countries')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('countries', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Requests by country"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                    :disabled="loading"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="countryRequests"
              :labels="countries"
              orientation="horizontal"
              :format-value="formatters.count"
              :height="240"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar labeled />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Top hosts</ChartCard.Title>
              <Hint text="Hosts that served the most requests in the period, with their service." />
            </span>
            <ChartCard.Controls>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="secondary"
                  size="small"
                  icon="pi pi-calculator"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Top hosts"
                  :disabled="loading"
                  @click="openExpanded('hosts')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('hosts', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Top hosts"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                    :disabled="loading"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search hosts or services"
                    aria-label="Search hosts or services"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </div>

              <TableRoot
                v-model:global-filter="search"
                :data="hosts"
                :columns="hostColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="5"
                :rows-per-page-options="[5, 10, 25]"
                header-kind="compact"
                bordered
                :loading="loading"
              >
                <template #empty>
                  <EmptyState
                    key="empty-state-1"
                    v-if="!hosts.length"
                    size="small"
                    icon="pi pi-chart-line"
                    title="No traffic yet"
                    description="Metrics appear here once a service serves requests."
                  />
                  <EmptyState
                    key="empty-state-2"
                    v-else
                    size="small"
                    icon="pi pi-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>

                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
                </template>
              </TableRoot>
            </div>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
    <Dialog
      v-model:open="expanded"
      size="large"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DialogTitle>{{ expandedReport.label }}</DialogTitle>
              <DialogDescription>{{ expandedReport.description }}</DialogDescription>
            </div>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
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
                empty-title="No traffic yet"
                empty-description="Metrics appear here once a service serves requests."
                :aria-label="expandedReport.label"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis kind="x" />
                <Chart.Bar v-if="requestsForm === 'bar'" />
                <Chart.Area v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend totals />
              </Chart>
              <Chart
                key="chart-2"
                v-else-if="expandedId === 'status-codes'"
                :series="statusCodes"
                :labels="labels"
                :format-value="formatters.count"
                :height="420"
                empty-title="No traffic yet"
                empty-description="Metrics appear here once a service serves requests."
                :aria-label="expandedReport.label"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis kind="x" />
                <Chart.Bar
                  v-if="statusForm === 'bar'"
                  stacked
                />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend totals />
              </Chart>
              <Chart
                key="chart-3"
                v-else-if="expandedId === 'countries'"
                :series="countryRequests"
                :labels="countries"
                orientation="horizontal"
                :format-value="formatters.count"
                :height="420"
                empty-title="No traffic yet"
                empty-description="Metrics appear here once a service serves requests."
                :aria-label="expandedReport.label"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis kind="x" />
                <Chart.Bar labeled />
                <Chart.Tooltip />
              </Chart>
              <TableRoot
                v-else
                :data="hosts"
                :columns="hostColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                header-kind="compact"
                bordered
              >
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="pi pi-chart-line"
                    title="No traffic yet"
                    description="Metrics appear here once a service serves requests."
                  />
                </template>

                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
                </template>
              </TableRoot>
            </div>
          </PanelContent>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </div>
</template>
```
