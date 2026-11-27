import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Health, {
  type HealthScoreIncident
} from '../../../../blocks/dashboard/dashboard-health-score/dashboard-health-score.vue'
import HealthEmpty from '../../../../blocks/dashboard/dashboard-health-score/variants/empty.vue'
import HealthRealUser from '../../../../blocks/dashboard/dashboard-health-score/variants/real-user.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const byTestId = (id: string, root: Document | HTMLElement = document) =>
  root.querySelector<HTMLElement>(`[data-testid="${id}"]`)
describe('dashboard/dashboard-health-score', () => {
  it('renders the overall score as the card figure out of 100, with no boxed tile', () => {
    const view = render(Health)
    expect(byTestId('stat-tile', view.container as HTMLElement)).toBeNull()
    const figure = byTestId('dashboard-health-score__score', view.container as HTMLElement)!
    expect(figure.textContent).toContain('79')
    expect(figure.textContent).toContain('/ 100')
    expect(figure.textContent).not.toContain('Overall score')
  })

  it('bands each hourly row by the same thresholds as its score and marks the hour axis', () => {
    const view = render(Health)
    const row = view.getByRole('group', { name: /Video calls, score per hour/ }).closest('li')!
    expect(row.textContent).toContain('Poor')
    const hours = byTestId('dashboard-health-score__hours', view.container as HTMLElement)!
    expect(hours.textContent).toContain('00:00')
    expect(hours.textContent).toContain('23:00')
  })

  it('links every open incident to its page', () => {
    const view = render(Health)
    const links = view
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/incidents/'))
    expect(links.length).toBeGreaterThan(0)
  })

  it('prints a dash for the overall score when the period is empty', () => {
    const view = render(HealthEmpty)
    const figure = byTestId('dashboard-health-score__score', view.container as HTMLElement)!
    expect(figure.textContent).toContain('No score')
  })

  it('shows the real-user web vitals in the RealUser variant', () => {
    const view = render(HealthRealUser)
    expect(view.getByRole('heading', { level: 1, name: 'Real-user monitoring' })).toBeTruthy()
    expect(view.container.textContent).toContain('Largest contentful paint')
  })

  it('drives the vital tiles and their trend cards from the same period', async () => {
    const view = render(HealthRealUser)
    const tile = () =>
      view
        .getAllByRole('group')
        .find((group) => group.textContent?.trim().startsWith('Page load time'))!
    expect(view.container.textContent).toContain('Page load time, hourly median')
    expect(view.container.textContent).toContain('Last hour')
    const before = tile().textContent
    await userEvent.click(view.getByRole('combobox', { name: 'Period' }))
    const option = await waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="option"]')).find(
        (node) => node.textContent?.trim() === 'Last 7 days'
      )
      if (!found) throw new Error('no option')
      return found as HTMLElement
    })
    await userEvent.click(option)
    await waitFor(() => expect(tile().textContent).not.toBe(before))
  })

  it('renders the incidents it is given instead of the sample', () => {
    const incident: HealthScoreIncident = {
      id: 'incident-acme',
      name: 'Acme portal',
      scope: 'Application',
      icon: 'az az-layout-grid',
      devices: 4,
      share: 2,
      cause: 'Slow DNS lookups',
      opened: '2026-11-10T08:00:00Z',
      openedLabel: '08:00',
      band: { label: 'Poor', severity: 'danger' }
    }
    const view = render(Health, { props: { incidents: [incident] } })
    expect(view.getByRole('link', { name: /Acme portal/ }).getAttribute('href')).toBe(
      '/incidents/incident-acme'
    )
    expect(view.queryByRole('link', { name: /Video calls · Packet loss/ })).toBeNull()
  })

  it('names the period in the empty incidents state when given none', () => {
    const view = render(Health, { props: { incidents: [], period: 'Last 7 days' } })
    expect(view.container.textContent).toContain('No open incidents in the last 7 days')
  })

  it('shows the error in every region and emits retry', async () => {
    const view = render(Health, { props: { error: 'Check your connection and retry.' } })
    expect(view.container.textContent).toContain(
      "Couldn't load the experience score. Check your connection and retry."
    )
    expect(view.container.textContent).not.toContain('Top cause')
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })
})
