import { reactive } from 'vue'

import { environmentsForWorkload, linkEnvironment } from './workload-settings'

const added = reactive(new Map())

export const environmentsFor = (workloadId) => {
  const seeded = environmentsForWorkload(workloadId)
  const taken = new Set(seeded.map((environment) => environment.name))
  const connected = (added.get(String(workloadId)) ?? [])
    .filter((name) => !taken.has(name))
    .map((name) => linkEnvironment(workloadId, name))
  return [...seeded, ...connected]
}

export const connectEnvironment = (workloadId, name) => {
  const key = String(workloadId)
  const environment = String(name).trim()
  const present = environmentsFor(key).some(
    (existing) => existing.name.toLowerCase() === environment.toLowerCase()
  )
  if (!present) added.set(key, [...(added.get(key) ?? []), environment])
  return linkEnvironment(key, environment)
}
