import './reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { defineComponent, h } from 'vue'

import SettingsCannedResponses from '../../blocks/settings/settings-canned-responses/settings-canned-responses.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

afterEach(async () => {
  await page.viewport(414, 896)
})

describe('settings blocks, styled layout', () => {
  it('shows every canned-responses column whole in the 930px table a 1280 console leaves it', async () => {
    await page.viewport(1280, 900)
    await vi.waitFor(() => expect(window.innerWidth).toBe(1280))
    const view = render(
      defineComponent({
        setup: () => () => h('div', { style: { width: '980px' } }, [h(SettingsCannedResponses)])
      })
    )
    const uses = await waitFor(() => view.getByRole('columnheader', { name: /Uses/ }))
    await frame()
    await frame()
    const viewport = view.getByTestId('data-table__viewport')
    expect(viewport.clientWidth).toBe(930)
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
    const actions = view
      .getAllByRole('columnheader')
      .find((header) => header.getAttribute('data-frozen') === 'end')!
    expect(uses.getBoundingClientRect().right).toBeLessThanOrEqual(
      actions.getBoundingClientRect().left + 1
    )
  })
})
