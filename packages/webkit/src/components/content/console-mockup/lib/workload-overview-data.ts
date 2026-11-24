import type { TagSeverity } from '../../tag/tag.vue'

export interface WorkloadOverviewNode {
  key: string
  kind: string
  icon: string
  name: string
  status: string
  severity: TagSeverity
  link?: boolean
  dashed?: boolean
  column: number
  row: number
}

export const WORKLOAD_OVERVIEW_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'settings', label: 'Settings' }
]

export const WORKLOAD_OVERVIEW_FACTS = {
  domain: 'w1082318.azion.run',
  id: '1082318',
  created: 'Jul 13 by Jordan Avery',
  owner: 'JA'
}

export const WORKLOAD_OVERVIEW_NODES: WorkloadOverviewNode[] = [
  {
    key: 'domains',
    kind: 'Domains',
    icon: 'az az-domains',
    name: WORKLOAD_OVERVIEW_FACTS.domain,
    status: '1 domain',
    severity: 'neutral',
    column: 1,
    row: 1
  },
  {
    key: 'workload',
    kind: 'Workload',
    icon: 'az az-workloads',
    name: 'storefront-prod',
    status: 'Live',
    severity: 'success',
    link: true,
    column: 3,
    row: 1
  },
  {
    key: 'firewall',
    kind: 'Firewall',
    icon: 'az az-firewall',
    name: '',
    status: 'Not bound',
    severity: 'neutral',
    dashed: true,
    column: 5,
    row: 1
  },
  {
    key: 'application',
    kind: 'Application',
    icon: 'az az-applications',
    name: 'storefront-prod',
    status: 'Active',
    severity: 'success',
    link: true,
    column: 7,
    row: 1
  },
  {
    key: 'custom-page',
    kind: 'Custom Page',
    icon: 'az az-custom-pages',
    name: '',
    status: 'Not bound',
    severity: 'neutral',
    dashed: true,
    column: 7,
    row: 2
  }
]

export const WORKLOAD_OVERVIEW_LINKS = [2, 4]

export const WORKLOAD_OVERVIEW_SELECTED_ENVIRONMENT = 'Production'

export const WORKLOAD_OVERVIEW_ENVIRONMENTS = [
  {
    name: 'Production',
    tag: 'Last used',
    selected: true,
    description: 'Live traffic. One version serves the domain, and deploying replaces it.'
  },
  {
    name: 'Preview',
    tag: '',
    selected: false,
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.'
  }
]
