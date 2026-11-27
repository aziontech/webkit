<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelHeader from '@aziontech/ui/panel-header'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import { computed, reactive, ref, watch } from 'vue'

  import { useCsvImport } from '../composables/use-csv-import'
  import type {
    SchemaEditorColumn,
    SchemaEditorCsv,
    SchemaEditorNewTable,
    SchemaEditorRelation,
    SchemaEditorTable
  } from '../edit-schema.vue'
  import { inferType } from '../lib/csv'
  import {
    createDraftIds,
    duplicateNamesOf,
    relationErrorOf,
    relationIncomplete,
    tableNameProblem
  } from '../lib/draft-table'
  import CreateTableColumns from './create-table-columns.vue'
  import CreateTableRelations from './create-table-relations.vue'
  import CsvImport from './csv-import.vue'
  import DrawerFormFooter from './drawer-form-footer.vue'

  const props = defineProps<{
    database: string
    tables: SchemaEditorTable[]
    submitting: boolean
    defaultDraft: { name?: string; relations?: SchemaEditorRelation[] }
    defaultCsv: SchemaEditorCsv | undefined
    defaultSubmitted: boolean
  }>()

  const emit = defineEmits<{
    submit: [event: Event, table: SchemaEditorNewTable]
  }>()

  const open = defineModel<boolean>('open', { required: true })
  const serverError = defineModel<string>('serverError', { required: true })
  const typeQuery = defineModel<string>('typeQuery', { required: true })

  const { newColumn, newRelation, blankTable } = createDraftIds()

  const createForm = reactive(blankTable())
  if (props.defaultDraft.name !== undefined) createForm.name = props.defaultDraft.name
  if (props.defaultDraft.relations)
    createForm.relations = props.defaultDraft.relations.map((relation) => ({ ...relation }))
  const createSubmitted = ref(props.defaultSubmitted)

  const csv = useCsvImport((file, headers, rows) => {
    createForm.columns = headers.map((header) =>
      newColumn(
        header,
        inferType(rows.map((row) => row[header] ?? '')),
        header.toLowerCase() === 'id'
      )
    )
    if (!createForm.name.trim()) createForm.name = file.name.replace(/\.csv$/i, '')
  })

  const namedColumns = computed(() => createForm.columns.filter((column) => column.name.trim()))
  const duplicateNames = computed(() => duplicateNamesOf(namedColumns.value))
  const tableNameError = computed(() => {
    if (serverError.value) return serverError.value
    if (!createSubmitted.value) return ''
    return tableNameProblem(createForm.name)
  })
  const columnError = (name: string) =>
    createSubmitted.value && duplicateNames.value.has(name.trim().toLowerCase())
      ? `Another column is also named ${name.trim()}.`
      : ''
  const columnsError = computed(() =>
    createSubmitted.value && !namedColumns.value.length ? 'Add at least one named column.' : ''
  )
  const columnErrors = computed(() =>
    createForm.columns.map((column) => {
      const message = columnError(column.name)
      return message ? { name: message } : undefined
    })
  )
  const relationErrors = computed(() =>
    createForm.relations.map((relation) =>
      createSubmitted.value ? relationErrorOf(relation) : undefined
    )
  )

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(createForm, blankTable())
    createSubmitted.value = false
    serverError.value = ''
    csv.clear()
  })

  if (props.defaultCsv) csv.apply(props.defaultCsv.file, props.defaultCsv.text)

  const submit = (event: Event) => {
    createSubmitted.value = true
    serverError.value = ''
    if (props.submitting) return
    if (
      tableNameError.value ||
      columnsError.value ||
      duplicateNames.value.size ||
      createForm.relations.some(relationIncomplete) ||
      csv.error.value
    )
      return
    const columns = namedColumns.value.map((column): SchemaEditorColumn => ({
      name: column.name.trim(),
      type: column.type,
      primaryKey: column.primaryKey,
      notNull: column.primaryKey,
      defaultValue: column.defaultValue.trim()
    }))
    emit('submit', event, {
      name: createForm.name.trim(),
      columns,
      relations: createForm.relations.map((relation) => ({ ...relation })),
      rows: csv.rows.value.map((row) => ({ ...row }))
    })
  }

  defineExpose({ submit })
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Create table"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Create table</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Define the table name and its columns in {{ database }}, or start from a CSV file.
              Drag a column's grip, or focus it and use the arrow keys, to reorder.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create table</legend>
            <SettingsGroup
              label="General"
              hint="Names the table inside this database."
            >
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                <Alert
                  v-if="serverError"
                  severity="danger"
                  :label="`The table wasn't created. ${serverError} Your columns are kept; pick another name and create it again.`"
                />
                <Field :invalid="!!tableNameError">
                  <Field.Label>Name</Field.Label>
                  <Input
                    v-model="createForm.name"
                    size="large"
                    class="w-full"
                    placeholder="users"
                    autocomplete="off"
                    @update:model-value="serverError = ''"
                  />
                  <Field.Description
                    >Every query addresses it, so it cannot be changed later without rewriting
                    them.</Field.Description
                  >
                  <Field.Error v-if="tableNameError">{{ tableNameError }}</Field.Error>
                </Field>
              </div>
            </SettingsGroup>

            <CsvImport
              :file="csv.file.value"
              :tokens="csv.tokens.value"
              :headers="csv.headers.value"
              :rows="csv.rows.value"
              @files="csv.onFiles"
              @pick="csv.pick"
              @remove="csv.clear"
            />

            <CreateTableColumns
              v-model:columns="createForm.columns"
              v-model:query="typeQuery"
              :errors="columnErrors"
              :error="columnsError"
              :disabled="submitting"
              :new-item="newColumn"
            />

            <CreateTableRelations
              v-model:relations="createForm.relations"
              :tables="tables"
              :columns="namedColumns"
              :errors="relationErrors"
              :disabled="submitting"
              :new-item="newRelation"
            />
          </fieldset>
        </PanelBody>

        <DrawerFormFooter
          submit-label="Create table"
          :submitting="submitting"
          @cancel="open = false"
        />
      </form>
    </DrawerContent>
  </Drawer>
</template>
