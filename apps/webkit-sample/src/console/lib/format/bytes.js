const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']
const STEP = 1024

export function formatBytes(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'

  let value = bytes
  let unit = 0
  while (value >= STEP && unit < UNITS.length - 1) {
    value /= STEP
    unit += 1
  }

  if (unit === 0) return `${Math.round(value)} B`
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2
  return `${Number(value.toFixed(decimals))} ${UNITS[unit]}`
}

const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`

export function formatManifest(files = [], truncated = false) {
  const total = formatBytes(files.reduce((sum, file) => sum + (file.size ?? 0), 0))
  if (truncated) return `first ${plural(files.length, 'file')}, ${total}`
  return `${plural(files.length, 'file')}, ${total}`
}
