<script setup>
  import { computed, ref, useAttrs, watch } from 'vue'

  defineOptions({
    name: 'SegmentedButton',
    inheritAttrs: false
  })

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const attrs = useAttrs()

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const testId = computed(() => attrs['data-testid'] ?? 'segmented-button')

  const internalValue = ref(props.modelValue)

  const normalizedOptions = computed(() => {
    if (!props.options.length) {
      return [
        { label: 'Monthly', value: 'monthly', disabled: false },
        { label: 'Yearly', value: 'yearly', disabled: false }
      ]
    }

    return props.options
      .filter((option) => option && typeof option === 'object')
      .map((option, index) => ({
        label: String(option.label ?? option.value ?? `Option ${index + 1}`),
        value: String(option.value ?? option.label ?? index),
        disabled: Boolean(option.disabled)
      }))
  })

  const selectedValue = computed(() => {
    if (internalValue.value) {
      return internalValue.value
    }

    return normalizedOptions.value.find((option) => !option.disabled)?.value ?? ''
  })

  const selectedIndex = computed(() =>
    normalizedOptions.value.findIndex((option) => option.value === selectedValue.value)
  )

  const updateValue = (value) => {
    if (value === selectedValue.value) {
      return
    }

    internalValue.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }

  const selectOption = (option) => {
    if (option.disabled) {
      return
    }

    updateValue(option.value)
  }

  const moveSelection = (direction) => {
    if (!normalizedOptions.value.length) {
      return
    }

    const directionStep = direction === 'next' ? 1 : -1
    let index = selectedIndex.value

    for (let i = 0; i < normalizedOptions.value.length; i += 1) {
      index =
        (index + directionStep + normalizedOptions.value.length) % normalizedOptions.value.length
      const option = normalizedOptions.value[index]

      if (!option.disabled) {
        updateValue(option.value)
        return
      }
    }
  }

  const onOptionKeydown = (event, option) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(option)
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveSelection('next')
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveSelection('prev')
    }
  }

  watch(
    () => props.modelValue,
    (value) => {
      internalValue.value = value
    }
  )

  watch(
    normalizedOptions,
    (options) => {
      const hasCurrentValue = options.some((option) => option.value === internalValue.value)

      if (!hasCurrentValue) {
        internalValue.value = options.find((option) => !option.disabled)?.value ?? ''
      }
    },
    { immediate: true }
  )

  const rootClasses = computed(() => {
    const classes = [
      'inline-flex w-fit items-center gap-[var(--spacing-xxs)]',
      'rounded-[var(--shape-button)] border border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-xxs)]'
    ]

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const sharedOptionClasses = [
    'relative inline-flex h-7 items-center justify-center whitespace-nowrap',
    'rounded-[var(--shape-button)] border border-transparent px-[var(--spacing-sm)]',
    'text-overline-sm',
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ]

  const selectedClasses = 'bg-[var(--bg-canvas)] text-[var(--text-default)]'
  const unselectedClasses = 'bg-transparent text-[var(--text-muted)]'

  const optionClasses = (option) => [
    sharedOptionClasses,
    option.value === selectedValue.value ? selectedClasses : unselectedClasses
  ]
</script>

<template>
  <div
    v-bind="passthroughAttrs"
    :class="rootClasses"
    :data-testid="testId"
    role="radiogroup"
  >
    <button
      v-for="option in normalizedOptions"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="option.value === selectedValue"
      :disabled="option.disabled"
      :class="optionClasses(option)"
      :data-testid="`${testId}__option`"
      @click="selectOption(option)"
      @keydown="onOptionKeydown($event, option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
