<script setup>
  import { computed, useAttrs } from 'vue'

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

  const sharedWrapperClasses = [
    'relative inline-flex w-full items-center transition-all duration-150',
    'rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
    "before:opacity-0 before:transition-opacity before:content-['']",
    'before:bg-[var(--bg-hover)]',
    'hover:before:opacity-100',
    'focus-within:before:opacity-0 active:before:opacity-0',
    'has-[:disabled]:before:hidden has-[[readonly]]:before:hidden',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)]',
    'focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)]'
  ]

  const disabledWrapperClasses =
    'pointer-events-none border-transparent bg-[var(--bg-disabled)] has-[:disabled]:before:hidden'

  const sizeClasses = {
    small: {
      wrapper: 'h-8',
      input:
        'px-[var(--spacing-elements-xs)] text-[length:var(--text-body-sm-font-size)] leading-[var(--text-body-sm-line-height)]'
    },
    medium: {
      wrapper: 'h-10',
      input:
        'px-[var(--spacing-elements-sm)] text-[length:var(--text-body-md-font-size)] leading-[var(--text-body-md-line-height)]'
    },
    large: {
      wrapper: 'h-12',
      input:
        'px-[var(--spacing-elements-md)] text-[length:var(--text-body-lg-font-size)] leading-[var(--text-body-lg-line-height)]'
    }
  }

  const wrapperClasses = computed(() => {
    const size = sizeClasses[props.size] ?? sizeClasses.medium
    const classes = [...sharedWrapperClasses, size.wrapper]

    if (props.disabled) {
      classes.push(disabledWrapperClasses)
    }

    if (props.invalid) {
      classes.push('border-[var(--danger-border)] focus-within:ring-[var(--danger)]')
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const inputClasses = computed(() => {
    const size = sizeClasses[props.size] ?? sizeClasses.medium
    const classes = [
      'relative z-[1] w-full min-w-0 border-0 bg-transparent outline-none',
      'font-[family-name:var(--font-sans),ui-sans-serif,system-ui,sans-serif]',
      'text-[var(--text-default)] placeholder:text-[var(--text-muted)]',
      'disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]',
      'read-only:cursor-default',
      size.input
    ]

    return classes
  })

  const handleInput = (event) => {
    emit('update:modelValue', event.target.value)
  }
</script>

<template>
  <span :class="wrapperClasses">
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
