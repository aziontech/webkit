import { defaultDocument, useEventListener } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'
import { nextTick, toValue, watch } from 'vue'

import { tabbableIn } from '../../utils/tabbable'

const AUTOFOCUS_SELECTOR = '[data-autofocus]:not([disabled])'

const NOT_FIELD_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image', 'file', 'hidden'])

/** Options of `useFocusTrap`. */
export interface UseFocusTrapOptions {
  /**
   * What takes focus when the trap turns on, after an element marked `data-autofocus`: the first
   * tabbable element, or the first form field (falling back to the first tabbable element when
   * there is none).
   */
  initialFocus?: 'first' | 'field'
}

const isField = (el: HTMLElement): boolean => {
  const tag = el.tagName.toLowerCase()
  if (tag === 'textarea' || tag === 'select') return true
  if (tag === 'input') return !NOT_FIELD_INPUT_TYPES.has((el as HTMLInputElement).type)
  if (el.isContentEditable) return true
  const role = el.getAttribute('role')
  return role === 'combobox' || role === 'textbox' || role === 'spinbutton'
}

function wrapTab(event: KeyboardEvent, root: HTMLElement): void {
  const focusable = tabbableIn(root)
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) {
    event.preventDefault()
    return
  }
  const activeEl = document.activeElement
  const [edge, wrapTo] = event.shiftKey ? [first, last] : [last, first]
  if (activeEl === edge || !root.contains(activeEl)) {
    event.preventDefault()
    wrapTo.focus()
  }
}

export function useFocusTrap(
  containerEl: MaybeRefOrGetter<HTMLElement | null | undefined>,
  active: MaybeRefOrGetter<boolean>,
  isTop: MaybeRefOrGetter<boolean> = true,
  options: UseFocusTrapOptions = {}
): void {
  useEventListener(
    () => (toValue(active) ? defaultDocument : undefined),
    'keydown',
    (event: KeyboardEvent) => {
      if (!toValue(active) || event.key !== 'Tab' || event.defaultPrevented || !toValue(isTop)) {
        return
      }

      const root = toValue(containerEl)
      if (root) wrapTab(event, root)
    }
  )

  watch(
    () => toValue(active),
    (isActive) => {
      if (!isActive) return
      void nextTick(() => {
        const root = toValue(containerEl)
        if (!root) return
        const tabbable = tabbableIn(root)
        const field = options.initialFocus === 'field' ? tabbable.find(isField) : undefined
        const first = root.querySelector<HTMLElement>(AUTOFOCUS_SELECTOR) ?? field ?? tabbable[0]
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
