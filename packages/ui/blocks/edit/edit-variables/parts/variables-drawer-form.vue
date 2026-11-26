<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Kbd from '@aziontech/ui/kbd'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/ui/use-shortcuts'
  import { ref } from 'vue'

  export interface VariablesDrawerFormProps {
    /** The drawer title, also the name of the form. */
    title: string
    /** The sentence under the title. */
    description: string
    /** What the Command Enter shortcut does, as the shortcut list names it. */
    shortcutLabel: string
    /** The drawer is open: the shortcut submits the form. */
    active?: boolean
    /** The save is in flight: the fields lock and Save spins. */
    submitting?: boolean
    /** Why the save failed, in a danger alert above the sections. */
    saveError?: string
  }

  const props = withDefaults(defineProps<VariablesDrawerFormProps>(), {
    active: false,
    submitting: false,
    saveError: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, form: HTMLFormElement | null]
  }>()

  defineSlots<{
    /** The sections of the form. */
    default(): unknown
  }>()

  const formEl = ref<HTMLFormElement | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: props.shortcutLabel,
    group: 'Drawer',
    element: formEl,
    when: () => props.active && !props.submitting,
    handler: () => formEl.value?.requestSubmit()
  })
</script>

<template>
  <DrawerContent>
    <form
      ref="formEl"
      class="flex min-h-0 flex-1 flex-col"
      :aria-label="title"
      novalidate
      @submit.prevent="(event) => emit('submit', event, formEl)"
    >
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DrawerTitle>{{ title }}</DrawerTitle>
          <p class="text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </div>
      </PanelHeader>

      <PanelBody>
        <div
          v-if="saveError"
          class="mb-(--spacing-md)"
        >
          <Alert
            severity="danger"
            :label="saveError"
            data-testid="variables-save-error"
          />
        </div>
        <fieldset
          class="m-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">{{ title }}</legend>
          <slot />
        </fieldset>
      </PanelBody>

      <PanelFooter>
        <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
          <Button
            variant="primary"
            size="medium"
            :loading="submitting"
            type="submit"
            :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
          >
            Save
            <Kbd
              meta
              key-name="enter"
              size="small"
              aria-hidden="true"
            />
          </Button>
        </div>
      </PanelFooter>
    </form>
  </DrawerContent>
</template>
