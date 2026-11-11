<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

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

  const breadcrumb = [{ label: 'Databases', href: '/databases' }, { label: 'acme-store' }]

  const activeId = ref('databases')
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

  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]
  const activeTab = ref('tables')

  const tables = ref([
    {
      id: 'tbl-customers',
      name: 'customers',
      columns: [
        { id: 'col-1', name: 'id', type: 'int8', primaryKey: true, notNull: true },
        { id: 'col-2', name: 'name', type: 'text', primaryKey: false, notNull: true },
        { id: 'col-3', name: 'email', type: 'text', primaryKey: false, notNull: true },
        {
          id: 'col-4',
          name: 'created_at',
          type: 'timestamptz',
          primaryKey: false,
          notNull: false
        }
      ],
      rows: [
        {
          __k: 'row-1',
          id: 1,
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          created_at: '2026-07-21 08:15:00'
        },
        {
          __k: 'row-2',
          id: 2,
          name: 'Alan Turing',
          email: 'alan@example.com',
          created_at: '2026-07-21 08:15:01'
        },
        {
          __k: 'row-3',
          id: 3,
          name: 'Grace Hopper',
          email: 'grace@example.com',
          created_at: null
        }
      ]
    },
    {
      id: 'tbl-orders',
      name: 'orders',
      columns: [
        { id: 'col-5', name: 'id', type: 'int8', primaryKey: true, notNull: true },
        { id: 'col-6', name: 'customer_id', type: 'int8', primaryKey: false, notNull: true },
        { id: 'col-7', name: 'total', type: 'numeric', primaryKey: false, notNull: true }
      ],
      rows: [
        { __k: 'row-4', id: 1001, customer_id: 1, total: '42.50' },
        { __k: 'row-5', id: 1002, customer_id: 3, total: '18.00' }
      ]
    },
    {
      id: 'tbl-events',
      name: 'events',
      columns: [
        { id: 'col-10', name: 'id', type: 'int8', primaryKey: true, notNull: true },
        {
          id: 'col-11',
          name: 'occurred_at',
          type: 'timestamptz',
          primaryKey: false,
          notNull: true
        },
        { id: 'col-12', name: 'kind', type: 'text', primaryKey: false, notNull: true },
        { id: 'col-13', name: 'path', type: 'text', primaryKey: false, notNull: true },
        { id: 'col-14', name: 'status', type: 'int4', primaryKey: false, notNull: true },
        { id: 'col-15', name: 'duration_ms', type: 'int4', primaryKey: false, notNull: false }
      ],
      rows: Array.from({ length: 137 }, (_, index) => {
        const kinds = ['page_view', 'sign_in', 'checkout', 'search']
        const paths = ['/', '/pricing', '/docs/start', '/cart', '/account']
        const minute = String(index % 60).padStart(2, '0')
        const hour = String(8 + Math.floor(index / 60)).padStart(2, '0')
        return {
          __k: `ev-${index + 1}`,
          id: 5000 + index,
          occurred_at: `2026-11-10 ${hour}:${minute}:00`,
          kind: kinds[index % kinds.length],
          path: paths[(index * 3) % paths.length],
          status: index % 17 === 0 ? 500 : index % 9 === 0 ? 404 : 200,
          duration_ms: index % 11 === 0 ? null : 40 + ((index * 37) % 400)
        }
      })
    },
    {
      id: 'tbl-subscribers',
      name: 'subscribers',
      columns: [
        { id: 'col-20', name: 'id', type: 'int8', primaryKey: true, notNull: true },
        { id: 'col-21', name: 'email', type: 'text', primaryKey: false, notNull: true },
        { id: 'col-22', name: 'plan', type: 'text', primaryKey: false, notNull: true },
        { id: 'col-23', name: 'active', type: 'bool', primaryKey: false, notNull: false },
        {
          id: 'col-24',
          name: 'joined_at',
          type: 'timestamptz',
          primaryKey: false,
          notNull: false
        },
        { id: 'col-25', name: 'seats', type: 'int4', primaryKey: false, notNull: false }
      ],
      rows: []
    },
    {
      id: 'tbl-invoices',
      name: 'invoices',
      columns: [
        { id: 'col-8', name: 'id', type: 'int8', primaryKey: true, notNull: true },
        {
          id: 'col-9',
          name: 'created_at',
          type: 'timestamptz',
          primaryKey: false,
          notNull: false
        }
      ],
      rows: []
    }
  ])
  const tableSearch = ref('')
  const selectedTableId = ref('tbl-subscribers')
  const filteredTables = computed(() => {
    const term = tableSearch.value.trim().toLowerCase()
    if (!term) return tables.value
    return tables.value.filter((table) => table.name.toLowerCase().includes(term))
  })
  const selectedTable = computed(
    () =>
      tables.value.find((table) => table.id === selectedTableId.value) ?? tables.value[0] ?? null
  )
  const selectTable = (id) => {
    selectedTableId.value = id
  }

  const schemaColumns = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 104 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 }
  ]
  const schemaRows = computed(() => {
    if (!selectedTable.value) return []
    return selectedTable.value.columns.map((column) => ({
      id: column.id,
      name: column.name,
      type: column.type,
      constraints: [column.primaryKey ? 'PRIMARY KEY' : '', column.notNull ? 'NOT NULL' : '']
        .filter(Boolean)
        .join(', ')
    }))
  })

  const leftWidth = ref(288)
  const leftCollapsed = ref(false)

  const tableView = ref('data')
  const tableViewOptions = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  const rowFilter = ref('')
  const filterPlaceholder = computed(() => {
    const names = (selectedTable.value?.columns ?? []).map((column) => column.name)
    return names.length
      ? `Filter by ${names.slice(0, 3).join(', ')} or ask AI`
      : 'Filter rows or ask AI'
  })
  const tableRows = computed(() => selectedTable.value?.rows ?? [])
  const filteredRows = computed(() => {
    const term = rowFilter.value.trim().toLowerCase()
    if (!term) return tableRows.value
    return tableRows.value.filter((row) =>
      Object.entries(row)
        .filter(([key]) => key !== '__k')
        .some(([, value]) =>
          String(value ?? '')
            .toLowerCase()
            .includes(term)
        )
    )
  })
  const rowSelection = ref({})
  const selectedKeys = computed(() =>
    Object.keys(rowSelection.value).filter((key) => rowSelection.value[key])
  )
  const deleting = ref(false)
  let deleteTimer = 0
  const deleteSelected = () => {
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (!table || !selectedKeys.value.length || deleting.value) return
    const keys = new Set(selectedKeys.value)
    const snapshot = table.rows
    deleting.value = true
    clearTimeout(deleteTimer)
    deleteTimer = setTimeout(() => {
      deleting.value = false
      table.rows = table.rows.filter((row) => !keys.has(row.__k))
      rowSelection.value = {}
      toast.success(
        `${keys.size} ${keys.size === 1 ? 'row' : 'rows'} deleted from ${table.name}.`,
        {
          id: 'query-editor-rows',
          actions: [
            {
              label: 'Undo',
              onClick: () => {
                table.rows = snapshot
              }
            }
          ]
        }
      )
    }, 600)
  }
  onBeforeUnmount(() => {
    clearTimeout(deleteTimer)
    toast.dismiss('query-editor-rows')
  })
  const dataColumns = computed(() => [
    ...(selectedTable.value?.columns ?? []).map((column) => ({
      id: column.name,
      accessorKey: column.name,
      header: column.name,
      enableSorting: true,
      minWidth: 160
    })),
    { id: '__actions', kind: 'action', hideable: false }
  ])
  watch(selectedTableId, () => {
    rowSelection.value = {}
  })
  const SKIP = '__skip'
  const CSV_ON_START = {
    file: { name: 'subscribers-export.csv', size: 389, type: 'text/csv' },
    text: [
      'id,Email,plan_name,active,joined_at,referrer',
      '1,ada@example.com,pro,true,2026-03-02,newsletter',
      '2,lin@example.com,free,true,2026-04-18,',
      '3,ops@example.com,team,maybe,2026-05-07,partner',
      '4,"kim, j@example.com",pro,true,2026-06-21,',
      '5,,free,true,2026-07-30,search',
      '6,ravi@example.com,free,false,2026-08-11,',
      '7,noor@example.com,team,true,next week,ads'
    ].join('\n')
  }
  const importOpen = ref(true)
  const importInput = ref(null)
  const importFile = ref(null)
  const importFileError = ref('')
  const importHeaders = ref([])
  const importRows = ref([])
  const importMapping = ref({})
  const importSubmitted = ref(false)
  const importing = ref(false)
  let importTimer = 0

  const splitCsvLine = (line) => {
    const cells = []
    let cell = ''
    let quoted = false
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]
      if (quoted && char === '"' && line[i + 1] === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') quoted = !quoted
      else if (char === ',' && !quoted) {
        cells.push(cell.trim())
        cell = ''
      } else cell += char
    }
    cells.push(cell.trim())
    return cells
  }
  const clearImport = () => {
    importFile.value = null
    importFileError.value = ''
    importHeaders.value = []
    importRows.value = []
    importMapping.value = {}
    importSubmitted.value = false
  }
  const readCsv = (file, text) => {
    clearImport()
    importFile.value = file
    const lines = text.split(/\r?\n/).filter((line) => line.trim())
    const headers = lines.length ? splitCsvLine(lines[0]) : []
    if (!headers.length || headers.some((header) => !header)) {
      importFileError.value = 'The first line must name every column.'
      return
    }
    if (lines.length < 2) {
      importFileError.value = 'The file has a header but no rows.'
      return
    }
    importHeaders.value = headers
    importRows.value = lines.slice(1).map((line, index) => ({
      line: index + 2,
      cells: Object.fromEntries(splitCsvLine(line).map((value, cell) => [headers[cell], value]))
    }))
    const columns = selectedTable.value?.columns ?? []
    importMapping.value = Object.fromEntries(
      headers.map((header) => [
        header,
        columns.find((column) => column.name.toLowerCase() === header.toLowerCase())?.name ?? SKIP
      ])
    )
  }
  const onImportFiles = async (files) => {
    const file = Array.from(files ?? [])[0]
    if (!file) return
    if (!/\.csv$/i.test(file.name)) {
      clearImport()
      importFile.value = { name: file.name, size: file.size, type: file.type }
      importFileError.value = 'Choose a .csv file.'
      return
    }
    readCsv({ name: file.name, size: file.size, type: 'text/csv' }, await file.text())
  }
  const onImportPick = (event) => {
    onImportFiles(event.target.files)
    event.target.value = ''
  }
  const openImport = (files) => {
    clearImport()
    importOpen.value = true
    if (files?.length) onImportFiles(files)
  }
  const onEmptyDrop = (event) => openImport(event.dataTransfer?.files)
  const importTokens = computed(() =>
    importFile.value ? [{ file: importFile.value, error: importFileError.value || undefined }] : []
  )

  const TYPE_CHECKS = {
    int2: [(value) => /^-?\d+$/.test(value), 'a whole number'],
    int4: [(value) => /^-?\d+$/.test(value), 'a whole number'],
    int8: [(value) => /^-?\d+$/.test(value), 'a whole number'],
    numeric: [(value) => /^-?\d+(\.\d+)?$/.test(value), 'a number'],
    bool: [(value) => /^(true|false|t|f|1|0)$/i.test(value), 'true or false'],
    timestamptz: [
      (value) =>
        /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?.*)?$/.test(value) &&
        !Number.isNaN(Date.parse(value.replace(' ', 'T'))),
      'a date as YYYY-MM-DD'
    ]
  }
  const mappingLabel = (value) => (value === SKIP ? 'Skip' : value)
  const columnByName = (name) =>
    selectedTable.value?.columns.find((column) => column.name === name) ?? null
  const mappedHeaders = computed(() =>
    importHeaders.value.filter((header) => importMapping.value[header] !== SKIP)
  )
  const targetOf = (header) => columnByName(importMapping.value[header])
  const duplicateTargets = computed(() => {
    const seen = new Map()
    for (const header of mappedHeaders.value) {
      const target = importMapping.value[header]
      seen.set(target, [...(seen.get(target) ?? []), header])
    }
    return [...seen].filter(([, headers]) => headers.length > 1).map(([target]) => target)
  })
  const missingRequired = computed(() => {
    const mapped = new Set(mappedHeaders.value.map((header) => importMapping.value[header]))
    return (selectedTable.value?.columns ?? []).filter(
      (column) => column.notNull && !column.primaryKey && !mapped.has(column.name)
    )
  })
  const mappingError = computed(() => {
    if (duplicateTargets.value.length)
      return `Two CSV columns go to ${duplicateTargets.value.join(', ')}. Map each table column once.`
    if (missingRequired.value.length)
      return `Map a CSV column to ${missingRequired.value.map((column) => column.name).join(', ')}: ${missingRequired.value.length === 1 ? 'it cannot' : 'they cannot'} be empty.`
    if (!mappedHeaders.value.length) return 'Map at least one CSV column to the table.'
    return ''
  })
  const checkedRows = computed(() =>
    importRows.value.map((row) => {
      const values = {}
      const problems = []
      for (const header of mappedHeaders.value) {
        const column = targetOf(header)
        if (!column) continue
        const raw = row.cells[header] ?? ''
        if (raw === '') {
          if (column.notNull) problems.push(`${column.name} is empty and cannot be.`)
          values[column.name] = null
          continue
        }
        const check = TYPE_CHECKS[column.type]
        if (check && !check[0](raw))
          problems.push(`${column.name} “${raw}” is not ${check[1]} (${column.type}).`)
        values[column.name] = raw
      }
      return { line: row.line, values, problems }
    })
  )
  const validRows = computed(() => checkedRows.value.filter((row) => !row.problems.length))
  const failedRows = computed(() => checkedRows.value.filter((row) => row.problems.length))
  const importPreviewColumns = computed(() =>
    mappedHeaders.value
      .map((header) => targetOf(header))
      .filter(Boolean)
      .map((column) => ({ accessorKey: column.name, header: column.name, minWidth: 120 }))
  )
  const importPreview = computed(() =>
    validRows.value.slice(0, 5).map((row) => ({ __row: `line-${row.line}`, ...row.values }))
  )
  const importFileMissing = computed(() =>
    importSubmitted.value && !importRows.value.length && !importFileError.value
      ? 'Choose a CSV file to import.'
      : ''
  )
  const submitImport = () => {
    importSubmitted.value = true
    if (importing.value) return
    if (!importRows.value.length || mappingError.value || !validRows.value.length) return
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (!table) return
    const inserted = validRows.value.map((row, index) => ({
      __k: `import-${row.line}-${index}`,
      ...Object.fromEntries(table.columns.map((column) => [column.name, null])),
      ...row.values
    }))
    const skipped = failedRows.value.length
    const snapshot = table.rows
    importing.value = true
    clearTimeout(importTimer)
    importTimer = setTimeout(() => {
      importing.value = false
      table.rows = [...table.rows, ...inserted]
      importOpen.value = false
      toast.success(
        `${inserted.length} ${inserted.length === 1 ? 'row' : 'rows'} inserted into ${table.name}.`,
        {
          id: 'query-editor-rows',
          description: skipped
            ? `${skipped} ${skipped === 1 ? 'row' : 'rows'} with errors ${skipped === 1 ? 'was' : 'were'} skipped.`
            : undefined,
          actions: [
            {
              label: 'Undo',
              onClick: () => {
                table.rows = snapshot
              }
            }
          ]
        }
      )
    }, 900)
  }
  onBeforeUnmount(() => clearTimeout(importTimer))
  readCsv(CSV_ON_START.file, CSV_ON_START.text)
  const editorMarkers = computed(() =>
    results.value?.type === 'error' && results.value.line
      ? [{ line: results.value.line, severity: 'error', message: results.value.text }]
      : []
  )
  const isNull = (value) => value === null || value === undefined || value === ''
  const displayCell = (value) => (isNull(value) ? 'NULL' : String(value))
  const deleteRow = (row) => {
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (!table) return
    table.rows = table.rows.filter((item) => item.__k !== row.__k)
  }

  const editorSql = ref(`CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`)
  const history = ref([
    {
      id: 'q-0',
      sql: `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
    },
    {
      id: 'q-1',
      sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
    }
  ])
  const historySearch = ref('')
  const filteredHistory = computed(() => {
    const term = historySearch.value.trim().toLowerCase()
    if (!term) return history.value
    return history.value.filter((item) => item.sql.toLowerCase().includes(term))
  })
  const oneLine = (sql) => sql.replace(/\s+/g, ' ').trim()

  const running = ref(false)
  const templatesOpen = ref(false)
  const selectResult = {
    type: 'rows',
    columns: ['id', 'name', 'email', 'created_at'],
    rows: [
      {
        __k: 1,
        id: 1,
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        created_at: '2026-07-21 08:15:00'
      },
      {
        __k: 2,
        id: 2,
        name: 'Alan Turing',
        email: 'alan@example.com',
        created_at: '2026-07-21 08:15:01'
      },
      {
        __k: 3,
        id: 3,
        name: 'Grace Hopper',
        email: 'grace@example.com',
        created_at: '2026-07-21 08:15:02'
      }
    ]
  }
  const results = ref(null)
  const resultColumns = computed(() => {
    if (results.value?.type !== 'rows') return []
    return results.value.columns.map((key, index) => ({
      accessorKey: key,
      header: key,
      principal: index === 0
    }))
  })
  const resultView = ref('table')
  const resultViewOptions = [
    { label: 'Table', value: 'table' },
    { label: 'JSON', value: 'json' }
  ]
  const resultSearch = ref('')
  const resultRows = computed(() => (results.value?.type === 'rows' ? results.value.rows : []))
  const filteredResultRows = computed(() => {
    const term = resultSearch.value.trim().toLowerCase()
    if (!term) return resultRows.value
    return resultRows.value.filter((row) =>
      Object.entries(row)
        .filter(([key]) => key !== '__k')
        .some(([, value]) => String(value).toLowerCase().includes(term))
    )
  })
  const resultJson = computed(() =>
    JSON.stringify(
      resultRows.value.map(({ __k, ...rest }) => rest),
      null,
      2
    )
  )

  const applyTemplate = (sql) => {
    editorSql.value = sql
  }
  const loadFromHistory = (item) => {
    editorSql.value = item.sql
    activeTab.value = 'editor'
  }
  const deleteHistory = (event, item) => {
    history.value = history.value.filter((entry) => entry.id !== item.id)
  }
  const SQL_VERBS = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'CREATE',
    'ALTER',
    'DROP',
    'WITH',
    'PRAGMA'
  ]

  const runQuery = () => {
    const sql = editorSql.value.trim()
    if (!sql || running.value) return
    running.value = true
    results.value = null
    setTimeout(() => {
      if (history.value[0]?.sql !== sql) {
        history.value = [{ id: `q-${history.value.length + 1}`, sql }, ...history.value]
      }
      const verb = sql.split(/\s+/)[0].toUpperCase()
      const text =
        verb === 'CREATE'
          ? 'Table created.'
          : verb === 'INSERT'
            ? 'Rows inserted.'
            : 'Statement executed.'
      results.value = !SQL_VERBS.includes(verb)
        ? {
            type: 'error',
            line: 1,
            text: `The statement wasn't executed: near "${verb}", a syntax error. Check the statement and run it again.`
          }
        : verb === 'SELECT'
          ? structuredClone(selectResult)
          : { type: 'message', text }
      running.value = false
    }, 700)
  }

  const templates = [
    {
      id: 'create-table',
      title: 'Create table',
      description: 'Create a basic customers table with auto-increment ID and timestamp',
      icon: 'pi pi-table',
      sql: `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
    },
    {
      id: 'insert-data',
      title: 'Insert data',
      description: 'Insert sample customer records into the customers table',
      icon: 'pi pi-plus-circle',
      sql: `INSERT INTO customers (name, email) VALUES
  ('Ada Lovelace', 'ada@example.com'),
  ('Alan Turing', 'alan@example.com'),
  ('Grace Hopper', 'grace@example.com');`
    },
    {
      id: 'select-all',
      title: 'Select all',
      description: 'Retrieve all records from customers table with limit',
      icon: 'pi pi-list',
      sql: `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`
    },
    {
      id: 'count-records',
      title: 'Count records',
      description: 'Count total number of records in customers table',
      icon: 'pi pi-hashtag',
      sql: 'SELECT COUNT(*) AS total_customers FROM customers;'
    },
    {
      id: 'related-table',
      title: 'Related table',
      description: 'Create an orders table that references the customers table',
      icon: 'pi pi-box',
      sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
    },
    {
      id: 'insert-related',
      title: 'Insert related rows',
      description: 'Insert sample orders for existing customers',
      icon: 'pi pi-arrow-right-arrow-left',
      sql: `INSERT INTO orders (customer_id, total) VALUES
  (1, 42.50),
  (3, 18.00);`
    },
    {
      id: 'join-tables',
      title: 'Join tables',
      description: 'List every order with the name of the customer who placed it',
      icon: 'pi pi-search',
      sql: `SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id DESC;`
    },
    {
      id: 'create-index',
      title: 'Create index',
      description: 'Create an index to speed up lookups of orders by customer',
      icon: 'pi pi-sitemap',
      sql: `CREATE INDEX IF NOT EXISTS orders_customer_id_idx
ON orders (customer_id);`
    },
    {
      id: 'top-customers',
      title: 'Top customers',
      description: 'Find the 3 customers with the highest order totals',
      icon: 'pi pi-sort-amount-down',
      sql: `SELECT customers.name, SUM(orders.total) AS total_spent
FROM customers
JOIN orders ON orders.customer_id = customers.id
GROUP BY customers.id
ORDER BY total_spent DESC
LIMIT 3;`
    }
  ]
  const templateQuery = ref('')
  const filteredTemplates = computed(() => {
    const term = templateQuery.value.trim().toLowerCase()
    if (!term) return templates
    return templates.filter(
      (template) =>
        template.title.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term)
    )
  })
  watch(templatesOpen, (value) => {
    if (value) templateQuery.value = ''
  })
  const chooseTemplate = (template) => {
    applyTemplate(template.sql)
    templatesOpen.value = false
  }
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

              <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
                <Breadcrumb
                  :items="breadcrumb"
                  class="w-full"
                />
              </div>
            </div>
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <span class="contents @min-[47rem]:hidden">
              <IconButton
                icon="pi pi-search"
                kind="outlined"
                size="medium"
                aria-label="Search"
                aria-keyshortcuts="Meta+K"
                @click="paletteOpen = true"
              />
            </span>
            <button
              type="button"
              aria-label="Search"
              aria-keyshortcuts="Meta+K"
              class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
              @click="paletteOpen = true"
            >
              <span
                class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
                aria-hidden="true"
              >
                <i class="pi pi-search" />
              </span>
              <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">Search</span>
              <Kbd
                meta
                size="small"
                class="shrink-0"
                >K</Kbd
              >
            </button>

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
          <PageTabs v-model="activeTab">
            <Tabs.Item
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              :label="tab.label"
            />
          </PageTabs>

          <section
            v-if="activeTab === 'tables'"
            class="animate-page-enter motion-reduce:animate-none relative flex min-h-0 flex-1 overflow-hidden"
          >
            <div class="contents [--sidebar-width:var(--container-2xs)]">
              <Sidebar
                v-model:width="leftWidth"
                v-model:collapsed="leftCollapsed"
                resizable
                collapsible
                aria-label="Tables"
                collapse-aria-label="Hide the tables panel"
                expand-aria-label="Show the tables panel"
                resize-aria-label="Resize the tables panel"
              >
                <template #header>
                  <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
                    <div class="flex items-center justify-between gap-(--spacing-xs)">
                      <span class="text-heading-xxs text-(--text-default)">Tables</span>
                      <div class="flex items-center gap-(--spacing-xxs)">
                        <Tooltip text="Refresh tables">
                          <IconButton
                            icon="pi pi-refresh"
                            kind="outlined"
                            size="small"
                            aria-label="Refresh tables"
                          />
                        </Tooltip>
                        <Tooltip text="Create Table">
                          <IconButton
                            icon="pi pi-plus"
                            kind="outlined"
                            size="small"
                            aria-label="Create Table"
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <Input
                      v-model="tableSearch"
                      size="medium"
                      class="w-full"
                      placeholder="Search tables"
                      aria-label="Search tables"
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
                  <p
                    v-if="!tables.length"
                    class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    No tables created yet
                  </p>
                  <p
                    v-else-if="!filteredTables.length"
                    class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    No tables match "{{ tableSearch }}".
                  </p>
                  <div
                    v-else
                    class="flex flex-col gap-(--spacing-xxs)"
                  >
                    <div
                      v-for="table in filteredTables"
                      :key="table.id"
                      class="group flex items-center gap-(--spacing-xxs)"
                    >
                      <button
                        type="button"
                        :data-selected="
                          selectedTable && selectedTable.id === table.id ? true : null
                        "
                        class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-selected:bg-(--bg-hover) motion-reduce:transition-none"
                        @click="selectTable(table.id)"
                      >
                        <i
                          class="pi pi-table shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="min-w-0 truncate">{{ table.name }}</span>
                      </button>
                      <DropdownMenu placement="bottom-end">
                        <DropdownMenu.Trigger>
                          <Tooltip text="Table actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="transparent"
                              size="small"
                              aria-label="Table actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Group>
                          <DropdownMenu.Option
                            value="delete"
                            label="Delete table"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenu.Option>
                        </DropdownMenu.Group>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Sidebar>
            </div>

            <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div
                v-if="!selectedTable"
                class="flex flex-1 items-center justify-center p-(--spacing-md)"
              >
                <Card class="w-full max-w-(--container-2xl)">
                  <template #content>
                    <div
                      class="flex flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                    >
                      <EmptyState
                        size="medium"
                        title="No tables yet"
                        description="Create your first table to store your data."
                        class="w-full"
                      >
                        <template #icon>
                          <span class="relative flex size-10 items-center justify-center">
                            <span
                              aria-hidden="true"
                              class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-(--radius-xl) border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                            />
                            <span
                              aria-hidden="true"
                              class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                            />
                            <span
                              class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                            >
                              <i
                                class="pi pi-table text-body-md leading-none text-(--text-default)"
                                aria-hidden="true"
                              />
                            </span>
                          </span>
                        </template>
                        <template #actions>
                          <div class="w-full md:w-fit">
                            <Button
                              label="Create Table"
                              icon="pi pi-plus"
                              kind="secondary"
                              size="medium"
                              class="w-full"
                            />
                          </div>
                        </template>
                      </EmptyState>
                    </div>
                  </template>
                </Card>
              </div>

              <div
                v-else
                class="flex min-h-0 flex-1 flex-col"
              >
                <div
                  class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-table shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-heading-xxs text-(--text-default)">{{
                      selectedTable.name
                    }}</span>
                  </div>
                  <ToggleGroup
                    v-model="tableView"
                    :options="tableViewOptions"
                    aria-label="Table view"
                  />
                </div>

                <div
                  v-if="tableView === 'data'"
                  class="flex min-h-0 flex-1 flex-col"
                >
                  <div
                    class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
                  >
                    <div class="flex min-w-0 flex-1 md:max-w-(--container-lg)">
                      <Input
                        v-model="rowFilter"
                        size="medium"
                        class="w-full"
                        :placeholder="filterPlaceholder"
                        aria-label="Filter rows"
                      >
                        <template #iconLeft>
                          <i
                            class="pi pi-search"
                            aria-hidden="true"
                          />
                        </template>
                      </Input>
                    </div>
                    <div class="ms-auto flex items-center gap-(--spacing-xs)">
                      <Button
                        v-if="selectedKeys.length"
                        :label="`Delete ${selectedKeys.length} ${selectedKeys.length === 1 ? 'row' : 'rows'}`"
                        kind="danger"
                        size="medium"
                        icon="pi pi-trash"
                        :loading="deleting"
                        @click="deleteSelected"
                      />
                      <Tooltip text="Refresh">
                        <IconButton
                          icon="pi pi-refresh"
                          kind="outlined"
                          size="medium"
                          aria-label="Refresh"
                        />
                      </Tooltip>
                      <Button
                        label="Insert"
                        kind="primary"
                        size="medium"
                        icon="pi pi-plus"
                      />
                    </div>
                  </div>

                  <div class="min-h-0 flex-1 overflow-auto">
                    <TableRoot
                      v-model:row-selection="rowSelection"
                      :data="filteredRows"
                      :columns="dataColumns"
                      row-key="__k"
                      enable-row-selection
                      enable-sorting
                      paginated
                      :page-size="25"
                      :rows-per-page-options="[25, 50, 100]"
                      density="compact"
                      :bordered="false"
                      :aria-label="`Rows of ${selectedTable.name}`"
                    >
                      <template
                        v-for="column in selectedTable.columns"
                        :key="column.id"
                        #[`header-${column.name}`]
                      >
                        <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                          <span class="truncate">{{ column.name }}</span>
                          <span class="shrink-0 text-body-xs text-(--text-muted)">{{
                            column.type
                          }}</span>
                          <i
                            v-if="column.primaryKey"
                            class="pi pi-key shrink-0 text-(--primary)"
                            role="img"
                            aria-label="Primary key"
                          />
                        </span>
                      </template>
                      <template
                        v-for="column in selectedTable.columns"
                        :key="column.id"
                        #[`cell-${column.name}`]="{ value }"
                      >
                        <span
                          class="truncate font-code text-label-code-sm"
                          :class="
                            isNull(value) ? 'italic text-(--text-muted)' : 'text-(--text-default)'
                          "
                          >{{ displayCell(value) }}</span
                        >
                      </template>
                      <template #cell-__actions="{ row }">
                        <Tooltip text="Delete row">
                          <IconButton
                            icon="pi pi-trash"
                            kind="transparent"
                            size="small"
                            aria-label="Delete row"
                            @click="deleteRow(row)"
                          />
                        </Tooltip>
                      </template>
                      <template #empty>
                        <div
                          v-if="!tableRows.length"
                          class="flex flex-col items-center justify-center gap-(--spacing-sm) p-(--spacing-xxl) text-center"
                          @dragover.prevent
                          @drop.prevent="onEmptyDrop"
                        >
                          <p class="text-body-sm text-(--text-default)">This table is empty</p>
                          <div
                            class="flex flex-wrap items-center justify-center gap-(--spacing-xs)"
                          >
                            <Button
                              label="Insert row"
                              kind="secondary"
                              size="medium"
                              icon="pi pi-plus"
                            />
                            <Button
                              label="Import data from CSV"
                              kind="outlined"
                              size="medium"
                              icon="pi pi-upload"
                              @click="openImport()"
                            />
                          </div>
                          <p class="text-body-xs text-(--text-muted)">
                            or drag and drop a CSV file here
                          </p>
                        </div>
                        <p
                          v-else
                          class="p-(--spacing-xxl) text-center text-body-sm text-(--text-muted)"
                        >
                          No rows match "{{ rowFilter }}".
                        </p>
                      </template>
                    </TableRoot>
                  </div>
                </div>

                <div
                  v-else
                  class="flex min-h-0 flex-1 flex-col gap-(--layout-group-gap) overflow-auto p-(--spacing-md)"
                >
                  <div class="flex items-center justify-between gap-(--spacing-sm)">
                    <p class="text-heading-xxs text-(--text-default)">Columns</p>
                    <Button
                      label="Add column"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-plus"
                    />
                  </div>
                  <Card :padded="false">
                    <template #content>
                      <TableRoot
                        :data="schemaRows"
                        :columns="schemaColumns"
                        row-key="id"
                        :bordered="false"
                      >
                        <template #cell-name="{ value }">
                          <span class="min-w-0 truncate">{{ value }}</span>
                        </template>
                        <template #cell-type="{ value }">
                          <Tag
                            :label="value"
                            severity="secondary"
                            size="medium"
                          />
                        </template>
                        <template #cell-constraints="{ value }">
                          <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                        </template>
                      </TableRoot>
                    </template>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section
            v-else
            class="relative flex min-h-0 flex-1 overflow-hidden"
          >
            <div class="contents [--sidebar-width:var(--container-2xs)]">
              <Sidebar
                v-model:width="leftWidth"
                v-model:collapsed="leftCollapsed"
                resizable
                collapsible
                aria-label="Query history"
                collapse-aria-label="Hide the query history"
                expand-aria-label="Show the query history"
                resize-aria-label="Resize the query history panel"
              >
                <template #header>
                  <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
                    <span class="text-heading-xxs text-(--text-default)">Query history</span>
                    <Input
                      v-model="historySearch"
                      size="medium"
                      class="w-full"
                      placeholder="Search queries"
                      aria-label="Search queries"
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
                  <p
                    v-if="!filteredHistory.length"
                    class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    No queries yet
                  </p>
                  <div
                    v-else
                    class="flex flex-col gap-(--spacing-xxs)"
                  >
                    <div
                      v-for="item in filteredHistory"
                      :key="item.id"
                      class="flex items-center gap-(--spacing-xxs)"
                    >
                      <button
                        type="button"
                        class="min-w-0 flex-1 truncate rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start font-code text-label-code-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                        :title="oneLine(item.sql)"
                        @click="loadFromHistory(item)"
                      >
                        {{ oneLine(item.sql) }}
                      </button>
                      <DropdownMenu
                        placement="bottom-end"
                        @select="
                          (event, value) =>
                            value === 'run'
                              ? (applyTemplate(item.sql), runQuery())
                              : deleteHistory(event, item)
                        "
                      >
                        <DropdownMenu.Trigger>
                          <Tooltip text="Query actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="transparent"
                              size="small"
                              aria-label="Query actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Group>
                          <DropdownMenu.Option
                            value="run"
                            label="Run query"
                          >
                            <template #left
                              ><i
                                class="pi pi-play"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenu.Option>
                          <DropdownMenu.Option
                            value="delete"
                            label="Delete query"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenu.Option>
                        </DropdownMenu.Group>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Sidebar>
            </div>

            <div class="flex min-w-0 flex-1 flex-col overflow-auto">
              <div
                class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
              >
                <Button
                  label="Run query"
                  kind="primary"
                  size="medium"
                  icon="pi pi-play"
                  :loading="running"
                  @click="runQuery"
                />
                <div class="ms-auto flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Prettify"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-align-left"
                    :disabled="running"
                  />
                  <Button
                    label="Templates"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-bolt"
                    :disabled="running"
                    @click="templatesOpen = true"
                  />
                </div>
              </div>

              <CodeEditor
                v-model="editorSql"
                language="sql"
                path="query.sql"
                height="14rem"
                :readonly="running"
                :markers="editorMarkers"
                aria-label="SQL editor"
              />

              <div
                class="flex flex-col border-t-(length:--border-width-default) border-(--border-default)"
              >
                <div
                  class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
                >
                  <span class="shrink-0 text-heading-xxs text-(--text-default)"> Results </span>
                  <div class="flex ms-(--spacing-sm) min-w-0 flex-1 md:max-w-(--container-sm)">
                    <Input
                      v-model="resultSearch"
                      size="medium"
                      class="w-full"
                      placeholder="Search"
                      aria-label="Search results"
                      :disabled="!resultRows.length"
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                  <div class="ms-auto flex items-center gap-(--spacing-xs)">
                    <ToggleGroup
                      v-model="resultView"
                      :options="resultViewOptions"
                      aria-label="Result view"
                    />
                    <Tooltip text="Refresh">
                      <IconButton
                        icon="pi pi-refresh"
                        kind="outlined"
                        size="medium"
                        aria-label="Refresh results"
                        :loading="running"
                        @click="runQuery"
                      />
                    </Tooltip>
                    <Tooltip text="Download">
                      <IconButton
                        icon="pi pi-download"
                        kind="outlined"
                        size="medium"
                        aria-label="Download results"
                        :disabled="!resultRows.length"
                      />
                    </Tooltip>
                    <Tooltip text="Columns">
                      <IconButton
                        icon="pi pi-table"
                        kind="outlined"
                        size="medium"
                        aria-label="Toggle columns"
                        :disabled="!resultRows.length"
                      />
                    </Tooltip>
                    <Button
                      label="Insert"
                      kind="primary"
                      size="medium"
                      icon="pi pi-plus"
                      :disabled="true"
                    />
                  </div>
                </div>

                <div class="min-h-(--container-3xs)">
                  <TableRoot
                    v-if="resultRows.length && resultView === 'table'"
                    :data="filteredResultRows"
                    :columns="resultColumns"
                    row-key="__k"
                    :bordered="false"
                  />
                  <pre
                    v-else-if="resultRows.length && resultView === 'json'"
                    class="overflow-auto p-(--spacing-md) font-code text-label-code-sm text-(--text-default)"
                    >{{ resultJson }}</pre>
                  <div
                    v-else-if="results && (results.type === 'message' || results.type === 'error')"
                    class="p-(--spacing-md)"
                  >
                    <Alert
                      :severity="results.type === 'error' ? 'danger' : 'success'"
                      :label="results.text"
                    />
                  </div>
                  <div
                    v-else
                    class="flex min-h-(--container-3xs) items-center justify-center p-(--spacing-lg)"
                  >
                    <EmptyState
                      title="Ready to execute"
                      description="Execute a query to see the results here."
                    />
                  </div>
                </div>

                <div class="border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)">
                  <PaginationRoot
                    :total="filteredResultRows.length"
                    :page-size="50"
                    :page-size-options="[10, 25, 50, 100]"
                    aria-label="Results pagination"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>

        <Drawer
          v-model:open="templatesOpen"
          size="large"
          side="right"
        >
          <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent>
              <PanelHeader class="w-full">
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <DrawerTitle>SQL quick templates</DrawerTitle>
                  <p class="text-body-sm text-(--text-muted)">
                    Pick a snippet to load it into the editor.
                  </p>
                </div>
                <DrawerClose />
              </PanelHeader>

              <PanelContent>
                <div class="flex flex-col gap-(--spacing-md)">
                  <Input
                    v-model="templateQuery"
                    size="large"
                    class="w-full"
                    placeholder="Search templates"
                    aria-label="Search templates"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>

                  <div
                    v-if="filteredTemplates.length"
                    class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2"
                  >
                    <button
                      v-for="template in filteredTemplates"
                      :key="template.id"
                      type="button"
                      class="flex flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) text-start transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-primary) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
                      @click="chooseTemplate(template)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">
                        <i
                          :class="template.icon"
                          class="text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="text-label-md text-(--text-default)">{{
                          template.title
                        }}</span>
                      </span>
                      <span class="text-body-xs text-(--text-muted)">{{
                        template.description
                      }}</span>
                    </button>
                  </div>

                  <p
                    v-else
                    class="py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                  >
                    No templates match "{{ templateQuery }}".
                  </p>
                </div>
              </PanelContent>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
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
    <Drawer
      v-model:open="importOpen"
      size="large"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            :aria-label="`Import data into ${selectedTable?.name ?? 'the table'}`"
            novalidate
            @submit.prevent="submitImport"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Import data into {{ selectedTable?.name }}</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  Read a CSV file, choose the table column each CSV column fills, check the rows,
                  then insert them. Rows with errors are skipped.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="importing"
              >
                <legend class="sr-only">Import data from CSV</legend>
                <SettingsSection
                  title="File"
                  hint="One .csv file whose first line names its columns."
                >
                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                    <FileDropzone
                      v-if="!importFile"
                      accept=".csv,text/csv"
                      description="One .csv file, comma-separated, up to 10 MB."
                      @drop="(event, files) => onImportFiles(files)"
                    >
                      <Button
                        type="button"
                        label="Browse files"
                        kind="secondary"
                        size="medium"
                        @click="importInput?.click()"
                      />
                    </FileDropzone>
                    <input
                      ref="importInput"
                      type="file"
                      accept=".csv,text/csv"
                      class="hidden"
                      aria-hidden="true"
                      tabindex="-1"
                      @change="onImportPick"
                    />
                    <FileTokenGroup
                      v-if="importFile"
                      :items="importTokens"
                      @dismiss="clearImport"
                    />
                    <p
                      v-if="importFileMissing"
                      class="m-0 text-body-sm text-(--danger-contrast)"
                    >
                      {{ importFileMissing }}
                    </p>
                  </div>
                </SettingsSection>

                <template v-if="importRows.length">
                  <SettingsSection
                    title="Map columns"
                    :hint="`Choose the column of ${selectedTable?.name} each CSV column fills, or Skip it. Columns left out take NULL or their default.`"
                  >
                    <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                      <Alert
                        v-if="importSubmitted && mappingError"
                        severity="danger"
                        size="small"
                        :label="mappingError"
                      />
                      <ul
                        aria-label="Column mapping"
                        class="m-0 flex list-none flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-muted) p-0"
                      >
                        <li
                          v-for="header in importHeaders"
                          :key="header"
                          class="flex flex-wrap items-center gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs) first:border-t-0"
                        >
                          <span class="flex min-w-0 flex-[1_1_10rem] flex-col">
                            <span
                              class="truncate font-code text-label-code-sm text-(--text-default)"
                              >{{ header }}</span
                            >
                            <span class="truncate text-body-xs text-(--text-muted)"
                              >e.g. {{ importRows[0].cells[header] || 'empty' }}</span
                            >
                          </span>
                          <i
                            class="pi pi-arrow-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
                            aria-hidden="true"
                          />
                          <div class="min-w-0 flex-[1_1_12rem]">
                            <Select
                              v-model="importMapping[header]"
                              :display-value="mappingLabel"
                              size="medium"
                              class="w-full"
                            >
                              <Select.Trigger :aria-label="`Table column for ${header}`" />
                              <Select.Content>
                                <Select.Option :value="SKIP">Skip</Select.Option>
                                <Select.Group :label="`Columns of ${selectedTable?.name}`">
                                  <Select.Option
                                    v-for="column in selectedTable?.columns ?? []"
                                    :key="column.id"
                                    :value="column.name"
                                  >
                                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                      <span class="font-code text-label-code-sm">{{
                                        column.name
                                      }}</span>
                                      <span class="truncate text-body-xs text-(--text-muted)"
                                        >{{ column.type
                                        }}{{
                                          column.notNull && !column.primaryKey ? ', required' : ''
                                        }}</span
                                      >
                                    </span>
                                  </Select.Option>
                                </Select.Group>
                              </Select.Content>
                            </Select>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </SettingsSection>

                  <SettingsSection
                    title="Check rows"
                    hint="Each value is checked against its column's type, and required columns against empty values."
                  >
                    <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                      <p
                        class="m-0 text-body-sm text-(--text-default)"
                        aria-live="polite"
                      >
                        {{ validRows.length }} of {{ checkedRows.length }}
                        {{ checkedRows.length === 1 ? 'row is' : 'rows are' }} ready to insert.
                        <template v-if="failedRows.length"
                          >{{ failedRows.length }}
                          {{ failedRows.length === 1 ? 'row has' : 'rows have' }} errors and will be
                          skipped.</template
                        >
                      </p>
                      <Alert
                        v-if="importSubmitted && !mappingError && !validRows.length"
                        severity="danger"
                        size="small"
                        label="Every row has an error, so there is nothing to insert. Fix the file or the mapping."
                      />
                      <ul
                        v-if="failedRows.length"
                        aria-label="Rows with errors"
                        class="m-0 flex list-none flex-col gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--danger-border) p-(--spacing-sm)"
                      >
                        <li
                          v-for="row in failedRows.slice(0, 10)"
                          :key="row.line"
                          class="flex gap-(--spacing-xs) text-body-sm text-(--text-default)"
                        >
                          <i
                            class="pi pi-times-circle mt-1 shrink-0 text-(--danger-contrast)"
                            aria-hidden="true"
                          />
                          <span
                            ><span class="font-medium">Line {{ row.line }}:</span>
                            {{ row.problems.join(' ') }}</span
                          >
                        </li>
                        <li
                          v-if="failedRows.length > 10"
                          class="text-body-xs text-(--text-muted)"
                        >
                          And {{ failedRows.length - 10 }} more.
                        </li>
                      </ul>
                      <template v-if="importPreview.length">
                        <p class="m-0 text-body-sm text-(--text-muted)">
                          The first {{ importPreview.length }} rows as they will be inserted.
                        </p>
                        <TableRoot
                          :data="importPreview"
                          :columns="importPreviewColumns"
                          row-key="__row"
                          :bordered="true"
                          density="compact"
                          aria-label="Import preview"
                        />
                      </template>
                    </div>
                  </SettingsSection>
                </template>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full justify-end gap-(--spacing-xs)">
                <Button
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  size="medium"
                  :disabled="importing"
                  @click="importOpen = false"
                />
                <Button
                  type="submit"
                  :label="
                    validRows.length
                      ? `Insert ${validRows.length} ${validRows.length === 1 ? 'row' : 'rows'}`
                      : 'Insert rows'
                  "
                  kind="primary"
                  size="medium"
                  :loading="importing"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
    <Toaster position="bottom-right" />
  </div>
</template>
