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
