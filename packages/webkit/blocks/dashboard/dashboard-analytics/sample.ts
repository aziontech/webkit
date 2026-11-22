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

/** One usage tile of the Usage variant. */
export interface UsageFigure {
  /** Stable key. */
  id: string
  /** The tile label. */
  label: string
  /** One sentence that defines the figure. */
  description: string
  /** The unit the figure is written in. */
  unit: 'count' | 'bytes'
  /** The figure for the period. */
  value: number
  /** Change against the previous period, in percent. */
  delta: number
  /** The sparkline, one value per interval. */
  trend: number[]
}

/** One row of the Usage by project table. */
export interface UsageProject {
  /** Stable row key. */
  id: string
  /** The project name. */
  project: string
  /** Requests served in the period. */
  requests: number
  /** Data transferred in the period, written. */
  dataTransferred: string
}

/** Labels and series of one usage chart. */
export interface UsageSeries {
  /** One label per interval or bar. */
  labels: string[]
  /** The series. */
  series: ChartSeries[]
}

export const sampleUsageFigures: UsageFigure[] = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Requests served by every project in the period.',
    unit: 'count',
    value: 49330393,
    delta: -1.83,
    trend: [
      1806444, 1576992, 1869283, 1891454, 1893374, 2012867, 2036776, 1980797, 2313210, 2444662,
      2507165, 2238034, 2315013, 2246445, 2351171, 2177971, 2295207, 2157832, 1993248, 2027048,
      1952960, 1940554, 1585246, 1716640
    ]
  },
  {
    id: 'data-transferred',
    label: 'Data transferred',
    description: 'Data delivered to clients, in and out, by every project in the period.',
    unit: 'bytes',
    value: 821729544000,
    delta: 8.98,
    trend: [
      37987787300, 41596689512, 40096114032, 42509594088, 39693463193, 38541437265, 34997200644,
      32832653647, 35896619893, 34695695753, 32560234611, 29835955559, 26447312700, 29730754488,
      27630321968, 25403501912, 30485256807, 28642766735, 30894459356, 31267070353, 35973056107,
      35248016247, 39016905389, 39746676441
    ]
  },
  {
    id: 'jobs-run',
    label: 'Jobs run',
    description: 'Background jobs that ran to completion in the period.',
    unit: 'count',
    value: 14546636,
    delta: 18.58,
    trend: [
      578482, 549084, 505643, 524549, 522829, 541220, 532059, 511331, 558322, 540484, 616959,
      622771, 614122, 697060, 666023, 646019, 673706, 678263, 739613, 667428, 662645, 668657,
      596124, 633243
    ]
  },
  {
    id: 'images-processed',
    label: 'Images processed',
    description: 'Images resized, cropped or converted in the period.',
    unit: 'count',
    value: 2002933,
    delta: 16.72,
    trend: [
      93274, 93157, 98234, 94141, 104108, 92749, 86064, 94234, 87803, 85279, 79578, 69276, 71356,
      63808, 62459, 74165, 76690, 67994, 79899, 83824, 78724, 85140, 92196, 88781
    ]
  },
  {
    id: 'requests-inspected',
    label: 'Requests inspected',
    description: 'Requests checked against security rules in the period.',
    unit: 'count',
    value: 30771941,
    delta: 2.78,
    trend: [
      1502207, 1457618, 1405860, 1393149, 1339849, 1286141, 1261605, 1252293, 1140520, 1185385,
      992858, 963099, 1082325, 1160330, 1160070, 1229994, 1202329, 1187616, 1405599, 1445636,
      1385091, 1402142, 1447647, 1482578
    ]
  },
  {
    id: 'logs-exported',
    label: 'Logs exported',
    description: 'Log data sent to external destinations in the period.',
    unit: 'bytes',
    value: 61800164400,
    delta: -7.73,
    trend: [
      2810255726, 2418807359, 2364529874, 2399632871, 2117725975, 1965392203, 2243329246,
      1954529809, 2216724649, 2190530044, 2115350572, 2338212538, 2503000274, 2614725041,
      2827373726, 2886198329, 3127436025, 3201613797, 2880012354, 3108954591, 2945086551,
      2856059556, 2936199828, 2778483462
    ]
  }
]

export const sampleUsageComparison: UsageSeries & { delta: number | null } = {
  delta: 8.98,
  labels: [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ],
  series: [
    {
      id: 'current',
      name: 'This period',
      values: [
        37987787300, 41596689512, 40096114032, 42509594088, 39693463193, 38541437265, 34997200644,
        32832653647, 35896619893, 34695695753, 32560234611, 29835955559, 26447312700, 29730754488,
        27630321968, 25403501912, 30485256807, 28642766735, 30894459356, 31267070353, 35973056107,
        35248016247, 39016905389, 39746676441
      ]
    },
    {
      id: 'previous',
      name: 'Previous period',
      values: [
        36311824255, 36364065729, 35671651702, 38220818870, 34170491149, 39019034176, 35328541542,
        37510349711, 33962134894, 30438098447, 29382417841, 27076008841, 29470299745, 28487872271,
        27983934298, 25646807130, 25926728851, 25537721824, 27160266458, 25172084289, 28466967106,
        30258971553, 33662716159, 32759509159
      ]
    }
  ]
}

export const sampleUsageRanking: UsageSeries = {
  labels: [
    'web-app-prod',
    'web-app-eu-prod',
    'storefront-checkout',
    'marketing-site',
    'payments-api',
    'campaign-landing',
    'status-page',
    'web-app-staging'
  ],
  series: [
    {
      id: 'requests',
      name: 'Data transferred by project',
      values: [
        340000000000, 190000000000, 120000000000, 76000000000, 41000000000, 23000000000, 9800000000,
        3200000000
      ]
    }
  ]
}

export const sampleUsageProjects: UsageProject[] = [
  {
    id: 'web-app-prod',
    project: 'web-app-prod',
    requests: 18420000,
    dataTransferred: '340 GB'
  },
  {
    id: 'web-app-eu-prod',
    project: 'web-app-eu-prod',
    requests: 11730000,
    dataTransferred: '190 GB'
  },
  {
    id: 'storefront-checkout',
    project: 'storefront-checkout',
    requests: 7910000,
    dataTransferred: '120 GB'
  },
  {
    id: 'marketing-site',
    project: 'marketing-site',
    requests: 4380000,
    dataTransferred: '76.0 GB'
  },
  {
    id: 'payments-api',
    project: 'payments-api',
    requests: 6240000,
    dataTransferred: '41.0 GB'
  },
  {
    id: 'campaign-landing',
    project: 'campaign-landing',
    requests: 1570000,
    dataTransferred: '23.0 GB'
  },
  { id: 'status-page', project: 'status-page', requests: 860000, dataTransferred: '9.8 GB' },
  {
    id: 'web-app-staging',
    project: 'web-app-staging',
    requests: 210000,
    dataTransferred: '3.2 GB'
  }
]
