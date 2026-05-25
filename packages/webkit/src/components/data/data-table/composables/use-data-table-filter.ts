import { computed, type Ref } from 'vue'

import type { FilterDefinition } from '../injection-key'

export function useDataTableFilter(
  data: Ref<Record<string, unknown>[]>,
  options: {
    globalFilterFields: Ref<string[]>
    searchValue: Ref<string>
    filters: Ref<Record<string, unknown>>
    appliedFilters: Ref<FilterDefinition[]>
  }
) {
  const globalQuery = computed(() => {
    const fromFilters = options.filters.value?.['global'] as { value?: string } | undefined
    const value = options.searchValue.value || fromFilters?.value || ''
    return String(value).trim().toLowerCase()
  })

  const filteredData = computed(() => {
    let rows = [...data.value]

    if (globalQuery.value && options.globalFilterFields.value.length > 0) {
      rows = rows.filter((row) =>
        options.globalFilterFields.value.some((field) => {
          const cell = row[field]
          return cell != null && String(cell).toLowerCase().includes(globalQuery.value)
        })
      )
    }

    for (const filter of options.appliedFilters.value) {
      const field = filter.field
      const raw = filter.value
      if (raw === null || raw === undefined || raw === '') continue
      rows = rows.filter((row) => {
        const cell = row[field]
        if (Array.isArray(raw)) return raw.includes(cell)
        return String(cell).toLowerCase() === String(raw).toLowerCase()
      })
    }

    return rows
  })

  const hasActiveSearch = computed(() => globalQuery.value.length > 0)

  return { filteredData, hasActiveSearch, globalQuery }
}
