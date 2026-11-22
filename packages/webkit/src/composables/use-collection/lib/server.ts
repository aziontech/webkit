import type { ComputedRef } from 'vue'

import { cloneQuery } from './property-filter'
import type { CollectionState } from './state'
import type { CollectionFetchParams, CollectionFetchResult } from './types'

export function fetchParamsOf<T>(
  state: CollectionState<T>,
  pageSize: ComputedRef<number>,
  signal: AbortSignal
): CollectionFetchParams {
  return {
    filteringText: state.debouncedText.value,
    filter: cloneQuery(state.query.value),
    sort: [...state.sorting.value],
    page: state.page.value,
    pageSize: pageSize.value,
    signal
  }
}

export function applyFetchResult<T>(
  state: CollectionState<T>,
  keyOf: (item: T) => string,
  pageSize: number,
  result: CollectionFetchResult<T>
): void {
  for (const item of result.items) state.seen.set(keyOf(item), item)
  state.serverItems.value = result.items
  state.serverTotal.value = result.total
  const lastPage = Math.max(1, Math.ceil(result.total / pageSize))
  if (state.page.value > lastPage && result.total > 0) state.page.value = lastPage
}
