import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import DeviceAuthorization from '../../blocks/auth/auth-sign-in/variants/device-authorization.vue'
import PromptInputDefault from '../../examples/prompt-input/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

describe('the empty prompt composer on a phone', () => {
  it.each([280, 326, 358, 382, 448, 528])(
    'keeps the text field at least 10rem wide in a %ipx column',
    async (width) => {
      const view = render(() => h('div', { style: `width: ${width}px` }, [h(PromptInputDefault)]))
      await frame()
      await frame()
      const textarea = view.getByTestId('prompt-input__textarea')
      const box = view.getByTestId('prompt-input__box').getBoundingClientRect()
      const field = textarea.getBoundingClientRect()
      expect(field.width).toBeGreaterThanOrEqual(160)
      expect(field.right).toBeLessThanOrEqual(box.right + 1)
      expect(textarea.clientHeight).toBeLessThan(80)
    }
  )
})

describe('the device authorization card on a phone', () => {
  it.each([320, 390])('shows the whole Enter the code link at %ipx', async (width) => {
    const view = render(() =>
      h('div', { style: `width: ${width - 32}px` }, [h(DeviceAuthorization)])
    )
    await frame()
    const link = view.getByRole('button', { name: 'Enter the code' })
    const card = link.closest('section')!.getBoundingClientRect()
    const box = link.getBoundingClientRect()
    expect(box.right).toBeLessThanOrEqual(card.right + 1)
    expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth + 1)
  })
})
