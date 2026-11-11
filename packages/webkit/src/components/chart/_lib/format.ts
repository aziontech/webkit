import type { ChartLabel } from './types'

const DEFAULT_LOCALE = 'en-US'
const formatters = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>()

function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const id = `n|${locale}|${JSON.stringify(options)}`
  let format = formatters.get(id) as Intl.NumberFormat | undefined
  if (!format) {
    format = new Intl.NumberFormat(locale, options)
    formatters.set(id, format)
  }
  return format
}

function dateFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const id = `d|${locale}|${JSON.stringify(options)}`
  let format = formatters.get(id) as Intl.DateTimeFormat | undefined
  if (!format) {
    format = new Intl.DateTimeFormat(locale, options)
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
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: fixed === 0 ? 'never' : 'always'
  })
  return format.format((fixed === 0 ? 0 : value) / 100)
}

export function formatLabel(label: ChartLabel, locale = DEFAULT_LOCALE, timeZone?: string): string {
  if (label instanceof Date) {
    const clock: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone
    }
    return dateFormat('en-GB', clock).format(label) === '00:00'
      ? dateFormat(locale, { month: 'short', day: 'numeric', timeZone }).format(label)
      : dateFormat(locale, clock).format(label)
  }
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
