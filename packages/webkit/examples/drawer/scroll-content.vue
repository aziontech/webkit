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
  const scrollSections = Array.from({ length: 12 }, (_, index) => ({
    title: `Section ${index + 1}`,
    body: `Scrollable drawer body copy for section ${index + 1}. Only PanelContent scrolls; header and footer stay in the panel layout.`
  }))
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
        label="Open scrollable drawer"
        kind="primary"
      />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Scrollable drawer</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent class="flex flex-col gap-(--spacing-4)">
          <DrawerDescription>
            Place long forms, lists, or settings inside PanelContent. Only the body scrolls inside
            ScrollArea while header and footer stay in the panel layout.
          </DrawerDescription>
          <section
            v-for="section in scrollSections"
            :key="section.title"
            class="flex flex-col gap-(--spacing-2) rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) p-(--spacing-4)"
          >
            <h3 class="m-0 text-body-md text-(--text-default)">{{ section.title }}</h3>
            <p class="m-0 text-body-sm text-(--text-muted)">{{ section.body }}</p>
          </section>
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="outlined"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            label="Save"
            kind="primary"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
