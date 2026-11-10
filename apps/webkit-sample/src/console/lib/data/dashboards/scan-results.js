export const VERDICTS = {
  clean: { label: 'Clean', severity: 'success', color: 'success' },
  suspicious: { label: 'Suspicious', severity: 'warning', color: 'warning' },
  flagged: { label: 'Flagged', severity: 'danger', color: 'danger' },
  pending: { label: 'Pending', severity: 'secondary', color: 'other' }
}

export const SOURCES = {
  inline: 'Inline scan',
  api: 'Azion API',
  upload: 'Console upload',
  scheduled: 'Object Storage scan'
}

export const verdictOf = (verdict) => VERDICTS[verdict] ?? VERDICTS.pending

export const sourceOf = (source) => SOURCES[source] ?? source

const SUBMISSIONS = [
  [
    'quarterly-report.pdf',
    'clean',
    'Document',
    4,
    'PDF',
    2_480_000,
    'inline',
    'ana.ribeiro',
    '2026-11-10 13:42'
  ],
  [
    'installer-setup.exe',
    'flagged',
    'Trojan',
    96,
    'Executable',
    18_300_000,
    'inline',
    'mark.chen',
    '2026-11-10 13:18'
  ],
  [
    'invoice-0425.docm',
    'suspicious',
    'Macro',
    71,
    'Office document',
    184_000,
    'upload',
    'lucia.alves',
    '2026-11-10 12:57'
  ],
  [
    'build-artifacts.zip',
    'pending',
    '—',
    null,
    'Archive',
    46_700_000,
    'api',
    'ci-runner',
    '2026-11-10 12:51'
  ],
  [
    'team-photo.png',
    'clean',
    'Image',
    1,
    'Image',
    3_120_000,
    'inline',
    'sam.okafor',
    '2026-11-10 12:33'
  ],
  [
    'update-helper.dll',
    'flagged',
    'Ransomware',
    99,
    'Library',
    912_000,
    'api',
    'ci-runner',
    '2026-11-10 11:46'
  ],
  [
    'pricing-model.xlsx',
    'clean',
    'Spreadsheet',
    6,
    'Office document',
    640_000,
    'upload',
    'priya.nair',
    '2026-11-10 11:20'
  ],
  [
    'run-me.sh',
    'suspicious',
    'Script',
    63,
    'Script',
    4_200,
    'inline',
    'david.kim',
    '2026-11-10 10:58'
  ],
  [
    'meeting-notes.txt',
    'clean',
    'Text',
    0,
    'Text',
    12_800,
    'scheduled',
    'scheduler',
    '2026-11-10 10:12'
  ],
  [
    'browser-extension.crx',
    'suspicious',
    'Adware',
    58,
    'Extension',
    1_740_000,
    'inline',
    'mark.chen',
    '2026-11-10 09:47'
  ],
  [
    'backup-2026-11.tar.gz',
    'pending',
    '—',
    null,
    'Archive',
    128_000_000,
    'scheduled',
    'scheduler',
    '2026-11-10 09:30'
  ],
  [
    'driver-package.msi',
    'clean',
    'Installer',
    9,
    'Installer',
    22_600_000,
    'api',
    'ci-runner',
    '2026-11-10 08:54'
  ]
].map(([name, verdict, category, score, type, size, source, submitter, lastSeen], index) => ({
  id: `submission-${String(index + 1).padStart(2, '0')}`,
  name,
  verdict,
  category,
  score,
  type,
  size,
  source,
  submitter,
  lastSeen
}))

const BASE_PERIOD = '7d'

const SUBMITTED = { '1h': 54, '24h': 1_284, '7d': 18_420, '30d': 78_940 }

const VERDICT_COUNTS = { clean: 16_930, suspicious: 1_241, flagged: 212, pending: 37 }

const SOURCE_WEIGHTS = { inline: 11_640, api: 4_380, upload: 1_620, scheduled: 780 }

const CURRENT = { analyzing: 37, held: 9, heldLast24h: 46, alertsOpen: 3, alertsTotal: 14 }

const sum = (values) => values.reduce((total, value) => total + value, 0)

const split = (total, weights) => {
  const whole = sum(weights)
  const parts = weights.map((weight) => Math.floor((total * weight) / whole))
  parts[0] += total - sum(parts)
  return parts
}

const verdictsFor = (period) => {
  const target = SUBMITTED[period] ?? SUBMITTED[BASE_PERIOD]
  const decided = Object.entries(VERDICT_COUNTS).filter(([id]) => id !== 'pending')
  const parts = split(
    Math.max(0, target - VERDICT_COUNTS.pending),
    decided.map(([, value]) => value)
  )
  return {
    ...Object.fromEntries(decided.map(([id], index) => [id, parts[index]])),
    pending: VERDICT_COUNTS.pending
  }
}

const summaryFor = (period) => {
  const verdicts = verdictsFor(period)
  const submitted = sum(Object.values(verdicts))
  const sourceIds = Object.keys(SOURCE_WEIGHTS)
  const sourceParts = split(submitted, Object.values(SOURCE_WEIGHTS))
  return {
    ...CURRENT,
    submitted,
    last24h: sum(Object.values(verdictsFor('24h'))),
    flagged: verdicts.flagged,
    verdicts,
    sources: Object.fromEntries(sourceIds.map((id, index) => [id, sourceParts[index]]))
  }
}

const FIGURES = [
  {
    id: 'submitted',
    label: 'Submitted',
    description: 'Items sent for analysis in the period.',
    key: 'submitted'
  },
  {
    id: 'analyzing',
    label: 'In analysis',
    description: 'Items waiting for a verdict right now.',
    key: 'analyzing'
  },
  {
    id: 'last-24h',
    label: 'Last 24 hours',
    description: 'Items submitted in the last 24 hours.',
    key: 'last24h'
  },
  {
    id: 'flagged',
    label: 'Flagged',
    description: 'Items whose verdict marks them as harmful.',
    key: 'flagged'
  },
  {
    id: 'held',
    label: 'Held for a verdict',
    description: 'Deliveries paused until their analysis finishes.',
    key: 'held'
  },
  {
    id: 'alerts',
    label: 'Open alerts',
    description: 'Items delivered before they were flagged that nobody has reviewed yet.',
    key: 'alertsOpen'
  }
]

const EMPTY_SUMMARY = {
  submitted: 0,
  analyzing: 0,
  last24h: 0,
  flagged: 0,
  held: 0,
  heldLast24h: 0,
  alertsOpen: 0,
  alertsTotal: 0,
  verdicts: {},
  sources: {}
}

export const scanResults = (period, { empty = false } = {}) => {
  const summary = empty ? EMPTY_SUMMARY : summaryFor(period)
  return {
    summary: {
      held: summary.held,
      heldLast24h: summary.heldLast24h,
      alertsOpen: summary.alertsOpen,
      alertsTotal: summary.alertsTotal
    },
    figures: FIGURES.map(({ key, ...figure }) => ({ ...figure, value: summary[key] })),
    verdictSplit: Object.entries(summary.verdicts).map(([id, value]) => ({
      id,
      name: VERDICTS[id].label,
      color: VERDICTS[id].color,
      values: [value]
    })),
    sourceItems: Object.entries(summary.sources).map(([id, value]) => ({
      id,
      name: SOURCES[id],
      value
    })),
    submissions: empty ? [] : SUBMISSIONS
  }
}

export const SUBMISSION_COLUMNS = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    align: 'start',
    enableSorting: true,
    principal: true,
    grow: 2
  },
  {
    id: 'verdict',
    accessorKey: 'verdict',
    header: 'Verdict',
    align: 'start',
    enableSorting: true,
    minWidth: 112
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    align: 'start',
    enableSorting: true,
    minWidth: 112
  },
  {
    id: 'score',
    accessorKey: 'score',
    header: 'Score',
    align: 'end',
    enableSorting: true,
    minWidth: 80
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    align: 'start',
    enableSorting: true,
    minWidth: 128
  },
  {
    id: 'size',
    accessorKey: 'size',
    header: 'Size',
    align: 'end',
    enableSorting: true,
    minWidth: 88
  },
  {
    id: 'source',
    accessorKey: 'source',
    header: 'Source',
    align: 'start',
    enableSorting: true,
    minWidth: 128
  },
  {
    id: 'submitter',
    accessorKey: 'submitter',
    header: 'First submitter',
    align: 'start',
    enableSorting: true,
    minWidth: 128
  },
  {
    id: 'lastSeen',
    accessorKey: 'lastSeen',
    header: 'Last seen',
    align: 'start',
    enableSorting: true,
    minWidth: 136
  }
]

export const ALL = 'all'

export const STATUS_OPTIONS = [
  { value: ALL, label: 'Any status' },
  { value: 'analyzing', label: 'In analysis' },
  { value: 'completed', label: 'Completed' }
]

export const VERDICT_OPTIONS = [
  { value: ALL, label: 'Any verdict' },
  ...Object.entries(VERDICTS)
    .filter(([value]) => value !== 'pending')
    .map(([value, { label }]) => ({ value, label }))
]

export const SOURCE_OPTIONS = [
  { value: ALL, label: 'Any source' },
  ...Object.entries(SOURCES).map(([value, label]) => ({ value, label }))
]

export const optionLabel = (options) => (value) =>
  options.find((option) => option.value === value)?.label ?? String(value)

export const matchSubmissions = (submissions, { status, verdict, source }) =>
  submissions.filter(
    (row) =>
      (status === ALL || (status === 'analyzing') === (row.verdict === 'pending')) &&
      (verdict === ALL || row.verdict === verdict) &&
      (source === ALL || row.source === source)
  )

const count = new Intl.NumberFormat('en-US')

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const UNITS = ['B', 'KB', 'MB', 'GB']

export const formatters = {
  count: (value) => count.format(value),
  compact: (value) => compact.format(value),
  score: (value) => (value === null || value === undefined ? '—' : String(value)),
  size: (value) => {
    let size = Number(value)
    let unit = 0
    while (size >= 1000 && unit < UNITS.length - 1) {
      size /= 1000
      unit += 1
    }
    return `${size.toFixed(unit ? 1 : 0)} ${UNITS[unit]}`
  }
}
