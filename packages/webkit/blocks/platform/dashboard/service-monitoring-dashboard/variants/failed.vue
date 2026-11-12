<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const loading = false
  const empty = true

  const latencyWindow = ref('24h')
  const errorWindow = ref('24h')

  const formatLatency = (value: number) => `${Math.round(value)} ms`
  const windows = [
    { label: '1h', value: '1h' },
    { label: '6h', value: '6h' },
    { label: '24h', value: '24h' }
  ]

  const services: {
    id: string
    name: string
    status: { label: string; severity: StatusIndicatorSeverity }
    latency: number | null
    delta: number | null
    trend: number[]
  }[] = [
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

  const alerts: unknown[] = []

  const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="flex min-w-0 flex-col bg-(--bg-canvas) xl:h-dvh xl:flex-row">
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
            <Alert
              severity="danger"
              label="Couldn't load latency. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
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
            <Alert
              severity="danger"
              label="Couldn't load error rate. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
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
        <Alert
          severity="danger"
          label="Couldn't load open alerts. Check your connection and retry."
          action-label="Retry"
          @action="emit('retry')"
        />
      </div>
    </aside>
  </div>
</template>
