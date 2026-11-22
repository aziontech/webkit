import { computed, type ComputedRef } from 'vue'

import type { CollectionConfig } from '../lib/config'
import type { CollectionState } from '../lib/state'
import type { UseCollectionReturn } from '../lib/types'

export type UseCollectionSelectedItemsReturn<T> = Pick<
  UseCollectionReturn<T, never>,
  'selectedKeys' | 'selectedItems' | 'selectedCount'
>

export interface CollectionSelectedItemsSources<T> {
  sourceItems: ComputedRef<readonly T[]>
  totalCount: ComputedRef<number>
}

export function useCollectionSelectedItems<T extends object>(
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  sources: CollectionSelectedItemsSources<T>,
  isSelected: (key: string) => boolean,
  pageSelectedKeys: ComputedRef<string[]>
): UseCollectionSelectedItemsReturn<T> {
  const { selected, allMatching, excluded, serverItems, seen } = state
  const { keyOf } = config

  const selectedCount = computed<number>(() =>
    allMatching.value
      ? Math.max(0, sources.totalCount.value - excluded.value.length)
      : selected.value.length
  )

  const selectedKeys = computed<string[]>(() =>
    allMatching.value ? pageSelectedKeys.value : selected.value
  )

  const serverSelection = (): T[] => {
    if (allMatching.value) return serverItems.value.filter((item) => isSelected(keyOf(item)))
    return selected.value
      .map((key) => seen.get(key))
      .filter((item): item is T => item !== undefined)
  }

  const selectedItems = computed<T[]>(() => {
    if (config.serverMode) return serverSelection()
    const set = new Set(selected.value)
    return sources.sourceItems.value.filter((item) => set.has(keyOf(item)))
  })

  return { selectedKeys, selectedItems, selectedCount }
}
