const FOCUSABLE_SELECTOR = 'a[href], button, textarea, input, select, [tabindex]'

export function isTabbable(el: globalThis.HTMLElement): boolean {
  return (
    el.tabIndex >= 0 &&
    !(el as globalThis.HTMLButtonElement).disabled &&
    !el.closest('[inert], [hidden], fieldset[disabled]') &&
    el.getClientRects().length > 0 &&
    globalThis.getComputedStyle(el).visibility !== 'hidden'
  )
}

export function tabbableIn(root: globalThis.ParentNode): globalThis.HTMLElement[] {
  return Array.from(root.querySelectorAll<globalThis.HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    isTabbable
  )
}

export function nextTabbableAfter(
  anchor: globalThis.HTMLElement,
  exclude: globalThis.HTMLElement | null = null
): globalThis.HTMLElement | undefined {
  return tabbableIn(anchor.ownerDocument).find(
    (el) =>
      !exclude?.contains(el) &&
      !anchor.contains(el) &&
      Boolean(anchor.compareDocumentPosition(el) & globalThis.Node.DOCUMENT_POSITION_FOLLOWING)
  )
}
