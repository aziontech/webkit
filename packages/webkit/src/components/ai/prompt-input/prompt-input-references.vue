<script setup lang="ts">
  import Chip from '../../inputs/chip/chip.vue'
  import type { PromptInputReference } from './prompt-input.vue'

  defineOptions({ name: 'PromptInputReferences' })

  defineProps<{
    references: PromptInputReference[]
    label: string
    disabled: boolean
    testId: string
  }>()

  const emit = defineEmits<{
    remove: [reference: PromptInputReference]
  }>()
</script>

<template>
  <ul
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
        @remove="emit('remove', reference)"
      />
    </li>
  </ul>
</template>
