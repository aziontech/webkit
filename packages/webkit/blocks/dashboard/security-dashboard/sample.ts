import type { BarListItem } from '@aziontech/webkit/bar-list'

import type {
  SecurityAttentionEntry,
  SecurityCardChanges,
  SecurityMatchedRequests,
  SecurityPeriodRange,
  SecuritySourceIp,
  SecuritySummary
} from './security-dashboard.vue'

export const sampleSummary: SecuritySummary = {
  blocked: {
    value: 49277,
    delta: 6.76,
    trend: [
      2547, 2598, 2722, 2380, 2434, 2481, 2396, 2333, 2051, 1803, 1877, 1809, 1903, 1705, 1524,
      1496, 1576, 1830, 1771, 1883, 1818, 1941, 2304, 2095
    ]
  },
  inspected: {
    value: 2273686,
    delta: 0.93,
    trend: [
      71719, 69758, 73190, 78995, 79204, 76566, 88893, 95004, 94033, 105848, 109796, 104325, 101445,
      117083, 110447, 117449, 113337, 110448, 101923, 98948, 89588, 93348, 85977, 86362
    ]
  },
  blockRate: {
    value: 2.19,
    delta: 17.07,
    trend: [
      2.46, 2.27, 2.33, 2.15, 2.2, 1.92, 2.06, 1.82, 1.76, 1.71, 1.83, 1.83, 1.89, 1.95, 2.16, 2.25,
      2.32, 2.31, 2.44, 2.54, 2.62, 2.63, 2.53, 2.62
    ]
  }
}

export const sampleEmptySummary: SecuritySummary = {
  blocked: { value: null, delta: null, trend: [] },
  inspected: { value: null, delta: null, trend: [] },
  blockRate: { value: null, delta: null, trend: [] }
}

export const sampleMatchedRequests: SecurityMatchedRequests = {
  labels: Array.from({ length: 24 }, (_, index) => new Date(Date.UTC(2026, 10, 9, index))),
  series: [
    {
      id: 'blocked',
      name: 'Blocked',
      color: 'danger',
      values: [
        1756, 2105, 1796, 2353, 2384, 2162, 2364, 2363, 2505, 2459, 2556, 2308, 2369, 2045, 1937,
        1999, 1679, 1838, 1773, 1812, 1698, 1314, 1494, 1839
      ]
    },
    {
      id: 'logged',
      name: 'Logged',
      color: 'warning',
      values: [
        485, 472, 605, 637, 609, 606, 778, 776, 705, 723, 754, 636, 571, 692, 619, 453, 487, 407,
        450, 378, 405, 416, 375, 369
      ]
    }
  ]
}

export const sampleCategories: BarListItem[] = [
  { id: 'SQL injection', name: 'SQL injection', value: 18420 },
  { id: 'Cross-site scripting', name: 'Cross-site scripting', value: 12960 },
  { id: 'Path traversal', name: 'Path traversal', value: 7310 },
  { id: 'Remote file inclusion', name: 'Remote file inclusion', value: 4180 },
  { id: 'Command injection', name: 'Command injection', value: 3240 },
  { id: 'Scanner probes', name: 'Scanner probes', value: 1870 }
]

export const sampleCountries: BarListItem[] = [
  { id: 'United States', name: 'United States', value: 14820 },
  { id: 'Brazil', name: 'Brazil', value: 10640 },
  { id: 'Germany', name: 'Germany', value: 6130 },
  { id: 'Netherlands', name: 'Netherlands', value: 4270 },
  { id: 'India', name: 'India', value: 3480 },
  { id: 'Singapore', name: 'Singapore', value: 2190 },
  { id: 'France', name: 'France', value: 1460 }
]

export const sampleSourceIps: SecuritySourceIp[] = [
  {
    id: '203.0.113.42',
    remoteAddress: '203.0.113.42',
    asn: 'AS64496 Hosting provider',
    country: 'Netherlands',
    category: 'SQL injection',
    requests: 4120
  },
  {
    id: '198.51.100.17',
    remoteAddress: '198.51.100.17',
    asn: 'AS64497 Anonymizing proxy',
    country: 'Germany',
    category: 'Cross-site scripting',
    requests: 3640
  },
  {
    id: '192.0.2.159',
    remoteAddress: '192.0.2.159',
    asn: 'AS64498 Unmanaged network',
    country: 'Romania',
    category: 'Path traversal',
    requests: 2910
  },
  {
    id: '203.0.113.172',
    remoteAddress: '203.0.113.172',
    asn: 'AS64496 Hosting provider',
    country: 'Netherlands',
    category: 'SQL injection',
    requests: 2480
  },
  {
    id: '198.51.100.139',
    remoteAddress: '198.51.100.139',
    asn: 'AS64499 VPN service',
    country: 'Seychelles',
    category: 'Command injection',
    requests: 1960
  },
  {
    id: '192.0.2.221',
    remoteAddress: '192.0.2.221',
    asn: 'AS64500 Research scanner',
    country: 'United States',
    category: 'Scanner probes',
    requests: 1390
  },
  {
    id: '198.51.100.130',
    remoteAddress: '198.51.100.130',
    asn: 'AS64501 Cloud provider',
    country: 'United States',
    category: 'Remote file inclusion',
    requests: 1120
  },
  {
    id: '192.0.2.23',
    remoteAddress: '192.0.2.23',
    asn: 'AS64502 Residential ISP',
    country: 'United States',
    category: 'Cross-site scripting',
    requests: 860
  }
]

export const sampleAttention: SecurityAttentionEntry[] = [
  {
    id: 'log-only',
    icon: 'az az-eye',
    title: 'A rule set logs requests it does not block',
    description: 'The shop service runs its rule set in log-only mode: 1.2K requests passed.',
    severity: 'warning',
    tag: 'Log only',
    action: { label: 'Review rules', href: '/security/rules' }
  },
  {
    id: 'spike',
    icon: 'az az-chart-line',
    title: 'Attack spike on api.example.com',
    description: 'SQL injection against the API rose 64% in the last hour.',
    severity: 'danger',
    tag: 'Spike',
    action: { label: 'Open security metrics', href: '/metrics/security' }
  },
  {
    id: 'no-rules',
    icon: 'az az-shield',
    title: 'Service without a rule set',
    description: 'The docs service has no security rule set attached.',
    severity: 'warning',
    tag: 'No rules',
    action: { label: 'Attach a rule set', href: '/security/rules' }
  }
]

export const sampleCardChanges: SecurityCardChanges = {
  matched: 19.01,
  categories: -0.03,
  countries: 9.33,
  ips: -6.79
}

export const samplePeriodRange: SecurityPeriodRange = {
  begin: '2026-11-09T00:00:00Z',
  end: '2026-11-09T23:59:59Z'
}
