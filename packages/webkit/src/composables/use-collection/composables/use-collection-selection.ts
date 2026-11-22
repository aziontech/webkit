import { computed, type ComputedRef, readonly } from 'vue'

import type { CollectionConfig } from '../lib/config'
import type { CollectionState } from '../lib/state'
import type { UseCollectionReturn } from '../lib/types'
import { useCollectionSelectedItems } from './use-collection-selected-items'
import { useCollectionSelectionKeys } from './use-collection-selection-keys'

export type CollectionSelectionApi<T> = Pick<
  UseCollectionReturn<T, never>,
  | 'selectedKeys'
  | 'selectedItems'
  | 'selectedCount'
  | 'allMatchingSelected'
  | 'pageSelected'
  | 'isSelected'
  | 'toggleSelection'
  | 'selectPage'
  | 'selectAllMatching'
  | 'clearSelection'
>

export interface UseCollectionSelectionReturn<T> extends CollectionSelectionApi<T> {
  pageSelectedKeys: ComputedRef<string[]>
  applyPageSelection: (nextOnPage: Set<string>) => void
  resetForFilters: () => void
}

export interface CollectionSelectionSources<T> {
  items: ComputedRef<T[]>
  matchingItems: ComputedRef<T[]>
  sourceItems: ComputedRef<readonly T[]>
  totalCount: ComputedRef<number>
}

export function useCollectionSelection<T extends object>(
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  sources: CollectionSelectionSources<T>
): UseCollectionSelectionReturn<T> {
  const { keyOf } = config
  const { setKeys, ...keys } = useCollectionSelectionKeys(config, state, () =>
    sources.matchingItems.value.map(keyOf)
  )
  const { isSelected } = keys

  const pageKeys = computed<string[]>(() => sources.items.value.map(keyOf))
  const pageSelectedKeys = computed<string[]>(() => pageKeys.value.filter(isSelected))
  const pageSelected = computed<boolean>(
    () => pageKeys.value.length > 0 && pageKeys.value.every(isSelected)
  )

  const applyPageSelection = (nextOnPage: Set<string>): void => {
    const turnedOn = pageKeys.value.filter((key) => nextOnPage.has(key) && !isSelected(key))
    const turnedOff = pageKeys.value.filter((key) => !nextOnPage.has(key) && isSelected(key))
    if (turnedOff.length) setKeys(turnedOff, false)
    if (turnedOn.length) setKeys(turnedOn, true)
  }

  return {
    ...useCollectionSelectedItems(config, state, sources, isSelected, pageSelectedKeys),
    ...keys,
    allMatchingSelected: readonly(state.allMatching),
    pageSelected,
    pageSelectedKeys,
    toggleSelection: (key, value) => setKeys([key], value ?? !isSelected(key)),
    selectPage: (value) => {
      if (config.selectionMode !== 'single') setKeys(pageKeys.value, value ?? !pageSelected.value)
    },
    applyPageSelection
  }
}
