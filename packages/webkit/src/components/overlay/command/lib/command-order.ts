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

export type CommandHomeOrder = Map<CommandRegisteredItem, number>

export function homeOrderOf(items: CommandRegisteredItem[]): CommandHomeOrder {
  const sorted = [...items].sort((a, b) => domOrder(a.el.value, b.el.value))
  return new Map(sorted.map((item, index) => [item, index]))
}

const homeCompare = (
  a: CommandRegisteredItem,
  b: CommandRegisteredItem,
  home: CommandHomeOrder
) => {
  const left = home.get(a)
  const right = home.get(b)
  return left === undefined || right === undefined ? 0 : left - right
}

export function sortVisibleItems(
  visible: CommandRegisteredItem[],
  ranked: boolean,
  stats: CommandGroupStats,
  home: CommandHomeOrder = new Map()
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
        (ranked && homeCompare(a.item, b.item, home)) ||
        domOrder(a.item.el.value, b.item.el.value) ||
        a.index - b.index
    )
    .map((entry) => entry.item)
}

export const COMMAND_HINT_LIMIT = 3

export function cappedHints(
  items: CommandRegisteredItem[],
  ranked: boolean,
  home: CommandHomeOrder = new Map()
): Set<string> {
  const capped = new Set<string>()
  if (!ranked) return capped
  const matched = items.filter((item) => item.matched.value)
  if (!matched.some((item) => !item.hint.value)) return capped
  const hintsByGroup = new Map<string | null, CommandRegisteredItem[]>()
  for (const item of matched) {
    if (!item.hint.value) continue
    const list = hintsByGroup.get(item.groupId) ?? []
    list.push(item)
    hintsByGroup.set(item.groupId, list)
  }
  hintsByGroup.forEach((hints) => {
    hints
      .map((item, index) => ({ item, index }))
      .sort(
        (a, b) =>
          a.item.order.value - b.item.order.value ||
          homeCompare(a.item, b.item, home) ||
          a.index - b.index
      )
      .slice(COMMAND_HINT_LIMIT)
      .forEach(({ item }) => capped.add(item.id))
  })
  return capped
}

export type CommandDomSnapshot = Map<Element, Node[]>

export function arrangeRankedDom(
  visible: CommandRegisteredItem[],
  snapshot: CommandDomSnapshot
): void {
  const place = (parent: Element, node: Element) => {
    if (!snapshot.has(parent)) snapshot.set(parent, Array.from(parent.childNodes))
    parent.appendChild(node)
  }
  const placedGroups = new Set<Element>()
  for (const item of visible) {
    const el = item.el.value
    const parent = el?.parentElement
    if (!el || !parent) continue
    const group = item.groupId === null ? null : el.closest('[role="group"]')
    if (group?.parentElement && !placedGroups.has(group)) {
      placedGroups.add(group)
      place(group.parentElement, group)
    }
    place(parent, el)
  }
}

export function restoreDomOrder(snapshot: CommandDomSnapshot): void {
  snapshot.forEach((nodes, parent) => {
    for (const node of nodes) if (node.parentNode === parent) parent.appendChild(node)
  })
  snapshot.clear()
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
