import type { MessageKey, MessageParams } from '../../../../i18n/types'
import { formatValueLabel } from '../../date-picker/format'
import {
  type DateRangeDuration,
  type DateRangeRefreshUnit,
  type DateRangeUnit,
  type DateRangeValue,
  REFRESH_UNITS,
  type RelativeOption,
  resolveDateRange,
  sameRelative,
  toWallClock,
  zoneOffsetLabel
} from '../date-range'

/** The translator a DateRangePicker label reads from. */
export type DateRangeTranslate = (key: MessageKey, params?: MessageParams) => string

const SNAP_KEYS: Partial<Record<DateRangeUnit, MessageKey>> = {
  day: 'dateRangePicker.today',
  week: 'dateRangePicker.thisWeek',
  month: 'dateRangePicker.thisMonth',
  year: 'dateRangePicker.thisYear'
}

const UNIT_KEYS = {
  second: 'dateRangePicker.unitSecond',
  minute: 'dateRangePicker.unitMinute',
  hour: 'dateRangePicker.unitHour',
  day: 'dateRangePicker.unitDay',
  week: 'dateRangePicker.unitWeek',
  month: 'dateRangePicker.unitMonth',
  year: 'dateRangePicker.unitYear'
} as const

const REFRESH_KEYS = {
  second: 'dateRangePicker.refreshSecond',
  minute: 'dateRangePicker.refreshMinute',
  hour: 'dateRangePicker.refreshHour'
} as const

const UNIT_SECONDS: Record<DateRangeRefreshUnit, number> = { second: 1, minute: 60, hour: 3600 }

export const relativeText = (
  t: DateRangeTranslate,
  amount: number,
  unit: DateRangeUnit,
  snap = false
): string => {
  const snapKey = snap && amount === 1 ? SNAP_KEYS[unit] : undefined
  return snapKey ? t(snapKey) : t(`dateRangePicker.${unit}`, { count: amount })
}

export const optionText = (t: DateRangeTranslate, option: RelativeOption): string =>
  option.label || relativeText(t, option.amount, option.unit, option.snap)

export const unitText = (t: DateRangeTranslate, unit: DateRangeUnit): string => t(UNIT_KEYS[unit])

export const durationText = (locale: string, duration: DateRangeDuration): string =>
  new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: duration.unit,
    unitDisplay: 'long'
  }).format(duration.amount)

const intervalUnit = (seconds: number): DateRangeRefreshUnit =>
  [...REFRESH_UNITS].reverse().find((item) => seconds % UNIT_SECONDS[item] === 0) ?? 'second'

export const refreshText = (t: DateRangeTranslate, seconds: number): string => {
  if (!seconds || seconds <= 0) return ''
  const unit = intervalUnit(seconds)
  return t(REFRESH_KEYS[unit], { count: seconds / UNIT_SECONDS[unit] })
}

export const intervalText = (t: DateRangeTranslate, locale: string, seconds: number): string => {
  if (seconds <= 0) return t('dateRangePicker.refreshOff')
  const unit = intervalUnit(seconds)
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'short'
  }).format(seconds / UNIT_SECONDS[unit])
}

const NO_TEXT = { text: '', zone: '' }

export const triggerText = (
  t: DateRangeTranslate,
  value: DateRangeValue | null,
  options: RelativeOption[],
  zone: string,
  locale: string,
  now: Date
): { text: string; zone: string } => {
  if (!value) return NO_TEXT
  if (value.type === 'relative') {
    const option = options.find((item) => sameRelative(value, item))
    return {
      text: option ? optionText(t, option) : relativeText(t, value.amount, value.unit, value.snap),
      zone: ''
    }
  }
  const range = resolveDateRange(value, now)
  if (!range) return NO_TEXT
  const offset = `(${zoneOffsetLabel(zone, range.start)})`
  if (value.type === 'since') {
    const start = { start: toWallClock(range.start, zone), end: null }
    return {
      text: `${formatValueLabel(start, 'range', '', locale)} ${t('dateRangePicker.now')}`,
      zone: offset
    }
  }
  const wall = { start: toWallClock(range.start, zone), end: toWallClock(range.end, zone) }
  return { text: formatValueLabel(wall, 'range', '', locale), zone: offset }
}
