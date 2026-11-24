<script setup lang="ts">
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  import { createdDescription } from './lib/draft-table'
  import AddColumnDrawer from './parts/add-column-drawer.vue'
  import ChangeTypeDialog from './parts/change-type-dialog.vue'
  import CreateTableDrawer from './parts/create-table-drawer.vue'
  import InsertRowDrawer from './parts/insert-row-drawer.vue'
  import SchemaColumnsTable from './parts/schema-columns-table.vue'
  import TruncateTableDialog from './parts/truncate-table-dialog.vue'
  import { sampleDatabase, sampleTables } from './sample'

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

  const typeQuery = ref('')
  const createServerError = ref(dialog.value === 'create' ? props.error : '')
  const columnDrawerEl = ref<InstanceType<typeof AddColumnDrawer> | null>(null)
  const rowDrawerEl = ref<InstanceType<typeof InsertRowDrawer> | null>(null)
  const createDrawerEl = ref<InstanceType<typeof CreateTableDrawer> | null>(null)
  const alterColumn = ref(dialog.value === 'alter' ? props.defaultAlterColumn : '')
  const alterType = ref('text')
  const alterCurrent = computed(() =>
    table.value?.columns.find((column) => column.name === alterColumn.value)
  )

  const openColumn = () => {
    columnOpen.value = true
  }
  const openRow = () => {
    rowOpen.value = true
  }
  const openAlter = (name: string) => {
    alterColumn.value = name
    alterType.value = table.value?.columns.find((column) => column.name === name)?.type ?? 'text'
    typeQuery.value = ''
    alterOpen.value = true
  }
  const openTruncate = () => {
    truncateOpen.value = true
  }

  const submitCreate = (event: Event, created: SchemaEditorNewTable) => {
    const { name, columns, relations, rows } = created
    pending.value = {
      kind: 'create',
      retry: (retryEvent) => createDrawerEl.value?.submit(retryEvent),
      apply: () => {
        items.value = [
          ...items.value,
          { name, rowCount: rows.length, columns: columns.map((column) => ({ ...column })) }
        ]
        tableName.value = name
        createOpen.value = false
        toast.success(`Table ${name} created.`, {
          ...TOAST,
          description: createdDescription(rows.length, relations.length),
          actions: [
            { label: 'Insert row', onClick: () => openRow() },
            { label: 'Add column', onClick: () => openColumn() }
          ]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('create-table', event, created)
  }

  const submitColumn = (event: Event, column: SchemaEditorColumn) => {
    if (!table.value) return
    const target = table.value
    pending.value = {
      kind: 'column',
      retry: (retryEvent) => columnDrawerEl.value?.submit(retryEvent),
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

  const submitRow = (event: Event, values: Record<string, string>) => {
    if (!table.value) return
    const target = table.value
    pending.value = {
      kind: 'row',
      retry: (retryEvent) => rowDrawerEl.value?.submit(retryEvent),
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
    emit('insert-row', event, { table: target, values })
  }

  const confirmAlter = (event: Event) => {
    if (submitting.value || !alterCurrent.value || !table.value) return
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

  const confirmTruncate = (event: Event) => {
    if (submitting.value || !table.value) return
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
    <SchemaColumnsTable
      :table="table"
      @add-column="openColumn"
      @insert-row="openRow"
      @table-action="onTableAction"
      @column-action="(_event, value, name) => onColumnAction(value, { name })"
    />

    <CreateTableDrawer
      ref="createDrawerEl"
      v-model:open="createOpen"
      v-model:server-error="createServerError"
      v-model:type-query="typeQuery"
      :database="database"
      :tables="items"
      :submitting="submitting"
      :default-draft="defaultDraft"
      :default-csv="defaultCsv"
      :default-submitted="defaultSubmitted && dialog === 'create'"
      @submit="submitCreate"
    />

    <AddColumnDrawer
      ref="columnDrawerEl"
      v-model:open="columnOpen"
      v-model:type-query="typeQuery"
      :table="table"
      :submitting="submitting"
      :default-column="defaultColumn"
      :default-submitted="defaultSubmitted && dialog === 'column'"
      @submit="submitColumn"
    />

    <InsertRowDrawer
      ref="rowDrawerEl"
      v-model:open="rowOpen"
      :table="table"
      :submitting="submitting"
      :default-row="defaultRow"
      :default-submitted="defaultSubmitted && dialog === 'row'"
      @submit="submitRow"
    />

    <ChangeTypeDialog
      v-model:open="alterOpen"
      v-model:type="alterType"
      :table="table"
      :column="alterColumn"
      :current="alterCurrent"
      :submitting="submitting"
      @confirm="confirmAlter"
    />

    <TruncateTableDialog
      v-model:open="truncateOpen"
      :table="table"
      :submitting="submitting"
      @confirm="confirmTruncate"
    />
  </div>
</template>
