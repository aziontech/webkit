import { type ComputedRef, nextTick, type Ref } from 'vue'

import { type AttributeEditorKeys, moveWithin, removeFrom, rowSelector } from '../lib/rows'
import type { AttributeEditorColumn } from '../types'

type RowEvent = MouseEvent | KeyboardEvent

export interface UseAttributeEditorRowsReturn {
  add: (event: MouseEvent, groupIndex?: number) => void
  addGroup: (event: MouseEvent) => void
  remove: (event: RowEvent, index: number, groupIndex?: number) => void
  update: (index: number, groupIndex: number | undefined, key: string, value: unknown) => void
  moveRow: (index: number, groupIndex: number | undefined, to: number) => void
  moveGroup: (groupIndex: number, to: number) => void
  onGripKeydown: (event: KeyboardEvent, index: number, groupIndex: number | undefined) => void
  onGroupGripKeydown: (event: KeyboardEvent, groupIndex: number) => void
  onRowKeydown: (event: KeyboardEvent, index: number, groupIndex: number | undefined) => void
}

export interface AttributeEditorRowsWiring<TItem> {
  grouped: ComputedRef<boolean>
  groupList: ComputedRef<TItem[][]>
  total: ComputedRef<number>
  keys: AttributeEditorKeys
  cloneGroups: () => TItem[][]
  commit: (next: TItem[][], message?: () => string) => void
  position: (index: number, groupIndex: number | undefined) => number
  removable: (item: TItem) => boolean
  say: (key: 'added' | 'removed' | 'moved' | 'groupMoved', params: Record<string, number>) => string
  onAdd: (event: MouseEvent, detail: { index: number; groupIndex?: number }) => void
  onRemove: (event: RowEvent, detail: { index: number; item: TItem; groupIndex?: number }) => void
  rootEl: Ref<HTMLElement | null>
  addEl: Ref<{ $el?: HTMLElement } | null>
}

const FOCUSABLE =
  'input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex="0"]'

async function focusRow(
  rootEl: Ref<HTMLElement | null>,
  addEl: Ref<{ $el?: HTMLElement } | null>,
  selector: string
) {
  await nextTick()
  const row = rootEl.value?.querySelector<HTMLElement>(selector)
  const target = row?.querySelector<HTMLElement>(FOCUSABLE)
  if (target) target.focus()
  else addEl.value?.$el?.focus()
}

type MoveProps = { reorderable: boolean; disabled: boolean }

const offsetOf = (event: KeyboardEvent) =>
  event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0

async function restoreFocus(root: HTMLElement | null, active: Element | null, fallback: string) {
  await nextTick()
  if (
    active instanceof HTMLElement &&
    active.isConnected &&
    root?.contains(active) &&
    !active.matches(':disabled')
  ) {
    if (document.activeElement !== active) active.focus()
    return
  }
  root?.querySelector<HTMLElement>(fallback)?.focus()
}

function moveRowIn<TItem>(
  w: AttributeEditorRowsWiring<TItem>,
  props: MoveProps,
  index: number,
  groupIndex: number | undefined,
  to: number
) {
  if (!props.reorderable || props.disabled) return
  const target = groupIndex ?? 0
  const group = w.groupList.value[target]
  if (!group || to < 0 || to >= group.length || to === index) return
  const active = document.activeElement
  const next = w.cloneGroups()
  moveWithin(next[target] ?? [], index, to)
  w.commit(next, () =>
    w.say('moved', { from: w.position(index, groupIndex), to: w.position(to, groupIndex) })
  )
  restoreFocus(w.rootEl.value, active, `${rowSelector(to, groupIndex)} [data-reorder=grip]`)
}

function moveGroupIn<TItem>(
  w: AttributeEditorRowsWiring<TItem>,
  props: MoveProps,
  groupIndex: number,
  to: number
) {
  if (!props.reorderable || props.disabled || !w.grouped.value) return
  if (to < 0 || to >= w.groupList.value.length || to === groupIndex) return
  const active = document.activeElement
  const next = w.cloneGroups()
  moveWithin(next, groupIndex, to)
  w.commit(next, () => w.say('groupMoved', { from: groupIndex + 1, to: to + 1 }))
  restoreFocus(w.rootEl.value, active, `[data-group-index="${to}"] [data-reorder=group-grip]`)
}

const onArrow = (event: KeyboardEvent, move: (offset: number) => void, stop = true) => {
  const offset = offsetOf(event)
  if (!offset) return
  event.preventDefault()
  if (stop) event.stopPropagation()
  move(offset)
}

const newItem = <TItem>(props: {
  newItem?: () => TItem
  definition: AttributeEditorColumn[]
}): TItem =>
  props.newItem
    ? props.newItem()
    : (Object.fromEntries(props.definition.map((column) => [column.key, ''])) as TItem)

export function useAttributeEditorRows<TItem extends object>(
  props: { newItem?: () => TItem; definition: AttributeEditorColumn[] } & MoveProps,
  w: AttributeEditorRowsWiring<TItem>
): UseAttributeEditorRowsReturn {
  const createItem = () => newItem(props)

  const add = (event: MouseEvent, groupIndex?: number) => {
    const next = w.cloneGroups()
    const target = groupIndex ?? 0
    if (!next[target]) next[target] = []
    next[target].push(createItem())
    const index = next[target].length - 1
    w.commit(next, () => w.say('added', { index: w.position(index, groupIndex) }))
    w.onAdd(event, groupIndex === undefined ? { index } : { index, groupIndex })
    focusRow(w.rootEl, w.addEl, rowSelector(index, groupIndex))
  }

  const addGroup = (event: MouseEvent) => {
    const next = [...w.cloneGroups(), [createItem()]]
    const groupIndex = next.length - 1
    w.commit(next, () => w.say('added', { index: w.total.value + 1 }))
    w.onAdd(event, { index: 0, groupIndex })
    focusRow(w.rootEl, w.addEl, rowSelector(0, groupIndex))
  }

  const remove = (event: RowEvent, index: number, groupIndex?: number) => {
    const target = groupIndex ?? 0
    const item = w.groupList.value[target]?.[index]
    if (!item || !w.removable(item)) return
    const spoken = w.position(index, groupIndex)
    const { next, focus } = removeFrom(w.cloneGroups(), target, index, w.grouped.value)
    w.commit(next, () => w.say('removed', { index: spoken }))
    w.onRemove(event, groupIndex === undefined ? { index, item } : { index, item, groupIndex })
    focusRow(w.rootEl, w.addEl, focus)
  }

  const update = (index: number, groupIndex: number | undefined, key: string, value: unknown) => {
    const target = groupIndex ?? 0
    const current = w.groupList.value[target]?.[index]
    if (!current) return
    const changed = { ...current, [key]: value } as TItem
    w.keys.keep(changed, current)
    const next = w.cloneGroups()
    next[target][index] = changed
    w.commit(next)
  }

  return {
    add,
    addGroup,
    remove,
    update,
    moveRow: (index, groupIndex, to) => moveRowIn(w, props, index, groupIndex, to),
    moveGroup: (groupIndex, to) => moveGroupIn(w, props, groupIndex, to),
    onGripKeydown: (event, index, groupIndex) =>
      onArrow(event, (offset) => moveRowIn(w, props, index, groupIndex, index + offset)),
    onGroupGripKeydown: (event, groupIndex) =>
      onArrow(event, (offset) => moveGroupIn(w, props, groupIndex, groupIndex + offset)),
    onRowKeydown: (event, index, groupIndex) => {
      if (!props.reorderable || !event.altKey || event.defaultPrevented) return
      onArrow(event, (offset) => moveRowIn(w, props, index, groupIndex, index + offset), false)
    }
  }
}
