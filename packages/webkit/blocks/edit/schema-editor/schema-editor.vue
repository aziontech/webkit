<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

  import { sampleDatabase, sampleTables } from './sample'

  interface ColumnType {
    value: string
    description: string
    glyph: string
  }

  /** One column of an existing table. */
  export interface SchemaEditorColumn {
    /** Column name. */
    name: string
    /** Data type, one of the types the Type select lists. */
    type: string
    /** Part of the primary key. */
    primaryKey: boolean
    /** Rejects NULL. */
    notNull: boolean
    /** Default expression, empty for none. */
    defaultValue: string
  }

  /** One table of the database. */
  export interface SchemaEditorTable {
    /** Table name. */
    name: string
    /** Its columns, in table order. */
    columns: SchemaEditorColumn[]
    /** How many rows it holds. */
    rowCount: number
  }

  /** One foreign key row of the Create Table drawer. */
  export interface SchemaEditorRelation {
    /** Stable key of the row. */
    key: string
    /** The new table's column. */
    column: string
    /** The table it references. */
    table: string
    /** The referenced column. */
    references: string
    /** What happens to the rows when the referenced row is deleted. */
    onDelete: string
  }

  /** A CSV file the Create Table drawer reads. */
  export interface SchemaEditorCsvFile {
    /** File name. */
    name: string
    /** Size in bytes. */
    size: number
    /** MIME type. */
    type: string
  }

  /** A CSV file and its text. */
  export interface SchemaEditorCsv {
    /** The file. */
    file: SchemaEditorCsvFile
    /** Its contents. */
    text: string
  }

  /** The table Create Table sends. */
  export interface SchemaEditorNewTable {
    /** Table name. */
    name: string
    /** Its named columns. */
    columns: SchemaEditorColumn[]
    /** Its foreign keys. */
    relations: SchemaEditorRelation[]
    /** Rows read from the CSV file, keyed by column name. */
    rows: Record<string, string>[]
  }

  /** The values of the Add column drawer. */
  export interface SchemaEditorColumnForm {
    /** Column name. */
    name: string
    /** Data type. */
    type: string
    /** Default expression, empty for NULL. */
    defaultValue: string
    /** Part of the primary key. */
    primaryKey: boolean
    /** Rejects NULL. */
    notNull: boolean
  }

  /** The drawer or dialog that is open, or none. */
  export type SchemaEditorDialog = 'create' | 'column' | 'row' | 'alter' | 'truncate' | 'none'

  export interface SchemaEditorProps {
    /** The database's tables. Left out, the sample renders. */
    tables?: SchemaEditorTable[]
    /** The database name the drawers and messages name. Left out, the sample name. */
    database?: string
    /** A change is in flight: the open drawer or dialog locks and its submit spins. When it turns off with no error, the change is applied and the success toast shows. */
    loading?: boolean
    /** Why the change failed. Create Table shows it on the Name field and in an Alert; the other changes show a danger toast with Retry. */
    error?: string
    /** The Create Table name and foreign keys the drawer opens with. */
    defaultDraft?: { name?: string; relations?: SchemaEditorRelation[] }
    /** A CSV file the Create Table drawer opens with, already read. */
    defaultCsv?: SchemaEditorCsv
    /** The Add column values the drawer opens with. */
    defaultColumn?: Partial<SchemaEditorColumnForm>
    /** The Insert row values the drawer opens with, keyed by column name. */
    defaultRow?: Record<string, string>
    /** The column the Change type dialog opens on. */
    defaultAlterColumn?: string
    /** The open drawer starts as if submitted, so its validation messages show. */
    defaultSubmitted?: boolean
  }

  interface DraftColumn {
    key: string
    name: string
    type: string
    primaryKey: boolean
    defaultValue: string
  }
  interface DraftTable {
    name: string
    columns: DraftColumn[]
    relations: SchemaEditorRelation[]
  }
  type CsvRow = Record<string, string>
  type PendingChange = {
    kind: SchemaEditorDialog
    apply: () => void
    retry: (event: Event) => void
  }

  const props = withDefaults(defineProps<SchemaEditorProps>(), {
    tables: undefined,
    database: '',
    loading: false,
    error: '',
    defaultDraft: () => ({}),
    defaultCsv: undefined,
    defaultColumn: () => ({}),
    defaultRow: undefined,
    defaultAlterColumn: '',
    defaultSubmitted: false
  })

  const emit = defineEmits<{
    'create-table': [event: Event, table: SchemaEditorNewTable]
    'add-column': [event: Event, payload: { table: SchemaEditorTable; column: SchemaEditorColumn }]
    'insert-row': [
      event: Event,
      payload: { table: SchemaEditorTable; values: Record<string, string> }
    ]
    'change-type': [
      event: Event,
      payload: { table: SchemaEditorTable; column: SchemaEditorColumn; type: string }
    ]
    truncate: [event: Event, table: SchemaEditorTable]
  }>()

  const dialog = defineModel<SchemaEditorDialog>('dialog', { default: 'create' })
  const tableName = defineModel<string>('table', { default: '' })

  const database = computed(() => props.database || sampleDatabase)
  const source = computed<SchemaEditorTable[]>(() => props.tables ?? sampleTables)
  const items = ref<SchemaEditorTable[]>([])
  watch(
    source,
    (next) => {
      items.value = next.map((item) => ({ ...item, columns: item.columns.map((c) => ({ ...c })) }))
    },
    { immediate: true }
  )
  const table = computed(
    () => items.value.find((item) => item.name === tableName.value) ?? items.value[0]
  )

  const TYPES: ColumnType[] = [
    { value: 'int2', description: 'Signed two-byte integer', glyph: '#' },
    { value: 'int4', description: 'Signed four-byte integer', glyph: '#' },
    { value: 'int8', description: 'Signed eight-byte integer', glyph: '#' },
    { value: 'float4', description: 'Single precision floating-point number', glyph: '#' },
    { value: 'float8', description: 'Double precision floating-point number', glyph: '#' },
    { value: 'numeric', description: 'Exact number of selectable precision', glyph: '#' },
    { value: 'json', description: 'Textual JSON data', glyph: '{}' },
    { value: 'jsonb', description: 'Binary JSON data, decomposed', glyph: '{}' },
    { value: 'text', description: 'Variable-length character string', glyph: 'T' },
    { value: 'varchar', description: 'Variable-length string with a limit', glyph: 'T' },
    { value: 'uuid', description: 'Universally unique identifier', glyph: '#' },
    { value: 'bool', description: 'Logical boolean, true or false', glyph: 'B' },
    { value: 'date', description: 'Calendar date: year, month, day', glyph: '@' },
    { value: 'timestamp', description: 'Date and time', glyph: '@' },
    { value: 'timestamptz', description: 'Date and time, with time zone', glyph: '@' }
  ]
  const INTEGER_TYPES = ['int2', 'int4', 'int8']
  const glyphOf = (value: string) => TYPES.find((type) => type.value === value)?.glyph ?? '#'
  const filterTypes = (query: string) => {
    const term = query.trim().toLowerCase()
    if (!term) return TYPES
    return TYPES.filter(
      (type) => type.value.includes(term) || type.description.toLowerCase().includes(term)
    )
  }

  const definitionColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 120 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 },
    { id: 'actions', type: 'action', hideable: false }
  ]
  const definitionRows = computed(() =>
    (table.value?.columns ?? []).map((column) => ({
      name: column.name,
      id: column.name,
      type: column.type,
      constraints: [
        column.primaryKey ? 'PRIMARY KEY' : '',
        column.notNull ? 'NOT NULL' : '',
        column.defaultValue ? `DEFAULT ${column.defaultValue}` : ''
      ]
        .filter(Boolean)
        .join(', ')
    }))
  )

  const SCHEMA_TOAST = 'schema-editor'
  const TOAST = { id: SCHEMA_TOAST }
  onBeforeUnmount(() => toast.dismiss(SCHEMA_TOAST))

  const submitting = computed(() => props.loading)
  const pending = ref<PendingChange | null>(null)
  const dialogOpen = (kind: SchemaEditorDialog) =>
    computed({
      get: () => dialog.value === kind,
      set: (open: boolean) => {
        if (open) dialog.value = kind
        else if (dialog.value === kind) dialog.value = 'none'
      }
    })
  const createOpen = dialogOpen('create')
  const columnOpen = dialogOpen('column')
  const rowOpen = dialogOpen('row')
  const alterOpen = dialogOpen('alter')
  const truncateOpen = dialogOpen('truncate')

  let uid = 0
  const newColumn = (
    name = '',
    type = 'text',
    primaryKey = false,
    defaultValue = ''
  ): DraftColumn => ({
    key: `c-${(uid += 1)}`,
    name,
    type,
    primaryKey,
    defaultValue
  })
  const blankTable = (): DraftTable => ({
    name: '',
    columns: [
      newColumn('id', 'int8', true),
      newColumn('created_at', 'timestamptz', false, 'now()')
    ],
    relations: []
  })

  const createForm = reactive(blankTable())
  if (props.defaultDraft.name !== undefined) createForm.name = props.defaultDraft.name
  if (props.defaultDraft.relations)
    createForm.relations = props.defaultDraft.relations.map((relation) => ({ ...relation }))
  const createSubmitted = ref(props.defaultSubmitted && dialog.value === 'create')
  const createSubmitting = submitting
  const createServerError = ref(dialog.value === 'create' ? props.error : '')
  const typeQuery = ref('')
  const filteredTypes = computed(() => filterTypes(typeQuery.value))

  const namedColumns = computed(() => createForm.columns.filter((column) => column.name.trim()))
  const duplicateNames = computed(() => {
    const seen = new Map<string, number>()
    for (const column of namedColumns.value) {
      const name = column.name.trim().toLowerCase()
      seen.set(name, (seen.get(name) ?? 0) + 1)
    }
    return new Set([...seen].filter(([, count]) => count > 1).map(([name]) => name))
  })
  const tableNameError = computed(() => {
    if (createServerError.value) return createServerError.value
    if (!createSubmitted.value) return ''
    if (!createForm.name.trim()) return 'This field is required.'
    if (!/^[a-z_][a-z0-9_]*$/i.test(createForm.name.trim())) {
      return 'Start with a letter or an underscore; use letters, numbers and underscores.'
    }
    return ''
  })
  const columnError = (column: DraftColumn) =>
    createSubmitted.value && duplicateNames.value.has(column.name.trim().toLowerCase())
      ? `Another column is also named ${column.name.trim()}.`
      : ''
  const columnsError = computed(() =>
    createSubmitted.value && !namedColumns.value.length ? 'Add at least one named column.' : ''
  )

  watch(createOpen, (open) => {
    if (!open) return
    Object.assign(createForm, blankTable())
    createSubmitted.value = false
    createServerError.value = ''
    clearCsv()
  })

  const columnDefinition = [
    { key: 'name', label: 'Name', required: true },
    { key: 'type', label: 'Type' },
    { key: 'defaultValue', label: 'Default' },
    { key: 'primaryKey', label: 'Primary' }
  ]
  const columnErrors = computed(() =>
    createForm.columns.map((column) => {
      const message = columnError(column)
      return message ? { name: message } : undefined
    })
  )

  const csvInputEl = ref<HTMLInputElement | null>(null)
  const csvFile = ref<SchemaEditorCsvFile | null>(null)
  const csvHeaders = ref<string[]>([])
  const csvRows = ref<CsvRow[]>([])
  const csvError = ref('')
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
  const inferType = (values: string[]) => {
    const filled = values.filter((value) => value !== '')
    if (!filled.length) return 'text'
    if (filled.every((value) => /^-?\d+$/.test(value))) return 'int8'
    if (filled.every((value) => /^-?\d+(\.\d+)?$/.test(value))) return 'numeric'
    if (filled.every((value) => /^(true|false)$/i.test(value))) return 'bool'
    if (filled.every((value) => /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?.*)?$/.test(value)))
      return 'timestamptz'
    return 'text'
  }
  const clearCsv = () => {
    csvFile.value = null
    csvHeaders.value = []
    csvRows.value = []
    csvError.value = ''
  }
  const applyCsv = (file: SchemaEditorCsvFile, text: string) => {
    clearCsv()
    const lines = text.split(/\r?\n/).filter((line) => line.trim())
    const headers = lines.length ? splitCsvLine(lines[0]) : []
    if (!headers.length || headers.some((header) => !header)) {
      csvFile.value = file
      csvError.value = 'The first line must name every column.'
      return
    }
    const rows = lines
      .slice(1)
      .map((line): CsvRow =>
        Object.fromEntries(splitCsvLine(line).map((value, index) => [headers[index], value]))
      )
    csvFile.value = file
    csvHeaders.value = headers
    csvRows.value = rows
    createForm.columns = headers.map((header) =>
      newColumn(
        header,
        inferType(rows.map((row) => row[header] ?? '')),
        header.toLowerCase() === 'id'
      )
    )
    if (!createForm.name.trim()) createForm.name = file.name.replace(/\.csv$/i, '')
  }
  const onCsvFiles = async (files: FileList | File[] | null) => {
    const file = Array.from(files ?? [])[0]
    if (!file) return
    if (!/\.csv$/i.test(file.name)) {
      clearCsv()
      csvFile.value = { name: file.name, size: file.size, type: file.type }
      csvError.value = 'Choose a .csv file.'
      return
    }
    applyCsv({ name: file.name, size: file.size, type: 'text/csv' }, await file.text())
  }
  const onCsvPick = (event: Event) => {
    const input = event.target as HTMLInputElement
    onCsvFiles(input.files)
    input.value = ''
  }
  const csvTokens = computed(() =>
    csvFile.value
      ? [
          {
            file: csvFile.value,
            error: csvError.value || undefined
          }
        ]
      : []
  )
  const csvPreviewColumns = computed(() =>
    csvHeaders.value.map((header): TableColumn => ({ accessorKey: header, header, minWidth: 120 }))
  )
  const csvPreview = computed(() =>
    csvRows.value.slice(0, 5).map((row, index) => ({ __row: `r${index}`, ...row }))
  )

  const ON_DELETE = [
    { value: 'NO ACTION', label: 'No action' },
    { value: 'CASCADE', label: 'Cascade' },
    { value: 'SET NULL', label: 'Set null' }
  ]
  const newRelation = (): SchemaEditorRelation => ({
    key: `fk-${(uid += 1)}`,
    column: '',
    table: '',
    references: '',
    onDelete: 'NO ACTION'
  })
  const referenceColumns = (relation: SchemaEditorRelation) =>
    items.value.find((item) => item.name === relation.table)?.columns ?? []
  const relationDefinition = [
    { key: 'column', label: 'Column', required: true },
    { key: 'table', label: 'References table', required: true },
    { key: 'references', label: 'References column', required: true },
    { key: 'onDelete', label: 'On delete' }
  ]
  const relationErrors = computed(() =>
    createForm.relations.map((relation) => {
      if (!createSubmitted.value) return undefined
      const missing = (['column', 'table', 'references'] as const).find((key) => !relation[key])
      return missing
        ? { [missing]: 'Choose the column, the table and the column it references.' }
        : undefined
    })
  )
  const relationsInvalid = computed(() =>
    createForm.relations.some(
      (relation) => !relation.column || !relation.table || !relation.references
    )
  )

  if (props.defaultCsv) applyCsv(props.defaultCsv.file, props.defaultCsv.text)

  const submitCreate = (event: Event) => {
    createSubmitted.value = true
    createServerError.value = ''
    if (createSubmitting.value) return
    if (
      tableNameError.value ||
      columnsError.value ||
      duplicateNames.value.size ||
      relationsInvalid.value ||
      csvError.value
    )
      return
    const name = createForm.name.trim()
    const columns = namedColumns.value.map((column): SchemaEditorColumn => ({
      name: column.name.trim(),
      type: column.type,
      primaryKey: column.primaryKey,
      notNull: column.primaryKey,
      defaultValue: column.defaultValue.trim()
    }))
    const rows = csvRows.value.map((row) => ({ ...row }))
    const relations = createForm.relations.map((relation) => ({ ...relation }))
    pending.value = {
      kind: 'create',
      retry: submitCreate,
      apply: () => {
        items.value = [
          ...items.value,
          { name, rowCount: rows.length, columns: columns.map((column) => ({ ...column })) }
        ]
        tableName.value = name
        createOpen.value = false
        toast.success(`Table ${name} created.`, {
          ...TOAST,
          description:
            [
              rows.length
                ? `${rows.length} ${rows.length === 1 ? 'row' : 'rows'} imported from CSV.`
                : '',
              relations.length
                ? `${relations.length} foreign ${relations.length === 1 ? 'key' : 'keys'} added.`
                : ''
            ]
              .filter(Boolean)
              .join(' ') || undefined,
          actions: [
            { label: 'Insert row', onClick: () => openRow() },
            { label: 'Add column', onClick: () => openColumn() }
          ]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('create-table', event, { name, columns, relations, rows })
  }

  const blankColumn = (): SchemaEditorColumnForm => ({
    name: '',
    type: 'text',
    defaultValue: '',
    primaryKey: false,
    notNull: false
  })
  const columnForm = reactive<SchemaEditorColumnForm>({ ...blankColumn(), ...props.defaultColumn })
  const columnSubmitted = ref(props.defaultSubmitted && dialog.value === 'column')
  const columnSubmitting = submitting
  const columnNameError = computed(() => {
    if (!columnSubmitted.value) return ''
    const name = columnForm.name.trim()
    if (!name) return 'This field is required.'
    if (table.value?.columns.some((column) => column.name === name.toLowerCase())) {
      return `${table.value.name} already has a column named ${name}.`
    }
    return ''
  })
  const openColumn = () => {
    columnOpen.value = true
  }
  const submitColumn = (event: Event) => {
    columnSubmitted.value = true
    if (columnSubmitting.value || columnNameError.value || !table.value) return
    const target = table.value
    const column: SchemaEditorColumn = {
      name: columnForm.name.trim(),
      type: columnForm.type,
      primaryKey: columnForm.primaryKey,
      notNull: columnForm.notNull || columnForm.primaryKey,
      defaultValue: columnForm.defaultValue.trim()
    }
    pending.value = {
      kind: 'column',
      retry: submitColumn,
      apply: () => {
        target.columns = [...target.columns, column]
        columnOpen.value = false
        toast.success(`Column ${column.name} added to ${target.name}.`, {
          ...TOAST,
          actions: [{ label: 'Change type', onClick: () => openAlter(column.name) }]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('add-column', event, { table: target, column: { ...column } })
  }

  const rowForm = reactive<Record<string, string>>({ ...props.defaultRow })
  const rowSubmitted = ref(props.defaultSubmitted && dialog.value === 'row')
  const rowSubmitting = submitting
  const isAuto = (column: SchemaEditorColumn) =>
    column.primaryKey && INTEGER_TYPES.includes(column.type)
  const rowError = (column: SchemaEditorColumn) =>
    rowSubmitted.value &&
    column.notNull &&
    !isAuto(column) &&
    !column.defaultValue &&
    !String(rowForm[column.name] ?? '').trim()
      ? `${column.name} cannot be NULL. Enter a value.`
      : ''
  const rowHint = (column: SchemaEditorColumn) => {
    if (isAuto(column)) return 'Generated by the database.'
    if (column.defaultValue) return `Empty uses the default, ${column.defaultValue}.`
    return column.notNull ? 'Required.' : 'Empty stores NULL.'
  }
  const openRow = () => {
    rowOpen.value = true
  }
  const submitRow = (event: Event) => {
    rowSubmitted.value = true
    if (rowSubmitting.value || !table.value) return
    if (table.value.columns.some((column) => rowError(column))) return
    const target = table.value
    pending.value = {
      kind: 'row',
      retry: submitRow,
      apply: () => {
        target.rowCount += 1
        rowOpen.value = false
        toast.success(`Row inserted into ${target.name}.`, {
          ...TOAST,
          actions: [{ label: 'Insert another', onClick: () => openRow() }]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('insert-row', event, { table: target, values: { ...rowForm } })
  }

  const alterColumn = ref(dialog.value === 'alter' ? props.defaultAlterColumn : '')
  const alterType = ref('text')
  const alterSubmitting = submitting
  const alterCurrent = computed(() =>
    table.value?.columns.find((column) => column.name === alterColumn.value)
  )
  const alterSql = computed(() => {
    if (!table.value || !alterCurrent.value) return ''
    const name = table.value.name
    const columns = table.value.columns.map((column) =>
      column.name === alterColumn.value
        ? `${column.name} ${alterType.value}`
        : `${column.name} ${column.type}`
    )
    return [
      'BEGIN;',
      `CREATE TABLE ${name}_new (${columns.join(', ')});`,
      `INSERT INTO ${name}_new SELECT * FROM ${name};`,
      `DROP TABLE ${name};`,
      `ALTER TABLE ${name}_new RENAME TO ${name};`,
      'COMMIT;'
    ].join('\n')
  })
  const openAlter = (name: string) => {
    alterColumn.value = name
    alterType.value = table.value?.columns.find((column) => column.name === name)?.type ?? 'text'
    typeQuery.value = ''
    alterOpen.value = true
  }
  const confirmAlter = (event: Event) => {
    if (alterSubmitting.value || !alterCurrent.value || !table.value) return
    const target = table.value
    const column = alterCurrent.value
    const type = alterType.value
    pending.value = {
      kind: 'alter',
      retry: confirmAlter,
      apply: () => {
        column.type = type
        alterOpen.value = false
        toast.success(`${column.name} is now ${type}.`, {
          ...TOAST,
          actions: [{ label: 'Change again', onClick: () => openAlter(column.name) }]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('change-type', event, { table: target, column: { ...column }, type })
  }

  const truncateConfirm = ref('')
  const truncateSubmitting = submitting
  const canTruncate = computed(() => truncateConfirm.value.trim() === table.value?.name)
  const openTruncate = () => {
    truncateOpen.value = true
  }
  const confirmTruncate = (event: Event) => {
    if (!canTruncate.value || truncateSubmitting.value || !table.value) return
    const target = table.value
    const removed = target.rowCount
    pending.value = {
      kind: 'truncate',
      retry: confirmTruncate,
      apply: () => {
        target.rowCount = 0
        truncateOpen.value = false
        toast.success(
          `${target.name} truncated. ${removed} ${removed === 1 ? 'row' : 'rows'} removed.`,
          {
            ...TOAST,
            actions: [{ label: 'Insert row', onClick: () => openRow() }]
          }
        )
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('truncate', event, target)
  }

  watch(dialog, (next) => {
    if (next === 'column') {
      Object.assign(columnForm, blankColumn())
      columnSubmitted.value = false
      typeQuery.value = ''
    }
    if (next === 'row') {
      for (const key of Object.keys(rowForm)) delete rowForm[key]
      for (const column of table.value?.columns ?? []) rowForm[column.name] = ''
      rowSubmitted.value = false
    }
    if (next === 'truncate') truncateConfirm.value = ''
  })

  const FAILURES: Partial<Record<SchemaEditorDialog, string>> = {
    column: "The column wasn't added.",
    row: "The row wasn't inserted.",
    alter: "The type wasn't changed.",
    truncate: "The table wasn't truncated."
  }
  const showFailure = () => {
    const change = pending.value
    if (!change || !props.error) return
    if (change.kind === 'create') {
      createServerError.value = props.error
      return
    }
    toast.error(FAILURES[change.kind] ?? '', {
      ...TOAST,
      description: props.error,
      action: { label: 'Retry', onClick: (event: MouseEvent) => change.retry(event) }
    })
  }
  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now) return
      if (props.error) {
        showFailure()
        return
      }
      const change = pending.value
      pending.value = null
      change?.apply()
    }
  )
  watch(
    () => props.error,
    (next) => {
      if (next && !props.loading) showFailure()
    }
  )

  const onTableAction = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    if (value === 'truncate') openTruncate()
    if (value === 'create') createOpen.value = true
  }
  const onColumnAction = (value: DropdownMenuItemValue, row: { name: string }) => {
    if (value === 'alter') openAlter(row.name)
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="definitionRows"
          :columns="definitionColumns"
          row-key="id"
          :bordered="false"
          :aria-label="`Columns of ${table?.name ?? ''}`"
        >
          <template #toolbar>
            <div class="flex w-full flex-wrap items-center gap-(--spacing-xs)">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-table shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-heading-2xs text-(--text-default)">{{
                  table?.name
                }}</span>
                <Tag
                  :label="`${table?.rowCount ?? 0} ${table?.rowCount === 1 ? 'row' : 'rows'}`"
                  severity="neutral"
                  size="small"
                />
              </div>
              <div class="ms-auto flex flex-wrap items-center gap-(--spacing-xs)">
                <Button
                  label="Add column"
                  variant="outline"
                  size="medium"
                  icon="ai ai-plus"
                  @click="openColumn"
                />
                <Button
                  label="Insert row"
                  variant="primary"
                  size="medium"
                  icon="ai ai-plus"
                  @click="openRow"
                />
                <DropdownMenu
                  placement="bottom-end"
                  @select="onTableAction"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip content="Table actions">
                      <IconButton
                        icon="ai ai-ellipsis"
                        variant="outline"
                        size="medium"
                        aria-label="Table actions"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="create"
                      label="Create Table"
                    >
                      <template #leading
                        ><i
                          class="ai ai-plus"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="truncate"
                      label="Truncate table"
                    >
                      <template #leading
                        ><i
                          class="ai ai-eraser"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </div>
          </template>
          <template #cell-name="{ value }">
            <span class="min-w-0 truncate font-code text-label-code-sm">{{ value }}</span>
          </template>
          <template #cell-type="{ value }">
            <Tag
              :label="value"
              severity="neutral"
              size="medium"
            />
          </template>
          <template #cell-constraints="{ value }">
            <span class="text-body-sm text-(--text-muted)">{{ value || 'None' }}</span>
          </template>
          <template #cell-actions="{ row }">
            <Table.CellActions
              :name="row.name"
              @select="(_event, value) => onColumnAction(value, row)"
            >
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="alter"
                  label="Change type"
                >
                  <template #leading
                    ><i
                      class="ai ai-pencil"
                      aria-hidden="true"
                  /></template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </Table.CellActions>
          </template>
        </DataTable>
      </template>
    </Card>

    <Drawer
      v-model:open="createOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Table"
          novalidate
          @submit.prevent="submitCreate"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Create Table</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Define the table name and its columns in {{ database }}, or start from a CSV file.
                Drag a column's grip, or focus it and use the arrow keys, to reorder.
              </p>
            </div>
          </PanelHeader>

          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="createSubmitting"
            >
              <legend class="sr-only">Create Table</legend>
              <SettingsSection
                title="General"
                hint="Names the table inside this database."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <Alert
                    v-if="createServerError"
                    severity="danger"
                    :label="`The table wasn't created. ${createServerError} Your columns are kept; pick another name and create it again.`"
                  />
                  <Field :invalid="!!tableNameError">
                    <Field.Label>Name</Field.Label>
                    <Input
                      v-model="createForm.name"
                      size="large"
                      class="w-full"
                      placeholder="users"
                      autocomplete="off"
                      @update:model-value="createServerError = ''"
                    />
                    <Field.Description
                      >Every query addresses it, so it cannot be changed later without rewriting
                      them.</Field.Description
                    >
                    <Field.Error v-if="tableNameError">{{ tableNameError }}</Field.Error>
                  </Field>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Import data from CSV"
                hint="Optional. The first line names the columns; the types are guessed from the values and can be changed below. Every row is inserted after the table is created."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <FileDropzone
                    v-if="!csvFile"
                    accept=".csv,text/csv"
                    description="One .csv file, comma-separated, up to 10 MB."
                    @drop="(_event, files) => onCsvFiles(files)"
                  >
                    <Button
                      type="button"
                      label="Browse files"
                      variant="secondary"
                      size="medium"
                      @click="csvInputEl?.click()"
                    />
                  </FileDropzone>
                  <input
                    ref="csvInputEl"
                    type="file"
                    accept=".csv,text/csv"
                    class="hidden"
                    aria-hidden="true"
                    tabindex="-1"
                    @change="onCsvPick"
                  />
                  <FileTokenGroup
                    v-if="csvFile"
                    :items="csvTokens"
                    @remove="clearCsv"
                  />
                  <template v-if="csvRows.length">
                    <p class="m-0 text-body-sm text-(--text-muted)">
                      {{ csvHeaders.length }} columns and {{ csvRows.length }}
                      {{ csvRows.length === 1 ? 'row' : 'rows' }} read. The first
                      {{ csvPreview.length }} below; the columns were filled from the header.
                    </p>
                    <DataTable
                      :data="csvPreview"
                      :columns="csvPreviewColumns"
                      row-key="__row"
                      :bordered="true"
                      aria-label="CSV preview"
                    />
                  </template>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Columns"
                hint="The table's schema, created in this order. A primary key is NOT NULL."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                    <Button
                      type="button"
                      label="About data types"
                      variant="outline"
                      size="small"
                      icon="ai ai-external-link"
                      href="https://www.azion.com/en/documentation/"
                      target="_blank"
                    />
                  </div>
                  <AttributeEditor
                    v-model:items="createForm.columns"
                    :definition="columnDefinition"
                    :errors="columnErrors"
                    :new-item="newColumn"
                    :min-items="1"
                    :disabled="createSubmitting"
                    reorderable
                    size="large"
                    add-button-label="Add column"
                    remove-button-label="Remove column"
                    aria-label="Columns"
                  >
                    <template #cell-name="{ index, invalid }">
                      <Input
                        v-model="createForm.columns[index].name"
                        size="large"
                        class="w-full"
                        placeholder="column_name"
                        :invalid="invalid"
                      />
                    </template>
                    <template #cell-type="{ index }">
                      <Select
                        v-model="createForm.columns[index].type"
                        size="large"
                        class="w-full"
                      >
                        <Select.Trigger>
                          <template #leading>
                            <span
                              class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                              aria-hidden="true"
                              >{{ glyphOf(createForm.columns[index].type) }}</span
                            >
                          </template>
                        </Select.Trigger>
                        <Select.Content>
                          <template #search>
                            <Input
                              v-model="typeQuery"
                              size="medium"
                              class="w-full"
                              placeholder="Search types"
                              aria-label="Search types"
                              @keydown.stop
                            />
                          </template>
                          <Select.Group label="Data types">
                            <Select.Item
                              v-for="type in filteredTypes"
                              :key="type.value"
                              :value="type.value"
                            >
                              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="font-code text-label-code-sm">{{ type.value }}</span>
                                <span class="truncate text-body-xs text-(--text-muted)">{{
                                  type.description
                                }}</span>
                              </span>
                            </Select.Item>
                          </Select.Group>
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-defaultValue="{ index }">
                      <Input
                        v-model="createForm.columns[index].defaultValue"
                        size="large"
                        class="w-full"
                        placeholder="NULL"
                      />
                    </template>
                    <template #cell-primaryKey="{ index }">
                      <Checkbox v-model="createForm.columns[index].primaryKey" />
                    </template>
                  </AttributeEditor>
                  <FieldError v-if="columnsError">{{ columnsError }}</FieldError>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Foreign keys"
                hint="Optional. Tie a column to a row in another table, so a value that does not exist there is refused."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <AttributeEditor
                    v-model:items="createForm.relations"
                    :definition="relationDefinition"
                    :errors="relationErrors"
                    :new-item="newRelation"
                    :disabled="createSubmitting"
                    size="large"
                    add-button-label="Add foreign key"
                    remove-button-label="Remove foreign key"
                    empty-title="No foreign keys."
                    aria-label="Foreign keys"
                  >
                    <template #cell-column="{ index, invalid }">
                      <Select
                        v-model="createForm.relations[index].column"
                        size="large"
                        class="w-full"
                        placeholder="Column"
                        :invalid="invalid"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="column in namedColumns"
                            :key="column.key"
                            :value="column.name.trim()"
                            >{{ column.name.trim() }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-table="{ index, invalid }">
                      <Select
                        v-model="createForm.relations[index].table"
                        size="large"
                        class="w-full"
                        placeholder="Table"
                        :invalid="invalid"
                        @update:model-value="createForm.relations[index].references = ''"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="item in items"
                            :key="item.name"
                            :value="item.name"
                            >{{ item.name }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-references="{ item, index, invalid }">
                      <Select
                        v-model="createForm.relations[index].references"
                        size="large"
                        class="w-full"
                        placeholder="Column"
                        :invalid="invalid"
                        :disabled="!item.table"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="column in referenceColumns(item)"
                            :key="column.name"
                            :value="column.name"
                            >{{ column.name }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-onDelete="{ index }">
                      <Select
                        v-model="createForm.relations[index].onDelete"
                        size="large"
                        class="w-full"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="option in ON_DELETE"
                            :key="option.value"
                            :value="option.value"
                            >{{ option.label }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                  </AttributeEditor>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelBody>

          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="createSubmitting"
                @click="createOpen = false"
              />
              <Button
                type="submit"
                label="Create Table"
                variant="primary"
                size="medium"
                :loading="createSubmitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <Drawer
      v-model:open="columnOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add column"
          novalidate
          @submit.prevent="submitColumn"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Add column</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                The column is added at the end of {{ table?.name }}.
              </p>
            </div>
          </PanelHeader>
          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="columnSubmitting"
            >
              <legend class="sr-only">Add column</legend>
              <SettingsSection
                title="Column"
                hint="Its name, type and the value rows get when they leave it empty."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
                  <Field :invalid="!!columnNameError">
                    <Field.Label>Name</Field.Label>
                    <Input
                      v-model="columnForm.name"
                      size="large"
                      class="w-full"
                      placeholder="column_name"
                      autocomplete="off"
                    />
                    <Field.Error v-if="columnNameError">{{ columnNameError }}</Field.Error>
                  </Field>
                  <Field>
                    <Field.Label>Type</Field.Label>
                    <Select
                      v-model="columnForm.type"
                      size="large"
                      class="w-full"
                    >
                      <Select.Trigger>
                        <template #leading>
                          <span
                            class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                            aria-hidden="true"
                            >{{ glyphOf(columnForm.type) }}</span
                          >
                        </template>
                      </Select.Trigger>
                      <Select.Content>
                        <template #search>
                          <Input
                            v-model="typeQuery"
                            size="medium"
                            class="w-full"
                            placeholder="Search types"
                            aria-label="Search types"
                            @keydown.stop
                          />
                        </template>
                        <Select.Group label="Data types">
                          <Select.Item
                            v-for="type in filteredTypes"
                            :key="type.value"
                            :value="type.value"
                          >
                            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <span class="font-code text-label-code-sm">{{ type.value }}</span>
                              <span class="truncate text-body-xs text-(--text-muted)">{{
                                type.description
                              }}</span>
                            </span>
                          </Select.Item>
                        </Select.Group>
                      </Select.Content>
                    </Select>
                  </Field>
                  <Field>
                    <Field.Label>Default value</Field.Label>
                    <Input
                      v-model="columnForm.defaultValue"
                      size="large"
                      class="w-full"
                      placeholder="NULL"
                      autocomplete="off"
                    />
                    <Field.Description
                      >Applies to rows that do not supply a value. Leave it empty for NULL, or use
                      an expression such as now().</Field.Description
                    >
                  </Field>
                </div>
              </SettingsSection>
              <SettingsSection
                title="Constraints"
                hint="A primary key is always NOT NULL, so turning it on also turns on Not null."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <Field orientation="horizontal">
                    <Field.Content>
                      <Field.Title>Primary key</Field.Title>
                      <Field.Description
                        >Use this column as the table's primary key.</Field.Description
                      >
                    </Field.Content>
                    <Switch
                      v-model="columnForm.primaryKey"
                      aria-label="Primary key"
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <Field.Content>
                      <Field.Title>Not null</Field.Title>
                      <Field.Description>Require a value in every row.</Field.Description>
                    </Field.Content>
                    <Switch
                      :model-value="columnForm.notNull || columnForm.primaryKey"
                      :disabled="columnForm.primaryKey"
                      aria-label="Not null"
                      @update:model-value="(value) => (columnForm.notNull = !!value)"
                    />
                  </Field>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelBody>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="columnSubmitting"
                @click="columnOpen = false"
              />
              <Button
                type="submit"
                label="Add column"
                variant="primary"
                size="medium"
                :loading="columnSubmitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <Drawer
      v-model:open="rowOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Insert row"
          novalidate
          @submit.prevent="submitRow"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Insert row</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                One field per column of {{ table?.name }}, in the table's own order.
              </p>
            </div>
          </PanelHeader>
          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0"
              :disabled="rowSubmitting"
            >
              <legend class="sr-only">Insert row</legend>
              <Field
                v-for="column in table?.columns ?? []"
                :key="column.name"
                :invalid="!!rowError(column)"
                :disabled="isAuto(column)"
              >
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                  <Field.Label
                    ><span class="font-code">{{ column.name }}</span></Field.Label
                  >
                  <span class="shrink-0 font-code text-body-xs text-(--text-muted)">{{
                    column.type
                  }}</span>
                </div>
                <Input
                  v-model="rowForm[column.name]"
                  size="large"
                  class="w-full"
                  :placeholder="
                    isAuto(column) ? 'Automatically generated' : column.defaultValue || 'NULL'
                  "
                  autocomplete="off"
                />
                <Field.Description>{{ rowHint(column) }}</Field.Description>
                <Field.Error v-if="rowError(column)">{{ rowError(column) }}</Field.Error>
              </Field>
            </fieldset>
          </PanelBody>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="rowSubmitting"
                @click="rowOpen = false"
              />
              <Button
                type="submit"
                label="Insert row"
                variant="primary"
                size="medium"
                :loading="rowSubmitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <ConfirmDialog
      v-model:open="alterOpen"
      :title="`Change the type of ${alterColumn}`"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Changing a type rebuilds the table and copies every row. It can't be undone, and values that don't fit the new type make it fail."
        />
        <Field>
          <Field.Label>New type</Field.Label>
          <Select
            v-model="alterType"
            size="large"
            class="w-full"
          >
            <Select.Trigger>
              <template #leading>
                <span
                  class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                  aria-hidden="true"
                  >{{ glyphOf(alterType) }}</span
                >
              </template>
            </Select.Trigger>
            <Select.Content>
              <Select.Group label="Data types">
                <Select.Item
                  v-for="type in TYPES"
                  :key="type.value"
                  :value="type.value"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="font-code text-label-code-sm">{{ type.value }}</span>
                    <span class="truncate text-body-xs text-(--text-muted)">{{
                      type.description
                    }}</span>
                  </span>
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select>
          <Field.Description
            >Currently {{ alterCurrent?.type }}. Review the statements that will
            run.</Field.Description
          >
        </Field>
        <CodeEditor
          :model-value="alterSql"
          language="sql"
          readonly
          height="10rem"
          aria-label="Statements that will run"
        />
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          variant="outline"
          size="medium"
          :disabled="alterSubmitting"
          @click="close"
        />
        <Button
          label="Change type"
          variant="primary"
          size="medium"
          :loading="alterSubmitting"
          :disabled="alterType === alterCurrent?.type"
          @click="confirmAlter"
        />
      </template>
    </ConfirmDialog>

    <ConfirmDialog
      v-model:open="truncateOpen"
      :title="`Truncate ${table?.name ?? ''}`"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          Every row of {{ table?.name }} is removed ({{ table?.rowCount }} now). The columns, their
          types and constraints stay as they are.
        </p>
        <CodeEditor
          :model-value="`TRUNCATE TABLE ${table?.name ?? ''};`"
          language="sql"
          readonly
          height="3rem"
          :show-line-numbers="false"
          aria-label="Statement that will run"
        />
        <Field>
          <Field.Label
            >Type <code class="text-label-code-sm">{{ table?.name }}</code> to confirm.</Field.Label
          >
          <Input
            v-model="truncateConfirm"
            size="large"
            class="w-full"
            autocomplete="off"
            @keydown.enter="confirmTruncate"
          />
        </Field>
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          variant="outline"
          size="medium"
          :disabled="truncateSubmitting"
          @click="close"
        />
        <Button
          label="Truncate table"
          variant="danger"
          size="medium"
          :loading="truncateSubmitting"
          :disabled="!canTruncate"
          @click="confirmTruncate"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
