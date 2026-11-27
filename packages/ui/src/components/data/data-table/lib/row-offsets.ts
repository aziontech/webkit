export const indexAt = (offsets: Float64Array, y: number): number => {
  let lo = 0
  let hi = offsets.length - 2
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (offsets[mid] <= y) lo = mid
    else hi = mid - 1
  }
  return Math.max(0, lo)
}

export type RowResize = { changed: boolean; shift: number; firstSum: number; firstCount: number }

export const measureRows = (
  entries: ResizeObserverEntry[],
  ids: WeakMap<Element, string>,
  heights: Map<string, number>,
  indexOf: (id: string) => number | undefined,
  anchor: number,
  estimate: number
): RowResize => {
  const result: RowResize = { changed: false, shift: 0, firstSum: 0, firstCount: 0 }
  for (const entry of entries) {
    const target = entry.target as HTMLElement
    const id = ids.get(target)
    const height = target.offsetHeight
    if (id === undefined || height <= 0) continue
    const previous = heights.get(id)
    if (previous !== undefined && Math.abs(previous - height) < 0.5) continue
    const index = indexOf(id)
    if (index !== undefined && index < anchor) result.shift += height - (previous ?? estimate)
    heights.set(id, height)
    result.firstSum += height
    result.firstCount += 1
    result.changed = true
  }
  return result
}
