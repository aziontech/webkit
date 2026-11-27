import type { SchemaFormNode, SchemaFormSchema, SchemaFormTree, SchemaFormUi } from '../schema'
import { buildNodes } from './schema-nodes'
import { getAt, isRecord, parentPath, setAt } from './schema-paths'

const valuePaths = (nodes: SchemaFormNode[]): string[] =>
  nodes.flatMap((node) => {
    if (node.widget === 'fieldset' || node.widget === 'section') return valuePaths(node.children)
    return [node.path, ...node.variants.flatMap((variant) => valuePaths(variant.children))]
  })

export function expand(
  nodes: SchemaFormNode[],
  value: Record<string, unknown>,
  ui: Record<string, SchemaFormUi> = {}
): SchemaFormTree {
  const hidden: string[] = []
  const shown = new Set<string>()
  const visitVariants = (node: SchemaFormNode): SchemaFormNode[] => {
    const current = getAt(value, node.path)
    const chosen = node.variants.find((v) => String(v.value) === String(current))
    for (const variant of node.variants) {
      if (variant !== chosen) hidden.push(...valuePaths(variant.children))
    }
    return [node, ...(chosen ? visit(chosen.children) : [])]
  }
  const visitRepeat = (node: SchemaFormNode): SchemaFormNode[] => {
    const items = getAt(value, node.path)
    const item = node.schema.items as SchemaFormSchema
    const entries = (Array.isArray(items) ? items : []).map((_, index) =>
      visit(buildNodes(item, ui, `${node.path}.${index}`, node.readOnly, `${node.uiPath}.*`))
    )
    return [{ ...node, entries }]
  }
  const visitNode = (node: SchemaFormNode): SchemaFormNode[] => {
    const parent = getAt(value, parentPath(node.path))
    if (node.when && !node.when(value, isRecord(parent) ? parent : {})) {
      hidden.push(...valuePaths([node]))
      return []
    }
    if (node.widget === 'fieldset' || node.widget === 'section') {
      const children = visit(node.children)
      return children.length || node.widget === 'fieldset' ? [{ ...node, children }] : []
    }
    shown.add(node.path)
    if (node.variants.length) return visitVariants(node)
    return node.widget === 'repeat' ? visitRepeat(node) : [node]
  }
  const visit = (list: SchemaFormNode[]): SchemaFormNode[] => list.flatMap(visitNode)
  const visible = visit(nodes)
  return { nodes: visible, hidden: hidden.filter((path) => !shown.has(path)) }
}

export function seedDefaults(
  nodes: SchemaFormNode[],
  value: Record<string, unknown>
): Record<string, unknown> | null {
  let next = value
  let seeded = false
  const visit = (list: SchemaFormNode[]) => {
    for (const node of list) {
      if (node.widget === 'fieldset' || node.widget === 'section') {
        visit(node.children)
        continue
      }
      if (getAt(next, node.path) !== undefined || node.schema.default === undefined) continue
      next = setAt(next, node.path, structuredClone(node.schema.default))
      seeded = true
    }
  }
  visit(nodes)
  return seeded ? next : null
}

export function leavesOf(nodes: SchemaFormNode[]): SchemaFormNode[] {
  return nodes.flatMap((node) => {
    if (node.widget === 'fieldset' || node.widget === 'section') return leavesOf(node.children)
    if (node.widget === 'repeat') return [node, ...node.entries.flatMap(leavesOf)]
    return [node]
  })
}
