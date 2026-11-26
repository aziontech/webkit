<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Chart, { type ChartSeries } from '@aziontech/ui/chart'
  import ChartCard from '@aziontech/ui/chart-card'
  import EmptyState from '@aziontech/ui/empty-state'
  import Hint from '@aziontech/ui/hint'
  import PageHeader from '@aziontech/ui/page-header'
  import Select from '@aziontech/ui/select'
  import StatTile from '@aziontech/ui/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/ui/tag'
  import { toast } from '@aziontech/ui/toast'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/ui/utils/csv'
  import { computed, ref } from 'vue'

  import { scorecardTiles, trendCharts } from './executive-summary-metrics'
  import CommentaryCard from './parts/commentary-card.vue'
  import GoalsCard from './parts/goals-card.vue'
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

  const blocked = computed(() => props.loading || props.error !== '')
  const kpis = computed(() => props.kpis ?? (blocked.value ? {} : sampleKpis))
  const goals = computed(() => props.goals ?? (blocked.value ? [] : sampleGoals))
  const months = computed(() => props.labels ?? (blocked.value ? [] : sampleLabels))
  const trendData = computed(() => props.trends ?? (blocked.value ? {} : sampleTrends))
  const notes = computed(() => props.notes ?? (blocked.value ? [] : sampleNotes))
  const nothing = computed(
    () =>
      !blocked.value &&
      goals.value.length === 0 &&
      notes.value.length === 0 &&
      Object.values(trendData.value).every((trend) => !trend?.values.length) &&
      Object.values(kpis.value).every((kpi) => kpi?.value == null)
  )
  const laterQuarter = computed(() => {
    const index = quarters.indexOf(quarter.value)
    return index > 0 ? quarters[index - 1] : ''
  })

  const trendCards = computed(() =>
    trendCharts.map((chart) => {
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

  const { formatNumber } = useLocale()
  const fixed = (value: number, digits: number) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })

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
    percentage: (value) => `${fixed(value, 0)}%`,
    uptime: (value) => `${fixed(value, 2)}%`,
    score: (value) => fixed(value, 0),
    cost: (value) =>
      formatNumber(value, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      })
  }

  const reportColumns: CsvColumn[] = Object.entries({
    section: 'Section',
    metric: 'Metric',
    value: 'Value',
    detail: 'Change or target'
  }).map(([id, header]) => ({ id, header }))

  const reportRows = () => [
    ...scorecardTiles.map((tile) => {
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
          <div class="shrink-0">
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
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load the executive summary. ${error}`"
        action-label="Retry"
        data-testid="dashboard-executive-summary__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />

      <section aria-label="Scorecard">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <li
            v-for="tile in scorecardTiles"
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

      <EmptyState
        v-if="nothing"
        bordered
        icon="az az-chart-line"
        :title="'No results reported for ' + quarter"
        description="The scorecard, trends, goals and notes fill in once the quarter reports its first month."
        data-testid="dashboard-executive-summary__empty"
      >
        <template
          v-if="laterQuarter"
          #actions
        >
          <Button
            :label="'Show ' + laterQuarter"
            variant="outline"
            size="medium"
            @click="quarter = laterQuarter"
          />
        </template>
      </EmptyState>

      <div
        v-else
        class="grid grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-12"
      >
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
              <p
                v-if="error"
                class="text-body-sm text-(--text-muted)"
              >
                Not available.
              </p>
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
          <GoalsCard
            :quarter="quarter"
            :goals="goals"
            :formatters="formatters"
            :loading="loading"
            :error="error"
          />

          <CommentaryCard
            :quarter="quarter"
            :notes="notes"
            :loading="loading"
            :error="error"
          />
        </div>
      </div>
    </div>
  </div>
</template>
