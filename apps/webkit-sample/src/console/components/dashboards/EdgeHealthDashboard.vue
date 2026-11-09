<script setup lang="ts">
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import {
    formatLatency,
    formatRate,
    HEALTH_DEFAULT_WINDOW,
    HEALTH_WINDOWS,
    resolveAlerts,
    resolveErrorRate,
    resolveHealthWorkloads,
    resolveLatency
  } from '../../lib/data/dashboards/edge-health'

  interface Props {
    period: string
    comparison: string
    loading?: boolean
    refetching?: boolean
    empty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    refetching: false,
    empty: false
  })

  const latencyWindow = ref(HEALTH_DEFAULT_WINDOW)
  const errorWindow = ref(HEALTH_DEFAULT_WINDOW)

  const workloads = computed(() => resolveHealthWorkloads(props.period, { empty: props.empty }))
  const latency = computed(() => resolveLatency(latencyWindow.value, { empty: props.empty }))
  const errorRate = computed(() => resolveErrorRate(errorWindow.value, { empty: props.empty }))
  const alerts = computed(() => resolveAlerts({ empty: props.empty }))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <ul class="grid grid-cols-1 gap-(--spacing-md) lg:grid-cols-2 2xl:grid-cols-3">
      <li
        v-for="workload in workloads"
        :key="workload.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="workload.name"
          :value="workload.latency"
          :format-value="formatLatency"
          :delta="workload.delta"
          :delta-label="`p95 latency ${comparison}`"
          inverse
          :trend="workload.trend"
          :loading="loading"
        >
          <template #aside>
            <StatusIndicator
              v-if="!loading && !empty"
              :severity="workload.status.severity"
              :label="workload.status.label"
            />
          </template>
        </StatTile>
      </li>
    </ul>

    <div
      class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] xl:grid-cols-12 xl:[--chart-grid-columns:12]"
    >
      <div
        class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] xl:col-span-8"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Latency</ChartCard.Title>
              <Hint
                text="Time to the first byte at the edge, by percentile, across every workload."
              />
            </span>
            <ChartCard.Controls>
              <SegmentedButton
                v-model="latencyWindow"
                :options="HEALTH_WINDOWS"
                size="small"
                aria-label="Window for Latency"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="latency.series"
              :labels="latency.labels"
              :format-value="formatLatency"
              empty-title="No traffic yet"
              empty-description="Latency appears here once a workload serves requests."
              :loading="loading"
              :refetching="refetching"
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
              <Hint text="Share of responses with a 4xx or 5xx status, across every workload." />
            </span>
            <ChartCard.Controls>
              <SegmentedButton
                v-model="errorWindow"
                :options="HEALTH_WINDOWS"
                size="small"
                aria-label="Window for Error rate"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="errorRate.series"
              :labels="errorRate.labels"
              :format-value="formatRate"
              empty-title="No traffic yet"
              empty-description="Error rates appear here once a workload serves requests."
              :loading="loading"
              :refetching="refetching"
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

      <ChartCard :span="4">
        <ChartCard.Header>
          <ChartCard.Title>Open alerts</ChartCard.Title>
          <ChartCard.Controls v-if="!loading && alerts.length">
            <Tag
              :label="String(alerts.length)"
              severity="secondary"
              size="small"
            />
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content :flush="!loading && alerts.length > 0">
          <div
            v-if="loading"
            class="flex flex-col gap-(--spacing-sm)"
          >
            <Skeleton
              v-for="row in 4"
              :key="row"
              width="100%"
              height="3rem"
            />
          </div>
          <ul
            v-else-if="alerts.length"
            class="m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="alert in alerts"
              :key="alert.id"
              class="border-b border-(--border-muted) last:border-b-0"
            >
              <Item size="small">
                <Item.Content>
                  <Item.Title>{{ alert.title }}</Item.Title>
                  <Item.Description>{{ alert.workload }}</Item.Description>
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
            </li>
          </ul>
          <EmptyState
            v-else
            size="small"
            icon="pi pi-check-circle"
            title="No open alerts"
            description="Alerts appear here when a workload crosses a threshold."
          />
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
