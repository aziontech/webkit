import type { ChartColor, ChartSeries } from '@aziontech/webkit/chart'
import type { TableColumn } from '@aziontech/webkit/data-table'
import type { ToggleGroupOption } from '@aziontech/webkit/toggle-group'

import { type MetricFormat, metricQuery } from './analytics-report'

export type PanelForm = 'area' | 'line' | 'stacked'

export interface Period {
  value: string
  label: string
  begin: string
  end: string
  comparison: string
  scale: number
  labels: string[]
}

export interface Tile {
  id: string
  label: string
  description: string
  format: MetricFormat
  base: number
  rate?: boolean
  inverse?: boolean
}

export interface PanelSeries {
  id: string
  name: string
  base: number
  color?: ChartColor
}

export interface Panel {
  id: string
  title: string
  hint: string
  aggregation: string
  format: MetricFormat
  form: PanelForm
  rate?: boolean
  series: PanelSeries[]
}

export type BreakdownRow = Record<string, string | number>

export interface Breakdown {
  id: string
  title: string
  hint: string
  search: string
  columns: TableColumn[]
  rows: BreakdownRow[]
  classes?: boolean
}

export interface View {
  id: string
  label: string
  panels: string[]
  breakdowns: Breakdown[]
}

export interface Product {
  id: string
  label: string
  description: string
  dataset: string
  measure: string
  tiles: Tile[]
  panels: Panel[]
  views?: View[]
}

const breakdownColumn = (
  id: string,
  header: string,
  align: 'start' | 'end' = 'start'
): TableColumn => ({
  id,
  accessorKey: id,
  header,
  align,
  sortable: true,
  principal: id === 'status' || id === 'remoteAddress'
})

const statusBreakdown: Breakdown = {
  id: 'status-upstream',
  title: 'Status and upstream status',
  hint: 'Requests per status code returned to the user and the status the origin answered with.',
  search: 'Search status codes',
  classes: true,
  columns: [
    breakdownColumn('status', 'Status'),
    breakdownColumn('upstreamStatus', 'Upstream status'),
    breakdownColumn('requests', 'Requests', 'end')
  ],
  rows: [
    [200, 200, 1284310],
    [304, 304, 214880],
    [200, 0, 182410],
    [404, 404, 41620],
    [301, 301, 28940],
    [206, 206, 19330],
    [403, 0, 12780],
    [302, 302, 8210],
    [401, 401, 5140],
    [502, 502, 3410],
    [499, 0, 2960],
    [503, 503, 1870],
    [429, 0, 1420],
    [500, 500, 960],
    [504, 504, 410]
  ].map(([status, upstreamStatus, requests]) => ({
    id: `${status}-${upstreamStatus}`,
    status: String(status),
    upstreamStatus: upstreamStatus ? String(upstreamStatus) : '—',
    requests: requests ?? 0
  }))
}

const addressBreakdown: Breakdown = {
  id: 'addresses',
  title: 'IP address information',
  hint: 'Requests per client address, with its network, country and region.',
  search: 'Search addresses, networks or countries',
  columns: [
    breakdownColumn('remoteAddress', 'IP address'),
    breakdownColumn('asn', 'Network'),
    breakdownColumn('country', 'Country'),
    breakdownColumn('region', 'Region'),
    breakdownColumn('requests', 'Requests', 'end')
  ],
  rows: [
    ['203.0.113.10', 'AS64496 Cloud provider', 'United States', 'California', 84120],
    ['198.51.100.212', 'AS64497 Residential ISP', 'United States', 'Texas', 61870],
    ['192.0.2.77', 'AS64498 Cloud provider', 'United States', 'Virginia', 48310],
    ['203.0.113.142', 'AS64499 Mobile carrier', 'Canada', 'Ontario', 37940],
    ['198.51.100.9', 'AS64496 Cloud provider', 'Germany', 'Hesse', 29660],
    ['192.0.2.2', 'AS64500 Content network', 'United States', 'California', 22180],
    ['203.0.113.88', 'AS64501 Residential ISP', 'United Kingdom', 'England', 18420],
    ['198.51.100.48', 'AS64496 Cloud provider', 'India', 'Maharashtra', 12870],
    ['192.0.2.12', 'AS64502 Transit network', 'Netherlands', 'North Holland', 9350],
    ['203.0.113.5', 'AS64501 Residential ISP', 'United Kingdom', 'Scotland', 7210],
    ['198.51.100.1', 'AS64503 Search crawler', 'United States', 'Oregon', 6480],
    ['192.0.2.20', 'AS64504 Search crawler', 'United States', 'Washington', 4120]
  ].map(([remoteAddress, asn, country, region, requests]) => ({
    id: String(remoteAddress),
    remoteAddress: remoteAddress ?? '',
    asn: asn ?? '',
    country: country ?? '',
    region: region ?? '',
    requests: requests ?? 0
  }))
}

const sourceBreakdown: Breakdown = {
  id: 'sources',
  title: 'Top denied sources',
  hint: 'Client addresses the firewall denied most often, with their network and main threat.',
  search: 'Search addresses, networks or threats',
  columns: [
    breakdownColumn('remoteAddress', 'IP address'),
    breakdownColumn('asn', 'Network'),
    breakdownColumn('country', 'Country'),
    breakdownColumn('threat', 'Main threat'),
    breakdownColumn('requests', 'Denied requests', 'end')
  ],
  rows: [
    ['203.0.113.233', 'AS64505 Hosting provider', 'Netherlands', 'SQL injection', 9120],
    ['198.51.100.47', 'AS64506 Anonymizing proxy', 'Germany', 'Cross-site scripting', 7640],
    ['192.0.2.159', 'AS64507 Unmanaged network', 'Romania', 'Path traversal', 6210],
    ['203.0.113.172', 'AS64505 Hosting provider', 'Netherlands', 'Bad bots', 5480],
    ['198.51.100.139', 'AS64508 VPN service', 'Seychelles', 'SQL injection', 4360],
    ['192.0.2.221', 'AS64509 Research scanner', 'United States', 'Bad bots', 3790],
    ['198.51.100.130', 'AS64510 Cloud provider', 'United States', 'Path traversal', 2810],
    ['192.0.2.23', 'AS64511 Residential ISP', 'United States', 'Cross-site scripting', 1960]
  ].map(([remoteAddress, asn, country, threat, requests]) => ({
    id: String(remoteAddress),
    remoteAddress: remoteAddress ?? '',
    asn: asn ?? '',
    country: country ?? '',
    threat: threat ?? '',
    requests: requests ?? 0
  }))
}

export const statusClasses: ToggleGroupOption[] = [
  { label: 'All', value: 'all' },
  { label: '2xx', value: '2' },
  { label: '3xx', value: '3' },
  { label: '4xx', value: '4' },
  { label: '5xx', value: '5' }
]

export const periods: Period[] = [
  {
    value: '1h',
    begin: '2026-11-14T13:30:00Z',
    end: '2026-11-14T14:30:00Z',
    label: 'Last hour',
    comparison: 'vs previous hour',
    scale: 1 / 24,
    labels: [
      '13:35',
      '13:40',
      '13:45',
      '13:50',
      '13:55',
      '14:00',
      '14:05',
      '14:10',
      '14:15',
      '14:20',
      '14:25',
      '14:30'
    ]
  },
  {
    value: '24h',
    begin: '2026-11-13T14:00:00Z',
    end: '2026-11-14T14:00:00Z',
    label: 'Last 24 hours',
    comparison: 'vs previous 24 hours',
    scale: 1,
    labels: [
      '16:00',
      '18:00',
      '20:00',
      '22:00',
      '00:00',
      '02:00',
      '04:00',
      '06:00',
      '08:00',
      '10:00',
      '12:00',
      '14:00'
    ]
  },
  {
    value: '7d',
    begin: '2026-11-04T00:00:00Z',
    end: '2026-11-10T23:59:59Z',
    label: 'Last 7 days',
    comparison: 'vs previous 7 days',
    scale: 7,
    labels: ['Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9', 'Nov 10']
  },
  {
    value: '30d',
    begin: '2026-10-12T00:00:00Z',
    end: '2026-11-10T23:59:59Z',
    label: 'Last 30 days',
    comparison: 'vs previous 30 days',
    scale: 30,
    labels: [
      'Oct 12',
      'Oct 15',
      'Oct 18',
      'Oct 21',
      'Oct 24',
      'Oct 27',
      'Oct 30',
      'Nov 2',
      'Nov 5',
      'Nov 8'
    ]
  }
]

export const products: Product[] = [
  {
    id: 'applications',
    label: 'Applications',
    description: 'Requests, data transferred, cache and errors across your applications.',
    dataset: 'workloadMetrics',
    measure: 'requests',
    views: [
      {
        id: 'overview',
        label: 'Overview',
        panels: ['requests', 'data', 'status', 'cache'],
        breakdowns: []
      },
      {
        id: 'status-codes',
        label: 'Status codes',
        panels: ['status'],
        breakdowns: [statusBreakdown]
      },
      {
        id: 'request-breakdown',
        label: 'Request breakdown',
        panels: [],
        breakdowns: [addressBreakdown]
      }
    ],
    tiles: [
      {
        id: 'requests',
        label: 'Requests',
        description: 'Requests your applications served in the period.',
        format: 'count',
        base: 2000000
      },
      {
        id: 'data',
        label: 'Data transferred',
        description: 'Bytes delivered to clients in the period.',
        format: 'bytes',
        base: 9000000000
      },
      {
        id: 'hit-ratio',
        label: 'Cache hit ratio',
        description: 'Share of requests served from cache, not from the origin.',
        format: 'percentage',
        base: 88,
        rate: true
      },
      {
        id: '5xx',
        label: 'Status 5xx',
        description: 'Requests that ended in a server error. A rise is a regression.',
        format: 'count',
        base: 6000,
        inverse: true
      }
    ],
    panels: [
      {
        id: 'requests',
        title: 'Requests',
        hint: 'Sum of requests served by every application, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'area',
        series: [{ id: 'requests', name: 'Requests', base: 2000000 }]
      },
      {
        id: 'data',
        title: 'Data transferred',
        hint: 'Sum of bytes delivered to clients, per interval.',
        aggregation: 'Sum',
        format: 'bytes',
        form: 'area',
        series: [{ id: 'data', name: 'Data transferred', base: 9000000000 }]
      },
      {
        id: 'status',
        title: 'Status codes',
        hint: 'Sum of requests per status class, per interval, stacked so the error classes read as their part of every bar.',
        aggregation: 'Sum',
        format: 'count',
        form: 'stacked',
        series: [
          { id: '2xx', name: 'Status 2xx', base: 1700000, color: 1 },
          { id: '3xx', name: 'Status 3xx', base: 240000, color: 2 },
          { id: '4xx', name: 'Status 4xx', base: 60000, color: 'warning' },
          { id: '5xx', name: 'Status 5xx', base: 6000, color: 'danger' }
        ]
      },
      {
        id: 'cache',
        title: 'Cache hits and misses',
        hint: 'Requests served from cache and requests sent to the origin, stacked.',
        aggregation: 'Sum',
        format: 'count',
        form: 'stacked',
        series: [
          { id: 'hits', name: 'Hits', base: 1750000 },
          { id: 'misses', name: 'Misses', base: 250000 }
        ]
      }
    ]
  },
  {
    id: 'functions',
    label: 'Functions',
    description: 'Invocations, errors and duration of your functions.',
    dataset: 'functionsMetrics',
    measure: 'invocations',
    tiles: [
      {
        id: 'invocations',
        label: 'Invocations',
        description: 'Times your functions ran in the period.',
        format: 'count',
        base: 640000
      },
      {
        id: 'errors',
        label: 'Errors',
        description: 'Invocations that threw or timed out. A rise is a regression.',
        format: 'count',
        base: 900,
        inverse: true
      },
      {
        id: 'duration',
        label: 'Duration p95',
        description: '95% of invocations finished within this time.',
        format: 'ms',
        base: 42,
        rate: true,
        inverse: true
      },
      {
        id: 'compute',
        label: 'Compute time',
        description: 'Total time your functions ran in the period.',
        format: 'seconds',
        base: 14000
      }
    ],
    panels: [
      {
        id: 'invocations',
        title: 'Invocations',
        hint: 'Sum of invocations of every function, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'area',
        series: [{ id: 'invocations', name: 'Invocations', base: 640000 }]
      },
      {
        id: 'errors',
        title: 'Errors',
        hint: 'Invocations that threw or timed out, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'area',
        series: [{ id: 'errors', name: 'Errors', base: 900 }]
      },
      {
        id: 'duration',
        title: 'Duration',
        hint: 'Median and 95th percentile duration of an invocation, per interval.',
        aggregation: 'Percentile',
        format: 'ms',
        form: 'line',
        rate: true,
        series: [
          { id: 'p50', name: 'p50', base: 18 },
          { id: 'p95', name: 'p95', base: 42 }
        ]
      },
      {
        id: 'compute',
        title: 'Compute time',
        hint: 'Sum of the time every function ran, per interval.',
        aggregation: 'Sum',
        format: 'seconds',
        form: 'area',
        series: [{ id: 'compute', name: 'Compute time', base: 14000 }]
      }
    ]
  },
  {
    id: 'firewall',
    label: 'Firewall',
    description: 'Requests allowed, denied and rate limited by your firewalls.',
    dataset: 'workloadMetrics',
    measure: 'requests',
    views: [
      {
        id: 'overview',
        label: 'Overview',
        panels: ['decisions', 'threats', 'limited', 'inspected'],
        breakdowns: []
      },
      {
        id: 'sources',
        label: 'Denied sources',
        panels: ['decisions'],
        breakdowns: [sourceBreakdown]
      }
    ],
    tiles: [
      {
        id: 'inspected',
        label: 'Requests inspected',
        description: 'Requests your firewalls evaluated in the period.',
        format: 'count',
        base: 1900000
      },
      {
        id: 'denied',
        label: 'Denied',
        description: 'Requests a rule denied in the period.',
        format: 'count',
        base: 42000,
        inverse: true
      },
      {
        id: 'limited',
        label: 'Rate limited',
        description: 'Requests held back by a rate limit in the period.',
        format: 'count',
        base: 8600,
        inverse: true
      },
      {
        id: 'threats',
        label: 'Threats',
        description: 'Requests that matched a threat signature in the period.',
        format: 'count',
        base: 3100,
        inverse: true
      }
    ],
    panels: [
      {
        id: 'decisions',
        title: 'Allowed and denied',
        hint: 'Requests each firewall allowed or denied, stacked per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'stacked',
        series: [
          { id: 'allowed', name: 'Allowed', base: 1850000 },
          { id: 'denied', name: 'Denied', base: 42000, color: 'danger' }
        ]
      },
      {
        id: 'threats',
        title: 'Threats by type',
        hint: 'Requests that matched a threat signature, per family, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'line',
        series: [
          { id: 'sqli', name: 'SQL injection', base: 1200 },
          { id: 'xss', name: 'Cross-site scripting', base: 900 },
          { id: 'traversal', name: 'Path traversal', base: 600 },
          { id: 'bots', name: 'Bad bots', base: 400 }
        ]
      },
      {
        id: 'limited',
        title: 'Rate limited',
        hint: 'Requests held back by a rate limit, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'area',
        series: [{ id: 'limited', name: 'Rate limited', base: 8600 }]
      },
      {
        id: 'inspected',
        title: 'Requests inspected',
        hint: 'Requests your firewalls evaluated, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'area',
        series: [{ id: 'inspected', name: 'Requests inspected', base: 1900000 }]
      }
    ]
  },
  {
    id: 'dns',
    label: 'DNS',
    description: 'Queries your hosted zones answered, and how they were answered.',
    dataset: 'idnsQueriesMetrics',
    measure: 'requests',
    tiles: [
      {
        id: 'queries',
        label: 'Queries',
        description: 'Queries your hosted zones answered in the period.',
        format: 'count',
        base: 5200000
      },
      {
        id: 'nxdomain',
        label: 'NXDOMAIN',
        description: 'Queries for a name that does not exist in the zone.',
        format: 'count',
        base: 74000,
        inverse: true
      },
      {
        id: 'servfail',
        label: 'SERVFAIL',
        description: 'Queries the server failed to answer. A rise is a regression.',
        format: 'count',
        base: 410,
        inverse: true
      },
      {
        id: 'latency',
        label: 'Response time',
        description: 'Median time to answer a query.',
        format: 'ms',
        base: 4,
        rate: true,
        inverse: true
      }
    ],
    panels: [
      {
        id: 'queries',
        title: 'Queries',
        hint: 'Sum of queries answered by every zone, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'area',
        series: [{ id: 'queries', name: 'Queries', base: 5200000 }]
      },
      {
        id: 'codes',
        title: 'Response codes',
        hint: 'Sum of answers per response code, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'line',
        series: [
          { id: 'noerror', name: 'NOERROR', base: 5100000 },
          { id: 'nxdomain', name: 'NXDOMAIN', base: 74000 },
          { id: 'servfail', name: 'SERVFAIL', base: 410 }
        ]
      },
      {
        id: 'types',
        title: 'Query types',
        hint: 'Sum of queries per record type, stacked per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'stacked',
        series: [
          { id: 'a', name: 'A', base: 3100000 },
          { id: 'aaaa', name: 'AAAA', base: 1400000 },
          { id: 'cname', name: 'CNAME', base: 500000 },
          { id: 'txt', name: 'TXT', base: 200000 }
        ]
      },
      {
        id: 'latency',
        title: 'Response time',
        hint: 'Median time to answer a query, per interval.',
        aggregation: 'Median',
        format: 'ms',
        form: 'line',
        rate: true,
        series: [{ id: 'latency', name: 'Response time', base: 4 }]
      }
    ]
  },
  {
    id: 'data-stream',
    label: 'Data stream',
    description: 'Records collected and delivered to your endpoints.',
    dataset: 'dataStreamedMetrics',
    measure: 'requests',
    tiles: [
      {
        id: 'collected',
        label: 'Records collected',
        description: 'Records your streams collected in the period.',
        format: 'count',
        base: 3600000
      },
      {
        id: 'delivered',
        label: 'Records delivered',
        description: 'Records your endpoints accepted in the period.',
        format: 'count',
        base: 3580000
      },
      {
        id: 'failures',
        label: 'Delivery failures',
        description: 'Batches an endpoint refused or did not answer. A rise is a regression.',
        format: 'count',
        base: 120,
        inverse: true
      },
      {
        id: 'lag',
        label: 'Delivery lag',
        description: 'Median time from collecting a record to its delivery.',
        format: 'ms',
        base: 850,
        rate: true,
        inverse: true
      }
    ],
    panels: [
      {
        id: 'records',
        title: 'Records collected and delivered',
        hint: 'Records collected and records your endpoints accepted, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'line',
        series: [
          { id: 'collected', name: 'Collected', base: 3600000 },
          { id: 'delivered', name: 'Delivered', base: 3580000 }
        ]
      },
      {
        id: 'failures',
        title: 'Delivery failures',
        hint: 'Batches an endpoint refused or did not answer, per interval.',
        aggregation: 'Sum',
        format: 'count',
        form: 'area',
        series: [{ id: 'failures', name: 'Delivery failures', base: 120 }]
      },
      {
        id: 'bytes',
        title: 'Data delivered',
        hint: 'Sum of bytes sent to your endpoints, per interval.',
        aggregation: 'Sum',
        format: 'bytes',
        form: 'area',
        series: [{ id: 'bytes', name: 'Data delivered', base: 4200000000 }]
      },
      {
        id: 'lag',
        title: 'Delivery lag',
        hint: 'Median time from collecting a record to its delivery, per interval.',
        aggregation: 'Median',
        format: 'ms',
        form: 'line',
        rate: true,
        series: [{ id: 'lag', name: 'Delivery lag', base: 850 }]
      }
    ]
  }
]

export interface SummaryTile {
  id: string
  label: string
  format: MetricFormat
  base: number
  rate?: boolean
  inverse?: boolean
}

export interface HighlightSeries {
  id: string
  name: string
  base: number
  color?: ChartColor
}

export interface Highlight {
  id: string
  title: string
  hint: string
  product: string
  href: string
  dataset: string
  measure: string
  format: MetricFormat
  form: PanelForm
  series: HighlightSeries[]
}

export const overviewSummary: SummaryTile[] = [
  { id: 'requests', label: 'Requests', format: 'count', base: 2040000 },
  { id: 'data', label: 'Data transferred', format: 'bytes', base: 9200000000 },
  { id: 'offload', label: 'Cache offload', format: 'percentage', base: 82, rate: true },
  { id: '5xx', label: 'Status 5xx', format: 'count', base: 6600, inverse: true },
  { id: 'denied', label: 'Requests denied', format: 'count', base: 49000, inverse: true },
  { id: 'invocations', label: 'Function invocations', format: 'count', base: 610000 }
]

export const overviewHighlights: Highlight[] = [
  {
    id: 'requests',
    title: 'Requests',
    hint: 'Requests your applications served, per interval.',
    product: 'Applications',
    href: '/metrics/applications?view=overview',
    dataset: 'workloadMetrics',
    measure: 'requests',
    format: 'count',
    form: 'area',
    series: [{ id: 'requests', name: 'Requests', base: 2040000 }]
  },
  {
    id: 'cache',
    title: 'Cache hits and misses',
    hint: 'Requests answered from the cache and requests sent to the origin, per interval.',
    product: 'Applications',
    href: '/metrics/applications?view=overview',
    dataset: 'workloadMetrics',
    measure: 'requests',
    format: 'count',
    form: 'stacked',
    series: [
      { id: 'hits', name: 'Hits', base: 1750000 },
      { id: 'misses', name: 'Misses', base: 250000 }
    ]
  },
  {
    id: 'decisions',
    title: 'Allowed and denied',
    hint: 'Requests the firewall let through and requests it denied, per interval.',
    product: 'Firewall',
    href: '/metrics/firewall?view=overview',
    dataset: 'workloadMetrics',
    measure: 'requests',
    format: 'count',
    form: 'stacked',
    series: [
      { id: 'allowed', name: 'Allowed', base: 1850000 },
      { id: 'denied', name: 'Denied', base: 49000, color: 'danger' }
    ]
  },
  {
    id: 'status',
    title: 'Status codes',
    hint: 'Requests per status class, per interval, stacked so the error classes read as their part of every bar.',
    product: 'Applications',
    href: '/metrics/applications?view=status-codes',
    dataset: 'workloadMetrics',
    measure: 'requests',
    format: 'count',
    form: 'stacked',
    series: [
      { id: '2xx', name: 'Status 2xx', base: 1700000, color: 1 },
      { id: '3xx', name: 'Status 3xx', base: 240000, color: 2 },
      { id: '4xx', name: 'Status 4xx', base: 60000, color: 'warning' },
      { id: '5xx', name: 'Status 5xx', base: 6600, color: 'danger' }
    ]
  },
  {
    id: '5xx',
    title: 'Status 5xx',
    hint: 'Requests that ended in a server error, per interval. A rise is a regression.',
    product: 'Applications',
    href: '/metrics/applications?view=status-codes',
    dataset: 'workloadMetrics',
    measure: 'requests',
    format: 'count',
    form: 'area',
    series: [{ id: '5xx', name: 'Status 5xx', base: 6600, color: 'danger' }]
  },
  {
    id: 'invocations',
    title: 'Function invocations',
    hint: 'Times your functions ran, per interval.',
    product: 'Functions',
    href: '/metrics/functions?view=overview',
    dataset: 'functionsMetrics',
    measure: 'invocations',
    format: 'count',
    form: 'area',
    series: [{ id: 'invocations', name: 'Invocations', base: 610000 }]
  }
]

const seeded = (seed: string, length: number): number[] => {
  let h = 0x811c9dc5
  for (const char of seed) {
    h ^= char.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return Array.from({ length }, () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return (h % 1000) / 1000
  })
}

const seriesValues = (seed: string, base: number, period: Period, rate?: boolean): number[] => {
  const perPoint = rate ? base : (base * period.scale * 12) / period.labels.length
  return seeded(seed, period.labels.length).map((u) => {
    const value = perPoint * (0.78 + u * 0.44)
    return rate ? Math.round(value * 10) / 10 : Math.round(value)
  })
}

const apiFields: Record<string, string> = {
  asn: 'geolocAsn',
  country: 'geolocCountryName',
  region: 'geolocRegionName',
  threat: 'wafAttackFamily'
}

const breakdownOnlyFields = ['remoteAddress', 'geolocAsn']
const breakdownDatasetFields = [
  'host',
  'geolocCountryName',
  'geolocRegionName',
  'geolocAsn',
  'remoteAddress',
  'httpUserAgent',
  'requestPath',
  'httpReferer',
  'sentHttpContentType',
  'upstreamAddr'
]

export const timeQuery = (dataset: string, measure: string, period: Period): string =>
  metricQuery({
    dataset,
    measure,
    limit: 10000,
    groupBy: ['ts'],
    orderBy: 'ts_ASC',
    begin: period.begin,
    end: period.end
  })

export const breakdownQuery = (product: Product, breakdown: Breakdown, period: Period): string => {
  const fields = breakdown.columns
    .map((column) => column.id ?? '')
    .filter((id) => id !== 'requests')
    .map((id) => apiFields[id] ?? id)
  const needsBreakdown =
    product.dataset === 'workloadMetrics' &&
    fields.some((field) => breakdownOnlyFields.includes(field))
  return metricQuery({
    dataset: needsBreakdown ? 'workloadBreakdownMetrics' : product.dataset,
    measure: product.measure,
    limit: 1000,
    groupBy: needsBreakdown
      ? fields.filter((field) => breakdownDatasetFields.includes(field))
      : fields,
    orderBy: 'sum_DESC',
    begin: period.begin,
    end: period.end
  })
}

export const seededSeries = (
  prefix: string,
  series: readonly PanelSeries[],
  period: Period,
  rate?: boolean
): ChartSeries[] =>
  series.map((entry) => ({
    id: entry.id,
    name: entry.name,
    ...(entry.color ? { color: entry.color } : {}),
    values: seriesValues(`${prefix}:${entry.id}:${period.value}`, entry.base, period, rate)
  }))

export const seededFigure = (
  seed: string,
  base: number,
  period: Period,
  rate?: boolean
): { trend: number[]; value: number; delta: number } => {
  const trend = seriesValues(seed, base, period, rate)
  const total = trend.reduce((sum, point) => sum + point, 0)
  const [swing] = seeded(`${seed}:delta`, 1)
  return {
    trend,
    value: rate ? total / trend.length : total,
    delta: Math.round(((swing ?? 0.5) * 30 - 15) * 100) / 100
  }
}
