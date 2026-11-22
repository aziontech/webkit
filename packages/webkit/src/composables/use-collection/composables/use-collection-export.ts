import type { ComputedRef } from 'vue'

import type { CollectionConfig } from '../lib/config'
import { cloneQuery } from '../lib/property-filter'
import type { CollectionState } from '../lib/state'
import type { CollectionColumn, CollectionExportScope, UseCollectionOptions } from '../lib/types'

export interface UseCollectionExportReturn<T> {
  exportItems: (scope?: CollectionExportScope) => Promise<T[]>
  exportRows: (scope: CollectionExportScope) => Promise<T[]> | T[]
}

export function useCollectionExport<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  sources: { sourceItems: ComputedRef<readonly T[]>; matchingItems: ComputedRef<T[]> }
): UseCollectionExportReturn<T> {
  const localRows = (scope: CollectionExportScope): T[] =>
    scope === 'all' ? [...sources.sourceItems.value] : [...sources.matchingItems.value]

  const exportItems = async (scope: CollectionExportScope = 'filtered'): Promise<T[]> => {
    if (!config.serverMode) return localRows(scope)
    if (!options.exportAll) return [...state.serverItems.value]
    return options.exportAll({
      filteringText: state.filteringText.value,
      filter: cloneQuery(state.query.value),
      sort: [...state.sorting.value],
      scope
    })
  }

  return {
    exportItems,
    exportRows: (scope) => (config.serverMode ? exportItems(scope) : localRows(scope))
  }
}
