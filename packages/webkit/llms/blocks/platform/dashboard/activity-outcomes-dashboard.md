# ActivityOutcomesDashboard (`platform/dashboard/activity-outcomes-dashboard`)

> An activity outcomes dashboard: what a set of actors requested through the rules and what the rules decided. A page heading with a Refresh IconButton sits over a filter row of `Field`s (time range, actor, outcome and category Selects, and a destination Input that matches an exact host). A grid of seven StatTiles, four per row until the widest screens, counts the outcomes (requests, allowed, blocked, held, approved, denied and over budget), each with its delta against the previous period and a Hint that defines it. Below, a ChartCard plots outcomes over time as a Chart with stacked bars, one series per exclusive outcome in its status color (allowed success, blocked danger, held warning), with a legend that toggles a series and shows its total. Three ChartCards break the same requests down by actor, category and destination with a BarList each, and a last ChartCard holds the request log, a TableRoot with time, actor, an outcome Tag, category, a SeverityTag, destination, method and the rule that decided it. Its page-level parts are `PageHeader`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/activity-outcomes-dashboard/activity-outcomes-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/activity-outcomes-dashboard")`
- Components: [Alert](../../../components/alert.md), [BarList](../../../components/bar-list.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), [Select](../../../components/select.md), [SeverityTag](../../../components/severity-tag.md), [StatTile](../../../components/stat-tile.md), [Table](../../../components/table.md), `TableRoot`, [Tag](../../../components/tag.md)
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

activity outcomes dashboard; requests and decisions; allowed vs blocked; policy decisions dashboard; request log dashboard; outcomes by actor; painel de atividades; decisões das regras; permitidos e bloqueados

The page an operator opens to answer "what did these actors ask for, and what did the rules decide?".
It counts every request by its outcome (allowed, blocked, held, approved, denied, over budget), shows
how those outcomes moved over time, breaks them down by actor, category and destination, and ends in
the request log, where each row names the rule that decided it. Every region reads the same filters,
so narrowing the time range or the actor moves the whole page at once.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A policy or rule engine decides on requests made by a known set of actors (agents, users, service
  accounts) and the reader needs the outcome mix and the evidence behind it.
- The outcomes are exclusive (one request has exactly one outcome), so they can stack.
- The reader needs to go from a total to the individual request and the rule that decided it on one page.

## When not to use

- The page monitors latency or error rates of services, not decisions: use
  `platform/dashboard/service-monitoring-dashboard`.
- The subject is open alerts and their severity rather than every request: use
  `platform/dashboard/alerts-dashboard`.
- The reader only needs the log with filters and no summary: use `platform/view/table-view`.
- Traffic volume per host or country with no decision behind it: use
  `platform/dashboard/analytics-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Request activity` with a one-sentence description of what the page reports. The heading's
actions slot holds only the refresh control; the filters live in their own row below.

### B. Refresh — `IconButton` (optional)

Re-reads the current filters without changing them. Icon-only, so it carries `aria-label="Refresh"`.
Omit it when the data streams in on its own.

### C. Filter row — `Field` (required)

One `Field` per filter, each with a visible `Field.Label`, in a container labelled `Filters`. The
filters are global: every tile, chart, breakdown and the log read them. Keep them in one row that
wraps on narrow screens; never repeat a filter inside a card.

### D. Time range, actor, outcome and category — `Select` (required)

Each `Select` sits in its `Field`. The time range is the first filter because it scopes everything
else. Offer an "All" option for actor, outcome and category so the default view is the whole set.

### E. Destination — `Input` (optional)

Matches one exact host (`api.example.com` as the placeholder). It is a filter, not a search: say in
its description that it matches the whole host, so a partial value returning nothing is not a surprise.

### F. Outcome tiles — `StatTile` (required)

Seven tiles in a grid labelled `Outcomes`, four per row until the widest screens. Each shows the count
for the range and the delta against the previous period. Pass `inverse` on every outcome where a rise
is bad (blocked, held, denied, over budget) so the delta reads red when it grows.

### G. Metric definitions — `Hint` (required)

One `Hint` per tile and per card title defines the metric in a sentence. Definitions never go in the
label.

### H. Chart and breakdown cards — `ChartCard` (required)

Every chart and the log sit in a `ChartCard` with a title and the same header layout. A card keeps its
box in every state.

### I. Outcomes over time — `Chart` (required)

Stacked bars, one series per exclusive outcome, colored with the status role (allowed success,
blocked danger, held warning): here the color means a state, which is the only case the status
tokens are for. The legend toggles a series and shows its total for the range.

### J. Breakdowns — `BarList` (required)

Three ranked lists (by actor, by category, by destination), each with an `aria-label` naming what it
ranks. Rank by count, largest first.

### K. Outcome in the log — `Table`, `Tag` (required)

Each log row states its outcome as a `Table.CellStatus` in the same status hue as its series in the chart, so the
chart and the log read the same scale. The card header's count (`<n> requests`) is also a `Tag`.

### L. Request log — `TableRoot` (required)

Columns: time, actor, outcome, category, severity, destination, method and the rule that decided it.
Figures and times use tabular numbers. The rule column is what makes the page actionable: the reader
goes from an unexpected block to the rule that caused it.

### M. Severity — `SeverityTag` (required)

The severity of the category a request fell in, on the severity ramp. Do not reuse it for the
outcome; outcome and severity are two different facts.

### N. Empty regions — `EmptyState` (required)

Each chart, breakdown and the log render their own `EmptyState` when the range holds no request
(`No requests in this time range`), keeping the card's box.

## Do

- Keep every region on the same filters; a change of range or actor updates the whole page together.
- Stack only outcomes that are exclusive, and keep the series order the same in the chart, the legend,
  the tiles and the tags.
- Mark rising-is-bad tiles as `inverse`.
- Name the deciding rule in every log row.

## Don't

- Don't color a categorical series (actor, category) with a status token.
- Don't put a second filter row inside a card; the page has one set of filters.
- Don't hide an outcome with zero requests from the tiles; show `0` so the set stays complete.
- Don't explain a metric in its label; use the `Hint`.

## Copy

- **Title:** a noun phrase for what is reported. `Request activity`.
- **Description:** one sentence, what the page shows. `What each actor requested through the rules and what the rules decided.`
- **Filter labels:** one or two words, no colon. `Time range`, `Actor`, `Outcome`, `Category`, `Destination`.
- **Tile labels:** the outcome name in sentence case. `Over budget`, not `Over Budget (requests)`.
- **Hint:** one sentence defining the metric. `Requests the rules held for a person to approve.`
- **Empty state:** what is missing, then what fills it and what to do. `No requests in this time range` / `Requests the rules evaluate appear here. Widen the time range to see older ones.`
- **Outcome tags:** past participle, one word. `Allowed`, `Blocked`, `Held`.

## Accessibility

- The refresh control is an `IconButton` with `aria-label="Refresh"`.
- The filter container is labelled `Filters`, the tile grid `Outcomes`, each `BarList` names what it ranks.
- Every filter has a visible label through `Field.Label`; the destination placeholder is an example, not the label.
- Outcome is never color alone: the chart legend, the tooltip and the log `Tag` all carry the word.
- Times, counts and deltas use `tabular-nums` so columns do not jitter on refresh.

## States

- Default: the populated page for the selected time range.
- Loading: while the range loads, tiles, chart and breakdowns render their own `Skeleton` and the log holds Skeleton rows; nothing reflows.
- Empty: no request in the range; tiles show a dash with no delta, every card keeps its box with an empty state, and the log says to widen the time range.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/alerts-dashboard` — when the reader starts from open alerts instead of every request.
- `platform/dashboard/analytics-dashboard` — the same tiles, chart and table grammar for traffic volume.
- `platform/view/table-view` — the log on its own, as a filterable list page.
- `SeverityTag` / `Tag` — severity and outcome are separate columns with separate scales.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the time range loads, the tiles, the chart and the breakdowns render their own Skeleton and the log holds Skeleton rows, so the page does not reflow when data arrives.
- `Empty` — A time range with no request. The tiles show a dash with no delta, the chart and the breakdowns keep their box with an empty state, and the log says what fills it and to widen the time range.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/activity-outcomes-dashboard", { variant })`, or the file under `blocks/platform/dashboard/activity-outcomes-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SeverityTag, { type SeverityTagSeverity } from '@aziontech/webkit/severity-tag'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Table from '@aziontech/webkit/table'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  type Outcome = 'allowed' | 'blocked' | 'held' | 'approved' | 'denied'

  interface FilterOption {
    value: string
    label: string
    disabled?: boolean
  }

  interface ActivityRow {
    id: string
    time: string
    actor: string
    outcome: Outcome
    category: string
    severity: SeverityTagSeverity
    destination: string
    method: string
    rule: string
  }

  const loading = false
  const comparison = 'vs prior day'
  const timeRange = ref('Last 24 hours')
  const actor = ref('Any actor')
  const outcome = ref('Any outcome')
  const category = ref('Any category')
  const destination = ref('')
  const activeIndex = ref<number | null>(null)

  const labels = Array.from(
    { length: 24 },
    (_, index) => new Date(Date.UTC(2026, 10, 9, 15 + index))
  )

  const timeRanges: FilterOption[] = [
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

  const actorOptions: FilterOption[] = [
    {
      value: 'Any actor',
      label: 'Any actor'
    },
    {
      value: 'report-builder',
      label: 'report-builder'
    },
    {
      value: 'ticket-triage',
      label: 'ticket-triage'
    },
    {
      value: 'inventory-sync',
      label: 'inventory-sync'
    },
    {
      value: 'invoice-reader',
      label: 'invoice-reader'
    },
    {
      value: 'release-helper',
      label: 'release-helper'
    },
    {
      value: 'data-export',
      label: 'data-export'
    },
    {
      value: 'calendar-sync',
      label: 'calendar-sync'
    }
  ]

  const outcomeOptions: FilterOption[] = [
    {
      value: 'Any outcome',
      label: 'Any outcome'
    },
    {
      value: 'Allowed',
      label: 'Allowed'
    },
    {
      value: 'Blocked',
      label: 'Blocked'
    },
    {
      value: 'Held',
      label: 'Held'
    },
    {
      value: 'Approved',
      label: 'Approved'
    },
    {
      value: 'Denied',
      label: 'Denied'
    }
  ]

  const categoryOptions: FilterOption[] = [
    {
      value: 'Any category',
      label: 'Any category'
    },
    {
      value: 'Read',
      label: 'Read'
    },
    {
      value: 'Write',
      label: 'Write'
    },
    {
      value: 'Search',
      label: 'Search'
    },
    {
      value: 'Export',
      label: 'Export'
    },
    {
      value: 'Delete',
      label: 'Delete'
    },
    {
      value: 'Admin',
      label: 'Admin'
    }
  ]

  const figures = [
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

  const outcomes: ChartSeries[] = [
    {
      id: 'allowed',
      name: 'Allowed',
      color: 'success',
      values: [
        412, 386, 341, 318, 296, 305, 352, 448, 571, 664, 718, 742, 731, 756, 769, 748, 702, 655,
        598, 541, 503, 476, 451, 430
      ]
    },
    {
      id: 'blocked',
      name: 'Blocked',
      color: 'danger',
      values: [
        38, 35, 31, 29, 33, 30, 36, 47, 62, 71, 84, 79, 76, 91, 88, 82, 74, 69, 61, 55, 49, 46, 42,
        40
      ]
    },
    {
      id: 'held',
      name: 'Held',
      color: 'warning',
      values: [6, 5, 4, 3, 4, 3, 5, 8, 11, 14, 16, 15, 13, 17, 18, 15, 13, 12, 10, 9, 8, 7, 6, 6]
    }
  ]

  const actors: BarListItem[] = [
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

  const categories: BarListItem[] = [
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

  const destinations: BarListItem[] = [
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

  const columns: TableColumn[] = [
    {
      id: 'time',
      accessorKey: 'time',
      header: 'Time',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'actor',
      accessorKey: 'actor',
      header: 'Actor',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'outcome',
      accessorKey: 'outcome',
      header: 'Outcome',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Category',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'severity',
      accessorKey: 'severity',
      header: 'Severity',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'destination',
      accessorKey: 'destination',
      header: 'Destination',
      align: 'start',
      enableSorting: true,
      principal: false
    },
    {
      id: 'method',
      accessorKey: 'method',
      header: 'Method',
      align: 'start',
      enableSorting: false,
      principal: false
    },
    {
      id: 'rule',
      accessorKey: 'rule',
      header: 'Rule',
      align: 'start',
      enableSorting: false,
      principal: false
    }
  ]

  const rows: ActivityRow[] = [
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

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatCount = (value: number) => compact.format(value)

  const outcomeTags: Record<Outcome, { label: string; severity: TagSeverity }> = {
    allowed: {
      label: 'Allowed',
      severity: 'success'
    },
    blocked: {
      label: 'Blocked',
      severity: 'danger'
    },
    held: {
      label: 'Held',
      severity: 'warning'
    },
    approved: {
      label: 'Approved',
      severity: 'secondary'
    },
    denied: {
      label: 'Denied',
      severity: 'secondary'
    }
  }

  const outcomeTag = (outcome: Outcome) => outcomeTags[outcome]
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Request activity"
        description="What each actor requested through the rules: what was allowed, blocked or held for approval, and what went over budget, per actor, category and destination."
      >
        <template #actions>
          <IconButton
            icon="pi pi-refresh"
            kind="outlined"
            size="medium"
            aria-label="Refresh"
          />
        </template>
      </PageHeader>

      <section
        aria-label="Filters"
        class="grid grid-cols-1 items-start gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-5"
      >
        <Field>
          <Field.Label>Time range</Field.Label>
          <Select
            v-model="timeRange"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in timeRanges"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Actor</Field.Label>
          <Select
            v-model="actor"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in actorOptions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Outcome</Field.Label>
          <Select
            v-model="outcome"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in outcomeOptions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Category</Field.Label>
          <Select
            v-model="category"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in categoryOptions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Destination</Field.Label>
          <Input
            v-model="destination"
            placeholder="api.example.com"
            size="medium"
          />
          <Field.Description>Exact host.</Field.Description>
        </Field>
      </section>

      <section aria-label="Outcomes">
        <ul class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-4 2xl:grid-cols-7">
          <li
            v-for="figure in figures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="figure.value"
              :format-value="formatCount"
              :delta="figure.delta"
              :delta-label="comparison"
              :inverse="figure.inverse"
              :loading="loading"
            >
              <template #aside>
                <Hint :text="figure.description" />
              </template>
            </StatTile>
          </li>
        </ul>
      </section>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Outcomes over time</ChartCard.Title>
              <Hint text="Requests per hour, stacked by the outcome the rules gave them." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="outcomes"
              :labels="labels"
              :format-value="formatCount"
              empty-title="No requests in this time range"
              empty-description="Requests the rules evaluate appear here. Widen the time range to see older ones."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar stacked />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend totals />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Actors</ChartCard.Title>
              <Hint text="Requests per actor, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="actors"
              :format-value="formatCount"
              empty-title="No requests in this time range"
              :loading="loading"
              aria-label="Requests by actor"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Categories</ChartCard.Title>
              <Hint text="Requests per category of action, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="categories"
              :format-value="formatCount"
              :color="2"
              empty-title="No requests in this time range"
              :loading="loading"
              aria-label="Requests by category"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Destinations</ChartCard.Title>
              <Hint text="Requests per destination host, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="destinations"
              :format-value="formatCount"
              :color="3"
              empty-title="No requests in this time range"
              :loading="loading"
              aria-label="Requests by destination"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Requests</ChartCard.Title>
              <Hint
                text="The latest requests, newest first, with the rule that decided each one."
              />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="!loading && rows.length"
                :label="rows.length + ' requests'"
                severity="secondary"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              v-if="loading || rows.length"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :rows-per-page-options="[10, 25, 50]"
              header-kind="compact"
              bordered
              :loading="loading"
            >
              <template #cell-outcome="{ row }">
                <Table.CellStatus
                  :label="outcomeTag(row.outcome).label"
                  :severity="outcomeTag(row.outcome).severity"
                />
              </template>
              <template #cell-severity="{ row }">
                <SeverityTag
                  :severity="row.severity"
                  size="small"
                />
              </template>
              <template #cell-method="{ row }">
                <span class="font-mono text-body-sm">{{ row.method }}</span>
              </template>
            </TableRoot>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-list"
              title="No requests in this time range"
              description="Requests the rules evaluate appear here. Widen the time range to see older ones."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
```
