import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

const MAX_FADE = 64

const MAX_FADE_RATIO = 1 / 6

export interface ScrollFadeEdges {
  top: number
  bottom: number
  left: number
  right: number
  cover: number
  size: number
}

export interface UseScrollFadeOptions {
  target: MaybeRefOrGetter<globalThis.HTMLElement | null>
  enabled: MaybeRefOrGetter<boolean>
  vertical: MaybeRefOrGetter<boolean>
  horizontal: MaybeRefOrGetter<boolean>
}

export interface UseScrollFadeReturn {
  edges: Readonly<Ref<ScrollFadeEdges>>
  fading: ComputedRef<boolean>
  fadeStyle: ComputedRef<Record<string, string> | undefined>
  measure: () => void
}

const EMPTY: ScrollFadeEdges = { top: 0, bottom: 0, left: 0, right: 0, cover: 0, size: 0 }

const stickyCover = (el: globalThis.HTMLElement, box: globalThis.DOMRect): number => {
  let node = globalThis.document?.elementFromPoint(
    Math.round(box.left + box.width / 2),
    Math.round(box.top + 1)
  ) as globalThis.HTMLElement | null
  while (node && node !== el && el.contains(node)) {
    if (globalThis.getComputedStyle(node).position === 'sticky') {
      return Math.max(0, Math.round(node.getBoundingClientRect().bottom - box.top))
    }
    node = node.parentElement
  }
  return 0
}

const fadeEdges = (
  el: globalThis.HTMLElement,
  vertical: boolean,
  horizontal: boolean
): ScrollFadeEdges => {
  const box = el.getBoundingClientRect()
  const cover = vertical && el.scrollTop > 0 ? stickyCover(el, box) : 0
  const span = Math.min(
    vertical ? el.clientHeight - cover : Number.POSITIVE_INFINITY,
    horizontal ? el.clientWidth : Number.POSITIVE_INFINITY
  )
  const size = Math.max(0, Math.min(MAX_FADE, Math.round(span * MAX_FADE_RATIO)))
  const clamp = (distance: number) => Math.max(0, Math.min(size, Math.round(distance)))
  return {
    top: vertical ? clamp(el.scrollTop) : 0,
    bottom: vertical ? clamp(el.scrollHeight - el.clientHeight - el.scrollTop) : 0,
    left: horizontal ? clamp(el.scrollLeft) : 0,
    right: horizontal ? clamp(el.scrollWidth - el.clientWidth - el.scrollLeft) : 0,
    cover,
    size
  }
}

const fadeStyleOf = ({ top, bottom, left, right, cover, size }: ScrollFadeEdges) => ({
  '--scroll-area-fade-top': `${top}px`,
  '--scroll-area-fade-bottom': `${bottom}px`,
  '--scroll-area-fade-left': `${left}px`,
  '--scroll-area-fade-right': `${right}px`,
  '--scroll-area-fade-cover': `${cover}px`,
  '--scroll-area-fade-size': `${size}px`
})

const watchBox = (el: globalThis.HTMLElement, measure: () => void): (() => void) => {
  let children: globalThis.Element[] = []
  const sizeObserver = new globalThis.ResizeObserver(measure)
  const syncChildren = () => {
    for (const child of children) sizeObserver.unobserve(child)
    children = Array.from(el.children)
    for (const child of children) sizeObserver.observe(child)
  }
  el.addEventListener('scroll', measure, { passive: true })
  sizeObserver.observe(el)
  const childObserver = new globalThis.MutationObserver(() => {
    syncChildren()
    measure()
  })
  childObserver.observe(el, { childList: true })
  syncChildren()
  return () => {
    el.removeEventListener('scroll', measure)
    sizeObserver.disconnect()
    childObserver.disconnect()
  }
}

export function useScrollFade(options: UseScrollFadeOptions): UseScrollFadeReturn {
  const edges = ref<ScrollFadeEdges>({ ...EMPTY })

  let observedEl: globalThis.HTMLElement | null = null
  let stop: (() => void) | null = null

  const measure = () => {
    const el = toValue(options.target)
    edges.value =
      el && toValue(options.enabled)
        ? fadeEdges(el, toValue(options.vertical), toValue(options.horizontal))
        : { ...EMPTY }
  }

  const unobserve = () => {
    stop?.()
    stop = null
    observedEl = null
  }

  const observe = () => {
    const el = toValue(options.enabled) ? toValue(options.target) : null
    if (el !== observedEl) {
      unobserve()
      if (el) {
        observedEl = el
        stop = watchBox(el, measure)
      }
    }
    measure()
  }

  watch(
    () => [
      toValue(options.target),
      toValue(options.enabled),
      toValue(options.vertical),
      toValue(options.horizontal)
    ],
    observe,
    { flush: 'post', immediate: true }
  )

  onScopeDispose(unobserve)

  const fading = computed(() => {
    const { top, bottom, left, right } = edges.value
    return top + bottom + left + right > 0
  })

  const fadeStyle = computed(() => (fading.value ? fadeStyleOf(edges.value) : undefined))

  return { edges: readonly(edges), fading, fadeStyle, measure }
}
