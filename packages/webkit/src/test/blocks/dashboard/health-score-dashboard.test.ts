import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Health, {
  type HealthScoreIncident
} from '../../../../blocks/dashboard/health-score-dashboard/health-score-dashboard.vue'
import HealthEmpty from '../../../../blocks/dashboard/health-score-dashboard/variants/empty.vue'
import HealthRealUser from '../../../../blocks/dashboard/health-score-dashboard/variants/real-user.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const byTestId = (id: string, root: Document | HTMLElement = document) =>
  root.querySelector<HTMLElement>(`[data-testid="${id}"]`)
describe('dashboard/health-score-dashboard', () => {
  it('renders the overall score as a StatTile out of 100', () => {
    const view = render(Health)
    const tile = byTestId('stat-tile', view.container as HTMLElement)!
    expect(tile.textContent).toContain('Overall score')
    expect(tile.textContent).toContain('79')
    expect(tile.textContent).toContain('/ 100')
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
    const tile = byTestId('stat-tile', view.container as HTMLElement)!
    expect(tile.textContent).toContain('No value')
  })

  it('shows the real-user web vitals in the RealUser variant', () => {
    const view = render(HealthRealUser)
    expect(view.getByRole('heading', { level: 1, name: 'Real-user monitoring' })).toBeTruthy()
    expect(view.container.textContent).toContain('Largest contentful paint')
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
      "Couldn't load open incidents. Check your connection and retry."
    )
    expect(view.container.textContent).not.toContain('Top cause')
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })
})
