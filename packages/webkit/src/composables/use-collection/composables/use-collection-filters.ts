import type { ComputedRef } from 'vue'

import type { CollectionConfig } from '../lib/config'
import { cloneQuery, type PropertyFilterQuery } from '../lib/property-filter'
import type { CollectionState } from '../lib/state'
import type { UseCollectionReturn } from '../lib/types'

export type UseCollectionFiltersReturn = Pick<
  UseCollectionReturn<never, never>,
  'setFilteringText' | 'setQuery' | 'clearFilters' | 'setSorting' | 'setPage'
>

export function useCollectionFilters<T extends object>(
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  pageCount: ComputedRef<number>,
  resetSelection: () => void
): UseCollectionFiltersReturn {
  const { filteringText, query, sorting, page } = state

  const onFiltersChanged = (): void => {
    page.value = 1
    resetSelection()
  }

  return {
    setFilteringText: (text) => {
      if (text === filteringText.value) return
      filteringText.value = text
      onFiltersChanged()
    },
    setQuery: (next: PropertyFilterQuery) => {
      query.value = cloneQuery(next)
      onFiltersChanged()
    },
    clearFilters: () => {
      filteringText.value = ''
      query.value = { tokens: [], operation: query.value.operation }
      onFiltersChanged()
    },
    setSorting: (next) => {
      sorting.value = config.multiSort ? [...next] : next.slice(0, 1)
      page.value = 1
    },
    setPage: (next) => {
      const target = Math.max(1, Math.floor(next))
      page.value = config.serverMode ? target : Math.min(target, pageCount.value)
    }
  }
}
