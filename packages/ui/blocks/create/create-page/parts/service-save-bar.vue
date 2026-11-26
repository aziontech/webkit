<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'

  export interface ServiceSaveBarProps {
    /** The request is in flight: Cancel is disabled. */
    submitting: boolean
    /** The submit binding from useCreateForm. */
    submitButton: { type: 'submit'; loading: boolean; 'aria-keyshortcuts': string }
  }

  defineProps<ServiceSaveBarProps>()

  const emit = defineEmits<{
    leave: [event: MouseEvent]
    submit: [event: MouseEvent]
  }>()
</script>

<template>
  <SaveBar variant="centered">
    <template #actions>
      <Button
        type="button"
        label="Cancel"
        variant="outline"
        size="medium"
        :disabled="submitting"
        @click="(event: MouseEvent) => emit('leave', event)"
      />
      <Button
        variant="primary"
        size="medium"
        v-bind="submitButton"
        type="button"
        @click="(event: MouseEvent) => emit('submit', event)"
      >
        Save
        <Kbd
          meta
          key-name="enter"
          size="small"
          aria-hidden="true"
        />
      </Button>
    </template>
  </SaveBar>
</template>
