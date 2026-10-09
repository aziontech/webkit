import { daysAgo, hoursAgo } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { computed, reactive } from 'vue'

import { createdRowsFor } from '../state/created-resources'
import { liveConsoleDeploy } from '../state/workload-deploys'
import {
  boundWorkloads,
  environmentsForWorkload,
  reachLabel,
  settingsIdsForWorkload
} from '../state/workload-settings'
import { APPLICATIONS } from './applications'
import { scenarioVersionsFor } from './scenarios'
import { connectorMeta, CONNECTORS } from './connectors'
import { existingCustomPageOptions } from './custom-pages'
import { DEPLOYMENT_HISTORY } from './deployment-history'
import { strategies } from './deployment-strategies'
import { existingFirewallOptions } from './firewalls'
import { findDeploymentByWorkload, provisionedApplications } from './provisioning'
import { getVersionCapability, resourceMeta, RESOURCES, VERSION_STATES } from './versioning'

export const resourceLabel = (type) => resourceMeta(type).label

export const resourceNoun = (type) => resourceMeta(type).one

export const resourceNounPlural = (type) => resourceMeta(type).many

export const resourceTypeLabel = (type) =>
  resourceMeta(type)
    .one.split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

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
  'Add function instance "image-resize"',
  'Cache static assets for 30 days',
  'Add rule "Redirect /blog to docs"',
  'Add device group "Mobile"',
  'Bypass cache for /api/*',
  'Update function instance "ab-test" arguments',
  'Add rule "Security headers"',
  'Enable Image Processor',
  'Reorder Rules Engine rules',
  'Remove rule "Legacy load balancer"'
]

export const NO_READY_VERSION = new Set(['legacy-api'])

const BUILD_FAILED = new Set(['ecommerce-v2'])

const HAS_DRAFT = new Set(['marketing-site'])

export const DETECTION_FAILS_ONCE = new Set(['analytics-pro'])

const versionCache = reactive(new Map())

const hasDraft = (name) => HAS_DRAFT.has(name) || hash(name) % 3 === 0

const ID_FLOOR = 36 ** 6

const ID_SPAN = 36 ** 7 - ID_FLOOR

const versionId = (step) =>
  `A${(ID_FLOOR + ((step * 2_654_435_761) % ID_SPAN)).toString(36).toUpperCase()}`

export const newVersionId = (name) => versionId(hash(name) + (Date.now() % 100_003))

const stateFor = (name, index, count) => {
  if (index === 0 && hasDraft(name)) return VERSION_STATES.DRAFT
  if (index === 0 && BUILD_FAILED.has(name)) return VERSION_STATES.ERROR
  const built = hasDraft(name) || BUILD_FAILED.has(name) ? index - 1 : index
  if (built === 0) return VERSION_STATES.ACTIVE
  return built === count - 1 && count > 2 ? VERSION_STATES.ARCHIVED : VERSION_STATES.READY
}

const scenarioVersions = (name) =>
  scenarioVersionsFor(name).map((entry) => ({
    id: entry.id,
    name: entry.id,
    comment: entry.comment,
    state: entry.state,
    isCurrent: entry.state === VERSION_STATES.ACTIVE,
    createdAt: entry.createdAt,
    author: authorAt(entry.authorIndex).name,
    authorAvatar: authorAt(entry.authorIndex).avatar
  }))

const buildVersions = (name) => {
  if (scenarioVersionsFor(name).length) return scenarioVersions(name)
  const seed = hash(name)
  if (NO_READY_VERSION.has(name)) {
    const id = versionId(seed)
    return [
      {
        id,
        name: id,
        comment: 'Remove rule "Legacy redirects"',
        state: VERSION_STATES.DRAFT,
        isCurrent: false,
        createdAt: daysAgo(9 + (seed % 40)),
        author: authorAt(seed).name,
        authorAvatar: authorAt(seed).avatar
      }
    ]
  }

  const count = 3 + (seed % 12) + (hasDraft(name) || BUILD_FAILED.has(name) ? 1 : 0)
  let hours = 3 + (seed % 20)
  return Array.from({ length: count }, (_, index) => {
    const step = seed + index * 977
    const state = stateFor(name, index, count)
    const createdAt = hours < 48 ? hoursAgo(hours) : daysAgo(Math.round(hours / 24))
    hours += 6 + (step % 40)
    const id = versionId(step)
    return {
      id,
      name: id,
      comment: COMMENTS[(step + index) % COMMENTS.length],
      state,
      isCurrent: state === VERSION_STATES.ACTIVE,
      createdAt,
      author: authorAt(step).name,
      authorAvatar: authorAt(step).avatar
    }
  })
}

const versionsOf = (name) => {
  if (!name) return []
  if (!versionCache.has(name)) versionCache.set(name, buildVersions(name))
  return versionCache.get(name)
}

export const applicationVersions = (name) => versionsOf(name)

export const applicationVersion = (name, id) =>
  versionsOf(name).find((entry) => entry.id === String(id)) ?? null

export const latestBuiltVersionId = (name) =>
  versionsOf(name).find((entry) =>
    [VERSION_STATES.READY, VERSION_STATES.ACTIVE].includes(entry.state)
  )?.id ?? null

export const recordApplicationBuild = (name, comment = '', id = newVersionId(name)) => {
  const versions = versionsOf(name)
  const person = authorAt(0)
  const version = {
    id,
    name: id,
    comment,
    state: VERSION_STATES.READY,
    isCurrent: false,
    createdAt: new Date(),
    author: person.name,
    authorAvatar: person.avatar
  }
  const draftIndex = versions.findIndex((entry) => entry.state === VERSION_STATES.DRAFT)
  versions.splice(draftIndex === 0 ? 1 : 0, 0, version)
  return version
}

export const createDraftFrom = (name, sourceId) => {
  const versions = versionsOf(name)
  const source = versions.find((entry) => entry.id === String(sourceId))
  const person = authorAt(0)
  const id = newVersionId(name)
  const draft = {
    id,
    name: id,
    comment: '',
    changes: [],
    state: VERSION_STATES.DRAFT,
    isCurrent: false,
    sourceVersionId: source?.id ?? '',
    createdAt: new Date(),
    author: person.name,
    authorAvatar: person.avatar
  }
  versions.unshift(draft)
  return draft
}

export const NO_COMMENT = 'No description'

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1)

export const suggestVersionComment = (changes = []) => {
  if (!changes.length) return ''
  if (changes.length === 1) return changes[0]
  if (changes.length === 2) return `${changes[0]} and ${lowerFirst(changes[1])}`
  return `${changes[0]} and ${changes.length - 1} more changes`
}

export const versionComment = (version) =>
  version?.comment || suggestVersionComment(version?.changes)

export const setVersionComment = (version, text) => {
  if (version) version.comment = text
}

export const noteVersionChange = (name, id, text) => {
  const version = versionsOf(name).find((entry) => entry.id === String(id))
  if (!version || !text) return
  version.changes = [...(version.changes ?? []).filter((entry) => entry !== text), text]
  const person = authorAt(0)
  const log = version.history ?? []
  version.history = [
    {
      id: `${version.id}-${log.length + 1}`,
      text,
      at: new Date(),
      author: person.name,
      authorAvatar: person.avatar
    },
    ...log
  ]
}

export const earlierVersions = (name, id) => {
  const versions = versionsOf(name)
  const index = versions.findIndex((entry) => entry.id === String(id))
  return versions.slice(index + 1).filter((entry) => entry.state !== VERSION_STATES.DRAFT)
}

const buildRuns = new Map()

export const buildApplicationVersion = (name, id, durationMs = 6000) => {
  const key = `${name}:${id}`
  if (buildRuns.has(key)) return buildRuns.get(key)
  const version = versionsOf(name).find((entry) => entry.id === String(id))
  if (!version) return Promise.resolve(null)
  version.comment = versionComment(version)
  version.state = VERSION_STATES.BUILDING
  const run = new Promise((settle) => {
    setTimeout(() => {
      version.state = VERSION_STATES.READY
      version.createdAt = new Date()
      buildRuns.delete(key)
      settle(version)
    }, durationMs)
  })
  buildRuns.set(key, run)
  return run
}

export const markVersionDeployed = (name, id) => {
  versionsOf(name).forEach((entry) => {
    if (entry.id === String(id)) {
      entry.state = VERSION_STATES.ACTIVE
      entry.isCurrent = true
    } else if (entry.state === VERSION_STATES.ACTIVE) {
      entry.state = VERSION_STATES.READY
      entry.isCurrent = false
    }
  })
}

export const versionOptions = (type, id) => {
  const states = DEPENDENCY_TYPES.includes(type)
    ? [VERSION_STATES.READY]
    : [VERSION_STATES.READY, VERSION_STATES.ACTIVE]
  return versionsOf(id)
    .filter((entry) => states.includes(entry.state))
    .map((entry) => ({
      value: entry.id,
      name: entry.name,
      label: entry.comment || NO_COMMENT,
      createdAt: entry.createdAt,
      author: entry.author,
      authorAvatar: entry.authorAvatar,
      isCurrent: entry.isCurrent
    }))
}

export const hasDeployableVersion = (type, id) => versionOptions(type, id).length > 0

export const resolveLatestVersion = (type, id) => {
  const options = versionOptions(type, id)
  return options.find((option) => option.isCurrent)?.value ?? options[0]?.value ?? null
}

const timeOf = (date) => new Date(date ?? 0).getTime() || 0

export const versionChoices = (type, id) =>
  versionOptions(type, id)
    .map((option) => ({
      id: option.value,
      name: option.name,
      comment: option.label,
      author: option.author,
      authorAvatar: option.authorAvatar,
      createdAt: option.createdAt,
      active: option.isCurrent
    }))
    .sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt))

export const chosenVersion = (versions, id) =>
  versions.find((entry) => entry.id === id) ?? versions[0] ?? null

const OBJECT_STORAGE = 'Object Storage'

export const isObjectStorage = (type, name, kind = '') => {
  if (type !== 'connector') return false
  if (kind === OBJECT_STORAGE) return true
  return [...createdRowsFor('connectors'), ...CONNECTORS].some(
    (connector) =>
      connector.name === name &&
      (connector.type === 'storage' || connector.typeLabel === OBJECT_STORAGE)
  )
}

export const deployTarget = (type, name, kind = '') =>
  isObjectStorage(type, name, kind)
    ? {
        label: OBJECT_STORAGE,
        icon: connectorMeta('storage').icon,
        versions: [],
        note: 'Not versioned'
      }
    : {
        label: resourceTypeLabel(type),
        icon: resourceIcon(type),
        versions: versionChoices(type, name),
        note: ''
      }

const graphCache = new Map()

const buildGraph = (name, version) => {
  const seed = hash(name)
  const drift = version ? hash(version) % 3 : 0
  const pick = (type, offset, count) => {
    const pool = DEPENDENCY_CATALOG[type]
    return Array.from(
      { length: Math.min(count, pool.length) },
      (_, index) => pool[(seed + offset + index * 2) % pool.length]
    )
  }
  return {
    function: pick('function', drift, 1 + ((seed + drift) % 2)),
    connector: pick('connector', 3 + drift, 1 + ((seed >> 2) % 2)),
    network_list: pick('network_list', 5, 1 + (seed % 2)),
    waf: pick('waf', 7, 1)
  }
}

const graphOf = (name, version = '') => {
  if (!name) return { function: [], connector: [], network_list: [], waf: [] }
  const key = `${name}@${version}`
  if (!graphCache.has(key)) graphCache.set(key, buildGraph(name, version))
  return graphCache.get(key)
}

export const dependenciesOf = (parentType, resourceId, versionId = '') => {
  const graph = graphOf(resourceId, versionId)
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
  const live = liveConsoleDeploy(workloadId)
  if (live) return live.application.name
  const current = currentDeploymentFor(workloadId)
  if (current?.resourceType === 'application' && current.resourceName) return current.resourceName
  return findDeploymentByWorkload(workloadId)?.application?.name ?? ''
}

const applicationIn = (workloadId, environment) => {
  const live = liveConsoleDeploy(workloadId, environment)
  if (live) return live.application.name
  return (
    DEPLOYMENT_HISTORY.find(
      (deployment) =>
        deployment.workloadId === String(workloadId) &&
        deployment.environment === environment &&
        deployment.resourceType === 'application'
    )?.resourceName ?? ''
  )
}

export const environmentBindings = (workloadId) => {
  const serving = servingApplication(workloadId)
  return environmentsForWorkload(workloadId).map((linked) => {
    const settings = strategies.value.find((strategy) => strategy.id === linked.settingsId)
    return {
      name: linked.name,
      settingsName: settings?.name ?? '',
      bindingPolicy: settings?.bindingPolicy ?? 'STRICT',
      application: applicationIn(workloadId, linked.name) || serving
    }
  })
}

export const environmentLocked = (binding, applicationName) =>
  binding.bindingPolicy === 'STRICT' &&
  Boolean(binding.application) &&
  binding.application !== applicationName

export const deploymentSettings = computed(() =>
  strategies.value.map((strategy) => {
    const workloads = workloadsForSettings(strategy.id).map((workload) => ({
      id: workload.id,
      name: workload.name,
      domains: workload.domains.slice(0, 1 + (hash(workload.name) % 3)),
      environment: currentDeploymentFor(workload.id)?.environment || 'Production'
    }))

    const environmentNames = [
      ...new Set(
        workloadsForSettings(strategy.id).flatMap((workload) =>
          environmentsForWorkload(workload.id)
            .filter((linked) => linked.settingsId === strategy.id)
            .map((linked) => linked.name)
        )
      )
    ]

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
