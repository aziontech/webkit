import { RECORD_TYPES } from '../data/edge-dns'

const SUPPORTED = new Set(RECORD_TYPES.map((type) => type.value))

const stripComment = (line) => {
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') quoted = !quoted
    else if (char === ';' && !quoted) return line.slice(0, index)
  }
  return line
}

const unroot = (name) => (name.length > 1 && name.endsWith('.') ? name.slice(0, -1) : name)

const readTtl = (token) => {
  if (/^\d+$/.test(token)) return Number(token)
  const match = /^(\d+)([smhdwSMHDW])$/.exec(token)
  if (!match) return null
  const unit = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 }[match[2].toLowerCase()]
  return Number(match[1]) * unit
}

const readValue = (type, tokens) => {
  if (type === 'TXT') {
    const parts = tokens.join(' ').match(/"([^"]*)"/g)
    return parts ? parts.map((part) => part.slice(1, -1)).join('') : tokens.join(' ')
  }
  return tokens.map(unroot).join(' ')
}

export function parseZoneFile(text) {
  if (typeof text !== 'string') return { origin: '', records: [] }

  const records = []
  let origin = ''
  let defaultTtl = 3600
  let lastName = '@'
  let skipping = 0

  for (const rawLine of text.split(/\r?\n/)) {
    const line = stripComment(rawLine)
    if (!line.trim()) continue

    if (skipping > 0) {
      skipping += (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
      continue
    }

    const inherits = /^\s/.test(line)
    const tokens = line.trim().split(/\s+/)

    const directive = tokens[0].toUpperCase()
    if (directive === '$ORIGIN') {
      if (tokens[1]) origin = unroot(tokens[1])
      continue
    }
    if (directive === '$TTL') {
      const ttl = readTtl(tokens[1] ?? '')
      if (ttl !== null) defaultTtl = ttl
      continue
    }
    if (directive.startsWith('$')) continue

    let index = 0
    let name = lastName
    if (!inherits) {
      name = tokens[0]
      index = 1
    }
    lastName = name

    let ttl = defaultTtl
    for (let guard = 0; guard < 2 && index < tokens.length; guard += 1) {
      const parsed = readTtl(tokens[index])
      if (parsed !== null) {
        ttl = parsed
        index += 1
      } else if (/^(IN|CH|HS)$/i.test(tokens[index])) {
        index += 1
      } else break
    }

    const type = (tokens[index] ?? '').toUpperCase()
    index += 1

    if (type === 'SOA') {
      if (!origin && name !== '@') origin = unroot(name)
      skipping = (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
      continue
    }

    if (!SUPPORTED.has(type)) continue

    const value = readValue(type, tokens.slice(index))
    if (!value) continue

    const unrooted = unroot(name)
    const relative =
      unrooted === '@' || (origin && unrooted === origin)
        ? '@'
        : origin && unrooted.endsWith(`.${origin}`)
          ? unrooted.slice(0, -(origin.length + 1))
          : unrooted

    if (type === 'NS' && relative === '@') continue

    records.push({ name: relative, type, ttl, value })
  }

  return { origin, records }
}
