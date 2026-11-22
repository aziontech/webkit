import { computed } from 'vue'

import type { CollectionConfig } from '../lib/config'
import { selectSingle, toggleKeys } from '../lib/selection'
import type { CollectionState } from '../lib/state'

export interface UseCollectionSelectionKeysReturn {
  isSelected: (key: string) => boolean
  setKeys: (keys: string[], value: boolean) => void
  clearSelection: () => void
  selectAllMatching: () => void
  resetForFilters: () => void
}

export function useCollectionSelectionKeys<T extends object>(
  config: CollectionConfig<T>,
  state: CollectionState<T>,
  matchingKeys: () => string[]
): UseCollectionSelectionKeysReturn {
  const { selected, allMatching, excluded } = state

  const selectedSet = computed<Set<string>>(() => new Set(selected.value))
  const excludedSet = computed<Set<string>>(() => new Set(excluded.value))
  const isSelected = (key: string): boolean =>
    allMatching.value ? !excludedSet.value.has(key) : selectedSet.value.has(key)

  const setKeys = (keys: string[], value: boolean): void => {
    if (!config.selectionEnabled) return
    if (allMatching.value) excluded.value = toggleKeys(excluded.value, keys, !value)
    else if (config.selectionMode === 'single')
      selected.value = selectSingle(selected.value, keys, value)
    else selected.value = toggleKeys(selected.value, keys, value)
  }

  const clearSelection = (): void => {
    allMatching.value = false
    excluded.value = []
    selected.value = []
  }

  const selectAllMatching = (): void => {
    if (!config.selectionEnabled || config.selectionMode === 'single') return
    if (!config.serverMode) {
      selected.value = matchingKeys()
      return
    }
    allMatching.value = true
    excluded.value = []
  }

  const resetForFilters = (): void => {
    allMatching.value = false
    excluded.value = []
    if (config.serverMode) {
      if (!config.keepSelection) selected.value = []
      return
    }
    if (config.keepSelection) return
    const visible = new Set(matchingKeys())
    selected.value = selected.value.filter((key) => visible.has(key))
  }

  return { isSelected, setKeys, clearSelection, selectAllMatching, resetForFilters }
}
