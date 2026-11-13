import { RTM_GROUPS } from './real-time-metrics'

export const METRIC_PERIODS = [
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
]

export const DEFAULT_PERIOD = '24h'

export const periodLabel = (value) =>
  METRIC_PERIODS.find((period) => period.value === value)?.label ?? 'Last 24 hours'

export const METRIC_DASHBOARD_GROUPS = RTM_GROUPS.map((group) => ({
  label: group.label,
  dashboards: group.pages.map(({ id, label, description }) => ({ id, label, description }))
}))

export const METRIC_DASHBOARDS = METRIC_DASHBOARD_GROUPS.flatMap((group) => group.dashboards)

const seriesFor = (seed, points, min, max) => {
  let h = 0x811c9dc5
  for (const char of seed) {
    h ^= char.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return Array.from({ length: points }, () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return min + ((h % 1000) / 1000) * (max - min)
  })
}

export const panel = (title, unit, period, [min, max]) => ({
  title,
  unit,
  series: seriesFor(`${title}:${period}`, 24, min, max)
})

export const pulseFor = (period) => ({
  strip: [
    {
      label: 'Page Load Time',
      value: '1.24',
      unit: 's',
      hint: 'Median, as measured in the browser.'
    },
    {
      label: 'Largest Contentful Paint',
      value: '1.86',
      unit: 's',
      hint: 'Median LCP across sessions.'
    },
    {
      label: 'First Input Delay',
      value: '18',
      unit: 'ms',
      hint: 'Median delay before the page responds.'
    },
    { label: 'Sessions', value: '412', unit: 'K', hint: 'Real user sessions measured.' }
  ],
  panels: [
    panel('Page load time', 's', period, [0.9, 2.4]),
    panel('Largest contentful paint', 's', period, [1.2, 3.1]),
    panel('First input delay', 'ms', period, [8, 46]),
    panel('Sessions', 'k', period, [8, 32])
  ]
})
