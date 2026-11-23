import type { ChartSemanticSeverity } from '../../lib'

export interface TrackerBucket {
  start: number
  end: number
  worst: number
}

const RANK: Record<string, number> = { danger: 4, warning: 3, info: 2, success: 1 }

const rankOf = (severity: ChartSemanticSeverity | undefined): number =>
  severity ? (RANK[severity] ?? 0) : 0

export const TRACKER_MIN_BLOCK = 6
export const TRACKER_GAP = 2

export function bucketCapacity(width: number): number {
  return Math.max(1, Math.floor((width + TRACKER_GAP) / (TRACKER_MIN_BLOCK + TRACKER_GAP)))
}

export function trackerBuckets(
  severities: (ChartSemanticSeverity | undefined)[],
  capacity: number
): TrackerBucket[] {
  const count = severities.length
  const size = Math.max(1, Math.ceil(count / Math.max(1, capacity)))
  const buckets: TrackerBucket[] = []
  for (let start = 0; start < count; start += size) {
    const end = Math.min(count, start + size) - 1
    let worst = end
    for (let index = end; index >= start; index -= 1) {
      if (rankOf(severities[index]) > rankOf(severities[worst])) worst = index
    }
    buckets.push({ start, end, worst })
  }
  return buckets
}

export function bucketOf(buckets: TrackerBucket[], index: number | null): number | null {
  if (index === null) return null
  const found = buckets.findIndex((bucket) => index >= bucket.start && index <= bucket.end)
  return found < 0 ? null : found
}
