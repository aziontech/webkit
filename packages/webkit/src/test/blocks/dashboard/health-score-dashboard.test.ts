import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Health from '../../../../blocks/dashboard/health-score-dashboard/health-score-dashboard.vue'
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
    const tile = byTestId('stat-tile', view.container)!
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
    const tile = byTestId('stat-tile', view.container)!
    expect(tile.textContent).toContain('No value')
  })

  it('shows the real-user web vitals in the RealUser variant', () => {
    const view = render(HealthRealUser)
    expect(view.getByRole('heading', { level: 1, name: 'Real-user monitoring' })).toBeTruthy()
    expect(view.container.textContent).toContain('Largest contentful paint')
  })
})
