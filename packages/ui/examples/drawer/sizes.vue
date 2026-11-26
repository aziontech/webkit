<script setup>
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import DrawerTrigger from '@aziontech/ui/drawer-trigger'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { reactive, watch } from 'vue'

  const sizes = ['small', 'medium', 'large']
  const sizeLabels = {
    small: 'Small (408px)',
    medium: 'Medium (30%)',
    large: 'Large (40%)'
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
      side="end"
    >
      <DrawerTrigger>
        <Button
          :label="sizeLabels[size]"
          variant="primary"
        />
      </DrawerTrigger>
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>{{ sizeLabels[size] }}</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <DrawerDescription>
            Panel max-width preset for the {{ size }} drawer. Height is always 100% viewport.
          </DrawerDescription>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <Button
              label="Cancel"
              variant="outline"
              @click="openBySize[size] = false"
            />
            <Button
              label="Save"
              variant="primary"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
