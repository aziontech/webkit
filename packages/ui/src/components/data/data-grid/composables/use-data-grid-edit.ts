import { nextTick, readonly, type Ref, ref } from 'vue'

import {
  type DataGridBooleanLabels,
  type DataGridCell,
  HEADER,
  parseCell,
  rawText
} from '../lib/grid-values'
import type { DataGridColumn } from '../types'
import type { UseDataGridCellsReturn } from './use-data-grid-cells'

export interface DataGridEditHost {
  record: (row: number) => Record<string, unknown> | undefined
  write: (event: Event, row: number, column: DataGridColumn, value: unknown) => void
  toggleRow: (row: number) => void
  focusActive: () => void
  move: (row: number, col: number) => void
  labels: () => DataGridBooleanLabels
}

export interface UseDataGridEditReturn {
  editing: Readonly<Ref<DataGridCell | null>>
  draft: Readonly<Ref<string>>
  invalid: Readonly<Ref<boolean>>
  isEditing: (row: number, col: number) => boolean
  startEdit: (event: Event, row: number, col: number, initial?: string) => void
  commit: (event: Event, step?: DataGridCell) => void
  onEditorKeydown: (event: KeyboardEvent) => void
  onEditorInput: (event: Event) => void
}

const focusEditor = (id: string, select: boolean): void => {
  const editor = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null
  editor?.focus()
  if (select && editor instanceof HTMLInputElement) editor.select()
}

const nextCell = (cell: DataGridCell, step: DataGridCell, count: number): DataGridCell => {
  const index = cell.row * count + cell.col + step.col
  return step.row
    ? { row: cell.row + step.row, col: cell.col }
    : { row: Math.floor(index / count), col: ((index % count) + count) % count }
}

const EDITOR_STEPS: Partial<Record<string, (event: KeyboardEvent) => DataGridCell>> = {
  Enter: () => ({ row: 1, col: 0 }),
  Tab: (event) => ({ row: 0, col: event.shiftKey ? -1 : 1 })
}

const editorKeydown = (
  event: KeyboardEvent,
  cancel: () => void,
  commit: (event: Event, step?: DataGridCell) => void
): void => {
  event.stopPropagation()
  const step = EDITOR_STEPS[event.key]
  if (event.key === 'Escape' || step) event.preventDefault()
  if (event.key === 'Escape') cancel()
  else if (step) commit(event, step(event))
}

export function useDataGridEdit(
  cells: UseDataGridCellsReturn,
  host: DataGridEditHost
): UseDataGridEditReturn {
  const editing = ref<DataGridCell | null>(null)
  const draft = ref<string>('')
  const invalid = ref<boolean>(false)

  const close = (refocus = false): void => {
    editing.value = null
    invalid.value = false
    if (refocus) host.focusActive()
  }
  const cancel = (): void => close(true)

  const startEdit = (event: Event, row: number, col: number, initial?: string): void => {
    if (row === HEADER) return
    const column = cells.columnAt(col)
    const entry = host.record(row)
    if (!column || !entry) {
      if (col < cells.offset.value) host.toggleRow(row)
      return
    }
    if (!cells.editable(column)) return
    if (column.type === 'boolean') return host.write(event, row, column, !entry[column.id])
    editing.value = { row, col }
    invalid.value = false
    draft.value = initial ?? rawText(entry[column.id])
    void nextTick(() => focusEditor(`${cells.cellId(row, col)}-editor`, initial === undefined))
  }

  const commit = (event: Event, step?: DataGridCell): void => {
    const cell = editing.value
    if (!cell) return
    const column = cells.columnAt(cell.col)
    if (!column) return cancel()
    const result = parseCell(column, draft.value, host.labels())
    if (!result.valid) {
      if (event.type === 'blur') return close()
      invalid.value = true
      return
    }
    close()
    host.write(event, cell.row, column, result.value)
    if (!step) return host.focusActive()
    const next = nextCell(cell, step, cells.colCount.value)
    host.move(next.row, next.col)
  }

  return {
    editing: readonly(editing),
    draft: readonly(draft),
    invalid: readonly(invalid),
    isEditing: (row, col) => editing.value?.row === row && editing.value.col === col,
    startEdit,
    commit,
    onEditorKeydown: (event) => editorKeydown(event, cancel, commit),
    onEditorInput: (event) => {
      draft.value = (event.target as HTMLInputElement | HTMLSelectElement).value
      invalid.value = false
    }
  }
}
