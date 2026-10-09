import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

import { SCENARIO_WORKLOADS } from './scenarios'

export const WORKLOAD_COUNT = 20

const GENERATED = Array.from({ length: WORKLOAD_COUNT }, (_, i) => {
  const n = i + 1
  const extraCount = (n * 7) % 99
  const domains = [
    `my-workload-${n}.azion.run`,
    ...Array.from({ length: extraCount }, (_, j) => `my-workload-${n}-alias-${j + 1}.azion.run`)
  ]
  const modified = daysAgo(i * 18)
  const created = daysAgo(i * 18 + 45)
  return {
    id: `10${(20482 + n * 173).toString()}`,
    name: `workload_${String(n).padStart(2, '0')}`,
    domain: domains[0],
    domains,
    domainCount: extraCount,
    status: n % 9 === 0 ? 'Inactive' : 'Live',
    modifiedAt: modified,
    createdAt: created,
    lastModified: formatListDate(modified),
    owner: authorAt(i).name,
    ownerAvatar: authorAt(i).avatar
  }
})

const scenarioWorkload = (workload, index) => {
  const domains = Object.values(workload.environments).flatMap((entry) => entry.domains)
  const modified = daysAgo(workload.days)
  const owner = authorAt(index)
  return {
    id: workload.id,
    name: workload.name,
    domain: domains[0],
    domains,
    domainCount: domains.length - 1,
    status: 'Live',
    modifiedAt: modified,
    createdAt: daysAgo(workload.days + 30),
    lastModified: formatListDate(modified),
    owner: owner.name,
    ownerAvatar: owner.avatar,
    applicationId: workload.applicationId,
    environments: workload.environments
  }
}

export const WORKLOADS = [...GENERATED, ...SCENARIO_WORKLOADS.map(scenarioWorkload)]

export const workloadById = (id) => WORKLOADS.find((workload) => workload.id === String(id))
