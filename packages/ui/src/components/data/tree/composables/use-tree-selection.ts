import { computed, type ComputedRef, type Ref, ref } from 'vue'

import type { TreeItem } from '../tree.vue'
import type { UseTreeNavigationReturn } from './use-tree-navigation'

export type TreeSelectionMode = 'none' | 'single' | 'multiple'

export interface UseTreeSelectionReturn {
  isSelected: (id: string) => boolean
  isEnabled: (id: string) => boolean
  writeSelection: (ids: string[]) => void
  toggleSelected: (id: string) => void
  selectMultiple: (event: MouseEvent | KeyboardEvent, id: string) => void
  selectAll: () => void
  extend: (id: string) => void
}

function rangeBetween(visible: readonly string[], anchor: string, id: string): string[] {
  const from = visible.indexOf(anchor)
  const to = visible.indexOf(id)
  if (from === -1 || to === -1) return [id]
  const [start, end] = from < to ? [from, to] : [to, from]
  return visible.slice(start, end + 1)
}

export function useTreeSelection(
  mode: ComputedRef<TreeSelectionMode>,
  selectedKey: Ref<string>,
  selectedKeys: Ref<string[]>,
  navigation: UseTreeNavigationReturn<TreeItem>
): UseTreeSelectionReturn {
  const anchorId = ref('')
  const selectedSet = computed(() => new Set(mode.value === 'multiple' ? selectedKeys.value : []))

  const isEnabled = (id: string): boolean => {
    const entry = navigation.entry(id)
    return Boolean(entry && !entry.item.disabled)
  }

  const writeSelection = (ids: string[]): void => {
    const next = [...new Set(ids)]
    const same =
      next.length === selectedKeys.value.length && next.every((id) => selectedSet.value.has(id))
    if (!same) selectedKeys.value = next
  }

  const rangeTo = (id: string): string[] =>
    rangeBetween(navigation.visible.value, anchorId.value || id, id).filter(isEnabled)

  const toggleSelected = (id: string): void => {
    anchorId.value = id
    writeSelection(
      selectedSet.value.has(id)
        ? selectedKeys.value.filter((key) => key !== id)
        : [...selectedKeys.value, id]
    )
  }

  const selectMultiple = (event: MouseEvent | KeyboardEvent, id: string): void => {
    const additive = event.ctrlKey || event.metaKey
    if (event.shiftKey) writeSelection([...(additive ? selectedKeys.value : []), ...rangeTo(id)])
    else if (event instanceof MouseEvent && additive) toggleSelected(id)
    else {
      anchorId.value = id
      writeSelection([id])
    }
  }

  return {
    isSelected: (id) =>
      mode.value === 'multiple'
        ? selectedSet.value.has(id)
        : mode.value === 'single' && selectedKey.value !== '' && selectedKey.value === id,
    isEnabled,
    writeSelection,
    toggleSelected,
    selectMultiple,
    selectAll: () => {
      anchorId.value = navigation.visible.value[0] ?? ''
      writeSelection(navigation.visible.value.filter(isEnabled))
    },
    extend: (id) => {
      if (isEnabled(id)) writeSelection([...selectedKeys.value, id])
    }
  }
}
