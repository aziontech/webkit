export const SUMMARY_QUARTERS = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']

export const SUMMARY_DEFAULT_QUARTER = SUMMARY_QUARTERS[0]

export const SUMMARY_COMPARISON = 'vs last quarter'

export const SUMMARY_MONTHS = [
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
  'Sep 2026'
]

const FIGURES = [
  {
    id: 'revenue',
    label: 'Revenue',
    description: 'Recognized revenue for the quarter.',
    value: 4_820_000,
    format: 'currency',
    delta: 5.7,
    inverse: false
  },
  {
    id: 'active-users',
    label: 'Monthly active users',
    description:
      'People who signed in to Azion Console at least once in the last month of the quarter.',
    value: 128_400,
    format: 'count',
    delta: 5.1,
    inverse: false
  },
  {
    id: 'retention',
    label: 'Net revenue retention',
    description: 'Revenue kept from existing accounts, expansion included, over twelve months.',
    value: 112,
    format: 'percentage',
    delta: 1.8,
    inverse: false
  },
  {
    id: 'nps',
    label: 'NPS',
    description: 'Net promoter score from the quarterly customer survey.',
    value: 47,
    format: 'score',
    delta: 6.8,
    inverse: false
  },
  {
    id: 'uptime',
    label: 'Uptime',
    description: 'Share of minutes every production workload answered, averaged over the quarter.',
    value: 99.97,
    format: 'uptime',
    delta: 0.02,
    inverse: false
  },
  {
    id: 'cost-per-request',
    label: 'Cost per request',
    description:
      'Infrastructure spend divided by requests served by every workload. A rise is a regression.',
    value: 0.00217,
    format: 'cost',
    delta: -7.1,
    inverse: true
  }
]

const GOALS = [
  {
    id: 'revenue',
    label: 'Quarterly revenue',
    current: 4_820_000,
    target: 5_000_000,
    format: 'currency',
    status: { label: 'On track', severity: 'success' }
  },
  {
    id: 'active-users',
    label: 'Monthly active users',
    current: 128_400,
    target: 140_000,
    format: 'count',
    status: { label: 'At risk', severity: 'warning' }
  },
  {
    id: 'retention',
    label: 'Net revenue retention',
    current: 112,
    target: 110,
    format: 'percentage',
    status: { label: 'On track', severity: 'success' }
  },
  {
    id: 'nps',
    label: 'NPS',
    current: 47,
    target: 50,
    format: 'score',
    status: { label: 'On track', severity: 'success' }
  },
  {
    id: 'enterprise-deals',
    label: 'Enterprise deals closed',
    current: 18,
    target: 30,
    format: 'score',
    status: { label: 'Off track', severity: 'danger' }
  }
]

const TRENDS = [
  {
    id: 'revenue',
    title: 'Revenue',
    description: 'Recognized revenue per month.',
    mark: 'area',
    format: 'currency',
    min: 0,
    change: { label: '+25.2%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'revenue',
        name: 'Revenue',
        values: [
          1_310_000, 1_340_000, 1_420_000, 1_380_000, 1_410_000, 1_470_000, 1_490_000, 1_520_000,
          1_550_000, 1_570_000, 1_610_000, 1_640_000
        ]
      }
    ]
  },
  {
    id: 'active-users',
    title: 'Monthly active users',
    description: 'People who signed in to Azion Console at least once in the month.',
    mark: 'area',
    format: 'count',
    min: 0,
    change: { label: '+30.8%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'active-users',
        name: 'Monthly active users',
        values: [
          98_200, 101_400, 104_000, 103_100, 107_900, 111_500, 114_600, 117_300, 122_200, 124_000,
          126_100, 128_400
        ]
      }
    ]
  },
  {
    id: 'retention',
    title: 'Net revenue retention',
    description: 'Trailing twelve months, measured at month end.',
    mark: 'line',
    format: 'percentage',
    min: 100,
    change: { label: '+5.7%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'retention',
        name: 'Net revenue retention',
        values: [106, 106, 107, 107, 108, 109, 109, 110, 110, 111, 111, 112]
      }
    ]
  },
  {
    id: 'nps',
    title: 'NPS',
    description: 'Net promoter score from the monthly pulse survey.',
    mark: 'line',
    format: 'score',
    min: 0,
    change: { label: '+23.7%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'nps',
        name: 'NPS',
        values: [38, 39, 41, 40, 42, 43, 42, 44, 44, 45, 46, 47]
      }
    ]
  },
  {
    id: 'uptime',
    title: 'Uptime',
    description: 'Share of minutes every production workload answered.',
    mark: 'line',
    format: 'uptime',
    min: 99.8,
    change: { label: '+0.05%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'uptime',
        name: 'Uptime',
        values: [99.94, 99.96, 99.91, 99.97, 99.98, 99.95, 99.99, 99.95, 99.91, 99.98, 99.94, 99.99]
      }
    ]
  },
  {
    id: 'cost-per-request',
    title: 'Cost per request',
    description: 'Infrastructure spend divided by requests served by every workload.',
    mark: 'line',
    format: 'cost',
    min: 0,
    change: { label: '−25.0%', severity: 'success', icon: 'pi pi-arrow-down-right' },
    series: [
      {
        id: 'cost-per-request',
        name: 'Cost per request',
        values: [
          0.0028, 0.0028, 0.0027, 0.0027, 0.0026, 0.0025, 0.0024, 0.0023, 0.0023, 0.0022, 0.0022,
          0.0021
        ]
      }
    ]
  }
]

const NOTES = [
  {
    id: 'note-04',
    author: 'Maria Santos',
    initials: 'MS',
    role: 'Head of Finance',
    date: '2026-09-30',
    dateLabel: 'Sep 30, 2026',
    body: 'Revenue closed at 96% of the goal. Two enterprise renewals slipped into October; both are signed and land in Q4.'
  },
  {
    id: 'note-03',
    author: 'David Kim',
    initials: 'DK',
    role: 'VP of Product',
    date: '2026-09-26',
    dateLabel: 'Sep 26, 2026',
    body: 'Monthly active users grew 5.1% after the new Console onboarding shipped in August. First-week activation rose from 41% to 48%.'
  },
  {
    id: 'note-02',
    author: 'Priya Nair',
    initials: 'PN',
    role: 'Head of Customer Success',
    date: '2026-09-19',
    dateLabel: 'Sep 19, 2026',
    body: 'NPS reached 47, the highest in a year. Detractors still cite slow replies on weekends, so a weekend support rotation starts in October.'
  },
  {
    id: 'note-01',
    author: 'Lucas Moreau',
    initials: 'LM',
    role: 'VP of Engineering',
    date: '2026-09-12',
    dateLabel: 'Sep 12, 2026',
    body: 'Cost per request fell 7.1% after batch jobs moved to off-peak capacity. Uptime held at 99.97%, with one 14-minute incident on Aug 21.'
  }
]

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2
})

export const SUMMARY_FORMATTERS = {
  currency: (value) => money.format(value),
  count: (value) => compact.format(value),
  percentage: (value) => `${value.toFixed(0)}%`,
  uptime: (value) => `${value.toFixed(2)}%`,
  score: (value) => value.toFixed(0),
  cost: (value) => `$${value.toFixed(4)}`
}

export const resolveSummaryFigures = ({ empty = false } = {}) =>
  empty ? FIGURES.map((figure) => ({ ...figure, value: null, delta: null })) : FIGURES

export const resolveSummaryGoals = ({ empty = false } = {}) => (empty ? [] : GOALS)

export const resolveSummaryTrends = ({ empty = false } = {}) =>
  empty ? TRENDS.map((trend) => ({ ...trend, change: null, series: [] })) : TRENDS

export const resolveSummaryNotes = ({ empty = false } = {}) => (empty ? [] : NOTES)
