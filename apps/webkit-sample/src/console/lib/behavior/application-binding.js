import { computed } from 'vue'

import { APPLICATIONS } from '../data/applications'
import { CONNECTORS } from '../data/connectors'
import { allCustomPages } from '../data/custom-pages'
import { allFirewalls } from '../data/firewalls'
import { provisionDeployment, provisionedApplications } from '../data/provisioning'
import { createdRowsFor } from '../state/created-resources'
import { allWorkloads } from '../state/workload-settings'

export const accountApplications = computed(() => [
  ...provisionedApplications.value,
  ...APPLICATIONS
])

export const applicationOptions = computed(() =>
  accountApplications.value.map((application) => ({
    value: application.name,
    label: application.name,
    description: application.domainName ?? ''
  }))
)

export const resolveApplicationChoice = (choice) => {
  const wanted = String(choice?.name ?? '').trim()
  if (!wanted) return null
  if (choice.mode === 'new') {
    const { application } = provisionDeployment({
      repoName: wanted,
      applicationName: wanted,
      publish: false
    })
    return { id: String(application.id), name: application.name, created: true }
  }
  const application = accountApplications.value.find((item) => item.name === wanted)
  return application
    ? { id: String(application.id), name: application.name, created: false }
    : null
}

export const HOSTS = {
  application: {
    noun: 'application',
    icon: 'ai ai-edge-application',
    canCreate: true,
    emptyPath: '/create',
    emptyLabel: 'Go to the Creation Center'
  },
  firewall: {
    noun: 'firewall',
    icon: 'ai ai-edge-firewall',
    canCreate: false,
    emptyPath: '/firewall/new',
    emptyLabel: 'Create a firewall'
  },
  workload: {
    noun: 'workload',
    icon: 'ai ai-workloads',
    canCreate: false,
    emptyPath: '/workloads/new',
    emptyLabel: 'Create a workload'
  },
  connector: {
    noun: 'connector',
    icon: 'ai ai-edge-connectors',
    canCreate: false,
    emptyPath: '/connectors/new',
    emptyLabel: 'Create a connector'
  },
  'custom-page': {
    noun: 'custom page',
    label: 'Custom Page',
    icon: 'ai ai-custom-pages',
    canCreate: false,
    emptyPath: '/custom-pages/new',
    emptyLabel: 'Create a custom page'
  }
}

export const workloadOptions = computed(() =>
  allWorkloads.value.map((workload) => ({
    value: workload.name,
    label: workload.name,
    description: workload.domain ?? ''
  }))
)

export const connectorOptions = computed(() =>
  [...createdRowsFor('connectors'), ...CONNECTORS].map((connector) => ({
    value: connector.name,
    label: connector.name,
    description: connector.address ?? connector.type ?? ''
  }))
)

export const customPageOptions = computed(() =>
  allCustomPages().map((page) => ({
    value: page.name,
    label: page.name,
    description: (page.statuses ?? []).join(', ')
  }))
)

export const firewallOptions = computed(() =>
  allFirewalls().map((firewall) => ({
    value: firewall.name,
    label: firewall.name,
    description: firewall.application || (firewall.modules ?? []).join(', ')
  }))
)

export const hostOptions = (kind) => {
  if (kind === 'firewall') return firewallOptions.value
  if (kind === 'workload') return workloadOptions.value
  if (kind === 'connector') return connectorOptions.value
  if (kind === 'custom-page') return customPageOptions.value
  return applicationOptions.value
}

export const hostRecords = (kind) => {
  if (kind === 'firewall') return allFirewalls()
  if (kind === 'workload') return allWorkloads.value
  if (kind === 'connector') return [...createdRowsFor('connectors'), ...CONNECTORS]
  if (kind === 'custom-page') return allCustomPages()
  return accountApplications.value
}

export const hostRecord = (kind, name) =>
  hostRecords(kind).find((item) => item.name === name) ?? null

export const resolveHostChoice = (kind, choice) => {
  if (kind === 'application' || !kind) return resolveApplicationChoice(choice)
  const wanted = String(choice?.name ?? '').trim()
  const record = hostRecords(kind).find((item) => item.name === wanted)
  return record ? { id: String(record.id), name: record.name, created: false } : null
}
