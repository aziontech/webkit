const UNIT_STEP = 1024

const UNITS = ['KB', 'MB', 'GB'] as const

export function formatFileSize(bytes: number): string {
  if (bytes < UNIT_STEP) return `${bytes} B`
  let value = bytes / UNIT_STEP
  let unit = 0
  while (value >= UNIT_STEP && unit < UNITS.length - 1) {
    value /= UNIT_STEP
    unit += 1
  }
  return `${value.toFixed(1)} ${UNITS[unit]}`
}
