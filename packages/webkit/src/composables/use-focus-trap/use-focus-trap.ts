import { defaultDocument, useEventListener } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'
import { nextTick, toValue, watch } from 'vue'

import { tabbableIn } from '../../utils/tabbable'

const AUTOFOCUS_SELECTOR = '[data-autofocus]:not([disabled])'

export function useFocusTrap(
  containerEl: MaybeRefOrGetter<HTMLElement | null | undefined>,
  active: MaybeRefOrGetter<boolean>,
  isTop: MaybeRefOrGetter<boolean> = true
): void {
  useEventListener(
    () => (toValue(active) ? defaultDocument : undefined),
    'keydown',
    (event: KeyboardEvent) => {
      if (!toValue(active) || event.key !== 'Tab' || event.defaultPrevented || !toValue(isTop)) {
        return
      }

      const root = toValue(containerEl)
      if (!root) return

      const focusable = tabbableIn(root)

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

      if (activeEl === last || !root.contains(activeEl)) {
        event.preventDefault()
        first.focus()
      }
    }
  )

  watch(
    () => toValue(active),
    (isActive) => {
      if (!isActive) return
      void nextTick(() => {
        const root = toValue(containerEl)
        if (!root) return
        const first = root.querySelector<HTMLElement>(AUTOFOCUS_SELECTOR) ?? tabbableIn(root)[0]
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
