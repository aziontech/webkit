<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'

  import type { FileRow } from '../lib/file-rows'

  defineProps<{ pending: FileRow | null }>()

  const emit = defineEmits<{
    confirm: [event: Event]
  }>()

  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    :title="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
    size="medium"
    :confirm-label="pending?.kind === 'folder' ? 'Delete folder' : 'Delete file'"
    :confirmation-phrase="pending?.name ?? ''"
    @confirm="(event: Event) => emit('confirm', event)"
  >
    <div class="flex flex-col gap-(--spacing-md)">
      <Alert
        severity="warning"
        label="Once confirmed, this action can't be reversed."
      />
      <p class="m-0 text-body-sm text-(--text-muted)">
        {{
          pending?.kind === 'folder'
            ? 'The selected folder will be deleted, along with all its files.'
            : 'The selected file will be deleted.'
        }}
      </p>
    </div>
  </ConfirmDialog>
</template>
