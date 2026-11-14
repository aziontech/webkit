<script setup lang="ts">
  import Chip from '../../../inputs/chip/chip.vue'
  import type { PromptInputReference } from '../prompt-input.vue'

  defineOptions({ name: 'PromptInputReferences', inheritAttrs: false })

  interface Props {
    /** The references in the draft, in order. */
    references: PromptInputReference[]
    /** Accessible name of the list. */
    label: string
    /** Locks the remove buttons. */
    disabled: boolean
    /** Test id of the owning PromptInput; the list appends its own part. */
    testId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    remove: [event: MouseEvent, reference: PromptInputReference]
  }>()
</script>

<template>
  <ul
    v-bind="$attrs"
    :aria-label="label"
    :data-testid="`${testId}__references`"
    class="m-0 flex list-none flex-wrap gap-(--spacing-xs) p-0"
  >
    <li
      v-for="reference in references"
      :key="`${reference.trigger}${reference.value}`"
    >
      <Chip
        :label="`${reference.trigger}${reference.label}`"
        size="small"
        removable
        :disabled="disabled"
        @remove="(event: MouseEvent) => emit('remove', event, reference)"
      />
    </li>
  </ul>
</template>
