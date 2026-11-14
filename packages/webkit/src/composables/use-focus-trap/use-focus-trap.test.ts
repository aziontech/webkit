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
})
