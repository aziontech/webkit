<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Input from '@aziontech/webkit/input'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, useId, watch } from 'vue'

  import { sampleResourceName } from './sample'

  export interface DeleteDialogProps {
    /** The name of the resource to delete; the user types it to confirm. Left out, the sample renders. */
    name?: string
    /** The delete request is in flight: the dialog locks and Delete spins; when it ends with no error the dialog closes. */
    loading?: boolean
    /** Why the delete was refused, shown in a danger alert in place of the warning; the dialog stays open. */
    error?: string
    /** The text the confirmation input opens with. */
    defaultConfirmation?: string
    /** Whether the dialog starts open when open is not bound. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<DeleteDialogProps>(), {
    name: '',
    loading: false,
    error: '',
    defaultConfirmation: '',
    defaultOpen: false
  })

  const emit = defineEmits<{
    delete: [event: Event, name: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })
  if (props.defaultOpen) open.value = true

  const name = computed(() => props.name || sampleResourceName)
  const confirmation = ref(props.defaultConfirmation)
  const deleting = computed(() => props.loading)
  const deleteError = computed(() => props.error)
  const confirmLabelId = useId()

  const canDelete = computed(
    () => confirmation.value.trim().length > 0 && confirmation.value.trim() === name.value
  )

  watch(open, (isOpen) => {
    if (isOpen) confirmation.value = ''
  })

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now || props.error || !open.value) return
      open.value = false
      toast.success(`${name.value} was deleted.`, { id: 'delete-resource-result' })
    }
  )

  const confirm = (event: Event) => {
    if (!canDelete.value || deleting.value) return
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
    :disabled="!canDelete"
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
        <a
          href="https://example.com/docs"
          class="text-link"
          >Help Center</a
        >
        for more details.
      </p>
      <p
        :id="confirmLabelId"
        class="m-0 flex flex-wrap items-center gap-(--spacing-2xs) text-body-sm text-(--text-default)"
      >
        <span>Type</span>
        <span class="text-label-code-sm text-(--text-default)">{{ name }}</span>
        <CopyButton
          :value="name"
          :aria-label="`Copy ${name}`"
          copied-label="Copied"
          size="small"
        />
        <span>to confirm.</span>
      </p>
      <Input
        v-model="confirmation"
        :aria-labelledby="confirmLabelId"
        autocomplete="off"
        class="w-full"
        :disabled="deleting"
        @keydown.enter="confirm"
      />
    </div>
  </ConfirmDialog>
</template>
