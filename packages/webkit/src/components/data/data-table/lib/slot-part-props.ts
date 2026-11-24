import { camelize, Fragment, type Slot, type VNode } from 'vue'

const nameOf = (node: VNode): string | undefined => {
  const type = node.type as { name?: string; __name?: string } | string | symbol
  return typeof type === 'object' ? (type.name ?? type.__name) : undefined
}

const findNode = (nodes: unknown, name: string): VNode | undefined => {
  if (!Array.isArray(nodes)) return undefined
  for (const node of nodes as VNode[]) {
    if (!node || typeof node !== 'object') continue
    if (nameOf(node) === name) return node
    if (node.type === Fragment) {
      const found = findNode(node.children, name)
      if (found) return found
    }
  }
  return undefined
}

export const slotPartProps = (
  slot: Slot | undefined,
  name: string
): Record<string, unknown> | undefined => {
  const compiled = slot !== undefined && Reflect.get(slot, '_c') !== false
  const node = compiled ? findNode(slot({}), name) : undefined
  if (!node) return undefined
  return Object.fromEntries(
    Object.entries(node.props ?? {}).map(([key, value]) => [camelize(key), value])
  )
}
