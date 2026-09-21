// Deployment Settings — HOW a deployment routes, and nothing about WHAT it carries.
//
// Azion v4 creates a deployment with one request:
//
//   POST /v4/workspace/workloads/{workload_id}/deployments
//   { name, active, current, strategy: { type, attributes } }
//
// A Deployment setting is the REUSABLE half of that body: an identity (a name and an
// internal description) and a ROUTING POLICY (./BINDING_POLICIES, ./DEPLOYMENT_POLICIES) —
// how the versions it publishes bind their resources, and how many of them may take
// traffic. That is the whole record.
//
// ── WHAT IT DELIBERATELY DOES NOT CARRY ──
//
// It used to pin an application, a firewall and a custom page. Those are gone. A setting
// that binds individual resources is a setting that can only be used by the one workload
// serving those resources, which is the opposite of a reusable record — and it made the
// same three facts answerable from two places that could disagree: the setting's pins and
// the release's own topology.
//
// So the split is now clean:
//
//   the RELEASE binds the resources    which application, firewall and custom page this
//                                      deploy carries (../data/releases.js, the composer)
//   the SETTING says how it routes     binding policy, version policy
//   the ENVIRONMENT says which setting a workload's environment publishes with exactly
//                                      one (../state/workload-settings.js)
//
// AZION DEFAULT is the setting every deploy falls back to: the conservative pair, owned
// by the platform — applied and read, never edited or deleted, so a deploy always has a
// valid strategy and the journey can never dead-end on an empty Select. It is exempt from
// the tenancy projection (./tenancy-scope.js) for the same reason: it belongs to Azion,
// not to a workspace.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import {
  DEFAULT_DEPLOYMENT_POLICY,
  DEFAULT_ENVIRONMENT_NAMES,
  DEFAULT_ENVIRONMENTS,
  deploymentPolicyLabel,
  DEPLOYMENT_POLICY_OPTIONS,
  normalizeDeploymentPolicy
} from './environments'
import { WORKLOADS } from './workloads'
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

// ROUTING AND POLICY — the two decisions a Deployment Setting IS.
//
// Both come straight from the v6 create/patch body
// (console-kit `services/v2/deployment/deployment-adapter.js`):
//
//   { name, description, binding_policy, deployment_policy, strategy_defaults }
//
// BINDING POLICY — `STRICT` | `FLEXIBLE`. Whether a version locks the resource IDs it
// shipped with. Uppercase on the wire; the labels are ours.
//
// DEPLOYMENT POLICY — `single_version` | `versioned_urls`, labelled **Single** and
// **Versioned**. This is the axis the whole feature turns on, because THE ENVIRONMENT
// CARRIES IT TOO (`services/v2/environment/environment-adapter.js` takes the same pair),
// and matching them is the linking rule:
//
//   an environment is linked to a Deployment Setting whose `deployment_policy`
//   equals its own — automatically, and a reader may pick a different one only
//   from the settings that match.
//
// The sample used to call this `versionPolicy: 'single' | 'multiple'` and keep it on the
// setting alone. That was an invention, and it cost the rule: with the policy on one side
// only there is nothing to match, so "which settings may this environment use" had no
// answer and every setting looked usable everywhere.
export const BINDING_POLICIES = [
  {
    value: 'STRICT',
    label: 'Strict',
    description: 'Lock resource IDs to each version. Promoted versions stay Strict.'
  },
  {
    value: 'FLEXIBLE',
    label: 'Flexible',
    description: 'Allow resource IDs to change across versions.'
  }
]

// The deployment policy is the ENVIRONMENT's field first — an environment declares how
// its URLs work, and a setting may serve it only by agreeing. So ./environments.js owns
// the vocabulary, the default, the legacy coercion and the labeller, and this module
// re-exports them under the name its own consumers already import. One definition; a
// setting and an environment can no longer disagree about what `versioned_urls` means.
export {
  DEPLOYMENT_POLICY_OPTIONS as DEPLOYMENT_POLICIES,
  DEFAULT_DEPLOYMENT_POLICY,
  deploymentPolicyLabel,
  normalizeDeploymentPolicy
}

// STRATEGY DEFAULTS — the third field of the v6 body, and the one this sample had no
// shape for at all. Two rollout safeguards a setting carries so every deployment that
// applies it inherits them:
//
//   canary            roll a candidate version out to a slice before the rest
//   skew protection   pin a visitor to the version they started on, so a mid-session
//                     deploy cannot serve them half of each
//
// The cookie name and the max age are the platform's own defaults
// (`__azdeploy_skew`, one hour, ten skewed deployments), carried here so a setting the
// reader never opens still describes what it actually does.
export const SKEW_PROTECTION_DEFAULTS = {
  cookieName: '__azdeploy_skew',
  maxAgeSeconds: 3600,
  maxSkewedDeployments: 10
}

/**
 * A setting's `strategy_defaults` with the safeguards named. The platform's own numbers
 * ride along whether or not the switch is on, because they are what the switch turns on —
 * a record that forgets them has nothing to restore.
 *
 * @param {{ canary?: boolean, skew?: boolean }} on Which safeguards are enabled.
 */
export const strategyDefaultsWith = ({ canary = false, skew = false } = {}) => ({
  canary: { enabled: canary, defaultTtlSeconds: canary ? 60 : null },
  skewProtection: { enabled: skew, ...SKEW_PROTECTION_DEFAULTS }
})

/** A setting's `strategy_defaults`, with everything off — what a new setting is born with. */
export const blankStrategyDefaults = () => strategyDefaultsWith()

/** The default binding policy when the reader expresses no preference. The deployment
 *  policy's default is the environment's, re-exported above. */
export const DEFAULT_BINDING_POLICY = 'STRICT'

// ── NORMALIZING WHAT COMES BACK ─────────────────────────────────────────────
//
// A stored record outlives the vocabulary that wrote it. This sample kept its policies
// in sessionStorage under the PRE-v6 spellings (`strict`, `single`, `multiple`), so a tab
// opened before the rename revives a strategy whose `bindingPolicy` is `strict` — which
// matches nothing in BINDING_POLICIES, so the labeller fell through to the raw value and
// the console printed a lowercase `strict` at the reader.
//
// So every value is normalized AT THE BOUNDARY it enters by, exactly as console-kit's own
// adapter does it (`getDeploymentVersionPolicyValue` coerces, then falls back to a known
// value). The labellers stay strict on purpose: a labeller that guesses would have hidden
// this instead of showing it.
const LEGACY_BINDING_POLICIES = { strict: 'STRICT', flexible: 'FLEXIBLE' }

/** Coerce a binding policy to the v6 vocabulary. Unknown values fall back to the default. */
export const normalizeBindingPolicy = (value) => {
  const raw = String(value ?? '').trim()
  const upper = raw.toUpperCase()
  if (BINDING_POLICIES.some((policy) => policy.value === upper)) return upper
  return LEGACY_BINDING_POLICIES[raw.toLowerCase()] ?? DEFAULT_BINDING_POLICY
}

/** Both policies of a record, coerced, and its share intent. Used wherever a stored record
 *  re-enters the app — a session saved before `shared` existed revives without it, and an
 *  `undefined` there would read as "not shared" for a workspace setting that always was. */
const normalizePolicies = (record) => ({
  ...record,
  bindingPolicy: normalizeBindingPolicy(record?.bindingPolicy),
  deploymentPolicy: normalizeDeploymentPolicy(record?.deploymentPolicy),
  shared: record?.shared ?? !record?.ownerWorkloadId
})

/** The label for a binding policy, falling back to the raw value. */
export const bindingPolicyLabel = (value) =>
  BINDING_POLICIES.find((policy) => policy.value === value)?.label ?? value

/** Status options for the Settings tab's Status selector. */
export const strategyStatusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
]

const AZION_DEFAULT = {
  id: AZION_DEFAULT_ID,
  name: 'Azion Default',
  type: 'default',
  // The platform's own deployment is the conservative pair: versions keep the
  // resource IDs they shipped with, and one of them serves.
  bindingPolicy: DEFAULT_BINDING_POLICY,
  deploymentPolicy: DEFAULT_DEPLOYMENT_POLICY,
  strategyDefaults: blankStrategyDefaults(),
  description: '',
  status: 'Active',
  // Platform-owned: no edit, no delete, never projected away by the tenancy scope.
  system: true,
  ownerWorkloadId: '',
  // The fallback every environment can reach. It is shareable by definition — it is what
  // a picker offers when nothing else matches, so it can never be dedicated to anyone.
  shared: true,
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
    safeguards: { canary: true, skew: true },
    // SINGLE, like the Production environments that share it. A `versioned_urls` setting
    // is not linkable from a `single_version` environment at all, so a fleet setting has
    // to carry the policy of the environments it serves.
    deploymentPolicy: 'single_version',
    days: 3
  },
  {
    id: 's2',
    name: 'azion-storefront',
    description: 'Azion-run storefront, production traffic.',
    safeguards: { skew: true },
    days: 11
  },
  {
    id: 's3',
    name: 'azion-storefront-legacy',
    bindingPolicy: 'FLEXIBLE',
    days: 29,
    status: 'Inactive'
  },
  {
    id: 's4',
    name: 'docs-preview',
    description: 'Preview builds of the documentation site.',
    safeguards: { canary: true },
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'versioned_urls',
    days: 46,
    status: 'Inactive'
  },
  {
    id: 's5',
    name: 'analytics-canary',
    description: 'Canary slice of the analytics application.',
    deploymentPolicy: 'versioned_urls',
    days: 58
  },
  {
    id: 's6',
    name: 'auth-service-prod',
    days: 73
  },
  {
    id: 's7',
    name: 'marketing-site-prod',
    bindingPolicy: 'FLEXIBLE',
    days: 88
  },
  {
    id: 's8',
    name: 'status-page-stage',
    days: 120,
    status: 'Inactive'
  },
  { id: 's9', name: 'internal-tools-dev', days: 151 },
  {
    id: 's10',
    name: 'blog-platform-stage',
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'versioned_urls',
    days: 183
  }
]

// THE SETTING EVERY SEEDED ENVIRONMENT WAS CREATED WITH.
//
// One per (workload, environment), because that is what the rule actually says: "every
// environment used by a domain is linked to Deployment Settings automatically, MATCHING
// THE DEPLOYMENT POLICY OF THAT ENVIRONMENT". A workload publishing into Production
// (`single_version`) and Stage (`versioned_urls`) therefore needs two — one setting
// cannot serve both, because a setting carries exactly one policy.
//
// EVERY workload gets the whole starter pair, so an account with twenty workloads holds
// forty of these. It used to mint Stage for only every third workload, which made most
// workloads look like they published into one place — the opposite of what the platform
// gives you. The pair itself is not named here: it is ./environments.js `starter` records,
// so a starter's policy is stated once and this fixture follows it.
//
// That the list is overwhelmingly dedicated rows is the point: it is what makes the
// handful of SHARED ones worth a column.

/**
 * What an environment adds to the name of the thing created for it. The FIRST starter adds
 * nothing and the rest carry their own name, so a workload's Production setting is
 * `ws-1020655` / `workload_01` and its Stage one is `ws-1020655-stage` / `workload_01-stage`.
 *
 * @param {string} environmentName
 * @returns {string} `''` for the first starter, `-<name>` for the rest.
 */
export const environmentSuffix = (environmentName) => {
  const [first] = DEFAULT_ENVIRONMENT_NAMES.value
  const name = String(environmentName).trim()
  return name.toLowerCase() === String(first ?? '').toLowerCase() ? '' : `-${name.toLowerCase()}`
}

/**
 * The id of the setting a workload is born with for one environment.
 *
 * ../state/workload-settings.js reads these ids back, so the derivation lives here —
 * where they are minted — rather than being spelled a second time on the reading side.
 *
 * @param {string} workloadId
 * @param {string} environmentName
 * @returns {string} `ws-<workloadId>` for the first starter, suffixed for the rest.
 */
export const workloadSettingsId = (workloadId, environmentName) =>
  `ws-${workloadId}${environmentSuffix(environmentName)}`

const workloadOwned = WORKLOADS.flatMap((workload, index) =>
  DEFAULT_ENVIRONMENTS.value.map(
    (environment) => {
      const person = authorAt(index)
      const updatedAt = daysAgo(index * 9 + 4)
      return {
        id: workloadSettingsId(workload.id, environment.name),
        name: `${workload.name}${environmentSuffix(environment.name)}`,
        description: `Created with the ${workload.name} workload for ${environment.name}.`,
        type: 'default',
        bindingPolicy: index % 5 === 2 ? 'FLEXIBLE' : DEFAULT_BINDING_POLICY,
        // THE POLICY MATCHES THE ENVIRONMENT IT WAS CREATED FOR. Anything else and the
        // automatic link cannot use it, which would send every environment to the first
        // compatible setting it finds — and make the whole account look shared.
        deploymentPolicy: environment.deploymentPolicy,
        // Roughly a third carry a safeguard: enough that opening a few workloads shows
        // both states, few enough that On still reads as a deliberate choice.
        strategyDefaults: strategyDefaultsWith({
          canary: index % 3 === 0,
          skew: index % 4 === 1
        }),
        status: 'Active',
        system: false,
        // Born with that workload. It is what makes the row DEDICATED rather than merely
        // one-environment: nobody chose it.
        ownerWorkloadId: workload.id,
        // DEDICATED until somebody says otherwise. `shared` is the operator's INTENT —
        // whether this setting may be pointed at by workloads other than the one it was
        // created with. It is not the same question as `isShared()`, which reports how many
        // workloads actually reach it today: intent is what was asked for, reach is what is
        // true, and a setting can be shareable with a reach of one.
        shared: false,
        updatedAt,
        lastModified: formatListDate(updatedAt),
        author: person.name,
        authorAvatar: person.avatar
      }
    }
  )
)

// A ref, not a constant: the Settings tab deletes rows, and a deletion has to be
// visible in the release page's target picker too — one store, or the picker would
// keep offering a strategy the list says is gone.
//
// The hand-authored settings lead: they are the ones workloads are POINTED at, so they
// carry the reach the page is scanned for. The per-workload ones follow.
const seeded = ref([
  ...SEEDED.map((strategy, index) => {
    const person = authorAt(index)
    const updatedAt = daysAgo(strategy.days)
    return {
      id: strategy.id,
      name: strategy.name,
      description: strategy.description ?? '',
      type: 'default',
      bindingPolicy: strategy.bindingPolicy ?? DEFAULT_BINDING_POLICY,
      deploymentPolicy: strategy.deploymentPolicy ?? DEFAULT_DEPLOYMENT_POLICY,
      // DECLARED PER ROW, like the policies above it. Every seeded setting used to carry
      // `blankStrategyDefaults()`, so Canary and Skew protection read "Off" on every
      // setting in the account — which made the On state of two fields unreachable
      // anywhere in the sample.
      strategyDefaults: strategyDefaultsWith(strategy.safeguards),
      status: strategy.status ?? 'Active',
      system: false,
      // The seed predates the per-workload model: these are the workspace's own
      // settings, authored by hand, so none of them was born with a workload. The
      // workloads bound to them are what ../state/workload-settings.js reports.
      ownerWorkloadId: '',
      // A setting authored on its own was made to be pointed at — that is the only thing
      // it could be for — so it is shareable from birth. The opt-in exists for the ones
      // born WITH a workload, which are dedicated until the operator shares them.
      shared: true,
      updatedAt,
      lastModified: formatListDate(updatedAt),
      author: person.name,
      authorAvatar: person.avatar
    }
  }),
  ...workloadOwned
])

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
    return parsed.map((strategy) =>
      normalizePolicies({
        ...strategy,
        updatedAt: strategy.updatedAt ? new Date(strategy.updatedAt) : null
      })
    )
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
 * @param {string} [input.bindingPolicy] `STRICT` or `FLEXIBLE`; see BINDING_POLICIES.
 * @param {string} [input.deploymentPolicy] `single_version` or `versioned_urls`.
 * @param {object} [input.strategyDefaults] `{ canary, skewProtection }` — v6 `strategy_defaults`.
 * @param {boolean} [input.active] Whether the strategy can be applied.
 * @param {string} [input.ownerWorkloadId] The workload this setting was created WITH.
 *   Set by ../state/workload-settings.js when a workload is provisioned; `''` for a
 *   setting authored by hand, which belongs to the workspace rather than to one workload.
 * @returns {object} The stored strategy.
 */
export function addStrategy({
  name,
  description = '',
  type = 'default',
  bindingPolicy = DEFAULT_BINDING_POLICY,
  deploymentPolicy = DEFAULT_DEPLOYMENT_POLICY,
  strategyDefaults = blankStrategyDefaults(),
  active = true,
  ownerWorkloadId = '',
  shared = !ownerWorkloadId
} = {}) {
  const updatedAt = new Date()
  const person = authorAt(0)
  const strategy = normalizePolicies({
    id: `strategy-${authored.value.length + 1}-${updatedAt.getTime()}`,
    name: String(name || '').trim() || 'Untitled strategy',
    description: String(description || '').trim(),
    type,
    bindingPolicy,
    deploymentPolicy,
    strategyDefaults,
    status: active ? 'Active' : 'Inactive',
    system: false,
    ownerWorkloadId: String(ownerWorkloadId || ''),
    shared: shared === true,
    updatedAt,
    lastModified: formatListDate(updatedAt),
    author: person.name,
    authorAvatar: person.avatar
  })
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

// ── THE ACCOUNT DEFAULT — what a NEW workload's Deployment setting is born with ──
//
// Every workload gets a Deployment setting of its own the moment it is provisioned
// (../state/workload-settings.js). This is the record that create is seeded from: the
// account answers once, here, and every workload made afterwards starts there instead
// of at a hard-coded pair nobody chose.
//
// IT IS A DEFAULT FOR WHAT COMES NEXT, and on its own it changes nothing that is
// already running — the settings bound to today's workloads keep the values they were
// created with. Re-applying it to them is a separate, deliberate act
// (`applyDefaultsToWorkspace`), because a default that silently rewrote every live
// binding would make this the most dangerous field on the page.
const DEFAULTS_KEY = 'webkit-sample:deployment-defaults'

const DEFAULTS = {
  bindingPolicy: DEFAULT_BINDING_POLICY,
  deploymentPolicy: DEFAULT_DEPLOYMENT_POLICY
}

const loadDefaults = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(DEFAULTS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULTS }
    return normalizePolicies({ ...DEFAULTS, ...parsed })
  } catch {
    return { ...DEFAULTS }
  }
}

/** What a new workload's Deployment setting is created with. */
export const newWorkloadDefaults = ref(loadDefaults())

/**
 * Store the account default. Only affects settings created AFTER this call.
 *
 * @param {object} next `{ bindingPolicy, deploymentPolicy }`.
 */
export function saveWorkloadDefaults(next = {}) {
  newWorkloadDefaults.value = normalizePolicies({ ...newWorkloadDefaults.value, ...next })
  try {
    globalThis.sessionStorage?.setItem(DEFAULTS_KEY, JSON.stringify(newWorkloadDefaults.value))
  } catch {
    // A full or unavailable sessionStorage must not break the save.
  }
}

/**
 * Push the account default onto every setting the workspace already has — the opt-in
 * half of the field above, never its side effect.
 *
 * Azion Default is exempt: it is the platform's own record, and it is the fallback a
 * deploy needs to stay valid.
 *
 * @returns {number} How many settings were rewritten.
 */
export function applyDefaultsToWorkspace() {
  const next = newWorkloadDefaults.value
  const updatedAt = new Date()
  const rewrite = (strategy) => ({
    ...strategy,
    ...next,
    updatedAt,
    lastModified: formatListDate(updatedAt)
  })
  const count = authored.value.length + seeded.value.length
  authored.value = authored.value.map(rewrite)
  seeded.value = seeded.value.map(rewrite)
  persist()
  return count
}
