import type { ChartLabel } from './types'

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const plain = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const clock = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})
const day = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return ''
  return Math.abs(value) < 1000 ? plain.format(value) : compact.format(value)
}

export function formatSignedPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return ''
  const fixed = Math.abs(value).toFixed(digits)
  if (Number(fixed) === 0) return `${fixed}%`
  return `${value > 0 ? '+' : '-'}${fixed}%`
}

export function formatLabel(label: ChartLabel): string {
  if (label instanceof Date) {
    const atMidnight = label.getHours() === 0 && label.getMinutes() === 0
    return atMidnight ? day.format(label) : clock.format(label)
  }
  if (typeof label === 'number') return formatCompact(label)
  return label
}

export function formatShare(value: number, total: number): string {
  if (!total) return '0%'
  const share = (value / total) * 100
  return `${share >= 10 ? Math.round(share) : Number(share.toFixed(1))}%`
}
