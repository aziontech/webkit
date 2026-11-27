import type { ChartColor } from '@aziontech/ui/chart'
import type { FilterMenuRange, FilterMenuValue } from '@aziontech/ui/filter-menu'
import type { TagSeverity } from '@aziontech/ui/tag'

import type {
  EventsExplorerBucket,
  EventsExplorerEvent,
  EventsExplorerEventLevel,
  EventsExplorerField,
  EventsExplorerSummary
} from '../view-events-explorer.vue'

/** An event as the log shows it, with its written time and source. */
export type EventRow = EventsExplorerEvent & { time: string; sourceLabel: string }

/** One value of a filter field. */
export interface FilterOption {
  /** The value a filter applies. */
  value: FilterMenuValue
  /** The value as written. */
  label: string
  /** Opens the menu's own range picker instead of applying a value. */
  custom?: boolean
}

/** One field the log can be filtered by. */
export interface FilterField {
  /** Label of the field. */
  label: string
  /** Key of the field. */
  id: string
  /** A time range or a list of values. */
  kind: 'range' | 'options'
  /** The values offered. */
  options: FilterOption[]
  /** Writes an applied value. */
  formatValue?: (value: FilterMenuValue) => string
  /** Tests an event against the applied values. */
  match: (event: EventRow, values: FilterMenuValue[]) => boolean
}

export const eventSources: Record<string, string> = {
  http: 'HTTP Requests',
  security: 'Security',
  services: 'Services',
  access: 'Access Control'
}

export const eventSourceOptions = Object.entries(eventSources).map(([value, label]) => ({
  value,
  label
}))

const eventLevels: Record<EventsExplorerEventLevel, TagSeverity> = {
  Error: 'danger',
  Warning: 'warning',
  Info: 'info',
  Debug: 'neutral'
}

export const eventLevelSeverity = (level: EventsExplorerEventLevel) =>
  eventLevels[level] ?? 'neutral'

export const levelOrder = Object.keys(eventLevels) as EventsExplorerEventLevel[]

export const eventLevelOptions = levelOrder.map((value) => ({ value, label: value }))

export const levelColors: Record<EventsExplorerEventLevel, ChartColor> = {
  Error: 'severity-critical',
  Warning: 'severity-medium',
  Info: 'severity-low',
  Debug: 'severity-info'
}

export const eventPeriods: FilterOption[] = [
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: 'custom', label: 'Custom range', custom: true }
]

const periodMinutes: Record<string, number> = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

export const fullWindowMinutes = periodMinutes['24h']

export const isDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())

const endOfRange = (end: Date) => {
  const midnight =
    end.getHours() === 0 &&
    end.getMinutes() === 0 &&
    end.getSeconds() === 0 &&
    end.getMilliseconds() === 0
  return midnight
    ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
    : end
}

const withinRange = (date: Date, range: FilterMenuRange | null) => {
  if (!range) return true
  const { start, end } = range
  if (!start && !end) return true
  if (!isDate(date)) return false
  if (start && date.getTime() < start.getTime()) return false
  return !end || date.getTime() <= endOfRange(end).getTime()
}

export const periodRange = (value: FilterMenuValue, now: Date): FilterMenuRange => {
  if (value && typeof value === 'object') {
    return { start: value.start ?? null, end: value.end ?? now }
  }
  const minutes = periodMinutes[value] ?? fullWindowMinutes
  return { start: new Date(now.getTime() - minutes * 60000), end: now }
}

export const matchPeriod = (date: Date, values: FilterMenuValue[], now: Date) => {
  const [period] = values ?? []
  if (!period || period === 'custom' || !isDate(date)) return true
  return withinRange(date, periodRange(period, now))
}

const isBlank = (value: unknown) => value === undefined || value === null || value === ''

export const hasEventValue = (event: EventsExplorerEvent, id: string) => !isBlank(event[id])

export const searchEvents = (list: EventRow[], term: string, fields: EventsExplorerField[]) => {
  const needle = term.trim().toLowerCase()
  if (!needle) return list
  return list.filter((event) =>
    fields.some((field) => {
      const value = event[field.id]
      return value !== undefined && value !== null && String(value).toLowerCase().includes(needle)
    })
  )
}

export const fieldValueCounts = (list: EventRow[], id: string) => {
  const counts = new Map<FilterMenuValue, number>()
  for (const event of list) {
    const value = event[id] as FilterMenuValue | undefined | null
    if (value === undefined || value === null || value === '') continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

export const countFieldValues = (list: EventRow[], id: string) => {
  const values = new Set<unknown>()
  for (const event of list) {
    const value = event[id]
    if (!isBlank(value)) values.add(value)
  }
  return values.size
}

const bucketCountFor = (windowMinutes: number) => {
  if (windowMinutes <= 15) return 12
  if (windowMinutes <= 60) return 20
  return 32
}

export const eventBuckets = (
  list: EventRow[],
  range: FilterMenuRange | null,
  now: Date
): EventsExplorerBucket[] => {
  const end = (range?.end ?? now).getTime()
  const start = (range?.start ?? new Date(end - fullWindowMinutes * 60000)).getTime()
  const span = Math.max(1, end - start)
  const bars = bucketCountFor(span / 60000)
  const width = span / bars
  const result = Array.from({ length: bars }, (_, index) => ({
    at: new Date(start + index * width),
    end: new Date(start + (index + 1) * width),
    total: 0,
    levels: Object.fromEntries(levelOrder.map((level) => [level, 0]))
  }))
  for (const event of list) {
    if (!isDate(event.at)) continue
    const offset = event.at.getTime() - start
    if (offset < 0 || offset > span) continue
    const bucket = result[Math.min(bars - 1, Math.floor(offset / width))]
    bucket.total += 1
    if (bucket.levels[event.level] !== undefined) bucket.levels[event.level] += 1
  }
  return result
}

export const eventSummary = (list: EventRow[]): EventsExplorerSummary => {
  const errors = list.filter((event) => event.level === 'Error').length
  const times = list
    .map((event) => event.requestTimeMs)
    .filter((value): value is number => typeof value === 'number')
  return {
    total: list.length,
    errors,
    avgRequestTimeMs: times.length
      ? Math.round(times.reduce((sum, value) => sum + value, 0) / times.length)
      : null
  }
}

const unfilterableFields = new Set(['time', 'sourceLabel'])

export const canFilterField = (field: EventsExplorerField) => !unfilterableFields.has(field.id)

export const formatFieldValue = (
  field: EventsExplorerField | undefined,
  value: unknown,
  formatNumber: (value: number) => string
) => {
  if (isBlank(value)) return '—'
  if (typeof value !== 'number' || !field?.format) return String(value)
  return field.format === 'number' ? formatNumber(value) : `${value} ms`
}

export const statusSeverity = (status: unknown) => {
  if (typeof status !== 'number') return null
  if (status >= 500) return 'danger'
  if (status >= 400) return 'warning'
  return 'success'
}
