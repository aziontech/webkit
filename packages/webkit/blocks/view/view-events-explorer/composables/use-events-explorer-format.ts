import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
import { useLocale } from '@aziontech/webkit/use-locale'
import { type MaybeRefOrGetter, toValue } from 'vue'

import { formatFieldValue, isDate } from '../lib/event-log'
import type { EventsExplorerField } from '../view-events-explorer.vue'

/** The formatters of the explorer, written in its time zone and locale. */
export interface UseEventsExplorerFormatReturn {
  /** Day and clock of an event, for the Time column. */
  formatEventTime: (date: Date) => string
  /** Hours and minutes, for the chart axis. */
  formatEventClock: (date: unknown) => string
  /** Hours, minutes and seconds, for the folded Event cell. */
  formatEventClockSeconds: (date: unknown) => string
  /** A custom period, as its chip and the chart name it. */
  formatPeriod: (value: FilterMenuValue) => string
  /** A field value, as the table, the panel and the document write it. */
  formatEventValue: (field: EventsExplorerField | undefined, value: unknown) => string
  /** A locale number. */
  formatNumber: (value: number) => string
}

export function useEventsExplorerFormat(
  timeZone: MaybeRefOrGetter<string>
): UseEventsExplorerFormatReturn {
  const { formatDate, formatNumber } = useLocale()

  const dayFormat = (value: Date | number | string) =>
    formatDate(value, { month: 'short', day: '2-digit', timeZone: toValue(timeZone) })
  const clockFormat = (value: Date | number | string) =>
    formatDate(value, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: toValue(timeZone)
    })
  const axisFormat = (value: Date | number | string) =>
    formatDate(value, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: toValue(timeZone)
    })

  const formatEventTime = (date: Date) =>
    isDate(date) ? `${dayFormat(date)}, ${clockFormat(date)}` : ''
  const formatEventClock = (date: unknown) => (isDate(date) ? axisFormat(date) : '')
  const formatEventClockSeconds = (date: unknown) => (isDate(date) ? clockFormat(date) : '')

  const formatPeriod = (value: FilterMenuValue) => {
    if (!value || typeof value !== 'object') return ''
    const { start, end } = value
    if (!start) return end ? `Until ${formatEventClock(end)}` : ''
    const sameDay = end && dayFormat(start) === dayFormat(end)
    const from = `${dayFormat(start)}, ${formatEventClock(start)}`
    if (!end) return `Since ${from}`
    return sameDay
      ? `${from} to ${formatEventClock(end)}`
      : `${from} to ${dayFormat(end)}, ${formatEventClock(end)}`
  }

  const formatEventValue = (field: EventsExplorerField | undefined, value: unknown) =>
    formatFieldValue(field, value, formatNumber)

  return {
    formatEventTime,
    formatEventClock,
    formatEventClockSeconds,
    formatPeriod,
    formatEventValue,
    formatNumber
  }
}
