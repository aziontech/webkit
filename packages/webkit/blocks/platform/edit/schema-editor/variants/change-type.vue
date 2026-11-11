<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'

  const DATABASE = 'acme-store'

  const TYPES = [
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
  const glyphOf = (value) => TYPES.find((type) => type.value === value)?.glyph ?? '#'
  const filterTypes = (query) => {
    const term = query.trim().toLowerCase()
    if (!term) return TYPES
    return TYPES.filter(
      (type) => type.value.includes(term) || type.description.toLowerCase().includes(term)
    )
  }

  const tables = ref([
    {
      name: 'customers',
      columns: [
        { name: 'id', type: 'int8', primaryKey: true, notNull: true, defaultValue: '' },
        { name: 'name', type: 'text', primaryKey: false, notNull: true, defaultValue: '' },
        { name: 'email', type: 'varchar', primaryKey: false, notNull: true, defaultValue: '' },
        {
          name: 'created_at',
          type: 'timestamptz',
          primaryKey: false,
          notNull: false,
          defaultValue: 'now()'
        }
      ],
      rowCount: 3
    },
    {
      name: 'orders',
      columns: [
        { name: 'id', type: 'int8', primaryKey: true, notNull: true, defaultValue: '' },
        { name: 'customer_id', type: 'int8', primaryKey: false, notNull: true, defaultValue: '' },
        { name: 'total', type: 'numeric', primaryKey: false, notNull: true, defaultValue: '' }
      ],
      rowCount: 2
    }
  ])
  const tableName = ref('customers')
  const table = computed(() => tables.value.find((item) => item.name === tableName.value))

  const definitionColumns = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 120 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]
  const definitionRows = computed(() =>
    (table.value?.columns ?? []).map((column) => ({
      id: column.name,
      name: column.name,
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
  const timers = new Set()
  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id)
      fn()
    }, ms)
    timers.add(id)
  }
  onBeforeUnmount(() => {
    for (const id of timers) clearTimeout(id)
    toast.dismiss(SCHEMA_TOAST)
  })

  let uid = 0
  const newColumn = (name = '', type = 'text', primaryKey = false, defaultValue = '') => ({
    key: `c-${(uid += 1)}`,
    name,
    type,
    primaryKey,
    defaultValue
  })
  const blankTable = () => ({
    name: '',
    columns: [newColumn('id', 'int8', true), newColumn('created_at', 'timestamptz', false, 'now()')]
  })

  const createOpen = ref(false)
  const createForm = reactive(blankTable())
  const createSubmitted = ref(false)
  const createSubmitting = ref(false)
  const createServerError = ref('')
  const typeQuery = ref('')
  const filteredTypes = computed(() => filterTypes(typeQuery.value))

  const namedColumns = computed(() => createForm.columns.filter((column) => column.name.trim()))
  const duplicateNames = computed(() => {
    const seen = new Map()
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
  const columnError = (column) =>
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
  })

  const addColumnRow = async () => {
    createForm.columns.push(newColumn())
    await nextTick()
    globalThis.document
      ?.querySelector(`[data-column-key="${createForm.columns.at(-1).key}"] input`)
      ?.focus()
  }
  const removeColumnRow = (index) => {
    if (createForm.columns.length > 1) createForm.columns.splice(index, 1)
  }
  const moveColumnRow = async (index, step) => {
    const target = index + step
    if (target < 0 || target >= createForm.columns.length) return
    const [moved] = createForm.columns.splice(index, 1)
    createForm.columns.splice(target, 0, moved)
    await nextTick()
    globalThis.document?.querySelector(`[data-column-key="${moved.key}"] [data-grip]`)?.focus()
  }

  const submitCreate = () => {
    createSubmitted.value = true
    createServerError.value = ''
    if (createSubmitting.value) return
    if (tableNameError.value || columnsError.value || duplicateNames.value.size) return
    const name = createForm.name.trim()
    createSubmitting.value = true
    toast.dismiss(SCHEMA_TOAST)
    later(() => {
      createSubmitting.value = false
      if (tables.value.some((item) => item.name === name.toLowerCase())) {
        createServerError.value = `A table named ${name} already exists in ${DATABASE}.`
        return
      }
      if (name.toLowerCase().startsWith('offline')) {
        toast.error("The table wasn't created.", {
          id: SCHEMA_TOAST,
          description: "The request didn't reach the database. Your columns are kept.",
          action: { label: 'Retry', onClick: () => submitCreate() }
        })
        return
      }
      tables.value = [
        ...tables.value,
        {
          name,
          rowCount: 0,
          columns: namedColumns.value.map((column) => ({
            name: column.name.trim(),
            type: column.type,
            primaryKey: column.primaryKey,
            notNull: column.primaryKey,
            defaultValue: column.defaultValue.trim()
          }))
        }
      ]
      tableName.value = name
      createOpen.value = false
      toast.success(`Table ${name} created.`, {
        id: SCHEMA_TOAST,
        actions: [
          { label: 'Insert row', onClick: () => openRow() },
          { label: 'Add column', onClick: () => openColumn() }
        ]
      })
    }, 900)
  }

  const columnOpen = ref(false)
  const columnForm = reactive({
    name: '',
    type: 'text',
    defaultValue: '',
    primaryKey: false,
    notNull: false
  })
  const columnSubmitted = ref(false)
  const columnSubmitting = ref(false)
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
    Object.assign(columnForm, {
      name: '',
      type: 'text',
      defaultValue: '',
      primaryKey: false,
      notNull: false
    })
    columnSubmitted.value = false
    typeQuery.value = ''
    columnOpen.value = true
  }
  const submitColumn = () => {
    columnSubmitted.value = true
    if (columnSubmitting.value || columnNameError.value || !table.value) return
    const name = columnForm.name.trim()
    const target = table.value
    columnSubmitting.value = true
    later(() => {
      columnSubmitting.value = false
      target.columns = [
        ...target.columns,
        {
          name,
          type: columnForm.type,
          primaryKey: columnForm.primaryKey,
          notNull: columnForm.notNull || columnForm.primaryKey,
          defaultValue: columnForm.defaultValue.trim()
        }
      ]
      columnOpen.value = false
      toast.success(`Column ${name} added to ${target.name}.`, {
        id: SCHEMA_TOAST,
        actions: [{ label: 'Change type', onClick: () => openAlter(name) }]
      })
    }, 700)
  }

  const rowOpen = ref(false)
  const rowForm = reactive({})
  const rowSubmitted = ref(false)
  const rowSubmitting = ref(false)
  const isAuto = (column) => column.primaryKey && INTEGER_TYPES.includes(column.type)
  const rowError = (column) =>
    rowSubmitted.value &&
    column.notNull &&
    !isAuto(column) &&
    !column.defaultValue &&
    !String(rowForm[column.name] ?? '').trim()
      ? `${column.name} cannot be NULL. Enter a value.`
      : ''
  const rowHint = (column) => {
    if (isAuto(column)) return 'Generated by the database.'
    if (column.defaultValue) return `Empty uses the default, ${column.defaultValue}.`
    return column.notNull ? 'Required.' : 'Empty stores NULL.'
  }
  const openRow = () => {
    for (const key of Object.keys(rowForm)) delete rowForm[key]
    for (const column of table.value?.columns ?? []) rowForm[column.name] = ''
    rowSubmitted.value = false
    rowOpen.value = true
  }
  const submitRow = () => {
    rowSubmitted.value = true
    if (rowSubmitting.value || !table.value) return
    if (table.value.columns.some((column) => rowError(column))) return
    const target = table.value
    rowSubmitting.value = true
    later(() => {
      rowSubmitting.value = false
      target.rowCount += 1
      rowOpen.value = false
      toast.success(`Row inserted into ${target.name}.`, {
        id: SCHEMA_TOAST,
        actions: [{ label: 'Insert another', onClick: () => openRow() }]
      })
    }, 600)
  }

  const alterOpen = ref(true)
  const alterColumn = ref('email')
  const alterType = ref('text')
  const alterSubmitting = ref(false)
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
  const openAlter = (name) => {
    alterColumn.value = name
    alterType.value = table.value?.columns.find((column) => column.name === name)?.type ?? 'text'
    typeQuery.value = ''
    alterOpen.value = true
  }
  const confirmAlter = () => {
    if (alterSubmitting.value || !alterCurrent.value) return
    const column = alterCurrent.value
    const type = alterType.value
    alterSubmitting.value = true
    later(() => {
      alterSubmitting.value = false
      column.type = type
      alterOpen.value = false
      toast.success(`${column.name} is now ${type}.`, {
        id: SCHEMA_TOAST,
        actions: [{ label: 'Change again', onClick: () => openAlter(column.name) }]
      })
    }, 900)
  }

  const truncateOpen = ref(false)
  const truncateConfirm = ref('')
  const truncateSubmitting = ref(false)
  const canTruncate = computed(() => truncateConfirm.value.trim() === table.value?.name)
  const openTruncate = () => {
    truncateConfirm.value = ''
    truncateOpen.value = true
  }
  const confirmTruncate = () => {
    if (!canTruncate.value || truncateSubmitting.value || !table.value) return
    const target = table.value
    const removed = target.rowCount
    truncateSubmitting.value = true
    later(() => {
      truncateSubmitting.value = false
      target.rowCount = 0
      truncateOpen.value = false
      toast.success(
        `${target.name} truncated. ${removed} ${removed === 1 ? 'row' : 'rows'} removed.`,
        {
          id: SCHEMA_TOAST,
          actions: [{ label: 'Insert row', onClick: () => openRow() }]
        }
      )
    }, 700)
  }

  const onTableAction = (event, value) => {
    if (value === 'truncate') openTruncate()
    if (value === 'create') createOpen.value = true
  }
  const onColumnAction = (value, row) => {
    if (value === 'alter') openAlter(row.name)
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-md)">
    <Card :padded="false">
      <template #content>
        <TableRoot
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
                  class="pi pi-table shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-heading-xxs text-(--text-default)">{{
                  table?.name
                }}</span>
                <Tag
                  :label="`${table?.rowCount ?? 0} ${table?.rowCount === 1 ? 'row' : 'rows'}`"
                  severity="secondary"
                  size="small"
                />
              </div>
              <div class="ms-auto flex flex-wrap items-center gap-(--spacing-xs)">
                <Button
                  label="Add column"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-plus"
                  @click="openColumn"
                />
                <Button
                  label="Insert row"
                  kind="primary"
                  size="medium"
                  icon="pi pi-plus"
                  @click="openRow"
                />
                <DropdownMenu
                  placement="bottom-end"
                  @select="onTableAction"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip text="Table actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="medium"
                        aria-label="Table actions"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="create"
                      label="Create Table"
                    >
                      <template #left
                        ><i
                          class="pi pi-plus"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="truncate"
                      label="Truncate table"
                    >
                      <template #left
                        ><i
                          class="pi pi-eraser"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Option>
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
              severity="secondary"
              size="medium"
            />
          </template>
          <template #cell-constraints="{ value }">
            <span class="text-body-sm text-(--text-muted)">{{ value || 'None' }}</span>
          </template>
          <template #cell-actions="{ row }">
            <DropdownMenu
              placement="bottom-end"
              @select="(event, value) => onColumnAction(value, row)"
            >
              <DropdownMenu.Trigger>
                <Tooltip text="Column actions">
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    :aria-label="`Actions for ${row.name}`"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="alter"
                  label="Change type"
                >
                  <template #left
                    ><i
                      class="pi pi-pencil"
                      aria-hidden="true"
                  /></template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
            </DropdownMenu>
          </template>
        </TableRoot>
      </template>
    </Card>

    <Drawer
      v-model:open="createOpen"
      size="large"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Table"
            novalidate
            @submit.prevent="submitCreate"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Create Table</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  Define the table name and its columns in {{ DATABASE }}. Use the grip and the
                  arrow keys to reorder columns.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
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
                  title="Columns"
                  hint="The table's schema, created in this order. A primary key is NOT NULL."
                >
                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                      <Button
                        type="button"
                        label="About data types"
                        kind="outlined"
                        size="small"
                        icon="pi pi-external-link"
                        href="https://www.azion.com/en/documentation/"
                        target="_blank"
                      />
                    </div>
                    <ul
                      aria-label="Columns"
                      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
                    >
                      <li
                        v-for="(column, index) in createForm.columns"
                        :key="column.key"
                        :data-column-key="column.key"
                        class="flex min-w-0 flex-col gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-muted) p-(--spacing-xs)"
                      >
                        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                          <button
                            type="button"
                            data-grip
                            :aria-label="`Reorder ${column.name || 'column ' + (index + 1)}. Use the up and down arrow keys.`"
                            aria-keyshortcuts="ArrowUp ArrowDown"
                            class="inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                            @keydown.up.prevent="moveColumnRow(index, -1)"
                            @keydown.down.prevent="moveColumnRow(index, 1)"
                          >
                            <i
                              class="pi pi-bars"
                              aria-hidden="true"
                            />
                          </button>
                          <div class="min-w-0 flex-[1.4_1_8rem]">
                            <Input
                              v-model="column.name"
                              size="large"
                              class="w-full"
                              placeholder="column_name"
                              :aria-label="`Name of column ${index + 1}`"
                              :invalid="!!columnError(column)"
                            />
                          </div>
                          <div class="min-w-0 flex-[1_1_9rem]">
                            <Select
                              v-model="column.type"
                              size="large"
                              class="w-full"
                            >
                              <Select.Trigger :aria-label="`Type of column ${index + 1}`">
                                <template #iconLeft>
                                  <span
                                    class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                                    aria-hidden="true"
                                    >{{ glyphOf(column.type) }}</span
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
                                  <Select.Option
                                    v-for="type in filteredTypes"
                                    :key="type.value"
                                    :value="type.value"
                                  >
                                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                      <span class="font-code text-label-code-sm">{{
                                        type.value
                                      }}</span>
                                      <span class="truncate text-body-xs text-(--text-muted)">{{
                                        type.description
                                      }}</span>
                                    </span>
                                  </Select.Option>
                                </Select.Group>
                              </Select.Content>
                            </Select>
                          </div>
                          <div class="min-w-0 flex-[1_1_7rem]">
                            <Input
                              v-model="column.defaultValue"
                              size="large"
                              class="w-full"
                              placeholder="NULL"
                              :aria-label="`Default value of column ${index + 1}`"
                            />
                          </div>
                          <label
                            class="flex shrink-0 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default)"
                          >
                            <Checkbox
                              v-model="column.primaryKey"
                              binary
                            />
                            Primary
                          </label>
                          <Tooltip text="Remove column">
                            <IconButton
                              icon="pi pi-times"
                              kind="outlined"
                              size="large"
                              :aria-label="`Remove ${column.name || 'column ' + (index + 1)}`"
                              :disabled="createForm.columns.length <= 1"
                              @click="removeColumnRow(index)"
                            />
                          </Tooltip>
                        </div>
                        <HelperText
                          v-if="columnError(column)"
                          kind="invalid"
                          :label="columnError(column)"
                        />
                      </li>
                    </ul>
                    <HelperText
                      v-if="columnsError"
                      kind="invalid"
                      :label="columnsError"
                    />
                    <Button
                      type="button"
                      label="Add column"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-plus"
                      class="w-full"
                      @click="addColumnRow"
                    />
                  </div>
                </SettingsSection>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full justify-end gap-(--spacing-xs)">
                <Button
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  size="medium"
                  :disabled="createSubmitting"
                  @click="createOpen = false"
                />
                <Button
                  type="submit"
                  label="Create Table"
                  kind="primary"
                  size="medium"
                  :loading="createSubmitting"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Drawer
      v-model:open="columnOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Add column"
            novalidate
            @submit.prevent="submitColumn"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Add column</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  The column is added at the end of {{ table?.name }}.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>
            <PanelContent>
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
                          <template #iconLeft>
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
                            <Select.Option
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
                            </Select.Option>
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
            </PanelContent>
            <PanelFooter>
              <div class="flex w-full justify-end gap-(--spacing-xs)">
                <Button
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  size="medium"
                  :disabled="columnSubmitting"
                  @click="columnOpen = false"
                />
                <Button
                  type="submit"
                  label="Add column"
                  kind="primary"
                  size="medium"
                  :loading="columnSubmitting"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Drawer
      v-model:open="rowOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Insert row"
            novalidate
            @submit.prevent="submitRow"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Insert row</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  One field per column of {{ table?.name }}, in the table's own order.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>
            <PanelContent>
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
            </PanelContent>
            <PanelFooter>
              <div class="flex w-full justify-end gap-(--spacing-xs)">
                <Button
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  size="medium"
                  :disabled="rowSubmitting"
                  @click="rowOpen = false"
                />
                <Button
                  type="submit"
                  label="Insert row"
                  kind="primary"
                  size="medium"
                  :loading="rowSubmitting"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <ConfirmDialog
      v-model:open="alterOpen"
      :title="`Change the type of ${alterColumn}`"
      size="large"
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
              <template #iconLeft>
                <span
                  class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                  aria-hidden="true"
                  >{{ glyphOf(alterType) }}</span
                >
              </template>
            </Select.Trigger>
            <Select.Content>
              <Select.Group label="Data types">
                <Select.Option
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
                </Select.Option>
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
          kind="outlined"
          size="medium"
          :disabled="alterSubmitting"
          @click="close"
        />
        <Button
          label="Change type"
          kind="primary"
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
          :line-numbers="false"
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
          kind="outlined"
          size="medium"
          :disabled="truncateSubmitting"
          @click="close"
        />
        <Button
          label="Truncate table"
          kind="danger"
          size="medium"
          :loading="truncateSubmitting"
          :disabled="!canTruncate"
          @click="confirmTruncate"
        />
      </template>
    </ConfirmDialog>

    <Toaster position="bottom-right" />
  </div>
</template>
