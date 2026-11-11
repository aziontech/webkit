import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import type { ChartSeries } from '../_lib'
import Chart, {
  ChartAxis,
  ChartBar,
  ChartBrush,
  ChartCrosshair,
  ChartLine,
  ChartScatter,
  ChartTooltip
} from './index'

const labels = ['14:00', '14:05', '14:10', '14:15']
const threats: ChartSeries[] = [
  { id: 'allowed', name: 'WAF requests allowed', values: [1200, 1350, 1280, 1500] },
  { id: 'blocked', name: 'WAF requests blocked', values: [320, 410, null, 520] }
]

const mount = (
  props: Record<string, unknown> = {},
  children: () => unknown[] = () => [h(ChartAxis, { kind: 'y' }), h(ChartAxis, { kind: 'x' })],
  dir: 'ltr' | 'rtl' = 'ltr'
) =>
  render({
    render: () =>
      h('div', { style: 'width: 640px', dir }, [
        h(
          Chart,
          { series: threats, labels, ariaLabel: 'Threats vs requests', ...props },
          { default: children }
        )
      ])
  })

const measured = (view: ReturnType<typeof render>) =>
  vi.waitFor(() => {
    const layer = view.container.querySelector('figure svg')
    expect(Number(layer?.getAttribute('width'))).toBeGreaterThan(0)
  })

const plotOf = (view: ReturnType<typeof render>) => view.getByTestId('chart-chart__plot')

afterEach(() => {
  document.documentElement.removeAttribute('dir')
})

describe('Chart types', () => {
  it('attaches Scatter and Brush to the root for dot notation', () => {
    expect(Chart.Scatter).toBe(ChartScatter)
    expect(Chart.Brush).toBe(ChartBrush)
  })

  it('draws one dot per value in a scatter and skips gaps', async () => {
    const view = mount({}, () => [h(ChartScatter)])
    await measured(view)
    const scatter = view.getByTestId('chart-chart__scatter')
    expect(scatter.querySelectorAll('[data-series="allowed"] circle')).toHaveLength(4)
    expect(scatter.querySelectorAll('[data-series="blocked"] circle')).toHaveLength(3)
    expect(scatter.querySelector('circle')?.getAttribute('fill')).toBe('var(--chart-series-1)')
  })

  it('places numeric labels by value on a linear label scale', async () => {
    const view = mount(
      {
        labels: [0, 10, 40],
        labelScale: 'linear',
        series: [{ id: 'latency', name: 'Latency', values: [5, 8, 9] }]
      },
      () => [h(ChartScatter)]
    )
    await measured(view)
    const xs = [...view.getByTestId('chart-chart__scatter').querySelectorAll('circle')].map((dot) =>
      Number(dot.getAttribute('cx'))
    )
    expect(view.getByTestId('chart-chart').getAttribute('data-label-scale')).toBe('linear')
    const [a = 0, b = 0, c = 0] = xs
    expect((b - a) / (c - a)).toBeCloseTo(0.25, 1)
  })

  it('sets a mixed chart on bands so the line sits on the bar centers', async () => {
    const view = mount({}, () => [h(ChartBar, { ids: ['allowed'] }), h(ChartLine, { ids: ['blocked'] })])
    await measured(view)
    await fireEvent.keyDown(plotOf(view), { key: 'ArrowRight' })
    const marker = view.getByTestId('chart-chart__line').querySelector('circle')
    const bar = view.getByTestId('chart-chart__bar').querySelector('path') as SVGPathElement
    const box = bar.getBBox()
    expect(Number(marker?.getAttribute('cx'))).toBeCloseTo(box.x + box.width / 2, 0)
  })

  it('cycles the focused series with Up and Down and reads only that series', async () => {
    const view = mount({}, () => [h(ChartLine)])
    await measured(view)
    const plot = plotOf(view)
    plot.focus()
    await fireEvent.keyDown(plot, { key: 'ArrowDown' })
    const live = view.getByTestId('chart-chart__live')
    expect(live.textContent).toContain('WAF requests allowed')
    expect(live.textContent).not.toContain('WAF requests blocked')
    expect(
      view.getByTestId('chart-chart__line').querySelector('[data-series="blocked"]')?.getAttribute('data-dimmed')
    ).toBe('true')
    await fireEvent.keyDown(plot, { key: 'ArrowDown' })
    expect(live.textContent).toContain('WAF requests blocked')
    await fireEvent.keyDown(plot, { key: 'Escape' })
    expect(live.textContent).toContain('WAF requests allowed')
  })

  it('selects a range with Shift and the arrows, then commits it with Enter', async () => {
    const onRange = vi.fn()
    const view = mount({ 'onUpdate:range': onRange }, () => [h(ChartBrush), h(ChartBar)])
    await measured(view)
    const plot = plotOf(view)
    plot.focus()
    await fireEvent.keyDown(plot, { key: 'ArrowRight' })
    await fireEvent.keyDown(plot, { key: 'ArrowRight', shiftKey: true })
    await fireEvent.keyDown(plot, { key: 'ArrowRight', shiftKey: true })
    expect(view.getByTestId('chart-chart').getAttribute('data-brushing')).toBe('true')
    expect(view.getByTestId('chart-chart__live').textContent).toBe('Selecting from 14:00 to 14:10')
    expect(view.getByTestId('chart-chart__brush').querySelector('rect')).toBeTruthy()
    await fireEvent.keyDown(plot, { key: 'Enter' })
    expect(onRange).toHaveBeenLastCalledWith([0, 2])
    expect(view.getByTestId('chart-chart__live').textContent).toBe('Selected from 14:00 to 14:10')
  })

  it('selects a range by dragging across the plot', async () => {
    const onRange = vi.fn()
    const view = mount({ 'onUpdate:range': onRange }, () => [h(ChartBrush), h(ChartBar)])
    await measured(view)
    const plot = plotOf(view)
    const rect = plot.getBoundingClientRect()
    const y = rect.top + 20
    await fireEvent.pointerDown(plot, { clientX: rect.right - 4, clientY: y, button: 0, pointerId: 1 })
    await fireEvent.pointerMove(plot, { clientX: rect.left + rect.width / 2 - 4, clientY: y, pointerId: 1 })
    await fireEvent.pointerUp(plot, { clientX: rect.left + rect.width / 2 - 4, clientY: y, pointerId: 1 })
    expect(onRange).toHaveBeenLastCalledWith([1, 3])
  })

  it('draws a controlled range and clears it with Escape', async () => {
    const onRange = vi.fn()
    const view = mount({ range: [1, 2], 'onUpdate:range': onRange }, () => [h(ChartBrush), h(ChartBar)])
    await measured(view)
    const band = view.getByTestId('chart-chart__brush').querySelector('rect')
    expect(Number(band?.getAttribute('width'))).toBeGreaterThan(0)
    await fireEvent.keyDown(plotOf(view), { key: 'Escape' })
    expect(onRange).toHaveBeenLastCalledWith(null)
  })

  it('runs the category axis from the right and keeps the value axis at the start under rtl', async () => {
    const view = mount({}, () => [h(ChartAxis, { kind: 'y' }), h(ChartAxis, { kind: 'x' }), h(ChartLine, { markers: true })], 'rtl')
    await vi.waitFor(() => {
      const dots = view.getByTestId('chart-chart__line').querySelectorAll('circle')
      expect(dots.length).toBeGreaterThan(1)
      expect(Number(dots[0]?.getAttribute('cx'))).toBeGreaterThan(Number(dots[1]?.getAttribute('cx')))
    })
    const ticks = view.getByTestId('chart-chart__axis-y').querySelectorAll('text')
    const plot = plotOf(view).getBoundingClientRect()
    const tick = (ticks[0] as SVGTextElement).getBoundingClientRect()
    expect(tick.left).toBeGreaterThan(plot.left + plot.width / 2)
    expect(ticks[0]?.getAttribute('text-anchor')).toBe('start')
  })

  it('moves forward with ArrowLeft under rtl', async () => {
    const view = mount({}, () => [h(ChartLine)], 'rtl')
    await measured(view)
    const plot = plotOf(view)
    await vi.waitFor(async () => {
      await fireEvent.keyDown(plot, { key: 'Escape' })
      await fireEvent.keyDown(plot, { key: 'ArrowLeft' })
      expect(view.getByTestId('chart-chart__live').textContent).toContain('14:00')
    })
    await fireEvent.keyDown(plot, { key: 'ArrowLeft' })
    expect(view.getByTestId('chart-chart__live').textContent).toContain('14:05')
  })

  it('grows horizontal bars from the end side under rtl', async () => {
    const view = mount({ orientation: 'horizontal', series: [threats[0]] }, () => [h(ChartBar)], 'rtl')
    await vi.waitFor(() => {
      const bar = view.getByTestId('chart-chart__bar').querySelector('path') as SVGPathElement
      const plot = plotOf(view).getBoundingClientRect()
      const box = bar.getBoundingClientRect()
      expect(box.right).toBeGreaterThan(plot.left + plot.width * 0.8)
    })
  })

  it('has no a11y violations with scatter, brush, crosshair and tooltip', async () => {
    const view = mount({ range: [0, 1] }, () => [
      h(ChartBrush),
      h(ChartScatter),
      h(ChartCrosshair),
      h(ChartTooltip)
    ])
    await measured(view)
    await expectNoA11yViolations(view.container)
  })
})
