import { reactive } from 'vue'

export function reorder(list, from, to) {
  if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return false
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)
  return true
}

export const GRIP_CLASS =
  'inline-flex shrink-0 items-center justify-center rounded-(--shape-button) ' +
  'text-(--text-muted) outline-none transition-colors duration-fast-02 ease-productive-entrance ' +
  'hover:bg-(--bg-hover) hover:text-(--text-default) ' +
  'focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
  'aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:cursor-default ' +
  'cursor-grab active:cursor-grabbing motion-reduce:transition-none'

export const DRAG_ROW_CLASS =
  'relative transition-[opacity,outline-color,transform,translate] duration-fast-02 ' +
  'data-dragging:opacity-60 data-dragging:outline-dashed data-dragging:outline-2 data-dragging:-outline-offset-2 data-dragging:outline-(--accent) ' +
  "data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:top-0 data-drop:before:z-10 data-drop:before:border-t-2 data-drop:before:border-(--accent) data-drop:before:content-[''] " +
  'motion-reduce:transition-none'

export function useDragReorder(getList, options = {}) {
  const { enabled = () => true, onReorder = () => {}, pinned = () => 0 } = options

  const dnd = reactive({ from: -1, over: -1 })

  const canMove = (index, direction) => {
    if (!enabled()) return false
    const head = pinned()
    if (index < head) return false
    if (direction === undefined) return getList().length - head > 1
    const to = index + direction
    return to >= head && to < getList().length
  }

  const isDragging = (index) => dnd.from === index
  const isDropTarget = (index) => dnd.over === index && dnd.from !== index && index >= pinned()

  const onDragStart = (index, event) => {
    if (!canMove(index)) return
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = event.currentTarget?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 16, 16)
    }
  }

  const onDragEnter = (index) => {
    if (dnd.from >= 0) dnd.over = index
  }

  const onDragEnd = () => {
    dnd.from = -1
    dnd.over = -1
  }

  const drop = (index) => {
    const from = dnd.from
    onDragEnd()
    if (from < 0 || index < pinned() || !canMove(from)) return
    if (reorder(getList(), from, index)) onReorder(from, index)
  }

  const move = (index, direction) => {
    if (!canMove(index, direction)) return
    const to = index + direction
    if (reorder(getList(), index, to)) onReorder(index, to)
  }

  const moveTo = (index, position) => {
    if (!canMove(index)) return index
    const list = getList()
    const to = Math.min(Math.max(Math.trunc(position) - 1, pinned()), list.length - 1)
    if (to === index) return index
    if (!reorder(list, index, to)) return index
    onReorder(index, to)
    return to
  }

  return {
    dnd,
    canMove,
    isDragging,
    isDropTarget,
    onDragStart,
    onDragEnter,
    onDragEnd,
    drop,
    move,
    moveTo
  }
}
