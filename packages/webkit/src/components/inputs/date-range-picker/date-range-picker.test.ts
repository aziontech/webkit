import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/date-range-picker/default.vue'
import TimeZone from '../../../../examples/date-range-picker/time-zone.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import { fromWallClock, resolveDateRange, stepDateRange, toWallClock } from './date-range'
import DateRangePicker, { type DateRangeValue } from './date-range-picker.vue'

const TEST_ID = 'input-date-range-picker'
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

const lastValue = (emitted: Record<string, unknown[][]>): DateRangeValue | undefined =>
  emitted['update:modelValue']?.at(-1)?.[0] as DateRangeValue | undefined

const setField = async (input: HTMLElement, text: string): Promise<void> => {
  await fireEvent.update(input, text)
  await fireEvent.change(input)
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('date-range helpers', () => {
  it('converts wall-clock time in a zone to instants and back', () => {
    const wall = new Date(2026, 10, 10, 9, 30)
    expect(fromWallClock(wall, 'America/Sao_Paulo').toISOString()).toBe('2026-11-10T12:30:00.000Z')
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

describe('DateRangePicker', () => {
  it('shows the placeholder and opens on the Relative tab with no value', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const trigger = view.getByTestId(`${TEST_ID}__trigger`)
    expect(trigger.textContent).toContain('Select a time range')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    const popover = await open(view.getByTestId)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(within(popover).getByTestId(`${TEST_ID}__relative`)).toBeTruthy()
  })

  it('picks a quick range and commits it only on Apply', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await open(view.getByTestId)
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
    const popover = await open(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Custom range' }))
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
    await fireEvent.update(within(popover).getByLabelText('Unit'), 'day')
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

  it('keeps the instants when the zone changes in the panel and emits the zone on Apply', async () => {
    const view = render(DateRangePicker, {
      props: {
        now: NOW,
        timeZone: 'UTC',
        timeZones: ['UTC', 'Asia/Tokyo'],
        modelValue: {
          type: 'absolute',
          start: '2026-11-10T12:00:00.000Z',
          end: '2026-11-10T18:30:00.000Z'
        }
      }
    })
    const popover = await open(view.getByTestId)
    const select = within(popover).getByLabelText('Timezone') as HTMLSelectElement
    await fireEvent.update(select, 'Asia/Tokyo')
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
    const popover = await open(view.getByTestId)
    const first = within(popover).getByRole('radio', { name: 'Last 5 minutes' })
    first.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(
      (within(popover).getByRole('radio', { name: 'Last 15 minutes' }) as HTMLInputElement).checked
    ).toBe(true)
    await userEvent.keyboard('{Enter}')
  })

  it('switches between the relative and absolute tabs', async () => {
    const view = render(DateRangePicker, { props: { now: NOW } })
    const popover = await open(view.getByTestId)
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Absolute range' }))
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
    await fireEvent.click(within(popover).getByRole('radio', { name: 'Absolute range' }))
    await nextTick()
    await expectNoA11yViolations(popover)
  })

  it('renders the time zone example', async () => {
    const view = render(TimeZone)
    expect(view.getByTestId(`${TEST_ID}__trigger`).textContent).toContain('UTC−03:00')
  })

  it('follows the provider: right-to-left and pt-BR labels', async () => {
    const model = ref<DateRangeValue | null>({ type: 'relative', amount: 15, unit: 'minute' })
    const Host = defineComponent({
      setup: () => () =>
        h(
          WebkitProvider,
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
    expect(popover.getAttribute('lang')).toBe('pt-BR')
    expect(within(popover).getByRole('button', { name: 'Aplicar' })).toBeTruthy()
    await expectNoA11yViolations(popover)
  })
})
