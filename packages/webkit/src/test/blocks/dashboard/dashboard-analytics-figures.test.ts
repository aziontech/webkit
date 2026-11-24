import { describe, expect, it } from 'vitest'

import {
  overviewHighlights,
  overviewSummary,
  type PanelSeries,
  periods,
  products,
  seededFigure,
  seededSeries
} from '../../../../blocks/dashboard/dashboard-analytics/metrics-data'

type Plotted = { series: PanelSeries[]; rate?: boolean }
type Figure = { id: string; base: number; rate?: boolean }

const sum = (values: readonly (number | null)[]) =>
  values.reduce<number>((total, value) => total + (value ?? 0), 0)

function expectOneFigure(prefix: string, tiles: Figure[], plots: Plotted[]) {
  for (const period of periods) {
    const charted = new Map<string, number>()
    for (const plot of plots) {
      for (const series of seededSeries(prefix, plot.series, period, plot.rate)) {
        const total = sum(series.values)
        const seen = charted.get(series.id)
        if (seen !== undefined) expect(total, `${prefix} ${series.id} ${period.value}`).toBe(seen)
        charted.set(series.id, total)
      }
    }
    for (const tile of tiles) {
      const plotted = charted.get(tile.id)
      if (plotted === undefined || tile.rate) continue
      const { value } = seededFigure(`${prefix}:${tile.id}:${period.value}`, tile.base, period)
      expect(value, `${prefix} tile ${tile.id} ${period.value}`).toBe(plotted)
    }
  }
}

describe('dashboard/dashboard-analytics figures', () => {
  it.each(products.map((product) => [product.id, product] as const))(
    '%s: a tile and every chart that plots the same series show one figure',
    (_id, product) => expectOneFigure(product.id, product.tiles, product.panels)
  )

  it('Metrics overview: a tile and every chart that plots the same series show one figure', () => {
    expectOneFigure('overview', overviewSummary, overviewHighlights)
  })

  it('draws each status class in one colour on every chart', () => {
    const colours = new Map<string, unknown>()
    const all = [...products.flatMap((product) => product.panels), ...overviewHighlights]
    for (const series of all.flatMap((plot) => plot.series)) {
      if (!/^[2345]xx$/.test(series.id)) continue
      expect(series.color, series.id).toBeDefined()
      if (colours.has(series.id)) expect(series.color).toBe(colours.get(series.id))
      colours.set(series.id, series.color)
    }
    expect(colours.get('5xx')).toBe('danger')
  })
})
