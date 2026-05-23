<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import InputText from '../../inputs/input-text/input-text.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableSearch',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Search input value. */
      modelValue?: string
      /** Placeholder text. */
      placeholder?: string
      /** Debounce delay in ms before emitting search. */
      debounce?: number
      /** Disables the search input. */
      disabled?: boolean
    }>(),
    {
      modelValue: '',
      placeholder: 'Search keywords...',
      debounce: 0,
      disabled: false
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    search: [value: string]
    input: [value: string]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__search`
  )

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function handleUpdate(value: string) {
    emit('update:modelValue', value)
    emit('input', value)
    if (props.debounce > 0) {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => emit('search', value), props.debounce)
    }
  }

  function handleEnter() {
    emit('search', props.modelValue)
  }
</script>

<template>
  <span
    v-bind="attrs"
    class="flex w-full max-w-[32rem] flex-row items-center gap-[var(--spacing-3)]"
    :data-testid="testId"
  >
    <InputText
      class="w-full"
      :modelValue="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :data-testid="`${testId}__input`"
      @update:modelValue="handleUpdate"
      @keyup.enter="handleEnter"
    />
    <slot />
  </span>
</template>
