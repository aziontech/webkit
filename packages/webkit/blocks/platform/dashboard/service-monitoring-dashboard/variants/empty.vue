<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const loading = false
  const empty = true

  const latencyWindow = ref('24h')
  const errorWindow = ref('24h')

  const formatLatency = (value) => `${Math.round(value)} ms`
  const formatRate = (value) => {
    const digits = value === 0 || value >= 10 ? 0 : value >= 1 ? 1 : 2
    return `${value.toFixed(digits)}%`
  }

  const windows = [
    { label: '1h', value: '1h' },
    { label: '6h', value: '6h' },
    { label: '24h', value: '24h' }
  ]

  const services = [
    {
      id: 'web-app-prod',
      name: 'web-app-prod',
      status: { label: 'Operational', severity: 'success' },
      latency: null,
      delta: null,
      trend: []
    },
    {
      id: 'web-app-eu-prod',
      name: 'web-app-eu-prod',
      status: { label: 'Degraded', severity: 'warning' },
      latency: null,
      delta: null,
      trend: []
    },
    {
      id: 'web-app-staging',
      name: 'web-app-staging',
      status: { label: 'Down', severity: 'danger' },
      latency: null,
      delta: null,
      trend: []
    },
    {
      id: 'campaign-landing',
      name: 'campaign-landing',
      status: { label: 'Operational', severity: 'success' },
      latency: null,
      delta: null,
      trend: []
    },
    {
      id: 'docs-site',
      name: 'docs-site',
      status: { label: 'Operational', severity: 'success' },
      latency: null,
      delta: null,
      trend: []
    },
    {
      id: 'api-gateway',
      name: 'api-gateway',
      status: { label: 'Operational', severity: 'success' },
      latency: null,
      delta: null,
      trend: []
    }
  ]

  const latency = {
    '1h': {
      labels: [
        '10:05',
        '10:10',
        '10:15',
        '10:20',
        '10:25',
        '10:30',
        '10:35',
        '10:40',
        '10:45',
        '10:50',
        '10:55',
        '11:00'
      ],
      series: []
    },
    '6h': {
      labels: [
        '05:15',
        '05:30',
        '05:45',
        '06:00',
        '06:15',
        '06:30',
        '06:45',
        '07:00',
        '07:15',
        '07:30',
        '07:45',
        '08:00',
        '08:15',
        '08:30',
        '08:45',
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00'
      ],
      series: []
    },
    '24h': {
      labels: [
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00'
      ],
      series: []
    }
  }

  const errorRate = {
    '1h': {
      labels: [
        '10:05',
        '10:10',
        '10:15',
        '10:20',
        '10:25',
        '10:30',
        '10:35',
        '10:40',
        '10:45',
        '10:50',
        '10:55',
        '11:00'
      ],
      series: []
    },
    '6h': {
      labels: [
        '05:15',
        '05:30',
        '05:45',
        '06:00',
        '06:15',
        '06:30',
        '06:45',
        '07:00',
        '07:15',
        '07:30',
        '07:45',
        '08:00',
        '08:15',
        '08:30',
        '08:45',
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00'
      ],
      series: []
    },
    '24h': {
      labels: [
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00'
      ],
      series: []
    }
  }

  const alerts = []
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col xl:flex-row">
    <div
      class="flex min-w-0 flex-1 flex-col gap-(--spacing-md) p-(--spacing-md) xl:overflow-y-auto"
    >
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
            delta-label="p95 latency vs previous 24 hours"
            inverse
            :trend="service.trend"
            :loading="loading"
          >
            <template #aside>
              <StatusIndicator
                v-if="!loading && !empty"
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Latency</ChartCard.Title>
              <Hint text="Time to the first byte, by percentile, across every service." />
            </span>
            <ChartCard.Controls>
              <ToggleGroup
                v-model="latencyWindow"
                :options="windows"
                size="small"
                aria-label="Window for Latency"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="latency[latencyWindow].series"
              :labels="latency[latencyWindow].labels"
              :format-value="formatLatency"
              empty-title="No traffic yet"
              empty-description="Latency appears here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Line />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Error rate</ChartCard.Title>
              <Hint text="Share of responses with a 4xx or 5xx status, across every service." />
            </span>
            <ChartCard.Controls>
              <ToggleGroup
                v-model="errorWindow"
                :options="windows"
                size="small"
                aria-label="Window for Error rate"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="errorRate[errorWindow].series"
              :labels="errorRate[errorWindow].labels"
              :format-value="formatRate"
              empty-title="No traffic yet"
              empty-description="Error rates appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Line />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
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
          severity="secondary"
          size="small"
        />
      </div>
      <div
        class="min-h-0 flex-1 p-(--spacing-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) xl:overflow-y-auto"
        role="region"
        aria-labelledby="open-alerts-title"
        tabindex="0"
      >
        <div
          v-if="loading"
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
            role="listitem"
            size="small"
          >
            <Item.Content>
              <Item.Title>{{ alert.title }}</Item.Title>
              <Item.Description>{{ alert.service }}</Item.Description>
              <Item.Description>Opened {{ alert.opened }}</Item.Description>
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
          icon="pi pi-check-circle"
          title="No open alerts"
          description="Alerts appear here when a service crosses a threshold."
        />
      </div>
    </aside>
  </div>
</template>
