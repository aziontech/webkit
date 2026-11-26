interface DerNode {
  tag: number
  start: number
  end: number
}

export interface ParsedCertificate {
  invalid?: undefined
  subject: string
  issuer: string
  notBefore: Date
  notAfter: Date
  chain: number
}

export interface InvalidCertificate {
  invalid: true
  subject?: undefined
  notAfter?: undefined
}

const readTlv = (bytes: Uint8Array, offset: number): DerNode => {
  let length = bytes[offset + 1]
  let head = 2
  if (length & 0x80) {
    const size = length & 0x7f
    length = 0
    for (let i = 0; i < size; i += 1) length = length * 256 + bytes[offset + 2 + i]
    head += size
  }
  return { tag: bytes[offset], start: offset + head, end: offset + head + length }
}
const childrenOf = (bytes: Uint8Array, node: DerNode) => {
  const list: DerNode[] = []
  for (let offset = node.start; offset < node.end;) {
    const child = readTlv(bytes, offset)
    if (child.end > node.end || child.end <= offset) throw new Error('malformed')
    list.push(child)
    offset = child.end
  }
  return list
}
const text = (bytes: Uint8Array, node: DerNode) =>
  new TextDecoder().decode(bytes.slice(node.start, node.end))
const commonName = (bytes: Uint8Array, name: DerNode) => {
  for (const set of childrenOf(bytes, name)) {
    for (const pair of childrenOf(bytes, set)) {
      const [oid, value] = childrenOf(bytes, pair)
      const id = Array.from(bytes.slice(oid.start, oid.end)).join('.')
      if (id === '85.4.3') return text(bytes, value)
    }
  }
  return ''
}
const time = (bytes: Uint8Array, node: DerNode) => {
  const raw = text(bytes, node)
  const full = node.tag === 0x17 ? `${Number(raw.slice(0, 2)) < 50 ? '20' : '19'}${raw}` : raw
  const [y, mo, d, h, mi, s] = [0, 4, 6, 8, 10, 12].map((at, i) =>
    Number(full.slice(at, i === 0 ? 4 : at + 2))
  )
  return new Date(Date.UTC(y, mo - 1, d, h, mi, s))
}
const PEM_BLOCK = /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/g
export const parseCertificates = (pem: string): ParsedCertificate | InvalidCertificate | null => {
  const blocks = [...pem.matchAll(PEM_BLOCK)]
  if (!blocks.length) return null
  try {
    const binary = atob(blocks[0][1].replace(/\s+/g, ''))
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const [tbs] = childrenOf(bytes, readTlv(bytes, 0))
    const fields = childrenOf(bytes, tbs)
    const at = fields[0].tag === 0xa0 ? 1 : 0
    const issuer = fields[at + 2]
    const [notBefore, notAfter] = childrenOf(bytes, fields[at + 3])
    const subject = fields[at + 4]
    return {
      subject: commonName(bytes, subject),
      issuer: commonName(bytes, issuer),
      notBefore: time(bytes, notBefore),
      notAfter: time(bytes, notAfter),
      chain: blocks.length
    }
  } catch {
    return { invalid: true }
  }
}
