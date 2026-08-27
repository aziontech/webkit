// GLOBAL SEARCH — one index over every resource the platform holds.
//
// The ⌘K palette used to reach three things: the reader's last few resources, the rail's
// navigation, and a handful of app commands. Everything else in the account was findable
// only by first knowing which module it lived in — which is the one thing a reader who is
// searching does not know. So the palette indexes the whole platform: applications,
// workloads, domains, functions, connectors, custom pages, firewalls, WAF rule sets,
// certificates, network lists, data streams, DNS zones, buckets, databases, variables and
// teams. Sixteen types, one list, one keystroke.
//
// ── ONE MODULE, NOT SIXTEEN ──
//
// Every type is declared here as a DESCRIPTOR (below), never as a branch in the palette:
// the label the row shows, the glyph, the second line, where the row goes, which rail row
// it marks, and the words that should find it. Adding a seventeenth type is one entry in
// `KINDS` — the palette never learns about it.
//
// ── IT READS THE SAME SEEDS THE MODULES DO ──
//
// Nothing is re-seeded here. Each descriptor pulls the module's own fixture, so a name in
// the palette is the name in the list, and a row deleted from a fixture disappears from
// both. Four of those fixtures lived inside their page component until this file needed
// them (./variables.js, ./object-storage.js, ./sql-databases.js and the zones in
// ./edge-dns.js); they moved out to the same place every other module's seed already was.
//
// ── AND THROUGH THE SAME TENANCY PROJECTION ──
//
// Every module list projects its seed through the organization / account / workspace in
// force (../state/tenancy-scope.js) — so search does too, with each type's own module key.
// Search that answered from the full seed would be the loudest possible contradiction of
// that chain: the EMPTY version of the sample (../state/sample-mode.js) shows a console
// that owns nothing, and a palette listing sixty resources in it would say the empty
// account was a rendering trick. `platformResources()` is therefore called inside a
// `computed`, so switching scope re-projects the index like it re-projects a table.
//
// ── WHAT IS NOT INDEXED ──
//
//   A VARIABLE'S VALUE. Two of the seeded variables are secrets, and a palette that
//     matched on `value` would print `sk_live_…` into a result row the moment anyone typed
//     a fragment of it. The key is indexed; the value never leaves ./variables.js.
//   DEPLOYMENTS AND EVENTS. A deployment is a record of something that happened, not a
//     resource the account owns, and it is identified by a commit rather than a name —
//     "find every resource" is a question about the inventory, and the Deployments module
//     is one row of the navigation group above.
//   ANYTHING WITHOUT A DESTINATION. A result that navigates nowhere is worse than one that
//     is absent, so every descriptor states a `path` and the palette drops rows whose path
//     comes back empty.
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

/**
 * The four types Overview already normalizes (./home-resources.js) carry their own type
 * facts, so search reads them rather than restating them. `navId` is the rail row each one
 * marks: a domain has no detail view here, so it lands on the workload that serves it and
 * marks Workloads with it.
 */
const HOME_NAV = {
  applications: 'applications',
  workloads: 'workloads',
  domains: 'workloads',
  functions: 'functions'
}

/**
 * Every indexed type, in the order the palette lists ties.
 *
 * A descriptor answers seven questions about a type and nothing else:
 *
 *   rows()      the module's own seed
 *   scope       the tenancy module key it is projected through (../state/tenancy-scope.js),
 *               or `null` for a resource that lives above the workspace
 *   settings    true when the type has no detail view of its own and is read at the
 *               GENERATED settings page (`/<module>/<id>/settings`, ./create-resources.js).
 *               The path and the `?name=` it opens on are then derived, so the descriptor
 *               states neither.
 *   typeLabel   the singular the result row's suffix shows
 *   icon        the glyph, the same one the rail and the module list use
 *   navId       the rail row a result marks when it is chosen
 *   keywords    the words that should find it beyond its own name and second line
 *   entry(row)  name, second line, where the row goes, and what it HANDS OVER. This
 *               prototype stores nothing, so several detail views title themselves from
 *               what the row that opened them passed (`?name=`, and Edge DNS also
 *               `?domain=`). Search passes exactly what the module list passes, so a
 *               resource opened from the palette reads like one opened from its own table.
 */
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
    // The one rail row whose id is not its module key — Secure › Certificate Manager.
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
      // A bucket's id IS its name — the browser is keyed by it everywhere in the module.
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
    // A variable has no detail view: it is created and edited as a row in its own module,
    // so the module list IS where it lives, and that is where the result lands.
    entry: (row) => ({
      name: row.key,
      subtitle: row.secret ? 'Secret' : 'Plain text',
      path: '/variables'
    })
  },
  {
    id: 'teams',
    rows: () => teams.value,
    // Teams are an ACCOUNT resource — they exist above the workspace the rest of this
    // index is projected through, so they are indexed whole. `tenancyRows` is not called
    // for them and `scope` is deliberately absent.
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

/** Lowercased, collapsed — the one normalization both the index and the query pass through. */
const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

/**
 * One indexed row.
 *
 * `haystack` is everything a reader could type to reach this row — its name, its second
 * line, its type, that type's synonyms, and its id — normalized into one string. It is
 * both what this module matches against AND what the palette renders into the row
 * (hidden), because `CommandMenu.Item` filters itself on its own text: a row matched here
 * on its subtitle would otherwise be hidden again by the palette. Rendering the WHOLE
 * haystack, contiguously, is what makes the two agree — a query that straddles the name
 * and the second line would miss a DOM where those sit in different text nodes, and the
 * result count would then disagree with the list under it. See the `Resources` group in
 * ../../components/shell/AppSidebar.vue.
 */
const toEntry = (kind, row) => {
  const fields = kind.entry(row)
  const path = kind.settings ? resourceSettingsPath(kind.id, row.id) : fields.path
  if (!path) return null
  const terms = [fields.subtitle, kind.typeLabel, kind.keywords, row.id].filter(Boolean).join(' ')
  return {
    // Unique across types: two modules can and do seed the same numeric id.
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

/** What each Overview type hands its destination — the same thing its module list does. */
const HOME_QUERY = {
  workloads: (row) => ({ name: row.name }),
  domains: (row, servedBy) => ({ name: servedBy.get(row.path) })
}

/**
 * The four types ./home-resources.js already normalizes, projected through tenancy.
 *
 * DOMAINS FOLLOW THEIR WORKLOAD rather than being partitioned on their own. A domain row
 * IS a workload's primary domain — same page, same status, same timestamp — so a scope
 * that owns the workload owns the domain, and one that does not must not list a domain
 * pointing at a workload it cannot open. Projecting them separately would also poison the
 * `workloads` partition: `tenancyRows` remembers the ids it first saw under a module key,
 * and a domain's id (`domain-<id>`) is not its workload's.
 */
function homeEntries() {
  const rows = allResources()
  const byType = (type) => rows.filter((row) => row.type === type)

  const applications = tenancyRows(byType('applications'), 'applications')
  const workloads = tenancyRows(byType('workloads'), 'workloads')
  const functions = tenancyRows(byType('functions'), 'functions')
  // A domain row's `path` IS its workload's, so the workload it belongs to is the one it
  // points at — and that workload's NAME is what its detail view titles itself with. A
  // domain card overwrites `name` with the hostname (./home-resources.js), so the name is
  // recovered here rather than parsed back out of the row's second line.
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
        // An application reads its record from the route param and a function is looked
        // up by id, so neither hands anything over. A WORKLOAD titles itself from
        // `?name=` (there is no workload endpoint to read from), and a domain opens that
        // same page — under the workload's name, never the hostname it was found by.
        query: HOME_QUERY[row.type]?.(row, servedBy) ?? {},
        haystack: normalize(`${row.name} ${terms}`),
        modifiedAt: row.modifiedAt ?? null
      }
    })
}

/**
 * Every resource the account owns in the scope in force, across all sixteen types.
 *
 * Call it inside a `computed` — it reads the tenancy stores and the teams store, so the
 * index re-projects when the operator switches organization, account or workspace, and
 * picks up a team the moment one is created.
 */
export function platformResources() {
  const rest = KINDS.flatMap((kind) => {
    const rows = kind.scope ? tenancyRows(kind.rows(), kind.scope) : kind.rows()
    return rows.map((row) => toEntry(kind, row)).filter(Boolean)
  })
  return [...homeEntries(), ...rest]
}

// Where the query landed, best first. The rank is what makes an exact name beat a row
// that merely mentions it in its second line — typing `storefront` should not put a
// firewall named after it above the workload itself.
const RANK = { exact: 0, prefix: 1, word: 2, name: 3, terms: 4, miss: 5 }

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function rankOf(entry, query) {
  const name = normalize(entry.name)
  if (name === query) return RANK.exact
  if (name.startsWith(query)) return RANK.prefix
  // A word start: `pages` finds `Branded 404 pages`, `prod` finds `edgeflow-production`.
  // Word boundaries include the separators resource names actually use (`-`, `_`, `.`).
  if (new RegExp(`[\\s\\-_./]${escapeForRegExp(query)}`).test(name)) return RANK.word
  if (name.includes(query)) return RANK.name
  if (entry.haystack.includes(query)) return RANK.terms
  return RANK.miss
}

const newest = (entry) => (entry.modifiedAt ? new Date(entry.modifiedAt).getTime() : 0)

/**
 * The platform's resources that match `term`, best first, capped at `limit`.
 *
 * ONE SUBSTRING, NOT A TOKEN SET. The Command Menu filters every item it renders on its
 * own text (a plain case-insensitive `includes`), so a matcher that accepted `prod api`
 * for a row reading `api-primary … Production` would return rows the palette then hides —
 * a result count that disagrees with the list under it. Matching the same way the palette
 * does keeps the two honest; the RANK above is what makes it feel like more than
 * `includes`.
 *
 * Returns `{ rows, total }` — `total` is how many matched before the cap, so the palette
 * can say what it is not showing instead of silently truncating.
 */
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
