import { withinRange } from '@shared/lib/dates'

import { DATE_CUSTOM } from '../behavior/filter-bar'
import { FIT_COLUMN, TAG_COLUMN } from '../behavior/table-columns'

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000)

const DAY_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' })
const CLOCK_FORMAT = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})

const isDate = (value) => value instanceof Date && !Number.isNaN(value.getTime())

const AXIS_FORMAT = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})

export const formatEventTime = (date) =>
  isDate(date) ? `${DAY_FORMAT.format(date)}, ${CLOCK_FORMAT.format(date)}` : ''

export const formatEventClock = (date) => (isDate(date) ? AXIS_FORMAT.format(date) : '')

const STAMP_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric'
})

export const formatEventStamp = (date) =>
  isDate(date) ? `${STAMP_FORMAT.format(date)} ${AXIS_FORMAT.format(date)}` : ''

export const EVENT_SOURCES = {
  http: 'HTTP Requests',
  waf: 'WAF',
  functions: 'Functions',
  firewall: 'Firewall'
}

export const eventSourceLabel = (id) => EVENT_SOURCES[id] ?? id

export const eventSourceOptions = Object.entries(EVENT_SOURCES).map(([value, label]) => ({
  value,
  label
}))

export const EVENT_LEVELS = {
  Error: 'danger',
  Warning: 'warning',
  Info: 'info',
  Debug: 'secondary'
}

export const eventLevelSeverity = (level) => EVENT_LEVELS[level] ?? 'secondary'

export const LEVEL_ORDER = Object.keys(EVENT_LEVELS)

export const eventLevelOptions = LEVEL_ORDER.map((value) => ({
  value,
  label: value
}))

export const EVENT_PERIODS = [
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: DATE_CUSTOM, label: 'Custom…', custom: true }
]

export const PERIOD_MINUTES = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

export const DEFAULT_PERIOD = '24h'

export const FULL_WINDOW_MINUTES = PERIOD_MINUTES['24h']

export const periodRange = (value, now = new Date()) => {
  if (value && typeof value === 'object') {
    return { start: value.start ?? null, end: value.end ?? now }
  }
  const minutes = PERIOD_MINUTES[value]
  if (!minutes) return { start: new Date(now.getTime() - FULL_WINDOW_MINUTES * 60000), end: now }
  return { start: new Date(now.getTime() - minutes * 60000), end: now }
}

export const matchPeriod = (date, values) => {
  const [period] = values ?? []
  if (!period || period === DATE_CUSTOM || !isDate(date)) return true
  return withinRange(date, periodRange(period))
}

export const formatPeriod = (value) => {
  if (!value || typeof value !== 'object') return ''
  const { start, end } = value
  if (!start) return end ? `Until ${formatEventClock(end)}` : ''
  const sameDay = end && DAY_FORMAT.format(start) === DAY_FORMAT.format(end)
  const from = `${DAY_FORMAT.format(start)}, ${formatEventClock(start)}`
  if (!end) return `Since ${from}`
  return sameDay
    ? `${from} – ${formatEventClock(end)}`
    : `${from} – ${DAY_FORMAT.format(end)}, ${formatEventClock(end)}`
}

export const EVENT_FIELD_CATEGORIES = [
  { id: 'request', label: 'Request' },
  { id: 'response', label: 'Response' },
  { id: 'cache', label: 'Cache' },
  { id: 'performance', label: 'Performance' },
  { id: 'geolocation', label: 'Geolocation' },
  { id: 'client', label: 'Client' },
  { id: 'security', label: 'Security' },
  { id: 'functions', label: 'Functions' },
  { id: 'identifiers', label: 'Identifiers' }
]

export const EVENT_FIELDS = [
  { id: 'time', label: 'Time', core: true, minWidth: FIT_COLUMN, mono: true },
  { id: 'level', label: 'Level', core: true, minWidth: TAG_COLUMN },
  { id: 'sourceLabel', label: 'Source', core: true, minWidth: FIT_COLUMN },
  { id: 'message', label: 'Event', core: true, principal: true, grow: 3 },
  { id: 'host', label: 'Host', category: 'request', grow: 2, mono: true },
  { id: 'requestMethod', label: 'Method', category: 'request', minWidth: FIT_COLUMN, mono: true },
  { id: 'requestUri', label: 'Path', category: 'request', grow: 2, mono: true },
  {
    id: 'status',
    label: 'Status',
    category: 'response',
    align: 'end',
    minWidth: FIT_COLUMN,
    mono: true
  },
  {
    id: 'requestTimeMs',
    label: 'Request Time',
    category: 'performance',
    align: 'end',
    minWidth: FIT_COLUMN,
    format: (v) => `${v} ms`
  },
  {
    id: 'bytesSent',
    label: 'Bytes Sent',
    category: 'response',
    align: 'end',
    minWidth: FIT_COLUMN,
    format: (v) => v.toLocaleString('en-US')
  },
  { id: 'cacheStatus', label: 'Cache Status', category: 'cache', minWidth: FIT_COLUMN, mono: true },
  { id: 'country', label: 'Country', category: 'geolocation', minWidth: FIT_COLUMN },
  {
    id: 'remoteAddress',
    label: 'Remote Address',
    category: 'client',
    minWidth: FIT_COLUMN,
    mono: true
  },
  { id: 'ruleName', label: 'Rule', category: 'security', minWidth: FIT_COLUMN },
  {
    id: 'functionName',
    label: 'Function',
    category: 'functions',
    minWidth: FIT_COLUMN,
    mono: true
  },
  {
    id: 'functionDurationMs',
    label: 'Function Duration',
    category: 'functions',
    align: 'end',
    minWidth: FIT_COLUMN,
    format: (v) => `${v} ms`
  },
  {
    id: 'requestId',
    label: 'Request ID',
    category: 'identifiers',
    minWidth: FIT_COLUMN,
    mono: true
  },
  {
    id: 'workloadId',
    label: 'Workload ID',
    category: 'identifiers',
    minWidth: FIT_COLUMN,
    mono: true
  },
  { id: 'userAgent', label: 'User Agent', category: 'client', grow: 3, mono: true }
]

export const CORE_EVENT_FIELDS = EVENT_FIELDS.filter((field) => field.core)

export const OPTIONAL_EVENT_FIELDS = EVENT_FIELDS.filter((field) => !field.core)

export const DEFAULT_EVENT_COLUMNS = ['host', 'status', 'remoteAddress']

export const eventField = (id) => EVENT_FIELDS.find((field) => field.id === id)

export const formatEventValue = (field, value) => {
  if (value === undefined || value === null || value === '') return '—'
  return field?.format ? field.format(value) : String(value)
}

const HOSTS = [
  'edgeflow.com',
  'api.edgeflow.com',
  'staging.edgeflow.com',
  'legacy.edgeflow.com',
  'azion.design'
]
const ADDRESSES = [
  '45.132.11.9',
  '189.6.44.12',
  '201.17.88.3',
  '177.92.10.55',
  '91.220.4.18',
  '200.147.3.21',
  '138.99.7.42'
]
const COUNTRIES = ['Brazil', 'United States', 'Portugal', 'Germany', 'Chile']
const AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'curl/8.12.1',
  'Azion-Health-Check/1.0'
]
const CACHE_STATUSES = ['HIT', 'MISS', 'BYPASS', 'EXPIRED']
const WORKLOADS = ['wl-3f9a21', 'wl-77c40b', 'wl-91de55']

const TEMPLATES = [
  {
    source: 'waf',
    level: 'Error',
    message: 'Blocked SQL injection attempt on /api/session',
    requestMethod: 'POST',
    requestUri: '/api/session',
    status: 403,
    ruleName: 'SQL Injection · rule 942100'
  },
  {
    source: 'http',
    level: 'Warning',
    message: 'Origin responded 502 after 3 retries',
    requestMethod: 'GET',
    requestUri: '/checkout/cart',
    status: 502
  },
  {
    source: 'functions',
    level: 'Info',
    message: 'auth-handler completed in 12ms',
    functionName: 'auth-handler',
    functionDurationMs: 12
  },
  {
    source: 'firewall',
    level: 'Warning',
    message: 'Rate limit reached for a single address',
    requestMethod: 'GET',
    requestUri: '/api/search',
    status: 429,
    ruleName: 'Rate Limit · 100 rpm'
  },
  {
    source: 'waf',
    level: 'Error',
    message: 'Blocked cross-site scripting attempt on /search',
    requestMethod: 'GET',
    requestUri: '/search',
    status: 403,
    ruleName: 'XSS · rule 941110'
  },
  {
    source: 'functions',
    level: 'Debug',
    message: 'geo-router resolved region sa-east-1',
    functionName: 'geo-router',
    functionDurationMs: 4
  },
  {
    source: 'http',
    level: 'Info',
    message: 'Delivered from cache',
    requestMethod: 'GET',
    requestUri: '/assets/app.js',
    status: 200
  },
  {
    source: 'firewall',
    level: 'Error',
    message: 'Network list “Known scrapers” denied the request',
    requestMethod: 'GET',
    requestUri: '/products',
    status: 403,
    ruleName: 'Network list · Known scrapers'
  },
  {
    source: 'http',
    level: 'Warning',
    message: 'TLS handshake failed before the request completed',
    requestMethod: 'GET',
    requestUri: '/',
    status: 495
  },
  {
    source: 'functions',
    level: 'Error',
    message: 'image-optimizer exceeded its memory limit',
    functionName: 'image-optimizer',
    functionDurationMs: 1840
  },
  {
    source: 'http',
    level: 'Info',
    message: 'Purge completed for 42 URLs',
    requestMethod: 'POST',
    requestUri: '/purge/url',
    status: 201
  },
  {
    source: 'waf',
    level: 'Warning',
    message: 'Request scored 12 in learning mode',
    requestMethod: 'POST',
    requestUri: '/api/comments',
    status: 200,
    ruleName: 'Learning mode · score 12'
  },
  {
    source: 'http',
    level: 'Error',
    message: 'Origin timed out after 30s',
    requestMethod: 'GET',
    requestUri: '/reports/monthly.pdf',
    status: 504
  },
  {
    source: 'functions',
    level: 'Info',
    message: 'ab-splitter assigned variant B',
    functionName: 'ab-splitter',
    functionDurationMs: 7
  }
]

const sequence = (seed) => {
  let state = seed
  return (length) => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state % length
  }
}

const EVENT_COUNT = 1500
const SEED_WINDOW_MINUTES = 1436

const ageFraction = (u) => (4 - Math.sqrt(16 - 15 * u)) / 3

const CALM_TEMPLATES = TEMPLATES.filter((template) => template.level !== 'Error')
const ERROR_TEMPLATES = TEMPLATES.filter((template) => template.level === 'Error')
const ROTATION = [...CALM_TEMPLATES, ...CALM_TEMPLATES, ...ERROR_TEMPLATES]

export const REAL_TIME_EVENTS = (() => {
  const pick = sequence(20260814)
  return Array.from({ length: EVENT_COUNT }, (_, index) => {
    const template = ROTATION[index % ROTATION.length]
    const progress = (index + pick(100) / 100) / EVENT_COUNT
    const at = minutesAgo(0.2 + SEED_WINDOW_MINUTES * ageFraction(progress))
    const requestScoped = template.source !== 'functions'
    return {
      id: `ev-${String(index + 1).padStart(3, '0')}`,
      at,
      time: formatEventTime(at),
      source: template.source,
      sourceLabel: eventSourceLabel(template.source),
      level: template.level,
      message: template.message,
      host: requestScoped ? HOSTS[pick(HOSTS.length)] : undefined,
      requestMethod: template.requestMethod,
      requestUri: template.requestUri,
      status: template.status,
      requestTimeMs: requestScoped ? 40 + pick(960) : undefined,
      bytesSent: requestScoped ? 512 + pick(180_000) : undefined,
      cacheStatus: requestScoped ? CACHE_STATUSES[pick(CACHE_STATUSES.length)] : undefined,
      country: COUNTRIES[pick(COUNTRIES.length)],
      remoteAddress: ADDRESSES[pick(ADDRESSES.length)],
      ruleName: template.ruleName,
      functionName: template.functionName,
      functionDurationMs: template.functionDurationMs,
      requestId: `${(pick(0xffffff) + 0x100000).toString(16)}-${(pick(0xffff) + 0x1000).toString(16)}`,
      workloadId: WORKLOADS[pick(WORKLOADS.length)],
      userAgent: requestScoped ? AGENTS[pick(AGENTS.length)] : undefined
    }
  })
})()

export const searchEvents = (events, term) => {
  const needle = term.trim().toLowerCase()
  if (!needle) return events
  return events.filter((event) =>
    EVENT_FIELDS.some((field) => {
      const value = event[field.id]
      return value !== undefined && String(value).toLowerCase().includes(needle)
    })
  )
}

export const fieldValueCounts = (events, id) => {
  const counts = new Map()
  for (const event of events) {
    const value = event[id]
    if (value === undefined || value === null || value === '') continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

export const countFieldValues = (events, id) => {
  const values = new Set()
  for (const event of events) {
    const value = event[id]
    if (value !== undefined && value !== null && value !== '') values.add(value)
  }
  return values.size
}

const bucketCountFor = (windowMinutes) => {
  if (windowMinutes <= 15) return 12
  if (windowMinutes <= 60) return 20
  return 32
}

export const eventBuckets = (events, window, count) => {
  const end = (window?.end ?? new Date()).getTime()
  const start = (window?.start ?? new Date(end - FULL_WINDOW_MINUTES * 60000)).getTime()
  const span = Math.max(1, end - start)
  const bars = count ?? bucketCountFor(span / 60000)
  const width = span / bars
  const buckets = Array.from({ length: bars }, (_, index) => ({
    at: new Date(start + index * width),
    end: new Date(start + (index + 1) * width),
    total: 0,
    levels: Object.fromEntries(LEVEL_ORDER.map((level) => [level, 0]))
  }))
  for (const event of events) {
    if (!isDate(event.at)) continue
    const offset = event.at.getTime() - start
    if (offset < 0 || offset > span) continue
    const bucket = buckets[Math.min(bars - 1, Math.floor(offset / width))]
    bucket.total += 1
    if (bucket.levels[event.level] !== undefined) bucket.levels[event.level] += 1
  }
  return buckets
}

export const eventSummary = (events) => {
  const errors = events.filter((event) => event.level === 'Error').length
  const timed = events.filter((event) => typeof event.requestTimeMs === 'number')
  return {
    total: events.length,
    errors,
    errorShare: events.length ? errors / events.length : 0,
    avgRequestTimeMs: timed.length
      ? Math.round(timed.reduce((sum, event) => sum + event.requestTimeMs, 0) / timed.length)
      : null
  }
}
