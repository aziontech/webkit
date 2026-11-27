import { useDebounceFn } from '@vueuse/core'
import {
  computed,
  type ComputedRef,
  nextTick,
  onMounted,
  onScopeDispose,
  type Ref,
  ref,
  watch
} from 'vue'

import type { TableColumn } from '../../table/injection-key'
import type { DataTableHeader } from '../injection-key'
import { columnId, type ColumnLike, metaOf } from '../lib/column-meta'
import { columnContentMinWidths, RESIZE_FALLBACK_MIN_WIDTH } from '../lib/measure-columns'

type PointerLike = MouseEvent | TouchEvent

export interface DataTableResizeOptions {
  root: Ref<HTMLElement | null>
  columns: () => TableColumn[]
  headers: ComputedRef<DataTableHeader[]>
  leadingCells: () => number
  skip: () => boolean
  refit: () => unknown[]
  resizeWidths: Ref<Record<string, number>>
  commit: (event: PointerLike, column: { id: string; width: number }) => void
}

export interface UseDataTableResizeReturn {
  resizeWidths: Ref<Record<string, number>>
  autoWidths: ComputedRef<Record<string, number>>
  resizingColumnId: ComputedRef<string | null>
  startResize: (column: ColumnLike, event: MouseEvent | TouchEvent) => void
}

const pointX = (e: PointerLike): number =>
  'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX

const sameWidths = (a: Record<string, number>, b: Record<string, number>): boolean =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])].every((id) => a[id] === b[id])

const measureAuto = (o: DataTableResizeOptions): Record<string, number> | null => {
  const root = o.root.value
  if (!root || o.skip()) return null
  const headCells = Array.from(root.querySelectorAll<HTMLElement>('[role="columnheader"]'))
  const next: Record<string, number> = {}
  const ids: string[] = []
  const cells: HTMLElement[] = []
  o.headers.value.forEach((header, index) => {
    const column = o.columns().find((c) => columnId(c) === header.column.id)
    const cell = headCells[index + o.leadingCells()]
    if (column?.minWidth == null || column.width != null || !cell) return
    next[header.column.id] = column.minWidth
    ids.push(header.column.id)
    cells.push(cell)
  })
  columnContentMinWidths(cells).forEach((w, i) => {
    const id = ids[i] ?? ''
    next[id] = Math.max(next[id] ?? 0, w)
  })
  return next
}

const frozenWidths = (
  o: DataTableResizeOptions,
  headerRow: HTMLElement,
  current: Record<string, number>
): Record<string, number> => {
  const cells = Array.from(headerRow.querySelectorAll<HTMLElement>('[role="columnheader"]'))
  const snapshot = { ...current }
  o.headers.value.forEach((header, index) => {
    const meta = metaOf(header.column)
    if (meta.frozen || meta.type === 'action' || snapshot[header.column.id] != null) return
    const cell = cells[index + o.leadingCells()]
    if (cell) snapshot[header.column.id] = Math.round(cell.getBoundingClientRect().width)
  })
  return snapshot
}

const dragListeners = (
  onMove: (e: PointerLike) => void,
  onEnd: (e: PointerLike) => void
): (() => void) => {
  const doc = globalThis.document
  const end = (e: PointerLike): void => {
    onEnd(e)
    stop()
  }
  const stop = (): void => {
    doc.removeEventListener('mousemove', onMove)
    doc.removeEventListener('mouseup', end)
    doc.removeEventListener('touchmove', onMove)
    doc.removeEventListener('touchend', end)
  }
  doc.addEventListener('mousemove', onMove)
  doc.addEventListener('mouseup', end)
  doc.addEventListener('touchmove', onMove, { passive: false })
  doc.addEventListener('touchend', end)
  return stop
}

const startWidthOf = (
  o: DataTableResizeOptions,
  column: ColumnLike,
  headEl: HTMLElement | null | undefined,
  autoWidths: Record<string, number>
): number =>
  o.resizeWidths.value[column.id] ??
  headEl?.getBoundingClientRect().width ??
  o.columns().find((c) => columnId(c) === column.id)?.width ??
  autoWidths[column.id] ??
  (metaOf(column).grow ?? 1) * 150

const minWidthOf = (headEl: HTMLElement | null | undefined): number =>
  (headEl ? columnContentMinWidths([headEl])[0] : undefined) ?? RESIZE_FALLBACK_MIN_WIDTH

const watchAutoFit = (o: DataTableResizeOptions, measure: () => void): void => {
  const schedule = useDebounceFn(measure, 32)
  onMounted(() => {
    void nextTick(measure)
    const fonts = (globalThis.document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
    if (fonts?.ready) void fonts.ready.then(measure)
  })
  watch(o.refit, () => void schedule())
}

export function useDataTableResize(o: DataTableResizeOptions): UseDataTableResizeReturn {
  const { resizeWidths } = o
  const autoWidths = ref<Record<string, number>>({})
  const resizingColumnId = ref<string | null>(null)
  let stopDrag: (() => void) | null = null
  watchAutoFit(o, () => {
    const next = measureAuto(o)
    if (next && !sameWidths(next, autoWidths.value)) autoWidths.value = next
  })
  const startResize = (column: ColumnLike, event: PointerLike): void => {
    const headEl = (event.currentTarget as HTMLElement | null)?.closest<HTMLElement>(
      '[role="columnheader"]'
    )
    const headerRow = headEl?.closest<HTMLElement>('[role="row"]')
    if (headerRow) resizeWidths.value = frozenWidths(o, headerRow, resizeWidths.value)
    const startX = pointX(event)
    const startWidth = startWidthOf(o, column, headEl, autoWidths.value)
    const minWidth = minWidthOf(headEl)
    resizingColumnId.value = column.id
    let moved = false
    stopDrag?.()
    stopDrag = dragListeners(
      (move) => {
        move.preventDefault()
        moved = true
        const next = Math.max(minWidth, Math.round(startWidth + (pointX(move) - startX)))
        resizeWidths.value = { ...resizeWidths.value, [column.id]: next }
      },
      (end) => {
        resizingColumnId.value = null
        stopDrag = null
        const width = resizeWidths.value[column.id]
        if (moved && width !== undefined) o.commit(end, { id: column.id, width })
      }
    )
    event.preventDefault()
  }
  onScopeDispose(() => stopDrag?.())
  return {
    resizeWidths,
    autoWidths: computed(() => autoWidths.value),
    resizingColumnId: computed(() => resizingColumnId.value),
    startResize
  }
}
