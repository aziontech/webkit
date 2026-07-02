import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/calendar/Calendar.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Calendar from './calendar.vue'

const { Default, Range } = composeStories(stories)

// A fixed anchor keeps every assertion deterministic — the visible month is
// seeded from the model value (seedDate), so October 2026 is always rendered.
const OCT_8 = new Date(2026, 9, 8)
const OCT_2026_LABEL = 'October 2026'

// Finds the day button whose textContent (the day number) matches `label`
// AND that is NOT an adjacent-month (outside) cell — the 6x7 grid renders
// leading/trailing days from neighbouring months with the same number.
const findDayButton = (container: HTMLElement, label: number): HTMLButtonElement => {
  const days = Array.from(
    container.querySelectorAll<HTMLButtonElement>('[data-testid="input-calendar__day"]')
  )
  const match = days.find(
    (day) => day.textContent?.trim() === String(label) && day.getAttribute('data-outside') === null
  )

  if (!match) {
    throw new Error(`No in-month day button labelled ${label} found`)
  }

  return match
}

describe('Calendar', () => {
  it('renders the root, header, label, grid and day-cell structure with the default testid', () => {
    const { getByTestId, getAllByTestId } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const root = getByTestId('input-calendar')
    expect(root.tagName).toBe('DIV')

    expect(getByTestId('input-calendar__header')).toBeTruthy()
    expect(getByTestId('input-calendar__label').textContent?.trim()).toBe(OCT_2026_LABEL)

    const grid = getByTestId('input-calendar__grid')
    expect(grid.getAttribute('role')).toBe('grid')
    expect(grid.getAttribute('aria-label')).toBe(OCT_2026_LABEL)

    // 6 rows of 7 = 42 day buttons.
    expect(getAllByTestId('input-calendar__day')).toHaveLength(42)
  })

  it('honors a consumer-supplied data-testid on the root and derives the sub-part testids', () => {
    const { getByTestId } = render(Calendar, {
      props: { modelValue: OCT_8 },
      attrs: { 'data-testid': 'my-calendar' }
    })

    expect(getByTestId('my-calendar').tagName).toBe('DIV')
    expect(getByTestId('my-calendar__label').textContent?.trim()).toBe(OCT_2026_LABEL)
    expect(getByTestId('my-calendar__grid').getAttribute('role')).toBe('grid')
    expect(getByTestId('my-calendar__prev')).toBeTruthy()
    expect(getByTestId('my-calendar__next')).toBeTruthy()
  })

  it('exposes grid a11y roles: rows, columnheaders (weekday labels) and gridcells', () => {
    const { getByTestId } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const grid = getByTestId('input-calendar__grid')

    // 7 weekday column headers + their labels.
    const columnHeaders = grid.querySelectorAll('[role="columnheader"]')
    expect(columnHeaders).toHaveLength(7)
    expect(Array.from(columnHeaders).map((h) => h.textContent?.trim())).toEqual([
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S'
    ])

    // 1 weekday row + 6 week rows.
    expect(grid.querySelectorAll('[role="row"]')).toHaveLength(7)
    // 42 gridcells.
    expect(grid.querySelectorAll('[role="gridcell"]')).toHaveLength(42)
  })

  it('marks the selected single day: aria-selected, data-selected and band=single', () => {
    const { container } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const selected = findDayButton(container as HTMLElement, 8)
    expect(selected.getAttribute('data-selected')).toBe('true')
    expect(selected.getAttribute('data-band')).toBe('single')

    // The wrapping gridcell carries aria-selected.
    const cell = selected.closest('[role="gridcell"]')
    expect(cell?.getAttribute('aria-selected')).toBe('true')
  })

  it('emits update:modelValue with the clicked Date in single mode (v-model round-trip)', async () => {
    const { container, emitted } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    await fireEvent.click(findDayButton(container as HTMLElement, 15))

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)

    const payload = events[0][0] as Date
    expect(payload).toBeInstanceOf(Date)
    expect(payload.getFullYear()).toBe(2026)
    expect(payload.getMonth()).toBe(9)
    expect(payload.getDate()).toBe(15)
  })

  it('range mode: first click emits {start, end:null}; second (later) click emits {start, end}', async () => {
    const { container, emitted, rerender } = render(Calendar, {
      props: { mode: 'range', modelValue: { start: null, end: null } }
    })

    // First pick — day 8 becomes the start, end cleared.
    await fireEvent.click(findDayButton(container as HTMLElement, 8))
    let events = emitted()['update:modelValue']
    expect(events).toHaveLength(1)
    const first = events[0][0] as { start: Date | null; end: Date | null }
    expect(first.start).toBeInstanceOf(Date)
    expect(first.start?.getDate()).toBe(8)
    expect(first.end).toBeNull()

    // Reflect the partial range back (the consumer drives v-model), then pick the end.
    await rerender({ mode: 'range', modelValue: { start: first.start, end: null } })
    await fireEvent.click(findDayButton(container as HTMLElement, 19))

    events = emitted()['update:modelValue']
    expect(events).toHaveLength(2)
    const second = events[1][0] as { start: Date | null; end: Date | null }
    expect(second.start?.getDate()).toBe(8)
    expect(second.end).toBeInstanceOf(Date)
    expect(second.end?.getDate()).toBe(19)
  })

  it('range mode: clicking a day BEFORE the start swaps the endpoints', async () => {
    const { container, emitted } = render(Calendar, {
      props: { mode: 'range', modelValue: { start: new Date(2026, 9, 15), end: null } }
    })

    await fireEvent.click(findDayButton(container as HTMLElement, 5))

    const payload = emitted()['update:modelValue'][0][0] as {
      start: Date | null
      end: Date | null
    }
    // Clicked earlier day becomes start; the prior start becomes end.
    expect(payload.start?.getDate()).toBe(5)
    expect(payload.end?.getDate()).toBe(15)
  })

  it('range mode: a fully selected range renders start/end/middle bands', async () => {
    const { container } = render(Calendar, {
      props: {
        mode: 'range',
        modelValue: { start: new Date(2026, 9, 8), end: new Date(2026, 9, 12) }
      }
    })

    expect(findDayButton(container as HTMLElement, 8).getAttribute('data-band')).toBe('start')
    expect(findDayButton(container as HTMLElement, 12).getAttribute('data-band')).toBe('end')
    expect(findDayButton(container as HTMLElement, 10).getAttribute('data-band')).toBe('middle')
  })

  it('emits month-change and updates the label when Next / Previous are clicked', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    await fireEvent.click(getByTestId('input-calendar__next'))
    expect(getByTestId('input-calendar__label').textContent?.trim()).toBe('November 2026')

    await fireEvent.click(getByTestId('input-calendar__prev'))
    await fireEvent.click(getByTestId('input-calendar__prev'))
    expect(getByTestId('input-calendar__label').textContent?.trim()).toBe('September 2026')

    const events = emitted()['month-change'] as Array<[{ year: number; month: number }]>
    expect(events).toHaveLength(3)
    expect(events[0][0]).toEqual({ year: 2026, month: 10 }) // November (0-indexed)
    expect(events[1][0]).toEqual({ year: 2026, month: 9 }) // October
    expect(events[2][0]).toEqual({ year: 2026, month: 8 }) // September
  })

  it('gives the selected day the roving tabindex=0 and every other day tabindex=-1', () => {
    const { container } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const days = Array.from(
      (container as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '[data-testid="input-calendar__day"]'
      )
    )
    const tabbable = days.filter((day) => day.getAttribute('tabindex') === '0')
    expect(tabbable).toHaveLength(1)
    expect(tabbable[0].textContent?.trim()).toBe('8')
  })

  it('ArrowRight moves the roving tabindex to the next day (real keyboard)', async () => {
    const { container } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const start = findDayButton(container as HTMLElement, 8)
    start.focus()
    expect(document.activeElement).toBe(start)
    expect(start.getAttribute('tabindex')).toBe('0')

    await userEvent.keyboard('{ArrowRight}')

    // The roving tabindex now belongs to day 9; day 8 drops to -1.
    expect(findDayButton(container as HTMLElement, 9).getAttribute('tabindex')).toBe('0')
    expect(start.getAttribute('tabindex')).toBe('-1')
  })

  it('ArrowDown moves the roving tabindex one week forward (real keyboard)', async () => {
    const { container } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const start = findDayButton(container as HTMLElement, 8)
    start.focus()

    await userEvent.keyboard('{ArrowDown}')

    // One week (7 days) forward from the 8th is the 15th.
    expect(findDayButton(container as HTMLElement, 15).getAttribute('tabindex')).toBe('0')
  })

  it('Enter selects the focused day (real keyboard)', async () => {
    const { container, emitted } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const day = findDayButton(container as HTMLElement, 12)
    day.focus()

    await userEvent.keyboard('{Enter}')

    const payload = emitted()['update:modelValue'][0][0] as Date
    expect(payload).toBeInstanceOf(Date)
    expect(payload.getDate()).toBe(12)
  })

  it('Space selects the focused day (real keyboard)', async () => {
    const { container, emitted } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    const day = findDayButton(container as HTMLElement, 20)
    day.focus()

    await userEvent.keyboard(' ')

    const payload = emitted()['update:modelValue'][0][0] as Date
    expect(payload.getDate()).toBe(20)
  })

  it('PageDown pages to the next month and emits month-change (real keyboard)', async () => {
    const { container, getByTestId, emitted } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    findDayButton(container as HTMLElement, 8).focus()
    await userEvent.keyboard('{PageDown}')

    expect(getByTestId('input-calendar__label').textContent?.trim()).toBe('November 2026')
    const events = emitted()['month-change'] as Array<[{ year: number; month: number }]>
    expect(events[events.length - 1][0]).toEqual({ year: 2026, month: 10 })
  })

  it('disables days out of the [min, max] bounds and does not emit when they are clicked', async () => {
    const { container, emitted } = render(Calendar, {
      props: {
        modelValue: OCT_8,
        min: new Date(2026, 9, 5),
        max: new Date(2026, 9, 20)
      }
    })

    const belowMin = findDayButton(container as HTMLElement, 3)
    const inBounds = findDayButton(container as HTMLElement, 10)
    const aboveMax = findDayButton(container as HTMLElement, 25)

    expect((belowMin as HTMLButtonElement).disabled).toBe(true)
    expect(belowMin.getAttribute('data-disabled')).toBe('true')
    expect((inBounds as HTMLButtonElement).disabled).toBe(false)
    expect((aboveMax as HTMLButtonElement).disabled).toBe(true)

    await fireEvent.click(belowMin)
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('disabled: sets data-disabled on the root, disables navigation, and blocks selection', async () => {
    const { getByTestId, container, emitted } = render(Calendar, {
      props: { modelValue: OCT_8, disabled: true }
    })

    expect(getByTestId('input-calendar').getAttribute('data-disabled')).toBe('true')
    expect((getByTestId('input-calendar__prev') as HTMLButtonElement).disabled).toBe(true)
    expect((getByTestId('input-calendar__next') as HTMLButtonElement).disabled).toBe(true)

    await fireEvent.click(findDayButton(container as HTMLElement, 15))
    expect(emitted()['update:modelValue']).toBeUndefined()

    // Navigation clicks are no-ops while disabled.
    await fireEvent.click(getByTestId('input-calendar__next'))
    expect(emitted()['month-change']).toBeUndefined()
    expect(getByTestId('input-calendar__label').textContent?.trim()).toBe(OCT_2026_LABEL)
  })

  it('hides the header (label + nav) when show-header is false', () => {
    const { queryByTestId } = render(Calendar, {
      props: { modelValue: OCT_8, showHeader: false }
    })

    expect(queryByTestId('input-calendar__header')).toBeNull()
    expect(queryByTestId('input-calendar__label')).toBeNull()
    expect(queryByTestId('input-calendar__prev')).toBeNull()
    // The grid remains.
    expect(queryByTestId('input-calendar__grid')).toBeTruthy()
  })

  it('re-seeds the visible month when the model value changes to another month', async () => {
    const { getByTestId, rerender } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    expect(getByTestId('input-calendar__label').textContent?.trim()).toBe(OCT_2026_LABEL)

    await rerender({ modelValue: new Date(2027, 0, 3) })
    expect(getByTestId('input-calendar__label').textContent?.trim()).toBe('January 2027')
  })

  it('exposes the previous/next controls with their accessible labels', () => {
    const { getByTestId } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    expect(getByTestId('input-calendar__prev').getAttribute('aria-label')).toBe('Previous month')
    expect(getByTestId('input-calendar__next').getAttribute('aria-label')).toBe('Next month')
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(Calendar, {
      props: { modelValue: OCT_8 },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-calendar').classList.contains('consumer-class')).toBe(true)
  })

  it.each(['single', 'range'] as const)('renders a grid in %s mode without error', (mode) => {
    const model = mode === 'range' ? { start: OCT_8, end: null } : OCT_8
    const { getByTestId } = render(Calendar, {
      props: { mode, modelValue: model }
    })

    expect(getByTestId('input-calendar__grid').getAttribute('role')).toBe('grid')
  })

  it('has no a11y violations in single mode', async () => {
    const { container } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in range mode with a full range selected', async () => {
    const { container } = render(Calendar, {
      props: {
        mode: 'range',
        modelValue: { start: new Date(2026, 9, 8), end: new Date(2026, 9, 12) }
      }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { container } = render(Default())

    // Default story preselects Oct 8 2026.
    expect(within(container).getByTestId('input-calendar__label').textContent?.trim()).toBe(
      OCT_2026_LABEL
    )
    await expectNoA11yViolations(container)
  })

  it('renders the Range story fixture cleanly', async () => {
    const { container } = render(Range())

    await expectNoA11yViolations(container)
  })
})
