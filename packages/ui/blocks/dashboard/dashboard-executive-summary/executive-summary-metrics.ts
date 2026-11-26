import type {
  ExecutiveSummaryDashboardFormat,
  ExecutiveSummaryDashboardMetric
} from './dashboard-executive-summary.vue'

export const scorecardTiles: {
  metric: ExecutiveSummaryDashboardMetric
  label: string
  description: string
  format: ExecutiveSummaryDashboardFormat
  inverse: boolean
}[] = [
  {
    metric: 'revenue',
    label: 'Revenue',
    description: 'Recognized revenue for the quarter.',
    format: 'currency',
    inverse: false
  },
  {
    metric: 'active-users',
    label: 'Monthly active users',
    description: 'People who signed in at least once in the last month of the quarter.',
    format: 'count',
    inverse: false
  },
  {
    metric: 'retention',
    label: 'Net revenue retention',
    description: 'Revenue kept from existing customers, expansion included, over twelve months.',
    format: 'percentage',
    inverse: false
  },
  {
    metric: 'nps',
    label: 'NPS',
    description: 'Net promoter score from the quarterly customer survey.',
    format: 'score',
    inverse: false
  },
  {
    metric: 'uptime',
    label: 'Uptime',
    description: 'Share of minutes every public service answered, averaged over the quarter.',
    format: 'uptime',
    inverse: false
  },
  {
    metric: 'cost-per-request',
    label: 'Cost per request',
    description: 'Infrastructure spend divided by requests served. A rise is a regression.',
    format: 'cost',
    inverse: true
  }
]

export const trendCharts: {
  metric: ExecutiveSummaryDashboardMetric
  title: string
  description: string
  mark: 'area' | 'line'
  format: ExecutiveSummaryDashboardFormat
  min: number
}[] = [
  {
    metric: 'revenue',
    title: 'Revenue',
    description: 'Recognized revenue per month.',
    mark: 'area',
    format: 'currency',
    min: 0
  },
  {
    metric: 'active-users',
    title: 'Monthly active users',
    description: 'People who signed in at least once in the month.',
    mark: 'area',
    format: 'count',
    min: 0
  },
  {
    metric: 'retention',
    title: 'Net revenue retention',
    description: 'Trailing twelve months, measured at month end.',
    mark: 'line',
    format: 'percentage',
    min: 100
  },
  {
    metric: 'nps',
    title: 'NPS',
    description: 'Net promoter score from the monthly pulse survey.',
    mark: 'line',
    format: 'score',
    min: 0
  },
  {
    metric: 'uptime',
    title: 'Uptime',
    description: 'Share of minutes every public service answered.',
    mark: 'line',
    format: 'uptime',
    min: 99.8
  },
  {
    metric: 'cost-per-request',
    title: 'Cost per request',
    description: 'Infrastructure spend divided by requests served.',
    mark: 'line',
    format: 'cost',
    min: 0
  }
]
