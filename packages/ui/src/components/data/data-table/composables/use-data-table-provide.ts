import { computed, type ComputedRef, provide, readonly, ref } from 'vue'

import { type TableContext, type TableExposed, TableInjectionKey } from '../../table/injection-key'
import {
  type DataTableContext,
  DataTableInjectionKey,
  type DataTableRecord
} from '../injection-key'
import type { DataTableHost, UseDataTableCoreReturn } from './use-data-table-core'
import type { DataTableView } from './use-data-table-view'

export interface DataTableProvideHost extends DataTableHost {
  core: UseDataTableCoreReturn
  view: DataTableView
  testId: ComputedRef<string>
  captionId: string
  registerCaption: () => () => void
}

export interface UseDataTableProvideReturn {
  exposed: TableExposed<DataTableRecord>
  toolbarScope: ComputedRef<Record<string, unknown>>
}

const tableContext = (
  host: DataTableProvideHost,
  reload: (event?: Event) => void
): TableContext => {
  const { core } = host
  const { filters, state } = core
  return {
    testId: host.testId.value,
    table: computed(() => core.table),
    selectedRows: core.selectedRows,
    selectedCount: core.selectedCount,
    clearSelection: core.clearSelection,
    loading: computed(() => host.props.loading),
    live: state.live.value,
    setLive: state.live.set,
    filterFields: filters.filterFields,
    registerFilterFields: filters.registerFilterFields,
    appliedFilters: filters.appliedFilters,
    applyFilters: filters.applyFilters,
    setFilters: filters.setFilters,
    removeFilter: filters.removeFilter,
    clearFilters: filters.clearFilters,
    editingFilter: filters.editingFilter,
    editFilter: filters.editFilter,
    exportCsv: core.exportCsv,
    reload,
    captionId: host.captionId,
    registerCaption: host.registerCaption
  }
}

export function useDataTableProvide(host: DataTableProvideHost): UseDataTableProvideReturn {
  const { core } = host
  const reload = (event: Event = new Event('refresh')): void => {
    if (!host.props.loading) host.emit.refresh(event)
  }
  provide(TableInjectionKey, tableContext(host, reload))
  const loadingMore = ref<boolean>(false)
  const toolbarScope = computed<Record<string, unknown>>(() => ({
    table: core.table,
    selectedRows: core.selectedRows.value,
    selectedCount: core.selectedCount.value,
    clearSelection: core.clearSelection,
    loading: host.props.loading
  }))
  const context: DataTableContext = {
    paging: core.paging,
    loadMore: {
      rowTotal: core.rowTotal,
      lazy: host.view.lazyActive,
      loading: readonly(loadingMore),
      setLoading: (value) => (loadingMore.value = value)
    },
    testId: host.testId,
    loading: computed(() => host.props.loading),
    toolbar: {
      scope: toolbarScope,
      filterCount: computed(() => core.filters.appliedFilters.value.length)
    },
    view: host.view
  }
  provide(DataTableInjectionKey, context)
  return {
    toolbarScope,
    exposed: {
      reload,
      clearFilters: core.filters.clearFilters,
      exportCsv: (options) => core.exportCsv(options),
      getSnapshot: core.state.getSnapshot,
      setSnapshot: core.state.setSnapshot
    }
  }
}
