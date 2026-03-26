export interface ColumnDefinition {
  field: string
  header: string
  sortField?: string
  sortable?: boolean
  frozen?: boolean
  hiddenByDefault?: boolean
  component?: any
  filterField?: string
  type?: string
}

export interface FilterDefinition {
  field: string
  label: string
  value: any
  matchMode?: string
}

export interface ActionDefinition {
  label: string
  icon?: string
  command?: (rowData: any) => void
  disabled?: boolean | ((rowData: any) => boolean)
  visible?: boolean | ((rowData: any) => boolean)
  separator?: boolean
  severity?: string
}

export interface EmptyBlockConfig {
  title?: string
  description?: string
  createButtonLabel?: string
  createPagePath?: string
  onClickCreate?: () => void
  documentationService?: string
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
  data: any
  newData: any
  field?: string
  index: number
  originalEvent?: Event
}

export interface BatchAction {
  label: string
  icon?: string
  command: () => void
  severity?: string
}

export interface BreadcrumbSegment {
  label: string
  path: string
}

export interface ViewMode {
  label: string
  value: string
}

export interface PositionLimits {
  min: number
  max: number
}

export interface RowOrderingResult {
  from: number
  to: number
  reorderedData: any[]
}
