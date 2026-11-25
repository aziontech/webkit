import { fireEvent, render, type RenderResult } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DefaultExample from '../../../../examples/contribution-graph/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ContributionGraph, { type ContributionGraphItem } from './contribution-graph.vue'

const sampleItems: ContributionGraphItem[] = [
  { date: '2026-01-05', count: 2, level: 1 },
  { date: '2026-06-15', count: 8, level: 3 },
  { date: '2026-11-22', count: 14, level: 4 }
]

const mount = (props: Record<string, unknown> = {}) =>
  render(ContributionGraph, {
    props: {
      items: sampleItems,
      year: 2026,
      ariaLabel: 'Platform contributions in 2026',
      ...props
    }
  })

const cellOn = (view: RenderResult, date: string): HTMLElement => {
  const cell = view
    .getAllByTestId('contribution-graph__cell')
    .find((c) => c.getAttribute('data-date') === date)
  if (!cell) throw new Error(`no cell for ${date}`)
  return cell
}

describe('ContributionGraph', () => {
  it('renders the default example', () => {
    const view = render(DefaultExample)
    expect(view.getByTestId('contribution-graph')).toBeTruthy()
    expect(view.getAllByTestId('contribution-graph__cell').length).toBeGreaterThan(300)
  })

  it('renders the fallback data-testid and allows overriding it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('contribution-graph')).toBeTruthy()
    fallback.unmount()
    expect(mount({ 'data-testid': 'activity-grid' }).getByTestId('activity-grid')).toBeTruthy()
  })

  it('renders one cell per day of the year in seven rows, in both variants', () => {
    const view = mount({ variant: 'dot' })
    expect(view.getByTestId('contribution-graph').getAttribute('data-variant')).toBe('dot')
    expect(view.getAllByTestId('contribution-graph__cell')).toHaveLength(365)
    expect(view.getAllByRole('row')).toHaveLength(7)
    const nov22 = cellOn(view, '2026-11-22')
    expect(nov22.getAttribute('data-level')).toBe('4')
    expect(nov22.getAttribute('data-variant')).toBe('dot')
  })

  it('renders only the days of the selected year as cells', () => {
    const view = mount()
    const dates = view.getAllByTestId('contribution-graph__cell').map((c) => c.dataset['date'])
    expect(dates).not.toContain('2025-12-31')
    expect(dates).not.toContain('2027-01-01')
    expect(dates).toContain('2026-01-01')
    expect(dates).toContain('2026-12-31')
  })

  it('derives the level from the count when the item has none', () => {
    const view = mount({
      items: [
        { date: '2026-02-02', count: 1 },
        { date: '2026-02-03', count: 8 }
      ]
    })
    expect(cellOn(view, '2026-02-02').getAttribute('data-level')).toBe('1')
    expect(cellOn(view, '2026-02-03').getAttribute('data-level')).toBe('4')
    expect(cellOn(view, '2026-02-04').getAttribute('data-level')).toBe('0')
  })

  it('selects and clears a day on click and emits select', async () => {
    const view = mount()
    const target = cellOn(view, '2026-11-22')
    await fireEvent.click(target)
    expect(target.getAttribute('aria-selected')).toBe('true')
    expect(view.emitted('select')).toHaveLength(1)
    expect(view.emitted('update:selectedDate')?.[0]).toEqual(['2026-11-22'])
    expect(view.getByTestId('contribution-graph__readout').textContent).toContain('14')

    await fireEvent.click(target)
    expect(target.getAttribute('aria-selected')).toBe('false')
    expect(view.emitted('update:selectedDate')?.[1]).toEqual([null])
  })

  it('clears the selection on Escape', async () => {
    const view = mount({ selectedDate: '2026-11-22' })
    await fireEvent.keyDown(cellOn(view, '2026-11-22'), { key: 'Escape' })
    expect(view.emitted('update:selectedDate')?.[0]).toEqual([null])
  })

  it('moves by week and by day with the keyboard, inside the year', async () => {
    const view = mount()
    cellOn(view, '2026-03-04').focus()
    await fireEvent.keyDown(cellOn(view, '2026-03-04'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(cellOn(view, '2026-03-11'))
    await fireEvent.keyDown(cellOn(view, '2026-03-11'), { key: 'ArrowDown' })
    expect(document.activeElement).toBe(cellOn(view, '2026-03-12'))
    await fireEvent.keyDown(cellOn(view, '2026-03-12'), { key: 'Home' })
    expect(document.activeElement).toBe(cellOn(view, '2026-01-01'))
    await fireEvent.keyDown(cellOn(view, '2026-01-01'), { key: 'ArrowUp' })
    expect(document.activeElement).toBe(cellOn(view, '2026-01-01'))
    await fireEvent.keyDown(cellOn(view, '2026-01-01'), { key: 'End' })
    expect(document.activeElement).toBe(cellOn(view, '2026-12-31'))
  })

  it('moves to the previous week on ArrowRight under rtl', async () => {
    document.documentElement.setAttribute('dir', 'rtl')
    try {
      const view = mount()
      cellOn(view, '2026-03-11').focus()
      await fireEvent.keyDown(cellOn(view, '2026-03-11'), { key: 'ArrowRight' })
      expect(document.activeElement).toBe(cellOn(view, '2026-03-04'))
    } finally {
      document.documentElement.removeAttribute('dir')
    }
  })

  it('renders loading, empty, and error states', () => {
    const loadingView = mount({ loading: true })
    expect(loadingView.getByTestId('contribution-graph__loading')).toBeTruthy()
    expect(loadingView.getByTestId('contribution-graph').getAttribute('aria-busy')).toBe('true')
    loadingView.unmount()

    const emptyView = render(ContributionGraph, {
      props: { items: [], ariaLabel: 'Empty activity' }
    })
    expect(emptyView.getByTestId('contribution-graph__empty')).toBeTruthy()
    emptyView.unmount()

    const errorView = mount({ error: 'Failed to load contributions.' })
    const alert = errorView.getByRole('alert')
    expect(alert.contains(errorView.getByTestId('contribution-graph__error'))).toBe(true)
    expect(alert.textContent).toContain("Contributions didn't load")
    expect(alert.textContent).toContain('Failed to load contributions.')
  })

  it('passes axe accessibility checks in LTR and RTL', async () => {
    const view = mount({ selectedDate: '2026-06-15' })
    await expectNoA11yViolations(view.container)
    view.unmount()

    document.documentElement.setAttribute('dir', 'rtl')
    try {
      const rtlView = mount()
      await expectNoA11yViolations(rtlView.container)
      rtlView.unmount()
    } finally {
      document.documentElement.removeAttribute('dir')
    }
  })
})
