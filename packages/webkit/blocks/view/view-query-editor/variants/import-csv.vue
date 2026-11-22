<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { toast } from '@aziontech/webkit/toast'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, onBeforeUnmount, ref } from 'vue'

  import { sampleTablesWithSubscribers } from '../sample'
  import ViewQueryEditor, {
    type QueryEditorColumn,
    type QueryEditorRow,
    type QueryEditorTable
  } from '../view-query-editor.vue'

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

  const tables = ref<QueryEditorTable[]>(
    sampleTablesWithSubscribers.map((table) => ({ ...table, rows: [...table.rows] }))
  )
  const selectedTableId = ref<string | null>('tbl-subscribers')
  const selectedTable = computed(
    () =>
      tables.value.find((table) => table.id === selectedTableId.value) ?? tables.value[0] ?? null
  )
  const setRows = (id: string, rows: QueryEditorRow[]) => {
    tables.value = tables.value.map((table) => (table.id === id ? { ...table, rows } : table))
  }
  const onDeleteRows = (
    _event: Event,
    payload: { table: QueryEditorTable; rows: QueryEditorRow[] }
  ) => {
    const keys = new Set(payload.rows.map((row) => row.__k))
    const table = tables.value.find((item) => item.id === payload.table.id)
    if (table)
      setRows(
        table.id,
        table.rows.filter((row) => !keys.has(row.__k))
      )
  }
  const onDeleteTable = (_event: Event, table: QueryEditorTable) => {
    tables.value = tables.value.filter((item) => item.id !== table.id)
  }

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
  const csvPicker = useFilePicker({ accept: '.csv,text/csv' })
  const importFile = ref<ImportFile | null>(null)
  const importFileError = ref('')
  const importHeaders = ref<string[]>([])
  const importRows = ref<ImportRow[]>([])
  const importMapping = ref<Record<string, string>>({})
  const importSubmitted = ref(false)
  const importing = ref(false)
  let importTimer: ReturnType<typeof setTimeout> | undefined

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
  const pickCsv = async () => onImportFiles(await csvPicker.open())
  const openImport = (files?: FileList | File[] | null) => {
    clearImport()
    importOpen.value = true
    if (files?.length) onImportFiles(files)
  }
  const onImportCsv = (event: Event) =>
    openImport(event instanceof DragEvent ? event.dataTransfer?.files : null)
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
      .filter((column): column is QueryEditorColumn => Boolean(column))
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
    const inserted: QueryEditorRow[] = validRows.value.map((row, index) => ({
      ...Object.fromEntries(table.columns.map((column) => [column.name, null])),
      ...row.values,
      __k: `import-${row.line}-${index}`
    }))
    const skipped = failedRows.value.length
    const snapshot = table.rows
    importing.value = true
    clearTimeout(importTimer)
    importTimer = setTimeout(() => {
      importing.value = false
      setRows(table.id, [...table.rows, ...inserted])
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
              onClick: () => setRows(table.id, snapshot)
            }
          ]
        }
      )
    }, 900)
  }
  onBeforeUnmount(() => {
    clearTimeout(importTimer)
    toast.dismiss('query-editor-rows')
  })
  readCsv(CSV_ON_START.file, CSV_ON_START.text)
</script>

<template>
  <ViewQueryEditor
    v-model:table="selectedTableId"
    :tables="tables"
    @import-csv="onImportCsv"
    @delete-rows="onDeleteRows"
    @delete-table="onDeleteTable"
  />

  <Drawer
    v-model:open="importOpen"
    size="large"
    side="end"
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

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="importing"
          >
            <legend class="sr-only">Import data from CSV</legend>
            <SettingsGroup
              label="File"
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
                    variant="secondary"
                    size="medium"
                    @click="pickCsv"
                  />
                </FileDropzone>
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
            </SettingsGroup>

            <template v-if="importRows.length">
              <SettingsGroup
                label="Map columns"
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
                        <span class="truncate font-code text-label-code-sm text-(--text-default)">{{
                          header
                        }}</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >e.g. {{ importRows[0].cells[header] || 'empty' }}</span
                        >
                      </span>
                      <i
                        class="az az-arrow-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
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
                            <Select.Item :value="SKIP">Skip</Select.Item>
                            <Select.Group :label="`Columns of ${selectedTable?.name}`">
                              <Select.Item
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
                              </Select.Item>
                            </Select.Group>
                          </Select.Content>
                        </Select>
                      </div>
                    </li>
                  </ul>
                </div>
              </SettingsGroup>

              <SettingsGroup
                label="Check rows"
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
                        class="az az-circle-x mt-(--spacing-2xs) shrink-0 text-(--danger-foreground)"
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
              </SettingsGroup>
            </template>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
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
              variant="primary"
              size="medium"
              :loading="importing"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
