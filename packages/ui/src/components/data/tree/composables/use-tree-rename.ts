import { type MaybeRefOrGetter, nextTick, readonly, type Ref, ref, toValue } from 'vue'

import type { TreeItem, TreeRenamePayload } from '../tree.vue'
import type { UseTreeNavigationReturn } from './use-tree-navigation'

export interface UseTreeRenameReturn {
  renamingId: Readonly<Ref<string>>
  start: (id: string) => void
  commit: (event: KeyboardEvent | FocusEvent, id: string, value: string) => void
  cancel: (id: string) => void
}

export function useTreeRename(
  editable: MaybeRefOrGetter<boolean>,
  navigation: UseTreeNavigationReturn<TreeItem>,
  focusItem: (id: string) => void,
  renamed: (event: KeyboardEvent | FocusEvent, payload: TreeRenamePayload) => void
): UseTreeRenameReturn {
  const renamingId = ref('')

  const end = (id: string, refocus: boolean): void => {
    if (renamingId.value !== id) return
    renamingId.value = ''
    if (refocus) void nextTick(() => focusItem(id))
  }

  return {
    renamingId: readonly(renamingId),
    start: (id) => {
      const entry = navigation.entry(id)
      if (toValue(editable) && entry && !entry.item.disabled) renamingId.value = id
    },
    commit: (event, id, value) => {
      const entry = navigation.entry(id)
      const label = value.trim()
      end(id, event.type === 'keydown')
      if (entry && label && label !== entry.item.label) renamed(event, { item: entry.item, label })
    },
    cancel: (id) => end(id, true)
  }
}
