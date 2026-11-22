import type { Ref } from 'vue'

/** Which item a focus move lands on. */
export type MenuFocusTarget = 'first' | 'last' | 'next' | 'prev'

const ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'

function menuItems(container: globalThis.HTMLElement | null): globalThis.HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<globalThis.HTMLElement>(ITEM_SELECTOR)).filter(
    (el) => el.getAttribute('aria-disabled') !== 'true'
  )
}

export function focusMenuItem(
  container: globalThis.HTMLElement | null,
  target: MenuFocusTarget
): void {
  const items = menuItems(container)
  if (items.length === 0) return
  const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
  const index = active ? items.indexOf(active) : -1
  let next: globalThis.HTMLElement
  if (target === 'first') next = items[0]
  else if (target === 'last') next = items[items.length - 1]
  else if (target === 'next') next = items[(index + 1) % items.length]
  else next = items[(index <= 0 ? items.length : index) - 1]
  next.focus({ preventScroll: true })
}

export function createTypeahead(
  panelEl: Ref<globalThis.HTMLElement | null>
): (event: globalThis.KeyboardEvent) => void {
  let typeaheadBuffer = ''
  let typeaheadAt = 0
  return (event) => {
    const items = menuItems(panelEl.value)
    if (items.length === 0) return
    typeaheadBuffer =
      event.timeStamp - typeaheadAt > 500 ? event.key : `${typeaheadBuffer}${event.key}`
    typeaheadAt = event.timeStamp
    const typed = typeaheadBuffer.toLocaleLowerCase()
    const query = Array.from(typed).every((char) => char === typed[0]) ? typed[0] : typed
    const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
    const start = active ? items.indexOf(active) : -1
    const ordered =
      query.length === 1
        ? [...items.slice(start + 1), ...items.slice(0, start + 1)]
        : [...items.slice(Math.max(start, 0)), ...items.slice(0, Math.max(start, 0))]
    const match = ordered.find((item) =>
      (item.textContent ?? '').trim().toLocaleLowerCase().startsWith(query)
    )
    if (match) {
      event.preventDefault()
      match.focus({ preventScroll: true })
    }
  }
}
