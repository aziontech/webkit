import { type ComputedRef, onScopeDispose, watch } from 'vue'

import type { CollectionConfig } from '../lib/config'
import { applyFetchResult, fetchParamsOf } from '../lib/server'
import type { CollectionState } from '../lib/state'
import type { CollectionColumn, UseCollectionOptions } from '../lib/types'

export interface UseCollectionServerReturn {
  refresh: () => Promise<void>
  start: () => void
  watchSources: () => void
}

export function useCollectionServer<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  pageSize: ComputedRef<number>
): UseCollectionServerReturn {
  const { loading, error } = state
  let controller: AbortController | null = null
  let requestId = 0
  let mounted = false

  const refresh = async (): Promise<void> => {
    if (!config.serverMode || !options.fetch) return
    controller?.abort()
    const current = new AbortController()
    controller = current
    const id = ++requestId
    loading.value = true
    error.value = null
    try {
      const result = await options.fetch(fetchParamsOf(state, pageSize, current.signal))
      if (id === requestId) applyFetchResult(state, config.keyOf, pageSize.value, result)
    } catch (cause) {
      if (id === requestId && !current.signal.aborted) error.value = cause
    } finally {
      if (id === requestId) {
        loading.value = false
        controller = null
      }
    }
  }

  const watchSources = (): void => {
    if (!config.serverMode) return
    watch(
      [state.debouncedText, state.query, state.sorting, state.page, pageSize],
      () => {
        if (mounted) void refresh()
      },
      { deep: true }
    )
  }

  onScopeDispose(() => controller?.abort())

  return {
    refresh,
    start: () => {
      mounted = true
      if (config.serverMode) void refresh()
    },
    watchSources
  }
}
