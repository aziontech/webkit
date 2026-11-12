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
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    dismissible
    side="right"
    size="medium"
  >
    <DrawerTrigger>
      <Button
        label="Open drawer"
        kind="primary"
      />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <DrawerDescription>
            Side panel content. Uses the same Panel header, body, and footer regions as Dialog.
          </DrawerDescription>
        </PanelContent>
        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <Button
              label="Cancel"
              kind="outlined"
              @click="open = false"
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
</template>
