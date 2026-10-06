import { daysAgo, hoursAgo } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { computed } from 'vue'

import { boundWorkloads, reachLabel, settingsIdsForWorkload } from '../state/workload-settings'
import { APPLICATIONS } from './applications'
import { existingCustomPageOptions } from './custom-pages'
import { DEPLOYMENT_HISTORY } from './deployment-history'
import { strategies } from './deployment-strategies'
import { existingFirewallOptions } from './firewalls'
import { findDeploymentByWorkload, provisionedApplications } from './provisioning'
import {
  getVersionCapability,
  resourceMeta,
  RESOURCES,
  VERSION_STATES
} from './versioning'

export const resourceLabel = (type) => resourceMeta(type).label

export const resourceNoun = (type) => resourceMeta(type).one

export const resourceNounPlural = (type) => resourceMeta(type).many

export const resourceIcon = (type) => resourceMeta(type).icon || 'pi pi-box'

export const SINGLETON_TYPES = ['application', 'firewall', 'custom_page']

export const OPTIONAL_SINGLETON_TYPES = ['firewall', 'custom_page']

export const OWNED_DEPENDENCIES = {
  application: ['function', 'connector'],
  firewall: ['function', 'network_list', 'waf'],
  custom_page: ['connector'],
  included: ['connector', 'network_list']
}

export const INCLUDED_PARENT = 'included'

export const LATEST_READY = 'LATEST'

const DEPENDENCY_TYPES = Object.keys(RESOURCES).filter(
  (type) => getVersionCapability(type).canDeploy === false
)

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
  if (type === 'firewall') return existingFirewallOptions().map((option) => option.value)
  if (type === 'custom_page') return existingCustomPageOptions().map((option) => option.value)
  return DEPENDENCY_CATALOG[type] ?? []
}

export const catalogFor = (type) => namesFor(type).map((name) => ({ id: name, name }))

export const resourceOptions = (type) =>
  namesFor(type).map((name) => ({ value: name, label: name }))

export const resourceName = (type, id) => id ?? ''

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

export const NO_READY_VERSION = new Set(['legacy-api'])

const BUILD_FAILED = new Set(['ecommerce-v2'])

const HAS_DRAFT = new Set(['marketing-site'])

export const DETECTION_FAILS_ONCE = new Set(['analytics-pro'])

const versionCache = new Map()

const versionId = (step) => `A${(step * 7919).toString(36).toUpperCase().slice(0, 6)}`

const stateFor = (name, index, count) => {
  if (index === 0 && HAS_DRAFT.has(name)) return VERSION_STATES.DRAFT
  if (index === 0 && BUILD_FAILED.has(name)) return VERSION_STATES.ERROR
  const built = HAS_DRAFT.has(name) || BUILD_FAILED.has(name) ? index - 1 : index
  if (built === 0) return VERSION_STATES.ACTIVE
  return built === count - 1 && count > 2 ? VERSION_STATES.ARCHIVED : VERSION_STATES.READY
}

const buildVersions = (name) => {
  const seed = hash(name)
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

export const hasDeployableVersion = (type, id) => versionOptions(type, id).length > 0

export const resolveLatestVersion = (type, id) => {
  const options = versionOptions(type, id)
  return options.find((option) => option.isCurrent)?.value ?? options[0]?.value ?? null
}

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

export const dependenciesOf = (parentType, resourceId) => {
  const graph = graphOf(resourceId)
  return Object.fromEntries(
    (OWNED_DEPENDENCIES[parentType] ?? []).map((type) => [type, [...(graph[type] ?? [])]])
  )
}

export { environmentsForWorkload, settingsIdsForWorkload } from '../state/workload-settings'

export const workloadsForSettings = (settingsId) => boundWorkloads(settingsId)

export const currentDeploymentFor = (workloadId, environment = '') =>
  DEPLOYMENT_HISTORY.find(
    (deployment) =>
      deployment.workloadId === String(workloadId) &&
      (environment ? deployment.environment === environment : deployment.current)
  )

export const servingApplication = (workloadId) => {
  const current = currentDeploymentFor(workloadId)
  if (current?.resourceType === 'application' && current.resourceName) return current.resourceName
  return findDeploymentByWorkload(workloadId)?.application?.name ?? ''
}

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
      type: strategy.type,
      bindingPolicy: strategy.bindingPolicy,
      deploymentPolicy: strategy.deploymentPolicy,
      strategyDefaults: strategy.strategyDefaults,
      workloads,
      environmentNames,
      workloadsCount: workloads.length,
      shared: workloads.length > 1,
      reach: reachLabel(workloads.length),
      domainsCount: workloads.reduce((total, workload) => total + workload.domains.length, 0)
    }
  })
)

export const settingsById = (id) =>
  deploymentSettings.value.find((settings) => settings.id === String(id))

export const releaseSeedForWorkload = (workloadId) => ({
  settingsIds: settingsIdsForWorkload(workloadId),
  application: servingApplication(workloadId)
})

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

export const DEPLOY_FAILS_ONCE = new Set(['s5'])

export const DEPLOY_FAILURE_MESSAGE =
  'A deployment for this Deployment setting is already building. Retry when it finishes.'

export const applicationRecord = (nameOrId) => {
  const key = String(nameOrId ?? '').trim()
  if (!key) return { id: '', name: '', preset: 'vue' }
  const pool = [...APPLICATIONS, ...provisionedApplications.value]
  const match =
    pool.find((application) => application.name === key) ??
    pool.find((application) => String(application.id) === key)
  return {
    id: match?.id ?? '',
    name: match?.name ?? key,
    preset: match?.preset ?? 'vue'
  }
}
