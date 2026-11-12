<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { computed, ref, watch } from 'vue'

  const resource = { name: 'resource-01' }

  const open = ref(false)
  const confirmation = ref('')
  const submitting = ref(false)

  const canDelete = computed(() => confirmation.value.trim() === resource.name)
  const confirmLabel = computed(() => `Type ${resource.name} to confirm`)

  watch(open, (isOpen) => {
    if (isOpen) confirmation.value = ''
  })

  const remove = () => {
    if (!canDelete.value || submitting.value) return
    open.value = false
  }
</script>

<template>
  <div class="layout-boundary flex min-h-0 flex-1 flex-col">
    <PageHeader
      title="Dialog form"
      description="A short, blocking decision in a modal. This destructive delete stays disabled until the exact resource name is typed."
      size="small"
    />

    <Item kind="outlined">
      <Item.Content>
        <Item.Title>Delete this resource</Item.Title>
        <Item.Description>
          Permanently removes
          <span class="text-label-code-sm">{{ resource.name }}</span> and all associated settings.
          This cannot be undone.
        </Item.Description>
      </Item.Content>

      <Item.Actions>
        <Dialog
          v-model:open="open"
          size="medium"
        >
          <DialogTrigger>
            <Button
              label="Delete resource"
              kind="danger"
              size="medium"
              icon="pi pi-trash"
            />
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <PanelHeader class="w-full">
                <DialogTitle>Delete resource</DialogTitle>
                <DialogClose />
              </PanelHeader>

              <PanelContent>
                <div class="flex flex-col gap-(--spacing-md)">
                  <Alert
                    severity="warning"
                    label="Once confirmed, this action can't be reversed. The selected resource will be deleted, along with all associated settings or instances. Check the Help Center for more details."
                  />
                  <Field :disabled="submitting">
                    <Field.Label>{{ confirmLabel }}</Field.Label>
                    <Input v-model="confirmation" />
                  </Field>
                </div>
              </PanelContent>

              <PanelFooter>
                <div
                  class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
                >
                  <div class="w-full md:w-fit">
                    <Button
                      class="w-full"
                      type="button"
                      label="Cancel"
                      kind="outlined"
                      size="medium"
                      :disabled="submitting"
                      @click="open = false"
                    />
                  </div>
                  <div class="w-full md:w-fit">
                    <Button
                      class="w-full"
                      label="Delete resource"
                      kind="danger"
                      size="medium"
                      :disabled="!canDelete"
                      :loading="submitting"
                      @click="remove"
                    />
                  </div>
                </div>
              </PanelFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </Item.Actions>
    </Item>
  </div>
</template>
