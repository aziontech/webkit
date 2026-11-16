import userEvent from '@testing-library/user-event'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, effectScope, h, nextTick, ref } from 'vue'

import DateRangePicker from '../../components/input/date-range-picker/date-range-picker.vue'
import WebkitProvider from '../../components/provider/webkit-provider/webkit-provider.vue'
import { type DateRangeValue, TIME_RANGE_PRESETS, timeRangePreset, useTimeRange } from './index'

const NOW = new Date('2026-11-16T12:00:00.000Z')
const HOUR = 3_600_000
const DAY = 24 * HOUR

const inScope = <T>(run: () => T): T => {
  const scope = effectScope()
  const result = scope.run(run) as T
  scope.stop()
  return result
}

describe('TIME_RANGE_PRESETS', () => {
  it('lists last hour, 24 hours, 7 days and 30 days', () => {
    expect(TIME_RANGE_PRESETS.map((preset) => preset.key)).toEqual([
      'last-1-hour',
      'last-24-hours',
      'last-7-days',
      'last-30-days'
    ])
  })

  it('timeRangePreset builds the relative value DateRangePicker emits for that preset', () => {
    expect(timeRangePreset('last-7-days')).toEqual({
      type: 'relative',
      amount: 7,
      unit: 'day',
      key: 'last-7-days'
    })
  })

  it('renders as the quick ranges of DateRangePicker', async () => {
    const view = render(DateRangePicker, {
      props: { now: NOW, relativeOptions: TIME_RANGE_PRESETS }
    })
    await userEvent.click(view.getByTestId('date-range-picker__trigger'))
    const popover = await waitFor(() => view.getByTestId('date-range-picker__popover'))
    for (const name of ['Last hour', 'Last 24 hours', 'Last 7 days', 'Last 30 days']) {
      expect(within(popover).getByRole('radio', { name })).toBeTruthy()
    }
    expect(within(popover).queryByRole('radio', { name: 'Last 5 minutes' })).toBeNull()
  })
})

describe('useTimeRange', () => {
  it('resolves a relative preset to from and to against the injected clock', () => {
    const { from, to } = inScope(() => useTimeRange(timeRangePreset('last-7-days'), { now: NOW }))
    expect(to.value?.toISOString()).toBe(NOW.toISOString())
    expect(from.value?.getTime()).toBe(NOW.getTime() - 7 * DAY)
  })

  it('passes an absolute range through and returns null for no range', () => {
    const absolute: DateRangeValue = {
      type: 'absolute',
      start: '2026-11-01T00:00:00.000Z',
      end: '2026-11-02T00:00:00.000Z'
    }
    const range = inScope(() => useTimeRange(absolute, { now: NOW }))
    expect(range.from.value?.toISOString()).toBe('2026-11-01T00:00:00.000Z')
    expect(range.to.value?.toISOString()).toBe('2026-11-02T00:00:00.000Z')
    const empty = inScope(() => useTimeRange(null, { now: NOW }))
    expect(empty.from.value).toBeNull()
    expect(empty.to.value).toBeNull()
  })

  it('follows the value it is given', async () => {
    const value = ref<DateRangeValue | null>(timeRangePreset('last-1-hour'))
    const { from } = inScope(() => useTimeRange(value, { now: NOW }))
    expect(from.value?.getTime()).toBe(NOW.getTime() - HOUR)
    value.value = timeRangePreset('last-30-days')
    await nextTick()
    expect(from.value?.getTime()).toBe(NOW.getTime() - 30 * DAY)
  })

  it('holds a relative window until refresh, then ends it at the new now', () => {
    let instant = NOW.getTime()
    const { to, refresh } = inScope(() =>
      useTimeRange(timeRangePreset('last-24-hours'), { now: () => instant })
    )
    expect(to.value?.getTime()).toBe(NOW.getTime())
    instant += HOUR
    expect(to.value?.getTime()).toBe(NOW.getTime())
    refresh()
    expect(to.value?.getTime()).toBe(NOW.getTime() + HOUR)
  })

  it('re-resolves on its own when the clock is a ref', () => {
    const clock = ref(NOW)
    const { to } = inScope(() => useTimeRange(timeRangePreset('last-1-hour'), { now: clock }))
    clock.value = new Date(NOW.getTime() + HOUR)
    expect(to.value?.getTime()).toBe(NOW.getTime() + HOUR)
  })

  it('reads the WebkitProvider now when no clock is passed', () => {
    const Probe = defineComponent({
      setup() {
        const { to } = useTimeRange(timeRangePreset('last-7-days'))
        return () => h('output', { 'data-testid': 'probe' }, to.value?.toISOString() ?? '')
      }
    })
    const view = render(WebkitProvider, {
      props: { now: NOW },
      slots: { default: () => h(Probe) }
    })
    expect(view.getByTestId('probe').textContent).toBe(NOW.toISOString())
  })
})
