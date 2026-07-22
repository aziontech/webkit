import type {
  ColumnOrderState,
  PaginationState,
  SortingState,
  Table as TanstackTable,
  VisibilityState
} from '@tanstack/vue-table'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type TableRowRecord = Record<string, unknown>

// ---- Structured filter model (Table.Filter / Table.AppliedFilters) ----

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

// ---- Serializable aggregate state (v-model:state / getState / setState) ----

/** JSON-serializable snapshot of every table concern; every field optional for partial restore. */
export interface TableStateSnapshot {
  sorting?: SortingState
  pagination?: PaginationState
  columnVisibility?: VisibilityState
  columnOrder?: ColumnOrderState
  globalFilter?: string
  filters?: AppliedFilter[]
}

// ---- Injected table context ----

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
  exportCsv: (options?: { filename?: string; scope?: 'page' | 'filtered' | 'all' }) => void
  /** Signal a refresh; the root emits `refresh` (the app refetches). */
  reload: () => void
}

export const TableInjectionKey: InjectionKey<TableContext> = Symbol('TableContext')

export interface TableRowGroupContext {
  /** Body rows highlight on hover; header/footer rows do not. */
  hoverable: boolean
  /** Compact density: header cells shrink their height and padding. Set by a compact TableHeader. */
  compact?: boolean
}

export const TableRowGroupKey: InjectionKey<TableRowGroupContext> = Symbol('TableRowGroupContext')
