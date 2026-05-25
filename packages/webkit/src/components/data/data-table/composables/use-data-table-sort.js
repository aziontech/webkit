import { computed } from 'vue'

export function useDataTableSort(data, sortField, sortOrder, columns) {
  const sortedData = computed(() => {
    const rows = [...data.value]
    if (!sortField.value) return rows
    const column = columns.value.find(
      (col) => col.field === sortField.value || col.sortField === sortField.value
    )
    const key = column?.sortField ?? sortField.value
    rows.sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (av === bv) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortOrder.value === -1 ? bv - av : av - bv
      }
      const as = String(av).toLowerCase()
      const bs = String(bv).toLowerCase()
      if (as < bs) return sortOrder.value === -1 ? 1 : -1
      if (as > bs) return sortOrder.value === -1 ? -1 : 1
      return 0
    })
    return rows
  })
  function toggleSort(field) {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 1 ? -1 : 1
    } else {
      sortField.value = field
      sortOrder.value = 1
    }
  }
  return { sortedData, toggleSort }
}
