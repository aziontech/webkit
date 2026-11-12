<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Badge from '@aziontech/webkit/badge'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import Chart from '@aziontech/webkit/chart'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Chip from '@aziontech/webkit/chip'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Command from '@aziontech/webkit/command'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Menu from '@aziontech/webkit/menu'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home', path: '/home' },
        { id: 'projects', label: 'Projects', icon: 'pi pi-folder', path: '/projects' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'pi pi-cloud-upload',
          path: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'resources', label: 'Resources', icon: 'pi pi-box', path: '/resources' },
        { id: 'services', label: 'Services', icon: 'pi pi-server', path: '/services' },
        { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h', path: '/variables' },
        { id: 'integrations', label: 'Integrations', icon: 'pi pi-link', path: '/integrations' },
        { id: 'templates', label: 'Templates', icon: 'pi pi-clone', path: '/templates' }
      ]
    },
    {
      label: 'Security',
      items: [
        { id: 'domains', label: 'Domains', icon: 'pi pi-globe', path: '/domains' },
        { id: 'policies', label: 'Policies', icon: 'pi pi-shield', path: '/policies' },
        { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list', path: '/rule-sets' },
        { id: 'keys', label: 'Keys', icon: 'pi pi-key', path: '/keys' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          id: 'databases',
          label: 'Databases',
          icon: 'pi pi-database',
          path: '/databases',
          tagValue: 'Preview'
        },
        { id: 'storage', label: 'Storage', icon: 'pi pi-inbox', path: '/storage' }
      ]
    },
    {
      label: 'Observability',
      items: [
        { id: 'logs', label: 'Logs', icon: 'pi pi-file', path: '/logs' },
        {
          id: 'metrics-module',
          label: 'Metrics',
          icon: 'pi pi-chart-bar',
          kind: 'drill',
          href: '/metrics',
          groups: [
            {
              items: [{ id: 'metrics', label: 'Overview', path: '/metrics' }]
            },
            {
              label: 'Build',
              items: [
                {
                  id: 'metrics-resources',
                  label: 'Resources',
                  path: '/metrics',
                  query: { dashboard: 'resources' }
                },
                {
                  id: 'metrics-services',
                  label: 'Services',
                  path: '/metrics',
                  query: { dashboard: 'services' }
                },
                {
                  id: 'metrics-cache',
                  label: 'Cache',
                  path: '/metrics',
                  query: { dashboard: 'cache' }
                }
              ]
            },
            {
              label: 'Security',
              items: [
                {
                  id: 'metrics-domains',
                  label: 'Domains',
                  path: '/metrics',
                  query: { dashboard: 'domains' }
                },
                {
                  id: 'metrics-policies',
                  label: 'Policies',
                  path: '/metrics',
                  query: { dashboard: 'policies' }
                },
                {
                  id: 'metrics-rule-sets',
                  label: 'Rule sets',
                  path: '/metrics',
                  query: { dashboard: 'rule-sets' }
                }
              ]
            },
            {
              label: 'Data',
              items: [
                {
                  id: 'metrics-databases',
                  label: 'Databases',
                  path: '/metrics',
                  query: { dashboard: 'databases' }
                },
                {
                  id: 'metrics-storage',
                  label: 'Storage',
                  path: '/metrics',
                  query: { dashboard: 'storage' }
                }
              ]
            }
          ]
        },
        { id: 'events', label: 'Events', icon: 'pi pi-bolt', path: '/events' }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large', path: '/catalog' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', path: '/account' },
                {
                  id: 'settings-build-deployment',
                  label: 'Build and deployment',
                  path: '/account/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  path: '/account/environments'
                },
                { id: 'settings-users', label: 'Users management', path: '/account/users' },
                { id: 'settings-teams', label: 'Teams and permissions', path: '/account/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', path: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity history', path: '/account/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', path: '/account/billing' },
                { id: 'settings-invoices', label: 'Invoices' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const recentRows = [
    {
      key: 'resources/1020655',
      name: 'resource-01',
      icon: 'pi pi-box',
      typeLabel: 'Resource',
      navId: 'resources'
    },
    {
      key: 'domains/domain-1020655',
      name: 'app.example.com',
      icon: 'pi pi-globe',
      typeLabel: 'Domain',
      navId: 'domains'
    },
    {
      key: 'databases/feature-flags',
      name: 'feature-flags',
      icon: 'pi pi-database',
      typeLabel: 'Database',
      navId: 'databases'
    }
  ]

  const accountCommands = [
    { id: 'settings', label: 'Account settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal tokens', icon: 'pi pi-key' },
    { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
    { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
  ]

  const activeId = ref('events')
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)

  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const leaves = (items) =>
    items.flatMap((item) =>
      item.groups
        ? leaves(item.groups.flatMap((group) => group.items))
        : item.children
          ? leaves(item.children)
          : [item]
    )

  const paletteGroups = navGroups.flatMap((group, groupIndex) => {
    const blocks = []
    let run = []
    const flush = () => {
      if (run.length) {
        blocks.push({
          key: `area-${groupIndex}-${blocks.length}`,
          heading: group.label ?? '',
          items: leaves(run)
        })
      }
      run = []
    }
    for (const item of group.items) {
      if (item.groups || item.children) {
        flush()
        blocks.push({ key: item.id, heading: item.label, items: leaves([item]) })
      } else run.push(item)
    }
    flush()
    return blocks
  })

  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )

  const actionCommands = computed(() => [
    { id: 'create', label: 'Create Resource', icon: 'pi pi-plus-circle' },
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar',
      icon: railCollapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'
    }
  ])

  const onNavigate = (event, node) => {
    activeId.value = node.id
  }

  const onMobileNavigate = (event, node) => {
    onNavigate(event, node)
    navOpen.value = false
  }

  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') activeId.value = id
    if (scope === 'res') {
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }

  const referenceNow = Date.UTC(2026, 10, 10, 14, 30)

  const minutesAgo = (minutes) => new Date(referenceNow - minutes * 60 * 1000)

  const dayFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC'
  })
  const clockFormat = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  })
  const axisFormat = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  })
  const isDate = (value) => value instanceof Date && !Number.isNaN(value.getTime())

  const formatEventTime = (date) =>
    isDate(date) ? `${dayFormat.format(date)}, ${clockFormat.format(date)}` : ''

  const formatEventClock = (date) => (isDate(date) ? axisFormat.format(date) : '')

  const eventSources = {
    http: 'HTTP Requests',
    security: 'Security',
    services: 'Services',
    access: 'Access Control'
  }

  const eventSourceOptions = Object.entries(eventSources).map(([value, label]) => ({
    value,
    label
  }))

  const eventLevels = { Error: 'danger', Warning: 'warning', Info: 'info', Debug: 'secondary' }

  const eventLevelSeverity = (level) => eventLevels[level] ?? 'secondary'

  const levelOrder = Object.keys(eventLevels)

  const eventLevelOptions = levelOrder.map((value) => ({ value, label: value }))

  const eventPeriods = [
    { value: '15m', label: 'Last 15 minutes' },
    { value: '1h', label: 'Last hour' },
    { value: '6h', label: 'Last 6 hours' },
    { value: '24h', label: 'Last 24 hours' },
    { value: 'custom', label: 'Custom range', custom: true }
  ]

  const periodMinutes = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

  const fullWindowMinutes = periodMinutes['24h']

  const withinRange = (date, range) => {
    if (!range) return true
    const { start, end } = range
    if (!start && !end) return true
    if (!isDate(date)) return false
    if (start && date.getTime() < start.getTime()) return false
    if (end) {
      const midnight =
        end.getHours() === 0 &&
        end.getMinutes() === 0 &&
        end.getSeconds() === 0 &&
        end.getMilliseconds() === 0
      const bound = midnight
        ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
        : end
      if (date.getTime() > bound.getTime()) return false
    }
    return true
  }

  const periodRange = (value, now = new Date(referenceNow)) => {
    if (value && typeof value === 'object') {
      return { start: value.start ?? null, end: value.end ?? now }
    }
    const minutes = periodMinutes[value] ?? fullWindowMinutes
    return { start: new Date(now.getTime() - minutes * 60000), end: now }
  }

  const matchPeriod = (date, values) => {
    const [period] = values ?? []
    if (!period || period === 'custom' || !isDate(date)) return true
    return withinRange(date, periodRange(period))
  }

  const formatPeriod = (value) => {
    if (!value || typeof value !== 'object') return ''
    const { start, end } = value
    if (!start) return end ? `Until ${formatEventClock(end)}` : ''
    const sameDay = end && dayFormat.format(start) === dayFormat.format(end)
    const from = `${dayFormat.format(start)}, ${formatEventClock(start)}`
    if (!end) return `Since ${from}`
    return sameDay
      ? `${from} to ${formatEventClock(end)}`
      : `${from} to ${dayFormat.format(end)}, ${formatEventClock(end)}`
  }

  const eventFieldCategories = [
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

  const eventFields = [
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
      format: (value) => value.toLocaleString('en-US')
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

  const eventField = (id) => eventFields.find((field) => field.id === id)

  const formatEventValue = (field, value) => {
    if (value === undefined || value === null || value === '') return '—'
    return field?.format ? field.format(value) : String(value)
  }

  const hosts = [
    'example.com',
    'api.example.com',
    'staging.example.com',
    'legacy.example.com',
    'cdn.example.com'
  ]
  const addresses = [
    '45.132.11.9',
    '189.6.44.12',
    '201.17.88.3',
    '177.92.10.55',
    '91.220.4.18',
    '200.147.3.21',
    '138.99.7.42'
  ]
  const countries = ['Brazil', 'United States', 'Portugal', 'Germany', 'Chile']
  const agents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'curl/8.12.1',
    'Health-Check/1.0'
  ]
  const cacheStatuses = ['HIT', 'MISS', 'BYPASS', 'EXPIRED']
  const resources = ['res-3f9a21', 'res-77c40b', 'res-91de55']

  const eventTemplates = [
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

  const sequence = (seed) => {
    let state = seed
    return (length) => {
      state = (state * 1103515245 + 12345) % 2147483648
      return state % length
    }
  }

  const eventCount = 1500
  const seedWindowMinutes = 1436

  const ageFraction = (u) => (4 - Math.sqrt(16 - 15 * u)) / 3

  const calmTemplates = eventTemplates.filter((template) => template.level !== 'Error')
  const errorTemplates = eventTemplates.filter((template) => template.level === 'Error')
  const rotation = [...calmTemplates, ...calmTemplates, ...errorTemplates]

  const seedEvents = () => {
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

  const searchEvents = (list, term) => {
    const needle = term.trim().toLowerCase()
    if (!needle) return list
    return list.filter((event) =>
      eventFields.some((field) => {
        const value = event[field.id]
        return value !== undefined && String(value).toLowerCase().includes(needle)
      })
    )
  }

  const fieldValueCounts = (list, id) => {
    const counts = new Map()
    for (const event of list) {
      const value = event[id]
      if (value === undefined || value === null || value === '') continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
  }

  const countFieldValues = (list, id) => {
    const values = new Set()
    for (const event of list) {
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

  const eventBuckets = (list, range) => {
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

  const eventSummary = (list) => {
    const errors = list.filter((event) => event.level === 'Error').length
    const timed = list.filter((event) => typeof event.requestTimeMs === 'number')
    return {
      total: list.length,
      errors,
      errorShare: list.length ? errors / list.length : 0,
      avgRequestTimeMs: timed.length
        ? Math.round(timed.reduce((sum, event) => sum + event.requestTimeMs, 0) / timed.length)
        : null
    }
  }

  const isApplied = (state, field) => Boolean(state[field.id]?.length)

  const summarize = (field, values = []) => {
    if (!values.length) return null
    const first = field.options?.find((option) => option.value === values[0])
    if (first) return { label: first.label, extra: values.length - 1 }
    const label = field.formatValue ? field.formatValue(values[0]) : String(values[0])
    return { label, extra: values.length - 1 }
  }

  const summarizeText = (field, values = []) => {
    const parts = summarize(field, values)
    if (!parts) return ''
    return parts.extra ? `${parts.label} +${parts.extra}` : parts.label
  }

  const toggleValue = (state, field, value) => {
    const current = state[field.id] ?? []
    if (field.kind === 'range') {
      return { ...state, [field.id]: current[0] === value ? [] : [value] }
    }
    return {
      ...state,
      [field.id]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    }
  }

  const clearField = (state, field) => {
    const next = { ...state }
    delete next[field.id]
    return next
  }

  const events = ref(seedEvents())

  const baseFilterFields = [
    {
      id: 'period',
      label: 'Period',
      kind: 'range',
      options: eventPeriods,
      formatValue: formatPeriod,
      match: (event, values) => matchPeriod(event.at, values)
    },
    {
      id: 'source',
      label: 'Source',
      kind: 'options',
      options: eventSourceOptions,
      match: (event, values) => values.includes(event.source)
    },
    {
      id: 'level',
      label: 'Level',
      kind: 'options',
      options: eventLevelOptions,
      match: (event, values) => values.includes(event.level)
    }
  ]

  const baseFilterIds = new Set(baseFilterFields.map((field) => field.id))

  const filters = ref({ period: ['24h'] })
  const exclusions = ref({ host: ['legacy.example.com'] })
  const search = ref('')
  const pagination = ref({ pageIndex: 0, pageSize: 25 })

  const activeFieldIds = computed(() =>
    Object.keys(filters.value).filter((id) => !baseFilterIds.has(id) && filters.value[id]?.length)
  )

  const filterFields = computed(() => [
    ...baseFilterFields,
    ...activeFieldIds.value.map((id) => {
      const field = eventField(id)
      return {
        id,
        label: field?.label ?? id,
        kind: 'options',
        options: fieldValueCounts(events.value, id).map(({ value }) => ({
          value,
          label: formatEventValue(field, value)
        })),
        match: (event, values) => values.includes(event[id])
      }
    })
  ])

  const filteredEvents = computed(() =>
    events.value.filter(
      (event) =>
        filterFields.value.every((field) => {
          const values = filters.value[field.id]
          if (!values?.length) return true
          return field.match(event, values)
        }) && Object.entries(exclusions.value).every(([id, values]) => !values.includes(event[id]))
    )
  )

  watch([filters, exclusions], () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const loading = ref(false)
  let refreshTimer = null
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const tableRef = ref(null)
  const exportCsv = () => tableRef.value?.exportCsv({ filename: 'events.csv' })

  const matchedEvents = computed(() => searchEvents(filteredEvents.value, search.value))

  watch(search, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const appliedPeriod = computed(() => filters.value.period?.[0] ?? '')

  const activeWindow = computed(() => periodRange(appliedPeriod.value))

  const windowLabel = computed(() => {
    const period = appliedPeriod.value
    if (period && typeof period === 'object') return formatPeriod(period)
    return eventPeriods.find((option) => option.value === period)?.label ?? 'Last 24 hours'
  })

  const selectTimeRange = ({ start, end }) => {
    filters.value = { ...filters.value, period: [{ start, end }] }
  }

  const buckets = computed(() => eventBuckets(matchedEvents.value, activeWindow.value))
  const summary = computed(() => eventSummary(matchedEvents.value))

  const errorShareLabel = computed(() =>
    summary.value.total ? `${(summary.value.errorShare * 100).toFixed(1)}% of events` : 'none'
  )

  const shownColumns = ref(['host', 'status', 'remoteAddress'])
  const fieldsCollapsed = ref(false)
  const fieldSearch = ref('')

  const matchesFieldSearch = (field) => {
    const term = fieldSearch.value.trim().toLowerCase()
    if (!term) return true
    return field.label.toLowerCase().includes(term) || field.id.toLowerCase().includes(term)
  }

  const shownFields = computed(() => [
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

  const categoryFilterCount = (category) =>
    category.fields.filter((field) => filters.value[field.id]?.length).length

  const openCategories = ref(['request'])

  const collapsedBeforeSearch = ref(null)
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

  const canFilterField = (field) => !unfilterableFields.has(field.id)

  const topFieldValues = (id) => fieldValueCounts(matchedEvents.value, id).slice(0, topValues)

  const fieldValueOverflow = (id) =>
    Math.max(0, countFieldValues(matchedEvents.value, id) - topValues)

  const isValueApplied = (id, value) => (filters.value[id] ?? []).includes(value)

  const toggleColumn = (id) => {
    shownColumns.value = shownColumns.value.includes(id)
      ? shownColumns.value.filter((shown) => shown !== id)
      : [...shownColumns.value, id]
  }

  const toggleFieldValue = (id, value) => {
    const current = filters.value[id] ?? []
    const next = current.includes(value)
      ? current.filter((applied) => applied !== value)
      : [...current, value]
    filters.value = { ...filters.value, [id]: next }
  }

  const toColumn = (field) => ({
    accessorKey: field.id,
    header: field.label,
    enableSorting: true,
    ...(field.principal ? { principal: true } : {}),
    ...(field.grow ? { grow: field.grow } : {}),
    ...(field.minWidth ? { minWidth: field.minWidth } : {}),
    ...(field.align ? { align: field.align } : {})
  })

  const columns = computed(() => [
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

  const statusTone = (status) => {
    if (typeof status !== 'number') return null
    if (status >= 500) return 'error'
    if (status >= 400) return 'warn'
    return 'ok'
  }

  const selectedId = ref(matchedEvents.value.find((event) => event.level === 'Error')?.id ?? '')
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedId.value) ?? null
  )
  const documentEvent = ref(null)
  watch(
    selectedEvent,
    (event) => {
      if (event) documentEvent.value = event
    },
    { immediate: true }
  )

  const logMinWidth = 480
  const documentMinWidth = 348
  const fieldsPanelWidth = 268

  const explorerEl = ref(null)
  const explorerWidth = ref(0)
  let explorerObserver = null

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
    documentEvent.value = null
    documentDrawerOpen.value = false
  }

  const openDocument = (event, row) => {
    selectedId.value = row.id
    documentDrawerOpen.value = !isWide.value
  }

  const documentCollapsed = computed({
    get: () => !documentEvent.value,
    set: (collapsed) => {
      if (collapsed) closeDocument()
    }
  })

  watch(documentDrawerOpen, (open) => {
    if (!open && !isWide.value) closeDocument()
  })

  const fieldsWidth = ref(fieldsPanelWidth)
  const documentWidth = ref(400)

  const documentMaxWidth = computed(() => {
    if (explorerWidth.value === 0) return Infinity
    const fieldsUsed = showFieldsPanel.value && !fieldsCollapsed.value ? fieldsWidth.value : 0
    return Math.max(documentMinWidth, explorerWidth.value - fieldsUsed - logMinWidth)
  })

  watch(
    [documentMaxWidth, documentWidth],
    ([max, width]) => {
      if (width > max) documentWidth.value = max
    },
    { flush: 'sync' }
  )

  const hasEventValue = (event, id) => {
    const value = event[id]
    return value !== undefined && value !== null && value !== ''
  }

  const documentQuery = ref('')

  watch(selectedId, () => {
    documentQuery.value = ''
  })

  const highlightParts = (text, term) => {
    if (!term) return [{ text, hit: false }]
    const parts = []
    const lower = text.toLowerCase()
    let from = 0
    let at = lower.indexOf(term)
    while (at !== -1) {
      if (at > from) parts.push({ text: text.slice(from, at), hit: false })
      parts.push({ text: text.slice(at, at + term.length), hit: true })
      from = at + term.length
      at = lower.indexOf(term, from)
    }
    if (from < text.length) parts.push({ text: text.slice(from), hit: false })
    return parts
  }

  const documentFields = computed(() => {
    const event = documentEvent.value
    if (!event) return []
    const term = documentQuery.value.trim().toLowerCase()
    return eventFields
      .filter((field) => hasEventValue(event, field.id))
      .map((field) => {
        const value = formatEventValue(field, event[field.id])
        return {
          id: field.id,
          label: field.label,
          raw: event[field.id],
          value,
          parts: highlightParts(value, term),
          filterable: canFilterField(field)
        }
      })
      .filter(
        (row) =>
          !term ||
          row.label.toLowerCase().includes(term) ||
          row.id.toLowerCase().includes(term) ||
          row.value.toLowerCase().includes(term)
      )
  })

  const documentFieldCount = computed(() =>
    documentEvent.value
      ? eventFields.filter((field) => hasEventValue(documentEvent.value, field.id)).length
      : 0
  )

  const documentStatus = computed(() => {
    if (!documentQuery.value.trim()) return ''
    const count = documentFields.value.length
    return `${count} of ${documentFieldCount.value} fields match.`
  })

  const shownFieldsJson = computed(() =>
    JSON.stringify(
      Object.fromEntries(documentFields.value.map((row) => [row.id, row.raw])),
      null,
      2
    )
  )

  const isIncluded = (id, value) => (filters.value[id] ?? []).includes(value)

  const isExcluded = (id, value) => (exclusions.value[id] ?? []).includes(value)

  const without = (list = [], value) => list.filter((item) => item !== value)

  const includeValue = (id, value) => {
    const current = filters.value[id] ?? []
    filters.value = {
      ...filters.value,
      [id]: current.includes(value) ? without(current, value) : [...current, value]
    }
    exclusions.value = { ...exclusions.value, [id]: without(exclusions.value[id], value) }
  }

  const excludeValue = (id, value) => {
    const current = exclusions.value[id] ?? []
    exclusions.value = {
      ...exclusions.value,
      [id]: current.includes(value) ? without(current, value) : [...current, value]
    }
    filters.value = { ...filters.value, [id]: without(filters.value[id], value) }
  }

  const exclusionChips = computed(() =>
    Object.entries(exclusions.value).flatMap(([id, values]) => {
      const field = eventField(id)
      return values.map((value) => ({
        key: `${id}:${value}`,
        id,
        value,
        label: field?.label ?? id,
        text: formatEventValue(field, value)
      }))
    })
  )

  const removeExclusion = (id, value) => {
    exclusions.value = { ...exclusions.value, [id]: without(exclusions.value[id], value) }
  }

  const documentTabs = computed(() => {
    const event = documentEvent.value
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

  const levelColors = { Error: 'danger', Warning: 'warning', Info: 'info', Debug: 'other' }

  const volumeLabels = computed(() => buckets.value.map((bucket) => bucket.at))

  const volumeSeries = computed(() =>
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

  const selectVolume = (span) => {
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

  const filterCount = computed(
    () => Object.values(filters.value).filter((values) => values?.length).length
  )

  const filterOpen = ref(false)
  const filterFieldId = ref(null)
  const filterQuery = ref('')
  const filterPanel = ref(null)
  const filterRoot = ref(null)
  const filterOriginId = ref(null)
  const filterDirection = ref('forward')
  const customFieldId = ref(null)
  const calendarOpen = ref(false)
  const customRange = ref(null)

  const customFilterField = computed(() =>
    filterFields.value.find((field) => field.id === customFieldId.value)
  )

  const filterField = computed(
    () =>
      filterFields.value.find((field) => field.id === filterFieldId.value) ??
      customFilterField.value
  )

  const filterLevel = computed(() => {
    if (customFieldId.value) return `custom:${customFieldId.value}`
    return filterFieldId.value ? `values:${filterFieldId.value}` : 'fields'
  })

  const filterRegion = ref(null)
  const filterRegionHeight = ref('')
  let releaseFilterHeight = null

  const animateFilterHeight = async (mutate) => {
    const node = filterRegion.value
    if (!node || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      mutate()
      return
    }
    releaseFilterHeight?.()
    const from = node.offsetHeight
    mutate()
    await nextTick()
    const to = node.offsetHeight
    if (to === from) return
    filterRegionHeight.value = `${from}px`
    let timer = null
    const finish = () => {
      node.removeEventListener('transitionend', onEnd)
      clearTimeout(timer)
      filterRegionHeight.value = ''
      releaseFilterHeight = null
    }
    const onEnd = (event) => {
      if (event.propertyName === 'height' && event.target === node) finish()
    }
    node.addEventListener('transitionend', onEnd)
    timer = setTimeout(finish, 600)
    releaseFilterHeight = finish
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (releaseFilterHeight === finish) filterRegionHeight.value = `${to}px`
      })
    )
  }

  const toFilterLevel = (direction, mutate) => {
    filterDirection.value = direction
    animateFilterHeight(mutate)
  }

  const filterRows = computed(() => {
    const term = filterQuery.value.trim().toLowerCase()
    const source = filterField.value ? (filterField.value.options ?? []) : filterFields.value
    if (!term) return source
    return source.filter((row) => row.label.toLowerCase().includes(term))
  })

  const isPicked = (value) => (filters.value[filterFieldId.value] ?? []).includes(value)

  const enterFilterField = (fieldId) => {
    filterOriginId.value = fieldId
    if (filterOpen.value) {
      toFilterLevel('forward', () => {
        filterFieldId.value = fieldId
        filterQuery.value = ''
      })
      return
    }
    filterFieldId.value = fieldId
    filterQuery.value = ''
    filterOpen.value = true
  }

  const backToFields = () => {
    toFilterLevel('back', () => {
      filterFieldId.value = null
      filterQuery.value = ''
    })
  }

  const focusFilterOrigin = async (id) => {
    await nextTick()
    const field = id ? filterFields.value.find((item) => item.id === id) : null
    const chip =
      field && isApplied(filters.value, field)
        ? document.querySelector(`[data-filter-chip="${id}"]`)
        : null
    ;(chip ?? filterRoot.value?.querySelector('[data-testid="filter-button__trigger"]'))?.focus()
  }

  watch(filterOpen, (isOpen) => {
    if (isOpen) return
    filterFieldId.value = null
    customFieldId.value = null
    calendarOpen.value = false
    customRange.value = null
    filterQuery.value = ''
    filterDirection.value = 'forward'
    const id = filterOriginId.value
    filterOriginId.value = null
    focusFilterOrigin(id)
  })

  const pickFilterOption = (field, option) => {
    if (option.custom) {
      toFilterLevel('forward', () => {
        customFieldId.value = field.id
      })
      calendarOpen.value = true
      return
    }
    filters.value = toggleValue(filters.value, field, option.value)
    if (field.kind === 'range') backToFields()
  }

  const leaveCustomRange = () => {
    calendarOpen.value = false
    customRange.value = null
    toFilterLevel('back', () => {
      customFieldId.value = null
    })
  }

  const commitCustomRange = (range) => {
    const field = customFilterField.value
    if (!field) return
    const next = { ...filters.value }
    if (range?.start || range?.end) next[field.id] = [range]
    else delete next[field.id]
    filters.value = next
    const id = field.id
    leaveCustomRange()
    backToFields()
    filterOpen.value = false
    focusFilterOrigin(id)
  }

  const clearFilterField = (field) => {
    filters.value = clearField(filters.value, field)
  }

  const filterLevelRows = () => [
    ...(filterPanel.value?.querySelectorAll(
      `[data-level="${filterLevel.value}"] [data-filter-row]`
    ) ?? [])
  ]

  const moveFilterFocus = (event, step) => {
    const items = filterLevelRows()
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(event.target)
    items[(index + step + items.length) % items.length]?.focus()
  }

  watch(filterLevel, async () => {
    await nextTick()
    filterLevelRows()[0]?.focus()
  })

  const filterChips = computed(() =>
    filterFields.value.filter((field) => isApplied(filters.value, field))
  )

  const summarizeFilter = (field) => summarize(field, filters.value[field.id])

  onBeforeUnmount(() => {
    clearTimeout(refreshTimer)
    explorerObserver?.disconnect()
  })
</script>

<template>
  <div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
    <div class="hidden h-full [--sidebar-width:var(--container-2xs)] md:flex">
      <Sidebar
        v-model:width="railWidth"
        v-model:collapsed="railCollapsed"
        resizable
        collapsible
        aria-label="Main navigation"
        collapse-aria-label="Collapse sidebar"
        expand-aria-label="Expand sidebar"
        resize-aria-label="Resize sidebar"
      >
        <template #header>
          <div class="-m-(--spacing-md) flex flex-col">
            <div
              class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
            >
              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </div>

            <Command
              v-model:open="paletteOpen"
              @select="onPaletteSelect"
            >
              <Command.Input
                placeholder="Search resources, pages and commands"
                @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
              />
              <Command.List>
                <Command.Group
                  v-if="!paletteQuery"
                  key="recents"
                  heading="Recents"
                >
                  <Command.Item
                    v-for="row in recentRows"
                    :key="row.key"
                    :value="'res:' + row.key"
                  >
                    <template #prefix>
                      <i
                        :class="row.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ row.name }}
                    <template #suffix>
                      <span class="text-label-sm text-(--text-muted)">{{ row.typeLabel }}</span>
                    </template>
                  </Command.Item>
                </Command.Group>

                <Command.Separator
                  v-if="!paletteQuery"
                  key="recents-rule"
                />

                <Command.Group
                  v-for="group in paletteGroups"
                  :key="group.key"
                  :heading="group.heading"
                >
                  <Command.Item
                    v-for="item in group.items"
                    :key="item.id"
                    :value="'nav:' + item.id"
                  >
                    <template
                      v-if="item.icon"
                      #prefix
                    >
                      <i
                        :class="item.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ item.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Separator key="commands-rule" />

                <Command.Group heading="Actions">
                  <Command.Item
                    v-for="command in actionCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Account">
                  <Command.Item
                    v-for="command in accountCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Empty>No resource, page or command matches your search.</Command.Empty>
              </Command.List>
            </Command>
          </div>
        </template>

        <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
          <Menu
            :groups="navGroups"
            :active-id="activeId"
            role="presentation"
            @navigate="onNavigate"
          >
            <Menu.Back />
          </Menu>
        </div>

        <template #footer>
          <div class="flex items-center gap-(--spacing-xs)">
            <Avatar
              label="alex@example.com"
              size="small"
              kind="square"
            />
            <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">alex</span>
            <DropdownMenu placement="top-end">
              <DropdownMenu.Trigger>
                <Tooltip text="Account menu">
                  <IconButton
                    icon="pi pi-ellipsis-v"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <template #top>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">alex</span>
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
                  </div>
                </template>
                <DropdownMenu.Option
                  value="settings"
                  label="Account settings"
                >
                  <template #right>
                    <i
                      class="pi pi-cog"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="personal-tokens"
                  label="Personal tokens"
                >
                  <template #right>
                    <i
                      class="pi pi-key"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div
                  class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                >
                  <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model="theme"
                    aria-label="Theme"
                  />
                </div>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="home"
                  label="Home page"
                >
                  <template #right>
                    <i
                      class="pi pi-home"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="changelog"
                  label="Changelog"
                >
                  <template #right>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="feedback"
                  label="Feedback"
                >
                  <template #right>
                    <i
                      class="pi pi-comment"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="docs"
                  label="Docs"
                >
                  <template #right>
                    <i
                      class="pi pi-book"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="logout"
                  label="Log out"
                >
                  <template #right>
                    <i
                      class="pi pi-sign-out"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)">
                  <Button
                    label="Upgrade to Pro"
                    kind="secondary"
                    size="medium"
                    class="w-full"
                  />
                  <div class="flex justify-center px-(--spacing-xs)">
                    <StatusIndicator
                      severity="success"
                      label="All systems normal"
                    />
                  </div>
                </div>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </template>
      </Sidebar>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="@container">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left>
            <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
              <span class="contents md:hidden">
                <Tooltip
                  text="Open navigation"
                  placement="bottom"
                >
                  <IconButton
                    icon="pi pi-bars"
                    aria-label="Open navigation"
                    kind="outlined"
                    size="medium"
                    @click="navOpen = true"
                  />
                </Tooltip>
              </span>

              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </div>
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <SearchTrigger
              collapsible
              @open="paletteOpen = true"
            />

            <span class="contents md:hidden">
              <Tooltip
                text="Create"
                placement="bottom"
              >
                <IconButton
                  icon="pi pi-plus-circle"
                  kind="primary"
                  size="medium"
                  aria-label="Create"
                />
              </Tooltip>
              <Tooltip
                text="Agent"
                placement="bottom"
              >
                <IconButton
                  icon="ai ai-ask-azion"
                  kind="outlined"
                  size="medium"
                  aria-label="Agent"
                />
              </Tooltip>
            </span>
            <span class="hidden md:contents">
              <Button
                label="Create"
                kind="primary"
                size="medium"
                icon="pi pi-plus-circle"
              />
              <ButtonHighlight
                label="Agent"
                size="medium"
                icon="ai ai-ask-azion"
              />
            </span>

            <button
              type="button"
              aria-label="Account settings"
              class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                label="alex@example.com"
                size="medium"
                kind="square"
              />
            </button>
          </GlobalHeader.Right>
        </GlobalHeader>
      </div>

      <div class="min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
        <main class="flex h-full min-h-0 flex-col">
          <header
            class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
          >
            <header class="flex items-center gap-(--layout-group-gap)">
              <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
                <div
                  ref="filterRoot"
                  class="flex shrink-0 items-center"
                  data-testid="filter-button"
                >
                  <Popover
                    v-model:open="filterOpen"
                    placement="bottom-start"
                    :dismissible="!calendarOpen"
                    class="shrink-0"
                  >
                    <div class="relative">
                      <Popover.Trigger>
                        <Button
                          label="Filter"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-filter"
                          data-testid="filter-button__trigger"
                        />
                        <Transition
                          enter-from-class="scale-75 opacity-0"
                          enter-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
                          leave-to-class="scale-75 opacity-0"
                          leave-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                        >
                          <div
                            v-if="filterCount"
                            class="pointer-events-none absolute -top-2 -end-2 min-w-5"
                          >
                            <Badge
                              :label="String(filterCount)"
                              severity="primary"
                              size="small"
                              aria-hidden="true"
                              data-testid="filter-button__count"
                              class="w-full"
                            />
                          </div>
                        </Transition>
                      </Popover.Trigger>
                    </div>

                    <Popover.Content>
                      <div
                        ref="filterPanel"
                        class="flex flex-col"
                        @keydown.down="moveFilterFocus($event, 1)"
                        @keydown.up="moveFilterFocus($event, -1)"
                      >
                        <div
                          ref="filterRegion"
                          :style="{ height: filterRegionHeight }"
                          class="relative overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        >
                          <Transition
                            :enter-from-class="
                              filterDirection === 'forward'
                                ? 'translate-x-[12%] opacity-0'
                                : 'translate-x-[-12%] opacity-0'
                            "
                            enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                            :leave-to-class="
                              filterDirection === 'forward'
                                ? 'translate-x-[-12%] opacity-0'
                                : 'translate-x-[12%] opacity-0'
                            "
                            leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                          >
                            <div
                              :key="filterLevel"
                              :data-level="filterLevel"
                              class="flex flex-col"
                            >
                              <div
                                v-if="filterField"
                                class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xs)"
                              >
                                <IconButton
                                  icon="pi pi-angle-left"
                                  kind="outlined"
                                  size="small"
                                  :aria-label="
                                    customFilterField
                                      ? 'Back to date periods'
                                      : 'Back to all filters'
                                  "
                                  @click="customFilterField ? leaveCustomRange() : backToFields()"
                                />
                                <span class="truncate text-label-sm text-(--text-default)">
                                  {{ filterField.label }}
                                </span>
                              </div>

                              <div
                                v-if="customFilterField"
                                class="px-(--spacing-md) py-(--spacing-sm)"
                              >
                                <CalendarRoot
                                  v-model="customRange"
                                  v-model:open="calendarOpen"
                                  mode="range"
                                  size="medium"
                                  :show-fields="false"
                                  placeholder="Select a range"
                                  class="w-full"
                                  @update:model-value="commitCustomRange"
                                />
                              </div>

                              <template v-else>
                                <div class="border-b border-(--border-default) p-(--spacing-xs)">
                                  <Input
                                    v-model="filterQuery"
                                    size="medium"
                                    class="w-full"
                                    :placeholder="
                                      filterField
                                        ? `Filter ${filterField.label.toLowerCase()}`
                                        : 'Filter by'
                                    "
                                    :aria-label="
                                      filterField
                                        ? `Search ${filterField.label} values`
                                        : 'Search filter fields'
                                    "
                                  >
                                    <template #iconLeft>
                                      <i
                                        class="pi pi-search"
                                        aria-hidden="true"
                                      />
                                    </template>
                                  </Input>
                                </div>

                                <div
                                  class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)"
                                >
                                  <template v-if="!filterField">
                                    <button
                                      v-for="field in filterRows"
                                      :key="field.id"
                                      type="button"
                                      data-filter-row
                                      class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                      :aria-expanded="false"
                                      @click="enterFilterField(field.id)"
                                    >
                                      <span class="grow truncate">{{ field.label }}</span>
                                      <span
                                        v-if="isApplied(filters, field)"
                                        class="truncate text-(--text-muted)"
                                      >
                                        {{ summarizeText(field, filters[field.id]) }}
                                      </span>
                                      <i
                                        class="pi pi-angle-right shrink-0 text-(--text-muted)"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </template>

                                  <template v-else>
                                    <button
                                      v-for="option in filterRows"
                                      :key="String(option.value)"
                                      type="button"
                                      data-filter-row
                                      :role="
                                        option.custom
                                          ? undefined
                                          : filterField.kind === 'range'
                                            ? 'menuitemradio'
                                            : 'menuitemcheckbox'
                                      "
                                      :aria-checked="
                                        option.custom ? undefined : isPicked(option.value)
                                      "
                                      class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                      @click="pickFilterOption(filterField, option)"
                                    >
                                      <span class="grow truncate">{{ option.label }}</span>
                                      <i
                                        v-if="option.custom"
                                        class="pi pi-angle-right shrink-0 text-(--text-muted)"
                                        aria-hidden="true"
                                      />
                                      <i
                                        v-else
                                        class="pi pi-check shrink-0 text-(--text-default)"
                                        :class="isPicked(option.value) ? '' : 'invisible'"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </template>

                                  <p
                                    v-if="!filterRows.length"
                                    class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
                                  >
                                    No match for “{{ filterQuery }}”.
                                  </p>
                                </div>

                                <div
                                  v-if="filterField && isApplied(filters, filterField)"
                                  class="border-t border-(--border-default) p-(--spacing-xxs)"
                                >
                                  <button
                                    type="button"
                                    class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                    @click="clearFilterField(filterField)"
                                  >
                                    <i
                                      class="pi pi-filter-slash text-(--text-muted)"
                                      aria-hidden="true"
                                    />
                                    Clear {{ filterField.label }}
                                  </button>
                                </div>
                              </template>
                            </div>
                          </Transition>
                        </div>
                      </div>
                    </Popover.Content>
                  </Popover>
                </div>
                <div class="flex min-w-36 grow basis-(--container-2xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search events, hosts, paths or addresses"
                    aria-label="Search events"
                    class="w-full"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                <Tooltip
                  text="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="pi pi-refresh"
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
                    icon="pi pi-download"
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

            <div
              v-if="filterChips.length || exclusionChips.length"
              class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
              data-testid="filter-chips"
            >
              <TransitionGroup
                move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                enter-from-class="scale-90 opacity-0"
                leave-from-class="scale-100 opacity-100"
                leave-to-class="scale-90 opacity-0"
                leave-active-class="pointer-events-none absolute duration-fast-02 ease-productive-exit motion-reduce:transition-none"
              >
                <span
                  v-for="field in filterChips"
                  :key="field.id"
                  class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                >
                  <Chip
                    :data-filter-chip="field.id"
                    :label="field.label"
                    kind="filled"
                    size="medium"
                    clickable
                    removable
                    @click="enterFilterField(field.id)"
                    @remove="clearFilterField(field)"
                  >
                    <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <span class="truncate text-(--text-muted)">{{ field.label }}</span>
                      <span class="truncate">{{ summarizeFilter(field)?.label }}</span>
                      <span
                        v-if="summarizeFilter(field)?.extra"
                        class="shrink-0 text-(--text-muted)"
                      >
                        +{{ summarizeFilter(field).extra }}
                      </span>
                    </span>
                  </Chip>
                </span>
              </TransitionGroup>
              <span
                v-for="chip in exclusionChips"
                :key="chip.key"
                class="inline-flex w-fit max-w-full"
              >
                <Chip
                  :label="`${chip.label} is not ${chip.text}`"
                  kind="filled"
                  size="medium"
                  removable
                  data-testid="exclusion-chip"
                  @remove="removeExclusion(chip.id, chip.value)"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                    <span class="truncate text-(--text-muted)">{{ chip.label }} is not</span>
                    <span class="truncate">{{ chip.text }}</span>
                  </span>
                </Chip>
              </span>
            </div>
          </header>

          <section
            ref="explorerEl"
            class="animate-content-enter motion-reduce:animate-none relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
          >
            <div
              v-if="showFieldsPanel"
              key="fields-panel"
              class="contents [--sidebar-width:var(--container-2xs)]"
            >
              <Sidebar
                v-model:collapsed="fieldsCollapsed"
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
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                </template>

                <div>
                  <div
                    class="flex items-baseline justify-between gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xxs) pt-(--spacing-xxs)"
                  >
                    <span class="text-label-sm text-(--text-muted)">Shown</span>
                    <span class="text-label-sm text-(--text-muted)">Values</span>
                  </div>

                  <div
                    v-for="field in shownFields"
                    :key="field.id"
                    class="group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
                  >
                    <div class="min-w-0 flex-1">
                      <Field
                        orientation="horizontal"
                        :disabled="field.locked"
                      >
                        <Checkbox
                          binary
                          :model-value="true"
                          :input-id="`event-field-${field.id}`"
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
                        <div class="flex min-w-0 flex-col p-(--spacing-xxs)">
                          <p
                            class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
                          >
                            {{ field.label }} · top values
                          </p>

                          <button
                            v-for="entry in topFieldValues(field.id)"
                            :key="String(entry.value)"
                            type="button"
                            role="menuitemcheckbox"
                            :aria-checked="isValueApplied(field.id, entry.value)"
                            :data-applied="isValueApplied(field.id, entry.value) || null"
                            class="flex min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xxs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-applied:bg-(--bg-selected) motion-reduce:transition-none"
                            @click="toggleFieldValue(field.id, entry.value)"
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
                              class="pi pi-check shrink-0 text-(--primary)"
                              aria-hidden="true"
                            />
                          </button>

                          <p
                            v-if="fieldValueOverflow(field.id)"
                            class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                          >
                            {{ fieldValueOverflow(field.id) }} more values in this window.
                          </p>
                        </div>
                      </Popover.Content>
                    </Popover>

                    <span
                      v-else
                      class="shrink-0 px-(--spacing-xxs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
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
                            class="group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
                          >
                            <div class="min-w-0 flex-1">
                              <Field orientation="horizontal">
                                <Checkbox
                                  binary
                                  :model-value="false"
                                  :input-id="`event-field-${field.id}`"
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
                                <div class="flex min-w-0 flex-col p-(--spacing-xxs)">
                                  <p
                                    class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
                                  >
                                    {{ field.label }} · top values
                                  </p>

                                  <button
                                    v-for="entry in topFieldValues(field.id)"
                                    :key="String(entry.value)"
                                    type="button"
                                    role="menuitemcheckbox"
                                    :aria-checked="isValueApplied(field.id, entry.value)"
                                    :data-applied="isValueApplied(field.id, entry.value) || null"
                                    class="flex min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xxs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-applied:bg-(--bg-selected) motion-reduce:transition-none"
                                    @click="toggleFieldValue(field.id, entry.value)"
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
                                      class="pi pi-check shrink-0 text-(--primary)"
                                      aria-hidden="true"
                                    />
                                  </button>

                                  <p
                                    v-if="fieldValueOverflow(field.id)"
                                    class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                                  >
                                    {{ fieldValueOverflow(field.id) }} more values in this window.
                                  </p>
                                </div>
                              </Popover.Content>
                            </Popover>

                            <span
                              v-else
                              class="shrink-0 px-(--spacing-xxs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
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
                        {{ summary.total.toLocaleString('en-US') }}
                      </dd>
                    </div>
                    <div class="flex flex-col">
                      <dt class="text-label-sm text-(--text-muted)">Errors</dt>
                      <dd
                        class="m-0 text-heading-xs tabular-nums text-(--text-default) data-raised:text-(--danger-contrast)"
                        :data-raised="summary.errors ? true : null"
                        :aria-label="`${summary.errors} errors, ${errorShareLabel}`"
                      >
                        {{ summary.errors.toLocaleString('en-US') }}
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
                  <Chart.Bar stacked />
                  <Chart.Crosshair />
                  <Chart.Tooltip />
                </Chart>
              </section>

              <section class="flex min-h-0 min-w-0 flex-1 flex-col">
                <div class="flex min-h-0 flex-1">
                  <TableRoot
                    ref="tableRef"
                    v-model:pagination="pagination"
                    :data="matchedEvents"
                    :columns="columns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="25"
                    :bordered="false"
                    header-kind="compact"
                    max-height="100%"
                    class="w-full"
                    :loading="loading"
                    @row-click="openDocument"
                  >
                    <template #header-detail>
                      <span class="sr-only">Open the event document</span>
                    </template>

                    <template #cell-detail="{ row }">
                      <i
                        class="pi pi-angle-right text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance data-open:rotate-90 data-open:text-(--primary) motion-reduce:transition-none"
                        :data-open="row.id === selectedId || null"
                        aria-hidden="true"
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
                      <Table.CellStatus
                        :label="value"
                        :severity="eventLevelSeverity(value)"
                      />
                    </template>

                    <template #cell-message="{ value }">
                      <span class="min-w-0 truncate text-(--text-default)">{{ value }}</span>
                    </template>

                    <template #cell-status="{ value }">
                      <span
                        class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-default) data-[tone=error]:text-(--danger-contrast) data-[tone=warn]:text-(--warning-contrast)"
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
                        icon="pi pi-inbox"
                        title="No events yet"
                        description="Events appear here as soon as traffic reaches this workspace's resources."
                      />
                      <EmptyState
                        v-else-if="search.trim()"
                        key="no-match"
                        size="small"
                        icon="pi pi-search"
                        title="No events match this search"
                        description="Clear the search, or widen the period to cover more of the log."
                      />
                      <EmptyState
                        v-else
                        key="no-events"
                        size="small"
                        icon="pi pi-filter-slash"
                        title="No events in this window"
                        description="Widen the period or clear a filter to see more of the log."
                      />
                    </template>
                  </TableRoot>
                </div>
              </section>
            </div>

            <Sidebar
              v-if="isWide"
              key="event-document-panel"
              v-model:width="documentWidth"
              v-model:collapsed="documentCollapsed"
              side="end"
              resizable
              aria-label="Event document"
              resize-aria-label="Resize the event panel"
              min-width-token="--container-xs"
              max-width-token="--container-lg"
            >
              <template #header>
                <div class="flex items-center justify-between gap-(--spacing-xs)">
                  <span class="min-w-0 truncate text-heading-xxs text-(--text-default)">
                    Event
                  </span>
                  <Tooltip text="Close">
                    <IconButton
                      icon="pi pi-times"
                      kind="transparent"
                      size="small"
                      aria-label="Close the event document"
                      @click="closeDocument"
                    />
                  </Tooltip>
                </div>
              </template>

              <div
                v-if="documentEvent"
                class="-m-(--spacing-md)"
                data-testid="event-document"
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
                          size="medium"
                        />
                        <Tag
                          :label="documentEvent.sourceLabel"
                          severity="secondary"
                          size="medium"
                        />
                      </div>
                      <p class="text-body-md text-(--text-default)">{{ documentEvent.message }}</p>
                      <p class="text-label-code-sm tabular-nums text-(--text-muted)">
                        {{ documentEvent.time }}
                      </p>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <div class="min-w-0 flex-1">
                          <Input
                            v-model="documentQuery"
                            size="small"
                            placeholder="Search in this event"
                            aria-label="Search in this event"
                            class="w-full"
                            data-testid="document-search"
                          >
                            <template #iconLeft>
                              <i
                                class="pi pi-search"
                                aria-hidden="true"
                              />
                            </template>
                          </Input>
                        </div>
                        <Tooltip text="Copy the fields shown as JSON">
                          <CopyButton
                            :value="shownFieldsJson"
                            kind="outlined"
                            size="small"
                            aria-label="Copy the fields shown as JSON"
                            copied-label="Fields copied as JSON"
                            data-testid="document-copy"
                          />
                        </Tooltip>
                      </div>
                      <p
                        role="status"
                        class="sr-only"
                      >
                        {{ documentStatus }}
                      </p>
                      <dl
                        v-if="documentFields.length"
                        class="flex min-w-0 flex-col"
                        data-testid="document-fields"
                      >
                        <div
                          v-for="row in documentFields"
                          :key="row.id"
                          class="group grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-x-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
                        >
                          <dt class="min-w-0 truncate text-label-sm text-(--text-muted)">
                            {{ row.label }}
                          </dt>
                          <dd class="m-0 flex min-w-0 items-center gap-(--spacing-xs)">
                            <span
                              class="min-w-0 flex-1 break-words text-label-code-sm text-(--text-default)"
                            >
                              <template
                                v-for="(part, index) in row.parts"
                                :key="index"
                              >
                                <mark
                                  v-if="part.hit"
                                  class="rounded-(--shape-elements) bg-(--bg-selected) text-inherit"
                                  >{{ part.text }}</mark
                                >
                                <template v-else>{{ part.text }}</template>
                              </template>
                            </span>
                            <span
                              v-if="row.filterable"
                              class="flex shrink-0 items-center gap-(--spacing-xxs)"
                            >
                              <Tooltip :text="`Filter by ${row.label} ${row.value}`">
                                <IconButton
                                  icon="pi pi-search-plus"
                                  kind="transparent"
                                  size="small"
                                  :aria-label="`Filter by ${row.label} ${row.value}`"
                                  :aria-pressed="isIncluded(row.id, row.raw)"
                                  data-testid="document-include"
                                  @click="includeValue(row.id, row.raw)"
                                />
                              </Tooltip>
                              <Tooltip :text="`Exclude ${row.label} ${row.value}`">
                                <IconButton
                                  icon="pi pi-search-minus"
                                  kind="transparent"
                                  size="small"
                                  :aria-label="`Exclude ${row.label} ${row.value}`"
                                  :aria-pressed="isExcluded(row.id, row.raw)"
                                  data-testid="document-exclude"
                                  @click="excludeValue(row.id, row.raw)"
                                />
                              </Tooltip>
                            </span>
                          </dd>
                        </div>
                      </dl>
                      <p
                        v-else
                        class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
                      >
                        No field matches “{{ documentQuery }}”.
                      </p>
                    </div>
                  </div>

                  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                    <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">
                      Event document
                    </h3>
                    <div class="min-w-0">
                      <CodeBlock
                        :tabs="documentTabs"
                        :bordered="false"
                        show-line-numbers
                        copy-aria-label="Copy the event document as JSON"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Sidebar>
          </section>

          <Drawer
            v-model:open="documentDrawerOpen"
            size="medium"
            side="right"
          >
            <DrawerPortal>
              <DrawerOverlay />
              <DrawerContent>
                <PanelHeader class="w-full">
                  <DrawerTitle>Event</DrawerTitle>
                  <DrawerClose />
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
                            size="medium"
                          />
                          <Tag
                            :label="documentEvent.sourceLabel"
                            severity="secondary"
                            size="medium"
                          />
                        </div>
                        <p class="text-body-md text-(--text-default)">
                          {{ documentEvent.message }}
                        </p>
                        <p class="text-label-code-sm tabular-nums text-(--text-muted)">
                          {{ documentEvent.time }}
                        </p>
                      </div>

                      <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <div class="min-w-0 flex-1">
                            <Input
                              v-model="documentQuery"
                              size="small"
                              placeholder="Search in this event"
                              aria-label="Search in this event"
                              class="w-full"
                              data-testid="document-search-drawer"
                            >
                              <template #iconLeft>
                                <i
                                  class="pi pi-search"
                                  aria-hidden="true"
                                />
                              </template>
                            </Input>
                          </div>
                          <Tooltip text="Copy the fields shown as JSON">
                            <CopyButton
                              :value="shownFieldsJson"
                              kind="outlined"
                              size="small"
                              aria-label="Copy the fields shown as JSON"
                              copied-label="Fields copied as JSON"
                              data-testid="document-copy-drawer"
                            />
                          </Tooltip>
                        </div>
                        <p
                          role="status"
                          class="sr-only"
                        >
                          {{ documentStatus }}
                        </p>
                        <dl
                          v-if="documentFields.length"
                          class="flex min-w-0 flex-col"
                          data-testid="document-fields-drawer"
                        >
                          <div
                            v-for="row in documentFields"
                            :key="row.id"
                            class="group grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-x-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
                          >
                            <dt class="min-w-0 truncate text-label-sm text-(--text-muted)">
                              {{ row.label }}
                            </dt>
                            <dd class="m-0 flex min-w-0 items-center gap-(--spacing-xs)">
                              <span
                                class="min-w-0 flex-1 break-words text-label-code-sm text-(--text-default)"
                              >
                                <template
                                  v-for="(part, index) in row.parts"
                                  :key="index"
                                >
                                  <mark
                                    v-if="part.hit"
                                    class="rounded-(--shape-elements) bg-(--bg-selected) text-inherit"
                                    >{{ part.text }}</mark
                                  >
                                  <template v-else>{{ part.text }}</template>
                                </template>
                              </span>
                              <span
                                v-if="row.filterable"
                                class="flex shrink-0 items-center gap-(--spacing-xxs)"
                              >
                                <Tooltip :text="`Filter by ${row.label} ${row.value}`">
                                  <IconButton
                                    icon="pi pi-search-plus"
                                    kind="transparent"
                                    size="small"
                                    :aria-label="`Filter by ${row.label} ${row.value}`"
                                    :aria-pressed="isIncluded(row.id, row.raw)"
                                    data-testid="document-include"
                                    @click="includeValue(row.id, row.raw)"
                                  />
                                </Tooltip>
                                <Tooltip :text="`Exclude ${row.label} ${row.value}`">
                                  <IconButton
                                    icon="pi pi-search-minus"
                                    kind="transparent"
                                    size="small"
                                    :aria-label="`Exclude ${row.label} ${row.value}`"
                                    :aria-pressed="isExcluded(row.id, row.raw)"
                                    data-testid="document-exclude"
                                    @click="excludeValue(row.id, row.raw)"
                                  />
                                </Tooltip>
                              </span>
                            </dd>
                          </div>
                        </dl>
                        <p
                          v-else
                          class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
                        >
                          No field matches “{{ documentQuery }}”.
                        </p>
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                      <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">
                        Event document
                      </h3>
                      <div class="min-w-0">
                        <CodeBlock
                          :tabs="documentTabs"
                          :bordered="false"
                          show-line-numbers
                          copy-aria-label="Copy the event document as JSON"
                          class="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </DrawerPortal>
          </Drawer>
        </main>
      </div>
    </div>

    <Drawer
      v-model:open="navOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent aria-label="Navigation">
          <Sidebar aria-label="Main navigation">
            <template #header>
              <div class="-m-(--spacing-md) flex flex-col">
                <div
                  class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
                >
                  <a
                    href="/home"
                    aria-label="Azion home"
                    class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                  >
                    <Brand
                      kind="default"
                      size="small"
                    />
                  </a>
                </div>
              </div>
            </template>

            <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
              <Menu
                :groups="navGroups"
                :active-id="activeId"
                role="presentation"
                @navigate="onMobileNavigate"
              >
                <Menu.Back />
              </Menu>
            </div>

            <template #footer>
              <div class="flex items-center gap-(--spacing-xs)">
                <Avatar
                  label="alex@example.com"
                  size="small"
                  kind="square"
                />
                <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                  >alex</span
                >
                <DropdownMenu placement="top-end">
                  <DropdownMenu.Trigger>
                    <Tooltip text="Account menu">
                      <IconButton
                        icon="pi pi-ellipsis-v"
                        aria-label="Account menu"
                        kind="outlined"
                        size="small"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <template #top>
                      <div class="flex min-w-0 flex-col">
                        <span class="truncate text-label-md text-(--text-default)">alex</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >alex@example.com</span
                        >
                      </div>
                    </template>
                    <DropdownMenu.Option
                      value="settings"
                      label="Account settings"
                    >
                      <template #right>
                        <i
                          class="pi pi-cog"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="personal-tokens"
                      label="Personal tokens"
                    >
                      <template #right>
                        <i
                          class="pi pi-key"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="home"
                      label="Home page"
                    >
                      <template #right>
                        <i
                          class="pi pi-home"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="changelog"
                      label="Changelog"
                    >
                      <template #right>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="feedback"
                      label="Feedback"
                    >
                      <template #right>
                        <i
                          class="pi pi-comment"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="docs"
                      label="Docs"
                    >
                      <template #right>
                        <i
                          class="pi pi-book"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="logout"
                      label="Log out"
                    >
                      <template #right>
                        <i
                          class="pi pi-sign-out"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)"
                    >
                      <Button
                        label="Upgrade to Pro"
                        kind="secondary"
                        size="medium"
                        class="w-full"
                      />
                      <div class="flex justify-center px-(--spacing-xs)">
                        <StatusIndicator
                          severity="success"
                          label="All systems normal"
                        />
                      </div>
                    </div>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </template>
          </Sidebar>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
