import type { Table as TanstackTable } from '@tanstack/vue-table'
import { computed, type ComputedRef } from 'vue'

import type { DataTableHeader, DataTableRecord, DataTableRow } from '../injection-key'

export interface DataTableRowsOptions {
  table: TanstackTable<DataTableRecord>
  records: () => DataTableRecord[]
  lean: () => boolean
  tree: () => boolean
  rowKeyOf: (row: DataTableRecord) => string
  isSelectable: (row: DataTableRecord) => boolean
  filtersRows: () => boolean
}

export interface UseDataTableRowsReturn {
  headers: ComputedRef<DataTableHeader[]>
  visibleColumnKey: ComputedRef<string>
  rows: ComputedRef<DataTableRow[]>
  orderedIds: ComputedRef<string[]>
  rowTotal: ComputedRef<number>
  rowIdAt: (index: number) => string
  rowIndexById: ComputedRef<Map<string, number>>
  selectedRows: ComputedRef<DataTableRecord[]>
  selectedCount: ComputedRef<number>
  pageSelection: ComputedRef<'all' | 'some' | 'none'>
  toggleAllPageRows: (value: boolean) => void
  clearSelection: () => void
}

type Selection = Pick<
  UseDataTableRowsReturn,
  'selectedRows' | 'selectedCount' | 'pageSelection' | 'toggleAllPageRows' | 'clearSelection'
>

const useSelection = (o: DataTableRowsOptions, sourceIds: ComputedRef<string[]>): Selection => {
  const { table } = o
  const selectableIds = computed<string[]>(() =>
    o.lean() && o.filtersRows()
      ? o.records().filter(o.isSelectable).map(o.rowKeyOf)
      : sourceIds.value
  )
  const selectedRows = computed<DataTableRecord[]>(() => {
    if (!o.lean()) {
      const model = table.getSelectedRowModel()
      return (o.tree() ? model.flatRows : model.rows).map((row) => row.original)
    }
    const selection = table.getState().rowSelection
    return o.records().filter((row) => selection[o.rowKeyOf(row)])
  })
  const selectedCount = computed<number>(() => selectedRows.value.length)
  const pageSelection = computed<'all' | 'some' | 'none'>(() => {
    const lean = o.lean()
    const all = lean
      ? selectedCount.value === selectableIds.value.length
      : table.getIsAllPageRowsSelected()
    const some = lean ? selectedCount.value > 0 : table.getIsSomePageRowsSelected()
    if (all && (some || !lean)) return 'all'
    return some ? 'some' : 'none'
  })
  const toggleAllPageRows = (value: boolean): void => {
    if (!o.lean()) return table.toggleAllPageRowsSelected(value)
    table.setRowSelection((current) => {
      const next = { ...current }
      for (const id of selectableIds.value) value ? (next[id] = true) : delete next[id]
      return next
    })
  }
  return {
    selectedRows,
    selectedCount,
    pageSelection,
    toggleAllPageRows,
    clearSelection: () => table.resetRowSelection()
  }
}

export function useDataTableRows(o: DataTableRowsOptions): UseDataTableRowsReturn {
  const { table } = o
  const headers = computed<DataTableHeader[]>(() => table.getHeaderGroups()[0]?.headers ?? [])
  const rows = computed<DataTableRow[]>(() => table.getRowModel().rows)
  const sourceIds = computed<string[]>(() => (o.lean() ? o.records().map(o.rowKeyOf) : []))
  const orderedIds = computed<string[]>(() =>
    o.lean() ? sourceIds.value : rows.value.map((row) => row.id)
  )
  const rowTotal = computed<number>(() => (o.lean() ? o.records().length : rows.value.length))
  return {
    headers,
    visibleColumnKey: computed<string>(() => headers.value.map((h) => h.id).join('|')),
    rows,
    orderedIds,
    rowTotal,
    rowIdAt: (index) => (o.lean() ? (sourceIds.value[index] ?? '') : (rows.value[index]?.id ?? '')),
    rowIndexById: computed<Map<string, number>>(
      () => new Map(orderedIds.value.map((id, index) => [id, index]))
    ),
    ...useSelection(o, sourceIds)
  }
}
