# SecurityDashboard (`platform/dashboard/security-dashboard`)

> The security dashboard pattern: blocked and allowed requests over time, breakdowns by attack category and origin, the top sources and an attention list. A row of three StatTiles (Requests blocked, Requests inspected, Block rate, each with its delta against the previous period and a sparkline) sits over a 12-column grid of ChartCards. Matched requests over time plots blocked and logged requests; Needs attention lists the settings and traffic that ask for a decision, each with a severity Tag and one action Link; attack categories and countries read as ranked BarLists, and the top source IPs as a searchable, paginated TableRoot. With no rule set in place the tiles stay as dashes and one setup EmptyState that offers Add rule set replaces the grid. Built from `PageHeader`, `StatTile`, `ChartCard`, `Chart`, `BarList`, `Item`, `Tag`, `Link`, `TableRoot`, `Hint`, `ToggleGroup`, `DropdownMenu`, `Skeleton`, `EmptyState` and `Button`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/security-dashboard/security-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/security-dashboard")`
- Components: [Alert](../../../components/alert.md), [BarList](../../../components/bar-list.md), [Button](../../../components/button.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Link](../../../components/link.md), [PageHeader](../../../components/page-header.md), [Skeleton](../../../components/skeleton.md), [StatTile](../../../components/stat-tile.md), `TableRoot`, [Tag](../../../components/tag.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

security dashboard; waf dashboard; blocked requests; attack categories; threat origins; top attackers; painel de segurança; requisições bloqueadas; ataques

The page a reader opens to see what their security rules are doing: how many requests were blocked
and inspected, how blocking moved over time, which attack categories and countries it came from, which
source addresses sent the most, and the short list of settings and traffic that need a decision now.
Needs attention is what makes it more than a report: every entry ends in one action.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- Security rules (firewall, WAF, bot rules) inspect and block requests, and the reader owns those rules.
- The reader needs the trend and the breakdown, plus a short list of things to fix.
- Source addresses or networks are worth searching individually.

## When not to use

- Every request with the rule that decided it, for a set of actors: use
  `platform/dashboard/activity-outcomes-dashboard`.
- Alerts with severity and an open queue: use `platform/dashboard/alerts-dashboard`.
- Plain traffic volume and status codes: use `platform/dashboard/analytics-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Security` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`.

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

### H. Expand — `IconButton` (optional)

Its `aria-label` names the card (`Expand Matched requests over time`).

### I. More options — `DropdownMenu` (optional)

`Copy query` and `Export CSV`.

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

### O. Top source IPs — `TableRoot` (required)

Searchable and paginated; addresses and counts in tabular figures.

### P. Empty regions — `EmptyState` (required)

Each chart keeps its box (`No matched requests in this period` / `Nothing was recorded in this period.`, and `No blocked requests in this period` on the breakdowns) and the table
says `No matching rows` / `Change the search.` When no rule set exists at all, the Empty variant
replaces the whole grid with one bordered `EmptyState` and its `Add rule set` button.

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
- **Setup empty state:** `No security rules protect your services` / `Security metrics and the Needs attention list appear once a rule set protects a service.`, action `Add rule set`.

## Accessibility

- Every icon-only control has an `aria-label` that names its card, plus a `Tooltip`.
- The search `Input` has an `aria-label` equal to its placeholder.
- Severity is a word in the `Tag`, not color alone.
- Figures use `tabular-nums`.

## States

- Default: rules in place, populated tiles, charts, attention list and table.
- Loading: every tile, chart and the table hold a `Skeleton`; Needs attention shows three placeholder rows.
- Empty: no rule set yet; tiles read as dashes and one bordered `EmptyState` offers `Add rule set` instead of a grid of empty charts.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/alerts-dashboard` — the alert queue raised by these rules.
- `platform/dashboard/activity-outcomes-dashboard` — the rule that decided each request.
- `platform/edit/rule-builder` — where a rule set is edited.

## Variants

- `Default` — primary (the code below)
- `Loading` — The first load: every tile, chart and the table hold a Skeleton, and Needs attention shows three placeholder rows.
- `Empty` — No security rules set up yet: the tiles read as dashes, and one bordered EmptyState names the reason and offers Add rule set instead of a grid of empty charts.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/security-dashboard", { variant })`, or the file under `blocks/platform/dashboard/security-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import BarList from '@aziontech/webkit/bar-list'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  interface AttentionEntry {
    id: string
    icon: string
    title: string
    description: string
    severity: TagSeverity
    tag: string
    action: { label: string; href: string }
  }

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const formatCount = (value: number) => compact.format(value)
  const formatPercent = (value: number) => `${value.toFixed(value >= 10 ? 0 : 1)}%`

  const requestsBlocked = 49277
  const requestsBlockedDelta = 6.76
  const requestsBlockedTrend = [
    2547, 2598, 2722, 2380, 2434, 2481, 2396, 2333, 2051, 1803, 1877, 1809, 1903, 1705, 1524, 1496,
    1576, 1830, 1771, 1883, 1818, 1941, 2304, 2095
  ]
  const requestsInspected = 2273686
  const requestsInspectedDelta = 0.93
  const requestsInspectedTrend = [
    71719, 69758, 73190, 78995, 79204, 76566, 88893, 95004, 94033, 105848, 109796, 104325, 101445,
    117083, 110447, 117449, 113337, 110448, 101923, 98948, 89588, 93348, 85977, 86362
  ]
  const blockRate = 2.19
  const blockRateDelta = 17.07
  const blockRateTrend = [
    2.46, 2.27, 2.33, 2.15, 2.2, 1.92, 2.06, 1.82, 1.76, 1.71, 1.83, 1.83, 1.89, 1.95, 2.16, 2.25,
    2.32, 2.31, 2.44, 2.54, 2.62, 2.63, 2.53, 2.62
  ]

  const labels = Array.from({ length: 24 }, (_, index) => new Date(Date.UTC(2026, 10, 9, index)))
  const matchedRequests: ChartSeries[] = [
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
  const categories = [
    { id: 'SQL injection', name: 'SQL injection', value: 18420 },
    { id: 'Cross-site scripting', name: 'Cross-site scripting', value: 12960 },
    { id: 'Path traversal', name: 'Path traversal', value: 7310 },
    { id: 'Remote file inclusion', name: 'Remote file inclusion', value: 4180 },
    { id: 'Command injection', name: 'Command injection', value: 3240 },
    { id: 'Scanner probes', name: 'Scanner probes', value: 1870 }
  ]
  const countries = [
    { id: 'United States', name: 'United States', value: 14820 },
    { id: 'Brazil', name: 'Brazil', value: 10640 },
    { id: 'Germany', name: 'Germany', value: 6130 },
    { id: 'Netherlands', name: 'Netherlands', value: 4270 },
    { id: 'India', name: 'India', value: 3480 },
    { id: 'Singapore', name: 'Singapore', value: 2190 },
    { id: 'France', name: 'France', value: 1460 }
  ]
  const ipColumns: TableColumn[] = [
    {
      id: 'remoteAddress',
      accessorKey: 'remoteAddress',
      header: 'IP address',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'asn',
      accessorKey: 'asn',
      header: 'Network',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'country',
      accessorKey: 'country',
      header: 'Country',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Main attack',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Blocked requests',
      align: 'end',
      enableSorting: true,
      principal: false
    }
  ]
  const ipRows = [
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
  const attention: AttentionEntry[] = [
    {
      id: 'log-only',
      icon: 'pi pi-eye',
      title: 'A rule set logs requests it does not block',
      description: 'The shop service runs its rule set in log-only mode: 1.2K requests passed.',
      severity: 'warning',
      tag: 'Log only',
      action: { label: 'Review rules', href: '/security/rules' }
    },
    {
      id: 'spike',
      icon: 'pi pi-chart-line',
      title: 'Attack spike on api.example.com',
      description: 'SQL injection against the API rose 64% in the last hour.',
      severity: 'danger',
      tag: 'Spike',
      action: { label: 'Open security metrics', href: '/metrics/security' }
    },
    {
      id: 'no-rules',
      icon: 'pi pi-shield',
      title: 'Service without a rule set',
      description: 'The docs service has no security rule set attached.',
      severity: 'warning',
      tag: 'No rules',
      action: { label: 'Attach a rule set', href: '/security/rules' }
    }
  ]
  const forms = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const form = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Security"
        description="Requests your rules blocked and inspected, and the settings that need a decision."
      />
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests blocked"
            :value="requestsBlocked"
            :format-value="formatCount"
            :delta="requestsBlockedDelta"
            delta-label="vs previous 24 hours"
            inverse
            :trend="requestsBlockedTrend"
          >
            <template #aside>
              <Hint
                text="Requests a security rule identified as attacks and blocked before they reached a service."
              />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests inspected"
            :value="requestsInspected"
            :format-value="formatCount"
            :delta="requestsInspectedDelta"
            delta-label="vs previous 24 hours"
            :trend="requestsInspectedTrend"
          >
            <template #aside>
              <Hint text="Requests checked against security rules across every service." />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Block rate"
            :value="blockRate"
            :format-value="formatPercent"
            :delta="blockRateDelta"
            delta-label="vs previous 24 hours"
            inverse
            :trend="blockRateTrend"
          >
            <template #aside>
              <Hint text="Share of inspected requests blocked as attacks." />
            </template>
          </StatTile>
        </li>
      </ul>
      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Matched requests over time</ChartCard.Title>
              <Hint text="Requests that matched a rule: blocked, or logged and allowed through." />
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
                  label="+19.01%"
                  severity="danger"
                  icon="pi pi-arrow-up-right"
                  size="small"
                />
                <ToggleGroup
                  v-model="form"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Matched requests over time"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Matched requests over time"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Matched requests over time"
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
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="matchedRequests"
              :labels="labels"
              :format-value="formatCount"
              empty-title="No matched requests in this period"
              empty-description="Nothing was recorded in this period."
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar
                v-if="form === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend totals />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Needs attention</ChartCard.Title>
              <Hint text="Settings and traffic on your services that ask for a decision." />
            </span>
            <ChartCard.Controls>
              <Tag
                :label="`${attention.length} open`"
                severity="secondary"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Item.List>
              <Item
                v-for="entry in attention"
                :key="entry.id"
                role="listitem"
                kind="inline"
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
                      :show-icon="false"
                    />
                  </span>
                </Item.Content>
              </Item>
            </Item.List>
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Blocked requests by attack category</ChartCard.Title>
              <Hint
                text="Blocked requests, broken down by the attack category of the rule they matched."
              />
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
                  label="-0.03%"
                  severity="success"
                  icon="pi pi-arrow-down-left"
                  size="small"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Blocked requests by attack category"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Blocked requests by attack category"
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
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="categories"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              aria-label="Blocked requests by attack category"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Blocked requests by country</ChartCard.Title>
              <Hint text="Blocked requests, broken down by the country they came from." />
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
                  label="+9.33%"
                  severity="danger"
                  icon="pi pi-arrow-up-right"
                  size="small"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Blocked requests by country"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Blocked requests by country"
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
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="countries"
              :format-value="formatCount"
              empty-title="No blocked requests in this period"
              aria-label="Blocked requests by country"
            />
          </ChartCard.Content>
        </ChartCard>
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Top source IPs by blocked requests</ChartCard.Title>
              <Hint text="The addresses blocked most often, with their network and main attack." />
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
                  label="-6.79%"
                  severity="success"
                  icon="pi pi-arrow-down-left"
                  size="small"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Top source IPs by blocked requests"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Top source IPs by blocked requests"
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
                    placeholder="Search addresses, networks or attacks"
                    aria-label="Search addresses, networks or attacks"
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
                :data="ipRows"
                :columns="ipColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="5"
                :rows-per-page-options="[5, 10, 25]"
                header-kind="compact"
                bordered
              >
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="pi pi-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>
                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
                </template>
              </TableRoot>
            </div>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
```
