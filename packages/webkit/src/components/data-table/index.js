import DataTableRoot from './data-table.vue'
import DataTableHeader from './data-table-header.vue'
import DataTableActions from './data-table-actions.vue'
import DataTableSearch from './data-table-search.vue'
import DataTableExport from './data-table-export.vue'
import DataTableColumnSelector from './data-table-column-selector.vue'
import DataTableFilter from './data-table-filter.vue'
import DataTableAppliedFilters from './data-table-applied-filters.vue'
import DataTableRowActions from './data-table-row-actions.vue'
import DataTableLastModifiedPopup from './data-table-last-modified-popup.vue'
import DataTableViewToggle from './data-table-view-toggle.vue'
import DataTablePositionInput from './data-table-position-input.vue'
import DataTableReviewChanges from './data-table-review-changes.vue'
import DataTableBreadcrumb from './data-table-breadcrumb.vue'
import DataTableInlineCreate from './data-table-inline-create.vue'
import DataTableBatchActions from './data-table-batch-actions.vue'
import DataTableViewAllFooter from './data-table-view-all-footer.vue'
import DataTableRefreshButton from './data-table-refresh-button.vue'
import PrimeColumn from 'primevue/column'

const DataTable = DataTableRoot

DataTable.Header = DataTableHeader
DataTable.Actions = DataTableActions
DataTable.Search = DataTableSearch
DataTable.Export = DataTableExport
DataTable.ColumnSelector = DataTableColumnSelector
DataTable.Filter = DataTableFilter
DataTable.AppliedFilters = DataTableAppliedFilters
DataTable.RowActions = DataTableRowActions
DataTable.LastModifiedPopup = DataTableLastModifiedPopup
DataTable.Column = PrimeColumn
DataTable.ViewToggle = DataTableViewToggle
DataTable.PositionInput = DataTablePositionInput
DataTable.ReviewChanges = DataTableReviewChanges
DataTable.Breadcrumb = DataTableBreadcrumb
DataTable.InlineCreate = DataTableInlineCreate
DataTable.BatchActions = DataTableBatchActions
DataTable.ViewAllFooter = DataTableViewAllFooter
DataTable.RefreshButton = DataTableRefreshButton

DataTable.install = (app) => {
  app.component('DataTable', DataTableRoot)
  app.component('DataTableHeader', DataTableHeader)
  app.component('DataTableActions', DataTableActions)
  app.component('DataTableSearch', DataTableSearch)
  app.component('DataTableExport', DataTableExport)
  app.component('DataTableColumnSelector', DataTableColumnSelector)
  app.component('DataTableFilter', DataTableFilter)
  app.component('DataTableAppliedFilters', DataTableAppliedFilters)
  app.component('DataTableRowActions', DataTableRowActions)
  app.component('DataTableLastModifiedPopup', DataTableLastModifiedPopup)
  app.component('DataTableViewToggle', DataTableViewToggle)
  app.component('DataTablePositionInput', DataTablePositionInput)
  app.component('DataTableReviewChanges', DataTableReviewChanges)
  app.component('DataTableBreadcrumb', DataTableBreadcrumb)
  app.component('DataTableInlineCreate', DataTableInlineCreate)
  app.component('DataTableBatchActions', DataTableBatchActions)
  app.component('DataTableViewAllFooter', DataTableViewAllFooter)
  app.component('DataTableRefreshButton', DataTableRefreshButton)
}

export default DataTable

export {
  DataTableRoot,
  DataTableHeader,
  DataTableActions,
  DataTableSearch,
  DataTableExport,
  DataTableColumnSelector,
  DataTableFilter,
  DataTableAppliedFilters,
  DataTableRowActions,
  DataTableLastModifiedPopup,
  DataTableViewToggle,
  DataTablePositionInput,
  DataTableReviewChanges,
  DataTableBreadcrumb,
  DataTableInlineCreate,
  DataTableBatchActions,
  DataTableViewAllFooter,
  DataTableRefreshButton,
  PrimeColumn as DataTableColumn
}
