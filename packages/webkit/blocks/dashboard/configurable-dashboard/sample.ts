import type { BarListItem } from '@aziontech/webkit/bar-list'

import type { ConfigurableDashboardSeries } from './configurable-dashboard.vue'

export const sampleLabels: string[] = [
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

export const sampleSeries: ConfigurableDashboardSeries = {
  requests: [
    {
      id: 'requests',
      name: 'Requests',
      values: [
        2029738, 1799252, 1910217, 1633835, 1757364, 1722765, 2157932, 2151290, 2283541, 2397218,
        2545994, 2347243
      ]
    }
  ],
  regions: [
    {
      id: 'South America',
      name: 'South America',
      values: [9820000]
    },
    {
      id: 'North America',
      name: 'North America',
      values: [7410000]
    },
    {
      id: 'Europe',
      name: 'Europe',
      values: [4960000]
    },
    {
      id: 'Asia',
      name: 'Asia',
      values: [2230000]
    },
    {
      id: 'Oceania',
      name: 'Oceania',
      values: [610000]
    }
  ],
  transfer: [
    {
      id: 'out',
      name: 'Out',
      values: [
        7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
        9768346098, 10386911277, 8642195236, 7365365394, 8004529693
      ]
    },
    {
      id: 'in',
      name: 'In',
      values: [
        1991543196, 1861411304, 1899395715, 1528384777, 1319208897, 1269798165, 1261414828,
        1391471001, 1417213338, 1614716457, 1979668469, 2070880025
      ]
    }
  ],
  errors: [
    {
      id: '4xx',
      name: '4xx',
      values: [13707, 15864, 14544, 16239, 19681, 24625, 22235, 22216, 22808, 17486, 16275, 15501]
    },
    {
      id: '5xx',
      name: '5xx',
      values: [8144, 8724, 9890, 8837, 7067, 7731, 5015, 3592, 4017, 3975, 5911, 7275]
    }
  ],
  latency: [
    {
      id: 'p95',
      name: 'p95',
      values: [166, 167, 151, 172, 200, 191, 205, 208, 205, 182, 165, 175]
    }
  ]
}

export const sampleSources: BarListItem[] = [
  {
    id: 'web-app-prod',
    name: 'web-app-prod',
    value: 11420000
  },
  {
    id: 'payments-api',
    name: 'payments-api',
    value: 6240000
  },
  {
    id: 'storefront-checkout',
    name: 'storefront-checkout',
    value: 4910000
  },
  {
    id: 'marketing-site',
    name: 'marketing-site',
    value: 2380000
  },
  {
    id: 'status-page',
    name: 'status-page',
    value: 860000
  }
]
