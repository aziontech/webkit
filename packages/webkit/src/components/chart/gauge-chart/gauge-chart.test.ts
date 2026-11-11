import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import GaugeChart from './gauge-chart.vue'

const thresholds = [
  { value: 0, color: 'success' as const, label: 'Healthy' },
  { value: 70, color: 'warning' as const, label: 'Busy' },
  { value: 90, color: 'danger' as const, label: 'Critical' }
]

const mount = (props: Record<string, unknown> = {}, dir: 'ltr' | 'rtl' = 'ltr') =>
  render({
    render: () =>
      h('div', { dir, style: 'width: 320px' }, [
        h(GaugeChart, {
          value: 62,
          label: 'CPU usage',
          formatValue: (value: number) => `${value}%`,
          ...props
        })
      ])
  })

describe('GaugeChart', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const view = mount()
    expect(view.getByTestId('chart-gauge-chart').tagName).toBe('FIGURE')
    view.unmount()
    expect(mount({ 'data-testid': 'cpu' }).getByTestId('cpu')).toBeTruthy()
  })

  it('exposes the reading as a meter with its range and formatted value', () => {
    const meter = mount().getByRole('meter', { name: 'CPU usage' })
    expect(meter.getAttribute('aria-valuenow')).toBe('62')
    expect(meter.getAttribute('aria-valuemin')).toBe('0')
    expect(meter.getAttribute('aria-valuemax')).toBe('100')
    expect(meter.getAttribute('aria-valuetext')).toBe('62%')
  })

  it('takes the color and name of the band the value falls in', () => {
    const view = mount({ value: 93, thresholds })
    const meter = view.getByRole('meter')
    expect(meter.getAttribute('data-status')).toBe('danger')
    expect(meter.getAttribute('aria-valuetext')).toBe('93%, Critical')
    expect(view.getByTestId('chart-gauge-chart__arc').getAttribute('stroke')).toBe(
      'var(--chart-status-danger)'
    )
    expect(view.getByTestId('chart-gauge-chart__value').textContent).toContain('CPU usage, Critical')
    expect(meter.querySelectorAll('line')).toHaveLength(2)
  })

  it('fills the arc to the share of the range and clamps past the ends', async () => {
    const view = mount({ value: 150, min: 50, max: 100 })
    const arc = view.getByTestId('chart-gauge-chart__arc')
    expect(arc.getAttribute('style')).toContain('--gauge-dash: 100 100')
    await vi.waitFor(() => expect(arc.getAttribute('data-entered')).toBe('true'))
  })

  it('renders exactly one state at a time', () => {
    expect(mount({ loading: true }).getByTestId('chart-gauge-chart__skeleton')).toBeTruthy()
    expect(mount({ error: 'Could not load CPU usage.' }).getByTestId('chart-gauge-chart__error')).toBeTruthy()
    const empty = mount({ value: null, emptyTitle: 'No reading yet' })
    expect(empty.getByTestId('chart-gauge-chart__empty').textContent).toContain('No reading yet')
    expect(empty.queryByRole('meter')).toBeNull()
  })

  it('mirrors the dial under rtl so it fills from the start side', async () => {
    const view = mount({}, 'rtl')
    await vi.waitFor(() =>
      expect(view.getByRole('meter').querySelector('g')?.getAttribute('transform')).toContain('scale(-1 1)')
    )
  })

  it('has no a11y violations in the dial, empty and loading states', async () => {
    for (const props of [{ thresholds }, { value: null }, { loading: true }]) {
      const view = mount(props)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
