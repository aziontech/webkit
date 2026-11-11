/** Row density of a collection. */
export type CollectionDensity = 'comfortable' | 'compact'

/** One column in the preferences: its id, in display order, and whether it shows. */
export interface CollectionColumnPreference {
  id: string
  visible: boolean
}

/** What a person can change about a collection, saved per collection. */
export interface CollectionPreferencesValue {
  pageSize?: number
  columns?: CollectionColumnPreference[]
  wrapLines?: boolean
  striped?: boolean
  density?: CollectionDensity
}

/** The storage the preferences use; `localStorage` by default. */
export interface PreferencesStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export function defaultStorage(): PreferencesStorage | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null
  } catch {
    return null
  }
}

export function readPreferences(
  storage: PreferencesStorage | null,
  key: string
): CollectionPreferencesValue | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as CollectionPreferencesValue) : null
  } catch {
    return null
  }
}

export function writePreferences(
  storage: PreferencesStorage | null,
  key: string,
  value: CollectionPreferencesValue
): void {
  if (!storage) return
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function mergeColumns(
  saved: CollectionColumnPreference[] | undefined,
  ids: string[],
  hidden: string[] = []
): CollectionColumnPreference[] {
  const known = new Set(ids)
  const kept = (saved ?? []).filter((c) => known.has(c.id))
  const seen = new Set(kept.map((c) => c.id))
  const added = ids
    .filter((id) => !seen.has(id))
    .map((id) => ({ id, visible: !hidden.includes(id) }))
  return [...kept, ...added]
}
