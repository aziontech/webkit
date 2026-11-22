import { computed, type ComputedRef, readonly, type Ref } from 'vue'

import { selectedItemsOf, setSelectionKeys } from '../lib/selection'
import type { CollectionState, CollectionView } from '../lib/state'
import type { UseCollectionReturn } from '../lib/types'

export type UseCollectionSelectionReturn<T> = Pick<
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
> & {
  pageKeys: ComputedRef<string[]>
  applyPageSelection: (nextOnPage: Set<string>) => void
}

export function useCollectionSelection<T extends object>(
  s: CollectionState<T>,
  view: CollectionView<T>
): UseCollectionSelectionReturn<T> {
  const { serverMode, selectionMode, selectionEnabled, keyOf, selected, allMatching, excluded } = s

  const selectedSet = computed<Set<string>>(() => new Set(selected.value))
  const excludedSet = computed<Set<string>>(() => new Set(excluded.value))

  const isSelected = (key: string): boolean =>
    allMatching.value ? !excludedSet.value.has(key) : selectedSet.value.has(key)

  const pageKeys = computed<string[]>(() => view.items.value.map(keyOf))

  const setKeys = (keys: string[], value: boolean): void => {
    if (selectionEnabled) setSelectionKeys(s, keys, value)
  }

  const pageSelected = computed<boolean>(
    () => pageKeys.value.length > 0 && pageKeys.value.every(isSelected)
  )

  return {
    selectedKeys: computed<string[]>(() =>
      allMatching.value ? pageKeys.value.filter(isSelected) : selected.value
    ),
    selectedItems: computed<T[]>(() => selectedItemsOf(s, isSelected)),
    selectedCount: computed<number>(() =>
      allMatching.value
        ? Math.max(0, view.totalCount.value - excluded.value.length)
        : selected.value.length
    ),
    allMatchingSelected: readonly(allMatching) as Readonly<Ref<boolean>>,
    pageSelected,
    isSelected,
    toggleSelection: (key, value) => setKeys([key], value ?? !isSelected(key)),
    selectPage: (value) => {
      if (selectionMode !== 'single') setKeys(pageKeys.value, value ?? !pageSelected.value)
    },
    selectAllMatching: () => {
      if (!selectionEnabled || selectionMode === 'single') return
      if (serverMode) {
        allMatching.value = true
        excluded.value = []
        return
      }
      selected.value = view.matchingItems.value.map(keyOf)
    },
    clearSelection: () => {
      allMatching.value = false
      excluded.value = []
      selected.value = []
    },
    pageKeys,
    applyPageSelection: (nextOnPage) => {
      const turnedOn = pageKeys.value.filter((key) => nextOnPage.has(key) && !isSelected(key))
      const turnedOff = pageKeys.value.filter((key) => !nextOnPage.has(key) && isSelected(key))
      if (turnedOff.length) setKeys(turnedOff, false)
      if (turnedOn.length) setKeys(turnedOn, true)
    }
  }
}
