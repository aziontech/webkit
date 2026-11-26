<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'

  export interface DeployDrawerProps {
    /** The drawer title. */
    title: string
  }

  defineProps<DeployDrawerProps>()

  const open = defineModel<boolean>('open', { required: true })

  const emit = defineEmits<{
    deploy: [event: MouseEvent]
  }>()

  defineSlots<{
    description(): unknown
    default(): unknown
  }>()
</script>

<template>
  <Drawer
    v-model:open="open"
    side="end"
    size="large"
  >
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>{{ title }}</DrawerTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DrawerDescription>
            <slot name="description" />
          </DrawerDescription>
          <slot />
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Deploy"
            variant="primary"
            icon="az az-cloud-upload"
            @click="(event: MouseEvent) => emit('deploy', event)"
          />
        </div>
      </PanelFooter>
    </DrawerContent>
  </Drawer>
</template>
