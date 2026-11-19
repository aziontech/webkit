const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel'])
const WEB_SCHEMES = new Set(['http', 'https'])
const DOWNLOAD_SCHEMES = new Set(['blob', 'data'])
const SCHEME = /^([a-z][a-z\d+.-]*):/i
const PROTOCOL_RELATIVE = /^[/\\]{2}/
const ENTITY = /&(#x[\da-f]+|#\d+|colon|tab|newline);?/gi
const NAMED_ENTITIES: Record<string, string> = { colon: ':', tab: '\t', newline: '\n' }
const SPACE_CODES = new Set([0x1680, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff])

function isControl(code: number): boolean {
  return code < 0x20 || code === 0x7f
}

function isIgnored(code: number): boolean {
  return (
    code <= 0x20 ||
    (code >= 0x7f && code <= 0xa0) ||
    (code >= 0x2000 && code <= 0x200f) ||
    SPACE_CODES.has(code)
  )
}

function decodeEntity(_match: string, body: string): string {
  const key = body.toLowerCase()
  if (key in NAMED_ENTITIES) return NAMED_ENTITIES[key]
  const code = key.startsWith('#x') ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10)
  return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : ''
}

function normalize(value: string): string {
  return [...value.replace(ENTITY, decodeEntity)]
    .filter((char) => !isIgnored(char.codePointAt(0) ?? 0))
    .join('')
}

function schemeOf(value: string): string | null {
  const match = SCHEME.exec(normalize(value))
  return match ? match[1].toLowerCase() : null
}

function trimmedOf(href: string | null | undefined): string | null {
  if (typeof href !== 'string') return null
  const value = href.trim()
  if (!value || [...value].some((char) => isControl(char.charCodeAt(0)))) return null
  return value
}

export function safeHref(href: string | null | undefined): string | null {
  const value = trimmedOf(href)
  if (value === null || PROTOCOL_RELATIVE.test(normalize(value))) return null
  const scheme = schemeOf(value)
  return scheme === null || SAFE_SCHEMES.has(scheme) ? value : null
}

export function safeWebUrl(url: string | null | undefined): string | null {
  const value = safeHref(url)
  if (value === null) return null
  const scheme = schemeOf(value)
  return scheme !== null && WEB_SCHEMES.has(scheme) ? value : null
}

export function safeDownloadHref(href: string | null | undefined): string | null {
  const value = trimmedOf(href)
  if (value === null) return null
  const scheme = schemeOf(value)
  return scheme !== null && DOWNLOAD_SCHEMES.has(scheme) && /^(blob|data):/i.test(value)
    ? value
    : safeHref(value)
}
