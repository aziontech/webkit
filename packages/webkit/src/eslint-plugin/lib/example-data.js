const TLD = '(?:com\\.br|com|net|org|io|app|dev|co|cloud|ai|br|xyz)'

const DOMAIN = new RegExp(`(?<![\\w.-])(?:[a-z0-9-]+\\.)+${TLD}(?![\\w-]|\\.\\w)`, 'gi')

const RESERVED = /(?:^|\.)example\.(?:com|net|org)$/i

const EXAMPLE_DATA_ALLOWED_HOSTS = [
  'azion.com',
  'azion.app',
  'azionedge.net',
  'aziondns.net',
  'aziondns.com',
  'aziondns.org',
  'github.com',
  'githubusercontent.com',
  'npmjs.com',
  'npmjs.org',
  'w3.org',
  'schema.org',
  'x.com',
  'twitter.com',
  'linkedin.com',
  'youtube.com',
  'instagram.com',
  'facebook.com',
  'discord.com',
  'discord.gg',
  'reddit.com',
  'creativecommons.org',
  'figma.com',
  'opencode.ai',
  'monashees.com',
  'qualcommventures.com',
  'vanta.com'
]

export const EXAMPLE_DATA_DIRS = [
  'packages/webkit/src',
  'packages/webkit/blocks',
  'packages/webkit/examples',
  'skills',
  'rules'
]

export const RETIRED_NAME_DIRS = ['.specs', 'apps/demos/src', 'apps/docs/src']

export function exampleDataApplies(rel) {
  if (!/\.(vue|ts|js|mjs|json|md)$/.test(rel) || rel.endsWith('.d.ts')) return false
  if (/\.(test|spec)\.|\/(test|__tests__|fixtures)\//.test(rel)) return false
  if (/\/locales\/(pt-BR|es)\b/.test(rel)) return false
  if (rel.endsWith('/eslint-plugin/lib/example-data.js')) return false
  if (rel === 'rules/webkit-example-data.md') return false
  if (rel === 'skills/webkit-microcopy/SKILL.md') return false
  if (rel === 'rules/webkit-site-pages.md') return false
  if (rel.endsWith('/phone-input/lib/country-data.ts')) return false
  return !rel.endsWith('/assets/logos/SOURCES.md')
}

const allowedHost = (host) =>
  RESERVED.test(host) ||
  EXAMPLE_DATA_ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))

const REGIONAL = [
  /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g,
  /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g,
  /\b\d{5}-\d{3}\b/g,
  /\+55\b/g,
  /\b(?:CPF|CNPJ)\b/g,
  /R\$\s?\d/g,
  /\b(?:Rua|Avenida)\s\p{Lu}/gu
]

const INVENTED_BRAND = /\b(?:edgeflow|contoso|globex|initech|hooli)\b/gi

export const RETIRED_PRODUCT_NAMES = [
  'Edge Application',
  'Edge Firewall',
  'Edge Connector',
  'Real-Time Manager',
  'Edge AI',
  'Application Acceleration',
  'Edge Cache',
  'Edge Functions',
  'Image Processing',
  'Edge Orchestrator',
  'Edge KV',
  'Edge Storage',
  'Edge SQL',
  'Network Layer Protection',
  'Data Streaming'
]

const CACHE_LAYER_NAME = 'Edge Cache'

const retiredForm = (name) => {
  const stem = name.replace(/s$/, '')
  if (!name.startsWith('Edge ') || name === CACHE_LAYER_NAME) return `${stem}s?`
  const rest = stem.slice(5).replace(/^\w/, (c) => `[${c}${c.toLowerCase()}]`)
  return `[Ee]dge[ -]${rest}s?`
}

const RETIRED_PRODUCT = new RegExp(
  `(?<![-\\w])(?:${RETIRED_PRODUCT_NAMES.map(retiredForm).join('|')})\\b`,
  'g'
)

export const EXAMPLE_DATA_MESSAGES = {
  'retired-product-name':
    'Retired Azion product name in sample data. Use the official name (Functions, SQL Database, ' +
    'Cache, Applications, Firewall, Object Storage, KV Store...): the map is deprecatedNames in ' +
    'test/catalog/azion-products.json (rules/webkit-example-data.md).',
  'invented-brand':
    "Invented company brand in sample data. The one sample company is Acme (shadcn's " +
    'placeholder), on example.com domains; resources are named for what they are (production, ' +
    'site-assets) (rules/webkit-example-data.md).',
  domain:
    'Sample data uses a reserved domain: example.com, example.org or example.net and their ' +
    'subdomains (RFC 2606), e.g. m@example.com. Real hosts are allowed only as links to the real ' +
    'resource (rules/webkit-example-data.md).',
  'regional-format':
    'Sample data in a national format (CPF, CNPJ, CEP, +55, R$, a Brazilian street). Use the ' +
    'neutral house format: fictional US data (+1 555-01xx, a US address, USD) and no national ID ' +
    'masks (rules/webkit-example-data.md).'
}

export function scanRetiredNames(content) {
  return [...content.matchAll(RETIRED_PRODUCT)].map(() => 'retired-product-name')
}

export function scanExampleData(content) {
  const found = []
  for (const match of content.matchAll(DOMAIN)) {
    const host = match[0].toLowerCase()
    if (!allowedHost(host)) found.push('domain')
  }
  for (const _ of content.matchAll(INVENTED_BRAND)) found.push('invented-brand')
  found.push(...scanRetiredNames(content))
  for (const re of REGIONAL) for (const _ of content.matchAll(re)) found.push('regional-format')
  return found
}
