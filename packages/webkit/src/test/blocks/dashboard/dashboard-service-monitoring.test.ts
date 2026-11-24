import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ServiceMonitoring, {
  type ServiceMonitoringService
} from '../../../../blocks/dashboard/dashboard-service-monitoring/dashboard-service-monitoring.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())
describe('dashboard/dashboard-service-monitoring', () => {
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

  it('links to the open alerts from under the header, where a phone sees it first', () => {
    const view = render(ServiceMonitoring)
    const jump = view.getByRole('link', { name: /^\d+ open alerts?$/ })
    expect(jump.getAttribute('href')).toBe('#open-alerts')
    expect(document.getElementById('open-alerts')?.tagName).toBe('ASIDE')
    const header = view.getByRole('heading', { level: 1, name: 'Service monitoring' })
    expect(header.compareDocumentPosition(jump) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the services and alerts it is given instead of the sample', () => {
    const services: ServiceMonitoringService[] = [
      {
        id: 'checkout',
        name: 'acme-checkout',
        status: { label: 'Operational', severity: 'success' },
        latency: 210,
        delta: 1.5,
        trend: [200, 210]
      }
    ]
    const view = render(ServiceMonitoring, { props: { services, alerts: [] } })
    expect(view.container.textContent).toContain('acme-checkout')
    expect(view.container.textContent).not.toContain('web-app-prod')
    expect(view.container.textContent).toContain('No open alerts')
  })

  it('shows the error in every region and emits retry', async () => {
    const view = render(ServiceMonitoring, {
      props: { error: 'Check your connection and retry.' }
    })
    expect(view.container.textContent).toContain(
      "Couldn't load service monitoring. Check your connection and retry."
    )
    expect(view.container.textContent).not.toContain('web-app-prod')
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('emits the window it switches to', async () => {
    const view = render(ServiceMonitoring)
    await fireEvent.click(view.getByRole('radio', { name: '1h' }))
    expect(view.emitted('update:window')?.at(-1)).toEqual(['1h'])
  })
})
