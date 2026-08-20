// Deployment Settings — the STRATEGY a deployment applies.
//
// Azion v4 creates a deployment with one request:
//
//   POST /v4/workspace/workloads/{workload_id}/deployments
//   { name, active, current, strategy: { type, attributes: { application, firewall, custom_page } } }
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
export const FIREWALL_OPTIONS = [
  { value: 'Default Firewall', label: 'Default Firewall' },
  { value: 'edge-firewall', label: 'edge-firewall' },
  { value: 'waf-strict', label: 'waf-strict' }
]

export const CUSTOM_PAGE_OPTIONS = [
  { value: 'Default Custom Page', label: 'Default Custom Page' },
  { value: 'maintenance-page', label: 'maintenance-page' },
  { value: 'branded-errors', label: 'branded-errors' }
]

/** How an unbound (nullable) attribute reads on screen. */
export const bindingLabel = (value) => value || 'Not bound'

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
  status: 'Active',
  // Platform-owned: no edit, no delete, never projected away by the tenancy scope.
  system: true,
  updatedAt: null,
  lastModified: '—',
  author: 'Azion',
  authorAvatar: ''
}

// The workspace's own strategies. Seeded with the configurations the sample has
// always listed, re-cut onto the API's shape: a `type` plus the two nullable
// bindings, instead of the invented "Single Version / Versioned URL" pair (the
// platform has one strategy type, and versioning is a property of the deployment,
// not of its strategy).
const SEEDED = [
  { id: 's1', name: 'magalu-storefront', firewall: 'waf-strict', customPage: '', days: 3 },
  { id: 's2', name: 'azion-storefront', firewall: 'Default Firewall', customPage: '', days: 11 },
  {
    id: 's3',
    name: 'azion-storefront-legacy',
    firewall: '',
    customPage: 'branded-errors',
    days: 29,
    status: 'Inactive'
  },
  { id: 's4', name: 'docs-preview', firewall: '', customPage: '', days: 46, status: 'Inactive' },
  { id: 's5', name: 'analytics-canary', firewall: 'edge-firewall', customPage: '', days: 58 },
  {
    id: 's6',
    name: 'auth-service-prod',
    firewall: 'waf-strict',
    customPage: 'maintenance-page',
    days: 73
  },
  { id: 's7', name: 'marketing-site-prod', firewall: 'Default Firewall', customPage: '', days: 88 },
  {
    id: 's8',
    name: 'status-page-stage',
    firewall: '',
    customPage: 'maintenance-page',
    days: 120,
    status: 'Inactive'
  },
  { id: 's9', name: 'internal-tools-dev', firewall: '', customPage: '', days: 151 },
  { id: 's10', name: 'blog-platform-stage', firewall: 'edge-firewall', customPage: '', days: 183 }
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
      type: 'default',
      application: '',
      firewall: strategy.firewall,
      customPage: strategy.customPage,
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
 * @param {string} [input.type] Strategy type; `default` is the only one today.
 * @param {string} [input.application] Pinned application, or `''` for "the one being deployed".
 * @param {string} [input.firewall] Bound firewall, or `''` for none (`null` in the body).
 * @param {string} [input.customPage] Bound custom page, or `''` for none.
 * @param {boolean} [input.active] Whether the strategy can be applied.
 * @returns {object} The stored strategy.
 */
export function addStrategy({
  name,
  type = 'default',
  application = '',
  firewall = '',
  customPage = '',
  active = true
} = {}) {
  const updatedAt = new Date()
  const person = authorAt(0)
  const strategy = {
    id: `strategy-${authored.value.length + 1}-${updatedAt.getTime()}`,
    name: String(name || '').trim() || 'Untitled strategy',
    type,
    application,
    firewall,
    customPage,
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
