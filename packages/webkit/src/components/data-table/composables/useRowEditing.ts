import { ref, computed } from 'vue'

interface UseRowEditingOptions {
  dataKey?: string
}

export function useRowEditing(options: UseRowEditingOptions = {}) {
  const dataKey = options.dataKey ?? 'id'
  const editingRows = ref<any[]>([])
  const backups = new Map<any, any>()

  function startEdit(row: any) {
    const key = row[dataKey]
    backups.set(key, { ...row })
    if (!editingRows.value.includes(row)) {
      editingRows.value = [...editingRows.value, row]
    }
  }

  function saveEdit(event: { data: any; newData: any; index: number }) {
    const key = event.data[dataKey]
    const originalData = backups.get(key) || { ...event.data }
    backups.delete(key)
    editingRows.value = editingRows.value.filter((r) => r[dataKey] !== key)
    return { newData: event.newData, originalData, index: event.index }
  }

  function cancelEdit(event: { data: any; index: number }) {
    const key = event.data[dataKey]
    const restoredData = backups.get(key) || { ...event.data }
    backups.delete(key)
    editingRows.value = editingRows.value.filter((r) => r[dataKey] !== key)
    return { restoredData, index: event.index }
  }

  function cancelAll() {
    backups.clear()
    editingRows.value = []
  }

  function isEditing(row: any): boolean {
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
