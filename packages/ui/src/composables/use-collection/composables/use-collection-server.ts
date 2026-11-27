import { type ComputedRef, onScopeDispose, watch } from 'vue'

import { cloneQuery } from '../lib/property-filter'
import { applyFetchResult } from '../lib/server'
import type { CollectionState } from '../lib/state'
import type { CollectionColumn, UseCollectionOptions } from '../lib/types'
import { whenMounted } from '../lib/when-mounted'
import { useCollectionTextDebounce } from './use-collection-text-debounce'

export function useCollectionServer<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  s: CollectionState<T>,
  pageSize: ComputedRef<number>
): () => Promise<void> {
  const { serverMode, debouncedText, query, sorting, page, loading, error } = s
  let controller: AbortController | null = null
  let requestId = 0
  let mounted = !serverMode

  const refresh = async (): Promise<void> => {
    if (!serverMode || !options.fetch) return
    controller?.abort()
    const current = new AbortController()
    controller = current
    const id = ++requestId
    loading.value = true
    error.value = null
    try {
      const result = await options.fetch({
        filteringText: debouncedText.value,
        filter: cloneQuery(query.value),
        sort: [...sorting.value],
        page: page.value,
        pageSize: pageSize.value,
        signal: current.signal
      })
      if (id === requestId) applyFetchResult(s, result, pageSize.value)
    } catch (cause) {
      if (id !== requestId || current.signal.aborted) return
      error.value = cause
    } finally {
      if (id === requestId) {
        loading.value = false
        controller = null
      }
    }
  }

  whenMounted(() => {
    mounted = true
    if (serverMode) void refresh()
  })

  if (serverMode) {
    useCollectionTextDebounce(s, options.filtering?.debounce)
    watch(
      [debouncedText, query, sorting, page, pageSize],
      () => {
        if (mounted) void refresh()
      },
      { deep: true }
    )
  }

  onScopeDispose(() => controller?.abort())

  return refresh
}
