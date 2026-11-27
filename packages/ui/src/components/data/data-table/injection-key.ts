import type { Header, Row } from '@tanstack/vue-table'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { DataTableView } from './composables/use-data-table-view'

export type DataTableRecord = Record<string, unknown>
export type DataTableRow = Row<DataTableRecord>
export type DataTableHeader = Header<DataTableRecord, unknown>

/** Settings DataTablePagination hands the table while it is mounted. */
export interface DataTablePagingOptions {
  /** The app pages the rows itself; the table renders `data` as one page. */
  manual: boolean
  /** Total row count of a manual table. */
  total?: number
}

/** Paging state DataTablePagination reads and drives. */
export interface DataTablePagingContext {
  /** A pagination part is mounted. */
  active: ComputedRef<boolean>
  /** Current page, 1-based. */
  page: ComputedRef<number>
  /** Rows per page. */
  pageSize: ComputedRef<number>
  /** Rows across every page. */
  total: ComputedRef<number>
  /** Moves to a page, 1-based. */
  setPage: (page: number) => void
  /** Changes the page size and returns to the first page. */
  setPageSize: (size: number) => void
  /** Registers the part's settings while it is mounted; returns the unregister function. */
  register: (options: () => DataTablePagingOptions) => () => void
}

/** Load-more state DataTableLoadMore reads and drives. */
export interface DataTableLoadMoreContext {
  /** Rows the table renders; the part hides while there are none. */
  rowTotal: ComputedRef<number>
  /** The first rows of a long list are still mounting; the part waits for them. */
  lazy: ComputedRef<boolean>
  /** The next rows are loading; the grid reports itself busy. */
  loading: Readonly<Ref<boolean>>
  /** Marks the next rows as loading. */
  setLoading: (loading: boolean) => void
}

/** What the toolbar band and the filters band render from. */
export interface DataTableToolbarContext {
  /** Scope of the toolbar and filters slots. */
  scope: ComputedRef<Record<string, unknown>>
  /** Committed structured filters; the filters band shows while there are some. */
  filterCount: ComputedRef<number>
}

/** Column layout values one body or skeleton cell reads. */
export interface DataTableColumnView {
  type: 'default' | 'action'
  grow: 1 | 2 | 3
  align: 'start' | 'center' | 'end'
  frozen: 'start' | 'end' | undefined
  style: Record<string, string> | undefined
  cellClass: string | undefined
  stackedField: boolean
  principal: boolean
}

/** The grip column of a reorderable table. */
export interface DataTableReorderView {
  active: ComputedRef<boolean>
  locked: ComputedRef<boolean>
  frozen: ComputedRef<boolean>
  hintId: string
  message: ComputedRef<string>
  dragId: Ref<string | null>
  orderedCount: ComputedRef<number>
  dropOf: (id: string) => 'before' | 'after' | undefined
  canMove: (id: string) => boolean
  labelOf: (id: string, index: number) => string
  onKeydown: (event: KeyboardEvent, id: string) => void
  onPointerdown: (event: PointerEvent, id: string) => void
  onPointermove: (event: PointerEvent) => void
  onPointerup: (event: PointerEvent) => void
  onPointercancel: () => void
}

export interface DataTableContext {
  /** Paging state; DataTablePagination drives it. */
  paging: DataTablePagingContext
  /** Load-more state; DataTableLoadMore drives it. */
  loadMore: DataTableLoadMoreContext
  /** Root data-testid. */
  testId: ComputedRef<string>
  /** The table is loading its first rows. */
  loading: ComputedRef<boolean>
  /** The toolbar and filters bands. */
  toolbar: DataTableToolbarContext
  /** What the private parts render from. */
  view: DataTableView
}

export const DataTableInjectionKey: InjectionKey<DataTableContext> = Symbol('DataTable')
