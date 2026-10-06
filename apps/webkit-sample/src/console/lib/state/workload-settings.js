import { computed, ref, watch } from 'vue'

import {
  addStrategy,
  AZION_DEFAULT_ID,
  DEFAULT_DEPLOYMENT_POLICY,
  environmentSuffix,
  newWorkloadDefaults,
  strategies,
  workloadSettingsId
} from '../data/deployment-strategies'
import { DEFAULT_ENVIRONMENTS, policyForEnvironment } from '../data/environments'
import { provisionedWorkloads } from '../data/provisioning'
import { WORKLOADS } from '../data/workloads'

export const ENVIRONMENT_ORDER = computed(() =>
  DEFAULT_ENVIRONMENTS.value.map((environment) => ({ name: environment.name }))
)

const environmentPolicy = (name) => policyForEnvironment(name) ?? DEFAULT_DEPLOYMENT_POLICY

const ownSettingsId = workloadSettingsId

const SHARED_BY_INDEX = { 0: 's1', 4: 's1', 8: 's1', 1: 's2', 6: 's2' }

const BINDINGS_KEY = 'webkit-sample:workload-settings'

const loadBindings = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(BINDINGS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const bindings = ref(loadBindings())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(BINDINGS_KEY, JSON.stringify(bindings.value))
  } catch {
  }
}

export const environmentsForWorkload = (workloadId) => {
  const key = String(workloadId)
  const overlay = bindings.value[key] ?? {}
  const names = [
    ...ENVIRONMENT_ORDER.value.map((environment) => environment.name),
    ...Object.keys(overlay)
  ]

  return [...new Set(names)].map((name) => linkEnvironment(key, name))
}

export const linkEnvironment = (workloadId, name) => {
  const key = String(workloadId)
  const policy = environmentPolicy(name)
  const chosen = (bindings.value[key] ?? {})[name]
  if (chosen) return { name, deploymentPolicy: policy, settingsId: chosen, auto: false }
  const index = WORKLOADS.findIndex((workload) => workload.id === key)
  return {
    name,
    deploymentPolicy: policy,
    settingsId: autoLink(key, index, policy, name),
    auto: true
  }
}

const reachableBy = (strategy, workloadId) =>
  strategy.system ||
  strategy.shared ||
  String(strategy.ownerWorkloadId) === String(workloadId)

const autoLink = (workloadId, index, policy, environmentName) => {
  const shared = environmentName === 'Production' ? SHARED_BY_INDEX[index] : ''
  const preferred = [shared, ownSettingsId(workloadId, environmentName)].filter(Boolean)
  const compatible = strategies.value.filter(
    (strategy) =>
      strategy.deploymentPolicy === policy &&
      strategy.status === 'Active' &&
      reachableBy(strategy, workloadId)
  )
  const hit = preferred.map((id) => compatible.find((strategy) => strategy.id === id)).find(Boolean)
  return hit?.id ?? compatible[0]?.id ?? AZION_DEFAULT_ID
}

export const settingsForPolicy = (policy, boundId = '', workloadId = '') =>
  strategies.value.filter(
    (strategy) =>
      strategy.id === String(boundId) ||
      (strategy.deploymentPolicy === policy && reachableBy(strategy, workloadId))
  )

export const settingsIdsForWorkload = (workloadId) =>
  environmentsForWorkload(workloadId).map((environment) => environment.settingsId)

export const allWorkloads = computed(() => [...provisionedWorkloads.value, ...WORKLOADS])

export const boundWorkloads = (settingsId) =>
  allWorkloads.value.filter((workload) =>
    settingsIdsForWorkload(workload.id).includes(String(settingsId))
  )

export const isShared = (settingsId) => boundWorkloads(settingsId).length > 1

export function bindWorkloadSettings(workloadId, environment, settingsId) {
  const key = String(workloadId)
  bindings.value = {
    ...bindings.value,
    [key]: { ...(bindings.value[key] ?? {}), [environment]: String(settingsId) }
  }
  persist()
}

export function createSettingsForWorkload(workload) {
  if (!workload?.id) return []
  const key = String(workload.id)
  if (Object.keys(bindings.value[key] ?? {}).length) return []

  const defaults = newWorkloadDefaults.value
  return DEFAULT_ENVIRONMENTS.value.map((environment) => {
    const setting = addStrategy({
      name: `${workload.name}${environmentSuffix(environment.name)}`,
      description: `Created with the ${workload.name} workload for ${environment.name}.`,
      firewall: defaults.firewall,
      customPage: defaults.customPage,
      bindingPolicy: defaults.bindingPolicy,
      deploymentPolicy: environment.deploymentPolicy,
      ownerWorkloadId: key
    })
    bindWorkloadSettings(key, environment.name, setting.id)
    return setting
  })
}

watch(provisionedWorkloads, (workloads) => workloads.forEach(createSettingsForWorkload), {
  immediate: true,
  deep: false
})

export const reachLabel = (count) => {
  if (count === 0) return 'No workloads'
  if (count === 1) return '1 workload'
  return `${count} workloads`
}

export const settingsReach = computed(() =>
  strategies.value.map((strategy) => {
    const workloads = boundWorkloads(strategy.id)
    return {
      id: strategy.id,
      workloads,
      count: workloads.length,
      shared: workloads.length > 1,
      dedicated: Boolean(strategy.ownerWorkloadId) && workloads.length <= 1
    }
  })
)

export const reachFor = (settingsId) =>
  settingsReach.value.find((entry) => entry.id === String(settingsId))

export const workloadBindings = computed(() =>
  allWorkloads.value.map((workload) => ({
    id: String(workload.id),
    name: workload.name,
    environments: environmentsForWorkload(workload.id)
  }))
)
