import type { CalendarMode, CalendarRange, CalendarValue } from './injection-key'

/** Midnight of the given date (local). */
export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

/** Last representable minute of the given date (local), used as a range end default. */
export const endOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59)

/** Same calendar day (ignores time). */
export const sameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean => {
  if (!a || !b) {
    return false
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Narrow a model value to a range object (empty range when it is a Date or null). */
export const asRange = (value: CalendarValue): CalendarRange => {
  if (value && !(value instanceof Date)) {
    return value
  }

  return { start: null, end: null }
}

/** Narrow a model value to a single Date (null when it is a range or null). */
export const asSingle = (value: CalendarValue): Date | null =>
  value instanceof Date ? value : null

/** Merge a day (Y/M/D) with a source time, defaulting to 00:00 (start) or 23:59 (end). */
export const withTime = (date: Date, source: Date | null, isEnd: boolean): Date => {
  const hours = source ? source.getHours() : isEnd ? 23 : 0
  const minutes = source ? source.getMinutes() : isEnd ? 59 : 0

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
}

const tzOption = (timezone: string): string | undefined => timezone || undefined

/** `Jun 30, 2026`. */
export const formatDate = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: tzOption(timezone)
  }).format(date)

/** `09:00` / `23:59` (24h) — the Start/End time fields. */
export const formatTime = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: tzOption(timezone)
  }).format(date)

const monthDay = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: tzOption(timezone)
  }).format(date)

/** `July 2026` — the whole-month trigger label. */
const monthYear = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: tzOption(timezone)
  }).format(date)

/** `1:00` / `22:59` (24h, no hour padding) — the time suffix on the trigger label. */
const labelClock = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: tzOption(timezone)
  })
    .format(date)
    // ICU pads the h23 hour even with `hour: 'numeric'`; the label wants `1:00`.
    .replace(/^0(?=\d)/, '')

/* The defaults written by withTime: 00:00 on a start, 23:59 on an end. A time that
   still matches its default was never picked by the user, so the label omits it. */
const isDefaultStartTime = (date: Date): boolean => date.getHours() === 0 && date.getMinutes() === 0

const isDefaultEndTime = (date: Date): boolean => date.getHours() === 23 && date.getMinutes() === 59

/** Exactly one whole calendar month, first day 00:00 through last day 23:59. */
const isWholeMonth = (start: Date, end: Date): boolean =>
  start.getFullYear() === end.getFullYear() &&
  start.getMonth() === end.getMonth() &&
  start.getDate() === 1 &&
  end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate() &&
  isDefaultStartTime(start) &&
  isDefaultEndTime(end)

/**
 * Trigger label: a single date, a compact range (`Jun 9 – 26`, `Jun 9 – Jul 2`,
 * `Dec 30, 2026 – Jan 2, 2027`), or `''` when there is no selection. An endpoint
 * whose time differs from its default (00:00 start, 23:59 end) appends it as
 * `Jun 29, 1:00 – Jul 30, 22:59`; a range spanning exactly one whole calendar
 * month with default times collapses to `July 2026`.
 */
export const formatValueLabel = (
  value: CalendarValue,
  mode: CalendarMode,
  timezone = ''
): string => {
  if (mode !== 'range') {
    const single = asSingle(value)
    if (!single) {
      return ''
    }
    const time = isDefaultStartTime(single) ? '' : `, ${labelClock(single, timezone)}`
    return `${formatDate(single, timezone)}${time}`
  }

  const { start, end } = asRange(value)

  if (!start && !end) {
    return ''
  }

  const startTime = start && !isDefaultStartTime(start) ? `, ${labelClock(start, timezone)}` : ''
  const endTime = end && !isDefaultEndTime(end) ? `, ${labelClock(end, timezone)}` : ''

  if (start && !end) {
    return `${formatDate(start, timezone)}${startTime} –`
  }
  if (!start && end) {
    return `– ${formatDate(end, timezone)}${endTime}`
  }

  const s = start as Date
  const e = end as Date

  if (isWholeMonth(s, e)) {
    return monthYear(s, timezone)
  }

  const sameYear = s.getFullYear() === e.getFullYear()
  const sameMonth = sameYear && s.getMonth() === e.getMonth()
  const hasTime = startTime !== '' || endTime !== ''

  if (sameMonth && !hasTime) {
    return `${monthDay(s, timezone)} – ${e.getDate()}`
  }
  if (sameYear) {
    return `${monthDay(s, timezone)}${startTime} – ${monthDay(e, timezone)}${endTime}`
  }

  return `${formatDate(s, timezone)}${startTime} – ${formatDate(e, timezone)}${endTime}`
}

/** `14:44` (24h clock) — used for the resolved-window line of the period trigger. */
const formatClock = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tzOption(timezone)
  }).format(date)

/**
 * The concrete window a period selection resolves to, shown beneath the relative
 * token on the trigger. A same-day span reads as a clock range (`14:44 – 23:59`);
 * a multi-day span falls back to the compact date label.
 */
export const formatWindowLabel = (
  value: CalendarValue,
  mode: CalendarMode,
  timezone = ''
): string => {
  if (mode !== 'range') {
    const single = asSingle(value)
    return single ? `${formatDate(single, timezone)}, ${formatClock(single, timezone)}` : ''
  }

  const { start, end } = asRange(value)
  if (start && end && sameDay(start, end)) {
    return `${formatClock(start, timezone)} – ${formatClock(end, timezone)}`
  }

  return formatValueLabel(value, mode, timezone)
}

/** The host's local IANA timezone (e.g. `America/Sao_Paulo`). */
export const localTimezone = (): string => {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

const cityName = (timezone: string): string =>
  timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone

/** `UTC -05:00 (EST)` — the zone's UTC offset plus its abbreviation when alphabetic. */
const offsetAndAbbr = (timezone: string): string => {
  const reference = new Date()
  const zone = tzOption(timezone)
  const offsetRaw =
    new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' })
      .formatToParts(reference)
      .find((part) => part.type === 'timeZoneName')?.value ?? ''
  const offset = offsetRaw.replace('GMT', 'UTC ').trim() || 'UTC'
  const abbr =
    new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' })
      .formatToParts(reference)
      .find((part) => part.type === 'timeZoneName')?.value ?? ''
  const hasAbbr = /[a-z]/i.test(abbr) && !abbr.startsWith('GMT') && !abbr.startsWith('UTC')

  return hasAbbr ? `${offset} (${abbr})` : offset
}

/** `Local (UTC -05:00 (EST))` for the local zone, otherwise `City (UTC ±hh:mm (ABBR))`. */
export const formatTimezoneLabel = (timezone: string): string => {
  const resolved = timezone || localTimezone()
  const prefix = resolved === localTimezone() ? 'Local' : cityName(resolved)

  return `${prefix} (${offsetAndAbbr(resolved)})`
}

/** A curated timezone list (local first), derived from `Intl` when available. */
export const defaultTimezones = (): string[] => {
  const local = localTimezone()
  const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] })
    .supportedValuesOf

  const base = typeof supported === 'function' ? supported('timeZone') : []
  const curated = [
    local,
    'UTC',
    'America/New_York',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ]

  const list = base.length > 0 ? [local, ...base] : curated

  return [...new Set(list)]
}
