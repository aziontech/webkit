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
import { APPLICATIONS } from './applications'
import {
  getVersionCapability,
  RESOURCES,
  resourceMeta,
  VERSION_STATES
} from './versioning'
import { daysAgo, hoursAgo } from '@shared/lib/dates'
import { DEPLOYMENT_HISTORY } from './deployment-history'
import { authorAt } from '@shared/lib/people'
import { findDeploymentByWorkload, provisionedApplications } from './provisioning'
import { computed } from 'vue'

import { boundWorkloads, reachLabel, settingsIdsForWorkload } from '../state/workload-settings'
import { existingCustomPageOptions } from './custom-pages'
import { strategies } from './deployment-strategies'
import { existingFirewallOptions } from './firewalls'

// ── Vocabulary ──────────────────────────────────────────────────────────────
// `label` names the ENTITY (a heading, a card title, a Console page) and keeps its
// capitalization. `one` / `many` are the same thing as a NOUN inside a sentence, which is
// a separate string on purpose: lowercasing a label works for "Connectors" and produces
// "waf" for WAF, and trimming a trailing "s" gives "custom page" from "Custom Pages" but
// nonsense from anything irregular. Two fields, no string surgery at the call site.
// Resource identity — label, nouns and icon — comes from ./versioning.js, the one catalog
// keyed on the API's own `resource_type`. This module used to keep a seven-entry copy of it.
export const resourceLabel = (type) => resourceMeta(type).label

/** The type as a singular noun inside a sentence ("Add a connector"). */
export const resourceNoun = (type) => resourceMeta(type).one

/** The type as a plural noun inside a sentence ("references no network lists"). */
export const resourceNounPlural = (type) => resourceMeta(type).many

/** Glyph for a resource type, falling back to the generic box. */
export const resourceIcon = (type) => resourceMeta(type).icon || 'pi pi-box'

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
// A DEPENDENCY is a resource that cannot be deployed on its own — it is carried into a
// deployment by the application or firewall that references it. That is the same sentence
// as `canDeploy: false`, so the list is not written twice: it IS the capability matrix
// (./versioning.js `RESOURCE_CAPABILITY`), read here rather than restated.
const DEPENDENCY_TYPES = Object.keys(RESOURCES).filter(
  (type) => getVersionCapability(type).canDeploy === false
)

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
  // The modules' OWN rows. They used to come through the strategy store, which kept a
  // five-item slice of each for its binding Selects; the strategy no longer binds
  // anything, so the release reads the modules directly — which is where a release's
  // resources have always actually come from.
  if (type === 'firewall') return existingFirewallOptions().map((option) => option.value)
  if (type === 'custom_page') return existingCustomPageOptions().map((option) => option.value)
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

/** Resources carrying a version that FAILED its build. A build can fail, so one seeded
 *  resource says so — and an `error` version is editable (it resumes the same draft),
 *  which is the part of the model a screen cannot show if nothing is ever in it. */
const BUILD_FAILED = new Set(['ecommerce-v2'])

/** Resources with work in progress on top of what is serving: a `draft` that has never
 *  been built, so it is not deployable however new it is. */
const HAS_DRAFT = new Set(['marketing-site'])

/**
 * Resources whose FIRST dependency detection fails. The console cannot promise a detector
 * never breaks, so one seeded resource makes the error panel and its Retry real.
 */
export const DETECTION_FAILS_ONCE = new Set(['analytics-pro'])

const versionCache = new Map()

const versionId = (step) => `A${(step * 7919).toString(36).toUpperCase().slice(0, 6)}`

// THE STATE OF EACH VERSION, in the vocabulary the platform uses (./versioning.js).
//
// The newest built version is ACTIVE — it is what the resource is serving. The ones behind
// it are READY (built, deployable, not serving) except the oldest of a long history, which
// is ARCHIVED. On top of that, two narratives the model has to be able to show: a DRAFT
// that was never built, and a build that ended in ERROR.
const stateFor = (name, index, count) => {
  if (index === 0 && HAS_DRAFT.has(name)) return VERSION_STATES.DRAFT
  if (index === 0 && BUILD_FAILED.has(name)) return VERSION_STATES.ERROR
  const built = HAS_DRAFT.has(name) || BUILD_FAILED.has(name) ? index - 1 : index
  if (built === 0) return VERSION_STATES.ACTIVE
  return built === count - 1 && count > 2 ? VERSION_STATES.ARCHIVED : VERSION_STATES.READY
}

const buildVersions = (name) => {
  const seed = hash(name)
  // A resource that has never shipped: one DRAFT and nothing else. It is not deployable
  // because it was never built — which is the state itself saying so, rather than a flag
  // beside it that a screen has to remember to read.
  if (NO_READY_VERSION.has(name)) {
    return [
      {
        id: versionId(seed),
        comment: 'refactor: drop legacy shim',
        state: VERSION_STATES.DRAFT,
        isCurrent: false,
        createdAt: daysAgo(9 + (seed % 40)),
        author: authorAt(seed).name
      }
    ]
  }

  const count = 1 + (seed % 3) + (HAS_DRAFT.has(name) || BUILD_FAILED.has(name) ? 1 : 0)
  return Array.from({ length: count }, (_, index) => {
    const step = seed + index * 977
    const hours = 3 + (step % 300)
    const state = stateFor(name, index, count)
    return {
      id: versionId(step),
      comment: COMMENTS[(step + index) % COMMENTS.length],
      state,
      // What the resource is serving today — the ACTIVE one, never a draft on top of it.
      isCurrent: state === VERSION_STATES.ACTIVE,
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
  const states = DEPENDENCY_TYPES.includes(type)
    ? [VERSION_STATES.READY]
    : [VERSION_STATES.READY, VERSION_STATES.ACTIVE]
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

/**
 * THE PAIRING LIVES IN ../state/workload-settings.js, and is re-exported here because
 * every consumer of this module reads it beside the projection below.
 *
 * It moved there when a Deployment setting stopped being something a workload was paired
 * with by a rule and became something a workload is CREATED WITH: the binding is now a
 * record this session can change (point a workload at another workload's setting) rather
 * than a function of the workload's index, so it needs a store, and there is still
 * exactly one of it.
 */
export { environmentsForWorkload, settingsIdsForWorkload } from '../state/workload-settings'

/** The inverse: the workloads that deploy with a given Deployment setting. */
export const workloadsForSettings = (settingsId) => boundWorkloads(settingsId)

/**
 * What a workload is serving right now: its CURRENT deployment record. Slot 0 of a
 * workload's history is the application deployment, so this names the application the
 * workload serves and the environment it serves in (./deployment-history.js).
 */
export const currentDeploymentFor = (workloadId, environment = '') =>
  DEPLOYMENT_HISTORY.find(
    (deployment) =>
      deployment.workloadId === String(workloadId) &&
      // Newest-first, so the first row in an environment IS that environment's current
      // one. Without an environment the question is "what serves this workload", which
      // is the row the history marks.
      (environment ? deployment.environment === environment : deployment.current)
  )

/**
 * The application a workload is serving, or `''` for one that serves none.
 *
 * TWO PLACES HOLD THE ANSWER, and reading only the first was a bug the reader met at the
 * worst moment. `currentDeploymentFor` searches the seeded history — which, by definition,
 * a workload CREATED IN THIS SESSION is not in. Deploying such a workload therefore
 * recorded `application: { id: '', name: '' }`, and its deployment page showed an
 * Application field with no name and no link: the one page whose job is to say what was
 * deployed, unable to say it, for exactly the deployment the reader had just made.
 *
 * So the provisioning chain is the fallback — a workload created here has its application
 * there (./provisioning.js), which is the same record every other surface reads it from.
 *
 * @param {string} workloadId
 * @returns {string} The application's name, or `''`.
 */
export const servingApplication = (workloadId) => {
  const current = currentDeploymentFor(workloadId)
  // The record names the resource; a release binds it by that same name.
  if (current?.resourceType === 'application' && current.resourceName) return current.resourceName
  return findDeploymentByWorkload(workloadId)?.application?.name ?? ''
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
      description: strategy.description || '',
      status: strategy.status,
      system: Boolean(strategy.system),
      // `strategy.type` and the two routing policies. The composer does not read them —
      // it picks targets, it does not explain them — but a workload's page reports the
      // settings it deploys WITH, and a setting is its bindings AND how its versions
      // reach them (../data/deployment-strategies.js § ROUTING AND POLICY). Projected
      // here rather than looked up beside this, so there stays one shape for a setting.
      type: strategy.type,
      bindingPolicy: strategy.bindingPolicy,
      deploymentPolicy: strategy.deploymentPolicy,
      // `strategy_defaults` — the rollout safeguards every deployment applying this
      // setting inherits. Projected so a workload's footer can report them without
      // reaching back into the store for a record it already has.
      strategyDefaults: strategy.strategyDefaults,
      workloads,
      environmentNames,
      workloadsCount: workloads.length,
      // THE BLAST RADIUS, on the record itself. A setting that publishes to more than one
      // workload is SHARED: a deploy into it reaches all of them, and the person starting
      // that deploy is usually looking at one. Every surface that can start one reads
      // these two fields rather than counting `workloads` itself, so the warning and the
      // list column can never disagree about what a deploy reaches
      // (../state/workload-settings.js).
      shared: workloads.length > 1,
      reach: reachLabel(workloads.length),
      domainsCount: workloads.reduce((total, workload) => total + workload.domains.length, 0)
    }
  })
)

/** One projected Deployment setting by id. */
export const settingsById = (id) =>
  deploymentSettings.value.find((settings) => settings.id === String(id))

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
 *   available accepts it. Every active setting does now: a setting says how a deploy
 *             routes, not what it carries, so there is no such thing as one that only
 *             fits a particular application (../data/deployment-strategies.js).
 *   inactive  cannot apply a deployment at all (the drawer's own rule: "when disabled, the
 *             strategy stays in the list but no deployment can apply it"). Not selectable.
 *
 * The third group this returned — `linked`, the settings PINNED to the application being
 * released — died with `strategy.attributes`. So did `hidden`, which existed only to keep
 * a setting pinned to a DIFFERENT application out of the list. Nothing is hidden now:
 * every active setting is a legal target, which is the point of making a setting reusable.
 */
export const classifyDeploymentSettings = ({ settings }) => {
  const groups = { available: [], inactive: [] }

  settings.forEach((entry) => {
    if (entry.status === 'Inactive') {
      groups.inactive.push(entry)
      return
    }
    groups.available.push(entry)
  })

  return { groups, hidden: [] }
}

/** The picker's group headings, and what a non-selectable group says and offers. */
export const DS_GROUPS = [
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

/**
 * The application a release deploys, in the shape a deployment RECORD names it.
 *
 * A release keys resources by NAME — that is what a Deployment setting binds, so name is
 * the key on both sides — while a deployment record also carries the id its Application
 * page links to. The lookup happens once, here, so nothing downstream has to translate.
 *
 * @param {string} name The application's name, as the release composed it.
 * @returns {{ id: string, name: string, preset: string }} What ./deploy-runs.js opens the
 *   deployment with.
 */
export const applicationRecord = (nameOrId) => {
  const key = String(nameOrId ?? '').trim()
  if (!key) return { id: '', name: '', preset: 'vue' }
  // BOTH POOLS. An application provisioned in this session is not in the seed, so matching
  // the seed alone left a just-created application unresolved — and the `id` fell back to
  // the NAME, which reads as an id everywhere downstream and links to `/applications/<name>`,
  // a page that does not exist. A link that 404s is worse than no link.
  const pool = [...APPLICATIONS, ...provisionedApplications.value]
  // By name first, because that is what a release and a workload's history bind by; by id
  // second, so a caller holding one resolves too rather than being told the id is a name.
  const match =
    pool.find((application) => application.name === key) ??
    pool.find((application) => String(application.id) === key)
  return {
    id: match?.id ?? '',
    name: match?.name ?? key,
    preset: match?.preset ?? 'vue'
  }
}
