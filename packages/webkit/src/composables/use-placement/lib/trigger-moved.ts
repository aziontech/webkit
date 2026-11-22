import type { Rect } from './types'

export function triggerMoved(
  trigger: globalThis.HTMLElement | null,
  anchorRect: Rect | null,
  target: globalThis.Node | null
): boolean {
  if (!trigger || !anchorRect) return false
  const doc = globalThis.document
  const scrollsPage = !target || target === doc || target === doc?.scrollingElement
  if (!scrollsPage && !target.contains(trigger)) return false
  const now = trigger.getBoundingClientRect()
  return Math.abs(now.top - anchorRect.top) > 1 || Math.abs(now.left - anchorRect.left) > 1
}
