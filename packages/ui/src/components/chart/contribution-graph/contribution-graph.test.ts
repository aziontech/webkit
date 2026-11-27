import { fireEvent, render, type RenderResult } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { nextTick } from 'vue'

import DefaultExample from '../../../../examples/contribution-graph/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ContributionGraph, { type ContributionGraphItem } from './contribution-graph.vue'
import { buildCalendarGrid } from './lib/calendar-grid'

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

  it('renders one cell per day of the year in seven rows', () => {
    const view = mount()
    expect(view.getAllByTestId('contribution-graph__cell')).toHaveLength(365)
    expect(view.getAllByRole('row')).toHaveLength(7)
    expect(cellOn(view, '2026-11-22').getAttribute('data-level')).toBe('4')
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

  it('scales the levels by the days shown, not by items outside the year', () => {
    const view = render(ContributionGraph, {
      props: {
        year: 2026,
        items: [
          { date: '2025-12-31', count: 500 },
          { date: '2026-03-02', count: 4 }
        ]
      }
    })
    expect(cellOn(view, '2026-03-02').getAttribute('data-level')).toBe('4')
  })

  it('names the grid when ariaLabel is left out', () => {
    const view = render(ContributionGraph, { props: { year: 2026, items: sampleItems } })
    expect(view.getByRole('grid', { name: 'Contributions' })).toBeTruthy()
  })

  it('draws a leap year as 366 days and keeps one cell in the tab order', () => {
    const view = render(ContributionGraph, {
      props: { year: 2028, items: [], ariaLabel: 'Leap year' }
    })
    const cells = view.getAllByTestId('contribution-graph__cell')
    expect(cells).toHaveLength(366)
    expect(cells.filter((cell) => cell.tabIndex === 0)).toHaveLength(1)
  })

  it('announces only the picked day, and Enter picks it and emits the event first', async () => {
    const view = mount()
    const live = view.getByTestId('contribution-graph__live')
    const day = cellOn(view, '2026-06-15')
    await fireEvent.pointerOver(day)
    day.focus()
    expect(live.textContent?.trim()).toBe('')
    await userEvent.keyboard('{Enter}')
    expect(live.textContent).toContain('8 contributions')
    const [event, item] = view.emitted<unknown[]>('select')!.at(-1)!
    expect(event).toBeInstanceOf(Event)
    expect(item).toMatchObject({ date: '2026-06-15', count: 8 })
    expect(view.emitted<unknown[]>('update:selectedDate')!.at(-1)).toEqual(['2026-06-15'])
  })

  it('clears the readout once focus leaves the grid', async () => {
    const view = mount()
    const day = cellOn(view, '2026-06-15')
    day.focus()
    await nextTick()
    const readout = view.getByTestId('contribution-graph__readout')
    expect(readout.textContent).toContain('8 contributions')
    day.blur()
    await fireEvent.focusOut(day, { relatedTarget: document.body })
    await nextTick()
    expect(readout.textContent).toContain('Select a day')
  })

  it('puts each month label on the week of its 1st in a rolling window', () => {
    const grid = buildCalendarGrid([{ date: '2026-11-26', count: 1 }], undefined, '2026-11-26')
    const first = grid.months[0]!
    expect(first.utcDate.toISOString().slice(0, 10)).toBe('2025-12-01')
    for (const month of grid.months) {
      const firstDay = grid.days.find(
        (day) => day.date === month.utcDate.toISOString().slice(0, 10)
      )!
      expect(firstDay.weekIndex).toBe(month.weekIndex)
    }
    expect(grid.months.map((month) => month.utcDate.getUTCMonth())).toEqual([
      11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ])
  })

  it('says it is loading to assistive tech', () => {
    const view = mount({ loading: true })
    expect(view.getByRole('status').textContent).toContain('Loading contributions')
  })

  it('keeps the focused day in the readout when Escape clears the selection', async () => {
    const view = mount({ selectedDate: '2026-06-15' })
    const day = cellOn(view, '2026-06-15')
    day.focus()
    await userEvent.keyboard('{Escape}')
    expect(view.emitted<unknown[]>('update:selectedDate')!.at(-1)).toEqual([null])
    expect(view.getByTestId('contribution-graph__readout').textContent).toContain('8 contributions')
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
