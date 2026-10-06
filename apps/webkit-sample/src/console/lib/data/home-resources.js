import { APPLICATIONS } from './applications'
import { FUNCTIONS, runtimeOf } from './functions'
import { WORKLOADS } from './workloads'

export const RESOURCE_TYPES = [
  { value: 'applications', label: 'Applications', singular: 'Application' },
  { value: 'workloads', label: 'Workloads', singular: 'Workload' },
  { value: 'domains', label: 'Domains', singular: 'Domain' },
  { value: 'functions', label: 'Functions', singular: 'Function' }
]

const applicationCards = () =>
  APPLICATIONS.map((row) => ({
    ...row,
    type: 'applications',
    typeLabel: 'Application',
    singular: 'Application',
    icon: 'ai ai-edge-application',
    preset: row.preset,
    subtitle: row.domainName,
    subtitleUrl: `https://${row.domainName}`,
    path: `/applications/${row.id}`
  }))

const workloadCards = () =>
  WORKLOADS.map((row) => ({
    ...row,
    type: 'workloads',
    typeLabel: 'Workload',
    singular: 'Workload',
    icon: 'ai ai-workloads',
    subtitle: row.domain,
    subtitleUrl: `https://${row.domain}`,
    path: `/workloads/${row.id}`
  }))

const domainCards = () =>
  WORKLOADS.map((row) => ({
    ...row,
    id: `domain-${row.id}`,
    name: row.domain,
    type: 'domains',
    typeLabel: 'Domain',
    singular: 'Domain',
    icon: 'ai ai-domains',
    preset: undefined,
    subtitle: `Served by ${row.name}`,
    subtitlePath: `/workloads/${row.id}`,
    path: `/workloads/${row.id}`
  }))

const functionCards = () =>
  FUNCTIONS.map((row) => ({
    ...row,
    type: 'functions',
    typeLabel: 'Function',
    singular: 'Function',
    icon: 'ai ai-edge-functions',
    subtitle: `${runtimeOf(row).label} · ${row.instances} instance${row.instances === 1 ? '' : 's'}`,
    path: `/functions/${row.id}`
  }))

export function allResources() {
  return [...applicationCards(), ...workloadCards(), ...domainCards(), ...functionCards()].sort(
    (a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)
  )
}

export function recentResources(rows, count = 4) {
  return rows.slice(0, count)
}
