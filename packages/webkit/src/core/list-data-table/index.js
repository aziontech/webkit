import ListDataTableComponent from './components/list-data-table/list-data-table.vue'
import ListDataTableHeaderComponent from './components/list-data-table-header/list-data-table-header.vue'
import ListDataTableActionsComponent from './components/list-data-table-actions/list-data-table-actions.vue'
import ListDataTableSearchComponent from './components/list-data-table-search/list-data-table-search.vue'
import ListDataTableExportComponent from './components/list-data-table-export/list-data-table-export.vue'
import ListDataTableRowActionsComponent from './components/list-data-table-row-actions/list-data-table-row-actions.vue'
import ListDataTableColumnSelectorComponent from './components/list-data-table-column-selector/list-data-table-column-selector.vue'
import ListDataTableFilterComponent from './components/list-data-table-filter/list-data-table-filter.vue'
import ListDataTableAppliedFiltersComponent from './components/list-data-table-applied-filters/list-data-table-applied-filters.vue'
import LastModifiedPopupComponent from './components/list-data-table-last-modified-popup/list-data-table-last-modified-popup.vue'
import Column from 'primevue/column'

// Cells
import CellDisplayComponent from './cells/cell-display/cell-display.vue'
import CellClipboardComponent from './cells/cell-clipboard/cell-clipboard.vue'
import CellExpandComponent from './cells/cell-expand/cell-expand.vue'
import CountryFlagComponent from './cells/country-flag/country-flag.vue'

const ListDataTable = ListDataTableComponent

// Sub-components (compound pattern)
ListDataTable.Header = ListDataTableHeaderComponent
ListDataTable.Actions = ListDataTableActionsComponent
ListDataTable.Search = ListDataTableSearchComponent
ListDataTable.Export = ListDataTableExportComponent
ListDataTable.RowActions = ListDataTableRowActionsComponent
ListDataTable.ColumnSelector = ListDataTableColumnSelectorComponent
ListDataTable.Filter = ListDataTableFilterComponent
ListDataTable.AppliedFilters = ListDataTableAppliedFiltersComponent
ListDataTable.LastModifiedPopup = LastModifiedPopupComponent
ListDataTable.Column = Column

// Cells (available as ListDataTable.Cell*)
ListDataTable.CellDisplay = CellDisplayComponent
ListDataTable.CellClipboard = CellClipboardComponent
ListDataTable.CellExpand = CellExpandComponent
ListDataTable.CountryFlag = CountryFlagComponent

export default ListDataTable

export {
  ListDataTableComponent as ListDataTable,
  ListDataTableHeaderComponent as ListDataTableHeader,
  ListDataTableActionsComponent as ListDataTableActions,
  ListDataTableSearchComponent as ListDataTableSearch,
  ListDataTableExportComponent as ListDataTableExport,
  ListDataTableRowActionsComponent as ListDataTableRowActions,
  ListDataTableColumnSelectorComponent as ListDataTableColumnSelector,
  ListDataTableFilterComponent as ListDataTableFilter,
  ListDataTableAppliedFiltersComponent as ListDataTableAppliedFilters,
  LastModifiedPopupComponent as LastModifiedPopup,
  Column as ListDataTableColumn,
  CellDisplayComponent as CellDisplay,
  CellClipboardComponent as CellClipboard,
  CellExpandComponent as CellExpand,
  CountryFlagComponent as CountryFlag
}
