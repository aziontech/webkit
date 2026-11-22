# DashboardSecurity (`dashboard/dashboard-security`)

> The security dashboard pattern: blocked and allowed requests over time, breakdowns by attack category and origin, the top sources and an attention list, under a PageHeader whose Period Select sets the comparison of every delta and the period in each exported CSV name. A row of three StatTiles (Requests blocked, Requests inspected, Block rate, each with its delta against the previous period and a sparkline) sits over a 12-column grid of ChartCards. Matched requests over time plots blocked and logged requests; Needs attention lists the settings and traffic that ask for a decision, each with a severity Tag and one action Link; attack categories and countries read as ranked BarLists, and the top source IPs as a searchable, paginated DataTable. With no rule set in place the tiles stay as dashes and one setup EmptyState that offers Add rule set replaces the grid. Built from `PageHeader`, `StatTile`, `ChartCard`, `Chart`, `BarList`, `Item`, `Tag`, `Link`, `DataTable`, `Hint`, `ToggleGroup`, `DropdownMenu`, `Skeleton`, `EmptyState` and `Button`. The ByActor variant pivots the same blocked and allowed data per actor: a FilterMenu of actor, outcome and category with a destination Input, seven outcome StatTiles, outcomes over time as stacked bars in status colors, breakdowns by actor, category and destination, and a request log DataTable naming the rule that decided each request. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-security/dashboard-security.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-security")`
- Components: [Alert](../../components/alert.md), [BarList](../../components/bar-list.md), [Button](../../components/button.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [FilterMenu](../../components/filter-menu.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelHeader`, [Select](../../components/select.md), [SeverityTag](../../components/severity-tag.md), [Skeleton](../../components/skeleton.md), [StatTile](../../components/stat-tile.md), `TableCellStatus`, [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-collection`, `use-locale`, `utils/clipboard`, `utils/csv`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

security dashboard; waf dashboard; blocked requests; attack categories; threat origins; top attackers; painel de segurança; requisições bloqueadas; ataques; activity outcomes; requests and decisions; allowed vs blocked; policy decisions dashboard; request log dashboard; outcomes by actor; rule that decided each request; painel de atividades; decisões das regras; permitidos e bloqueados; waf traffic; firewall traffic

The page a reader opens to see what their security rules are doing: how many requests were blocked
and inspected, how blocking moved over time, which attack categories and countries it came from, which
source addresses sent the most, and the short list of settings and traffic that need a decision now.
Needs attention is what makes it more than a report: every entry ends in one action.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-security for WAF/firewall traffic: blocked vs allowed over time, attack categories, source IPs; ByActor lists each request of known actors with the rule that decided it.
- Security rules (firewall, WAF, bot rules) inspect and block requests, and the reader owns those rules.
- The reader needs the trend and the breakdown, plus a short list of things to fix.
- Source addresses or networks are worth searching individually.

## When not to use

- Alerts with severity and an open queue: use `dashboard/dashboard-alerts`.
- Plain traffic volume and status codes: use `dashboard/dashboard-analytics`.
- Items waiting for a verdict from an asynchronous analysis: use `dashboard/dashboard-scan-results`.

## Building blocks

### A. Page heading and period — `PageHeader`, `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

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

The block takes its records through props and emits every action; it fetches nothing. `SecuritySummary`, `SecurityMetric`, `SecurityMatchedRequests`, `SecuritySourceIp`, `SecurityAttentionEntry`, `SecurityCardChanges`, `SecurityPeriodRange`, `SecurityPeriod`, `SecurityCardId` and `SecurityDashboardProps` are exported from `dashboard-security.vue`, and `sample.ts` holds the sample figures, series, breakdowns, IPs and attention entries the block renders when a data prop is left out (and never while `loading` or `error` is set). Export CSV and Copy query run in the browser on the data the block holds. The ByActor variant is a separate page and keeps its own sample log.

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
  import DashboardSecurity, { type SecurityPeriod } from './dashboard-security.vue'

  const period = ref<SecurityPeriod>('24h')
  const { data, pending, error, refresh } = useSecurityMetrics(period)
</script>

<template>
  <DashboardSecurity
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

- `dashboard/dashboard-alerts` — the alert queue raised by these rules.
- `dashboard/dashboard-scan-results` — verdicts from an asynchronous analysis.
- `view/view-table` — the request log on its own, as a filterable list page.
- `edit/edit-rule-builder` — where a rule set is edited.

## Variants

- `Default` — primary (the code below)
- `Loading` — The first load: every tile, chart and the table hold a Skeleton, and Needs attention shows three placeholder rows.
- `Empty` — No security rules set up yet: the tiles read as dashes, and one bordered EmptyState names the reason and offers Add rule set instead of a grid of empty charts.
- `Error` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.
- `ByActor` — Request activity per actor: a Time range Select and a Refresh IconButton in the header over a FilterMenu (actor, outcome, category) with its chips and a destination Input; seven outcome StatTiles (requests, allowed, blocked, held, approved, denied, over budget), outcomes over time as stacked bars in status colors, three BarList breakdowns (actor, category, destination) and a request log DataTable with an outcome Tag, a SeverityTag and the rule that decided each request. A filter that matches nothing shows Clear filters.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-security", { variant })`, or the file under `blocks/dashboard/dashboard-security/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import type { ChartLabel, ChartSeries } from '@aziontech/webkit/chart'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import AttentionCard from './parts/attention-card.vue'
  import MatchedChart from './parts/matched-chart.vue'
  import SecurityCard from './parts/security-card.vue'
  import SecurityDialog from './parts/security-dialog.vue'
  import SourceIpSearch from './parts/source-ip-search.vue'
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
  import { runSecurityOption, securityCards, securityQuery } from './security-cards'

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

  const formatCount = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  const formatPercent = (value: number) => `${value.toFixed(value >= 10 ? 0 : 1)}%`

  const forms = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const form = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  const seriesRows = (series: readonly ChartSeries[], axis: readonly ChartLabel[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : String(label),
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const cardRows: Record<SecurityCardId, () => object[]> = {
    matched: () => seriesRows(matched.value.series, matched.value.labels),
    categories: () => categories.value,
    countries: () => countries.value,
    ips: () => sourceIps.value
  }

  const expanded = ref(false)
  const expandedId = ref<SecurityCardId>('matched')

  const openExpanded = (id: SecurityCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const card = (id: SecurityCardId) => ({
    title: securityCards[id].label,
    hint: securityCards[id].description,
    subject: securityCards[id].subject,
    change: changeTag(id),
    blocked: blocked.value,
    error: props.error
  })

  const onCardOption = (id: SecurityCardId, value: string | number) =>
    runSecurityOption(value, {
      query: securityQuery(securityCards[id], range.value),
      filename: `${id}-${periodSlug.value}.csv`,
      columns: securityCards[id].columns,
      rows: cardRows[id]
    })

  const barCards = ['categories', 'countries'] as const
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
            variant="ghost"
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
            :error="error"
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
            :error="error"
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
            :error="error"
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
        <SecurityCard
          v-model:form="form"
          :span="8"
          v-bind="card('matched')"
          :forms="forms"
          @expand="openExpanded('matched')"
          @select="(_event, value) => onCardOption('matched', value)"
          @retry="(event) => emit('retry', event)"
        >
          <MatchedChart
            v-model:active-index="activeIndex"
            :matched="matched"
            :format-value="formatCount"
            :bar="form === 'bar'"
            :loading="loading"
          />
        </SecurityCard>
        <AttentionCard
          :attention="attention"
          :blocked="blocked"
          :loading="loading"
          :error="error"
          @retry="(event) => emit('retry', event)"
        />
        <SecurityCard
          v-for="id in barCards"
          :key="id"
          :span="6"
          v-bind="card(id)"
          @expand="openExpanded(id)"
          @select="(_event, value) => onCardOption(id, value)"
          @retry="(event) => emit('retry', event)"
        >
          <BarList
            :items="id === 'categories' ? categories : countries"
            :format-value="formatCount"
            empty-title="No blocked requests in this period"
            :loading="loading"
            :aria-label="securityCards[id].label"
          />
        </SecurityCard>
        <SecurityCard
          :span="12"
          v-bind="card('ips')"
          wide
          @expand="openExpanded('ips')"
          @select="(_event, value) => onCardOption('ips', value)"
          @retry="(event) => emit('retry', event)"
        >
          <SourceIpSearch
            v-model:search="search"
            :rows="sourceIps"
            :format-count="formatCount"
            :loading="loading"
          />
        </SecurityCard>
      </div>
    </div>
    <SecurityDialog
      v-model:open="expanded"
      v-model:form="form"
      :card-id="expandedId"
      :matched="matched"
      :categories="categories"
      :countries="countries"
      :source-ips="sourceIps"
      :forms="forms"
      :format-count="formatCount"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type { BarListItem } from '@aziontech/webkit/bar-list'
import type { ChartSeries } from '@aziontech/webkit/chart'
import type { FilterMenuField } from '@aziontech/webkit/filter-menu'
import type { SelectOptionItem } from '@aziontech/webkit/select'
import type { SeverityTagSeverity } from '@aziontech/webkit/severity-tag'

import type {
  SecurityAttentionEntry,
  SecurityCardChanges,
  SecurityMatchedRequests,
  SecurityPeriodRange,
  SecuritySourceIp,
  SecuritySummary
} from './dashboard-security.vue'

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

/** What a rule did with one request of the ByActor variant. */
export type ActorOutcome = 'allowed' | 'blocked' | 'held' | 'approved' | 'denied'

/** One row of the ByActor Requests table. */
export interface ActorActivityRow {
  /** Stable row key. */
  id: string
  /** When the request arrived. */
  time: string
  /** Who sent it. */
  actor: string
  /** What the rule did. */
  outcome: ActorOutcome
  /** The category of the action. */
  category: string
  /** How severe the action is. */
  severity: SeverityTagSeverity
  /** The host it went to. */
  destination: string
  /** The HTTP method. */
  method: string
  /** The rule that decided it. */
  rule: string
}

/** One outcome tile of the ByActor variant. */
export interface ActorFigure {
  /** Stable key, the outcome for an outcome tile. */
  id: string
  /** The tile label. */
  label: string
  /** One sentence that defines the figure. */
  description: string
  /** The figure for the time range. */
  value: number
  /** Change against the previous day, in percent. */
  delta: number
  /** A rise is a regression. */
  inverse: boolean
}

export const sampleActorTimeRanges: SelectOptionItem[] = [
  {
    value: 'Last hour',
    label: 'Last hour'
  },
  {
    value: 'Last 24 hours',
    label: 'Last 24 hours'
  },
  {
    value: 'Last 7 days',
    label: 'Last 7 days'
  },
  {
    value: 'Last 30 days',
    label: 'Last 30 days'
  }
]

export const sampleActorFilterFields: FilterMenuField[] = [
  {
    id: 'actor',
    label: 'Actor',
    options: [
      'report-builder',
      'ticket-triage',
      'inventory-sync',
      'invoice-reader',
      'release-helper',
      'data-export',
      'calendar-sync'
    ].map((name) => ({ value: name, label: name }))
  },
  {
    id: 'outcome',
    label: 'Outcome',
    options: [
      { value: 'allowed', label: 'Allowed' },
      { value: 'blocked', label: 'Blocked' },
      { value: 'held', label: 'Held' },
      { value: 'approved', label: 'Approved' },
      { value: 'denied', label: 'Denied' }
    ]
  },
  {
    id: 'category',
    label: 'Category',
    options: ['Read', 'Write', 'Search', 'Export', 'Delete', 'Admin'].map((name) => ({
      value: name,
      label: name
    }))
  }
]

export const sampleActorFigures: ActorFigure[] = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Every request the rules evaluated in the time range.',
    value: 14489,
    delta: 8.4,
    inverse: false
  },
  {
    id: 'allowed',
    label: 'Allowed',
    description: 'Requests a rule let through to their destination.',
    value: 12913,
    delta: 7.9,
    inverse: false
  },
  {
    id: 'blocked',
    label: 'Blocked',
    description: 'Requests a rule stopped before they reached their destination.',
    value: 1348,
    delta: 12.6,
    inverse: true
  },
  {
    id: 'held',
    label: 'Held',
    description: 'Requests a rule paused until someone approves or denies them.',
    value: 228,
    delta: 4.1,
    inverse: true
  },
  {
    id: 'approved',
    label: 'Approved',
    description: 'Held requests a reviewer approved.',
    value: 186,
    delta: 3.2,
    inverse: false
  },
  {
    id: 'denied',
    label: 'Denied',
    description: 'Held requests a reviewer denied.',
    value: 41,
    delta: -9.5,
    inverse: true
  },
  {
    id: 'over-budget',
    label: 'Over budget',
    description: 'Requests that went past the spending or volume budget set for their actor.',
    value: 73,
    delta: 21.7,
    inverse: true
  }
]

export const sampleActorOutcomes: ChartSeries[] = [
  {
    id: 'allowed',
    name: 'Allowed',
    color: 'success',
    values: [
      412, 386, 341, 318, 296, 305, 352, 448, 571, 664, 718, 742, 731, 756, 769, 748, 702, 655, 598,
      541, 503, 476, 451, 430
    ]
  },
  {
    id: 'blocked',
    name: 'Blocked',
    color: 'danger',
    values: [
      38, 35, 31, 29, 33, 30, 36, 47, 62, 71, 84, 79, 76, 91, 88, 82, 74, 69, 61, 55, 49, 46, 42, 40
    ]
  },
  {
    id: 'held',
    name: 'Held',
    color: 'warning',
    values: [6, 5, 4, 3, 4, 3, 5, 8, 11, 14, 16, 15, 13, 17, 18, 15, 13, 12, 10, 9, 8, 7, 6, 6]
  }
]

export const sampleActors: BarListItem[] = [
  {
    id: 'report-builder',
    name: 'report-builder',
    value: 4494
  },
  {
    id: 'ticket-triage',
    name: 'ticket-triage',
    value: 3187
  },
  {
    id: 'inventory-sync',
    name: 'inventory-sync',
    value: 2463
  },
  {
    id: 'invoice-reader',
    name: 'invoice-reader',
    value: 1738
  },
  {
    id: 'release-helper',
    name: 'release-helper',
    value: 1304
  },
  {
    id: 'data-export',
    name: 'data-export',
    value: 869
  },
  {
    id: 'calendar-sync',
    name: 'calendar-sync',
    value: 434
  }
]

export const sampleActorCategories: BarListItem[] = [
  {
    id: 'Read',
    name: 'Read',
    value: 7827
  },
  {
    id: 'Write',
    name: 'Write',
    value: 3042
  },
  {
    id: 'Search',
    name: 'Search',
    value: 1738
  },
  {
    id: 'Export',
    name: 'Export',
    value: 869
  },
  {
    id: 'Delete',
    name: 'Delete',
    value: 579
  },
  {
    id: 'Admin',
    name: 'Admin',
    value: 434
  }
]

export const sampleActorDestinations: BarListItem[] = [
  {
    id: 'api.example.com',
    name: 'api.example.com',
    value: 5508
  },
  {
    id: 'storage.example.com',
    name: 'storage.example.com',
    value: 2752
  },
  {
    id: 'crm.example.net',
    name: 'crm.example.net',
    value: 2318
  },
  {
    id: 'billing.example.com',
    name: 'billing.example.com',
    value: 1593
  },
  {
    id: 'mail.example.org',
    name: 'mail.example.org',
    value: 1304
  },
  {
    id: 'docs.example.com',
    name: 'docs.example.com',
    value: 1014
  }
]

export const sampleActorRows: ActorActivityRow[] = [
  {
    id: 'request-01',
    time: '14:52:08',
    actor: 'report-builder',
    outcome: 'allowed',
    category: 'Read',
    severity: 'info',
    destination: 'api.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-02',
    time: '14:51:47',
    actor: 'data-export',
    outcome: 'blocked',
    category: 'Export',
    severity: 'critical',
    destination: 'storage.example.com',
    method: 'PUT',
    rule: 'No bulk export'
  },
  {
    id: 'request-03',
    time: '14:51:12',
    actor: 'ticket-triage',
    outcome: 'held',
    category: 'Write',
    severity: 'medium',
    destination: 'crm.example.net',
    method: 'PATCH',
    rule: 'Review customer changes'
  },
  {
    id: 'request-04',
    time: '14:50:39',
    actor: 'invoice-reader',
    outcome: 'allowed',
    category: 'Read',
    severity: 'low',
    destination: 'billing.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-05',
    time: '14:49:58',
    actor: 'release-helper',
    outcome: 'approved',
    category: 'Admin',
    severity: 'high',
    destination: 'api.example.com',
    method: 'POST',
    rule: 'Approve admin actions'
  },
  {
    id: 'request-06',
    time: '14:49:21',
    actor: 'inventory-sync',
    outcome: 'blocked',
    category: 'Delete',
    severity: 'high',
    destination: 'api.example.com',
    method: 'DELETE',
    rule: 'No deletes outside hours'
  },
  {
    id: 'request-07',
    time: '14:48:44',
    actor: 'report-builder',
    outcome: 'allowed',
    category: 'Search',
    severity: 'info',
    destination: 'docs.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-08',
    time: '14:48:03',
    actor: 'ticket-triage',
    outcome: 'denied',
    category: 'Write',
    severity: 'medium',
    destination: 'mail.example.org',
    method: 'POST',
    rule: 'Review outbound mail'
  },
  {
    id: 'request-09',
    time: '14:47:26',
    actor: 'calendar-sync',
    outcome: 'allowed',
    category: 'Write',
    severity: 'low',
    destination: 'api.example.com',
    method: 'PUT',
    rule: 'Scheduled writes'
  },
  {
    id: 'request-10',
    time: '14:46:50',
    actor: 'data-export',
    outcome: 'blocked',
    category: 'Export',
    severity: 'critical',
    destination: 'storage.example.com',
    method: 'PUT',
    rule: 'No bulk export'
  },
  {
    id: 'request-11',
    time: '14:46:12',
    actor: 'invoice-reader',
    outcome: 'allowed',
    category: 'Read',
    severity: 'info',
    destination: 'billing.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-12',
    time: '14:45:37',
    actor: 'release-helper',
    outcome: 'held',
    category: 'Admin',
    severity: 'high',
    destination: 'api.example.com',
    method: 'POST',
    rule: 'Approve admin actions'
  }
]
```

## `parts/attention-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'

  import type { SecurityAttentionEntry } from '../dashboard-security.vue'

  export interface AttentionCardProps {
    /** The entries that need a decision. */
    attention: SecurityAttentionEntry[]
    /** The period is loading or failed; the open count is hidden. */
    blocked: boolean
    /** The period is loading. */
    loading: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
  }

  defineProps<AttentionCardProps>()

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
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
        @action="(event: MouseEvent) => emit('retry', event)"
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
</template>
```

## `parts/matched-chart.vue`

```ts
<script setup lang="ts">
  import Chart from '@aziontech/webkit/chart'

  import type { SecurityMatchedRequests } from '../dashboard-security.vue'

  export interface MatchedChartProps {
    /** The Blocked and Logged series with their labels. */
    matched: SecurityMatchedRequests
    /** Writes a request count. */
    formatValue: (value: number) => string
    /** Draws the series as stacked bars instead of lines. */
    bar: boolean
    /** Minimum plot height in pixels; left out, the chart default. */
    height?: number
    /** The period is loading. */
    loading?: boolean
    /** Accessible name of the chart. */
    ariaLabel?: string
  }

  withDefaults(defineProps<MatchedChartProps>(), {
    height: undefined,
    loading: false,
    ariaLabel: ''
  })

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })
</script>

<template>
  <Chart
    v-model:active-index="activeIndex"
    :series="matched.series"
    :labels="matched.labels"
    :format-value="formatValue"
    :height="height"
    empty-title="No matched requests in this period"
    empty-description="Nothing was recorded in this period."
    :loading="loading"
    :aria-label="ariaLabel || undefined"
  >
    <Chart.Grid />
    <Chart.Axis type="y" />
    <Chart.Axis type="x" />
    <Chart.Bar
      v-if="bar"
      stacked
    />
    <Chart.Line v-else />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend total />
  </Chart>
</template>
```

## `parts/security-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** The change tag beside the Sum tag. */
  export interface SecurityCardChange {
    /** The change, written with its sign. */
    label: string
    /** Danger for a rise, success for a fall. */
    severity: TagSeverity
    /** The arrow glyph. */
    icon: string
  }

  export interface SecurityCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title. */
    title: string
    /** One sentence on what the card counts. */
    hint: string
    /** What did not load, written after Couldn't load in the alert. */
    subject: string
    /** The change tag; null hides it. */
    change: SecurityCardChange | null
    /** The chart forms of the toggle; empty hides it. */
    forms?: ToggleGroupOption[]
    /** Marks the header actions as the ones of a full-width card. */
    wide?: boolean
    /** The period is loading or failed; Expand and the menu are disabled. */
    blocked: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
  }

  withDefaults(defineProps<SecurityCardProps>(), { forms: () => [], wide: false })

  const emit = defineEmits<{
    expand: [event: MouseEvent]
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
    retry: [event: MouseEvent]
  }>()

  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()

  const menuOptions = [
    { value: 'query', label: 'Copy query' },
    { value: 'export', label: 'Export CSV' }
  ]
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
      <ChartCard.Action>
        <span
          :data-wide="wide ? '' : undefined"
          class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
        >
          <Tag
            label="Sum"
            severity="neutral"
            size="small"
            icon="az az-calculator"
          />
          <Tag
            v-if="change"
            :label="change.label"
            :severity="change.severity"
            :icon="change.icon"
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
        <Tooltip content="Expand">
          <IconButton
            icon="az az-app-window"
            variant="ghost"
            size="small"
            :aria-label="`Expand ${title}`"
            :disabled="blocked"
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
              :disabled="blocked"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              v-for="option in menuOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </DropdownMenu.Group>
        </DropdownMenu>
      </ChartCard.Action>
    </ChartCard.Header>
    <ChartCard.Content>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load ${subject}. ${error}`"
        action-label="Retry"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
      <slot v-else />
    </ChartCard.Content>
  </ChartCard>
</template>
```

## `parts/security-dialog.vue`

```ts
<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'

  import type {
    SecurityCardId,
    SecurityMatchedRequests,
    SecuritySourceIp
  } from '../dashboard-security.vue'
  import { ipColumns, securityCards } from '../security-cards'
  import MatchedChart from './matched-chart.vue'

  export interface SecurityDialogProps {
    /** The card shown expanded. */
    cardId: SecurityCardId
    /** The Matched requests chart. */
    matched: SecurityMatchedRequests
    /** Blocked requests by attack category. */
    categories: BarListItem[]
    /** Blocked requests by country. */
    countries: BarListItem[]
    /** The Top source IPs rows. */
    sourceIps: SecuritySourceIp[]
    /** The Line and Bar options of the toggle. */
    forms: ToggleGroupOption[]
    /** Writes a request count. */
    formatCount: (value: number) => string
  }

  defineProps<SecurityDialogProps>()

  const open = defineModel<boolean>('open', { default: false })
  const form = defineModel<string>('form', { default: 'line' })
</script>

<template>
  <Dialog
    v-model:open="open"
    size="large"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{ securityCards[cardId].label }}</DialogTitle>
          <DialogDescription>{{ securityCards[cardId].description }}</DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <template v-if="cardId === 'matched'">
            <div>
              <ToggleGroup
                v-model="form"
                :options="forms"
                size="small"
                :aria-label="`Chart form for ${securityCards[cardId].label}`"
              />
            </div>
            <MatchedChart
              :matched="matched"
              :format-value="formatCount"
              :bar="form === 'bar'"
              :height="420"
              :aria-label="securityCards[cardId].label"
            />
          </template>
          <BarList
            v-else-if="cardId === 'categories' || cardId === 'countries'"
            :items="cardId === 'categories' ? categories : countries"
            :format-value="formatCount"
            empty-title="No blocked requests in this period"
            :aria-label="securityCards[cardId].label"
          />
          <DataTable
            v-else
            :data="sourceIps"
            :columns="ipColumns"
            row-key="id"
            sortable
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
            <template #footer>
              <DataTablePagination :page-size="10" />
            </template>
          </DataTable>
        </div>
      </PanelBody>
    </DialogContent>
  </Dialog>
</template>
```

## `parts/source-ip-search.vue`

```ts
<script setup lang="ts">
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import { matchesText } from '@aziontech/webkit/use-collection'
  import { computed } from 'vue'

  import type { SecuritySourceIp } from '../dashboard-security.vue'
  import { ipColumns } from '../security-cards'

  export interface SourceIpSearchProps {
    /** The Top source IPs rows. */
    rows: SecuritySourceIp[]
    /** Writes a request count. */
    formatCount: (value: number) => string
    /** The period is loading. */
    loading: boolean
  }

  const props = defineProps<SourceIpSearchProps>()

  const search = defineModel<string>('search', { default: '' })
  const matchingRows = computed(() =>
    props.rows.filter((row) =>
      matchesText(
        row,
        search.value,
        ipColumns.flatMap((column) => column.accessorKey ?? [])
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
      :data="matchingRows"
      :columns="ipColumns"
      row-key="id"
      sortable
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

## `security-cards.ts`

```ts
import type { TableColumn } from '@aziontech/webkit/data-table'
import { toast } from '@aziontech/webkit/toast'
import { copyText } from '@aziontech/webkit/utils/clipboard'
import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'

import type { SecurityCardId, SecurityPeriodRange } from './dashboard-security.vue'

/** The fixed part of one card: its title, its query and its CSV columns. */
export interface SecurityCardSpec {
  /** The card title. */
  label: string
  /** One sentence on what the card counts. */
  description: string
  /** What did not load, written in the error alert. */
  subject: string
  /** Fields the copied query returns. */
  fields: string[]
  /** Order of the rows of the copied query. */
  orderBy: string
  /** The CSV columns. */
  columns: CsvColumn[]
}

/** What a card menu copies and exports. */
export interface SecurityOption {
  /** The query Copy query writes. */
  query: string
  /** The file Export CSV downloads. */
  filename: string
  /** The CSV columns. */
  columns: CsvColumn[]
  /** The CSV rows, read when the export runs. */
  rows: () => object[]
}

const ipColumn = (id: string, header: string): TableColumn => ({
  accessorKey: id,
  id,
  header,
  align: id === 'requests' ? 'end' : 'start',
  sortable: true,
  principal: id === 'remoteAddress'
})

export const ipColumns: TableColumn[] = [
  ipColumn('remoteAddress', 'IP address'),
  ipColumn('asn', 'Network'),
  ipColumn('country', 'Country'),
  ipColumn('category', 'Main attack'),
  ipColumn('requests', 'Blocked requests')
]

const blockedColumn: CsvColumn = { header: 'Blocked requests', id: 'value' }

export const securityCards: Record<SecurityCardId, SecurityCardSpec> = {
  matched: {
    label: 'Matched requests over time',
    description: 'Requests that matched a rule: blocked, or logged and allowed through.',
    subject: 'matched requests over time',
    fields: ['ts', 'action', 'requests'],
    orderBy: 'ts_ASC',
    columns: [
      { header: 'Time', id: 'ts' },
      { header: 'Blocked', id: 'blocked' },
      { header: 'Logged', id: 'logged' }
    ]
  },
  categories: {
    label: 'Blocked requests by attack category',
    description: 'Blocked requests, broken down by the attack category of the rule they matched.',
    subject: 'blocked requests by attack category',
    fields: ['attackCategory', 'requests'],
    orderBy: 'requests_DESC',
    columns: [{ header: 'Attack category', id: 'name' }, blockedColumn]
  },
  countries: {
    label: 'Blocked requests by country',
    description: 'Blocked requests, broken down by the country they came from.',
    subject: 'blocked requests by country',
    fields: ['country', 'requests'],
    orderBy: 'requests_DESC',
    columns: [{ header: 'Country', id: 'name' }, blockedColumn]
  },
  ips: {
    label: 'Top source IPs by blocked requests',
    description: 'The addresses blocked most often, with their network and main attack.',
    subject: 'top source IPs by blocked requests',
    fields: ['remoteAddress', 'asn', 'country', 'attackCategory', 'requests'],
    orderBy: 'requests_DESC',
    columns: ipColumns.map((column) => ({
      header: String(column.header),
      id: column.id ?? ''
    }))
  }
}

export const securityQuery = (card: SecurityCardSpec, range: SecurityPeriodRange): string => {
  const lines = [
    'query {',
    '  securityMetrics(',
    '    limit: 5000',
    '    aggregate: { sum: requests }'
  ]
  lines.push(`    filter: { tsRange: { begin: "${range.begin}", end: "${range.end}" } }`)
  lines.push(`    orderBy: [${card.orderBy}]`, '  ) {')
  for (const field of card.fields) lines.push(`    ${field}`)
  lines.push('  }', '}')
  return lines.join('\n')
}

export const runSecurityOption = async (
  value: string | number,
  option: SecurityOption
): Promise<void> => {
  if (value !== 'query') {
    downloadCsv(option.filename, toCsv({ columns: option.columns, rows: option.rows() }))
    toast.success('CSV exported.', { description: option.filename })
    return
  }
  if (await copyText(option.query)) {
    toast.success('Query copied.', {
      description: 'Paste it into any GraphQL client that sends your token.'
    })
  } else {
    toast.error('The query could not be copied.')
  }
}
```
