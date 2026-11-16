<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SeverityTag, { type SeverityTagLevel } from '@aziontech/webkit/severity-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Table from '@aziontech/webkit/table'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

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
    id: SeverityTagLevel
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
    level: SeverityTagLevel
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
    level: SeverityTagLevel
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
  const openTotal = computed(() => openByLevel.value.reduce((sum, level) => sum + level.count, 0))
  const failed = (region: string) => `Couldn't load ${region}. ${props.error}`

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

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: (value) => compact(value),
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
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Alerts per day</ChartCard.Title>
              <Hint content="Alerts raised each day, stacked by severity level." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="failed('alerts per day')"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
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
          </ChartCard.Content>
        </ChartCard>

        <div class="lg:col-span-4">
          <Card title="Open by severity">
            <template #default>
              <Alert
                v-if="error"
                severity="danger"
                :label="failed('open alerts by severity')"
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
                icon="ai ai-circle-check"
                title="No open alerts"
                description="Every alert raised in the period has been closed."
              />
            </template>
          </Card>
        </div>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>By type</ChartCard.Title>
              <Hint
                content="Alerts raised in the period, by the kind of behavior that raised them."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="failed('alerts by type')"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Highest risk</ChartCard.Title>
              <Hint
                content="The entities with the highest risk score, from the severity and number of their open alerts."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="failed('highest risk')"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <DataTable
              v-else-if="loading || entities.length"
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
              icon="ai ai-users"
              title="No entities at risk yet"
              description="Entities appear here once an alert names them."
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Open alerts</ChartCard.Title>
              <Hint content="Every open alert, most severe first." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="failed('open alerts')"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <DataTable
              v-else-if="loading || alerts.length"
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
                <Table.CellStatus
                  :label="row.status"
                  :severity="statusSeverity[row.status]"
                />
              </template>
            </DataTable>
            <EmptyState
              v-else
              size="small"
              icon="ai ai-bell"
              title="No open alerts"
              description="Alerts appear here when a detection rule matches. Select a longer period to see closed ones."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
