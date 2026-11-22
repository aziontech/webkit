import { nextTick, type Ref } from 'vue'

import { logicalArrowKey, useDirection } from '../../../../composables/use-direction'
import { useElementListener } from '../../../../composables/use-element-listener'
import type { TraceRow } from '../types'

export interface UseTraceNavigationOptions {
  gridEl: Readonly<Ref<HTMLElement | null>>
  rows: Readonly<Ref<TraceRow[]>>
  timelineOrder: Readonly<Ref<string[]>>
  shown: Readonly<Ref<Set<string> | null>>
  collapsed: Ref<Set<string>>
  focusedId: Ref<string>
  current: Ref<string>
  timeline: () => boolean
}

export interface UseTraceNavigationReturn {
  toggle: (row: TraceRow) => void
  close: () => void
}

const spanElement = (event: Event): HTMLElement | null =>
  event.target instanceof Element
    ? event.target.closest<HTMLElement>('[role="option"][data-span-id], [role="row"][data-span-id]')
    : null

function rowTarget(rows: TraceRow[], index: number, key: string): TraceRow | undefined | null {
  if (key === 'ArrowDown') return rows[index + 1]
  if (key === 'ArrowUp') return rows[index - 1]
  if (key === 'Home') return rows[0]
  if (key === 'End') return rows[rows.length - 1]
  return null
}

function barTarget(order: string[], id: string, key: string): string | undefined | null {
  const index = order.indexOf(id)
  if (key === 'ArrowRight' || key === 'ArrowDown') return order[index + 1]
  if (key === 'ArrowLeft' || key === 'ArrowUp') return order[index - 1]
  if (key === 'Home') return order[0]
  if (key === 'End') return order[order.length - 1]
  return null
}

interface TraceNav {
  rows: TraceRow[]
  order: string[]
  filtering: boolean
  focusRow: (id: string) => Promise<void>
  toggle: (row: TraceRow) => void
  pick: (id: string) => void
}

function sideStep(nav: TraceNav, row: TraceRow, index: number, key: string): void {
  if (key === 'ArrowRight') {
    if (row.hasChildren && !row.expanded) nav.toggle(row)
    else if (row.expanded) void nav.focusRow(nav.rows[index + 1]?.span.id ?? row.span.id)
  } else if (row.expanded && !nav.filtering) nav.toggle(row)
  else if (row.parentId) void nav.focusRow(row.parentId)
}

function onRowKey(nav: TraceNav, event: KeyboardEvent, index: number, key: string): void {
  const row = nav.rows[index]
  if (!row) return
  const target = rowTarget(nav.rows, index, key)
  const side = key === 'ArrowRight' || key === 'ArrowLeft'
  const confirm = key === 'Enter' || key === ' '
  if (target === null && !side && !confirm) return
  event.preventDefault()
  if (target) void nav.focusRow(target.span.id)
  else if (side) sideStep(nav, row, index, key)
  else if (confirm) nav.pick(row.span.id)
}

function onBarKey(nav: TraceNav, event: KeyboardEvent, id: string, key: string): void {
  const target = barTarget(nav.order, id, key)
  if (target === null && key !== 'Enter' && key !== ' ') return
  event.preventDefault()
  if (target === null) nav.pick(id)
  else if (target) void nav.focusRow(target)
}

export function useTraceNavigation(options: UseTraceNavigationOptions): UseTraceNavigationReturn {
  const { gridEl, rows, shown, collapsed, focusedId, current } = options
  const dir = useDirection(gridEl)

  const focusRow = async (id: string): Promise<void> => {
    focusedId.value = id
    await nextTick()
    gridEl.value?.querySelector<HTMLElement>(`[data-span-id="${CSS.escape(id)}"]`)?.focus()
  }

  const toggle = (row: TraceRow): void => {
    if (!row.hasChildren || shown.value) return
    const next = new Set(collapsed.value)
    if (next.has(row.span.id)) next.delete(row.span.id)
    else next.add(row.span.id)
    collapsed.value = next
  }

  const pick = (id: string): void => {
    focusedId.value = id
    current.value = current.value === id ? '' : id
  }

  const close = (): void => {
    const id = current.value
    current.value = ''
    const reachable = options.timeline()
      ? options.timelineOrder.value.includes(id)
      : rows.value.some((row) => row.span.id === id)
    if (id && reachable) void focusRow(id)
  }

  const navOf = (): TraceNav => ({
    rows: rows.value,
    order: options.timelineOrder.value,
    filtering: Boolean(shown.value),
    focusRow,
    toggle,
    pick
  })

  useElementListener(gridEl, 'click', (event) => {
    const id = spanElement(event)?.dataset['spanId']
    if (id) pick(id)
  })
  useElementListener(gridEl, 'keydown', (event) => {
    const element = spanElement(event)
    const id = element?.dataset['spanId']
    if (!element || !id) return
    const key = logicalArrowKey(event.key, dir.value)
    const nav = navOf()
    if (element.getAttribute('role') === 'option') return onBarKey(nav, event, id, key)
    onRowKey(
      nav,
      event,
      nav.rows.findIndex((row) => row.span.id === id),
      key
    )
  })
  useElementListener(gridEl, 'focusin', (event) => {
    const id = spanElement(event)?.dataset['spanId']
    if (id) focusedId.value = id
  })

  return { toggle, close }
}
