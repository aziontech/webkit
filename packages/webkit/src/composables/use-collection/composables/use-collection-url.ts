import { type ComputedRef, onScopeDispose, watch } from 'vue'

import { basePreferences, resolveUrl } from '../lib/config'
import { emptyQuery } from '../lib/property-filter'
import type { CollectionState } from '../lib/state'
import type { CollectionColumn, UseCollectionOptions } from '../lib/types'
import { readUrlState, writeUrlState } from '../lib/url'
import { whenMounted } from '../lib/when-mounted'

export function useCollectionUrl<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  s: CollectionState<T>,
  pageSize: ComputedRef<number>,
  loadStored: (fromUrl: number | undefined) => void
): void {
  const { paginated, filteringText, query, sorting, page, storedPreferences } = s
  const url = resolveUrl(options.url as UseCollectionOptions<object>['url'])
  if (!url) return whenMounted(() => loadStored(undefined))
  const read = () => readUrlState(url.adapter.read(), url.prefix)
  let applyingUrl = false
  const applyUrl = (): void => {
    const state = read()
    applyingUrl = true
    filteringText.value = state.filteringText ?? options.filtering?.defaultText ?? ''
    s.debouncedText.value = filteringText.value
    query.value = state.query ?? options.propertyFiltering?.defaultQuery ?? emptyQuery()
    sorting.value = state.sorting ?? options.sorting?.defaultState ?? []
    if (state.pageSize !== undefined)
      storedPreferences.value = { ...storedPreferences.value, pageSize: state.pageSize }
    page.value = state.page ?? 1
    applyingUrl = false
  }
  applyUrl()
  whenMounted(() => loadStored(read().pageSize))

  watch(
    [filteringText, query, sorting, page, pageSize],
    () => {
      if (applyingUrl) return
      url.adapter.write(
        writeUrlState(
          url.adapter.read(),
          {
            filteringText: filteringText.value,
            query: query.value,
            sorting: sorting.value,
            page: page.value,
            pageSize: paginated ? pageSize.value : 0
          },
          { pageSize: paginated ? basePreferences(options).pageSize : 0 },
          url.prefix
        )
      )
    },
    { deep: true }
  )
  const stop = url.adapter.subscribe?.(applyUrl)
  if (stop) onScopeDispose(stop)
}
