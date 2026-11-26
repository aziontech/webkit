<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import Item from '@aziontech/ui/item'
  import Link from '@aziontech/ui/link'
  import PageHeader from '@aziontech/ui/page-header'
  import { toast } from '@aziontech/ui/toast'
  import { onScopeDispose, ref } from 'vue'

  import { sampleResourceName } from '../sample'

  const resource = { name: sampleResourceName }

  const open = ref(false)
  const submitting = ref(false)
  let deleteTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(deleteTimer))

  const remove = () => {
    if (submitting.value) return
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
        <p
          data-slot="item-description"
          class="text-balance text-body-sm text-(--text-muted)"
        >
          Permanently removes
          <span class="text-label-code-sm">{{ resource.name }}</span> and all associated settings.
          This cannot be undone.
        </p>
      </Item.Content>

      <Item.Actions>
        <ConfirmDialog
          v-model:open="open"
          title="Delete resource"
          size="medium"
          confirm-label="Delete resource"
          cancel-label="Cancel"
          :loading="submitting"
          :confirmation-phrase="resource.name"
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
              <Link
                href="https://example.com/docs"
                inline
                >Help Center</Link
              >
              for more details.
            </Alert>
          </div>
        </ConfirmDialog>
      </Item.Actions>
    </Item>
  </div>
</template>
