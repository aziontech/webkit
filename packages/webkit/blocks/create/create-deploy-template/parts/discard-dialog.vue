<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { UseUnsavedChangesReturn } from '@aziontech/webkit/use-unsaved-changes'

  export interface DiscardDialogProps {
    /** The unsaved-changes guard whose leave dialog this renders. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
  }

  defineProps<DiscardDialogProps>()
</script>

<template>
  <ConfirmDialog v-bind="guard.dialogProps.value">
    <template #actions>
      <Button
        :label="guard.labels.value.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="guard.labels.value.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
