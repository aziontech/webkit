import { computed, type ComputedRef, nextTick, type Ref, ref, watch } from 'vue'

import { useScrollEdges } from '../../../../composables/use-scroll-edges'
import type { DataTableRecord, DataTableRow } from '../injection-key'
import { indexAt } from '../lib/row-offsets'
import { useDataTableLazyRows } from './use-data-table-lazy-rows'
import { useDataTableRowHeights } from './use-data-table-row-heights'

const ESTIMATED_ROW_HEIGHT = 48
const VIRTUAL_OVERSCAN = 8

export interface DataTableWindowOptions {
  virtual: () => boolean
  stacked: () => boolean
  loading: () => boolean
  lean: () => boolean
  records: () => DataTableRecord[]
  rows: ComputedRef<DataTableRow[]>
  rowTotal: ComputedRef<number>
  rowIdAt: (index: number) => string
  rowIndexById: ComputedRef<Map<string, number>>
  viewport: () => HTMLElement | undefined
  remeasureOn: () => unknown[]
  shrinkOn: () => unknown[]
  bindLeanSlice: (slice: () => DataTableRecord[]) => void
}

export interface UseDataTableWindowReturn {
  scrollTop: ComputedRef<number>
  setScrollTop: (top: number) => void
  rowHeight: ComputedRef<number>
  rowOffsets: ComputedRef<Float64Array>
  trackRow: (instance: unknown, id: string) => void
  virtualActive: ComputedRef<boolean>
  lazyActive: ComputedRef<boolean>
  lazyGap: ComputedRef<number>
  lazySentinelEl: Ref<HTMLElement | null>
  windowed: ComputedRef<boolean>
  windowStart: ComputedRef<number>
  leanSlice: ComputedRef<DataTableRecord[]>
  renderedRows: ComputedRef<DataTableRow[]>
  virtualPadding: ComputedRef<Record<string, string> | undefined>
  overflowStart: Ref<number>
  overflowEnd: Ref<number>
  onViewportScroll: (event: Event) => void
}

interface WindowBounds {
  windowStart: ComputedRef<number>
  windowEnd: ComputedRef<number>
  windowed: ComputedRef<boolean>
}

const visibleHeightOf = (el: HTMLElement): number =>
  Math.min(el.clientHeight, globalThis.innerHeight || el.clientHeight)

const useBounds = (
  o: DataTableWindowOptions,
  s: {
    virtualActive: ComputedRef<boolean>
    lazyActive: ComputedRef<boolean>
    lazyLimit: Ref<number>
    rowOffsets: ComputedRef<Float64Array>
    scrollTop: Ref<number>
    clientHeight: Ref<number>
  }
): WindowBounds => {
  const windowStart = computed<number>(() => {
    if (!s.virtualActive.value) return 0
    const first = Math.max(0, indexAt(s.rowOffsets.value, s.scrollTop.value) - VIRTUAL_OVERSCAN)
    return first - (first % 2)
  })
  const windowEnd = computed<number>(() => {
    if (s.lazyActive.value) return Math.min(o.rowTotal.value, s.lazyLimit.value)
    if (!s.virtualActive.value) return o.rowTotal.value
    const bottom = s.scrollTop.value + (s.clientHeight.value || 640)
    const last = indexAt(s.rowOffsets.value, bottom) + 1
    return Math.min(o.rowTotal.value, Math.max(last, windowStart.value) + VIRTUAL_OVERSCAN)
  })
  return {
    windowStart,
    windowEnd,
    windowed: computed(() => s.virtualActive.value || s.lazyActive.value)
  }
}

const watchClientHeight = (
  o: DataTableWindowOptions,
  active: ComputedRef<boolean>,
  count: () => number,
  clientHeight: Ref<number>
): void => {
  watch(
    () => [active.value, count()],
    () =>
      void nextTick(() => {
        const el = o.viewport()
        if (el && active.value) clientHeight.value = visibleHeightOf(el)
      }),
    { flush: 'post' }
  )
}

const useScroll = (
  o: DataTableWindowOptions,
  scrollTop: Ref<number>,
  clientHeight: Ref<number>
): Pick<UseDataTableWindowReturn, 'overflowStart' | 'overflowEnd' | 'onViewportScroll'> => {
  const edges = useScrollEdges(() => o.viewport() ?? null)
  return {
    overflowStart: edges.start,
    overflowEnd: edges.end,
    onViewportScroll: (event) => {
      edges.measure()
      if (!o.virtual()) return
      const el = event.currentTarget as HTMLElement
      scrollTop.value = el.scrollTop
      clientHeight.value = visibleHeightOf(el)
    }
  }
}

export function useDataTableWindow(o: DataTableWindowOptions): UseDataTableWindowReturn {
  const scrollTop = ref<number>(0)
  const clientHeight = ref<number>(0)
  const virtualActive = computed(() => o.virtual() && !o.stacked() && !o.loading())
  const heights = useDataTableRowHeights(
    ESTIMATED_ROW_HEIGHT,
    o.rowTotal,
    o.rowIdAt,
    (id) => o.rowIndexById.value.get(id),
    o.viewport,
    virtualActive,
    scrollTop
  )
  watch(o.remeasureOn, heights.resetRowHeights)
  const lazy = useDataTableLazyRows({ ...o, virtualActive, rowHeight: heights.rowHeight })
  const { windowStart, windowEnd, windowed } = useBounds(o, {
    ...lazy,
    virtualActive,
    rowOffsets: heights.rowOffsets,
    scrollTop,
    clientHeight
  })
  const leanSlice = computed(() =>
    windowed.value ? o.records().slice(windowStart.value, windowEnd.value) : o.records()
  )
  o.bindLeanSlice(() => leanSlice.value)
  const renderedRows = computed(() =>
    !o.lean() && windowed.value
      ? o.rows.value.slice(windowStart.value, windowEnd.value)
      : o.rows.value
  )
  watchClientHeight(o, virtualActive, () => renderedRows.value.length, clientHeight)
  return {
    scrollTop: computed(() => scrollTop.value),
    setScrollTop: (top) => (scrollTop.value = top),
    ...heights,
    virtualActive,
    lazyActive: lazy.lazyActive,
    lazyGap: computed(() =>
      lazy.lazyActive.value ? (o.rowTotal.value - windowEnd.value) * heights.rowHeight.value : 0
    ),
    lazySentinelEl: lazy.lazySentinelEl,
    windowed,
    windowStart,
    leanSlice,
    renderedRows,
    virtualPadding: computed(() => {
      if (!virtualActive.value) return undefined
      const offsets = heights.rowOffsets.value
      return {
        paddingBlockStart: `${offsets[windowStart.value]}px`,
        paddingBlockEnd: `${offsets[o.rowTotal.value] - offsets[windowEnd.value]}px`
      }
    }),
    ...useScroll(o, scrollTop, clientHeight)
  }
}
