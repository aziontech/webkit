import { onScopeDispose, shallowRef } from 'vue'

import { type ChunkHeight, releaseHidden, splitChunks } from './lib/chunks'

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
  const heights = new Map<number, ChunkHeight>()
  let observer: IntersectionObserver | null = null

  const isMounted = (index: number) => mounted.value === 'all' || mounted.value.has(index)

  const split = <T>(items: readonly T[]): LazyChunk<T>[] =>
    splitChunks(items, threshold, chunkSize, options.rowHeight, isMounted, heights)

  const reveal = (indexes: number[]) => {
    if (mounted.value === 'all') return
    const next = new Set(mounted.value)
    for (const index of indexes) next.add(index)
    mounted.value = next
  }

  const release = (entries: IntersectionObserverEntry[]) =>
    releaseHidden(entries, mounted, observed, roles, heights)

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
