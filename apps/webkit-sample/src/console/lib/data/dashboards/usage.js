import { resolveReport, resolveSummary, rtmFormatter } from '../real-time-metrics'

const formatBytes = rtmFormatter('bytes')

const WORKLOADS = [
  ['azion-com-prod', 3.4e11, 18_420_000],
  ['azion-com-br-prod', 1.9e11, 11_730_000],
  ['storefront-checkout', 1.2e11, 7_910_000],
  ['marketing-site', 7.6e10, 4_380_000],
  ['payments-api', 4.1e10, 6_240_000],
  ['campaign-landing', 2.3e10, 1_570_000],
  ['status-page', 9.8e9, 860_000],
  ['azion-stage-preview', 3.2e9, 210_000]
]

const PERIOD_FACTOR = { '1h': 1 / 24, '24h': 1, '7d': 7, '30d': 30 }

export const USAGE_METRICS = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Requests served by every workload in the period.',
    unit: 'count',
    base: 2.04e6,
    variation: 'regular'
  },
  {
    id: 'data-transferred',
    label: 'Data transferred',
    description: 'Data delivered to clients, in and out, by every workload in the period.',
    unit: 'bytes',
    base: 3.4e10,
    variation: 'regular'
  },
  {
    id: 'function-invocations',
    label: 'Function invocations',
    description: 'Times a function ran on a request in the period.',
    unit: 'count',
    base: 6.1e5,
    variation: 'regular'
  },
  {
    id: 'images-processed',
    label: 'Images processed',
    description: 'Images resized, cropped or converted by Image Processor in the period.',
    unit: 'count',
    base: 8.4e4,
    spread: 0.45,
    variation: 'regular'
  },
  {
    id: 'waf-requests',
    label: 'WAF requests',
    description: 'Requests inspected by a firewall with WAF rules in the period.',
    unit: 'count',
    base: 1.3e6,
    variation: 'regular'
  },
  {
    id: 'data-streamed',
    label: 'Data streamed',
    description: 'Log data sent to your Data Stream connectors in the period.',
    unit: 'bytes',
    base: 2.6e9,
    spread: 0.2,
    variation: 'regular'
  }
]

const COMPARISON_REPORT = {
  id: 'usage-data-transferred',
  type: 'line',
  label: 'Data transferred, this period vs previous',
  description:
    'Data delivered by every workload in the selected period, drawn over the same span of the previous period.',
  aggregation: 'sum',
  unit: 'bytes',
  columns: 12,
  dataset: 'workloadMetrics',
  variation: 'regular',
  series: [
    { id: 'current', name: 'This period', base: 3.4e10 },
    { id: 'previous', name: 'Previous period', base: 3.1e10 }
  ]
}

const RANKING_REPORT = {
  id: 'usage-data-by-workload',
  type: 'ordered-bar',
  label: 'Data transferred by workload',
  description: 'The workloads that delivered the most data in the period.',
  aggregation: 'sum',
  unit: 'bytes',
  columns: 6,
  dataset: 'workloadMetrics',
  slices: WORKLOADS.map(([name, bytes]) => ({ name, value: bytes }))
}

const TABLE_REPORT = {
  id: 'usage-by-workload',
  type: 'list',
  label: 'Usage by workload',
  description: 'Requests and data transferred per workload in the period.',
  aggregation: 'sum',
  unit: 'count',
  columns: 6,
  dataset: 'workloadMetrics',
  search: 'Search workloads',
  fields: [
    { id: 'workload', header: 'Workload' },
    { id: 'requests', header: 'Requests', align: 'end' },
    { id: 'dataTransferred', header: 'Data transferred', align: 'end', format: formatBytes }
  ],
  rows: WORKLOADS.map(([workload, bytes, requests]) => ({
    id: workload,
    workload,
    requests,
    bytes
  }))
}

const sum = (values) => values.reduce((total, value) => total + value, 0)

const comparisonOf = (period, empty) => {
  const report = resolveReport(COMPARISON_REPORT, period, { empty })
  if (empty) return report
  const [current, previous] = report.series.map((entry) => sum(entry.values))
  return { ...report, delta: ((current - previous) / previous) * 100, current }
}

export const usageFigures = (period, { empty = false } = {}) => {
  const comparison = comparisonOf(period, empty)
  return USAGE_METRICS.map((metric) => {
    const figure = resolveSummary(metric, period, { empty })
    if (empty || metric.id !== 'data-transferred') return figure
    return {
      ...figure,
      value: comparison.current,
      delta: comparison.delta,
      trend: comparison.series[0].values
    }
  })
}

const NO_USAGE = {
  emptyTitle: 'No usage yet',
  emptyDescription: 'Usage appears here once a workload serves requests.'
}

export const usageReports = (period, { empty = false } = {}) => {
  const factor = PERIOD_FACTOR[period] ?? 1
  const table = resolveReport(TABLE_REPORT, period, { empty })
  return [
    comparisonOf(period, empty),
    resolveReport(RANKING_REPORT, period, { empty }),
    {
      ...table,
      rows: table.rows.map(({ bytes, ...row }) => ({
        ...row,
        dataTransferred: bytes * factor
      }))
    }
  ].map((report) => ({ ...report, ...NO_USAGE }))
}
