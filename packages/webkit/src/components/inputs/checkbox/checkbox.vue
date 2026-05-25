<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { toggleControlClasses } from '../presets/interactive-states'

  defineOptions({
    name: 'Checkbox',
    inheritAttrs: false
  })

  interface Props {
    /** model Value. */
    modelValue?: unknown
    /** value. */
    value?: unknown
    /** binary. */
    binary?: boolean
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** readonly. */
    readonly?: boolean
    /** input Id. */
    inputId?: string
    /** HTML name for form submission. */
    name?: string
    /** tabindex. */
    tabindex?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: undefined,
    binary: false,
    disabled: false,
    readonly: false,
    inputId: undefined,
    name: undefined,
    tabindex: undefined
  })

  const emit = defineEmits<{
    'update:modelValue': [value: unknown]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-checkbox')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isChecked = computed(() => {
    if (props.binary) {
      return Boolean(props.modelValue)
    }

    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value)
    }

    return props.modelValue === props.value
  })

  const handleChange = () => {
    if (props.disabled || props.readonly) {
      return
    }

    if (props.binary) {
      emit('update:modelValue', !props.modelValue)
      return
    }

    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(props.value)

    if (index === -1) {
      current.push(props.value)
    } else {
      current.splice(index, 1)
    }

    emit('update:modelValue', current)
  }

  const sharedClasses = [
    ...toggleControlClasses,
    'group size-[1.125rem] rounded-[var(--shape-elements)] border border-[var(--border-default)]',
    'bg-[var(--bg-surface)] text-transparent'
  ]

  const checkedClasses =
    'data-[checked]:border-[var(--primary)] data-[checked]:bg-[var(--primary)] data-[checked]:text-[var(--primary-contrast)] data-[checked]:before:hidden data-[checked]:after:hidden'

  const disabledClasses =
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--border-default)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:opacity-50 data-[readonly]:pointer-events-none data-[readonly]:cursor-not-allowed'

  const iconClasses =
    'size-2.5 shrink-0 stroke-[1.5] group-data-[disabled]:stroke-[var(--text-disabled)]'

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
    :data-readonly="readonly || null"
  >
    <input
      :id="inputId"
      :name="name"
      type="checkbox"
      class="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      :checked="isChecked"
      :disabled="disabled"
      :readonly="readonly"
      :tabindex="tabindex"
      :aria-checked="isChecked"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @change="handleChange"
    />
    <svg
      v-if="isChecked"
      :class="iconClasses"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    >
      <path
        d="M2.5 6l2.5 2.5 4.5-4.5"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>
