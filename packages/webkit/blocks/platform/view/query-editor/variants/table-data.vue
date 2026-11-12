<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Sidebar from '@aziontech/webkit/sidebar'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
  const selectedTableId = ref('tbl-events')
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
  onMounted(() => {
    if (globalThis.matchMedia?.('(width < 48rem)').matches) leftCollapsed.value = true
  })

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
  const rowSelection = ref({ 'ev-3': true, 'ev-4': true })
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
  <div class="flex min-h-0 flex-1 flex-col">
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

    <Toaster position="bottom-right" />
  </div>
</template>
