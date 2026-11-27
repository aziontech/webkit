import type { CollectionState } from './state'
import type { CollectionFetchResult } from './types'

export function applyFetchResult<T>(
  s: CollectionState<T>,
  result: CollectionFetchResult<T>,
  pageSize: number
): void {
  for (const item of result.items) s.seen.set(s.keyOf(item), item)
  s.serverItems.value = result.items
  s.serverTotal.value = result.total
  const lastPage = Math.max(1, Math.ceil(result.total / pageSize))
  if (s.page.value > lastPage && result.total > 0) s.page.value = lastPage
}
