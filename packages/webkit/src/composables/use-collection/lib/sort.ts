import type { CollectionSort } from './types'

export interface CollectionSortKey<T> {
  desc: boolean
  custom?: (a: T, b: T) => number
  field: string
}

let collator: Intl.Collator | undefined

const isMissing = (value: unknown): boolean => value === null || value === undefined || value === ''

function compareMissing(a: unknown, b: unknown): number | null {
  const missingA = isMissing(a)
  const missingB = isMissing(b)
  if (!missingA && !missingB) return null
  if (missingA === missingB) return 0
  return missingA ? 1 : -1
}

function compareTyped(a: unknown, b: unknown): number | null {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return null
}

function compareValues(a: unknown, b: unknown): number {
  const missing = compareMissing(a, b)
  if (missing !== null) return missing
  const typed = compareTyped(a, b)
  if (typed !== null) return typed
  collator ??= new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  return collator.compare(String(a), String(b))
}

function compareByKey<T>(a: T, b: T, key: CollectionSortKey<T>): number {
  const result = key.custom
    ? key.custom(a, b)
    : compareValues(
        (a as Record<string, unknown>)[key.field],
        (b as Record<string, unknown>)[key.field]
      )
  return key.desc ? -result : result
}

export function sortKeysOf<T>(
  sorting: CollectionSort[],
  comparators: Record<string, (a: T, b: T) => number>,
  fieldOf: (id: string) => string
): CollectionSortKey<T>[] {
  return sorting.map((sort) => ({
    desc: sort.desc,
    custom: comparators[sort.id],
    field: fieldOf(sort.id)
  }))
}

export function sortItems<T>(items: T[], keys: CollectionSortKey<T>[]): T[] {
  return items.sort((a, b) => {
    for (const key of keys) {
      const result = compareByKey(a, b, key)
      if (result !== 0) return result
    }
    return 0
  })
}
