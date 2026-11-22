import type { ShallowRef } from 'vue'

import type { LazyChunk } from '../use-lazy-chunks'

export interface ChunkHeight {
  count: number
  height: number
}

export function splitChunks<T>(
  items: readonly T[],
  threshold: number,
  chunkSize: number,
  rowHeight: number,
  isMounted: (index: number) => boolean,
  heights: ReadonlyMap<number, ChunkHeight>
): LazyChunk<T>[] {
  if (items.length <= threshold) {
    return [{ index: 0, start: 0, items, mounted: true, estimatedHeight: 0 }]
  }
  const out: LazyChunk<T>[] = []
  for (let start = 0, index = 0; start < items.length; start += chunkSize, index += 1) {
    const slice = items.slice(start, start + chunkSize)
    const measured = heights.get(index)
    out.push({
      index,
      start,
      items: slice,
      mounted: isMounted(index),
      estimatedHeight:
        measured && measured.count === slice.length ? measured.height : slice.length * rowHeight
    })
  }
  return out
}

export function releaseHidden(
  entries: IntersectionObserverEntry[],
  mounted: ShallowRef<ReadonlySet<number> | 'all'>,
  observed: ReadonlyMap<number, Element>,
  roles: WeakMap<Element, 'chunk' | 'placeholder'>,
  heights: Map<number, ChunkHeight>
): void {
  if (mounted.value === 'all') return
  const next = new Set(mounted.value)
  let changed = false
  for (const entry of entries) {
    const index = Number((entry.target as HTMLElement).dataset['chunk'])
    const height = entry.boundingClientRect.height
    if (index === 0 || height <= 0 || !next.has(index)) continue
    if (observed.get(index) !== entry.target || roles.get(entry.target) !== 'chunk') continue
    heights.set(index, {
      count: Number((entry.target as HTMLElement).dataset['chunkCount']) || 0,
      height
    })
    next.delete(index)
    changed = true
  }
  if (changed) mounted.value = next
}
