import type { Deployment } from './lib/deployments'
import type { TableViewResource, TableViewResourceStatus } from './view-table.vue'

const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysAgo = (days: number) => new Date(referenceTime - days * 86_400_000)

const resource = (
  n: number,
  owner: string,
  days: number,
  status: TableViewResourceStatus = 'Live'
): TableViewResource => {
  const name = `resource-${String(n).padStart(2, '0')}`
  const domain = `${name}.example.com`
  return {
    id: `10${20482 + n * 173}`,
    name,
    domain,
    domains: [
      domain,
      ...Array.from({ length: n * 7 }, (_, j) => `${name}-alias-${j + 1}.example.com`)
    ],
    status,
    owner,
    modifiedAt: daysAgo(days)
  }
}

export const sampleResources: TableViewResource[] = [
  resource(1, 'Ethan Brooks', 0),
  resource(2, 'Jordan Kim', 18),
  resource(3, 'Taylor Reed', 36),
  resource(4, 'John Smith', 54),
  resource(5, 'Sam Lee', 72),
  resource(6, 'Priya Patel', 90),
  resource(7, 'Chris Taylor', 108),
  resource(8, 'Riley Carter', 126),
  resource(9, 'Ethan Brooks', 144, 'Inactive'),
  resource(10, 'Jordan Kim', 162)
]

const minutesAgo = (minutes: number) => new Date(referenceTime - minutes * 60_000)

export const deploymentsReferenceTime = referenceTime

export const sampleDeployments: Deployment[] = [
  {
    id: '1048213',
    version: 'AWPT11GA',
    current: false,
    status: 'Building',
    duration: '',
    project: 'acme-store',
    projectId: '1020655',
    environment: 'Preview',
    author: 'Jane Doe',
    deployedAt: minutesAgo(2)
  },
  {
    id: '1048207',
    version: 'AY3MQWWR',
    current: true,
    status: 'Ready',
    duration: '48s',
    project: 'acme-store',
    projectId: '1020655',
    environment: 'Production',
    author: 'John Smith',
    deployedAt: minutesAgo(95)
  },
  {
    id: '1048199',
    version: 'AZHGGSD8',
    current: false,
    status: 'Failed',
    duration: '1m 12s',
    project: 'docs-site',
    projectId: '1020711',
    environment: 'Staging',
    author: 'Alex Morgan',
    deployedAt: minutesAgo(260)
  },
  {
    id: '1048184',
    version: 'A1VA6NTP',
    current: true,
    status: 'Ready',
    duration: '36s',
    project: 'docs-site',
    projectId: '1020711',
    environment: 'Production',
    author: 'Sam Lee',
    deployedAt: minutesAgo(1_440)
  },
  {
    id: '1048172',
    version: 'A393WJA6',
    current: false,
    status: 'Queued',
    duration: '',
    project: 'site-assets',
    projectId: '1020734',
    environment: 'Preview',
    author: 'Priya Patel',
    deployedAt: minutesAgo(1_445)
  },
  {
    id: '1048160',
    version: 'ATNSEE8Y',
    current: false,
    status: 'Canceled',
    duration: '9s',
    project: 'site-assets',
    projectId: '1020734',
    environment: 'Staging',
    author: 'Jane Doe',
    deployedAt: minutesAgo(2_900)
  },
  {
    id: '1048151',
    version: 'AV1M49PF',
    current: true,
    status: 'Ready',
    duration: '52s',
    project: 'site-assets',
    projectId: '1020734',
    environment: 'Production',
    author: 'John Smith',
    deployedAt: minutesAgo(4_320)
  }
]
