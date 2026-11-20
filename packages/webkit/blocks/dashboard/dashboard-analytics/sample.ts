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
    value: 24631177,
    delta: 10.03,
    trend: [
      2278608, 2368220, 2548427, 2385746, 2112152, 2214745, 1795004, 1575175, 1640830, 1634383,
      1933593, 2144294
    ]
  },
  'data-transferred': {
    value: 110467764814,
    delta: -13.26,
    trend: [
      7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
      9768346098, 10386911277, 8642195236, 7365365394, 8004529693
    ]
  },
  'success-rate': {
    value: 96.72,
    delta: -0.42,
    trend: [98, 97.7, 97.8, 97.5, 96.9, 96.5, 95.3, 94.3, 95, 95.7, 96.4, 97.7]
  },
  'status-5xx': {
    value: 79347,
    delta: 5.47,
    trend: [4785, 5447, 4587, 5964, 5280, 7973, 8616, 9609, 8368, 7191, 6381, 5146]
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
      1970768, 2045431, 2207447, 2043392, 1792162, 1894493, 1522523, 1327714, 1397824, 1400013,
      1662309, 1853957
    ]
  },
  {
    id: '3xx',
    name: 'Status 3xx',
    values: [
      262040, 267609, 285424, 281518, 253458, 243622, 188475, 157518, 160801, 163438, 201094, 240161
    ]
  },
  {
    id: '4xx',
    name: 'Status 4xx',
    values: [41015, 49733, 50969, 54872, 61252, 68657, 75390, 80334, 73837, 63741, 63809, 45030]
  },
  {
    id: '5xx',
    name: 'Status 5xx',
    values: [4785, 5447, 4587, 5964, 5280, 7973, 8616, 9609, 8368, 7191, 6381, 5146]
  }
]

export const sampleCountries: AnalyticsDashboardCountry[] = [
  { country: 'United States', requests: 11488380 },
  { country: 'Brazil', requests: 5826560 },
  { country: 'Germany', requests: 1303470 },
  { country: 'India', requests: 1013580 },
  { country: 'Mexico', requests: 765780 },
  { country: 'Argentina', requests: 530680 }
]

export const sampleHosts: AnalyticsDashboardHost[] = [
  { id: 'www.example.com', host: 'www.example.com', service: 'Storefront', requests: 9760760 },
  { id: 'api.example.com', host: 'api.example.com', service: 'Checkout API', requests: 5414850 },
  { id: 'shop.example.com', host: 'shop.example.com', service: 'Storefront', requests: 3786400 },
  { id: 'docs.example.com', host: 'docs.example.com', service: 'Docs', requests: 1760460 },
  {
    id: 'status.example.com',
    host: 'status.example.com',
    service: 'Status page',
    requests: 730510
  },
  { id: 'cdn.example.com', host: 'cdn.example.com', service: 'Media', requests: 470210 },
  { id: 'blog.example.com', host: 'blog.example.com', service: 'Docs', requests: 219940 }
]

export const sampleChanges: AnalyticsDashboardChanges = {
  requests: 10.03,
  statusCodes: 10.03
}
