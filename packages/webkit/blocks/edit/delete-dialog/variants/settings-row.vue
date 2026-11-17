<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onScopeDispose, ref, useId, watch } from 'vue'

  import { sampleResourceName } from '../sample'

  const resource = { name: sampleResourceName }

  const open = ref(false)
  const confirmation = ref('')
  const submitting = ref(false)
  const confirmId = useId()
  let deleteTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(deleteTimer))

  const canDelete = computed(() => confirmation.value.trim() === resource.name)
  const confirmLabel = computed(() => `Type ${resource.name} to confirm`)

  watch(open, (isOpen) => {
    if (isOpen) confirmation.value = ''
  })

  const remove = () => {
    if (!canDelete.value || submitting.value) return
    submitting.value = true
    clearTimeout(deleteTimer)
    deleteTimer = setTimeout(() => {
      submitting.value = false
      open.value = false
      toast.success(`${resource.name} was deleted.`, { id: 'delete-resource-result' })
    }, 600)
  }
</script>

<template>
  <div class="layout-boundary flex min-h-0 flex-1 flex-col gap-(--layout-group-gap)">
    <PageHeader
      title="Settings"
      :description="`General settings of ${resource.name}.`"
      size="small"
    />

    <Item variant="outline">
      <Item.Content>
        <Item.Title>Delete resource</Item.Title>
        <Item.Description>
          Permanently removes
          <span class="text-label-code-sm">{{ resource.name }}</span> and all associated settings.
          This cannot be undone.
        </Item.Description>
      </Item.Content>

      <Item.Actions>
        <ConfirmDialog
          v-model:open="open"
          title="Delete resource"
          size="medium"
          confirm-label="Delete resource"
          cancel-label="Cancel"
          :loading="submitting"
          :disabled="!canDelete"
          @confirm="remove"
        >
          <template #trigger>
            <Button
              label="Delete resource"
              variant="danger"
              size="medium"
              icon="az az-trash"
            />
          </template>
          <div class="flex flex-col gap-(--spacing-md)">
            <Alert severity="warning">
              Once confirmed, this action can't be reversed. The resource will be deleted, along
              with all associated settings or instances. Check the
              <a
                href="https://example.com/docs"
                class="text-link"
                >Help Center</a
              >
              for more details.
            </Alert>
            <Field :disabled="submitting">
              <Field.Label :for="confirmId">{{ confirmLabel }}</Field.Label>
              <Input
                :id="confirmId"
                v-model="confirmation"
                autocomplete="off"
                @keydown.enter="remove"
              />
            </Field>
          </div>
        </ConfirmDialog>
      </Item.Actions>
    </Item>
  </div>
</template>
