import type { Updater } from '@tanstack/vue-table'

import type { TableAppliedFilter } from '../../table/injection-key'

export const keysToRecord = (keys: string[]): Record<string, boolean> =>
  Object.fromEntries(keys.map((key) => [key, true]))

export const recordToKeys = (record: Record<string, boolean>): string[] =>
  Object.keys(record).filter((key) => record[key])

export function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater
}

export const filterKey = (filter: TableAppliedFilter): string =>
  `${filter.field}|${filter.operator}|${JSON.stringify(filter.value)}`
