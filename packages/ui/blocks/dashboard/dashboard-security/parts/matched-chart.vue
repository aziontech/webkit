<script setup lang="ts">
  import Chart from '@aziontech/webkit/chart'

  import type { SecurityMatchedRequests } from '../dashboard-security.vue'

  export interface MatchedChartProps {
    /** The Blocked and Logged series with their labels. */
    matched: SecurityMatchedRequests
    /** Writes a request count. */
    formatValue: (value: number) => string
    /** Draws the series as stacked bars instead of lines. */
    bar: boolean
    /** Minimum plot height in pixels; left out, the chart default. */
    height?: number
    /** The period is loading. */
    loading?: boolean
    /** Accessible name of the chart. */
    ariaLabel?: string
  }

  withDefaults(defineProps<MatchedChartProps>(), {
    height: undefined,
    loading: false,
    ariaLabel: ''
  })

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })
</script>

<template>
  <Chart
    v-model:active-index="activeIndex"
    :series="matched.series"
    :labels="matched.labels"
    :format-value="formatValue"
    :height="height"
    empty-title="No matched requests in this period"
    empty-description="Nothing was recorded in this period."
    :loading="loading"
    :aria-label="ariaLabel || undefined"
  >
    <Chart.Grid />
    <Chart.Axis type="y" />
    <Chart.Axis type="x" />
    <Chart.Bar
      v-if="bar"
      stacked
    />
    <Chart.Line v-else />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend total />
  </Chart>
</template>
