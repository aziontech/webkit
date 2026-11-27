import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { type DialogTriggerContext, useDialogTrigger } from './use-dialog-trigger'

function mount() {
  const isOpen = ref(false)
  const overlay: DialogTriggerContext = { isOpen, open: vi.fn(), triggerEl: ref(null) }
  const view = render(
    defineComponent({
      setup() {
        const { aria, activate, onKeydown, onControl } = useDialogTrigger(overlay)
        return () =>
          h(
            'button',
            {
              ...aria.value,
              ref: (el) => onControl(el as HTMLElement | null),
              onClick: activate,
              onKeydown
            },
            [h('span', { 'data-testid': 'inner', tabindex: 0 })]
          )
      }
    })
  )
  return { isOpen, overlay, view, control: view.getByRole('button') }
}

describe('useDialogTrigger', () => {
  it('describes the control as a dialog opener and mirrors the open state', async () => {
    const { isOpen, control } = mount()
    expect(control.getAttribute('aria-haspopup')).toBe('dialog')
    expect(control.getAttribute('aria-expanded')).toBe('false')
    isOpen.value = true
    await Promise.resolve()
    expect(control.getAttribute('aria-expanded')).toBe('true')
  })

  it('opens the overlay on click, Enter and Space', async () => {
    const { overlay, control } = mount()
    await fireEvent.click(control)
    await fireEvent.keyDown(control, { key: 'Enter' })
    await fireEvent.keyDown(control, { key: ' ' })
    expect(overlay.open).toHaveBeenCalledTimes(3)
  })

  it('ignores other keys and keys pressed inside the control', async () => {
    const { overlay, control, view } = mount()
    await fireEvent.keyDown(control, { key: 'a' })
    await fireEvent.keyDown(view.getByTestId('inner'), { key: 'Enter' })
    expect(overlay.open).not.toHaveBeenCalled()
  })

  it('records the control and clears it on unmount', () => {
    const { overlay, control, view } = mount()
    expect(overlay.triggerEl.value).toBe(control)
    view.unmount()
    expect(overlay.triggerEl.value).toBeNull()
  })

  it('does nothing without an overlay', async () => {
    const view = render(
      defineComponent({
        setup() {
          const { aria, activate } = useDialogTrigger(undefined)
          return () => h('button', { ...aria.value, onClick: activate })
        }
      })
    )
    const control = view.getByRole('button')
    await fireEvent.click(control)
    expect(control.getAttribute('aria-expanded')).toBe('false')
  })
})
