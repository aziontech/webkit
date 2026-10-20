import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import StatTile from './stat-tile.vue'

const mount = (props: Record<string, unknown> = {}) =>
  render(StatTile, {
    props: { label: 'Blocked threats', value: 48210, ...props }
  })

describe('StatTile', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('chart-stat-tile').tagName).toBe('SECTION')
    fallback.unmount()
    expect(mount({ 'data-testid': 'kpi' }).getByTestId('kpi')).toBeTruthy()
  })

  it('names the tile by its label', () => {
    const view = mount()
    const root = view.getByTestId('chart-stat-tile')
    const label = document.getElementById(root.getAttribute('aria-labelledby') ?? '')
    expect(label?.textContent).toContain('Blocked threats')
  })

  it('maps size to a data attribute', () => {
    expect(mount({ size: 'large' }).getByTestId('chart-stat-tile').getAttribute('data-size')).toBe(
      'large'
    )
  })

  it('reaches the formatted value and exposes it to assistive tech', async () => {
    const view = mount()
    await vi.waitFor(() =>
      expect(view.getByTestId('chart-stat-tile__value').textContent).toContain('48.2K')
    )
    expect(view.getByText('48.2K', { selector: '.sr-only' })).toBeTruthy()
  })

  it('renders a dash for a missing value', () => {
    const view = mount({ value: null })
    expect(view.getByTestId('chart-stat-tile__value').textContent?.trim()).toBe('–')
  })

  it('reads a rise as good, and as bad when inverse', () => {
    const good = mount({ delta: 12.4, deltaLabel: 'vs previous 24 hours' })
    const rise = good.getByTestId('chart-stat-tile__delta')
    expect(rise.querySelector('[data-trend]')?.getAttribute('data-trend')).toBe('good')
    expect(rise.textContent).toContain('+12.40%')
    expect(rise.textContent).toContain('better')
    expect(rise.textContent).toContain('vs previous 24 hours')
    good.unmount()

    const bad = mount({ delta: 12.4, inverse: true })
    const worse = bad.getByTestId('chart-stat-tile__delta')
    expect(worse.querySelector('[data-trend]')?.getAttribute('data-trend')).toBe('bad')
    expect(worse.textContent).toContain('worse')
    bad.unmount()

    const flat = mount({ delta: 0.001 })
    expect(
      flat
        .getByTestId('chart-stat-tile__delta')
        .querySelector('[data-trend]')
        ?.getAttribute('data-trend')
    ).toBe('flat')
  })

  it('hides the delta and the sparkline when they have no data', () => {
    const view = mount()
    expect(view.queryByTestId('chart-stat-tile__delta')).toBeNull()
    expect(view.queryByTestId('chart-stat-tile__sparkline')).toBeNull()
  })

  it('draws a sparkline from the trend', () => {
    const view = mount({ trend: [1, 3, 2, 5, 4] })
    expect(view.getByTestId('chart-stat-tile__sparkline').querySelectorAll('path')).toHaveLength(2)
  })

  it('renders Skeleton lines while loading', () => {
    const view = mount({ loading: true })
    expect(view.getByTestId('chart-stat-tile__skeleton')).toBeTruthy()
    expect(view.queryByTestId('chart-stat-tile__value')).toBeNull()
    expect(view.getByTestId('chart-stat-tile').getAttribute('aria-busy')).toBe('true')
  })

  it('has no a11y violations with and without a delta', async () => {
    for (const props of [{}, { delta: -3.2, trend: [3, 2, 1] }, { loading: true }]) {
      const view = mount(props)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
