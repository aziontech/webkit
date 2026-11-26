import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Table as TanstackTable,
  type TableOptions,
  useVueTable
} from '@tanstack/vue-table'

import type { DataTableRecord } from '../injection-key'
import { applyUpdater, keysToRecord, recordToKeys } from '../lib/table-state'
import type { UseDataTableStateReturn } from './use-data-table-state'

export interface DataTableEngineOptions {
  data: () => DataTableRecord[]
  columns: () => ColumnDef<DataTableRecord>[]
  rowKeyOf: (row: DataTableRecord) => string
  canSelect: (row: DataTableRecord) => boolean
  subRowsOf?: (row: DataTableRecord) => DataTableRecord[] | undefined
  manualSorting: () => boolean
  manualFiltering: () => boolean
  manualPagination: () => boolean
  rowCount: () => number | undefined
  columnFilters: () => ColumnFiltersState
  writeSelectedKeys: (keys: string[]) => void
  writeOpenKeys: (keys: string[]) => void
  state: UseDataTableStateReturn
}

type Options = TableOptions<DataTableRecord>

const stateOf = (o: DataTableEngineOptions): Options['state'] => {
  const s = o.state
  return {
    get sorting() {
      return s.sorting.value.value
    },
    get rowSelection() {
      return s.rowSelection.value.value
    },
    get columnVisibility() {
      return s.columnVisibility.value.value
    },
    get globalFilter() {
      return s.globalFilter.value.value
    },
    get pagination() {
      return s.pagination.value.value
    },
    get columnFilters() {
      return o.columnFilters()
    },
    get columnOrder() {
      return s.columnOrder.value.value
    },
    get expanded() {
      return s.expanded.value.value
    }
  }
}

const handlersOf = (
  o: DataTableEngineOptions,
  table: () => TanstackTable<DataTableRecord> | null
): Partial<Options> => {
  const s = o.state
  return {
    onSortingChange: (updater) => s.sorting.set(applyUpdater(updater, s.sorting.value.value)),
    onRowSelectionChange: (updater) => {
      const next = applyUpdater(updater, s.rowSelection.value.value)
      s.rowSelection.set(next)
      o.writeSelectedKeys(recordToKeys(next))
    },
    onColumnVisibilityChange: (updater) =>
      s.columnVisibility.set(applyUpdater(updater, s.columnVisibility.value.value)),
    onGlobalFilterChange: (updater) =>
      s.globalFilter.set(applyUpdater(updater, s.globalFilter.value.value)),
    onPaginationChange: (updater) =>
      s.writePagination(applyUpdater(updater, s.pagination.value.value)),
    onColumnFiltersChange: () => {},
    onColumnOrderChange: (updater) =>
      s.columnOrder.set(applyUpdater(updater, s.columnOrder.value.value)),
    onExpandedChange: (updater) => {
      const applied = applyUpdater<ExpandedState>(updater, s.expanded.value.value)
      const next =
        applied === true
          ? keysToRecord(
              table()
                ?.getCoreRowModel()
                .flatRows.map((row) => row.id) ?? []
            )
          : applied
      s.expanded.set(next)
      o.writeOpenKeys(recordToKeys(next))
    }
  }
}

export function useDataTableEngine(o: DataTableEngineOptions): TanstackTable<DataTableRecord> {
  let created: TanstackTable<DataTableRecord> | null = null
  const table = useVueTable<DataTableRecord>({
    get data() {
      return o.data()
    },
    get columns() {
      return o.columns()
    },
    state: stateOf(o),
    getSubRows: o.subRowsOf,
    enableSubRowSelection: false,
    getRowId: (row) => o.rowKeyOf(row),
    enableRowSelection: (row) => o.canSelect(row.original),
    get manualSorting() {
      return o.manualSorting()
    },
    get manualPagination() {
      return o.manualPagination()
    },
    get manualFiltering() {
      return o.manualFiltering()
    },
    get rowCount() {
      return o.rowCount()
    },
    ...handlersOf(o, () => created),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: o.subRowsOf ? getExpandedRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel()
  })
  created = table
  return table
}
