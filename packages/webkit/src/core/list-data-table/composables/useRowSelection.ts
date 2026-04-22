import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

interface RowSelectionOptions {
  data: Ref<Record<string, unknown>[]>
  isSelectable?: (row: Record<string, unknown>) => boolean
  dataKey?: string
}

interface RowSelectionReturn {
  selectedItems: Ref<Record<string, unknown>[]>
  toggleRow: (row: Record<string, unknown>) => void
  toggleAll: () => void
  isAllSelected: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
  clearSelection: () => void
  isSelectable: (row: Record<string, unknown>) => boolean
}

export function useRowSelection(options: RowSelectionOptions): RowSelectionReturn {
  const { data, isSelectable = () => true, dataKey = 'id' } = options
  const selectedItems = ref<Record<string, unknown>[]>([])

  function toggleRow(row: Record<string, unknown>): void {
    if (!isSelectable(row)) return
    const key = row[dataKey]
    const index = selectedItems.value.findIndex((item) => item[dataKey] === key)
    if (index === -1) {
      selectedItems.value = [...selectedItems.value, row]
    } else {
      selectedItems.value = selectedItems.value.filter((item) => item[dataKey] !== key)
    }
  }

  function toggleAll(): void {
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

  function clearSelection(): void {
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
