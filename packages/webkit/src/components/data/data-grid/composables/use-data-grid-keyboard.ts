import type { Ref } from 'vue'

import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'
import { useElementListener } from '../../../../composables/use-element-listener'
import { type DataGridCell, HEADER } from '../lib/grid-values'
import type { DataGridColumn } from '../types'
import type { UseDataGridCellsReturn } from './use-data-grid-cells'
import type { UseDataGridCursorReturn } from './use-data-grid-cursor'
import type { UseDataGridEditReturn } from './use-data-grid-edit'
import type { UseDataGridResizeReturn } from './use-data-grid-resize'

const PAGE = 10

export interface DataGridKeyboardHost {
  rowCount: () => number
  toggleRow: (row: number) => void
  toggleAll: () => void
  write: (event: Event, row: number, column: DataGridColumn, value: unknown) => void
  copyRange: () => void
}

type CellKey = (
  event: KeyboardEvent,
  key: string,
  row: number,
  col: number,
  command: boolean
) => boolean

const STEPS: Partial<Record<string, DataGridCell>> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 }
}

const target = (key: string, row: number, col: number, last: DataGridCell, command: boolean) => {
  const step = STEPS[key]
  if (step) return { row: row + step.row, col: col + step.col }
  if (key === 'Home') return command ? { row: 0, col: 0 } : { row, col: 0 }
  if (key === 'End') return command ? last : { row, col: last.col }
  if (key === 'PageUp') return { row: Math.max(row - PAGE, 0), col }
  return key === 'PageDown' ? { row: row + PAGE, col } : null
}

const isTyped = (column: DataGridColumn | undefined): column is DataGridColumn =>
  column !== undefined && (column.type ?? 'text') !== 'boolean' && column.type !== 'select'

const cellOf = (node: EventTarget | null): DataGridCell | null => {
  const cell =
    node instanceof Element ? node.closest('[role="gridcell"], [role="columnheader"]') : null
  const rowIndex = Number(cell?.parentElement?.getAttribute('aria-rowindex'))
  const colIndex = Number(cell?.getAttribute('aria-colindex'))
  if (!cell || !rowIndex || !colIndex) return null
  return { row: rowIndex - 2, col: colIndex - 1 }
}

function useDataGridCellKeys(
  cells: UseDataGridCellsReturn,
  edit: UseDataGridEditReturn,
  host: DataGridKeyboardHost
): CellKey {
  const { columnAt, editable, cellId, offset } = cells
  const { startEdit } = edit
  const typedColumn = (row: number, col: number): DataGridColumn | null => {
    const column = columnAt(col)
    return row !== HEADER && isTyped(column) && editable(column) ? column : null
  }
  const press = (event: KeyboardEvent, row: number, col: number): void => {
    event.preventDefault()
    if (col >= offset.value) {
      if (row !== HEADER && columnAt(col)?.type === 'boolean') startEdit(event, row, col)
    } else if (row === HEADER) host.toggleAll()
    else host.toggleRow(row)
  }
  const open = (event: KeyboardEvent, row: number, col: number): void => {
    event.preventDefault()
    if (row !== HEADER) startEdit(event, row, col)
    else if (columnAt(col)) document.getElementById(`${cellId(HEADER, col)}-resize`)?.focus()
  }
  return (event, key, row, col, command) => {
    const column = typedColumn(row, col)
    if (key === 'Enter' || key === 'F2') open(event, row, col)
    else if (key === ' ') press(event, row, col)
    else if (key === 'Delete' || key === 'Backspace') {
      if (!column) return true
      event.preventDefault()
      host.write(event, row, column, column.type === 'number' ? null : '')
    } else if (!command && key.length === 1 && !event.altKey && column) {
      event.preventDefault()
      startEdit(event, row, col, key)
    } else return false
    return true
  }
}

export function useDataGridKeyboard(
  gridEl: Ref<HTMLElement | null>,
  cells: UseDataGridCellsReturn,
  cursor: UseDataGridCursorReturn,
  edit: UseDataGridEditReturn,
  resize: UseDataGridResizeReturn,
  host: DataGridKeyboardHost
): void {
  const { columnAt, colCount } = cells
  const { move, place, focusActive } = cursor
  const cellKey = useDataGridCellKeys(cells, edit, host)
  const lastCell = (): DataGridCell => ({ row: host.rowCount() - 1, col: colCount.value - 1 })

  const onCellKeydown = (event: KeyboardEvent, row: number, col: number): void => {
    if (edit.editing.value) return
    const key = logicalArrowKey(event.key, eventDirection(event))
    const command = event.ctrlKey || event.metaKey
    const next = target(key, row, col, lastCell(), command)
    if (next) {
      event.preventDefault()
      move(next.row, next.col, event.shiftKey)
    } else if (cellKey(event, key, row, col, command) || !command) return
    else if (key.toLowerCase() === 'c') host.copyRange()
    else if (key.toLowerCase() === 'a') {
      event.preventDefault()
      const last = lastCell()
      place({ row: Math.max(last.row, 0), col: last.col }, { row: 0, col: 0 })
    }
  }

  const onResizeKeydown = (event: KeyboardEvent, column: DataGridColumn, col: number): void => {
    event.stopPropagation()
    if (event.key === 'Escape' || event.key === 'Enter') {
      event.preventDefault()
      focusActive()
    } else if (resize.resizeKey(event, column)) place({ row: HEADER, col })
  }

  useElementListener(gridEl, 'keydown', (event: KeyboardEvent) => {
    const cell = cellOf(event.target)
    if (!cell) return
    const column = columnAt(cell.col)
    if (column && event.target instanceof Element && event.target.matches('[role="separator"]'))
      return onResizeKeydown(event, column, cell.col)
    onCellKeydown(event, cell.row, cell.col)
  })
  useElementListener(gridEl, 'dblclick', (event: MouseEvent) => {
    const cell = cellOf(event.target)
    if (cell) edit.startEdit(event, cell.row, cell.col)
  })
}
