import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ServiceMonitoring from '../../../../blocks/dashboard/service-monitoring-dashboard/service-monitoring-dashboard.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())
describe('dashboard/service-monitoring-dashboard', () => {
  it('titles the page and drives every tile from the one window in the header', async () => {
    const view = render(ServiceMonitoring)
    expect(view.getByRole('heading', { level: 1, name: 'Service monitoring' })).toBeTruthy()
    expect(view.getAllByRole('radiogroup').length).toBe(1)
    expect(view.container.textContent).toContain('p95 latency vs previous 24 hours')
    await fireEvent.click(view.getByRole('radio', { name: '6h' }))
    await waitFor(() =>
      expect(view.container.textContent).toContain('p95 latency vs previous 6 hours')
    )
  })

  it('links every open alert to its page', () => {
    const view = render(ServiceMonitoring)
    const link = view.getByRole('link', { name: /Status 5xx above 5%/ })
    expect(link.getAttribute('href')).toBe('/alerts/stage-5xx')
  })
})
