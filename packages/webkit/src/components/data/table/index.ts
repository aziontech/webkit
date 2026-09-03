// Compound API (see .claude/rules/compound-api.md). The explicit CompoundTable
// annotation makes declaration emit reference the sub-component types instead
// of expanding the root's private Props.
import Table from './table.vue'
import TableAppliedFilters from './table-applied-filters/table-applied-filters.vue'
import TableBody from './table-body/table-body.vue'
import TableCaption from './table-caption/table-caption.vue'
import TableCell from './table-cell/table-cell.vue'
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
