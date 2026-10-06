import { watch } from 'vue'

import { suppressEntranceMotion } from './interaction'

const ENTER_CLASS = 'animate-page-enter'

const prefersReducedMotion = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const scrollingAncestor = (node) => {
  for (let el = node.parentElement; el; el = el.parentElement) {
    const overflow = globalThis.getComputedStyle?.(el).overflowY
    if ((overflow === 'auto' || overflow === 'scroll') && el.scrollHeight > el.clientHeight) {
      return el
    }
  }
  return null
}

export function useTabEnter(target, key, scroller = null) {
  watch(key, () => {
    suppressEntranceMotion()

    const node = target.value
    if (!node) return

    const region = scroller?.value ?? scrollingAncestor(node)
    if (region) region.scrollTop = 0

    if (prefersReducedMotion()) return

    node.classList.remove(ENTER_CLASS)
    void node.offsetWidth
    node.classList.add(ENTER_CLASS)
  })
}
