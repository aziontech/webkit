<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <DialogTrigger>
      <Button
        label="Open dialog"
        kind="primary"
      />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <DialogDescription>
            Modal content. Uses the shared Panel header, body, and footer regions.
          </DialogDescription>
        </PanelContent>
        <PanelFooter>
          <div
            class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
          >
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Cancel"
                kind="outlined"
                @click="open = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Save"
                kind="primary"
              />
            </div>
          </div>
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
