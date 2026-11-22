export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const segmentsOf = (path: string) => path.split('.')

export function getAt(value: unknown, path: string): unknown {
  return segmentsOf(path).reduce<unknown>((current, key) => {
    if (Array.isArray(current)) return current[Number(key)]
    return isRecord(current) ? current[key] : undefined
  }, value)
}

const isIndex = (key: string | undefined) => key !== undefined && /^\d+$/.test(key)

function setInArray(container: unknown[], key: string, rest: string[], next: unknown): unknown[] {
  const copy = [...container]
  const index = Number(key)
  copy[index] = rest.length ? (setIn(copy[index] ?? {}, rest, next) ?? {}) : next
  return copy
}

const innerOf = (current: unknown, nextKey: string | undefined): unknown => {
  if (isRecord(current) || Array.isArray(current)) return current
  return isIndex(nextKey) ? [] : {}
}

function setIn(container: unknown, keys: string[], next: unknown): unknown {
  const [key, ...rest] = keys as [string, ...string[]]
  if (Array.isArray(container)) return setInArray(container, key, rest, next)
  const copy: Record<string, unknown> = isRecord(container) ? { ...container } : {}
  const updated = rest.length ? setIn(innerOf(copy[key], rest[0]), rest, next) : next
  const empty = rest.length ? isRecord(updated) && !Object.keys(updated).length : next === undefined
  if (empty) delete copy[key]
  else copy[key] = updated
  return copy
}

export function setAt(
  value: Record<string, unknown>,
  path: string,
  next: unknown
): Record<string, unknown> {
  return setIn(value, segmentsOf(path), next) as Record<string, unknown>
}

export const parentPath = (path: string) => path.split('.').slice(0, -1).join('.')
