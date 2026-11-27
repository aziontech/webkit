<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Kbd from '@aziontech/ui/kbd'
  import SaveBar from '@aziontech/ui/save-bar'

  import SettingsLeaveDialog, {
    type SettingsLeaveDialogProps
  } from './edit-resource-settings-leave-dialog.vue'

  export interface SettingsSaveBarProps {
    /** Whether the bar is up: the form holds edits or a save is in flight. */
    visible?: boolean
    /** The save is in flight: Discard locks and Save spins. */
    saving?: boolean
    /** Label of the Discard button. */
    discardLabel?: string
    /** The leave guard; set, the leave dialog renders with the bar. */
    guard?: SettingsLeaveDialogProps['guard']
  }

  const props = withDefaults(defineProps<SettingsSaveBarProps>(), {
    visible: false,
    saving: false,
    discardLabel: 'Discard',
    guard: undefined
  })

  const emit = defineEmits<{
    save: [event: Event]
    discard: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The status sentence, such as You have unsaved changes. */
    default(): unknown
  }>()

  const onShortcut = (event: KeyboardEvent) => {
    if (!props.saving) emit('save', event)
  }
</script>

<template>
  <SettingsLeaveDialog
    v-if="guard"
    :guard="guard"
  />
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0"
  >
    <SaveBar
      v-if="visible"
      @save="onShortcut"
    >
      <span
        v-if="saving"
        data-testid="settings-save-bar__saving"
        >Saving changes…</span
      >
      <slot v-else />
      <template #actions>
        <Button
          type="button"
          :label="discardLabel"
          variant="outline"
          size="medium"
          :disabled="saving"
          @click="(event: MouseEvent) => emit('discard', event)"
        />
        <Button
          variant="primary"
          size="medium"
          :loading="saving"
          @click="(event: MouseEvent) => emit('save', event)"
          aria-keyshortcuts="Meta+S Control+S"
        >
          Save
          <Kbd
            meta
            size="small"
            aria-hidden="true"
            >S</Kbd
          >
        </Button>
      </template>
    </SaveBar>
  </Transition>
</template>
