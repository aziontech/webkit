/**
 * Compound API — each sub-component stays available as its own import
 * (`@aziontech/webkit/data/table-header`, ...) and is also attached to the root
 * for dot-notation usage: `<Table.Header>`, `<Table.Row>`, `<Table.Cell>`, etc.
 *
 * This is a `.ts` file so vue-tsc generates the adjacent `index.d.ts`, giving
 * `<Table.Row>` full type-checking. `Object.assign` keeps one source of truth;
 * the explicit `CompoundTable` annotation lets declaration emit reference the
 * sub-component types instead of expanding the root's private `Props`.
 * See `.claude/rules/compound-api.md`.
 */
import Table from './table.vue'
import TableBody from './table-body/table-body.vue'
import TableCaption from './table-caption/table-caption.vue'
import TableCell from './table-cell/table-cell.vue'
import TableFooter from './table-footer/table-footer.vue'
import TableHeadCell from './table-head-cell/table-head-cell.vue'
import TableHeader from './table-header/table-header.vue'
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
  Search: TableSearch
}) as CompoundTable

export default TableRoot
