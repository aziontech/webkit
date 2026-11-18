import type { ChartSeries } from '@aziontech/webkit/chart'

import type {
  AnalyticsDashboardChanges,
  AnalyticsDashboardCountry,
  AnalyticsDashboardHost,
  AnalyticsDashboardKpis,
  AnalyticsDashboardRange
} from './dashboard-analytics.vue'

export const sampleRange: AnalyticsDashboardRange = {
  begin: '2026-11-13T11:00:00Z',
  end: '2026-11-14T10:59:59Z'
}

export const sampleKpis: AnalyticsDashboardKpis = {
  requests: {
    value: 48920000,
    delta: -1.83,
    trend: [
      2029738, 1799252, 1910217, 1633835, 1757364, 1722765, 2157932, 2151290, 2283541, 2397218,
      2545994, 2347243
    ]
  },
  'data-transferred': {
    value: 222000000000,
    delta: -13.26,
    trend: [
      7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
      9768346098, 10386911277, 8642195236, 7365365394, 8004529693
    ]
  },
  'success-rate': {
    value: 98,
    delta: 0.42,
    trend: [99, 99, 99, 99, 98, 98, 97, 97, 97, 97, 97, 99]
  },
  'status-5xx': {
    value: 158600,
    delta: -5.47,
    trend: [4580, 5509, 4940, 5670, 7151, 9279, 8251, 8242, 8497, 6207, 5685, 5352]
  }
}

export const sampleIntervals: string[] = [
  '11:00',
  '13:00',
  '15:00',
  '17:00',
  '19:00',
  '21:00',
  '23:00',
  '01:00',
  '03:00',
  '05:00',
  '07:00',
  '09:00'
]

export const sampleRequestSeries: ChartSeries[] = [
  {
    id: 'requests',
    name: 'Requests',
    values: [
      2278608, 2368220, 2548427, 2385746, 2112152, 2214745, 1795004, 1575175, 1640830, 1634383,
      1933593, 2144294
    ]
  }
]

export const sampleStatusSeries: ChartSeries[] = [
  {
    id: '2xx',
    name: 'Status 2xx',
    values: [
      1524883, 1531611, 1348641, 1583433, 1898319, 1802251, 1954175, 1996970, 1957306, 1701833,
      1509664, 1620625
    ]
  },
  {
    id: '3xx',
    name: 'Status 3xx',
    values: [
      266730, 270925, 287218, 296721, 286635, 245627, 230388, 201140, 188038, 184104, 197071, 244404
    ]
  },
  {
    id: '4xx',
    name: 'Status 4xx',
    values: [40942, 51712, 52096, 55261, 61739, 68992, 75656, 80310, 74603, 63564, 63640, 45548]
  },
  {
    id: '5xx',
    name: 'Status 5xx',
    values: [4709, 5417, 4551, 5950, 5281, 8024, 8695, 9676, 8359, 7225, 6456, 5222]
  }
]

export const sampleCountries: AnalyticsDashboardCountry[] = [
  { country: 'United States', requests: 1048210 },
  { country: 'Brazil', requests: 531620 },
  { country: 'Germany', requests: 118930 },
  { country: 'India', requests: 92480 },
  { country: 'Mexico', requests: 69870 },
  { country: 'Argentina', requests: 48420 }
]

export const sampleHosts: AnalyticsDashboardHost[] = [
  { id: 'www.example.com', host: 'www.example.com', service: 'Storefront', requests: 1284310 },
  { id: 'api.example.com', host: 'api.example.com', service: 'Checkout API', requests: 712480 },
  { id: 'shop.example.com', host: 'shop.example.com', service: 'Storefront', requests: 498210 },
  { id: 'docs.example.com', host: 'docs.example.com', service: 'Docs', requests: 231640 },
  { id: 'status.example.com', host: 'status.example.com', service: 'Status page', requests: 96120 },
  { id: 'cdn.example.com', host: 'cdn.example.com', service: 'Media', requests: 61870 },
  { id: 'blog.example.com', host: 'blog.example.com', service: 'Docs', requests: 28940 }
]

export const sampleChanges: AnalyticsDashboardChanges = {
  requests: 10.03,
  statusCodes: 14.66
}
