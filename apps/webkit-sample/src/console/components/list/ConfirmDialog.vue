<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'

  interface Props {
    title?: string
    description?: string
    confirmLabel?: string
    confirmKind?: 'primary' | 'danger'
  }

  withDefaults(defineProps<Props>(), {
    title: 'Confirm',
    description: '',
    confirmLabel: 'Confirm',
    confirmKind: 'danger'
  })

  const emit = defineEmits<{
    confirm: []
  }>()

  const open = defineModel('open', { type: Boolean, default: false })

  const confirm = () => {
    open.value = false
    emit('confirm')
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="small"
    data-testid="confirm-dialog"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <PanelContent>
          <DialogDescription class="m-0 text-body-sm text-(--text-muted)">
            {{ description }}
          </DialogDescription>
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="text"
            size="medium"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            :label="confirmLabel"
            :kind="confirmKind"
            size="medium"
            data-testid="confirm-dialog__confirm"
            @click="confirm"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
