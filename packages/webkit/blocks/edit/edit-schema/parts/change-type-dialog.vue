<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import { computed } from 'vue'

  import type { SchemaEditorColumn, SchemaEditorTable } from '../edit-schema.vue'
  import ColumnTypeSelect from './column-type-select.vue'

  const props = defineProps<{
    table: SchemaEditorTable | undefined
    column: string
    current: SchemaEditorColumn | undefined
    submitting: boolean
  }>()

  const emit = defineEmits<{
    confirm: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { required: true })
  const type = defineModel<string>('type', { required: true })

  const sql = computed(() => {
    if (!props.table || !props.current) return ''
    const name = props.table.name
    const columns = props.table.columns.map((column) =>
      column.name === props.column
        ? `${column.name} ${type.value}`
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
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    :title="`Change the type of ${column}`"
    size="medium"
  >
    <div class="flex flex-col gap-(--spacing-md)">
      <Alert
        severity="warning"
        label="Changing a type rebuilds the table and copies every row. It can't be undone, and values that don't fit the new type make it fail."
      />
      <Field>
        <Field.Label>New type</Field.Label>
        <ColumnTypeSelect v-model:type="type" />
        <Field.Description
          >Currently {{ current?.type }}. Review the statements that will run.</Field.Description
        >
      </Field>
      <CodeEditor
        :model-value="sql"
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
        :disabled="submitting"
        @click="close"
      />
      <Button
        label="Change type"
        variant="primary"
        size="medium"
        :loading="submitting"
        :disabled="type === current?.type"
        @click="emit('confirm', $event)"
      />
    </template>
  </ConfirmDialog>
</template>
