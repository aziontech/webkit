import type { SchemaFormNode } from '../schema'

export const sectionsHolding = (list: SchemaFormNode[], path: string): SchemaFormNode[] => {
  for (const node of list) {
    if (node.path === path) return []
    const inner = [...node.children, ...node.entries.flat()]
    if (!inner.length) continue
    const found = sectionsHolding(inner, path)
    if (found.length || inner.some((child) => child.path === path))
      return node.widget === 'section' ? [node, ...found] : found
  }
  return []
}
