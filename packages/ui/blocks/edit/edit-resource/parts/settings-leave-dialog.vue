<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { UseUnsavedChangesReturn } from '@aziontech/webkit/use-unsaved-changes'

  export interface SettingsLeaveDialogProps {
    /** The leave guard of the page's form. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'dialogProps' | 'labels' | 'savable' | 'keepEditing' | 'discardAndLeave' | 'saveAndLeave'
    >
  }

  defineProps<SettingsLeaveDialogProps>()
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
        :disabled="guard.dialogProps.value.loading"
        @click="guard.keepEditing"
      />
      <Button
        :label="guard.labels.value.discard"
        variant="outline"
        size="medium"
        :disabled="guard.dialogProps.value.loading"
        @click="guard.discardAndLeave"
      />
      <Button
        v-if="guard.savable.value"
        :label="guard.labels.value.save"
        variant="primary"
        size="medium"
        :loading="guard.dialogProps.value.loading"
        @click="guard.saveAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
