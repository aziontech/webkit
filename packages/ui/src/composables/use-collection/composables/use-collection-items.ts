import { computed, type ComputedRef, watch } from 'vue'

import { columnIdOf } from '../lib/config'
import { matchesQuery, matchesText, queryIsEmpty } from '../lib/property-filter'
import { sortItems } from '../lib/sort'
import type { CollectionState, CollectionView } from '../lib/state'
import type { CollectionColumn, CollectionStatus, UseCollectionOptions } from '../lib/types'

export function useCollectionItems<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  s: CollectionState<T, C>,
  pageSize: ComputedRef<number>
): CollectionView<T> {
  const { serverMode, paginated, filteringText, query, sorting, page, columns, properties } = s

  const filtersActive = computed<boolean>(
    () => filteringText.value.trim() !== '' || !queryIsEmpty(query.value)
  )

  const fieldOf = (id: string): string => {
    const column = columns.value.find((c) => columnIdOf(c) === id)
    return column?.accessorKey ?? id
  }

  const matchingItems = computed<T[]>(() => {
    if (serverMode) return s.serverItems.value
    const fields = options.filtering?.fields
    const filtered = s.sourceItems.value.filter(
      (item) =>
        matchesText(item, filteringText.value, fields) &&
        matchesQuery(item, query.value, properties.value, fields)
    )
    if (!sorting.value.length) return filtered
    return sortItems(filtered, sorting.value, options.sorting?.comparators ?? {}, fieldOf)
  })

  const totalCount = computed<number>(() =>
    serverMode ? s.serverTotal.value : matchingItems.value.length
  )
  const pageCount = computed<number>(() =>
    paginated ? Math.max(1, Math.ceil(totalCount.value / pageSize.value)) : 1
  )

  const items = computed<T[]>(() => {
    if (serverMode || !paginated) return matchingItems.value
    const start = (page.value - 1) * pageSize.value
    return matchingItems.value.slice(start, start + pageSize.value)
  })

  const status = computed<CollectionStatus>(() => {
    if (s.loading.value) return 'loading'
    if (s.error.value) return 'error'
    if (totalCount.value > 0) return 'ready'
    return filtersActive.value ? 'no-match' : 'empty'
  })

  watch(totalCount, () => {
    if (!serverMode && page.value > pageCount.value) page.value = pageCount.value
  })

  return { items, matchingItems, totalCount, pageCount, status, filtersActive }
}
