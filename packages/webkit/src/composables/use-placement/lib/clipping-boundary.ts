import type { Rect, Size } from './types'

interface Edges {
  top: number
  left: number
  right: number
  bottom: number
}

const SCROLLS = /auto|scroll|overlay/

function clipsAxis(overflow: string, scrollSize: number, clientSize: number): boolean {
  return SCROLLS.test(overflow) && scrollSize > clientSize + 1
}

function clipBy(
  node: globalThis.HTMLElement,
  style: globalThis.CSSStyleDeclaration,
  edges: Edges
): void {
  const clipsX = clipsAxis(style.overflowX, node.scrollWidth, node.clientWidth)
  const clipsY = clipsAxis(style.overflowY, node.scrollHeight, node.clientHeight)
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

function firstAncestor(trigger: globalThis.Element): globalThis.HTMLElement | null {
  return typeof globalThis.getComputedStyle === 'function' ? trigger.parentElement : null
}

function isInsideBody(node: globalThis.HTMLElement, body: globalThis.HTMLElement | null): boolean {
  return node !== body && node !== body?.parentElement
}

function toRect(edges: Edges, viewport: Size): Rect {
  const empty = edges.right <= edges.left || edges.bottom <= edges.top
  const { top, left, right, bottom } = empty
    ? { top: 0, left: 0, right: viewport.width, bottom: viewport.height }
    : edges
  return { top, left, right, bottom, width: right - left, height: bottom - top }
}

export function getClippingBoundary(trigger: globalThis.Element, viewport: Size): Rect {
  const edges: Edges = { top: 0, left: 0, right: viewport.width, bottom: viewport.height }
  const body = globalThis.document?.body ?? null
  let node = firstAncestor(trigger)
  while (node && isInsideBody(node, body)) {
    const style = globalThis.getComputedStyle(node)
    clipBy(node, style, edges)
    if (style.position === 'fixed') break
    node = node.parentElement
  }
  return toRect(edges, viewport)
}
