<script setup lang="ts">
  import Chart, { type ChartRange, type ChartSeries } from '@aziontech/webkit/chart'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type { EventsExplorerSummary } from '../view-events-explorer.vue'

  export interface LogSummaryProps {
    /** Skeletons hold the numbers and the chart. */
    loading: boolean
    /** The numbers above the chart. */
    summary: EventsExplorerSummary
    /** The share of errors, as the Errors number reads it out. */
    errorShareLabel: string
    /** One stacked series per level. */
    series: ChartSeries[]
    /** Start of each bar. */
    labels: Date[]
    /** Writes a bar start on the axis. */
    formatLabel: (value: unknown) => string
    /** Name of the chart. */
    chartLabel: string
  }

  defineProps<LogSummaryProps>()

  const emit = defineEmits<{
    'select-range': [span: ChartRange | null]
  }>()

  const { formatNumber } = useLocale()
</script>

<template>
  <section
    class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
  >
    <div class="flex flex-wrap items-end gap-(--spacing-md)">
      <dl class="flex flex-wrap items-end gap-(--spacing-xl)">
        <div class="flex flex-col">
          <dt class="text-label-sm text-(--text-muted)">Events</dt>
          <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
            <Skeleton
              v-if="loading"
              width="4rem"
              height="1.5rem"
            />
            <template v-else>{{ formatNumber(summary.total) }}</template>
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-label-sm text-(--text-muted)">Errors</dt>
          <dd
            class="m-0 text-heading-xs tabular-nums text-(--text-default) data-raised:text-(--danger-foreground)"
            :data-raised="summary.errors ? true : null"
            :aria-label="`${summary.errors} errors, ${errorShareLabel}`"
          >
            <Skeleton
              v-if="loading"
              width="3rem"
              height="1.5rem"
            />
            <template v-else>{{ formatNumber(summary.errors) }}</template>
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-label-sm text-(--text-muted)">Avg request time</dt>
          <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
            <Skeleton
              v-if="loading"
              width="4rem"
              height="1.5rem"
            />
            <bdi
              v-else
              dir="ltr"
              data-testid="log-summary__request-time"
              >{{
                summary.avgRequestTimeMs === null
                  ? '—'
                  : formatNumber(summary.avgRequestTimeMs, {
                      style: 'unit',
                      unit: 'millisecond',
                      unitDisplay: 'short'
                    })
              }}</bdi
            >
          </dd>
        </div>
      </dl>
    </div>

    <Skeleton
      v-if="loading"
      height="5rem"
    />
    <Chart
      v-else
      :range="null"
      :series="series"
      :labels="labels"
      :format-label="formatLabel"
      :height="80"
      :aria-label="chartLabel"
      @update:range="(span: ChartRange | null) => emit('select-range', span)"
    >
      <Chart.Axis
        type="x"
        :ticks="3"
      />
      <Chart.Brush />
      <Chart.Bar
        type="histogram"
        stacked
      />
      <Chart.Crosshair />
      <Chart.Legend />
      <Chart.Tooltip total>
        <template #footer>Click to filter to this bucket, or drag to select a span.</template>
      </Chart.Tooltip>
    </Chart>
  </section>
</template>
