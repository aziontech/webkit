import { computed, type ComputedRef, onScopeDispose, type Ref, ref, watch } from 'vue'

import { scrollParent } from '../../../../composables/use-lazy-chunks'

export const LAZY_MARGIN = 600
const LAZY_THRESHOLD = 200
const LAZY_CHUNK = 50

export interface DataTableLazyRowsOptions {
  loading: () => boolean
  virtualActive: ComputedRef<boolean>
  rowTotal: ComputedRef<number>
  rowHeight: ComputedRef<number>
  viewport: () => HTMLElement | undefined
  shrinkOn: () => unknown[]
}

export interface UseDataTableLazyRowsReturn {
  lazyLimit: ComputedRef<number>
  lazyActive: ComputedRef<boolean>
  lazySentinelEl: Ref<HTMLElement | null>
}

const rowsInReach = (el: HTMLElement | undefined, rowHeight: number): number => {
  if (!el || typeof el.getBoundingClientRect !== 'function') return LAZY_CHUNK
  const scrollsItself =
    el.scrollHeight > el.clientHeight &&
    /(auto|scroll|overlay)/.test(getComputedStyle(el).overflowY)
  const root = scrollsItself ? el : scrollParent(el)
  const rootBottom = root ? root.getBoundingClientRect().bottom : globalThis.innerHeight
  const top = el.getBoundingClientRect().top - (scrollsItself ? el.scrollTop : 0)
  const reach = rootBottom + LAZY_MARGIN - top
  return Math.max(LAZY_CHUNK, Math.ceil(reach / rowHeight) + LAZY_CHUNK / 2)
}

export function useDataTableLazyRows(o: DataTableLazyRowsOptions): UseDataTableLazyRowsReturn {
  const lazyLimit = ref<number>(LAZY_CHUNK)
  const lazySentinelEl = ref<HTMLElement | null>(null)
  const lazyActive = computed<boolean>(
    () =>
      !o.virtualActive.value &&
      !o.loading() &&
      o.rowTotal.value > LAZY_THRESHOLD &&
      lazyLimit.value < o.rowTotal.value
  )
  let observer: IntersectionObserver | null = null
  const onIntersect = (entries: IntersectionObserverEntry[]): void => {
    const entry = entries[entries.length - 1]
    if (!entry?.isIntersecting) return
    const rootBottom = entry.rootBounds?.bottom ?? globalThis.innerHeight
    const reach = rootBottom + LAZY_MARGIN - entry.boundingClientRect.top
    const extra = Math.max(LAZY_CHUNK, Math.ceil(reach / o.rowHeight.value) + LAZY_CHUNK / 2)
    lazyLimit.value = Math.min(o.rowTotal.value, lazyLimit.value + extra)
  }
  const observe = (): void => {
    observer?.disconnect()
    observer = null
    const el = lazySentinelEl.value
    if (!el || !lazyActive.value || typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver(onIntersect, {
      root: scrollParent(el),
      rootMargin: `${LAZY_MARGIN}px`
    })
    observer.observe(el)
  }
  watch([lazySentinelEl, lazyLimit, lazyActive], observe, { flush: 'post' })
  watch(o.shrinkOn, () => {
    if (lazyLimit.value <= LAZY_CHUNK) return
    lazyLimit.value = Math.min(lazyLimit.value, rowsInReach(o.viewport(), o.rowHeight.value))
  })
  onScopeDispose(() => observer?.disconnect())
  return { lazyLimit: computed(() => lazyLimit.value), lazyActive, lazySentinelEl }
}
