import type {
  SectionedResourceEntry,
  SectionedResourceSection,
  SectionedResourceSibling
} from './sectioned-resource.vue'

export const sampleSections: SectionedResourceSection[] = [
  {
    label: 'Applications',
    items: [
      { id: 'app-segments', label: 'App segments', noun: 'Segment' },
      { id: 'segment-groups', label: 'Segment groups', noun: 'Group' },
      { id: 'server-groups', label: 'Server groups', noun: 'Server Group' },
      { id: 'connectors', label: 'Connectors', noun: 'Connector' }
    ]
  },
  {
    label: 'Access',
    items: [
      { id: 'access-rules', label: 'Access rules', noun: 'Rule' },
      { id: 'identity-providers', label: 'Identity providers', noun: 'Provider' },
      { id: 'posture-checks', label: 'Posture checks', noun: 'Check' },
      { id: 'device-groups', label: 'Device groups', noun: 'Device Group' }
    ]
  },
  {
    label: 'Network',
    items: [
      { id: 'tunnels', label: 'Tunnels', noun: 'Tunnel' },
      { id: 'dns-resolvers', label: 'DNS resolvers', noun: 'Resolver' },
      { id: 'split-routes', label: 'Split routes', noun: 'Route' },
      { id: 'ip-pools', label: 'IP pools', noun: 'Pool' }
    ]
  },
  {
    label: 'Monitoring',
    items: [
      { id: 'alerts', label: 'Alerts', noun: 'Alert' },
      { id: 'reports', label: 'Reports', noun: 'Report' },
      { id: 'log-streams', label: 'Log streams', noun: 'Stream' },
      { id: 'webhooks', label: 'Webhooks', noun: 'Webhook' }
    ]
  }
]

export const samplePage = 'access-rules'

export const sampleNetworkSections: SectionedResourceSection[] = [
  {
    label: 'Network security',
    items: [
      { id: 'network-lists', label: 'Network lists', noun: 'List' },
      { id: 'firewall-rules', label: 'Firewall rules', noun: 'Rule' },
      { id: 'rate-limits', label: 'Rate limits', noun: 'Limit' },
      { id: 'geo-blocks', label: 'Geo blocks', noun: 'Geo Block' },
      { id: 'port-rules', label: 'Port rules', noun: 'Port Rule' },
      { id: 'exceptions', label: 'Exceptions', noun: 'Exception' }
    ]
  }
]

const sampleOwners = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

const referenceTime = Date.UTC(2026, 10, 10, 12)

const emptyPages = ['posture-checks', 'webhooks', 'exceptions']

export const sampleEntriesFor = (sibling: SectionedResourceSibling): SectionedResourceEntry[] =>
  Array.from({ length: emptyPages.includes(sibling.id) ? 0 : 6 }, (_, index) => {
    const n = index + 1
    const slug = sibling.noun.toLowerCase().replace(/\s+/g, '-')
    return {
      id: `${30410 + n * 157}`,
      name: `${slug}-${String(n).padStart(2, '0')}`,
      status: n === 5 ? 'Inactive' : 'Active',
      owner: sampleOwners[index % sampleOwners.length],
      modifiedAt: new Date(referenceTime - n * 9 * 86_400_000)
    }
  })
