<script setup>
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'RadioButton',
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
    name: {
      type: String,
      default: undefined
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

  const testId = computed(() => attrs['data-testid'] ?? 'input-radio-button')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isChecked = computed(() => props.modelValue === props.value)

  const rootClasses = computed(() => {
    const classes = [
      'relative inline-flex shrink-0 items-center justify-center',
      'size-[1.125rem] rounded-full border transition-colors duration-150',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)]',
      'focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)]'
    ]

    if (props.disabled) {
      classes.push('pointer-events-none opacity-60')
    }

    if (isChecked.value) {
      classes.push('border-[var(--primary)]')
    } else {
      classes.push('border-[var(--border-default)] bg-[var(--bg-surface)]')
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const handleChange = () => {
    if (props.disabled) {
      return
    }

    emit('update:modelValue', props.value)
  }
</script>

<template>
  <span
    :class="rootClasses"
    :data-testid="testId"
  >
    <input
      :id="inputId"
      type="radio"
      class="absolute inset-0 size-full cursor-pointer opacity-0"
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
      class="size-2 rounded-full bg-[var(--primary)]"
      aria-hidden="true"
      :data-testid="`${testId}__indicator`"
    />
  </span>
</template>
