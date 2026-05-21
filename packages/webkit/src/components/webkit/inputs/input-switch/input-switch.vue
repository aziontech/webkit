<script setup>
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'InputSwitch',
    inheritAttrs: false
  })

  const props = defineProps({
    modelValue: {
      type: null,
      default: undefined
    },
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: undefined
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'input-switch')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isChecked = computed(() => props.modelValue === props.trueValue)

  const rootClasses = computed(() => {
    const classes = [
      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
      'border border-transparent transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
    ]

    if (props.disabled) {
      classes.push('pointer-events-none opacity-60')
    }

    if (isChecked.value) {
      classes.push('bg-[var(--primary)]')
    } else {
      classes.push('bg-[var(--bg-disabled)]')
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const handleClick = () => {
    if (props.disabled) {
      return
    }

    emit('update:modelValue', isChecked.value ? props.falseValue : props.trueValue)
  }

  const handleKeydown = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      handleClick()
    }
  }
</script>

<template>
  <button
    :id="inputId"
    type="button"
    role="switch"
    :class="rootClasses"
    :disabled="disabled"
    :aria-checked="isChecked"
    :data-testid="testId"
    v-bind="passthroughAttrs"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span
      class="pointer-events-none absolute left-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-[var(--bg-surface)] shadow-sm transition-transform duration-150"
      :class="isChecked ? 'translate-x-5' : 'translate-x-0'"
      aria-hidden="true"
      :data-testid="`${testId}__handle`"
    />
  </button>
</template>
