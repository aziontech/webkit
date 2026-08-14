// BIND zone-file parsing, shared by the two ways the create-zone page accepts a whole
// file at once: the footer's Import (a picked file) and pasting the file's contents
// straight into the Domain Name input.
//
// It is the Edge DNS half of the same pattern Variables ships for `.env`
// (./dotenv.js): one small forgiving parser, two entry points, the same "skip what
// cannot be read instead of guessing" rule — so the two modules' bulk import behaves
// identically and neither invents its own idea of what a file drop means.
//
// Deliberately small and forgiving — it reads what a zone export actually contains:
// `$ORIGIN` / `$TTL` directives, `;` comments, the owner-name inheritance a zone file
// uses when a line starts with whitespace, `@` for the apex, an optional TTL and an
// optional `IN` class before the type, and quoted TXT strings. Anything it cannot read
// as a record is skipped rather than guessed at, so a stray line never becomes a
// record named after half a sentence.
//
// Three things it deliberately does NOT read, for the same reason the `.env` parser
// skips variable expansion — the create form has no way to round-trip them, and half
// supporting them is worse than skipping:
//
//   THE SOA, AND THE APEX NS SET. Azion writes both from its own nameservers the
//     moment the zone exists (see NAMESERVERS in ./edge-dns.js). Importing the
//     exporting provider's serial and its `ns1.theirprovider.net` would be importing
//     the one answer the platform is about to give — and delegating the zone straight
//     back to the provider it is being moved off. The SOA's multi-line `( … )`
//     continuation is consumed and dropped with it. An NS record BELOW the apex is a
//     real delegation of a subzone and is kept.
//   A TYPE THIS MODULE DOES NOT OFFER. Only the types in RECORD_TYPES survive
//     (A, AAAA, CNAME, MX, TXT, NS) — a SRV or CAA line is skipped rather than seeded
//     into a form whose Type select cannot hold it.
//   $INCLUDE and $GENERATE. Both reach outside the pasted text, which a browser
//     cannot follow.

import { RECORD_TYPES } from './edge-dns'

/** The types the module's Type select can hold — everything else is skipped. */
const SUPPORTED = new Set(RECORD_TYPES.map((type) => type.value))

/** A zone file's own comment character, outside a quoted string. */
const stripComment = (line) => {
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') quoted = !quoted
    else if (char === ';' && !quoted) return line.slice(0, index)
  }
  return line
}

/** `example.com.` → `example.com`. The root dot is syntax, not part of the name. */
const unroot = (name) => (name.length > 1 && name.endsWith('.') ? name.slice(0, -1) : name)

/**
 * A TTL as written in a zone file: bare seconds, or the `1h` / `2d` / `1w` shorthand
 * BIND accepts. Returns null when the token is not a TTL at all, which is how the
 * caller tells `www IN CNAME …` from `www 3600 IN CNAME …`.
 */
const readTtl = (token) => {
  if (/^\d+$/.test(token)) return Number(token)
  const match = /^(\d+)([smhdwSMHDW])$/.exec(token)
  if (!match) return null
  const unit = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 }[match[2].toLowerCase()]
  return Number(match[1]) * unit
}

/**
 * The record's value, from the tokens after its type.
 *
 * TXT is the one type whose value is quoted, and long TXT records are split into
 * several adjacent strings that concatenate — so the quotes come off and the parts
 * join. Every other type is a plain token list (`10 mail.example.com`), kept as
 * written minus the trailing root dot each hostname carries.
 */
const readValue = (type, tokens) => {
  if (type === 'TXT') {
    const parts = tokens.join(' ').match(/"([^"]*)"/g)
    return parts ? parts.map((part) => part.slice(1, -1)).join('') : tokens.join(' ')
  }
  return tokens.map(unroot).join(' ')
}

/**
 * Every record a zone file's contents declare, in file order, plus the origin it
 * declares itself for.
 *
 * @param {string} text Raw file contents (or pasted text).
 * @returns {{ origin: string, records: { name: string, type: string, ttl: number, value: string }[] }}
 *   `origin` is `''` when the file does not say (a fragment with no `$ORIGIN` and no
 *   SOA), and `records` is empty when nothing parses — the caller uses the empty
 *   result to fall back to a plain paste instead of filling the form.
 */
export function parseZoneFile(text) {
  if (typeof text !== 'string') return { origin: '', records: [] }

  const records = []
  let origin = ''
  // The file's own default TTL ($TTL), used by a record that states none.
  let defaultTtl = 3600
  // A line that starts with whitespace inherits the previous line's owner name.
  let lastName = '@'
  // Depth of an unclosed `( … )` continuation — the SOA's, which is dropped whole.
  let skipping = 0

  for (const rawLine of text.split(/\r?\n/)) {
    const line = stripComment(rawLine)
    if (!line.trim()) continue

    // Inside a multi-line record (only the SOA in practice): consume until balanced.
    if (skipping > 0) {
      skipping += (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
      continue
    }

    const inherits = /^\s/.test(line)
    const tokens = line.trim().split(/\s+/)

    // Directives.
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
    // $INCLUDE / $GENERATE and anything else prefixed `$` reach outside the text.
    if (directive.startsWith('$')) continue

    let index = 0
    let name = lastName
    if (!inherits) {
      name = tokens[0]
      index = 1
    }
    lastName = name

    // An optional TTL and an optional class, in either order, before the type.
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

    // The SOA gives us the origin when no $ORIGIN did, and nothing else.
    if (type === 'SOA') {
      if (!origin && name !== '@') origin = unroot(name)
      skipping = (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0)
      continue
    }

    if (!SUPPORTED.has(type)) continue

    const value = readValue(type, tokens.slice(index))
    if (!value) continue

    // A fully-qualified owner equal to the origin is the apex, written `@` in the form.
    const unrooted = unroot(name)
    const relative =
      unrooted === '@' || (origin && unrooted === origin)
        ? '@'
        : origin && unrooted.endsWith(`.${origin}`)
          ? unrooted.slice(0, -(origin.length + 1))
          : unrooted

    // The apex NS set belongs to whoever is authoritative, which after this import is
    // Azion. A delegation further down (`sub IN NS …`) is the zone's own data and stays.
    if (type === 'NS' && relative === '@') continue

    records.push({ name: relative, type, ttl, value })
  }

  return { origin, records }
}
