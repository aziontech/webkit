import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

import type { DataGridColumn } from '../types'

const SELECT_WIDTH = 40

export interface UseDataGridCellsReturn {
  widths: Readonly<Ref<Readonly<Record<string, number>>>>
  widthsKey: ComputedRef<string>
  offset: ComputedRef<number>
  colCount: ComputedRef<number>
  frozenWidth: ComputedRef<number>
  columnAt: (col: number) => DataGridColumn | undefined
  widthOf: (column: DataGridColumn) => number
  widthAt: (col: number) => number
  setWidth: (column: DataGridColumn, width: number) => void
  editable: (column: DataGridColumn) => boolean
  readonlyAt: (col: number) => boolean
  cellId: (row: number, col: number) => string
  frozen: (col: number) => 'start' | null
  frozenStyle: (col: number) => Record<string, string> | undefined
}

export function useDataGridCells(
  columns: MaybeRefOrGetter<DataGridColumn[]>,
  selectable: MaybeRefOrGetter<boolean>,
  frozenFirstColumn: MaybeRefOrGetter<boolean>,
  locked: MaybeRefOrGetter<boolean>,
  uid: string
): UseDataGridCellsReturn {
  const widths = ref<Record<string, number>>({})
  const offset = computed<number>(() => (toValue(selectable) ? 1 : 0))
  const colCount = computed<number>(() => toValue(columns).length + offset.value)
  const columnAt = (col: number): DataGridColumn | undefined => toValue(columns)[col - offset.value]
  const widthOf = (column: DataGridColumn): number => widths.value[column.id] ?? column.width ?? 160
  const editable = (column: DataGridColumn): boolean =>
    !toValue(locked) && column.editable !== false
  const widthAt = (col: number): number => {
    const column = columnAt(col)
    return column ? widthOf(column) : SELECT_WIDTH
  }
  const isFrozen = (col: number): boolean =>
    (toValue(selectable) && col === 0) || (toValue(frozenFirstColumn) && col === offset.value)

  return {
    widths: readonly(widths),
    widthsKey: computed<string>(() => JSON.stringify(widths.value)),
    offset,
    colCount,
    frozenWidth: computed<number>(
      () => offset.value * SELECT_WIDTH + (toValue(frozenFirstColumn) ? widthAt(offset.value) : 0)
    ),
    columnAt,
    widthOf,
    widthAt,
    setWidth: (column, width) => {
      widths.value = { ...widths.value, [column.id]: width }
    },
    editable,
    readonlyAt: (col) => {
      const column = columnAt(col)
      return column ? !editable(column) : false
    },
    cellId: (row, col) => `${uid}-r${row}-c${col}`,
    frozen: (col) => (isFrozen(col) ? 'start' : null),
    frozenStyle: (col) => {
      if (toValue(selectable) && col === 0) return { insetInlineStart: '0' }
      if (toValue(frozenFirstColumn) && col === offset.value)
        return { insetInlineStart: `${offset.value * SELECT_WIDTH}px` }
      return undefined
    }
  }
}
