import type { BarListItem } from '@aziontech/webkit/bar-list'
import type { ChartSeries } from '@aziontech/webkit/chart'

import type {
  AlertsDashboardAlert,
  AlertsDashboardEntity,
  AlertsDashboardKpis,
  AlertsDashboardLevelCount
} from './alerts-dashboard.vue'

export const sampleKpis: AlertsDashboardKpis = {
  open: { value: 42, delta: 10.5 },
  'critical-high': { value: 9, delta: 28.6 },
  raised: { value: 1231, delta: 4.2 },
  'false-positives': { value: 6, delta: -14.3 }
}

export const sampleLabels: string[] = [
  'Oct 12',
  'Oct 13',
  'Oct 14',
  'Oct 15',
  'Oct 16',
  'Oct 17',
  'Oct 18',
  'Oct 19',
  'Oct 20',
  'Oct 21',
  'Oct 22',
  'Oct 23',
  'Oct 24',
  'Oct 25',
  'Oct 26',
  'Oct 27',
  'Oct 28',
  'Oct 29',
  'Oct 30',
  'Oct 31',
  'Nov 1',
  'Nov 2',
  'Nov 3',
  'Nov 4',
  'Nov 5',
  'Nov 6',
  'Nov 7',
  'Nov 8',
  'Nov 9',
  'Nov 10'
]

export const sampleSeries: ChartSeries[] = [
  {
    id: 'critical',
    name: 'Critical',
    color: 'severity-critical',
    values: [
      1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 2
    ]
  },
  {
    id: 'high',
    name: 'High',
    color: 'severity-high',
    values: [
      3, 3, 3, 4, 5, 5, 5, 4, 3, 2, 2, 2, 2, 3, 4, 4, 3, 3, 2, 2, 2, 6, 8, 9, 5, 5, 4, 3, 3, 3
    ]
  },
  {
    id: 'medium',
    name: 'Medium',
    color: 'severity-medium',
    values: [
      10, 8, 7, 7, 7, 9, 10, 10, 9, 7, 5, 3, 3, 4, 6, 8, 9, 8, 7, 5, 5, 10, 13, 17, 11, 12, 11, 10,
      8, 7
    ]
  },
  {
    id: 'low',
    name: 'Low',
    color: 'severity-low',
    values: [
      17, 15, 12, 10, 9, 9, 11, 13, 14, 13, 11, 8, 5, 4, 6, 8, 11, 13, 13, 12, 10, 15, 15, 18, 13,
      16, 17, 17, 15, 12
    ]
  },
  {
    id: 'info',
    name: 'Info',
    color: 'severity-info',
    values: [
      22, 22, 20, 17, 13, 11, 10, 12, 15, 16, 17, 14, 11, 7, 6, 6, 9, 13, 16, 18, 17, 26, 22, 20,
      12, 15, 19, 22, 22, 20
    ]
  }
]

export const sampleOpenByLevel: AlertsDashboardLevelCount[] = [
  {
    id: 'critical',
    count: 3
  },
  {
    id: 'high',
    count: 6
  },
  {
    id: 'medium',
    count: 14
  },
  {
    id: 'low',
    count: 11
  },
  {
    id: 'info',
    count: 8
  }
]

export const sampleTypes: BarListItem[] = [
  {
    id: 'unusual-location',
    name: 'Sign-in from an unusual location',
    value: 214
  },
  {
    id: 'failed-sign-ins',
    name: 'Repeated failed sign-ins',
    value: 188
  },
  {
    id: 'new-device',
    name: 'Sign-in from a new device',
    value: 141
  },
  {
    id: 'off-hours',
    name: 'Access outside working hours',
    value: 97
  },
  {
    id: 'mass-download',
    name: 'Mass download',
    value: 63
  },
  {
    id: 'new-destination',
    name: 'Data sent to a new destination',
    value: 41
  },
  {
    id: 'privilege-change',
    name: 'Privilege change',
    value: 22
  },
  {
    id: 'impossible-travel',
    name: 'Impossible travel',
    value: 9
  }
]

export const sampleEntities: AlertsDashboardEntity[] = [
  {
    id: 'entity-01',
    name: 'ava.wilson',
    type: 'User',
    score: 92,
    level: 'critical',
    alerts: 4
  },
  {
    id: 'entity-02',
    name: 'build-runner-07',
    type: 'Service account',
    score: 84,
    level: 'high',
    alerts: 3
  },
  {
    id: 'entity-03',
    name: 'laptop-0418',
    type: 'Device',
    score: 77,
    level: 'high',
    alerts: 2
  },
  {
    id: 'entity-04',
    name: 'mark.chen',
    type: 'User',
    score: 63,
    level: 'medium',
    alerts: 3
  },
  {
    id: 'entity-05',
    name: 'reporting-api',
    type: 'Service account',
    score: 58,
    level: 'medium',
    alerts: 1
  },
  {
    id: 'entity-06',
    name: 'lisa.martin',
    type: 'User',
    score: 41,
    level: 'low',
    alerts: 2
  }
]

export const sampleAlerts: AlertsDashboardAlert[] = [
  {
    id: 'alert-01',
    level: 'critical',
    rank: 5,
    title: 'Data sent to a new destination',
    entity: 'ava.wilson',
    opened: 'Nov 10, 09:42',
    status: 'Open'
  },
  {
    id: 'alert-02',
    level: 'critical',
    rank: 5,
    title: 'Impossible travel',
    entity: 'ava.wilson',
    opened: 'Nov 10, 07:15',
    status: 'Investigating'
  },
  {
    id: 'alert-03',
    level: 'critical',
    rank: 5,
    title: 'Privilege change',
    entity: 'build-runner-07',
    opened: 'Nov 9, 22:08',
    status: 'Open'
  },
  {
    id: 'alert-04',
    level: 'high',
    rank: 4,
    title: 'Mass download',
    entity: 'laptop-0418',
    opened: 'Nov 9, 18:31',
    status: 'Investigating'
  },
  {
    id: 'alert-05',
    level: 'high',
    rank: 4,
    title: 'Repeated failed sign-ins',
    entity: 'build-runner-07',
    opened: 'Nov 9, 16:02',
    status: 'Open'
  },
  {
    id: 'alert-06',
    level: 'high',
    rank: 4,
    title: 'Sign-in from a new device',
    entity: 'mark.chen',
    opened: 'Nov 9, 11:47',
    status: 'Open'
  },
  {
    id: 'alert-07',
    level: 'medium',
    rank: 3,
    title: 'Access outside working hours',
    entity: 'reporting-api',
    opened: 'Nov 9, 03:20',
    status: 'Open'
  },
  {
    id: 'alert-08',
    level: 'medium',
    rank: 3,
    title: 'Sign-in from an unusual location',
    entity: 'mark.chen',
    opened: 'Nov 8, 21:55',
    status: 'Open'
  },
  {
    id: 'alert-09',
    level: 'medium',
    rank: 3,
    title: 'Repeated failed sign-ins',
    entity: 'lisa.martin',
    opened: 'Nov 8, 14:09',
    status: 'Investigating'
  },
  {
    id: 'alert-10',
    level: 'low',
    rank: 2,
    title: 'Sign-in from a new device',
    entity: 'lisa.martin',
    opened: 'Nov 8, 09:36',
    status: 'Open'
  },
  {
    id: 'alert-11',
    level: 'low',
    rank: 2,
    title: 'Access outside working hours',
    entity: 'laptop-0418',
    opened: 'Nov 7, 23:12',
    status: 'Open'
  },
  {
    id: 'alert-12',
    level: 'info',
    rank: 1,
    title: 'Sign-in from an unusual location',
    entity: 'mark.chen',
    opened: 'Nov 7, 10:48',
    status: 'Open'
  }
]
