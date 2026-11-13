export const FUNNEL_DEFAULT_SEGMENT = 'all'

export const FUNNEL_SEGMENTS = [
  { value: 'all', label: 'All users' },
  { value: 'self-serve', label: 'Self-serve' },
  { value: 'sales-assisted', label: 'Sales-assisted' },
  { value: 'partners', label: 'Partner referrals' }
]

const SEGMENTS_WITH_DATA = ['all', 'self-serve', 'sales-assisted']

const PERIOD_FACTOR = { '1h': 1 / 720, '24h': 1 / 30, '7d': 7 / 30, '30d': 1 }

const FIGURES = [
  {
    id: 'visitors',
    label: 'Visitors',
    description: 'Unique people who reached your applications through their domains in the period.',
    value: 48_200,
    format: 'number',
    delta: 8.2,
    trend: [7_600, 7_900, 8_100, 7_800, 8_300, 8_500]
  },
  {
    id: 'sign-ups',
    label: 'Sign-ups',
    description: 'Visitors who created an account in your application in the period.',
    value: 6_748,
    format: 'number',
    delta: 4.1,
    trend: [1_084, 1_136, 1_052, 1_210, 1_098, 1_168]
  },
  {
    id: 'activated',
    label: 'Activated',
    description: 'New accounts that completed onboarding, as reported by your Data Stream events.',
    value: 3_914,
    format: 'number',
    delta: -2.6,
    trend: [630, 660, 610, 700, 640, 674]
  },
  {
    id: 'paid',
    label: 'Paid',
    description: 'Activated accounts that started a paid plan.',
    value: 1_135,
    format: 'number',
    delta: 5.3,
    trend: [180, 192, 176, 204, 188, 195]
  },
  {
    id: 'conversion',
    label: 'Overall conversion',
    description: 'Paid accounts as a share of visitors, from the first visit to the first payment.',
    value: 2.35,
    format: 'share',
    delta: -2.7,
    trend: [2.37, 2.43, 2.17, 2.62, 2.27, 2.29],
    rate: true
  }
]

export const FUNNEL_STAGES = ['Visited', 'Signed up', 'Activated', 'Paid']

const FUNNEL = [{ id: 'users', name: 'Users', values: [48_200, 6_748, 3_914, 1_135] }]

const STEPS = [
  { id: 'visited', step: 'Visited', users: 48_200, share: 100, dropoff: null, from: '' },
  { id: 'signed-up', step: 'Signed up', users: 6_748, share: 14, dropoff: 86, from: 'Visited' },
  {
    id: 'activated',
    step: 'Activated',
    users: 3_914,
    share: 8.12,
    dropoff: 42,
    from: 'Signed up'
  },
  { id: 'paid', step: 'Paid', users: 1_135, share: 2.35, dropoff: 71, from: 'Activated' }
]

export const FUNNEL_STEP_COLUMNS = [
  { id: 'step', accessorKey: 'step', header: 'Step', align: 'start', principal: true },
  { id: 'users', accessorKey: 'users', header: 'Users', align: 'end' },
  { id: 'share', accessorKey: 'share', header: 'Of visitors', align: 'end', minWidth: 112 },
  { id: 'dropoff', accessorKey: 'dropoff', header: 'Drop-off', align: 'end', minWidth: 208 }
]

export const FUNNEL_WEEKS = [1, 2, 3, 4, 5, 6].map((week) => ({
  key: `week${week}`,
  label: `Week ${week}`,
  slot: `cell-week${week}`
}))

export const FUNNEL_WEEK_LABELS = FUNNEL_WEEKS.map((week) => week.label)

const COHORTS = [
  ['Sep 28', 1_084, [58, 41, 34, 30, 27, 25]],
  ['Oct 5', 1_136, [61, 45, 38, 33, 30, null]],
  ['Oct 12', 1_052, [55, 39, 32, 28, null, null]],
  ['Oct 19', 1_210, [66, 52, 45, null, null, null]],
  ['Oct 26', 1_098, [70, 57, null, null, null, null]],
  ['Nov 2', 1_168, [72, null, null, null, null, null]]
].map(([cohort, size, retention]) => ({
  id: cohort.toLowerCase().replace(' ', '-'),
  cohort,
  size,
  ...Object.fromEntries(FUNNEL_WEEKS.map((week, index) => [week.key, retention[index]]))
}))

const RETENTION = COHORTS.map((row) => ({
  id: row.id,
  name: `${row.cohort} cohort`,
  values: FUNNEL_WEEKS.map((week) => row[week.key])
}))

export const FUNNEL_COHORT_COLUMNS = [
  { id: 'cohort', accessorKey: 'cohort', header: 'Cohort', align: 'start', principal: true },
  { id: 'size', accessorKey: 'size', header: 'Users', align: 'end' },
  ...FUNNEL_WEEKS.map((week) => ({
    id: week.key,
    accessorKey: week.key,
    header: week.label,
    align: 'end'
  }))
]

const grouped = new Intl.NumberFormat('en-US')
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export const FUNNEL_FORMATTERS = {
  number: (value) => grouped.format(value),
  compact: (value) => compact.format(value),
  percent: (value) => (value === null ? '—' : `${value.toFixed(0)}%`),
  share: (value) => `${value.toFixed(1)}%`,
  drop: (value) => `−${value.toFixed(1)}%`
}

const scale = (value, factor) => Math.max(1, Math.round(value * factor))

const blank = (figure) => ({ ...figure, value: null, delta: null, trend: [] })

export const segmentHasData = (segment) => SEGMENTS_WITH_DATA.includes(segment)

export const resolveFunnel = (period, segment, { empty = false } = {}) => {
  if (empty || !segmentHasData(segment)) {
    return { figures: FIGURES.map(blank), funnel: [], steps: [], retention: [], cohorts: [] }
  }
  const factor = PERIOD_FACTOR[period] ?? 1
  return {
    figures: FIGURES.map((figure) =>
      figure.rate
        ? figure
        : {
            ...figure,
            value: scale(figure.value, factor),
            trend: figure.trend.map((value) => scale(value, factor))
          }
    ),
    funnel: FUNNEL.map((entry) => ({
      ...entry,
      values: entry.values.map((value) => scale(value, factor))
    })),
    steps: STEPS.map((row) => ({ ...row, users: scale(row.users, factor) })),
    retention: RETENTION,
    cohorts: COHORTS
  }
}
