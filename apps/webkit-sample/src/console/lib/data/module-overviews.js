import { platformResources } from './search-index'

export const MODULE_OVERVIEWS = {
  workloads: {
    title: 'Workloads',
    description: 'How your workloads are serving traffic right now.',
    countLabel: 'Active workloads',
    countType: 'Workload',
    navIds: ['workloads'],
    list: { label: 'All Workloads', path: '/workloads' },
    create: { label: 'Create Workload', path: '/workloads/new' },
    stats: [
      { label: 'Requests', value: '2.4M', hint: 'Requests served in the last 24 hours.' },
      { label: 'Data transferred', value: '318 GB', hint: 'Egress in the last 24 hours.' },
      { label: 'Error rate', value: '0.12%', hint: '5xx responses in the last 24 hours.' }
    ]
  },
  applications: {
    title: 'Applications',
    description: 'Delivery and cache across your applications.',
    countLabel: 'Applications',
    countType: 'Application',
    navIds: ['applications'],
    list: { label: 'All Applications', path: '/applications' },
    create: { label: 'Create Application', path: '/applications/new' },
    stats: [
      { label: 'Requests', value: '1.8M', hint: 'Requests served in the last 24 hours.' },
      { label: 'Cache hit ratio', value: '94.2%', hint: 'Cache hits in the last 24 hours.' },
      { label: 'Saved by cache', value: '201 GB', hint: 'Origin egress avoided in the last 24 hours.' }
    ]
  },
  functions: {
    title: 'Functions',
    description: 'How your functions are running at the edge.',
    countLabel: 'Functions',
    countType: 'Function',
    navIds: ['functions'],
    list: { label: 'All Functions', path: '/functions' },
    create: { label: 'Create Function', path: '/functions/new' },
    stats: [
      { label: 'Invocations', value: '642K', hint: 'Invocations in the last 24 hours.' },
      { label: 'Error rate', value: '0.03%', hint: 'Failed invocations in the last 24 hours.' },
      { label: 'Average duration', value: '1.8 ms', hint: 'Average execution time in the last 24 hours.' }
    ]
  },
  firewall: {
    title: 'Firewall',
    description: 'What your firewalls are blocking before it reaches your applications.',
    countLabel: 'Firewalls',
    countType: 'Firewall',
    navIds: ['firewall', 'network-lists'],
    list: { label: 'All Firewalls', path: '/firewall' },
    create: { label: 'Create Firewall', path: '/firewall/new' },
    stats: [
      { label: 'Blocked requests', value: '12.4K', hint: 'Requests denied in the last 24 hours.' },
      { label: 'WAF matches', value: '3.1K', hint: 'WAF rule matches in the last 24 hours.' },
      { label: 'Rate limited', value: '840', hint: 'Requests rate limited in the last 24 hours.' }
    ]
  },
  'object-storage': {
    title: 'Object Storage',
    description: 'Buckets, stored data and egress at a glance.',
    countLabel: 'Buckets',
    countType: 'Bucket',
    navIds: ['object-storage'],
    list: { label: 'Buckets', path: '/object-storage' },
    create: { label: 'Create Bucket', path: '/object-storage/new' },
    stats: [
      { label: 'Stored', value: '1.2 TB', hint: 'Total data stored across buckets.' },
      { label: 'Objects', value: '48K', hint: 'Objects stored across buckets.' },
      { label: 'Egress', value: '84 GB', hint: 'Data served from storage in the last 24 hours.' }
    ]
  }
}

export function moduleEntries(navIds) {
  return platformResources()
    .filter((entry) => navIds.includes(entry.navId))
    .sort((a, b) => new Date(b.modifiedAt ?? 0) - new Date(a.modifiedAt ?? 0))
}
