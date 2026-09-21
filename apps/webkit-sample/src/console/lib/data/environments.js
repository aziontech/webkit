// ENVIRONMENTS — the place a deployment lands, as v6 actually models it.
//
// An environment is not a label on a workload. It is a RECORD with its own settings, and
// the console-kit v6 create/patch body is the whole of it
// (`services/v2/environment/environment-adapter.js`):
//
//   { name, description, deployment_policy, robots_policy, protection, branch_tracking }
//
// ── WHY IT MATTERS HERE ──
//
// `deployment_policy` is the field this sample got wrong for a long time. It is on the
// ENVIRONMENT as well as on the Deployment Setting, and matching the two is the rule that
// links them (../state/workload-settings.js):
//
//   "Every environment used by a domain is linked to Deployment Settings automatically,
//    matching the deployment policy of that environment."
//
// So this store is the other half of that rule. An environment declares how its URLs
// work; the settings that may serve it are the ones that agree.
//
// ── THE FIELDS ──
//
//   deployment_policy  single_version | versioned_urls. One version serves and a deploy
//                      replaces it, or each version keeps its own URL.
//   robots_policy      preserve_origin | index | noindex. `preserve_origin` serves what
//                      the application returns; the other two are answered AT THE EDGE
//                      without reaching the origin.
//   protection         who may reach the environment at all. v6 carries four independent
//                      switches; the form ships the one the console validates today
//                      (`ip_allowlist`), and the record keeps the shape of the rest so a
//                      payload built from it is not missing keys.
//   branch_tracking    build this environment when a matching Git branch moves.
//                      `null` on the wire when disabled.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { computed, ref } from 'vue'

/** The URL strategy an environment publishes with — the axis a Deployment Setting matches. */
export const DEPLOYMENT_POLICY_OPTIONS = [
  {
    value: 'single_version',
    label: 'Single',
    description: 'One version serves the environment. Deploying replaces what is live.'
  },
  {
    value: 'versioned_urls',
    label: 'Versioned',
    description: 'Each version keeps its own URL, so several are reachable at once.'
  }
]

export const DEFAULT_DEPLOYMENT_POLICY = 'single_version'

// The three the platform answers /robots.txt with. The help text is the product's own
// distinction and it is the only thing that makes the choice legible: one of these three
// is a pass-through and two of them are answered without the origin ever being asked.
export const ROBOTS_POLICY_OPTIONS = [
  {
    value: 'preserve_origin',
    label: 'Preserve origin',
    description: 'Serve the robots.txt the application returns.'
  },
  {
    value: 'index',
    label: 'Index',
    description: 'The edge answers with generated content. The origin is not reached.'
  },
  {
    value: 'noindex',
    label: 'No index',
    description: 'The edge answers with generated content. The origin is not reached.'
  }
]

export const DEFAULT_ROBOTS_POLICY = 'preserve_origin'

/** How a Git branch is matched when branch tracking is on. */
export const BRANCH_MODE_OPTIONS = [
  { value: 'branch_is', label: 'Branch is' },
  { value: 'branch_starts_with', label: 'Branch starts with' },
  { value: 'branch_ends_with', label: 'Branch ends with' }
]

export const BRANCH_TRACKING_DEFAULTS = {
  enabled: false,
  mode: 'branch_is',
  branchMatch: 'main'
}

/** Every protection v6 carries, all off — the shape a payload needs even when unused. */
export const blankProtection = () => ({
  azionAuthentication: { enabled: false },
  passwordProtection: { enabled: false, secretId: null },
  ipAllowlist: { enabled: false, cidrs: [] },
  ssoEnforcement: { enabled: false, idpId: null, allowedDomains: [] }
})

// A stored record outlives the vocabulary that wrote it: this sample kept the policy
// under a pre-v6 spelling (`single` / `multiple`), so a session saved before the rename
// revives a value that matches nothing and prints raw at the reader. Every value is
// therefore coerced where it enters, the way console-kit's `getDeploymentVersionPolicyValue`
// does it — known value wins, legacy spelling maps, anything else falls back.
const LEGACY_DEPLOYMENT_POLICIES = { single: 'single_version', multiple: 'versioned_urls' }

/** Coerce a deployment policy to the v6 vocabulary. */
export const normalizeDeploymentPolicy = (value) => {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase()
  if (DEPLOYMENT_POLICY_OPTIONS.some((option) => option.value === raw)) return raw
  return LEGACY_DEPLOYMENT_POLICIES[raw] ?? DEFAULT_DEPLOYMENT_POLICY
}

export const deploymentPolicyLabel = (value) =>
  DEPLOYMENT_POLICY_OPTIONS.find((option) => option.value === value)?.label ?? value

export const robotsPolicyLabel = (value) =>
  ROBOTS_POLICY_OPTIONS.find((option) => option.value === value)?.label ?? value

export const branchModeLabel = (value) =>
  BRANCH_MODE_OPTIONS.find((option) => option.value === value)?.label ?? value

// ── IP allowlist validation, the same rule the console applies ──────────────
// IPv4 and an optional /prefix. The console validates this before the request, and so
// does the drawer here — an address the platform will reject is worth catching in the
// field that typed it rather than in a toast after a round trip.
const DECIMAL = /^\d{1,3}$/

const isOctet = (octet) =>
  DECIMAL.test(octet) && Number(octet) <= 255 && (octet === '0' || !octet.startsWith('0'))

const isIpv4 = (address) => {
  const octets = address.split('.')
  return octets.length === 4 && octets.every(isOctet)
}

/** Whether one line of the allowlist is a legal IPv4 address or CIDR range. */
export const isValidIpOrCidr = (entry) => {
  const [address, prefix, ...rest] = String(entry).split('/')
  if (rest.length) return false
  if (!isIpv4(address)) return false
  if (prefix === undefined) return true
  return DECIMAL.test(prefix) && Number(prefix) <= 32
}

/** The allowlist textarea, one entry per line, blanks dropped. */
export const parseIpAllowlist = (value) =>
  String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

// ── The seed ────────────────────────────────────────────────────────────────
// Three records, but only TWO of them are starters.
//
// A workload is created with Production and Stage — that is the platform's own default
// pair, and it is what makes a new workload able to deploy twice over: Production serves
// one version and a deploy replaces it, Stage keeps a URL per version so a build can be
// looked at before it is live. `starter: true` is what says so, and it is read by
// ../state/workload-settings.js (which environments a workload publishes into) and by
// ./deployment-strategies.js (which settings are minted with it).
//
// Preview is the third, and it is deliberately NOT a starter: it exists to show that an
// environment is an ACCOUNT record a reader can add to a workload, not a fixed pair. It
// also carries the protection an IP-restricted environment has, which neither starter does.
const SEEDED = [
  {
    id: 'env-production',
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.',
    deploymentPolicy: 'single_version',
    robotsPolicy: 'preserve_origin',
    branchTracking: { enabled: true, mode: 'branch_is', branchMatch: 'main' },
    starter: true,
    days: 2
  },
  {
    id: 'env-stage',
    name: 'Stage',
    description: 'A rehearsal. Each version keeps its own URL, so a build can be read before it is live.',
    deploymentPolicy: 'versioned_urls',
    robotsPolicy: 'noindex',
    branchTracking: { enabled: true, mode: 'branch_starts_with', branchMatch: 'release/' },
    starter: true,
    days: 9
  },
  {
    id: 'env-preview',
    name: 'Preview',
    description: 'Branch previews, reachable only from the office network.',
    deploymentPolicy: 'versioned_urls',
    robotsPolicy: 'noindex',
    protection: { ipAllowlist: { enabled: true, cidrs: ['203.0.113.0/24'] } },
    branchTracking: { enabled: false, mode: 'branch_is', branchMatch: 'main' },
    days: 24
  }
]

const buildEnvironment = (input, index) => {
  const person = authorAt(index)
  const updatedAt = daysAgo(input.days ?? 30)
  return {
    id: input.id,
    name: input.name,
    description: input.description ?? '',
    deploymentPolicy: normalizeDeploymentPolicy(input.deploymentPolicy),
    robotsPolicy: input.robotsPolicy ?? DEFAULT_ROBOTS_POLICY,
    protection: { ...blankProtection(), ...(input.protection ?? {}) },
    branchTracking: { ...BRANCH_TRACKING_DEFAULTS, ...(input.branchTracking ?? {}) },
    // Whether a new workload is created publishing into it. Authored environments are
    // never starters — a reader adds those to the workloads that need them.
    starter: input.starter === true,
    // `state` is read-only on the wire; the sample has no lifecycle to run, so every
    // seeded environment is ready rather than inventing a status nothing changes.
    state: 'ready',
    updatedAt,
    lastModified: formatListDate(updatedAt),
    author: person.name,
    authorAvatar: person.avatar
  }
}

const STORAGE_KEY = 'webkit-sample:environments'

const loadAuthored = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.map((environment) => ({
      ...environment,
      deploymentPolicy: normalizeDeploymentPolicy(environment.deploymentPolicy),
      updatedAt: environment.updatedAt ? new Date(environment.updatedAt) : null
    }))
  } catch {
    return []
  }
}

const authored = ref(loadAuthored())
const seeded = ref(SEEDED.map(buildEnvironment))

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(authored.value))
  } catch {
    // A full or unavailable sessionStorage must not break the create flow.
  }
}

/** Every environment the account holds, newest authored first. */
export const environments = computed(() => [...authored.value, ...seeded.value])

/** One environment by id. */
export const environmentById = (id) =>
  environments.value.find((environment) => environment.id === String(id))

/** One environment by name — how a workload's domain names the one it publishes into. */
export const environmentByName = (name) =>
  environments.value.find(
    (environment) => environment.name.toLowerCase() === String(name).trim().toLowerCase()
  )

/** The deployment policy of a named environment, for the settings-match rule. */
export const policyForEnvironment = (name) =>
  environmentByName(name)?.deploymentPolicy ?? DEFAULT_DEPLOYMENT_POLICY

/**
 * THE PAIR EVERY WORKLOAD IS CREATED WITH, in the order the console shows them.
 *
 * This is the one answer to "which environments does a new workload have", and every
 * surface that needs it derives from here rather than repeating the two names: the
 * settings minted per workload (./deployment-strategies.js), the pairing a workload's
 * page reads (../state/workload-settings.js), and the create flow's own copy
 * (./workload-flows.js). Change a starter's policy on the Environments page and all
 * three follow, because none of them holds its own copy of the list.
 */
export const DEFAULT_ENVIRONMENTS = computed(() =>
  environments.value.filter((environment) => environment.starter)
)

/** Just their names — what a domain carries, and what the pairing is keyed by. */
export const DEFAULT_ENVIRONMENT_NAMES = computed(() =>
  DEFAULT_ENVIRONMENTS.value.map((environment) => environment.name)
)

/** Options for a Select that picks an environment. */
export const environmentOptions = computed(() =>
  environments.value.map((environment) => ({ value: environment.id, label: environment.name }))
)

/**
 * The same list keyed by NAME — how a DOMAIN names the environment it answers on
 * (../state/workload-environments.js). A domain carries the name, not the record's id, so
 * the control that asks for it has to offer names or the answer cannot be read back.
 *
 * Derived from the same store as the Environments page, so an environment authored there
 * is immediately nameable by a domain, and the two can never offer different sets.
 */
export const environmentNameOptions = computed(() =>
  environments.value.map((environment) => ({
    value: environment.name,
    label: environment.name,
    description: environment.description,
    deploymentPolicy: environment.deploymentPolicy
  }))
)

/**
 * Create one — the v6 create body, in the console's own casing.
 *
 * @param {object} input `{ name, description, deploymentPolicy, robotsPolicy, protection, branchTracking }`
 * @returns {object} The stored environment.
 */
export function addEnvironment({
  name,
  description = '',
  deploymentPolicy = DEFAULT_DEPLOYMENT_POLICY,
  robotsPolicy = DEFAULT_ROBOTS_POLICY,
  protection = blankProtection(),
  branchTracking = { ...BRANCH_TRACKING_DEFAULTS }
} = {}) {
  const updatedAt = new Date()
  const person = authorAt(0)
  const environment = {
    id: `env-${updatedAt.getTime()}`,
    name: String(name || '').trim() || 'Untitled environment',
    description: String(description || '').trim(),
    deploymentPolicy: normalizeDeploymentPolicy(deploymentPolicy),
    robotsPolicy,
    protection: { ...blankProtection(), ...protection },
    branchTracking: { ...BRANCH_TRACKING_DEFAULTS, ...branchTracking },
    state: 'ready',
    updatedAt,
    lastModified: formatListDate(updatedAt),
    author: person.name,
    authorAvatar: person.avatar
  }
  authored.value.unshift(environment)
  persist()
  return environment
}

/**
 * Drop one. Production is not removable: every workload publishes into it, and an
 * environment with deployments in it is not a record this sample lets you orphan.
 *
 * @param {string} id
 * @returns {boolean} Whether an environment was removed.
 */
export function removeEnvironment(id) {
  const key = String(id)
  if (key === 'env-production') return false

  const authoredIndex = authored.value.findIndex((environment) => environment.id === key)
  if (authoredIndex !== -1) {
    authored.value.splice(authoredIndex, 1)
    persist()
    return true
  }

  const seededIndex = seeded.value.findIndex((environment) => environment.id === key)
  if (seededIndex === -1) return false
  // Seeded deletions are session-local, the same contract the other stores follow.
  seeded.value.splice(seededIndex, 1)
  return true
}
