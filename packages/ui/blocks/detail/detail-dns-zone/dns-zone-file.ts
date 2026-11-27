interface ZoneLineBase {
  line: number
  name?: string
  type?: string
  ttl?: number
  value?: string
  reason: string
}

/** One line of a zone file, read for the import preview. */
export type ZoneLine =
  | (ZoneLineBase & { status: 'skipped' | 'error' })
  | (ZoneLineBase & { status: 'ready'; name: string; type: string; ttl: number; value: string })

interface ZoneParseState {
  origin: string
  defaultTtl: number
  lastName: string
  skipping: number
}

interface ZoneRecordLine {
  line: number
  name: string
  type: string
  ttl: number
  rest: string[]
}

const SUPPORTED = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'CAA', 'SRV', 'NS', 'PTR']

const stripComment = (line: string) => {
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') quoted = !quoted
    else if (char === ';' && !quoted) return line.slice(0, index)
  }
  return line
}
const unroot = (name: string) => (name.length > 1 && name.endsWith('.') ? name.slice(0, -1) : name)
const readTtl = (token: string) => {
  if (/^\d+$/.test(token)) return Number(token)
  const match = /^(\d+)([smhdw])$/i.exec(token)
  if (!match) return null
  const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 }
  return Number(match[1]) * units[match[2].toLowerCase()]
}
const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/
const checkValue = (type: string, value: string) => {
  if (!value) return 'The record has no value.'
  if (type === 'A' && !IPV4.test(value)) return `${value} is not an IPv4 address.`
  if (type === 'AAAA' && !value.includes(':')) return `${value} is not an IPv6 address.`
  if (type === 'MX' && !/^\d+\s+\S+$/.test(value)) return 'MX needs a priority and a host.'
  return ''
}
const parenDepth = (line: string) =>
  (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)

const applyDirective = (tokens: string[], line: number, state: ZoneParseState): ZoneLine | null => {
  const directive = tokens[0].toUpperCase()
  if (directive === '$ORIGIN') {
    state.origin = unroot(tokens[1] ?? '')
    return null
  }
  if (directive !== '$TTL') return null
  const ttl = readTtl(tokens[1] ?? '')
  if (ttl !== null) {
    state.defaultTtl = ttl
    return null
  }
  return { line, status: 'error', reason: `$TTL ${tokens[1] ?? ''} is not a time.` }
}

const readOwner = (line: string, tokens: string[], state: ZoneParseState) => {
  let index = 0
  let name = state.lastName
  if (!/^\s/.test(line)) {
    name = tokens[0]
    index = 1
  }
  state.lastName = name
  let ttl = state.defaultTtl
  for (let guard = 0; guard < 2 && index < tokens.length; guard += 1) {
    const parsed = readTtl(tokens[index])
    if (parsed !== null) {
      ttl = parsed
      index += 1
    } else if (/^(IN|CH|HS)$/i.test(tokens[index])) index += 1
    else break
  }
  return { name, ttl, index }
}

const relativeName = (name: string, origin: string) => {
  const unrooted = unroot(name)
  if (unrooted === '@' || (origin && unrooted === origin)) return '@'
  if (origin && unrooted.endsWith(`.${origin}`)) return unrooted.slice(0, -(origin.length + 1))
  return unrooted
}

const readValue = (type: string, rest: string[]) =>
  type === 'TXT'
    ? (rest.join(' ').match(/"([^"]*)"/g) ?? [rest.join(' ')])
        .map((part) => part.replace(/^"|"$/g, ''))
        .join('')
    : rest.map(unroot).join(' ')

const skippedRecord = ({ line, name, type }: ZoneRecordLine): ZoneLine | null => {
  if (type === 'SOA')
    return { line, name, type, status: 'skipped', reason: 'The zone keeps its own SOA.' }
  if (!SUPPORTED.includes(type))
    return {
      line,
      name,
      type: type || '—',
      status: type ? 'skipped' : 'error',
      reason: type ? `${type} records are not supported.` : 'No record type on this line.'
    }
  if (type === 'NS' && name === '@')
    return {
      line,
      name,
      type,
      status: 'skipped',
      reason: 'The zone answers with its own nameservers.'
    }
  return null
}

const readRecord = (record: ZoneRecordLine): ZoneLine => {
  const skipped = skippedRecord(record)
  if (skipped) return skipped
  const { line, name, type, ttl, rest } = record
  const value = readValue(type, rest)
  const problem = checkValue(type, value)
  return { line, name, type, ttl, value, status: problem ? 'error' : 'ready', reason: problem }
}

const parseLine = (rawLine: string, number: number, state: ZoneParseState): ZoneLine | null => {
  const line = stripComment(rawLine)
  if (!line.trim()) return null
  if (state.skipping > 0) {
    state.skipping += parenDepth(line)
    return null
  }
  const tokens = line.trim().split(/\s+/)
  if (tokens[0].startsWith('$')) return applyDirective(tokens, number, state)
  const { name, ttl, index } = readOwner(line, tokens, state)
  const type = (tokens[index] ?? '').toUpperCase()
  const rest = tokens.slice(index + 1)
  if (type === 'SOA') state.skipping = parenDepth(line)
  return readRecord({ line: number, name: relativeName(name, state.origin), type, ttl, rest })
}

export const parseZoneFile = (text: string): { origin: string; lines: ZoneLine[] } => {
  const state: ZoneParseState = { origin: '', defaultTtl: 3600, lastName: '@', skipping: 0 }
  const lines: ZoneLine[] = []
  text.split(/\r?\n/).forEach((rawLine, position) => {
    const entry = parseLine(rawLine, position + 1, state)
    if (entry) lines.push(entry)
  })
  return { origin: state.origin, lines }
}
