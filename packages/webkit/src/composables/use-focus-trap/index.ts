import { useEventListener } from '@vueuse/core'
import { nextTick, onUnmounted, type Ref, watch } from 'vue'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Trap Tab / Shift+Tab focus inside `containerRef` while `active` is true.
 */
export function useFocusTrap(
  containerRef: Ref<HTMLElement | null | undefined>,
  active: Ref<boolean>
): void {
  const stop = useEventListener(document, 'keydown', (event) => {
    if (!active.value || event.key !== 'Tab') return

    const root = containerRef.value
    if (!root) return

    const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
    )

    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const activeEl = document.activeElement as HTMLElement | null

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
    active,
    (isActive) => {
      if (!isActive) return
      void nextTick(() => {
        const root = containerRef.value
        if (!root) return
        const focusable = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusable.length > 0) {
          focusable[0].focus()
        } else {
          root.focus()
        }
      })
    },
    { immediate: true }
  )

  onUnmounted(() => {
    stop()
  })
}
