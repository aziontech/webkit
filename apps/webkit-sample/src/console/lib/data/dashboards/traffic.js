import { resolveReport, resolveSummary } from '../real-time-metrics'

const DATASET = 'workloadMetrics'

const series = (id, name, base, options = {}) => ({ id, name, base, ...options })
const slices = (entries) => entries.map(([name, value]) => ({ name, value }))

export const TRAFFIC_SUMMARY = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Sum of requests served by every workload in the period.',
    unit: 'count',
    base: 2.04e6,
    variation: 'regular'
  },
  {
    id: 'data-transferred',
    label: 'Data transferred',
    description: 'Sum of data delivered to users by every workload in the period.',
    unit: 'bytes',
    base: 9.2e9,
    variation: 'regular'
  },
  {
    id: 'cache-hit-ratio',
    label: 'Cache hit ratio',
    description: 'Share of requests answered from cache without reaching the origin.',
    unit: 'percentage',
    aggregation: 'avg',
    base: 91,
    spread: 0.06,
    variation: 'regular'
  },
  {
    id: 'status-5xx',
    label: 'Status 5xx',
    description: 'Requests that ended in a server error. A rise is a regression.',
    unit: 'count',
    base: 6.6e3,
    spread: 0.6,
    variation: 'inverse'
  }
]

const HOST_ROWS = [
  ['www.example.com', 'Storefront', 1_284_310],
  ['api.example.com', 'Checkout API', 712_480],
  ['shop.example.com', 'Storefront', 498_210],
  ['docs.example.com', 'Docs', 231_640],
  ['status.example.com', 'Status page', 96_120],
  ['cdn.example.com', 'Media', 61_870],
  ['blog.example.com', 'Docs', 28_940]
].map(([host, workload, requests]) => ({ id: host, host, workload, requests }))

export const TRAFFIC_REPORTS = [
  {
    id: 'requests-over-time',
    type: 'line',
    label: 'Requests over time',
    description: 'Sum of requests served by every workload, per interval.',
    aggregation: 'sum',
    unit: 'count',
    columns: 12,
    variation: 'regular',
    series: [series('requests', 'Requests', 2.04e6)]
  },
  {
    id: 'status-codes',
    type: 'line',
    label: 'Status codes',
    description: 'Sum of requests per status class. Switch to Bar to stack the classes.',
    aggregation: 'sum',
    unit: 'count',
    columns: 6,
    variation: 'regular',
    series: [
      series('2xx', 'Status 2xx', 1.7e6),
      series('3xx', 'Status 3xx', 2.4e5),
      series('4xx', 'Status 4xx', 6.1e4, { spread: 0.45 }),
      series('5xx', 'Status 5xx', 6.6e3, { spread: 0.6 })
    ]
  },
  {
    id: 'requests-by-country',
    type: 'ordered-bar',
    label: 'Requests by country',
    description: 'Sum of requests per country of origin, top countries first.',
    aggregation: 'sum',
    unit: 'count',
    columns: 6,
    slices: slices([
      ['Brazil', 1_048_210],
      ['United States', 531_620],
      ['Germany', 118_930],
      ['India', 92_480],
      ['Mexico', 69_870],
      ['Argentina', 48_420]
    ])
  },
  {
    id: 'top-hosts',
    type: 'list',
    label: 'Top hosts',
    description: 'Hosts that served the most requests in the period, with their workload.',
    aggregation: 'sum',
    unit: 'count',
    columns: 12,
    search: 'Search hosts or workloads',
    fields: [
      { id: 'host', header: 'Host' },
      { id: 'workload', header: 'Workload' },
      { id: 'requests', header: 'Requests', align: 'end' }
    ],
    rows: HOST_ROWS
  }
]

export const trafficSummary = (period, { empty = false } = {}) =>
  TRAFFIC_SUMMARY.map((entry) => resolveSummary(entry, period, { empty }))

const NO_TRAFFIC = {
  emptyTitle: 'No traffic yet',
  emptyDescription: 'Metrics appear here once a workload serves requests.'
}

export const trafficReports = (period, { empty = false } = {}) =>
  TRAFFIC_REPORTS.map((report) =>
    resolveReport({ ...report, ...NO_TRAFFIC, dataset: DATASET }, period, { empty })
  )
