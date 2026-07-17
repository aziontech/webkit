import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/calendar/Calendar.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Calendar from './calendar.vue'

const { Default, Single } = composeStories(stories)

// A fixed anchor keeps every assertion deterministic — the visible month is
// seeded from the committed value when the popover opens, so October 2026 is
// always rendered.
const OCT_8 = new Date(2026, 9, 8)
const OCT_2026_LABEL = 'October 2026'

/** Query the Teleported popover from document.body (it escapes the container). */
const getPopover = (testId = 'input-calendar'): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`[data-testid="${testId}__popover"]`)

/** Query the Teleported presets menu from document.body. */
const getPresetsMenu = (testId = 'input-calendar'): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`[data-testid="${testId}__presets-menu"]`)

/** Click the trigger, wait for the popover, and let the focus trap settle. */
const openCalendar = async (
  getByTestId: (id: string) => HTMLElement,
  testId = 'input-calendar'
): Promise<HTMLElement> => {
  await fireEvent.click(getByTestId(`${testId}__trigger`))

  const popover = await waitFor(() => {
    const el = getPopover(testId)
    expect(el).toBeTruthy()
    return el as HTMLElement
  })

  // The focus trap moves focus to the panel's first focusable on the next tick;
  // wait it out so tests that move focus themselves are not raced.
  await nextTick()

  return popover
}

// Finds the day button whose textContent (the day number) matches `label`
// AND that is NOT an adjacent-month (outside) cell — the 6x7 grid renders
// leading/trailing days from neighbouring months with the same number.
// Day buttons keep the literal `input-calendar__day` testid (CalendarGrid does
// not derive it from the root testid), so the lookup is scoped to the popover.
const findDayButton = (popover: HTMLElement, label: number): HTMLButtonElement => {
  const days = Array.from(
    popover.querySelectorAll<HTMLButtonElement>('[data-testid="input-calendar__day"]')
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
  beforeEach(() => {
    // Teleported panels would leak across tests if a wrapper unmounted
    // mid-transition; scrub any stray panel so document.body queries stay
    // deterministic.
    document.body
      .querySelectorAll('[data-testid$="__popover"], [data-testid$="__presets-menu"]')
      .forEach((el) => el.remove())
  })

  // ---- Trigger & popover open/close ----------------------------------------

  it('renders closed by default: trigger with placeholder, no popover, no grid', () => {
    const { getByTestId } = render(Calendar)

    const root = getByTestId('input-calendar')
    expect(root.tagName).toBe('DIV')
    expect(root.getAttribute('data-state')).toBe('closed')

    const trigger = getByTestId('input-calendar__trigger')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.textContent).toContain('Select a Date Range')

    expect(getPopover()).toBeNull()
    expect(document.body.querySelector('[data-testid="input-calendar__grid"]')).toBeNull()
  })

  it('opens the Teleported popover on trigger click and emits update:open', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)

    expect(popover.getAttribute('role')).toBe('dialog')
    expect(popover.getAttribute('aria-label')).toBe('Choose date')
    expect(within(popover).getByRole('grid')).toBeTruthy()

    expect(getByTestId('input-calendar').getAttribute('data-state')).toBe('open')
    expect(getByTestId('input-calendar__trigger').getAttribute('aria-expanded')).toBe('true')
    expect(emitted()['update:open']).toEqual([[true]])
  })

  it('honors a consumer-supplied data-testid on the root and derives the sub-part testids', async () => {
    const { getByTestId } = render(Calendar, {
      attrs: { 'data-testid': 'my-calendar' }
    })

    expect(getByTestId('my-calendar').tagName).toBe('DIV')
    expect(getByTestId('my-calendar__trigger').getAttribute('aria-haspopup')).toBe('dialog')

    const popover = await openCalendar(getByTestId, 'my-calendar')
    expect(popover.getAttribute('role')).toBe('dialog')
    expect(popover.querySelector('[data-testid="my-calendar__apply"]')).toBeTruthy()
  })

  it('Escape closes the popover, emits update:open=false and returns focus to the trigger', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    await openCalendar(getByTestId)
    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(getPopover()).toBeNull())
    const openEvents = emitted()['update:open']
    expect(openEvents[openEvents.length - 1]).toEqual([false])
    expect(document.activeElement).toBe(getByTestId('input-calendar__trigger'))
  })

  it('closes the popover on an outside mousedown', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    await openCalendar(getByTestId)
    await fireEvent.mouseDown(document.body)

    await waitFor(() => expect(getPopover()).toBeNull())
    expect(getByTestId('input-calendar').getAttribute('data-state')).toBe('closed')
  })

  // ---- Grid structure & a11y roles ------------------------------------------

  it('exposes grid a11y roles: rows, columnheaders (weekday labels) and gridcells', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)
    const grid = within(popover).getByRole('grid')
    expect(grid.getAttribute('aria-label')).toBe(OCT_2026_LABEL)

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
    // 6 rows of 7 = 42 gridcells / day buttons.
    expect(grid.querySelectorAll('[role="gridcell"]')).toHaveLength(42)
    expect(popover.querySelectorAll('[data-testid="input-calendar__day"]')).toHaveLength(42)
  })

  it('marks the selected single day: aria-selected, data-selected and band=single', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)

    const selected = findDayButton(popover, 8)
    expect(selected.getAttribute('data-selected')).toBe('true')
    expect(selected.getAttribute('data-band')).toBe('single')

    // The wrapping gridcell carries aria-selected.
    const cell = selected.closest('[role="gridcell"]')
    expect(cell?.getAttribute('aria-selected')).toBe('true')
  })

  it('range mode: a committed range renders start/end/middle bands when reopened', async () => {
    const { getByTestId } = render(Calendar, {
      props: {
        mode: 'range',
        modelValue: { start: new Date(2026, 9, 8), end: new Date(2026, 9, 12) }
      }
    })

    const popover = await openCalendar(getByTestId)

    expect(findDayButton(popover, 8).getAttribute('data-band')).toBe('start')
    expect(findDayButton(popover, 12).getAttribute('data-band')).toBe('end')
    expect(findDayButton(popover, 10).getAttribute('data-band')).toBe('middle')
  })

  // ---- Selection: draft + Apply / immediate commit ---------------------------

  it('stages day clicks in a draft and only commits on Apply (default show-apply)', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'range', modelValue: { start: null, end: null } }
    })

    const popover = await openCalendar(getByTestId)

    await fireEvent.click(findDayButton(popover, 8))
    await fireEvent.click(findDayButton(popover, 12))

    // The picks live in the draft: bands render, but nothing is committed yet.
    expect(findDayButton(popover, 8).getAttribute('data-band')).toBe('start')
    expect(findDayButton(popover, 12).getAttribute('data-band')).toBe('end')
    expect(emitted()['update:modelValue']).toBeUndefined()

    await fireEvent.click(getByTestId('input-calendar__apply'))

    const events = emitted()['update:modelValue']
    expect(events).toHaveLength(1)
    const payload = events[0][0] as { start: Date | null; end: Date | null }
    expect(payload.start?.getDate()).toBe(8)
    expect(payload.end?.getDate()).toBe(12)

    const applied = emitted()['apply']
    expect(applied).toHaveLength(1)

    // Apply also closes the popover.
    await waitFor(() => expect(getPopover()).toBeNull())
    expect(getByTestId('input-calendar').getAttribute('data-state')).toBe('closed')
  })

  it('show-apply=false commits the clicked Date immediately in single mode', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8, showApply: false }
    })

    const popover = await openCalendar(getByTestId)
    await fireEvent.click(findDayButton(popover, 15))

    const events = emitted()['update:modelValue']
    expect(events).toHaveLength(1)

    const payload = events[0][0] as Date
    expect(payload).toBeInstanceOf(Date)
    expect(payload.getFullYear()).toBe(2026)
    expect(payload.getMonth()).toBe(9)
    expect(payload.getDate()).toBe(15)

    // A complete immediate selection closes the popover.
    await waitFor(() => expect(getPopover()).toBeNull())
  })

  it('show-apply=false range: first click commits {start, end:null}; second commits {start, end}', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'range', modelValue: { start: null, end: null }, showApply: false }
    })

    const popover = await openCalendar(getByTestId)

    // First pick — day 8 becomes the start, end cleared.
    await fireEvent.click(findDayButton(popover, 8))
    let events = emitted()['update:modelValue']
    expect(events).toHaveLength(1)
    const first = events[0][0] as { start: Date | null; end: Date | null }
    expect(first.start).toBeInstanceOf(Date)
    expect(first.start?.getDate()).toBe(8)
    expect(first.end).toBeNull()

    // Second (later) pick completes the range from the staged draft.
    await fireEvent.click(findDayButton(popover, 19))
    events = emitted()['update:modelValue']
    expect(events).toHaveLength(2)
    const second = events[1][0] as { start: Date | null; end: Date | null }
    expect(second.start?.getDate()).toBe(8)
    expect(second.end).toBeInstanceOf(Date)
    expect(second.end?.getDate()).toBe(19)
  })

  it('range mode: clicking a day BEFORE the start swaps the endpoints', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: {
        mode: 'range',
        modelValue: { start: new Date(2026, 9, 15), end: null },
        showApply: false
      }
    })

    const popover = await openCalendar(getByTestId)
    await fireEvent.click(findDayButton(popover, 5))

    const payload = emitted()['update:modelValue'][0][0] as {
      start: Date | null
      end: Date | null
    }
    // Clicked earlier day becomes start; the prior start becomes end.
    expect(payload.start?.getDate()).toBe(5)
    expect(payload.end?.getDate()).toBe(15)
  })

  // ---- Month navigation -------------------------------------------------------

  it('emits month-change and updates the grid label when Next / Previous are clicked', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)

    await fireEvent.click(within(popover).getByRole('button', { name: 'Next month' }))
    await waitFor(() =>
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('November 2026')
    )

    await fireEvent.click(within(popover).getByRole('button', { name: 'Previous month' }))
    await fireEvent.click(within(popover).getByRole('button', { name: 'Previous month' }))
    await waitFor(() =>
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('September 2026')
    )

    const events = emitted()['month-change'] as Array<[{ year: number; month: number }]>
    expect(events).toHaveLength(3)
    expect(events[0][0]).toEqual({ year: 2026, month: 10 }) // November (0-indexed)
    expect(events[1][0]).toEqual({ year: 2026, month: 9 }) // October
    expect(events[2][0]).toEqual({ year: 2026, month: 8 }) // September
  })

  it('re-seeds the visible month from the committed value on reopen', async () => {
    const { getByTestId, rerender } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    let popover = await openCalendar(getByTestId)
    expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe(OCT_2026_LABEL)

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(getPopover()).toBeNull())

    await rerender({ mode: 'single', modelValue: new Date(2027, 0, 3) })

    popover = await openCalendar(getByTestId)
    expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('January 2027')
  })

  // ---- Keyboard: roving tabindex + selection ---------------------------------

  it('gives the selected day the roving tabindex=0 and every other day tabindex=-1', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)

    const days = Array.from(
      popover.querySelectorAll<HTMLButtonElement>('[data-testid="input-calendar__day"]')
    )
    const tabbable = days.filter((day) => day.getAttribute('tabindex') === '0')
    expect(tabbable).toHaveLength(1)
    expect(tabbable[0].textContent?.trim()).toBe('8')
  })

  it('ArrowRight moves the roving tabindex to the next day (real keyboard)', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)

    const start = findDayButton(popover, 8)
    start.focus()
    expect(document.activeElement).toBe(start)
    expect(start.getAttribute('tabindex')).toBe('0')

    await userEvent.keyboard('{ArrowRight}')

    // The roving tabindex now belongs to day 9; day 8 drops to -1.
    await waitFor(() => expect(findDayButton(popover, 9).getAttribute('tabindex')).toBe('0'))
    expect(start.getAttribute('tabindex')).toBe('-1')
  })

  it('ArrowDown moves the roving tabindex one week forward (real keyboard)', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)

    findDayButton(popover, 8).focus()
    await userEvent.keyboard('{ArrowDown}')

    // One week (7 days) forward from the 8th is the 15th.
    await waitFor(() => expect(findDayButton(popover, 15).getAttribute('tabindex')).toBe('0'))
  })

  it('Enter selects the focused day (real keyboard)', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8, showApply: false }
    })

    const popover = await openCalendar(getByTestId)

    findDayButton(popover, 12).focus()
    await userEvent.keyboard('{Enter}')

    const payload = emitted()['update:modelValue'][0][0] as Date
    expect(payload).toBeInstanceOf(Date)
    expect(payload.getDate()).toBe(12)
  })

  it('Space selects the focused day (real keyboard)', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8, showApply: false }
    })

    const popover = await openCalendar(getByTestId)

    findDayButton(popover, 20).focus()
    await userEvent.keyboard(' ')

    const payload = emitted()['update:modelValue'][0][0] as Date
    expect(payload.getDate()).toBe(20)
  })

  it('PageDown pages to the next month and emits month-change (real keyboard)', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    const popover = await openCalendar(getByTestId)

    findDayButton(popover, 8).focus()
    await userEvent.keyboard('{PageDown}')

    await waitFor(() =>
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('November 2026')
    )
    const events = emitted()['month-change'] as Array<[{ year: number; month: number }]>
    expect(events[events.length - 1][0]).toEqual({ year: 2026, month: 10 })
  })

  // ---- Bounds & disabled -------------------------------------------------------

  it('disables days out of the [min, max] bounds and does not commit when they are clicked', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: {
        mode: 'single',
        modelValue: OCT_8,
        showApply: false,
        min: new Date(2026, 9, 5),
        max: new Date(2026, 9, 20)
      }
    })

    const popover = await openCalendar(getByTestId)

    const belowMin = findDayButton(popover, 3)
    const inBounds = findDayButton(popover, 10)
    const aboveMax = findDayButton(popover, 25)

    expect(belowMin.disabled).toBe(true)
    expect(belowMin.getAttribute('data-disabled')).toBe('true')
    expect(inBounds.disabled).toBe(false)
    expect(aboveMax.disabled).toBe(true)

    await fireEvent.click(belowMin)
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('disabled: sets data-disabled on the root, disables the trigger, and never opens', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { modelValue: OCT_8, disabled: true }
    })

    expect(getByTestId('input-calendar').getAttribute('data-disabled')).toBe('true')

    const trigger = getByTestId('input-calendar__trigger') as HTMLButtonElement
    expect(trigger.disabled).toBe(true)

    await fireEvent.click(trigger)
    await nextTick()

    expect(getPopover()).toBeNull()
    expect(emitted()['update:open']).toBeUndefined()
  })

  // ---- Clearable ----------------------------------------------------------------

  it('clearable: the clear control empties the committed selection', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: {
        mode: 'range',
        modelValue: { start: new Date(2026, 9, 8), end: new Date(2026, 9, 12) },
        clearable: true
      }
    })

    const clear = getByTestId('input-calendar__clear-trigger')
    expect(clear.getAttribute('aria-label')).toBe('Clear selection')

    await fireEvent.click(clear)

    const events = emitted()['update:modelValue']
    expect(events).toHaveLength(1)
    expect(events[0][0]).toEqual({ start: null, end: null })
  })

  // ---- Presets (two-part trigger) -------------------------------------------------

  const PRESETS = [
    { label: 'Last 7 days', value: { start: new Date(2026, 9, 13), end: new Date(2026, 9, 19) } },
    { label: 'Last 30 days', value: { start: new Date(2026, 8, 20), end: new Date(2026, 9, 19) } }
  ]

  it('presets: the two-part trigger opens a menu and a preset commits immediately', async () => {
    const { getByTestId, emitted } = render(Calendar, {
      props: { mode: 'range', presets: PRESETS }
    })

    const presetsTrigger = getByTestId('input-calendar__presets-trigger')
    expect(presetsTrigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(presetsTrigger.textContent).toContain('Select Period')

    await fireEvent.click(presetsTrigger)
    const menu = await waitFor(() => {
      const el = getPresetsMenu()
      expect(el).toBeTruthy()
      return el as HTMLElement
    })
    expect(menu.getAttribute('role')).toBe('menu')

    const items = within(menu).getAllByRole('menuitem')
    expect(items).toHaveLength(2)

    // A preset applies its range in one click — no separate Apply step.
    await fireEvent.click(items[0])

    const events = emitted()['update:modelValue']
    expect(events).toHaveLength(1)
    const payload = events[0][0] as { start: Date | null; end: Date | null }
    expect(payload.start?.getDate()).toBe(13)
    expect(payload.end?.getDate()).toBe(19)
    expect(emitted()['apply']).toHaveLength(1)

    await waitFor(() => expect(getPresetsMenu()).toBeNull())

    // Reopening marks the applied preset as selected.
    await fireEvent.click(presetsTrigger)
    await waitFor(() => {
      const reopened = getPresetsMenu()
      expect(reopened).toBeTruthy()
      const selected = within(reopened as HTMLElement)
        .getAllByRole('menuitem')
        .filter((item) => item.getAttribute('data-selected') === 'true')
      expect(selected).toHaveLength(1)
      expect(selected[0].textContent).toContain('Last 7 days')
    })
  })

  it('presets menu and calendar popover are mutually exclusive', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'range', presets: PRESETS }
    })

    await fireEvent.click(getByTestId('input-calendar__presets-trigger'))
    await waitFor(() => expect(getPresetsMenu()).toBeTruthy())

    // Opening the calendar closes the presets menu.
    await openCalendar(getByTestId)
    expect(getPresetsMenu()).toBeNull()
  })

  // ---- Attrs fallthrough -----------------------------------------------------------

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(Calendar, {
      props: { modelValue: OCT_8 },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-calendar').classList.contains('consumer-class')).toBe(true)
  })

  it.each(['single', 'range'] as const)('opens and renders a grid in %s mode', async (mode) => {
    const model = mode === 'range' ? { start: OCT_8, end: null } : OCT_8
    const { getByTestId } = render(Calendar, {
      props: { mode, modelValue: model }
    })

    const popover = await openCalendar(getByTestId)
    expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe(OCT_2026_LABEL)
  })

  // ---- Axe --------------------------------------------------------------------------

  it('has no a11y violations with the popover closed', async () => {
    const { container } = render(Calendar, {
      props: { modelValue: OCT_8 }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the popover open (single mode)', async () => {
    const { getByTestId } = render(Calendar, {
      props: { mode: 'single', modelValue: OCT_8 }
    })

    await openCalendar(getByTestId)
    // The popover Teleports to body; run axe over the whole page so the
    // trigger/popover pair is validated together.
    await expectNoA11yViolations(document.body)
  })

  it('has no a11y violations with a full range selected and the popover open', async () => {
    const { getByTestId } = render(Calendar, {
      props: {
        mode: 'range',
        modelValue: { start: new Date(2026, 9, 8), end: new Date(2026, 9, 12) }
      }
    })

    await openCalendar(getByTestId)
    await expectNoA11yViolations(document.body)
  })

  // ---- Story fixtures ------------------------------------------------------------------

  it('renders the Default story fixture cleanly', async () => {
    const { getByTestId } = render(Default())

    expect(getByTestId('input-calendar__trigger').textContent).toContain('Select a Date Range')

    await openCalendar(getByTestId)
    await expectNoA11yViolations(document.body)
  })

  it('renders the Single story fixture cleanly', async () => {
    const { getByTestId } = render(Single())

    await openCalendar(getByTestId)
    await expectNoA11yViolations(document.body)
  })
})
