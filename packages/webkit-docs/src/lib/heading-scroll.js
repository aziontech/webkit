/**
 * Take the reader to a heading inside a scroll container that is not the window.
 *
 * A documentation page scrolls its own column — the shell around it is fixed — so
 * neither a native hash jump nor `scrollIntoView` is quite right: the first lands
 * hard and pushes a history entry, the second scrolls whatever ancestor it finds
 * with no control over the offset. This issues the scroll on the element that
 * actually scrolls, measuring the heading's box relative to it.
 *
 * The hash is still written, because a copied URL has to land in the same place —
 * but with `replaceState`, which does not scroll and does not add an entry.
 *
 * Shared by every way into a section, so they all land identically: the "On this
 * page" rail, and the heading's own anchor (see heading-nav.js).
 *
 * @param {HTMLElement | null} container - the element that scrolls.
 * @param {HTMLElement | null} root - the rendered body to look the heading up in.
 * @param {string} id - the heading's anchor id.
 * @param {MouseEvent} [event] - the click, if there was one; default-prevented on success.
 * @returns {boolean} whether the scroll was issued.
 */
export function scrollToHeading(container, root, id, event) {
  const target = root?.querySelector(`#${globalThis.CSS.escape(id)}`)
  if (!container || !target) return false

  event?.preventDefault()
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const top =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop

  container.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  globalThis.history?.replaceState(null, '', `#${id}`)
  return true
}
