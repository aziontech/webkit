import {
  type MaybeRefOrGetter,
  nextTick,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

/** How far content runs past each inline edge of a sideways scroller. */
export interface UseScrollEdgesReturn {
  /** Hidden px past the inline start edge, at most 24; 0 when 4 or less. */
  start: Readonly<Ref<number>>
  /** Hidden px past the inline end edge, at most 24; 0 when 4 or less. */
  end: Readonly<Ref<number>>
  /** Measure again; bind it to the scroller's scroll event. */
  measure: () => void
}

export function useScrollEdges(
  scroller: MaybeRefOrGetter<HTMLElement | null | undefined>
): UseScrollEdgesReturn {
  const start = ref<number>(0)
  const end = ref<number>(0)
  let observer: ResizeObserver | null = null

  const measure = (): void => {
    const el = toValue(scroller)
    if (!el) return
    const offset = Math.abs(el.scrollLeft)
    const hidden = (px: number): number => (px > 4 ? Math.min(24, Math.round(px)) : 0)
    start.value = hidden(offset)
    end.value = hidden(el.scrollWidth - el.clientWidth - offset)
  }

  onMounted(() => {
    void nextTick(() => {
      measure()
      const el = toValue(scroller)
      if (!el || typeof ResizeObserver === 'undefined') return
      observer = new ResizeObserver(measure)
      observer.observe(el)
      if (el.firstElementChild) observer.observe(el.firstElementChild)
    })
  })
  onScopeDispose(() => {
    observer?.disconnect()
    observer = null
  })

  return { start: readonly(start), end: readonly(end), measure }
}
