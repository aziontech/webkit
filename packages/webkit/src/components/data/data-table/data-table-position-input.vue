<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import InputText from '../../inputs/input-text/input-text.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTablePositionInput',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Position value. */
      modelValue?: number
      /** Minimum allowed position. */
      min?: number
      /** Maximum allowed position. */
      max?: number
      /** Disables the input. */
      disabled?: boolean
    }>(),
    {
      modelValue: 1,
      min: 1,
      max: 9999,
      disabled: false
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__position-input`
  )

  function handleUpdate(value: string) {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) return
    const clamped = Math.min(props.max, Math.max(props.min, parsed))
    emit('update:modelValue', clamped)
  }
</script>

<template>
  <InputText
    v-bind="attrs"
    type="number"
    :modelValue="String(modelValue)"
    :disabled="disabled"
    :data-testid="testId"
    @update:modelValue="handleUpdate"
  />
</template>
