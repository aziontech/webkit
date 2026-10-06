<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'

  const open = defineModel('open', { type: Boolean, default: false })

  interface Props {
    title?: string
    description?: string
    submitting?: boolean
    size?: 'small' | 'medium' | 'large'
    saveLabel?: string
    saveDisabled?: boolean
    dismissible?: boolean
    stacked?: boolean
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    submitting: false,
    size: 'medium',
    saveLabel: 'Save',
    saveDisabled: false,
    dismissible: true,
    stacked: false
  })

  defineSlots<{
    default(): unknown
    start(): unknown
  }>()

  const emit = defineEmits<{
    submit: []
  }>()
</script>

<template>
  <Drawer
    v-model:open="open"
    :size="size"
    :dismissible="dismissible"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay :class="stacked ? 'z-1002' : ''" />
      <DrawerContent :class="stacked ? 'z-1003' : ''">
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="title"
          novalidate
          @submit.prevent="emit('submit')"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>{{ title }}</DrawerTitle>
              <p
                v-if="description"
                class="text-body-sm text-(--text-muted)"
              >
                {{ description }}
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ title }}</legend>
              <slot />
            </fieldset>
          </PanelContent>

          <PanelFooter class="flex-wrap justify-between">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <slot name="start" />
            </div>
            <Button
              :label="saveLabel"
              kind="primary"
              size="medium"
              :loading="submitting"
              :disabled="saveDisabled"
              @click="emit('submit')"
            />
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              {{ saveLabel }}
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
