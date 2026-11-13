# AlertsDashboard (`platform/dashboard/alerts-dashboard`)

> An alerts dashboard: what is open, how severe it is, what kind it is and who is involved. A page heading with the period Select sits over four StatTiles (open, critical or high open, alerts in the period and the false positive rate), each with its delta and a Hint. Below, a ChartCard stacks the alerts raised each day by severity level, with every series colored from the severity ramp so the bars, the legend and the tooltip read the same scale as the tables. Beside it, Open by severity lists one SeverityTag per level with its open count and its share of the open alerts. A BarList ranks the alerts by type, the Highest risk table pairs each entity with its risk score and the SeverityTag of its worst open alert, and the Open alerts table leads every row with its SeverityTag, sortable from critical to info. Its page-level parts are `PageHeader`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/alerts-dashboard/alerts-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/alerts-dashboard")`
- Components: [Alert](../../../components/alert.md), [BarList](../../../components/bar-list.md), [Card](../../../components/card.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [PageHeader](../../../components/page-header.md), [Select](../../../components/select.md), [SeverityTag](../../../components/severity-tag.md), [Skeleton](../../../components/skeleton.md), [StatTile](../../../components/stat-tile.md), [Table](../../../components/table.md), `TableRoot`, [Tag](../../../components/tag.md)
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

alerts dashboard; open alerts; alerts by severity; incident dashboard; false positive rate; alert triage; painel de alertas; alertas abertos; alertas por severidade

The page a security or operations lead opens to triage: what is open, how severe it is, what kind of
alert it is and which entities are involved. It leads with the open counts, shows how many alerts were
raised each day by severity, and ends in the open alerts table, ordered from critical to info, where
the reader picks what to work on next. Severity reads on one scale everywhere: tiles, chart, tags
and tables.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- Alerts carry a severity level and the reader has to decide which to handle first.
- The reader needs both the trend (are we raising more?) and the queue (what is open now?) on one page.
- Alerts name entities (hosts, users, accounts) whose accumulated risk is worth ranking.

## When not to use

- Every request and the rule that decided it, not only alerts: use
  `platform/dashboard/activity-outcomes-dashboard`.
- Service health with latency and error thresholds and a short alert rail: use
  `platform/dashboard/service-monitoring-dashboard`.
- Items waiting for a verdict from an analysis engine: use `platform/dashboard/scan-results-dashboard`.
- Only the list of alerts with filters: use `platform/view/table-view`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Alerts` with a one-sentence description. The period control sits in its actions slot because
it scopes every region on the page.

### B. Period — `Select` (required)

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

### L. Highest risk and Open alerts — `TableRoot` (required)

Highest risk pairs each entity with its risk score and the `SeverityTag` of its worst open alert.
Open alerts leads every row with its `SeverityTag` and sorts from critical to info by default.
Figures use tabular numbers.

### M. Alert status — `Table`, `Tag` (required)

The status of an alert in the Open alerts table (`Open`, `Investigating`). It is a state,
so it is a `Table.CellStatus` (one semantic `Tag`), separate from severity. The alert type beside it stays a plain secondary `Tag`: it is a category, not a state.

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
- **Empty states:** state the fact, then the next step. `No alerts in this period` / `Nothing was raised in the last 30 days. Select a longer period.`
- **Severity labels:** the level only. `Critical`, `High`, `Medium`, `Low`, `Info`.

## Accessibility

- The period `Select` has `aria-label="Period"`; the tile row is a region labelled `Summary`.
- Severity is always a word in the `SeverityTag`, never a color alone; the chart tooltip lists every level by name.
- Counts and shares use `tabular-nums`.
- The `BarList` carries an `aria-label` naming what it ranks.

## States

- Default: the populated page for the selected period.
- Loading: tiles, chart, bar list and both tables render their own `Skeleton`; Open by severity holds Skeleton rows.
- Empty: a period with no alerts; tiles show a dash with no delta, and every region keeps its box with an `EmptyState` that says why and what to do next.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/activity-outcomes-dashboard` — every request and its outcome, not only alerts.
- `platform/dashboard/security-dashboard` — blocked traffic and the rules that block it.
- `platform/dashboard/service-monitoring-dashboard` — threshold alerts beside service health.
- `SeverityTag` — the one severity scale the page shares.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the period loads, the tiles, the chart, the bar list and both tables render their own Skeleton, and Open by severity holds Skeleton rows, so nothing reflows when data arrives.
- `Empty` — A period with no alerts. The tiles show a dash with no delta, and every region keeps its box with an EmptyState that says why it is empty and what to do next.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/alerts-dashboard", { variant })`, or the file under `blocks/platform/dashboard/alerts-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SeverityTag, { type SeverityTagSeverity } from '@aziontech/webkit/severity-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Table from '@aziontech/webkit/table'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  type FigureFormat = 'count' | 'percentage'
  type AlertStatus = 'Open' | 'Investigating'

  interface Figure {
    id: string
    label: string
    description: string
    value: number | null
    delta: number | null
    inverse: boolean
    format: FigureFormat
  }

  interface LevelCount {
    id: SeverityTagSeverity
    count: number
  }

  interface Entity {
    id: string
    name: string
    type: string
    score: number
    level: SeverityTagSeverity
    alerts: number
  }

  interface AlertRow {
    id: string
    level: SeverityTagSeverity
    rank: number
    title: string
    entity: string
    opened: string
    status: AlertStatus
  }

  const loading = false
  const comparison = 'vs previous period'
  const period = ref('30d')
  const activeIndex = ref<number | null>(null)
  const openTotal = 42

  const periods = [
    {
      value: '7d',
      label: 'Last 7 days'
    },
    {
      value: '30d',
      label: 'Last 30 days'
    },
    {
      value: '90d',
      label: 'Last 90 days'
    }
  ]

  const figures: Figure[] = [
    {
      id: 'open',
      label: 'Open',
      description: 'Alerts nobody has closed yet, at any severity.',
      value: 42,
      delta: 10.5,
      inverse: true,
      format: 'count'
    },
    {
      id: 'critical-high',
      label: 'Critical or high open',
      description: 'Open alerts at the two highest severity levels.',
      value: 9,
      delta: 28.6,
      inverse: true,
      format: 'count'
    },
    {
      id: 'raised',
      label: 'Alerts in the period',
      description: 'Every alert raised in the period, open or closed.',
      value: 1231,
      delta: 4.2,
      inverse: true,
      format: 'count'
    },
    {
      id: 'false-positives',
      label: 'False positives',
      description: 'Share of the alerts closed in the period that were marked as false positives.',
      value: 6,
      delta: -14.3,
      inverse: true,
      format: 'percentage'
    }
  ]

  const labels = [
    'Oct 12',
    'Oct 13',
    'Oct 14',
    'Oct 15',
    'Oct 16',
    'Oct 17',
    'Oct 18',
    'Oct 19',
    'Oct 20',
    'Oct 21',
    'Oct 22',
    'Oct 23',
    'Oct 24',
    'Oct 25',
    'Oct 26',
    'Oct 27',
    'Oct 28',
    'Oct 29',
    'Oct 30',
    'Oct 31',
    'Nov 1',
    'Nov 2',
    'Nov 3',
    'Nov 4',
    'Nov 5',
    'Nov 6',
    'Nov 7',
    'Nov 8',
    'Nov 9',
    'Nov 10'
  ]

  const series: ChartSeries[] = [
    {
      id: 'critical',
      name: 'Critical',
      color: 'severity-critical',
      values: [
        1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 2
      ]
    },
    {
      id: 'high',
      name: 'High',
      color: 'severity-high',
      values: [
        3, 3, 3, 4, 5, 5, 5, 4, 3, 2, 2, 2, 2, 3, 4, 4, 3, 3, 2, 2, 2, 6, 8, 9, 5, 5, 4, 3, 3, 3
      ]
    },
    {
      id: 'medium',
      name: 'Medium',
      color: 'severity-medium',
      values: [
        10, 8, 7, 7, 7, 9, 10, 10, 9, 7, 5, 3, 3, 4, 6, 8, 9, 8, 7, 5, 5, 10, 13, 17, 11, 12, 11,
        10, 8, 7
      ]
    },
    {
      id: 'low',
      name: 'Low',
      color: 'severity-low',
      values: [
        17, 15, 12, 10, 9, 9, 11, 13, 14, 13, 11, 8, 5, 4, 6, 8, 11, 13, 13, 12, 10, 15, 15, 18, 13,
        16, 17, 17, 15, 12
      ]
    },
    {
      id: 'info',
      name: 'Info',
      color: 'severity-info',
      values: [
        22, 22, 20, 17, 13, 11, 10, 12, 15, 16, 17, 14, 11, 7, 6, 6, 9, 13, 16, 18, 17, 26, 22, 20,
        12, 15, 19, 22, 22, 20
      ]
    }
  ]

  const openByLevel: LevelCount[] = [
    {
      id: 'critical',
      count: 3
    },
    {
      id: 'high',
      count: 6
    },
    {
      id: 'medium',
      count: 14
    },
    {
      id: 'low',
      count: 11
    },
    {
      id: 'info',
      count: 8
    }
  ]

  const types: BarListItem[] = [
    {
      id: 'unusual-location',
      name: 'Sign-in from an unusual location',
      value: 214
    },
    {
      id: 'failed-sign-ins',
      name: 'Repeated failed sign-ins',
      value: 188
    },
    {
      id: 'new-device',
      name: 'Sign-in from a new device',
      value: 141
    },
    {
      id: 'off-hours',
      name: 'Access outside working hours',
      value: 97
    },
    {
      id: 'mass-download',
      name: 'Mass download',
      value: 63
    },
    {
      id: 'new-destination',
      name: 'Data sent to a new destination',
      value: 41
    },
    {
      id: 'privilege-change',
      name: 'Privilege change',
      value: 22
    },
    {
      id: 'impossible-travel',
      name: 'Impossible travel',
      value: 9
    }
  ]

  const entities: Entity[] = [
    {
      id: 'entity-01',
      name: 'ava.wilson',
      type: 'User',
      score: 92,
      level: 'critical',
      alerts: 4
    },
    {
      id: 'entity-02',
      name: 'build-runner-07',
      type: 'Service account',
      score: 84,
      level: 'high',
      alerts: 3
    },
    {
      id: 'entity-03',
      name: 'laptop-0418',
      type: 'Device',
      score: 77,
      level: 'high',
      alerts: 2
    },
    {
      id: 'entity-04',
      name: 'mark.chen',
      type: 'User',
      score: 63,
      level: 'medium',
      alerts: 3
    },
    {
      id: 'entity-05',
      name: 'reporting-api',
      type: 'Service account',
      score: 58,
      level: 'medium',
      alerts: 1
    },
    {
      id: 'entity-06',
      name: 'lisa.martin',
      type: 'User',
      score: 41,
      level: 'low',
      alerts: 2
    }
  ]

  const entityColumns: TableColumn[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Entity',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      align: 'start',
      minWidth: 136
    },
    {
      id: 'score',
      accessorKey: 'score',
      header: 'Risk score',
      align: 'start',
      enableSorting: true,
      minWidth: 160
    },
    {
      id: 'alerts',
      accessorKey: 'alerts',
      header: 'Open alerts',
      align: 'end',
      enableSorting: true,
      minWidth: 104
    }
  ]

  const alerts: AlertRow[] = [
    {
      id: 'alert-01',
      level: 'critical',
      rank: 5,
      title: 'Data sent to a new destination',
      entity: 'ava.wilson',
      opened: 'Nov 10, 09:42',
      status: 'Open'
    },
    {
      id: 'alert-02',
      level: 'critical',
      rank: 5,
      title: 'Impossible travel',
      entity: 'ava.wilson',
      opened: 'Nov 10, 07:15',
      status: 'Investigating'
    },
    {
      id: 'alert-03',
      level: 'critical',
      rank: 5,
      title: 'Privilege change',
      entity: 'build-runner-07',
      opened: 'Nov 9, 22:08',
      status: 'Open'
    },
    {
      id: 'alert-04',
      level: 'high',
      rank: 4,
      title: 'Mass download',
      entity: 'laptop-0418',
      opened: 'Nov 9, 18:31',
      status: 'Investigating'
    },
    {
      id: 'alert-05',
      level: 'high',
      rank: 4,
      title: 'Repeated failed sign-ins',
      entity: 'build-runner-07',
      opened: 'Nov 9, 16:02',
      status: 'Open'
    },
    {
      id: 'alert-06',
      level: 'high',
      rank: 4,
      title: 'Sign-in from a new device',
      entity: 'mark.chen',
      opened: 'Nov 9, 11:47',
      status: 'Open'
    },
    {
      id: 'alert-07',
      level: 'medium',
      rank: 3,
      title: 'Access outside working hours',
      entity: 'reporting-api',
      opened: 'Nov 9, 03:20',
      status: 'Open'
    },
    {
      id: 'alert-08',
      level: 'medium',
      rank: 3,
      title: 'Sign-in from an unusual location',
      entity: 'mark.chen',
      opened: 'Nov 8, 21:55',
      status: 'Open'
    },
    {
      id: 'alert-09',
      level: 'medium',
      rank: 3,
      title: 'Repeated failed sign-ins',
      entity: 'lisa.martin',
      opened: 'Nov 8, 14:09',
      status: 'Investigating'
    },
    {
      id: 'alert-10',
      level: 'low',
      rank: 2,
      title: 'Sign-in from a new device',
      entity: 'lisa.martin',
      opened: 'Nov 8, 09:36',
      status: 'Open'
    },
    {
      id: 'alert-11',
      level: 'low',
      rank: 2,
      title: 'Access outside working hours',
      entity: 'laptop-0418',
      opened: 'Nov 7, 23:12',
      status: 'Open'
    },
    {
      id: 'alert-12',
      level: 'info',
      rank: 1,
      title: 'Sign-in from an unusual location',
      entity: 'mark.chen',
      opened: 'Nov 7, 10:48',
      status: 'Open'
    }
  ]

  const alertColumns: TableColumn[] = [
    {
      id: 'severity',
      accessorKey: 'rank',
      header: 'Severity',
      align: 'start',
      enableSorting: true,
      minWidth: 120
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Alert',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      id: 'entity',
      accessorKey: 'entity',
      header: 'Entity',
      align: 'start',
      minWidth: 160
    },
    {
      id: 'opened',
      accessorKey: 'opened',
      header: 'Opened',
      align: 'start',
      minWidth: 136
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      align: 'start',
      minWidth: 128
    }
  ]

  const statusSeverity: Record<AlertStatus, TagSeverity> = {
    Open: 'secondary',
    Investigating: 'info'
  }

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: (value) => compact.format(value),
    percentage: (value) => `${value.toFixed(0)}%`
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Alerts"
        description="What is open, how severe it is, what kind it is and who is involved."
      >
        <template #actions>
          <div class="w-44 shrink-0">
            <Select
              v-model="period"
              size="medium"
              :display-value="
                (value) => periods.find((option) => option.value === value)?.label ?? String(value)
              "
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
          </div>
        </template>
      </PageHeader>

      <section aria-label="Summary">
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
        class="grid grid-cols-1 items-stretch gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Alerts per day</ChartCard.Title>
              <Hint text="Alerts raised each day, stacked by severity level." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="series"
              :labels="labels"
              :format-value="formatters.count"
              :height="240"
              empty-title="No alerts in this period"
              empty-description="Nothing was raised in the last 30 days. Select a longer period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis
                kind="x"
                :ticks="6"
              />
              <Chart.Bar stacked />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <div class="lg:col-span-4">
          <Card title="Open by severity">
            <template #content>
              <ul
                v-if="loading"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="index in 5"
                  :key="index"
                  class="flex items-center justify-between gap-(--spacing-sm)"
                >
                  <Skeleton
                    width="30%"
                    height="1.25rem"
                  />
                  <Skeleton
                    width="20%"
                    height="1rem"
                  />
                </li>
              </ul>
              <ul
                v-else-if="openByLevel.length"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="level in openByLevel"
                  :key="level.id"
                  class="flex items-center justify-between gap-(--spacing-sm)"
                >
                  <SeverityTag :severity="level.id" />
                  <span class="flex items-baseline gap-(--spacing-xs) tabular-nums">
                    <span class="text-body-md text-(--text-default)">{{ level.count }}</span>
                    <span class="w-10 text-end text-body-sm text-(--text-muted)"
                      >{{ Math.round((level.count / openTotal) * 100) }}%</span
                    >
                  </span>
                </li>
              </ul>
              <EmptyState
                v-else
                size="small"
                icon="pi pi-check-circle"
                title="No open alerts"
                description="Every alert raised in the period has been closed."
              />
            </template>
          </Card>
        </div>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>By type</ChartCard.Title>
              <Hint text="Alerts raised in the period, by the kind of behavior that raised them." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="types"
              :format-value="formatters.count"
              empty-title="No alerts in this period"
              :loading="loading"
              aria-label="Alerts by type"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Highest risk</ChartCard.Title>
              <Hint
                text="The entities with the highest risk score, from the severity and number of their open alerts."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              v-if="loading || entities.length"
              :data="entities"
              :columns="entityColumns"
              row-key="id"
              enable-sorting
              header-kind="compact"
              bordered
              :loading="loading"
            >
              <template #cell-type="{ row }">
                <Tag
                  :label="row.type"
                  severity="secondary"
                  size="small"
                />
              </template>
              <template #cell-score="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                  <span class="w-8 shrink-0 text-end tabular-nums">{{ row.score }}</span>
                  <SeverityTag
                    :severity="row.level"
                    size="small"
                  />
                </div>
              </template>
              <template #cell-alerts="{ row }">
                <span class="tabular-nums">{{ row.alerts }}</span>
              </template>
            </TableRoot>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-users"
              title="No entities at risk yet"
              description="Entities appear here once an alert names them."
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Open alerts</ChartCard.Title>
              <Hint text="Every open alert, most severe first." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              v-if="loading || alerts.length"
              :data="alerts"
              :columns="alertColumns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :rows-per-page-options="[10, 25, 50]"
              header-kind="compact"
              bordered
              :loading="loading"
            >
              <template #cell-severity="{ row }">
                <SeverityTag
                  :severity="row.level"
                  size="small"
                />
              </template>
              <template #cell-status="{ row }">
                <Table.CellStatus
                  :label="row.status"
                  :severity="statusSeverity[row.status]"
                />
              </template>
            </TableRoot>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-bell"
              title="No open alerts"
              description="Alerts appear here when a detection rule matches. Select a longer period to see closed ones."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
```
