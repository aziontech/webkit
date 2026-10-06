export const METRIC_PERIODS = [
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
]

export const DEFAULT_PERIOD = '24h'

export const periodLabel = (value) =>
  METRIC_PERIODS.find((period) => period.value === value)?.label ?? 'Last 24 hours'

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

export const metricsFor = (period) => ({
  strip: [
    { label: 'Requests', value: '48.2', unit: 'M', hint: 'Requests handled at the edge.' },
    { label: 'Data Transferred', value: '6.4', unit: 'TB', hint: 'Bytes delivered to clients.' },
    {
      label: 'Bandwidth Saved',
      value: '71',
      unit: '%',
      hint: 'Served from cache, not your origin.'
    },
    { label: 'Status 5xx', value: '0.03', unit: '%', hint: 'Share of responses that failed.' }
  ],
  panels: [
    panel('Requests per second', 'req/s', period, [1200, 4800]),
    panel('Data transferred', 'MB/s', period, [40, 210]),
    panel('Cache hit ratio', '%', period, [78, 97]),
    panel('Status codes 5xx', '%', period, [0, 0.4])
  ]
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
