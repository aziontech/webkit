<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import type { UseUnsavedChangesReturn } from '@aziontech/ui/use-unsaved-changes'

  export interface TeamLeaveDialogProps {
    /** The guard whose leave dialog this renders. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
  }

  defineProps<TeamLeaveDialogProps>()
</script>

<template>
  <ConfirmDialog
    v-bind="guard.dialogProps.value"
    data-testid="unsaved-changes-dialog"
  >
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
