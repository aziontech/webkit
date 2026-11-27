export function formatTime(
  seconds: number,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
): string {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  const pad = (value: number): string =>
    formatNumber(value, { minimumIntegerDigits: 2, useGrouping: false })
  if (hours > 0) {
    return `${formatNumber(hours, { useGrouping: false })}:${pad(minutes)}:${pad(rest)}`
  }
  return `${formatNumber(minutes, { useGrouping: false })}:${pad(rest)}`
}
