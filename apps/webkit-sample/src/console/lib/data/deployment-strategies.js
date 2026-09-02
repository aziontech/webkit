// Deployment Settings — the STRATEGY a deployment applies.
//
// Azion v4 creates a deployment with one request:
//
//   POST /v4/workspace/workloads/{workload_id}/deployments
//   { name, active, current, strategy: { type, attributes: { application, firewall, custom_page } } }
//
// Beside the bindings a Deployment setting carries its own IDENTITY (a name and an
// internal description) and its ROUTING POLICY (./BINDING_POLICIES,
// ./VERSION_POLICIES) — how the versions it publishes bind their resources and how
// many of them may take traffic. Those are the fields the create drawer asks for and
// the Settings tab lists.
//
// `strategy` is the REUSABLE half of that body — which application, firewall and
// custom page the deployment binds. That half is what this module owns and what
// the Deployments module's Settings tab lists: a strategy is authored once and
// applied by many deployments, started from any resource page. The other half
// (`name`, `active`, `current`) belongs to a single deployment and is filled in by
// the release page (../components/ReleaseComposer.vue), which is where every deploy
// in the console happens and where these settings are the targets it deploys into.
//
// That split is the whole vocabulary of the module:
//
//   Create Deployment Settings  → a new STRATEGY, reusable across deployments
//   Create release              → a real DEPLOY, applying one or more of those strategies
//
// AZION DEFAULT is the strategy every deploy starts with: it binds the
// application being deployed and nothing else — no firewall, no custom page —
// which is what `azion deploy` produces for a project that declares no bindings
// of its own. It is platform-owned: applied and read, never edited or deleted, so
// a deploy always has a valid strategy and the journey can never dead-end on an
// empty Select. It is also exempt from the tenancy projection
// (./tenancy-scope.js) for the same reason: it belongs to Azion, not to a
// workspace.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { computed, ref } from 'vue'

import { existingCustomPageOptions } from './custom-pages'
import { existingFirewallOptions } from './firewalls'

// `default` is the only strategy type the API exposes today. It stays a declared
// vocabulary (rather than a hard-coded string in a drawer) so the day a second
// type ships, the Select that offers it already reads from here.
export const STRATEGY_TYPES = [{ value: 'default', label: 'Default' }]

/** The label for a strategy type, falling back to the raw value. */
export const strategyTypeLabel = (type) =>
  STRATEGY_TYPES.find((option) => option.value === type)?.label ?? type

/** The platform-owned strategy every deployment falls back to. */
export const AZION_DEFAULT_ID = 'azion-default'

// The firewalls and custom pages a strategy can bind. Both are optional in the
// request body (`null` = not bound), and both are their own resources in Azion —
// the user creates them in their own module and BINDS them here, which is why
// they are a choice in this drawer rather than a field of the deployment.
// BOTH LISTS ARE THE MODULES' OWN ROWS, not names invented here. They were three literals
// each ('waf-strict', 'branded-errors', …) and none of them existed in ./firewalls.js or
// ./custom-pages.js — so a strategy bound a firewall the Firewall module had never heard
// of, and every surface that reported the binding was a dead end: there was no row to open,
// no id to link. Reading the seeded stores is what makes a binding a REFERENCE.
//
// The value is the NAME, not the id, because a setting binds by name everywhere (the
// provisioning log narrates it, `bindingsLine` prints it, `namesFor` in ./releases.js
// resolves versions from it). `firewallIdByName` / `customPageIdByName` turn it back into
// the id a link needs.
//
// Five each: a Select in a drawer offers the few a reader is likely to want, most recently
// touched first, which is the order both helpers sort for.
export const FIREWALL_OPTIONS = existingFirewallOptions()
  .slice(0, 5)
  .map((option) => ({ value: option.value, label: option.label }))

export const CUSTOM_PAGE_OPTIONS = existingCustomPageOptions().slice(0, 5)

/** How an unbound (nullable) attribute reads on screen. */
export const bindingLabel = (value) => value || 'Not bound'

// ROUTING AND POLICY — the two decisions that are not bindings.
//
// A binding says WHICH resource a deployment serves; a policy says HOW its versions
// reach it. Both are answered once, at create time, and both carry a default, so the
// reader who has no opinion still ships a valid deployment:
//
//   binding policy  does a version lock the resource IDs it shipped with, or may they
//                   change under it
//   version policy  how many versions may take traffic at once. Fixed once created,
//                   because changing it retroactively would re-route live traffic
//
// They are a declared vocabulary (option + label + the sentence that explains it) for
// the same reason STRATEGY_TYPES is: the drawer that asks, the table that lists and the
// summary that reads it back all take their words from here instead of restating them.
export const BINDING_POLICIES = [
  {
    value: 'strict',
    label: 'Strict',
    description: 'Lock resource IDs to each version. Promoted versions stay strict.'
  },
  {
    value: 'flexible',
    label: 'Flexible',
    description: 'Allow resource IDs to change across versions.'
  }
]

export const VERSION_POLICIES = [
  {
    value: 'single',
    label: 'Single version',
    description: 'Keep one active version routing all traffic.'
  },
  {
    value: 'multiple',
    label: 'Multiple versions',
    description: 'Let several versions take traffic at the same time.'
  }
]

/** The default each policy carries when the reader expresses no preference. */
export const DEFAULT_BINDING_POLICY = 'strict'
export const DEFAULT_VERSION_POLICY = 'single'

/** The label for a binding policy, falling back to the raw value. */
export const bindingPolicyLabel = (value) =>
  BINDING_POLICIES.find((policy) => policy.value === value)?.label ?? value

/** The label for a version policy, falling back to the raw value. */
export const versionPolicyLabel = (value) =>
  VERSION_POLICIES.find((policy) => policy.value === value)?.label ?? value

/** Status options for the Settings tab's Status selector. */
export const strategyStatusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
]

const AZION_DEFAULT = {
  id: AZION_DEFAULT_ID,
  name: 'Azion Default',
  type: 'default',
  // `application` is left out on purpose: this strategy binds whichever
  // application the deploy is for, which is what makes it usable from every
  // resource page. A strategy the user authors may pin one.
  application: '',
  firewall: '',
  customPage: '',
  // The platform's own deployment is the conservative pair: versions keep the
  // resource IDs they shipped with, and one of them serves.
  bindingPolicy: DEFAULT_BINDING_POLICY,
  versionPolicy: DEFAULT_VERSION_POLICY,
  description: '',
  status: 'Active',
  // Platform-owned: no edit, no delete, never projected away by the tenancy scope.
  system: true,
  updatedAt: null,
  lastModified: '—',
  author: 'Azion',
  authorAvatar: ''
}

// The workspace's own strategies. Seeded with the configurations the sample has
// always listed, re-cut onto the API's shape: a `type`, the two nullable bindings,
// and the routing policies the console's own create form asks for. The policies vary
// down the fixture on purpose — a column that reads the same on every row (as `type`
// does) tells the reader nothing about the rows.
const SEEDED = [
  {
    id: 's1',
    name: 'magalu-storefront',
    description: 'Storefront traffic for production.',
    firewall: 'payments-api',
    customPage: '',
    versionPolicy: 'multiple',
    days: 3
  },
  {
    id: 's2',
    name: 'azion-storefront',
    description: 'Azion-run storefront, production traffic.',
    firewall: 'edgeflow-production',
    customPage: '',
    days: 11
  },
  {
    id: 's3',
    name: 'azion-storefront-legacy',
    firewall: '',
    customPage: 'Branded 404',
    bindingPolicy: 'flexible',
    days: 29,
    status: 'Inactive'
  },
  {
    id: 's4',
    name: 'docs-preview',
    description: 'Preview builds of the documentation site.',
    firewall: '',
    customPage: '',
    bindingPolicy: 'flexible',
    versionPolicy: 'multiple',
    days: 46,
    status: 'Inactive'
  },
  {
    id: 's5',
    name: 'analytics-canary',
    description: 'Canary slice of the analytics application.',
    firewall: 'api-hardening',
    customPage: '',
    versionPolicy: 'multiple',
    days: 58
  },
  {
    id: 's6',
    name: 'auth-service-prod',
    firewall: 'partner-gateway',
    customPage: 'Maintenance window',
    days: 73
  },
  {
    id: 's7',
    name: 'marketing-site-prod',
    firewall: 'edgeflow-canary',
    customPage: '',
    bindingPolicy: 'flexible',
    days: 88
  },
  {
    id: 's8',
    name: 'status-page-stage',
    firewall: '',
    customPage: 'Blocked by firewall',
    days: 120,
    status: 'Inactive'
  },
  { id: 's9', name: 'internal-tools-dev', firewall: '', customPage: '', days: 151 },
  {
    id: 's10',
    name: 'blog-platform-stage',
    firewall: 'api-hardening',
    customPage: '',
    bindingPolicy: 'flexible',
    versionPolicy: 'multiple',
    days: 183
  }
]

// A ref, not a constant: the Settings tab deletes rows, and a deletion has to be
// visible in the release page's target picker too — one store, or the picker would
// keep offering a strategy the list says is gone.
const seeded = ref(
  SEEDED.map((strategy, index) => {
    const person = authorAt(index)
    const updatedAt = daysAgo(strategy.days)
    return {
      id: strategy.id,
      name: strategy.name,
      description: strategy.description ?? '',
      type: 'default',
      application: '',
      firewall: strategy.firewall,
      customPage: strategy.customPage,
      bindingPolicy: strategy.bindingPolicy ?? DEFAULT_BINDING_POLICY,
      versionPolicy: strategy.versionPolicy ?? DEFAULT_VERSION_POLICY,
      status: strategy.status ?? 'Active',
      system: false,
      updatedAt,
      lastModified: formatListDate(updatedAt),
      author: person.name,
      authorAvatar: person.avatar
    }
  })
)

// Session-scoped persistence, the same contract ./provisioning.js follows: a
// strategy the operator authored has to survive a reload (the release page will
// offer it again), and a new tab starts from the clean catalog. Dates are revived
// by hand — JSON has no date type and the Last Modified filter compares a Date.
const STORAGE_KEY = 'webkit-sample:deployment-strategies'

const loadAuthored = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.map((strategy) => ({
      ...strategy,
      updatedAt: strategy.updatedAt ? new Date(strategy.updatedAt) : null
    }))
  } catch {
    return []
  }
}

// Authored first (newest on top), then the seed. The platform default is prepended
// by `strategyRows` / `strategyOptions` so it always leads, whatever was created.
const authored = ref(loadAuthored())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(authored.value))
  } catch {
    // A full or unavailable sessionStorage must not break the create flow.
  }
}

/** The workspace's own strategies — the rows the Settings tab projects through tenancy. */
export const workspaceStrategies = computed(() => [...authored.value, ...seeded.value])

/** Every strategy a deployment can apply: the platform default, then the workspace's. */
export const strategies = computed(() => [AZION_DEFAULT, ...workspaceStrategies.value])

/** The platform default, as a row. */
export const azionDefaultStrategy = AZION_DEFAULT

/** A strategy by id, or `undefined`. */
export const strategyById = (id) => strategies.value.find((strategy) => strategy.id === String(id))

/** Options for a strategy Select; inactive ones are offered as disabled. */
export const strategyOptions = computed(() =>
  strategies.value.map((strategy) => ({
    value: strategy.id,
    label: strategy.name,
    disabled: strategy.status === 'Inactive'
  }))
)

/**
 * Author a strategy — what "Create Deployment Settings" creates.
 *
 * @param {object} input
 * @param {string} input.name Strategy name (`name` in the request body).
 * @param {string} [input.description] Internal note; never shown to traffic.
 * @param {string} [input.type] Strategy type; `default` is the only one today.
 * @param {string} [input.application] Pinned application, or `''` for "the one being deployed".
 * @param {string} [input.firewall] Bound firewall, or `''` for none (`null` in the body).
 * @param {string} [input.customPage] Bound custom page, or `''` for none.
 * @param {string} [input.bindingPolicy] `strict` or `flexible`; see BINDING_POLICIES.
 * @param {string} [input.versionPolicy] `single` or `multiple`; see VERSION_POLICIES.
 * @param {boolean} [input.active] Whether the strategy can be applied.
 * @returns {object} The stored strategy.
 */
export function addStrategy({
  name,
  description = '',
  type = 'default',
  application = '',
  firewall = '',
  customPage = '',
  bindingPolicy = DEFAULT_BINDING_POLICY,
  versionPolicy = DEFAULT_VERSION_POLICY,
  active = true
} = {}) {
  const updatedAt = new Date()
  const person = authorAt(0)
  const strategy = {
    id: `strategy-${authored.value.length + 1}-${updatedAt.getTime()}`,
    name: String(name || '').trim() || 'Untitled strategy',
    description: String(description || '').trim(),
    type,
    application,
    firewall,
    customPage,
    bindingPolicy,
    versionPolicy,
    status: active ? 'Active' : 'Inactive',
    system: false,
    updatedAt,
    lastModified: formatListDate(updatedAt),
    author: person.name,
    authorAvatar: person.avatar
  }
  authored.value.unshift(strategy)
  persist()
  return strategy
}

/**
 * Drop a strategy. Azion Default is platform-owned and never removable — a deploy
 * has to have something to fall back to.
 *
 * @param {string} id
 * @returns {boolean} Whether a strategy was removed.
 */
export function removeStrategy(id) {
  const key = String(id)
  if (key === AZION_DEFAULT_ID) return false

  const authoredIndex = authored.value.findIndex((strategy) => strategy.id === key)
  if (authoredIndex !== -1) {
    authored.value.splice(authoredIndex, 1)
    persist()
    return true
  }

  const seededIndex = seeded.value.findIndex((strategy) => strategy.id === key)
  if (seededIndex === -1) return false
  // Seeded deletions are session-local (they are a fixture, not a record), which is
  // what the list page's own copy did before this store existed.
  seeded.value.splice(seededIndex, 1)
  return true
}
