<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import FieldText from '@aziontech/webkit/field-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, watch } from 'vue'

  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'

  const application = { name: 'webkit-storybook-dev' }

  const open = ref(false)
  const confirmation = ref('')
  const submitting = ref(false)

  const canDelete = computed(() => confirmation.value.trim() === application.name)
  const confirmLabel = computed(() => `To confirm, type "${application.name}" in the box below:`)

  watch(open, (isOpen) => {
    if (!isOpen) confirmation.value = ''
  })

  const remove = async () => {
    if (!canDelete.value || submitting.value) return
    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toastDeleted()
      open.value = false
    } catch (error) {
      toastFailed(error)
    } finally {
      submitting.value = false
    }
  }

  const toastDeleted = () => toast.success(`Application "${application.name}" deleted.`)
  const toastFailed = (error) =>
    toast.error('Could not delete the application.', {
      description: error?.message ?? 'Check your connection and try again.',
      action: { label: 'Retry', onClick: () => remove() }
    })
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Dialog form' }]"
  >
    <main class="flex h-full flex-col">
      <PageHeading
        title="Dialog form"
        description="A short, blocking decision in a modal. This destructive delete stays disabled until the exact application name is typed."
      />

      <Item
        kind="outline"
        class="layout-section-start"
      >
        <Item.Content>
          <Item.Title>Delete this Application</Item.Title>
          <Item.Description>
            Permanently removes
            <span class="text-label-code-sm">{{ application.name }}</span> and all associated
            settings. This cannot be undone.
          </Item.Description>
        </Item.Content>

        <Item.Actions class="justify-end">
          <Dialog
            v-model:open="open"
            size="medium"
          >
            <DialogTrigger>
              <Button
                label="Delete Application"
                kind="danger"
                size="medium"
                icon="pi pi-trash"
              />
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <PanelHeader class="w-full">
                  <DialogTitle>Delete Application</DialogTitle>
                  <DialogClose />
                </PanelHeader>

                <PanelContent class="flex flex-col gap-(--spacing-md)">
                  <Message
                    severity="warning"
                    label="Once confirmed, this action can't be reversed. The selected Application will be deleted, along with all associated settings or instances. Check the Help Center for more details."
                  />
                  <FieldText
                    v-model="confirmation"
                    input-id="confirm-delete"
                    :label="confirmLabel"
                    :disabled="submitting"
                  />
                </PanelContent>

                <PanelFooter class="flex-col md:flex-row md:justify-end">
                  <Button
                    class="w-full md:w-auto"
                    type="button"
                    label="Cancel"
                    kind="outlined"
                    size="medium"
                    :disabled="submitting"
                    @click="open = false"
                  />
                  <Button
                    class="w-full md:w-auto"
                    label="Delete"
                    kind="danger"
                    size="medium"
                    :disabled="!canDelete"
                    :loading="submitting"
                    @click="remove"
                  />
                </PanelFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </Item.Actions>
      </Item>
    </main>
  </AppLayout>
</template>
