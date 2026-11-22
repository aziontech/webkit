import type { ColumnFiltersState } from '@tanstack/vue-table'
import { computed, type ComputedRef, type Ref, ref, shallowRef } from 'vue'

import type { TableAppliedFilter, TableFilterField } from '../../table/injection-key'
import { filterKey } from '../lib/table-state'
import type { DataTableCell } from './use-data-table-state'

export interface DataTableFiltersOptions {
  filters: DataTableCell<TableAppliedFilter[]>
  globalFilter: DataTableCell<string>
  manual: () => boolean
  onApply: (event: Event, filters: TableAppliedFilter[]) => void
  onRemove: (event: Event, filter: TableAppliedFilter) => void
}

export interface UseDataTableFiltersReturn {
  appliedFilters: ComputedRef<TableAppliedFilter[]>
  columnFilters: ComputedRef<ColumnFiltersState>
  filterFields: ComputedRef<TableFilterField[]>
  registerFilterFields: (fields: () => TableFilterField[]) => () => void
  setFilters: (filters: TableAppliedFilter[]) => void
  applyFilters: (event: Event, filters: TableAppliedFilter[]) => void
  removeFilter: (event: Event, filter: TableAppliedFilter) => void
  clearFilters: () => void
  editingFilter: Readonly<Ref<TableAppliedFilter | null>>
  editFilter: (filter: TableAppliedFilter | null) => void
}

export function useDataTableFilters(o: DataTableFiltersOptions): UseDataTableFiltersReturn {
  const fieldSource = shallowRef<(() => TableFilterField[]) | null>(null)
  const editingFilter = ref<TableAppliedFilter | null>(null)
  const appliedFilters = o.filters.value
  const setFilters = o.filters.set
  return {
    appliedFilters,
    columnFilters: computed<ColumnFiltersState>(() =>
      o.manual()
        ? []
        : appliedFilters.value.map((filter) => ({
            id: filter.field,
            value: { operator: filter.operator, value: filter.value }
          }))
    ),
    filterFields: computed<TableFilterField[]>(() => fieldSource.value?.() ?? []),
    registerFilterFields: (fields) => {
      fieldSource.value = fields
      return () => {
        if (fieldSource.value === fields) fieldSource.value = null
      }
    },
    setFilters,
    applyFilters: (event, next) => {
      setFilters(next)
      o.onApply(event, next)
    },
    removeFilter: (event, filter) => {
      const key = filterKey(filter)
      setFilters(appliedFilters.value.filter((entry) => filterKey(entry) !== key))
      o.onRemove(event, filter)
    },
    clearFilters: () => {
      if (appliedFilters.value.length > 0) setFilters([])
      if (o.globalFilter.value.value !== '') o.globalFilter.set('')
    },
    editingFilter: computed(() => editingFilter.value),
    editFilter: (filter) => {
      editingFilter.value = filter
    }
  }
}
