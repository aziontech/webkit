import Table from './table.vue'
import TableAppliedFilters from './table-applied-filters/table-applied-filters.vue'
import TableBody from './table-body/table-body.vue'
import TableCaption from './table-caption/table-caption.vue'
import TableCell from './table-cell/table-cell.vue'
import TableCellActions from './table-cell-actions/table-cell-actions.vue'
import TableCellId from './table-cell-id/table-cell-id.vue'
import TableCellLink from './table-cell-link/table-cell-link.vue'
import TableCellStatus from './table-cell-status/table-cell-status.vue'
import TableCellTags from './table-cell-tags/table-cell-tags.vue'
import TableCellTime from './table-cell-time/table-cell-time.vue'
import TableColumnSelector from './table-column-selector/table-column-selector.vue'
import TableExport from './table-export/table-export.vue'
import TableFilter from './table-filter/table-filter.vue'
import TableFooter from './table-footer/table-footer.vue'
import TableHeadCell from './table-head-cell/table-head-cell.vue'
import TableHeader from './table-header/table-header.vue'
import TableRefreshButton from './table-refresh-button/table-refresh-button.vue'
import TableRow from './table-row/table-row.vue'
import TableSearch from './table-search/table-search.vue'
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
  CellStatus: typeof TableCellStatus
  CellLink: typeof TableCellLink
  CellId: typeof TableCellId
  CellTime: typeof TableCellTime
  CellTags: typeof TableCellTags
  CellActions: typeof TableCellActions
  SortButton: typeof TableSortButton
  Toolbar: typeof TableToolbar
  Search: typeof TableSearch
  Filter: typeof TableFilter
  AppliedFilters: typeof TableAppliedFilters
  ColumnSelector: typeof TableColumnSelector
  Export: typeof TableExport
  RefreshButton: typeof TableRefreshButton
}

const TableRoot = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Caption: TableCaption,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  CellStatus: TableCellStatus,
  CellLink: TableCellLink,
  CellId: TableCellId,
  CellTime: TableCellTime,
  CellTags: TableCellTags,
  CellActions: TableCellActions,
  SortButton: TableSortButton,
  Toolbar: TableToolbar,
  Search: TableSearch,
  Filter: TableFilter,
  AppliedFilters: TableAppliedFilters,
  ColumnSelector: TableColumnSelector,
  Export: TableExport,
  RefreshButton: TableRefreshButton
}) as CompoundTable

export default TableRoot
