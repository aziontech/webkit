<script setup>
  // The console's CREATION PATTERN for second-level resources, as a shell: a
  // LARGE right-side Drawer whose body is section-titled ItemGroup sections
  // (Approach A of the /form skill), committed by ONE scoped save — never a full
  // page.
  //
  // Only the shell lives here — the Drawer/Panel chrome, the form element, the
  // `submitting` lock and the Cancel/Save footer. The FIELDS come from the tab
  // that owns the resource, through the default slot, because what a Device Group
  // asks for has nothing to do with what a Functions Instance asks for. That
  // split is what lets each tab own its own create flow without repeating this
  // boilerplate four times.
  //
  // Validation runs on submit only: the owner validates in its `submit` handler
  // and closes by setting `open` to false.
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

  defineProps({
    // Drawer title, e.g. "Create Device Group".
    title: { type: String, default: '' },
    // Supporting line under the title.
    description: {
      type: String,
      default: 'Configure the resource across grouped sections — all saved together.'
    },
    // The owner's in-flight flag. Locks the whole scope: the body fieldset, both
    // footer buttons, and the Save's spinner.
    submitting: { type: Boolean, default: false }
  })

  const emit = defineEmits(['submit'])

  const cancel = () => {
    open.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="title"
          novalidate
          @submit.prevent="emit('submit')"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>{{ title }}</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                {{ description }}
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <!-- One fieldset for the whole body: a single `disabled` locks every
                 field in every section while the scoped save runs. -->
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--layout-section-gap)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ title }}</legend>
              <slot />
            </fieldset>
          </PanelContent>

          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <Button
              class="w-full md:w-auto"
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="emit('submit')"
            />
            <!-- Enter-to-submit: the visible Save is a click handler (not a
                 submit button), so the form needs a real submit control for the
                 keyboard path. -->
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Save
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
