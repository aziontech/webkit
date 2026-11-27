/** One row of a network list: the address or ASN, a comment, and whether it came from a paste. */
export type NetworkListEntry = { value: string; note: string; pasted: boolean }

/** The words of an IP/CIDR or ASN list. */
export type NetworkListCopy = {
  column: string
  placeholder: string
  noun: string
  rule: string
  hint: string
}

export const NETWORK_LIST_TYPES = [
  { label: 'IP/CIDR', value: 'ip' },
  { label: 'ASN', value: 'asn' },
  { label: 'Countries', value: 'countries' }
]

export const NETWORK_LIST_COPY: Record<string, NetworkListCopy | undefined> = {
  ip: {
    column: 'Address',
    placeholder: '203.0.113.0/24',
    noun: 'address',
    rule: 'an IPv4 or IPv6 address, or a CIDR range',
    hint: 'One IPv4 or IPv6 address or CIDR range per row, with an optional comment.'
  },
  asn: {
    column: 'ASN',
    placeholder: 'AS64500',
    noun: 'ASN',
    rule: 'a number from 1 to 4294967295, with or without AS',
    hint: 'One autonomous system number per row, written 64500 or AS64500.'
  }
}

export const COUNTRIES = [
  { value: 'AR', label: 'Argentina' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CL', label: 'Chile' },
  { value: 'DE', label: 'Germany' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'MX', label: 'Mexico' },
  { value: 'PT', label: 'Portugal' },
  { value: 'US', label: 'United States' }
]

export const NETWORK_LIST_LIMIT = 200

const isIPv4 = (value: string) => {
  const parts = value.split('.')
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

const isIPv6 = (value: string) =>
  /^[0-9a-f:]+$/i.test(value) &&
  value.includes(':') &&
  (value.match(/::/g) ?? []).length <= 1 &&
  value.split(':').every((group) => group.length <= 4)

const validIp = (raw: string) => {
  const [address, prefix, extra] = raw.split('/')
  if (extra !== undefined) return false
  const v4 = isIPv4(address)
  if (!v4 && !isIPv6(address)) return false
  if (prefix === undefined) return true
  if (!/^\d{1,3}$/.test(prefix)) return false
  return Number(prefix) <= (v4 ? 32 : 128)
}

const validAsn = (raw: string) => {
  const digits = raw.replace(/^AS/i, '')
  return /^\d{1,10}$/.test(digits) && Number(digits) >= 1 && Number(digits) <= 4294967295
}

export const entryError = (kind: string, value: string): string => {
  const text = value.trim()
  if (!text) return `Enter ${kind === 'ip' ? 'an address' : 'an ASN'}.`
  const ok = kind === 'ip' ? validIp(text) : validAsn(text)
  return ok ? '' : `${text} is not ${NETWORK_LIST_COPY[kind]?.rule}.`
}

const normalize = (kind: string, value: string) =>
  kind === 'asn' ? value.trim().replace(/^AS/i, '') : value.trim().toLowerCase()

export const createListEntry = (value = '', note = '', pasted = false): NetworkListEntry => ({
  value,
  note,
  pasted
})

export const listPasteReport = (
  text: string,
  kind: string,
  rows: NetworkListEntry[]
): { lines: NetworkListEntry[]; duplicates: number[]; invalid: number[] } => {
  const seen = new Set(
    rows.filter((entry) => entry.value.trim()).map((entry) => normalize(kind, entry.value))
  )
  const lines: NetworkListEntry[] = []
  const duplicates: number[] = []
  const invalid: number[] = []
  text.split(/\r?\n/).forEach((line, index) => {
    const [body, ...comment] = line.split('#')
    const value = body.trim()
    if (!value) return
    const key = normalize(kind, value)
    if (seen.has(key)) {
      duplicates.push(index + 1)
      return
    }
    seen.add(key)
    if (entryError(kind, value)) invalid.push(index + 1)
    lines.push(createListEntry(value, comment.join('#').trim(), true))
  })
  return { lines, duplicates, invalid }
}
