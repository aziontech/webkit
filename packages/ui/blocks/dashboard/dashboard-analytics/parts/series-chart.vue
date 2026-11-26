<script setup lang="ts">
  import Chart, { type ChartLabel, type ChartSeries } from '@aziontech/webkit/chart'

  /** How the series draw while the chart is not in its bar form. */
  export type SeriesChartShape = 'area' | 'line'

  export interface SeriesChartProps {
    /** The series, one value per interval or per bar. */
    series: ChartSeries[]
    /** One label per interval. */
    labels: ChartLabel[]
    /** Writes a value in the axis, the tooltip and the legend. */
    formatValue: (value: number) => string
    /** Draws one labeled horizontal bar per label, a ranking. */
    ranking?: boolean
    /** Draws the series as bars. */
    bar?: boolean
    /** Stacks the bars. */
    stacked?: boolean
    /** How the series draw while not in bars. */
    shape?: SeriesChartShape
    /** Shows the total in the legend. */
    total?: boolean
    /** Minimum plot height in pixels; left out, the chart default. */
    height?: number
    /** The data is loading. */
    loading?: boolean
    /** The data is reloading over the previous render. */
    refetching?: boolean
    /** Accessible name of the chart. */
    ariaLabel?: string
    /** Title of the empty state. */
    emptyTitle: string
    /** Description of the empty state. */
    emptyDescription: string
  }

  withDefaults(defineProps<SeriesChartProps>(), {
    ranking: false,
    bar: false,
    stacked: false,
    shape: 'line',
    total: true,
    height: undefined,
    loading: false,
    refetching: false,
    ariaLabel: ''
  })

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })
  const hiddenSeries = defineModel<string[]>('hiddenSeries', { default: () => [] })
</script>

<template>
  <Chart
    v-model:active-index="activeIndex"
    v-model:hidden-series="hiddenSeries"
    :series="series"
    :labels="labels"
    :orientation="ranking ? 'horizontal' : undefined"
    :format-value="formatValue"
    :height="height"
    :loading="loading"
    :refetching="refetching"
    :aria-label="ariaLabel || undefined"
    :empty-title="emptyTitle"
    :empty-description="emptyDescription"
  >
    <Chart.Grid />
    <Chart.Axis type="y" />
    <Chart.Axis type="x" />
    <Chart.Bar
      key="ranking-bar"
      v-if="ranking"
      show-labels
    />
    <Chart.Bar
      key="series-bar"
      v-else-if="bar"
      :stacked="stacked"
    />
    <Chart.Area v-else-if="shape === 'area'" />
    <Chart.Line v-else />
    <Chart.Crosshair v-if="!ranking" />
    <Chart.Tooltip />
    <Chart.Legend
      v-if="!ranking"
      :total="total"
    />
  </Chart>
</template>
