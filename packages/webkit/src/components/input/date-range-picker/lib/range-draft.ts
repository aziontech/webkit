import {
  type DateRangeDuration,
  type DateRangeUnit,
  type DateRangeValue,
  fromWallClock,
  type RelativeOption,
  sameRelative,
  shiftByUnit,
  toWallClock
} from '../date-range'
import { exceedsDuration } from './range-bounds'
import type { DateRangePanel } from './range-panel'
import type { DateRangeTranslate } from './range-text'

/** Key of the custom relative range in the draft. */
export const CUSTOM = '__custom'

/** The panel fields a draft value reads, with the custom amount parsed. */
export type DateRangeDraft = Pick<
  DateRangePanel,
  'mode' | 'key' | 'unit' | 'range' | 'untilNow' | 'zone'
> & {
  amount: number | null
}

const relativeDraft = (draft: DateRangeDraft, options: RelativeOption[]): DateRangeValue | null => {
  if (draft.key === CUSTOM) {
    return draft.amount ? { type: 'relative', amount: draft.amount, unit: draft.unit } : null
  }
  const option = options.find((item) => item.key === draft.key)
  if (!option) return null
  const value = { type: 'relative' as const, amount: option.amount, unit: option.unit }
  return option.snap ? { ...value, key: option.key, snap: true } : { ...value, key: option.key }
}

export const draftValueOf = (
  draft: DateRangeDraft,
  options: RelativeOption[]
): DateRangeValue | null => {
  if (draft.mode === 'relative') return relativeDraft(draft, options)
  const { start, end } = draft.range
  if (draft.untilNow) {
    return start ? { type: 'since', start: fromWallClock(start, draft.zone).toISOString() } : null
  }
  if (!start || !end) return null
  return {
    type: 'absolute',
    start: fromWallClock(start, draft.zone).toISOString(),
    end: fromWallClock(end, draft.zone).toISOString()
  }
}

/** What a draft is checked against. */
export interface DateRangeLimits {
  now: Date
  min: Date
  max: Date
  duration: DateRangeDuration | undefined
  tooLong: string
}

const relativeError = (
  t: DateRangeTranslate,
  draft: DateRangeDraft,
  limits: DateRangeLimits
): string => {
  if (draft.key !== CUSTOM) return ''
  if (!draft.amount) return t('dateRangePicker.invalidAmount')
  const start = shiftByUnit(limits.now, -draft.amount, draft.unit).getTime()
  const limit = limits.duration
  if (limit && start < shiftByUnit(limits.now, -limit.amount, limit.unit).getTime()) {
    return limits.tooLong
  }
  return start < limits.min.getTime() ? t('dateRangePicker.outOfBounds') : ''
}

const sinceError = (
  t: DateRangeTranslate,
  draft: DateRangeDraft,
  limits: DateRangeLimits,
  since: string
): string => {
  const start = new Date(since).getTime()
  if (start >= limits.now.getTime()) return t('dateRangePicker.order')
  if (start < limits.min.getTime()) return t('dateRangePicker.outOfBounds')
  const wallStart = draft.range.start
  return wallStart &&
    exceedsDuration(limits.duration, wallStart, toWallClock(limits.now, draft.zone))
    ? limits.tooLong
    : ''
}

const absoluteError = (
  t: DateRangeTranslate,
  draft: DateRangeDraft,
  limits: DateRangeLimits,
  value: { start: string; end: string }
): string => {
  const start = new Date(value.start).getTime()
  const end = new Date(value.end).getTime()
  if (end <= start) return t('dateRangePicker.order')
  if (start < limits.min.getTime() || end > limits.max.getTime()) {
    return t('dateRangePicker.outOfBounds')
  }
  const { start: wallStart, end: wallEnd } = draft.range
  return wallStart && wallEnd && exceedsDuration(limits.duration, wallStart, wallEnd)
    ? limits.tooLong
    : ''
}

export const draftErrorOf = (
  t: DateRangeTranslate,
  draft: DateRangeDraft,
  value: DateRangeValue | null,
  limits: DateRangeLimits
): string => {
  if (draft.mode === 'relative') return relativeError(t, draft, limits)
  if (value?.type === 'since') return sinceError(t, draft, limits, value.start)
  if (!value || value.type !== 'absolute') return t('dateRangePicker.incomplete')
  return absoluteError(t, draft, limits, value)
}

/** Where the panel starts when it opens. */
export interface DateRangeSeed {
  mode: 'relative' | 'absolute'
  key: string
  amount: string
  unit: DateRangeUnit
}

const relativeSeed = (value: DateRangeValue | null, available: RelativeOption[]): DateRangeSeed => {
  const relative = value?.type === 'relative' ? value : null
  const option = value ? available.find((item) => sameRelative(value, item)) : available[0]
  return {
    mode: 'relative',
    key: option ? option.key : CUSTOM,
    amount: String(relative ? relative.amount : (option?.amount ?? 1)),
    unit: relative ? relative.unit : (option?.unit ?? 'hour')
  }
}

export const seedOf = (
  value: DateRangeValue | null,
  available: RelativeOption[],
  offersRelative: boolean,
  offersAbsolute: boolean
): DateRangeSeed => {
  if (offersRelative && (!value || value.type === 'relative' || !offersAbsolute)) {
    return relativeSeed(value, available)
  }
  const first = available[0]
  return {
    mode: offersAbsolute ? 'absolute' : 'relative',
    key: first?.key ?? CUSTOM,
    amount: String(first?.amount ?? 1),
    unit: first?.unit ?? 'hour'
  }
}
