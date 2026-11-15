<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import Chart, {
    type ChartColor,
    type ChartRange,
    type ChartSeries
  } from '@aziontech/webkit/chart'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import DateRangePicker, {
    type DateRangeUnit,
    type DateRangeValue,
    type RelativeOption
  } from '@aziontech/webkit/date-range-picker'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item-root'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import PropertyFilter, {
    type FilteringProperty,
    type PropertyFilterQuery,
    type PropertyFilterSubmit,
    type PropertyFilterToken
  } from '@aziontech/webkit/property-filter'
  import Resizable from '@aziontech/webkit/resizable'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { matchesQuery } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  type EventSource = 'http' | 'security' | 'services' | 'access'
  type EventLevel = 'Error' | 'Warning' | 'Info' | 'Debug'
  type EventFieldCategory =
    | 'request'
    | 'response'
    | 'cache'
    | 'performance'
    | 'geolocation'
    | 'client'
    | 'security'
    | 'services'
    | 'identifiers'

  type EventRecord = {
    id: string
    at: Date
    time: string
    source: EventSource
    sourceLabel: string
    level: EventLevel
    message: string
    host?: string
    requestMethod?: string
    requestUri?: string
    status?: number
    requestTimeMs?: number
    bytesSent?: number
    cacheStatus?: string
    country: string
    remoteAddress: string
    ruleName?: string
    serviceName?: string
    serviceDurationMs?: number
    requestId: string
    resourceId: string
    userAgent?: string
  }

  type EventFieldId = Exclude<keyof EventRecord, 'id' | 'at' | 'source'>

  type EventTemplate = Pick<EventRecord, 'source' | 'level' | 'message'> &
    Partial<
      Pick<
        EventRecord,
        'requestMethod' | 'requestUri' | 'status' | 'ruleName' | 'serviceName' | 'serviceDurationMs'
      >
    >

  interface EventField {
    id: EventFieldId
    label: string
    core?: boolean
    principal?: boolean
    category?: EventFieldCategory
    grow?: TableColumn['grow']
    minWidth?: number
    align?: TableColumn['align']
    mono?: boolean
    format?: (value: number) => string
  }

  interface TimeWindow {
    start: Date
    end: Date
  }

  interface QueryEntry {
    text: string
    query: PropertyFilterQuery
  }

  interface SavedQuery extends QueryEntry {
    id: string
    name: string
  }

  interface EventBucket {
    at: Date
    end: Date
    total: number
    levels: Record<string, number>
  }

  const referenceNow = Date.UTC(2026, 10, 10, 14, 30)

  const minutesAgo = (minutes: number) => new Date(referenceNow - minutes * 60 * 1000)

  const timeZone = ref('UTC')

  const timeZones = ['UTC', 'America/Sao_Paulo', 'America/New_York', 'Europe/Lisbon', 'Asia/Tokyo']

  const { formatDate, formatNumber } = useLocale()

  const zoneFormats = computed(() => {
    const zone = timeZone.value || undefined
    return {
      day: (value: Date) => formatDate(value, { month: 'short', day: '2-digit', timeZone: zone }),
      clock: (value: Date) =>
        formatDate(value, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: zone
        }),
      axis: (value: Date) =>
        formatDate(value, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: zone
        })
    }
  })

  const isDate = (value: unknown): value is Date =>
    value instanceof Date && !Number.isNaN(value.getTime())

  const formatEventTime = (date: Date) =>
    isDate(date) ? `${zoneFormats.value.day(date)}, ${zoneFormats.value.clock(date)}` : ''

  const formatEventClock = (date: unknown) => (isDate(date) ? zoneFormats.value.axis(date) : '')

  const eventSources: Record<EventSource, string> = {
    http: 'HTTP Requests',
    security: 'Security',
    services: 'Services',
    access: 'Access Control'
  }

  const eventSourceOptions = Object.entries(eventSources).map(([value, label]) => ({
    value,
    label
  }))

  const eventLevels: Record<EventLevel, TagSeverity> = {
    Error: 'danger',
    Warning: 'warning',
    Info: 'info',
    Debug: 'neutral'
  }

  const eventLevelSeverity = (level: EventLevel) => eventLevels[level] ?? 'neutral'

  const levelOrder = Object.keys(eventLevels) as EventLevel[]

  const eventLevelOptions = levelOrder.map((value) => ({ value, label: value }))

  const fullWindowMinutes = 1440

  const formatPeriod = (value: TimeWindow) => {
    if (!value || typeof value !== 'object') return ''
    const { start, end } = value
    if (!start) return end ? `Until ${formatEventClock(end)}` : ''
    const sameDay = end && zoneFormats.value.day(start) === zoneFormats.value.day(end)
    const from = `${zoneFormats.value.day(start)}, ${formatEventClock(start)}`
    if (!end) return `Since ${from}`
    return sameDay
      ? `${from} to ${formatEventClock(end)}`
      : `${from} to ${zoneFormats.value.day(end)}, ${formatEventClock(end)}`
  }

  const eventFieldCategories: { id: EventFieldCategory; label: string }[] = [
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

  const eventFields: EventField[] = [
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
      format: (value) => `${value} ms`
    },
    {
      id: 'bytesSent',
      label: 'Bytes sent',
      category: 'response',
      align: 'end',
      minWidth: 80,
      format: (value) => formatNumber(value)
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
      format: (value) => `${value} ms`
    },
    { id: 'requestId', label: 'Request ID', category: 'identifiers', minWidth: 80, mono: true },
    { id: 'resourceId', label: 'Resource ID', category: 'identifiers', minWidth: 80, mono: true },
    { id: 'userAgent', label: 'User agent', category: 'client', grow: 3, mono: true }
  ]

  const coreFields = eventFields.filter((field) => field.core)

  const optionalFields = eventFields.filter((field) => !field.core)

  const eventField = (id: string) => eventFields.find((field) => field.id === id)

  const formatEventValue = (field: EventField | undefined, value: unknown) => {
    if (value === undefined || value === null || value === '') return '—'
    return field?.format && typeof value === 'number' ? field.format(value) : String(value)
  }

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

  const seedEvents = (): EventRecord[] => {
    const pick = sequence(20260814)
    return Array.from({ length: eventCount }, (_, index) => {
      const template = rotation[index % rotation.length]
      const progress = (index + pick(100) / 100) / eventCount
      const at = minutesAgo(0.2 + seedWindowMinutes * ageFraction(progress))
      const requestScoped = template.source !== 'services'
      return {
        id: `ev-${String(index + 1).padStart(3, '0')}`,
        at,
        time: formatEventTime(at),
        source: template.source,
        sourceLabel: eventSources[template.source],
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
    })
  }

  const fieldValueCounts = (list: EventRecord[], id: EventFieldId) => {
    const counts = new Map<string | number, number>()
    for (const event of list) {
      const value = event[id]
      if (value === undefined || value === null || value === '') continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
  }

  const countFieldValues = (list: EventRecord[], id: EventFieldId) => {
    const values = new Set<string | number>()
    for (const event of list) {
      const value = event[id]
      if (value !== undefined && value !== null && value !== '') values.add(value)
    }
    return values.size
  }

  const bucketCountFor = (windowMinutes: number) => {
    if (windowMinutes <= 15) return 12
    if (windowMinutes <= 60) return 20
    return 32
  }

  const eventBuckets = (list: EventRecord[], range: TimeWindow | null): EventBucket[] => {
    const end = (range?.end ?? new Date(referenceNow)).getTime()
    const start = (range?.start ?? new Date(end - fullWindowMinutes * 60000)).getTime()
    const span = Math.max(1, end - start)
    const bars = bucketCountFor(span / 60000)
    const width = span / bars
    const result = Array.from({ length: bars }, (_, index) => ({
      at: new Date(start + index * width),
      end: new Date(start + (index + 1) * width),
      total: 0,
      levels: Object.fromEntries(levelOrder.map((level) => [level, 0]))
    }))
    for (const event of list) {
      if (!isDate(event.at)) continue
      const offset = event.at.getTime() - start
      if (offset < 0 || offset > span) continue
      const bucket = result[Math.min(bars - 1, Math.floor(offset / width))]
      bucket.total += 1
      if (bucket.levels[event.level] !== undefined) bucket.levels[event.level] += 1
    }
    return result
  }

  const eventSummary = (list: EventRecord[]) => {
    const errors = list.filter((event) => event.level === 'Error').length
    const timed = list.filter(
      (event): event is EventRecord & { requestTimeMs: number } =>
        typeof event.requestTimeMs === 'number'
    )
    return {
      total: list.length,
      errors,
      errorShare: list.length ? errors / list.length : 0,
      avgRequestTimeMs: timed.length
        ? Math.round(timed.reduce((sum, event) => sum + event.requestTimeMs, 0) / timed.length)
        : null
    }
  }

  const events = ref(seedEvents())

  const valueFields = ['host', 'requestMethod', 'cacheStatus', 'country', 'ruleName', 'serviceName']

  const queryProperties: FilteringProperty[] = [
    { key: 'level', label: 'Level', options: eventLevelOptions },
    { key: 'source', label: 'Source', options: eventSourceOptions },
    ...optionalFields.map((field): FilteringProperty => {
      if (field.align === 'end') return { key: field.id, label: field.label, type: 'number' }
      if (!valueFields.includes(field.id)) return { key: field.id, label: field.label }
      return {
        key: field.id,
        label: field.label,
        options: fieldValueCounts(events.value, field.id).map(({ value }) => ({
          value: String(value)
        }))
      }
    })
  ]

  const searchableFields = eventFields.map((field) => field.id)

  const quoteValue = (value: string) =>
    /[\s"'=!:^<>]/.test(value) ? `"${value.replaceAll('"', '')}"` : value

  const queryToText = (query: PropertyFilterQuery) =>
    query.tokens
      .map((token) =>
        token.propertyKey
          ? `${token.propertyKey} ${token.operator} ${quoteValue(token.value)}`
          : quoteValue(token.value)
      )
      .join(query.operation === 'or' ? ' OR ' : ' AND ')

  const initialQuery: PropertyFilterQuery = {
    tokens: [
      { propertyKey: 'level', operator: '=', value: 'Error' },
      { propertyKey: 'host', operator: '=', value: 'api.example.com' }
    ],
    operation: 'and'
  }

  const queryText = ref(queryToText(initialQuery))
  const appliedQuery = ref<PropertyFilterQuery>(initialQuery)
  const appliedText = ref(queryText.value)
  const queryNotice = ref('')
  const pagination = ref({ pageIndex: 0, pageSize: 25 })

  const recentLimit = 8

  const recentQueries = ref<QueryEntry[]>([
    {
      text: 'status >= 500',
      query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
    },
    {
      text: 'source = security AND level = Warning',
      query: {
        tokens: [
          { propertyKey: 'source', operator: '=', value: 'security' },
          { propertyKey: 'level', operator: '=', value: 'Warning' }
        ],
        operation: 'and'
      }
    }
  ])

  const applyQuery = ({ text, query }: PropertyFilterSubmit) => {
    if (!query) {
      queryNotice.value =
        'This query mixes AND and OR. Use one of them throughout, then press Enter again.'
      return
    }
    queryNotice.value = ''
    appliedQuery.value = query
    appliedText.value = text.trim()
    pagination.value = { ...pagination.value, pageIndex: 0 }
    if (!appliedText.value) return
    recentQueries.value = [
      { text: appliedText.value, query },
      ...recentQueries.value.filter((entry) => entry.text !== appliedText.value)
    ].slice(0, recentLimit)
  }

  const submitQuery = (_event: KeyboardEvent, payload: PropertyFilterSubmit) => applyQuery(payload)

  const runQuery = (entry: QueryEntry) => {
    queryText.value = entry.text
    applyQuery(entry)
  }

  const savedQueries = ref<SavedQuery[]>([
    {
      id: 'q1',
      name: 'Server errors',
      text: 'status >= 500',
      query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
    },
    {
      id: 'q2',
      name: 'Cache misses on the API',
      text: 'cacheStatus = MISS AND host = api.example.com',
      query: {
        tokens: [
          { propertyKey: 'cacheStatus', operator: '=', value: 'MISS' },
          { propertyKey: 'host', operator: '=', value: 'api.example.com' }
        ],
        operation: 'and'
      }
    }
  ])
  let savedSeed = 2
  const savedOpen = ref(false)
  const recentOpen = ref(false)
  const saveName = ref('')
  const savedStatus = ref('')

  const canSave = computed(() => Boolean(saveName.value.trim() && appliedText.value))

  const saveQuery = () => {
    if (!canSave.value) return
    savedSeed += 1
    const name = saveName.value.trim()
    savedQueries.value = [
      ...savedQueries.value,
      { id: `q${savedSeed}`, name, text: appliedText.value, query: appliedQuery.value }
    ]
    saveName.value = ''
    savedStatus.value = `Saved “${name}”.`
  }

  const deleteSavedQuery = (entry: SavedQuery) => {
    savedQueries.value = savedQueries.value.filter((saved) => saved.id !== entry.id)
    savedStatus.value = `Deleted “${entry.name}”.`
  }

  const useSavedQuery = (entry: SavedQuery) => {
    runQuery(entry)
    savedOpen.value = false
  }

  const useRecentQuery = (entry: QueryEntry) => {
    runQuery(entry)
    recentOpen.value = false
  }

  const clearRecentQueries = () => {
    recentQueries.value = []
    recentOpen.value = false
  }

  const filters = computed(() => {
    const out: Record<string, string[]> = {}
    const { tokens, operation } = appliedQuery.value
    if (operation === 'or' && tokens.length > 1) return out
    for (const token of tokens) {
      if (!token.propertyKey || token.operator !== '=') continue
      out[token.propertyKey] = [...(out[token.propertyKey] ?? []), token.value.toLowerCase()]
    }
    return out
  })

  const relativeOptions: RelativeOption[] = [
    { key: 'last-15-minutes', amount: 15, unit: 'minute' },
    { key: 'last-1-hour', amount: 1, unit: 'hour' },
    { key: 'last-6-hours', amount: 6, unit: 'hour' },
    { key: 'last-24-hours', amount: 24, unit: 'hour' }
  ]

  const range = ref<DateRangeValue | null>({
    type: 'relative',
    amount: 24,
    unit: 'hour',
    key: 'last-24-hours'
  })
  const rangeNow = new Date(referenceNow)
  const rangeMin = new Date(referenceNow - 7 * 24 * 3600000)

  const unitMs: Record<DateRangeUnit, number> = {
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000,
    year: 31536000000
  }

  const activeWindow = computed<TimeWindow>(() => {
    const value = range.value
    if (!value) {
      return { start: new Date(referenceNow - fullWindowMinutes * 60000), end: rangeNow }
    }
    if (value.type === 'relative') {
      return { start: new Date(referenceNow - value.amount * unitMs[value.unit]), end: rangeNow }
    }
    return { start: new Date(value.start), end: new Date(value.end) }
  })

  const windowLabel = computed(() => {
    const value = range.value
    if (value?.type === 'relative') {
      return value.amount === 1 ? `Last ${value.unit}` : `Last ${value.amount} ${value.unit}s`
    }
    return formatPeriod(activeWindow.value)
  })

  const inWindow = (date: unknown) => {
    if (!isDate(date)) return false
    const time = date.getTime()
    return time >= activeWindow.value.start.getTime() && time <= activeWindow.value.end.getTime()
  }

  const matchedEvents = computed(() =>
    events.value
      .filter(
        (event) =>
          inWindow(event.at) &&
          matchesQuery(event, appliedQuery.value, queryProperties, searchableFields)
      )
      .map((event) => ({ ...event, time: formatEventTime(event.at) }))
  )

  watch(range, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const tableRef = ref<TableExposed<EventRecord> | null>(null)
  const exportCsv = () => tableRef.value?.exportCsv({ filename: 'events.csv' })

  const selectTimeRange = ({ start, end }: TimeWindow) => {
    range.value = { type: 'absolute', start: start.toISOString(), end: end.toISOString() }
  }

  const buckets = computed(() => eventBuckets(matchedEvents.value, activeWindow.value))
  const summary = computed(() => eventSummary(matchedEvents.value))

  const errorShareLabel = computed(() =>
    summary.value.total ? `${(summary.value.errorShare * 100).toFixed(1)}% of events` : 'none'
  )

  const shownColumns = ref(['host', 'status', 'remoteAddress'])
  const fieldsOpen = ref(true)
  const fieldSearch = ref('')

  const matchesFieldSearch = (field: EventField) => {
    const term = fieldSearch.value.trim().toLowerCase()
    if (!term) return true
    return field.label.toLowerCase().includes(term) || field.id.toLowerCase().includes(term)
  }

  const shownFields = computed<Array<EventField & { locked?: boolean }>>(() => [
    ...coreFields.filter(matchesFieldSearch).map((field) => ({ ...field, locked: true })),
    ...optionalFields.filter(
      (field) => shownColumns.value.includes(field.id) && matchesFieldSearch(field)
    )
  ])

  const fieldCategories = computed(() =>
    eventFieldCategories
      .map((category) => ({
        ...category,
        fields: optionalFields.filter(
          (field) =>
            field.category === category.id &&
            !shownColumns.value.includes(field.id) &&
            matchesFieldSearch(field)
        )
      }))
      .filter((category) => category.fields.length)
  )

  const hasFieldMatches = computed(
    () => shownFields.value.length > 0 || fieldCategories.value.length > 0
  )

  const categoryFilterCount = (category: { fields: EventField[] }) =>
    category.fields.filter((field) => filters.value[field.id]?.length).length

  const openCategories = ref(['request'])

  const collapsedBeforeSearch = ref<string[] | null>(null)
  watch(fieldSearch, (term, previous) => {
    const searching = Boolean(term.trim())
    if (searching && !previous.trim()) collapsedBeforeSearch.value = [...openCategories.value]
    if (searching) {
      openCategories.value = fieldCategories.value.map((category) => category.id)
      return
    }
    openCategories.value = collapsedBeforeSearch.value ?? ['request']
    collapsedBeforeSearch.value = null
  })

  const fieldCounts = computed(() =>
    Object.fromEntries(
      eventFields.map((field) => [field.id, countFieldValues(matchedEvents.value, field.id)])
    )
  )

  const topValues = 6

  const unfilterableFields = new Set(['time', 'sourceLabel'])

  const canFilterField = (field: EventField) => !unfilterableFields.has(field.id)

  const topFieldValues = (id: EventFieldId) =>
    fieldValueCounts(matchedEvents.value, id).slice(0, topValues)

  const fieldValueOverflow = (id: EventFieldId) =>
    Math.max(0, countFieldValues(matchedEvents.value, id) - topValues)

  const isValueApplied = (id: string, value: string | number) =>
    (filters.value[id] ?? []).includes(String(value).toLowerCase())

  const toggleColumn = (id: string) => {
    shownColumns.value = shownColumns.value.includes(id)
      ? shownColumns.value.filter((shown) => shown !== id)
      : [...shownColumns.value, id]
  }

  const toggleFieldValue = (id: string, value: string | number) => {
    const text = String(value)
    const same = (token: PropertyFilterToken) =>
      token.propertyKey === id &&
      token.operator === '=' &&
      token.value.toLowerCase() === text.toLowerCase()
    const { tokens, operation } = appliedQuery.value
    const next: PropertyFilterToken[] = tokens.some(same)
      ? tokens.filter((token) => !same(token))
      : [...tokens, { propertyKey: id, operator: '=', value: text }]
    const query = { tokens: next, operation }
    queryText.value = queryToText(query)
    applyQuery({ text: queryText.value, query })
  }

  const toColumn = (field: EventField): TableColumn => ({
    accessorKey: field.id,
    header: field.label,
    enableSorting: true,
    ...(field.principal ? { principal: true } : {}),
    ...(field.grow ? { grow: field.grow } : {}),
    ...(field.minWidth ? { minWidth: field.minWidth } : {}),
    ...(field.align ? { align: field.align } : {})
  })

  const columns = computed<TableColumn[]>(() => [
    { id: 'detail', header: '', width: 44, align: 'center', hideable: false },
    ...coreFields.map(toColumn),
    ...optionalFields.filter((field) => shownColumns.value.includes(field.id)).map(toColumn)
  ])

  const customCellFields = ['status']
  const genericColumns = computed(() =>
    optionalFields.filter(
      (field) => shownColumns.value.includes(field.id) && !customCellFields.includes(field.id)
    )
  )

  const statusField = eventField('status')

  const statusTone = (status: unknown) => {
    if (typeof status !== 'number') return null
    if (status >= 500) return 'error'
    if (status >= 400) return 'warn'
    return 'ok'
  }

  const selectedId = ref('')
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedId.value) ?? null
  )
  const documentEvent = ref<EventRecord | null>(null)
  watch(selectedEvent, (event) => {
    if (event) documentEvent.value = event
  })

  const logMinWidth = 480
  const documentMinWidth = 348
  const fieldsPanelWidth = 268

  const explorerEl = ref<HTMLElement | null>(null)
  const explorerWidth = ref(0)
  let explorerObserver: ResizeObserver | null = null

  const showFieldsPanel = computed(
    () => explorerWidth.value === 0 || explorerWidth.value >= fieldsPanelWidth + logMinWidth
  )

  const isWide = computed(
    () =>
      explorerWidth.value === 0 ||
      explorerWidth.value >= fieldsPanelWidth + logMinWidth + documentMinWidth
  )

  const documentDrawerOpen = ref(false)

  onMounted(() => {
    if (!explorerEl.value) return
    explorerWidth.value = explorerEl.value.offsetWidth
    explorerObserver = new ResizeObserver(([entry]) => {
      explorerWidth.value = entry.contentRect.width
    })
    explorerObserver.observe(explorerEl.value)
  })

  watch(isWide, (wide) => {
    documentDrawerOpen.value = !wide && Boolean(selectedId.value)
  })

  const closeDocument = () => {
    selectedId.value = ''
    documentDrawerOpen.value = false
  }

  const openDocument = (_event: MouseEvent, row: EventRecord) => {
    selectedId.value = row.id
    documentDrawerOpen.value = !isWide.value
  }

  const documentCollapsed = computed({
    get: () => !selectedEvent.value,
    set: (collapsed) => {
      if (collapsed) closeDocument()
    }
  })

  const documentPaneExpanded = computed({
    get: () => isWide.value && !documentCollapsed.value,
    set: (expanded) => {
      if (!expanded) closeDocument()
    }
  })

  watch(documentDrawerOpen, (open) => {
    if (!open && !isWide.value) selectedId.value = ''
  })

  const fieldsWidth = ref(fieldsPanelWidth)
  const documentWidth = ref(400)

  const documentMaxWidth = computed(() => {
    if (explorerWidth.value === 0) return Infinity
    const fieldsUsed = showFieldsPanel.value && fieldsOpen.value ? fieldsWidth.value : 0
    return Math.max(documentMinWidth, explorerWidth.value - fieldsUsed - logMinWidth)
  })

  watch(
    [documentMaxWidth, documentWidth],
    ([max, width]) => {
      if (width > max) documentWidth.value = max
    },
    { flush: 'sync' }
  )

  const summaryPriority: EventFieldId[] = [
    'host',
    'requestMethod',
    'requestUri',
    'status',
    'serviceName',
    'serviceDurationMs',
    'ruleName',
    'requestTimeMs',
    'remoteAddress',
    'country',
    'cacheStatus',
    'resourceId'
  ]

  const summaryLimit = 6

  const hasEventValue = (event: EventRecord, id: EventFieldId) => {
    const value = event[id]
    return value !== undefined && value !== null && value !== ''
  }

  const documentRows = computed(() => {
    const event = selectedEvent.value
    if (!event) return []
    return summaryPriority
      .filter((id) => hasEventValue(event, id))
      .slice(0, summaryLimit)
      .map((id) => {
        const field = eventField(id)
        return { id, label: field?.label ?? id, value: formatEventValue(field, event[id]) }
      })
  })

  const documentTabs = computed(() => {
    const event = selectedEvent.value
    if (!event) return []
    const payload = Object.fromEntries(
      eventFields
        .filter((field) => hasEventValue(event, field.id))
        .map((field) => [field.id, event[field.id]])
    )
    return [
      {
        label: 'Document',
        value: 'document',
        language: 'json',
        code: JSON.stringify(payload, null, 2)
      }
    ]
  })

  const levelColors: Record<EventLevel, ChartColor> = {
    Error: 'severity-critical',
    Warning: 'severity-medium',
    Info: 'severity-low',
    Debug: 'severity-info'
  }

  const volumeLabels = computed(() => buckets.value.map((bucket) => bucket.at))

  const volumeSeries = computed<ChartSeries[]>(() =>
    levelOrder.map((level) => ({
      id: level,
      name: level,
      color: levelColors[level] ?? 'other',
      values: buckets.value.map((bucket) => bucket.levels[level] ?? 0)
    }))
  )

  const busiestIndex = computed(() =>
    buckets.value.reduce(
      (highest, bucket, index) =>
        bucket.total > (buckets.value[highest]?.total ?? 0) ? index : highest,
      0
    )
  )

  const busiestBucket = computed(() => buckets.value[busiestIndex.value] ?? null)

  const selectVolume = (span: ChartRange | null) => {
    if (!span) return
    const from = buckets.value[span[0]]
    const to = buckets.value[span[1]]
    if (from && to) selectTimeRange({ start: from.at, end: to.end })
  }

  const chartSummary = computed(() => {
    if (!busiestBucket.value?.total) return `No events in the ${windowLabel.value.toLowerCase()}.`
    return `Busiest bucket at ${formatEventClock(busiestBucket.value.at)} with ${busiestBucket.value.total} events.`
  })

  const chartLabel = computed(
    () =>
      `Event volume, ${windowLabel.value.toLowerCase()}. ${chartSummary.value} Drag across the chart, or hold Shift with the arrow keys and press Enter, to filter the log to a span.`
  )

  onBeforeUnmount(() => {
    clearTimeout(refreshTimer)
    explorerObserver?.disconnect()
  })
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <header
      class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
    >
      <header class="flex items-center gap-(--layout-group-gap)">
        <div class="flex min-w-0 grow flex-wrap items-center gap-(--spacing-xs)">
          <div class="flex shrink-0 items-center">
            <DateRangePicker
              v-model="range"
              v-model:time-zone="timeZone"
              :relative-options="relativeOptions"
              :time-zones="timeZones"
              :now="rangeNow"
              :min="rangeMin"
              :max="rangeNow"
              show-step
              aria-label="Events time range"
              data-testid="events-range"
            />
          </div>
          <div class="flex min-w-36 grow basis-(--container-xs)">
            <PropertyFilter
              v-model:text="queryText"
              mode="query"
              :properties="queryProperties"
              :total-count="matchedEvents.length"
              aria-label="Query events"
              placeholder="Query events, for example status >= 500 AND host = example.com"
              data-testid="events-query"
              @submit="submitQuery"
            />
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
          <Popover
            v-model:open="savedOpen"
            placement="bottom-end"
            size="small"
          >
            <Popover.Trigger>
              <Tooltip text="Saved queries">
                <IconButton
                  icon="ai ai-bookmark"
                  kind="outlined"
                  size="medium"
                  aria-label="Saved queries"
                  data-testid="saved-queries__trigger"
                />
              </Tooltip>
            </Popover.Trigger>
            <Popover.Content>
              <div
                class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
                data-testid="saved-queries"
              >
                <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
                  Saved queries
                </h2>
                <ul
                  v-if="savedQueries.length"
                  class="flex flex-col"
                  aria-label="Saved queries"
                >
                  <li
                    v-for="entry in savedQueries"
                    :key="entry.id"
                    class="flex min-w-0 items-center gap-(--spacing-2xs)"
                  >
                    <Item
                      clickable
                      kind="option"
                      class="min-w-0 flex-1"
                      data-testid="saved-queries__apply"
                      @click="useSavedQuery(entry)"
                    >
                      <span class="flex min-w-0 flex-1 flex-col items-start">
                        <span class="max-w-full truncate text-label-sm text-(--text-default)">
                          {{ entry.name }}
                        </span>
                        <span class="max-w-full truncate text-label-code-sm text-(--text-muted)">
                          {{ entry.text }}
                        </span>
                      </span>
                    </Item>
                    <Tooltip text="Delete">
                      <IconButton
                        icon="ai ai-trash"
                        kind="transparent"
                        size="small"
                        :aria-label="`Delete ${entry.name}`"
                        data-testid="saved-queries__delete"
                        @click="deleteSavedQuery(entry)"
                      />
                    </Tooltip>
                  </li>
                </ul>
                <p
                  v-else
                  class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
                >
                  No saved queries yet. Name the current query to keep it.
                </p>
                <div
                  class="flex items-center gap-(--spacing-xs) border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-xs)"
                >
                  <div class="min-w-0 flex-1">
                    <Input
                      v-model="saveName"
                      size="small"
                      placeholder="Name the current query"
                      aria-label="Name for the current query"
                      class="w-full"
                      data-testid="saved-queries__name"
                      @keydown.enter.prevent="saveQuery"
                    />
                  </div>
                  <Button
                    label="Save"
                    kind="secondary"
                    size="small"
                    :disabled="!canSave"
                    data-testid="saved-queries__save"
                    @click="saveQuery"
                  />
                </div>
                <p
                  role="status"
                  class="sr-only"
                >
                  {{ savedStatus }}
                </p>
              </div>
            </Popover.Content>
          </Popover>
          <Popover
            v-model:open="recentOpen"
            placement="bottom-end"
            size="small"
          >
            <Popover.Trigger>
              <Tooltip text="Recent queries">
                <IconButton
                  icon="ai ai-history"
                  kind="outlined"
                  size="medium"
                  aria-label="Recent queries"
                  data-testid="recent-queries__trigger"
                />
              </Tooltip>
            </Popover.Trigger>
            <Popover.Content>
              <div
                class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
                data-testid="recent-queries"
              >
                <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
                  Recent queries
                </h2>
                <ul
                  v-if="recentQueries.length"
                  class="flex flex-col"
                  aria-label="Recent queries"
                >
                  <li
                    v-for="entry in recentQueries"
                    :key="entry.text"
                  >
                    <Item
                      clickable
                      kind="option"
                      data-testid="recent-queries__apply"
                      @click="useRecentQuery(entry)"
                    >
                      <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                        <i
                          class="ai ai-history shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span
                          class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
                        >
                          {{ entry.text }}
                        </span>
                      </span>
                    </Item>
                  </li>
                </ul>
                <p
                  v-else
                  class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
                >
                  Queries you run appear here.
                </p>
                <div
                  v-if="recentQueries.length"
                  class="border-t border-(--border-default) pt-(--spacing-2xs)"
                >
                  <Button
                    label="Clear history"
                    kind="transparent"
                    size="small"
                    data-testid="recent-queries__clear"
                    @click="clearRecentQueries"
                  />
                </div>
              </div>
            </Popover.Content>
          </Popover>
          <Tooltip
            text="Refresh"
            class="shrink-0"
          >
            <IconButton
              icon="ai ai-refresh"
              kind="outlined"
              size="medium"
              :loading="loading"
              aria-label="Refresh"
              data-testid="refresh-button"
              @click="refresh"
            />
          </Tooltip>
          <Tooltip
            text="Download CSV"
            class="shrink-0"
          >
            <IconButton
              icon="ai ai-download"
              kind="outlined"
              size="medium"
              :disabled="!tableRef"
              aria-label="Download CSV"
              data-testid="export-button"
              @click="exportCsv"
            />
          </Tooltip>
        </div>
      </header>

      <p
        role="status"
        class="text-body-sm text-(--danger-foreground) empty:hidden"
        data-testid="query-notice"
      >
        {{ queryNotice }}
      </p>
    </header>

    <section
      ref="explorerEl"
      class="animate-content-enter motion-reduce:animate-none relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
    >
      <Resizable
        orientation="horizontal"
        aria-label="Events explorer"
        class="min-h-0 min-w-0 flex-1"
      >
        <Resizable.Pane aria-label="Events">
          <div class="flex h-full min-h-0 min-w-0 flex-1">
            <div
              v-if="showFieldsPanel"
              key="fields-panel"
              class="contents [--sidebar-width:var(--container-2xs)]"
            >
              <Sidebar
                v-model:open="fieldsOpen"
                v-model:width="fieldsWidth"
                resizable
                collapsible
                aria-label="Fields"
                collapse-aria-label="Hide the fields panel"
                expand-aria-label="Show the fields panel"
                resize-aria-label="Resize the fields panel"
              >
                <template #header>
                  <div class="px-(--spacing-xs)">
                    <Input
                      v-model="fieldSearch"
                      size="medium"
                      class="w-full"
                      placeholder="Search fields"
                      aria-label="Search fields"
                    >
                      <template #prefix>
                        <i
                          class="ai ai-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                </template>

                <div>
                  <div
                    class="flex items-baseline justify-between gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-2xs) pt-(--spacing-2xs)"
                  >
                    <span class="text-label-sm text-(--text-muted)">Shown</span>
                    <span class="text-label-sm text-(--text-muted)">Values</span>
                  </div>

                  <div
                    v-for="field in shownFields"
                    :key="field.id"
                    class="group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
                  >
                    <div class="min-w-0 flex-1">
                      <Field
                        orientation="horizontal"
                        :disabled="field.locked"
                      >
                        <Checkbox
                          :model-value="true"
                          :id="`event-field-${field.id}`"
                          @update:model-value="toggleColumn(field.id)"
                        />
                        <Field.Label>
                          <span class="truncate">{{ field.label }}</span>
                        </Field.Label>
                      </Field>
                    </div>

                    <Popover
                      v-if="canFilterField(field) && fieldCounts[field.id]"
                      placement="right-start"
                    >
                      <div
                        class="shrink-0 cursor-pointer text-label-code-sm tabular-nums text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) group-hover:text-(--text-default) motion-reduce:transition-none"
                      >
                        <Popover.Trigger
                          role="button"
                          tabindex="0"
                          :aria-label="`Filter by ${field.label}, ${fieldCounts[field.id]} values`"
                        >
                          {{ fieldCounts[field.id] }}
                        </Popover.Trigger>
                      </div>

                      <Popover.Content>
                        <div class="flex min-w-0 flex-col p-(--spacing-2xs)">
                          <p
                            class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                          >
                            {{ field.label }} · top values
                          </p>

                          <Item
                            v-for="entry in topFieldValues(field.id)"
                            :key="String(entry.value)"
                            clickable
                            kind="option"
                            :aria-pressed="isValueApplied(field.id, entry.value)"
                            @click="toggleFieldValue(field.id, entry.value)"
                          >
                            <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                              <span
                                class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
                              >
                                {{ formatEventValue(field, entry.value) }}
                              </span>
                              <span
                                class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)"
                              >
                                {{ entry.count }}
                              </span>
                              <i
                                v-if="isValueApplied(field.id, entry.value)"
                                class="ai ai-check shrink-0 text-(--primary)"
                                aria-hidden="true"
                              />
                            </span>
                          </Item>

                          <p
                            v-if="fieldValueOverflow(field.id)"
                            class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
                          >
                            {{ fieldValueOverflow(field.id) }} more values in this window.
                          </p>
                        </div>
                      </Popover.Content>
                    </Popover>

                    <span
                      v-else
                      class="shrink-0 px-(--spacing-2xs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
                      :data-empty="fieldCounts[field.id] ? null : true"
                      :aria-label="`${fieldCounts[field.id]} distinct values`"
                    >
                      {{ fieldCounts[field.id] }}
                    </span>
                  </div>

                  <div
                    v-if="fieldCategories.length"
                    class="mt-(--spacing-xs)"
                  >
                    <Accordion
                      v-model="openCategories"
                      type="multiple"
                      size="medium"
                      arrow-position="left"
                    >
                      <Accordion.Item
                        v-for="category in fieldCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        <Accordion.Trigger>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <span class="truncate text-label-sm text-(--text-default)">
                              {{ category.label }}
                            </span>
                            <Tag
                              v-if="categoryFilterCount(category)"
                              :label="String(categoryFilterCount(category))"
                              severity="info"
                              size="small"
                            />
                          </span>
                        </Accordion.Trigger>

                        <Accordion.Content>
                          <div
                            v-for="field in category.fields"
                            :key="field.id"
                            class="group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
                          >
                            <div class="min-w-0 flex-1">
                              <Field orientation="horizontal">
                                <Checkbox
                                  :model-value="false"
                                  :id="`event-field-${field.id}`"
                                  @update:model-value="toggleColumn(field.id)"
                                />
                                <Field.Label>
                                  <span class="truncate">{{ field.label }}</span>
                                </Field.Label>
                              </Field>
                            </div>

                            <Popover
                              v-if="canFilterField(field) && fieldCounts[field.id]"
                              placement="right-start"
                            >
                              <div
                                class="shrink-0 cursor-pointer text-label-code-sm tabular-nums text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) group-hover:text-(--text-default) motion-reduce:transition-none"
                              >
                                <Popover.Trigger
                                  role="button"
                                  tabindex="0"
                                  :aria-label="`Filter by ${field.label}, ${fieldCounts[field.id]} values`"
                                >
                                  {{ fieldCounts[field.id] }}
                                </Popover.Trigger>
                              </div>

                              <Popover.Content>
                                <div class="flex min-w-0 flex-col p-(--spacing-2xs)">
                                  <p
                                    class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                                  >
                                    {{ field.label }} · top values
                                  </p>

                                  <Item
                                    v-for="entry in topFieldValues(field.id)"
                                    :key="String(entry.value)"
                                    clickable
                                    kind="option"
                                    :aria-pressed="isValueApplied(field.id, entry.value)"
                                    @click="toggleFieldValue(field.id, entry.value)"
                                  >
                                    <span
                                      class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)"
                                    >
                                      <span
                                        class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
                                      >
                                        {{ formatEventValue(field, entry.value) }}
                                      </span>
                                      <span
                                        class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)"
                                      >
                                        {{ entry.count }}
                                      </span>
                                      <i
                                        v-if="isValueApplied(field.id, entry.value)"
                                        class="ai ai-check shrink-0 text-(--primary)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Item>

                                  <p
                                    v-if="fieldValueOverflow(field.id)"
                                    class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
                                  >
                                    {{ fieldValueOverflow(field.id) }} more values in this window.
                                  </p>
                                </div>
                              </Popover.Content>
                            </Popover>

                            <span
                              v-else
                              class="shrink-0 px-(--spacing-2xs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
                              :data-empty="fieldCounts[field.id] ? null : true"
                              :aria-label="`${fieldCounts[field.id]} distinct values`"
                            >
                              {{ fieldCounts[field.id] }}
                            </span>
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>
                  </div>

                  <p
                    v-if="!hasFieldMatches"
                    class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    No fields match "{{ fieldSearch }}".
                  </p>
                </div>
              </Sidebar>
            </div>

            <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
              <section
                class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <div class="flex flex-wrap items-end gap-(--spacing-md)">
                  <dl class="flex flex-wrap items-end gap-(--spacing-xl)">
                    <div class="flex flex-col">
                      <dt class="text-label-sm text-(--text-muted)">Events</dt>
                      <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
                        {{ formatNumber(summary.total) }}
                      </dd>
                    </div>
                    <div class="flex flex-col">
                      <dt class="text-label-sm text-(--text-muted)">Errors</dt>
                      <dd
                        class="m-0 text-heading-xs tabular-nums text-(--text-default) data-raised:text-(--danger-foreground)"
                        :data-raised="summary.errors ? true : null"
                        :aria-label="`${summary.errors} errors, ${errorShareLabel}`"
                      >
                        {{ formatNumber(summary.errors) }}
                      </dd>
                    </div>
                    <div class="flex flex-col">
                      <dt class="text-label-sm text-(--text-muted)">Avg request time</dt>
                      <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
                        {{
                          summary.avgRequestTimeMs === null ? '—' : `${summary.avgRequestTimeMs} ms`
                        }}
                      </dd>
                    </div>
                  </dl>
                </div>

                <Chart
                  :range="null"
                  :series="volumeSeries"
                  :labels="volumeLabels"
                  :format-label="formatEventClock"
                  :height="80"
                  :aria-label="chartLabel"
                  @update:range="selectVolume"
                >
                  <Chart.Axis
                    kind="x"
                    :ticks="3"
                  />
                  <Chart.Brush />
                  <Chart.Bar
                    kind="histogram"
                    stacked
                  />
                  <Chart.Crosshair />
                  <Chart.Tooltip total>
                    <template #footer
                      >Click to filter to this bucket, or drag to select a span.</template
                    >
                  </Chart.Tooltip>
                </Chart>
              </section>

              <section class="flex min-h-0 min-w-0 flex-1 flex-col">
                <div class="flex min-h-0 flex-1">
                  <DataTable
                    ref="tableRef"
                    v-model:pagination="pagination"
                    :data="matchedEvents"
                    :columns="columns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="25"
                    :bordered="false"
                    density="compact"
                    max-height="100%"
                    class="w-full"
                    :loading="loading"
                    @row-click="openDocument"
                  >
                    <template #header-detail>
                      <span class="sr-only">Open the event document</span>
                    </template>

                    <template #cell-detail="{ row }">
                      <IconButton
                        :icon="row.id === selectedId ? 'ai ai-angle-down' : 'ai ai-angle-right'"
                        kind="transparent"
                        size="small"
                        :aria-label="`Open event ${row.id}`"
                        :aria-expanded="row.id === selectedId"
                        @click.stop="openDocument($event, row)"
                      />
                    </template>

                    <template #cell-time="{ value }">
                      <span
                        class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-muted)"
                      >
                        {{ value }}
                      </span>
                    </template>

                    <template #cell-level="{ value }">
                      <Tag
                        :label="value"
                        :severity="eventLevelSeverity(value)"
                        size="small"
                      />
                    </template>

                    <template #cell-message="{ value }">
                      <span class="min-w-0 truncate text-(--text-default)">{{ value }}</span>
                    </template>

                    <template #cell-status="{ value }">
                      <span
                        class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-default) data-[tone=error]:text-(--danger-foreground) data-[tone=warn]:text-(--warning-foreground)"
                        :data-tone="statusTone(value)"
                      >
                        {{ formatEventValue(statusField, value) }}
                      </span>
                    </template>

                    <template
                      v-for="field in genericColumns"
                      :key="field.id"
                      #[`cell-${field.id}`]="{ value }"
                    >
                      <span
                        class="min-w-0 truncate text-(--text-default) data-mono:text-label-code-sm data-numeric:tabular-nums"
                        :data-mono="field.mono || null"
                        :data-numeric="field.align === 'end' || null"
                      >
                        {{ formatEventValue(field, value) }}
                      </span>
                    </template>

                    <template #empty>
                      <EmptyState
                        v-if="!events.length"
                        key="no-traffic"
                        size="small"
                        icon="ai ai-inbox"
                        title="No events yet"
                        description="Events appear here as soon as traffic reaches this workspace's resources."
                      />
                      <EmptyState
                        v-else-if="appliedQuery.tokens.length"
                        key="no-match"
                        size="small"
                        icon="ai ai-search"
                        title="No events match this query"
                        description="Change the query, or widen the time range to cover more of the log."
                      />
                      <EmptyState
                        v-else
                        key="no-events"
                        size="small"
                        icon="ai ai-filter-slash"
                        title="No events in this window"
                        description="Widen the time range to see more of the log."
                      />
                    </template>
                  </DataTable>
                </div>
              </section>
            </div>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="documentPaneExpanded"
          aria-label="Resize the event panel"
        />
        <Resizable.Pane
          v-model:basis="documentWidth"
          v-model:expanded="documentPaneExpanded"
          collapsible
          :min="320"
          :max="512"
          aria-label="Event document"
        >
          <aside
            :inert="!documentPaneExpanded"
            aria-labelledby="event-document-title"
            class="flex h-full min-h-0 min-w-0 flex-col border-s border-(--border-default) bg-(--bg-surface)"
          >
            <div
              class="flex items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
            >
              <h2
                id="event-document-title"
                class="min-w-0 truncate text-heading-2xs text-(--text-default)"
              >
                Event
              </h2>
              <Tooltip text="Close">
                <IconButton
                  icon="ai ai-times"
                  kind="transparent"
                  size="small"
                  aria-label="Close the event document"
                  @click="closeDocument"
                />
              </Tooltip>
            </div>
            <div class="min-h-0 flex-1 overflow-y-auto">
              <div
                v-if="documentEvent"
                class="min-w-0"
              >
                <div class="flex min-w-0 flex-col">
                  <div
                    class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md) pb-(--spacing-lg)"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                        <Tag
                          :label="documentEvent.level"
                          :severity="eventLevelSeverity(documentEvent.level)"
                          size="small"
                        />
                        <Tag
                          :label="documentEvent.sourceLabel"
                          severity="neutral"
                          size="small"
                        />
                      </div>
                      <p class="text-body-md text-(--text-default)">{{ documentEvent.message }}</p>
                      <p class="text-label-code-sm tabular-nums text-(--text-muted)">
                        {{ documentEvent.time }}
                      </p>
                    </div>

                    <dl
                      class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm)"
                    >
                      <template
                        v-for="row in documentRows"
                        :key="row.id"
                      >
                        <dt class="min-w-0 text-label-sm text-(--text-muted)">{{ row.label }}</dt>
                        <dd
                          class="m-0 min-w-0 break-words text-label-code-sm text-(--text-default)"
                        >
                          {{ row.value }}
                        </dd>
                      </template>
                    </dl>
                  </div>

                  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                    <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">
                      Event document
                    </h3>
                    <div class="min-w-0">
                      <CodeBlock
                        :tabs="documentTabs"
                        :bordered="false"
                        line-numbers
                        copy-aria-label="Copy the event document as JSON"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </Resizable.Pane>
      </Resizable>
    </section>

    <Drawer
      v-model:open="documentDrawerOpen"
      size="large"
      side="right"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Event</DrawerTitle>
        </PanelHeader>
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            v-if="documentEvent"
            class="flex min-w-0 flex-col"
          >
            <div
              class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md) pb-(--spacing-lg)"
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                  <Tag
                    :label="documentEvent.level"
                    :severity="eventLevelSeverity(documentEvent.level)"
                    size="small"
                  />
                  <Tag
                    :label="documentEvent.sourceLabel"
                    severity="neutral"
                    size="small"
                  />
                </div>
                <p class="text-body-md text-(--text-default)">
                  {{ documentEvent.message }}
                </p>
                <p class="text-label-code-sm tabular-nums text-(--text-muted)">
                  {{ documentEvent.time }}
                </p>
              </div>

              <dl
                class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm)"
              >
                <template
                  v-for="row in documentRows"
                  :key="row.id"
                >
                  <dt class="min-w-0 text-label-sm text-(--text-muted)">{{ row.label }}</dt>
                  <dd class="m-0 min-w-0 break-words text-label-code-sm text-(--text-default)">
                    {{ row.value }}
                  </dd>
                </template>
              </dl>
            </div>

            <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
              <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Event document</h3>
              <div class="min-w-0">
                <CodeBlock
                  :tabs="documentTabs"
                  :bordered="false"
                  line-numbers
                  copy-aria-label="Copy the event document as JSON"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
