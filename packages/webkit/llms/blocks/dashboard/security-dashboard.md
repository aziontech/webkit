# SecurityDashboard (`dashboard/security-dashboard`)

> The security dashboard pattern: blocked and allowed requests over time, breakdowns by attack category and origin, the top sources and an attention list, under a PageHeader whose Period Select sets the comparison of every delta and the period in each exported CSV name. A row of three StatTiles (Requests blocked, Requests inspected, Block rate, each with its delta against the previous period and a sparkline) sits over a 12-column grid of ChartCards. Matched requests over time plots blocked and logged requests; Needs attention lists the settings and traffic that ask for a decision, each with a severity Tag and one action Link; attack categories and countries read as ranked BarLists, and the top source IPs as a searchable, paginated DataTable. With no rule set in place the tiles stay as dashes and one setup EmptyState that offers Add rule set replaces the grid. Built from `PageHeader`, `StatTile`, `ChartCard`, `Chart`, `BarList`, `Item`, `Tag`, `Link`, `DataTable`, `Hint`, `ToggleGroup`, `DropdownMenu`, `Skeleton`, `EmptyState` and `Button`. The ByActor variant pivots the same blocked and allowed data per actor: a FilterMenu of actor, outcome and category with a destination Input, seven outcome StatTiles, outcomes over time as stacked bars in status colors, breakdowns by actor, category and destination, and a request log DataTable naming the rule that decided each request. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/security-dashboard/security-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/security-dashboard")`
- Components: [Alert](../../components/alert.md), [BarList](../../components/bar-list.md), [Button](../../components/button.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [FilterMenu](../../components/filter-menu.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelHeader`, [Select](../../components/select.md), [SeverityTag](../../components/severity-tag.md), [Skeleton](../../components/skeleton.md), [StatTile](../../components/stat-tile.md), `TableCellStatus`, [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-locale`, `utils/clipboard`, `utils/csv`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

security dashboard; waf dashboard; blocked requests; attack categories; threat origins; top attackers; painel de segurança; requisições bloqueadas; ataques; activity outcomes; requests and decisions; allowed vs blocked; policy decisions dashboard; request log dashboard; outcomes by actor; rule that decided each request; painel de atividades; decisões das regras; permitidos e bloqueados; waf traffic; firewall traffic

The page a reader opens to see what their security rules are doing: how many requests were blocked
and inspected, how blocking moved over time, which attack categories and countries it came from, which
source addresses sent the most, and the short list of settings and traffic that need a decision now.
Needs attention is what makes it more than a report: every entry ends in one action.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

## When to use

- Use security-dashboard for WAF/firewall traffic: blocked vs allowed over time, attack categories, source IPs; ByActor lists each request of known actors with the rule that decided it.
- Security rules (firewall, WAF, bot rules) inspect and block requests, and the reader owns those rules.
- The reader needs the trend and the breakdown, plus a short list of things to fix.
- Source addresses or networks are worth searching individually.

## When not to use

- Alerts with severity and an open queue: use `dashboard/alerts-dashboard`.
- Plain traffic volume and status codes: use `dashboard/analytics-dashboard`.
- Items waiting for a verdict from an asynchronous analysis: use `dashboard/scan-results-dashboard`.

## Building blocks

### A. Page heading and period — `PageHeader`, `Select` (required)

Title `Security` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`. The header actions hold one medium `Select` named `Period` by its `aria-label`
(`Last hour`, `Last 24 hours`, `Last 7 days`, `Last 30 days`); it sets the comparison label of every
delta (`vs previous 7 days`) and the period in the exported CSV file name
(`requests-last-7-days.csv`). No card has a period control of its own.

### B. KPI row — `StatTile` (required)

`Requests blocked`, `Requests inspected`, `Block rate`, each with a sparkline and the change
`vs previous 24 hours`. `Requests blocked` and `Block rate` pass `inverse`: more blocking means more
attacks.

### C. Definitions — `Hint` (required)

One sentence on every tile and card title.

### D. Cards — `ChartCard` (required)

`Matched requests over time` and `Needs attention` share a row; `Blocked requests by attack category`
and `Blocked requests by country` share the next; `Top source IPs by blocked requests` closes it.

### E. Tags — `Tag` (required)

`Sum` and the signed change in each chart header, the open count on Needs attention, and the kind of
each attention entry (`Log only`, `Spike`, `No rules`) with its severity.

### F. Line or Bar — `ToggleGroup` (optional)

Only on `Matched requests over time`.

### G. Control labels — `Tooltip` (required)

Names Expand and More options.

### H. Expand — `IconButton`, `Dialog`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `PanelBody` (optional)

Its `aria-label` names the card (`Expand Matched requests over time`). It opens one large `Dialog`
with the card title, its Hint sentence as the description, and the region at full size: the matched
requests chart at a 420px plot with the same Line or Bar choice, the breakdown `BarList`, or the
source IP table at ten rows per page. Closing it returns focus to Expand. Disabled while loading and
after a failure.

### I. More options — `DropdownMenu`, `toast` (optional)

`Copy query` copies the card's GraphQL query (`securityMetrics`, the period as `tsRange`) and
confirms with `Query copied.`; `Export CSV` saves the card's rows with `toCsv` and `downloadCsv`
from `@aziontech/webkit/utils/csv` and confirms with `CSV exported.` and the file name. Export is
disabled while loading and after a failure; the app mounts the toast region.

### J. Matched requests — `Chart` (required)

`Blocked` and `Logged` over time, in the danger and warning status colors, because each color means a
state.

### K. Needs attention — `Item` (required)

One `Item` per entry: a title that states the problem, one sentence with the evidence, a severity
`Tag` and one action.

### L. Attention action — `Link` (required)

The one move per entry: `Review rules`, `Open security metrics`, `Attach a rule set`.

### M. Breakdowns — `BarList` (required)

Blocked requests by attack category and by country, largest first, each with an `aria-label`.

### N. Search — `Input` (optional)

`Search addresses, networks or attacks` for the source IP table.

### O. Top source IPs — `DataTable` (required)

Searchable and paginated; addresses and counts in tabular figures.

### P. Empty regions — `EmptyState` (required)

Each chart keeps its box (`No matched requests in this period` / `Nothing was recorded in this period.`, and `No blocked requests in this period` on the breakdowns) and the table
says `No matching rows` / `Change the search.` When no rule set exists at all, the Empty variant
replaces the whole grid with one bordered `EmptyState` and its `Add rule set` button.

### Q. Request activity by actor — `PageHeader`, `Select`, `IconButton`, `Input`, `StatTile`, `Hint`, `ChartCard`, `Chart`, `BarList`, `DataTable`, `Tag`, `EmptyState` (optional)

Variant ByActor only; it adds `FilterMenu`, `Button`, `Table` and `SeverityTag` to the page: the same blocked and allowed data, pivoted per known actor, with the rule that
decided each request. Title `Request activity`. The heading's actions hold the time range `Select`
(named `Time range`) and a Refresh `IconButton` (`aria-label="Refresh"`, the block emits `refresh`).
Under it, one `FilterMenu` with three multi-choice fields (Actor, Outcome, Category) in a container
labelled `Filters`, its `FilterMenu.ChipGroup` on the row below, and a destination `Input` named
`Destination host`. The filters are global: every tile, chart, breakdown and the log read them; when
they match nothing, the chart and the log show `No requests match these filters` with an outlined
`Clear filters` `Button`, and the tiles show a dash.

Seven outcome `StatTile`s in a grid labelled `Outcomes` (requests, allowed, blocked, held, approved,
denied, over budget), each with its delta and a `Hint`; pass `inverse` on every outcome where a rise
is bad. Outcomes over time are stacked bars, one series per exclusive outcome in its status color
(allowed success, blocked danger, held warning) — here the color means a state. Three `BarList`s rank
by actor, by category and by destination, largest first. The request log `DataTable` lists time,
actor, outcome (a `TableCellStatus` in the same hue as its series), category, a `SeverityTag`,
destination, method and the rule that decided it; outcome and severity are two different facts.

### R. Load failure — `Alert` (required)

With `error` set, a danger `Alert` with Retry takes the place of each card's content, naming what
did not load (`Couldn't load matched requests over time.`); the card actions disable and the tiles
read as a dash.

### S. Loading placeholders — `Skeleton` (required)

Holds the Needs attention rows during the first load.

### T. Add rule set — `Button` (required)

The primary action of the empty state, linking to the rules page.

## Data

The block takes its records through props and emits every action; it fetches nothing. `SecuritySummary`, `SecurityMetric`, `SecurityMatchedRequests`, `SecuritySourceIp`, `SecurityAttentionEntry`, `SecurityCardChanges`, `SecurityPeriodRange`, `SecurityPeriod`, `SecurityCardId` and `SecurityDashboardProps` are exported from `security-dashboard.vue`, and `sample.ts` holds the sample figures, series, breakdowns, IPs and attention entries the block renders when a data prop is left out (and never while `loading` or `error` is set). Export CSV and Copy query run in the browser on the data the block holds. The ByActor variant is a separate page and keeps its own sample log.

| Prop / model      | Type                       | What it does                                                                                                |
| ----------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `summary`         | `SecuritySummary`          | The three tiles: value, change and sparkline. A `null` value shows a dash.                                  |
| `matchedRequests` | `SecurityMatchedRequests`  | The Blocked and Logged series with their labels.                                                            |
| `categories`      | `BarListItem[]`            | Blocked requests by attack category.                                                                        |
| `countries`       | `BarListItem[]`            | Blocked requests by country.                                                                                |
| `sourceIps`       | `SecuritySourceIp[]`       | The Top source IPs rows; the search runs on them in the browser.                                            |
| `attention`       | `SecurityAttentionEntry[]` | The Needs attention list, each with the link that resolves it.                                              |
| `changes`         | `SecurityCardChanges`      | Each card's change against the previous period, in percent; a rise is danger, a fall success.               |
| `range`           | `SecurityPeriodRange`      | The start and end of the period, written into the copied query.                                             |
| `loading`         | `boolean`                  | The period is loading: tiles, charts and the table show Skeletons, the card actions disable.                |
| `error`           | `string`                   | Why the request failed, shown after `Couldn't load matched requests over time.` (…) in each danger `Alert`. |
| `v-model:period`  | `SecurityPeriod`           | The period the tiles compare against; refetch when it changes. Defaults to `24h`.                           |

Every region empty (`[]` lists and no series) is the no-rule-set state: one `EmptyState` with `Add rule set` replaces the grid.

| Event   | Payload   | When                              |
| ------- | --------- | --------------------------------- |
| `retry` | `(event)` | Retry in any of the error alerts. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import SecurityDashboard, { type SecurityPeriod } from './security-dashboard.vue'

  const period = ref<SecurityPeriod>('24h')
  const { data, pending, error, refresh } = useSecurityMetrics(period)
</script>

<template>
  <SecurityDashboard
    v-model:period="period"
    :summary="data?.summary"
    :matched-requests="data?.matched"
    :categories="data?.categories ?? []"
    :countries="data?.countries ?? []"
    :source-ips="data?.sourceIps ?? []"
    :attention="data?.attention ?? []"
    :changes="data?.changes"
    :range="data?.range"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- End every Needs attention entry with exactly one action.
- Mark blocking metrics as `inverse`.
- Replace the grid with one setup empty state when no rule exists; empty charts would only repeat it.
- Keep the attention list short; it is a queue, not a log.

## Don't

- Don't use the danger color for a categorical breakdown such as countries.
- Don't put more than one action on an attention entry.
- Don't show the full grid of empty charts when the cause is a missing rule set.

## Copy

- **Title:** `Security`. **Description:** `Requests your rules blocked and inspected, and the settings that need a decision.`
- **Attention title:** the problem as a statement. `Service without a rule set`.
- **Attention description:** one sentence of evidence with a figure. `SQL injection against the API rose 64% in the last hour.`
- **Attention action:** verb first. `Review rules`, `Attach a rule set`.
- **Kind tag:** two words at most. `Log only`, `Spike`, `No rules`.
- **ByActor:** title `Request activity`, description `What each actor requested through the rules and what the rules decided.`; outcome tags are one past participle (`Allowed`, `Blocked`, `Held`); no match `No requests match these filters` / `Clear the filters or pick other values.`
- **Setup empty state:** `No security rules protect your services` / `Security metrics and the Needs attention list appear once a rule set protects a service.`, action `Add rule set`.

## Accessibility

- Every icon-only control has an `aria-label` that names its card, plus a `Tooltip`.
- The search `Input` has an `aria-label` equal to its placeholder.
- The expanded `Dialog` traps focus, closes on Escape and returns focus to the Expand button.
- Severity is a word in the `Tag`, not color alone.
- Figures use `tabular-nums`.

## States

- Default: rules in place, populated tiles, charts, attention list and table.
- Loading: `loading`; every tile, chart and the table hold a `Skeleton`; Needs attention shows three placeholder rows.
- Empty: no rule set yet (every list `[]`, tiles with `null` values); tiles read as dashes and one bordered `EmptyState` offers `Add rule set` instead of a grid of empty charts.
- ByActor: request activity per actor with the rule that decided each request; NoMatch is a state of it.
- Error: `error`; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `dashboard/alerts-dashboard` — the alert queue raised by these rules.
- `dashboard/scan-results-dashboard` — verdicts from an asynchronous analysis.
- `view/table-view` — the request log on its own, as a filterable list page.
- `edit/rule-builder` — where a rule set is edited.

## Variants

- `Default` — primary (the code below)
- `Loading` — The first load: every tile, chart and the table hold a Skeleton, and Needs attention shows three placeholder rows.
- `Empty` — No security rules set up yet: the tiles read as dashes, and one bordered EmptyState names the reason and offers Add rule set instead of a grid of empty charts.
- `Error` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.
- `ByActor` — Request activity per actor: a Time range Select and a Refresh IconButton in the header over a FilterMenu (actor, outcome, category) with its chips and a destination Input; seven outcome StatTiles (requests, allowed, blocked, held, approved, denied, over budget), outcomes over time as stacked bars in status colors, three BarList breakdowns (actor, category, destination) and a request log DataTable with an outcome Tag, a SeverityTag and the rule that decided each request. A filter that matches nothing shows Clear filters.

Each variant is the same screen in another state: `get_block("dashboard/security-dashboard", { variant })`, or the file under `blocks/dashboard/security-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
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
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { copyText } from '@aziontech/webkit/utils/clipboard'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  import {
    sampleAttention,
    sampleCardChanges,
    sampleCategories,
    sampleCountries,
    sampleMatchedRequests,
    samplePeriodRange,
    sampleSourceIps,
    sampleSummary
  } from './sample'

  /** The period every region reads. */
  export type SecurityPeriod = '1h' | '24h' | '7d' | '30d'
  /** The cards with a menu and an expanded view. */
  export type SecurityCardId = 'matched' | 'categories' | 'countries' | 'ips'

  /** One summary figure with its comparison. */
  export interface SecurityMetric {
    /** The figure; null shows a dash. */
    value: number | null
    /** Change against the previous period, in percent; null hides it. */
    delta: number | null
    /** The figure over the period, for the sparkline, null for an interval with no data. */
    trend: (number | null)[]
  }

  /** The three summary tiles. */
  export interface SecuritySummary {
    /** Requests blocked as attacks. */
    blocked: SecurityMetric
    /** Requests checked against the rules. */
    inspected: SecurityMetric
    /** Share of inspected requests blocked, in percent. */
    blockRate: SecurityMetric
  }

  /** The Matched requests chart over the period. */
  export interface SecurityMatchedRequests {
    /** One label per point of the x axis. */
    labels: ChartLabel[]
    /** The Blocked and Logged series. */
    series: ChartSeries[]
  }

  /** One row of the Top source IPs table. */
  export interface SecuritySourceIp {
    /** Stable key. */
    id: string
    /** The address. */
    remoteAddress: string
    /** Its network, with the AS number. */
    asn: string
    /** The country it came from. */
    country: string
    /** The attack category it matched most. */
    category: string
    /** Blocked requests from it in the period. */
    requests: number
  }

  /** One entry of the Needs attention list. */
  export interface SecurityAttentionEntry {
    /** Stable key. */
    id: string
    /** Icon class. */
    icon: string
    /** What needs a decision. */
    title: string
    /** The detail. */
    description: string
    /** Color of the tag. */
    severity: TagSeverity
    /** Short tag text. */
    tag: string
    /** The link that resolves it. */
    action: { label: string; href: string }
  }

  /** Change of each card's sum against the previous period, in percent. */
  export type SecurityCardChanges = Record<SecurityCardId, number>

  /** The start and end of the period, as ISO dates, used in the copied query. */
  export interface SecurityPeriodRange {
    /** Start of the period. */
    begin: string
    /** End of the period. */
    end: string
  }

  export interface SecurityDashboardProps {
    /** The three summary tiles. Left out, the sample renders. */
    summary?: SecuritySummary
    /** The Matched requests chart. Left out, the sample renders. */
    matchedRequests?: SecurityMatchedRequests
    /** Blocked requests by attack category. Left out, the sample renders. */
    categories?: BarListItem[]
    /** Blocked requests by country. Left out, the sample renders. */
    countries?: BarListItem[]
    /** The Top source IPs rows. Left out, the sample renders. */
    sourceIps?: SecuritySourceIp[]
    /** The Needs attention list. Left out, the sample renders. */
    attention?: SecurityAttentionEntry[]
    /** Change of each card's sum against the previous period. Left out, the sample renders. */
    changes?: SecurityCardChanges
    /** The start and end of the period. Left out, the sample renders. */
    range?: SecurityPeriodRange
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<SecurityDashboardProps>(), {
    summary: undefined,
    matchedRequests: undefined,
    categories: undefined,
    countries: undefined,
    sourceIps: undefined,
    attention: undefined,
    changes: undefined,
    range: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  const period = defineModel<SecurityPeriod>('period', { default: '24h' })

  const noMetric: SecurityMetric = { value: null, delta: null, trend: [] }
  const blocked = computed(() => props.loading || props.error !== '')
  const summary = computed<SecuritySummary>(
    () =>
      props.summary ??
      (blocked.value
        ? { blocked: noMetric, inspected: noMetric, blockRate: noMetric }
        : sampleSummary)
  )
  const matched = computed<SecurityMatchedRequests>(
    () =>
      props.matchedRequests ?? (blocked.value ? { labels: [], series: [] } : sampleMatchedRequests)
  )
  const categories = computed(() => props.categories ?? (blocked.value ? [] : sampleCategories))
  const countries = computed(() => props.countries ?? (blocked.value ? [] : sampleCountries))
  const sourceIps = computed(() => props.sourceIps ?? (blocked.value ? [] : sampleSourceIps))
  const attention = computed(() => props.attention ?? (blocked.value ? [] : sampleAttention))
  const changes = computed(() => props.changes ?? (blocked.value ? null : sampleCardChanges))
  const range = computed(() => props.range ?? samplePeriodRange)
  const empty = computed(
    () =>
      !blocked.value &&
      matched.value.series.length === 0 &&
      categories.value.length === 0 &&
      countries.value.length === 0 &&
      sourceIps.value.length === 0 &&
      attention.value.length === 0
  )

  const changeTag = (id: SecurityCardId) => {
    const change = changes.value?.[id]
    if (change === undefined) return null
    const rising = change > 0
    return {
      label: `${rising ? '+' : ''}${change.toFixed(2)}%`,
      severity: (rising ? 'danger' : 'success') as TagSeverity,
      icon: rising ? 'az az-arrow-up-right' : 'az az-arrow-down-left'
    }
  }

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

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  const formatCount = (value: number) => compact(value)
  const formatPercent = (value: number) => `${value.toFixed(value >= 10 ? 0 : 1)}%`

  const ipColumns: TableColumn[] = [
    {
      accessorKey: 'remoteAddress',
      id: 'remoteAddress',
      header: 'IP address',
      align: 'start',
      sortable: true,
      principal: true
    },
    {
      accessorKey: 'asn',
      id: 'asn',
      header: 'Network',
      align: 'start',
      sortable: true,
      principal: false
    },
    {
      accessorKey: 'country',
      id: 'country',
      header: 'Country',
      align: 'start',
      sortable: true,
      principal: false
    },
    {
      accessorKey: 'category',
      id: 'category',
      header: 'Main attack',
      align: 'start',
      sortable: true,
      principal: false
    },
    {
      accessorKey: 'requests',
      id: 'requests',
      header: 'Blocked requests',
      align: 'end',
      sortable: true,
      principal: false
    }
  ]
  const forms = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const form = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  interface CardQuery {
    dataset: string
    fields: string[]
    orderBy: string
  }

  const cardQuery = (report: CardQuery) =>
    [
      'query {',
      `  ${report.dataset}(`,
      '    limit: 5000',
      '    aggregate: { sum: requests }',
      `    filter: { tsRange: { begin: "${range.value.begin}", end: "${range.value.end}" } }`,
      `    orderBy: [${report.orderBy}]`,
      '  ) {',
      ...report.fields.map((field) => `    ${field}`),
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

  const queries: Record<SecurityCardId, CardQuery> = {
    matched: {
      dataset: 'securityMetrics',
      fields: ['ts', 'action', 'requests'],
      orderBy: 'ts_ASC'
    },
    categories: {
      dataset: 'securityMetrics',
      fields: ['attackCategory', 'requests'],
      orderBy: 'requests_DESC'
    },
    countries: {
      dataset: 'securityMetrics',
      fields: ['country', 'requests'],
      orderBy: 'requests_DESC'
    },
    ips: {
      dataset: 'securityMetrics',
      fields: ['remoteAddress', 'asn', 'country', 'attackCategory', 'requests'],
      orderBy: 'requests_DESC'
    }
  }

  interface CardReport extends CardQuery {
    label: string
    description: string
    columns: CsvColumn[]
    rows: () => object[]
  }

  const seriesRows = (series: readonly ChartSeries[], axis: readonly ChartLabel[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : String(label),
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const expanded = ref(false)
  const expandedId = ref<SecurityCardId>('matched')
  const expandedReport = computed(() => reports[expandedId.value])

  const openExpanded = (id: SecurityCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const onCardOption = (id: SecurityCardId, value: string | number) => {
    const report = reports[id]
    if (value === 'query') {
      copyQuery(report)
      return
    }
    const filename = `${id}-${periodSlug.value}.csv`
    downloadCsv(filename, toCsv({ columns: report.columns, rows: report.rows() }))
    toast.success('CSV exported.', { description: filename })
  }

  const reports: Record<SecurityCardId, CardReport> = {
    matched: {
      ...queries.matched,
      label: 'Matched requests over time',
      description: 'Requests that matched a rule: blocked, or logged and allowed through.',
      columns: [
        { header: 'Time', id: 'ts' },
        { header: 'Blocked', id: 'blocked' },
        { header: 'Logged', id: 'logged' }
      ],
      rows: () => seriesRows(matched.value.series, matched.value.labels)
    },
    categories: {
      ...queries.categories,
      label: 'Blocked requests by attack category',
      description: 'Blocked requests, broken down by the attack category of the rule they matched.',
      columns: [
        { header: 'Attack category', id: 'name' },
        { header: 'Blocked requests', id: 'value' }
      ],
      rows: () => categories.value
    },
    countries: {
      ...queries.countries,
      label: 'Blocked requests by country',
      description: 'Blocked requests, broken down by the country they came from.',
      columns: [
        { header: 'Country', id: 'name' },
        { header: 'Blocked requests', id: 'value' }
      ],
      rows: () => countries.value
    },
    ips: {
      ...queries.ips,
      label: 'Top source IPs by blocked requests',
      description: 'The addresses blocked most often, with their network and main attack.',
      columns: [
        { header: 'IP address', id: 'remoteAddress' },
        { header: 'Network', id: 'asn' },
        { header: 'Country', id: 'country' },
        { header: 'Main attack', id: 'category' },
        { header: 'Blocked requests', id: 'requests' }
      ],
      rows: () => sourceIps.value
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Security"
        description="Requests your rules blocked and inspected, and the settings that need a decision."
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
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests blocked"
            :value="summary.blocked.value"
            :format-value="formatCount"
            :delta="summary.blocked.delta"
            :delta-label="periodComparison"
            inverse
            :trend="summary.blocked.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint
                content="Requests a security rule identified as attacks and blocked before they reached a service."
              />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests inspected"
            :value="summary.inspected.value"
            :format-value="formatCount"
            :delta="summary.inspected.delta"
            :delta-label="periodComparison"
            :trend="summary.inspected.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint content="Requests checked against security rules across every service." />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Block rate"
            :value="summary.blockRate.value"
            :format-value="formatPercent"
            :delta="summary.blockRate.delta"
            :delta-label="periodComparison"
            inverse
            :trend="summary.blockRate.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint content="Share of inspected requests blocked as attacks." />
            </template>
          </StatTile>
        </li>
      </ul>
      <EmptyState
        v-if="empty"
        title="No security rules protect your services"
        description="Security metrics and the Needs attention list appear once a rule set protects a service."
        icon="az az-shield"
        bordered
      >
        <template #actions>
          <Button
            label="Add rule set"
            variant="primary"
            size="medium"
            icon="az az-plus"
            href="/security/rules"
          />
        </template>
      </EmptyState>
      <div
        v-else
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Matched requests over time</ChartCard.Title>
              <Hint
                content="Requests that matched a rule: blocked, or logged and allowed through."
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
                  v-if="changeTag('matched')"
                  :label="changeTag('matched')?.label"
                  :severity="changeTag('matched')?.severity"
                  :icon="changeTag('matched')?.icon"
                  size="small"
                />
                <ToggleGroup
                  v-model="form"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Matched requests over time"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Matched requests over time"
                  :disabled="blocked"
                  @click="openExpanded('matched')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('matched', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Matched requests over time"
                    :disabled="blocked"
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
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load matched requests over time. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              v-model:active-index="activeIndex"
              :series="matched.series"
              :labels="matched.labels"
              :format-value="formatCount"
              empty-title="No matched requests in this period"
              empty-description="Nothing was recorded in this period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar
                v-if="form === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Needs attention</ChartCard.Title>
              <Hint content="Settings and traffic on your services that ask for a decision." />
            </span>
            <ChartCard.Action v-if="!blocked">
              <Tag
                :label="`${attention.length} open`"
                severity="neutral"
                size="small"
              />
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load the attention list. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else-if="loading"
              class="flex flex-col gap-(--spacing-md)"
            >
              <div
                v-for="row in 3"
                :key="row"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <Skeleton
                  width="60%"
                  height="0.875rem"
                />
                <Skeleton
                  width="90%"
                  height="0.75rem"
                />
              </div>
            </div>
            <Item.List v-else>
              <Item
                v-for="entry in attention"
                :key="entry.id"
                role="listitem"
                variant="inline"
                size="small"
              >
                <Item.Media>
                  <i
                    :class="entry.icon"
                    class="text-body-sm leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ entry.title }}</Item.Title>
                  <Item.Description>{{ entry.description }}</Item.Description>
                  <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                    <Tag
                      :label="entry.tag"
                      :severity="entry.severity"
                      size="small"
                    />
                    <Link
                      :label="entry.action.label"
                      :href="entry.action.href"
                      size="small"
                    />
                  </span>
                </Item.Content>
              </Item>
            </Item.List>
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Blocked requests by attack category</ChartCard.Title>
              <Hint
                content="Blocked requests, broken down by the attack category of the rule they matched."
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
                  v-if="changeTag('categories')"
                  :label="changeTag('categories')?.label"
                  :severity="changeTag('categories')?.severity"
                  :icon="changeTag('categories')?.icon"
                  size="small"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Blocked requests by attack category"
                  :disabled="blocked"
                  @click="openExpanded('categories')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('categories', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Blocked requests by attack category"
                    :disabled="blocked"
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
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load blocked requests by attack category. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
              :items="categories"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              :loading="loading"
              aria-label="Blocked requests by attack category"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Blocked requests by country</ChartCard.Title>
              <Hint content="Blocked requests, broken down by the country they came from." />
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
                  v-if="changeTag('countries')"
                  :label="changeTag('countries')?.label"
                  :severity="changeTag('countries')?.severity"
                  :icon="changeTag('countries')?.icon"
                  size="small"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Blocked requests by country"
                  :disabled="blocked"
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
                    aria-label="More options for Blocked requests by country"
                    :disabled="blocked"
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
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load blocked requests by country. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
              :items="countries"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              :loading="loading"
              aria-label="Blocked requests by country"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Top source IPs by blocked requests</ChartCard.Title>
              <Hint
                content="The addresses blocked most often, with their network and main attack."
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
                <Tag
                  v-if="changeTag('ips')"
                  :label="changeTag('ips')?.label"
                  :severity="changeTag('ips')?.severity"
                  :icon="changeTag('ips')?.icon"
                  size="small"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="az az-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Top source IPs by blocked requests"
                  :disabled="blocked"
                  @click="openExpanded('ips')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('ips', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="az az-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Top source IPs by blocked requests"
                    :disabled="blocked"
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
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load top source IPs by blocked requests. ${error}`"
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
                    placeholder="Search addresses, networks or attacks"
                    aria-label="Search addresses, networks or attacks"
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
                :data="sourceIps"
                :columns="ipColumns"
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
                    size="small"
                    icon="az az-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>
                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
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
            <template v-if="expandedId === 'matched'">
              <div>
                <ToggleGroup
                  v-model="form"
                  :options="forms"
                  size="small"
                  :aria-label="`Chart form for ${expandedReport.label}`"
                />
              </div>
              <Chart
                :series="matched.series"
                :labels="matched.labels"
                :format-value="formatCount"
                :height="420"
                empty-title="No matched requests in this period"
                empty-description="Nothing was recorded in this period."
                :aria-label="expandedReport.label"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis type="x" />
                <Chart.Bar
                  v-if="form === 'bar'"
                  stacked
                />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend total />
              </Chart>
            </template>
            <BarList
              v-else-if="expandedId === 'categories' || expandedId === 'countries'"
              :items="expandedId === 'categories' ? categories : countries"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              :aria-label="expandedReport.label"
            />
            <DataTable
              v-else
              :data="sourceIps"
              :columns="ipColumns"
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
                  icon="az az-shield"
                  title="No blocked requests in this period"
                  description="Nothing was recorded in this period."
                />
              </template>
              <template #cell-requests="{ row }">
                <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
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
import type { BarListItem } from '@aziontech/webkit/bar-list'

import type {
  SecurityAttentionEntry,
  SecurityCardChanges,
  SecurityMatchedRequests,
  SecurityPeriodRange,
  SecuritySourceIp,
  SecuritySummary
} from './security-dashboard.vue'

export const sampleSummary: SecuritySummary = {
  blocked: {
    value: 49277,
    delta: 6.76,
    trend: [
      2547, 2598, 2722, 2380, 2434, 2481, 2396, 2333, 2051, 1803, 1877, 1809, 1903, 1705, 1524,
      1496, 1576, 1830, 1771, 1883, 1818, 1941, 2304, 2095
    ]
  },
  inspected: {
    value: 2273686,
    delta: 0.93,
    trend: [
      71719, 69758, 73190, 78995, 79204, 76566, 88893, 95004, 94033, 105848, 109796, 104325, 101445,
      117083, 110447, 117449, 113337, 110448, 101923, 98948, 89588, 93348, 85977, 86362
    ]
  },
  blockRate: {
    value: 2.19,
    delta: 17.07,
    trend: [
      2.46, 2.27, 2.33, 2.15, 2.2, 1.92, 2.06, 1.82, 1.76, 1.71, 1.83, 1.83, 1.89, 1.95, 2.16, 2.25,
      2.32, 2.31, 2.44, 2.54, 2.62, 2.63, 2.53, 2.62
    ]
  }
}

export const sampleEmptySummary: SecuritySummary = {
  blocked: { value: null, delta: null, trend: [] },
  inspected: { value: null, delta: null, trend: [] },
  blockRate: { value: null, delta: null, trend: [] }
}

export const sampleMatchedRequests: SecurityMatchedRequests = {
  labels: Array.from({ length: 24 }, (_, index) => new Date(Date.UTC(2026, 10, 9, index))),
  series: [
    {
      id: 'blocked',
      name: 'Blocked',
      color: 'danger',
      values: [
        1756, 2105, 1796, 2353, 2384, 2162, 2364, 2363, 2505, 2459, 2556, 2308, 2369, 2045, 1937,
        1999, 1679, 1838, 1773, 1812, 1698, 1314, 1494, 1839
      ]
    },
    {
      id: 'logged',
      name: 'Logged',
      color: 'warning',
      values: [
        485, 472, 605, 637, 609, 606, 778, 776, 705, 723, 754, 636, 571, 692, 619, 453, 487, 407,
        450, 378, 405, 416, 375, 369
      ]
    }
  ]
}

export const sampleCategories: BarListItem[] = [
  { id: 'SQL injection', name: 'SQL injection', value: 18420 },
  { id: 'Cross-site scripting', name: 'Cross-site scripting', value: 12960 },
  { id: 'Path traversal', name: 'Path traversal', value: 7310 },
  { id: 'Remote file inclusion', name: 'Remote file inclusion', value: 4180 },
  { id: 'Command injection', name: 'Command injection', value: 3240 },
  { id: 'Scanner probes', name: 'Scanner probes', value: 1870 }
]

export const sampleCountries: BarListItem[] = [
  { id: 'United States', name: 'United States', value: 14820 },
  { id: 'Brazil', name: 'Brazil', value: 10640 },
  { id: 'Germany', name: 'Germany', value: 6130 },
  { id: 'Netherlands', name: 'Netherlands', value: 4270 },
  { id: 'India', name: 'India', value: 3480 },
  { id: 'Singapore', name: 'Singapore', value: 2190 },
  { id: 'France', name: 'France', value: 1460 }
]

export const sampleSourceIps: SecuritySourceIp[] = [
  {
    id: '203.0.113.42',
    remoteAddress: '203.0.113.42',
    asn: 'AS64496 Hosting provider',
    country: 'Netherlands',
    category: 'SQL injection',
    requests: 4120
  },
  {
    id: '198.51.100.17',
    remoteAddress: '198.51.100.17',
    asn: 'AS64497 Anonymizing proxy',
    country: 'Germany',
    category: 'Cross-site scripting',
    requests: 3640
  },
  {
    id: '192.0.2.159',
    remoteAddress: '192.0.2.159',
    asn: 'AS64498 Unmanaged network',
    country: 'Romania',
    category: 'Path traversal',
    requests: 2910
  },
  {
    id: '203.0.113.172',
    remoteAddress: '203.0.113.172',
    asn: 'AS64496 Hosting provider',
    country: 'Netherlands',
    category: 'SQL injection',
    requests: 2480
  },
  {
    id: '198.51.100.139',
    remoteAddress: '198.51.100.139',
    asn: 'AS64499 VPN service',
    country: 'Seychelles',
    category: 'Command injection',
    requests: 1960
  },
  {
    id: '192.0.2.221',
    remoteAddress: '192.0.2.221',
    asn: 'AS64500 Research scanner',
    country: 'United States',
    category: 'Scanner probes',
    requests: 1390
  },
  {
    id: '198.51.100.130',
    remoteAddress: '198.51.100.130',
    asn: 'AS64501 Cloud provider',
    country: 'United States',
    category: 'Remote file inclusion',
    requests: 1120
  },
  {
    id: '192.0.2.23',
    remoteAddress: '192.0.2.23',
    asn: 'AS64502 Residential ISP',
    country: 'United States',
    category: 'Cross-site scripting',
    requests: 860
  }
]

export const sampleAttention: SecurityAttentionEntry[] = [
  {
    id: 'log-only',
    icon: 'az az-eye',
    title: 'A rule set logs requests it does not block',
    description: 'The shop service runs its rule set in log-only mode: 1.2K requests passed.',
    severity: 'warning',
    tag: 'Log only',
    action: { label: 'Review rules', href: '/security/rules' }
  },
  {
    id: 'spike',
    icon: 'az az-chart-line',
    title: 'Attack spike on api.example.com',
    description: 'SQL injection against the API rose 64% in the last hour.',
    severity: 'danger',
    tag: 'Spike',
    action: { label: 'Open security metrics', href: '/metrics/security' }
  },
  {
    id: 'no-rules',
    icon: 'az az-shield',
    title: 'Service without a rule set',
    description: 'The docs service has no security rule set attached.',
    severity: 'warning',
    tag: 'No rules',
    action: { label: 'Attach a rule set', href: '/security/rules' }
  }
]

export const sampleCardChanges: SecurityCardChanges = {
  matched: 19.01,
  categories: -0.03,
  countries: 9.33,
  ips: -6.79
}

export const samplePeriodRange: SecurityPeriodRange = {
  begin: '2026-11-09T00:00:00Z',
  end: '2026-11-09T23:59:59Z'
}
```
