import { computed } from 'vue'

export function useRowOrdering(options) {
  const {
    data,
    groupColumn,
    restrictReorderAcrossGroups = false,
    dataKey = 'id',
    positionField = 'order',
    positionObjectMode = false
  } = options

  const originalPositions = new Map()
  let snapshotTaken = false

  function setPositionValue(row, value) {
    if (positionObjectMode) {
      if (!row[positionField]) {
        row[positionField] = { value: 0, immutableValue: 0, altered: false, min: 0, max: 0 }
      }
      row[positionField].value = value
    } else {
      row[positionField] = value
    }
  }

  function markAltered(row) {
    if (positionObjectMode) {
      if (row[positionField]) {
        row[positionField].altered = row[positionField].value !== row[positionField].immutableValue
      }
    }
  }

  function takeSnapshot() {
    if (!snapshotTaken && !positionObjectMode) {
      data.value.forEach((row) => {
        originalPositions.set(row[dataKey], row[positionField])
      })
      snapshotTaken = true
    }
  }

  function getGroupValue(row) {
    if (!groupColumn) return undefined
    const keys = groupColumn.split('.')
    let value = row
    for (const key of keys) {
      value = value?.[key]
    }
    return typeof value === 'object' && value !== null ? value.content : value
  }

  function updateGroupPositions(items) {
    items.forEach((row, index) => {
      setPositionValue(row, index)
      if (positionObjectMode && row[positionField]) {
        row[positionField].max = items.length - 1
        row[positionField].min = 0
        markAltered(row)
      }
    })
  }

  function onRowReorder(event) {
    takeSnapshot()
    const { dragIndex, dropIndex } = event
    const reordered = [...data.value]

    if (restrictReorderAcrossGroups && groupColumn) {
      const dragGroup = getGroupValue(reordered[dragIndex])
      const dropGroup = getGroupValue(reordered[dropIndex])
      if (dragGroup !== dropGroup) {
        return { from: dragIndex, to: dropIndex, reorderedData: data.value, blocked: true }
      }
    }

    const [movedItem] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, movedItem)

    if (restrictReorderAcrossGroups && groupColumn) {
      const affectedGroup = getGroupValue(movedItem)
      const groupItems = reordered.filter((r) => getGroupValue(r) === affectedGroup)
      updateGroupPositions(groupItems)
    } else {
      reordered.forEach((row, index) => {
        setPositionValue(row, positionObjectMode ? index : index + 1)
        markAltered(row)
      })
    }

    data.value = reordered
    return { from: dragIndex, to: dropIndex, reorderedData: reordered, blocked: false }
  }

  function changePosition(row, newPosition) {
    takeSnapshot()

    if (restrictReorderAcrossGroups && groupColumn) {
      return changePositionWithinGroup(row, newPosition)
    }

    const currentIndex = data.value.findIndex((r) => r[dataKey] === row[dataKey])
    if (currentIndex === -1) return { reorderedData: data.value, alteredRows: alteredRows.value }

    const targetIndex = positionObjectMode ? newPosition : newPosition - 1
    const reordered = [...data.value]

    const [movedItem] = reordered.splice(currentIndex, 1)
    reordered.splice(Math.max(0, Math.min(targetIndex, reordered.length)), 0, movedItem)

    reordered.forEach((r, index) => {
      setPositionValue(r, positionObjectMode ? index : index + 1)
      markAltered(r)
    })

    data.value = reordered
    return { reorderedData: reordered, alteredRows: alteredRows.value }
  }

  function changePositionWithinGroup(row, newPosition) {
    const rowGroup = getGroupValue(row)

    const groups = new Map()
    data.value.forEach((r) => {
      const g = getGroupValue(r)
      if (!groups.has(g)) groups.set(g, [])
      groups.get(g).push(r)
    })

    const groupItems = groups.get(rowGroup)
    if (!groupItems)
      return { reorderedData: data.value, alteredRows: alteredRows.value, exceeded: false }

    const originalIndex = groupItems.findIndex((r) => r[dataKey] === row[dataKey])
    if (originalIndex === -1)
      return { reorderedData: data.value, alteredRows: alteredRows.value, exceeded: false }

    const maxPosition = groupItems.length - 1
    let targetPosition = newPosition
    let exceeded = false

    if (targetPosition > maxPosition) {
      targetPosition = maxPosition
      exceeded = true
    }

    if (targetPosition < 0) targetPosition = 0
    if (originalIndex === targetPosition) {
      return { reorderedData: data.value, alteredRows: alteredRows.value, exceeded }
    }

    const [movedItem] = groupItems.splice(originalIndex, 1)
    groupItems.splice(targetPosition, 0, movedItem)
    updateGroupPositions(groupItems)

    const reassembled = []
    const seenGroups = new Set()
    data.value.forEach((r) => {
      const g = getGroupValue(r)
      if (!seenGroups.has(g)) {
        seenGroups.add(g)
        reassembled.push(...(groups.get(g) || []))
      }
    })

    data.value = reassembled
    return { reorderedData: reassembled, alteredRows: alteredRows.value, exceeded }
  }

  const alteredRows = computed(() => {
    if (positionObjectMode) {
      return data.value.filter((row) => row[positionField]?.altered)
    }
    if (!snapshotTaken) return []
    return data.value.filter((row) => {
      const original = originalPositions.get(row[dataKey])
      return original !== undefined && original !== row[positionField]
    })
  })

  const hasChanges = computed(() => alteredRows.value.length > 0)

  function discardChanges() {
    if (positionObjectMode) {
      data.value.forEach((row) => {
        if (row[positionField] && row[positionField].altered) {
          row[positionField].value = row[positionField].immutableValue
          row[positionField].altered = false
        }
      })

      if (restrictReorderAcrossGroups && groupColumn) {
        const groups = new Map()
        data.value.forEach((r) => {
          const g = getGroupValue(r)
          if (!groups.has(g)) groups.set(g, [])
          groups.get(g).push(r)
        })

        const reassembled = []
        const seenGroups = new Set()
        data.value.forEach((r) => {
          const g = getGroupValue(r)
          if (!seenGroups.has(g)) {
            seenGroups.add(g)
            const items = groups.get(g) || []
            items.sort(
              (a, b) =>
                (a[positionField]?.immutableValue ?? 0) - (b[positionField]?.immutableValue ?? 0)
            )
            reassembled.push(...items)
          }
        })
        data.value = reassembled
      } else {
        data.value = [...data.value].sort(
          (a, b) =>
            (a[positionField]?.immutableValue ?? 0) - (b[positionField]?.immutableValue ?? 0)
        )
      }
    } else {
      if (!snapshotTaken) return
      data.value.forEach((row) => {
        const original = originalPositions.get(row[dataKey])
        if (original !== undefined) {
          row[positionField] = original
        }
      })
      data.value = [...data.value].sort((a, b) => a[positionField] - b[positionField])
      originalPositions.clear()
      snapshotTaken = false
    }
  }

  function getPositionLimits(row) {
    if (positionObjectMode && row[positionField]) {
      return {
        min: row[positionField].min ?? 0,
        max: row[positionField].max ?? data.value.length - 1
      }
    }

    if (restrictReorderAcrossGroups && groupColumn) {
      const rowGroup = getGroupValue(row)
      const groupItems = data.value.filter((r) => getGroupValue(r) === rowGroup)
      const groupStart = data.value.indexOf(groupItems[0])
      return {
        min: groupStart + 1,
        max: groupStart + groupItems.length
      }
    }
    return { min: 1, max: data.value.length }
  }

  function scrollToPosition(position, containerSelector = '.p-datatable') {
    setTimeout(() => {
      const table = document.querySelector(containerSelector)
      const rowElement = table?.querySelector(`#row-${position}`)
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 150)
  }

  return {
    onRowReorder,
    changePosition,
    changePositionWithinGroup,
    alteredRows,
    hasChanges,
    discardChanges,
    getPositionLimits,
    getGroupValue,
    scrollToPosition
  }
}
