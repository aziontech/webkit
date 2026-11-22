import type { Rect, Size } from './types'

interface Edges {
  top: number
  left: number
  right: number
  bottom: number
}

const SCROLLS = /auto|scroll|overlay/

function clipBy(
  node: globalThis.HTMLElement,
  style: globalThis.CSSStyleDeclaration,
  edges: Edges
): void {
  const clipsX = SCROLLS.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1
  const clipsY = SCROLLS.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1
  if (!clipsX && !clipsY) return
  const rect = node.getBoundingClientRect()
  if (clipsX) {
    edges.left = Math.max(edges.left, rect.left + node.clientLeft)
    edges.right = Math.min(edges.right, rect.left + node.clientLeft + node.clientWidth)
  }
  if (clipsY) {
    edges.top = Math.max(edges.top, rect.top + node.clientTop)
    edges.bottom = Math.min(edges.bottom, rect.top + node.clientTop + node.clientHeight)
  }
}

export function getClippingBoundary(trigger: globalThis.Element, viewport: Size): Rect {
  const edges: Edges = { top: 0, left: 0, right: viewport.width, bottom: viewport.height }
  const body = globalThis.document?.body ?? null
  let node = typeof globalThis.getComputedStyle === 'function' ? trigger.parentElement : null
  while (node && node !== body && node !== body?.parentElement) {
    const style = globalThis.getComputedStyle(node)
    clipBy(node, style, edges)
    if (style.position === 'fixed') break
    node = node.parentElement
  }
  const { top, left, right, bottom } =
    edges.right > edges.left && edges.bottom > edges.top
      ? edges
      : { top: 0, left: 0, right: viewport.width, bottom: viewport.height }
  return { top, left, right, bottom, width: right - left, height: bottom - top }
}
