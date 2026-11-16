import { intlLocale } from '../../../composables/use-translate'
import type { ChartLabel } from './types'

const DEFAULT_LOCALE = 'en-US'
const formatters = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>()

function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const id = `n|${locale}|${JSON.stringify(options)}`
  let format = formatters.get(id) as Intl.NumberFormat | undefined
  if (!format) {
    format = new Intl.NumberFormat(intlLocale(locale), options)
    formatters.set(id, format)
  }
  return format
}

function dateFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const id = `d|${locale}|${JSON.stringify(options)}`
  let format = formatters.get(id) as Intl.DateTimeFormat | undefined
  if (!format) {
    format = new Intl.DateTimeFormat(intlLocale(locale), options)
    formatters.set(id, format)
  }
  return format
}

export function formatCompact(value: number, locale = DEFAULT_LOCALE): string {
  if (!Number.isFinite(value)) return ''
  return Math.abs(value) < 1000
    ? numberFormat(locale, { maximumFractionDigits: 2 }).format(value)
    : numberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatSignedPercent(value: number, digits = 2, locale = DEFAULT_LOCALE): string {
  if (!Number.isFinite(value)) return ''
  const fixed = Number(Math.abs(value).toFixed(digits))
  const format = numberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    signDisplay: fixed === 0 ? 'never' : 'always'
  })
  return format.format((fixed === 0 ? 0 : value) / 100)
}

/** Extent and finest spacing of a chart's Date labels, in milliseconds since the epoch. */
export interface ChartDateSpan {
  /** Earliest Date label. */
  from: number
  /** Latest Date label. */
  to: number
  /** Smallest gap between two consecutive distinct Date labels; 0 when there is one label. */
  step: number
}

const DAY = 86_400_000

export function dateSpan(labels: readonly ChartLabel[]): ChartDateSpan | undefined {
  const times = labels
    .flatMap((label) =>
      label instanceof Date && label.getTime() === label.getTime() ? [+label] : []
    )
    .sort((a, b) => a - b)
  if (!times.length) return undefined
  const step = times.reduce(
    (min, time, index) =>
      index && time > times[index - 1] ? Math.min(min, time - times[index - 1]) : min,
    Infinity
  )
  return { from: times[0], to: times[times.length - 1], step: step === Infinity ? 0 : step }
}

function formatDate(label: Date, locale: string, timeZone?: string, span?: ChartDateSpan): string {
  const clock: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone
  }
  const midnight = dateFormat('en-GB', clock).format(label) === '00:00'
  const day: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone }
  if (!span || span.to - span.from <= DAY)
    return dateFormat(locale, midnight ? day : clock).format(label)
  const years = dateFormat('en-GB', { year: 'numeric', timeZone })
  const year = years.format(span.from) === years.format(span.to) ? undefined : 'numeric'
  const options: Intl.DateTimeFormatOptions =
    span.step >= 28 * DAY
      ? { month: 'short', year, timeZone }
      : span.step >= DAY || midnight
        ? { ...day, year }
        : { ...day, ...clock }
  return dateFormat(locale, options).format(label)
}

export function formatLabel(
  label: ChartLabel,
  locale = DEFAULT_LOCALE,
  timeZone?: string,
  span?: ChartDateSpan
): string {
  if (label instanceof Date) return formatDate(label, locale, timeZone, span)
  if (typeof label === 'number') return formatCompact(label, locale)
  return label
}

export function formatShare(value: number, total: number, locale = DEFAULT_LOCALE): string {
  const share = total ? (value / total) * 100 : 0
  const digits = share >= 10 || share === 0 ? 0 : 1
  return numberFormat(locale, { style: 'percent', maximumFractionDigits: digits }).format(
    share / 100
  )
}
