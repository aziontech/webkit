import { type ComputedRef, type Ref, ref } from 'vue'

import type { UseTranslateReturn } from '../../../../composables/use-translate'
import type { DataTableReorderView } from '../injection-key'

const REORDER_EDGE = 32

export type ReorderMove = (
  event: KeyboardEvent | PointerEvent,
  id: string,
  targetId: string,
  message: 'moved' | 'dropped'
) => void

export interface DataTableReorderPointerOptions {
  locked: () => boolean
  canMove: (id: string) => boolean
  move: ReorderMove
  message: Ref<string>
  orderedIds: ComputedRef<string[]>
  t: UseTranslateReturn['t']
  root: () => HTMLElement | null
  viewport: () => HTMLElement | undefined
}

export interface UseDataTableReorderPointerReturn {
  cancel: (event: KeyboardEvent) => boolean
  handlers: Pick<
    DataTableReorderView,
    'dragId' | 'dropOf' | 'onPointerdown' | 'onPointermove' | 'onPointerup' | 'onPointercancel'
  >
}

const scrollNearEdge = (viewport: HTMLElement | undefined, clientY: number): void => {
  if (!viewport) return
  const box = viewport.getBoundingClientRect()
  if (clientY < box.top + REORDER_EDGE) viewport.scrollTop -= REORDER_EDGE / 2
  else if (clientY > box.bottom - REORDER_EDGE) viewport.scrollTop += REORDER_EDGE / 2
}

export function useDataTableReorderPointer(
  o: DataTableReorderPointerOptions
): UseDataTableReorderPointerReturn {
  const dragId = ref<string | null>(null)
  const overId = ref<string | null>(null)
  const reset = (): void => {
    dragId.value = null
    overId.value = null
  }
  return {
    cancel: (event) => {
      if (event.key !== 'Escape' || !dragId.value) return false
      reset()
      o.message.value = o.t('dataTable.reorderCancelled')
      event.preventDefault()
      return true
    },
    handlers: {
      dragId,
      dropOf: (id) => {
        if (!dragId.value || overId.value !== id || dragId.value === id) return undefined
        const ids = o.orderedIds.value
        return ids.indexOf(dragId.value) < ids.indexOf(id) ? 'after' : 'before'
      },
      onPointerdown: (event, id) => {
        if (o.locked() || event.button !== 0 || !o.canMove(id)) return
        const handle = event.currentTarget as HTMLElement
        if (event.isTrusted) handle.setPointerCapture(event.pointerId)
        event.preventDefault()
        handle.focus()
        dragId.value = id
        overId.value = id
      },
      onPointermove: (event) => {
        if (!dragId.value) return
        const hit = globalThis.document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest<HTMLElement>('[data-reorder-row]')
        const hitId = hit && o.root()?.contains(hit) ? hit.getAttribute('data-reorder-row') : null
        if (hitId && o.canMove(hitId)) overId.value = hitId
        scrollNearEdge(o.viewport(), event.clientY)
      },
      onPointerup: (event) => {
        const id = dragId.value
        const target = overId.value
        reset()
        if (id && target && target !== id) o.move(event, id, target, 'dropped')
      },
      onPointercancel: reset
    }
  }
}
