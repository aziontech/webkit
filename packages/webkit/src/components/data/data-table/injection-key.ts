import type { InjectionKey, Ref, ShallowRef, Slot } from 'vue'

export interface ColumnDefinition {
  field: string
  header: string
  sortField?: string
  sortable?: boolean
  frozen?: boolean
  hiddenByDefault?: boolean
  filterField?: string
  type?: string
}

export interface FilterDefinition {
  field: string
  label: string
  value: unknown
  matchMode?: string
}

export interface EmptyBlockConfig {
  title?: string
  description?: string
  createButtonLabel?: string
  createPagePath?: string
  onClickCreate?: () => void
  documentationService?: (() => void) | null
}

export interface PageEvent {
  first: number
  rows: number
  page: number
  pageCount: number
}

export interface SortEvent {
  sortField: string
  sortOrder: number
}

export interface RowEditEvent {
  data: Record<string, unknown>
  newData: Record<string, unknown>
  field?: string
  index: number
  originalEvent?: unknown
}

export interface RowOrderingResult {
  from: number
  to: number
  reorderedData: Record<string, unknown>[]
}

export interface RegisteredColumn {
  field: string
  header: string
  sortField: string
  sortable: boolean
  frozen: boolean
  alignFrozen?: 'left' | 'right'
  style?: string
  hidden: boolean
  bodySlot?: Slot
  headerSlot?: Slot
}

export interface DataTableContext {
  testId: string
  dataKey: string
  hideHeader: boolean
  selectable: boolean
  rowHover: boolean
  showGridlines: boolean
  columns: ShallowRef<RegisteredColumn[]>
  registerColumn: (column: RegisteredColumn) => void
  unregisterColumn: (field: string) => void
  toggleColumnVisibility: (field: string, visible: boolean) => void
  isRowSelected: (row: Record<string, unknown>) => boolean
  toggleRowSelection: (row: Record<string, unknown>) => void
  toggleAllSelection: () => void
  isAllSelected: Ref<boolean>
  exportCSV: () => void
}

export const DataTableInjectionKey: InjectionKey<DataTableContext> = Symbol('DataTableContext')
