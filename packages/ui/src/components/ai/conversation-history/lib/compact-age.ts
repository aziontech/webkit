type AgeUnit = 'minute' | 'hour' | 'day' | 'week' | 'year'

const STEPS: [AgeUnit, number][] = [
  ['minute', 60],
  ['hour', 24],
  ['day', 7],
  ['week', 52.1775],
  ['year', Number.POSITIVE_INFINITY]
]

const formats = new Map<string, Intl.NumberFormat>()

const formatOf = (locale: string, unit: AgeUnit): Intl.NumberFormat => {
  const key = `${locale}|${unit}`
  let format = formats.get(key)
  if (!format) {
    format = new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'narrow' })
    formats.set(key, format)
  }
  return format
}

export function compactAge(time: number, now: number, locale: string): string | null {
  let amount = Math.max(0, now - time) / 60_000
  if (amount < 1) return null
  for (const [unit, size] of STEPS) {
    if (amount < size) return formatOf(locale, unit).format(Math.floor(amount))
    amount /= size
  }
  return null
}
