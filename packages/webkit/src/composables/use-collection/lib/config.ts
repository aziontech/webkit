import type { CollectionPreferencesValue } from './preferences'
import type { CollectionColumn, CollectionSelectionMode, UseCollectionOptions } from './types'
import { type CollectionUrlAdapter, historyAdapter } from './url'

export const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_SIZES = [10, 25, 50, 100]

export interface CollectionConfig<T> {
  serverMode: boolean
  itemKey: string
  keyOf: (item: T) => string
  paginated: boolean
  pageSizeOptions: number[]
  multiSort: boolean
  selectionMode: CollectionSelectionMode
  selectionEnabled: boolean
  keepSelection: boolean
}

export interface CollectionUrl {
  adapter: CollectionUrlAdapter
  prefix: string
}

export const columnIdOf = (column: CollectionColumn): string =>
  column.id ?? column.accessorKey ?? column.header ?? ''

export function resolveCollectionConfig<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>
): CollectionConfig<T> {
  const itemKey = (options.itemKey ?? 'id') as string
  return {
    serverMode: typeof options.fetch === 'function',
    itemKey,
    keyOf: (item: T): string => String((item as Record<string, unknown>)[itemKey] ?? ''),
    paginated: Boolean(options.pagination),
    pageSizeOptions: options.pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZES,
    multiSort: options.sorting?.multiple ?? false,
    selectionMode: options.selection?.mode ?? 'multiple',
    selectionEnabled: Boolean(options.selection),
    keepSelection: options.selection?.keepSelection ?? false
  }
}

export const preferenceColumnsOf = <C extends CollectionColumn>(columns: readonly C[]): C[] =>
  columns.filter((column) => column.type !== 'action')

export function resolveUrl(option: UseCollectionOptions<object>['url']): CollectionUrl | null {
  if (!option) return null
  if (option === true) return { adapter: historyAdapter(), prefix: '' }
  if ('read' in option) return { adapter: option, prefix: '' }
  return { adapter: option.adapter ?? historyAdapter(), prefix: option.prefix ?? '' }
}

export function basePreferences(
  options: Pick<UseCollectionOptions<object>, 'pagination' | 'preferences'>
): Required<CollectionPreferencesValue> {
  return {
    pageSize: options.pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
    columns: [],
    wrapLines: false,
    striped: false,
    density: 'comfortable',
    ...options.preferences?.defaults
  }
}
