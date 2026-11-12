<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { reactive, watch } from 'vue'

  const sizes = ['small', 'medium', 'large']
  const sizeLabels = {
    small: 'Small (384px)',
    medium: 'Medium (672px)',
    large: 'Large (1024px)'
  }
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
  <div class="flex flex-wrap items-center justify-center gap-(--spacing-4)">
    <Drawer
      v-for="size in sizes"
      :key="size"
      :size="size"
      v-model:open="openBySize[size]"
      dismissible
      side="right"
    >
      <DrawerTrigger>
        <Button
          :label="sizeLabels[size]"
          kind="primary"
        />
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <DrawerTitle>{{ sizeLabels[size] }}</DrawerTitle>
            <DrawerClose />
          </PanelHeader>
          <PanelContent>
            <DrawerDescription>
              Panel max-width preset for the {{ size }} drawer. Height is always 100% viewport.
            </DrawerDescription>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
              <Button
                label="Cancel"
                kind="outlined"
                @click="openBySize[size] = false"
              />
              <Button
                label="Save"
                kind="primary"
              />
            </div>
          </PanelFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
