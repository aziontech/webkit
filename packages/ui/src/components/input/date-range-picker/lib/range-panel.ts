import { nextTick } from 'vue'

import { asRange, withTime } from '../../date-picker/format'
import type { DatePickerRange } from '../../date-picker/injection-key'
import {
  type DateRangeUnit,
  type DateRangeValue,
  fromWallClock,
  type RelativeOption,
  resolveDateRange,
  type ResolveDateRangeOptions,
  toWallClock
} from '../date-range'
import { pickDay } from './range-bounds'
import { CUSTOM, seedOf } from './range-draft'

/** Everything the open panel edits before Apply. */
export interface DateRangePanel {
  mode: 'relative' | 'absolute'
  view: 'quick' | 'custom'
  absoluteView: 'calendar' | 'fields'
  quickKey: string
  key: string
  amount: string
  unit: DateRangeUnit
  range: DatePickerRange
  zone: string
  untilNow: boolean
  refresh: number
  showError: boolean
}

export const emptyPanel = (): DateRangePanel => ({
  mode: 'relative',
  view: 'quick',
  absoluteView: 'calendar',
  quickKey: '',
  key: '',
  amount: '1',
  unit: 'hour',
  range: { start: null, end: null },
  zone: '',
  untilNow: false,
  refresh: 0,
  showError: false
})

const focusIn = (id: string): void => {
  nextTick(() => globalThis.document?.getElementById(id)?.focus())
}

export interface DateRangeOpening {
  value: DateRangeValue | null
  available: RelativeOption[]
  offersRelative: boolean
  offersAbsolute: boolean
  zone: string
  refresh: number
  now: Date
  options: ResolveDateRangeOptions
}

export const resetPanel = (panel: DateRangePanel, open: DateRangeOpening): void => {
  const { value, zone } = open
  const seed = seedOf(value, open.available, open.offersRelative, open.offersAbsolute)
  const resolved = resolveDateRange(value, open.now, open.options)
  Object.assign(panel, {
    zone,
    showError: false,
    untilNow: value?.type === 'since',
    refresh: open.refresh > 0 ? open.refresh : 0,
    view: 'quick',
    absoluteView: 'calendar',
    mode: seed.mode,
    key: seed.key,
    amount: seed.amount,
    unit: seed.unit,
    range: resolved
      ? {
          start: toWallClock(resolved.start, zone),
          end: value?.type === 'since' ? null : toWallClock(resolved.end, zone)
        }
      : { start: null, end: null }
  })
}

export const pickOption = (panel: DateRangePanel, options: RelativeOption[], key: string) => {
  panel.key = key
  const option = options.find((item) => item.key === key)
  if (!option) return
  panel.amount = String(option.amount)
  panel.unit = option.unit
}

export const editAmount = (panel: DateRangePanel, value: string) => {
  panel.amount = value
  panel.key = CUSTOM
}

export const editUnit = (panel: DateRangePanel, unit: DateRangeUnit | undefined) => {
  if (!unit) return
  panel.unit = unit
  panel.key = CUSTOM
}

export const showCustom = (panel: DateRangePanel, uid: string) => {
  panel.quickKey = panel.key
  panel.key = CUSTOM
  panel.view = 'custom'
  panel.showError = false
  focusIn(`${uid}-amount`)
}

export const showQuick = (panel: DateRangePanel, available: RelativeOption[], uid: string) => {
  const option = available.find((item) => item.key === panel.quickKey)
  if (option && String(option.amount) === panel.amount && option.unit === panel.unit) {
    panel.key = option.key
  }
  panel.view = 'quick'
  panel.showError = false
  focusIn(`${uid}-custom-range`)
}

export const showAbsoluteView = (
  panel: DateRangePanel,
  view: DateRangePanel['absoluteView'],
  uid: string
) => {
  panel.absoluteView = view
  nextTick(() => {
    const target =
      view === 'fields'
        ? globalThis.document?.getElementById(`${uid}-fields`)?.querySelector<HTMLElement>('input')
        : globalThis.document
            ?.getElementById(`${uid}-calendar`)
            ?.querySelector<HTMLElement>('[role="grid"] button[tabindex="0"]')
    target?.focus()
  })
}

export const setPanelMode = (panel: DateRangePanel, value: string | undefined) => {
  if (value !== 'relative' && value !== 'absolute') return
  panel.mode = value
  panel.view = 'quick'
  panel.absoluteView = 'calendar'
  panel.showError = false
}

export const setUntilNow = (panel: DateRangePanel, on: boolean, nowWall: () => Date) => {
  panel.untilNow = on
  panel.showError = false
  if (on) panel.range = { start: panel.range.start, end: null }
  else if (panel.range.start && !panel.range.end) {
    panel.range = { start: panel.range.start, end: nowWall() }
  }
}

export const setZone = (panel: DateRangePanel, next: string) => {
  const previous = panel.zone
  const { start, end } = panel.range
  panel.range = {
    start: start ? toWallClock(fromWallClock(start, previous), next) : null,
    end: end ? toWallClock(fromWallClock(end, previous), next) : null
  }
  panel.zone = next
}

export const selectDay = (panel: DateRangePanel, date: Date) => {
  panel.range = panel.untilNow
    ? { start: withTime(date, panel.range.start, false), end: null }
    : pickDay(asRange(panel.range), date)
}

export const selectValue = (panel: DateRangePanel, value: Date | DatePickerRange) => {
  if (panel.untilNow) {
    panel.range = { start: value instanceof Date ? value : value.start, end: null }
    return
  }
  const range = value instanceof Date ? { start: value, end: value } : value
  panel.range = { start: range.start, end: range.end }
}

export const setEndpoint = (panel: DateRangePanel, which: 'start' | 'end', date: Date | null) => {
  panel.range =
    which === 'start'
      ? { start: date, end: panel.range.end }
      : { start: panel.range.start, end: date }
}
