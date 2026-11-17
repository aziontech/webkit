<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import CodeEditor, { type CodeEditorMarker } from '@aziontech/webkit/code-editor'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onMounted, ref, watch } from 'vue'

  import { sampleHistory, sampleSql, sampleTables } from './sample'

  /** Which tab the page shows. */
  export type QueryEditorTab = 'tables' | 'editor'

  /** Which view of the selected table the pane shows. */
  export type QueryEditorTableView = 'data' | 'definition'

  /** One column of a table's definition. */
  export interface QueryEditorColumn {
    /** Stable key. */
    id: string
    /** Column name, also the row field it reads. */
    name: string
    /** SQL type, shown beside the name. */
    type: string
    /** Part of the primary key; the header shows a key. */
    primaryKey: boolean
    /** The column rejects NULL. */
    notNull: boolean
  }

  /** One stored row: the stable key and one value per column name. */
  export interface QueryEditorRow {
    /** Stable row key. */
    __k: string
    [column: string]: string | number | null
  }

  /** One table of the database, with its rows. */
  export interface QueryEditorTable {
    /** Stable key. */
    id: string
    /** Table name, listed in the side panel. */
    name: string
    /** The table definition. */
    columns: QueryEditorColumn[]
    /** The rows shown in the Data view. */
    rows: QueryEditorRow[]
  }

  /** One row of a query result: the stable key and one value per result column. */
  export interface QueryEditorResultRow {
    /** Stable row key. */
    __k: number
    [column: string]: string | number | null
  }

  /** What the last query returned: rows, a failure on a line, or a message. */
  export type QueryEditorResult =
    | { type: 'rows'; columns: string[]; rows: QueryEditorResultRow[] }
    | { type: 'error'; line: number; text: string }
    | { type: 'message'; text: string }

  /** One past query in the history panel. */
  export interface QueryEditorHistoryEntry {
    /** Stable key. */
    id: string
    /** The statement that ran. */
    sql: string
  }

  export interface QueryEditorProps {
    /** The database tables with their rows. Left out, the sample renders; pass an empty list for a database with none. */
    tables?: QueryEditorTable[]
    /** Past queries, newest first. Left out, the sample renders. */
    history?: QueryEditorHistoryEntry[]
    /** What the last query returned; left out, Results is ready to execute. */
    result?: QueryEditorResult | null
    /** The tables and the selected table's rows are loading: skeleton lines hold the side panel and the rows table shows its loading state. */
    loading?: boolean
    /** A query is in flight: Run query spins, the editor locks and Results shows skeleton lines. */
    running?: boolean
    /** Why the selected table's rows could not load; a danger alert with Retry replaces the rows. */
    error?: string
    /** The view of the selected table the pane opens on. */
    defaultTableView?: QueryEditorTableView
    /** Rows selected when the page opens, by row key. */
    defaultSelectedKeys?: string[]
    /** The SQL quick templates drawer starts open. */
    defaultTemplatesOpen?: boolean
  }

  interface QueryTemplate {
    title: string
    description: string
    icon: string
    sql: string
  }

  const props = withDefaults(defineProps<QueryEditorProps>(), {
    tables: undefined,
    history: undefined,
    result: undefined,
    loading: false,
    running: false,
    error: '',
    defaultTableView: 'data',
    defaultSelectedKeys: () => [],
    defaultTemplatesOpen: false
  })

  const emit = defineEmits<{
    run: [event: Event, sql: string]
    'refresh-tables': [event: MouseEvent]
    'create-table': [event: MouseEvent]
    'delete-table': [event: Event, table: QueryEditorTable]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'insert-row': [event: MouseEvent, table: QueryEditorTable]
    'import-csv': [event: MouseEvent, table: QueryEditorTable]
    'add-column': [event: MouseEvent, table: QueryEditorTable]
    'delete-rows': [event: Event, payload: { table: QueryEditorTable; rows: QueryEditorRow[] }]
    'delete-query': [event: Event, entry: QueryEditorHistoryEntry]
    'download-results': [event: MouseEvent, result: QueryEditorResult]
  }>()

  const activeTab = defineModel<QueryEditorTab>('tab', { default: 'tables' })
  const selectedTableId = defineModel<string | null>('table', { default: null })
  const editorSql = defineModel<string>('sql', { default: sampleSql })

  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]

  const tableSource = computed<QueryEditorTable[]>(
    () => props.tables ?? (props.loading || props.error ? [] : sampleTables)
  )
  const tableList = ref<QueryEditorTable[]>([])
  watch(
    tableSource,
    (next) => {
      tableList.value = next.map((table) => ({ ...table, rows: [...table.rows] }))
    },
    { immediate: true }
  )
  const tableSearch = ref('')
  const filteredTables = computed(() => {
    const term = tableSearch.value.trim().toLowerCase()
    if (!term) return tableList.value
    return tableList.value.filter((table) => table.name.toLowerCase().includes(term))
  })
  const selectedTable = computed(
    () =>
      tableList.value.find((table) => table.id === selectedTableId.value) ??
      tableList.value[0] ??
      null
  )
  const selectTable = (id: string) => {
    selectedTableId.value = id
  }
  const onTableAction = (event: Event, value: unknown, table: QueryEditorTable) => {
    if (value === 'delete') emit('delete-table', event, table)
  }

  const schemaColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 104 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 }
  ]
  const schemaRows = computed(() => {
    if (!selectedTable.value) return []
    return selectedTable.value.columns.map((column) => ({
      name: column.name,
      id: column.id,
      type: column.type,
      constraints: [column.primaryKey ? 'PRIMARY KEY' : '', column.notNull ? 'NOT NULL' : '']
        .filter(Boolean)
        .join(', ')
    }))
  })

  const leftWidth = ref(288)
  const leftOpen = ref(true)
  onMounted(() => {
    if (globalThis.matchMedia?.('(width < 48rem)').matches) leftOpen.value = false
  })

  const tableView = ref<QueryEditorTableView>(props.defaultTableView)
  const tableViewOptions = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  const rowFilter = ref('')
  const filterPlaceholder = computed(() => {
    const names = (selectedTable.value?.columns ?? []).map((column) => column.name)
    return names.length ? `Filter by ${names.slice(0, 3).join(', ')}` : 'Filter rows'
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
  const selectedKeys = ref<string[]>([...props.defaultSelectedKeys])
  const dataColumns = computed<TableColumn[]>(() => [
    ...(selectedTable.value?.columns ?? []).map((column) => ({
      accessorKey: column.name,
      id: column.name,
      header: column.name,
      sortable: true,
      minWidth: 160
    })),
    { id: '__actions', type: 'action', hideable: false }
  ])
  watch(selectedTableId, () => {
    selectedKeys.value = []
  })
  const editorMarkers = computed<CodeEditorMarker[]>(() =>
    results.value?.type === 'error' && results.value.line
      ? [{ line: results.value.line, severity: 'danger', message: results.value.text }]
      : []
  )
  const isNull = (value: unknown) => value === null || value === undefined || value === ''
  const displayCell = (value: unknown) => (isNull(value) ? 'NULL' : String(value))
  const removeRows = (event: Event, table: QueryEditorTable, keys: Set<string>) => {
    const rows = table.rows.filter((row) => keys.has(row.__k))
    if (!rows.length) return
    table.rows = table.rows.filter((row) => !keys.has(row.__k))
    emit('delete-rows', event, { table, rows })
  }
  const deleteRow = (event: MouseEvent, row: QueryEditorRow) => {
    const table = tableList.value.find((item) => item.id === selectedTable.value?.id)
    if (table) removeRows(event, table, new Set([row.__k]))
  }
  const deleteSelected = (event: MouseEvent) => {
    const table = tableList.value.find((item) => item.id === selectedTable.value?.id)
    if (!table || !selectedKeys.value.length) return
    removeRows(event, table, new Set(selectedKeys.value))
    selectedKeys.value = []
  }

  const historySource = computed<QueryEditorHistoryEntry[]>(
    () => props.history ?? (props.loading || props.error ? [] : sampleHistory)
  )
  const historyList = ref<QueryEditorHistoryEntry[]>([])
  watch(
    historySource,
    (next) => {
      historyList.value = [...next]
    },
    { immediate: true }
  )
  const historySearch = ref('')
  const filteredHistory = computed(() => {
    const term = historySearch.value.trim().toLowerCase()
    if (!term) return historyList.value
    return historyList.value.filter((item) => item.sql.toLowerCase().includes(term))
  })
  const oneLine = (sql: string) => sql.replace(/\s+/g, ' ').trim()

  const running = computed(() => props.running)
  const templatesOpen = ref(props.defaultTemplatesOpen)
  const results = computed<QueryEditorResult | null>(() =>
    props.running ? null : (props.result ?? null)
  )
  const resultColumns = computed<TableColumn[]>(() => {
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
  const resultRows = computed<QueryEditorResultRow[]>(() =>
    results.value?.type === 'rows' ? results.value.rows : []
  )
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

  const applyTemplate = (sql: string) => {
    editorSql.value = sql
  }
  const loadFromHistory = (item: QueryEditorHistoryEntry) => {
    editorSql.value = item.sql
    activeTab.value = 'editor'
  }
  const deleteHistory = (event: Event, item: QueryEditorHistoryEntry) => {
    historyList.value = historyList.value.filter((entry) => entry.id !== item.id)
    emit('delete-query', event, item)
  }

  const resultStatus = computed(() => {
    if (running.value) return 'Running the query.'
    if (!results.value) return ''
    if (results.value.type !== 'rows') return results.value.text
    const count = results.value.rows.length
    return `${count} ${count === 1 ? 'row' : 'rows'} returned.`
  })

  const runQuery = (event: Event) => {
    const sql = editorSql.value.trim()
    if (!sql || running.value) return
    emit('run', event, sql)
  }
  const onHistoryAction = (event: Event, value: unknown, item: QueryEditorHistoryEntry) => {
    if (value === 'run') {
      applyTemplate(item.sql)
      runQuery(event)
      return
    }
    deleteHistory(event, item)
  }
  const downloadResults = (event: MouseEvent) => {
    if (results.value) emit('download-results', event, results.value)
  }

  const templates: QueryTemplate[] = [
    {
      title: 'Create table',
      description: 'Create a basic customers table with auto-increment ID and timestamp',
      icon: 'az az-table',
      sql: `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
    },
    {
      title: 'Insert data',
      description: 'Insert sample customer records into the customers table',
      icon: 'az az-circle-plus',
      sql: `INSERT INTO customers (name, email) VALUES
  ('Jane Doe', 'jane.doe@example.com'),
  ('John Smith', 'john.smith@example.com'),
  ('Alex Morgan', 'alex.morgan@example.com');`
    },
    {
      title: 'Select all',
      description: 'Retrieve all records from customers table with limit',
      icon: 'az az-list',
      sql: `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`
    },
    {
      title: 'Count records',
      description: 'Count total number of records in customers table',
      icon: 'az az-hash',
      sql: 'SELECT COUNT(*) AS total_customers FROM customers;'
    },
    {
      title: 'Related table',
      description: 'Create an orders table that references the customers table',
      icon: 'az az-box',
      sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
    },
    {
      title: 'Insert related rows',
      description: 'Insert sample orders for existing customers',
      icon: 'az az-arrow-right-left',
      sql: `INSERT INTO orders (customer_id, total) VALUES
  (1, 42.50),
  (3, 18.00);`
    },
    {
      title: 'Join tables',
      description: 'List every order with the name of the customer who placed it',
      icon: 'az az-search',
      sql: `SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id DESC;`
    },
    {
      title: 'Create index',
      description: 'Create an index to speed up lookups of orders by customer',
      icon: 'az az-sitemap',
      sql: `CREATE INDEX IF NOT EXISTS orders_customer_id_idx
ON orders (customer_id);`
    },
    {
      title: 'Top customers',
      description: 'Find the 3 customers with the highest order totals',
      icon: 'az az-arrow-down-wide-narrow',
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
  const chooseTemplate = (template: QueryTemplate) => {
    applyTemplate(template.sql)
    templatesOpen.value = false
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <PageTabs v-model="activeTab">
      <Tabs.Trigger
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
          v-model:open="leftOpen"
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
                <span class="text-heading-2xs text-(--text-default)">Tables</span>
                <div class="flex items-center gap-(--spacing-2xs)">
                  <Tooltip content="Refresh tables">
                    <IconButton
                      icon="az az-refresh"
                      variant="outline"
                      size="small"
                      aria-label="Refresh tables"
                      @click="(event: MouseEvent) => emit('refresh-tables', event)"
                    />
                  </Tooltip>
                  <Tooltip content="Create Table">
                    <IconButton
                      icon="az az-plus"
                      variant="outline"
                      size="small"
                      aria-label="Create Table"
                      @click="(event: MouseEvent) => emit('create-table', event)"
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
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </div>
          </template>
          <div>
            <div
              v-if="loading"
              class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) py-(--spacing-sm)"
              aria-busy="true"
              aria-label="Loading tables"
            >
              <Skeleton
                v-for="line in 4"
                :key="line"
                height="1.5rem"
              />
            </div>
            <p
              v-else-if="!tableList.length"
              class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              No tables created yet
            </p>
            <EmptyState
              v-else-if="!filteredTables.length"
              size="small"
              icon="az az-search"
              :title="`No tables match “${tableSearch}”`"
            >
              <template #actions>
                <Button
                  label="Clear search"
                  variant="outline"
                  size="small"
                  @click="tableSearch = ''"
                />
              </template>
            </EmptyState>
            <div
              v-else
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <div
                v-for="table in filteredTables"
                :key="table.id"
                class="group flex items-center gap-(--spacing-2xs)"
              >
                <Item
                  clickable
                  variant="option"
                  :aria-pressed="selectedTable?.id === table.id"
                  class="min-w-0 flex-1"
                  @click="selectTable(table.id)"
                >
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                    <i
                      class="az az-table shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate text-label-sm">{{ table.name }}</span>
                  </span>
                </Item>
                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="(event, value) => onTableAction(event, value, table)"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip :content="`Actions for ${table.name}`">
                      <IconButton
                        icon="az az-ellipsis"
                        variant="ghost"
                        size="small"
                        :aria-label="`Actions for ${table.name}`"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete table"
                    >
                      <template #leading
                        ><i
                          class="az az-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
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
          <EmptyState
            bordered
            size="medium"
            icon="az az-table"
            title="No tables yet"
            description="Create your first table to store your data."
            class="w-full max-w-(--container-2xl)"
          >
            <template #actions>
              <div class="w-full md:w-fit">
                <Button
                  label="Create Table"
                  icon="az az-plus"
                  variant="secondary"
                  size="medium"
                  class="w-full"
                  @click="(event: MouseEvent) => emit('create-table', event)"
                />
              </div>
            </template>
          </EmptyState>
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
                class="az az-table shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-heading-2xs text-(--text-default)">{{
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
                  <template #leading>
                    <i
                      class="az az-search"
                      aria-hidden="true"
                    />
                  </template>
                </Input>
              </div>
              <div class="ms-auto flex items-center gap-(--spacing-xs)">
                <Button
                  v-if="selectedKeys.length"
                  key="delete-rows"
                  :label="`Delete ${selectedKeys.length} ${selectedKeys.length === 1 ? 'row' : 'rows'}`"
                  variant="danger"
                  size="medium"
                  icon="az az-trash"
                  @click="deleteSelected"
                />
                <Button
                  v-else
                  key="sort"
                  label="Sort"
                  variant="outline"
                  size="medium"
                  icon="az az-sort"
                />
                <Tooltip content="Refresh">
                  <IconButton
                    icon="az az-refresh"
                    variant="outline"
                    size="medium"
                    aria-label="Refresh"
                    @click="(event: MouseEvent) => emit('refresh', event)"
                  />
                </Tooltip>
                <Button
                  label="Insert"
                  variant="primary"
                  size="medium"
                  icon="az az-plus"
                  @click="(event: MouseEvent) => emit('insert-row', event, selectedTable!)"
                />
              </div>
            </div>

            <div
              v-if="error"
              class="p-(--spacing-md)"
            >
              <Alert
                severity="danger"
                :label="error"
                action-label="Retry"
                @action="(event: MouseEvent) => emit('retry', event)"
              />
            </div>
            <div
              v-else
              class="min-h-0 flex-1 overflow-auto"
            >
              <DataTable
                v-model:selected-keys="selectedKeys"
                :data="filteredRows"
                :columns="dataColumns"
                row-key="__k"
                selectable
                sortable
                paginated
                :page-size="25"
                :page-size-options="[25, 50, 100]"
                density="compact"
                :loading="loading"
                :bordered="false"
                :aria-label="`Rows of ${selectedTable.name}`"
              >
                <template
                  v-for="column in selectedTable.columns"
                  :key="column.id"
                  #[`header-${column.name}`]
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                    <span class="truncate">{{ column.name }}</span>
                    <span class="shrink-0 text-body-xs text-(--text-muted)">{{ column.type }}</span>
                    <i
                      v-if="column.primaryKey"
                      class="az az-key shrink-0 text-(--primary)"
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
                    :data-null="isNull(value) || null"
                    class="truncate font-code text-label-code-sm text-(--text-default) data-null:italic data-null:text-(--text-muted)"
                    >{{ displayCell(value) }}</span
                  >
                </template>
                <template #cell-__actions="{ row }">
                  <Tooltip :content="`Delete row ${row['id'] ?? row.__k}`">
                    <IconButton
                      icon="az az-trash"
                      variant="ghost"
                      size="small"
                      :aria-label="`Delete row ${row['id'] ?? row.__k}`"
                      @click="(event: MouseEvent) => deleteRow(event, row)"
                    />
                  </Tooltip>
                </template>
                <template #empty>
                  <EmptyState
                    key="empty-state-1"
                    v-if="!tableRows.length"
                    size="small"
                    icon="az az-table"
                    title="This table is empty"
                    description="Insert a row, import a CSV file or drop one here."
                  >
                    <template #actions>
                      <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                        <Button
                          label="Insert row"
                          variant="secondary"
                          size="medium"
                          icon="az az-plus"
                          @click="(event: MouseEvent) => emit('insert-row', event, selectedTable!)"
                        />
                        <Button
                          label="Import data from CSV"
                          variant="outline"
                          size="medium"
                          icon="az az-upload"
                          @click="(event: MouseEvent) => emit('import-csv', event, selectedTable!)"
                        />
                      </div>
                    </template>
                  </EmptyState>
                  <EmptyState
                    key="empty-state-2"
                    v-else
                    size="small"
                    icon="az az-search"
                    :title="`No rows match “${rowFilter}”`"
                    description="Change the filter to see the rows."
                  >
                    <template #actions>
                      <Button
                        label="Clear filter"
                        variant="outline"
                        size="small"
                        @click="rowFilter = ''"
                      />
                    </template>
                  </EmptyState>
                </template>
              </DataTable>
            </div>
          </div>

          <div
            v-else
            class="flex min-h-0 flex-1 flex-col gap-(--layout-group-gap) overflow-auto p-(--spacing-md)"
          >
            <div class="flex items-center justify-between gap-(--spacing-sm)">
              <p class="text-heading-2xs text-(--text-default)">Columns</p>
              <Button
                label="Add column"
                variant="outline"
                size="medium"
                icon="az az-plus"
                @click="(event: MouseEvent) => emit('add-column', event, selectedTable!)"
              />
            </div>
            <Card :padded="false">
              <template #default>
                <DataTable
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
                      severity="neutral"
                      size="medium"
                    />
                  </template>
                  <template #cell-constraints="{ value }">
                    <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                  </template>
                </DataTable>
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
          v-model:open="leftOpen"
          resizable
          collapsible
          aria-label="Query history"
          collapse-aria-label="Hide the query history"
          expand-aria-label="Show the query history"
          resize-aria-label="Resize the query history panel"
        >
          <template #header>
            <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
              <span class="text-heading-2xs text-(--text-default)">Query history</span>
              <Input
                v-model="historySearch"
                size="medium"
                class="w-full"
                placeholder="Search queries"
                aria-label="Search queries"
              >
                <template #leading>
                  <i
                    class="az az-search"
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
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <div
                v-for="item in filteredHistory"
                :key="item.id"
                class="flex items-center gap-(--spacing-2xs)"
              >
                <Item
                  clickable
                  variant="option"
                  class="min-w-0 flex-1"
                  :title="oneLine(item.sql)"
                  @click="loadFromHistory(item)"
                >
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                    <span class="min-w-0 truncate font-code text-label-code-sm">{{
                      oneLine(item.sql)
                    }}</span>
                  </span>
                </Item>
                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="(event, value) => onHistoryAction(event, value, item)"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip :content="`Actions for ${oneLine(item.sql)}`">
                      <IconButton
                        icon="az az-ellipsis"
                        variant="ghost"
                        size="small"
                        :aria-label="`Actions for ${oneLine(item.sql)}`"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="run"
                      label="Run query"
                    >
                      <template #leading
                        ><i
                          class="az az-play"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete query"
                    >
                      <template #leading
                        ><i
                          class="az az-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
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
            variant="primary"
            size="medium"
            icon="az az-play"
            :loading="running"
            @click="runQuery"
          />
          <div class="ms-auto flex items-center gap-(--spacing-xs)">
            <Button
              label="Prettify"
              variant="outline"
              size="medium"
              icon="az az-align-left"
              :disabled="running"
            />
            <Button
              label="Templates"
              variant="outline"
              size="medium"
              icon="az az-bolt"
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
            <span class="shrink-0 text-heading-2xs text-(--text-default)"> Results </span>
            <div class="flex ms-(--spacing-sm) min-w-0 flex-1 md:max-w-(--container-sm)">
              <Input
                v-model="resultSearch"
                size="medium"
                class="w-full"
                placeholder="Search"
                aria-label="Search results"
                :disabled="!resultRows.length"
              >
                <template #leading>
                  <i
                    class="az az-search"
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
              <Tooltip content="Refresh results">
                <IconButton
                  icon="az az-refresh"
                  variant="outline"
                  size="medium"
                  aria-label="Refresh results"
                  :loading="running"
                  @click="runQuery"
                />
              </Tooltip>
              <Tooltip content="Download results">
                <IconButton
                  icon="az az-download"
                  variant="outline"
                  size="medium"
                  aria-label="Download results"
                  :disabled="!resultRows.length"
                  @click="downloadResults"
                />
              </Tooltip>
              <Tooltip content="Toggle columns">
                <IconButton
                  icon="az az-table"
                  variant="outline"
                  size="medium"
                  aria-label="Toggle columns"
                  :disabled="!resultRows.length"
                />
              </Tooltip>
            </div>
          </div>

          <div class="min-h-(--container-3xs)">
            <p
              role="status"
              class="sr-only"
            >
              {{ resultStatus }}
            </p>
            <div
              v-if="running"
              class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)"
              aria-busy="true"
            >
              <Skeleton
                v-for="line in 4"
                :key="line"
                height="2rem"
              />
            </div>
            <DataTable
              v-else-if="resultRows.length && resultView === 'table'"
              :data="filteredResultRows"
              :columns="resultColumns"
              row-key="__k"
              paginated
              :page-size="50"
              :page-size-options="[10, 25, 50, 100]"
              :bordered="false"
            />
            <CodeBlock
              v-else-if="resultRows.length && resultView === 'json'"
              :code="resultJson"
              language="json"
              copy-aria-label="Copy the results as JSON"
              :bordered="false"
            />
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
        </div>
      </div>
    </section>

    <Drawer
      v-model:open="templatesOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>SQL quick templates</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Pick a snippet to load it into the editor.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <Input
              v-model="templateQuery"
              size="large"
              class="w-full"
              placeholder="Search templates"
              aria-label="Search templates"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>

            <div
              v-if="filteredTemplates.length"
              class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2"
            >
              <Item
                v-for="template in filteredTemplates"
                :key="template.title"
                variant="outline"
                clickable
                @click="chooseTemplate(template)"
              >
                <Item.Media>
                  <i
                    :class="template.icon"
                    class="text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ template.title }}</Item.Title>
                  <Item.Description>{{ template.description }}</Item.Description>
                </Item.Content>
              </Item>
            </div>

            <EmptyState
              v-else
              size="small"
              icon="az az-search"
              :title="`No templates match “${templateQuery}”`"
              description="Try another name or statement."
            >
              <template #actions>
                <Button
                  label="Clear search"
                  variant="outline"
                  size="small"
                  @click="templateQuery = ''"
                />
              </template>
            </EmptyState>
          </div>
        </PanelBody>
      </DrawerContent>
    </Drawer>
  </div>
</template>
