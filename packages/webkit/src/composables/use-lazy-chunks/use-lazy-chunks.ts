import { onScopeDispose, shallowRef } from 'vue'

export interface LazyChunk<T> {
  index: number
  start: number
  items: readonly T[]
  mounted: boolean
  estimatedHeight: number
}

export interface UseLazyChunksOptions {
  rowHeight: number
  chunkSize?: number
  threshold?: number
  rootMargin?: string
  release?: boolean
}

export interface UseLazyChunksReturn {
  split: <T>(items: readonly T[]) => LazyChunk<T>[]
  observe: (el: unknown, index: number) => void
  reveal: (indexes: number[]) => void
  revealAll: () => void
}

const SCROLLS = /(auto|scroll|overlay)/

export function scrollParent(el: Element | null | undefined): HTMLElement | null {
  for (let node = el?.parentElement ?? null; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (SCROLLS.test(overflowY) && node.scrollHeight > node.clientHeight) return node
  }
  return null
}

export function useLazyChunks(options: UseLazyChunksOptions): UseLazyChunksReturn {
  const chunkSize = options.chunkSize ?? 100
  const threshold = options.threshold ?? 300
  const mounted = shallowRef<ReadonlySet<number> | 'all'>(new Set([0]))
  const observed = new Map<number, Element>()
  const roles = new WeakMap<Element, 'chunk' | 'placeholder'>()
  const heights = new Map<number, { count: number; height: number }>()
  let observer: IntersectionObserver | null = null

  const isMounted = (index: number) => mounted.value === 'all' || mounted.value.has(index)

  const split = <T>(items: readonly T[]): LazyChunk<T>[] => {
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
          measured && measured.count === slice.length
            ? measured.height
            : slice.length * options.rowHeight
      })
    }
    return out
  }

  const reveal = (indexes: number[]) => {
    if (mounted.value === 'all') return
    const next = new Set(mounted.value)
    for (const index of indexes) next.add(index)
    mounted.value = next
  }

  const release = (entries: IntersectionObserverEntry[]) => {
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

  const revealAll = () => {
    mounted.value = 'all'
  }

  const connect = (first: Element) => {
    if (typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number((entry.target as HTMLElement).dataset['chunk']))
        if (hits.length) reveal(hits)
        if (options.release) release(entries.filter((entry) => !entry.isIntersecting))
      },
      { root: scrollParent(first), rootMargin: options.rootMargin ?? '600px 0px' }
    )
  }

  const observe = (el: unknown, index: number) => {
    const previous = observed.get(index)
    if (previous && previous !== el) {
      observer?.unobserve(previous)
      observed.delete(index)
      if (!observed.size) {
        observer?.disconnect()
        observer = null
      }
    }
    if (!(el instanceof Element)) return
    roles.set(el, isMounted(index) ? 'chunk' : 'placeholder')
    if (previous === el) return
    observed.set(index, el)
    if (!observer) connect(el)
    observer?.observe(el)
  }

  onScopeDispose(() => {
    observer?.disconnect()
    observer = null
    observed.clear()
    heights.clear()
  })

  return { split, observe, reveal, revealAll }
}
