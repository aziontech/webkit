import { onScopeDispose, readonly, type Ref, ref } from 'vue'

export interface PointerDragOptions {
  onMove: (event: globalThis.PointerEvent) => void
  captureEl?: globalThis.Element | null
  cursor?: string
}

export interface UsePointerDragReturn {
  dragging: Readonly<Ref<boolean>>
  startDrag: (event: globalThis.PointerEvent, options: PointerDragOptions) => void
}

export function usePointerDrag(): UsePointerDragReturn {
  const dragging = ref(false)
  let stopDrag: (() => void) | null = null

  const startDrag = (
    event: globalThis.PointerEvent,
    { onMove, captureEl, cursor }: PointerDragOptions
  ) => {
    const body = globalThis.document.body
    dragging.value = true
    captureEl?.setPointerCapture?.(event.pointerId)
    body.style.userSelect = 'none'
    if (cursor) body.style.cursor = cursor

    stopDrag = () => {
      dragging.value = false
      body.style.removeProperty('user-select')
      if (cursor) body.style.removeProperty('cursor')
      globalThis.window.removeEventListener('pointermove', onMove)
      globalThis.window.removeEventListener('pointerup', stopDrag as () => void)
      globalThis.window.removeEventListener('pointercancel', stopDrag as () => void)
      stopDrag = null
    }

    globalThis.window.addEventListener('pointermove', onMove)
    globalThis.window.addEventListener('pointerup', stopDrag)
    globalThis.window.addEventListener('pointercancel', stopDrag)
    event.preventDefault()
  }

  onScopeDispose(() => stopDrag?.())

  return { dragging: readonly(dragging), startDrag }
}
