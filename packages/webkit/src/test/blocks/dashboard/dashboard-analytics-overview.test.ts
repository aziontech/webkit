import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import OverviewPage from '../../../../blocks/dashboard/dashboard-analytics/parts/overview-page.vue'

afterEach(() => cleanup())

describe('dashboard/dashboard-analytics MetricsOverview', () => {
  it('emits refresh and fakes no reload of its own', async () => {
    const view = render(OverviewPage)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh metrics' }))
    expect(view.emitted('refresh')).toHaveLength(1)
    expect(view.container.querySelector('[data-refetching]')).toBeNull()
  })

  it('holds the charts while the page passes refetching', () => {
    const view = render(OverviewPage, { props: { refetching: true } })
    expect(view.container.querySelectorAll('[data-refetching]').length).toBeGreaterThan(0)
  })
})
