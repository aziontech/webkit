import { computed, onScopeDispose, ref, watch } from 'vue'

const MAX_FADE = 64

const MAX_FADE_RATIO = 1 / 6

export function useScrollFade(options = {}) {
  const { max = MAX_FADE } = options

  const scroller = ref(null)
  const fadeTop = ref(0)
  const fadeBottom = ref(0)
  const stickyTop = ref(0)

  let observedEl = null
  let observedChildren = []
  let sizeObserver = null
  let childObserver = null

  const viewportEl = () => scroller.value?.$el ?? scroller.value ?? null

  const stickyCover = (el, box) => {
    let node = globalThis.document?.elementFromPoint(
      Math.round(box.left + box.width / 2),
      Math.round(box.top + 1)
    )
    while (node && node !== el && el.contains(node)) {
      if (getComputedStyle(node).position === 'sticky') {
        return Math.max(0, Math.round(node.getBoundingClientRect().bottom - box.top))
      }
      node = node.parentElement
    }
    return 0
  }

  const measure = () => {
    const el = viewportEl()
    if (!el) {
      fadeTop.value = 0
      fadeBottom.value = 0
      stickyTop.value = 0
      return
    }
    const box = el.getBoundingClientRect()
    const cover = el.scrollTop > 0 ? stickyCover(el, box) : 0
    const ceiling = Math.min(max, Math.round((el.clientHeight - cover) * MAX_FADE_RATIO))
    const clamp = (distance) => Math.max(0, Math.min(ceiling, Math.round(distance)))
    stickyTop.value = cover
    fadeTop.value = clamp(el.scrollTop)
    fadeBottom.value = clamp(el.scrollHeight - el.clientHeight - el.scrollTop)
  }

  const fadeStyle = computed(() => {
    const style = { scrollPaddingBlock: `${max}px` }
    if (!fadeTop.value && !fadeBottom.value) return style
    const cover = stickyTop.value
    const rampStart = cover + fadeTop.value
    const mask =
      `linear-gradient(to bottom, #000 0, #000 ${cover}px, transparent ${cover}px,` +
      ` #000 ${rampStart}px, #000 calc(100% - ${fadeBottom.value}px), transparent 100%)`
    return { ...style, maskImage: mask, WebkitMaskImage: mask }
  })

  const syncChildren = () => {
    for (const child of observedChildren) sizeObserver?.unobserve(child)
    observedChildren = observedEl ? Array.from(observedEl.children) : []
    for (const child of observedChildren) sizeObserver?.observe(child)
  }

  const unobserve = () => {
    if (observedEl) observedEl.removeEventListener('scroll', measure)
    sizeObserver?.disconnect()
    childObserver?.disconnect()
    observedEl = null
    observedChildren = []
    sizeObserver = null
    childObserver = null
  }

  const observe = () => {
    const el = viewportEl()
    if (el === observedEl) {
      measure()
      return
    }
    unobserve()
    if (!el) {
      measure()
      return
    }
    observedEl = el
    el.addEventListener('scroll', measure, { passive: true })
    sizeObserver = new ResizeObserver(measure)
    sizeObserver.observe(el)
    childObserver = new MutationObserver(() => {
      syncChildren()
      measure()
    })
    childObserver.observe(el, { childList: true })
    syncChildren()
    measure()
  }

  watch(scroller, observe, { flush: 'post', immediate: true })

  onScopeDispose(unobserve)

  return { scroller, fadeStyle, measure }
}
