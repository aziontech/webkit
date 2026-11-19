const FOCUSABLE_SELECTOR =
  'a[href], button, textarea, input, select, summary, [contenteditable="true"], [tabindex]'

export function isTabbable(el: globalThis.HTMLElement): boolean {
  if (el.tabIndex < 0) return false
  if ((el as globalThis.HTMLButtonElement).disabled) return false
  if (el.closest('[inert], [hidden], fieldset[disabled]')) return false
  if (el instanceof globalThis.HTMLInputElement && el.type === 'hidden') return false
  return el.getClientRects().length > 0 && globalThis.getComputedStyle(el).visibility !== 'hidden'
}

export function tabbableIn(root: globalThis.ParentNode): globalThis.HTMLElement[] {
  return Array.from(root.querySelectorAll<globalThis.HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    isTabbable
  )
}

export function nextTabbableAfter(
  anchor: globalThis.HTMLElement,
  exclude: globalThis.HTMLElement | null = null
): globalThis.HTMLElement | null {
  const all = tabbableIn(anchor.ownerDocument).filter((el) => !exclude?.contains(el))
  return (
    all.find(
      (el) =>
        !anchor.contains(el) &&
        Boolean(anchor.compareDocumentPosition(el) & globalThis.Node.DOCUMENT_POSITION_FOLLOWING)
    ) ?? null
  )
}
