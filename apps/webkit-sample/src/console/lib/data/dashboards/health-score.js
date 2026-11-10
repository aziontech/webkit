import { RTM_DEFAULT_PERIOD, rtmPeriodLabel } from '../real-time-metrics'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const TIMELINE = {
  '1h': { points: 12, step: 5 * MINUTE, title: 'Score every 5 minutes', block: '5 minutes' },
  '24h': { points: 24, step: HOUR, title: 'Hourly score', block: 'hour' },
  '7d': { points: 28, step: 6 * HOUR, title: 'Score every 6 hours', block: '6 hours' },
  '30d': { points: 30, step: DAY, title: 'Daily score', block: 'day' }
}

const LOCATION_OFFSET = { '1h': -2, '24h': 0, '7d': 1, '30d': 2 }

const OVERALL_BY_HOUR = [
  84, 85, 86, 86, 85, 84, 82, 79, 74, 71, 73, 76, 78, 77, 75, 72, 70, 74, 78, 81, 83, 84, 85, 84
]

export const HEALTH_BANDS = {
  good: { label: 'Good', severity: 'success' },
  fair: { label: 'Fair', severity: 'warning' },
  poor: { label: 'Poor', severity: 'danger' }
}

export const bandOf = (score) => {
  if (score >= 80) return HEALTH_BANDS.good
  if (score >= 50) return HEALTH_BANDS.fair
  return HEALTH_BANDS.poor
}

const APPLICATIONS = [
  {
    id: 'ecommerce-storefront',
    name: 'ecommerce-storefront',
    cause: 'origin timeouts',
    base: 52,
    dip: 18
  },
  { id: 'legacy-api', name: 'legacy-api', cause: 'slow origin response', base: 66, dip: 14 },
  { id: 'analytics-pro', name: 'analytics-pro', cause: 'slow DNS lookups', base: 74, dip: 10 },
  { id: 'marketing-site', name: 'marketing-site', cause: 'cache misses', base: 83, dip: 8 },
  { id: 'docs-portal', name: 'docs-portal', cause: 'cache misses', base: 88, dip: 6 },
  { id: 'status-page', name: 'status-page', cause: 'high latency', base: 91, dip: 4 }
]

const LOCATIONS = [
  { id: 'lima', name: 'Lima, PE', cause: 'high latency', score: 58 },
  { id: 'santiago', name: 'Santiago, CL', cause: 'cache misses', score: 71 },
  { id: 'porto-alegre', name: 'Porto Alegre, BR', cause: 'origin timeouts', score: 76 },
  { id: 'miami', name: 'Miami, US', cause: 'slow DNS lookups', score: 84 },
  { id: 'sao-paulo', name: 'São Paulo, BR', cause: 'slow origin response', score: 89 }
]

const INCIDENTS = [
  {
    id: 'incident-03',
    name: 'ecommerce-storefront',
    scope: 'Application',
    icon: 'pi pi-th-large',
    clients: 34,
    share: 12,
    cause: 'Origin timeouts',
    opened: '2026-11-10T09:40:00Z',
    openedLabel: '09:40',
    band: HEALTH_BANDS.poor
  },
  {
    id: 'incident-02',
    name: 'Lima, PE',
    scope: 'Location',
    icon: 'pi pi-map-marker',
    clients: 9,
    share: 31,
    cause: 'High latency',
    opened: '2026-11-10T07:15:00Z',
    openedLabel: '07:15',
    band: HEALTH_BANDS.fair
  },
  {
    id: 'incident-01',
    name: 'legacy-api',
    scope: 'Application',
    icon: 'pi pi-th-large',
    clients: 18,
    share: 7,
    cause: 'Slow origin response',
    opened: '2026-11-10T06:02:00Z',
    openedLabel: '06:02',
    band: HEALTH_BANDS.fair
  }
]

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)))

const average = (values) =>
  values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0

const busy = (hour) => hour >= 8 && hour <= 17

const timelineOf = (period) => TIMELINE[period] ?? TIMELINE[RTM_DEFAULT_PERIOD]

const timeline = (period) => {
  const { points, step } = timelineOf(period)
  const end = Math.floor(Date.now() / step) * step
  return Array.from({ length: points }, (_, index) => new Date(end - (points - 1 - index) * step))
}

const hoursOf = (date, step) =>
  step >= DAY
    ? Array.from({ length: 24 }, (_, hour) => ({ hour, time: date.getTime() / HOUR + hour }))
    : [{ hour: date.getHours(), time: date.getTime() / HOUR }]

const drift = (time, step) => {
  if (step === HOUR) return 0
  return step < HOUR ? Math.sin(time * 6) * 2.5 : Math.sin(time * 0.9) * 1.5
}

const overallAt = (date, step) =>
  average(
    hoursOf(date, step).map(({ hour, time }) => clamp(OVERALL_BY_HOUR[hour] + drift(time, step)))
  )

const applicationAt = (application, date, step) =>
  average(
    hoursOf(date, step).map(({ hour, time }) =>
      clamp(
        application.base +
          (busy(hour) ? -application.dip : 6) +
          Math.round(Math.sin(time * 1.7 + application.base) * 4)
      )
    )
  )

const shortTime = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
})
const dayTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
})
const day = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

const blockLabel = (date, period) => {
  if (period === '30d') return day.format(date)
  if (period === '7d') return dayTime.format(date)
  return shortTime.format(date)
}

export const formatScore = (value) => value.toFixed(0)

export const healthPhrase = (period) => rtmPeriodLabel(period).replace(/^Last/, 'the last')

export const healthTimeline = (period) => {
  const { title, block } = timelineOf(period)
  return { title, block }
}

export const resolveHealthScore = (period, { empty = false } = {}) => {
  const { step } = timelineOf(period)
  const labels = timeline(period)

  if (empty) {
    return {
      labels,
      overall: { score: null, band: null, cause: '', series: [] },
      applications: [],
      locations: [],
      hourly: [],
      incidents: []
    }
  }

  const overallValues = labels.map((date) => overallAt(date, step))
  const overallScore = average(overallValues)

  const profiles = APPLICATIONS.map((application) => ({
    application,
    scores: labels.map((date) => applicationAt(application, date, step))
  }))

  return {
    labels,
    overall: {
      score: overallScore,
      band: bandOf(overallScore),
      cause: APPLICATIONS[0].cause,
      series: [{ id: 'score', name: 'Score', values: overallValues }]
    },
    applications: profiles.map(({ application, scores }) => ({
      id: application.id,
      name: `${application.name} · ${application.cause}`,
      value: average(scores)
    })),
    locations: LOCATIONS.map((location) => ({
      id: location.id,
      name: `${location.name} · ${location.cause}`,
      value: clamp(location.score + (LOCATION_OFFSET[period] ?? 0))
    })),
    hourly: profiles.map(({ application, scores }) => ({
      id: application.id,
      name: application.name,
      band: bandOf(scores[scores.length - 1]),
      blocks: scores.map((score, index) => {
        const band = bandOf(score)
        const label = blockLabel(labels[index], period)
        return {
          id: `${application.id}-${labels[index].getTime()}`,
          severity: band.severity,
          label: `${label} · ${score} · ${band.label}`
        }
      })
    })),
    incidents: INCIDENTS
  }
}
