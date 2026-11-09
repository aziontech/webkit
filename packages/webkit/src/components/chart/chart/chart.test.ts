import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import type { ChartSeries } from '../_lib'
import Chart, {
  ChartArea,
  ChartAxis,
  ChartBar,
  ChartCrosshair,
  ChartGrid,
  ChartLegend,
  ChartLine,
  ChartTooltip
} from './index'

const labels = ['14:00', '14:05', '14:10', '14:15']
const threats: ChartSeries[] = [
  { id: 'allowed', name: 'WAF requests allowed', values: [1200, 1350, 1280, 1500] },
  { id: 'blocked', name: 'WAF requests blocked', values: [320, 410, null, 520] },
  { id: 'threat', name: 'WAF requests threat', values: [80, 95, 70, 120] }
]

const parts = () => [
  h(ChartGrid),
  h(ChartAxis, { kind: 'y' }),
  h(ChartAxis, { kind: 'x' }),
  h(ChartArea, { ids: ['allowed'] }),
  h(ChartBar, { ids: ['threat'] }),
  h(ChartLine, { ids: ['blocked'] }),
  h(ChartCrosshair),
  h(ChartTooltip),
  h(ChartLegend, { totals: true })
]

const mount = (props: Record<string, unknown> = {}, children = parts) =>
  render({
    render: () =>
      h('div', { style: 'width: 640px' }, [
        h(
          Chart,
          { series: threats, labels, ariaLabel: 'Threats vs requests', ...props },
          { default: children }
        )
      ])
  })

const plotOf = (view: ReturnType<typeof render>) => view.getByTestId('chart-chart__plot')

const measured = (view: ReturnType<typeof render>) =>
  vi.waitFor(() => {
    const layer = view.container.querySelector('figure svg')
    expect(Number(layer?.getAttribute('width'))).toBeGreaterThan(0)
  })

describe('Chart', () => {
  it('attaches its parts to the root for dot notation', () => {
    expect(Chart).toBeTruthy()
    expect(Chart?.Grid).toBe(ChartGrid)
    expect(Chart?.Axis).toBe(ChartAxis)
    expect(Chart?.Line).toBe(ChartLine)
    expect(Chart?.Area).toBe(ChartArea)
    expect(Chart?.Bar).toBe(ChartBar)
    expect(Chart?.Crosshair).toBe(ChartCrosshair)
    expect(Chart?.Tooltip).toBe(ChartTooltip)
    expect(Chart?.Legend).toBe(ChartLegend)
  })

  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('chart-chart').tagName).toBe('FIGURE')
    fallback.unmount()
    expect(mount({ 'data-testid': 'threats' }).getByTestId('threats')).toBeTruthy()
  })

  it('draws one path per series in its mark and paints each with its slot token', async () => {
    const view = mount()
    await measured(view)
    const line = view.getByTestId('chart-chart__line').querySelector('[data-series="blocked"] path')
    const area = view
      .getByTestId('chart-chart__area')
      .querySelectorAll('[data-series="allowed"] path')
    const bars = view
      .getByTestId('chart-chart__bar')
      .querySelectorAll('[data-series="threat"] path')
    expect(line?.getAttribute('stroke')).toBe('var(--chart-series-2)')
    expect(area).toHaveLength(2)
    expect(area[0]?.getAttribute('fill')).toBe('var(--chart-series-1)')
    expect(bars).toHaveLength(4)
    expect(bars[0]?.getAttribute('fill')).toBe('var(--chart-series-3)')
  })

  it('folds every series past the sixth into Other', async () => {
    const many: ChartSeries[] = Array.from({ length: 8 }, (_, index) => ({
      id: `host-${index}`,
      name: `Host ${index + 1}`,
      values: [index + 1, index + 2, index + 3, index + 4]
    }))
    const view = mount({ series: many }, () => [h(ChartLine), h(ChartLegend)])
    await nextTick()
    const strokes = [...view.getByTestId('chart-chart__line').querySelectorAll('path')].map(
      (path) => path.getAttribute('stroke')
    )
    expect(strokes).toEqual([
      'var(--chart-series-1)',
      'var(--chart-series-2)',
      'var(--chart-series-3)',
      'var(--chart-series-4)',
      'var(--chart-series-5)',
      'var(--chart-series-6)',
      'var(--chart-series-other)'
    ])
    const items = view.getAllByTestId('chart-chart__legend-item')
    expect(items).toHaveLength(7)
    expect(items[6]?.textContent).toContain('Other')
  })

  it('honours a status color for a series whose color means a state', async () => {
    const view = mount(
      { series: [{ id: 'blocked', name: 'Blocked', values: [1, 2, 3, 4], color: 'danger' }] },
      () => [h(ChartLine)]
    )
    await nextTick()
    expect(
      view.getByTestId('chart-chart__line').querySelector('path')?.getAttribute('stroke')
    ).toBe('var(--chart-status-danger)')
  })

  it('renders no legend for a single series', () => {
    const view = mount({ series: [threats[0]] }, () => [h(ChartLine), h(ChartLegend)])
    expect(view.queryByTestId('chart-chart__legend')).toBeNull()
  })

  it('toggles a series from the legend and keeps the others painted the same', async () => {
    const view = mount()
    await nextTick()
    const [allowed] = view.getAllByTestId('chart-chart__legend-item')
    expect(allowed?.getAttribute('aria-pressed')).toBe('true')
    await fireEvent.click(allowed as Element)
    expect(allowed?.getAttribute('aria-pressed')).toBe('false')
    expect(
      view.getByTestId('chart-chart__area').querySelector('[data-series="allowed"]')
    ).toBeNull()
    expect(
      view.getByTestId('chart-chart__line').querySelector('path')?.getAttribute('stroke')
    ).toBe('var(--chart-series-2)')
    const toggles = view.emitted('legend-toggle') as unknown[][] | undefined
    expect(toggles).toBeUndefined()
  })

  it('emits legend-toggle with the event first and the consumer series second', async () => {
    const hidden = ref<string[]>([])
    const toggles: unknown[][] = []
    const view = render({
      render: () =>
        h(
          Chart,
          {
            series: threats,
            labels,
            ariaLabel: 'Threats',
            hiddenSeries: hidden.value,
            'onUpdate:hiddenSeries': (next: string[]) => {
              hidden.value = next
            },
            onLegendToggle: (...args: unknown[]) => toggles.push(args)
          },
          { default: () => [h(ChartLine), h(ChartLegend)] }
        )
    })
    const items = view.getAllByTestId('chart-chart__legend-item')
    await fireEvent.click(items[1] as Element)
    expect(hidden.value).toEqual(['blocked'])
    expect(toggles).toHaveLength(1)
    expect(toggles[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(toggles[0]?.[1]).toBe(threats[1])
  })

  it('walks the points from the keyboard and announces each one', async () => {
    const indexes: Array<number | null> = []
    const clicks: unknown[][] = []
    const view = mount({
      'onUpdate:activeIndex': (index: number | null) => indexes.push(index),
      onPointClick: (...args: unknown[]) => clicks.push(args)
    })
    const plot = plotOf(view)
    plot.focus()
    await fireEvent.keyDown(plot, { key: 'ArrowRight' })
    await fireEvent.keyDown(plot, { key: 'ArrowRight' })
    await fireEvent.keyDown(plot, { key: 'End' })
    await fireEvent.keyDown(plot, { key: 'Home' })
    expect(indexes).toEqual([0, 1, 3, 0])
    expect(view.getByTestId('chart-chart__live').textContent).toContain('14:00')
    expect(view.getByTestId('chart-chart__live').textContent).toContain('WAF requests allowed 1.2K')
    await fireEvent.keyDown(plot, { key: 'Enter' })
    expect(clicks).toHaveLength(1)
    expect(clicks[0]?.[0]).toBeInstanceOf(KeyboardEvent)
    expect(clicks[0]?.[1]).toEqual({
      index: 0,
      label: '14:00',
      values: { allowed: 1200, blocked: 320, threat: 80 }
    })
    await fireEvent.keyDown(plot, { key: 'Escape' })
    expect(indexes.at(-1)).toBeNull()
  })

  it('snaps the active index to the nearest category under the pointer', async () => {
    const indexes: Array<number | null> = []
    const view = mount({ 'onUpdate:activeIndex': (index: number | null) => indexes.push(index) })
    await nextTick()
    const plot = plotOf(view)
    const rect = plot.getBoundingClientRect()
    await fireEvent.pointerMove(plot, { clientX: rect.right - 2, clientY: rect.top + 1 })
    expect(indexes.at(-1)).toBe(3)
    await fireEvent.pointerLeave(plot)
    expect(indexes.at(-1)).toBeNull()
  })

  it('shows the tooltip inside the figure with every visible series, value first', async () => {
    const view = mount({ activeIndex: 1 })
    await nextTick()
    const tooltip = view.getByTestId('chart-chart__tooltip')
    expect(view.getByTestId('chart-chart').contains(tooltip)).toBe(true)
    const text = tooltip.textContent ?? ''
    expect(text).toContain('14:05')
    expect(text).toContain('1.4K')
    expect(text).toContain('WAF requests blocked')
    expect(text.indexOf('1.4K')).toBeLessThan(text.indexOf('WAF requests allowed'))
  })

  it('renders exactly one state at a time', () => {
    const loading = mount({ loading: true })
    expect(loading.getByTestId('chart-chart__skeleton')).toBeTruthy()
    expect(loading.queryByTestId('chart-chart__plot')).toBeNull()
    expect(loading.getByTestId('chart-chart').getAttribute('aria-busy')).toBe('true')
    loading.unmount()

    const failed = mount({ error: 'The chart could not load.' })
    expect(failed.getByTestId('chart-chart__error').textContent).toContain(
      'The chart could not load.'
    )
    expect(failed.queryByTestId('chart-chart__plot')).toBeNull()
    failed.unmount()

    const empty = mount({ series: [{ id: 'a', name: 'A', values: [null, null] }] })
    expect(empty.getByTestId('chart-chart__empty').textContent).toContain('No data available')
    expect(empty.getByTestId('chart-chart').hasAttribute('data-empty')).toBe(true)
  })

  it('thins axis labels to the width it has, so neighbours never overlap', async () => {
    const hours = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`)
    const traffic: ChartSeries[] = [
      { id: 'requests', name: 'Requests', values: hours.map((_, index) => 1000 + index * 40) }
    ]
    const at = (width: number, props: Record<string, unknown>, axis: 'x' | 'y') =>
      render({
        render: () =>
          h('div', { style: `width: ${width}px` }, [
            h(
              Chart,
              { series: traffic, labels: hours, ariaLabel: 'Requests', ...props },
              { default: () => [h(ChartAxis, { kind: 'x', ticks: 24 }), h(ChartBar)] }
            )
          ])
      }).container.querySelector(`[data-testid="chart-chart__axis-${axis}"]`) as globalThis.Element

    const gapsClear = (axis: globalThis.Element) => {
      const texts = [...axis.querySelectorAll('text')]
      return texts.every((text, index) => {
        if (index === 0) return true
        const previous = texts[index - 1]
        const gap = Number(text.getAttribute('x')) - Number(previous.getAttribute('x'))
        return gap >= (previous.textContent?.trim().length ?? 0) * 7
      })
    }

    const wide = at(1600, {}, 'x')
    await vi.waitFor(() => expect(wide.querySelectorAll('text')).toHaveLength(24))

    const narrow = at(320, {}, 'x')
    await vi.waitFor(() => {
      expect(narrow.querySelectorAll('text').length).toBeGreaterThan(1)
      expect(narrow.querySelectorAll('text').length).toBeLessThan(24)
    })
    expect(gapsClear(narrow)).toBe(true)

    const ranking = at(
      240,
      { orientation: 'horizontal', formatValue: (value: number) => `${value} requests` },
      'x'
    )
    await vi.waitFor(() => {
      expect(ranking.querySelectorAll('text').length).toBeGreaterThan(1)
      expect(gapsClear(ranking)).toBe(true)
    })
  })

  it('explains an empty range and offers the consumer actions', async () => {
    const view = render(Chart, {
      props: {
        series: [{ id: 'a', name: 'A', values: [null, null] }],
        labels,
        ariaLabel: 'Threats vs requests',
        emptyTitle: 'No requests match these filters',
        emptyDescription: 'Choose another host or widen the time range.'
      },
      slots: { 'empty-actions': () => h('button', { type: 'button' }, 'Clear filters') }
    })
    expect(view.getByTestId('chart-chart__empty__title').textContent).toContain(
      'No requests match these filters'
    )
    expect(view.getByTestId('chart-chart__empty__description').textContent).toContain(
      'Choose another host or widen the time range.'
    )
    expect(view.getByTestId('chart-chart__empty__icon')).toBeTruthy()
    expect(
      view.getByTestId('chart-chart__empty__actions').querySelector('button')?.textContent
    ).toBe('Clear filters')
    await expectNoA11yViolations(view.container)
  })

  it('renders no actions region when the consumer passes none', () => {
    const view = mount({ series: [{ id: 'a', name: 'A', values: [null, null] }] })
    expect(view.queryByTestId('chart-chart__empty__description')).toBeNull()
    expect(view.queryByTestId('chart-chart__empty__actions')).toBeNull()
  })

  it('holds the previous render while refetching', () => {
    const view = mount({ refetching: true })
    expect(view.getByTestId('chart-chart').hasAttribute('data-refetching')).toBe(true)
    expect(view.getByTestId('chart-chart__plot')).toBeTruthy()
  })

  it('keeps a table twin of every value and shows it in table view', () => {
    const chart = mount()
    const twin = chart.getByTestId('chart-chart__twin')
    expect(twin.querySelectorAll('tbody tr')).toHaveLength(labels.length)
    expect(twin.querySelectorAll('thead th')).toHaveLength(threats.length + 1)
    chart.unmount()

    const table = mount({ tableView: true })
    expect(table.getByTestId('chart-chart__table').querySelectorAll('tbody tr')).toHaveLength(4)
    expect(table.queryByTestId('chart-chart__plot')).toBeNull()
  })

  it('lays bars down the side when horizontal', async () => {
    const view = mount({ orientation: 'horizontal' }, () => [
      h(ChartAxis, { kind: 'y' }),
      h(ChartBar, { ids: ['allowed'], labeled: true })
    ])
    await measured(view)
    expect(view.getByTestId('chart-chart').getAttribute('data-orientation')).toBe('horizontal')
    const bar = view.getByTestId('chart-chart__bar')
    expect(bar.querySelectorAll('path')).toHaveLength(4)
    expect(bar.querySelectorAll('text')).toHaveLength(4)
  })

  it('throws when a part renders outside a chart', () => {
    expect(() => render(ChartLine)).toThrow('Chart.* sub-components must be used inside <Chart>.')
  })

  it('has no a11y violations in the chart, loading and table views', async () => {
    for (const props of [{}, { loading: true }, { tableView: true }, { error: 'Failed' }]) {
      const view = mount(props)
      await nextTick()
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
