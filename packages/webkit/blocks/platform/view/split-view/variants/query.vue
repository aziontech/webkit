<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Chart from '@aziontech/webkit/chart'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Command from '@aziontech/webkit/command'
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
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
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { matchesQuery } from '@aziontech/webkit/use-collection'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

  const timeZone = ref('UTC')

  const timeZones = ['UTC', 'America/Sao_Paulo', 'America/New_York', 'Europe/Lisbon', 'Asia/Tokyo']

  const zoneFormats = computed(() => {
    const zone = timeZone.value || undefined
    return {
      day: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: zone }),
      clock: new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: zone
      }),
      axis: new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: zone
      })
    }
  })

  const isDate = (value) => value instanceof Date && !Number.isNaN(value.getTime())

  const formatEventTime = (date) =>
    isDate(date)
      ? `${zoneFormats.value.day.format(date)}, ${zoneFormats.value.clock.format(date)}`
      : ''

  const formatEventClock = (date) => (isDate(date) ? zoneFormats.value.axis.format(date) : '')

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

  const fullWindowMinutes = 1440

  const formatPeriod = (value) => {
    if (!value || typeof value !== 'object') return ''
    const { start, end } = value
    if (!start) return end ? `Until ${formatEventClock(end)}` : ''
    const sameDay = end && zoneFormats.value.day.format(start) === zoneFormats.value.day.format(end)
    const from = `${zoneFormats.value.day.format(start)}, ${formatEventClock(start)}`
    if (!end) return `Since ${from}`
    return sameDay
      ? `${from} to ${formatEventClock(end)}`
      : `${from} to ${zoneFormats.value.day.format(end)}, ${formatEventClock(end)}`
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

  const events = ref(seedEvents())

  const valueFields = ['host', 'requestMethod', 'cacheStatus', 'country', 'ruleName', 'serviceName']

  const queryProperties = [
    { key: 'level', label: 'Level', options: eventLevelOptions },
    { key: 'source', label: 'Source', options: eventSourceOptions },
    ...optionalFields.map((field) => {
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

  const quoteValue = (value) =>
    /[\s"'=!:^<>]/.test(value) ? `"${value.replaceAll('"', '')}"` : value

  const queryToText = (query) =>
    query.tokens
      .map((token) =>
        token.propertyKey
          ? `${token.propertyKey} ${token.operator} ${quoteValue(token.value)}`
          : quoteValue(token.value)
      )
      .join(query.operation === 'or' ? ' OR ' : ' AND ')

  const initialQuery = {
    tokens: [
      { propertyKey: 'level', operator: '=', value: 'Error' },
      { propertyKey: 'host', operator: '=', value: 'api.example.com' }
    ],
    operation: 'and'
  }

  const queryText = ref(queryToText(initialQuery))
  const appliedQuery = ref(initialQuery)
  const appliedText = ref(queryText.value)
  const queryNotice = ref('')
  const pagination = ref({ pageIndex: 0, pageSize: 25 })

  const recentLimit = 8

  const recentQueries = ref([
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

  const applyQuery = ({ text, query }) => {
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

  const runQuery = (entry) => {
    queryText.value = entry.text
    applyQuery(entry)
  }

  const savedQueries = ref([
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

  const deleteSavedQuery = (entry) => {
    savedQueries.value = savedQueries.value.filter((saved) => saved.id !== entry.id)
    savedStatus.value = `Deleted “${entry.name}”.`
  }

  const useSavedQuery = (entry) => {
    runQuery(entry)
    savedOpen.value = false
  }

  const useRecentQuery = (entry) => {
    runQuery(entry)
    recentOpen.value = false
  }

  const clearRecentQueries = () => {
    recentQueries.value = []
    recentOpen.value = false
  }

  const filters = computed(() => {
    const out = {}
    const { tokens, operation } = appliedQuery.value
    if (operation === 'or' && tokens.length > 1) return out
    for (const token of tokens) {
      if (!token.propertyKey || token.operator !== '=') continue
      out[token.propertyKey] = [...(out[token.propertyKey] ?? []), token.value.toLowerCase()]
    }
    return out
  })

  const relativeOptions = [
    { key: 'last-15-minutes', amount: 15, unit: 'minute' },
    { key: 'last-1-hour', amount: 1, unit: 'hour' },
    { key: 'last-6-hours', amount: 6, unit: 'hour' },
    { key: 'last-24-hours', amount: 24, unit: 'hour' }
  ]

  const range = ref({ type: 'relative', amount: 24, unit: 'hour', key: 'last-24-hours' })
  const rangeNow = new Date(referenceNow)
  const rangeMin = new Date(referenceNow - 7 * 24 * 3600000)

  const unitMs = {
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000,
    year: 31536000000
  }

  const activeWindow = computed(() => {
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

  const inWindow = (date) => {
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

  const selectTimeRange = ({ start, end }) => {
    range.value = { type: 'absolute', start: start.toISOString(), end: end.toISOString() }
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

  const isValueApplied = (id, value) =>
    (filters.value[id] ?? []).includes(String(value).toLowerCase())

  const toggleColumn = (id) => {
    shownColumns.value = shownColumns.value.includes(id)
      ? shownColumns.value.filter((shown) => shown !== id)
      : [...shownColumns.value, id]
  }

  const toggleFieldValue = (id, value) => {
    const text = String(value)
    const same = (token) =>
      token.propertyKey === id &&
      token.operator === '=' &&
      token.value.toLowerCase() === text.toLowerCase()
    const { tokens, operation } = appliedQuery.value
    const next = tokens.some(same)
      ? tokens.filter((token) => !same(token))
      : [...tokens, { propertyKey: id, operator: '=', value: text }]
    const query = { tokens: next, operation }
    queryText.value = queryToText(query)
    applyQuery({ text: queryText.value, query })
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

  const selectedId = ref('')
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedId.value) ?? null
  )
  const documentEvent = ref(null)
  watch(selectedEvent, (event) => {
    if (event) documentEvent.value = event
  })

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
    documentDrawerOpen.value = false
  }

  const openDocument = (event, row) => {
    selectedId.value = row.id
    documentDrawerOpen.value = !isWide.value
  }

  const documentCollapsed = computed({
    get: () => !selectedEvent.value,
    set: (collapsed) => {
      if (collapsed) closeDocument()
    }
  })

  watch(documentDrawerOpen, (open) => {
    if (!open && !isWide.value) selectedId.value = ''
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

  const summaryPriority = [
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

  const hasEventValue = (event, id) => {
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
        return { id, label: field.label, value: formatEventValue(field, event[id]) }
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
                    @submit="applyQuery"
                  />
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                <Popover
                  v-model:open="savedOpen"
                  placement="bottom-end"
                  width="small"
                >
                  <Popover.Trigger>
                    <Tooltip text="Saved queries">
                      <IconButton
                        icon="pi pi-bookmark"
                        kind="outlined"
                        size="medium"
                        aria-label="Saved queries"
                        data-testid="saved-queries__trigger"
                      />
                    </Tooltip>
                  </Popover.Trigger>
                  <Popover.Content>
                    <div
                      class="flex flex-col gap-(--spacing-xs) p-(--spacing-xxs)"
                      data-testid="saved-queries"
                    >
                      <h2
                        class="px-(--spacing-xs) pt-(--spacing-xxs) text-label-sm text-(--text-muted)"
                      >
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
                          class="flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <button
                            type="button"
                            class="flex min-w-0 flex-1 flex-col items-start rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                            data-testid="saved-queries__apply"
                            @click="useSavedQuery(entry)"
                          >
                            <span class="max-w-full truncate text-label-sm text-(--text-default)">
                              {{ entry.name }}
                            </span>
                            <span
                              class="max-w-full truncate text-label-code-sm text-(--text-muted)"
                            >
                              {{ entry.text }}
                            </span>
                          </button>
                          <Tooltip text="Delete">
                            <IconButton
                              icon="pi pi-trash"
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
                        class="flex items-center gap-(--spacing-xs) border-t border-(--border-default) px-(--spacing-xxs) pt-(--spacing-xs)"
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
                  width="small"
                >
                  <Popover.Trigger>
                    <Tooltip text="Recent queries">
                      <IconButton
                        icon="pi pi-history"
                        kind="outlined"
                        size="medium"
                        aria-label="Recent queries"
                        data-testid="recent-queries__trigger"
                      />
                    </Tooltip>
                  </Popover.Trigger>
                  <Popover.Content>
                    <div
                      class="flex flex-col gap-(--spacing-xs) p-(--spacing-xxs)"
                      data-testid="recent-queries"
                    >
                      <h2
                        class="px-(--spacing-xs) pt-(--spacing-xxs) text-label-sm text-(--text-muted)"
                      >
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
                          <button
                            type="button"
                            class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                            data-testid="recent-queries__apply"
                            @click="useRecentQuery(entry)"
                          >
                            <i
                              class="pi pi-history shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span
                              class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
                            >
                              {{ entry.text }}
                            </span>
                          </button>
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
                        class="border-t border-(--border-default) pt-(--spacing-xxs)"
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

            <p
              role="status"
              class="text-body-sm text-(--danger-contrast) empty:hidden"
              data-testid="query-notice"
            >
              {{ queryNotice }}
            </p>
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
                        v-else-if="appliedQuery.tokens.length"
                        key="no-match"
                        size="small"
                        icon="pi pi-search"
                        title="No events match this query"
                        description="Change the query, or widen the time range to cover more of the log."
                      />
                      <EmptyState
                        v-else
                        key="no-events"
                        size="small"
                        icon="pi pi-filter-slash"
                        title="No events in this window"
                        description="Widen the time range to see more of the log."
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
