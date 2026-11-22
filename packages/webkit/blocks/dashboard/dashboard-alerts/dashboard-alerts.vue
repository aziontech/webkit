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
