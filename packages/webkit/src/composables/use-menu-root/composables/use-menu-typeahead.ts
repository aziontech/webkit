import type { Ref } from 'vue'

import { findTypeaheadMatch, menuItems } from '../lib/menu-items'

const TYPEAHEAD_RESET = 500

export interface UseMenuTypeaheadReturn {
  typeahead: (event: globalThis.KeyboardEvent) => void
}

export function useMenuTypeahead(
  panelEl: Ref<globalThis.HTMLElement | null>
): UseMenuTypeaheadReturn {
  let buffer = ''
  let typedAt = 0

  function typeahead(event: globalThis.KeyboardEvent): void {
    const items = menuItems(panelEl.value)
    if (items.length === 0) return
    buffer = event.timeStamp - typedAt > TYPEAHEAD_RESET ? event.key : `${buffer}${event.key}`
    typedAt = event.timeStamp
    const match = findTypeaheadMatch(items, buffer)
    if (!match) return
    event.preventDefault()
    match.focus({ preventScroll: true })
  }

  return { typeahead }
}
