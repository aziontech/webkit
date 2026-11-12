import { index } from './data'
import { FOUNDATIONS } from './foundations'

export type NavGroup = { label: string; items: { label: string; to: string }[] }

const CATEGORY_ORDER = [
  'actions',
  'inputs',
  'data',
  'feedback',
  'navigation',
  'overlay',
  'layout',
  'content',
  'chart',
  'code',
  'utils',
  'documentation',
  'marketing',
  'sections'
]

export function titleCase(value: string): string {
  return value
    .split(/[-/ ]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function componentGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup['items']>()
  for (const item of index.components) {
    const list = groups.get(item.category) ?? []
    list.push({ label: item.title, to: `/components/${item.name}` })
    groups.set(item.category, list)
  }
  const rank = (category: string) => {
    const at = CATEGORY_ORDER.indexOf(category)
    return at === -1 ? CATEGORY_ORDER.length : at
  }
  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([category, items]) => ({
      label: titleCase(category),
      items: items.sort((a, b) => a.label.localeCompare(b.label))
    }))
}

export function blockGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup['items']>()
  for (const block of index.blocks) {
    const list = groups.get(block.group) ?? []
    list.push({ label: block.title, to: `/blocks/${block.id}` })
    groups.set(block.group, list)
  }
  return [...groups.entries()].map(([group, items]) => ({
    label: titleCase(group.replace(/^platform\//, '')),
    items
  }))
}

export function foundationGroups(label: string): NavGroup[] {
  return [
    {
      label,
      items: FOUNDATIONS.map((page) => ({ label: page.title, to: `/foundations/${page.slug}` }))
    }
  ]
}
