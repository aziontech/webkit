<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import { toAriaKeyshortcuts } from '@aziontech/webkit/use-shortcuts'

  export interface TicketSaveActionsProps {
    /** The pickers' data is still arriving; neither create button works yet. */
    loading?: boolean
    /** The create request is in flight. */
    submitting?: boolean
    /** The request in flight came from Create and add another. */
    addAnother?: boolean
  }

  withDefaults(defineProps<TicketSaveActionsProps>(), {
    loading: false,
    submitting: false,
    addAnother: false
  })

  const emit = defineEmits<{
    cancel: [event: MouseEvent]
    'add-another': [event: MouseEvent]
  }>()
</script>

<template>
  <div
    class="flex items-center gap-(--spacing-sm) max-sm:w-full max-sm:gap-(--spacing-xs) max-sm:*:flex-1"
  >
    <Button
      type="button"
      label="Cancel"
      variant="outline"
      size="medium"
      :disabled="submitting"
      @click="(event: MouseEvent) => emit('cancel', event)"
    />
    <span class="contents max-sm:hidden">
      <Button
        type="button"
        label="Create and add another"
        variant="secondary"
        size="medium"
        :disabled="loading || (submitting && !addAnother)"
        :loading="submitting && addAnother"
        @click="(event: MouseEvent) => emit('add-another', event)"
      />
    </span>
    <Button
      variant="primary"
      size="medium"
      type="submit"
      :disabled="loading || (submitting && addAnother)"
      :loading="submitting && !addAnother"
      :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
    >
      Create ticket
      <span
        class="contents max-sm:hidden"
        aria-hidden="true"
      >
        <Kbd
          meta
          key-name="enter"
          size="small"
        />
      </span>
    </Button>
  </div>
</template>
