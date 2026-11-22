import type { CollectionSort } from './types'

let collator: Intl.Collator | undefined

const isMissing = (value: unknown): boolean => value === null || value === undefined || value === ''

function compareValues(a: unknown, b: unknown): number {
  const missingA = isMissing(a)
  const missingB = isMissing(b)
  if (missingA || missingB) return missingA === missingB ? 0 : missingA ? 1 : -1
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  collator ??= new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  return collator.compare(String(a), String(b))
}

export function sortItems<T>(
  filtered: T[],
  sorting: CollectionSort[],
  comparators: Record<string, (a: T, b: T) => number>,
  fieldOf: (id: string) => string
): T[] {
  const keys = sorting.map((sort) => ({
    desc: sort.desc,
    custom: comparators[sort.id],
    field: fieldOf(sort.id)
  }))
  return filtered.sort((a, b) => {
    for (const { desc, custom, field } of keys) {
      const result = custom
        ? custom(a, b)
        : compareValues(
            (a as Record<string, unknown>)[field],
            (b as Record<string, unknown>)[field]
          )
      if (result !== 0) return desc ? -result : result
    }
    return 0
  })
}
