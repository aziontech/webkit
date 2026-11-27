import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import { useModalRoot, type UseModalRootReturn } from './use-modal-root'

const setup = (dismissible = true, defaultOpen = false) => {
  const model = ref<boolean | undefined>(undefined)
  let modal: UseModalRootReturn | undefined
  render(
    defineComponent({
      setup() {
        modal = useModalRoot(model, { defaultOpen, dismissible })
        return () => null
      }
    })
  )
  return { model, modal: modal! }
}

describe('useModalRoot', () => {
  it('starts at defaultOpen and writes open and close to the model', () => {
    const { modal, model } = setup(true, true)
    expect(modal.isOpen.value).toBe(true)
    modal.close()
    expect(model.value).toBe(false)
    modal.open()
    expect(model.value).toBe(true)
  })

  it('dismisses only while dismissible', () => {
    const blocked = setup(false, true)
    blocked.modal.dismiss()
    expect(blocked.modal.isOpen.value).toBe(true)
    const allowed = setup(true, true)
    allowed.modal.dismiss()
    expect(allowed.modal.isOpen.value).toBe(false)
  })

  it('remembers the focused element when it opens', () => {
    const button = document.createElement('button')
    document.body.append(button)
    button.focus()
    const { modal } = setup()
    modal.open()
    expect(modal.returnFocusEl.value).toBe(button)
    button.remove()
  })

  it('tracks a mounted description and derives its title and description ids from one id', () => {
    const first = setup().modal
    expect(first.hasDescription.value).toBe(false)
    first.registerDescription()
    expect(first.hasDescription.value).toBe(true)
    first.unregisterDescription()
    expect(first.hasDescription.value).toBe(false)
    expect(first.titleId).toMatch(/-title$/)
    expect(first.titleId.replace(/-title$/, '')).toBe(
      first.descriptionId.replace(/-description$/, '')
    )
    expect(first.descriptionId).toMatch(/-description$/)
  })
})
