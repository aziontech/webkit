/** Discrete intensity level (0 = none, 4 = highest). */
export type ContributionGraphLevel = 0 | 1 | 2 | 3 | 4

/** One daily entry passed by the consumer. */
export interface ContributionGraphItem {
  /** ISO date string (YYYY-MM-DD). */
  date: string
  /** Number of contributions recorded on this date. */
  count: number
  /** Optional explicit intensity level (0-4); derived from count when omitted. */
  level?: ContributionGraphLevel
  /** Optional custom accessible & readout label for this day. */
  label?: string
}

/** One resolved day cell inside the 7-row calendar grid. */
export interface ContributionGraphDay {
  /** ISO date string (YYYY-MM-DD). */
  date: string
  /** UTC Date instance for localized formatting. */
  utcDate: Date
  /** Contribution count for the day. */
  count: number
  /** Intensity level 0-4. */
  level: ContributionGraphLevel
  /** Consumer-provided label override, if any. */
  label?: string
  /** Zero-based week column index. */
  weekIndex: number
  /** Zero-based weekday row index (0 = Sun .. 6 = Sat). */
  dayOfWeek: number
  /** False for the padding days before the first and after the last day of the period. */
  inRange: boolean
}

/** Month heading positioned over the first week column where that month starts. */
export interface ContributionGraphMonth {
  /** Stable key (`YYYY-MM`). */
  key: string
  /** Zero-based week column index. */
  weekIndex: number
  /** UTC Date for the first day of that month (used with Intl.DateTimeFormat). */
  utcDate: Date
}

const DAY_MS = 86_400_000

function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const dt = new Date(Date.UTC(year, month - 1, day))
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) {
    return null
  }
  return dt
}

function toIsoDate(dt: Date): string {
  const y = dt.getUTCFullYear()
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(dt.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function deriveLevel(count: number, maxCount: number): ContributionGraphLevel {
  if (count <= 0) return 0
  if (maxCount <= 1) return 4
  const ratio = count / maxCount
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

function resolveBounds(
  items: ContributionGraphItem[],
  year?: number,
  endDate?: string
): { start: Date; end: Date } | null {
  if (typeof year === 'number' && Number.isFinite(year)) {
    return {
      start: new Date(Date.UTC(year, 0, 1)),
      end: new Date(Date.UTC(year, 11, 31))
    }
  }
  const explicitEnd = endDate ? parseIsoDate(endDate) : null
  let end = explicitEnd
  if (!end) {
    for (const item of items) {
      const parsed = parseIsoDate(item.date)
      if (parsed && (!end || parsed.getTime() > end.getTime())) {
        end = parsed
      }
    }
  }
  if (!end) return null
  const start = new Date(end.getTime() - 363 * DAY_MS)
  return { start, end }
}

function indexItems(items: ContributionGraphItem[]): {
  byDate: Map<string, ContributionGraphItem>
  maxCount: number
} {
  const byDate = new Map<string, ContributionGraphItem>()
  let maxCount = 0
  for (const item of items) {
    const existing = byDate.get(item.date)
    const count = (existing?.count ?? 0) + Math.max(0, item.count)
    byDate.set(item.date, {
      date: item.date,
      count,
      level: item.level ?? existing?.level,
      label: item.label ?? existing?.label
    })
    maxCount = Math.max(maxCount, count)
  }
  return { byDate, maxCount }
}

function startsMonth(day: ContributionGraphDay, months: ContributionGraphMonth[]): boolean {
  if (!day.inRange || (day.dayOfWeek !== 0 && day.utcDate.getUTCDate() !== 1)) return false
  const key = `${day.utcDate.getUTCFullYear()}-${day.utcDate.getUTCMonth()}`
  const last = months[months.length - 1]
  if (last?.key === key) return false
  return !last || day.weekIndex - last.weekIndex >= 3
}

export function buildCalendarGrid(
  items: ContributionGraphItem[],
  year?: number,
  endDate?: string
): { days: ContributionGraphDay[]; weeks: number; months: ContributionGraphMonth[] } {
  const bounds = resolveBounds(items, year, endDate)
  if (!bounds) return { days: [], weeks: 0, months: [] }

  const { byDate, maxCount } = indexItems(items)
  const startMs = bounds.start.getTime()
  const endMs = bounds.end.getTime()
  const gridStart = startMs - bounds.start.getUTCDay() * DAY_MS
  const gridEnd = endMs + (6 - bounds.end.getUTCDay()) * DAY_MS

  const days: ContributionGraphDay[] = []
  const months: ContributionGraphMonth[] = []

  for (let ms = gridStart, idx = 0; ms <= gridEnd; ms += DAY_MS, idx += 1) {
    const utcDate = new Date(ms)
    const inRange = ms >= startMs && ms <= endMs
    const entry = inRange ? byDate.get(toIsoDate(utcDate)) : undefined
    const count = entry?.count ?? 0
    const day: ContributionGraphDay = {
      date: toIsoDate(utcDate),
      utcDate,
      count,
      level: entry?.level ?? deriveLevel(count, maxCount),
      label: entry?.label,
      weekIndex: Math.floor(idx / 7),
      dayOfWeek: idx % 7,
      inRange
    }
    if (startsMonth(day, months)) {
      months.push({
        key: `${utcDate.getUTCFullYear()}-${utcDate.getUTCMonth()}`,
        weekIndex: day.weekIndex,
        utcDate: new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1))
      })
    }
    days.push(day)
  }

  return { days, weeks: Math.ceil(days.length / 7), months }
}
