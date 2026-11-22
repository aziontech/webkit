<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'

  export interface DeploymentSaveBarProps {
    /** The defaults differ from the saved ones. */
    dirty: boolean
    /** The defaults save is in flight. */
    saving: boolean
  }

  defineProps<DeploymentSaveBarProps>()

  const emit = defineEmits<{
    'save-shortcut': [event: KeyboardEvent]
    discard: [event: MouseEvent]
    save: [event: MouseEvent]
  }>()

  const onSaveShortcut = (event: KeyboardEvent) => emit('save-shortcut', event)
  const discard = (event: MouseEvent) => emit('discard', event)
  const save = (event: MouseEvent) => emit('save', event)
</script>

<template>
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0"
  >
    <SaveBar
      v-if="dirty || saving"
      @save="onSaveShortcut"
    >
      You have unsaved changes.
      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          :disabled="saving"
          @click="discard"
        />
        <Button
          variant="primary"
          size="medium"
          :loading="saving"
          @click="save"
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
