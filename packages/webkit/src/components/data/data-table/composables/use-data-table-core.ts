import type { Table as TanstackTable } from '@tanstack/vue-table'
import { computed, getCurrentInstance, type Ref, type Slots } from 'vue'

import type { TableAppliedFilter, TableColumn, TableDensity } from '../../table/injection-key'
import type { DataTableRecord, DataTableRow } from '../injection-key'
import { toColumnDefs } from '../lib/column-meta'
import { useDataTableEngine } from './use-data-table-engine'
import { type DataTableExportCsv, useDataTableExport } from './use-data-table-export'
import { useDataTableFilters, type UseDataTableFiltersReturn } from './use-data-table-filters'
import { useDataTablePaging, type UseDataTablePagingReturn } from './use-data-table-paging'
import { useDataTableRows, type UseDataTableRowsReturn } from './use-data-table-rows'
import {
  type DataTableStateModels,
  useDataTableState,
  type UseDataTableStateReturn
} from './use-data-table-state'

type RowPredicate = (row: DataTableRecord) => boolean

/** The root props the composables read, with the row type erased. */
export interface DataTableSettings {
  maxHeight: string
  bordered: boolean
  columns: TableColumn[]
  rowKey: string
  sortable: boolean
  selectable: boolean
  rowSelectable?: RowPredicate
  selectOnRowClick: boolean
  manualSorting: boolean
  manualFiltering: boolean
  loading: boolean
  error: string
  stackable: boolean
  wrapLines: boolean
  striped: boolean
  density: TableDensity
  virtual: boolean
  reorderable: boolean
  rowReorderable?: RowPredicate
  getSubRows?: (row: DataTableRecord) => DataTableRecord[] | undefined
}

/** The root events, with the row type erased. */
export interface DataTableEmits {
  rowClick: (event: MouseEvent | KeyboardEvent, row: DataTableRecord) => void
  rowRemove: (event: KeyboardEvent, row: DataTableRecord) => void
  filterApply: (event: Event, filters: TableAppliedFilter[]) => void
  filterRemove: (event: Event, filter: TableAppliedFilter) => void
  refresh: (event: Event) => void
  export: (event: Event, rows: DataTableRecord[]) => void
  reorder: (
    event: KeyboardEvent | PointerEvent,
    payload: { from: number; to: number; row: DataTableRecord }
  ) => void
}

export interface DataTableHost {
  props: DataTableSettings
  data: Ref<DataTableRecord[]>
  models: DataTableStateModels
  emit: DataTableEmits
  slots: Slots
}

export interface UseDataTableCoreReturn extends UseDataTableRowsReturn {
  state: UseDataTableStateReturn
  filters: UseDataTableFiltersReturn
  paging: UseDataTablePagingReturn
  table: TanstackTable<DataTableRecord>
  records: () => DataTableRecord[]
  lean: () => boolean
  tree: () => boolean
  rowKeyOf: (row: DataTableRecord) => string
  exportCsv: DataTableExportCsv
  hasListener: (name: string) => boolean
  setLeanSlice: (slice: () => DataTableRecord[]) => void
  activateRow: (event: MouseEvent | KeyboardEvent, row: DataTableRow) => void
}

interface LateBound {
  paging?: UseDataTablePagingReturn
  leanSlice?: () => DataTableRecord[]
}

interface CoreBase {
  state: UseDataTableStateReturn
  filters: UseDataTableFiltersReturn
  records: () => DataTableRecord[]
  rowKeyOf: (row: DataTableRecord) => string
  isSelectable: (row: DataTableRecord) => boolean
  lean: () => boolean
}

const createTable = (
  host: DataTableHost,
  base: CoreBase,
  late: LateBound
): TanstackTable<DataTableRecord> => {
  const { props } = host
  const columnDefs = computed(() => toColumnDefs(props.columns, props.sortable))
  return useDataTableEngine({
    data: () => (base.lean() && late.leanSlice ? late.leanSlice() : base.records()),
    columns: () => columnDefs.value,
    rowKeyOf: base.rowKeyOf,
    canSelect: (row) => props.selectable && base.isSelectable(row),
    subRowsOf: props.getSubRows ? (row) => props.getSubRows?.(row) : undefined,
    manualSorting: () => props.manualSorting,
    manualFiltering: () => props.manualFiltering,
    manualPagination: () => late.paging?.manualPagination() ?? true,
    rowCount: () => late.paging?.rowCount(),
    columnFilters: () => base.filters.columnFilters.value,
    writeSelectedKeys: (keys) => (host.models.selectedKeys.value = keys),
    writeOpenKeys: (keys) => (host.models.openKeys.value = keys),
    state: base.state
  })
}

const createBase = (host: DataTableHost, late: LateBound): CoreBase => {
  const { props } = host
  const state = useDataTableState(host.models)
  return {
    state,
    filters: useDataTableFilters({
      filters: state.filters,
      globalFilter: state.globalFilter,
      manual: () => props.manualFiltering,
      onApply: host.emit.filterApply,
      onRemove: host.emit.filterRemove
    }),
    records: () => host.data.value,
    rowKeyOf: (row) => String(row[props.rowKey] ?? ''),
    isSelectable: (row) => props.rowSelectable?.(row) ?? true,
    lean: () =>
      props.manualSorting &&
      props.manualFiltering &&
      (late.paging?.manualPagination() ?? true) &&
      !props.getSubRows
  }
}

export function useDataTableCore(host: DataTableHost): UseDataTableCoreReturn {
  const { props, emit } = host
  const instance = getCurrentInstance()
  const hasListener = (name: string): boolean =>
    Boolean((instance?.vnode.props as Record<string, unknown> | null | undefined)?.[name])
  const late: LateBound = {}
  const base = createBase(host, late)
  const { records, lean } = base
  const tree = (): boolean => Boolean(props.getSubRows)
  const table = createTable(host, base, late)
  const paging = useDataTablePaging({
    table,
    state: base.state,
    records,
    lean,
    footer: host.slots['footer']
  })
  late.paging = paging
  return {
    ...useDataTableRows({
      table,
      records,
      lean,
      tree,
      rowKeyOf: base.rowKeyOf,
      isSelectable: base.isSelectable,
      filtersRows: () => Boolean(props.rowSelectable)
    }),
    state: base.state,
    filters: base.filters,
    paging,
    table,
    records,
    lean,
    tree,
    rowKeyOf: base.rowKeyOf,
    exportCsv: useDataTableExport({
      table,
      records,
      lean,
      hasListener: () => hasListener('onExport'),
      emit: emit.export
    }),
    hasListener,
    setLeanSlice: (slice) => (late.leanSlice = slice),
    activateRow: (event, row) => {
      if (props.selectOnRowClick && props.selectable && row.getCanSelect()) row.toggleSelected()
      emit.rowClick(event, row.original)
    }
  }
}
