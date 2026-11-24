import { onScopeDispose, readonly, type Ref, ref } from 'vue'

import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'
import type { DataGridColumn } from '../types'
import type { UseDataGridCellsReturn } from './use-data-grid-cells'

export const MAX_WIDTH = 960
const RESIZE_STEP = 16

export interface UseDataGridResizeReturn {
  resizing: Readonly<Ref<string | null>>
  startResize: (event: PointerEvent, column: DataGridColumn) => void
  resizeKey: (event: KeyboardEvent, column: DataGridColumn) => boolean
}

const clampWidth = (column: DataGridColumn, width: number): number =>
  Math.min(MAX_WIDTH, Math.max(column.minWidth ?? 64, width))

export function useDataGridResize(cells: UseDataGridCellsReturn): UseDataGridResizeReturn {
  const resizing = ref<string | null>(null)
  let stopResize: (() => void) | null = null

  const startResize = (event: PointerEvent, column: DataGridColumn): void => {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const startWidth = cells.widthOf(column)
    const sign = eventDirection(event) === 'rtl' ? -1 : 1
    resizing.value = column.id
    const onMove = (next: PointerEvent): void =>
      cells.setWidth(column, clampWidth(column, startWidth + sign * (next.clientX - startX)))
    const onUp = (): void => stopResize?.()
    stopResize = () => {
      globalThis.removeEventListener('pointermove', onMove)
      globalThis.removeEventListener('pointerup', onUp)
      resizing.value = null
      stopResize = null
    }
    globalThis.addEventListener('pointermove', onMove)
    globalThis.addEventListener('pointerup', onUp)
  }

  const resizeKey = (event: KeyboardEvent, column: DataGridColumn): boolean => {
    const key = logicalArrowKey(event.key, eventDirection(event))
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return false
    event.preventDefault()
    const step = key === 'ArrowRight' ? RESIZE_STEP : -RESIZE_STEP
    cells.setWidth(column, clampWidth(column, cells.widthOf(column) + step))
    return true
  }

  onScopeDispose(() => stopResize?.())

  return { resizing: readonly(resizing), startResize, resizeKey }
}
