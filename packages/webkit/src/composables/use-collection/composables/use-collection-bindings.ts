import { computed } from 'vue'

import { DEFAULT_PAGE_SIZE } from '../lib/config'
import { cloneQuery } from '../lib/property-filter'
import type { CollectionState, CollectionView } from '../lib/state'
import type {
  CollectionColumn,
  CollectionExportScope,
  UseCollectionOptions,
  UseCollectionReturn
} from '../lib/types'
import type { UseCollectionFiltersReturn } from './use-collection-filters'
import type { UseCollectionPreferencesReturn } from './use-collection-preferences'
import type { UseCollectionSelectionReturn } from './use-collection-selection'
import { useCollectionTableProps } from './use-collection-table-props'

export type UseCollectionBindingsReturn<T, C> = Pick<
  UseCollectionReturn<T, C>,
  | 'exportItems'
  | 'tableProps'
  | 'paginationProps'
  | 'filterProps'
  | 'propertyFilterProps'
  | 'cardListProps'
>

export function useCollectionBindings<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  s: CollectionState<T, C>,
  view: CollectionView<T>,
  prefs: Omit<UseCollectionPreferencesReturn, 'loadStored'>,
  filters: UseCollectionFiltersReturn,
  selection: UseCollectionSelectionReturn<T>
): UseCollectionBindingsReturn<T, C> {
  const { serverMode, paginated, page, query } = s
  const { pageSize, setPageSize } = prefs
  const { isSelected, pageKeys, applyPageSelection } = selection

  const exportItems = async (scope: CollectionExportScope = 'filtered'): Promise<T[]> => {
    if (!serverMode)
      return scope === 'all' ? [...s.sourceItems.value] : [...view.matchingItems.value]
    if (!options.exportAll) return [...s.serverItems.value]
    return options.exportAll({
      filteringText: s.filteringText.value,
      filter: cloneQuery(query.value),
      sort: [...s.sorting.value],
      scope
    })
  }

  const exportRows = (scope: CollectionExportScope): Promise<T[]> | T[] =>
    serverMode
      ? exportItems(scope)
      : scope === 'all'
        ? [...s.sourceItems.value]
        : [...view.matchingItems.value]

  return {
    exportItems,
    tableProps: useCollectionTableProps(s, view, prefs, filters, selection, exportRows),
    paginationProps: computed(() => ({
      page: page.value,
      total: view.totalCount.value,
      pageSize: paginated ? pageSize.value : DEFAULT_PAGE_SIZE,
      pageSizeOptions: s.pageSizeOptions,
      'onUpdate:page': filters.setPage,
      'onUpdate:pageSize': setPageSize
    })),
    filterProps: computed(() => ({
      modelValue: s.filteringText.value,
      'onUpdate:modelValue': filters.setFilteringText
    })),
    propertyFilterProps: computed(() => ({
      query: query.value,
      properties: s.properties.value,
      totalCount: view.totalCount.value,
      'onUpdate:query': filters.setQuery
    })),
    cardListProps: computed(() => ({
      items: view.items.value,
      itemKey: s.itemKey,
      loading: s.loading.value,
      selectionMode: s.selectionEnabled ? s.selectionMode : 'none',
      selectedKeys: pageKeys.value.filter(isSelected),
      'onUpdate:selectedKeys': (keys: string[]) => applyPageSelection(new Set(keys))
    }))
  }
}
