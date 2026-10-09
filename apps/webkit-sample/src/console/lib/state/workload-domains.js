import { DEFAULT_ENVIRONMENT_NAMES } from '../data/environments'
import { domainForWorkload } from '../data/workload-provisioning'
import { workloadById } from '../data/workloads'
import { environmentsForWorkload } from './workload-settings'

const environmentDomain = (base, environment) => {
  const [host, ...rest] = String(base).split('.')
  return [`${host}-${environment.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, ...rest].join('.')
}

export const workloadDomains = (workloadId, workloadName = '') => {
  const record = workloadById(workloadId)
  if (record?.environments) {
    return environmentsForWorkload(workloadId).flatMap(({ name }) =>
      (record.environments[name]?.domains ?? []).map((domain) => ({
        domain,
        environment: name,
        generated: false
      }))
    )
  }
  const base = record?.domain ?? domainForWorkload(workloadName)
  const aliases = record?.domains?.slice(1) ?? []
  const [primary] = DEFAULT_ENVIRONMENT_NAMES.value

  return environmentsForWorkload(workloadId).flatMap(({ name }) =>
    name === primary
      ? [base, ...aliases].map((domain, index) => ({
          domain,
          environment: name,
          generated: index === 0
        }))
      : [{ domain: environmentDomain(base, name), environment: name, generated: true }]
  )
}

export const workloadDomainsIn = (workloadId, environments, workloadName = '') =>
  workloadDomains(workloadId, workloadName).filter((entry) =>
    environments.includes(entry.environment)
  )
