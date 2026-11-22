# DashboardAlerts (`dashboard/dashboard-alerts`)

> An alerts dashboard: what is open, how severe it is, what kind it is and who is involved. A page heading with the period Select sits over four StatTiles (open, critical or high open, alerts in the period and the false positive rate), each with its delta and a Hint. Below, a ChartCard stacks the alerts raised each day by severity level, with every series colored from the severity ramp so the bars, the legend and the tooltip read the same scale as the tables. Beside it, Open by severity lists one SeverityTag per level with its open count and its share of the open alerts. A BarList ranks the alerts by type, the Highest risk table pairs each entity with its risk score and the SeverityTag of its worst open alert, and the Open alerts table leads every row with its SeverityTag, sortable from critical to info. Built from `BarList`, `Card`, `Chart`, `ChartCard`, `EmptyState`, `Hint`, `PageHeader`, `Select`, `SeverityTag`, `Skeleton`, `StatTile`, `DataTable`, `DataTable`, `Tag` and `Alert`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-alerts/dashboard-alerts.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-alerts")`
- Components: [Alert](../../components/alert.md), [BarList](../../components/bar-list.md), [Card](../../components/card.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [DataTable](../../components/data-table.md), [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [PageHeader](../../components/page-header.md), [Select](../../components/select.md), [SeverityTag](../../components/severity-tag.md), [Skeleton](../../components/skeleton.md), [StatTile](../../components/stat-tile.md), `TableCellStatus`, [Tag](../../components/tag.md), `use-locale`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

alerts dashboard; open alerts; alerts by severity; incident dashboard; false positive rate; alert triage; painel de alertas; alertas abertos; alertas por severidade; triage open alerts

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

## Variants

- `Default` — primary (the code below)
- `Loading` — While the period loads, the tiles, the chart, the bar list and both tables render their own Skeleton, and Open by severity holds Skeleton rows, so nothing reflows when data arrives.
- `Empty` — A period with no alerts. The tiles show a dash with no delta, and every region keeps its box with an EmptyState that says why it is empty and what to do next.
- `Error` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-alerts", { variant })`, or the file under `blocks/dashboard/dashboard-alerts/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import type { BarListItem } from '@aziontech/webkit/bar-list'
  import BarList from '@aziontech/webkit/bar-list'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import type { SeverityTagSeverity } from '@aziontech/webkit/severity-tag'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import AlertsCard from './parts/alerts-card.vue'
  import EntityTable from './parts/entity-table.vue'
  import OpenAlertTable from './parts/open-alert-table.vue'
  import OpenBySeverity from './parts/open-by-severity.vue'
  import {
    sampleAlerts,
    sampleEntities,
    sampleKpis,
    sampleLabels,
    sampleOpenByLevel,
    sampleSeries,
    sampleTypes
  } from './sample'

  /** A summary tile. */
  export type AlertsDashboardMetric = 'open' | 'critical-high' | 'raised' | 'false-positives'

  /** The figure a summary tile shows. */
  export interface AlertsDashboardKpi {
    /** The figure for the period; null reads as a dash. */
    value: number | null
    /** Percent change against the previous period; null hides the delta. */
    delta: number | null
  }

  /** The figures of the summary tiles, by metric; a metric left out reads as a dash. */
  export type AlertsDashboardKpis = Partial<Record<AlertsDashboardMetric, AlertsDashboardKpi>>

  /** One row of Open by severity. */
  export interface AlertsDashboardLevelCount {
    /** The severity level. */
    id: SeverityTagSeverity
    /** Open alerts at this level. */
    count: number
  }

  /** One row of Highest risk. */
  export interface AlertsDashboardEntity {
    /** Stable key. */
    id: string
    /** The user, device or service account. */
    name: string
    /** What kind of entity it is, shown as a neutral tag. */
    type: string
    /** Risk score from 0 to 100. */
    score: number
    /** The severity of its worst open alert. */
    level: SeverityTagSeverity
    /** How many alerts name it and are open. */
    alerts: number
  }

  /** Where an open alert stands. */
  export type AlertsDashboardAlertStatus = 'Open' | 'Investigating'

  /** One row of Open alerts. */
  export interface AlertsDashboardAlert {
    /** Stable key. */
    id: string
    /** The severity level. */
    level: SeverityTagSeverity
    /** Sort key of the level, 5 for critical down to 1 for info. */
    rank: number
    /** What raised it. */
    title: string
    /** The entity it names. */
    entity: string
    /** When it was opened, already formatted. */
    opened: string
    /** Where it stands. */
    status: AlertsDashboardAlertStatus
  }

  export interface AlertsDashboardProps {
    /** The summary tile figures. Left out, the sample renders. */
    kpis?: AlertsDashboardKpis
    /** The day labels of Alerts per day. Left out, the sample renders. */
    labels?: string[]
    /** Alerts per day, one series per severity level. Left out, the sample renders. */
    series?: ChartSeries[]
    /** Open alerts by severity level. Left out, the sample renders. */
    openByLevel?: AlertsDashboardLevelCount[]
    /** Alerts raised in the period, by type. Left out, the sample renders. */
    types?: BarListItem[]
    /** The entities with the highest risk score. Left out, the sample renders. */
    entities?: AlertsDashboardEntity[]
    /** Every open alert, most severe first. Left out, the sample renders. */
    alerts?: AlertsDashboardAlert[]
    /** The period is loading: every region shows its skeleton. */
    loading?: boolean
    /** Why the period could not load, after the name of each region in its danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<AlertsDashboardProps>(), {
    kpis: undefined,
    labels: undefined,
    series: undefined,
    openByLevel: undefined,
    types: undefined,
    entities: undefined,
    alerts: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  const period = defineModel<string>('period', { default: '30d' })

  type FigureFormat = 'count' | 'percentage'

  const comparison = 'vs previous period'
  const activeIndex = ref<number | null>(null)

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

  const periodPhrase = computed(
    () =>
      periods.find((option) => option.value === period.value)?.label.toLowerCase() ?? 'this period'
  )

  const tiles: {
    metric: AlertsDashboardMetric
    label: string
    description: string
    format: FigureFormat
  }[] = [
    {
      metric: 'open',
      label: 'Open',
      description: 'Alerts nobody has closed yet, at any severity.',
      format: 'count'
    },
    {
      metric: 'critical-high',
      label: 'Critical or high open',
      description: 'Open alerts at the two highest severity levels.',
      format: 'count'
    },
    {
      metric: 'raised',
      label: 'Alerts in the period',
      description: 'Every alert raised in the period, open or closed.',
      format: 'count'
    },
    {
      metric: 'false-positives',
      label: 'False positives',
      description: 'Share of the alerts closed in the period that were marked as false positives.',
      format: 'percentage'
    }
  ]

  const blocked = computed(() => props.loading || props.error !== '')
  const kpis = computed(() => props.kpis ?? (blocked.value ? {} : sampleKpis))
  const labels = computed(() => props.labels ?? (blocked.value ? [] : sampleLabels))
  const series = computed(() => props.series ?? (blocked.value ? [] : sampleSeries))
  const openByLevel = computed(() => props.openByLevel ?? (blocked.value ? [] : sampleOpenByLevel))
  const types = computed(() => props.types ?? (blocked.value ? [] : sampleTypes))
  const entities = computed(() => props.entities ?? (blocked.value ? [] : sampleEntities))
  const alerts = computed(() => props.alerts ?? (blocked.value ? [] : sampleAlerts))

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: (value) => compact(value),
    percentage: (value) => `${value.toFixed(0)}%`
  }

  const retry = (event: MouseEvent) => emit('retry', event)
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
              variant="ghost"
              v-model="period"
              size="medium"
              :display-value="
                (value) => periods.find((option) => option.value === value)?.label ?? String(value)
              "
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
          </div>
        </template>
      </PageHeader>

      <section aria-label="Summary">
        <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
          <li
            v-for="tile in tiles"
            :key="tile.metric"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="tile.label"
              :value="kpis[tile.metric]?.value ?? null"
              :format-value="formatters[tile.format]"
              :delta="kpis[tile.metric]?.delta ?? null"
              :delta-label="comparison"
              inverse
              :loading="loading"
              :error="error"
            >
              <template #aside>
                <Hint :content="tile.description" />
              </template>
            </StatTile>
          </li>
        </ul>
      </section>

      <div
        class="grid grid-cols-1 items-stretch gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <AlertsCard
          :span="8"
          title="Alerts per day"
          hint="Alerts raised each day, stacked by severity level."
          region="alerts per day"
          :error="error"
          @retry="retry"
        >
          <Chart
            v-model:active-index="activeIndex"
            :series="series"
            :labels="labels"
            :format-value="formatters.count"
            :height="240"
            empty-title="No alerts in this period"
            :empty-description="`Nothing was raised in the ${periodPhrase}. Select a longer period.`"
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis type="y" />
            <Chart.Axis
              type="x"
              :ticks="6"
            />
            <Chart.Bar stacked />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend />
          </Chart>
        </AlertsCard>

        <OpenBySeverity
          :levels="openByLevel"
          :loading="loading"
          :error="error"
          @retry="retry"
        />

        <AlertsCard
          :span="4"
          title="By type"
          hint="Alerts raised in the period, by the kind of behavior that raised them."
          region="alerts by type"
          :error="error"
          @retry="retry"
        >
          <BarList
            :items="types"
            :format-value="formatters.count"
            empty-title="No alerts in this period"
            :loading="loading"
            aria-label="Alerts by type"
          />
        </AlertsCard>

        <AlertsCard
          :span="8"
          title="Highest risk"
          hint="The entities with the highest risk score, from the severity and number of their open alerts."
          region="highest risk"
          :error="error"
          @retry="retry"
        >
          <EntityTable
            :entities="entities"
            :loading="loading"
          />
        </AlertsCard>

        <AlertsCard
          :span="12"
          title="Open alerts"
          hint="Every open alert, most severe first."
          region="open alerts"
          :error="error"
          @retry="retry"
        >
          <OpenAlertTable
            :alerts="alerts"
            :loading="loading"
          />
        </AlertsCard>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { BarListItem } from '@aziontech/webkit/bar-list'
import type { ChartSeries } from '@aziontech/webkit/chart'

import type {
  AlertsDashboardAlert,
  AlertsDashboardEntity,
  AlertsDashboardKpis,
  AlertsDashboardLevelCount
} from './dashboard-alerts.vue'

export const sampleKpis: AlertsDashboardKpis = {
  open: { value: 42, delta: 10.5 },
  'critical-high': { value: 9, delta: 28.6 },
  raised: { value: 1231, delta: 4.2 },
  'false-positives': { value: 6, delta: -14.3 }
}

export const sampleLabels: string[] = [
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

export const sampleSeries: ChartSeries[] = [
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
      10, 8, 7, 7, 7, 9, 10, 10, 9, 7, 5, 3, 3, 4, 6, 8, 9, 8, 7, 5, 5, 10, 13, 17, 11, 12, 11, 10,
      8, 7
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

export const sampleOpenByLevel: AlertsDashboardLevelCount[] = [
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

export const sampleTypes: BarListItem[] = [
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

export const sampleEntities: AlertsDashboardEntity[] = [
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

export const sampleAlerts: AlertsDashboardAlert[] = [
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
```

## `parts/alerts-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'

  export interface AlertsCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title. */
    title: string
    /** One sentence on what the card shows. */
    hint: string
    /** The region name the danger alert reads. */
    region: string
    /** Why the period could not load; empty shows the content. */
    error?: string
  }

  withDefaults(defineProps<AlertsCardProps>(), { error: '' })

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
    </ChartCard.Header>
    <ChartCard.Content>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load ${region}. ${error}`"
        action-label="Retry"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
      <slot v-else />
    </ChartCard.Content>
  </ChartCard>
</template>
```

## `parts/entity-table.vue`

```ts
<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import Tag from '@aziontech/webkit/tag'

  import type { AlertsDashboardEntity } from '../dashboard-alerts.vue'

  export interface EntityTableProps {
    /** The entities with the highest risk score. */
    entities: AlertsDashboardEntity[]
    /** The period is loading. */
    loading?: boolean
  }

  withDefaults(defineProps<EntityTableProps>(), { loading: false })

  const entityColumns: TableColumn[] = [
    {
      accessorKey: 'name',
      header: 'Entity',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      accessorKey: 'type',
      header: 'Type',
      align: 'start',
      minWidth: 136
    },
    {
      accessorKey: 'score',
      header: 'Risk score',
      align: 'start',
      sortable: true,
      minWidth: 160
    },
    {
      accessorKey: 'alerts',
      header: 'Open alerts',
      align: 'end',
      sortable: true,
      minWidth: 104
    }
  ]
</script>

<template>
  <DataTable
    v-if="loading || entities.length"
    :data="entities"
    :columns="entityColumns"
    row-key="id"
    sortable
    density="compact"
    bordered
    :loading="loading"
  >
    <template #cell-type="{ row }">
      <Tag
        :label="row.type"
        severity="neutral"
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
  </DataTable>
  <EmptyState
    v-else
    size="small"
    icon="az az-users"
    title="No entities at risk yet"
    description="Entities appear here once an alert names them."
  />
</template>
```

## `parts/open-alert-table.vue`

```ts
<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import type { TagSeverity } from '@aziontech/webkit/tag'

  import type { AlertsDashboardAlert, AlertsDashboardAlertStatus } from '../dashboard-alerts.vue'

  export interface OpenAlertTableProps {
    /** Every open alert, most severe first. */
    alerts: AlertsDashboardAlert[]
    /** The period is loading. */
    loading?: boolean
  }

  withDefaults(defineProps<OpenAlertTableProps>(), { loading: false })

  const alertColumns: TableColumn[] = [
    {
      accessorKey: 'rank',
      id: 'severity',
      header: 'Severity',
      align: 'start',
      sortable: true,
      minWidth: 120
    },
    {
      accessorKey: 'title',
      header: 'Alert',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      accessorKey: 'entity',
      header: 'Entity',
      align: 'start',
      minWidth: 160
    },
    {
      accessorKey: 'opened',
      header: 'Opened',
      align: 'start',
      minWidth: 136
    },
    {
      accessorKey: 'status',
      header: 'Status',
      align: 'start',
      minWidth: 128
    }
  ]

  const statusSeverity: Record<AlertsDashboardAlertStatus, TagSeverity> = {
    Open: 'neutral',
    Investigating: 'info'
  }
</script>

<template>
  <DataTable
    v-if="loading || alerts.length"
    :data="alerts"
    :columns="alertColumns"
    row-key="id"
    sortable
    paginated
    :page-size="10"
    :page-size-options="[10, 25, 50]"
    density="compact"
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
      <TableCellStatus
        :label="row.status"
        :severity="statusSeverity[row.status]"
      />
    </template>
  </DataTable>
  <EmptyState
    v-else
    size="small"
    icon="az az-bell"
    title="No open alerts"
    description="Alerts appear here when a detection rule matches. Select a longer period to see closed ones."
  />
</template>
```

## `parts/open-by-severity.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed } from 'vue'

  import type { AlertsDashboardLevelCount } from '../dashboard-alerts.vue'

  export interface OpenBySeverityProps {
    /** Open alerts by severity level. */
    levels: AlertsDashboardLevelCount[]
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load. */
    error?: string
  }

  const props = withDefaults(defineProps<OpenBySeverityProps>(), { loading: false, error: '' })

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const openTotal = computed(() => props.levels.reduce((sum, level) => sum + level.count, 0))
</script>

<template>
  <div class="lg:col-span-4">
    <Card title="Open by severity">
      <template #default>
        <Alert
          v-if="error"
          severity="danger"
          :label="`Couldn't load open alerts by severity. ${error}`"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <ul
          v-else-if="loading"
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
          v-else-if="levels.length"
          class="flex flex-col gap-(--spacing-md)"
        >
          <li
            v-for="level in levels"
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
          icon="az az-circle-check"
          title="No open alerts"
          description="Every alert raised in the period has been closed."
        />
      </template>
    </Card>
  </div>
</template>
```
