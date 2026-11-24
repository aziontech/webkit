import { computed, type ComputedRef, nextTick, type Ref, ref, watch } from 'vue'

export interface DataTableLiveOptions {
  live: Ref<boolean>
  rowTotal: ComputedRef<number>
  rowIdAt: (index: number) => string
  rowIndexById: ComputedRef<Map<string, number>>
  rowHeight: ComputedRef<number>
  viewport: () => HTMLElement | undefined
  setScrollTop: (top: number) => void
}

export function useDataTableLive(o: DataTableLiveOptions): ComputedRef<string | null> {
  const liveStartId = ref<string | null>(null)
  const scrollToNewest = (): void => {
    const el = o.viewport()
    if (el) el.scrollTop = 0
    o.setScrollTop(0)
  }
  watch(
    o.live,
    (on) => {
      liveStartId.value = on && o.rowTotal.value > 0 ? o.rowIdAt(0) : null
      if (on) scrollToNewest()
    },
    { immediate: true, flush: 'post' }
  )
  watch(o.rowTotal, (total, previous) => {
    if (!o.live.value) return
    if (liveStartId.value === null && total > 0) liveStartId.value = o.rowIdAt(0)
    if (total > (previous ?? 0) && (o.viewport()?.scrollTop ?? 0) < o.rowHeight.value)
      void nextTick(scrollToNewest)
  })
  return computed<string | null>(() => {
    const id = liveStartId.value
    if (!o.live.value || id === null) return null
    return (o.rowIndexById.value.get(id) ?? 0) > 0 ? id : null
  })
}
