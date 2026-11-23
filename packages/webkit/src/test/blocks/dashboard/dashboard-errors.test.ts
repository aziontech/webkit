import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Alerts from '../../../../blocks/dashboard/dashboard-alerts/dashboard-alerts.vue'
import Analytics from '../../../../blocks/dashboard/dashboard-analytics/dashboard-analytics.vue'
import Breakdown from '../../../../blocks/dashboard/dashboard-breakdown/dashboard-breakdown.vue'
import Configurable from '../../../../blocks/dashboard/dashboard-configurable/dashboard-configurable.vue'
import Executive from '../../../../blocks/dashboard/dashboard-executive-summary/dashboard-executive-summary.vue'
import Health from '../../../../blocks/dashboard/dashboard-health-score/dashboard-health-score.vue'
import Home from '../../../../blocks/dashboard/dashboard-home/dashboard-home.vue'
import ScanResults from '../../../../blocks/dashboard/dashboard-scan-results/dashboard-scan-results.vue'
import Security from '../../../../blocks/dashboard/dashboard-security/dashboard-security.vue'
import ServiceMonitoring from '../../../../blocks/dashboard/dashboard-service-monitoring/dashboard-service-monitoring.vue'
import Switcher from '../../../../blocks/dashboard/dashboard-switcher/dashboard-switcher.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const dashboards = {
  Alerts,
  Analytics,
  Breakdown,
  Configurable,
  Executive,
  Health,
  Home,
  ScanResults,
  Security,
  ServiceMonitoring,
  Switcher
}

describe('dashboard blocks · a failed period', () => {
  it.each(Object.entries(dashboards))(
    '%s shows one danger alert with one Retry, and only quiet tiles and cards',
    async (_name, Dashboard) => {
      const view = render(Dashboard, { props: { error: 'The API answered 503.' } })
      const alerts = view.container.querySelectorAll(
        '[data-testid="alert"], [data-testid$="__error"]'
      )
      expect(new Set(alerts)).toHaveProperty('size', 1)
      expect(alerts[0]!.textContent).toContain("Couldn't load")
      expect(alerts[0]!.textContent).toContain('The API answered 503.')
      const retries = Array.from(view.container.querySelectorAll('button')).filter(
        (button) => button.textContent?.trim() === 'Retry'
      )
      expect(retries).toHaveLength(1)
      for (const band of view.container.querySelectorAll('[data-testid="stat-tile__empty-label"]'))
        expect(band.getAttribute('data-severity')).toBe('neutral')
      await fireEvent.click(retries[0]!)
      expect(view.emitted('retry')).toHaveLength(1)
    }
  )
})
