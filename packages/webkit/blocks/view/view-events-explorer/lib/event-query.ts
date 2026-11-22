import type {
  FilteringProperty,
  PropertyFilterQuery,
  PropertyFilterToken
} from '@aziontech/webkit/property-filter'

import { sampleEvents, sampleFields, sampleNow } from '../sample'
import type { EventsExplorerEvent, EventsExplorerFilters } from '../view-events-explorer.vue'
import { eventLevelOptions, eventSourceOptions } from './event-log'

/** One applied value of a filter field. */
export type QueryFilterValue = EventsExplorerFilters[string][number]

/** A query as typed and as parsed. */
export interface QueryEntry {
  /** The query text. */
  text: string
  /** The parsed query. */
  query: PropertyFilterQuery
}

/** A query kept under a name. */
export interface SavedQuery extends QueryEntry {
  /** Stable key of the saved query. */
  id: string
  /** The name it was saved under. */
  name: string
}

export const referenceNow = sampleNow.getTime()

export const timeZones = [
  'UTC',
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/Lisbon',
  'Asia/Tokyo'
]

export const zoneLabel = (zone: string) => {
  const offset =
    new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' })
      .formatToParts(new Date(referenceNow))
      .find((part) => part.type === 'timeZoneName')
      ?.value.replace('GMT', 'UTC')
      .replace('-', '−') ?? zone
  const utcOffset = offset === 'UTC' ? 'UTC+00:00' : offset
  if (!zone.includes('/')) return utcOffset
  const city = zone.split('/').at(-1)?.replace(/_/g, ' ') ?? zone
  return `${utcOffset} · ${city}`
}

const valueCounts = (list: EventsExplorerEvent[], id: string) => {
  const counts = new Map<string | number, number>()
  for (const event of list) {
    const value = event[id]
    if (typeof value !== 'string' && typeof value !== 'number') continue
    if (value === '') continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

const valueFields = ['host', 'requestMethod', 'cacheStatus', 'country', 'ruleName', 'serviceName']

export const queryProperties: FilteringProperty[] = [
  { key: 'level', label: 'Level', options: eventLevelOptions },
  { key: 'source', label: 'Source', options: eventSourceOptions },
  ...sampleFields
    .filter((field) => !field.core)
    .map((field): FilteringProperty => {
      if (field.align === 'end') return { key: field.id, label: field.label, type: 'number' }
      if (!valueFields.includes(field.id)) return { key: field.id, label: field.label }
      return {
        key: field.id,
        label: field.label,
        options: valueCounts(sampleEvents, field.id).map(({ value }) => ({
          value: String(value)
        }))
      }
    })
]

export const searchableFields = sampleFields.map((field) => field.id)

const quoteValue = (value: string) =>
  /[\s"'=!:^<>]/.test(value) ? `"${value.replaceAll('"', '')}"` : value

export const queryToText = (query: PropertyFilterQuery) =>
  query.tokens
    .map((token) =>
      token.propertyKey
        ? `${token.propertyKey} ${token.operator} ${quoteValue(token.value)}`
        : quoteValue(token.value)
    )
    .join(query.operation === 'or' ? ' OR ' : ' AND ')

const rawValue = (id: string, text: string): QueryFilterValue => {
  const needle = text.toLowerCase()
  for (const event of sampleEvents) {
    const value = event[id]
    if (
      (typeof value === 'string' || typeof value === 'number') &&
      String(value).toLowerCase() === needle
    )
      return value
  }
  return text
}

const sameValue = (a: QueryFilterValue, b: QueryFilterValue) =>
  typeof a !== 'object' &&
  typeof b !== 'object' &&
  String(a).toLowerCase() === String(b).toLowerCase()

export const filtersFromQuery = (
  query: PropertyFilterQuery,
  period: QueryFilterValue
): EventsExplorerFilters => {
  const out: EventsExplorerFilters = { period: [period] }
  const { tokens, operation } = query
  if (operation === 'or' && tokens.length > 1) return out
  for (const token of tokens) {
    if (!token.propertyKey || token.operator !== '=') continue
    out[token.propertyKey] = [
      ...(out[token.propertyKey] ?? []),
      rawValue(token.propertyKey, token.value)
    ]
  }
  return out
}

const withoutValue = (tokens: PropertyFilterToken[], id: string, value: QueryFilterValue) =>
  tokens.filter(
    (token) =>
      !(token.propertyKey === id && token.operator === '=' && sameValue(token.value, value))
  )

const missingFrom = (list: QueryFilterValue[], other: QueryFilterValue[]) =>
  list.filter((item) => !other.some((value) => sameValue(value, item)))

export const tokensForFilters = (
  tokens: PropertyFilterToken[],
  current: EventsExplorerFilters,
  next: EventsExplorerFilters
): PropertyFilterToken[] | null => {
  let result = [...tokens]
  let changed = false
  const ids = new Set([...Object.keys(current), ...Object.keys(next)])
  ids.delete('period')
  for (const id of ids) {
    const before = current[id] ?? []
    const after = next[id] ?? []
    for (const value of missingFrom(before, after)) {
      result = withoutValue(result, id, value)
      changed = true
    }
    for (const value of missingFrom(after, before)) {
      if (typeof value === 'object') continue
      result = [...result, { propertyKey: id, operator: '=', value: String(value) }]
      changed = true
    }
  }
  return changed ? result : null
}
