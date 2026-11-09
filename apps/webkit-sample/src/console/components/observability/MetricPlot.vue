<script setup lang="ts">
  import Chart from '@aziontech/webkit/chart'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import { computed } from 'vue'

  export type MetricPlotForm = 'line' | 'bar'

  interface ResolvedReport {
    id: string
    type: string
    label: string
    max?: number
    labels: Date[]
    series: { id: string; name: string; color?: string; values: number[] }[]
    format: (value: number) => string
    emptyTitle?: string
    emptyDescription?: string
  }

  interface Props {
    report: ResolvedReport
    form?: MetricPlotForm
    height?: number
    loading?: boolean
    refetching?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    form: 'line',
    height: 240,
    loading: false,
    refetching: false
  })

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })

  const ranking = computed(() => ({
    labels: props.report.series.map((entry) => entry.name),
    series: props.report.series.length
      ? [
          {
            id: 'requests',
            name: props.report.label,
            values: props.report.series.map((entry) => entry.values[0])
          }
        ]
      : []
  }))

  const rankingHeight = computed(() => Math.max(props.height, ranking.value.labels.length * 32))
</script>

<template>
  <DonutChart
    v-if="report.type === 'pie'"
    :series="report.series"
    kind="pie"
    :format-value="report.format"
    :empty-title="report.emptyTitle ?? 'No data available'"
    :empty-description="report.emptyDescription ?? 'Nothing was recorded in this period.'"
    :loading="loading"
    :refetching="refetching"
    :aria-label="report.label"
  />

  <Chart
    v-else-if="report.type === 'ordered-bar'"
    :series="ranking.series"
    :labels="ranking.labels"
    orientation="horizontal"
    :format-value="report.format"
    :height="rankingHeight"
    :empty-title="report.emptyTitle ?? 'No data available'"
    :empty-description="report.emptyDescription ?? 'Nothing was recorded in this period.'"
    :loading="loading"
    :refetching="refetching"
  >
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Bar labeled />
    <Chart.Tooltip />
  </Chart>

  <Chart
    v-else
    v-model:active-index="activeIndex"
    :series="report.series"
    :labels="report.labels"
    :max="report.max"
    :format-value="report.format"
    :height="height"
    :empty-title="report.emptyTitle ?? 'No data available'"
    :empty-description="report.emptyDescription ?? 'Nothing was recorded in this period.'"
    :loading="loading"
    :refetching="refetching"
  >
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Bar
      v-if="form === 'bar'"
      :stacked="report.series.length > 1"
    />
    <Chart.Area
      v-else-if="report.series.length === 1"
      curve="monotone"
    />
    <Chart.Line v-else />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend totals />
  </Chart>
</template>
