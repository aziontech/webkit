import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

export const WORKLOAD_COUNT = 20

export const WORKLOADS = Array.from({ length: WORKLOAD_COUNT }, (_, i) => {
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

export const workloadById = (id) => WORKLOADS.find((workload) => workload.id === String(id))
