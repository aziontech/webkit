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

/** Which inline edges of a sideways scroller still hide content. */
export interface UseScrollEdgesReturn {
  /** Content is scrolled past the inline start edge. */
  start: Readonly<Ref<boolean>>
  /** Content runs past the inline end edge. */
  end: Readonly<Ref<boolean>>
  /** Measure again; bind it to the scroller's scroll event. */
  measure: () => void
}

export function useScrollEdges(
  scroller: MaybeRefOrGetter<HTMLElement | null | undefined>
): UseScrollEdgesReturn {
  const start = ref<boolean>(false)
  const end = ref<boolean>(false)
  let observer: ResizeObserver | null = null

  const measure = (): void => {
    const el = toValue(scroller)
    if (!el) return
    const offset = Math.abs(el.scrollLeft)
    start.value = offset > 1
    end.value = el.scrollWidth - el.clientWidth - offset > 1
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
