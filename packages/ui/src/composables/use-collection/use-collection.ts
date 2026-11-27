import { readonly, type Ref } from 'vue'

import { useCollectionBindings } from './composables/use-collection-bindings'
import { useCollectionFilters } from './composables/use-collection-filters'
import { useCollectionItems } from './composables/use-collection-items'
import { useCollectionPreferences } from './composables/use-collection-preferences'
import { useCollectionSelection } from './composables/use-collection-selection'
import { useCollectionServer } from './composables/use-collection-server'
import { useCollectionUrl } from './composables/use-collection-url'
import type { PropertyFilterQuery } from './lib/property-filter'
import { createCollectionState } from './lib/state'
import type {
  CollectionColumn,
  CollectionSort,
  UseCollectionOptions,
  UseCollectionReturn
} from './lib/types'

export function useCollection<T extends object, C extends CollectionColumn = CollectionColumn>(
  options: UseCollectionOptions<T, C>
): UseCollectionReturn<T, C> {
  const s = createCollectionState(options)

  const { loadStored, ...prefs } = useCollectionPreferences(options, s)
  const view = useCollectionItems(options, s, prefs.pageSize)
  const { pageKeys, applyPageSelection, ...selection } = useCollectionSelection(s, view)
  const filters = useCollectionFilters(options, s, view)
  useCollectionUrl(options, s, prefs.pageSize, loadStored)
  const refresh = useCollectionServer(options, s, prefs.pageSize)

  return {
    ...view,
    loading: readonly(s.loading),
    error: readonly(s.error),
    filteringText: readonly(s.filteringText),
    query: readonly(s.query) as Readonly<Ref<PropertyFilterQuery>>,
    sorting: readonly(s.sorting) as Readonly<Ref<CollectionSort[]>>,
    page: readonly(s.page),
    ...prefs,
    ...selection,
    ...filters,
    refresh,
    ...useCollectionBindings(options, s, view, prefs, filters, {
      ...selection,
      pageKeys,
      applyPageSelection
    })
  }
}
