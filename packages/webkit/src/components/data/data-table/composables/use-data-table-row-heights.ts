import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  type Ref,
  ref,
  toValue
} from 'vue'

import { indexAt, measureRows } from '../lib/row-offsets'
import { createRowTracker } from '../lib/row-tracker'

export interface UseDataTableRowHeightsReturn {
  rowHeight: ComputedRef<number>
  rowOffsets: ComputedRef<Float64Array>
  trackRow: (instance: unknown, id: string) => void
  resetRowHeights: () => void
}

export function useDataTableRowHeights(
  estimateRowHeight: MaybeRefOrGetter<number>,
  rowTotal: MaybeRefOrGetter<number>,
  rowIdAt: (index: number) => string,
  indexOf: (id: string) => number | undefined,
  viewport: () => HTMLElement | undefined,
  virtual: MaybeRefOrGetter<boolean>,
  scrollTop: Ref<number>
): UseDataTableRowHeightsReturn {
  const rowHeights = new Map<string, number>()
  const heightsVersion = ref<number>(0)
  const measuredEstimate = ref<number>(0)
  let heightsFrame = 0
  const rowHeight = computed<number>(
    () => measuredEstimate.value || Math.max(1, toValue(estimateRowHeight))
  )
  const rowOffsets = computed<Float64Array>(() => {
    void heightsVersion.value
    const total = toValue(rowTotal)
    const estimate = rowHeight.value
    const offsets = new Float64Array(total + 1)
    for (let i = 0; i < total; i++)
      offsets[i + 1] = offsets[i] + (rowHeights.get(rowIdAt(i)) ?? estimate)
    return offsets
  })

  const onRowsResized = (entries: ResizeObserverEntry[]): void => {
    const el = viewport()
    const anchor = el ? indexAt(rowOffsets.value, el.scrollTop) : 0
    const resize = measureRows(entries, tracker.ids, rowHeights, indexOf, anchor, rowHeight.value)
    if (!resize.changed) return
    const estimateNext =
      measuredEstimate.value || (resize.firstCount ? resize.firstSum / resize.firstCount : 0)
    const shift = measuredEstimate.value ? resize.shift : 0
    if (el && shift) el.scrollTop += shift
    globalThis.cancelAnimationFrame(heightsFrame)
    heightsFrame = globalThis.requestAnimationFrame(() => {
      measuredEstimate.value = estimateNext
      heightsVersion.value += 1
      if (el) scrollTop.value = el.scrollTop
    })
  }

  const tracker = createRowTracker(onRowsResized)

  const resetRowHeights = (): void => {
    rowHeights.clear()
    measuredEstimate.value = 0
    heightsVersion.value += 1
    tracker.remeasure()
  }

  onScopeDispose(() => {
    tracker.disconnect()
    globalThis.cancelAnimationFrame(heightsFrame)
  })

  return {
    rowHeight,
    rowOffsets,
    trackRow: (instance, id) => tracker.track(instance, id, toValue(virtual)),
    resetRowHeights
  }
}
