<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'

  export interface FunctionSaveBarProps {
    /** The bar shows: there are unsaved edits or a save is in flight. */
    open: boolean
    /** The save is in flight. */
    saving: boolean
    /** Why the save failed. */
    error: string
  }

  defineProps<FunctionSaveBarProps>()

  const emit = defineEmits<{
    save: [event: Event]
    shortcut: [event: KeyboardEvent]
    discard: [event: MouseEvent]
  }>()
</script>

<template>
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0"
  >
    <SaveBar
      v-if="open"
      @save="(event: KeyboardEvent) => emit('shortcut', event)"
    >
      <template
        v-if="error"
        #leading
      >
        <Alert
          severity="danger"
          size="small"
          :label="error"
          data-testid="code-editor-save-error"
        />
      </template>
      {{ saving ? 'Saving changes…' : 'You have unsaved changes.' }}

      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          :disabled="saving"
          @click="(event: MouseEvent) => emit('discard', event)"
        />
        <Button
          variant="primary"
          size="medium"
          :loading="saving"
          @click="(event: Event) => emit('save', event)"
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
