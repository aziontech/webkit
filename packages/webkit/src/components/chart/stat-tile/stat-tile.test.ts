import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import StatTile from './stat-tile.vue'

const mount = (props: Record<string, unknown> = {}) =>
  render(StatTile, {
    props: { label: 'Blocked threats', value: 48210, ...props }
  })

describe('StatTile', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('stat-tile').getAttribute('role')).toBe('group')
    fallback.unmount()
    expect(mount({ 'data-testid': 'kpi' }).getByTestId('kpi')).toBeTruthy()
  })

  it('names the tile by its label', () => {
    const view = mount()
    const root = view.getByTestId('stat-tile')
    const label = document.getElementById(root.getAttribute('aria-labelledby') ?? '')
    expect(label?.textContent).toContain('Blocked threats')
  })

  it('reaches the formatted value and exposes it to assistive tech', async () => {
    const view = mount()
    await vi.waitFor(() =>
      expect(view.getByTestId('stat-tile__value').textContent).toContain('48.2K')
    )
    expect(view.getByText('48.2K', { selector: '.sr-only' })).toBeTruthy()
  })

  it('reads the unit after the figure, muted and announced with the value', async () => {
    const view = mount({ value: 842, unit: 'GB' })
    expect(view.getByTestId('stat-tile__unit').textContent?.trim()).toBe('GB')
    await vi.waitFor(() => expect(view.getByText('842 GB', { selector: '.sr-only' })).toBeTruthy())
  })

  it('renders a dash over the no-data band for a missing value', () => {
    const view = mount({ value: null, unit: 'GB', trend: [1, 2, 3] })
    expect(view.getByTestId('stat-tile__value').textContent?.trim()).toBe('–')
    expect(view.queryByTestId('stat-tile__unit')).toBeNull()
    expect(view.getByText('No value', { selector: '.sr-only' })).toBeTruthy()
    expect(view.getByTestId('stat-tile__empty').textContent).toContain('No data')
    expect(view.queryByTestId('stat-tile__sparkline')).toBeNull()
  })

  it('draws no placeholder curve in the no-data band', () => {
    const view = mount({ value: null, trend: [1, 2, 3] })
    const band = view.getByTestId('stat-tile__empty')
    expect(band.querySelector('svg, [data-testid="spark-chart"]')).toBeNull()
    expect(band.textContent?.trim()).toBe('No data')
  })

  it('reads a rise as good, and as bad when inverse', () => {
    const good = mount({ delta: 12.4, deltaLabel: 'vs previous 24 hours' })
    const rise = good.getByTestId('stat-tile__delta')
    expect(rise.querySelector('[data-trend]')?.getAttribute('data-trend')).toBe('good')
    expect(rise.textContent).toContain('+12.4%')
    expect(rise.textContent).not.toContain('+12.40%')
    expect(rise.textContent).toContain('better')
    expect(rise.textContent).toContain('vs previous 24 hours')
    expect(good.getByTestId('stat-tile__delta-tag').getAttribute('data-severity')).toBe('success')
    good.unmount()

    const bad = mount({ delta: 12.4, inverse: true })
    const worse = bad.getByTestId('stat-tile__delta')
    expect(worse.querySelector('[data-trend]')?.getAttribute('data-trend')).toBe('bad')
    expect(worse.textContent).toContain('worse')
    expect(bad.getByTestId('stat-tile__delta-tag').getAttribute('data-severity')).toBe('danger')
    bad.unmount()

    const flat = mount({ delta: 0.001 })
    expect(
      flat.getByTestId('stat-tile__delta').querySelector('[data-trend]')?.getAttribute('data-trend')
    ).toBe('flat')
  })

  it('prints the delta with at most two decimals and no trailing zeros', () => {
    const cases: [number, string][] = [
      [3, '+3%'],
      [3.8, '+3.8%'],
      [-1.5, '-1.5%'],
      [2.456, '+2.46%'],
      [0.001, '0%']
    ]
    for (const [delta, text] of cases) {
      const view = mount({ delta })
      const tag = view.getByTestId('stat-tile__delta-tag')
      expect(tag.textContent?.replace('\u2212', '-')).toContain(text)
      view.unmount()
    }
  })

  it('maps variant to data-variant, mono by default', () => {
    const mono = mount()
    expect(mono.getByTestId('stat-tile')).toHaveAttribute('data-variant', 'mono')
    mono.unmount()
    const sans = mount({ variant: 'sans', unit: 'M', value: 48.2 })
    expect(sans.getByTestId('stat-tile')).toHaveAttribute('data-variant', 'sans')
    expect(sans.getByTestId('stat-tile__unit').textContent?.trim()).toBe('M')
  })

  it('is not grouped outside a StatTileGroup', () => {
    expect(mount().getByTestId('stat-tile')).not.toHaveAttribute('data-grouped')
  })

  it('hides the delta and the sparkline when they have no data', () => {
    const view = mount()
    expect(view.queryByTestId('stat-tile__delta')).toBeNull()
    expect(view.queryByTestId('stat-tile__sparkline')).toBeNull()
    expect(view.queryByTestId('stat-tile__empty')).toBeNull()
  })

  it('draws a sparkline from the trend', () => {
    const view = mount({ trend: [1, 3, 2, 5, 4] })
    const spark = view.getByTestId('stat-tile__sparkline')
    expect(spark.getAttribute('data-type')).toBe('area')
    expect(spark.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('says it could not load, never No data, when the value failed to load', () => {
    const view = mount({
      value: 48210,
      delta: 4,
      trend: [1, 2, 3],
      error: 'The request timed out.'
    })
    const root = view.getByTestId('stat-tile')
    expect(root.hasAttribute('data-error')).toBe(true)
    expect(view.getByTestId('stat-tile__value').textContent?.trim()).toBe('–')
    expect(view.getByTestId('stat-tile__empty-label').textContent).toContain("Couldn't load")
    expect(view.getByTestId('stat-tile__empty-label').getAttribute('data-severity')).toBe('neutral')
    expect(view.getByTestId('stat-tile__empty').textContent).not.toContain('No data')
    expect(view.queryByTestId('stat-tile__delta')).toBeNull()
    expect(view.queryByTestId('stat-tile__sparkline')).toBeNull()
    expect(root.textContent).toContain('The request timed out.')
  })

  it('keeps the Skeleton while loading even with an error set', () => {
    const view = mount({ loading: true, error: 'The request timed out.' })
    expect(view.getByTestId('stat-tile__loading')).toBeTruthy()
    expect(view.getByTestId('stat-tile').hasAttribute('data-error')).toBe(false)
  })

  it('renders Skeleton lines while loading', () => {
    const view = mount({ loading: true })
    expect(view.getByTestId('stat-tile__loading')).toBeTruthy()
    expect(view.queryByTestId('stat-tile__value')).toBeNull()
    expect(view.getByTestId('stat-tile').getAttribute('aria-busy')).toBe('true')
  })

  it('has no a11y violations with and without a delta', async () => {
    for (const props of [
      {},
      { delta: -3.2, unit: 'ms', trend: [3, 2, 1] },
      { value: null },
      { error: 'The request timed out.' },
      { loading: true }
    ]) {
      const view = mount(props)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })

  describe('on devices', () => {
    it('is a named container that tightens its padding in a very narrow tile', () => {
      const view = mount()
      const root = view.getByTestId('stat-tile')

      expect(root.className).toContain('@container/stat-tile')
      expect(root.firstElementChild?.className).toContain('@max-3xs/stat-tile:p-(--spacing-sm)')
    })
  })

  it('keeps the figure, its unit and the signed delta in left-to-right order under rtl', () => {
    const view = render({
      render: () =>
        h('div', { dir: 'rtl' }, [
          h(StatTile, { label: 'Data transferred', value: 110, unit: 'GB', delta: 10.5 })
        ])
    })
    const run = view.getByTestId('stat-tile__value').closest('[dir]')
    expect(run?.getAttribute('dir')).toBe('ltr')
    expect(run?.contains(view.getByTestId('stat-tile__unit'))).toBe(true)
    const signed = view.getByTestId('stat-tile__delta-tag').querySelector('[dir="ltr"]')
    expect(signed?.textContent).toMatch(/^\+10\.5/)
  })

  describe('StatTile inside a ChartCard', () => {
    it('lets the card own the only frame', async () => {
      const MetricPanel = (await import('../../../../examples/chart-card/metric-panel.vue')).default
      const view = render(MetricPanel)
      const tiles = view.getAllByTestId('stat-tile')
      expect(tiles.length).toBeGreaterThan(0)
      for (const tile of tiles) expect(tile.hasAttribute('data-carded')).toBe(true)
      const alone = render(StatTile, { props: { label: 'Requests', value: 1 } })
      expect(alone.getAllByTestId('stat-tile').at(-1)?.hasAttribute('data-carded')).toBe(false)
    })
  })
})
