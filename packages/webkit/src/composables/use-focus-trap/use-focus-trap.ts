import { defaultDocument, useEventListener } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'
import { nextTick, toValue, watch } from 'vue'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(
  containerRef: MaybeRefOrGetter<HTMLElement | null | undefined>,
  active: MaybeRefOrGetter<boolean>
): void {
  useEventListener(defaultDocument, 'keydown', (event: KeyboardEvent) => {
    if (!toValue(active) || event.key !== 'Tab') return

    const root = toValue(containerRef)
    if (!root) return

    const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
    )

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) {
      event.preventDefault()
      return
    }

    const activeEl = document.activeElement

    if (event.shiftKey) {
      if (activeEl === first || !root.contains(activeEl)) {
        event.preventDefault()
        last.focus()
      }
      return
    }

    if (activeEl === last) {
      event.preventDefault()
      first.focus()
    }
  })

  watch(
    () => toValue(active),
    (isActive) => {
      if (!isActive) return
      void nextTick(() => {
        const root = toValue(containerRef)
        if (!root) return
        const first = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        if (first) {
          first.focus()
        } else {
          root.focus()
        }
      })
    },
    { immediate: true }
  )
}
