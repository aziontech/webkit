import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Switcher from '../../blocks/platform/dashboard/dashboard-switcher/dashboard-switcher.vue'
import SwitcherEmpty from '../../blocks/platform/dashboard/dashboard-switcher/variants/empty.vue'
import SwitcherFailed from '../../blocks/platform/dashboard/dashboard-switcher/variants/failed.vue'
import SwitcherOwnPeriod from '../../blocks/platform/dashboard/dashboard-switcher/variants/own-period.vue'
import Home from '../../blocks/platform/dashboard/home-dashboard/home-dashboard.vue'
import HomeFailed from '../../blocks/platform/dashboard/home-dashboard/variants/failed.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

afterEach(() => cleanup())

const byTestId = (id: string, root: Document | HTMLElement = document) =>
  root.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined

describe('platform/dashboard/dashboard-switcher', () => {
  it('sets the shared period with FilterMenu and shows it as a removable chip', async () => {
    const view = render(Switcher)
    const trigger = byTestId('data-filter-menu', view.container)
    expect(trigger).not.toBeNull()
    expect(view.container.querySelector('[aria-label="Filter, 1 applied"]')).not.toBeNull()
    const chip = byTestId('data-filter-menu-chips__chip-period', view.container)!
    expect(chip.textContent).toContain('Last 24 hours')
    const remove =
      chip.querySelector<HTMLElement>('[data-testid$="__remove"]') ??
      [...chip.querySelectorAll<HTMLElement>('button')].at(-1)!
    await fireEvent.click(remove)
    await waitFor(() =>
      expect(byTestId('data-filter-menu-chips__chip-period', view.container)).toBeNull()
    )
    expect(view.container.textContent).toContain('vs previous 24 hours')
  })

  it('hides the shared filter for a dashboard that owns its period', () => {
    const view = render(SwitcherOwnPeriod)
    expect(byTestId('data-filter-menu', view.container)).toBeNull()
    expect(view.getByRole('radiogroup', { name: 'Quarter' })).toBeTruthy()
  })

  it('shows a Retry alert in each card when the body fails', () => {
    const view = render(SwitcherFailed)
    const retries = Array.from(view.container.querySelectorAll('button')).filter(
      (button) => button.textContent?.trim() === 'Retry'
    )
    expect(retries.length).toBe(2)
    expect(view.container.textContent).toContain("Couldn't load")
  })

  it('shows the empty state of the period when there is no data', () => {
    const view = render(SwitcherEmpty)
    expect(view.container.textContent).toContain('No data in this period')
    expect(buttonByText('Retry', view.container)).toBeUndefined()
  })
})

describe('platform/dashboard/home-dashboard', () => {
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
