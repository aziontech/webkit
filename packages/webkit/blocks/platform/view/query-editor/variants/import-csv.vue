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
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  interface DatabaseColumn {
    id: string
    name: string
    type: string
    primaryKey: boolean
    notNull: boolean
  }

  interface DatabaseRow {
    __k: string
    [column: string]: string | number | null
  }

  interface DatabaseTable {
    id: string
    name: string
    columns: DatabaseColumn[]
    rows: DatabaseRow[]
  }

  interface ResultRow {
    __k: number
    [column: string]: string | number | null
  }

  type QueryResult =
    | { type: 'rows'; columns: string[]; rows: ResultRow[] }
    | { type: 'error'; line: number; text: string }
    | { type: 'message'; text: string }

  interface HistoryEntry {
    id: string
    sql: string
  }

  interface QueryTemplate {
    id: string
    title: string
    description: string
    icon: string
    sql: string
  }

  interface ImportFile {
    name: string
    size: number
    type: string
  }

  interface ImportRow {
    line: number
    cells: Record<string, string>
  }

  type TypeCheck = [test: (value: string) => boolean, expected: string]

  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]
  const activeTab = ref('tables')

  const tables = ref<DatabaseTable[]>([
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
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          created_at: '2026-07-21 08:15:00'
        },
        {
          __k: 'row-2',
          id: 2,
          name: 'John Smith',
          email: 'john.smith@example.com',
          created_at: '2026-07-21 08:15:01'
        },
        {
          __k: 'row-3',
          id: 3,
          name: 'Alex Morgan',
          email: 'alex.morgan@example.com',
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
  const selectedTableId = ref<string | null>('tbl-subscribers')
  const filteredTables = computed(() => {
    const term = tableSearch.value.trim().toLowerCase()
    if (!term) return tables.value
    return tables.value.filter((table) => table.name.toLowerCase().includes(term))
  })
  const selectedTable = computed(
    () =>
      tables.value.find((table) => table.id === selectedTableId.value) ?? tables.value[0] ?? null
  )
  const selectTable = (id: string) => {
    selectedTableId.value = id
  }

  const schemaColumns: TableColumn[] = [
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
  const leftOpen = ref(true)

  const tableView = ref('data')
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
  const rowSelection = ref<Record<string, boolean>>({})
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
  const dataColumns = computed<TableColumn[]>(() => [
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
      '1,jane.doe@example.com,pro,true,2026-03-02,newsletter',
      '2,lin@example.com,free,true,2026-04-18,',
      '3,ops@example.com,team,maybe,2026-05-07,partner',
      '4,"kim, j@example.com",pro,true,2026-06-21,',
      '5,,free,true,2026-07-30,search',
      '6,ravi@example.com,free,false,2026-08-11,',
      '7,noor@example.com,team,true,next week,ads'
    ].join('\n')
  }
  const importOpen = ref(true)
  const importInput = ref<HTMLInputElement | null>(null)
  const importFile = ref<ImportFile | null>(null)
  const importFileError = ref('')
  const importHeaders = ref<string[]>([])
  const importRows = ref<ImportRow[]>([])
  const importMapping = ref<Record<string, string>>({})
  const importSubmitted = ref(false)
  const importing = ref(false)
  let importTimer = 0

  const splitCsvLine = (line: string) => {
    const cells: string[] = []
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
  const readCsv = (file: ImportFile, text: string) => {
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
  const onImportFiles = async (files: FileList | File[] | null | undefined) => {
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
  const onImportPick = (event: Event) => {
    const input = event.target as HTMLInputElement
    onImportFiles(input.files)
    input.value = ''
  }
  const openImport = (files?: FileList | File[] | null) => {
    clearImport()
    importOpen.value = true
    if (files?.length) onImportFiles(files)
  }
  const onEmptyDrop = (event: DragEvent) => openImport(event.dataTransfer?.files)
  const importTokens = computed(() =>
    importFile.value ? [{ file: importFile.value, error: importFileError.value || undefined }] : []
  )

  const TYPE_CHECKS: Record<string, TypeCheck> = {
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
  const mappingLabel = (value: string) => (value === SKIP ? 'Skip' : value)
  const columnByName = (name: string) =>
    selectedTable.value?.columns.find((column) => column.name === name) ?? null
  const mappedHeaders = computed(() =>
    importHeaders.value.filter((header) => importMapping.value[header] !== SKIP)
  )
  const targetOf = (header: string) => columnByName(importMapping.value[header])
  const duplicateTargets = computed(() => {
    const seen = new Map<string, string[]>()
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
      const values: Record<string, string | null> = {}
      const problems: string[] = []
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
      .filter((column): column is DatabaseColumn => Boolean(column))
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
  const editorMarkers = computed<CodeEditorMarker[]>(() =>
    results.value?.type === 'error' && results.value.line
      ? [{ line: results.value.line, severity: 'error', message: results.value.text }]
      : []
  )
  const isNull = (value: unknown) => value === null || value === undefined || value === ''
  const displayCell = (value: unknown) => (isNull(value) ? 'NULL' : String(value))
  const deleteRow = (row: DatabaseRow) => {
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
  const history = ref<HistoryEntry[]>([
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
  const oneLine = (sql: string) => sql.replace(/\s+/g, ' ').trim()

  const running = ref(false)
  const templatesOpen = ref(false)
  const selectResult: QueryResult = {
    type: 'rows',
    columns: ['id', 'name', 'email', 'created_at'],
    rows: [
      {
        __k: 1,
        id: 1,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        created_at: '2026-07-21 08:15:00'
      },
      {
        __k: 2,
        id: 2,
        name: 'John Smith',
        email: 'john.smith@example.com',
        created_at: '2026-07-21 08:15:01'
      },
      {
        __k: 3,
        id: 3,
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        created_at: '2026-07-21 08:15:02'
      }
    ]
  }
  const results = ref<QueryResult | null>(null)
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
  const resultRows = computed<ResultRow[]>(() =>
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
  const loadFromHistory = (item: HistoryEntry) => {
    editorSql.value = item.sql
    activeTab.value = 'editor'
  }
  const deleteHistory = (_event: MouseEvent | KeyboardEvent, item: HistoryEntry) => {
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

  const resultStatus = computed(() => {
    if (running.value) return 'Running the query.'
    if (!results.value) return ''
    if (results.value.type !== 'rows') return results.value.text
    const count = results.value.rows.length
    return `${count} ${count === 1 ? 'row' : 'rows'} returned.`
  })

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

  const templates: QueryTemplate[] = [
    {
      id: 'create-table',
      title: 'Create table',
      description: 'Create a basic customers table with auto-increment ID and timestamp',
      icon: 'ai ai-table',
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
      icon: 'ai ai-circle-plus',
      sql: `INSERT INTO customers (name, email) VALUES
  ('Jane Doe', 'jane.doe@example.com'),
  ('John Smith', 'john.smith@example.com'),
  ('Alex Morgan', 'alex.morgan@example.com');`
    },
    {
      id: 'select-all',
      title: 'Select all',
      description: 'Retrieve all records from customers table with limit',
      icon: 'ai ai-list',
      sql: `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`
    },
    {
      id: 'count-records',
      title: 'Count records',
      description: 'Count total number of records in customers table',
      icon: 'ai ai-hash',
      sql: 'SELECT COUNT(*) AS total_customers FROM customers;'
    },
    {
      id: 'related-table',
      title: 'Related table',
      description: 'Create an orders table that references the customers table',
      icon: 'ai ai-box',
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
      icon: 'ai ai-arrow-right-left',
      sql: `INSERT INTO orders (customer_id, total) VALUES
  (1, 42.50),
  (3, 18.00);`
    },
    {
      id: 'join-tables',
      title: 'Join tables',
      description: 'List every order with the name of the customer who placed it',
      icon: 'ai ai-search',
      sql: `SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id DESC;`
    },
    {
      id: 'create-index',
      title: 'Create index',
      description: 'Create an index to speed up lookups of orders by customer',
      icon: 'ai ai-sitemap',
      sql: `CREATE INDEX IF NOT EXISTS orders_customer_id_idx
ON orders (customer_id);`
    },
    {
      id: 'top-customers',
      title: 'Top customers',
      description: 'Find the 3 customers with the highest order totals',
      icon: 'ai ai-arrow-down-wide-narrow',
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
                  <Tooltip text="Refresh tables">
                    <IconButton
                      icon="ai ai-refresh"
                      kind="outlined"
                      size="small"
                      aria-label="Refresh tables"
                    />
                  </Tooltip>
                  <Tooltip text="Create Table">
                    <IconButton
                      icon="ai ai-plus"
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
            <p
              v-if="!tables.length"
              class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              No tables created yet
            </p>
            <EmptyState
              v-else-if="!filteredTables.length"
              size="small"
              icon="ai ai-search"
              :title="`No tables match “${tableSearch}”`"
            >
              <template #actions>
                <Button
                  label="Clear search"
                  kind="outlined"
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
                  kind="option"
                  :aria-pressed="selectedTable?.id === table.id"
                  class="min-w-0 flex-1"
                  @click="selectTable(table.id)"
                >
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-table shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate text-label-sm">{{ table.name }}</span>
                  </span>
                </Item>
                <DropdownMenu placement="bottom-end">
                  <DropdownMenu.Trigger>
                    <Tooltip :text="`Actions for ${table.name}`">
                      <IconButton
                        icon="ai ai-ellipsis"
                        kind="transparent"
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
                          class="ai ai-trash"
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
            icon="ai ai-table"
            title="No tables yet"
            description="Create your first table to store your data."
            class="w-full max-w-(--container-2xl)"
          >
            <template #actions>
              <div class="w-full md:w-fit">
                <Button
                  label="Create Table"
                  icon="ai ai-plus"
                  kind="secondary"
                  size="medium"
                  class="w-full"
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
                class="ai ai-table shrink-0 text-(--text-muted)"
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
                  <template #prefix>
                    <i
                      class="ai ai-search"
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
                  icon="ai ai-trash"
                  :loading="deleting"
                  @click="deleteSelected"
                />
                <Tooltip text="Refresh">
                  <IconButton
                    icon="ai ai-refresh"
                    kind="outlined"
                    size="medium"
                    aria-label="Refresh"
                  />
                </Tooltip>
                <Button
                  label="Insert"
                  kind="primary"
                  size="medium"
                  icon="ai ai-plus"
                />
              </div>
            </div>

            <div class="min-h-0 flex-1 overflow-auto">
              <DataTable
                v-model:row-selection="rowSelection"
                :data="filteredRows"
                :columns="dataColumns"
                row-key="__k"
                enable-row-selection
                enable-sorting
                paginated
                :page-size="25"
                :page-size-options="[25, 50, 100]"
                density="compact"
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
                      class="ai ai-key shrink-0 text-(--primary)"
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
                  <Tooltip :text="`Delete row ${row['id'] ?? row.__k}`">
                    <IconButton
                      icon="ai ai-trash"
                      kind="transparent"
                      size="small"
                      :aria-label="`Delete row ${row['id'] ?? row.__k}`"
                      @click="deleteRow(row)"
                    />
                  </Tooltip>
                </template>
                <template #empty>
                  <div
                    v-if="!tableRows.length"
                    @dragover.prevent
                    @drop.prevent="onEmptyDrop"
                  >
                    <EmptyState
                      size="small"
                      icon="ai ai-table"
                      title="This table is empty"
                      description="Insert a row, import a CSV file or drop one here."
                    >
                      <template #actions>
                        <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                          <Button
                            label="Insert row"
                            kind="secondary"
                            size="medium"
                            icon="ai ai-plus"
                          />
                          <Button
                            label="Import data from CSV"
                            kind="outlined"
                            size="medium"
                            icon="ai ai-upload"
                            @click="openImport()"
                          />
                        </div>
                      </template>
                    </EmptyState>
                  </div>
                  <EmptyState
                    v-else
                    size="small"
                    icon="ai ai-search"
                    :title="`No rows match “${rowFilter}”`"
                    description="Change the filter to see the rows."
                  >
                    <template #actions>
                      <Button
                        label="Clear filter"
                        kind="outlined"
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
                kind="outlined"
                size="medium"
                icon="ai ai-plus"
              />
            </div>
            <Card :padded="false">
              <template #content>
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
                  kind="option"
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
                  placement="bottom-end"
                  @select="
                    (event, value) =>
                      value === 'run'
                        ? (applyTemplate(item.sql), runQuery())
                        : deleteHistory(event, item)
                  "
                >
                  <DropdownMenu.Trigger>
                    <Tooltip :text="`Actions for ${oneLine(item.sql)}`">
                      <IconButton
                        icon="ai ai-ellipsis"
                        kind="transparent"
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
                          class="ai ai-play"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete query"
                    >
                      <template #leading
                        ><i
                          class="ai ai-trash"
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
            kind="primary"
            size="medium"
            icon="ai ai-play"
            :loading="running"
            @click="runQuery"
          />
          <div class="ms-auto flex items-center gap-(--spacing-xs)">
            <Button
              label="Prettify"
              kind="outlined"
              size="medium"
              icon="ai ai-align-left"
              :disabled="running"
            />
            <Button
              label="Templates"
              kind="outlined"
              size="medium"
              icon="ai ai-bolt"
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
                <template #prefix>
                  <i
                    class="ai ai-search"
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
              <Tooltip text="Refresh results">
                <IconButton
                  icon="ai ai-refresh"
                  kind="outlined"
                  size="medium"
                  aria-label="Refresh results"
                  :loading="running"
                  @click="runQuery"
                />
              </Tooltip>
              <Tooltip text="Download results">
                <IconButton
                  icon="ai ai-download"
                  kind="outlined"
                  size="medium"
                  aria-label="Download results"
                  :disabled="!resultRows.length"
                />
              </Tooltip>
              <Tooltip text="Toggle columns">
                <IconButton
                  icon="ai ai-table"
                  kind="outlined"
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
      side="right"
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

        <PanelContent>
          <div class="flex flex-col gap-(--spacing-md)">
            <Input
              v-model="templateQuery"
              size="large"
              class="w-full"
              placeholder="Search templates"
              aria-label="Search templates"
            >
              <template #prefix>
                <i
                  class="ai ai-search"
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
                :key="template.id"
                kind="outlined"
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
              icon="ai ai-search"
              :title="`No templates match “${templateQuery}”`"
              description="Try another name or statement."
            >
              <template #actions>
                <Button
                  label="Clear search"
                  kind="outlined"
                  size="small"
                  @click="templateQuery = ''"
                />
              </template>
            </EmptyState>
          </div>
        </PanelContent>
      </DrawerContent>
    </Drawer>

    <Drawer
      v-model:open="importOpen"
      size="large"
      side="right"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="`Import data into ${selectedTable?.name ?? 'the table'}`"
          novalidate
          @submit.prevent="submitImport"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Import data into {{ selectedTable?.name }}</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Read a CSV file, choose the table column each CSV column fills, check the rows, then
                insert them. Rows with errors are skipped.
              </p>
            </div>
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
                    @drop="(_event, files) => onImportFiles(files)"
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
                    @remove="clearImport"
                  />
                  <p
                    v-if="importFileMissing"
                    class="m-0 text-body-sm text-(--danger-foreground)"
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
                      class="m-0 flex list-none flex-col overflow-hidden rounded-(--shape-control) border border-(--border-muted) p-0"
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
                          class="ai ai-arrow-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
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
                      class="m-0 flex list-none flex-col gap-(--spacing-2xs) rounded-(--shape-control) border border-(--danger-border) p-(--spacing-sm)"
                    >
                      <li
                        v-for="row in failedRows.slice(0, 10)"
                        :key="row.line"
                        class="flex gap-(--spacing-xs) text-body-sm text-(--text-default)"
                      >
                        <i
                          class="ai ai-circle-x mt-(--spacing-2xs) shrink-0 text-(--danger-foreground)"
                          aria-hidden="true"
                        />
                        <span
                          ><span class="text-label-sm">Line {{ row.line }}:</span>
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
                      <DataTable
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
    </Drawer>
  </div>
</template>
