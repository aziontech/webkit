import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Home from '../../../../blocks/dashboard/home-dashboard/home-dashboard.vue'
import HomeFailed from '../../../../blocks/dashboard/home-dashboard/variants/error.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())
describe('dashboard/home-dashboard', () => {
  it('links every resource row and panel heading to a real destination', () => {
    const view = render(Home)
    const rows = view.getAllByRole('link', { name: /marketing-site/ })
    expect(rows.every((row) => row.getAttribute('href') === '/projects/4410203040')).toBe(true)
    expect(view.getByRole('link', { name: 'Projects' }).getAttribute('href')).toBe('/projects')
    expect(view.getByRole('link', { name: /Set up your coding agent/ }).getAttribute('href')).toBe(
      '/agents/setup'
    )
  })

  it('explains each usage tile with a focusable Hint', () => {
    const view = render(Home)
    const usage = view.getByRole('complementary', { name: 'Usage' })
    expect(usage.querySelectorAll('button').length).toBeGreaterThanOrEqual(4)
  })

  it('shows a Retry alert in the usage band and in every panel when Home fails', () => {
    const view = render(HomeFailed)
    const retries = Array.from(view.container.querySelectorAll('button')).filter(
      (button) => button.textContent?.trim() === 'Retry'
    )
    expect(retries.length).toBe(5)
    expect(view.queryByRole('link', { name: /marketing-site/ })).toBeNull()
  })
})
