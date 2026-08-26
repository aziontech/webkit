/**
 * The element a node actually scrolls in.
 *
 * A documentation page does not scroll the window: the shell is locked to the
 * viewport and one column inside it scrolls. WHICH element that is belongs to the
 * shell, not to the page — it may be a `<main>` with `overflow-y: auto`, or a
 * `ScrollArea` the shell wrapped it in — so nothing that needs the scroll container
 * should name the element. It asks for the nearest ancestor that can scroll.
 *
 * That is the same question the scroll-spy asks to place the reading line and the
 * heading nav asks to issue the scroll, so both resolve it HERE — a rail click and
 * a heading's own anchor land identically because they scroll the same element, and
 * neither breaks when the shell changes what that element is.
 *
 * @param {HTMLElement | null} from - where to start looking, inclusive.
 * @returns {HTMLElement | null} the scrolling ancestor, or the document when nothing
 *   between here and the root scrolls.
 */
export function scrollParent(from) {
  const body = globalThis.document?.body ?? null

  for (let node = from; node && node !== body; node = node.parentElement) {
    const overflow = globalThis.getComputedStyle(node).overflowY
    if (overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay') return node
  }

  return globalThis.document?.scrollingElement ?? null
}
