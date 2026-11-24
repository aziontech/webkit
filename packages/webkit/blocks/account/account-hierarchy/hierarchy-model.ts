import type { TagSeverity, TagVariant } from '@aziontech/webkit/tag'

import type {
  AccountHierarchyResource,
  AccountHierarchyResourceStatus,
  AccountHierarchyResourceType
} from './account-hierarchy.vue'

/** How a resource level reads: its label, glyph and tag colour. */
export interface ResourceTypeMeta {
  /** The level name. */
  label: string
  /** The level glyph class. */
  icon: string
  /** The tag severity. */
  severity?: TagSeverity
  /** The tag variant. */
  variant?: TagVariant
}

/** A resource with the resources under it. */
export interface ResourceNode extends AccountHierarchyResource {
  /** The resources whose parent it is. */
  children?: ResourceNode[]
}

export const types: Record<AccountHierarchyResourceType, ResourceTypeMeta> = {
  organization: { label: 'Organization', icon: 'az az-building', variant: 'accent' },
  group: { label: 'Group', icon: 'az az-users', severity: 'info' },
  workspace: { label: 'Workspace', icon: 'az az-layout-grid', severity: 'neutral' }
}

const statusSeverities: Record<AccountHierarchyResourceStatus, TagSeverity> = {
  Active: 'success',
  Suspended: 'danger',
  Pending: 'warning'
}

export const statusSeverity = (status?: AccountHierarchyResourceStatus): TagSeverity =>
  status ? statusSeverities[status] : 'neutral'

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

export const plural = (count: number, one: string, other: string): string =>
  `${count} ${count === 1 ? one : other}`

export const buildTree = (items: AccountHierarchyResource[]): ResourceNode[] => {
  const byParent = new Map<string | null, AccountHierarchyResource[]>()
  for (const item of items) {
    const list = byParent.get(item.parentId) ?? []
    list.push(item)
    byParent.set(item.parentId, list)
  }
  const build = (parentId: string | null): ResourceNode[] =>
    (byParent.get(parentId) ?? []).map((item) => {
      const children = build(item.id)
      return children.length ? { ...item, children } : { ...item }
    })
  return build(null)
}

export const pruneTree = (
  nodes: ResourceNode[],
  matches: (item: AccountHierarchyResource) => boolean
): ResourceNode[] =>
  nodes.flatMap((node) => {
    if (matches(node)) return [node]
    const children = pruneTree(node.children ?? [], matches)
    return children.length ? [{ ...node, children }] : []
  })

export const descendantsIn = (
  items: AccountHierarchyResource[],
  id: string
): AccountHierarchyResource[] => {
  const out: AccountHierarchyResource[] = []
  const walk = (parentId: string) => {
    for (const item of items)
      if (item.parentId === parentId) {
        out.push(item)
        walk(item.id)
      }
  }
  walk(id)
  return out
}
