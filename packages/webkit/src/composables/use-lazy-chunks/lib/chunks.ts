import type { LazyChunk } from '../use-lazy-chunks'

export interface ChunkHeight {
  count: number
  height: number
}

export interface ChunkLayout {
  threshold: number
  chunkSize: number
  rowHeight: number
}

export function splitChunks<T>(
  items: readonly T[],
  layout: ChunkLayout,
  isMounted: (index: number) => boolean,
  heights: ReadonlyMap<number, ChunkHeight>
): LazyChunk<T>[] {
  if (items.length <= layout.threshold) {
    return [{ index: 0, start: 0, items, mounted: true, estimatedHeight: 0 }]
  }
  const out: LazyChunk<T>[] = []
  for (let start = 0, index = 0; start < items.length; start += layout.chunkSize, index += 1) {
    const slice = items.slice(start, start + layout.chunkSize)
    const measured = heights.get(index)
    out.push({
      index,
      start,
      items: slice,
      mounted: isMounted(index),
      estimatedHeight:
        measured && measured.count === slice.length
          ? measured.height
          : slice.length * layout.rowHeight
    })
  }
  return out
}

export function chunkIndex(target: Element): number {
  return Number((target as HTMLElement).dataset['chunk'])
}

export function releaseHidden(
  entries: IntersectionObserverEntry[],
  mounted: Set<number>,
  isLiveChunk: (index: number, target: Element) => boolean,
  heights: Map<number, ChunkHeight>
): boolean {
  let changed = false
  for (const entry of entries) {
    const index = chunkIndex(entry.target)
    const height = entry.boundingClientRect.height
    if (index === 0 || height <= 0 || !mounted.has(index)) continue
    if (!isLiveChunk(index, entry.target)) continue
    heights.set(index, {
      count: Number((entry.target as HTMLElement).dataset['chunkCount']) || 0,
      height
    })
    mounted.delete(index)
    changed = true
  }
  return changed
}

const SCROLLS = /(auto|scroll|overlay)/

export function scrollParent(el: Element | null | undefined): HTMLElement | null {
  for (let node = el?.parentElement ?? null; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (SCROLLS.test(overflowY) && node.scrollHeight > node.clientHeight) return node
  }
  return null
}

export function chunkObserver(
  first: Element,
  rootMargin: string | undefined,
  onEntries: globalThis.IntersectionObserverCallback
): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  return new IntersectionObserver(onEntries, {
    root: scrollParent(first),
    rootMargin: rootMargin ?? '600px 0px'
  })
}
