import { getCurrentInstance, onMounted } from 'vue'

import { useCollectionBindings } from './composables/use-collection-bindings'
import { useCollectionExport } from './composables/use-collection-export'
import { useCollectionFilters } from './composables/use-collection-filters'
import { useCollectionItems } from './composables/use-collection-items'
import { useCollectionPreferences } from './composables/use-collection-preferences'
import { useCollectionSelection } from './composables/use-collection-selection'
import { useCollectionServer } from './composables/use-collection-server'
import { useCollectionSources } from './composables/use-collection-sources'
import { useCollectionTextDebounce } from './composables/use-collection-text-debounce'
import { useCollectionUrl } from './composables/use-collection-url'
import { resolveCollectionConfig } from './lib/config'
import { createCollectionState, readonlyStateOf } from './lib/state'
import type { CollectionColumn, UseCollectionOptions, UseCollectionReturn } from './lib/types'

export function useCollection<T extends object, C extends CollectionColumn = CollectionColumn>(
  options: UseCollectionOptions<T, C>
): UseCollectionReturn<T, C> {
  const config = resolveCollectionConfig(options)
  const state = createCollectionState(options)
  const sources = useCollectionSources(options)
  const { loadStored, ...preferencesApi } = useCollectionPreferences(
    options,
    config,
    sources.columns,
    state
  )
  const { pageSize } = preferencesApi
  const view = useCollectionItems(options, config, state, { ...sources, pageSize })
  const { pageSelectedKeys, applyPageSelection, resetForFilters, ...selection } =
    useCollectionSelection(config, state, { ...view, sourceItems: sources.sourceItems })
  const filters = useCollectionFilters(config, state, view.pageCount, resetForFilters)
  const server = useCollectionServer(options, config, state, pageSize)
  const { exportItems, exportRows } = useCollectionExport(options, config, state, {
    sourceItems: sources.sourceItems,
    matchingItems: view.matchingItems
  })
  const url = useCollectionUrl(options, config, state, pageSize)

  const start = (): void => {
    loadStored(url.readPageSize())
    server.start()
  }
  if (getCurrentInstance()) onMounted(start)
  else start()
  url.watchState()
  if (config.serverMode) useCollectionTextDebounce(state, options.filtering?.debounce)
  server.watchSources()

  const bindings = useCollectionBindings({
    ...state,
    ...sources,
    ...preferencesApi,
    ...filters,
    ...view,
    config,
    pageSelectedKeys,
    exportRows,
    applyPageSelection
  })

  return {
    ...view,
    ...selection,
    ...filters,
    ...preferencesApi,
    ...bindings,
    ...readonlyStateOf(state),
    refresh: server.refresh,
    exportItems
  }
}
