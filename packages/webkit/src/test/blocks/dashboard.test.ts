import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Analytics from '../../../blocks/dashboard/analytics-dashboard/analytics-dashboard.vue'
import AnalyticsUsage from '../../../blocks/dashboard/analytics-dashboard/variants/usage.vue'
import Composition from '../../../blocks/dashboard/breakdown-dashboard/breakdown-dashboard.vue'
import CompositionEmpty from '../../../blocks/dashboard/breakdown-dashboard/variants/empty.vue'
import Executive from '../../../blocks/dashboard/executive-summary-dashboard/executive-summary-dashboard.vue'
import Security from '../../../blocks/dashboard/security-dashboard/security-dashboard.vue'
import { useToastRegion } from '../toast-region'

useToastRegion()

afterEach(() => cleanup())

const pickMenuOption = async (trigger: HTMLElement, label: string) => {
  await userEvent.click(trigger)
  const option = await waitFor(() => {
    const found = Array.from(document.querySelectorAll('[role="menuitem"]')).find(
      (node) => node.textContent?.trim() === label
    )
    if (!found) throw new Error(`no ${label}`)
    return found as HTMLElement
  })
  await userEvent.click(option)
}
describe('dashboard blocks', () => {
  it('ships one block per data shape, with no merged or off-domain dashboard left', () => {
    const ids = Object.keys(import.meta.glob('../../../blocks/dashboard/*/block.json')).map(
      (path) => path.split('/').at(-2)
    )
    for (const removed of [
      'data-dashboard',
      'activity-outcomes-dashboard',
      'project-status-dashboard',
      'funnel-cohort-dashboard'
    ])
      expect(ids).not.toContain(removed)
    expect(ids).toContain('analytics-dashboard')
  })
})

describe.each([
  ['analytics-dashboard', Analytics],
  ['analytics-dashboard#Usage', AnalyticsUsage],
  ['security-dashboard', Security]
])('dashboard/%s period', (_name, Block) => {
  it('drives the delta comparison from the Period Select in the header', async () => {
    const view = render(Block)
    expect(view.container.textContent).toContain('vs previous 24 hours')
    await userEvent.click(view.getByRole('combobox', { name: 'Period' }))
    const option = await waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="option"]')).find(
        (node) => node.textContent?.trim() === 'Last 7 days'
      )
      if (!found) throw new Error('no option')
      return found as HTMLElement
    })
    await userEvent.click(option)
    await waitFor(() => expect(view.container.textContent).toContain('vs previous 7 days'))
    expect(view.container.textContent).not.toContain('vs previous 24 hours')
  })
})

describe('dashboard exports', () => {
  it.each([['breakdown-dashboard', Composition, 'More options for Current split']])(
    '%s exports a card as CSV from its menu',
    async (_name, Block, trigger) => {
      const view = render(Block)
      await pickMenuOption(view.getByRole('button', { name: trigger }), 'Export CSV')
      await waitFor(() => expect(document.body.textContent).toContain('CSV exported.'))
    }
  )

  it('exports from the page header buttons', async () => {
    const composition = render(Composition)
    await fireEvent.click(composition.getByRole('button', { name: 'Export CSV' }))
    await waitFor(() =>
      expect(document.body.textContent).toContain('spend-by-category-last-12-months.csv')
    )
    composition.unmount()
    const executive = render(Executive)
    await fireEvent.click(executive.getByRole('button', { name: 'Export' }))
    await waitFor(() =>
      expect(document.body.textContent).toContain('executive-summary-q3-2026.csv')
    )
  })

  it('disables the exports when the period has no data', () => {
    const view = render(CompositionEmpty)
    expect((view.getByRole('button', { name: 'Export CSV' }) as HTMLButtonElement).disabled).toBe(
      true
    )
  })
})
