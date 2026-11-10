<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import Message from '@aziontech/webkit/message'
  import PaginatorRoot from '@aziontech/webkit/paginator-root'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TabView from '@aziontech/webkit/tab-view'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

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
                  label: 'Build & Deployment',
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
                { id: 'settings-tokens', label: 'Personal Tokens', path: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity History', path: '/account/activity' }
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
    { id: 'settings', label: 'Account Settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal Tokens', icon: 'pi pi-key' },
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
      label: resolvedTheme.value === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand Sidebar' : 'Collapse Sidebar',
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
  const activeTab = ref('editor')

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
  const selectedTableId = ref(null)
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
      ? `Filter by ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''} or ask AI`
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
    { label: 'Json', value: 'json' }
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
      results.value = verb === 'SELECT' ? structuredClone(selectResult) : { type: 'message', text }
      running.value = false
    }, 700)
  }

  const templates = [
    {
      id: 'create-table',
      title: 'Create Table',
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
      title: 'Insert Data',
      description: 'Insert sample customer records into the customers table',
      icon: 'pi pi-plus-circle',
      sql: `INSERT INTO customers (name, email) VALUES
  ('Ada Lovelace', 'ada@example.com'),
  ('Alan Turing', 'alan@example.com'),
  ('Grace Hopper', 'grace@example.com');`
    },
    {
      id: 'select-all',
      title: 'Select All',
      description: 'Retrieve all records from customers table with limit',
      icon: 'pi pi-list',
      sql: `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`
    },
    {
      id: 'count-records',
      title: 'Count Records',
      description: 'Count total number of records in customers table',
      icon: 'pi pi-hashtag',
      sql: 'SELECT COUNT(*) AS total_customers FROM customers;'
    },
    {
      id: 'related-table',
      title: 'Related Table',
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
      title: 'Insert Related Rows',
      description: 'Insert sample orders for existing customers',
      icon: 'pi pi-arrow-right-arrow-left',
      sql: `INSERT INTO orders (customer_id, total) VALUES
  (1, 42.50),
  (3, 18.00);`
    },
    {
      id: 'join-tables',
      title: 'Join Tables',
      description: 'List every order with the name of the customer who placed it',
      icon: 'pi pi-search',
      sql: `SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id DESC;`
    },
    {
      id: 'create-index',
      title: 'Create Index',
      description: 'Create an index to speed up lookups of orders by customer',
      icon: 'pi pi-sitemap',
      sql: `CREATE INDEX IF NOT EXISTS orders_customer_id_idx
ON orders (customer_id);`
    },
    {
      id: 'top-customers',
      title: 'Top Customers',
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

            <CommandMenu
              v-model:open="paletteOpen"
              @select="onPaletteSelect"
            >
              <CommandMenu.Input
                placeholder="Search resources, pages and commands"
                @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
              />
              <CommandMenu.List>
                <CommandMenu.Group
                  v-if="!paletteQuery"
                  key="recents"
                  heading="Recents"
                >
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Separator
                  v-if="!paletteQuery"
                  key="recents-rule"
                />

                <CommandMenu.Group
                  v-for="group in paletteGroups"
                  :key="group.key"
                  :heading="group.heading"
                >
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Separator key="commands-rule" />

                <CommandMenu.Group heading="Actions">
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Group heading="Account">
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Empty
                  >No resource, page or command matches your search.</CommandMenu.Empty
                >
              </CommandMenu.List>
            </CommandMenu>
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
            <Dropdown placement="top-end">
              <Dropdown.Trigger>
                <Tooltip text="Account menu">
                  <IconButton
                    icon="pi pi-ellipsis-v"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </Tooltip>
              </Dropdown.Trigger>
              <Dropdown.Group>
                <template #top>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">alex</span>
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
                  </div>
                </template>
                <Dropdown.Option
                  value="settings"
                  label="Account Settings"
                >
                  <template #right>
                    <i
                      class="pi pi-cog"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="personal-tokens"
                  label="Personal Tokens"
                >
                  <template #right>
                    <i
                      class="pi pi-key"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
                <div
                  class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                >
                  <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model:value="theme"
                    aria-label="Theme"
                  />
                </div>
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option
                  value="home"
                  label="Home Page"
                >
                  <template #right>
                    <i
                      class="pi pi-home"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="changelog"
                  label="Changelog"
                >
                  <template #right>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="feedback"
                  label="Feedback"
                >
                  <template #right>
                    <i
                      class="pi pi-comment"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="docs"
                  label="Docs"
                >
                  <template #right>
                    <i
                      class="pi pi-book"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option
                  value="logout"
                  label="Log out"
                >
                  <template #right>
                    <i
                      class="pi pi-sign-out"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
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
              </Dropdown.Group>
            </Dropdown>
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

              <div class="-ml-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
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
              class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
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
          <div class="border-b border-(--border-default)">
            <div
              class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)"
            >
              <div class="flex -ml-(--spacing-xs) min-w-0 flex-1">
                <TabView
                  v-model:value="activeTab"
                  class="w-full"
                >
                  <TabView.List>
                    <TabView.Item
                      v-for="tab in tabs"
                      :key="tab.value"
                      :value="tab.value"
                      :label="tab.label"
                    />
                  </TabView.List>
                </TabView>
              </div>
            </div>
          </div>

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
                    <InputText
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
                    </InputText>
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
                        class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-selected:bg-(--bg-hover) motion-reduce:transition-none"
                        @click="selectTable(table.id)"
                      >
                        <i
                          class="pi pi-table shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="min-w-0 truncate">{{ table.name }}</span>
                      </button>
                      <Dropdown placement="bottom-end">
                        <Dropdown.Trigger>
                          <Tooltip text="Table actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="transparent"
                              size="small"
                              aria-label="Table actions"
                            />
                          </Tooltip>
                        </Dropdown.Trigger>
                        <Dropdown.Group>
                          <Dropdown.Option
                            value="delete"
                            label="Delete table"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                      </Dropdown>
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
                <CardBox class="w-full max-w-(--container-2xl)">
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
                              class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
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
                </CardBox>
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
                  <SegmentedButton
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
                      <InputText
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
                      </InputText>
                    </div>
                    <div class="ml-auto flex items-center gap-(--spacing-xs)">
                      <Button
                        label="Sort"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-sort-alt"
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
                    <div
                      class="flex items-stretch border-b border-(--border-default) bg-(--bg-surface-raised)"
                    >
                      <div
                        class="flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)"
                      >
                        <Checkbox
                          binary
                          disabled
                          aria-label="Select all rows"
                        />
                      </div>
                      <div
                        v-for="column in selectedTable.columns"
                        :key="column.id"
                        class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
                      >
                        <span class="truncate text-label-md text-(--text-default)">{{
                          column.name
                        }}</span>
                        <span class="shrink-0 text-body-xs text-(--text-muted)">{{
                          column.type
                        }}</span>
                        <i
                          v-if="column.primaryKey"
                          class="pi pi-key ml-auto shrink-0 pl-(--spacing-xs) text-(--primary)"
                          aria-label="Primary key"
                        />
                      </div>
                      <div class="flex shrink-0 items-center px-(--spacing-xs)">
                        <Tooltip text="Add column">
                          <IconButton
                            icon="pi pi-plus"
                            kind="transparent"
                            size="small"
                            aria-label="Add column"
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      v-for="row in filteredRows"
                      :key="row.__k"
                      class="group flex items-stretch border-b border-(--border-muted) hover:bg-(--bg-hover)"
                    >
                      <div
                        class="flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)"
                      >
                        <Checkbox
                          binary
                          disabled
                          :aria-label="`Select row ${row.__k}`"
                        />
                      </div>
                      <div
                        v-for="column in selectedTable.columns"
                        :key="column.id"
                        class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
                      >
                        <span
                          class="truncate text-label-md"
                          :class="
                            isNull(row[column.name])
                              ? 'italic text-(--text-muted)'
                              : 'text-(--text-default)'
                          "
                        >
                          {{ displayCell(row[column.name]) }}
                        </span>
                      </div>
                      <div class="flex shrink-0 items-center px-(--spacing-xs)">
                        <Tooltip text="Delete row">
                          <div
                            class="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none"
                          >
                            <IconButton
                              icon="pi pi-trash"
                              kind="transparent"
                              size="small"
                              aria-label="Delete row"
                              @click="deleteRow(row)"
                            />
                          </div>
                        </Tooltip>
                      </div>
                    </div>

                    <div
                      v-if="!tableRows.length"
                      class="flex flex-col items-center justify-center gap-(--spacing-sm) p-(--spacing-xxl) text-center"
                    >
                      <p class="text-body-sm text-(--text-default)">This table is empty</p>
                      <div class="flex items-center gap-(--spacing-xs)">
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
                        />
                      </div>
                      <p class="text-body-xs text-(--text-muted)">
                        or drag and drop a CSV file here
                      </p>
                    </div>
                    <p
                      v-else-if="!filteredRows.length"
                      class="p-(--spacing-xxl) text-center text-body-sm text-(--text-muted)"
                    >
                      No rows match "{{ rowFilter }}".
                    </p>
                  </div>

                  <div
                    class="flex items-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
                  >
                    <Tooltip text="Previous page">
                      <IconButton
                        icon="pi pi-chevron-left"
                        kind="transparent"
                        size="small"
                        aria-label="Previous page"
                        disabled
                      />
                    </Tooltip>
                    <span>Page <span class="text-(--text-default)">1</span> of 1</span>
                    <Tooltip text="Next page">
                      <IconButton
                        icon="pi pi-chevron-right"
                        kind="transparent"
                        size="small"
                        aria-label="Next page"
                        disabled
                      />
                    </Tooltip>
                    <span class="ml-(--spacing-md)">100 rows</span>
                    <span class="ml-auto"
                      >{{ tableRows.length }} record{{ tableRows.length === 1 ? '' : 's' }}</span
                    >
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
                  <CardBox :padded="false">
                    <template #content>
                      <TableRoot
                        :data="schemaRows"
                        :columns="schemaColumns"
                        row-key="id"
                        :border="false"
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
                  </CardBox>
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
                    <InputText
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
                    </InputText>
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
                        class="min-w-0 flex-1 truncate rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left font-code text-label-code-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                        :title="oneLine(item.sql)"
                        @click="loadFromHistory(item)"
                      >
                        {{ oneLine(item.sql) }}
                      </button>
                      <Dropdown
                        placement="bottom-end"
                        @select="
                          (event, value) =>
                            value === 'run'
                              ? (applyTemplate(item.sql), runQuery())
                              : deleteHistory(event, item)
                        "
                      >
                        <Dropdown.Trigger>
                          <Tooltip text="Query actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="transparent"
                              size="small"
                              aria-label="Query actions"
                            />
                          </Tooltip>
                        </Dropdown.Trigger>
                        <Dropdown.Group>
                          <Dropdown.Option
                            value="run"
                            label="Run query"
                          >
                            <template #left
                              ><i
                                class="pi pi-play"
                                aria-hidden="true"
                            /></template>
                          </Dropdown.Option>
                          <Dropdown.Option
                            value="delete"
                            label="Delete query"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                      </Dropdown>
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
                  label="Run Query"
                  kind="primary"
                  size="medium"
                  icon="pi pi-play"
                  :loading="running"
                  @click="runQuery"
                />
                <div class="ml-auto flex items-center gap-(--spacing-xs)">
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

              <div class="flex w-full min-h-(--container-3xs) font-code">
                <Textarea
                  v-model="editorSql"
                  :disabled="running"
                  resizable="vertical"
                  class="w-full"
                  aria-label="SQL editor"
                  placeholder="Write your SQL query here"
                />
              </div>

              <div
                class="flex flex-col border-t-(length:--border-width-default) border-(--border-default)"
              >
                <div
                  class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
                >
                  <span class="shrink-0 text-heading-xxs text-(--text-default)"> Results </span>
                  <div class="flex ml-(--spacing-sm) min-w-0 flex-1 md:max-w-(--container-sm)">
                    <InputText
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
                    </InputText>
                  </div>
                  <div class="ml-auto flex items-center gap-(--spacing-xs)">
                    <SegmentedButton
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
                    :border="false"
                  />
                  <pre
                    v-else-if="resultRows.length && resultView === 'json'"
                    class="overflow-auto p-(--spacing-md) font-code text-label-code-sm text-(--text-default)"
                    >{{ resultJson }}</pre>
                  <div
                    v-else-if="results && results.type === 'message'"
                    class="p-(--spacing-md)"
                  >
                    <Message
                      severity="success"
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
                  <PaginatorRoot
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
                  <DrawerTitle>SQL Quick Templates</DrawerTitle>
                  <p class="text-body-sm text-(--text-muted)">
                    Pick a snippet to load it into the editor.
                  </p>
                </div>
                <DrawerClose />
              </PanelHeader>

              <PanelContent>
                <div class="flex flex-col gap-(--spacing-md)">
                  <InputText
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
                  </InputText>

                  <div
                    v-if="filteredTemplates.length"
                    class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2"
                  >
                    <button
                      v-for="template in filteredTemplates"
                      :key="template.id"
                      type="button"
                      class="flex flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) text-left transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-primary) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
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
                <Dropdown placement="top-end">
                  <Dropdown.Trigger>
                    <Tooltip text="Account menu">
                      <IconButton
                        icon="pi pi-ellipsis-v"
                        aria-label="Account menu"
                        kind="outlined"
                        size="small"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>
                  <Dropdown.Group>
                    <template #top>
                      <div class="flex min-w-0 flex-col">
                        <span class="truncate text-label-md text-(--text-default)">alex</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >alex@example.com</span
                        >
                      </div>
                    </template>
                    <Dropdown.Option
                      value="settings"
                      label="Account Settings"
                    >
                      <template #right>
                        <i
                          class="pi pi-cog"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="personal-tokens"
                      label="Personal Tokens"
                    >
                      <template #right>
                        <i
                          class="pi pi-key"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <div
                      class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model:value="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="home"
                      label="Home Page"
                    >
                      <template #right>
                        <i
                          class="pi pi-home"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="changelog"
                      label="Changelog"
                    >
                      <template #right>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="feedback"
                      label="Feedback"
                    >
                      <template #right>
                        <i
                          class="pi pi-comment"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="docs"
                      label="Docs"
                    >
                      <template #right>
                        <i
                          class="pi pi-book"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="logout"
                      label="Log out"
                    >
                      <template #right>
                        <i
                          class="pi pi-sign-out"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
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
                  </Dropdown.Group>
                </Dropdown>
              </div>
            </template>
          </Sidebar>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
