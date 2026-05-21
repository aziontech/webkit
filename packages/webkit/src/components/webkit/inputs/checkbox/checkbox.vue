<script setup>
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Checkbox',
    inheritAttrs: false
  })

  const props = defineProps({
    modelValue: {
      type: null,
      default: undefined
    },
    value: {
      type: null,
      default: undefined
    },
    binary: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: undefined
    },
    tabindex: {
      type: Number,
      default: undefined
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'input-checkbox')

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

  const rootClasses = computed(() => {
    const classes = [
      'relative inline-flex shrink-0 items-center justify-center',
      'size-[1.125rem] rounded-[var(--shape-elements)] border transition-colors duration-150',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)]',
      'focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)]'
    ]

    if (props.disabled) {
      classes.push('pointer-events-none opacity-60')
    } else if (props.readonly) {
      classes.push('pointer-events-none')
    }

    if (isChecked.value) {
      classes.push('border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)]')
    } else {
      classes.push('border-[var(--border-default)] bg-[var(--bg-surface)] text-transparent')
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
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
</script>

<template>
  <span
    :class="rootClasses"
    :data-testid="testId"
  >
    <input
      :id="inputId"
      type="checkbox"
      class="absolute inset-0 size-full cursor-pointer opacity-0"
      :checked="isChecked"
      :disabled="disabled"
      :readonly="readonly"
      :tabindex="tabindex"
      :aria-checked="isChecked"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @change="handleChange"
    />
    <i
      v-if="isChecked"
      class="pi pi-check text-[0.625rem] leading-none"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
  </span>
</template>
