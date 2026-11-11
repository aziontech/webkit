import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import MapChart from './map-chart.vue'

const regions = [
  { id: 'BR', value: 48200 },
  { id: 'US', value: 31600 },
  { id: 'DE', value: 18900 },
  { id: 'ZZ', value: null }
]
const points = [
  { id: 'gru', name: 'São Paulo', lat: -23.5, lon: -46.6, value: 1200 },
  { id: 'fra', name: 'Frankfurt', lat: 50.1, lon: 8.7, value: 800 }
]

const mount = (props: Record<string, unknown> = {}) =>
  render({
    render: () =>
      h('div', { style: 'width: 640px' }, [
        h(MapChart, { regions, points, ariaLabel: 'Requests by country', ...props })
      ])
  })

const ready = (view: ReturnType<typeof render>) =>
  vi.waitFor(() =>
    expect(view.getByTestId('chart-map-chart').getAttribute('data-geometry')).toBe('ready')
  )

describe('MapChart', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const view = mount()
    expect(view.getByTestId('chart-map-chart').tagName).toBe('FIGURE')
    view.unmount()
    expect(mount({ 'data-testid': 'geo' }).getByTestId('geo')).toBeTruthy()
  })

  it('loads the country shapes lazily and shades each country by its bin', async () => {
    const view = mount()
    await ready(view)
    const plot = view.getByTestId('chart-map-chart__plot')
    expect(plot.querySelector('[data-region="BR"]')?.getAttribute('data-bin')).toBe('4')
    expect(plot.querySelector('[data-region="DE"]')?.getAttribute('data-bin')).toBe('0')
    expect(plot.querySelector('[data-region="ZZ"]')).toBeNull()
    expect(view.getByTestId('chart-map-chart__legend').textContent).toContain('48.2K')
  })

  it('draws one bubble per location, larger for the larger value', () => {
    const plot = mount().getByTestId('chart-map-chart__plot')
    const gru = Number(plot.querySelector('[data-point="gru"]')?.getAttribute('r'))
    const fra = Number(plot.querySelector('[data-point="fra"]')?.getAttribute('r'))
    expect(gru).toBeGreaterThan(fra)
  })

  it('walks regions then locations by value from the keyboard and announces each', async () => {
    const onRegion = vi.fn()
    const onPoint = vi.fn()
    const view = mount({ onRegionClick: onRegion, onPointClick: onPoint })
    await ready(view)
    const plot = view.getByTestId('chart-map-chart__plot')
    const live = view.getByTestId('chart-map-chart__live')
    plot.focus()
    await fireEvent.keyDown(plot, { key: 'ArrowRight' })
    expect(live.textContent).toBe('Brazil: 48.2K')
    expect(view.getByTestId('chart-map-chart__tooltip').textContent).toContain('Brazil')
    await fireEvent.keyDown(plot, { key: 'Enter' })
    expect(onRegion.mock.calls[0]?.[1]).toEqual(regions[0])
    await fireEvent.keyDown(plot, { key: 'End' })
    expect(live.textContent).toBe('Frankfurt: 800')
    await fireEvent.keyDown(plot, { key: ' ' })
    expect(onPoint.mock.calls[0]?.[1]).toEqual(points[1])
    await fireEvent.keyDown(plot, { key: 'Escape' })
    expect(live.textContent).toBe('')
  })

  it('keeps a table twin and shows it in table view', () => {
    const twin = mount().getByTestId('chart-map-chart__twin')
    expect(twin.querySelectorAll('tbody tr')).toHaveLength(5)
    const table = mount({ tableView: true }).getByTestId('chart-map-chart__table')
    expect(table.textContent).toContain('United States')
    expect(table.textContent).toContain('São Paulo')
  })

  it('renders exactly one state at a time', () => {
    expect(mount({ loading: true }).getByTestId('chart-map-chart__skeleton')).toBeTruthy()
    expect(
      mount({ error: 'Could not load the map.' }).getByTestId('chart-map-chart__error')
    ).toBeTruthy()
    expect(mount({ regions: [], points: [] }).getByTestId('chart-map-chart__empty')).toBeTruthy()
  })

  it('keeps the geography unmirrored under rtl', async () => {
    const view = render({
      render: () =>
        h('div', { dir: 'rtl', style: 'width: 640px' }, [
          h(MapChart, { points, ariaLabel: 'PoPs' })
        ])
    })
    const plot = view.getByTestId('chart-map-chart__plot')
    const gru = Number(plot.querySelector('[data-point="gru"]')?.getAttribute('cx'))
    const fra = Number(plot.querySelector('[data-point="fra"]')?.getAttribute('cx'))
    expect(fra).toBeGreaterThan(gru)
  })

  it('has no a11y violations in the map, table and empty views', async () => {
    for (const props of [{}, { tableView: true }, { regions: [], points: [] }]) {
      const view = mount(props)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
