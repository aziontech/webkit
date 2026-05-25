import { computed } from 'vue'

export function useDataTableFilter(data, options) {
  const globalQuery = computed(() => {
    const fromFilters = options.filters.value?.['global']
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
