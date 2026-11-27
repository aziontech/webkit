import type { LazyChunk } from '../../../../composables/use-lazy-chunks'
import type { TreeItem, TreeSize } from '../tree.vue'

export const FLAT_THRESHOLD = 300
export const CHUNK_SIZE = 100
export const ROW_HEIGHTS: Record<TreeSize, number> = { small: 24, medium: 32, large: 40 }
export const SKELETON_WIDTHS = ['100%', '80%', '64%', '48%', '32%']

export type TreeRow = { item: TreeItem; level: number; posinset: number; setsize: number }

export type TreeEntry =
  | (TreeRow & { key: string; placeholder?: undefined })
  | { key: number; placeholder: true; chunk: number; height: number }

export function flattenTree(items: TreeItem[], open: ReadonlySet<string>): TreeRow[] {
  const rows: TreeRow[] = []
  const walk = (nodes: TreeItem[], level: number) => {
    nodes.forEach((item, position) => {
      rows.push({ item, level, posinset: position + 1, setsize: nodes.length })
      const children = item.children ?? []
      const parent = item.lazy === true || children.length > 0
      if (parent && open.has(item.id) && !item.loading) walk(children, level + 1)
    })
  }
  walk(items, 1)
  return rows
}

export const rootEntries = (items: TreeItem[]): TreeEntry[] =>
  items.map((item, position) => ({
    key: item.id,
    item,
    level: 1,
    posinset: position + 1,
    setsize: items.length
  }))

export const chunkEntries = (chunks: LazyChunk<TreeRow>[]): TreeEntry[] =>
  chunks.flatMap<TreeEntry>((chunk) =>
    chunk.mounted
      ? chunk.items.map((row) => ({ ...row, key: row.item.id }))
      : [
          {
            key: -1 - chunk.index,
            placeholder: true,
            chunk: chunk.index,
            height: chunk.estimatedHeight
          }
        ]
  )

export function typeaheadMatch(
  ids: readonly string[],
  fromId: string,
  typed: string,
  labelOf: (id: string) => string
): string {
  const query = typed.toLocaleLowerCase()
  const position = ids.indexOf(fromId)
  const start = typed.length === 1 ? position + 1 : Math.max(position, 0)
  const ordered = [...ids.slice(start), ...ids.slice(0, start)]
  return ordered.find((candidate) => labelOf(candidate).toLocaleLowerCase().startsWith(query)) ?? ''
}

export const isTypeaheadKey = (event: KeyboardEvent): boolean =>
  event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey
