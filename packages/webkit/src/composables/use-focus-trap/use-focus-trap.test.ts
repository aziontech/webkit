import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { useFocusTrap } from './index'

describe('useFocusTrap', () => {
  it('listens for Tab on the document only while active, and keeps Tab inside', async () => {
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')
    const keydowns = (spy: typeof add) =>
      spy.mock.calls.filter(([type]) => type === 'keydown').length
    const active = ref(false)
    const Host = defineComponent({
      setup() {
        const container = ref<HTMLElement | null>(null)
        useFocusTrap(container, active)
        return () =>
          h('div', { ref: container }, [
            h('button', { type: 'button' }, 'First'),
            h('button', { type: 'button' }, 'Last')
          ])
      }
    })
    try {
      const { getByRole } = render(Host)
      await nextTick()
      expect(keydowns(add)).toBe(0)
      active.value = true
      await nextTick()
      await nextTick()
      expect(keydowns(add)).toBe(1)
      const last = getByRole('button', { name: 'Last' })
      last.focus()
      last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
      expect(document.activeElement).toBe(getByRole('button', { name: 'First' }))
      active.value = false
      await nextTick()
      expect(keydowns(remove)).toBe(1)
    } finally {
      vi.restoreAllMocks()
    }
  })

  it('wraps from the last tabbable member when the trap ends in a roving-tabindex group', async () => {
    const active = ref(false)
    const Host = defineComponent({
      setup() {
        const container = ref<HTMLElement | null>(null)
        useFocusTrap(container, active)
        return () =>
          h('div', { ref: container }, [
            h('button', { type: 'button' }, 'First'),
            h('button', { type: 'button', disabled: true }, 'Disabled'),
            h('div', { inert: '' }, [h('button', { type: 'button' }, 'Inert')]),
            h('button', { type: 'button', hidden: true }, 'Hidden'),
            h('div', { role: 'radiogroup', 'aria-label': 'Theme' }, [
              h(
                'button',
                { type: 'button', role: 'radio', 'aria-checked': 'true', tabindex: 0 },
                'Dark'
              ),
              h(
                'button',
                { type: 'button', role: 'radio', 'aria-checked': 'false', tabindex: -1 },
                'Light'
              )
            ])
          ])
      }
    })
    const { getByRole, getByText } = render(Host)
    active.value = true
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(getByRole('button', { name: 'First' }))
    const dark = getByRole('radio', { name: 'Dark' })
    dark.focus()
    dark.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement).toBe(getByRole('button', { name: 'First' }))
    const first = getByRole('button', { name: 'First' })
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
    expect(document.activeElement).toBe(dark)
    expect(getByText('Inert')).toBeTruthy()
    active.value = false
    await nextTick()
  })
})
