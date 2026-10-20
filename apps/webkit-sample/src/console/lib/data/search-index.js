import { tenancyRows } from '../state/tenancy-scope'
import { CERTIFICATES } from './certificates'
import { connectorMeta, CONNECTORS } from './connectors'
import { resourceSettingsPath } from './create-resources'
import { CUSTOM_PAGES } from './custom-pages'
import { DATA_STREAMS, streamEndpointLabel, streamSourceLabel } from './data-streams'
import { DNS_ZONES } from './edge-dns'
import { FIREWALLS } from './firewalls'
import { allResources } from './home-resources'
import { NETWORK_LISTS, networkListTypeLabel } from './network-lists'
import { BUCKETS } from './object-storage'
import { SQL_DATABASES } from './sql-databases'
import { useTeams } from './teams'
import { VARIABLES } from './variables'
import { WAF_RULES } from './waf-rules'

const { teams } = useTeams()

const HOME_NAV = {
  applications: 'applications',
  workloads: 'workloads',
  domains: 'workloads',
  functions: 'functions'
}

const KINDS = [
  {
    id: 'connectors',
    settings: true,
    rows: () => CONNECTORS,
    scope: 'connectors',
    typeLabel: 'Connector',
    icon: 'ai ai-edge-connectors',
    navId: 'connectors',
    keywords: 'connector origin',
    entry: (row) => ({
      name: row.name,
      subtitle: `${connectorMeta(row.type).label} · ${row.address}`
    })
  },
  {
    id: 'custom-pages',
    settings: true,
    rows: () => CUSTOM_PAGES,
    scope: 'custom-pages',
    typeLabel: 'Custom Page',
    icon: 'ai ai-custom-pages',
    navId: 'custom-pages',
    keywords: 'custom page error response',
    entry: (row) => ({
      name: row.name,
      subtitle: `HTTP ${row.statuses.join(', ')} · ${row.connector}`
    })
  },
  {
    id: 'firewall',
    settings: true,
    rows: () => FIREWALLS,
    scope: 'firewall',
    typeLabel: 'Firewall',
    icon: 'ai ai-edge-firewall',
    navId: 'firewall',
    keywords: 'firewall security ddos',
    entry: (row) => ({
      name: row.name,
      subtitle: `${row.environment} · ${row.rules} rule${row.rules === 1 ? '' : 's'}`
    })
  },
  {
    id: 'waf-rules',
    settings: true,
    rows: () => WAF_RULES,
    scope: 'waf-rules',
    typeLabel: 'WAF Rule Set',
    icon: 'ai ai-waf-rules',
    navId: 'waf-rules',
    keywords: 'waf rule set security',
    entry: (row) => ({
      name: row.name,
      subtitle: `${row.mode} · ${row.sensitivity} sensitivity`
    })
  },
  {
    id: 'certificates',
    settings: true,
    rows: () => CERTIFICATES,
    scope: 'certificates',
    typeLabel: 'Certificate',
    icon: 'ai ai-digital-certificates',
    navId: 'certificate-manager',
    keywords: 'certificate tls ssl',
    entry: (row) => ({
      name: row.name,
      subtitle: `${row.typeLabel} · ${row.subject}`
    })
  },
  {
    id: 'network-lists',
    settings: true,
    rows: () => NETWORK_LISTS,
    scope: 'network-lists',
    typeLabel: 'Network List',
    icon: 'ai ai-network-lists',
    navId: 'network-lists',
    keywords: 'network list allowlist blocklist',
    entry: (row) => ({
      name: row.name,
      subtitle: `${networkListTypeLabel(row.type)} · ${row.entries} ${
        row.entries === 1 ? 'entry' : 'entries'
      }`
    })
  },
  {
    id: 'data-stream',
    settings: true,
    rows: () => DATA_STREAMS,
    scope: 'data-stream',
    typeLabel: 'Data Stream',
    icon: 'ai ai-data-stream',
    navId: 'data-stream',
    keywords: 'data stream logs',
    entry: (row) => ({
      name: row.name,
      subtitle: `${streamSourceLabel(row.source)} → ${streamEndpointLabel(row.endpoint)}`
    })
  },
  {
    id: 'edge-dns',
    rows: () => DNS_ZONES,
    scope: 'edge-dns',
    typeLabel: 'DNS Zone',
    icon: 'ai ai-edge-dns',
    navId: 'edge-dns',
    keywords: 'dns zone records nameserver',
    entry: (row) => ({
      name: row.name,
      subtitle: row.domain,
      path: `/edge-dns/${row.id}`,
      query: { name: row.name, domain: row.domain }
    })
  },
  {
    id: 'object-storage',
    rows: () => BUCKETS,
    scope: 'object-storage',
    typeLabel: 'Bucket',
    icon: 'ai ai-edge-storage',
    navId: 'object-storage',
    keywords: 'bucket object storage',
    entry: (row) => ({
      name: row.name,
      subtitle: `${row.access} · ${row.objects.toLocaleString()} objects · ${row.size}`,
      path: `/object-storage/${row.id}`,
      query: { name: row.name }
    })
  },
  {
    id: 'sql-database',
    rows: () => SQL_DATABASES,
    scope: 'sql-database',
    typeLabel: 'Database',
    icon: 'ai ai-edge-sql',
    navId: 'sql-database',
    keywords: 'sql database tables',
    entry: (row) => ({
      name: row.name,
      subtitle: `${row.status} · ${row.tables} table${row.tables === 1 ? '' : 's'}`,
      path: `/sql-database/${row.id}`,
      query: { name: row.name }
    })
  },
  {
    id: 'variables',
    rows: () => VARIABLES,
    scope: 'variables',
    typeLabel: 'Variable',
    icon: 'ai ai-variables',
    navId: 'variables',
    keywords: 'variable environment secret',
    entry: (row) => ({
      name: row.key,
      subtitle: row.secret ? 'Secret' : 'Plain text',
      path: '/variables'
    })
  },
  {
    id: 'teams',
    rows: () => teams.value,
    scope: null,
    typeLabel: 'Team',
    icon: 'pi pi-users',
    navId: 'settings-teams',
    keywords: 'team permissions access',
    entry: (row) => ({
      name: row.name,
      subtitle: row.description,
      path: `/teams/${row.id}`
    })
  }
]

const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const toEntry = (kind, row) => {
  const fields = kind.entry(row)
  const path = kind.settings ? resourceSettingsPath(kind.id, row.id) : fields.path
  if (!path) return null
  const terms = [fields.subtitle, kind.typeLabel, kind.keywords, row.id].filter(Boolean).join(' ')
  return {
    key: `${kind.id}/${row.id}`,
    name: fields.name,
    subtitle: fields.subtitle ?? '',
    typeLabel: kind.typeLabel,
    icon: kind.icon,
    navId: kind.navId,
    path,
    query: kind.settings ? { name: fields.name } : (fields.query ?? {}),
    haystack: normalize(`${fields.name} ${terms}`),
    modifiedAt: row.modifiedAt ?? null
  }
}

const HOME_QUERY = {
  workloads: (row) => ({ name: row.name }),
  domains: (row, servedBy) => ({ name: servedBy.get(row.path) })
}

function homeEntries() {
  const rows = allResources()
  const byType = (type) => rows.filter((row) => row.type === type)

  const applications = tenancyRows(byType('applications'), 'applications')
  const workloads = tenancyRows(byType('workloads'), 'workloads')
  const functions = tenancyRows(byType('functions'), 'functions')
  const servedBy = new Map(workloads.map((row) => [row.path, row.name]))
  const domains = byType('domains').filter((row) => servedBy.has(row.path))

  return [...applications, ...workloads, ...domains, ...functions]
    .filter((row) => row.path)
    .map((row) => {
      const terms = [row.subtitle, row.typeLabel, row.id].filter(Boolean).join(' ')
      return {
        key: `${row.type}/${row.id}`,
        name: row.name,
        subtitle: row.subtitle ?? '',
        typeLabel: row.typeLabel,
        icon: row.icon,
        navId: HOME_NAV[row.type] ?? '',
        path: row.path,
        query: HOME_QUERY[row.type]?.(row, servedBy) ?? {},
        haystack: normalize(`${row.name} ${terms}`),
        modifiedAt: row.modifiedAt ?? null
      }
    })
}

export function platformResources() {
  const rest = KINDS.flatMap((kind) => {
    const rows = kind.scope ? tenancyRows(kind.rows(), kind.scope) : kind.rows()
    return rows.map((row) => toEntry(kind, row)).filter(Boolean)
  })
  return [...homeEntries(), ...rest]
}

const RANK = { exact: 0, prefix: 1, word: 2, name: 3, terms: 4, miss: 5 }

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function rankOf(entry, query) {
  const name = normalize(entry.name)
  if (name === query) return RANK.exact
  if (name.startsWith(query)) return RANK.prefix
  if (new RegExp(`[\\s\\-_./]${escapeForRegExp(query)}`).test(name)) return RANK.word
  if (name.includes(query)) return RANK.name
  if (entry.haystack.includes(query)) return RANK.terms
  return RANK.miss
}

const newest = (entry) => (entry.modifiedAt ? new Date(entry.modifiedAt).getTime() : 0)

export function searchPlatform(term, limit = 8) {
  const query = normalize(term)
  if (!query) return { rows: [], total: 0 }

  const matched = []
  for (const entry of platformResources()) {
    const rank = rankOf(entry, query)
    if (rank !== RANK.miss) matched.push({ entry, rank })
  }

  matched.sort(
    (a, b) =>
      a.rank - b.rank ||
      newest(b.entry) - newest(a.entry) ||
      a.entry.name.localeCompare(b.entry.name)
  )

  return { rows: matched.slice(0, limit).map((match) => match.entry), total: matched.length }
}
