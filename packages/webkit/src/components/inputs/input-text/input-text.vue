<script setup>
  import { computed, useAttrs } from 'vue'

  import { surfaceControlWrapperClasses } from '../presets/interactive-states'

  defineOptions({
    name: 'InputText',
    inheritAttrs: false
  })

  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined
    },
    placeholder: {
      type: String,
      default: undefined
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    invalid: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'input-text')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const sharedClasses = [...surfaceControlWrapperClasses]

  const disabledClasses =
    'pointer-events-none cursor-not-allowed border-transparent bg-[var(--bg-disabled)]'

  const invalidClasses = 'border-[var(--danger-border)] focus-within:ring-[var(--danger)]'

  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12'
  }

  const inputSizeClasses = {
    small: 'px-[var(--spacing-xs)] text-body-sm',
    medium: 'px-[var(--spacing-sm)] text-body-md',
    large: 'px-[var(--spacing-md)] text-body-lg'
  }

  const rootClasses = computed(() => {
    const classes = [...sharedClasses, sizeClasses[props.size] ?? sizeClasses.medium]

    if (props.disabled) {
      classes.push(disabledClasses)
    }

    if (props.invalid) {
      classes.push(invalidClasses)
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const inputClasses = computed(() => [
    'relative z-[1] h-full w-full min-w-0 self-stretch border-0 bg-transparent outline-none',
    'text-[var(--text-default)] placeholder:text-[var(--text-muted)]',
    'disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]',
    'read-only:cursor-default',
    inputSizeClasses[props.size] ?? inputSizeClasses.medium
  ])

  const handleInput = (event) => {
    emit('update:modelValue', event.target.value)
  }
</script>

<template>
  <span :class="rootClasses">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="invalid || undefined"
      :class="inputClasses"
      :data-testid="testId"
      v-bind="passthroughAttrs"
      @input="handleInput"
    />
  </span>
</template>
