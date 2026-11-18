import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/date-range-picker/default.vue'
import Disabled from '../../../../examples/date-range-picker/disabled.vue'
import RelativeOnly from '../../../../examples/date-range-picker/relative-only.vue'
import TimeZone from '../../../../examples/date-range-picker/time-zone.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import Field from '../field/field.vue'
import FieldDescription from '../field/field-description/field-description.vue'
import FieldLabel from '../field/field-label/field-label.vue'
import { fromWallClock, resolveDateRange, stepDateRange, toWallClock } from './date-range'
import DateRangePicker, { type DateRangeValue } from './date-range-picker.vue'

const TEST_ID = 'date-range-picker'
const NOW = new Date('2026-11-10T16:00:00.000Z')
const HOUR = 3_600_000

const panel = (): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`[data-testid="${TEST_ID}__popover"]`)

const open = async (getByTestId: (id: string) => HTMLElement): Promise<HTMLElement> => {
  await fireEvent.click(getByTestId(`${TEST_ID}__trigger`))
  const el = await waitFor(() => {
    const found = panel()
    expect(found).toBeTruthy()
    return found as HTMLElement
  })
  await nextTick()
  return el
}

const openRelative = async (getByTestId: (id: string) => HTMLElement): Promise<HTMLElement> => {
  const popover = await open(getByTestId)
  await fireEvent.click(within(popover).getByRole('radio', { name: 'Relative' }))
  await waitFor(() => expect(within(popover).getByTestId(`${TEST_ID}__relative`)).toBeTruthy())
  return popover
}

const reopen = async (getByTestId: (id: string) => HTMLElement): Promise<HTMLElement> => {
  await waitFor(() => expect(panel()).toBeNull())
  return open(getByTestId)
}

const lastValue = (emitted: Record<string, unknown[][]>): DateRangeValue | undefined =>
  emitted['update:modelValue']?.at(-1)?.[0] as DateRangeValue | undefined

const setField = async (input: HTMLElement, text: string): Promise<void> => {
  await fireEvent.update(input, text)
  await fireEvent.keyDown(input, { key: 'Enter' })
  await fireEvent.change(input)
}

const listbox = (testId: string): Promise<HTMLElement> =>
  waitFor(() => {
    const found = document.body.querySelector<HTMLElement>(`[data-testid="${testId}"]`)
    expect(found).toBeTruthy()
    return found as HTMLElement
  })

const choose = async (trigger: HTMLElement, listTestId: string, name: string): Promise<void> => {
  await userEvent.click(trigger)
  const list = await listbox(listTestId)
  await userEvent.click(within(list).getByRole('option', { name }))
  await waitFor(() =>
    expect(document.body.querySelector(`[data-testid="${listTestId}"]`)).toBeNull()
  )
}

const shown = (trigger: HTMLElement): string => trigger.textContent?.trim() ?? ''

afterEach(() => {
  document.body.innerHTML = ''
})

describe('DateRangePicker', () => {
  describe('date-range helpers', () => {
    it('converts wall-clock time in a zone to instants and back', () => {
      const wall = new Date(2026, 10, 10, 9, 30)
      expect(fromWallClock(wall, 'America/Sao_Paulo').toISOString()).toBe(
        '2026-11-10T12:30:00.000Z'
      )
      expect(fromWallClock(wall, 'Asia/Tokyo').toISOString()).toBe('2026-11-10T00:30:00.000Z')
      expect(fromWallClock(new Date(2026, 6, 1, 10, 0), 'America/New_York').toISOString()).toBe(
        '2026-07-01T14:00:00.000Z'
      )
      const back = toWallClock(new Date('2026-11-10T00:30:00.000Z'), 'Asia/Tokyo')
      expect([back.getDate(), back.getHours(), back.getMinutes()]).toEqual([10, 9, 30])
    })

    it('resolves relative ranges against now and steps by the range length', () => {
      const range = resolveDateRange({ type: 'relative', amount: 15, unit: 'minute' }, NOW)
      expect(range?.end.toISOString()).toBe(NOW.toISOString())
      expect(range?.start.toISOString()).toBe('2026-11-10T15:45:00.000Z')
      const month = resolveDateRange({ type: 'relative', amount: 1, unit: 'month' }, NOW)
      expect(month?.start.toISOString()).toBe('2026-10-10T16:00:00.000Z')
      expect(stepDateRange({ type: 'relative', amount: 1, unit: 'hour' }, -1, NOW)).toEqual({
        type: 'absolute',
        start: new Date(NOW.getTime() - 2 * HOUR).toISOString(),
        end: new Date(NOW.getTime() - HOUR).toISOString()
      })
    })
  })

  it('opens from defaultOpen and reports and follows v-model:open', async () => {
    const seeded = render(DateRangePicker, { props: { now: NOW, defaultOpen: true } })
    await waitFor(() => expect(panel()).toBeTruthy())
    expect(seeded.getByTestId(TEST_ID).getAttribute('data-state')).toBe('open')
    seeded.unmount()

    const view = render(DateRangePicker, {
      props: { now: NOW, open: false, 'onUpdate:open': () => {} }
    })
    await fireEvent.click(view.getByTestId(`${TEST_ID}__trigger`))
    expect(view.emitted()['update:open']).toEqual([[true]])
    expect(view.getByTestId(TEST_ID).getAttribute('data-state')).toBe('closed')
    await view.rerender({ open: true })
    expect(view.getByTestId(TEST_ID).getAttribute('data-state')).toBe('open')
  })

  it('marks the trigger invalid from its own prop', async () => {
    const view = render(DateRangePicker, { props: { now: NOW, invalid: true } })
    expect(view.getByTestId(`${TEST_ID}__trigger`).getAttribute('aria-invalid')).toBe('true')
    expect(view.getByTestId(TEST_ID).hasAttribute('data-invalid')).toBe(true)
    await view.rerender({ invalid: false })
    expect(view.getByTestId(`${TEST_ID}__trigger`).hasAttribute('aria-invalid')).toBe(false)
  })

  it('shows the placeholder and opens on the Relative tab with no value, the first quick range picked', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const trigger = view.getByTestId(`${TEST_ID}__trigger`)
    expect(trigger.textContent).toContain('Select a time range')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    const popover = await open(view.getByTestId)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(within(popover).getByTestId(`${TEST_ID}__relative`)).toBeTruthy()
    expect(
      (within(popover).getByRole('radio', { name: 'Today' }) as HTMLInputElement).checked
    ).toBe(true)
  })

  it('shows the calendar first on the Absolute tab', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await open(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Absolute' }))
    const absolute = within(popover).getByTestId(`${TEST_ID}__absolute`)
    const grid = within(absolute).getByRole('grid')
    const start = within(absolute).getByLabelText('Start')
    expect(grid.compareDocumentPosition(start) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(absolute.firstElementChild?.contains(grid)).toBe(true)
  })

  it('labels the tabs Relative then Absolute, without the word range', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await open(view.getByTestId)
    const tabs = within(within(popover).getByTestId(`${TEST_ID}__mode`)).getAllByRole('radio')
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['Relative', 'Absolute'])
    expect((tabs[0] as HTMLInputElement).getAttribute('aria-checked')).toBe('true')
  })

  it.each([
    [
      'an absolute value',
      { type: 'absolute', start: '2026-11-10T13:00:00.000Z', end: '2026-11-10T14:00:00.000Z' },
      'absolute'
    ],
    ['a range that ends now', { type: 'since', start: '2026-11-10T13:00:00.000Z' }, 'absolute'],
    ['a relative value', { type: 'relative', amount: 15, unit: 'minute' }, 'relative'],
    ['no value', null, 'relative']
  ] as const)('opens on the matching tab for %s', async (_name, modelValue, tab) => {
    const view = render(DateRangePicker, { props: { now: NOW, modelValue } })
    const popover = await open(view.getByTestId)
    expect(within(popover).getByTestId(`${TEST_ID}__${tab}`)).toBeTruthy()
  })

  it('picks a quick range and commits it only on Apply', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Last hour' }))
    expect(view.emitted()['update:modelValue']).toBeUndefined()
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'relative',
      amount: 1,
      unit: 'hour',
      key: 'last-1-hour'
    })
    await waitFor(() => expect(panel()).toBeNull())
    await view.rerender({ modelValue: lastValue(view.emitted()) })
    expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('Last hour')
  })

  it('Cancel and Escape drop the draft and return focus to the trigger', async () => {
    const view = render(DateRangePicker, {
      props: { now: NOW, modelValue: { type: 'relative', amount: 15, unit: 'minute' } }
    })
    let popover = await open(view.getByTestId)
    expect(
      (within(popover).getByRole('radio', { name: 'Last 15 minutes' }) as HTMLInputElement).checked
    ).toBe(true)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Last 7 days' }))
    await fireEvent.click(within(popover).getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(panel()).toBeNull())
    expect(view.emitted()['update:modelValue']).toBeUndefined()
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByTestId(`${TEST_ID}__trigger`))
    )

    popover = await open(view.getByTestId)
    expect(
      (within(popover).getByRole('radio', { name: 'Last 15 minutes' }) as HTMLInputElement).checked
    ).toBe(true)
    await fireEvent.keyDown(popover, { key: 'Escape' })
    await waitFor(() => expect(panel()).toBeNull())
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByTestId(`${TEST_ID}__trigger`))
    )
  })

  it('validates and applies a custom duration', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    expect(within(popover).getByRole('group', { name: 'Custom range' })).toBeTruthy()
    const amount = within(popover).getByLabelText('Duration')
    await fireEvent.update(amount, '0')
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(within(popover).getByRole('alert').textContent).toContain(
      'Enter a whole number greater than 0.'
    )
    expect(amount.getAttribute('aria-describedby')).toBe(
      within(popover).getByRole('alert').getAttribute('id')
    )
    expect(view.emitted()['update:modelValue']).toBeUndefined()
    await fireEvent.update(amount, '3')
    const unit = within(popover).getByLabelText('Unit') as HTMLSelectElement
    unit.value = 'day'
    await fireEvent.change(unit)
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({ type: 'relative', amount: 3, unit: 'day' })
    await view.rerender({ modelValue: lastValue(view.emitted()) })
    expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('Last 3 days')
  })

  it('applies an absolute range typed as wall-clock time in the zone', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'America/Sao_Paulo',
        rangeSelectorMode: 'absolute-only',
        modelValue: {
          type: 'absolute',
          start: '2026-11-01T03:00:00.000Z',
          end: '2026-11-01T15:00:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    expect(within(popover).queryByRole('radio')).toBeNull()
    expect((within(popover).getByLabelText('Start time') as HTMLInputElement).value).toBe('00:00')
    await setField(within(popover).getByLabelText('Start'), '11/3/2026')
    await setField(within(popover).getByLabelText('Start time'), '09:30')
    await setField(within(popover).getByLabelText('End'), '11/5/2026')
    await setField(within(popover).getByLabelText('End time'), '17:00')
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'absolute',
      start: '2026-11-03T12:30:00.000Z',
      end: '2026-11-05T20:00:00.000Z'
    })
  })

  it('picks whole days with show-time="false": no time fields, start of the first day to end of the last', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        rangeSelectorMode: 'absolute-only',
        showTime: false,
        modelValue: null
      }
    })
    const popover = await open(view.getByTestId)
    expect(within(popover).queryByLabelText('Start time')).toBeNull()
    expect(within(popover).queryByLabelText('End time')).toBeNull()
    await setField(within(popover).getByLabelText('Start'), '11/3/2026')
    await setField(within(popover).getByLabelText('End'), '11/5/2026')
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    const value = lastValue(view.emitted())
    expect(value?.type).toBe('absolute')
    const { start, end } = value as { start: string; end: string }
    expect(start.slice(0, 10)).toBe('2026-11-03')
    expect(end.slice(0, 10)).toBe('2026-11-05')
    expect(new Date(end).getTime()).toBeGreaterThan(new Date(start).getTime())
  })

  it('refuses an end before the start', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        modelValue: {
          type: 'absolute',
          start: '2026-11-03T10:00:00.000Z',
          end: '2026-11-03T12:00:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    await setField(within(popover).getByLabelText('End time'), '09:00')
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(within(popover).getByRole('alert').textContent).toContain(
      'The end must be after the start.'
    )
    expect(view.emitted()['update:modelValue']).toBeUndefined()
    expect(panel()).toBeTruthy()
  })

  it('lists the times in 30-minute steps under a time field and keeps the panel open on a pick', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        modelValue: {
          type: 'absolute',
          start: '2026-11-03T10:00:00.000Z',
          end: '2026-11-03T12:00:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    const input = within(popover).getByTestId('date-picker__start-time__input')
    await fireEvent.focus(input)
    const list = await waitFor(() => {
      const found = document.body.querySelector<HTMLElement>(
        '[data-testid="date-picker__start-time__listbox"]'
      )
      expect(found?.style.display).not.toBe('none')
      return found as HTMLElement
    })
    const times = within(list).getAllByRole('option')
    expect(times).toHaveLength(48)
    expect(times[1]?.textContent?.trim()).toBe('00:30')
    const current = within(list).getByRole('option', { selected: true })
    expect(current.textContent?.trim()).toBe('10:00')
    await fireEvent.mouseDown(within(list).getByRole('option', { name: '09:30' }))
    await fireEvent.click(within(list).getByRole('option', { name: '09:30' }))
    await nextTick()
    expect(panel()).toBeTruthy()
    expect((input as HTMLInputElement).value).toBe('09:30')
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'absolute',
      start: '2026-11-03T09:30:00.000Z',
      end: '2026-11-03T12:00:00.000Z'
    })
  })

  it('puts a time between two steps in the list, so it opens on it', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        modelValue: {
          type: 'absolute',
          start: '2026-11-03T07:32:00.000Z',
          end: '2026-11-03T12:00:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    await fireEvent.focus(within(popover).getByTestId('date-picker__start-time__input'))
    const list = await waitFor(() => {
      const found = document.body.querySelector<HTMLElement>(
        '[data-testid="date-picker__start-time__listbox"]'
      )
      expect(found?.style.display).not.toBe('none')
      return found as HTMLElement
    })
    const times = within(list)
      .getAllByRole('option')
      .map((el) => el.textContent?.trim())
    expect(times).toHaveLength(49)
    expect(times.slice(15, 18)).toEqual(['07:30', '07:32', '08:00'])
    expect(within(list).getByRole('option', { selected: true }).textContent?.trim()).toBe('07:32')
  })

  it('flags an end before the start as soon as it is typed', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        modelValue: {
          type: 'absolute',
          start: '2026-11-05T10:00:00.000Z',
          end: '2026-11-05T12:00:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    expect(within(popover).queryByRole('alert')).toBeNull()
    await setField(within(popover).getByLabelText('End'), '6/30/2026')
    expect(within(popover).getByRole('alert').textContent).toContain(
      'The end must be after the start.'
    )
  })

  it('shows date and time placeholders as hints, never as a value', async () => {
    const view = render(DateRangePicker, {
      props: { now: NOW, timeZone: 'UTC', rangeSelectorMode: 'absolute-only' }
    })
    const popover = await open(view.getByTestId)
    const end = within(popover).getByLabelText('End') as HTMLInputElement
    expect(end.value).toBe('')
    expect(end.placeholder).toMatch(/^e\.g\. /)
    expect(
      (within(popover).getByTestId('date-picker__end-time__input') as HTMLInputElement).placeholder
    ).toBe('hh:mm')
  })

  it('re-labels an absolute range when the time zone changes', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        modelValue: {
          type: 'absolute',
          start: '2026-11-10T12:00:00.000Z',
          end: '2026-11-10T18:30:00.000Z'
        }
      }
    })
    const trigger = view.getByTestId(`${TEST_ID}__trigger`)
    expect(trigger.textContent).toContain('12:00')
    expect(trigger.textContent).toContain('18:30')
    expect(trigger.textContent).toContain('UTC+00:00')
    await view.rerender({ timeZone: 'Asia/Tokyo' })
    expect(trigger.textContent).toContain('21:00')
    expect(trigger.textContent).toContain('3:30')
    expect(trigger.textContent).toContain('UTC+09:00')
  })

  it('names the zone in a read-only line unless show-time-zone asks for the selector', async () => {
    const view = render(DateRangePicker, {
      props: { now: NOW, timeZone: 'America/New_York', rangeSelectorMode: 'absolute-only' }
    })
    const popover = await open(view.getByTestId)
    expect(within(popover).queryByLabelText('Timezone')).toBeNull()
    expect(within(popover).getByTestId(`${TEST_ID}__zone`).textContent?.trim()).toBe(
      'Times in UTC−05:00 · New York'
    )
    await view.rerender({ showTimeZone: true })
    await nextTick()
    expect(within(popover).getByLabelText('Timezone')).toBeTruthy()
    expect(within(popover).queryByTestId(`${TEST_ID}__zone`)).toBeNull()
  })

  it('keeps the instants when the zone changes in the panel and emits the zone on Apply', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        timeZones: ['UTC', 'Asia/Tokyo'],
        showTimeZone: true,
        modelValue: {
          type: 'absolute',
          start: '2026-11-10T12:00:00.000Z',
          end: '2026-11-10T18:30:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    const zone = within(popover).getByLabelText('Timezone')
    await userEvent.clear(zone)
    await userEvent.type(zone, 'Tokyo')
    const zones = await listbox('date-picker__timezone-field__listbox')
    await userEvent.click(await within(zones).findByRole('option', { name: /Tokyo/ }))
    await waitFor(() =>
      expect((within(popover).getByLabelText('Start time') as HTMLInputElement).value).toBe('21:00')
    )
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(view.emitted()['update:timeZone']?.at(-1)).toEqual(['Asia/Tokyo'])
    expect(lastValue(view.emitted())).toEqual({
      type: 'absolute',
      start: '2026-11-10T12:00:00.000Z',
      end: '2026-11-10T18:30:00.000Z'
    })
  })

  it('steps an absolute range back and forward by its own length, never past now', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        showStep: true,
        modelValue: {
          type: 'absolute',
          start: '2026-11-10T13:00:00.000Z',
          end: '2026-11-10T14:00:00.000Z'
        }
      }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Previous range' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'absolute',
      start: '2026-11-10T12:00:00.000Z',
      end: '2026-11-10T13:00:00.000Z'
    })
    await fireEvent.click(view.getByRole('button', { name: 'Next range' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'absolute',
      start: '2026-11-10T13:00:00.000Z',
      end: '2026-11-10T14:00:00.000Z'
    })
    await view.rerender({
      modelValue: {
        type: 'absolute',
        start: '2026-11-10T14:30:00.000Z',
        end: '2026-11-10T15:30:00.000Z'
      }
    })
    expect((view.getByRole('button', { name: 'Next range' }) as HTMLButtonElement).disabled).toBe(
      true
    )
    await view.rerender({ modelValue: { type: 'relative', amount: 1, unit: 'hour' } })
    expect((view.getByRole('button', { name: 'Next range' }) as HTMLButtonElement).disabled).toBe(
      true
    )
    await fireEvent.click(view.getByRole('button', { name: 'Previous range' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'absolute',
      start: '2026-11-10T14:00:00.000Z',
      end: '2026-11-10T15:00:00.000Z'
    })
  })

  it('moves between quick ranges with the arrow keys', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    const first = within(popover).getByRole('radio', { name: 'Last 5 minutes' })
    first.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(
      (within(popover).getByRole('radio', { name: 'Last 15 minutes' }) as HTMLInputElement).checked
    ).toBe(true)
    await userEvent.keyboard('{Enter}')
  })

  it('opens the Relative tab of an absolute value with the custom fields matching the first quick range', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        modelValue: {
          type: 'absolute',
          start: '2026-11-10T13:00:00.000Z',
          end: '2026-11-10T14:00:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Relative' }))
    expect(
      (within(popover).getByRole('radio', { name: 'Today' }) as HTMLInputElement).checked
    ).toBe(true)
    expect((within(popover).getByLabelText('Duration') as HTMLInputElement).value).toBe('1')
    expect(shown(within(popover).getByLabelText('Unit'))).toBe('Days')
  })

  it('lists the twelve default quick ranges above the custom duration', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    expect(
      within(popover)
        .getAllByTestId(`${TEST_ID}__option`)
        .map((option) => option.textContent?.trim())
    ).toEqual([
      'Today',
      'This week',
      'Last minute',
      'Last 5 minutes',
      'Last 15 minutes',
      'Last 30 minutes',
      'Last hour',
      'Last 24 hours',
      'Last 7 days',
      'Last 30 days',
      'Last 90 days',
      'Last year'
    ])
    const quick = within(popover).getByTestId(`${TEST_ID}__quick`)
    const custom = within(popover).getByTestId(`${TEST_ID}__custom`)
    expect(quick.compareDocumentPosition(custom) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it.each([
    ['Last 90 days', { amount: 90, unit: 'day', key: 'last-90-days' }],
    ['Last year', { amount: 1, unit: 'year', key: 'last-1-year' }],
    ['Last minute', { amount: 1, unit: 'minute', key: 'last-1-minute' }]
  ] as const)('commits %s and prints it on the trigger', async (name, value) => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name }))
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({ type: 'relative', ...value })
    await waitFor(() => expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain(name))
  })

  it('mirrors a picked quick range in the custom duration and unit', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Last 7 days' }))
    expect((within(popover).getByLabelText('Duration') as HTMLInputElement).value).toBe('7')
    expect(shown(within(popover).getByLabelText('Unit'))).toBe('Days')
  })

  it('makes a picked unit a custom duration', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Last 7 days' }))
    await choose(within(popover).getByLabelText('Unit'), `${TEST_ID}__unit-list`, 'Hours')
    expect(within(popover).getByTestId(`${TEST_ID}__custom`).hasAttribute('data-selected')).toBe(
      true
    )
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({ type: 'relative', amount: 7, unit: 'hour' })
  })

  it('offers calendar ranges that start at the beginning of the day or week in the zone', async () => {
    expect(
      resolveDateRange({ type: 'relative', amount: 1, unit: 'day', snap: true }, NOW, {
        timeZone: 'America/New_York'
      })?.start.toISOString()
    ).toBe('2026-11-10T05:00:00.000Z')
    expect(
      resolveDateRange({ type: 'relative', amount: 1, unit: 'week', snap: true }, NOW, {
        timeZone: 'UTC'
      })?.start.toISOString()
    ).toBe('2026-11-08T00:00:00.000Z')
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        relativeOptions: [
          { key: 'today', amount: 1, unit: 'day', snap: true },
          { key: 'this-week', amount: 1, unit: 'week', snap: true },
          { key: 'last-1-hour', amount: 1, unit: 'hour' }
        ]
      }
    })
    const popover = await openRelative(view.getByTestId)
    expect(within(popover).getByRole('radio', { name: 'This week' })).toBeTruthy()
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Today' }))
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'relative',
      amount: 1,
      unit: 'day',
      key: 'today',
      snap: true
    })
    await view.rerender({ modelValue: lastValue(view.emitted()) })
    expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('Today')
  })

  it('applies a range that starts at a date and ends now', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        showStep: true,
        modelValue: {
          type: 'absolute',
          start: '2026-11-10T09:30:00.000Z',
          end: '2026-11-10T12:00:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('switch', { name: 'End at now' }))
    expect(within(popover).queryByLabelText('End')).toBeNull()
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(lastValue(view.emitted())).toEqual({
      type: 'since',
      start: '2026-11-10T09:30:00.000Z'
    })
    await view.rerender({ modelValue: lastValue(view.emitted()) })
    expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('9:30 – now')
    expect(view.getByTestId(`${TEST_ID}__next`).hasAttribute('disabled')).toBe(true)
    const back = await reopen(view.getByTestId)
    expect(
      (within(back).getByRole('switch', { name: 'End at now' }) as HTMLElement).getAttribute(
        'aria-checked'
      )
    ).toBe('true')
  })

  it('offers End at now only when the picker also offers relative ranges', async () => {
    const view = render(DateRangePicker, {
      props: { now: NOW, rangeSelectorMode: 'absolute-only' }
    })
    const popover = await open(view.getByTestId)
    expect(within(popover).queryByRole('switch', { name: 'End at now' })).toBeNull()
  })

  it('offers Refresh every by default and sets the interval on Apply, firing refresh on each tick', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    try {
      const view = render(DateRangePicker, {
        props: { now: NOW, modelValue: { type: 'relative', amount: 5, unit: 'minute' } }
      })
      const popover = await open(view.getByTestId)
      const select = within(popover).getByLabelText('Refresh every')
      expect(shown(select)).toBe('5 minutes')
      await userEvent.click(select)
      const list = await listbox(`${TEST_ID}__refresh-list`)
      expect(
        within(list)
          .getAllByRole('option')
          .map((option) => option.textContent?.trim())
      ).toEqual([
        'Off',
        '10 seconds',
        '30 seconds',
        '1 minute',
        '5 minutes',
        '15 minutes',
        '30 minutes',
        '1 hour'
      ])
      await userEvent.click(within(list).getByRole('option', { name: '30 seconds' }))
      expect(view.emitted()['update:refreshInterval']).toBeUndefined()
      await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
      expect(view.emitted()['update:refreshInterval']?.at(-1)).toEqual([30])
      await view.rerender({ refreshInterval: 30 })
      expect(view.getByTestId(`${TEST_ID}__trigger`).getAttribute('aria-label')).toContain(
        'refreshes every 30 seconds'
      )
      vi.advanceTimersByTime(61_000)
      expect(view.emitted()['refresh']).toHaveLength(2)
      await view.rerender({ refreshInterval: 0 })
      vi.advanceTimersByTime(61_000)
      expect(view.emitted()['refresh']).toHaveLength(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps a bound interval that is not in the list and turns it off with Off', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        refreshInterval: 120,
        modelValue: { type: 'relative', amount: 5, unit: 'minute' }
      }
    })
    const popover = await open(view.getByTestId)
    const select = within(popover).getByLabelText('Refresh every')
    expect(shown(select)).toBe('2 minutes')
    await choose(select, `${TEST_ID}__refresh-list`, 'Off')
    await fireEvent.click(within(popover).getByRole('button', { name: 'Apply' }))
    expect(view.emitted()['update:refreshInterval']?.at(-1)).toEqual([0])
  })

  it('refreshes every 5 minutes by default and stops while Refresh every is hidden', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    try {
      const view = render(DateRangePicker, {
        props: { now: NOW, modelValue: { type: 'relative', amount: 1, unit: 'hour' } }
      })
      await nextTick()
      expect(view.getByTestId(`${TEST_ID}__trigger`).getAttribute('aria-label')).toContain(
        'refreshes every 5 minutes'
      )
      expect(view.queryByTestId(`${TEST_ID}__refreshing`)).toBeNull()
      expect(view.getByTestId(`${TEST_ID}__trigger`).querySelector('.az-refresh')).toBeNull()
      vi.advanceTimersByTime(300_000)
      expect(view.emitted()['refresh']).toHaveLength(1)
      await view.rerender({ showRefresh: false })
      vi.advanceTimersByTime(600_000)
      expect(view.emitted()['refresh']).toHaveLength(1)
      expect(view.queryByTestId(`${TEST_ID}__refreshing`)).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('renders no native select in the panel', async () => {
    const view = render(DateRangePicker, {
      props: { now: NOW, showTimeZone: true, timeZones: ['UTC', 'Asia/Tokyo'] }
    })
    const popover = await open(view.getByTestId)
    expect(popover.querySelector('select')).toBeNull()
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Absolute' }))
    await nextTick()
    expect(popover.querySelector('select')).toBeNull()
    expect(within(popover).getByLabelText('Month')).toBeTruthy()
  })

  it('moves the calendar to the month and year picked in its caption', async () => {
    const view = render(DateRangePicker, {
      props: { now: NOW, rangeSelectorMode: 'absolute-only' }
    })
    const popover = await open(view.getByTestId)
    const grid = within(popover).getByRole('grid')
    expect(grid.getAttribute('aria-label')).toBe('November 2026')
    await choose(within(popover).getByLabelText('Month'), 'date-picker__month-list', 'March')
    await waitFor(() =>
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('March 2026')
    )
    await choose(within(popover).getByLabelText('Year'), 'date-picker__year-list', '2024')
    await waitFor(() =>
      expect(within(popover).getByRole('grid').getAttribute('aria-label')).toBe('March 2024')
    )
    expect(panel()).toBeTruthy()
  })

  it('hides Refresh every with show-refresh off or an absolute-only picker', async () => {
    const off = render(DateRangePicker, { props: { now: NOW, showRefresh: false } })
    expect(within(await open(off.getByTestId)).queryByLabelText('Refresh every')).toBeNull()
    off.unmount()
    const absolute = render(DateRangePicker, {
      props: { now: NOW, rangeSelectorMode: 'absolute-only' }
    })
    expect(within(await open(absolute.getByTestId)).queryByLabelText('Refresh every')).toBeNull()
  })

  it('relative-only: opens with the check and the focus on the range the trigger shows', async () => {
    const view = render(RelativeOnly)
    const trigger = view.getByTestId(`${TEST_ID}__trigger`)
    expect(trigger.textContent).toContain('Last 24 hours')
    const popover = await open(view.getByTestId)
    expect(within(popover).queryByTestId(`${TEST_ID}__mode`)).toBeNull()
    const radio = within(popover).getByRole('radio', { name: 'Last 24 hours' })
    expect((radio as HTMLInputElement).checked).toBe(true)
    await waitFor(() => expect(document.activeElement).toBe(radio))
  })

  it('switches between the relative and absolute tabs', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await openRelative(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Absolute' }))
    await waitFor(() => expect(within(popover).getByTestId(`${TEST_ID}__absolute`)).toBeTruthy())
    expect(within(popover).getByRole('grid')).toBeTruthy()
  })

  it('does not open while disabled', async () => {
    const view = render(DateRangePicker, { props: { disabled: true } })
    await fireEvent.click(view.getByTestId(`${TEST_ID}__trigger`))
    expect(panel()).toBeNull()
  })

  it('has no axe violations closed and open', async () => {
    const view = render(Default)
    await expectNoA11yViolations(view.container)
    const popover = await open(view.getByTestId)
    await expectNoA11yViolations(popover)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Absolute' }))
    await nextTick()
    await expectNoA11yViolations(popover)
  })

  it('renders the time zone example', async () => {
    const view = render(TimeZone)
    expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('UTC+00:00')
  })

  it('follows the provider: right-to-left and pt-BR labels', async () => {
    const model = ref<DateRangeValue | null>({ type: 'relative', amount: 15, unit: 'minute' })
    const Host = defineComponent({
      setup: () => () =>
        h(
          ConfigProvider,
          { locale: 'pt-BR', dir: 'rtl', catalogs: LOCALES },
          {
            default: () =>
              h(DateRangePicker, {
                modelValue: model.value,
                now: NOW,
                showStep: true,
                'onUpdate:modelValue': (value: DateRangeValue | null) => (model.value = value)
              })
          }
        )
    })
    const view = render(Host)
    expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('Últimos 15 minutos')
    const popover = await open(view.getByTestId)
    expect(popover.getAttribute('dir')).toBe('rtl')
    expect(popover.getAttribute('data-side')).toMatch(/^(bottom|top)$/)
    expect(popover.getAttribute('data-align')).toBe('start')
    expect(popover.getAttribute('lang')).toBe('pt-BR')
    expect(within(popover).getByRole('button', { name: 'Aplicar' })).toBeTruthy()
    await expectNoA11yViolations(popover)
  })

  describe('reference clock from ConfigProvider', () => {
    const host = (pickerProps: Record<string, unknown>) => {
      const values: (DateRangeValue | null)[] = []
      const view = render(
        defineComponent({
          setup: () => () =>
            h(
              ConfigProvider,
              { catalogs: LOCALES, now: NOW },
              {
                default: () =>
                  h(DateRangePicker, {
                    timeZone: 'UTC',
                    showStep: true,
                    modelValue: { type: 'relative', amount: 15, unit: 'minute' },
                    'onUpdate:modelValue': (value: DateRangeValue | null) => values.push(value),
                    ...pickerProps
                  })
              }
            )
        })
      )
      return { view, values }
    }

    it('formats in the provider time zone when no time zone is bound', () => {
      const view = render(
        defineComponent({
          setup: () => () =>
            h(
              ConfigProvider,
              { timeZone: 'Asia/Tokyo' },
              {
                default: () =>
                  h(DateRangePicker, {
                    now: NOW,
                    modelValue: {
                      type: 'absolute',
                      start: '2026-11-10T12:00:00.000Z',
                      end: '2026-11-10T18:30:00.000Z'
                    }
                  })
              }
            )
        })
      )
      expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('UTC+09:00')
    })

    it('steps a relative range from the provider now when the now prop is unset', async () => {
      const { view, values } = host({})
      await fireEvent.click(view.getByRole('button', { name: 'Previous range' }))
      expect(values.at(-1)).toEqual({
        type: 'absolute',
        start: '2026-11-10T15:30:00.000Z',
        end: '2026-11-10T15:45:00.000Z'
      })
    })

    it('lets the now prop override the provider', async () => {
      const { view, values } = host({ now: new Date('2026-11-10T18:00:00.000Z') })
      await fireEvent.click(view.getByRole('button', { name: 'Previous range' }))
      expect(values.at(-1)).toEqual({
        type: 'absolute',
        start: '2026-11-10T17:30:00.000Z',
        end: '2026-11-10T17:45:00.000Z'
      })
    })
  })

  describe('in a Field', () => {
    it('takes the Field label, description, invalid and disabled state on its trigger', async () => {
      const { getByTestId, getByRole } = render({
        components: { Field, FieldLabel, FieldDescription, DateRangePicker },
        template:
          '<Field invalid disabled><FieldLabel>Events window</FieldLabel><DateRangePicker /><FieldDescription>Times are UTC.</FieldDescription></Field>'
      })
      const trigger = getByTestId('date-range-picker__trigger') as HTMLButtonElement
      expect(getByRole('button', { name: 'Events window' })).toBe(trigger)
      expect(trigger.getAttribute('aria-invalid')).toBe('true')
      expect(trigger.disabled).toBe(true)
      await waitFor(() =>
        expect(
          document.getElementById(trigger.getAttribute('aria-describedby') ?? '')?.textContent
        ).toContain('Times are UTC.')
      )
    })

    it('renders the Disabled example with a disabled trigger', () => {
      const { getByTestId } = render(Disabled)
      expect((getByTestId('date-range-picker__trigger') as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
