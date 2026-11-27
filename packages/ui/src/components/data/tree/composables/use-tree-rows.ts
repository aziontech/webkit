import { computed, type ComputedRef, type MaybeRefOrGetter, toValue, watch } from 'vue'

import { useLazyChunks } from '../../../../composables/use-lazy-chunks'
import {
  CHUNK_SIZE,
  chunkEntries,
  FLAT_THRESHOLD,
  flattenTree,
  rootEntries,
  type TreeEntry,
  type TreeRow
} from '../lib/tree-rows'
import type { TreeItem } from '../tree.vue'
import type { UseTreeNavigationReturn } from './use-tree-navigation'

export interface UseTreeRowsReturn {
  flat: ComputedRef<boolean>
  entries: ComputedRef<TreeEntry[]>
  revealRow: (id: string) => boolean
  observe: (el: unknown, index: number) => void
}

export function useTreeRows(
  items: MaybeRefOrGetter<TreeItem[]>,
  expanded: MaybeRefOrGetter<ReadonlySet<string>>,
  rowHeight: MaybeRefOrGetter<number>,
  navigation: UseTreeNavigationReturn<TreeItem>
): UseTreeRowsReturn {
  const { split, observe, reveal } = useLazyChunks({
    get rowHeight() {
      return toValue(rowHeight)
    },
    chunkSize: CHUNK_SIZE,
    threshold: FLAT_THRESHOLD
  })

  const flat = computed(() => navigation.count.value > FLAT_THRESHOLD)
  const flatRows = computed<TreeRow[]>(() =>
    flat.value ? flattenTree(toValue(items), toValue(expanded)) : []
  )
  const rowIndex = computed(
    () => new Map(flatRows.value.map((row, position) => [row.item.id, position]))
  )
  const entries = computed<TreeEntry[]>(() =>
    flat.value ? chunkEntries(split(flatRows.value)) : rootEntries(toValue(items))
  )

  const revealRow = (id: string): boolean => {
    const position = rowIndex.value.get(id)
    if (position === undefined) return false
    reveal([Math.floor(position / CHUNK_SIZE)])
    return true
  }

  watch(
    [() => flatRows.value.length, () => navigation.tabStop.value],
    ([count], previous) => {
      const shown = previous?.[0] ?? 0
      if (shown > 0 && shown <= FLAT_THRESHOLD && count > FLAT_THRESHOLD) {
        reveal(Array.from({ length: Math.ceil(shown / CHUNK_SIZE) }, (_, chunk) => chunk))
      }
      revealRow(navigation.tabStop.value)
    },
    { immediate: true }
  )

  return { flat, entries, revealRow, observe }
}
