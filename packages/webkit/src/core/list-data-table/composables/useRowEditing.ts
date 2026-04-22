import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

interface RowEditingOptions {
  dataKey?: string
}

interface RowEditingEvent {
  data: Record<string, unknown>
  newData?: Record<string, unknown>
  index: number
}

interface RowEditingReturn {
  editingRows: Ref<Record<string, unknown>[]>
  startEdit: (row: Record<string, unknown>) => void
  saveEdit: (event: RowEditingEvent) => {
    newData: Record<string, unknown> | undefined
    originalData: Record<string, unknown>
    index: number
  }
  cancelEdit: (event: { data: Record<string, unknown>; index: number }) => {
    restoredData: Record<string, unknown>
    index: number
  }
  cancelAll: () => void
  isEditing: (row: Record<string, unknown>) => boolean
  hasChanges: ComputedRef<boolean>
}

export function useRowEditing(options: RowEditingOptions = {}): RowEditingReturn {
  const dataKey = options?.dataKey ?? 'id'
  const editingRows = ref<Record<string, unknown>[]>([])
  const backups = new Map<unknown, Record<string, unknown>>()

  function startEdit(row: Record<string, unknown>): void {
    const key = row[dataKey]
    backups.set(key, { ...row })
    if (!editingRows.value.includes(row)) {
      editingRows.value = [...editingRows.value, row]
    }
  }

  function saveEdit(event: RowEditingEvent): {
    newData: Record<string, unknown> | undefined
    originalData: Record<string, unknown>
    index: number
  } {
    const key = event.data[dataKey]
    const originalData = backups.get(key) || { ...event.data }
    backups.delete(key)
    editingRows.value = editingRows.value.filter((r) => r[dataKey] !== key)
    return { newData: event.newData, originalData, index: event.index }
  }

  function cancelEdit(event: { data: Record<string, unknown>; index: number }): {
    restoredData: Record<string, unknown>
    index: number
  } {
    const key = event.data[dataKey]
    const restoredData = backups.get(key) || { ...event.data }
    backups.delete(key)
    editingRows.value = editingRows.value.filter((r) => r[dataKey] !== key)
    return { restoredData, index: event.index }
  }

  function cancelAll(): void {
    backups.clear()
    editingRows.value = []
  }

  function isEditing(row: Record<string, unknown>): boolean {
    return editingRows.value.some((r) => r[dataKey] === row[dataKey])
  }

  const hasChanges = computed(() => editingRows.value.length > 0)

  return {
    editingRows,
    startEdit,
    saveEdit,
    cancelEdit,
    cancelAll,
    isEditing,
    hasChanges
  }
}
