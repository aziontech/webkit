import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { computed, ref } from 'vue'

import {
  DEFAULT_DEPLOYMENT_POLICY,
  DEFAULT_ENVIRONMENT_NAMES,
  DEFAULT_ENVIRONMENTS,
  DEPLOYMENT_POLICY_OPTIONS,
  deploymentPolicyLabel,
  normalizeDeploymentPolicy
} from './environments'
import { WORKLOADS } from './workloads'

export const STRATEGY_TYPES = [{ value: 'default', label: 'Default' }]

export const strategyTypeLabel = (type) =>
  STRATEGY_TYPES.find((option) => option.value === type)?.label ?? type

export const AZION_DEFAULT_ID = 'azion-default'

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

export {
  DEFAULT_DEPLOYMENT_POLICY,
  DEPLOYMENT_POLICY_OPTIONS as DEPLOYMENT_POLICIES,
  deploymentPolicyLabel,
  normalizeDeploymentPolicy
}

export const SKEW_PROTECTION_DEFAULTS = {
  cookieName: '__azdeploy_skew',
  maxAgeSeconds: 3600,
  maxSkewedDeployments: 10
}

export const strategyDefaultsWith = ({ canary = false, skew = false } = {}) => ({
  canary: { enabled: canary, defaultTtlSeconds: canary ? 60 : null },
  skewProtection: { enabled: skew, ...SKEW_PROTECTION_DEFAULTS }
})

export const blankStrategyDefaults = () => strategyDefaultsWith()

export const DEFAULT_BINDING_POLICY = 'STRICT'

const LEGACY_BINDING_POLICIES = { strict: 'STRICT', flexible: 'FLEXIBLE' }

export const normalizeBindingPolicy = (value) => {
  const raw = String(value ?? '').trim()
  const upper = raw.toUpperCase()
  if (BINDING_POLICIES.some((policy) => policy.value === upper)) return upper
  return LEGACY_BINDING_POLICIES[raw.toLowerCase()] ?? DEFAULT_BINDING_POLICY
}

const normalizePolicies = (record) => ({
  ...record,
  bindingPolicy: normalizeBindingPolicy(record?.bindingPolicy),
  deploymentPolicy: normalizeDeploymentPolicy(record?.deploymentPolicy),
  shared: record?.shared ?? !record?.ownerWorkloadId
})

export const bindingPolicyLabel = (value) =>
  BINDING_POLICIES.find((policy) => policy.value === value)?.label ?? value

export const strategyStatusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
]

const AZION_DEFAULT = {
  id: AZION_DEFAULT_ID,
  name: 'Azion Default',
  type: 'default',
  bindingPolicy: DEFAULT_BINDING_POLICY,
  deploymentPolicy: DEFAULT_DEPLOYMENT_POLICY,
  strategyDefaults: blankStrategyDefaults(),
  description: '',
  status: 'Active',
  system: true,
  ownerWorkloadId: '',
  shared: true,
  updatedAt: null,
  lastModified: '—',
  author: 'Azion',
  authorAvatar: ''
}

const SEEDED = [
  {
    id: 's1',
    name: 'magalu-storefront',
    description: 'Storefront traffic for production.',
    safeguards: { canary: true, skew: true },
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

export const environmentSuffix = (environmentName) => {
  const [first] = DEFAULT_ENVIRONMENT_NAMES.value
  const name = String(environmentName).trim()
  return name.toLowerCase() === String(first ?? '').toLowerCase() ? '' : `-${name.toLowerCase()}`
}

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
        deploymentPolicy: environment.deploymentPolicy,
        strategyDefaults: strategyDefaultsWith({
          canary: index % 3 === 0,
          skew: index % 4 === 1
        }),
        status: 'Active',
        system: false,
        ownerWorkloadId: workload.id,
        shared: false,
        updatedAt,
        lastModified: formatListDate(updatedAt),
        author: person.name,
        authorAvatar: person.avatar
      }
    }
  )
)

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
      strategyDefaults: strategyDefaultsWith(strategy.safeguards),
      status: strategy.status ?? 'Active',
      system: false,
      ownerWorkloadId: '',
      shared: true,
      updatedAt,
      lastModified: formatListDate(updatedAt),
      author: person.name,
      authorAvatar: person.avatar
    }
  }),
  ...workloadOwned
])

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

const authored = ref(loadAuthored())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(authored.value))
  } catch {
  }
}

export const workspaceStrategies = computed(() => [...authored.value, ...seeded.value])

export const strategies = computed(() => [AZION_DEFAULT, ...workspaceStrategies.value])

export const azionDefaultStrategy = AZION_DEFAULT

export const strategyById = (id) => strategies.value.find((strategy) => strategy.id === String(id))

export const strategyOptions = computed(() =>
  strategies.value.map((strategy) => ({
    value: strategy.id,
    label: strategy.name,
    disabled: strategy.status === 'Inactive'
  }))
)

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
  seeded.value.splice(seededIndex, 1)
  return true
}

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

export const newWorkloadDefaults = ref(loadDefaults())

export function saveWorkloadDefaults(next = {}) {
  newWorkloadDefaults.value = normalizePolicies({ ...newWorkloadDefaults.value, ...next })
  try {
    globalThis.sessionStorage?.setItem(DEFAULTS_KEY, JSON.stringify(newWorkloadDefaults.value))
  } catch {
  }
}

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
