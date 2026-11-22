/** Which item a focus move lands on. */
export type MenuFocusTarget = 'first' | 'last' | 'next' | 'prev'

const ITEM_SELECTOR = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'

export function menuItems(container: globalThis.HTMLElement | null): globalThis.HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<globalThis.HTMLElement>(ITEM_SELECTOR)).filter(
    (el) => el.getAttribute('aria-disabled') !== 'true'
  )
}

export function activeElement(): globalThis.HTMLElement | null {
  return globalThis.document?.activeElement as globalThis.HTMLElement | null
}

export function isPrintableKey(event: globalThis.KeyboardEvent): boolean {
  if (event.key.length !== 1 || event.key === ' ') return false
  return !event.ctrlKey && !event.metaKey && !event.altKey
}

function typeaheadQuery(typed: string): string {
  return Array.from(typed).every((char) => char === typed[0]) ? typed[0] : typed
}

function rotateFrom(
  items: globalThis.HTMLElement[],
  start: number,
  singleChar: boolean
): globalThis.HTMLElement[] {
  const pivot = singleChar ? start + 1 : Math.max(start, 0)
  return [...items.slice(pivot), ...items.slice(0, pivot)]
}

export function findTypeaheadMatch(
  items: globalThis.HTMLElement[],
  typed: string
): globalThis.HTMLElement | undefined {
  const query = typeaheadQuery(typed.toLocaleLowerCase())
  const active = activeElement()
  const start = active ? items.indexOf(active) : -1
  return rotateFrom(items, start, query.length === 1).find((item) =>
    (item.textContent ?? '').trim().toLocaleLowerCase().startsWith(query)
  )
}

function focusIndex(target: MenuFocusTarget, index: number, count: number): number {
  if (target === 'first') return 0
  if (target === 'last') return count - 1
  if (target === 'next') return (index + 1) % count
  return (index <= 0 ? count : index) - 1
}

export function focusMenuItem(
  container: globalThis.HTMLElement | null,
  target: MenuFocusTarget
): void {
  const items = menuItems(container)
  if (items.length === 0) return
  const active = activeElement()
  const index = active ? items.indexOf(active) : -1
  items[focusIndex(target, index, items.length)].focus({ preventScroll: true })
}
