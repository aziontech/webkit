<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableViewToggle',
    inheritAttrs: false
  })

  export interface ViewModeOption {
    label: string
    value: string
  }

  withDefaults(
    defineProps<{
      /** Available view modes. */
      options?: ViewModeOption[]
      /** Selected view mode value. */
      modelValue?: string
    }>(),
    {
      options: () => [],
      modelValue: ''
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__view-toggle`
  )

  function select(value: string) {
    emit('update:modelValue', value)
  }
</script>

<template>
  <div
    v-bind="attrs"
    class="inline-flex rounded-[var(--shape-elements)] border border-[var(--border-default)]"
    role="group"
    :data-testid="testId"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="px-[var(--spacing-3)] py-[var(--spacing-2)] text-body-sm transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
      :class="
        modelValue === option.value
          ? 'bg-[var(--primary)] text-[var(--primary-contrast)]'
          : 'bg-[var(--bg-surface)] text-[var(--text-default)]'
      "
      :data-testid="`${testId}__${option.value}`"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
