import { formatCount, RTM_DEFAULT_PERIOD } from '../real-time-metrics'

export { formatCount }

const MINUTE = 60_000
const HOUR = 60 * MINUTE

const TIMELINE = {
  '1h': { points: 12, step: 5 * MINUTE },
  '24h': { points: 24, step: HOUR },
  '7d': { points: 28, step: 6 * HOUR },
  '30d': { points: 30, step: 24 * HOUR }
}

const PERIOD_FACTOR = { '1h': 1 / 24, '24h': 1, '7d': 7, '30d': 30 }

const ALLOWED = [
  412, 386, 341, 318, 296, 305, 352, 448, 571, 664, 718, 742, 731, 756, 769, 748, 702, 655, 598,
  541, 503, 476, 451, 430
]

const BLOCKED = [
  38, 35, 31, 29, 33, 30, 36, 47, 62, 71, 84, 79, 76, 91, 88, 82, 74, 69, 61, 55, 49, 46, 42, 40
]

const HELD = [6, 5, 4, 3, 4, 3, 5, 8, 11, 14, 16, 15, 13, 17, 18, 15, 13, 12, 10, 9, 8, 7, 6, 6]

const OUTCOMES = [
  { id: 'allowed', name: 'Allowed', color: 'success', values: ALLOWED },
  { id: 'blocked', name: 'Blocked', color: 'danger', values: BLOCKED },
  { id: 'held', name: 'Held', color: 'warning', values: HELD }
]

const REVIEWED = { approved: 186, denied: 41, overBudget: 73 }

const sum = (values) => values.reduce((total, value) => total + value, 0)

const timelineOf = (period) => TIMELINE[period] ?? TIMELINE[RTM_DEFAULT_PERIOD]

const drift = (index) => 1 + 0.08 * Math.sin(index * 1.7)

const hourAt = (back) => ALLOWED.length - 1 - (((back % 24) + 24) % 24)

const bucketValues = (values, period) => {
  const { points, step } = timelineOf(period)
  const hours = step / HOUR
  return Array.from({ length: points }, (_, index) => {
    const back = (points - 1 - index) * Math.max(1, hours)
    if (hours < 1) return Math.round(values[hourAt(0)] * hours * drift(index))
    const covered = Array.from({ length: hours }, (_, offset) => values[hourAt(back + offset)])
    const total = sum(covered)
    return hours === 1 ? total : Math.round(total * drift(index))
  })
}

export const activityLabels = (period) => {
  const { points, step } = timelineOf(period)
  const end = Math.floor(Date.now() / step) * step
  return Array.from({ length: points }, (_, index) => new Date(end - (points - 1 - index) * step))
}

export const activityOutcomes = (period, { empty = false } = {}) =>
  empty
    ? []
    : OUTCOMES.map((outcome) => ({ ...outcome, values: bucketValues(outcome.values, period) }))

const totalsFor = (period) => {
  const series = activityOutcomes(period)
  const totals = Object.fromEntries(series.map((entry) => [entry.id, sum(entry.values)]))
  const factor = PERIOD_FACTOR[period] ?? 1
  return {
    ...totals,
    requests: totals.allowed + totals.blocked + totals.held,
    approved: Math.round(REVIEWED.approved * factor),
    denied: Math.round(REVIEWED.denied * factor),
    overBudget: Math.round(REVIEWED.overBudget * factor)
  }
}

const FIGURES = [
  {
    id: 'requests',
    key: 'requests',
    label: 'Requests',
    description: 'Every request the rules evaluated in the period.',
    delta: 8.4,
    inverse: false
  },
  {
    id: 'allowed',
    key: 'allowed',
    label: 'Allowed',
    description: 'Requests a rule let through to their destination.',
    delta: 7.9,
    inverse: false
  },
  {
    id: 'blocked',
    key: 'blocked',
    label: 'Blocked',
    description: 'Requests a rule stopped before they reached their destination.',
    delta: 12.6,
    inverse: true
  },
  {
    id: 'held',
    key: 'held',
    label: 'Held',
    description: 'Requests a rule paused until someone approves or denies them.',
    delta: 4.1,
    inverse: true
  },
  {
    id: 'approved',
    key: 'approved',
    label: 'Approved',
    description: 'Held requests a reviewer approved.',
    delta: 3.2,
    inverse: false
  },
  {
    id: 'denied',
    key: 'denied',
    label: 'Denied',
    description: 'Held requests a reviewer denied.',
    delta: -9.5,
    inverse: true
  },
  {
    id: 'over-budget',
    key: 'overBudget',
    label: 'Over budget',
    description: 'Requests that went past the spending or volume budget set for their actor.',
    delta: 21.7,
    inverse: true
  }
]

export const activityFigures = (period, { blank = false } = {}) => {
  const totals = totalsFor(period)
  return FIGURES.map(({ key, ...figure }) => ({
    ...figure,
    value: blank ? null : totals[key],
    delta: blank ? null : figure.delta
  }))
}

const split = (total, weights) => {
  const whole = sum(weights)
  const parts = weights.map((weight) => Math.floor((total * weight) / whole))
  parts[0] += total - sum(parts)
  return parts
}

const breakdown = (total, entries) => {
  const values = split(
    total,
    entries.map(([, weight]) => weight)
  )
  return entries.map(([name], index) => ({ id: name, name, value: values[index] }))
}

const ACTOR_WEIGHTS = [
  ['report-builder', 31],
  ['ticket-triage', 22],
  ['inventory-sync', 17],
  ['invoice-reader', 12],
  ['release-helper', 9],
  ['data-export', 6],
  ['calendar-sync', 3]
]

const CATEGORY_WEIGHTS = [
  ['Read', 54],
  ['Write', 21],
  ['Search', 12],
  ['Export', 6],
  ['Delete', 4],
  ['Admin', 3]
]

const DESTINATION_WEIGHTS = [
  ['api.example.com', 38],
  ['storage.example.com', 19],
  ['crm.example.net', 16],
  ['billing.example.com', 11],
  ['mail.example.org', 9],
  ['docs.example.com', 7]
]

export const activityBreakdowns = (period, { empty = false } = {}) => {
  const { requests } = totalsFor(period)
  return {
    actors: empty ? [] : breakdown(requests, ACTOR_WEIGHTS),
    categories: empty ? [] : breakdown(requests, CATEGORY_WEIGHTS),
    destinations: empty ? [] : breakdown(requests, DESTINATION_WEIGHTS)
  }
}

const option = (label) => ({ value: label, label })

export const ANY_ACTOR = 'Any actor'
export const ANY_OUTCOME = 'Any outcome'
export const ANY_CATEGORY = 'Any category'

export const ACTOR_OPTIONS = [ANY_ACTOR, ...ACTOR_WEIGHTS.map(([name]) => name)].map(option)

export const OUTCOME_OPTIONS = [
  ANY_OUTCOME,
  'Allowed',
  'Blocked',
  'Held',
  'Approved',
  'Denied'
].map(option)

export const CATEGORY_OPTIONS = [ANY_CATEGORY, ...CATEGORY_WEIGHTS.map(([name]) => name)].map(
  option
)

export const ACTIVITY_COLUMNS = [
  ['time', 'Time', 'start'],
  ['actor', 'Actor', 'start'],
  ['outcome', 'Outcome', 'start'],
  ['category', 'Category', 'start'],
  ['severity', 'Severity', 'start'],
  ['destination', 'Destination', 'start'],
  ['method', 'Method', 'start'],
  ['rule', 'Rule', 'start']
].map(([id, header, align], index) => ({
  id,
  accessorKey: id,
  header,
  align,
  enableSorting: id === 'time' || id === 'actor' || id === 'destination',
  principal: index === 0
}))

export const ACTIVITY_ROWS = [
  [
    '14:52:08',
    'report-builder',
    'allowed',
    'Read',
    'info',
    'api.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:51:47',
    'data-export',
    'blocked',
    'Export',
    'critical',
    'storage.example.com',
    'PUT',
    'No bulk export'
  ],
  [
    '14:51:12',
    'ticket-triage',
    'held',
    'Write',
    'medium',
    'crm.example.net',
    'PATCH',
    'Review customer changes'
  ],
  [
    '14:50:39',
    'invoice-reader',
    'allowed',
    'Read',
    'low',
    'billing.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:49:58',
    'release-helper',
    'approved',
    'Admin',
    'high',
    'api.example.com',
    'POST',
    'Approve admin actions'
  ],
  [
    '14:49:21',
    'inventory-sync',
    'blocked',
    'Delete',
    'high',
    'api.example.com',
    'DELETE',
    'No deletes outside hours'
  ],
  [
    '14:48:44',
    'report-builder',
    'allowed',
    'Search',
    'info',
    'docs.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:48:03',
    'ticket-triage',
    'denied',
    'Write',
    'medium',
    'mail.example.org',
    'POST',
    'Review outbound mail'
  ],
  [
    '14:47:26',
    'calendar-sync',
    'allowed',
    'Write',
    'low',
    'api.example.com',
    'PUT',
    'Scheduled writes'
  ],
  [
    '14:46:50',
    'data-export',
    'blocked',
    'Export',
    'critical',
    'storage.example.com',
    'PUT',
    'No bulk export'
  ],
  [
    '14:46:12',
    'invoice-reader',
    'allowed',
    'Read',
    'info',
    'billing.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:45:37',
    'release-helper',
    'held',
    'Admin',
    'high',
    'api.example.com',
    'POST',
    'Approve admin actions'
  ]
].map(([time, actor, outcome, category, severity, destination, method, rule], index) => ({
  id: `request-${String(index + 1).padStart(2, '0')}`,
  time,
  actor,
  outcome,
  category,
  severity,
  destination,
  method,
  rule
}))

const OUTCOME_TAGS = {
  allowed: { label: 'Allowed', severity: 'success' },
  blocked: { label: 'Blocked', severity: 'danger' },
  held: { label: 'Held', severity: 'warning' },
  approved: { label: 'Approved', severity: 'secondary' },
  denied: { label: 'Denied', severity: 'secondary' }
}

const SEVERITY_TAGS = {
  critical: { label: 'Critical', severity: 'danger' },
  high: { label: 'High', severity: 'danger' },
  medium: { label: 'Medium', severity: 'warning' },
  low: { label: 'Low', severity: 'info' },
  info: { label: 'Info', severity: 'secondary' }
}

export const outcomeTag = (outcome) => OUTCOME_TAGS[outcome]

export const severityTag = (level) => SEVERITY_TAGS[level]

export const activityLog = ({ blank = false } = {}) => (blank ? [] : ACTIVITY_ROWS)

export const matchActivity = (rows, { actor, outcome, category, destination }) => {
  const host = destination.trim().toLowerCase()
  return rows.filter(
    (row) =>
      (actor === ANY_ACTOR || row.actor === actor) &&
      (outcome === ANY_OUTCOME || OUTCOME_TAGS[row.outcome].label === outcome) &&
      (category === ANY_CATEGORY || row.category === category) &&
      (!host || row.destination === host)
  )
}
