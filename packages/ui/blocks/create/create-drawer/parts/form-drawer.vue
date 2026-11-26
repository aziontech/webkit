<script setup lang="ts">
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { useShortcuts } from '@aziontech/ui/use-shortcuts'
  import { focusFirstInvalid } from '@aziontech/ui/utils/focus-invalid'
  import { ref } from 'vue'

  import SubmitButton from './submit-button.vue'

  export interface FormDrawerProps {
    /** Whether the drawer is open. */
    open: boolean
    /** Drawer title, form name and fieldset legend. */
    title: string
    /** Muted line under the title. */
    description?: string
    /** Footer button label; empty uses the title. */
    submitLabel?: string
    /** Name of the Cmd+Enter shortcut in the shortcut list. */
    shortcutLabel: string
    /** The save is in flight: the fieldset locks and the button spins. */
    busy?: boolean
    /** Drawer size: large over a page, medium over another drawer. */
    size?: 'medium' | 'large'
    /** Spaces the sections of the fieldset by the section gap. */
    spaced?: boolean
  }

  const props = withDefaults(defineProps<FormDrawerProps>(), {
    description: '',
    submitLabel: '',
    busy: false,
    size: 'large',
    spaced: false
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: [event: Event]
  }>()

  defineSlots<{
    /** The trigger, wrapped in DrawerTrigger by the caller when the drawer opens itself. */
    trigger(): unknown
    /** The sections of the form. */
    default(): unknown
    /** Content between the body and the footer, such as a save error. */
    alert(): unknown
    /** Replaces the footer row with the submit button. */
    footer(): unknown
  }>()

  const FIELDSET_CLASS = 'm-0 flex min-w-0 flex-col border-0 p-0'
  const SPACED_FIELDSET_CLASS = 'm-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0'

  const formEl = ref<HTMLFormElement | null>(null)

  const onSubmit = (event: Event) => {
    emit('submit', event)
    focusFirstInvalid(formEl.value)
  }

  useShortcuts({
    keys: 'meta+enter',
    label: () => props.shortcutLabel,
    group: 'Drawer',
    element: formEl,
    when: () => props.open && !props.busy,
    handler: () => formEl.value?.requestSubmit()
  })
</script>

<template>
  <Drawer
    :open="open"
    :size="size"
    side="end"
    @update:open="(value: boolean) => emit('update:open', value)"
  >
    <slot name="trigger" />
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="onSubmit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">{{ description }}</p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            :class="spaced ? SPACED_FIELDSET_CLASS : FIELDSET_CLASS"
            :disabled="busy"
          >
            <legend class="sr-only">{{ title }}</legend>
            <slot />
          </fieldset>
        </PanelBody>

        <slot name="alert" />

        <PanelFooter>
          <slot name="footer">
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <SubmitButton :loading="busy">{{ submitLabel || title }}</SubmitButton>
            </div>
          </slot>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
