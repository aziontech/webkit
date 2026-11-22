import type { CollectionState } from './state'

export function setSelectionKeys<T>(s: CollectionState<T>, keys: string[], value: boolean): void {
  if (s.allMatching.value) {
    const set = new Set(s.excluded.value)
    for (const key of keys) {
      if (value) set.delete(key)
      else set.add(key)
    }
    s.excluded.value = [...set]
    return
  }
  if (s.selectionMode === 'single') {
    const last = keys[keys.length - 1]
    if (value && last !== undefined) s.selected.value = [last]
    else {
      const drop = new Set(keys)
      s.selected.value = s.selected.value.filter((key) => !drop.has(key))
    }
    return
  }
  const set = new Set(s.selected.value)
  for (const key of keys) {
    if (value) set.add(key)
    else set.delete(key)
  }
  s.selected.value = [...set]
}

export function selectedItemsOf<T>(
  s: CollectionState<T>,
  isSelected: (key: string) => boolean
): T[] {
  if (s.serverMode) {
    if (s.allMatching.value) return s.serverItems.value.filter((item) => isSelected(s.keyOf(item)))
    return s.selected.value
      .map((key) => s.seen.get(key))
      .filter((item): item is T => item !== undefined)
  }
  const set = new Set(s.selected.value)
  return s.sourceItems.value.filter((item) => set.has(s.keyOf(item)))
}
