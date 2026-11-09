const MINUTE = 60_000

export const HEALTH_WINDOWS = [
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '24h', value: '24h' }
]

export const HEALTH_DEFAULT_WINDOW = '24h'

const WINDOW_TIMELINE = {
  '1h': { points: 12, step: 5 * MINUTE },
  '6h': { points: 24, step: 15 * MINUTE },
  '24h': { points: 24, step: 60 * MINUTE }
}

export const HEALTH_STATES = {
  operational: { label: 'Operational', severity: 'success' },
  degraded: { label: 'Degraded', severity: 'warning' },
  down: { label: 'Down', severity: 'danger' }
}

const WORKLOADS = [
  {
    id: 'azion-com-prod',
    name: 'azion-com-prod',
    state: 'operational',
    latency: 142
  },
  {
    id: 'azion-com-br-prod',
    name: 'azion-com-br-prod',
    state: 'degraded',
    latency: 860
  },
  {
    id: 'azion-stage-preview',
    name: 'azion-stage-preview',
    state: 'down',
    latency: 2310
  },
  {
    id: 'campaign-landing',
    name: 'campaign-landing',
    state: 'operational',
    latency: 98
  },
  { id: 'docs-azion', name: 'docs-azion', state: 'operational', latency: 121 },
  { id: 'workload_01', name: 'workload_01', state: 'operational', latency: 176 }
]

const ALERTS = [
  {
    id: 'stage-5xx',
    severity: 'danger',
    level: 'Critical',
    title: 'Status 5xx above 5%',
    workload: 'azion-stage-preview',
    opened: '12 minutes ago'
  },
  {
    id: 'br-latency',
    severity: 'warning',
    level: 'Warning',
    title: 'p95 latency above 800 ms',
    workload: 'azion-com-br-prod',
    opened: '34 minutes ago'
  },
  {
    id: 'br-origin',
    severity: 'warning',
    level: 'Warning',
    title: 'Origin timeouts rising',
    workload: 'azion-com-br-prod',
    opened: '1 hour ago'
  },
  {
    id: 'docs-cache',
    severity: 'info',
    level: 'Info',
    title: 'Cache hit ratio below 80%',
    workload: 'docs-azion',
    opened: '3 hours ago'
  }
]

const hash = (seed) => {
  let h = 0x811c9dc5
  for (const char of seed) {
    h ^= char.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h || 1
}

const random = (seed) => {
  let h = hash(seed)
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return (h % 10_000) / 10_000
  }
}

const wave = (seed, points, base, spread) => {
  const next = random(seed)
  const phase = next() * Math.PI * 2
  return Array.from({ length: points }, (_, index) => {
    const swing = Math.sin(phase + (index / points) * Math.PI * 2)
    const noise = (next() - 0.5) * spread
    return Math.round(Math.max(0, base * (1 + spread * 0.5 * swing + noise)) * 100) / 100
  })
}

const timeline = (window) => {
  const { points, step } = WINDOW_TIMELINE[window] ?? WINDOW_TIMELINE[HEALTH_DEFAULT_WINDOW]
  const end = Math.floor(Date.now() / step) * step
  return Array.from({ length: points }, (_, index) => new Date(end - (points - 1 - index) * step))
}

const deltaOf = (seed) => Math.round((random(`delta:${seed}`)() - 0.45) * 3600) / 100

export const formatLatency = (value) => `${Math.round(value)} ms`

const rateDigits = (value) => {
  if (value === 0 || value >= 10) return 0
  return value >= 1 ? 1 : 2
}

export const formatRate = (value) => `${value.toFixed(rateDigits(value))}%`

export const resolveHealthWorkloads = (period, { empty = false } = {}) =>
  WORKLOADS.map((workload) => ({
    ...workload,
    status: HEALTH_STATES[workload.state],
    latency: empty ? null : workload.latency,
    delta: empty ? null : deltaOf(`${workload.id}:${period}`),
    trend: empty ? [] : wave(`${workload.id}:${period}`, 24, workload.latency, 0.3)
  }))

export const resolveLatency = (window, { empty = false } = {}) => {
  const labels = timeline(window)
  const series = [
    { id: 'p50', name: 'p50', base: 120 },
    { id: 'p95', name: 'p95', base: 410 },
    { id: 'p99', name: 'p99', base: 920 }
  ]
  return {
    labels,
    series: empty
      ? []
      : series.map(({ id, name, base }) => ({
          id,
          name,
          values: wave(`latency:${id}:${window}`, labels.length, base, 0.35)
        }))
  }
}

export const resolveErrorRate = (window, { empty = false } = {}) => {
  const labels = timeline(window)
  const series = [
    { id: '4xx', name: 'Status 4xx', color: 'warning', base: 2.4 },
    { id: '5xx', name: 'Status 5xx', color: 'danger', base: 0.6 }
  ]
  return {
    labels,
    series: empty
      ? []
      : series.map(({ id, name, color, base }) => ({
          id,
          name,
          color,
          values: wave(`errors:${id}:${window}`, labels.length, base, 0.5)
        }))
  }
}

export const resolveAlerts = ({ empty = false } = {}) => (empty ? [] : ALERTS)
