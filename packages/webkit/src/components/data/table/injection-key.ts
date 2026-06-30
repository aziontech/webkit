import type { Table as TanstackTable } from '@tanstack/vue-table'
import type { ComputedRef, InjectionKey } from 'vue'

export type TableRowRecord = Record<string, unknown>

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
}

export const TableInjectionKey: InjectionKey<TableContext> = Symbol('TableContext')

export interface TableRowGroupContext {
  /** Body rows highlight on hover; header/footer rows do not. */
  hoverable: boolean
  /** Compact density: header cells shrink their height and padding. Set by a compact TableHeader. */
  compact?: boolean
}

export const TableRowGroupKey: InjectionKey<TableRowGroupContext> = Symbol('TableRowGroupContext')
