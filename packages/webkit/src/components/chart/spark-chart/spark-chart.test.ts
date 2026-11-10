import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import SparkChart from './spark-chart.vue'

const values = [310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]

const mount = (props: Record<string, unknown> = {}) =>
  render(SparkChart, { props: { values, ...props } })

const paths = (root: HTMLElement) => [...root.querySelectorAll('path')]

describe('SparkChart', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('chart-spark-chart')).toBeTruthy()
    fallback.unmount()
    expect(mount({ 'data-testid': 'requests-spark' }).getByTestId('requests-spark')).toBeTruthy()
  })

  it('defaults to an area at medium size', () => {
    const root = mount().getByTestId('chart-spark-chart')
    expect(root.getAttribute('data-kind')).toBe('area')
    expect(root.getAttribute('data-size')).toBe('medium')
  })

  it.each(['area', 'line', 'bar'] as const)('maps kind %s to data-kind', (kind) => {
    expect(mount({ kind }).getByTestId('chart-spark-chart').getAttribute('data-kind')).toBe(kind)
  })

  it.each(['small', 'medium', 'large'] as const)('maps size %s to data-size', (size) => {
    expect(mount({ size }).getByTestId('chart-spark-chart').getAttribute('data-size')).toBe(size)
  })

  it('draws a line as one unfilled stroked path in the chosen hue', () => {
    const marks = paths(mount({ kind: 'line', color: 3 }).getByTestId('chart-spark-chart'))
    expect(marks).toHaveLength(1)
    const [line] = marks
    expect(line?.getAttribute('d')).toMatch(/^M[\d.,-]+L/)
    expect(line?.getAttribute('fill')).toBe('none')
    expect(line?.getAttribute('stroke')).toBe('var(--chart-series-3)')
  })

  it('draws an area as a gradient fill plus an edge', () => {
    const root = mount({ kind: 'area', color: 'success' }).getByTestId('chart-spark-chart')
    const marks = paths(root)
    expect(marks).toHaveLength(2)
    const [fill, edge] = marks
    const gradient = root.querySelector('linearGradient')
    expect(gradient?.id).toBeTruthy()
    expect(fill?.getAttribute('fill')).toBe(`url(#${gradient?.id})`)
    expect(fill?.getAttribute('d')).toMatch(/Z$/)
    expect(edge?.getAttribute('fill')).toBe('none')
    expect(edge?.getAttribute('stroke')).toBe('var(--chart-status-success)')
  })

  it('draws one bar per finite value', () => {
    const marks = paths(mount({ kind: 'bar' }).getByTestId('chart-spark-chart'))
    expect(marks).toHaveLength(values.length)
    expect(marks.every((bar) => bar.getAttribute('fill') === 'var(--chart-series-1)')).toBe(true)
  })

  it('leaves no bar where a value is null', () => {
    const bars = paths(
      mount({ kind: 'bar', values: [4, 6, null, 8, 5] }).getByTestId('chart-spark-chart')
    )
    expect(bars).toHaveLength(4)
  })

  it('breaks the line where a value is null', () => {
    const marks = paths(
      mount({ kind: 'line', values: [4, 6, null, 8, 5] }).getByTestId('chart-spark-chart')
    )
    expect(marks).toHaveLength(1)
    expect(marks[0]?.getAttribute('d')?.match(/M/g)).toHaveLength(2)
  })

  it.each(['area', 'line', 'bar'] as const)('renders no %s mark without a finite value', (kind) => {
    const empty = mount({ kind, values: [] })
    expect(paths(empty.getByTestId('chart-spark-chart'))).toHaveLength(0)
    empty.unmount()
    const nulls = mount({ kind, values: [null, null] })
    expect(paths(nulls.getByTestId('chart-spark-chart'))).toHaveLength(0)
  })

  it('is decorative without an ariaLabel', () => {
    const svg = mount().getByTestId('chart-spark-chart').querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('role')).toBeNull()
  })

  it('is an image named by its ariaLabel', () => {
    const view = mount({ ariaLabel: 'Requests over the last hour, rising' })
    const image = view.getByRole('img', { name: 'Requests over the last hour, rising' })
    expect(image.tagName.toLowerCase()).toBe('svg')
    expect(image.getAttribute('aria-hidden')).toBeNull()
  })

  it('has no axe violations, decorative or labelled', async () => {
    const decorative = mount()
    await expectNoA11yViolations(decorative.container)
    decorative.unmount()
    const labelled = mount({ kind: 'bar', ariaLabel: 'Requests over the last hour' })
    await expectNoA11yViolations(labelled.container)
  })
})
