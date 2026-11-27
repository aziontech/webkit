<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'

  export interface RecordDrawerProps {
    /** The drawer title, Add or Edit and the record kind. */
    title: string
    /** One sentence under the title. */
    description: string
    /** The label of the submit button. */
    submitLabel: string
  }

  defineProps<RecordDrawerProps>()

  const emit = defineEmits<{
    submit: []
  }>()

  defineSlots<{
    /** The settings groups of the record. */
    default(): unknown
  }>()

  const drawerOpen = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Drawer
    v-model:open="drawerOpen"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="emit('submit')"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
            <DrawerDescription>
              {{ description }}
            </DrawerDescription>
          </div>
        </PanelHeader>
        <PanelBody>
          <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
            <legend class="sr-only">{{ title }}</legend>
            <slot />
          </fieldset>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              size="medium"
              @click="drawerOpen = false"
            />
            <Button
              type="submit"
              :label="submitLabel"
              variant="primary"
              size="medium"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
