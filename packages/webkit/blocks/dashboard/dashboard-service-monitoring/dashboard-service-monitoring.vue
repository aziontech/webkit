<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed } from 'vue'

  import { sampleAlerts, sampleErrorRate, sampleLatency, sampleServices } from './sample'

  /** The window every tile and chart reads. */
  export type ServiceMonitoringWindow = '1h' | '6h' | '24h'

  /** One service tile. */
  export interface ServiceMonitoringService {
    /** Stable key. */
    id: string
    /** Service name, the tile label. */
    name: string
    /** State in words with its status color; hidden while the service has no latency. */
    status: { label: string; severity: StatusIndicatorSeverity }
    /** p95 latency in milliseconds; null before the service serves traffic. */
    latency: number | null
    /** Change of p95 latency against the previous window, in percent. */
    delta: number | null
    /** p95 latency over the window, for the sparkline, null for an interval with no data. */
    trend: (number | null)[]
  }

  /** The series of one chart over the window. */
  export interface ServiceMonitoringSeriesData {
    /** One label per point of the x axis. */
    labels: string[]
    /** The lines of the chart. */
    series: ChartSeries[]
  }

  /** One open alert in the rail. */
  export interface ServiceMonitoringAlert {
    /** Stable key, used in the alert link. */
    id: string
    /** Color of the level tag. */
    severity: TagSeverity
    /** Level in words. */
    level: string
    /** The threshold that tripped. */
    title: string
    /** The service the alert belongs to. */
    service: string
    /** When the alert opened, relative. */
    openedAt: string
  }

  export interface ServiceMonitoringDashboardProps {
    /** One tile per service. Left out, the sample renders. */
    services?: ServiceMonitoringService[]
    /** Latency percentiles over the window. Left out, the sample renders. */
    latency?: ServiceMonitoringSeriesData
    /** Error rates over the window. Left out, the sample renders. */
    errorRate?: ServiceMonitoringSeriesData
    /** The alerts still open; pass an empty list when none is. Left out, the sample renders. */
    alerts?: ServiceMonitoringAlert[]
    /** The metrics for the window are loading. */
    loading?: boolean
    /** Why the metrics could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<ServiceMonitoringDashboardProps>(), {
    services: undefined,
    latency: undefined,
    errorRate: undefined,
    alerts: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  const timeWindow = defineModel<ServiceMonitoringWindow>('window', { default: '24h' })

  const blocked = computed(() => props.loading || props.error !== '')
  const noSeries: ServiceMonitoringSeriesData = { labels: [], series: [] }
  const services = computed(() => props.services ?? (blocked.value ? [] : sampleServices))
  const latency = computed(
    () => props.latency ?? (blocked.value ? noSeries : sampleLatency[timeWindow.value])
  )
  const errorRate = computed(
    () => props.errorRate ?? (blocked.value ? noSeries : sampleErrorRate[timeWindow.value])
  )
  const alerts = computed(() => props.alerts ?? (blocked.value ? [] : sampleAlerts))

  const windowNames: Record<ServiceMonitoringWindow, string> = {
    '1h': 'hour',
    '6h': '6 hours',
    '24h': '24 hours'
  }
  const deltaLabel = computed(() => `p95 latency vs previous ${windowNames[timeWindow.value]}`)

  const formatLatency = (value: number) => `${Math.round(value)} ms`
  const { formatNumber } = useLocale()
  const fixed = (value: number, digits: number) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })
  const formatRate = (value: number) => {
    const digits = value === 0 || value >= 10 ? 0 : value >= 1 ? 1 : 2
    return `${fixed(value, digits)}%`
  }

  const windows = [
    { label: '1h', value: '1h' },
    { label: '6h', value: '6h' },
    { label: '24h', value: '24h' }
  ]

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-w-0 flex-col overflow-y-auto xl:flex-row"
  >
    <div class="layout-boundary flex min-w-0 flex-1 flex-col xl:overflow-y-auto">
      <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="Service monitoring"
          description="Latency and error rate of every service, with the alerts still open."
        >
          <template #actions>
            <ToggleGroup
              v-model="timeWindow"
              :options="windows"
              size="medium"
              aria-label="Window"
            />
          </template>
        </PageHeader>
        <ul
          class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 lg:grid-cols-2 2xl:grid-cols-3"
        >
          <li
            v-for="service in services"
            :key="service.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="service.name"
              :value="service.latency"
              :format-value="formatLatency"
              :delta="service.delta"
              :delta-label="deltaLabel"
              inverse
              :trend="service.trend"
              :loading="loading"
              :error="error"
            >
              <template #aside>
                <StatusIndicator
                  v-if="!loading && service.latency !== null"
                  :severity="service.status.severity"
                  :label="service.status.label"
                />
              </template>
            </StatTile>
          </li>
        </ul>

        <div class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1]">
          <ChartCard :span="12">
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>Latency</ChartCard.Title>
                <Hint content="Time to the first byte, by percentile, across every service." />
              </span>
            </ChartCard.Header>
            <ChartCard.Content>
              <Alert
                v-if="error"
                severity="danger"
                :label="`Couldn't load latency. ${error}`"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <Chart
                v-else
                :series="latency.series"
                :labels="latency.labels"
                :format-value="formatLatency"
                empty-title="No traffic yet"
                empty-description="Latency appears here once a service serves requests."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis type="x" />
                <Chart.Line />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend />
              </Chart>
            </ChartCard.Content>
          </ChartCard>

          <ChartCard :span="12">
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>Error rate</ChartCard.Title>
                <Hint
                  content="Share of responses with a 4xx or 5xx status, across every service."
                />
              </span>
            </ChartCard.Header>
            <ChartCard.Content>
              <Alert
                v-if="error"
                severity="danger"
                :label="`Couldn't load error rate. ${error}`"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <Chart
                v-else
                :series="errorRate.series"
                :labels="errorRate.labels"
                :format-value="formatRate"
                empty-title="No traffic yet"
                empty-description="Error rates appear here once a service serves requests."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis type="x" />
                <Chart.Line />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend />
              </Chart>
            </ChartCard.Content>
          </ChartCard>
        </div>
      </div>
    </div>

    <aside
      aria-labelledby="open-alerts-title"
      class="flex min-h-0 min-w-0 flex-col border-t border-(--border-muted) bg-(--bg-surface) xl:w-(--container-sm) xl:shrink-0 xl:border-t-0 xl:border-s"
    >
      <div
        class="flex shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-muted) p-(--spacing-md)"
      >
        <h2
          id="open-alerts-title"
          class="m-0 text-label-lg text-(--text-default)"
        >
          Open alerts
        </h2>
        <Tag
          v-if="!loading && alerts.length"
          :label="String(alerts.length)"
          severity="neutral"
          size="small"
        />
      </div>
      <div
        class="min-h-0 flex-1 p-(--spacing-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) xl:overflow-y-auto"
        role="region"
        aria-labelledby="open-alerts-title"
        tabindex="0"
      >
        <Alert
          v-if="error"
          severity="danger"
          :label="`Couldn't load open alerts. ${error}`"
          action-label="Retry"
          @action="(event) => emit('retry', event)"
        />
        <div
          v-else-if="loading"
          class="flex flex-col gap-(--spacing-lg)"
        >
          <Skeleton
            v-for="row in 4"
            :key="row"
            width="100%"
            height="3rem"
          />
        </div>
        <Item.Group
          v-else-if="alerts.length"
          aria-label="Open alerts"
        >
          <Item
            v-for="alert in alerts"
            :key="alert.id"
            :href="`/alerts/${alert.id}`"
            size="small"
          >
            <Item.Content>
              <Item.Title>{{ alert.title }}</Item.Title>
              <Item.Description>{{ alert.service }}</Item.Description>
              <Item.Description>Opened {{ ago(alert.openedAt) }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Tag
                :label="alert.level"
                :severity="alert.severity"
                size="small"
              />
            </Item.Actions>
          </Item>
        </Item.Group>
        <EmptyState
          v-else
          size="small"
          icon="az az-circle-check"
          title="No open alerts"
          description="Alerts appear here when a service crosses a threshold."
        />
      </div>
    </aside>
  </div>
</template>
