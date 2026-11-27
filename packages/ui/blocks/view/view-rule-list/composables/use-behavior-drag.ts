import { reactive } from 'vue'

import { type DragScope, type DragState, reorderItem, type RuleForm } from '../lib/rule-builder'

/** Dragging behaviors into a new order. */
export interface UseBehaviorDragReturn {
  /** The row is the one being dragged. */
  isDragging: (scope: DragScope, index: number) => boolean
  /** The row is where the drag would drop. */
  isDropTarget: (scope: DragScope, index: number) => boolean
  /** Starts dragging a row. */
  onDragstart: (scope: DragScope, index: number, event: DragEvent) => void
  /** Ends the drag. */
  onDragend: () => void
  /** A drag enters a row of the list. */
  onListDragenter: (event: DragEvent) => void
  /** A drag moves over the list. */
  onListDragover: (event: DragEvent) => void
  /** A drag drops on a row of the list. */
  onListDrop: (event: DragEvent) => void
}

const rowIndexOf = (event: DragEvent) => {
  const row = (event.target as Element | null)?.closest?.('[data-drag-row]')
  return row instanceof HTMLElement ? Number(row.dataset.index) : -1
}

export function useBehaviorDrag(form: RuleForm): UseBehaviorDragReturn {
  const dnd = reactive<DragState>({ scope: null, from: -1, over: -1 })

  const onDragstart = (scope: DragScope, index: number, event: DragEvent) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = (event.currentTarget as Element | null)?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragend = () => {
    dnd.scope = null
    dnd.from = -1
    dnd.over = -1
  }

  const onListDragenter = (event: DragEvent) => {
    const index = rowIndexOf(event)
    if (index < 0) return
    event.preventDefault()
    if (dnd.scope === 'behavior') dnd.over = index
  }
  const onListDragover = (event: DragEvent) => {
    if (rowIndexOf(event) >= 0) event.preventDefault()
  }
  const onListDrop = (event: DragEvent) => {
    const index = rowIndexOf(event)
    if (index < 0 || dnd.scope !== 'behavior') return
    reorderItem(form.behaviors, dnd.from, index)
    onDragend()
  }

  return {
    isDragging: (scope, index) => dnd.scope === scope && dnd.from === index,
    isDropTarget: (scope, index) => dnd.scope === scope && dnd.over === index && dnd.from !== index,
    onDragstart,
    onDragend,
    onListDragenter,
    onListDragover,
    onListDrop
  }
}
