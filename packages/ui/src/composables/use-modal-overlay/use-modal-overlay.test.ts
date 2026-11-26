import { describe, expect, it, vi } from 'vitest'
import { effectScope, type MaybeRefOrGetter, nextTick, ref } from 'vue'

import { type ModalOverlayContext, useModalOverlay } from './use-modal-overlay'

function setup(dismissible = true, modal?: MaybeRefOrGetter<boolean>) {
  const open = ref(true)
  const overlay: ModalOverlayContext = {
    isOpen: open,
    dismissible,
    dismiss: vi.fn(),
    triggerEl: ref(null),
    returnFocusEl: ref(null)
  }
  const scope = effectScope()
  const result = scope.run(() => useModalOverlay(overlay, ref(null), { exitMs: 0, modal }))!
  return { overlay, open, scope, ...result }
}

const pressEscape = () => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
  document.dispatchEvent(event)
  return event
}

function button() {
  const el = document.createElement('button')
  document.body.append(el)
  return el
}

describe('useModalOverlay', () => {
  it('reports the open state, and false with no context', () => {
    const shown = setup()
    expect(shown.isOpen.value).toBe(true)
    expect(shown.isPresent.value).toBe(true)
    shown.scope.stop()

    const scope = effectScope()
    const none = scope.run(() => useModalOverlay(undefined, ref(null), { exitMs: 0 }))!
    expect(none.isOpen.value).toBe(false)
    expect(none.isPresent.value).toBe(false)
    scope.stop()
  })

  it('dismisses the top open overlay on Escape and claims the key', () => {
    const { overlay, scope } = setup()
    const event = pressEscape()
    expect(overlay.dismiss).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
    scope.stop()
  })

  it('ignores Escape when closed, under a later overlay, or not dismissible', () => {
    const closed = setup()
    closed.open.value = false
    pressEscape()
    expect(closed.overlay.dismiss).not.toHaveBeenCalled()
    closed.scope.stop()

    const under = setup()
    const over = setup()
    pressEscape()
    expect(under.overlay.dismiss).not.toHaveBeenCalled()
    expect(over.overlay.dismiss).toHaveBeenCalledTimes(1)
    over.scope.stop()
    under.scope.stop()

    const fixed = setup(false)
    expect(pressEscape().defaultPrevented).toBe(false)
    expect(fixed.overlay.dismiss).not.toHaveBeenCalled()
    fixed.scope.stop()
  })

  it('stops listening when its scope is disposed', () => {
    const { overlay, scope } = setup()
    scope.stop()
    pressEscape()
    expect(overlay.dismiss).not.toHaveBeenCalled()
  })

  it('dismisses on a backdrop click only when dismissible', () => {
    const shown = setup()
    shown.onBackdropClick()
    expect(shown.overlay.dismiss).toHaveBeenCalledTimes(1)
    shown.scope.stop()

    const fixed = setup(false)
    fixed.onBackdropClick()
    expect(fixed.overlay.dismiss).not.toHaveBeenCalled()
    fixed.scope.stop()
  })

  it('locks page scroll while open, unless it is not modal', async () => {
    const modal = setup()
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    modal.open.value = false
    await nextTick()
    expect(document.body.style.overflow).not.toBe('hidden')
    modal.scope.stop()

    const modeless = setup(true, false)
    await nextTick()
    expect(document.body.style.overflow).not.toBe('hidden')
    modeless.scope.stop()
  })

  it('returns focus to the trigger on close, or to the element focused before it opened', async () => {
    const withTrigger = setup()
    const trigger = button()
    withTrigger.overlay.triggerEl.value = trigger
    withTrigger.overlay.returnFocusEl.value = button()
    withTrigger.open.value = false
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(trigger)
    withTrigger.scope.stop()

    const withoutTrigger = setup()
    const previous = button()
    withoutTrigger.overlay.returnFocusEl.value = previous
    withoutTrigger.open.value = false
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(previous)
    withoutTrigger.scope.stop()
  })
})
