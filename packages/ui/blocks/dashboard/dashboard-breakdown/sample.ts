import type { ChartSeries } from '@aziontech/ui/chart'

import type {
  BreakdownDashboardContributor,
  BreakdownDashboardKpis
} from './dashboard-breakdown.vue'

export const sampleKpis: BreakdownDashboardKpis = {
  total: {
    value: 38500,
    delta: 4.05,
    trend: [27600, 28100, 29000, 29900, 31000, 31700, 32700, 33700, 34700, 35600, 37000, 38500]
  },
  compute: {
    value: 16900,
    delta: 4.32,
    trend: [11800, 12100, 12400, 12900, 13300, 13700, 14200, 14600, 15100, 15500, 16200, 16900]
  },
  database: {
    value: 9400,
    delta: 3.3,
    trend: [7200, 7300, 7500, 7600, 7800, 8000, 8100, 8300, 8600, 8800, 9100, 9400]
  },
  storage: {
    value: 6000,
    delta: 3.45,
    trend: [4100, 4300, 4400, 4600, 4800, 5000, 5100, 5300, 5500, 5600, 5800, 6000]
  }
}

export const sampleLabels: string[] = [
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov'
]

export const sampleSeries: ChartSeries[] = [
  {
    id: 'compute',
    name: 'Compute',
    values: [11800, 12100, 12400, 12900, 13300, 13700, 14200, 14600, 15100, 15500, 16200, 16900]
  },
  {
    id: 'database',
    name: 'Database',
    values: [7200, 7300, 7500, 7600, 7800, 8000, 8100, 8300, 8600, 8800, 9100, 9400]
  },
  {
    id: 'storage',
    name: 'Storage',
    values: [4100, 4300, 4400, 4600, 4800, 5000, 5100, 5300, 5500, 5600, 5800, 6000]
  },
  {
    id: 'networking',
    name: 'Networking',
    values: [3000, 2900, 3100, 3200, 3400, 3300, 3500, 3700, 3600, 3800, 3900, 4100]
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    values: [1500, 1500, 1600, 1600, 1700, 1700, 1800, 1800, 1900, 1900, 2000, 2100]
  }
]

export const sampleSplit: ChartSeries[] = [
  {
    id: 'compute',
    name: 'Compute',
    values: [16900]
  },
  {
    id: 'database',
    name: 'Database',
    values: [9400]
  },
  {
    id: 'storage',
    name: 'Storage',
    values: [6000]
  },
  {
    id: 'networking',
    name: 'Networking',
    values: [4100]
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    values: [2100]
  }
]

export const sampleContributors: BreakdownDashboardContributor[] = [
  {
    id: 'web-app',
    rank: 1,
    name: 'web-app',
    icon: 'az az-server',
    category: 'Compute',
    amount: 6200,
    share: 16.1,
    change: 5.08
  },
  {
    id: 'worker-pool',
    rank: 2,
    name: 'worker-pool',
    icon: 'az az-server',
    category: 'Compute',
    amount: 5900,
    share: 15.3,
    change: 5.36
  },
  {
    id: 'orders-db',
    rank: 3,
    name: 'orders-db',
    icon: 'az az-database',
    category: 'Database',
    amount: 5400,
    share: 14,
    change: 5.88
  },
  {
    id: 'api-service',
    rank: 4,
    name: 'api-service',
    icon: 'az az-server',
    category: 'Compute',
    amount: 4800,
    share: 12.5,
    change: 2.13
  },
  {
    id: 'analytics-warehouse',
    rank: 5,
    name: 'analytics-warehouse',
    icon: 'az az-database',
    category: 'Database',
    amount: 4000,
    share: 10.4,
    change: 0
  },
  {
    id: 'media-files',
    rank: 6,
    name: 'media-files',
    icon: 'az az-folder',
    category: 'Storage',
    amount: 3700,
    share: 9.6,
    change: 8.82
  },
  {
    id: 'public-egress',
    rank: 7,
    name: 'public-egress',
    icon: 'az az-globe',
    category: 'Networking',
    amount: 2600,
    share: 6.8,
    change: 4
  },
  {
    id: 'backups',
    rank: 8,
    name: 'backups',
    icon: 'az az-folder',
    category: 'Storage',
    amount: 2300,
    share: 6,
    change: -4.17
  },
  {
    id: 'logs-pipeline',
    rank: 9,
    name: 'logs-pipeline',
    icon: 'az az-chart-line',
    category: 'Monitoring',
    amount: 2100,
    share: 5.5,
    change: 5
  },
  {
    id: 'load-balancer',
    rank: 10,
    name: 'load-balancer',
    icon: 'az az-globe',
    category: 'Networking',
    amount: 1500,
    share: 3.9,
    change: 7.14
  }
]
