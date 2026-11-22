import { computed, type ComputedRef, nextTick, type Ref, ref, useId, watch } from 'vue'

import type { UseTranslateReturn } from '../../../../composables/use-translate'
import type { DataTableRecord, DataTableReorderView } from '../injection-key'
import { type ReorderMove, useDataTableReorderPointer } from './use-data-table-reorder-pointer'

export interface DataTableReorderOptions {
  active: () => boolean
  locked: () => boolean
  frozen: ComputedRef<boolean>
  data: Ref<DataTableRecord[]>
  rowKeyOf: (row: DataTableRecord) => string
  orderedIds: ComputedRef<string[]>
  nameKey: () => string | undefined
  canMoveRow: (row: DataTableRecord | undefined) => boolean
  t: UseTranslateReturn['t']
  root: () => HTMLElement | null
  viewport: () => HTMLElement | undefined
  emit: (
    event: KeyboardEvent | PointerEvent,
    payload: { from: number; to: number; row: DataTableRecord }
  ) => void
}

const KEY_TARGETS = ['ArrowUp', 'ArrowDown', 'Home', 'End']

const keyTarget = (key: string, ids: string[], id: string, movable: string[]): number => {
  const index = ids.indexOf(id)
  if (key === 'ArrowUp') return index - 1
  if (key === 'ArrowDown') return index + 1
  if (key === 'Home') return ids.indexOf(movable[0] ?? id)
  return ids.indexOf(movable[movable.length - 1] ?? id)
}

const focusHandleAfterMove = (o: DataTableReorderOptions): ((id: string) => void) => {
  let pending: string | null = null
  watch(
    o.data,
    () => {
      const id = pending
      if (!id) return
      pending = null
      void nextTick(() =>
        Array.from(o.root()?.querySelectorAll<HTMLElement>('[data-reorder-handle]') ?? [])
          .find((el) => el.getAttribute('data-reorder-handle') === id)
          ?.focus()
      )
    },
    { flush: 'post' }
  )
  return (id) => (pending = id)
}

const createMove = (
  o: DataTableReorderOptions,
  message: Ref<string>,
  nameOf: (id: string) => string
): ReorderMove => {
  const focusLater = focusHandleAfterMove(o)
  return (event, id, targetId, kind) => {
    const records = o.data.value
    const from = records.findIndex((row) => o.rowKeyOf(row) === id)
    const to = records.findIndex((row) => o.rowKeyOf(row) === targetId)
    if (from < 0 || to < 0 || from === to) return
    const next = [...records]
    const [moved] = next.splice(from, 1)
    if (!moved) return
    next.splice(to, 0, moved)
    message.value = o.t(kind === 'moved' ? 'dataTable.reorderMoved' : 'dataTable.reorderDropped', {
      name: nameOf(id),
      position: o.orderedIds.value.indexOf(targetId) + 1,
      total: o.orderedIds.value.length
    })
    focusLater(id)
    o.data.value = next
    o.emit(event, { from, to, row: moved })
  }
}

export function useDataTableReorder(o: DataTableReorderOptions): DataTableReorderView {
  const message = ref<string>('')
  const recordOf = (id: string): DataTableRecord | undefined =>
    o.data.value.find((row) => o.rowKeyOf(row) === id)
  const nameOf = (id: string): string => {
    const key = o.nameKey()
    const value = key ? recordOf(id)?.[key] : undefined
    return value === undefined || value === null || value === '' ? id : String(value)
  }
  const canMove = (id: string): boolean => o.canMoveRow(recordOf(id))
  const move = createMove(o, message, nameOf)
  const pointer = useDataTableReorderPointer({ ...o, canMove, move, message })
  return {
    active: computed(o.active),
    locked: computed(o.locked),
    frozen: o.frozen,
    hintId: `${useId()}-reorder-hint`,
    message: computed(() => message.value),
    orderedCount: computed(() => o.orderedIds.value.length),
    canMove,
    labelOf: (id, index) =>
      o.t('dataTable.reorderHandle', {
        name: nameOf(id),
        position: index + 1,
        total: o.orderedIds.value.length
      }),
    onKeydown: (event, id) => {
      if (pointer.cancel(event)) return
      if (o.locked() || !canMove(id) || !KEY_TARGETS.includes(event.key)) return
      const ids = o.orderedIds.value
      const target = keyTarget(event.key, ids, id, ids.filter(canMove))
      event.preventDefault()
      const targetId = ids[target]
      if (target === ids.indexOf(id) || targetId === undefined || !canMove(targetId)) return
      move(event, id, targetId, 'moved')
    },
    ...pointer.handlers
  }
}
