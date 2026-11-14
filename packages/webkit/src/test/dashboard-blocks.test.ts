import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Activity from '../../blocks/platform/dashboard/activity-outcomes-dashboard/activity-outcomes-dashboard.vue'
import Analytics from '../../blocks/platform/dashboard/analytics-dashboard/analytics-dashboard.vue'
import Composition from '../../blocks/platform/dashboard/composition-dashboard/composition-dashboard.vue'
import CompositionEmpty from '../../blocks/platform/dashboard/composition-dashboard/variants/empty.vue'
import Switcher from '../../blocks/platform/dashboard/dashboard-switcher/dashboard-switcher.vue'
import SwitcherEmpty from '../../blocks/platform/dashboard/dashboard-switcher/variants/empty.vue'
import SwitcherFailed from '../../blocks/platform/dashboard/dashboard-switcher/variants/failed.vue'
import SwitcherOwnPeriod from '../../blocks/platform/dashboard/dashboard-switcher/variants/own-period.vue'
import Data from '../../blocks/platform/dashboard/data-dashboard/data-dashboard.vue'
import Executive from '../../blocks/platform/dashboard/executive-summary-dashboard/executive-summary-dashboard.vue'
import Funnel from '../../blocks/platform/dashboard/funnel-cohort-dashboard/funnel-cohort-dashboard.vue'
import Health from '../../blocks/platform/dashboard/health-score-dashboard/health-score-dashboard.vue'
import HealthEmpty from '../../blocks/platform/dashboard/health-score-dashboard/variants/empty.vue'
import Home from '../../blocks/platform/dashboard/home-dashboard/home-dashboard.vue'
import HomeFailed from '../../blocks/platform/dashboard/home-dashboard/variants/failed.vue'
import ProjectStatus from '../../blocks/platform/dashboard/project-status-dashboard/project-status-dashboard.vue'
import Security from '../../blocks/platform/dashboard/security-dashboard/security-dashboard.vue'
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

describe('platform/dashboard/health-score-dashboard', () => {
  it('renders the overall score as a StatTile out of 100', () => {
    const view = render(Health)
    const tile = byTestId('chart-stat-tile', view.container)!
    expect(tile.textContent).toContain('Overall score')
    expect(tile.textContent).toContain('79')
    expect(tile.textContent).toContain('/ 100')
  })

  it('prints a dash for the overall score when the period is empty', () => {
    const view = render(HealthEmpty)
    const tile = byTestId('chart-stat-tile', view.container)!
    expect(tile.textContent).toContain('No value')
  })
})

describe.each([
  ['analytics-dashboard', Analytics],
  ['data-dashboard', Data],
  ['security-dashboard', Security]
])('platform/dashboard/%s period', (_name, Block) => {
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

describe('platform/dashboard exports', () => {
  it.each([
    ['composition-dashboard', Composition, 'More options for Current split'],
    ['funnel-cohort-dashboard', Funnel, 'More options for Weekly cohorts'],
    ['project-status-dashboard', ProjectStatus, 'More options for Owners']
  ])('%s exports a card as CSV from its menu', async (_name, Block, trigger) => {
    const view = render(Block)
    await pickMenuOption(view.getByRole('button', { name: trigger }), 'Export CSV')
    await waitFor(() => expect(document.body.textContent).toContain('CSV exported.'))
  })

  it('copies a link to a project status card', async () => {
    const view = render(ProjectStatus)
    await pickMenuOption(view.getByRole('button', { name: 'More options for Owners' }), 'Copy link')
    await waitFor(() =>
      expect(
        document.body.textContent?.includes('Link copied.') ||
          document.body.textContent?.includes('The link could not be copied.')
      ).toBe(true)
    )
  })

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

describe('platform/dashboard/activity-outcomes-dashboard', () => {
  it('narrows the log by destination and offers Clear filters when nothing matches', async () => {
    const view = render(Activity)
    const table = () => byTestId('data-table', view.container)
    expect(table()?.textContent).toContain('storage.example.com')
    const input = view.getByRole('textbox', { name: 'Destination host' })
    await userEvent.fill(input, 'storage.example.com')
    await waitFor(() => expect(table()?.textContent).not.toContain('api.example.com'))
    expect(table()?.textContent).toContain('storage.example.com')
    await userEvent.fill(input, 'nothing.example.org')
    await waitFor(() =>
      expect(view.container.textContent).toContain('No requests match these filters')
    )
    const clear = Array.from(view.container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Clear filters'
    ) as HTMLButtonElement
    await fireEvent.click(clear)
    await waitFor(() => expect(table()?.textContent).toContain('api.example.com'))
  })

  it('moves the time range to the header and the closed-set filters into FilterMenu', async () => {
    const view = render(Activity)
    expect(byTestId('data-filter-menu', view.container)).not.toBeNull()
    expect(view.getByRole('combobox', { name: 'Time range' })).toBeTruthy()
  })

  it('emits refresh from the Refresh button', async () => {
    const view = render(Activity)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')?.length).toBe(1)
  })
})
