export function toggleKeys(current: string[], keys: string[], add: boolean): string[] {
  const set = new Set(current)
  for (const key of keys) {
    if (add) set.add(key)
    else set.delete(key)
  }
  return [...set]
}

export function selectSingle(current: string[], keys: string[], value: boolean): string[] {
  const last = keys[keys.length - 1]
  if (value && last !== undefined) return [last]
  const drop = new Set(keys)
  return current.filter((key) => !drop.has(key))
}
