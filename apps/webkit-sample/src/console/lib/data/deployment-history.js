import { consoleDeployRowsForApplication } from '@shared/lib/azion-deploys'
import { formatListDate, hoursAgo } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

import { applicationAt } from './applications'
import { findDeploymentByApplication, provisionedDeployRow } from './provisioning'
import { workloadById, WORKLOADS } from './workloads'

const TARGETS = ['application', 'firewall', 'custom-page']

const STATUSES = [
  ['Ready', 'Ready', 'Building', 'Ready'],
  ['Ready', 'Error', 'Ready', 'Queued'],
  ['Ready', 'Draft', 'Error', 'Ready']
]

const DURATIONS = ['99s', '1m 12s', '58s', '72s', '41s', '1m 04s']

const resourceFor = (target, application) => {
  if (target === 'firewall') {
    return { resourceType: target, resourceName: `${application.name}-firewall`, resourceId: '' }
  }
  if (target === 'custom-page') {
    return { resourceType: target, resourceName: `${application.name}-error-pages`, resourceId: '' }
  }
  return {
    resourceType: target,
    resourceName: application.name,
    resourceId: application.id
  }
}

export const ENVIRONMENT_SPREAD = 3

export function historyFor(workload, index) {
  const application = applicationAt(index)
  const twoEnvironments = index % ENVIRONMENT_SPREAD === 0

  return TARGETS.map((target, slot) => {
    const status = STATUSES[slot][(index + slot) % STATUSES[slot].length]
    const person = authorAt(index + slot)
    const resource = resourceFor(target, application)
    const deployedAt = hoursAgo(index * 96 + slot * 11 + 1)

    return {
      id: `dep-${workload.id}-${slot + 1}`,
      versionId: String(1200000000 + Number(workload.id) * 13 + slot * 7),
      workloadId: workload.id,
      workloadName: workload.name,
      current: slot === 0,
      status,
      duration: status === 'Ready' ? DURATIONS[(index + slot) % DURATIONS.length] : '',
      environment: twoEnvironments && slot === 1 ? 'Stage' : 'Production',
      deployedAt,
      date: formatListDate(deployedAt),
      ...resource,
      author: person.name,
      authorEmail: emailOf(person.name),
      authorAvatar: person.avatar
    }
  })
}

const byNewest = (a, b) => b.deployedAt - a.deployedAt

export const DEPLOYMENT_HISTORY = WORKLOADS.flatMap((workload, index) =>
  historyFor(workload, index)
).sort(byNewest)

export const deploymentByVersion = (versionId) =>
  DEPLOYMENT_HISTORY.find((deployment) => deployment.versionId === String(versionId))

export function deploymentRowsFor(workloadId, workloadName = 'Workload Name') {
  const id = String(workloadId)
  const seeded = DEPLOYMENT_HISTORY.filter((deployment) => deployment.workloadId === id)
  if (seeded.length) return seeded

  const workload = workloadById(id) ?? { id, name: workloadName }
  const index = Number(id.slice(-2)) || 0
  return historyFor(workload, index).sort(byNewest)
}

const APPLICATION_HISTORY_LENGTH = 4

const withStarted = (started, history) => {
  if (!started.length) return history
  const superseded = started.some((row) => row.current)
  return [
    ...started,
    ...history.map((row) => (superseded && row.current ? { ...row, current: false } : row))
  ]
}

export function applicationDeploymentRows(applicationId, applicationName = 'Application') {
  const id = String(applicationId)
  const started = consoleDeployRowsForApplication(id)
  const provisioned = findDeploymentByApplication(id)
  if (provisioned) {
    const published =
      provisioned.versionId && provisioned.workload ? [provisionedDeployRow(provisioned)] : []
    return withStarted(started, published)
  }

  const seeded = DEPLOYMENT_HISTORY.filter(
    (deployment) => deployment.resourceType === 'application' && deployment.resourceId === id
  )
  const name = seeded[0]?.resourceName || applicationName
  const seed = Number(id.slice(-3)) || 0
  const oldest = seeded.reduce(
    (earliest, deployment) => Math.min(earliest, deployment.deployedAt.getTime()),
    Date.now()
  )

  const derived = Array.from(
    { length: Math.max(APPLICATION_HISTORY_LENGTH - seeded.length, 0) },
    (_, slot) => {
      const workload = WORKLOADS[(seed + slot) % WORKLOADS.length]
      const status = STATUSES[slot % STATUSES.length][(seed + slot) % STATUSES[0].length]
      const person = authorAt(seed + slot)
      const deployedAt = new Date(oldest - (slot + 1) * (29 + (seed % 7)) * 3_600_000)

      return {
        id: `dep-app-${id}-${slot + 1}`,
        versionId: String(1500000000 + (Number(id) % 9_000_000) + slot * 7),
        workloadId: workload.id,
        workloadName: workload.name,
        current: false,
        status,
        duration: status === 'Ready' ? DURATIONS[(seed + slot) % DURATIONS.length] : '',
        environment: (seed + slot) % 4 === 1 ? 'Stage' : 'Production',
        deployedAt,
        date: formatListDate(deployedAt),
        resourceType: 'application',
        resourceName: name,
        resourceId: id,
        author: person.name,
        authorEmail: emailOf(person.name),
        authorAvatar: person.avatar
      }
    }
  )

  const history = [...seeded, ...derived]
    .sort(byNewest)
    .map((row, index) => (row.current === (index === 0) ? row : { ...row, current: index === 0 }))

  return withStarted(started, history)
}

export const latestApplicationDeployment = (applicationId, applicationName) =>
  applicationDeploymentRows(applicationId, applicationName)[0] ?? null
