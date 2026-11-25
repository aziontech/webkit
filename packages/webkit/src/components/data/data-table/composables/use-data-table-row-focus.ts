import type { Row } from '@tanstack/vue-table'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  nextTick,
  onScopeDispose,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'
import { useDataTableRowTabOrder } from './use-data-table-row-tab-order'

type RowRecord = Record<string, unknown>
type TableRowItem = Row<RowRecord>

export interface DataTableRowFocusHost {
  active: MaybeRefOrGetter<boolean>
  tree: MaybeRefOrGetter<boolean>
  rows: MaybeRefOrGetter<TableRowItem[]>
  index: ComputedRef<Map<string, number>>
  root: () => HTMLElement | null
  scrollTo: (index: number) => boolean
  selectable: () => boolean
  canActivate: () => boolean
  activate: (event: KeyboardEvent, row: TableRowItem) => void
  canRemove: () => boolean
  remove: (event: KeyboardEvent, row: TableRowItem) => void
}

export interface UseDataTableRowFocusReturn {
  tabStop: ComputedRef<string | undefined>
  placement: ComputedRef<Map<string, { setsize: number; posinset: number }>>
  toggle: (row: TableRowItem, open?: boolean) => void
  onFocusin: (row: TableRowItem) => void
  onKeydown: (event: KeyboardEvent, row: TableRowItem) => void
}

const placementOf = (rows: TableRowItem[]): Map<string, { setsize: number; posinset: number }> => {
  const placement = new Map<string, { setsize: number; posinset: number }>()
  const groups = new Map<string, string[]>()
  for (const row of rows) {
    const key = row.parentId ?? ''
    const group = groups.get(key) ?? []
    group.push(row.id)
    groups.set(key, group)
  }
  for (const group of groups.values())
    group.forEach((id, index) => placement.set(id, { setsize: group.length, posinset: index + 1 }))
  return placement
}

const rowIn = (root: HTMLElement | null, id: string): HTMLElement | undefined =>
  Array.from(root?.querySelectorAll<HTMLElement>('[data-focus-row]') ?? []).find(
    (el) => el.getAttribute('data-focus-row') === id
  )

const focusLost = (): boolean => {
  const active = globalThis.document?.activeElement
  return !active || active === globalThis.document.body
}

const treeKey = (
  key: string,
  row: TableRowItem,
  next: TableRowItem | undefined,
  toggle: (row: TableRowItem, open?: boolean) => void,
  focus: (id: string) => void
): void => {
  if (key === 'ArrowRight') {
    if (row.getCanExpand() && !row.getIsExpanded()) toggle(row, true)
    else if (row.getIsExpanded() && next) focus(next.id)
  } else if (row.getIsExpanded()) toggle(row, false)
  else {
    const parent = row.getParentRow()
    if (parent) focus(parent.id)
  }
}

const MOVES: Partial<Record<string, (index: number, count: number) => number>> = {
  ArrowDown: (index) => index + 1,
  ArrowUp: (index) => index - 1,
  Home: () => 0,
  End: (_, count) => count - 1
}

const enterKey = (
  host: DataTableRowFocusHost,
  event: KeyboardEvent,
  row: TableRowItem,
  toggle: (row: TableRowItem, open?: boolean) => void
): void => {
  if (toValue(host.tree) && row.getCanExpand()) {
    event.preventDefault()
    toggle(row)
  } else if (host.canActivate()) {
    event.preventDefault()
    host.activate(event, row)
  }
}

const rowKeydown = (
  host: DataTableRowFocusHost,
  event: KeyboardEvent,
  row: TableRowItem,
  toggle: (row: TableRowItem, open?: boolean) => void,
  focus: (id: string) => void
): void => {
  if (!toValue(host.active) || event.target !== event.currentTarget) return
  if (event.altKey || event.ctrlKey || event.metaKey) return
  const list = toValue(host.rows)
  const index = host.index.value.get(row.id) ?? -1
  const key = logicalArrowKey(event.key, eventDirection(event))
  const move = MOVES[key]
  if (move) {
    event.preventDefault()
    const target = list[move(index, list.length)]
    if (target) focus(target.id)
  } else if (key === 'ArrowRight' || key === 'ArrowLeft') {
    if (!toValue(host.tree)) return
    event.preventDefault()
    treeKey(key, row, list[index + 1], toggle, focus)
  } else actionKey(host, event, key, row, toggle)
}

const waitForFocusLoss = (attempt: number): boolean =>
  attempt < 60 &&
  (Boolean(globalThis.document?.querySelector('[aria-modal="true"]')) || !focusLost())

const refocus = (
  host: DataTableRowFocusHost,
  focusId: Ref<string | null>,
  focusedIndex: number,
  focus: (id: string) => void,
  attempt: number
): boolean => {
  const list = toValue(host.rows)
  const id = focusId.value
  if (!id || host.index.value.has(id) || focusedIndex < 0) return false
  if (waitForFocusLoss(attempt)) return true
  if (!focusLost()) return false
  const target = list[focusedIndex] ?? list[focusedIndex - 1]
  if (target) focus(target.id)
  else {
    focusId.value = null
    host.root()?.querySelector<HTMLElement>('[data-focus-table]')?.focus()
  }
  return false
}

const actionKey = (
  host: DataTableRowFocusHost,
  event: KeyboardEvent,
  key: string,
  row: TableRowItem,
  toggle: (row: TableRowItem, open?: boolean) => void
): void => {
  if (key === 'Enter') enterKey(host, event, row, toggle)
  else if (key === ' ' && host.selectable() && row.getCanSelect()) {
    event.preventDefault()
    row.toggleSelected()
  } else if ((key === 'Delete' || key === 'Backspace') && host.canRemove() && !event.shiftKey) {
    event.preventDefault()
    host.remove(event, row)
  }
}

export function useDataTableRowFocus(host: DataTableRowFocusHost): UseDataTableRowFocusReturn {
  const focusId = ref<string | null>(null)
  let focusedIndex = -1
  const rowEl = (id: string): HTMLElement | undefined => rowIn(host.root(), id)
  const focusRow = async (id: string): Promise<void> => {
    focusId.value = id
    await nextTick()
    let el = rowEl(id)
    const index = host.index.value.get(id)
    if (!el && index !== undefined && host.scrollTo(index)) {
      await nextTick()
      el = rowEl(id)
    }
    el?.focus()
  }
  const focus = (id: string): void => void focusRow(id)
  const toggle = (row: TableRowItem, open?: boolean): void => {
    const holder = globalThis.document?.activeElement
      ?.closest?.('[data-tree-row]')
      ?.getAttribute('data-tree-row')
    const closing = open === false || (open === undefined && row.getIsExpanded())
    const inside =
      closing && holder !== undefined && holder !== row.id
        ? row.getLeafRows().some((leaf) => leaf.id === holder)
        : false
    row.toggleExpanded(open)
    if (inside) focus(row.id)
  }
  let frame = 0
  const focusAfterRemoval = (attempt = 0): void => {
    if (refocus(host, focusId, focusedIndex, focus, attempt))
      frame = globalThis.requestAnimationFrame(() => focusAfterRemoval(attempt + 1))
  }
  onScopeDispose(() => globalThis.cancelAnimationFrame?.(frame))
  watch(
    () => host.index.value,
    () => {
      if (!toValue(host.active) || !focusId.value || host.index.value.has(focusId.value)) return
      if (typeof globalThis.requestAnimationFrame !== 'function') return
      void nextTick(() => focusAfterRemoval())
    },
    { flush: 'post' }
  )
  const tabStop = computed(() => {
    if (!toValue(host.active)) return undefined
    const id = focusId.value
    return id && host.index.value.has(id) ? id : toValue(host.rows)[0]?.id
  })
  useDataTableRowTabOrder({ active: host.active, rows: host.rows, tabStop, root: host.root })
  return {
    tabStop,
    placement: computed(() => (toValue(host.tree) ? placementOf(toValue(host.rows)) : new Map())),
    toggle,
    onFocusin: (row) => {
      focusId.value = row.id
      focusedIndex = host.index.value.get(row.id) ?? -1
    },
    onKeydown: (event, row) => rowKeydown(host, event, row, toggle, focus)
  }
}
