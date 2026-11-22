import type { CollectionPreferencesValue } from './preferences'
import type { CollectionColumn, UseCollectionOptions } from './types'
import { type CollectionUrlAdapter, historyAdapter } from './url'

export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE_SIZES = [10, 25, 50, 100]

export const columnIdOf = (column: CollectionColumn): string =>
  column.id ?? column.accessorKey ?? column.header ?? ''

export function resolveUrl(
  option: UseCollectionOptions<object>['url']
): { adapter: CollectionUrlAdapter; prefix: string } | null {
  if (!option) return null
  if (option === true) return { adapter: historyAdapter(), prefix: '' }
  if ('read' in option) return { adapter: option, prefix: '' }
  return { adapter: option.adapter ?? historyAdapter(), prefix: option.prefix ?? '' }
}

export const basePreferences = (
  options: Pick<UseCollectionOptions<object>, 'pagination' | 'preferences'>
): Required<CollectionPreferencesValue> => ({
  pageSize: options.pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
  columns: [],
  wrapLines: false,
  striped: false,
  density: 'comfortable',
  ...options.preferences?.defaults
})
