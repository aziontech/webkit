<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import Link from '@aziontech/ui/link'
  import { toast } from '@aziontech/ui/toast'
  import { computed, watch } from 'vue'

  import { sampleResourceName } from './delete-dialog.sample'

  export interface DeleteDialogProps {
    /** The name of the resource to delete; the user types it to confirm. Left out, the sample renders. */
    name?: string
    /** The delete request is in flight: the dialog locks and Delete spins; when it ends with no error the dialog closes. */
    loading?: boolean
    /** Why the delete was refused, shown in a danger alert in place of the warning; the dialog stays open. */
    error?: string
    /** Whether the dialog starts open when open is not bound. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<DeleteDialogProps>(), {
    name: '',
    loading: false,
    error: '',
    defaultOpen: false
  })

  const emit = defineEmits<{
    delete: [event: Event, name: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })
  if (props.defaultOpen) open.value = true

  const name = computed(() => props.name || sampleResourceName)
  const deleting = computed(() => props.loading)
  const deleteError = computed(() => props.error)

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now || props.error || !open.value) return
      open.value = false
      toast.success(`${name.value} was deleted.`, { id: 'delete-resource-result' })
    }
  )

  const confirm = (event: Event) => {
    if (deleting.value) return
    emit('delete', event, name.value)
  }
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Delete resource"
    size="medium"
    confirm-label="Delete resource"
    cancel-label="Cancel"
    :loading="deleting"
    :confirmation-phrase="name"
    @confirm="confirm"
  >
    <template #trigger>
      <Button
        label="Delete resource"
        variant="danger"
        size="medium"
      />
    </template>
    <div class="flex flex-col gap-(--spacing-md)">
      <Alert
        v-if="deleteError"
        key="delete-error"
        severity="danger"
        :label="deleteError"
      />
      <Alert
        v-else
        key="delete-warning"
        severity="warning"
        label="Once confirmed, this action can't be reversed."
      />
      <p class="m-0 text-body-sm text-(--text-muted)">
        The selected resource will be deleted, along with all associated settings or instances.
        Check the
        <Link
          href="https://example.com/docs"
          inline
          >Help Center</Link
        >
        for more details.
      </p>
    </div>
  </ConfirmDialog>
</template>
