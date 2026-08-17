<script setup>
  // SQL Database detail — the resource-detail view for a single database. It lives
  // in the persistent console shell (AppLayout: sidebar + GlobalHeader with the
  // module breadcrumb, the /navigation skill), and its body is a full-bleed tab
  // bar (Tables / Editor) with each tab rendering a two-pane master/detail layout.
  //
  //   Tables tab  — a left pane listing the database's tables (search + refresh +
  //                 add) and a right pane showing the selected table's schema. With
  //                 no tables the right pane is an EmptyState with one action
  //                 ("+ Table"); the /ux-heuristics empty-state rule.
  //   Editor tab  — a left Query History pane and a right SQL editor (Run Query /
  //                 Prettify / Templates) over a results panel. Running a query
  //                 locks the scope off one `running` flag (Button :loading +
  //                 editor :disabled, the /usability Pattern 1 lock) and reports
  //                 request-level failures via toast; the results panel shows
  //                 "Ready to execute" until a query returns.
  //
  // Creating a table opens a scoped Drawer form (Approach A of the /form skill),
  // committed by one `creatingTable` flag, and appends the table to the list.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Paginator from '@aziontech/webkit/paginator'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Sidebar from '@aziontech/webkit/sidebar'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import SqlTemplatesDrawer from '../../components/sql/SqlTemplatesDrawer.vue'
  import { isIntegerType } from '../../lib/format/postgres-types'
  import AddColumnDrawer from './AddColumnDrawer.vue'
  import AddRowDrawer from './AddRowDrawer.vue'
  import CreateTableDrawer from './CreateTableDrawer.vue'

  const route = useRoute()
  const router = useRouter()

  // A tiny stand-in record — in a real app this comes from the route id.
  const database = {
    id: route.params.id || 'db-new',
    name: route.query.name || 'my-new-database'
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Active tab lives in the URL (?tab=) so it survives reload and is linkable.
  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'tables'),
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // ── Tables tab ──────────────────────────────────────────────────────────
  // Starts empty (a freshly created database), so the Tables tab lands on its
  // empty state; the create Drawer appends real tables the right pane can render.
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

  // The selected table's schema, rendered as a data-driven Table.
  const schemaColumns = [
    { accessorKey: 'name', header: 'Column', principal: true },
    { accessorKey: 'type', header: 'Type' },
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
  // Dropping a table takes its rows with it, so the menu click only arms the dialog —
  // the table's name has to come back before anything is removed.
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

  // ── Create Table drawer (the rich, drag-to-reorder CreateTableDrawer) ─────
  // The drawer owns the form, validation, and the create request; on success it
  // emits the built table, which is appended to the list and selected.
  const tableDrawerOpen = ref(false)
  const openTableDrawer = () => {
    tableDrawerOpen.value = true
  }
  const onTableCreated = (table) => {
    tables.value = [...tables.value, { ...table, rows: [] }]
    selectedTableId.value = table.id
  }

  // ── The left panel ────────────────────────────────────────────────────────
  // IT IS THE DESIGN SYSTEM'S `Sidebar`, not a panel this page builds. The rail
  // gesture — a pointer drag on the edge, a collapse past the snap boundary, the
  // keyboard equivalent on a separator that reports its position, the affordance
  // that brings a hidden panel back, the phase-aware transition, `inert` while
  // out — is large, and this page had a lesser copy of it (drag only, no hide, no
  // ARIA values). `side` is what let the one component cover a trailing panel too,
  // so Real-Time Events dropped its two copies at the same time.
  //
  // One shared width and one shared collapsed flag drive BOTH tabs' left panes:
  // they never render together, and a reader who sized the tables list does not
  // expect the query history to come back at a different width.
  const leftWidth = ref(288)
  const leftCollapsed = ref(false)

  // ── Table data browser (the selected table's rows) ────────────────────────
  // A table starts with no rows, so the grid lands on its "This table is empty"
  // state; the header still shows the columns (name + type, key glyph on the PK).
  // `tableView` toggles the grid ("Data") against the schema ("Definition").
  const tableView = ref('data')
  const tableViewOptions = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  // ── The grid's one width rule ─────────────────────────────────────────────
  // The header row and every data row are the SAME grid, so they cannot each size
  // themselves: one literal, used by both, is what keeps a column's header over its
  // own values. Fixed rather than `min-w`, because a flexible cell grows to its
  // content and a long value then pushes its column — and every column after it —
  // out from under the header (measured: a 405px cell under a 256px header sheared
  // the trailing cell 149px right). Values truncate instead, which is what the
  // header has always done.
  //
  // The checkbox gutter takes the same 40px the design system's own table cell uses
  // (`data-[kind=checkbox]:w-10`), NOT `--spacing-xxl` — that token is redefined per
  // breakpoint (2rem / 4rem / 6rem), so the gutter silently changed width as the
  // viewport grew.
  const GRID_CELL =
    'flex w-[var(--container-3xs)] shrink-0 items-center gap-[var(--spacing-xxs)] ' +
    'border-r border-[var(--border-muted)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]'
  const GRID_SELECT_CELL =
    'flex w-10 shrink-0 items-center justify-center border-r border-[var(--border-muted)] py-[var(--spacing-xs)]'
  const GRID_ACTION_CELL = 'flex shrink-0 items-center px-[var(--spacing-xs)]'
  const rowFilter = ref('')
  const filterPlaceholder = computed(() => {
    const names = (selectedTable.value?.columns ?? []).map((column) => column.name)
    return names.length
      ? `Filter by ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''} or ask AI`
      : 'Filter rows or ask AI'
  })
  const comingSoon = (what) => toast.info(what, { description: 'Not available in this demo.' })

  // Add Column drawer — appends a real column to the selected table.
  const addColumnOpen = ref(false)
  const openAddColumn = () => {
    if (selectedTable.value) addColumnOpen.value = true
  }
  const onColumnCreated = (column) => {
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (table) table.columns = [...table.columns, column]
  }

  // ── Rows ──────────────────────────────────────────────────────────────────
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

  // ── Editor tab ───────────────────────────────────────────────────────────
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

  // One-line preview of a stored query for the history list.
  const oneLine = (sql) => sql.replace(/\s+/g, ' ').trim()

  const running = ref(false)
  const templatesOpen = ref(false)
  // null = "ready to execute"; otherwise { type: 'rows' | 'message', ... }.
  const results = ref(null)

  const resultColumns = computed(() => {
    if (results.value?.type !== 'rows') return []
    return results.value.columns.map((key, index) => ({
      accessorKey: key,
      header: key,
      principal: index === 0
    }))
  })

  // Results anatomy: a Table / Json view toggle, a client-side search over the
  // returned rows, and a Paginator footer ("Showing X to Y of Z entries").
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

  // A naive "Prettify" — uppercases known SQL keywords and normalizes spacing. No
  // external formatter (dependencies.md forbids one); it is a demo affordance.
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

  // Mock a SELECT result set — the demo returns a small, deterministic table.
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
      <!-- Nav pattern (ApplicationDetail): the tabs are the full-bleed bottom of
           the header — a fluid bar pinned at the top while only the tab content
           below scrolls. The database name lives in the GlobalHeader breadcrumb,
           so no page title is repeated here. -->
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      />

      <!-- Tables tab — master/detail: table list on the left, schema on the right.
           `relative` because the Sidebar's edge affordance (the way back to a hidden
           panel) is a SIBLING of the panel positioned against the nearest positioned
           ancestor — a collapsed panel is 0px wide and would clip its own way back. -->
      <section
        v-if="activeTab === 'tables'"
        class="animate-page-enter motion-reduce:animate-none relative flex min-h-0 flex-1 overflow-hidden"
      >
        <!-- Left: the database's tables. The DS rail — resize, hide, and the way back. -->
        <Sidebar
          v-model:width="leftWidth"
          v-model:collapsed="leftCollapsed"
          resizable
          collapsible
          aria-label="Tables"
          collapse-aria-label="Hide the tables panel"
          expand-aria-label="Show the tables panel"
          resize-aria-label="Resize the tables panel"
          class="w-[var(--container-2xs)]"
        >
          <!-- The panel's fixed head: the title, what acts on the whole list, and the
               search that narrows it. In `#header` so it stays put while the list
               below scrolls. -->
          <!-- The head sits on the LIST'S column: every row below carries its own
               `--spacing-xs` so its hover surface bleeds past the text, which puts the
               list 8px inside the region. Without the same inset here the title and the
               search field stuck out 8px from every row under them. -->
          <template #header>
            <div class="flex flex-col gap-[var(--spacing-sm)] px-[var(--spacing-xs)]">
              <div class="flex items-center justify-between gap-[var(--spacing-xs)]">
                <span class="text-heading-xxs text-[var(--text-default)]">Tables</span>
                <div class="flex items-center gap-[var(--spacing-xxs)]">
                  <Tooltip text="Refresh tables">
                    <IconButton
                      icon="pi pi-refresh"
                      kind="outlined"
                      size="small"
                      aria-label="Refresh tables"
                      @click="refreshTables"
                    />
                  </Tooltip>
                  <Tooltip text="Create table">
                    <IconButton
                      icon="pi pi-plus"
                      kind="outlined"
                      size="small"
                      aria-label="Create table"
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

          <!-- The list itself, in the Sidebar's own ScrollArea. -->
          <div>
            <p
              v-if="!tables.length"
              class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
            >
              No tables created yet
            </p>
            <p
              v-else-if="!filteredTables.length"
              class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
            >
              No tables match "{{ tableSearch }}".
            </p>
            <div
              v-else
              class="flex flex-col gap-[var(--spacing-xxs)]"
            >
              <div
                v-for="table in filteredTables"
                :key="table.id"
                class="group flex items-center gap-[var(--spacing-xxs)]"
              >
                <button
                  type="button"
                  :data-selected="selectedTable && selectedTable.id === table.id ? true : null"
                  class="flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left text-label-sm text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[selected]:bg-[var(--bg-hover)] motion-reduce:transition-none"
                  @click="selectTable(table.id)"
                >
                  <i
                    class="pi pi-table shrink-0 text-[var(--text-muted)]"
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

        <!-- Right: the selected table's data browser, or the empty state -->
        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            v-if="!selectedTable"
            class="flex flex-1 items-center justify-center p-[var(--spacing-md)]"
          >
            <CardBox class="w-full max-w-[var(--container-2xl)]">
              <template #content>
                <!-- Empty-state pattern (CreationCenter): a solid CardBox framing
                     a dashed, raised EmptyState surface with a featured icon tile
                     (concentric translucent squares) + one clear action. -->
                <EmptyState
                  size="medium"
                  title="No tables yet"
                  description="Create your first table to store your data."
                  class="flex-1 rounded-[var(--shape-card)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
                      >
                        <i
                          class="pi pi-table text-[1rem] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create Table"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="openTableDrawer"
                    />
                  </template>
                </EmptyState>
              </template>
            </CardBox>
          </div>

          <!-- Selected table: a spreadsheet-style data browser with a Data /
               Definition toggle (Data = the row grid, Definition = the schema). -->
          <div
            v-else
            class="flex min-h-0 flex-1 flex-col"
          >
            <!-- Table header: name + Data/Definition view toggle -->
            <div
              class="flex items-center justify-between gap-[var(--spacing-sm)] border-b border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
            >
              <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                <i
                  class="pi pi-table shrink-0 text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <span class="truncate text-heading-xxs text-[var(--text-default)]">
                  {{ selectedTable.name }}
                </span>
              </div>
              <SegmentedButton
                v-model="tableView"
                :options="tableViewOptions"
                aria-label="Table view"
              />
            </div>

            <!-- Data view — the row grid. -->
            <div
              v-if="tableView === 'data'"
              class="flex min-h-0 flex-1 flex-col"
            >
              <!-- Toolbar: filter + sort + refresh + insert -->
              <div
                class="flex items-center gap-[var(--spacing-xs)] border-b border-[var(--border-default)] p-[var(--spacing-xs)]"
              >
                <InputText
                  v-model="rowFilter"
                  size="medium"
                  class="min-w-0 flex-1 md:max-w-[var(--container-lg)]"
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
                <div class="ml-auto flex items-center gap-[var(--spacing-xs)]">
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

              <!-- Grid: column headers (name + type, key glyph on the PK) + a
                   trailing add-column cell, over the empty-state body.

                   THE HEADER AND THE BODY ARE ONE GRID, so they share one width rule
                   (`GRID_CELL`) and one content column. Two things were breaking that:

                     A cell that could GROW. Both sides used `min-w` only, so a long
                       value widened its body cell past the header above it — measured
                       at 405px against a 256px header — and every column after it
                       sheared right by the difference (149px on a 4-column table).
                       The width is fixed now and long values truncate, which is what
                       the header already promised by truncating.
                     A GLYPH THAT MOVED THE LABEL. The key on a primary-key column sat
                       BEFORE the name, so that one header started 24px right of the
                       values underneath it while every other column lined up. The key
                       trails now: it still marks the column, and the name starts on the
                       same x as its data, at every column, key or no key. -->
              <div class="min-h-0 flex-1 overflow-auto">
                <div
                  class="flex items-stretch border-b border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
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
                    <!-- A column name and its type are data, not code: the grid reads
                         at the same weight as every other table in the console. The
                         code font stays only where the content IS code — the SQL
                         editor, the query result, the history snippets. The name and
                         its type are ONE label ("id int4"), so they sit at the tight
                         step; the key is a separate mark and trails on its own. -->
                    <span class="truncate text-label-md text-[var(--text-default)]">
                      {{ column.name }}
                    </span>
                    <span class="shrink-0 text-body-xs text-[var(--text-muted)]">
                      {{ column.type }}
                    </span>
                    <i
                      v-if="column.primaryKey"
                      class="pi pi-key ml-auto shrink-0 pl-[var(--spacing-xs)] text-[var(--primary)]"
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

                <!-- Data rows — each cell mirrors the header column widths; a NULL
                     value reads muted; a per-row delete appears on hover. -->
                <div
                  v-for="row in filteredRows"
                  :key="row.__k"
                  class="group flex items-stretch border-b border-[var(--border-muted)] hover:bg-[var(--bg-hover)]"
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
                          ? 'italic text-[var(--text-muted)]'
                          : 'text-[var(--text-default)]'
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

                <!-- Empty: no rows at all, or none matching the filter. -->
                <div
                  v-if="!tableRows.length"
                  class="flex flex-col items-center justify-center gap-[var(--spacing-sm)] p-[var(--spacing-xxl)] text-center"
                >
                  <p class="text-body-sm text-[var(--text-default)]">This table is empty</p>
                  <div class="flex items-center gap-[var(--spacing-xs)]">
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
                  <p class="text-body-xs text-[var(--text-muted)]">
                    or drag and drop a CSV file here
                  </p>
                </div>
                <p
                  v-else-if="!filteredRows.length"
                  class="p-[var(--spacing-xxl)] text-center text-body-sm text-[var(--text-muted)]"
                >
                  No rows match "{{ rowFilter }}".
                </p>
              </div>

              <!-- Footer: pagination + record count -->
              <div
                class="flex items-center gap-[var(--spacing-sm)] border-t border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-label-sm text-[var(--text-muted)]"
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
                <span>Page <span class="text-[var(--text-default)]">1</span> of 1</span>
                <Tooltip text="Next page">
                  <IconButton
                    icon="pi pi-chevron-right"
                    kind="transparent"
                    size="small"
                    aria-label="Next page"
                    disabled
                  />
                </Tooltip>
                <span class="ml-[var(--spacing-md)]">100 rows</span>
                <span class="ml-auto"
                  >{{ tableRows.length }} record{{ tableRows.length === 1 ? '' : 's' }}</span
                >
              </div>
            </div>

            <!-- Definition view — the schema as a data-driven Table. -->
            <div
              v-else
              class="flex min-h-0 flex-1 flex-col gap-[var(--layout-group-gap)] overflow-auto p-[var(--spacing-md)]"
            >
              <div class="flex items-center justify-between gap-[var(--spacing-sm)]">
                <p class="text-heading-xxs text-[var(--text-default)]">Columns</p>
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
                  <Table
                    :data="schemaRows"
                    :columns="schemaColumns"
                    row-key="id"
                    :border="false"
                  >
                    <!-- A column name in the SCHEMA table is a table row like any
                         other, so it keeps the cell's own type and --text-default —
                         the code font stays for the surfaces that are actually code
                         (the SQL editor, the query result, the data grid). -->
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
                      <span class="text-body-sm text-[var(--text-muted)]">{{ value || '—' }}</span>
                    </template>
                  </Table>
                </template>
              </CardBox>
            </div>
          </div>
        </div>
      </section>

      <!-- Editor tab — query history on the left, editor + results on the right. -->
      <section
        v-else
        class="relative flex min-h-0 flex-1 overflow-hidden"
      >
        <!-- Left: query history. The same DS rail as the Tables tab, on the same
             shared width and collapsed models. -->
        <Sidebar
          v-model:width="leftWidth"
          v-model:collapsed="leftCollapsed"
          resizable
          collapsible
          aria-label="Query history"
          collapse-aria-label="Hide the query history"
          expand-aria-label="Show the query history"
          resize-aria-label="Resize the query history panel"
          class="w-[var(--container-2xs)]"
        >
          <template #header>
            <div class="flex flex-col gap-[var(--spacing-sm)] px-[var(--spacing-xs)]">
              <span class="text-heading-xxs text-[var(--text-default)]">Query history</span>
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
              class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
            >
              No queries yet
            </p>
            <div
              v-else
              class="flex flex-col gap-[var(--spacing-xxs)]"
            >
              <div
                v-for="item in filteredHistory"
                :key="item.id"
                class="flex items-center gap-[var(--spacing-xxs)]"
              >
                <button
                  type="button"
                  class="min-w-0 flex-1 truncate rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left font-code text-label-code-sm text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
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

        <!-- Right: ONE flat, full-bleed module — the SQL editor (Run Query) and
             the results stacked as blocks, separated by full-width, edge-to-edge
             borders. No card: flat shape, dividers only. -->
        <div class="flex min-w-0 flex-1 flex-col overflow-auto">
          <!-- Query editor toolbar -->
          <div
            class="flex items-center gap-[var(--spacing-xs)] border-b border-[var(--border-default)] p-[var(--spacing-xs)]"
          >
            <Button
              label="Run Query"
              kind="primary"
              size="medium"
              icon="pi pi-play"
              :loading="running"
              @click="runQuery"
            />
            <div class="ml-auto flex items-center gap-[var(--spacing-xs)]">
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

          <!-- Query editor — borderless; the module is the frame. -->
          <Textarea
            v-model="editorSql"
            :disabled="running"
            resizable="vertical"
            class="min-h-[var(--container-3xs)] w-full !rounded-none !border-0 font-code"
            aria-label="SQL editor"
            placeholder="Write your SQL query here"
          />

          <!-- Results — separated from the editor by the full-width border. -->
          <div
            class="flex flex-col border-t-[length:var(--border-width-default)] border-[var(--border-default)]"
          >
            <!-- Results toolbar: label · search · Table/Json · actions · Insert -->
            <div
              class="flex flex-wrap items-center gap-[var(--spacing-xs)] border-b border-[var(--border-default)] p-[var(--spacing-xs)]"
            >
              <span class="shrink-0 text-heading-xxs text-[var(--text-default)]"> Results </span>
              <InputText
                v-model="resultSearch"
                size="medium"
                class="ml-[var(--spacing-sm)] min-w-0 flex-1 md:max-w-[var(--container-sm)]"
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
              <div class="ml-auto flex items-center gap-[var(--spacing-xs)]">
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

            <!-- Body -->
            <div class="min-h-[var(--container-3xs)]">
              <Table
                v-if="resultRows.length && resultView === 'table'"
                :data="filteredResultRows"
                :columns="resultColumns"
                row-key="__k"
                :border="false"
              />
              <pre
                v-else-if="resultRows.length && resultView === 'json'"
                class="overflow-auto p-[var(--spacing-md)] font-code text-label-code-sm text-[var(--text-default)]"
                >{{ resultJson }}</pre>
              <div
                v-else-if="results && results.type === 'message'"
                class="p-[var(--spacing-md)]"
              >
                <Message
                  severity="success"
                  :label="results.text"
                />
              </div>
              <div
                v-else
                class="flex min-h-[var(--container-3xs)] items-center justify-center p-[var(--spacing-lg)]"
              >
                <EmptyState
                  title="Ready to execute"
                  description="Execute a query to see the results here."
                />
              </div>
            </div>

            <!-- Footer: Showing X to Y of Z entries + page size + controls -->
            <div
              class="border-t border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
            >
              <Paginator
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

    <!-- SQL Quick Templates — a right Drawer; loads the chosen snippet into the editor -->
    <SqlTemplatesDrawer
      v-model:open="templatesOpen"
      @select="applyTemplate"
    />

    <!-- Create Table — a rich, drag-to-reorder column editor in a right Drawer -->
    <CreateTableDrawer
      v-model:open="tableDrawerOpen"
      @created="onTableCreated"
    />

    <!-- Add Column — appends a column to the selected table -->
    <AddColumnDrawer
      v-model:open="addColumnOpen"
      :table-name="selectedTable?.name ?? ''"
      @created="onColumnCreated"
    />

    <!-- Insert Row — appends a row to the selected table -->
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
