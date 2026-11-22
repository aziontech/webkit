import { cloneQuery, type PropertyFilterQuery } from '../lib/property-filter'
import type { CollectionState, CollectionView } from '../lib/state'
import type {
  CollectionColumn,
  CollectionSort,
  UseCollectionOptions,
  UseCollectionReturn
} from '../lib/types'

export type UseCollectionFiltersReturn = Pick<
  UseCollectionReturn<never, never>,
  'setFilteringText' | 'setQuery' | 'clearFilters' | 'setSorting' | 'setPage'
>

export function useCollectionFilters<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  s: CollectionState<T>,
  view: CollectionView<T>
): UseCollectionFiltersReturn {
  const { serverMode, filteringText, query, page, selected } = s
  const keepSelection = options.selection?.keepSelection

  const onFiltersChanged = (): void => {
    page.value = 1
    s.allMatching.value = false
    s.excluded.value = []
    if (keepSelection || serverMode) {
      if (serverMode && !keepSelection) selected.value = []
      return
    }
    const visible = new Set(view.matchingItems.value.map(s.keyOf))
    selected.value = selected.value.filter((key) => visible.has(key))
  }

  return {
    setFilteringText: (text: string): void => {
      if (text === filteringText.value) return
      filteringText.value = text
      onFiltersChanged()
    },
    setQuery: (next: PropertyFilterQuery): void => {
      query.value = cloneQuery(next)
      onFiltersChanged()
    },
    clearFilters: (): void => {
      filteringText.value = ''
      query.value = { tokens: [], operation: query.value.operation }
      onFiltersChanged()
    },
    setSorting: (next: CollectionSort[]): void => {
      s.sorting.value = options.sorting?.multiple ? [...next] : next.slice(0, 1)
      page.value = 1
    },
    setPage: (next: number): void => {
      const target = Math.max(1, Math.floor(next))
      page.value = serverMode ? target : Math.min(target, view.pageCount.value)
    }
  }
}
