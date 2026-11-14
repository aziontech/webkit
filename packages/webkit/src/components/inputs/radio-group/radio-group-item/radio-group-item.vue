<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import RadioButton from '../../radio-button/radio-button.vue'
  import { RadioGroupInjectionKey } from '../injection-key'

  defineOptions({
    name: 'RadioGroupItem',
    inheritAttrs: false
  })

  interface Props {
    /** Value written to the group when this option is selected. */
    value: string
    /** Disables this option only. */
    disabled?: boolean
  }
  export type RadioGroupItemProps = Props

  const props = withDefaults(defineProps<Props>(), {
    disabled: false
  })

  defineSlots<{
    /** The option label; clicking it selects the option. */
    default(): unknown
  }>()

  const ctx = inject(RadioGroupInjectionKey, null)
  if (!ctx) {
    throw new Error('RadioGroupItem must be used inside <RadioGroup>.')
  }

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId.value}__item`
  )
  const checked = computed(() => ctx.value.value === props.value)
  const inactive = computed(() => props.disabled || ctx.disabled.value)

  const select = (next: string | undefined) => {
    if (next === undefined || inactive.value) return
    ctx.select(next)
  }
</script>

<template>
  <label
    v-bind="$attrs"
    :data-testid="testId"
    :data-checked="checked || null"
    :data-disabled="inactive || null"
    class="inline-flex w-fit max-w-full cursor-pointer items-center gap-(--spacing-xs) text-label-sm text-(--text-default) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled)"
  >
    <RadioButton
      :value="value"
      :name="ctx.name.value"
      :disabled="inactive"
      :model-value="ctx.value.value"
      :data-testid="`${testId}-control`"
      @update:model-value="select"
    />
    <span class="min-w-0"><slot /></span>
  </label>
</template>
