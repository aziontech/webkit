import Table from './table.vue'
import TableBody from './table-body/table-body.vue'
import TableCaption from './table-caption/table-caption.vue'
import TableCell from './table-cell/table-cell.vue'
import TableFooter from './table-footer/table-footer.vue'
import TableHeadCell from './table-head-cell/table-head-cell.vue'
import TableHeader from './table-header/table-header.vue'
import TableRow from './table-row/table-row.vue'
import TableSortButton from './table-sort-button/table-sort-button.vue'
import TableToolbar from './table-toolbar/table-toolbar.vue'

type CompoundTable = typeof Table & {
  Header: typeof TableHeader
  Body: typeof TableBody
  Footer: typeof TableFooter
  Caption: typeof TableCaption
  Row: typeof TableRow
  HeadCell: typeof TableHeadCell
  Cell: typeof TableCell
  SortButton: typeof TableSortButton
  Toolbar: typeof TableToolbar
}

const TableRoot = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Caption: TableCaption,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  SortButton: TableSortButton,
  Toolbar: TableToolbar
}) as CompoundTable

export default TableRoot
export type { DropdownMenuItemValue } from '../../navigation/dropdown-menu/injection-key'
export type {
  TableAppliedFilter,
  TableCellSlotProps,
  TableCellSlots,
  TableColumn,
  TableDensity,
  TableExportButtonScope,
  TableExposed,
  TableFilterField,
  TableFilterType,
  TableHeaderSlotProps,
  TableHeaderSlots,
  TableStateSnapshot,
  TableToolbarSlotProps
} from './injection-key'
export type { TableProps } from './table.vue'
export type {
  TableCellAlign,
  TableCellFrozen,
  TableCellGrow,
  TableCellType
} from './table-cell/table-cell.vue'
export type { TableCellProps } from './table-cell/table-cell.vue'
export type { TableCellActionsProps } from './table-cell-actions/table-cell-actions.vue'
export type { TableCellIdProps } from './table-cell-id/table-cell-id.vue'
export type { TableCellLinkProps } from './table-cell-link/table-cell-link.vue'
export type { TableCellStatusProps } from './table-cell-status/table-cell-status.vue'
export type { TableCellTimeProps } from './table-cell-time/table-cell-time.vue'
export type { TableExportButtonProps } from './table-export-button/table-export-button.vue'
export type { TableFilterProps } from './table-filter/table-filter.vue'
export type {
  TableHeadCellAlign,
  TableHeadCellFrozen,
  TableHeadCellGrow,
  TableHeadCellType,
  TableSortDirection
} from './table-head-cell/table-head-cell.vue'
export type { TableHeadCellProps } from './table-head-cell/table-head-cell.vue'
export type { TableHeaderProps } from './table-header/table-header.vue'
export type { TableLiveButtonProps } from './table-live-button/table-live-button.vue'
export type { TableRefreshButtonProps } from './table-refresh-button/table-refresh-button.vue'
export type { TableRowProps } from './table-row/table-row.vue'
export type { TableSearchProps } from './table-search/table-search.vue'
export type { TableSortButtonProps } from './table-sort-button/table-sort-button.vue'
