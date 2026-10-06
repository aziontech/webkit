import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { computed, ref } from 'vue'

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

export const blankProtection = () => ({
  azionAuthentication: { enabled: false },
  passwordProtection: { enabled: false, secretId: null },
  ipAllowlist: { enabled: false, cidrs: [] },
  ssoEnforcement: { enabled: false, idpId: null, allowedDomains: [] }
})

const LEGACY_DEPLOYMENT_POLICIES = { single: 'single_version', multiple: 'versioned_urls' }

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

const DECIMAL = /^\d{1,3}$/

const isOctet = (octet) =>
  DECIMAL.test(octet) && Number(octet) <= 255 && (octet === '0' || !octet.startsWith('0'))

const isIpv4 = (address) => {
  const octets = address.split('.')
  return octets.length === 4 && octets.every(isOctet)
}

export const isValidIpOrCidr = (entry) => {
  const [address, prefix, ...rest] = String(entry).split('/')
  if (rest.length) return false
  if (!isIpv4(address)) return false
  if (prefix === undefined) return true
  return DECIMAL.test(prefix) && Number(prefix) <= 32
}

export const parseIpAllowlist = (value) =>
  String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

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
    starter: input.starter === true,
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
  }
}

export const environments = computed(() => [...authored.value, ...seeded.value])

export const environmentById = (id) =>
  environments.value.find((environment) => environment.id === String(id))

export const environmentByName = (name) =>
  environments.value.find(
    (environment) => environment.name.toLowerCase() === String(name).trim().toLowerCase()
  )

export const policyForEnvironment = (name) =>
  environmentByName(name)?.deploymentPolicy ?? DEFAULT_DEPLOYMENT_POLICY

export const DEFAULT_ENVIRONMENTS = computed(() =>
  environments.value.filter((environment) => environment.starter)
)

export const DEFAULT_ENVIRONMENT_NAMES = computed(() =>
  DEFAULT_ENVIRONMENTS.value.map((environment) => environment.name)
)

export const environmentOptions = computed(() =>
  environments.value.map((environment) => ({ value: environment.id, label: environment.name }))
)

export const environmentNameOptions = computed(() =>
  environments.value.map((environment) => ({
    value: environment.name,
    label: environment.name,
    description: environment.description,
    deploymentPolicy: environment.deploymentPolicy
  }))
)

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
  seeded.value.splice(seededIndex, 1)
  return true
}
