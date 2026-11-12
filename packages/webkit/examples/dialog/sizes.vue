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
  import { reactive, watch } from 'vue'

  const sizes = ['small', 'medium', 'large']
  const sizeLabels = { small: 'Small', medium: 'Medium', large: 'Large' }
  const openBySize = reactive({ small: false, medium: false, large: false })

  watch(
    openBySize,
    () => {
      const openKey = sizes.find((key) => openBySize[key])
      if (!openKey) return
      sizes.forEach((key) => {
        if (key !== openKey) openBySize[key] = false
      })
    },
    { deep: true }
  )
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <Dialog
      v-for="size in sizes"
      :key="size"
      v-model:open="openBySize[size]"
      :size="size"
    >
      <DialogTrigger>
        <Button
          :label="sizeLabels[size]"
          kind="outlined"
        />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>{{ sizeLabels[size] }}</DialogTitle>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
            <DialogDescription>
              Panel max-width preset for the {{ size }} dialog, applied from the md breakpoint up.
            </DialogDescription>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
              <Button
                label="Close"
                kind="outlined"
                @click="openBySize[size] = false"
              />
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </div>
</template>
