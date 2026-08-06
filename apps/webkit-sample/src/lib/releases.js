// Releases — the vocabulary behind "Review and deploy" (../components/ReleaseComposer.vue).
//
// WHAT A DEPLOYMENT SETTING IS, and where it comes from: it is the STRATEGY authored in
// ../components/ui/DeploymentSettingsDrawer.vue and listed by the Deployments module's
// Settings tab. There is exactly one of those in this sample (./deployment-strategies.js)
// and this module does NOT keep a second copy of it — it PROJECTS that store into the
// shape the composer needs. Author a setting in the drawer and it is a deploy target here
// on the next render; delete it there and it is gone from here too.
//
// That projection is the whole reason this file is short on fixtures and long on
// derivation. Three facts come from stores this sample already owns:
//
//   the settings      ./deployment-strategies.js — name, status, and what it BINDS
//                     (an application, optionally a firewall and a custom page)
//   the workloads     ./workloads.js — the things that publish, with their domains
//   what is serving   ./deployment-history.js — each workload's CURRENT deployment, which
//                     names the application it serves and the environment it serves in
//
// What this module adds is the half a RELEASE needs and a deployment record does not
// carry: VERSIONS, and the dependency graph of a version (the Functions, Connectors,
// Network Lists and WAF rules a resource references). Those have no store in the sample —
// Functions, Connectors, Network Lists and WAF Rules are nav-only — so they are derived
// here, deterministically from the resource's own name, and stay stable across renders.
//
// A release therefore reads: for each resource a Deployment setting binds, which VERSION
// of it goes out, plus the versions of everything those resources reference.
import { computed } from 'vue'

import { APPLICATIONS } from './applications'
import { daysAgo, hoursAgo } from './dates'
import { DEPLOYMENT_HISTORY } from './deployment-history'
import { CUSTOM_PAGE_OPTIONS, FIREWALL_OPTIONS, strategies } from './deployment-strategies'
import { authorAt } from './people'
import { provisionedApplications } from './provisioning'
import { WORKLOADS } from './workloads'

// ── Vocabulary ──────────────────────────────────────────────────────────────
// `label` names the ENTITY (a heading, a card title, a Console page) and keeps its
// capitalization. `one` / `many` are the same thing as a NOUN inside a sentence, which is
// a separate string on purpose: lowercasing a label works for "Connectors" and produces
// "waf" for WAF, and trimming a trailing "s" gives "custom page" from "Custom Pages" but
// nonsense from anything irregular. Two fields, no string surgery at the call site.
export const RESOURCE_META = {
  application: {
    label: 'Application',
    one: 'application',
    many: 'applications',
    icon: 'ai ai-edge-application'
  },
  firewall: { label: 'Firewall', one: 'firewall', many: 'firewalls', icon: 'ai ai-edge-firewall' },
  custom_page: {
    label: 'Custom Pages',
    one: 'custom page',
    many: 'custom pages',
    icon: 'ai ai-custom-pages'
  },
  function: { label: 'Functions', one: 'function', many: 'functions', icon: 'ai ai-edge-functions' },
  connector: {
    label: 'Connectors',
    one: 'connector',
    many: 'connectors',
    icon: 'ai ai-edge-connectors'
  },
  network_list: {
    label: 'Network Lists',
    one: 'network list',
    many: 'network lists',
    icon: 'ai ai-network-lists'
  },
  waf: { label: 'WAF', one: 'WAF rule', many: 'WAF rules', icon: 'ai ai-waf-rules' }
}

/** Label for a resource type, falling back to the raw value. */
export const resourceLabel = (type) => RESOURCE_META[type]?.label ?? type

/** The type as a singular noun inside a sentence ("Add a connector"). */
export const resourceNoun = (type) => RESOURCE_META[type]?.one ?? type

/** The type as a plural noun inside a sentence ("references no network lists"). */
export const resourceNounPlural = (type) => RESOURCE_META[type]?.many ?? type

/** Glyph for a resource type, falling back to the generic box. */
export const resourceIcon = (type) => RESOURCE_META[type]?.icon ?? 'pi pi-box'

/**
 * The three resources a Deployment setting binds — `strategy.attributes` in the request
 * body — and therefore the three a release carries a version of.
 */
export const SINGLETON_TYPES = ['application', 'firewall', 'custom_page']

/**
 * The two a release may leave out. They are the two NULLABLE attributes of the strategy;
 * an application is what a workload exists to serve, so it has no switch.
 */
export const OPTIONAL_SINGLETON_TYPES = ['firewall', 'custom_page']

/** The strategy attribute each singleton type reads from. */
export const BINDING_KEY = {
  application: 'application',
  firewall: 'firewall',
  custom_page: 'customPage'
}

/**
 * Which dependency types each parent can own. A firewall references Functions, Network
 * Lists and WAF rules; a custom page only Connectors. `included` is the parent of the
 * dependencies a Function reaches at runtime, which no detector can see.
 */
export const OWNED_DEPENDENCIES = {
  application: ['function', 'connector'],
  firewall: ['function', 'network_list', 'waf'],
  custom_page: ['connector'],
  included: ['connector', 'network_list']
}

/** The parent key of the dependencies the operator includes by hand. */
export const INCLUDED_PARENT = 'included'

/**
 * The sentinel that tracks whatever the newest Ready version is instead of pinning one. It
 * resolves at deploy time, so a release composed today still deploys the version that is
 * Ready when it runs.
 */
export const LATEST_READY = 'LATEST'

/** Dependency versions must be `ready`; a singleton may also deploy the serving `active` one. */
const DEPENDENCY_TYPES = ['function', 'connector', 'network_list', 'waf']

// ── The resource catalogs ───────────────────────────────────────────────────
// Resources are keyed by NAME, because a Deployment setting binds them by name
// (`attributes: { application, firewall, custom_page }`). Keeping the release's key the
// same as the strategy's means a binding never has to be translated, and a rename cannot
// leave the two disagreeing.
//
// The first three come from the sample's own stores. The four dependency types have no
// store — those Console pages are nav-only here — so they are seeded below.
const DEPENDENCY_CATALOG = {
  function: ['image-optimizer', 'auth-gateway', 'ab-router', 'geo-redirect', 'rate-limiter'],
  connector: ['origin-storefront', 'assets-bucket', 'payments-api', 'search-index'],
  network_list: ['allowlist-office', 'blocklist-abuse', 'allowlist-partners'],
  waf: ['waf-owasp-core', 'waf-api-strict']
}

const applicationNames = computed(() => [
  ...provisionedApplications.value.map((application) => application.name),
  ...APPLICATIONS.map((application) => application.name)
])

const namesFor = (type) => {
  if (type === 'application') return applicationNames.value
  if (type === 'firewall') return FIREWALL_OPTIONS.map((option) => option.value)
  if (type === 'custom_page') return CUSTOM_PAGE_OPTIONS.map((option) => option.value)
  return DEPENDENCY_CATALOG[type] ?? []
}

/** Every resource of a type, as `{ id, name }` where the id IS the name. */
export const catalogFor = (type) => namesFor(type).map((name) => ({ id: name, name }))

/** Select options for a resource of a given type. */
export const resourceOptions = (type) =>
  namesFor(type).map((name) => ({ value: name, label: name }))

/** The display name of a resource. Names are the keys, so this is the identity. */
export const resourceName = (type, id) => id ?? ''

// ── Versions, derived from the resource name ────────────────────────────────
// A version id reads the way the platform prints it: a short handle a support thread can
// quote. Everything about a resource's versions is a pure function of its NAME, memoized,
// so the same resource shows the same history on every surface and across renders.
const hash = (value) => {
  let total = 0
  for (let index = 0; index < value.length; index += 1) {
    total = (total * 31 + value.charCodeAt(index)) % 100_003
  }
  return total
}

const COMMENTS = [
  'feat: cart drawer',
  'fix: hydration on PDP',
  'chore: bump runtime',
  'perf: avif first',
  'fix: retry budget',
  'rules: block scrapers',
  'copy: 503 rewrite',
  'feat: signed urls',
  'sync: threat feed',
  'refactor: drop legacy shim'
]

/**
 * Resources whose only version is unusable, so they carry NO deployable version. Composing
 * one blocks the deploy, which is a state the screen has to render rather than a state it
 * hopes never happens. `legacy-api` is the sample's own retired application.
 */
export const NO_READY_VERSION = new Set(['legacy-api'])

/**
 * Resources whose FIRST dependency detection fails. The console cannot promise a detector
 * never breaks, so one seeded resource makes the error panel and its Retry real.
 */
export const DETECTION_FAILS_ONCE = new Set(['analytics-pro'])

const versionCache = new Map()

const buildVersions = (name) => {
  const seed = hash(name)
  if (NO_READY_VERSION.has(name)) {
    return [
      {
        id: `A${(seed * 7).toString(36).toUpperCase().slice(0, 6)}`,
        comment: 'refactor: drop legacy shim',
        state: 'error',
        isCurrent: false,
        createdAt: daysAgo(9 + (seed % 40)),
        author: authorAt(seed).name
      }
    ]
  }

  const count = 1 + (seed % 3)
  return Array.from({ length: count }, (_, index) => {
    const step = seed + index * 977
    const hours = 3 + (step % 300)
    return {
      id: `A${(step * 7919).toString(36).toUpperCase().slice(0, 6)}`,
      comment: COMMENTS[(step + index) % COMMENTS.length],
      state: 'ready',
      // The newest version is what the resource is serving today.
      isCurrent: index === 0,
      createdAt: hours < 48 ? hoursAgo(hours) : daysAgo(Math.round(hours / 24)),
      author: authorAt(step).name
    }
  })
}

const versionsOf = (name) => {
  if (!name) return []
  if (!versionCache.has(name)) versionCache.set(name, buildVersions(name))
  return versionCache.get(name)
}

/**
 * The versions of a resource that can be deployed: `ready` (plus the serving `active` one)
 * for a bound resource, `ready` only for a dependency — an `active` dependency is one
 * already serving elsewhere, and pinning it here would tie two releases together.
 */
export const versionOptions = (type, id) => {
  const states = DEPENDENCY_TYPES.includes(type) ? ['ready'] : ['ready', 'active']
  return versionsOf(id)
    .filter((entry) => states.includes(entry.state))
    .map((entry) => ({
      value: entry.id,
      label: entry.comment || entry.id,
      createdAt: entry.createdAt,
      author: entry.author,
      isCurrent: entry.isCurrent
    }))
}

/** Whether a resource has anything deployable at all. */
export const hasDeployableVersion = (type, id) => versionOptions(type, id).length > 0

/**
 * What `LATEST_READY` resolves to right now: the version flagged current, else the newest
 * deployable one, else nothing — which is what makes the deploy gate honest.
 */
export const resolveLatestVersion = (type, id) => {
  const options = versionOptions(type, id)
  return options.find((option) => option.isCurrent)?.value ?? options[0]?.value ?? null
}

// ── The dependency graph, derived from the resource name ────────────────────
// Which dependencies a resource references. This is what the screen DETECTS rather than
// asks: the operator picked a version, and these came with it. Derived from the name (the
// same memoized-by-name discipline as versions), so overlaps between an application and a
// custom page happen naturally — and an overlap is a SHARED dependency, which is the case
// the release has to get right.
const graphCache = new Map()

const buildGraph = (name) => {
  const seed = hash(name)
  const pick = (type, offset, count) => {
    const pool = DEPENDENCY_CATALOG[type]
    return Array.from(
      { length: Math.min(count, pool.length) },
      (_, index) => pool[(seed + offset + index * 2) % pool.length]
    )
  }
  return {
    function: pick('function', 0, 1 + (seed % 2)),
    connector: pick('connector', 3, 1 + ((seed >> 2) % 2)),
    network_list: pick('network_list', 5, 1 + (seed % 2)),
    waf: pick('waf', 7, 1)
  }
}

const graphOf = (name) => {
  if (!name) return { function: [], connector: [], network_list: [], waf: [] }
  if (!graphCache.has(name)) graphCache.set(name, buildGraph(name))
  return graphCache.get(name)
}

/** The dependencies a resource references, as `{ [type]: [name] }`, for one parent type. */
export const dependenciesOf = (parentType, resourceId) => {
  const graph = graphOf(resourceId)
  return Object.fromEntries(
    (OWNED_DEPENDENCIES[parentType] ?? []).map((type) => [type, [...(graph[type] ?? [])]])
  )
}

// ── Workloads ↔ Deployment settings ─────────────────────────────────────────
// A workload publishes with a Deployment setting: the strategy its deployment applied. The
// sample's deployment records do not carry that field, so the binding is DERIVED here —
// deterministically from the workload's position, over the SEEDED strategy ids, which are
// stable constants. One function, and its inverse below, so the two directions can never
// disagree.
//
// Authored settings (and Azion Default) start bound to NOTHING: a setting reaches no
// workload until a deployment applies it. That is what makes the composer's empty-impact
// state real rather than theoretical.
const SEEDED_SETTINGS_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10']

/**
 * The Deployment settings a workload already deploys with, in order. Every third workload
 * publishes into two of them (one per environment), which is the case that makes deploying
 * a workload a multi-target action.
 */
export const settingsIdsForWorkload = (workloadId) => {
  const index = WORKLOADS.findIndex((workload) => workload.id === String(workloadId))
  if (index < 0) return []
  const primary = SEEDED_SETTINGS_IDS[index % SEEDED_SETTINGS_IDS.length]
  if (index % 3 !== 0) return [primary]
  return [primary, SEEDED_SETTINGS_IDS[(index + 4) % SEEDED_SETTINGS_IDS.length]]
}

/** The inverse: the workloads that deploy with a given Deployment setting. */
export const workloadsForSettings = (settingsId) =>
  WORKLOADS.filter((workload) => settingsIdsForWorkload(workload.id).includes(settingsId))

/**
 * What a workload is serving right now: its CURRENT deployment record. Slot 0 of a
 * workload's history is the application deployment, so this names the application the
 * workload serves and the environment it serves in (./deployment-history.js).
 */
export const currentDeploymentFor = (workloadId) =>
  DEPLOYMENT_HISTORY.find(
    (deployment) => deployment.workloadId === String(workloadId) && deployment.current
  )

/** The application a workload is serving, or `''` for one with no history. */
export const servingApplication = (workloadId) => {
  const current = currentDeploymentFor(workloadId)
  if (current?.resourceType !== 'application') return ''
  // The record names the resource; a release binds it by that same name.
  return current.resourceName
}

// ── The projection: Deployment settings as deploy targets ───────────────────
/**
 * Every Deployment setting, in the shape the composer needs: the strategy's own identity
 * and bindings, plus the blast radius derived from the workloads that deploy with it.
 *
 * A computed over the strategy store, so authoring a setting in the drawer adds a target
 * here and deleting one removes it.
 */
export const deploymentSettings = computed(() =>
  strategies.value.map((strategy) => {
    const workloads = workloadsForSettings(strategy.id).map((workload) => ({
      id: workload.id,
      name: workload.name,
      domains: workload.domains.slice(0, 1 + (hash(workload.name) % 3)),
      environment: currentDeploymentFor(workload.id)?.environment || 'Production'
    }))

    const environmentNames = [...new Set(workloads.map((workload) => workload.environment))]

    return {
      id: strategy.id,
      name: strategy.name,
      status: strategy.status,
      system: Boolean(strategy.system),
      // `strategy.attributes` — an empty application means "whatever is being deployed".
      bindings: {
        application: strategy.application || '',
        firewall: strategy.firewall || '',
        customPage: strategy.customPage || ''
      },
      workloads,
      environmentNames,
      workloadsCount: workloads.length,
      domainsCount: workloads.reduce((total, workload) => total + workload.domains.length, 0)
    }
  })
)

/** One projected Deployment setting by id. */
export const settingsById = (id) =>
  deploymentSettings.value.find((settings) => settings.id === String(id))

/**
 * What a setting binds, as one line. Only what it ACTUALLY binds: an unpinned application
 * and an unbound firewall are the common, unremarkable case, and printing "not bound" on
 * every row is a caveat repeated until the reader stops seeing any of it. A setting that
 * binds nothing beyond the application says so, once, in its own row.
 */
export const bindingsLine = (settings) => {
  if (!settings) return ''
  const parts = []
  if (settings.bindings.application) parts.push(`Application: ${settings.bindings.application}`)
  if (settings.bindings.firewall) parts.push(`Firewall: ${settings.bindings.firewall}`)
  if (settings.bindings.customPage) parts.push(`Custom Page: ${settings.bindings.customPage}`)
  return parts.length ? parts.join(' · ') : 'Binds no firewall or custom page'
}

/**
 * The Deployment settings a WORKLOAD entry lands on, already selected. Deploying a workload
 * means deploying into what that workload already publishes with, so nothing has to be
 * chosen: the friction of re-picking a target the operator did not come to change is the
 * whole thing this avoids.
 */
export const releaseSeedForWorkload = (workloadId) => ({
  settingsIds: settingsIdsForWorkload(workloadId),
  application: servingApplication(workloadId)
})

// ── Classification for the picker ───────────────────────────────────────────
/**
 * Group the settings for the release being composed, in the order the picker renders them.
 *
 *   linked    already bound to this application. The expected target.
 *   available accepts it: the setting pins no application, so it binds whatever is deployed.
 *   inactive  cannot apply a deployment at all (the drawer's own rule: "when disabled, the
 *             strategy stays in the list but no deployment can apply it"). Not selectable.
 *
 * An ACTIVE setting pinned to a DIFFERENT application is hidden rather than disabled: it is
 * not a target the operator can act on, and a permanently dead row teaches nothing.
 */
export const classifyDeploymentSettings = ({ settings, applicationName }) => {
  const groups = { linked: [], available: [], inactive: [] }
  const hidden = []

  settings.forEach((entry) => {
    if (entry.status === 'Inactive') {
      groups.inactive.push(entry)
      return
    }
    const pinned = entry.bindings.application
    if (pinned && applicationName && pinned === applicationName) {
      groups.linked.push(entry)
      return
    }
    if (!pinned) {
      groups.available.push(entry)
      return
    }
    hidden.push(entry)
  })

  return { groups, hidden }
}

/** The picker's group headings, and what a non-selectable group says and offers. */
export const DS_GROUPS = [
  { key: 'linked', label: 'Already bound to this application', selectable: true },
  { key: 'available', label: 'Available', selectable: true },
  {
    key: 'inactive',
    label: 'Inactive',
    selectable: false,
    notice: 'This Deployment setting is inactive, so no deployment can apply it.',
    action: 'Open Deployment settings'
  }
]

/**
 * The setting whose first deploy attempt is rejected, and why. A deploy can fail for
 * reasons the composer does not control, so one seeded target makes the failed row, its
 * sentence and Retry real. It succeeds on the retry.
 */
export const DEPLOY_FAILS_ONCE = new Set(['s5'])

export const DEPLOY_FAILURE_MESSAGE =
  'A deployment for this Deployment setting is already building. Retry when it finishes.'
