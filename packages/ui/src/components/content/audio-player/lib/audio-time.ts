type FormatNumber = (value: number, options?: Intl.NumberFormatOptions) => string

type FormatList = (items: string[], options?: Intl.ListFormatOptions) => string

export function clock(formatNumber: FormatNumber, seconds: number | undefined): string {
  if (seconds === undefined || !Number.isFinite(seconds)) return '--:--'
  const total = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const padded = (value: number) =>
    formatNumber(value, { minimumIntegerDigits: 2, useGrouping: false })
  if (hours > 0) {
    return `${formatNumber(hours, { useGrouping: false })}:${padded(minutes)}:${padded(secs)}`
  }
  return `${formatNumber(minutes, { useGrouping: false })}:${padded(secs)}`
}

export function spoken(
  formatNumber: FormatNumber,
  formatList: FormatList,
  seconds: number
): string {
  const total = Math.max(0, Math.floor(seconds))
  const units: Array<[number, string]> = [
    [Math.floor(total / 3600), 'hour'],
    [Math.floor((total % 3600) / 60), 'minute'],
    [total % 60, 'second']
  ]
  const parts = units
    .filter(([value]) => value > 0)
    .map(([value, unit]) => formatNumber(value, { style: 'unit', unit, unitDisplay: 'long' }))
  if (!parts.length) {
    return formatNumber(0, { style: 'unit', unit: 'second', unitDisplay: 'long' })
  }
  return formatList(parts, { type: 'unit', style: 'long' })
}
