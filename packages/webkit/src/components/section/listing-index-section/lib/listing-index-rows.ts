import type { LazyChunk } from '../../../../composables/use-lazy-chunks'
import type {
  ListingIndexSectionFacet,
  ListingIndexSectionRow,
  ListingIndexSectionSort
} from '../listing-index-section.vue'

export const LAZY_ROWS = 300

export function seedFacets(
  facets: ListingIndexSectionFacet[],
  search: string,
  selected: Record<string, string>
): void {
  const params = new URLSearchParams(search)
  facets.forEach((facet) => {
    const value = params.get(facet.id)
    if (value && facet.options.some((option) => option.value === value)) {
      selected[facet.id] = value
    }
  })
}

export function filterRows(
  rows: ListingIndexSectionRow[],
  selected: Record<string, string>,
  query: string,
  sorts: ListingIndexSectionSort[],
  sort: string
): ListingIndexSectionRow[] {
  const needle = query.trim().toLowerCase()
  const found = rows.filter(
    (row) =>
      Object.entries(selected).every(
        ([key, value]) => !value || (row.facets?.[key] ?? []).includes(value)
      ) &&
      (!needle || Object.values(row.values).join(' ').toLowerCase().includes(needle))
  )
  const by = sorts.find((option) => option.value === sort)?.by
  return by
    ? [...found].sort((a, b) => (a.values[by] ?? '').localeCompare(b.values[by] ?? ''))
    : found
}

export function appliedFacets(
  facets: ListingIndexSectionFacet[],
  selected: Record<string, string>
): { key: string; label: string }[] {
  return facets.flatMap((facet) => {
    const value = selected[facet.id]
    const option = value ? facet.options.find((candidate) => candidate.value === value) : undefined
    return option ? [{ key: facet.id, label: `${facet.label}: ${option.label}` }] : []
  })
}

export type ListingIndexGroup = { group: string; rows: ListingIndexSectionRow[] }

export function groupBlocks(
  listed: ListingIndexGroup[],
  split: ((items: readonly ListingIndexGroup[]) => LazyChunk<ListingIndexGroup>[]) | null,
  rowHeight: number
) {
  const chunks = split
    ? split(listed)
    : listed.map((entry, index) => ({ index, items: [entry], mounted: true }))
  return chunks.map((chunk) => ({
    index: chunk.index,
    entry: chunk.items[0],
    mounted: chunk.mounted,
    height: `${(chunk.items[0].rows.length + 1) * rowHeight}px`
  }))
}

export function groupRows(groups: string[], rows: ListingIndexSectionRow[]): ListingIndexGroup[] {
  return groups
    .map((group) => ({ group, rows: rows.filter((row) => row.group === group) }))
    .filter((entry) => entry.rows.length > 0)
}

export const facetDisplay = (facet: ListingIndexSectionFacet) => (value: unknown) =>
  facet.options.find((option) => option.value === value)?.label ?? facet.allLabel

export const sortDisplay = (sorts: ListingIndexSectionSort[]) => (value: unknown) =>
  sorts.find((option) => option.value === value)?.label ?? ''

export const edgeOf = (index: number, count: number) =>
  index === 0 ? 'start' : index === count - 1 ? 'end' : undefined
