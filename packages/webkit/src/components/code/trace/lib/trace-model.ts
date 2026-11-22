import type {
  TraceLane,
  TracePlaced,
  TraceRange,
  TraceRow,
  TraceSpan,
  TraceSpanStatus
} from '../types'

export type TraceChildren = Map<string | null, TraceSpan[]>

export const clamp = (value: number, low: number, high: number): number =>
  Math.min(high, Math.max(low, value))

export const endOf = (span: TraceSpan): number => span.start + span.duration

export function childrenOf(spans: TraceSpan[], known: Set<string>): TraceChildren {
  const map: TraceChildren = new Map()
  spans.forEach((span) => {
    const key = span.parentId && known.has(span.parentId) ? span.parentId : null
    const list = map.get(key) ?? []
    list.push(span)
    map.set(key, list)
  })
  map.forEach((list) => list.sort((a, b) => a.start - b.start))
  return map
}

export function fitWindow(a: number, b: number, total: number, minSpan: number): TraceRange {
  let low = clamp(Math.min(a, b), 0, total)
  let high = clamp(Math.max(a, b), 0, total)
  if (high - low < minSpan) {
    high = Math.min(total, low + minSpan)
    low = Math.max(0, high - minSpan)
  }
  return [low, high]
}

export function slowestOf(spans: TraceSpan[], known: Set<string>): string {
  if (spans.length < 2) return ''
  const nested = spans.filter((span) => span.parentId && known.has(span.parentId))
  const pool = nested.length ? nested : spans
  return pool.reduce((best, span) => (span.duration > best.duration ? span : best)).id
}

export function criticalPathOf(children: TraceChildren): Map<string, TraceRange[]> {
  const path = new Map<string, TraceRange[]>()
  const latestFirst = (list: TraceSpan[]): TraceSpan[] =>
    [...list].sort((a, b) => endOf(b) - endOf(a))
  const follow = (span: TraceSpan, end: number): void => {
    const own: TraceRange[] = []
    let cursor = Math.min(end, endOf(span))
    latestFirst(children.get(span.id) ?? []).forEach((child) => {
      const reach = Math.min(endOf(child), endOf(span))
      if (reach > cursor || reach <= span.start || child.start >= cursor) return
      if (reach < cursor) own.push([reach, cursor])
      follow(child, reach)
      cursor = Math.max(child.start, span.start)
    })
    if (cursor > span.start) own.push([span.start, cursor])
    path.set(span.id, own.reverse())
  }
  const roots = latestFirst(children.get(null) ?? [])
  if (roots[0]) follow(roots[0], endOf(roots[0]))
  return path
}

export function selfTimeOf(span: TraceSpan, children: TraceChildren): number | null {
  const kids = children.get(span.id) ?? []
  if (!kids.length) return null
  let reach = span.start
  let covered = 0
  kids.forEach((child) => {
    const from = Math.max(child.start, reach)
    const to = Math.min(endOf(child), endOf(span))
    if (to > from) {
      covered += to - from
      reach = to
    }
  })
  return Math.max(0, span.duration - covered)
}

export function shownIds(
  children: TraceChildren,
  matches: (span: TraceSpan) => boolean
): Set<string> {
  const keep = new Set<string>()
  const visit = (span: TraceSpan): boolean => {
    const kids = (children.get(span.id) ?? []).map(visit)
    const hit = matches(span) || kids.some(Boolean)
    if (hit) keep.add(span.id)
    return hit
  }
  ;(children.get(null) ?? []).forEach(visit)
  return keep
}

function pathOf(stretches: TraceRange[], [low, high]: TraceRange): TracePlaced['path'] {
  const length = high - low
  return stretches
    .map(([a, b], order) => {
      const lead = Math.max(a, low)
      const tail = Math.min(b, high)
      return {
        key: `${order}`,
        offset: clamp((lead - low) / length, 0, 1),
        width: tail > lead ? Math.max((tail - lead) / length, 0.004) : 0
      }
    })
    .filter((stretch) => stretch.width > 0)
}

export function placeSpan(
  span: TraceSpan,
  depth: number,
  win: TraceRange,
  critical: Map<string, TraceRange[]>
): TracePlaced {
  const [low, high] = win
  const length = high - low
  const from = Math.max(span.start, low)
  const to = Math.min(endOf(span), high)
  const outside = to < from || span.start > high || endOf(span) < low
  const offset = outside ? 0 : clamp((from - low) / length, 0, 1)
  const width = outside ? 0 : Math.max((to - from) / length, 0.006)
  const status: TraceSpanStatus = span.status ?? 'success'
  const stretches = critical.get(span.id)
  return {
    span,
    status,
    root: depth === 0 && status === 'success',
    offset,
    width,
    wide: width >= 0.14,
    flip: width < 0.14 && offset + width > 0.8,
    outside,
    marks: (span.events ?? [])
      .map((event, order) => ({ key: `${order}`, at: (event.at - low) / length }))
      .filter((mark) => mark.at >= 0 && mark.at <= 1),
    critical: Boolean(stretches),
    path: pathOf(stretches ?? [], win)
  }
}

export function buildRows(
  children: TraceChildren,
  shown: Set<string> | null,
  collapsed: Set<string>,
  place: (span: TraceSpan, depth: number) => TracePlaced
): TraceRow[] {
  const out: TraceRow[] = []
  const walk = (parentId: string | null, depth: number): void => {
    const siblings = (children.get(parentId) ?? []).filter((span) => !shown || shown.has(span.id))
    siblings.forEach((span, index) => {
      const hasChildren = (children.get(span.id) ?? []).length > 0
      const expanded = hasChildren && (Boolean(shown) || !collapsed.has(span.id))
      out.push({
        ...place(span, depth),
        depth,
        parentId,
        hasChildren,
        expanded,
        posinset: index + 1,
        setsize: siblings.length
      })
      if (expanded) walk(span.id, depth + 1)
    })
  }
  walk(null, 0)
  return out
}

function pack(level: TraceSpan[]): TraceSpan[][] {
  const ends: number[] = []
  const packed: TraceSpan[][] = []
  ;[...level]
    .sort((a, b) => a.start - b.start)
    .forEach((span) => {
      let lane = ends.findIndex((end) => end <= span.start)
      if (lane < 0) {
        lane = ends.length
        packed.push([])
      }
      ends[lane] = endOf(span)
      packed[lane]?.push(span)
    })
  return packed
}

export function buildLanes(
  children: TraceChildren,
  place: (span: TraceSpan, depth: number) => TracePlaced
): TraceLane[] {
  const levels: TraceSpan[][] = []
  const visit = (parentId: string | null, depth: number): void => {
    ;(children.get(parentId) ?? []).forEach((span) => {
      ;(levels[depth] ??= []).push(span)
      visit(span.id, depth + 1)
    })
  }
  visit(null, 0)
  const out: TraceLane[] = []
  levels.forEach((level, depth) =>
    pack(level).forEach((spans, lane) =>
      out.push({
        key: `${depth}-${lane}`,
        depth,
        items: spans.map((span) => place(span, depth))
      })
    )
  )
  return out
}

export function timelineOrderOf(lanes: TraceLane[]): string[] {
  return lanes
    .flatMap((lane, index) =>
      lane.items.filter((item) => !item.outside).map((item) => ({ item, index }))
    )
    .sort((a, b) => a.item.span.start - b.item.span.start || a.index - b.index)
    .map(({ item }) => item.span.id)
}

export function minimapLinesOf(spans: TraceSpan[], known: Set<string>, total: number) {
  const ordered = [...spans].sort((a, b) => a.start - b.start)
  const count = Math.max(1, ordered.length)
  return ordered.map((span, index) => {
    const status: TraceSpanStatus = span.status ?? 'success'
    const root = !(span.parentId && known.has(span.parentId)) && status === 'success'
    return {
      id: span.id,
      status,
      root,
      style: {
        '--trace-line-offset': String(span.start / total),
        '--trace-line-width': String(span.duration / total),
        '--trace-line-top': String((index + 0.2) / count),
        '--trace-line-height': String(0.6 / count)
      }
    }
  })
}
