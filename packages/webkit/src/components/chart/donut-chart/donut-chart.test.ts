import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import type { ChartSeries } from '../_lib'
import DonutChart from './donut-chart.vue'

const countries: ChartSeries[] = [
  { id: 'br', name: 'Brazil', values: [48200] },
  { id: 'us', name: 'United States', values: [20000, 11600] },
  { id: 'de', name: 'Germany', values: [18900] }
]

const mount = (props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) =>
  render(DonutChart, {
    props: { series: countries, ariaLabel: 'Top WAF threat requests by country', ...props },
    slots
  })

describe('DonutChart', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('chart-donut-chart').tagName).toBe('FIGURE')
    fallback.unmount()
    expect(mount({ 'data-testid': 'countries' }).getByTestId('countries')).toBeTruthy()
  })

  it('maps kind and size to data attributes', () => {
    const root = mount({ kind: 'pie', size: 'large' }).getByTestId('chart-donut-chart')
    expect(root.getAttribute('data-kind')).toBe('pie')
    expect(root.getAttribute('data-size')).toBe('large')
  })

  it('draws one slice per series, summing each series, in slot order', () => {
    const view = mount()
    const slices = view.getByTestId('chart-donut-chart__ring').querySelectorAll('circle')
    expect([...slices].map((slice) => slice.getAttribute('stroke'))).toEqual([
      'var(--chart-series-1)',
      'var(--chart-series-2)',
      'var(--chart-series-3)'
    ])
    expect(view.getByTestId('chart-donut-chart__center').textContent).toContain('98.7K')
    expect(view.getByTestId('chart-donut-chart__center').textContent).toContain('Total')
  })

  it('folds slices past the cap into Other', () => {
    const many = Array.from({ length: 8 }, (_, index) => ({
      id: `c${index}`,
      name: `Country ${index + 1}`,
      values: [10 - index]
    }))
    const view = mount({ series: many })
    const strokes = [...view.getByTestId('chart-donut-chart__ring').querySelectorAll('circle')].map(
      (slice) => slice.getAttribute('stroke')
    )
    expect(strokes).toHaveLength(7)
    expect(strokes.at(-1)).toBe('var(--chart-series-other)')
  })

  it('swaps the center to the active slice and announces it', async () => {
    const view = mount()
    const ring = view.getByTestId('chart-donut-chart__ring')
    ring.focus()
    await fireEvent.keyDown(ring, { key: 'ArrowRight' })
    expect(view.getByTestId('chart-donut-chart__center').textContent).toContain('48.2K')
    expect(view.getByTestId('chart-donut-chart__center').textContent).toContain('Brazil')
    expect(view.getByTestId('chart-donut-chart__live').textContent).toContain('Brazil: 48.2K, 49%')
  })

  it('hands the center slot the total and the active series', () => {
    const view = mount(
      {},
      {
        center: (scope: unknown) => {
          const { total } = scope as { total: number }
          return h('span', { 'data-testid': 'custom-center' }, `sum ${total}`)
        }
      }
    )
    expect(view.getByTestId('custom-center').textContent).toBe('sum 98700')
  })

  it('emits slice-click with the event first and the consumer series second', async () => {
    const view = mount()
    const first = view.getByTestId('chart-donut-chart__ring').querySelector('circle') as Element
    await fireEvent.pointerEnter(first)
    await fireEvent.click(first)
    const clicks = view.emitted('slice-click') as unknown[][]
    expect(clicks).toHaveLength(1)
    expect(clicks[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(clicks[0]?.[1]).toEqual(countries[0])

    const ring = view.getByTestId('chart-donut-chart__ring')
    await fireEvent.keyDown(ring, { key: 'End' })
    await fireEvent.keyDown(ring, { key: 'Enter' })
    expect((view.emitted('slice-click') as unknown[][])[1]?.[1]).toEqual(countries[2])
  })

  it('hides a slice from the legend and keeps it listed', async () => {
    const view = mount()
    const items = view.getAllByTestId('chart-donut-chart__legend-item')
    await fireEvent.click(items[0] as Element)
    expect(items[0]?.getAttribute('aria-pressed')).toBe('false')
    expect(view.getByTestId('chart-donut-chart__ring').querySelectorAll('circle')).toHaveLength(2)
    expect(view.getAllByTestId('chart-donut-chart__legend-item')).toHaveLength(3)
    const toggles = view.emitted('legend-toggle') as unknown[][]
    expect(toggles[0]?.[1]).toEqual(countries[0])
    expect(view.emitted('update:hiddenSeries')?.[0]).toEqual([['br']])
  })

  it('explains an empty range and offers the consumer actions', async () => {
    const view = mount(
      {
        series: [{ id: 'a', name: 'A', values: [0] }],
        size: 'large',
        emptyTitle: 'No threats match these filters',
        emptyDescription: 'Choose another country or widen the time range.'
      },
      { 'empty-actions': () => h('button', { type: 'button' }, 'Clear filters') }
    )
    expect(view.getByTestId('chart-donut-chart__empty__description').textContent).toContain(
      'Choose another country'
    )
    expect(view.getByTestId('chart-donut-chart__empty__icon')).toBeTruthy()
    expect(
      view.getByTestId('chart-donut-chart__empty__actions').querySelector('button')?.textContent
    ).toBe('Clear filters')
    await expectNoA11yViolations(view.container)
  })

  it('renders exactly one state at a time', () => {
    const loading = mount({ loading: true })
    expect(loading.getByTestId('chart-donut-chart__skeleton')).toBeTruthy()
    expect(loading.queryByTestId('chart-donut-chart__ring')).toBeNull()
    loading.unmount()

    const failed = mount({ error: 'Could not load this report' })
    expect(failed.getByTestId('chart-donut-chart__error').textContent).toContain('Could not load')
    failed.unmount()

    const empty = mount({ series: [{ id: 'a', name: 'A', values: [0] }] })
    expect(empty.getByTestId('chart-donut-chart__empty')).toBeTruthy()
    expect(empty.queryByTestId('chart-donut-chart__empty__actions')).toBeNull()
    empty.unmount()

    const table = mount({ tableView: true })
    expect(table.getByTestId('chart-donut-chart__table').querySelectorAll('tbody tr')).toHaveLength(
      3
    )
    expect(table.queryByTestId('chart-donut-chart__ring')).toBeNull()
  })

  it('keeps a table twin of every slice', () => {
    const twin = mount().getByTestId('chart-donut-chart__twin')
    expect(twin.querySelectorAll('tbody tr')).toHaveLength(3)
  })

  it('has no a11y violations in the ring, pie and table views', async () => {
    for (const props of [{}, { kind: 'pie' }, { tableView: true }, { loading: true }]) {
      const view = mount(props)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
