import type {
  Column,
  ColumnOrderState,
  PaginationState,
  SortingState,
  Table as TanstackTable,
  VisibilityState
} from '@tanstack/vue-table'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type TableRowRecord = Record<string, unknown>

/** Comparison operators offered by the built-in filter builder. */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'not-contains'
  | 'starts-with'
  | 'ends-with'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'not-in'
  | 'is-empty'
  | 'is-not-empty'

/** A filterable value; arrays back the `in` / `not-in` (multi-select) operators. */
export type FilterValue = string | number | boolean | Array<string | number>

/** One field the built-in `Table.Filter` builder can filter on. */
export interface FilterField {
  /** Matches a column id / accessorKey so client-side filtering can target the column. */
  id: string
  label: string
  type: 'text' | 'number' | 'select' | 'multi-select' | 'boolean' | 'date'
  /** Allowed operators; defaults are derived from `type` when omitted. */
  operators?: FilterOperator[]
  /** Options for `select` / `multi-select` fields. */
  options?: { label: string; value: string | number | boolean }[]
}

/** One committed filter condition (a chip). */
export interface AppliedFilter {
  field: string
  operator: FilterOperator
  value: FilterValue
  /** Chip label override; otherwise formatted from field + operator + value. */
  label?: string
}

/** JSON-serializable snapshot of every table concern; every field optional for partial restore. */
export interface TableStateSnapshot {
  sorting?: SortingState
  pagination?: PaginationState
  columnVisibility?: VisibilityState
  columnOrder?: ColumnOrderState
  globalFilter?: string
  filters?: AppliedFilter[]
}

/** Imperative API a Table template ref exposes; type the ref with it, as a generic component has no InstanceType. */
export interface TableExposed<TRecord extends object = TableRowRecord> {
  /** Emits refresh so the app refetches; no-op while loading. */
  reload: () => void
  /** Clears the structured filters and the global search text. */
  clearFilters: () => void
  /** Writes the visible, ordered columns of the chosen rows to a CSV download, or emits export when it is bound. */
  exportCsv: (options?: {
    filename?: string
    scope?: 'page' | 'filtered' | 'all'
    rows?: TRecord[]
  }) => Promise<void>
  /** Deep-cloned snapshot of sorting, pagination, column visibility and order, search and filters. */
  getState: () => TableStateSnapshot
  /** Writes the given concerns back through the same models that back v-model:state. */
  setState: (next: Partial<TableStateSnapshot>) => void
}

export interface TableContext {
  /** Root data-testid; sub-components derive BEM-suffixed ids from it. */
  testId: string
  /** TanStack table instance in data-driven mode; null in composition mode. */
  table: ComputedRef<TanstackTable<TableRowRecord> | null>
  /** Records of the currently-selected rows (data-driven mode). */
  selectedRows: ComputedRef<TableRowRecord[]>
  /** Count of selected rows. */
  selectedCount: ComputedRef<number>
  /** Clears the current row selection. */
  clearSelection: () => void
  /** Loading flag (data-driven); toolbar controls reflect it. */
  loading: ComputedRef<boolean>
  /** Field catalog the built-in filter builder offers (falls back to Table.Filter's own `fields`). */
  filterFields: ComputedRef<FilterField[]>
  /** Committed structured filters (backs the `filters` model). */
  appliedFilters: ComputedRef<AppliedFilter[]>
  /** Replace the committed filter set (Apply). */
  applyFilters: (filters: AppliedFilter[]) => void
  /** Remove one committed filter. */
  removeFilter: (filter: AppliedFilter) => void
  /** Clear structured filters and the global search text. */
  clearFilters: () => void
  /** Filter the user asked to edit; Table.Filter watches this to re-open pre-filled. */
  editingFilter: Ref<AppliedFilter | null>
  /** Request editing a committed filter (sets `editingFilter`). */
  editFilter: (filter: AppliedFilter) => void
  /** Serialize the visible/ordered columns + filtered rows to CSV and download (or emit `export`). */
  exportCsv: (options?: {
    filename?: string
    scope?: 'page' | 'filtered' | 'all'
    rows?: Record<string, unknown>[]
  }) => Promise<void>
  /** Signal a refresh; the root emits `refresh` (the app refetches). */
  reload: () => void
  /** Id a `TableCaption` takes, so the table is labelled by it (`aria-labelledby`). */
  captionId?: string
  /** A `TableCaption` registers while mounted; returns the unregister function. */
  registerCaption?: () => () => void
}

export const TableInjectionKey: InjectionKey<TableContext> = Symbol('TableContext')

export interface TableRowGroupContext {
  /** Body rows highlight on hover; header/footer rows do not. */
  hoverable: boolean
  /** Compact density: header cells shrink their height and padding. Set by a compact TableHeader. */
  compact?: boolean
}

export const TableRowGroupKey: InjectionKey<TableRowGroupContext> = Symbol('TableRowGroupContext')

export interface TableColumn {
  /** Column id; falls back to accessorKey. */
  id?: string
  /** Field read from each row record. */
  accessorKey?: string
  /** Header label (overridden by a `header-<id>` slot). */
  header?: string
  /** Allow sorting on this column. */
  enableSorting?: boolean
  /** Flex weight; the principal column uses 2 (see `principal`). */
  grow?: 1 | 2 | 3
  /** Mark this as the principal column — it defaults to `grow: 2`. When no column sets it, the first non-checkbox column is principal. */
  principal?: boolean
  /** Pin this column to the start or end edge. */
  frozen?: 'start' | 'end'
  /** Fixed width (px) — needed for a frozen column that precedes another frozen column on the same edge, so sticky offsets can be summed. */
  width?: number
  /** Minimum width (px). The column resolves to the widest of this floor and its own content (its header, with the sort affordance, and every rendered cell) — one width for the whole column, so a chip column reserves nothing it is not using and never clips a chip. `width` wins when both are set. */
  minWidth?: number
  /** Cell alignment. */
  align?: 'start' | 'center' | 'end'
  /** Body cell kind (action renders a 40px trailing cell, auto-pinned to the right edge). */
  kind?: 'default' | 'action'
  /** Allow drag-to-resize on this column's header (ignored for frozen/action columns). */
  resizable?: boolean
  /** Column-selector label when `header` is not a string. */
  label?: string
  /** Exclude from Table.ColumnSelector (defaults true; action columns default false). */
  hideable?: boolean
  /** Opt this column into columnOrder serialization. */
  orderable?: boolean
}

/** Scope of a data-driven cell slot named cell- plus the column id. */
export type TableCellSlotProps<TRecord, TValue> = {
  /** The row record, typed from the data prop. */
  row: TRecord
  /** The cell value, read through the column accessorKey. */
  value: TValue
}

/** Scope of a data-driven header slot named header- plus the column id. */
export type TableHeaderSlotProps<TRecord> = {
  /** The TanStack column. */
  column: Column<TRecord, unknown>
}

/** Scope of the toolbar and filters slots. */
export type TableToolbarSlotProps<TRecord> = {
  /** The TanStack table instance in data-driven mode; undefined in composition mode. */
  table: TanstackTable<TRecord> | undefined
  /** Records of the selected rows. */
  selectedRows: TRecord[]
  /** Number of selected rows. */
  selectedCount: number
  /** Clears the row selection. */
  clearSelection: () => void
  /** Mirrors the loading prop. */
  loading: boolean
}

/** Data-driven cell slots: a column whose id is a field of the row gets that field's type as value. */
export type TableCellSlots<TRecord> = {
  [K in keyof TRecord & string as `cell-${K}`]?: (
    props: TableCellSlotProps<TRecord, TRecord[K]>
  ) => unknown
} & {
  [name: `cell-${string}`]: (props: TableCellSlotProps<TRecord, unknown>) => unknown
}

/** Data-driven header slots, one per column id. */
export type TableHeaderSlots<TRecord> = {
  [name: `header-${string}`]: (props: TableHeaderSlotProps<TRecord>) => unknown
}
