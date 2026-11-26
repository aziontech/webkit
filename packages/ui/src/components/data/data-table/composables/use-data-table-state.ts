import type {
  ColumnOrderState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/vue-table'
import { computed, type ComputedRef, type Ref, shallowRef, watch } from 'vue'

import type { TableAppliedFilter, TableStateSnapshot } from '../../table/injection-key'
import { keysToRecord } from '../lib/table-state'

export interface DataTableStateModels {
  sorting: Ref<SortingState | undefined>
  selectedKeys: Ref<string[] | undefined>
  columnVisibility: Ref<VisibilityState | undefined>
  openKeys: Ref<string[] | undefined>
}

/** One piece of table state: read it through `value`, write it through `set`. */
export interface DataTableCell<T> {
  value: ComputedRef<T>
  set: (next: T) => void
}

export interface UseDataTableStateReturn {
  sorting: DataTableCell<SortingState>
  rowSelection: DataTableCell<RowSelectionState>
  columnVisibility: DataTableCell<VisibilityState>
  globalFilter: DataTableCell<string>
  pagination: DataTableCell<PaginationState>
  writePagination: (next: PaginationState) => void
  columnOrder: DataTableCell<ColumnOrderState>
  filters: DataTableCell<TableAppliedFilter[]>
  expanded: DataTableCell<Record<string, boolean>>
  live: DataTableCell<boolean>
  getSnapshot: () => TableStateSnapshot
  setSnapshot: (next: Partial<TableStateSnapshot>) => void
}

const DEFAULT_PAGE_SIZE = 10

const cell = <T>(initial: T): DataTableCell<T> & { raw: Ref<T> } => {
  const raw: Ref<T> = shallowRef(initial)
  return { raw, value: computed(() => raw.value), set: (next) => (raw.value = next) }
}

const modelCell = <T>(model: Ref<T | undefined>, fallback: T): DataTableCell<T> => {
  const own = cell<T>(model.value ?? fallback)
  watch(model, (v) => v !== undefined && own.set(v))
  return {
    value: computed(() => model.value ?? own.value.value),
    set: (next) => {
      own.set(next)
      model.value = next
    }
  }
}

const keyCell = (model: Ref<string[] | undefined>): DataTableCell<Record<string, boolean>> => {
  const own = cell<Record<string, boolean>>(keysToRecord(model.value ?? []))
  watch(model, (v) => v !== undefined && own.set(keysToRecord(v)))
  return { value: own.value, set: own.set }
}

type SnapshotState = Omit<UseDataTableStateReturn, 'getSnapshot' | 'setSnapshot'>

const writePage = (s: SnapshotState, next: Partial<TableStateSnapshot>): void => {
  if (next.page === undefined && next.pageSize === undefined) return
  s.pagination.set({
    pageIndex: (next.page ?? 1) - 1,
    pageSize: next.pageSize ?? s.pagination.value.value.pageSize
  })
}

const createSnapshot = (
  s: SnapshotState
): Pick<UseDataTableStateReturn, 'getSnapshot' | 'setSnapshot'> => ({
  getSnapshot: () =>
    JSON.parse(
      JSON.stringify({
        sorting: s.sorting.value.value,
        page: s.pagination.value.value.pageIndex + 1,
        pageSize: s.pagination.value.value.pageSize,
        columnVisibility: s.columnVisibility.value.value,
        columnOrder: s.columnOrder.value.value,
        globalFilter: s.globalFilter.value.value,
        filters: s.filters.value.value
      })
    ) as TableStateSnapshot,
  setSnapshot: (next) => {
    if (next.sorting !== undefined) s.sorting.set(next.sorting)
    writePage(s, next)
    if (next.columnVisibility !== undefined) s.columnVisibility.set(next.columnVisibility)
    if (next.columnOrder !== undefined) s.columnOrder.set(next.columnOrder)
    if (next.globalFilter !== undefined) s.globalFilter.set(next.globalFilter)
    if (next.filters !== undefined) s.filters.set(next.filters)
  }
})

export function useDataTableState(models: DataTableStateModels): UseDataTableStateReturn {
  const pagination = cell<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })
  const state: SnapshotState = {
    sorting: modelCell(models.sorting, []),
    rowSelection: keyCell(models.selectedKeys),
    columnVisibility: modelCell(models.columnVisibility, {}),
    globalFilter: cell(''),
    pagination,
    writePagination: (next) =>
      pagination.set(
        next.pageSize === pagination.value.value.pageSize
          ? next
          : { pageIndex: 0, pageSize: next.pageSize }
      ),
    columnOrder: cell<ColumnOrderState>([]),
    filters: cell<TableAppliedFilter[]>([]),
    expanded: keyCell(models.openKeys),
    live: cell(false)
  }
  return { ...state, ...createSnapshot(state) }
}
