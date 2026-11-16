import type {
  ExecutiveSummaryDashboardGoal,
  ExecutiveSummaryDashboardKpis,
  ExecutiveSummaryDashboardNote,
  ExecutiveSummaryDashboardTrends
} from './executive-summary-dashboard.vue'

export const sampleKpis: ExecutiveSummaryDashboardKpis = {
  revenue: { value: 4820000, delta: 5.7 },
  'active-users': { value: 128400, delta: 5.1 },
  retention: { value: 112, delta: 1.8 },
  nps: { value: 47, delta: 6.8 },
  uptime: { value: 99.97, delta: 0.02 },
  'cost-per-request': { value: 0.00217, delta: -7.1 }
}

export const sampleGoals: ExecutiveSummaryDashboardGoal[] = [
  {
    id: 'revenue',
    label: 'Quarterly revenue',
    current: 4820000,
    target: 5000000,
    format: 'currency',
    status: {
      label: 'On track',
      severity: 'success'
    }
  },
  {
    id: 'active-users',
    label: 'Monthly active users',
    current: 128400,
    target: 140000,
    format: 'count',
    status: {
      label: 'At risk',
      severity: 'warning'
    }
  },
  {
    id: 'retention',
    label: 'Net revenue retention',
    current: 112,
    target: 110,
    format: 'percentage',
    status: {
      label: 'On track',
      severity: 'success'
    }
  },
  {
    id: 'nps',
    label: 'NPS',
    current: 47,
    target: 50,
    format: 'score',
    status: {
      label: 'On track',
      severity: 'success'
    }
  },
  {
    id: 'enterprise-deals',
    label: 'Enterprise deals closed',
    current: 18,
    target: 30,
    format: 'score',
    status: {
      label: 'Off track',
      severity: 'danger'
    }
  }
]

export const sampleLabels: string[] = [
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

export const sampleTrends: ExecutiveSummaryDashboardTrends = {
  revenue: {
    change: {
      label: '+25.2%',
      severity: 'success',
      icon: 'ai ai-arrow-up-right'
    },
    values: [
      1310000, 1340000, 1420000, 1380000, 1410000, 1470000, 1490000, 1520000, 1550000, 1570000,
      1610000, 1640000
    ]
  },
  'active-users': {
    change: {
      label: '+30.8%',
      severity: 'success',
      icon: 'ai ai-arrow-up-right'
    },
    values: [
      98200, 101400, 104000, 103100, 107900, 111500, 114600, 117300, 122200, 124000, 126100, 128400
    ]
  },
  retention: {
    change: {
      label: '+5.7%',
      severity: 'success',
      icon: 'ai ai-arrow-up-right'
    },
    values: [106, 106, 107, 107, 108, 109, 109, 110, 110, 111, 111, 112]
  },
  nps: {
    change: {
      label: '+23.7%',
      severity: 'success',
      icon: 'ai ai-arrow-up-right'
    },
    values: [38, 39, 41, 40, 42, 43, 42, 44, 44, 45, 46, 47]
  },
  uptime: {
    change: {
      label: '+0.05%',
      severity: 'success',
      icon: 'ai ai-arrow-up-right'
    },
    values: [99.94, 99.96, 99.91, 99.97, 99.98, 99.95, 99.99, 99.95, 99.91, 99.98, 99.94, 99.99]
  },
  'cost-per-request': {
    change: {
      label: '−25.0%',
      severity: 'success',
      icon: 'ai ai-arrow-down-right'
    },
    values: [
      0.0028, 0.0028, 0.0027, 0.0027, 0.0026, 0.0025, 0.0024, 0.0023, 0.0023, 0.0022, 0.0022, 0.0021
    ]
  }
}

export const sampleNotes: ExecutiveSummaryDashboardNote[] = [
  {
    id: 'note-04',
    author: 'Emma Wilson',
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
    body: 'Monthly active users grew 5.1% after the new onboarding shipped in August. First-week activation rose from 41% to 48%.'
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
    author: 'Daniel Moore',
    initials: 'LM',
    role: 'VP of Engineering',
    date: '2026-09-12',
    dateLabel: 'Sep 12, 2026',
    body: 'Cost per request fell 7.1% after batch jobs moved to off-peak capacity. Uptime held at 99.97%, with one 14-minute incident on Aug 21.'
  }
]
