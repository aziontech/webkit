import { ref, computed, type Ref } from 'vue'

interface UseRowSelectionOptions {
  data: Ref<any[]>
  isSelectable?: (row: any) => boolean
  dataKey?: string
}

export function useRowSelection(options: UseRowSelectionOptions) {
  const { data, isSelectable = () => true, dataKey = 'id' } = options
  const selectedItems = ref<any[]>([])

  function toggleRow(row: any) {
    if (!isSelectable(row)) return
    const key = row[dataKey]
    const index = selectedItems.value.findIndex((item) => item[dataKey] === key)
    if (index === -1) {
      selectedItems.value = [...selectedItems.value, row]
    } else {
      selectedItems.value = selectedItems.value.filter((item) => item[dataKey] !== key)
    }
  }

  function toggleAll() {
    const selectableRows = data.value.filter(isSelectable)
    if (isAllSelected.value) {
      selectedItems.value = []
    } else {
      selectedItems.value = [...selectableRows]
    }
  }

  const isAllSelected = computed(() => {
    const selectableRows = data.value.filter(isSelectable)
    if (selectableRows.length === 0) return false
    return selectableRows.every((row) =>
      selectedItems.value.some((item) => item[dataKey] === row[dataKey])
    )
  })

  const selectedCount = computed(() => selectedItems.value.length)

  function clearSelection() {
    selectedItems.value = []
  }

  return {
    selectedItems,
    toggleRow,
    toggleAll,
    isAllSelected,
    selectedCount,
    clearSelection,
    isSelectable
  }
}
