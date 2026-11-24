import type { BarListItem } from '@aziontech/webkit/bar-list'
import type { ChartSeries } from '@aziontech/webkit/chart'
import type { FilterMenuField } from '@aziontech/webkit/filter-menu'
import type { SelectOptionItem } from '@aziontech/webkit/select'
import type { SeverityTagSeverity } from '@aziontech/webkit/severity-tag'

import type {
  SecurityAttentionEntry,
  SecurityCardChanges,
  SecurityMatchedRequests,
  SecurityPeriodRange,
  SecuritySourceIp,
  SecuritySummary
} from './dashboard-security.vue'

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

/** What a rule did with one request of the ByActor variant. */
export type ActorOutcome = 'allowed' | 'blocked' | 'held' | 'approved' | 'denied'

/** One row of the ByActor Requests table. */
export interface ActorActivityRow {
  /** Stable row key. */
  id: string
  /** When the request arrived. */
  time: string
  /** Who sent it. */
  actor: string
  /** What the rule did. */
  outcome: ActorOutcome
  /** The category of the action. */
  category: string
  /** How severe the action is. */
  severity: SeverityTagSeverity
  /** The host it went to. */
  destination: string
  /** The HTTP method. */
  method: string
  /** The rule that decided it. */
  rule: string
}

/** One outcome tile of the ByActor variant. */
export interface ActorFigure {
  /** Stable key, the outcome for an outcome tile. */
  id: string
  /** The tile label. */
  label: string
  /** One sentence that defines the figure. */
  description: string
  /** The figure for the time range. */
  value: number
  /** Change against the previous day, in percent. */
  delta: number
  /** A rise is a regression. */
  inverse: boolean
}

export const sampleActorTimeRanges: SelectOptionItem[] = [
  {
    value: 'Last hour',
    label: 'Last hour'
  },
  {
    value: 'Last 24 hours',
    label: 'Last 24 hours'
  },
  {
    value: 'Last 7 days',
    label: 'Last 7 days'
  },
  {
    value: 'Last 30 days',
    label: 'Last 30 days'
  }
]

export const sampleActorFilterFields: FilterMenuField[] = [
  {
    id: 'actor',
    label: 'Actor',
    options: [
      'report-builder',
      'ticket-triage',
      'inventory-sync',
      'invoice-reader',
      'release-helper',
      'data-export',
      'calendar-sync'
    ].map((name) => ({ value: name, label: name }))
  },
  {
    id: 'outcome',
    label: 'Outcome',
    options: [
      { value: 'allowed', label: 'Allowed' },
      { value: 'blocked', label: 'Blocked' },
      { value: 'held', label: 'Held' },
      { value: 'approved', label: 'Approved' },
      { value: 'denied', label: 'Denied' }
    ]
  },
  {
    id: 'category',
    label: 'Category',
    options: ['Read', 'Write', 'Search', 'Export', 'Delete', 'Admin'].map((name) => ({
      value: name,
      label: name
    }))
  }
]

export const sampleActorFigures: ActorFigure[] = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Every request the rules evaluated in the time range.',
    value: 14489,
    delta: 8.4,
    inverse: false
  },
  {
    id: 'allowed',
    label: 'Allowed',
    description: 'Requests a rule let through to their destination.',
    value: 12913,
    delta: 7.9,
    inverse: false
  },
  {
    id: 'blocked',
    label: 'Blocked',
    description: 'Requests a rule stopped before they reached their destination.',
    value: 1348,
    delta: 12.6,
    inverse: true
  },
  {
    id: 'held',
    label: 'Held',
    description: 'Requests a rule paused until someone approves or denies them.',
    value: 228,
    delta: 4.1,
    inverse: true
  },
  {
    id: 'approved',
    label: 'Approved',
    description: 'Held requests a reviewer approved.',
    value: 186,
    delta: 3.2,
    inverse: false
  },
  {
    id: 'denied',
    label: 'Denied',
    description: 'Held requests a reviewer denied.',
    value: 41,
    delta: -9.5,
    inverse: true
  },
  {
    id: 'over-budget',
    label: 'Over budget',
    description: 'Requests that went past the spending or volume budget set for their actor.',
    value: 73,
    delta: 21.7,
    inverse: true
  }
]

export const sampleActorOutcomes: ChartSeries[] = [
  {
    id: 'allowed',
    name: 'Allowed',
    color: 'success',
    values: [
      412, 386, 341, 318, 296, 305, 352, 448, 571, 664, 718, 742, 731, 756, 769, 748, 702, 655, 598,
      541, 503, 476, 451, 430
    ]
  },
  {
    id: 'blocked',
    name: 'Blocked',
    color: 'danger',
    values: [
      38, 35, 31, 29, 33, 30, 36, 47, 62, 71, 84, 79, 76, 91, 88, 82, 74, 69, 61, 55, 49, 46, 42, 40
    ]
  },
  {
    id: 'held',
    name: 'Held',
    color: 'warning',
    values: [6, 5, 4, 3, 4, 3, 5, 8, 11, 14, 16, 15, 13, 17, 18, 15, 13, 12, 10, 9, 8, 7, 6, 6]
  }
]

export const sampleActors: BarListItem[] = [
  {
    id: 'report-builder',
    name: 'report-builder',
    value: 4494
  },
  {
    id: 'ticket-triage',
    name: 'ticket-triage',
    value: 3187
  },
  {
    id: 'inventory-sync',
    name: 'inventory-sync',
    value: 2463
  },
  {
    id: 'invoice-reader',
    name: 'invoice-reader',
    value: 1738
  },
  {
    id: 'release-helper',
    name: 'release-helper',
    value: 1304
  },
  {
    id: 'data-export',
    name: 'data-export',
    value: 869
  },
  {
    id: 'calendar-sync',
    name: 'calendar-sync',
    value: 434
  }
]

export const sampleActorCategories: BarListItem[] = [
  {
    id: 'Read',
    name: 'Read',
    value: 7827
  },
  {
    id: 'Write',
    name: 'Write',
    value: 3042
  },
  {
    id: 'Search',
    name: 'Search',
    value: 1738
  },
  {
    id: 'Export',
    name: 'Export',
    value: 869
  },
  {
    id: 'Delete',
    name: 'Delete',
    value: 579
  },
  {
    id: 'Admin',
    name: 'Admin',
    value: 434
  }
]

export const sampleActorDestinations: BarListItem[] = [
  {
    id: 'api.example.com',
    name: 'api.example.com',
    value: 5508
  },
  {
    id: 'storage.example.com',
    name: 'storage.example.com',
    value: 2752
  },
  {
    id: 'crm.example.net',
    name: 'crm.example.net',
    value: 2318
  },
  {
    id: 'billing.example.com',
    name: 'billing.example.com',
    value: 1593
  },
  {
    id: 'mail.example.org',
    name: 'mail.example.org',
    value: 1304
  },
  {
    id: 'docs.example.com',
    name: 'docs.example.com',
    value: 1014
  }
]

export const sampleActorRows: ActorActivityRow[] = [
  {
    id: 'request-01',
    time: '14:52:08',
    actor: 'report-builder',
    outcome: 'allowed',
    category: 'Read',
    severity: 'info',
    destination: 'api.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-02',
    time: '14:51:47',
    actor: 'data-export',
    outcome: 'blocked',
    category: 'Export',
    severity: 'critical',
    destination: 'storage.example.com',
    method: 'PUT',
    rule: 'No bulk export'
  },
  {
    id: 'request-03',
    time: '14:51:12',
    actor: 'ticket-triage',
    outcome: 'held',
    category: 'Write',
    severity: 'medium',
    destination: 'crm.example.net',
    method: 'PATCH',
    rule: 'Review customer changes'
  },
  {
    id: 'request-04',
    time: '14:50:39',
    actor: 'invoice-reader',
    outcome: 'allowed',
    category: 'Read',
    severity: 'low',
    destination: 'billing.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-05',
    time: '14:49:58',
    actor: 'release-helper',
    outcome: 'approved',
    category: 'Admin',
    severity: 'high',
    destination: 'api.example.com',
    method: 'POST',
    rule: 'Approve admin actions'
  },
  {
    id: 'request-06',
    time: '14:49:21',
    actor: 'inventory-sync',
    outcome: 'blocked',
    category: 'Delete',
    severity: 'high',
    destination: 'api.example.com',
    method: 'DELETE',
    rule: 'No deletes outside hours'
  },
  {
    id: 'request-07',
    time: '14:48:44',
    actor: 'report-builder',
    outcome: 'allowed',
    category: 'Search',
    severity: 'info',
    destination: 'docs.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-08',
    time: '14:48:03',
    actor: 'ticket-triage',
    outcome: 'denied',
    category: 'Write',
    severity: 'medium',
    destination: 'mail.example.org',
    method: 'POST',
    rule: 'Review outbound mail'
  },
  {
    id: 'request-09',
    time: '14:47:26',
    actor: 'calendar-sync',
    outcome: 'allowed',
    category: 'Write',
    severity: 'low',
    destination: 'api.example.com',
    method: 'PUT',
    rule: 'Scheduled writes'
  },
  {
    id: 'request-10',
    time: '14:46:50',
    actor: 'data-export',
    outcome: 'blocked',
    category: 'Export',
    severity: 'critical',
    destination: 'storage.example.com',
    method: 'PUT',
    rule: 'No bulk export'
  },
  {
    id: 'request-11',
    time: '14:46:12',
    actor: 'invoice-reader',
    outcome: 'allowed',
    category: 'Read',
    severity: 'info',
    destination: 'billing.example.com',
    method: 'GET',
    rule: 'Read-only access'
  },
  {
    id: 'request-12',
    time: '14:45:37',
    actor: 'release-helper',
    outcome: 'held',
    category: 'Admin',
    severity: 'high',
    destination: 'api.example.com',
    method: 'POST',
    rule: 'Approve admin actions'
  }
]
