import type {
  DocMarkdownAttributes,
  DocMarkdownData,
  DocMarkdownValue
} from '../parse-doc-markdown'

const ATTRIBUTE_NAME = /[A-Za-z][A-Za-z0-9-]*/y

const parseList = (raw: string): string[] =>
  raw
    .slice(1, -1)
    .split(',')
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
    .filter((entry) => entry !== '')

const relaxedJson = (raw: string): string =>
  raw
    .replace(/'((?:[^'\\]|\\.)*)'/g, (_, inner: string) =>
      JSON.stringify(inner.replace(/\\'/g, "'"))
    )
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
    .replace(/,\s*([}\]])/g, '$1')

const parseData = (raw: string): DocMarkdownData | undefined => {
  for (const candidate of [raw, relaxedJson(raw)]) {
    try {
      return JSON.parse(candidate) as DocMarkdownData
    } catch {
      continue
    }
  }
  return undefined
}

const braceValue = (raw: string): DocMarkdownValue => {
  const value = raw.trim()
  if (value === 'true' || value === 'false') return value === 'true'
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value)
  if (value.startsWith('{') || value.startsWith('[')) {
    const data = parseData(value)
    if (Array.isArray(data) || (data !== null && typeof data === 'object')) return data
    if (value.startsWith('[') && value.endsWith(']')) return parseList(value)
  }
  return value.replace(/^['"]|['"]$/g, '')
}

const closingBrace = (raw: string, open: number): number => {
  let depth = 0
  let quote = ''
  for (let index = open; index < raw.length; index += 1) {
    const char = raw[index] as string
    if (quote) {
      if (char === '\\') index += 1
      else if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'" || char === '`') quote = char
    else if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return index
    }
  }
  return raw.length
}

export const parseAttributes = (raw: string): DocMarkdownAttributes => {
  const props: DocMarkdownAttributes = {}
  let index = 0
  while (index < raw.length) {
    ATTRIBUTE_NAME.lastIndex = index
    const name = ATTRIBUTE_NAME.exec(raw)?.[0]
    if (!name) {
      index += 1
      continue
    }
    index += name.length
    const rest = raw.slice(index).match(/^\s*=\s*/)
    if (!rest) {
      props[name] = true
      continue
    }
    index += rest[0].length
    const quote = raw[index]
    if (quote === '"' || quote === "'") {
      const end = raw.indexOf(quote, index + 1)
      const stop = end === -1 ? raw.length : end
      props[name] = raw.slice(index + 1, stop)
      index = stop + 1
    } else if (quote === '{') {
      const end = closingBrace(raw, index)
      props[name] = braceValue(raw.slice(index + 1, end))
      index = end + 1
    } else props[name] = true
  }
  return props
}
