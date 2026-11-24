import type { BarListItem } from '@aziontech/webkit/bar-list'

import type {
  HealthScoreHourlyRow,
  HealthScoreIncident,
  HealthScoreOverall
} from './dashboard-health-score.vue'

const hours: string[] = [
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
]

export const sampleOverall: HealthScoreOverall = {
  score: 79,
  band: {
    label: 'Fair',
    severity: 'warning'
  },
  cause: 'packet loss',
  labels: hours,
  series: [
    {
      id: 'score',
      name: 'Score',
      values: [
        84, 85, 86, 86, 85, 84, 82, 79, 74, 71, 73, 76, 78, 77, 75, 72, 70, 74, 78, 81, 83, 84, 85,
        84
      ]
    }
  ]
}

export const sampleApplications: BarListItem[] = [
  {
    id: 'video-calls',
    name: 'Video calls · packet loss',
    value: 48
  },
  {
    id: 'file-storage',
    name: 'File storage · slow server response',
    value: 64
  },
  {
    id: 'crm',
    name: 'CRM · slow DNS lookups',
    value: 73
  },
  {
    id: 'mail',
    name: 'Mail · Wi-Fi signal',
    value: 83
  },
  {
    id: 'chat',
    name: 'Chat · Wi-Fi signal',
    value: 89
  },
  {
    id: 'docs',
    name: 'Docs · high latency',
    value: 93
  }
]

export const sampleLocations: BarListItem[] = [
  {
    id: 'travel',
    name: 'Travel · high latency',
    value: 58
  },
  {
    id: 'home',
    name: 'Home · Wi-Fi signal',
    value: 71
  },
  {
    id: 'south-branch',
    name: 'South branch · packet loss',
    value: 76
  },
  {
    id: 'north-branch',
    name: 'North branch · slow DNS lookups',
    value: 84
  },
  {
    id: 'main-office',
    name: 'Main office · slow server response',
    value: 89
  }
]

export const sampleHourly: HealthScoreHourlyRow[] = [
  {
    id: 'video-calls',
    name: 'Video calls',
    band: {
      label: 'Fair',
      severity: 'warning'
    },
    blocks: [
      {
        id: 'video-calls-00:00',
        severity: 'warning',
        label: '00:00 · 62 · Fair'
      },
      {
        id: 'video-calls-01:00',
        severity: 'warning',
        label: '01:00 · 57 · Fair'
      },
      {
        id: 'video-calls-02:00',
        severity: 'warning',
        label: '02:00 · 54 · Fair'
      },
      {
        id: 'video-calls-03:00',
        severity: 'warning',
        label: '03:00 · 60 · Fair'
      },
      {
        id: 'video-calls-04:00',
        severity: 'warning',
        label: '04:00 · 61 · Fair'
      },
      {
        id: 'video-calls-05:00',
        severity: 'warning',
        label: '05:00 · 55 · Fair'
      },
      {
        id: 'video-calls-06:00',
        severity: 'warning',
        label: '06:00 · 56 · Fair'
      },
      {
        id: 'video-calls-07:00',
        severity: 'warning',
        label: '07:00 · 62 · Fair'
      },
      {
        id: 'video-calls-08:00',
        severity: 'danger',
        label: '08:00 · 35 · Poor'
      },
      {
        id: 'video-calls-09:00',
        severity: 'danger',
        label: '09:00 · 30 · Poor'
      },
      {
        id: 'video-calls-10:00',
        severity: 'danger',
        label: '10:00 · 34 · Poor'
      },
      {
        id: 'video-calls-11:00',
        severity: 'danger',
        label: '11:00 · 38 · Poor'
      },
      {
        id: 'video-calls-12:00',
        severity: 'danger',
        label: '12:00 · 33 · Poor'
      },
      {
        id: 'video-calls-13:00',
        severity: 'danger',
        label: '13:00 · 30 · Poor'
      },
      {
        id: 'video-calls-14:00',
        severity: 'danger',
        label: '14:00 · 36 · Poor'
      },
      {
        id: 'video-calls-15:00',
        severity: 'danger',
        label: '15:00 · 37 · Poor'
      },
      {
        id: 'video-calls-16:00',
        severity: 'danger',
        label: '16:00 · 32 · Poor'
      },
      {
        id: 'video-calls-17:00',
        severity: 'danger',
        label: '17:00 · 31 · Poor'
      },
      {
        id: 'video-calls-18:00',
        severity: 'warning',
        label: '18:00 · 61 · Fair'
      },
      {
        id: 'video-calls-19:00',
        severity: 'warning',
        label: '19:00 · 60 · Fair'
      },
      {
        id: 'video-calls-20:00',
        severity: 'warning',
        label: '20:00 · 54 · Fair'
      },
      {
        id: 'video-calls-21:00',
        severity: 'warning',
        label: '21:00 · 57 · Fair'
      },
      {
        id: 'video-calls-22:00',
        severity: 'warning',
        label: '22:00 · 62 · Fair'
      },
      {
        id: 'video-calls-23:00',
        severity: 'warning',
        label: '23:00 · 58 · Fair'
      }
    ]
  },
  {
    id: 'file-storage',
    name: 'File storage',
    band: {
      label: 'Fair',
      severity: 'warning'
    },
    blocks: [
      {
        id: 'file-storage-00:00',
        severity: 'warning',
        label: '00:00 · 72 · Fair'
      },
      {
        id: 'file-storage-01:00',
        severity: 'warning',
        label: '01:00 · 68 · Fair'
      },
      {
        id: 'file-storage-02:00',
        severity: 'warning',
        label: '02:00 · 73 · Fair'
      },
      {
        id: 'file-storage-03:00',
        severity: 'warning',
        label: '03:00 · 76 · Fair'
      },
      {
        id: 'file-storage-04:00',
        severity: 'warning',
        label: '04:00 · 70 · Fair'
      },
      {
        id: 'file-storage-05:00',
        severity: 'warning',
        label: '05:00 · 69 · Fair'
      },
      {
        id: 'file-storage-06:00',
        severity: 'warning',
        label: '06:00 · 75 · Fair'
      },
      {
        id: 'file-storage-07:00',
        severity: 'warning',
        label: '07:00 · 74 · Fair'
      },
      {
        id: 'file-storage-08:00',
        severity: 'danger',
        label: '08:00 · 49 · Poor'
      },
      {
        id: 'file-storage-09:00',
        severity: 'warning',
        label: '09:00 · 51 · Fair'
      },
      {
        id: 'file-storage-10:00',
        severity: 'warning',
        label: '10:00 · 56 · Fair'
      },
      {
        id: 'file-storage-11:00',
        severity: 'warning',
        label: '11:00 · 52 · Fair'
      },
      {
        id: 'file-storage-12:00',
        severity: 'danger',
        label: '12:00 · 48 · Poor'
      },
      {
        id: 'file-storage-13:00',
        severity: 'warning',
        label: '13:00 · 53 · Fair'
      },
      {
        id: 'file-storage-14:00',
        severity: 'warning',
        label: '14:00 · 56 · Fair'
      },
      {
        id: 'file-storage-15:00',
        severity: 'warning',
        label: '15:00 · 50 · Fair'
      },
      {
        id: 'file-storage-16:00',
        severity: 'danger',
        label: '16:00 · 49 · Poor'
      },
      {
        id: 'file-storage-17:00',
        severity: 'warning',
        label: '17:00 · 54 · Fair'
      },
      {
        id: 'file-storage-18:00',
        severity: 'warning',
        label: '18:00 · 75 · Fair'
      },
      {
        id: 'file-storage-19:00',
        severity: 'warning',
        label: '19:00 · 69 · Fair'
      },
      {
        id: 'file-storage-20:00',
        severity: 'warning',
        label: '20:00 · 70 · Fair'
      },
      {
        id: 'file-storage-21:00',
        severity: 'warning',
        label: '21:00 · 76 · Fair'
      },
      {
        id: 'file-storage-22:00',
        severity: 'warning',
        label: '22:00 · 73 · Fair'
      },
      {
        id: 'file-storage-23:00',
        severity: 'warning',
        label: '23:00 · 68 · Fair'
      }
    ]
  },
  {
    id: 'crm',
    name: 'CRM',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'crm-00:00',
        severity: 'warning',
        label: '00:00 · 76 · Fair'
      },
      {
        id: 'crm-01:00',
        severity: 'success',
        label: '01:00 · 81 · Good'
      },
      {
        id: 'crm-02:00',
        severity: 'success',
        label: '02:00 · 84 · Good'
      },
      {
        id: 'crm-03:00',
        severity: 'warning',
        label: '03:00 · 78 · Fair'
      },
      {
        id: 'crm-04:00',
        severity: 'warning',
        label: '04:00 · 77 · Fair'
      },
      {
        id: 'crm-05:00',
        severity: 'success',
        label: '05:00 · 83 · Good'
      },
      {
        id: 'crm-06:00',
        severity: 'success',
        label: '06:00 · 82 · Good'
      },
      {
        id: 'crm-07:00',
        severity: 'warning',
        label: '07:00 · 76 · Fair'
      },
      {
        id: 'crm-08:00',
        severity: 'warning',
        label: '08:00 · 63 · Fair'
      },
      {
        id: 'crm-09:00',
        severity: 'warning',
        label: '09:00 · 68 · Fair'
      },
      {
        id: 'crm-10:00',
        severity: 'warning',
        label: '10:00 · 64 · Fair'
      },
      {
        id: 'crm-11:00',
        severity: 'warning',
        label: '11:00 · 60 · Fair'
      },
      {
        id: 'crm-12:00',
        severity: 'warning',
        label: '12:00 · 65 · Fair'
      },
      {
        id: 'crm-13:00',
        severity: 'warning',
        label: '13:00 · 68 · Fair'
      },
      {
        id: 'crm-14:00',
        severity: 'warning',
        label: '14:00 · 62 · Fair'
      },
      {
        id: 'crm-15:00',
        severity: 'warning',
        label: '15:00 · 61 · Fair'
      },
      {
        id: 'crm-16:00',
        severity: 'warning',
        label: '16:00 · 66 · Fair'
      },
      {
        id: 'crm-17:00',
        severity: 'warning',
        label: '17:00 · 67 · Fair'
      },
      {
        id: 'crm-18:00',
        severity: 'warning',
        label: '18:00 · 77 · Fair'
      },
      {
        id: 'crm-19:00',
        severity: 'warning',
        label: '19:00 · 78 · Fair'
      },
      {
        id: 'crm-20:00',
        severity: 'success',
        label: '20:00 · 84 · Good'
      },
      {
        id: 'crm-21:00',
        severity: 'success',
        label: '21:00 · 81 · Good'
      },
      {
        id: 'crm-22:00',
        severity: 'warning',
        label: '22:00 · 76 · Fair'
      },
      {
        id: 'crm-23:00',
        severity: 'success',
        label: '23:00 · 80 · Good'
      }
    ]
  },
  {
    id: 'mail',
    name: 'Mail',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'mail-00:00',
        severity: 'success',
        label: '00:00 · 93 · Good'
      },
      {
        id: 'mail-01:00',
        severity: 'success',
        label: '01:00 · 89 · Good'
      },
      {
        id: 'mail-02:00',
        severity: 'success',
        label: '02:00 · 85 · Good'
      },
      {
        id: 'mail-03:00',
        severity: 'success',
        label: '03:00 · 90 · Good'
      },
      {
        id: 'mail-04:00',
        severity: 'success',
        label: '04:00 · 93 · Good'
      },
      {
        id: 'mail-05:00',
        severity: 'success',
        label: '05:00 · 87 · Good'
      },
      {
        id: 'mail-06:00',
        severity: 'success',
        label: '06:00 · 86 · Good'
      },
      {
        id: 'mail-07:00',
        severity: 'success',
        label: '07:00 · 91 · Good'
      },
      {
        id: 'mail-08:00',
        severity: 'warning',
        label: '08:00 · 78 · Fair'
      },
      {
        id: 'mail-09:00',
        severity: 'warning',
        label: '09:00 · 72 · Fair'
      },
      {
        id: 'mail-10:00',
        severity: 'warning',
        label: '10:00 · 73 · Fair'
      },
      {
        id: 'mail-11:00',
        severity: 'warning',
        label: '11:00 · 79 · Fair'
      },
      {
        id: 'mail-12:00',
        severity: 'warning',
        label: '12:00 · 76 · Fair'
      },
      {
        id: 'mail-13:00',
        severity: 'warning',
        label: '13:00 · 71 · Fair'
      },
      {
        id: 'mail-14:00',
        severity: 'warning',
        label: '14:00 · 75 · Fair'
      },
      {
        id: 'mail-15:00',
        severity: 'warning',
        label: '15:00 · 79 · Fair'
      },
      {
        id: 'mail-16:00',
        severity: 'warning',
        label: '16:00 · 74 · Fair'
      },
      {
        id: 'mail-17:00',
        severity: 'warning',
        label: '17:00 · 71 · Fair'
      },
      {
        id: 'mail-18:00',
        severity: 'success',
        label: '18:00 · 91 · Good'
      },
      {
        id: 'mail-19:00',
        severity: 'success',
        label: '19:00 · 92 · Good'
      },
      {
        id: 'mail-20:00',
        severity: 'success',
        label: '20:00 · 86 · Good'
      },
      {
        id: 'mail-21:00',
        severity: 'success',
        label: '21:00 · 86 · Good'
      },
      {
        id: 'mail-22:00',
        severity: 'success',
        label: '22:00 · 92 · Good'
      },
      {
        id: 'mail-23:00',
        severity: 'success',
        label: '23:00 · 91 · Good'
      }
    ]
  },
  {
    id: 'chat',
    name: 'Chat',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'chat-00:00',
        severity: 'success',
        label: '00:00 · 94 · Good'
      },
      {
        id: 'chat-01:00',
        severity: 'success',
        label: '01:00 · 98 · Good'
      },
      {
        id: 'chat-02:00',
        severity: 'success',
        label: '02:00 · 93 · Good'
      },
      {
        id: 'chat-03:00',
        severity: 'success',
        label: '03:00 · 90 · Good'
      },
      {
        id: 'chat-04:00',
        severity: 'success',
        label: '04:00 · 96 · Good'
      },
      {
        id: 'chat-05:00',
        severity: 'success',
        label: '05:00 · 97 · Good'
      },
      {
        id: 'chat-06:00',
        severity: 'success',
        label: '06:00 · 91 · Good'
      },
      {
        id: 'chat-07:00',
        severity: 'success',
        label: '07:00 · 92 · Good'
      },
      {
        id: 'chat-08:00',
        severity: 'success',
        label: '08:00 · 86 · Good'
      },
      {
        id: 'chat-09:00',
        severity: 'success',
        label: '09:00 · 83 · Good'
      },
      {
        id: 'chat-10:00',
        severity: 'warning',
        label: '10:00 · 78 · Fair'
      },
      {
        id: 'chat-11:00',
        severity: 'success',
        label: '11:00 · 82 · Good'
      },
      {
        id: 'chat-12:00',
        severity: 'success',
        label: '12:00 · 86 · Good'
      },
      {
        id: 'chat-13:00',
        severity: 'success',
        label: '13:00 · 81 · Good'
      },
      {
        id: 'chat-14:00',
        severity: 'warning',
        label: '14:00 · 78 · Fair'
      },
      {
        id: 'chat-15:00',
        severity: 'success',
        label: '15:00 · 84 · Good'
      },
      {
        id: 'chat-16:00',
        severity: 'success',
        label: '16:00 · 85 · Good'
      },
      {
        id: 'chat-17:00',
        severity: 'success',
        label: '17:00 · 80 · Good'
      },
      {
        id: 'chat-18:00',
        severity: 'success',
        label: '18:00 · 91 · Good'
      },
      {
        id: 'chat-19:00',
        severity: 'success',
        label: '19:00 · 97 · Good'
      },
      {
        id: 'chat-20:00',
        severity: 'success',
        label: '20:00 · 96 · Good'
      },
      {
        id: 'chat-21:00',
        severity: 'success',
        label: '21:00 · 90 · Good'
      },
      {
        id: 'chat-22:00',
        severity: 'success',
        label: '22:00 · 93 · Good'
      },
      {
        id: 'chat-23:00',
        severity: 'success',
        label: '23:00 · 98 · Good'
      }
    ]
  },
  {
    id: 'docs',
    name: 'Docs',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'docs-00:00',
        severity: 'success',
        label: '00:00 · 97 · Good'
      },
      {
        id: 'docs-01:00',
        severity: 'success',
        label: '01:00 · 93 · Good'
      },
      {
        id: 'docs-02:00',
        severity: 'success',
        label: '02:00 · 98 · Good'
      },
      {
        id: 'docs-03:00',
        severity: 'success',
        label: '03:00 · 100 · Good'
      },
      {
        id: 'docs-04:00',
        severity: 'success',
        label: '04:00 · 95 · Good'
      },
      {
        id: 'docs-05:00',
        severity: 'success',
        label: '05:00 · 94 · Good'
      },
      {
        id: 'docs-06:00',
        severity: 'success',
        label: '06:00 · 99 · Good'
      },
      {
        id: 'docs-07:00',
        severity: 'success',
        label: '07:00 · 100 · Good'
      },
      {
        id: 'docs-08:00',
        severity: 'success',
        label: '08:00 · 84 · Good'
      },
      {
        id: 'docs-09:00',
        severity: 'success',
        label: '09:00 · 85 · Good'
      },
      {
        id: 'docs-10:00',
        severity: 'success',
        label: '10:00 · 91 · Good'
      },
      {
        id: 'docs-11:00',
        severity: 'success',
        label: '11:00 · 88 · Good'
      },
      {
        id: 'docs-12:00',
        severity: 'success',
        label: '12:00 · 83 · Good'
      },
      {
        id: 'docs-13:00',
        severity: 'success',
        label: '13:00 · 87 · Good'
      },
      {
        id: 'docs-14:00',
        severity: 'success',
        label: '14:00 · 91 · Good'
      },
      {
        id: 'docs-15:00',
        severity: 'success',
        label: '15:00 · 86 · Good'
      },
      {
        id: 'docs-16:00',
        severity: 'success',
        label: '16:00 · 83 · Good'
      },
      {
        id: 'docs-17:00',
        severity: 'success',
        label: '17:00 · 89 · Good'
      },
      {
        id: 'docs-18:00',
        severity: 'success',
        label: '18:00 · 100 · Good'
      },
      {
        id: 'docs-19:00',
        severity: 'success',
        label: '19:00 · 94 · Good'
      },
      {
        id: 'docs-20:00',
        severity: 'success',
        label: '20:00 · 95 · Good'
      },
      {
        id: 'docs-21:00',
        severity: 'success',
        label: '21:00 · 100 · Good'
      },
      {
        id: 'docs-22:00',
        severity: 'success',
        label: '22:00 · 99 · Good'
      },
      {
        id: 'docs-23:00',
        severity: 'success',
        label: '23:00 · 93 · Good'
      }
    ]
  }
]

export const sampleIncidents: HealthScoreIncident[] = [
  {
    id: 'incident-03',
    name: 'Video calls',
    scope: 'Application',
    icon: 'az az-layout-grid',
    devices: 34,
    share: 12,
    cause: 'Packet loss',
    opened: '2026-11-10T09:40:00Z',
    openedLabel: '09:40',
    band: {
      label: 'Poor',
      severity: 'danger'
    }
  },
  {
    id: 'incident-02',
    name: 'Travel',
    scope: 'Location',
    icon: 'az az-map-pin',
    devices: 9,
    share: 31,
    cause: 'High latency',
    opened: '2026-11-10T07:15:00Z',
    openedLabel: '07:15',
    band: {
      label: 'Fair',
      severity: 'warning'
    }
  },
  {
    id: 'incident-01',
    name: 'File storage',
    scope: 'Application',
    icon: 'az az-layout-grid',
    devices: 18,
    share: 7,
    cause: 'Slow server response',
    opened: '2026-11-10T06:02:00Z',
    openedLabel: '06:02',
    band: {
      label: 'Fair',
      severity: 'warning'
    }
  }
]

export interface RealUserVital {
  id: string
  label: string
  value: number
  unit: string
  decimals: number
  description: string
}

export interface RealUserTrend {
  id: string
  label: string
  unit: string
  range: [number, number]
}

export const sampleVitals: RealUserVital[] = [
  {
    id: 'page-load-time',
    label: 'Page load time',
    value: 1.24,
    unit: 's',
    decimals: 2,
    description: 'Median time to load the page, as measured in the browser.'
  },
  {
    id: 'largest-contentful-paint',
    label: 'Largest contentful paint',
    value: 1.86,
    unit: 's',
    decimals: 2,
    description: 'Median time until the largest element on the page is painted, across sessions.'
  },
  {
    id: 'first-input-delay',
    label: 'First input delay',
    value: 18,
    unit: 'ms',
    decimals: 0,
    description: 'Median delay between the first interaction and the page responding to it.'
  },
  {
    id: 'sessions',
    label: 'Sessions',
    value: 412,
    unit: 'K',
    decimals: 0,
    description: 'Real-user sessions measured in the period.'
  }
]

export const sampleTrends: RealUserTrend[] = [
  { id: 'page-load-time', label: 'Page load time', unit: 's', range: [0.9, 2.4] },
  {
    id: 'largest-contentful-paint',
    label: 'Largest contentful paint',
    unit: 's',
    range: [1.2, 3.1]
  },
  { id: 'first-input-delay', label: 'First input delay', unit: 'ms', range: [8, 46] },
  { id: 'sessions', label: 'Sessions', unit: 'K', range: [8, 32] }
]

const hashSeed = (seed: string): number =>
  [...seed].reduce(
    (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 0x01000193) >>> 0,
    0x811c9dc5
  )

const nextState = (state: number): number => {
  let next = state ^ (state << 13)
  next ^= next >>> 17
  next ^= next << 5
  return next >>> 0
}

export const sampleFractions = (seed: string, count: number): number[] => {
  let state = hashSeed(seed)
  return Array.from({ length: count }, () => {
    state = nextState(state)
    return (state % 1000) / 1000
  })
}
