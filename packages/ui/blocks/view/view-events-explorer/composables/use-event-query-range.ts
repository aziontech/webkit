import type { DateRangeUnit, DateRangeValue, RelativeOption } from '@aziontech/ui/date-range-picker'
import { computed, type ComputedRef, ref, type WritableComputedRef } from 'vue'

import { fullWindowMinutes } from '../lib/event-log'
import { type QueryFilterValue, referenceNow } from '../lib/event-query'

/** The time range of the Query variant and its bridge to the Period filter. */
export interface UseEventQueryRangeReturn {
  /** The value of the range picker. */
  range: WritableComputedRef<DateRangeValue | null>
  /** The relative ranges the picker offers. */
  relativeOptions: RelativeOption[]
  /** The moment the ranges end at. */
  rangeNow: Date
  /** The oldest moment the picker reaches. */
  rangeMin: Date
  /** The range as the Period filter value. */
  periodValue: ComputedRef<QueryFilterValue>
  /** Sets the range from a Period filter value. */
  setPeriod: (value: QueryFilterValue | undefined) => void
  /** The date lies inside the range. */
  inWindow: (date: unknown) => boolean
}

const relativeOptions: RelativeOption[] = [
  { key: 'last-15-minutes', amount: 15, unit: 'minute' },
  { key: 'last-1-hour', amount: 1, unit: 'hour' },
  { key: 'last-6-hours', amount: 6, unit: 'hour' },
  { key: 'last-24-hours', amount: 24, unit: 'hour' }
]

const unitMs: Record<DateRangeUnit, number> = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2592000000,
  year: 31536000000
}

const presetMinutes: Record<string, number> = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

const rangeNow = new Date(referenceNow)
const rangeMin = new Date(referenceNow - 7 * 24 * 3600000)

const windowOf = (value: DateRangeValue | null) => {
  if (!value) {
    return { start: new Date(referenceNow - fullWindowMinutes * 60000), end: rangeNow }
  }
  if (value.type === 'relative') {
    return { start: new Date(referenceNow - value.amount * unitMs[value.unit]), end: rangeNow }
  }
  if (value.type === 'since') return { start: new Date(value.start), end: rangeNow }
  return { start: new Date(value.start), end: new Date(value.end) }
}

const rangeOfPreset = (value: QueryFilterValue | undefined): DateRangeValue | null => {
  const minutes = presetMinutes[String(value ?? '24h')] ?? fullWindowMinutes
  const option = relativeOptions.find(
    (candidate) => candidate.amount * unitMs[candidate.unit] === minutes * 60000
  )
  return option
    ? { type: 'relative', key: option.key, amount: option.amount, unit: option.unit }
    : null
}

export function useEventQueryRange(): UseEventQueryRangeReturn {
  const range = ref<DateRangeValue | null>({
    type: 'relative',
    amount: 24,
    unit: 'hour',
    key: 'last-24-hours'
  })

  const activeWindow = computed(() => windowOf(range.value))

  const periodValue = computed<QueryFilterValue>(() => {
    const value = range.value
    if (!value) return '24h'
    if (value.type === 'relative') {
      const minutes = (value.amount * unitMs[value.unit]) / 60000
      const preset = Object.entries(presetMinutes).find(([, length]) => length === minutes)
      if (preset) return preset[0]
    }
    return { start: activeWindow.value.start, end: activeWindow.value.end }
  })

  const setPeriod = (value: QueryFilterValue | undefined) => {
    if (value && typeof value === 'object') {
      if (!value.start) return
      range.value = {
        type: 'absolute',
        start: value.start.toISOString(),
        end: (value.end ?? rangeNow).toISOString()
      }
      return
    }
    range.value = rangeOfPreset(value)
  }

  const inWindow = (date: unknown) => {
    if (!(date instanceof Date)) return false
    const time = date.getTime()
    return time >= activeWindow.value.start.getTime() && time <= activeWindow.value.end.getTime()
  }

  return {
    range: computed({
      get: () => range.value,
      set: (value) => {
        range.value = value
      }
    }),
    relativeOptions,
    rangeNow,
    rangeMin,
    periodValue,
    setPeriod,
    inWindow
  }
}
