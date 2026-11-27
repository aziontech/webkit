<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import type { UseUnsavedChangesReturn } from '@aziontech/ui/use-unsaved-changes'
  import { computed } from 'vue'

  export interface TicketDiscardDialogProps {
    /** The unsaved-changes guard of the form this dialog asks about. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
  }

  const props = defineProps<TicketDiscardDialogProps>()

  const dialogProps = computed(() => props.guard.dialogProps.value)
  const labels = computed(() => props.guard.labels.value)
</script>

<template>
  <ConfirmDialog
    v-bind="dialogProps"
    data-testid="unsaved-changes-dialog"
  >
    <template #actions>
      <Button
        :label="labels.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="labels.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
