import { describe, expect, it, vi } from 'vitest'
import { computed, ref, shallowRef } from 'vue'

import type { TableAppliedFilter } from '../../table/injection-key'
import { useDataTableFilters } from './use-data-table-filters'

const cell = <T>(initial: T) => {
  const raw = shallowRef(initial)
  return { value: computed(() => raw.value), set: (next: T) => (raw.value = next) }
}

const status: TableAppliedFilter = { field: 'status', operator: 'eq', value: 'Active' }

describe('useDataTableFilters', () => {
  it('maps the applied filters to column filters unless filtering is manual', () => {
    const manual = ref(false)
    const filters = useDataTableFilters({
      filters: cell<TableAppliedFilter[]>([status]),
      globalFilter: cell(''),
      manual: () => manual.value,
      onApply: vi.fn(),
      onRemove: vi.fn()
    })
    expect(filters.columnFilters.value).toEqual([
      { id: 'status', value: { operator: 'eq', value: 'Active' } }
    ])
    manual.value = true
    expect(filters.columnFilters.value).toEqual([])
  })

  it('removes one filter with the event first and clears the search text', () => {
    const onRemove = vi.fn()
    const search = cell('api')
    const filters = useDataTableFilters({
      filters: cell<TableAppliedFilter[]>([status]),
      globalFilter: search,
      manual: () => false,
      onApply: vi.fn(),
      onRemove
    })
    const event = new Event('click')
    filters.removeFilter(event, status)
    expect(onRemove).toHaveBeenCalledWith(event, status)
    expect(filters.appliedFilters.value).toEqual([])
    filters.clearFilters()
    expect(search.value.value).toBe('')
  })

  it('reads the fields the mounted filter registers and drops them when it unregisters', () => {
    const filters = useDataTableFilters({
      filters: cell<TableAppliedFilter[]>([]),
      globalFilter: cell(''),
      manual: () => false,
      onApply: vi.fn(),
      onRemove: vi.fn()
    })
    const stop = filters.registerFilterFields(() => [{ id: 'name', label: 'Name', type: 'text' }])
    expect(filters.filterFields.value.map((field) => field.id)).toEqual(['name'])
    stop()
    expect(filters.filterFields.value).toEqual([])
  })
})
