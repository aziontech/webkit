import type { CommandRegisteredItem } from '../injection-key'

export type CommandGroupStats = Map<string, { visible: boolean; order: number }>

export function groupStatsOf(items: CommandRegisteredItem[]): CommandGroupStats {
  const stats: CommandGroupStats = new Map()
  for (const item of items) {
    if (item.groupId === null) continue
    const current = stats.get(item.groupId) ?? { visible: false, order: Infinity }
    if (item.isVisible.value) {
      current.visible = true
      current.order = Math.min(current.order, item.order.value)
    }
    stats.set(item.groupId, current)
  }
  return stats
}

function domOrder(left: HTMLElement | null, right: HTMLElement | null) {
  if (!left || !right) return 0
  const position = left.compareDocumentPosition(right)
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
  return 0
}

function rankOrder(a: CommandRegisteredItem, b: CommandRegisteredItem, stats: CommandGroupStats) {
  const topOrder = (item: CommandRegisteredItem) =>
    item.groupId === null ? item.order.value : (stats.get(item.groupId)?.order ?? item.order.value)
  const byTop = topOrder(a) - topOrder(b)
  if (byTop !== 0) return byTop
  if (a.groupId !== null && a.groupId === b.groupId) return a.order.value - b.order.value
  return 0
}

export function sortVisibleItems(
  visible: CommandRegisteredItem[],
  ranked: boolean,
  stats: CommandGroupStats
): CommandRegisteredItem[] {
  const inOrder =
    !ranked &&
    visible.every(
      (item, index) => index === 0 || domOrder(visible[index - 1]!.el.value, item.el.value) <= 0
    )
  if (inOrder) return visible
  return visible
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        (ranked && rankOrder(a.item, b.item, stats)) ||
        domOrder(a.item.el.value, b.item.el.value) ||
        a.index - b.index
    )
    .map((entry) => entry.item)
}

export function matchesShortcut(
  shortcut: string,
  event: globalThis.KeyboardEvent,
  isMac: boolean
): boolean {
  const tokens = shortcut
    .toLowerCase()
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean)
  if (!tokens.length) return false
  const modifiers = tokens.slice(0, -1)
  if (event.key.toLowerCase() !== tokens[tokens.length - 1]) return false
  if (modifiers.includes('meta') && !(isMac ? event.metaKey : event.ctrlKey)) return false
  if (modifiers.includes('ctrl') && !event.ctrlKey) return false
  if (modifiers.includes('shift') && !event.shiftKey) return false
  return !(modifiers.includes('alt') && !event.altKey)
}
