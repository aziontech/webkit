<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import CodeEditor from '@aziontech/ui/code-editor'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'

  import type { SchemaEditorTable } from '../edit-schema.vue'

  defineProps<{ table: SchemaEditorTable | undefined; submitting: boolean }>()

  const emit = defineEmits<{
    confirm: [event: Event]
  }>()

  const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    :title="`Truncate ${table?.name ?? ''}`"
    size="medium"
    confirm-label="Truncate table"
    :confirmation-phrase="table?.name ?? ''"
    :loading="submitting"
    @confirm="emit('confirm', $event)"
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
    </div>
  </ConfirmDialog>
</template>
