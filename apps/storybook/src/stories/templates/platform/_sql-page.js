import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Checkbox from '@aziontech/webkit/checkbox'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import Dropdown from '@aziontech/webkit/dropdown'
import EmptyState from '@aziontech/webkit/empty-state'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Message from '@aziontech/webkit/message'
import PaginatorRoot from '@aziontech/webkit/paginator-root'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelHeader from '@aziontech/webkit/panel-header'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Sidebar from '@aziontech/webkit/sidebar'
import TabView from '@aziontech/webkit/tab-view'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Textarea from '@aziontech/webkit/textarea'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'

const quoted = (text) =>
  text.includes('\n')
    ? `\`${text.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${')}\``
    : `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  if (typeof value === 'string') return quoted(value)
  if (typeof value !== 'object' || value === null) return String(value)
  const inner = '  '.repeat(depth + 1)
  const outer = '  '.repeat(depth)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return `[\n${value.map((item) => `${inner}${literal(item, depth + 1)}`).join(',\n')}\n${outer}]`
  }
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item, depth + 1)}`)
  const inline = `{ ${entries.join(', ')} }`
  if (!inline.includes('\n') && inline.length + inner.length <= 96) return inline
  return `{\n${entries.map((entry) => `${inner}${entry}`).join(',\n')}\n${outer}}`
}

const declare = (name, value, wrap = '') =>
  `const ${name} = ${wrap ? `${wrap}(${literal(value)})` : literal(value)}`

const TABS = [
  { value: 'tables', label: 'Tables' },
  { value: 'editor', label: 'Editor' }
]

const TABLE_VIEW_OPTIONS = [
  { label: 'Data', value: 'data' },
  { label: 'Definition', value: 'definition' }
]

const RESULT_VIEW_OPTIONS = [
  { label: 'Table', value: 'table' },
  { label: 'Json', value: 'json' }
]

const SCHEMA_COLUMNS = [
  { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
  { accessorKey: 'type', header: 'Type', minWidth: 104 },
  { accessorKey: 'constraints', header: 'Constraints', grow: 2 }
]

export const TABLES = [
  {
    id: 'tbl-users',
    name: 'users',
    columns: [
      { id: 'col-1', name: 'id', type: 'int8', primaryKey: true, notNull: true },
      { id: 'col-2', name: 'name', type: 'text', primaryKey: false, notNull: true },
      { id: 'col-3', name: 'email', type: 'text', primaryKey: false, notNull: true },
      { id: 'col-4', name: 'created_at', type: 'timestamptz', primaryKey: false, notNull: false }
    ],
    rows: [
      {
        __k: 'row-1',
        id: 1,
        name: 'Ada Lovelace',
        email: 'ada@azion.com',
        created_at: '2026-07-21 08:15:00'
      },
      {
        __k: 'row-2',
        id: 2,
        name: 'Alan Turing',
        email: 'alan@azion.com',
        created_at: '2026-07-21 08:15:01'
      },
      {
        __k: 'row-3',
        id: 3,
        name: 'Grace Hopper',
        email: 'grace@azion.com',
        created_at: null
      }
    ]
  },
  {
    id: 'tbl-products',
    name: 'products',
    columns: [
      { id: 'col-5', name: 'id', type: 'int8', primaryKey: true, notNull: true },
      { id: 'col-6', name: 'name', type: 'text', primaryKey: false, notNull: true },
      { id: 'col-7', name: 'description', type: 'text', primaryKey: false, notNull: false }
    ],
    rows: [
      { __k: 'row-4', id: 1, name: 'Edge Cache', description: 'Low-latency caching' },
      { __k: 'row-5', id: 2, name: 'Edge SQL', description: 'Distributed database' }
    ]
  },
  {
    id: 'tbl-sessions',
    name: 'sessions',
    columns: [
      { id: 'col-8', name: 'id', type: 'int8', primaryKey: true, notNull: true },
      { id: 'col-9', name: 'created_at', type: 'timestamptz', primaryKey: false, notNull: false }
    ],
    rows: []
  }
]

export const CREATE_USERS_SQL = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

const CREATE_PRODUCTS_SQL = `CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  embedding F32_BLOB(4)
);`

export const SELECT_USERS_SQL = `SELECT id, name, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT 100;`

export const FIRST_HISTORY = [
  { id: 'q-0', sql: CREATE_USERS_SQL },
  { id: 'q-1', sql: CREATE_PRODUCTS_SQL }
]

export const RAN_HISTORY = [{ id: 'q-2', sql: SELECT_USERS_SQL }, ...FIRST_HISTORY]

export const SELECT_RESULT = {
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
}

const SQL_TEMPLATES = [
  {
    id: 'create-table',
    title: 'Create Table',
    description: 'Create a basic users table with auto-increment ID and timestamp',
    icon: 'pi pi-table',
    sql: CREATE_USERS_SQL
  },
  {
    id: 'insert-data',
    title: 'Insert Data',
    description: 'Insert sample user records into the users table',
    icon: 'pi pi-plus-circle',
    sql: `INSERT INTO users (name, email) VALUES
  ('Ada Lovelace', 'ada@azion.com'),
  ('Alan Turing', 'alan@azion.com'),
  ('Grace Hopper', 'grace@azion.com');`
  },
  {
    id: 'select-all',
    title: 'Select All',
    description: 'Retrieve all records from users table with limit',
    icon: 'pi pi-list',
    sql: SELECT_USERS_SQL
  },
  {
    id: 'count-records',
    title: 'Count Records',
    description: 'Count total number of records in users table',
    icon: 'pi pi-hashtag',
    sql: 'SELECT COUNT(*) AS total_users FROM users;'
  },
  {
    id: 'vector-table',
    title: 'Vector Table',
    description: 'Create a products table with vector embeddings for AI search',
    icon: 'pi pi-box',
    sql: `CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  embedding F32_BLOB(4)
);`
  },
  {
    id: 'insert-vectors',
    title: 'Insert Vectors',
    description: 'Insert sample products with vector embeddings',
    icon: 'pi pi-arrow-right-arrow-left',
    sql: `INSERT INTO products (name, description, embedding) VALUES
  ('Edge Cache', 'Low-latency caching', vector('[0.10, 0.20, 0.30, 0.40]')),
  ('Edge SQL', 'Distributed database', vector('[0.15, 0.25, 0.35, 0.45]'));`
  },
  {
    id: 'vector-search',
    title: 'Vector Search',
    description: 'Search products using cosine similarity with vector embeddings',
    icon: 'pi pi-search',
    sql: `SELECT name, description,
  vector_distance_cos(embedding, vector('[0.12, 0.22, 0.32, 0.42]')) AS distance
FROM products
ORDER BY distance ASC;`
  },
  {
    id: 'create-vector-index',
    title: 'Create Vector Index',
    description: 'Create an index to optimize vector search performance',
    icon: 'pi pi-sitemap',
    sql: `CREATE INDEX IF NOT EXISTS products_embedding_idx
ON products (libsql_vector_idx(embedding));`
  },
  {
    id: 'vector-top-k',
    title: 'Vector Top K Query',
    description: 'Find top 3 most similar products using vector distance',
    icon: 'pi pi-sort-amount-down',
    sql: `SELECT name,
  vector_distance_cos(embedding, vector('[0.12, 0.22, 0.32, 0.42]')) AS distance
FROM products
ORDER BY distance ASC
LIMIT 3;`
  }
]

const statementMessage = (verb) =>
  verb === 'CREATE'
    ? 'Table created.'
    : verb === 'INSERT'
      ? 'Rows inserted.'
      : 'Statement executed.'

export const pageState = (initial) => () => {
  const activeTab = ref(initial.tab)

  const tables = ref(structuredClone(initial.tables))
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

  const tableView = ref(initial.view)

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

  const editorSql = ref(initial.sql)
  const history = ref(structuredClone(initial.history))
  const historySearch = ref('')
  const filteredHistory = computed(() => {
    const term = historySearch.value.trim().toLowerCase()
    if (!term) return history.value
    return history.value.filter((item) => item.sql.toLowerCase().includes(term))
  })
  const oneLine = (sql) => sql.replace(/\s+/g, ' ').trim()

  const running = ref(false)
  const templatesOpen = ref(false)
  const results = ref(structuredClone(initial.results))
  const resultColumns = computed(() => {
    if (results.value?.type !== 'rows') return []
    return results.value.columns.map((key, index) => ({
      accessorKey: key,
      header: key,
      principal: index === 0
    }))
  })
  const resultView = ref('table')
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
    globalThis.setTimeout(() => {
      if (history.value[0]?.sql !== sql) {
        history.value = [{ id: `q-${history.value.length + 1}`, sql }, ...history.value]
      }
      const verb = sql.split(/\s+/)[0].toUpperCase()
      results.value =
        verb === 'SELECT'
          ? structuredClone(SELECT_RESULT)
          : { type: 'message', text: statementMessage(verb) }
      running.value = false
    }, 700)
  }

  const templateQuery = ref('')
  const filteredTemplates = computed(() => {
    const term = templateQuery.value.trim().toLowerCase()
    if (!term) return SQL_TEMPLATES
    return SQL_TEMPLATES.filter(
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

  return {
    tabs: TABS,
    activeTab,
    tables,
    tableSearch,
    filteredTables,
    selectedTable,
    selectTable,
    schemaColumns: SCHEMA_COLUMNS,
    schemaRows,
    leftWidth,
    leftCollapsed,
    tableView,
    tableViewOptions: TABLE_VIEW_OPTIONS,
    rowFilter,
    filterPlaceholder,
    tableRows,
    filteredRows,
    isNull,
    displayCell,
    deleteRow,
    editorSql,
    history,
    historySearch,
    filteredHistory,
    oneLine,
    running,
    templatesOpen,
    results,
    resultColumns,
    resultView,
    resultViewOptions: RESULT_VIEW_OPTIONS,
    resultSearch,
    resultRows,
    filteredResultRows,
    resultJson,
    applyTemplate,
    loadFromHistory,
    deleteHistory,
    runQuery,
    templateQuery,
    filteredTemplates,
    chooseTemplate
  }
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Checkbox from '@aziontech/webkit/checkbox'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import Dropdown from '@aziontech/webkit/dropdown'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Message from '@aziontech/webkit/message'",
  "import PaginatorRoot from '@aziontech/webkit/paginator-root'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Sidebar from '@aziontech/webkit/sidebar'",
  "import TabView from '@aziontech/webkit/tab-view'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Textarea from '@aziontech/webkit/textarea'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { computed, ref, watch } from 'vue'"
]

export const pageScript = (initial) => [
  ...IMPORTS,
  '',
  declare('tabs', TABS),
  `const activeTab = ref('${initial.tab}')`,
  '',
  declare('tables', initial.tables, 'ref'),
  "const tableSearch = ref('')",
  'const selectedTableId = ref(null)',
  'const filteredTables = computed(() => {',
  '  const term = tableSearch.value.trim().toLowerCase()',
  '  if (!term) return tables.value',
  '  return tables.value.filter((table) => table.name.toLowerCase().includes(term))',
  '})',
  'const selectedTable = computed(',
  '  () => tables.value.find((table) => table.id === selectedTableId.value) ?? tables.value[0] ?? null',
  ')',
  'const selectTable = (id) => {',
  '  selectedTableId.value = id',
  '}',
  '',
  declare('schemaColumns', SCHEMA_COLUMNS),
  'const schemaRows = computed(() => {',
  '  if (!selectedTable.value) return []',
  '  return selectedTable.value.columns.map((column) => ({',
  '    id: column.id,',
  '    name: column.name,',
  '    type: column.type,',
  "    constraints: [column.primaryKey ? 'PRIMARY KEY' : '', column.notNull ? 'NOT NULL' : '']",
  '      .filter(Boolean)',
  "      .join(', ')",
  '  }))',
  '})',
  '',
  'const leftWidth = ref(288)',
  'const leftCollapsed = ref(false)',
  '',
  `const tableView = ref('${initial.view}')`,
  declare('tableViewOptions', TABLE_VIEW_OPTIONS),
  '',
  "const rowFilter = ref('')",
  'const filterPlaceholder = computed(() => {',
  '  const names = (selectedTable.value?.columns ?? []).map((column) => column.name)',
  '  return names.length',
  "    ? `Filter by ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''} or ask AI`",
  "    : 'Filter rows or ask AI'",
  '})',
  'const tableRows = computed(() => selectedTable.value?.rows ?? [])',
  'const filteredRows = computed(() => {',
  '  const term = rowFilter.value.trim().toLowerCase()',
  '  if (!term) return tableRows.value',
  '  return tableRows.value.filter((row) =>',
  '    Object.entries(row)',
  "      .filter(([key]) => key !== '__k')",
  "      .some(([, value]) => String(value ?? '').toLowerCase().includes(term))",
  '  )',
  '})',
  "const isNull = (value) => value === null || value === undefined || value === ''",
  "const displayCell = (value) => (isNull(value) ? 'NULL' : String(value))",
  'const deleteRow = (row) => {',
  '  const table = tables.value.find((item) => item.id === selectedTable.value?.id)',
  '  if (!table) return',
  '  table.rows = table.rows.filter((item) => item.__k !== row.__k)',
  '}',
  '',
  `const editorSql = ref(${quoted(initial.sql)})`,
  declare('history', initial.history, 'ref'),
  "const historySearch = ref('')",
  'const filteredHistory = computed(() => {',
  '  const term = historySearch.value.trim().toLowerCase()',
  '  if (!term) return history.value',
  '  return history.value.filter((item) => item.sql.toLowerCase().includes(term))',
  '})',
  "const oneLine = (sql) => sql.replace(/\\s+/g, ' ').trim()",
  '',
  'const running = ref(false)',
  'const templatesOpen = ref(false)',
  declare('selectResult', SELECT_RESULT),
  `const results = ref(${initial.results ? 'structuredClone(selectResult)' : 'null'})`,
  'const resultColumns = computed(() => {',
  "  if (results.value?.type !== 'rows') return []",
  '  return results.value.columns.map((key, index) => ({',
  '    accessorKey: key,',
  '    header: key,',
  '    principal: index === 0',
  '  }))',
  '})',
  "const resultView = ref('table')",
  declare('resultViewOptions', RESULT_VIEW_OPTIONS),
  "const resultSearch = ref('')",
  "const resultRows = computed(() => (results.value?.type === 'rows' ? results.value.rows : []))",
  'const filteredResultRows = computed(() => {',
  '  const term = resultSearch.value.trim().toLowerCase()',
  '  if (!term) return resultRows.value',
  '  return resultRows.value.filter((row) =>',
  '    Object.entries(row)',
  "      .filter(([key]) => key !== '__k')",
  '      .some(([, value]) => String(value).toLowerCase().includes(term))',
  '  )',
  '})',
  'const resultJson = computed(() =>',
  '  JSON.stringify(',
  '    resultRows.value.map(({ __k, ...rest }) => rest),',
  '    null,',
  '    2',
  '  )',
  ')',
  '',
  'const applyTemplate = (sql) => {',
  '  editorSql.value = sql',
  '}',
  'const loadFromHistory = (item) => {',
  '  editorSql.value = item.sql',
  "  activeTab.value = 'editor'",
  '}',
  'const deleteHistory = (event, item) => {',
  '  history.value = history.value.filter((entry) => entry.id !== item.id)',
  '}',
  'const runQuery = () => {',
  '  const sql = editorSql.value.trim()',
  '  if (!sql || running.value) return',
  '  running.value = true',
  '  results.value = null',
  '  setTimeout(() => {',
  '    if (history.value[0]?.sql !== sql) {',
  '      history.value = [{ id: `q-${history.value.length + 1}`, sql }, ...history.value]',
  '    }',
  '    const verb = sql.split(/\\s+/)[0].toUpperCase()',
  "    const text = verb === 'CREATE' ? 'Table created.' : verb === 'INSERT' ? 'Rows inserted.' : 'Statement executed.'",
  "    results.value = verb === 'SELECT' ? structuredClone(selectResult) : { type: 'message', text }",
  '    running.value = false',
  '  }, 700)',
  '}',
  '',
  declare('templates', SQL_TEMPLATES),
  "const templateQuery = ref('')",
  'const filteredTemplates = computed(() => {',
  '  const term = templateQuery.value.trim().toLowerCase()',
  '  if (!term) return templates',
  '  return templates.filter(',
  '    (template) =>',
  '      template.title.toLowerCase().includes(term) ||',
  '      template.description.toLowerCase().includes(term)',
  '  )',
  '})',
  'watch(templatesOpen, (value) => {',
  "  if (value) templateQuery.value = ''",
  '})',
  'const chooseTemplate = (template) => {',
  '  applyTemplate(template.sql)',
  '  templatesOpen.value = false',
  '}'
]

export const components = {
  Button,
  CardBox,
  Checkbox,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  Dropdown,
  'Dropdown.Trigger': Dropdown.Trigger,
  'Dropdown.Group': Dropdown.Group,
  'Dropdown.Option': Dropdown.Option,
  EmptyState,
  IconButton,
  InputText,
  Message,
  PaginatorRoot,
  PanelContent,
  PanelHeader,
  SegmentedButton,
  Sidebar,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  TableRoot,
  Tag,
  Textarea,
  Tooltip
}

const SEARCH_ICON = `<template #iconLeft>
  <i class="pi pi-search" aria-hidden="true" />
</template>`

const PAGE_TABS = `<div class="border-b border-(--border-default)">
  <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
    <div class="-ml-(--spacing-xs) min-w-0 flex-1">
      <TabView v-model:value="activeTab">
        <TabView.List>
          <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
        </TabView.List>
      </TabView>
    </div>
  </div>
</div>`

const TABLES_SIDEBAR = `<Sidebar
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
            <IconButton icon="pi pi-refresh" kind="outlined" size="small" aria-label="Refresh tables" />
          </Tooltip>
          <Tooltip text="Create Table">
            <IconButton icon="pi pi-plus" kind="outlined" size="small" aria-label="Create Table" />
          </Tooltip>
        </div>
      </div>
      <InputText v-model="tableSearch" size="medium" class="w-full" placeholder="Search tables" aria-label="Search tables">
${indent(SEARCH_ICON, 4)}
      </InputText>
    </div>
  </template>
  <div>
    <p v-if="!tables.length" class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)">
      No tables created yet
    </p>
    <p v-else-if="!filteredTables.length" class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)">
      No tables match "{{ tableSearch }}".
    </p>
    <div v-else class="flex flex-col gap-(--spacing-xxs)">
      <div v-for="table in filteredTables" :key="table.id" class="group flex items-center gap-(--spacing-xxs)">
        <button
          type="button"
          :data-selected="selectedTable && selectedTable.id === table.id ? true : null"
          class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-selected:bg-(--bg-hover) motion-reduce:transition-none"
          @click="selectTable(table.id)"
        >
          <i class="pi pi-table shrink-0 text-(--text-muted)" aria-hidden="true" />
          <span class="min-w-0 truncate">{{ table.name }}</span>
        </button>
        <Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <Tooltip text="Table actions">
              <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="Table actions" />
            </Tooltip>
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option value="delete" label="Delete table">
              <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
            </Dropdown.Option>
          </Dropdown.Group>
        </Dropdown>
      </div>
    </div>
  </div>
</Sidebar>`

const NO_TABLES = `<div v-if="!selectedTable" class="flex flex-1 items-center justify-center p-(--spacing-md)">
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
            <span class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)">
              <i class="pi pi-table text-body-md leading-none text-(--text-default)" aria-hidden="true" />
            </span>
          </span>
        </template>
        <template #actions>
          <Button label="Create Table" icon="pi pi-plus" kind="secondary" size="large" class="w-full md:w-auto" />
        </template>
      </EmptyState>
    </template>
  </CardBox>
</div>`

const DATA_VIEW = `<div v-if="tableView === 'data'" class="flex min-h-0 flex-1 flex-col">
  <div class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)">
    <InputText
      v-model="rowFilter"
      size="medium"
      class="min-w-0 flex-1 md:max-w-(--container-lg)"
      :placeholder="filterPlaceholder"
      aria-label="Filter rows"
    >
${indent(SEARCH_ICON, 3)}
    </InputText>
    <div class="ml-auto flex items-center gap-(--spacing-xs)">
      <Button label="Sort" kind="outlined" size="medium" icon="pi pi-sort-alt" />
      <Tooltip text="Refresh">
        <IconButton icon="pi pi-refresh" kind="outlined" size="medium" aria-label="Refresh" />
      </Tooltip>
      <Button label="Insert" kind="primary" size="medium" icon="pi pi-plus" />
    </div>
  </div>

  <div class="min-h-0 flex-1 overflow-auto">
    <div class="flex items-stretch border-b border-(--border-default) bg-(--bg-surface-raised)">
      <div class="flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)">
        <Checkbox binary disabled aria-label="Select all rows" />
      </div>
      <div
        v-for="column in selectedTable.columns"
        :key="column.id"
        class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
      >
        <span class="truncate text-label-md text-(--text-default)">{{ column.name }}</span>
        <span class="shrink-0 text-body-xs text-(--text-muted)">{{ column.type }}</span>
        <i v-if="column.primaryKey" class="pi pi-key ml-auto shrink-0 pl-(--spacing-xs) text-(--primary)" aria-label="Primary key" />
      </div>
      <div class="flex shrink-0 items-center px-(--spacing-xs)">
        <Tooltip text="Add column">
          <IconButton icon="pi pi-plus" kind="transparent" size="small" aria-label="Add column" />
        </Tooltip>
      </div>
    </div>

    <div v-for="row in filteredRows" :key="row.__k" class="group flex items-stretch border-b border-(--border-muted) hover:bg-(--bg-hover)">
      <div class="flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)">
        <Checkbox binary disabled :aria-label="\`Select row \${row.__k}\`" />
      </div>
      <div
        v-for="column in selectedTable.columns"
        :key="column.id"
        class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
      >
        <span
          class="truncate text-label-md"
          :class="isNull(row[column.name]) ? 'italic text-(--text-muted)' : 'text-(--text-default)'"
        >
          {{ displayCell(row[column.name]) }}
        </span>
      </div>
      <div class="flex shrink-0 items-center px-(--spacing-xs)">
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

    <div v-if="!tableRows.length" class="flex flex-col items-center justify-center gap-(--spacing-sm) p-(--spacing-xxl) text-center">
      <p class="text-body-sm text-(--text-default)">This table is empty</p>
      <div class="flex items-center gap-(--spacing-xs)">
        <Button label="Insert row" kind="secondary" size="medium" icon="pi pi-plus" />
        <Button label="Import data from CSV" kind="outlined" size="medium" icon="pi pi-upload" />
      </div>
      <p class="text-body-xs text-(--text-muted)">or drag and drop a CSV file here</p>
    </div>
    <p v-else-if="!filteredRows.length" class="p-(--spacing-xxl) text-center text-body-sm text-(--text-muted)">
      No rows match "{{ rowFilter }}".
    </p>
  </div>

  <div class="flex items-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)">
    <Tooltip text="Previous page">
      <IconButton icon="pi pi-chevron-left" kind="transparent" size="small" aria-label="Previous page" disabled />
    </Tooltip>
    <span>Page <span class="text-(--text-default)">1</span> of 1</span>
    <Tooltip text="Next page">
      <IconButton icon="pi pi-chevron-right" kind="transparent" size="small" aria-label="Next page" disabled />
    </Tooltip>
    <span class="ml-(--spacing-md)">100 rows</span>
    <span class="ml-auto">{{ tableRows.length }} record{{ tableRows.length === 1 ? '' : 's' }}</span>
  </div>
</div>`

const DEFINITION_VIEW = `<div v-else class="flex min-h-0 flex-1 flex-col gap-(--layout-group-gap) overflow-auto p-(--spacing-md)">
  <div class="flex items-center justify-between gap-(--spacing-sm)">
    <p class="text-heading-xxs text-(--text-default)">Columns</p>
    <Button label="Add column" kind="outlined" size="medium" icon="pi pi-plus" />
  </div>
  <CardBox :padded="false">
    <template #content>
      <TableRoot :data="schemaRows" :columns="schemaColumns" row-key="id" :border="false">
        <template #cell-name="{ value }">
          <span class="min-w-0 truncate">{{ value }}</span>
        </template>
        <template #cell-type="{ value }">
          <Tag :label="value" severity="secondary" size="medium" />
        </template>
        <template #cell-constraints="{ value }">
          <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
        </template>
      </TableRoot>
    </template>
  </CardBox>
</div>`

const TABLE_DETAIL = `<div v-else class="flex min-h-0 flex-1 flex-col">
  <div class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <i class="pi pi-table shrink-0 text-(--text-muted)" aria-hidden="true" />
      <span class="truncate text-heading-xxs text-(--text-default)">{{ selectedTable.name }}</span>
    </div>
    <SegmentedButton v-model="tableView" :options="tableViewOptions" aria-label="Table view" />
  </div>

${indent(DATA_VIEW)}

${indent(DEFINITION_VIEW)}
</div>`

const TABLES_SECTION = `<section
  v-if="activeTab === 'tables'"
  class="animate-page-enter motion-reduce:animate-none relative flex min-h-0 flex-1 overflow-hidden"
>
${indent(TABLES_SIDEBAR)}

  <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
${indent(NO_TABLES, 2)}

${indent(TABLE_DETAIL, 2)}
  </div>
</section>`

const HISTORY_SIDEBAR = `<Sidebar
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
      <InputText v-model="historySearch" size="medium" class="w-full" placeholder="Search queries" aria-label="Search queries">
${indent(SEARCH_ICON, 4)}
      </InputText>
    </div>
  </template>
  <div>
    <p v-if="!filteredHistory.length" class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)">
      No queries yet
    </p>
    <div v-else class="flex flex-col gap-(--spacing-xxs)">
      <div v-for="item in filteredHistory" :key="item.id" class="flex items-center gap-(--spacing-xxs)">
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
          @select="(event, value) => value === 'run' ? (applyTemplate(item.sql), runQuery()) : deleteHistory(event, item)"
        >
          <Dropdown.Trigger>
            <Tooltip text="Query actions">
              <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="Query actions" />
            </Tooltip>
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option value="run" label="Run query">
              <template #left><i class="pi pi-play" aria-hidden="true" /></template>
            </Dropdown.Option>
            <Dropdown.Option value="delete" label="Delete query">
              <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
            </Dropdown.Option>
          </Dropdown.Group>
        </Dropdown>
      </div>
    </div>
  </div>
</Sidebar>`

const EDITOR_PANE = `<div class="flex min-w-0 flex-1 flex-col overflow-auto">
  <div class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)">
    <Button label="Run Query" kind="primary" size="medium" icon="pi pi-play" :loading="running" @click="runQuery" />
    <div class="ml-auto flex items-center gap-(--spacing-xs)">
      <Button label="Prettify" kind="outlined" size="medium" icon="pi pi-align-left" :disabled="running" />
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

  <div class="flex flex-col border-t-(length:--border-width-default) border-(--border-default)">
    <div class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)">
      <span class="shrink-0 text-heading-xxs text-(--text-default)"> Results </span>
      <InputText
        v-model="resultSearch"
        size="medium"
        class="ml-(--spacing-sm) min-w-0 flex-1 md:max-w-(--container-sm)"
        placeholder="Search"
        aria-label="Search results"
        :disabled="!resultRows.length"
      >
${indent(SEARCH_ICON, 4)}
      </InputText>
      <div class="ml-auto flex items-center gap-(--spacing-xs)">
        <SegmentedButton v-model="resultView" :options="resultViewOptions" aria-label="Result view" />
        <Tooltip text="Refresh">
          <IconButton icon="pi pi-refresh" kind="outlined" size="medium" aria-label="Refresh results" :loading="running" @click="runQuery" />
        </Tooltip>
        <Tooltip text="Download">
          <IconButton icon="pi pi-download" kind="outlined" size="medium" aria-label="Download results" :disabled="!resultRows.length" />
        </Tooltip>
        <Tooltip text="Columns">
          <IconButton icon="pi pi-table" kind="outlined" size="medium" aria-label="Toggle columns" :disabled="!resultRows.length" />
        </Tooltip>
        <Button label="Insert" kind="primary" size="medium" icon="pi pi-plus" :disabled="true" />
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
      <div v-else-if="results && results.type === 'message'" class="p-(--spacing-md)">
        <Message severity="success" :label="results.text" />
      </div>
      <div v-else class="flex min-h-(--container-3xs) items-center justify-center p-(--spacing-lg)">
        <EmptyState title="Ready to execute" description="Execute a query to see the results here." />
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
</div>`

const EDITOR_SECTION = `<section v-else class="relative flex min-h-0 flex-1 overflow-hidden">
${indent(HISTORY_SIDEBAR)}

${indent(EDITOR_PANE)}
</section>`

const TEMPLATES_DRAWER = `<Drawer v-model:open="templatesOpen" size="large" side="right">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <DrawerTitle>SQL Quick Templates</DrawerTitle>
          <p class="text-body-sm text-(--text-muted)">Pick a snippet to load it into the editor.</p>
        </div>
        <DrawerClose />
      </PanelHeader>

      <PanelContent class="flex flex-col gap-(--spacing-md)">
        <InputText v-model="templateQuery" size="large" class="w-full" placeholder="Search templates" aria-label="Search templates">
${indent(SEARCH_ICON, 5)}
        </InputText>

        <div v-if="filteredTemplates.length" class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2">
          <button
            v-for="template in filteredTemplates"
            :key="template.id"
            type="button"
            class="flex flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) text-left transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-primary) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            @click="chooseTemplate(template)"
          >
            <span class="flex items-center gap-(--spacing-xs)">
              <i :class="template.icon" class="text-(--text-muted)" aria-hidden="true" />
              <span class="text-label-md text-(--text-default)">{{ template.title }}</span>
            </span>
            <span class="text-body-xs text-(--text-muted)">{{ template.description }}</span>
          </button>
        </div>

        <p v-else class="py-(--spacing-lg) text-center text-body-sm text-(--text-muted)">
          No templates match "{{ templateQuery }}".
        </p>
      </PanelContent>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

export const PAGE_TEMPLATE = `<div class="flex h-screen min-h-0 flex-col bg-(--bg-canvas)">
  <main class="flex h-full min-h-0 flex-col">
${indent(PAGE_TABS, 2)}

${indent(TABLES_SECTION, 2)}

${indent(EDITOR_SECTION, 2)}
  </main>

${indent(TEMPLATES_DRAWER)}
</div>`

export const TABLES_STATE = {
  tab: 'tables',
  view: 'data',
  tables: TABLES,
  sql: CREATE_USERS_SQL,
  history: FIRST_HISTORY,
  results: null
}

export const SQL_MAIN = PAGE_TEMPLATE.split('\n')
  .slice(1, -1)
  .map((line) => line.replace(/^ {2}/, ''))
  .join('\n')
