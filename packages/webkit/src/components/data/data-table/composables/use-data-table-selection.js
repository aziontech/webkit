import { computed, ref } from 'vue'

export function useDataTableSelection(data, dataKey, selectionProp, onUpdateSelection, multiple) {
  const internalSelection = ref([])
  const selectedRows = computed({
    get: () => {
      if (selectionProp.value == null) return internalSelection.value
      if (Array.isArray(selectionProp.value)) return selectionProp.value
      return [selectionProp.value]
    },
    set: (rows) => {
      internalSelection.value = rows
      if (multiple.value) {
        onUpdateSelection(rows)
      } else {
        onUpdateSelection(rows[0] ?? null)
      }
    }
  })
  function isRowSelected(row) {
    const key = row[dataKey]
    return selectedRows.value.some((item) => item[dataKey] === key)
  }
  function toggleRow(row) {
    if (isRowSelected(row)) {
      selectedRows.value = selectedRows.value.filter((item) => item[dataKey] !== row[dataKey])
    } else if (multiple.value) {
      selectedRows.value = [...selectedRows.value, row]
    } else {
      selectedRows.value = [row]
    }
  }
  const isAllSelected = computed(() => {
    if (data.value.length === 0) return false
    return data.value.every((row) => isRowSelected(row))
  })
  function toggleAll() {
    if (isAllSelected.value) {
      selectedRows.value = []
    } else {
      selectedRows.value = [...data.value]
    }
  }
  return {
    selectedRows,
    isRowSelected,
    toggleRow,
    isAllSelected,
    toggleAll
  }
}
