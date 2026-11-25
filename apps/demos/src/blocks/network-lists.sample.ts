export type NetworkListType = 'ip_cidr' | 'asn' | 'countries'

export interface NetworkListRecord {
  id: number
  name: string
  type: NetworkListType
  items: string[]
  active: boolean
  last_editor: string
  last_modified: string
}

export const sampleNetworkLists: NetworkListRecord[] = [
  {
    id: 7412,
    name: 'Blocked scanners',
    type: 'ip_cidr',
    items: ['192.0.2.0/24', '198.51.100.14', '203.0.113.0/25', '2001:db8::/48'],
    active: true,
    last_editor: 'jane.doe@example.com',
    last_modified: '2026-11-20T14:32:00Z'
  },
  {
    id: 7398,
    name: 'Office egress',
    type: 'ip_cidr',
    items: ['198.51.100.0/28', '203.0.113.200'],
    active: true,
    last_editor: 'john.smith@example.com',
    last_modified: '2026-11-18T09:05:00Z'
  },
  {
    id: 7355,
    name: 'Allowed countries',
    type: 'countries',
    items: ['US', 'CA', 'GB', 'DE', 'FR', 'JP'],
    active: true,
    last_editor: 'alex.morgan@example.com',
    last_modified: '2026-11-12T17:48:00Z'
  },
  {
    id: 7301,
    name: 'Hosting providers',
    type: 'asn',
    items: ['64496', '64497', '64500', '64511'],
    active: true,
    last_editor: 'sam.lee@example.com',
    last_modified: '2026-11-03T11:20:00Z'
  },
  {
    id: 7288,
    name: 'Partner API clients',
    type: 'ip_cidr',
    items: ['192.0.2.32/27', '192.0.2.64/27', '2001:db8:10::/64'],
    active: false,
    last_editor: 'priya.patel@example.com',
    last_modified: '2026-10-29T08:10:00Z'
  },
  {
    id: 7240,
    name: 'Sanctioned regions',
    type: 'countries',
    items: ['KP', 'IR', 'SY', 'CU'],
    active: true,
    last_editor: 'jane.doe@example.com',
    last_modified: '2026-10-21T15:00:00Z'
  },
  {
    id: 7197,
    name: 'Staging allowlist',
    type: 'ip_cidr',
    items: ['203.0.113.10', '203.0.113.11'],
    active: false,
    last_editor: 'john.smith@example.com',
    last_modified: '2026-10-14T13:37:00Z'
  },
  {
    id: 7150,
    name: 'Known bot networks',
    type: 'asn',
    items: ['64502', '64503', '64505', '64506', '64508'],
    active: true,
    last_editor: 'alex.morgan@example.com',
    last_modified: '2026-10-02T19:45:00Z'
  },
  {
    id: 7102,
    name: 'Monitoring probes',
    type: 'ip_cidr',
    items: ['198.51.100.64/26'],
    active: true,
    last_editor: 'sam.lee@example.com',
    last_modified: '2026-09-25T07:30:00Z'
  },
  {
    id: 7066,
    name: 'EU only',
    type: 'countries',
    items: ['DE', 'FR', 'ES', 'IT', 'NL', 'PT', 'BE', 'IE'],
    active: true,
    last_editor: 'priya.patel@example.com',
    last_modified: '2026-09-17T10:12:00Z'
  },
  {
    id: 7019,
    name: 'Legacy blocklist',
    type: 'ip_cidr',
    items: ['192.0.2.200', '192.0.2.201', '192.0.2.202'],
    active: false,
    last_editor: 'jane.doe@example.com',
    last_modified: '2026-08-30T16:05:00Z'
  },
  {
    id: 6987,
    name: 'CDN origins',
    type: 'asn',
    items: ['64499', '64510'],
    active: true,
    last_editor: 'john.smith@example.com',
    last_modified: '2026-08-11T12:00:00Z'
  }
]
