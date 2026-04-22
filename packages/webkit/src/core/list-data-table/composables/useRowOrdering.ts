import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'

interface RowOrderingOptions {
  data: Ref<Record<string, unknown>[]>
  groupColumn?: string
  restrictReorderAcrossGroups?: boolean
  dataKey?: string
  positionField?: string
  positionObjectMode?: boolean
}

interface RowReorderEvent {
  dragIndex: number
  dropIndex: number
}

interface RowOrderingReturn {
  onRowReorder: (event: RowReorderEvent) => {
    from: number
    to: number
    reorderedData: Record<string, unknown>[]
    blocked: boolean
  }
  changePosition: (
    row: Record<string, unknown>,
    newPosition: number
  ) => { reorderedData: Record<string, unknown>[]; alteredRows: Record<string, unknown>[] }
  changePositionWithinGroup: (
    row: Record<string, unknown>,
    newPosition: number
  ) => {
    reorderedData: Record<string, unknown>[]
    alteredRows: Record<string, unknown>[]
    exceeded: boolean
  }
  alteredRows: ComputedRef<Record<string, unknown>[]>
  hasChanges: ComputedRef<boolean>
  discardChanges: () => void
  getPositionLimits: (row: Record<string, unknown>) => { min: number; max: number }
  getGroupValue: (row: Record<string, unknown>) => string | undefined
  scrollToPosition: (position: number, containerSelector?: string) => void
}

export function useRowOrdering(options: RowOrderingOptions): RowOrderingReturn {
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

  function setPositionValue(row: Record<string, unknown>, value: number): void {
    if (positionObjectMode) {
      if (!row[positionField]) {
        row[positionField] = { value: 0, immutableValue: 0, altered: false, min: 0, max: 0 }
      }
      ;(row[positionField] as { value: number }).value = value
    } else {
      row[positionField] = value
    }
  }

  function markAltered(row: Record<string, unknown>): void {
    if (positionObjectMode) {
      const posObj = row[positionField] as
        | {
            value: number
            immutableValue: number
            altered: boolean
          }
        | undefined
      if (posObj) {
        posObj.altered = posObj.value !== posObj.immutableValue
      }
    }
  }

  function takeSnapshot(): void {
    if (!snapshotTaken && !positionObjectMode) {
      data.value.forEach((row) => {
        originalPositions.set(row[dataKey], row[positionField])
      })
      snapshotTaken = true
    }
  }

  function getGroupValue(row: Record<string, unknown>): string | undefined {
    if (!groupColumn) return undefined
    const keys = groupColumn.split('.')
    let value: unknown = row
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key]
    }
    return typeof value === 'object' && value !== null
      ? ((value as Record<string, unknown>)['content'] as string | undefined)
      : (value as string | undefined)
  }

  function updateGroupPositions(items: Record<string, unknown>[]): void {
    items.forEach((row, index) => {
      setPositionValue(row, index)
      if (positionObjectMode && row[positionField]) {
        const posObj = row[positionField] as {
          value: number
          immutableValue: number
          altered: boolean
          min: number
          max: number
        }
        posObj.max = items.length - 1
        posObj.min = 0
        markAltered(row)
      }
    })
  }

  function onRowReorder(event: RowReorderEvent): {
    from: number
    to: number
    reorderedData: Record<string, unknown>[]
    blocked: boolean
  } {
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

  function changePosition(
    row: Record<string, unknown>,
    newPosition: number
  ): { reorderedData: Record<string, unknown>[]; alteredRows: Record<string, unknown>[] } {
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

  function changePositionWithinGroup(
    row: Record<string, unknown>,
    newPosition: number
  ): {
    reorderedData: Record<string, unknown>[]
    alteredRows: Record<string, unknown>[]
    exceeded: boolean
  } {
    const rowGroup = getGroupValue(row)

    const groups = new Map<string | undefined, Record<string, unknown>[]>()
    data.value.forEach((r) => {
      const g = getGroupValue(r)
      if (!groups.has(g)) groups.set(g, [])
      groups.get(g)?.push(r)
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

    const reassembled: Record<string, unknown>[] = []
    const seenGroups = new Set<string | undefined>()
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
      return data.value.filter((row) => {
        const posObj = row[positionField] as { altered: boolean } | undefined
        return posObj?.altered
      })
    }
    if (!snapshotTaken) return []
    return data.value.filter((row) => {
      const original = originalPositions.get(row[dataKey])
      return original !== undefined && original !== row[positionField]
    })
  })

  const hasChanges = computed(() => alteredRows.value.length > 0)

  function discardChanges(): void {
    if (positionObjectMode) {
      data.value.forEach((row) => {
        const posObj = row[positionField] as
          | { value: number; immutableValue: number; altered: boolean }
          | undefined
        if (posObj && posObj.altered) {
          posObj.value = posObj.immutableValue
          posObj.altered = false
        }
      })

      if (restrictReorderAcrossGroups && groupColumn) {
        const groups = new Map<string | undefined, Record<string, unknown>[]>()
        data.value.forEach((r) => {
          const g = getGroupValue(r)
          if (!groups.has(g)) groups.set(g, [])
          groups.get(g)?.push(r)
        })

        const reassembled: Record<string, unknown>[] = []
        const seenGroups = new Set<string | undefined>()
        data.value.forEach((r) => {
          const g = getGroupValue(r)
          if (!seenGroups.has(g)) {
            seenGroups.add(g)
            const items = groups.get(g) || []
            items.sort((a, b) => {
              const aVal =
                (a[positionField] as { immutableValue: number } | undefined)?.immutableValue ?? 0
              const bVal =
                (b[positionField] as { immutableValue: number } | undefined)?.immutableValue ?? 0
              return aVal - bVal
            })
            reassembled.push(...items)
          }
        })
        data.value = reassembled
      } else {
        data.value = [...data.value].sort((a, b) => {
          const aVal =
            (a[positionField] as { immutableValue: number } | undefined)?.immutableValue ?? 0
          const bVal =
            (b[positionField] as { immutableValue: number } | undefined)?.immutableValue ?? 0
          return aVal - bVal
        })
      }
    } else {
      if (!snapshotTaken) return
      data.value.forEach((row) => {
        const original = originalPositions.get(row[dataKey])
        if (original !== undefined) {
          row[positionField] = original
        }
      })
      data.value = [...data.value].sort((a, b) => {
        const aVal = a[positionField] as number
        const bVal = b[positionField] as number
        return aVal - bVal
      })
      originalPositions.clear()
      snapshotTaken = false
    }
  }

  function getPositionLimits(row: Record<string, unknown>): { min: number; max: number } {
    if (positionObjectMode && row[positionField]) {
      const posObj = row[positionField] as { min: number; max: number }
      return {
        min: posObj.min ?? 0,
        max: posObj.max ?? data.value.length - 1
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

  function scrollToPosition(position: number, containerSelector: string = '.p-datatable'): void {
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
