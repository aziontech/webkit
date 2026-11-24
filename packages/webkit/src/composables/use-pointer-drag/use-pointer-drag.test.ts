import { describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'

import { usePointerDrag, type UsePointerDragReturn } from './use-pointer-drag'

const pointer = (type: string, init: { clientX?: number } = {}) =>
  new PointerEvent(type, { pointerId: 1, cancelable: true, ...init })

function mount() {
  const scope = effectScope()
  let drag!: UsePointerDragReturn
  scope.run(() => {
    drag = usePointerDrag()
  })
  return { scope, drag }
}

describe('usePointerDrag', () => {
  it('reports moves while the drag lasts and stops on pointerup', () => {
    const { drag, scope } = mount()
    const onMove = vi.fn()
    const down = pointer('pointerdown')

    drag.startDrag(down, { onMove })
    expect(drag.dragging.value).toBe(true)
    expect(down.defaultPrevented).toBe(true)
    expect(document.body.style.userSelect).toBe('none')

    window.dispatchEvent(pointer('pointermove', { clientX: 12 }))
    expect(onMove).toHaveBeenCalledTimes(1)

    window.dispatchEvent(pointer('pointerup'))
    expect(drag.dragging.value).toBe(false)
    expect(document.body.style.userSelect).toBe('')

    window.dispatchEvent(pointer('pointermove'))
    expect(onMove).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('sets the cursor for the drag and clears it on pointercancel', () => {
    const { drag, scope } = mount()
    drag.startDrag(pointer('pointerdown'), { onMove: () => {}, cursor: 'col-resize' })
    expect(document.body.style.cursor).toBe('col-resize')
    window.dispatchEvent(pointer('pointercancel'))
    expect(document.body.style.cursor).toBe('')
    scope.stop()
  })

  it('ends a running drag when its scope is disposed', () => {
    const { drag, scope } = mount()
    const onMove = vi.fn()
    drag.startDrag(pointer('pointerdown'), { onMove })
    scope.stop()
    expect(drag.dragging.value).toBe(false)
    window.dispatchEvent(pointer('pointermove'))
    expect(onMove).not.toHaveBeenCalled()
  })
})
