<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { toggleControlClasses } from '../presets/interactive-states'

  defineOptions({
    name: 'RadioButton',
    inheritAttrs: false
  })

  interface Props {
    /** Selected value for v-model. */
    modelValue?: string
    /** Option value for this radio instance. */
    value?: string
    /** HTML name shared across a mutually exclusive group. */
    name?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** id for the native input; associate an external label via htmlFor. */
    inputId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: undefined,
    name: undefined,
    disabled: false,
    inputId: undefined
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | undefined]
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-radio-button'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isChecked = computed(() => props.modelValue === props.value)

  const handleChange = () => {
    if (props.disabled) {
      return
    }

    emit('update:modelValue', props.value)
  }

  const sharedClasses = [
    ...toggleControlClasses,
    'group size-5 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)]'
  ]

  const checkedClasses =
    'data-[checked]:border-[var(--primary)] data-[checked]:bg-[var(--primary)] data-[checked]:before:hidden data-[checked]:after:hidden'

  const disabledClasses =
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--border-default)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:opacity-50 data-[checked]:data-[disabled]:border-[var(--border-default)] data-[checked]:data-[disabled]:bg-[var(--bg-disabled)]'

  const indicatorClasses =
    'size-2.5 rounded-full bg-[var(--primary-contrast)] group-data-[disabled]:bg-[var(--text-disabled)]'

  const rootClasses = computed(() =>
    cn(sharedClasses, checkedClasses, disabledClasses, attrs.class)
  )
</script>

<template>
  <span
    :class="rootClasses"
    :data-testid="testId"
    :data-checked="isChecked || null"
    :data-disabled="disabled || null"
  >
    <input
      :id="inputId"
      type="radio"
      class="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :aria-checked="isChecked"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @change="handleChange"
    />
    <span
      v-if="isChecked"
      :class="indicatorClasses"
      aria-hidden="true"
      :data-testid="`${testId}__indicator`"
    />
  </span>
</template>
