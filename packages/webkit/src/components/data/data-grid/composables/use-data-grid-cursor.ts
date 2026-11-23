import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  nextTick,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

import { boundsOf, type DataGridBounds, type DataGridCell, HEADER } from '../lib/grid-values'
import type { UseDataGridCellsReturn } from './use-data-grid-cells'

export interface UseDataGridCursorReturn {
  active: Readonly<Ref<DataGridCell>>
  bounds: ComputedRef<DataGridBounds>
  inRange: (row: number, col: number) => boolean
  isActive: (row: number, col: number) => boolean
  place: (active: DataGridCell, anchor?: DataGridCell) => void
  focusActive: () => void
  move: (row: number, col: number, extend?: boolean) => void
}

export function useDataGridCursor(
  rowCount: MaybeRefOrGetter<number>,
  cells: UseDataGridCellsReturn
): UseDataGridCursorReturn {
  const active = ref<DataGridCell>({ row: 0, col: 0 })
  const anchor = ref<DataGridCell>({ row: 0, col: 0 })
  const bounds = computed(() => boundsOf(anchor.value, active.value))
  const spans = computed<boolean>(
    () => anchor.value.row !== active.value.row || anchor.value.col !== active.value.col
  )

  const focusActive = (): void => {
    void nextTick(() => {
      document.getElementById(cells.cellId(active.value.row, active.value.col))?.focus()
    })
  }

  return {
    active: readonly(active),
    bounds,
    inRange: (row, col) =>
      spans.value &&
      row >= Math.max(bounds.value.top, 0) &&
      row <= bounds.value.bottom &&
      col >= bounds.value.start &&
      col <= bounds.value.end,
    isActive: (row, col) => active.value.row === row && active.value.col === col,
    place: (next, from) => {
      active.value = { ...next }
      if (from) anchor.value = { ...from }
    },
    focusActive,
    move: (row, col, extend = false) => {
      const count = cells.colCount.value
      if (!count) return
      active.value = {
        row: Math.min(Math.max(row, HEADER), toValue(rowCount) - 1),
        col: Math.min(Math.max(col, 0), count - 1)
      }
      if (!extend || active.value.row === HEADER || anchor.value.row === HEADER)
        anchor.value = { ...active.value }
      focusActive()
    }
  }
}
