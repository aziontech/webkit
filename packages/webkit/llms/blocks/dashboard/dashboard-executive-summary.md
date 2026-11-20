# DashboardExecutiveSummary (`dashboard/dashboard-executive-summary`)

> An executive summary dashboard: one page a lead reads to see how the quarter went. A page heading with the quarter Select and Export sits over a scorecard row of six StatTiles (revenue, monthly active users, net revenue retention, NPS, uptime and cost per request), each with its delta against last quarter and a Hint that defines it. Below, a trend grid of small multiples, one ChartCard per metric with a compact Chart (Area or Line) over the last 12 months and a Tag with the twelve-month change, shares one active index so hovering a month moves the crosshair on every card. A side column holds the goals, a Card of goal bars where each goal shows its label, a status Tag (On track, At risk, Off track), a Progress of current against target and both figures, and the commentary, a Card of Item rows with the author Avatar, role, date and the note itself. Built from `Avatar`, `Button`, `Card`, `Chart`, `ChartCard`, `EmptyState`, `Hint`, `Item`, `PageHeader`, `Progress`, `Select`, `Skeleton`, `StatTile`, `Tag` and `Alert`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-executive-summary/dashboard-executive-summary.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-executive-summary")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [Item](../../components/item.md), [PageHeader](../../components/page-header.md), [Progress](../../components/progress.md), [Select](../../components/select.md), [Skeleton](../../components/skeleton.md), [StatTile](../../components/stat-tile.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), `use-locale`, `utils/csv`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

executive summary; executive dashboard; scorecard; quarterly report; business kpis; leadership dashboard; resumo executivo; painel executivo; indicadores do trimestre; business kpi roll-up; leadership summary

The one page a lead reads to see how the quarter went: the headline results against last quarter, the
twelve-month trend behind each one, progress on the quarter's goals and the notes the leads wrote when
they reviewed it. It favours a few numbers read in seconds over detail; every figure links back to its
own dashboard for the breakdown.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-executive-summary for a one-page roll-up of business KPIs for leadership.
- A recurring review (quarterly, monthly) where readers need results, trends, goals and context together.
- The audience reads the page, they do not investigate on it.
- There are a handful of headline metrics (about six) with targets.

## When not to use

- Investigating a metric by dimension: use `dashboard/dashboard-analytics`
  (Usage for consumption).
- A total broken into categories: use `dashboard/dashboard-breakdown`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Executive summary` and one sentence on what it contains. Actions hold the quarter and Export.

### B. Quarter — `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

The reporting period, labelled `Quarter`. It scopes every region, including goals and commentary.

### C. Export — `Button` (optional)

`Export` downloads the scorecard and the goals of the chosen quarter as CSV (`executive-summary-q3-2026.csv`) for sharing outside the product, and confirms with a success toast naming the file (an error toast when it fails). Disabled while loading, and when the quarter failed or has no data.

### D. Scorecard — `StatTile` (required)

Six tiles in a region labelled `Scorecard`: `Revenue`, `Monthly active users`, `Net revenue retention`,
`NPS`, `Uptime`, `Cost per request`, each with its delta against last quarter. Only `Cost per request`
passes `inverse`; a rise there is bad.

### E. Metric definitions — `Hint` (required)

One sentence per tile and trend card. Executives may not know how NPS or net revenue retention are
computed; the `Hint` says so without adding text to the tile.

### F. Trend cards — `ChartCard` (required)

Small multiples in a region labelled `Trends`, one card per scorecard metric, all the same size, so
the reader compares shapes, not axes.

### G. Twelve-month change — `Tag` (required)

The trend card's change over twelve months (`+25.2%`), and each goal's status (`On track`, `At risk`,
`Off track`).

### H. Compact trends — `Chart` (required)

Area or Line over the last 12 months. Every trend card shares one `active-index`, so hovering a month
moves the crosshair on all of them and the reader reads one month across every metric.

### I. Goals and commentary — `Card` (required)

The side column: a goals `Card` titled with the quarter (`Q3 goals`) and a `Commentary` card.

### J. Loading rows — `Skeleton` (required)

Holds goal rows and note rows while the quarter loads.

### K. Goal progress — `Progress` (required)

Current against target for each goal, with an `aria-label` naming the goal, and both figures printed
beside it in tabular numbers.

### L. Empty regions — `EmptyState` (required)

Each region names the quarter in its empty state: trend cards
(`No results for Q3` / `Nothing was reported in this period. Select a later quarter.`), goals and
commentary (`Leads add notes here when they review the quarter.`).

### M. Notes — `Item` (required)

One `Item` per note: author, role, date and the note itself.

### N. Author — `Avatar` (required)

The author's initials beside each note.

### O. Load failure — `Alert` (required)

When `error` is set, every card keeps its header and shows a danger `Alert` in place of its content: `Couldn't load <card>.` followed by the message, with Retry, which emits `retry`.

## Data

The block takes its figures and records through props and emits every action; it fetches nothing. `ExecutiveSummaryDashboardProps` and the record types (`ExecutiveSummaryDashboardKpis`, `ExecutiveSummaryDashboardGoal`, `ExecutiveSummaryDashboardTrends`, `ExecutiveSummaryDashboardNote`) are exported from `dashboard-executive-summary.vue`, and `sample.ts` holds the sample quarter the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop              | Type                              | What it does                                                                                                                                                            |
| ----------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kpis`            | `ExecutiveSummaryDashboardKpis`   | The value and delta of each scorecard tile, by metric (`revenue`, `active-users`, `retention`, `nps`, `uptime`, `cost-per-request`). A metric left out reads as a dash. |
| `goals`           | `ExecutiveSummaryDashboardGoal[]` | The quarter goals with their current figure, target and status. `[]` shows No goal results.                                                                             |
| `labels`          | `string[]`                        | The month labels of the trend charts.                                                                                                                                   |
| `trends`          | `ExecutiveSummaryDashboardTrends` | Each trend card's monthly values and change tag, by metric. A metric left out shows the card's empty state.                                                             |
| `notes`           | `ExecutiveSummaryDashboardNote[]` | The notes from the leads, newest first. `[]` shows No notes.                                                                                                            |
| `loading`         | `boolean`                         | The quarter is loading; tiles and charts show their skeleton, goals and commentary hold skeleton rows, Export disables.                                                 |
| `error`           | `string`                          | Why the quarter could not load; each card shows `Couldn't load <card>.` and this message in a danger `Alert` with Retry.                                                |
| `v-model:quarter` | `string`                          | The selected quarter (`Q3 2026` down to `Q3 2025`); default `Q3 2026`. Refetch when it changes.                                                                         |

| Event            | Payload   | When                                                                      |
| ---------------- | --------- | ------------------------------------------------------------------------- |
| `retry`          | `(event)` | Retry in any card's error alert.                                          |
| `export`         | `(event)` | Export in the header; the block downloads the scorecard and goals as CSV. |
| `update:quarter` | `(value)` | The reader picked another quarter.                                        |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import DashboardExecutiveSummary from './dashboard-executive-summary.vue'

  const quarter = ref('Q3 2026')
  const { data, pending, error, refresh } = useExecutiveSummary(quarter)
</script>

<template>
  <DashboardExecutiveSummary
    v-model:quarter="quarter"
    :kpis="data?.kpis ?? {}"
    :goals="data?.goals ?? []"
    :labels="data?.labels ?? []"
    :trends="data?.trends ?? {}"
    :notes="data?.notes ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep every trend card the same size and form so shapes compare.
- Show the target next to the current value for every goal; a bar alone hides the gap.
- Use status words for goals (`On track`, `At risk`, `Off track`), with color as reinforcement.
- Link from each metric to the dashboard that explains it, when one exists.

## Don't

- Don't add more than about six scorecard tiles; the page is read, not explored.
- Don't give trend cards different periods or sizes.
- Don't mark growth metrics `inverse`; only cost and error style metrics read a rise as bad.
- Don't leave commentary empty without saying who fills it.

## Copy

- **Title:** `Executive summary`.
- **Description:** `Headline results for the quarter, progress on its goals, twelve-month trends and notes from the leads.`
- **Tile labels:** spelled-out metric, acronyms uppercase. `Net revenue retention`, `NPS`.
- **Goal status:** two words at most. `On track`, `At risk`, `Off track`.
- **Empty states:** name the period. `No goal results for Q3` / `Progress appears once the quarter reports its first month.`

## Accessibility

- The quarter `Select` trigger has `aria-label="Quarter"`; tiles and trends are regions labelled `Scorecard` and `Trends`.
- Each goal `Progress` has an `aria-label` with the goal name; current and target are visible text.
- Goal status is a word in a `Tag`, never color alone.
- Figures use `tabular-nums`.

## States

- Default: the reported quarter (`v-model:quarter`).
- Loading: `loading` is set; tiles and charts render their own `Skeleton`; goals and commentary hold Skeleton rows.
- Empty: a quarter with nothing reported (`kpis` and `trends` are `{}`, `goals` and `notes` are `[]`); tiles show a dash with no delta, every trend card keeps its box with an `EmptyState` that names the quarter, and goals and commentary say what fills them.
- Error: the request for the quarter failed (`error` is set); tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load, carries the message and offers Retry.

## Related

- `dashboard/dashboard-breakdown` — where a cost metric breaks down.
- `dashboard/dashboard-analytics` — the detail behind a traffic metric.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the quarter loads, the tiles and charts render their own Skeleton and the goals and commentary hold Skeleton rows, so the page does not reflow when data arrives.
- `Empty` — A quarter with nothing reported. The tiles show a dash with no delta, every trend card keeps its box with an EmptyState that names the quarter and points to a later one, and the goals and commentary each say what fills them.
- `Error` — The request for the quarter failed: the tiles read as dashes, and every trend card, the goals and the commentary keep their header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-executive-summary", { variant })`, or the file under `blocks/dashboard/dashboard-executive-summary/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Progress from '@aziontech/webkit/progress'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  import { sampleGoals, sampleKpis, sampleLabels, sampleNotes, sampleTrends } from './sample'

  /** A scorecard tile and its twelve-month trend. */
  export type ExecutiveSummaryDashboardMetric =
    'revenue' | 'active-users' | 'retention' | 'nps' | 'uptime' | 'cost-per-request'

  /** How a figure is written. */
  export type ExecutiveSummaryDashboardFormat =
    'currency' | 'count' | 'percentage' | 'uptime' | 'score' | 'cost'

  /** The figure a scorecard tile shows. */
  export interface ExecutiveSummaryDashboardKpi {
    /** The figure for the quarter; null reads as a dash. */
    value: number | null
    /** Percent change against last quarter; null hides the delta. */
    delta: number | null
  }

  /** The scorecard figures, by metric; a metric left out reads as a dash. */
  export type ExecutiveSummaryDashboardKpis = Partial<
    Record<ExecutiveSummaryDashboardMetric, ExecutiveSummaryDashboardKpi>
  >

  /** A labelled status tag. */
  export interface ExecutiveSummaryDashboardStatus {
    /** The tag text. */
    label: string
    /** The tag color. */
    severity: TagSeverity
  }

  /** One row of the quarter goals. */
  export interface ExecutiveSummaryDashboardGoal {
    /** Stable key. */
    id: string
    /** What the goal measures. */
    label: string
    /** Where it stands now. */
    current: number
    /** Where it should end the quarter. */
    target: number
    /** How the current and target figures are written. */
    format: ExecutiveSummaryDashboardFormat
    /** On track, at risk or off track. */
    status: ExecutiveSummaryDashboardStatus
  }

  /** The change tag in a trend card header. */
  export interface ExecutiveSummaryDashboardChange extends ExecutiveSummaryDashboardStatus {
    /** Icon class of the direction arrow. */
    icon: string
  }

  /** The data of one trend card. */
  export interface ExecutiveSummaryDashboardTrend {
    /** One value per month label. */
    values: (number | null)[]
    /** The change over the twelve months; null hides the tag. */
    change: ExecutiveSummaryDashboardChange | null
  }

  /** The trend cards' data, by metric; a metric left out shows its empty state. */
  export type ExecutiveSummaryDashboardTrends = Partial<
    Record<ExecutiveSummaryDashboardMetric, ExecutiveSummaryDashboardTrend>
  >

  /** One note in Commentary. */
  export interface ExecutiveSummaryDashboardNote {
    /** Stable key. */
    id: string
    /** Who wrote it. */
    author: string
    /** The avatar initials. */
    initials: string
    /** The author's role. */
    role: string
    /** When it was written, as an ISO date. */
    date: string
    /** The same date, formatted for reading. */
    dateLabel: string
    /** The note itself. */
    body: string
  }

  export interface ExecutiveSummaryDashboardProps {
    /** The scorecard figures. Left out, the sample renders. */
    kpis?: ExecutiveSummaryDashboardKpis
    /** The quarter goals. Left out, the sample renders. */
    goals?: ExecutiveSummaryDashboardGoal[]
    /** The month labels of the trend charts. Left out, the sample renders. */
    labels?: string[]
    /** The trend cards' values and change tags. Left out, the sample renders. */
    trends?: ExecutiveSummaryDashboardTrends
    /** The notes from the leads, newest first. Left out, the sample renders. */
    notes?: ExecutiveSummaryDashboardNote[]
    /** The quarter is loading: every region shows its skeleton. */
    loading?: boolean
    /** Why the quarter could not load, after the name of each card in its danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<ExecutiveSummaryDashboardProps>(), {
    kpis: undefined,
    goals: undefined,
    labels: undefined,
    trends: undefined,
    notes: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    export: [event: MouseEvent]
  }>()

  const quarter = defineModel<string>('quarter', { default: 'Q3 2026' })

  const comparison = 'vs last quarter'
  const activeIndex = ref<number | null>(null)

  const quarters = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']

  const tiles: {
    metric: ExecutiveSummaryDashboardMetric
    label: string
    description: string
    format: ExecutiveSummaryDashboardFormat
    inverse: boolean
  }[] = [
    {
      metric: 'revenue',
      label: 'Revenue',
      description: 'Recognized revenue for the quarter.',
      format: 'currency',
      inverse: false
    },
    {
      metric: 'active-users',
      label: 'Monthly active users',
      description: 'People who signed in at least once in the last month of the quarter.',
      format: 'count',
      inverse: false
    },
    {
      metric: 'retention',
      label: 'Net revenue retention',
      description: 'Revenue kept from existing customers, expansion included, over twelve months.',
      format: 'percentage',
      inverse: false
    },
    {
      metric: 'nps',
      label: 'NPS',
      description: 'Net promoter score from the quarterly customer survey.',
      format: 'score',
      inverse: false
    },
    {
      metric: 'uptime',
      label: 'Uptime',
      description: 'Share of minutes every public service answered, averaged over the quarter.',
      format: 'uptime',
      inverse: false
    },
    {
      metric: 'cost-per-request',
      label: 'Cost per request',
      description: 'Infrastructure spend divided by requests served. A rise is a regression.',
      format: 'cost',
      inverse: true
    }
  ]

  const charts: {
    metric: ExecutiveSummaryDashboardMetric
    title: string
    description: string
    mark: 'area' | 'line'
    format: ExecutiveSummaryDashboardFormat
    min: number
  }[] = [
    {
      metric: 'revenue',
      title: 'Revenue',
      description: 'Recognized revenue per month.',
      mark: 'area',
      format: 'currency',
      min: 0
    },
    {
      metric: 'active-users',
      title: 'Monthly active users',
      description: 'People who signed in at least once in the month.',
      mark: 'area',
      format: 'count',
      min: 0
    },
    {
      metric: 'retention',
      title: 'Net revenue retention',
      description: 'Trailing twelve months, measured at month end.',
      mark: 'line',
      format: 'percentage',
      min: 100
    },
    {
      metric: 'nps',
      title: 'NPS',
      description: 'Net promoter score from the monthly pulse survey.',
      mark: 'line',
      format: 'score',
      min: 0
    },
    {
      metric: 'uptime',
      title: 'Uptime',
      description: 'Share of minutes every public service answered.',
      mark: 'line',
      format: 'uptime',
      min: 99.8
    },
    {
      metric: 'cost-per-request',
      title: 'Cost per request',
      description: 'Infrastructure spend divided by requests served.',
      mark: 'line',
      format: 'cost',
      min: 0
    }
  ]

  const blocked = computed(() => props.loading || props.error !== '')
  const kpis = computed(() => props.kpis ?? (blocked.value ? {} : sampleKpis))
  const goals = computed(() => props.goals ?? (blocked.value ? [] : sampleGoals))
  const months = computed(() => props.labels ?? (blocked.value ? [] : sampleLabels))
  const trendData = computed(() => props.trends ?? (blocked.value ? {} : sampleTrends))
  const notes = computed(() => props.notes ?? (blocked.value ? [] : sampleNotes))

  const trendCards = computed(() =>
    charts.map((chart) => {
      const data = trendData.value[chart.metric]
      const series: ChartSeries[] = data
        ? [{ id: chart.metric, name: chart.title, values: data.values }]
        : []
      return { ...chart, change: data?.change ?? null, series }
    })
  )

  const exportable = computed(
    () =>
      !blocked.value &&
      (goals.value.length > 0 || Object.values(kpis.value).some((kpi) => kpi?.value != null))
  )
  const failed = (card: string) => `Couldn't load ${card}. ${props.error}`

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const money = (value: number) =>
    formatNumber(value, {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    })

  const formatters: Record<ExecutiveSummaryDashboardFormat, (value: number) => string> = {
    currency: (value) => money(value),
    count: (value) => compact(value),
    percentage: (value) => `${value.toFixed(0)}%`,
    uptime: (value) => `${value.toFixed(2)}%`,
    score: (value) => value.toFixed(0),
    cost: (value) => `${value.toFixed(4)}`
  }

  const reportColumns: CsvColumn[] = Object.entries({
    section: 'Section',
    metric: 'Metric',
    value: 'Value',
    detail: 'Change or target'
  }).map(([id, header]) => ({ id, header }))

  const reportRows = () => [
    ...tiles.map((tile) => {
      const kpi = kpis.value[tile.metric]
      return {
        section: 'Scorecard',
        metric: tile.label,
        value: kpi?.value == null ? '' : formatters[tile.format](kpi.value),
        detail: kpi?.delta == null ? '' : `${kpi.delta}% ${comparison}`
      }
    }),
    ...goals.value.map((goal) => ({
      section: 'Goals',
      metric: goal.label,
      value: formatters[goal.format](goal.current),
      detail: `Target ${formatters[goal.format](goal.target)}, ${goal.status.label}`
    }))
  ]

  const exportCsv = (event: MouseEvent) => {
    emit('export', event)
    const filename = `executive-summary-${quarter.value.toLowerCase().replaceAll(' ', '-')}.csv`
    try {
      downloadCsv(filename, toCsv({ columns: reportColumns, rows: reportRows() }))
      toast.success('CSV exported.', { description: filename })
    } catch {
      toast.error('The CSV could not be exported.', { description: 'Try again in a moment.' })
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Executive summary"
        description="Headline results for the quarter, progress on its goals, twelve-month trends and notes from the leads."
      >
        <template #actions>
          <div class="w-36">
            <Select
              variant="ghost"
              v-model="quarter"
              size="medium"
            >
              <Select.Trigger aria-label="Quarter" />
              <Select.Content>
                <Select.Item
                  v-for="option in quarters"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
          <Button
            label="Export"
            variant="outline"
            size="medium"
            icon="az az-download"
            :disabled="!exportable"
            @click="exportCsv"
          />
        </template>
      </PageHeader>

      <section aria-label="Scorecard">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
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
              :inverse="tile.inverse"
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

      <div class="grid grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-12">
        <section
          aria-label="Trends"
          class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] md:grid-cols-2 md:[--chart-grid-columns:2] xl:col-span-8"
        >
          <ChartCard
            v-for="trend in trendCards"
            :key="trend.metric"
            :span="1"
          >
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>{{ trend.title }}</ChartCard.Title>
                <Hint :content="trend.description" />
              </span>
              <ChartCard.Action>
                <Tag
                  v-if="trend.change && !loading"
                  :label="trend.change.label"
                  :severity="trend.change.severity"
                  :icon="trend.change.icon"
                  size="small"
                />
              </ChartCard.Action>
            </ChartCard.Header>
            <ChartCard.Content>
              <Alert
                v-if="error"
                severity="danger"
                :label="failed(trend.title.toLowerCase())"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <Chart
                v-else
                v-model:active-index="activeIndex"
                :series="trend.series"
                :labels="months"
                :min="trend.min"
                :format-value="formatters[trend.format]"
                :height="160"
                :empty-title="'No results for ' + quarter"
                empty-description="Nothing was reported in this period. Select a later quarter."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis
                  type="x"
                  :ticks="4"
                />
                <Chart.Area v-if="trend.mark === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
              </Chart>
            </ChartCard.Content>
          </ChartCard>
        </section>

        <div class="flex min-w-0 flex-col gap-(--spacing-md) xl:col-span-4">
          <Card :title="quarter + ' goals'">
            <template #default>
              <Alert
                v-if="error"
                severity="danger"
                :label="failed(quarter + ' goals')"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <ul
                v-else-if="loading"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="index in 5"
                  :key="index"
                  class="flex flex-col gap-(--spacing-xs)"
                >
                  <Skeleton
                    width="60%"
                    height="1rem"
                  />
                  <Skeleton height="0.5rem" />
                  <Skeleton
                    width="40%"
                    height="0.75rem"
                  />
                </li>
              </ul>
              <ul
                v-else-if="goals.length"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="goal in goals"
                  :key="goal.id"
                  class="flex flex-col gap-(--spacing-xs)"
                >
                  <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
                    <span class="truncate text-label-md text-(--text-default)">{{
                      goal.label
                    }}</span>
                    <Tag
                      :label="goal.status.label"
                      :severity="goal.status.severity"
                      size="small"
                    />
                  </div>
                  <Progress
                    :value="goal.current"
                    :max="goal.target"
                    size="small"
                    :aria-label="goal.label"
                    :aria-valuetext="
                      formatters[goal.format](goal.current) +
                      ' of ' +
                      formatters[goal.format](goal.target)
                    "
                  />
                  <div
                    class="flex items-center justify-between gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    <span class="tabular-nums">
                      {{ formatters[goal.format](goal.current) }} of
                      {{ formatters[goal.format](goal.target) }}
                    </span>
                    <span class="tabular-nums"
                      >{{ Math.round((goal.current / goal.target) * 100) }}%</span
                    >
                  </div>
                </li>
              </ul>
              <EmptyState
                v-else
                size="small"
                icon="az az-flag"
                :title="'No goal results for ' + quarter"
                description="Progress appears once the quarter reports its first month."
              />
            </template>
          </Card>

          <Card
            title="Commentary"
            :padded="error !== ''"
          >
            <template #default>
              <Alert
                v-if="error"
                severity="danger"
                :label="failed('commentary')"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <Item.List
                v-else-if="loading"
                key="item.list-1"
                aria-busy="true"
              >
                <Item
                  v-for="index in 3"
                  :key="index"
                  size="small"
                  role="listitem"
                >
                  <Item.Media>
                    <Skeleton
                      variant="circle"
                      width="2rem"
                      height="2rem"
                    />
                  </Item.Media>
                  <Item.Content>
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Skeleton
                        width="45%"
                        height="1rem"
                      />
                      <Skeleton height="2.5rem" />
                    </div>
                  </Item.Content>
                </Item>
              </Item.List>
              <Item.List
                key="item.list-2"
                v-else-if="notes.length"
              >
                <Item
                  v-for="note in notes"
                  :key="note.id"
                  size="small"
                  role="listitem"
                >
                  <Item.Media>
                    <Avatar
                      :label="note.initials"
                      size="medium"
                    />
                  </Item.Media>
                  <Item.Content>
                    <Item.Title>{{ note.author }}</Item.Title>
                    <Item.Description>
                      {{ note.role }} · <time :datetime="note.date">{{ note.dateLabel }}</time>
                    </Item.Description>
                    <p class="mt-(--spacing-xs) text-pretty text-body-sm text-(--text-default)">
                      {{ note.body }}
                    </p>
                  </Item.Content>
                </Item>
              </Item.List>
              <EmptyState
                v-else
                size="small"
                icon="az az-comment"
                :title="'No notes for ' + quarter"
                description="Leads add notes here when they review the quarter."
              />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type {
  ExecutiveSummaryDashboardGoal,
  ExecutiveSummaryDashboardKpis,
  ExecutiveSummaryDashboardNote,
  ExecutiveSummaryDashboardTrends
} from './dashboard-executive-summary.vue'

export const sampleKpis: ExecutiveSummaryDashboardKpis = {
  revenue: { value: 4820000, delta: 5.7 },
  'active-users': { value: 128400, delta: 5.1 },
  retention: { value: 112, delta: 1.8 },
  nps: { value: 47, delta: 6.8 },
  uptime: { value: 99.97, delta: 0.02 },
  'cost-per-request': { value: 0.00217, delta: -7.1 }
}

export const sampleGoals: ExecutiveSummaryDashboardGoal[] = [
  {
    id: 'revenue',
    label: 'Quarterly revenue',
    current: 4820000,
    target: 5000000,
    format: 'currency',
    status: {
      label: 'On track',
      severity: 'success'
    }
  },
  {
    id: 'active-users',
    label: 'Monthly active users',
    current: 128400,
    target: 140000,
    format: 'count',
    status: {
      label: 'At risk',
      severity: 'warning'
    }
  },
  {
    id: 'retention',
    label: 'Net revenue retention',
    current: 112,
    target: 110,
    format: 'percentage',
    status: {
      label: 'On track',
      severity: 'success'
    }
  },
  {
    id: 'nps',
    label: 'NPS',
    current: 47,
    target: 50,
    format: 'score',
    status: {
      label: 'On track',
      severity: 'success'
    }
  },
  {
    id: 'enterprise-deals',
    label: 'Enterprise deals closed',
    current: 18,
    target: 30,
    format: 'score',
    status: {
      label: 'Off track',
      severity: 'danger'
    }
  }
]

export const sampleLabels: string[] = [
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
  'Sep 2026'
]

export const sampleTrends: ExecutiveSummaryDashboardTrends = {
  revenue: {
    change: {
      label: '+25.2%',
      severity: 'success',
      icon: 'az az-arrow-up-right'
    },
    values: [
      1310000, 1340000, 1420000, 1380000, 1410000, 1470000, 1490000, 1520000, 1550000, 1570000,
      1610000, 1640000
    ]
  },
  'active-users': {
    change: {
      label: '+30.8%',
      severity: 'success',
      icon: 'az az-arrow-up-right'
    },
    values: [
      98200, 101400, 104000, 103100, 107900, 111500, 114600, 117300, 122200, 124000, 126100, 128400
    ]
  },
  retention: {
    change: {
      label: '+5.7%',
      severity: 'success',
      icon: 'az az-arrow-up-right'
    },
    values: [106, 106, 107, 107, 108, 109, 109, 110, 110, 111, 111, 112]
  },
  nps: {
    change: {
      label: '+23.7%',
      severity: 'success',
      icon: 'az az-arrow-up-right'
    },
    values: [38, 39, 41, 40, 42, 43, 42, 44, 44, 45, 46, 47]
  },
  uptime: {
    change: {
      label: '+0.05%',
      severity: 'success',
      icon: 'az az-arrow-up-right'
    },
    values: [99.94, 99.96, 99.91, 99.97, 99.98, 99.95, 99.99, 99.95, 99.91, 99.98, 99.94, 99.99]
  },
  'cost-per-request': {
    change: {
      label: '−25.0%',
      severity: 'success',
      icon: 'az az-arrow-down-right'
    },
    values: [
      0.0028, 0.0028, 0.0027, 0.0027, 0.0026, 0.0025, 0.0024, 0.0023, 0.0023, 0.0022, 0.0022, 0.0021
    ]
  }
}

export const sampleNotes: ExecutiveSummaryDashboardNote[] = [
  {
    id: 'note-04',
    author: 'Emma Wilson',
    initials: 'MS',
    role: 'Head of Finance',
    date: '2026-09-30',
    dateLabel: 'Sep 30, 2026',
    body: 'Revenue closed at 96% of the goal. Two enterprise renewals slipped into October; both are signed and land in Q4.'
  },
  {
    id: 'note-03',
    author: 'David Kim',
    initials: 'DK',
    role: 'VP of Product',
    date: '2026-09-26',
    dateLabel: 'Sep 26, 2026',
    body: 'Monthly active users grew 5.1% after the new onboarding shipped in August. First-week activation rose from 41% to 48%.'
  },
  {
    id: 'note-02',
    author: 'Priya Nair',
    initials: 'PN',
    role: 'Head of Customer Success',
    date: '2026-09-19',
    dateLabel: 'Sep 19, 2026',
    body: 'NPS reached 47, the highest in a year. Detractors still cite slow replies on weekends, so a weekend support rotation starts in October.'
  },
  {
    id: 'note-01',
    author: 'Daniel Moore',
    initials: 'LM',
    role: 'VP of Engineering',
    date: '2026-09-12',
    dateLabel: 'Sep 12, 2026',
    body: 'Cost per request fell 7.1% after batch jobs moved to off-peak capacity. Uptime held at 99.97%, with one 14-minute incident on Aug 21.'
  }
]
```
