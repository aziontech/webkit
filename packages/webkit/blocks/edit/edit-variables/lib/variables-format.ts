/** A key and value read from a file, a paste or the JSON view. */
export type VariablesPair = { key: string; value: string }

export const formatKey = (value: string): string => value.replace(/\s/g, '_').toUpperCase()

const unquote = (value: string) => {
  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
    return value.slice(1, -1)
  }
  return value
}

export const parseEnvFile = (
  content: string | undefined
): { parsed: VariablesPair[]; invalidLines: number[] } => {
  const parsed: VariablesPair[] = []
  const invalidLines: number[] = []
  String(content ?? '')
    .split(/\r?\n/)
    .forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const declaration = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed
      const match = declaration.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!match) {
        invalidLines.push(index + 1)
        return
      }
      parsed.push({ key: match[1], value: unquote(match[2]) })
    })
  return { parsed, invalidLines }
}

const jsonValue = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

export const parseJsonObject = (content: string): VariablesPair[] | null => {
  const parsed: unknown = JSON.parse(content)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
  return Object.entries(parsed)
    .filter(([key]) => key.trim())
    .map(([key, value]) => ({ key: formatKey(key), value: jsonValue(value) }))
}

export const parsePasted = (content: string | undefined): VariablesPair[] | null => {
  const text = String(content ?? '').trim()
  if (!text) return null
  if (text.startsWith('{')) {
    try {
      const pairs = parseJsonObject(text)
      return pairs?.length ? pairs : null
    } catch {
      return null
    }
  }
  const { parsed, invalidLines } = parseEnvFile(text)
  return invalidLines.length || !parsed.length ? null : parsed
}

export const envPasteReport = (
  text: string,
  listedKeys: string[]
): { pairs: VariablesPair[]; invalidLines: number[]; repeated: string[]; replaced: string[] } => {
  const { parsed, invalidLines } = parseEnvFile(text)
  const byKey = new Map(parsed.map((pair) => [pair.key, pair]))
  const repeated = [...new Set(parsed.map((pair) => pair.key))].filter(
    (key) => parsed.filter((pair) => pair.key === key).length > 1
  )
  const listed = new Set(listedKeys)
  const replaced = [...byKey.keys()].filter((key) => listed.has(key))
  return { pairs: [...byKey.values()], invalidLines, repeated, replaced }
}

export const plural = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`
