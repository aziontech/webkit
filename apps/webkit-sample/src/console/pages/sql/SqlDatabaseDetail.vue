<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import PaginatorRoot from '@aziontech/webkit/paginator-root'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Sidebar from '@aziontech/webkit/sidebar'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import SqlTemplatesDrawer from '../../components/sql/SqlTemplatesDrawer.vue'
  import { TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { isIntegerType } from '../../lib/format/postgres-types'
  import AddColumnDrawer from './AddColumnDrawer.vue'
  import AddRowDrawer from './AddRowDrawer.vue'
  import CreateTableDrawer from './CreateTableDrawer.vue'

  const route = useRoute()
  const router = useRouter()

  const database = {
    id: route.params.id || 'db-new',
    name: route.query.name || 'my-new-database'
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'tables'),
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  const tables = ref([])
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

  const schemaColumns = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: TAG_COLUMN },
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

  const selectTable = (id) => {
    selectedTableId.value = id
  }
  const refreshTables = () =>
    toast.info('Tables refreshed.', { description: 'Showing the latest schema.' })
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const deleteTable = (event, table) => {
    pendingDelete.value = table
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    const table = pendingDelete.value
    if (!table) return
    tables.value = tables.value.filter((item) => item.id !== table.id)
    if (selectedTableId.value === table.id) selectedTableId.value = null
    toast.success(`Table "${table.name}" deleted.`)
    pendingDelete.value = null
  }

  const tableDrawerOpen = ref(false)
  const openTableDrawer = () => {
    tableDrawerOpen.value = true
  }
  const onTableCreated = (table) => {
    tables.value = [...tables.value, { ...table, rows: [] }]
    selectedTableId.value = table.id
  }

  const leftWidth = ref(288)
  const leftCollapsed = ref(false)

  const tableView = ref('data')
  const tableViewOptions = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  const GRID_CELL =
    'flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) ' +
    'border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)'
  const GRID_SELECT_CELL =
    'flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)'
  const GRID_ACTION_CELL = 'flex shrink-0 items-center px-(--spacing-xs)'
  const rowFilter = ref('')
  const filterPlaceholder = computed(() => {
    const names = (selectedTable.value?.columns ?? []).map((column) => column.name)
    return names.length
      ? `Filter by ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''} or ask AI`
      : 'Filter rows or ask AI'
  })
  const comingSoon = (what) => toast.info(what, { description: 'Not available in this demo.' })

  const addColumnOpen = ref(false)
  const openAddColumn = () => {
    if (selectedTable.value) addColumnOpen.value = true
  }
  const onColumnCreated = (column) => {
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (table) table.columns = [...table.columns, column]
  }

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

  let rowSeq = 0
  const isAutoColumn = (column) => column.primaryKey && isIntegerType(column.type)
  const resolveDefault = (raw) =>
    /^(now\(\)|current_timestamp)$/i.test(raw.trim())
      ? new Date().toISOString().replace('T', ' ').slice(0, 19)
      : raw

  const addRowOpen = ref(false)
  const openAddRow = () => {
    if (selectedTable.value) addRowOpen.value = true
  }
  const onRowCreated = (values) => {
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (!table) return
    const row = { __k: `row-${(rowSeq += 1)}` }
    for (const column of table.columns) {
      let value = values[column.name]
      if (isNull(value)) {
        if (isAutoColumn(column)) {
          value = table.rows.reduce((max, r) => Math.max(max, Number(r[column.name]) || 0), 0) + 1
        } else {
          value = column.defaultValue ? resolveDefault(column.defaultValue) : null
        }
      }
      row[column.name] = value
    }
    table.rows = [...table.rows, row]
  }
  const deleteRow = (row) => {
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (!table) return
    table.rows = table.rows.filter((item) => item.__k !== row.__k)
    toast.success('Row deleted.')
  }

  const editorSql = ref(
    `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
  )

  let historySeq = 0
  const makeHistory = (sql) => ({ id: `q-${historySeq++}`, sql })
  const history = ref([
    makeHistory(
      `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
    ),
    makeHistory(
      `CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  embedding F32_BLOB(4)
);`
    )
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

  const addToHistory = (sql) => {
    if (history.value[0]?.sql === sql) return
    history.value = [makeHistory(sql), ...history.value]
  }

  const KEYWORDS = [
    'select',
    'from',
    'where',
    'insert into',
    'values',
    'update',
    'set',
    'delete',
    'create table',
    'if not exists',
    'primary key',
    'autoincrement',
    'not null',
    'unique',
    'default',
    'order by',
    'group by',
    'limit',
    'count',
    'as',
    'and',
    'or',
    'join',
    'on',
    'index',
    'distinct',
    'into'
  ]
  const prettify = () => {
    let text = editorSql.value
    for (const keyword of KEYWORDS) {
      const pattern = new RegExp(`\\b${keyword.replace(/ /g, '\\s+')}\\b`, 'gi')
      text = text.replace(pattern, keyword.toUpperCase())
    }
    editorSql.value = text
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .trim()
    toast.info('Query prettified.')
  }

  const mockSelect = () => ({
    type: 'rows',
    columns: ['id', 'name', 'email', 'created_at'],
    rows: [
      {
        __k: 1,
        id: 1,
        name: 'Ada Lovelace',
        email: 'ada@azion.com',
        created_at: '2026-07-21 08:15:00'
      },
      {
        __k: 2,
        id: 2,
        name: 'Alan Turing',
        email: 'alan@azion.com',
        created_at: '2026-07-21 08:15:01'
      },
      {
        __k: 3,
        id: 3,
        name: 'Grace Hopper',
        email: 'grace@azion.com',
        created_at: '2026-07-21 08:15:02'
      }
    ]
  })

  const runQuery = async () => {
    const sql = editorSql.value.trim()
    if (!sql) {
      toast.info('Nothing to run', { description: 'Write a query first.' })
      return
    }
    if (running.value) return

    running.value = true
    results.value = null
    try {
      await sleep(700)
      addToHistory(sql)
      const verb = sql.split(/\s+/)[0].toUpperCase()
      if (verb === 'SELECT') {
        results.value = mockSelect()
      } else {
        const noun =
          verb === 'CREATE'
            ? 'Table created.'
            : verb === 'INSERT'
              ? 'Rows inserted.'
              : 'Statement executed.'
        results.value = { type: 'message', text: noun }
      }
      toast.success('Query executed.')
    } catch (error) {
      toast.error('Query failed.', {
        description: error?.message ?? 'Check the statement and try again.',
        action: { label: 'Retry', onClick: () => runQuery() }
      })
    } finally {
      running.value = false
    }
  }
</script>

<template>
  <AppLayout
    active="sql-database"
    :padded="false"
    :breadcrumb="[{ label: 'SQL Database', href: '/sql-database' }, { label: database.name }]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      />

      <section
        v-if="activeTab === 'tables'"
        class="animate-page-enter motion-reduce:animate-none relative flex min-h-0 flex-1 overflow-hidden"
      >
        <Sidebar
          v-model:width="leftWidth"
          v-model:collapsed="leftCollapsed"
          resizable
          collapsible
          aria-label="Tables"
          collapse-aria-label="Hide the tables panel"
          expand-aria-label="Show the tables panel"
          resize-aria-label="Resize the tables panel"
          class="[--sidebar-width:var(--container-2xs)]"
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
                      @click="refreshTables"
                    />
                  </Tooltip>
                  <Tooltip text="Create Table">
                    <IconButton
                      icon="pi pi-plus"
                      kind="outlined"
                      size="small"
                      aria-label="Create Table"
                      @click="openTableDrawer"
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
                  :data-selected="selectedTable && selectedTable.id === table.id ? true : null"
                  class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-selected:bg-(--bg-hover) motion-reduce:transition-none"
                  @click="selectTable(table.id)"
                >
                  <i
                    class="pi pi-table shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 truncate">{{ table.name }}</span>
                </button>
                <Dropdown
                  placement="bottom-end"
                  @select="(event, value) => value === 'delete' && deleteTable(event, table)"
                >
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

        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            v-if="!selectedTable"
            class="flex flex-1 items-center justify-center p-(--spacing-md)"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No tables yet"
                  description="Create your first table to store your data."
                  class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
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
                    <HeadingAction
                      label="Create Table"
                      kind="secondary"
                      icon="pi pi-plus"
                      @click="openTableDrawer"
                    />
                  </template>
                </EmptyState>
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
                <span class="truncate text-heading-xxs text-(--text-default)">
                  {{ selectedTable.name }}
                </span>
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
                <InputText
                  v-model="rowFilter"
                  size="medium"
                  class="min-w-0 flex-1 md:max-w-(--container-lg)"
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
                <div class="ml-auto flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Sort"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-sort-alt"
                    @click="comingSoon('Sort rows')"
                  />
                  <Tooltip text="Refresh">
                    <IconButton
                      icon="pi pi-refresh"
                      kind="outlined"
                      size="medium"
                      aria-label="Refresh"
                      @click="refreshTables"
                    />
                  </Tooltip>
                  <Button
                    label="Insert"
                    kind="primary"
                    size="medium"
                    icon="pi pi-plus"
                    @click="openAddRow"
                  />
                </div>
              </div>

              <div class="min-h-0 flex-1 overflow-auto">
                <div
                  class="flex items-stretch border-b border-(--border-default) bg-(--bg-surface-raised)"
                >
                  <div :class="GRID_SELECT_CELL">
                    <Checkbox
                      binary
                      disabled
                      aria-label="Select all rows"
                    />
                  </div>
                  <div
                    v-for="column in selectedTable.columns"
                    :key="column.id"
                    :class="GRID_CELL"
                  >
                    <span class="truncate text-label-md text-(--text-default)">
                      {{ column.name }}
                    </span>
                    <span class="shrink-0 text-body-xs text-(--text-muted)">
                      {{ column.type }}
                    </span>
                    <i
                      v-if="column.primaryKey"
                      class="pi pi-key ml-auto shrink-0 pl-(--spacing-xs) text-(--primary)"
                      aria-label="Primary key"
                    />
                  </div>
                  <div :class="GRID_ACTION_CELL">
                    <Tooltip text="Add column">
                      <IconButton
                        icon="pi pi-plus"
                        kind="transparent"
                        size="small"
                        aria-label="Add column"
                        @click="openAddColumn"
                      />
                    </Tooltip>
                  </div>
                </div>

                <div
                  v-for="row in filteredRows"
                  :key="row.__k"
                  class="group flex items-stretch border-b border-(--border-muted) hover:bg-(--bg-hover)"
                >
                  <div :class="GRID_SELECT_CELL">
                    <Checkbox
                      binary
                      disabled
                      :aria-label="`Select row ${row.__k}`"
                    />
                  </div>
                  <div
                    v-for="column in selectedTable.columns"
                    :key="column.id"
                    :class="GRID_CELL"
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
                  <div :class="GRID_ACTION_CELL">
                    <Tooltip text="Delete row">
                      <IconButton
                        icon="pi pi-trash"
                        kind="transparent"
                        size="small"
                        aria-label="Delete row"
                        class="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none"
                        @click="deleteRow(row)"
                      />
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
                      @click="openAddRow"
                    />
                    <Button
                      label="Import data from CSV"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-upload"
                      @click="comingSoon('Import data from CSV')"
                    />
                  </div>
                  <p class="text-body-xs text-(--text-muted)">or drag and drop a CSV file here</p>
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
                  @click="openAddColumn"
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
        <Sidebar
          v-model:width="leftWidth"
          v-model:collapsed="leftCollapsed"
          resizable
          collapsible
          aria-label="Query history"
          collapse-aria-label="Hide the query history"
          expand-aria-label="Show the query history"
          resize-aria-label="Resize the query history panel"
          class="[--sidebar-width:var(--container-2xs)]"
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
                @click="prettify"
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

          <Textarea
            v-model="editorSql"
            :disabled="running"
            resizable="vertical"
            class="min-h-(--container-3xs) w-full rounded-none! border-0! font-code"
            aria-label="SQL editor"
            placeholder="Write your SQL query here"
          />

          <div
            class="flex flex-col border-t-(length:--border-width-default) border-(--border-default)"
          >
            <div
              class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
            >
              <span class="shrink-0 text-heading-xxs text-(--text-default)"> Results </span>
              <InputText
                v-model="resultSearch"
                size="medium"
                class="ml-(--spacing-sm) min-w-0 flex-1 md:max-w-(--container-sm)"
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
                    @click="comingSoon('Download results')"
                  />
                </Tooltip>
                <Tooltip text="Columns">
                  <IconButton
                    icon="pi pi-table"
                    kind="outlined"
                    size="medium"
                    aria-label="Toggle columns"
                    :disabled="!resultRows.length"
                    @click="comingSoon('Toggle columns')"
                  />
                </Tooltip>
                <Button
                  label="Insert"
                  kind="primary"
                  size="medium"
                  icon="pi pi-plus"
                  :disabled="true"
                  @click="comingSoon('Insert row')"
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

    <SqlTemplatesDrawer
      v-model:open="templatesOpen"
      @select="applyTemplate"
    />

    <CreateTableDrawer
      v-model:open="tableDrawerOpen"
      @created="onTableCreated"
    />

    <AddColumnDrawer
      v-model:open="addColumnOpen"
      :table-name="selectedTable?.name ?? ''"
      @created="onColumnCreated"
    />

    <AddRowDrawer
      v-model:open="addRowOpen"
      :table="selectedTable"
      @created="onRowCreated"
    />

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Table"
      :name="pendingDelete?.name ?? ''"
      description="The selected Table will be deleted, along with every row it holds. Check the"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>
