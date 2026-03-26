import { ref, computed } from 'vue'

export function useRowEditing(options = {}) {
  const dataKey = options.dataKey ?? 'id'
  const editingRows = ref([])
  const backups = new Map()

  function startEdit(row) {
    const key = row[dataKey]
    backups.set(key, { ...row })
    if (!editingRows.value.includes(row)) {
      editingRows.value = [...editingRows.value, row]
    }
  }

  function saveEdit(event) {
    const key = event.data[dataKey]
    const originalData = backups.get(key) || { ...event.data }
    backups.delete(key)
    editingRows.value = editingRows.value.filter((r) => r[dataKey] !== key)
    return { newData: event.newData, originalData, index: event.index }
  }

  function cancelEdit(event) {
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

  function isEditing(row) {
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
