<script setup>
  import { computed, ref, watch } from 'vue'

  defineOptions({ name: 'SegmentedButton' })

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    class: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:modelValue', 'change'])

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
</script>

<template>
  <div
    class="inline-flex w-fit items-center gap-1 rounded-sm border border-solid border-default bg-surface p-1"
    :class="props.class"
    role="radiogroup"
  >
    <button
      v-for="option in normalizedOptions"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="String(option.value === selectedValue)"
      :disabled="option.disabled"
      class="inline-flex h-7 items-center justify-center whitespace-nowrap rounded-sm border border-transparent bg-transparent px-3 font-proto-mono text-overline-sm text-muted transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      :class="option.value === selectedValue ? 'bg-canvas text-default' : ''"
      @click="selectOption(option)"
      @keydown="onOptionKeydown($event, option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
