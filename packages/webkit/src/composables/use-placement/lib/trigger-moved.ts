import type { Rect } from './types'

function scrollsPage(target: globalThis.Node | null): boolean {
  const doc = globalThis.document
  return !target || target === doc || target === doc?.scrollingElement
}

export function triggerMoved(
  trigger: globalThis.HTMLElement | null,
  anchorRect: Rect | null,
  target: globalThis.Node | null
): boolean {
  if (!trigger || !anchorRect) return false
  if (!scrollsPage(target) && !target?.contains(trigger)) return false
  const now = trigger.getBoundingClientRect()
  return Math.abs(now.top - anchorRect.top) > 1 || Math.abs(now.left - anchorRect.left) > 1
}
