import type { ChartRange, ChartSeries } from '@aziontech/webkit/chart'
import { computed, type ComputedRef, type Ref } from 'vue'

import {
  eventBuckets,
  eventPeriods,
  type EventRow,
  eventSummary,
  levelColors,
  levelOrder,
  periodRange
} from '../lib/event-log'
import type {
  EventsExplorerFilters,
  EventsExplorerProps,
  EventsExplorerSummary
} from '../view-events-explorer.vue'
import type { UseEventsExplorerFormatReturn } from './use-events-explorer-format'

/** The numbers and the volume chart above the log. */
export interface UseEventsExplorerVolumeReturn {
  /** The numbers above the chart. */
  summary: ComputedRef<EventsExplorerSummary>
  /** The share of errors, as the Errors number reads it out. */
  errorShareLabel: ComputedRef<string>
  /** Start of each bar. */
  volumeLabels: ComputedRef<Date[]>
  /** One stacked series per level. */
  volumeSeries: ComputedRef<ChartSeries[]>
  /** Name of the chart, with its summary and how to use it. */
  chartLabel: ComputedRef<string>
  /** Filters the period to a span of bars. */
  selectVolume: (span: ChartRange | null) => void
}

export function useEventsExplorerVolume(
  props: EventsExplorerProps,
  filters: Ref<EventsExplorerFilters>,
  matchedEvents: ComputedRef<EventRow[]>,
  nowDate: ComputedRef<Date>,
  format: UseEventsExplorerFormatReturn
): UseEventsExplorerVolumeReturn {
  const appliedPeriod = computed(() => filters.value.period?.[0] ?? '')
  const activeWindow = computed(() => periodRange(appliedPeriod.value, nowDate.value))

  const windowLabel = computed(() => {
    const period = appliedPeriod.value
    if (period && typeof period === 'object') return format.formatPeriod(period)
    return eventPeriods.find((option) => option.value === period)?.label ?? 'Last 24 hours'
  })

  const buckets = computed(
    () => props.buckets ?? eventBuckets(matchedEvents.value, activeWindow.value, nowDate.value)
  )
  const summary = computed(() => props.summary ?? eventSummary(matchedEvents.value))

  const errorShareLabel = computed(() =>
    summary.value.total
      ? `${format.formatNumber((summary.value.errors / summary.value.total) * 100, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })}% of events`
      : 'none'
  )

  const volumeLabels = computed(() => buckets.value.map((bucket) => bucket.at))

  const volumeSeries = computed<ChartSeries[]>(() =>
    levelOrder.map((level) => ({
      name: level,
      id: level,
      color: levelColors[level] ?? 'other',
      values: buckets.value.map((bucket) => bucket.levels[level] ?? 0)
    }))
  )

  const busiestIndex = computed(() =>
    buckets.value.reduce(
      (highest, bucket, index) =>
        bucket.total > (buckets.value[highest]?.total ?? 0) ? index : highest,
      0
    )
  )

  const busiestBucket = computed(() => buckets.value[busiestIndex.value] ?? null)

  const selectVolume = (span: ChartRange | null) => {
    if (!span) return
    const from = buckets.value[span[0]]
    const to = buckets.value[span[1]]
    if (from && to) filters.value = { ...filters.value, period: [{ start: from.at, end: to.end }] }
  }

  const chartSummary = computed(() => {
    if (!busiestBucket.value?.total) return `No events in the ${windowLabel.value.toLowerCase()}.`
    return `Busiest bucket at ${format.formatEventClock(busiestBucket.value.at)} with ${busiestBucket.value.total} events.`
  })

  const chartLabel = computed(
    () =>
      `Event volume, ${windowLabel.value.toLowerCase()}. ${chartSummary.value} Drag across the chart, or hold Shift with the arrow keys and press Enter, to filter the log to a span.`
  )

  return { summary, errorShareLabel, volumeLabels, volumeSeries, chartLabel, selectVolume }
}
