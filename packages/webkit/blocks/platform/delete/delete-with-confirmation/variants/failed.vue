<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Input from '@aziontech/webkit/input'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onScopeDispose, ref, useId, watch } from 'vue'

  const name = 'resource-01'
  const inUseError = `${name} is still used by 2 workloads. Remove it from them and try again.`
  const failing = true

  const open = ref(true)
  const confirmation = ref(name)
  const deleting = ref(false)
  const deleteError = ref(inUseError)
  const confirmLabelId = useId()
  let deleteTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(deleteTimer))

  const canDelete = computed(
    () => confirmation.value.trim().length > 0 && confirmation.value.trim() === name
  )

  watch(open, (isOpen) => {
    if (!isOpen) return
    confirmation.value = ''
    deleteError.value = ''
  })

  const confirm = () => {
    if (!canDelete.value || deleting.value) return
    deleting.value = true
    deleteError.value = ''
    clearTimeout(deleteTimer)
    deleteTimer = setTimeout(() => {
      deleting.value = false
      if (failing) {
        deleteError.value = inUseError
        return
      }
      open.value = false
      toast.success(`${name} was deleted.`, { id: 'delete-resource-result' })
    }, 600)
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
        kind="danger"
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
