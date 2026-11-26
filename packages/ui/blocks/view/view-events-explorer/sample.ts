import type { TraceSpan } from '@aziontech/webkit/trace'

import type {
  EventsExplorerEvent,
  EventsExplorerEventLevel,
  EventsExplorerField,
  EventsExplorerFieldCategory
} from './view-events-explorer.vue'

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 14, 30))

export const sampleCategories: EventsExplorerFieldCategory[] = [
  { id: 'request', label: 'Request' },
  { id: 'response', label: 'Response' },
  { id: 'cache', label: 'Cache' },
  { id: 'performance', label: 'Performance' },
  { id: 'geolocation', label: 'Geolocation' },
  { id: 'client', label: 'Client' },
  { id: 'security', label: 'Security' },
  { id: 'services', label: 'Services' },
  { id: 'identifiers', label: 'Identifiers' }
]

export const sampleFields: EventsExplorerField[] = [
  { id: 'time', label: 'Time', core: true, minWidth: 80, mono: true },
  { id: 'level', label: 'Level', core: true, minWidth: 104 },
  { id: 'sourceLabel', label: 'Source', core: true, minWidth: 80 },
  { id: 'message', label: 'Event', core: true, principal: true, grow: 3 },
  { id: 'host', label: 'Host', category: 'request', grow: 2, mono: true },
  { id: 'requestMethod', label: 'Method', category: 'request', minWidth: 80, mono: true },
  { id: 'requestUri', label: 'Path', category: 'request', grow: 2, mono: true },
  { id: 'status', label: 'Status', category: 'response', align: 'end', minWidth: 80, mono: true },
  {
    id: 'requestTimeMs',
    label: 'Request time',
    category: 'performance',
    align: 'end',
    minWidth: 80,
    format: 'milliseconds'
  },
  {
    id: 'bytesSent',
    label: 'Bytes sent',
    category: 'response',
    align: 'end',
    minWidth: 80,
    format: 'number'
  },
  { id: 'cacheStatus', label: 'Cache status', category: 'cache', minWidth: 80, mono: true },
  { id: 'country', label: 'Country', category: 'geolocation', minWidth: 80 },
  { id: 'remoteAddress', label: 'Remote address', category: 'client', minWidth: 80, mono: true },
  { id: 'ruleName', label: 'Rule', category: 'security', minWidth: 80 },
  { id: 'serviceName', label: 'Service', category: 'services', minWidth: 80, mono: true },
  {
    id: 'serviceDurationMs',
    label: 'Service duration',
    category: 'services',
    align: 'end',
    minWidth: 80,
    format: 'milliseconds'
  },
  { id: 'requestId', label: 'Request ID', category: 'identifiers', minWidth: 80, mono: true },
  { id: 'resourceId', label: 'Resource ID', category: 'identifiers', minWidth: 80, mono: true },
  { id: 'userAgent', label: 'User agent', category: 'client', grow: 3, mono: true }
]

interface EventTemplate {
  source: string
  level: EventsExplorerEventLevel
  message: string
  requestMethod?: string
  requestUri?: string
  status?: number
  ruleName?: string
  serviceName?: string
  serviceDurationMs?: number
}

const minutesAgo = (minutes: number) => new Date(sampleNow.getTime() - minutes * 60 * 1000)

const hosts = [
  'example.com',
  'api.example.com',
  'staging.example.com',
  'legacy.example.com',
  'cdn.example.com'
]
const addresses = [
  '203.0.113.9',
  '198.51.100.12',
  '192.0.2.3',
  '198.51.100.55',
  '203.0.113.18',
  '192.0.2.21',
  '203.0.113.42'
]
const countries = ['United States', 'Brazil', 'Portugal', 'Germany', 'Chile']
const agents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'curl/8.12.1',
  'Health-Check/1.0'
]
const cacheStatuses = ['HIT', 'MISS', 'BYPASS', 'EXPIRED']
const resources = ['res-3f9a21', 'res-77c40b', 'res-91de55']

const eventTemplates: EventTemplate[] = [
  {
    source: 'security',
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
    source: 'services',
    level: 'Info',
    message: 'auth-handler completed in 12ms',
    serviceName: 'auth-handler',
    serviceDurationMs: 12
  },
  {
    source: 'access',
    level: 'Warning',
    message: 'Rate limit reached for a single address',
    requestMethod: 'GET',
    requestUri: '/api/search',
    status: 429,
    ruleName: 'Rate Limit · 100 rpm'
  },
  {
    source: 'services',
    level: 'Debug',
    message: 'geo-router resolved region south-america',
    serviceName: 'geo-router',
    serviceDurationMs: 4
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
    source: 'access',
    level: 'Error',
    message: 'IP list “Known scrapers” denied the request',
    requestMethod: 'GET',
    requestUri: '/products',
    status: 403,
    ruleName: 'IP list · Known scrapers'
  },
  {
    source: 'http',
    level: 'Error',
    message: 'Origin timed out after 30s',
    requestMethod: 'GET',
    requestUri: '/reports/monthly.pdf',
    status: 504
  }
]

const shareOf = (total: number) => (fraction: number) => Math.max(1, Math.round(total * fraction))

const leadSpans = (
  method: string,
  uri: string,
  total: number,
  cache: string,
  status: number
): TraceSpan[] => {
  const share = shareOf(total)
  const rules = share(0.04)
  return [
    {
      id: 'request',
      name: `${method} ${uri}`,
      service: 'Application',
      start: 0,
      duration: total,
      status: status >= 500 ? 'error' : undefined,
      attributes: { 'http.method': method, 'http.status_code': status }
    },
    {
      id: 'firewall',
      parentId: 'request',
      name: 'firewall rules',
      service: 'Firewall',
      start: 1,
      duration: rules
    },
    {
      id: 'cache',
      parentId: 'request',
      name: 'cache lookup',
      service: 'Cache',
      start: 1 + rules,
      duration: share(0.03),
      attributes: { 'cache.status': cache }
    }
  ]
}

const originMessage = (status: number) =>
  status === 504
    ? 'The origin did not answer before the timeout.'
    : status >= 500
      ? `The origin answered ${status} on every try.`
      : undefined

const originSpan = (
  after: number,
  originEnd: number,
  firstByte: number,
  total: number,
  status: number
): TraceSpan => {
  const failed = status >= 500
  const share = shareOf(total)
  return {
    id: 'origin',
    parentId: 'request',
    name: 'fetch origin',
    service: 'Network',
    start: after,
    duration: originEnd - after,
    status: failed ? 'error' : undefined,
    message: originMessage(status),
    events: failed
      ? [{ at: after + share(0.01), name: 'connection-open' }]
      : [
          { at: after + share(0.01), name: 'connection-open' },
          { at: firstByte, name: 'first-byte' }
        ]
  }
}

const retrySpans = (after: number, originEnd: number): TraceSpan[] => {
  const step = Math.floor((originEnd - after) / 3)
  return [0, 1, 2].map((attempt) => ({
    id: `attempt-${attempt + 1}`,
    parentId: 'origin',
    name: `try ${attempt + 1}`,
    service: 'Network',
    start: after + attempt * step + 1,
    duration: step - 2,
    status: 'error',
    attributes: { 'http.status_code': 502 }
  }))
}

const storeSpans = (firstByte: number, total: number): TraceSpan[] => [
  {
    id: 'store',
    parentId: 'request',
    name: 'store in cache',
    service: 'Cache',
    start: firstByte,
    duration: shareOf(total)(0.08)
  },
  {
    id: 'deliver',
    parentId: 'request',
    name: 'deliver',
    service: 'Network',
    start: firstByte,
    duration: total - firstByte - 1
  }
]

const requestSpans = (
  method: string,
  uri: string,
  total: number,
  cache: string,
  status: number
): TraceSpan[] => {
  const failed = status >= 500
  const share = shareOf(total)
  const spans = leadSpans(method, uri, total, cache, status)
  const after = 1 + share(0.04) + share(0.03)
  if (cache === 'HIT' && !failed) {
    spans.push({
      id: 'deliver',
      parentId: 'request',
      name: 'deliver',
      service: 'Network',
      start: after,
      duration: total - after - 1
    })
    return spans
  }
  const originEnd = failed ? total - share(0.02) : total - share(0.25)
  const firstByte = failed ? originEnd : after + share(0.3)
  spans.push(originSpan(after, originEnd, firstByte, total, status))
  if (status === 502) spans.push(...retrySpans(after, originEnd))
  if (!failed) spans.push(...storeSpans(firstByte, total))
  return spans
}

const sequence = (seed: number) => {
  let state = seed
  return (length: number) => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state % length
  }
}

const eventCount = 1500
const seedWindowMinutes = 1436

const ageFraction = (u: number) => (4 - Math.sqrt(16 - 15 * u)) / 3

const calmTemplates = eventTemplates.filter((template) => template.level !== 'Error')
const errorTemplates = eventTemplates.filter((template) => template.level === 'Error')
const rotation = [...calmTemplates, ...calmTemplates, ...errorTemplates]

const seedEvents = (): EventsExplorerEvent[] => {
  const pick = sequence(20260814)
  return Array.from({ length: eventCount }, (_, index) => {
    const template = rotation[index % rotation.length]
    const progress = (index + pick(100) / 100) / eventCount
    const at = minutesAgo(0.2 + seedWindowMinutes * ageFraction(progress))
    const requestScoped = template.source !== 'services'
    return {
      id: `ev-${String(index + 1).padStart(3, '0')}`,
      at,
      source: template.source,
      level: template.level,
      message: template.message,
      host: requestScoped ? hosts[pick(hosts.length)] : undefined,
      requestMethod: template.requestMethod,
      requestUri: template.requestUri,
      status: template.status,
      requestTimeMs: requestScoped ? 40 + pick(960) : undefined,
      bytesSent: requestScoped ? 512 + pick(180000) : undefined,
      cacheStatus: requestScoped ? cacheStatuses[pick(cacheStatuses.length)] : undefined,
      country: countries[pick(countries.length)],
      remoteAddress: addresses[pick(addresses.length)],
      ruleName: template.ruleName,
      serviceName: template.serviceName,
      serviceDurationMs: template.serviceDurationMs,
      requestId: `${(pick(0xffffff) + 0x100000).toString(16)}-${(pick(0xffff) + 0x1000).toString(16)}`,
      resourceId: resources[pick(resources.length)],
      userAgent: requestScoped ? agents[pick(agents.length)] : undefined
    }
  }).map((event) =>
    event.source === 'http' && typeof event.requestTimeMs === 'number'
      ? {
          ...event,
          spans: requestSpans(
            String(event.requestMethod),
            String(event.requestUri),
            event.requestTimeMs,
            String(event.cacheStatus),
            Number(event.status)
          )
        }
      : event
  )
}

export const sampleEvents: EventsExplorerEvent[] = seedEvents()
