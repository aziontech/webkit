import type { CalendarMode, CalendarRange, CalendarValue } from './injection-key'

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const endOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59)

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

export const asRange = (value: CalendarValue): CalendarRange => {
  if (value && !(value instanceof Date)) {
    return value
  }

  return { start: null, end: null }
}

export const asSingle = (value: CalendarValue): Date | null =>
  value instanceof Date ? value : null

export const withTime = (date: Date, source: Date | null, isEnd: boolean): Date => {
  const hours = source ? source.getHours() : isEnd ? 23 : 0
  const minutes = source ? source.getMinutes() : isEnd ? 59 : 0

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
}

const tzOption = (timezone: string): string | undefined => timezone || undefined

export const formatDate = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: tzOption(timezone)
  }).format(date)

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

const monthYear = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: tzOption(timezone)
  }).format(date)

const labelClock = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: tzOption(timezone)
  })
    .format(date)
    .replace(/^0(?=\d)/, '')

const isDefaultStartTime = (date: Date): boolean => date.getHours() === 0 && date.getMinutes() === 0

const isDefaultEndTime = (date: Date): boolean => date.getHours() === 23 && date.getMinutes() === 59

const isWholeMonth = (start: Date, end: Date): boolean =>
  start.getFullYear() === end.getFullYear() &&
  start.getMonth() === end.getMonth() &&
  start.getDate() === 1 &&
  end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate() &&
  isDefaultStartTime(start) &&
  isDefaultEndTime(end)

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

const formatClock = (date: Date, timezone = ''): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tzOption(timezone)
  }).format(date)

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

export const localTimezone = (): string => {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

const cityName = (timezone: string): string =>
  timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone

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

export const formatTimezoneLabel = (timezone: string): string => {
  const resolved = timezone || localTimezone()
  const prefix = resolved === localTimezone() ? 'Local' : cityName(resolved)

  return `${prefix} (${offsetAndAbbr(resolved)})`
}

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
