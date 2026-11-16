import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Switcher, {
  type DashboardSwitcherView
} from '../../../../blocks/dashboard/dashboard-switcher/dashboard-switcher.vue'
import SwitcherEmpty from '../../../../blocks/dashboard/dashboard-switcher/variants/empty.vue'
import SwitcherFailed from '../../../../blocks/dashboard/dashboard-switcher/variants/error.vue'
import SwitcherOwnPeriod from '../../../../blocks/dashboard/dashboard-switcher/variants/own-period.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const byTestId = (id: string, root: Document | HTMLElement = document) =>
  root.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined
describe('dashboard/dashboard-switcher', () => {
  it('sets the shared period with FilterMenu and shows it as a removable chip', async () => {
    const view = render(Switcher)
    const trigger = byTestId('filter-menu', view.container as HTMLElement)
    expect(trigger).not.toBeNull()
    expect(view.container.querySelector('[aria-label="Filter, 1 applied"]')).not.toBeNull()
    const chip = byTestId('filter-menu-chip-group__chip-period', view.container as HTMLElement)!
    expect(chip.textContent).toContain('Last 24 hours')
    const remove =
      chip.querySelector<HTMLElement>('[data-testid$="__remove"]') ??
      [...chip.querySelectorAll<HTMLElement>('button')].at(-1)!
    await fireEvent.click(remove)
    await waitFor(() =>
      expect(
        byTestId('filter-menu-chip-group__chip-period', view.container as HTMLElement)
      ).toBeNull()
    )
    expect(view.container.textContent).toContain('vs previous 24 hours')
  })

  it('hides the shared filter for a dashboard that owns its period', () => {
    const view = render(SwitcherOwnPeriod)
    expect(byTestId('filter-menu', view.container as HTMLElement)).toBeNull()
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
    expect(buttonByText('Retry', view.container as HTMLElement)).toBeUndefined()
  })

  it('renders the views and data it is given instead of the sample', () => {
    const views: DashboardSwitcherView[] = [
      {
        value: 'checkout',
        label: 'Checkout',
        group: 'Acme',
        figures: [{ id: 'orders', label: 'Orders', hint: 'Orders placed.', format: 'count' }],
        chart: {
          title: 'Orders over time',
          hint: 'Orders per hour.',
          form: 'line',
          format: 'count'
        },
        breakdown: { title: 'Top stores', hint: 'Stores with the most orders.', format: 'count' }
      }
    ]
    const view = render(Switcher, {
      props: {
        views,
        view: 'checkout',
        data: {
          figures: { orders: { value: 1200, delta: 2, trend: [1, 2] } },
          labels: [],
          series: [],
          breakdown: [{ name: 'acme-store', value: 640 }]
        }
      }
    })
    expect(view.container.textContent).toContain('Orders over time')
    expect(view.container.textContent).toContain('acme-store')
    expect(view.container.textContent).not.toContain('Requests over time')
  })

  it('emits refresh and retry instead of faking a request', async () => {
    const view = render(Switcher, { props: { error: 'Check your connection and retry.' } })
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')).toHaveLength(1)
    await fireEvent.click(buttonByText('Retry', view.container)!)
    expect(view.emitted('retry')).toHaveLength(1)
    expect(view.container.textContent).toContain(
      "Couldn't load requests over time. Check your connection and retry."
    )
  })

  it('seeds the FilterMenu chip and the comparison from the period model', () => {
    const view = render(Switcher, { props: { period: '7d' } })
    const chip = byTestId('filter-menu-chip-group__chip-period', view.container)!
    expect(chip.textContent).toContain('Last 7 days')
    expect(view.container.textContent).toContain('vs previous 7 days')
  })
})
