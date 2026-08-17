// Drag-to-reorder for an ordered list, with no library (dependencies.md forbids
// sortablejs / dnd runtimes — this is native HTML5 drag-and-drop plus arrow keys).
//
// The pattern was first written inline in CreateRuleDrawer.vue for the criteria /
// behavior repeaters; this is that pattern extracted so a second ordered list —
// the Rules Engine table, where the order IS the execution order — inherits the
// same gesture, the same states and the same keyboard fallback instead of a
// second implementation that drifts from it.
//
// Three rules the shape encodes:
//
//   1. THE GRIP IS THE DRAG SOURCE, never the row. A row that is itself
//      `draggable` swallows text selection and the controls inside it; a grip
//      keeps every cell interactive.
//   2. DRAG IS NEVER THE ONLY WAY. Pointer drag is a mouse gesture, and it is the
//      one gesture some readers cannot perform at all. The same list therefore
//      ships explicit move-up / move-down buttons and arrow keys on the grip, and
//      all three drive the same `move`.
//   3. A LIST MAY HAVE A FIXED HEAD. `pinned` is how many leading items are part of
//      the list's DEFINITION rather than its order — the first rule of a Rules
//      Engine phase is where the phase starts, so it is not a row that happens to
//      be at the top. A pinned item cannot be dragged, cannot be nudged, and
//      nothing can be dropped above it: `canMove` answers all three from one place,
//      so the grip's `aria-disabled`, the buttons' `disabled` and the drop target
//      can never disagree about what is allowed.
import { reactive } from 'vue'

/** Moves `from` to `to` in place, returning whether anything changed. */
export function reorder(list, from, to) {
  if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return false
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)
  return true
}

// The grip: sized by the caller, focusable, and carrying the grab cursors. Not an
// IconButton — that component forwards neither `draggable` nor the drag listeners.
export const GRIP_CLASS =
  'inline-flex shrink-0 items-center justify-center rounded-[var(--shape-button)] ' +
  'text-[var(--text-muted)] outline-none transition-colors duration-fast-02 ease-productive-entrance ' +
  'hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)] ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] ' +
  'aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:cursor-default ' +
  'cursor-grab active:cursor-grabbing motion-reduce:transition-none'

// Row states, both drawn WITHOUT touching layout so nothing shifts mid-drag:
// `dragging` = the lifted row (dimmed, dashed accent outline);
// `drop`     = where it will land (a solid accent rule on the leading edge, via
//              a `before` pseudo-element).
export const DRAG_ROW_CLASS =
  'relative transition-[opacity,outline-color] duration-fast-02 ' +
  'data-[dragging]:opacity-60 data-[dragging]:outline-dashed data-[dragging]:outline-2 data-[dragging]:-outline-offset-2 data-[dragging]:outline-[var(--accent)] ' +
  "data-[drop]:before:pointer-events-none data-[drop]:before:absolute data-[drop]:before:inset-x-0 data-[drop]:before:top-0 data-[drop]:before:z-10 data-[drop]:before:border-t-2 data-[drop]:before:border-[var(--accent)] data-[drop]:before:content-[''] " +
  'motion-reduce:transition-none'

/**
 * Wires one list for drag-and-drop reordering.
 *
 * @param {() => unknown[]} getList the array to splice (a getter, so it can be a ref's value)
 * @param {{
 *   enabled?: () => boolean,
 *   onReorder?: (from: number, to: number) => void,
 *   pinned?: () => number
 * }} [options]
 *   `enabled` — whether reordering is currently allowed at all; a narrowed list cannot be
 *     reordered honestly, because the rows a drag would cross are not on screen.
 *   `onReorder` — called after a successful move.
 *   `pinned` — how many leading items are fixed in place (default none).
 */
export function useDragReorder(getList, options = {}) {
  const { enabled = () => true, onReorder = () => {}, pinned = () => 0 } = options

  const dnd = reactive({ from: -1, over: -1 })

  /**
   * Whether the item at `index` may move at all — and, when `direction` is given,
   * whether it may move that way. The single answer every control reads.
   *
   * @param {number} index
   * @param {-1 | 1} [direction]
   */
  const canMove = (index, direction) => {
    if (!enabled()) return false
    const head = pinned()
    if (index < head) return false
    if (direction === undefined) return getList().length - head > 1
    const to = index + direction
    return to >= head && to < getList().length
  }

  const isDragging = (index) => dnd.from === index
  // A pinned row is never a drop target: landing a row above the head would move the
  // head, which is the one thing pinning it means.
  const isDropTarget = (index) => dnd.over === index && dnd.from !== index && index >= pinned()

  const onDragStart = (index, event) => {
    if (!canMove(index)) return
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      // Firefox refuses to start a drag without data on the transfer.
      event.dataTransfer.setData('text/plain', String(index))
      // Drag the whole row, not the 24px grip the pointer is actually on.
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

  /** One step in `direction` — what the arrow keys and the move buttons both call. */
  const move = (index, direction) => {
    if (!canMove(index, direction)) return
    const to = index + direction
    if (reorder(getList(), index, to)) onReorder(index, to)
  }

  return { dnd, canMove, isDragging, isDropTarget, onDragStart, onDragEnter, onDragEnd, drop, move }
}
