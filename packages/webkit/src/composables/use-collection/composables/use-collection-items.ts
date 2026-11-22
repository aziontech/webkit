import { computed, type ComputedRef, watch } from 'vue'

import { type CollectionConfig, columnIdOf } from '../lib/config'
import {
  type FilteringProperty,
  matchesQuery,
  matchesText,
  queryIsEmpty
} from '../lib/property-filter'
import { sortItems, sortKeysOf } from '../lib/sort'
import type { CollectionState } from '../lib/state'
import type {
  CollectionColumn,
  CollectionStatus,
  UseCollectionOptions,
  UseCollectionReturn
} from '../lib/types'

export type UseCollectionItemsReturn<T> = Pick<
  UseCollectionReturn<T, never>,
  'items' | 'matchingItems' | 'totalCount' | 'pageCount' | 'status' | 'filtersActive'
>

export interface CollectionItemsSources<T, C> {
  columns: ComputedRef<C[]>
  properties: ComputedRef<FilteringProperty[]>
  sourceItems: ComputedRef<readonly T[]>
  pageSize: ComputedRef<number>
}

export function useCollectionItems<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  sources: CollectionItemsSources<T, C>
): UseCollectionItemsReturn<T> {
  const { filteringText, query, sorting, page } = state
  const { columns, properties, sourceItems, pageSize } = sources

  const fieldOf = (id: string): string =>
    columns.value.find((c) => columnIdOf(c) === id)?.accessorKey ?? id

  const filtersActive = computed<boolean>(
    () => filteringText.value.trim() !== '' || !queryIsEmpty(query.value)
  )

  const matchingItems = computed<T[]>(() => {
    if (config.serverMode) return state.serverItems.value
    const fields = options.filtering?.fields
    const filtered = sourceItems.value.filter(
      (item) =>
        matchesText(item, filteringText.value, fields) &&
        matchesQuery(item, query.value, properties.value, fields)
    )
    if (!sorting.value.length) return filtered
    return sortItems(
      filtered,
      sortKeysOf(sorting.value, options.sorting?.comparators ?? {}, fieldOf)
    )
  })

  const totalCount = computed<number>(() =>
    config.serverMode ? state.serverTotal.value : matchingItems.value.length
  )
  const pageCount = computed<number>(() =>
    config.paginated ? Math.max(1, Math.ceil(totalCount.value / pageSize.value)) : 1
  )

  const items = computed<T[]>(() => {
    if (config.serverMode || !config.paginated) return matchingItems.value
    const start = (page.value - 1) * pageSize.value
    return matchingItems.value.slice(start, start + pageSize.value)
  })

  const status = computed<CollectionStatus>(() => {
    if (state.loading.value) return 'loading'
    if (state.error.value) return 'error'
    if (totalCount.value > 0) return 'ready'
    return filtersActive.value ? 'no-match' : 'empty'
  })

  watch(totalCount, () => {
    if (!config.serverMode && page.value > pageCount.value) page.value = pageCount.value
  })

  return { items, matchingItems, totalCount, pageCount, status, filtersActive }
}
