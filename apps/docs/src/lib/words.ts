const ACRONYMS: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  cdn: 'CDN',
  cli: 'CLI',
  csv: 'CSV',
  dns: 'DNS',
  faq: 'FAQ',
  http: 'HTTP',
  ip: 'IP',
  json: 'JSON',
  mfa: 'MFA',
  rtl: 'RTL',
  sql: 'SQL',
  ssl: 'SSL',
  sso: 'SSO',
  tls: 'TLS',
  ui: 'UI',
  url: 'URL',
  waf: 'WAF'
}

function words(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => ACRONYMS[word.toLowerCase()] ?? word)
}

export function spacedTitle(value: string): string {
  return words(value).join(' ')
}

export function sentenceTitle(value: string): string {
  const acronyms = new Set(Object.values(ACRONYMS))
  return words(value)
    .map((word, at) => (at === 0 || acronyms.has(word) ? word : word.toLowerCase()))
    .join(' ')
}

export function titleCase(value: string): string {
  return value
    .split(/[-/ ]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function groupLabel(group: string): string {
  return words(titleCase(group)).join(' ')
}

const TOKEN_GROUP_TITLES: Record<string, string> = {
  bg: 'Background'
}

export function tokenGroupTitle(id: string): string {
  return TOKEN_GROUP_TITLES[id] ?? groupLabel(id)
}
