import { type ComputedRef, onScopeDispose, watch } from 'vue'

import { basePreferences, type CollectionConfig, resolveUrl } from '../lib/config'
import { emptyQuery } from '../lib/property-filter'
import type { CollectionState } from '../lib/state'
import type { CollectionColumn, UseCollectionOptions } from '../lib/types'
import { type CollectionUrlState, readUrlState, writeUrlState } from '../lib/url'

export interface UseCollectionUrlReturn {
  readPageSize: () => number | undefined
  watchState: () => void
}

export function useCollectionUrl<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  pageSize: ComputedRef<number>
): UseCollectionUrlReturn {
  const url = resolveUrl(options.url as UseCollectionOptions<object>['url'])
  const { filteringText, query, sorting, page } = state
  let applyingUrl = false

  const defaults = (): Required<Omit<CollectionUrlState, 'pageSize'>> => ({
    filteringText: options.filtering?.defaultText ?? '',
    query: options.propertyFiltering?.defaultQuery ?? emptyQuery(),
    sorting: options.sorting?.defaultState ?? [],
    page: 1
  })

  const applyUrl = (): void => {
    if (!url) return
    const { pageSize: savedSize, ...saved } = readUrlState(url.adapter.read(), url.prefix)
    const next = { ...defaults(), ...saved }
    applyingUrl = true
    filteringText.value = next.filteringText
    state.debouncedText.value = next.filteringText
    query.value = next.query
    sorting.value = next.sorting
    if (savedSize !== undefined)
      state.storedPreferences.value = { ...state.storedPreferences.value, pageSize: savedSize }
    page.value = next.page
    applyingUrl = false
  }

  const writeUrl = (): void => {
    if (applyingUrl || !url) return
    const size = config.paginated ? pageSize.value : 0
    const defaultSize = config.paginated ? basePreferences(options).pageSize : 0
    const current = {
      filteringText: filteringText.value,
      query: query.value,
      sorting: sorting.value,
      page: page.value,
      pageSize: size
    }
    url.adapter.write(
      writeUrlState(url.adapter.read(), current, { pageSize: defaultSize }, url.prefix)
    )
  }

  const watchState = (): void => {
    if (!url) return
    watch([filteringText, query, sorting, page, pageSize], writeUrl, { deep: true })
    const stop = url.adapter.subscribe?.(applyUrl)
    if (stop) onScopeDispose(stop)
  }

  applyUrl()

  return {
    readPageSize: () => (url ? readUrlState(url.adapter.read(), url.prefix).pageSize : undefined),
    watchState
  }
}
