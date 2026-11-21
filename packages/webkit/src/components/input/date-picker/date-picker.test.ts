import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/date-picker/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import Field from '../field/field.vue'
import FieldDescription from '../field/field-description/field-description.vue'
import FieldLabel from '../field/field-label/field-label.vue'
import DatePicker, { type DatePickerValue } from './index'

// A fixed anchor keeps every assertion deterministic — the visible month is
// seeded from the committed value when the popover opens, so October 2026 is
// always rendered.
const OCT_8 = new Date(2026, 9, 8)
const OCT_2026_LABEL = 'October 2026'

/** Query the Teleported popover from document.body (it escapes the container). */
const getPopover = (testId = 'date-picker'): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`[data-testid="${testId}__popover"]`)

/** Click the trigger, wait for the popover, and let the focus trap settle. */
const openDatePicker = async (
  getByTestId: (id: string) => HTMLElement,
  testId = 'date-picker'
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
// Day buttons keep the literal `date-picker__day` testid (DatePickerGrid does
// not derive it from the root testid), so the lookup is scoped to the popover.
const findDayButton = (popover: HTMLElement, label: number): HTMLButtonElement => {
  const days = Array.from(
    popover.querySelectorAll<HTMLButtonElement>('[data-testid="date-picker__day"]')
  )
  const match = days.find(
    (day) => day.textContent?.trim() === String(label) && day.getAttribute('data-outside') === null
  )

  if (!match) {
    throw new Error(`No in-month day button labelled ${label} found`)
  }

  return match
}

describe('DatePicker', () => {
  describe('basics', () => {
    beforeEach(() => {
      // Teleported panels would leak across tests if a wrapper unmounted
      // mid-transition; scrub any stray panel so document.body queries stay
      // deterministic.
      document.body.querySelectorAll('[data-testid$="__popover"]').forEach((el) => el.remove())
    })

    // ---- Trigger & popover open/close ----------------------------------------

    it('renders closed by default: trigger with placeholder, no popover, no grid', () => {
      const { getByTestId } = render(DatePicker)

      const root = getByTestId('date-picker')
      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('data-state')).toBe('closed')

      const trigger = getByTestId('date-picker__trigger')
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.textContent).toContain('Select a date')

      expect(getPopover()).toBeNull()
      expect(document.body.querySelector('[data-testid="date-picker__grid"]')).toBeNull()
    })

    it('opens the Teleported popover on trigger click and emits update:open', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      expect(popover.getAttribute('role')).toBe('dialog')
      expect(popover.getAttribute('aria-label')).toBe('Choose date')
      expect(within(popover).getByRole('grid')).toBeTruthy()

      expect(getByTestId('date-picker').getAttribute('data-state')).toBe('open')
      expect(getByTestId('date-picker__trigger').getAttribute('aria-expanded')).toBe('true')
      expect(emitted()['update:open']).toEqual([[true]])
    })

    it('honors a consumer-supplied data-testid on the root and derives the sub-part testids', async () => {
      const { getByTestId } = render(DatePicker, {
        attrs: { 'data-testid': 'my-date-picker' }
      })

      expect(getByTestId('my-date-picker').tagName).toBe('DIV')
      expect(getByTestId('my-date-picker__trigger').getAttribute('aria-haspopup')).toBe('dialog')

      const popover = await openDatePicker(getByTestId, 'my-date-picker')
      expect(popover.getAttribute('role')).toBe('dialog')
      expect(popover.querySelector('[data-testid="my-date-picker__apply"]')).toBeTruthy()
    })

    it('Escape closes the popover, emits update:open=false and returns focus to the trigger', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      await openDatePicker(getByTestId)
      await userEvent.keyboard('{Escape}')

      await waitFor(() => expect(getPopover()).toBeNull())
      const openEvents = emitted()['update:open']
      expect(openEvents[openEvents.length - 1]).toEqual([false])
      expect(document.activeElement).toBe(getByTestId('date-picker__trigger'))
    })

    it('closes the popover on an outside mousedown', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      await openDatePicker(getByTestId)
      await fireEvent.mouseDown(document.body)

      await waitFor(() => expect(getPopover()).toBeNull())
      expect(getByTestId('date-picker').getAttribute('data-state')).toBe('closed')
    })

    it('listens for outside mousedowns on the document only while open', async () => {
      const add = vi.spyOn(document, 'addEventListener')
      const outside = () =>
        add.mock.calls.filter(
          ([type, listener]) =>
            type === 'mousedown' && (listener as { name?: string }).name === 'onDocumentMousedown'
        ).length
      try {
        const { getByTestId } = render(DatePicker, { props: { modelValue: OCT_8 } })
        await nextTick()
        expect(outside()).toBe(0)
        await openDatePicker(getByTestId)
        expect(outside()).toBe(1)
      } finally {
        vi.restoreAllMocks()
      }
    })

    // ---- Grid structure & a11y roles ------------------------------------------

    it('exposes grid a11y roles: rows, columnheaders (weekday labels) and gridcells', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)
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
      expect(popover.querySelectorAll('[data-testid="date-picker__day"]')).toHaveLength(42)
    })

    it('marks the selected single day: aria-selected, data-selected and band=single', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      const selected = findDayButton(popover, 8)
      expect(selected.getAttribute('data-selected')).toBe('true')
      expect(selected.getAttribute('data-band')).toBe('single')

      // The wrapping gridcell carries aria-selected.
      const cell = selected.closest('[role="gridcell"]')
      expect(cell?.getAttribute('aria-selected')).toBe('true')
    })

    // ---- Selection: draft + Apply / immediate commit ---------------------------

    it('stages day clicks in a draft and only commits on Apply (default show-apply)', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      await fireEvent.click(findDayButton(popover, 12))

      expect(findDayButton(popover, 12).getAttribute('data-band')).toBe('single')
      expect(emitted()['update:modelValue']).toBeUndefined()

      await fireEvent.click(within(popover).getByTestId('date-picker__apply'))

      const events = emitted<unknown[]>()['update:modelValue']
      expect(events).toHaveLength(1)
      expect((events[0][0] as Date).getDate()).toBe(12)

      const applied = emitted()['apply']
      expect(applied).toHaveLength(1)
      const [applyEvent, applyValue] = applied[0] as [Event, Date]
      expect(applyEvent).toBeInstanceOf(MouseEvent)
      expect(applyValue.getDate()).toBe(12)

      // Apply also closes the popover.
      await waitFor(() => expect(getPopover()).toBeNull())
      expect(getByTestId('date-picker').getAttribute('data-state')).toBe('closed')
    })

    it('Apply from the keyboard emits apply with the event first and the committed date', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      await fireEvent.click(findDayButton(popover, 12))

      within(popover).getByTestId('date-picker__apply').focus()
      await userEvent.keyboard('{Enter}')

      const applied = emitted()['apply']
      expect(applied).toHaveLength(1)
      const [event, value] = applied[0] as [Event, Date]
      expect(event).toBeInstanceOf(Event)
      expect(value.getDate()).toBe(12)
    })

    it('has no range mode: a mode="range" attribute still picks one date', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: null, showApply: false },
        attrs: { mode: 'range', period: true }
      })

      const popover = await openDatePicker(getByTestId)
      expect(within(popover).queryByLabelText('End')).toBeNull()
      await fireEvent.click(findDayButton(popover, 12))

      const value = emitted<unknown[]>()['update:modelValue'][0][0]
      expect(value).toBeInstanceOf(Date)
      expect(getByTestId('date-picker').querySelector('[aria-haspopup="menu"]')).toBeNull()
    })

    it('show-apply=false commits the clicked Date immediately in single mode', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8, showApply: false }
      })

      const popover = await openDatePicker(getByTestId)
      await fireEvent.click(findDayButton(popover, 15))

      const events = emitted<unknown[]>()['update:modelValue']
      expect(events).toHaveLength(1)

      const payload = events[0][0] as Date
      expect(payload).toBeInstanceOf(Date)
      expect(payload.getFullYear()).toBe(2026)
      expect(payload.getMonth()).toBe(9)
      expect(payload.getDate()).toBe(15)

      // A complete immediate selection closes the popover.
      await waitFor(() => expect(getPopover()).toBeNull())
    })

    // ---- Month navigation -------------------------------------------------------

    // The month label and the prev/next controls sit OUTSIDE the <Transition>, so a
    // month change swaps only the day strip. Inside it, Vue would tear the pressed
    // button down mid-click and focus would fall back to the body — a keyboard user
    // would have to re-find the control to page a second month.
    it('keeps the month controls mounted and focused across a month change', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)
      const next = within(popover).getByRole('button', { name: 'Next month' })

      next.focus()
      expect(document.activeElement).toBe(next)

      await fireEvent.click(next)
      await waitFor(() =>
        expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('November 2026')
      )

      // Same node, not a re-created one — and it still holds focus.
      expect(within(popover).getByRole('button', { name: 'Next month' })).toBe(next)
      expect(document.activeElement).toBe(next)
    })

    it('emits month-change and updates the grid label when Next / Previous are clicked', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

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

    it('jumps to the month and year picked in the caption selects, keeping the arrows', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })
      const thisYear = new Date().getFullYear()
      const popover = await openDatePicker(getByTestId)
      expect(popover.querySelector('select')).toBeNull()
      const month = within(popover).getByRole('combobox', { name: 'Month' })
      const year = within(popover).getByRole('combobox', { name: 'Year' })
      expect(month.textContent?.trim()).toBe('October')
      expect(year.textContent?.trim()).toBe('2026')

      await userEvent.click(month)
      const months = await waitFor(() => {
        const list = document.body.querySelector<HTMLElement>(
          '[data-testid="date-picker__month-list"]'
        )
        expect(list).toBeTruthy()
        return list as HTMLElement
      })
      expect(within(months).getAllByRole('option')).toHaveLength(12)
      await userEvent.click(within(months).getByRole('option', { name: 'February' }))
      await waitFor(() =>
        expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('February 2026')
      )
      expect(getPopover()).toBeTruthy()

      await userEvent.click(year)
      const years = await waitFor(() => {
        const list = document.body.querySelector<HTMLElement>(
          '[data-testid="date-picker__year-list"]'
        )
        expect(list).toBeTruthy()
        return list as HTMLElement
      })
      const yearLabels = within(years)
        .getAllByRole('option')
        .map((option) => option.textContent?.trim())
      expect(yearLabels[0]).toBe(String(Math.min(thisYear - 10, 2026)))
      expect(yearLabels.at(-1)).toBe(String(Math.max(thisYear + 10, 2026)))
      await userEvent.keyboard('{Escape}')
      await waitFor(() =>
        expect(document.body.querySelector('[data-testid="date-picker__year-list"]')).toBeNull()
      )
      expect(getPopover()).toBeTruthy()
      await userEvent.click(year)
      const reopened = await waitFor(() => {
        const list = document.body.querySelector<HTMLElement>(
          '[data-testid="date-picker__year-list"]'
        )
        expect(list).toBeTruthy()
        return list as HTMLElement
      })
      await userEvent.click(within(reopened).getByRole('option', { name: '2030' }))
      await waitFor(() =>
        expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('February 2030')
      )

      await fireEvent.click(within(popover).getByRole('button', { name: 'Next month' }))
      await waitFor(() => expect(month.textContent?.trim()).toBe('March'))
      const events = emitted()['month-change'] as Array<[{ year: number; month: number }]>
      expect(events.at(-1)?.[0]).toEqual({ year: 2030, month: 2 })
    })

    it('bounds the year list by min and max and keeps the month inside them', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8, min: new Date(2025, 5, 10), max: new Date(2027, 2, 5) }
      })
      const popover = await openDatePicker(getByTestId)
      await userEvent.click(within(popover).getByRole('combobox', { name: 'Year' }))
      const years = await waitFor(() => {
        const list = document.body.querySelector<HTMLElement>(
          '[data-testid="date-picker__year-list"]'
        )
        expect(list).toBeTruthy()
        return list as HTMLElement
      })
      expect(
        within(years)
          .getAllByRole('option')
          .map((option) => option.textContent?.trim())
      ).toEqual(['2025', '2026', '2027'])
      await userEvent.click(within(years).getByRole('option', { name: '2027' }))
      await waitFor(() =>
        expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('March 2027')
      )
      await userEvent.click(within(popover).getByRole('combobox', { name: 'Month' }))
      const months = await waitFor(() => {
        const list = document.body.querySelector<HTMLElement>(
          '[data-testid="date-picker__month-list"]'
        )
        expect(list).toBeTruthy()
        return list as HTMLElement
      })
      expect(
        within(months).getByRole('option', { name: 'April' }).getAttribute('aria-disabled')
      ).toBe('true')
      expect(
        within(months).getByRole('option', { name: 'March' }).getAttribute('aria-disabled')
      ).not.toBe('true')
    })

    it('re-seeds the visible month from the committed value on reopen', async () => {
      const { getByTestId, rerender } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      let popover = await openDatePicker(getByTestId)
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe(OCT_2026_LABEL)

      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(getPopover()).toBeNull())

      await rerender({ modelValue: new Date(2027, 0, 3) })

      popover = await openDatePicker(getByTestId)
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('January 2027')
    })

    // ---- Keyboard: roving tabindex + selection ---------------------------------

    it('gives the selected day the roving tabindex=0 and every other day tabindex=-1', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      const days = Array.from(
        popover.querySelectorAll<HTMLButtonElement>('[data-testid="date-picker__day"]')
      )
      const tabbable = days.filter((day) => day.getAttribute('tabindex') === '0')
      expect(tabbable).toHaveLength(1)
      expect(tabbable[0].textContent?.trim()).toBe('8')
    })

    it('ArrowRight moves the roving tabindex to the next day (real keyboard)', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

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
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      findDayButton(popover, 8).focus()
      await userEvent.keyboard('{ArrowDown}')

      // One week (7 days) forward from the 8th is the 15th.
      await waitFor(() => expect(findDayButton(popover, 15).getAttribute('tabindex')).toBe('0'))
    })

    it('Enter selects the focused day (real keyboard)', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8, showApply: false }
      })

      const popover = await openDatePicker(getByTestId)

      findDayButton(popover, 12).focus()
      await userEvent.keyboard('{Enter}')

      const payload = emitted<unknown[]>()['update:modelValue'][0][0] as Date
      expect(payload).toBeInstanceOf(Date)
      expect(payload.getDate()).toBe(12)
    })

    it('Space selects the focused day (real keyboard)', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8, showApply: false }
      })

      const popover = await openDatePicker(getByTestId)

      findDayButton(popover, 20).focus()
      await userEvent.keyboard(' ')

      const payload = emitted<unknown[]>()['update:modelValue'][0][0] as Date
      expect(payload.getDate()).toBe(20)
    })

    it('PageDown pages to the next month and emits month-change (real keyboard)', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      findDayButton(popover, 8).focus()
      await userEvent.keyboard('{PageDown}')

      await waitFor(() =>
        expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('November 2026')
      )
      const events = emitted()['month-change'] as Array<[{ year: number; month: number }]>
      expect(events[events.length - 1][0]).toEqual({ year: 2026, month: 10 })
    })

    it('Home and End move to the first and last day of the week (real keyboard)', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)

      findDayButton(popover, 8).focus()
      await userEvent.keyboard('{Home}')
      await waitFor(() => expect(findDayButton(popover, 4).getAttribute('tabindex')).toBe('0'))
      await userEvent.keyboard('{End}')
      await waitFor(() => expect(findDayButton(popover, 10).getAttribute('tabindex')).toBe('0'))
    })

    it('Shift+PageDown and Shift+PageUp page by a year (real keyboard)', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)
      const label = () => within(popover).getByRole('grid').getAttribute('aria-label')

      findDayButton(popover, 8).focus()
      await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')
      await waitFor(() => expect(label()).toBe('October 2027'))
      await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')
      await waitFor(() => expect(label()).toBe('October 2026'))
    })

    // ---- Bounds & disabled -------------------------------------------------------

    it('disables days out of the [min, max] bounds and does not commit when they are clicked', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: {
          modelValue: OCT_8,
          showApply: false,
          min: new Date(2026, 9, 5),
          max: new Date(2026, 9, 20)
        }
      })

      const popover = await openDatePicker(getByTestId)

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
      const { getByTestId, emitted } = render(DatePicker, {
        props: { modelValue: OCT_8, disabled: true }
      })

      expect(getByTestId('date-picker').getAttribute('data-disabled')).toBe('true')

      const trigger = getByTestId('date-picker__trigger') as HTMLButtonElement
      expect(trigger.disabled).toBe(true)

      await fireEvent.click(trigger)
      await nextTick()

      expect(getPopover()).toBeNull()
      expect(emitted()['update:open']).toBeUndefined()
    })

    // ---- Clearable ----------------------------------------------------------------

    it('clearable: the clear control empties the committed selection', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: {
          modelValue: OCT_8,
          clearable: true
        }
      })

      const clear = getByTestId('date-picker__clear-trigger')
      expect(clear.getAttribute('aria-label')).toBe('Clear selection')

      await fireEvent.click(clear)

      const events = emitted<unknown[]>()['update:modelValue']
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeNull()
    })

    // ---- show-fields ----------------------------------------------------------------

    it('show-fields=false hides the date field but keeps the grid and Apply', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8, showFields: false }
      })

      await fireEvent.click(getByTestId('date-picker__trigger'))
      await waitFor(() => expect(getPopover()).not.toBeNull())

      const popover = getPopover() as HTMLElement
      expect(popover.querySelector('[data-testid="date-picker__fields"]')).toBeNull()
      expect(popover.querySelector('[data-testid="date-picker__grid"]')).not.toBeNull()
      expect(popover.querySelector('[data-testid="date-picker__apply"]')).not.toBeNull()
    })

    it('show-fields defaults to true: the date field render in the panel', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      await fireEvent.click(getByTestId('date-picker__trigger'))
      await waitFor(() => expect(getPopover()).not.toBeNull())

      expect(
        (getPopover() as HTMLElement).querySelector('[data-testid="date-picker__fields"]')
      ).not.toBeNull()
    })

    it('merges a consumer-supplied class onto the root', () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 },
        attrs: { class: 'consumer-class' }
      })

      expect(getByTestId('date-picker').classList.contains('consumer-class')).toBe(true)
    })

    it('opens and renders a grid on the committed month', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      const popover = await openDatePicker(getByTestId)
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe(OCT_2026_LABEL)
    })

    // ---- Field labels ------------------------------------------------------------------

    // The Start/End labels used to be bare <span>s, leaving each field named only by its
    // placeholder — which vanishes on the first keystroke. axe cannot see this (placeholder
    // is a valid accname fallback), so it is asserted directly.
    it('single mode labels the field Date and its time field Time', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8, showTime: true }
      })

      const popover = await openDatePicker(getByTestId)

      expect(within(popover).getByLabelText('Date').tagName).toBe('INPUT')
      expect(within(popover).getByLabelText('Time').tagName).toBe('INPUT')
    })

    // ---- Axe --------------------------------------------------------------------------

    it('has no a11y violations with the popover open and the time fields shown', async () => {
      const { getByTestId } = render(DatePicker, {
        props: {
          modelValue: OCT_8,
          showTime: true
        }
      })

      await openDatePicker(getByTestId)
      await expectNoA11yViolations(document.body)
    })

    it('has no a11y violations with the popover closed', async () => {
      const { container } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations with the popover open', async () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: OCT_8 }
      })

      await openDatePicker(getByTestId)
      // The popover Teleports to body; run axe over the whole page so the
      // trigger/popover pair is validated together.
      await expectNoA11yViolations(document.body)
    })

    // ---- Story fixtures ------------------------------------------------------------------

    it('renders the Default story fixture cleanly', async () => {
      const { getByTestId } = render(Default)

      expect(getByTestId('date-picker__trigger').textContent).toContain('Select a date')

      await openDatePicker(getByTestId)
      await expectNoA11yViolations(document.body)
    })

    it('mounts the popover without an interaction when open is pinned by the consumer', async () => {
      render(DatePicker, {
        props: {
          modelValue: OCT_8,
          open: true,
          showTime: true,
          clearable: true
        }
      })

      const popover = await waitFor(() => {
        const el = getPopover()
        expect(el).toBeTruthy()
        return el as HTMLElement
      })

      expect(within(popover).getByLabelText('Date').tagName).toBe('INPUT')
      expect(within(popover).getByLabelText('Time').tagName).toBe('INPUT')
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe(OCT_2026_LABEL)

      await expectNoA11yViolations(document.body)
    })
  })

  describe('on devices', () => {
    it('never grows past its container', () => {
      const view = render(DatePicker)

      expect(view.getByTestId('date-picker').className).toContain('max-w-full')
    })
  })

  describe('in another locale', () => {
    const inLocale = (locale: string, props: Record<string, unknown>) => {
      const model = ref<DatePickerValue>((props['modelValue'] as DatePickerValue) ?? null)
      const component = defineComponent({
        setup: () => () =>
          h(
            ConfigProvider,
            { locale, catalogs: LOCALES },
            {
              default: () =>
                h(DatePicker, {
                  ...props,
                  modelValue: model.value,
                  'onUpdate:modelValue': (value: DatePickerValue) => (model.value = value)
                })
            }
          )
      })
      return Object.assign(component, { model })
    }

    it('pt-BR: date fields print, hint and parse day-first dates', async () => {
      const { getByTestId } = render(inLocale('pt-BR', { modelValue: OCT_8 }))
      const popover = await openDatePicker(getByTestId)

      const date = within(popover).getByLabelText('Data') as HTMLInputElement
      expect(date.value).toBe('8 de out. de 2026')

      await fireEvent.update(date, '12/10/2026')
      await fireEvent.change(date)
      await waitFor(() => expect(date.value).toBe('12 de out. de 2026'))
    })

    it('en: date fields keep month-first parsing', async () => {
      const { getByTestId } = render(inLocale('en', { modelValue: OCT_8 }))
      const popover = await openDatePicker(getByTestId)

      const date = within(popover).getByLabelText('Date') as HTMLInputElement
      await fireEvent.update(date, '10/12/2026')
      await fireEvent.change(date)
      await waitFor(() => expect(date.value).toBe('Oct 12, 2026'))
    })
  })

  describe('defineModel', () => {
    it('opens from defaultOpen while v-model:open is unbound', async () => {
      const view = render(DatePicker, { props: { defaultOpen: true } })
      await waitFor(() => expect(getPopover()).toBeTruthy())
      expect(view.getByTestId('date-picker').getAttribute('data-state')).toBe('open')
    })

    it('marks the trigger invalid from its own prop', async () => {
      const view = render(DatePicker, { props: { invalid: true } })
      expect(view.getByTestId('date-picker__trigger').getAttribute('aria-invalid')).toBe('true')
      expect(view.getByTestId('date-picker').hasAttribute('data-invalid')).toBe(true)
      await view.rerender({ invalid: false })
      expect(view.getByTestId('date-picker__trigger').hasAttribute('aria-invalid')).toBe(false)
    })

    beforeEach(() => {
      document.body.querySelectorAll('[data-testid$="__popover"]').forEach((el) => el.remove())
    })

    it('keeps the committed value and open state when nothing is bound', async () => {
      const { getByTestId, emitted } = render(DatePicker, {
        props: { showApply: false }
      })
      const trigger = getByTestId('date-picker__trigger')
      const placeholder = trigger.textContent

      const popover = await openDatePicker(getByTestId)
      expect(getByTestId('date-picker').getAttribute('data-state')).toBe('open')
      await fireEvent.click(findDayButton(popover, 15))

      await waitFor(() => expect(getPopover()).toBeNull())
      expect(getByTestId('date-picker').getAttribute('data-state')).toBe('closed')
      expect(trigger.textContent).not.toBe(placeholder)
      expect((emitted<unknown[]>()['update:modelValue'][0][0] as Date).getDate()).toBe(15)
      expect(emitted()['update:open']).toEqual([[true], [false]])
    })

    it('round-trips v-model and v-model:open with the parent', async () => {
      const value = ref<Date | null>(OCT_8)
      const open = ref(false)
      const Parent = defineComponent({
        setup: () => () =>
          h(DatePicker, {
            modelValue: value.value,
            'onUpdate:modelValue': (v: unknown) => (value.value = v as Date | null),
            open: open.value,
            'onUpdate:open': (v: boolean) => (open.value = v)
          })
      })
      const { getByTestId } = render(Parent)

      open.value = true
      const popover = await waitFor(() => {
        const el = getPopover()
        expect(el).toBeTruthy()
        return el as HTMLElement
      })
      await nextTick()

      await fireEvent.click(findDayButton(popover, 20))
      await fireEvent.click(within(popover).getByTestId('date-picker__apply'))

      await waitFor(() => expect(getPopover()).toBeNull())
      expect(open.value).toBe(false)
      expect(value.value?.getDate()).toBe(20)

      const before = getByTestId('date-picker__trigger').textContent
      value.value = new Date(2026, 9, 3)
      await nextTick()
      expect(getByTestId('date-picker__trigger').textContent).not.toBe(before)
    })
  })

  describe('in a Field', () => {
    it('takes the Field label, description, invalid and disabled state on its trigger', async () => {
      const { getByRole, getByTestId } = render({
        components: { Field, FieldLabel, FieldDescription, DatePicker },
        template:
          '<Field invalid disabled><FieldLabel>Billing period</FieldLabel><DatePicker /><FieldDescription>UTC dates.</FieldDescription></Field>'
      })
      const trigger = getByTestId('date-picker__trigger') as HTMLButtonElement
      expect(getByRole('button', { name: 'Billing period' })).toBe(trigger)
      expect(trigger.getAttribute('aria-invalid')).toBe('true')
      expect(trigger.disabled).toBe(true)
      await waitFor(() =>
        expect(
          document.getElementById(trigger.getAttribute('aria-describedby') ?? '')?.textContent
        ).toContain('UTC dates.')
      )
    })

    it('names the trigger with ariaLabel and the current value', () => {
      const { getByTestId } = render(DatePicker, {
        props: { modelValue: null, ariaLabel: 'Start date' }
      })
      expect(getByTestId('date-picker__trigger').getAttribute('aria-label')).toMatch(
        /^Start date: /
      )
    })

    it('lays the fields beside the grid with orientation="horizontal"', async () => {
      const { getByTestId } = render(DatePicker, { props: { orientation: 'horizontal' } })
      const popover = await openDatePicker(getByTestId)
      expect(popover.querySelector('[data-horizontal]')).toBeTruthy()
    })
  })

  describe('exposed', () => {
    it('focus() moves focus to the trigger', async () => {
      const picker = ref<InstanceType<typeof DatePicker> | null>(null)
      const { getByTestId } = render(
        defineComponent({ setup: () => () => h(DatePicker, { ref: picker }) })
      )
      picker.value?.focus()
      expect(document.activeElement).toBe(getByTestId('date-picker__trigger'))
    })
  })

  describe('reference time', () => {
    it('opens on the ConfigProvider now and marks that day as today', async () => {
      const { getByTestId } = render(
        defineComponent({
          setup: () => () =>
            h(ConfigProvider, { now: '2030-03-15T12:00:00' }, { default: () => h(DatePicker, {}) })
        })
      )
      const popover = await openDatePicker(getByTestId)
      expect(popover.querySelector('[aria-current="date"]')?.textContent?.trim()).toBe('15')
      expect(popover.textContent).toContain('2030')
    })
  })
})
