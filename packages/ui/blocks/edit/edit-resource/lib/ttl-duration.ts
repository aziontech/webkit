const UNITS: ReadonlyArray<[unit: 'year' | 'day' | 'hour' | 'minute' | 'second', seconds: number]> =
  [
    ['year', 31_536_000],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
    ['second', 1]
  ]

export const ttlDuration = (
  seconds: number | null | undefined,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
): string => {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds <= 0)
    return ''
  const [unit, size] =
    UNITS.find(([, step]) => seconds % step === 0) ??
    UNITS.find(([, step]) => seconds >= step) ??
    UNITS[UNITS.length - 1]!
  return formatNumber(seconds / size, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
    maximumFractionDigits: 1
  })
}
