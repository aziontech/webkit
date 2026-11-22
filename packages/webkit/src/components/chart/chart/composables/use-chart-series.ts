import { computed, type ComputedRef, type Ref } from 'vue'

import {
  type ChartLabel,
  type ChartSeries,
  type NormalizedSeries,
  normalizeSeries
} from '../../lib'

export interface UseChartSeriesOptions {
  series: () => ChartSeries[]
  labels: () => ChartLabel[]
  cap: () => number
  otherLabel: () => string
  hiddenSeries: Ref<string[]>
  toggled: (event: MouseEvent, series: ChartSeries) => void
}

export interface UseChartSeriesReturn {
  series: ComputedRef<NormalizedSeries[]>
  hidden: ComputedRef<ReadonlySet<string>>
  visibleSeries: ComputedRef<NormalizedSeries[]>
  count: ComputedRef<number>
  labels: ComputedRef<ChartLabel[]>
  resolveSeries: (ids: readonly string[]) => NormalizedSeries[]
  toggleSeries: (event: MouseEvent, id: string) => void
}

export function useChartSeries(options: UseChartSeriesOptions): UseChartSeriesReturn {
  const { hiddenSeries } = options
  const series = computed(() =>
    normalizeSeries(options.series(), { cap: options.cap(), otherLabel: options.otherLabel() })
  )
  const hidden = computed<ReadonlySet<string>>(() => new Set(hiddenSeries.value))
  const visibleSeries = computed(() => series.value.filter((entry) => !hidden.value.has(entry.id)))
  const count = computed(() =>
    Math.max(options.labels().length, ...series.value.map((entry) => entry.values.length), 0)
  )
  const labels = computed<ChartLabel[]>(() =>
    Array.from({ length: count.value }, (_, index) => options.labels()[index] ?? String(index + 1))
  )

  function toggleSeries(event: MouseEvent, id: string): void {
    const target = series.value.find((entry) => entry.id === id)
    if (!target) return
    hiddenSeries.value = hidden.value.has(id)
      ? hiddenSeries.value.filter((entry) => entry !== id)
      : [...hiddenSeries.value, id]
    options.toggled(event, target.source)
  }

  return {
    series,
    hidden,
    visibleSeries,
    count,
    labels,
    resolveSeries: (ids) =>
      ids.length
        ? visibleSeries.value.filter((entry) => ids.includes(entry.id))
        : visibleSeries.value,
    toggleSeries
  }
}
