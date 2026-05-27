<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import { cn } from '../../../utils/cn'
  import { getSegmentedButtonIndicatorTransitionStyle } from './presets/transitions'

  export type SegmentedButtonOption = {
    label?: string | number
    value?: string | number
    disabled?: boolean
  }

  defineOptions({
    name: 'SegmentedButton',
    inheritAttrs: false
  })

  interface Props {
    /** Segmented choices shown as a mutually exclusive group. */
    options?: SegmentedButtonOption[]
    /** Accessible name when no visible group label is associated. */
    ariaLabel?: string
    /** Initial selection when `v-model` is not set. */
    defaultValue?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    ariaLabel: undefined,
    defaultValue: undefined
  })

  const emit = defineEmits<{
    change: [value: string]
  }>()

  const model = defineModel<string>({ default: undefined })

  const attrs = useAttrs()
  const rootRef = ref<HTMLElement | null>(null)
  const optionRefs = ref<HTMLElement[]>([])
  const indicatorVisible = ref(false)
  const indicatorWidth = ref(0)
  const indicatorHeight = ref(0)
  const indicatorOffsetX = ref(0)
  const indicatorOffsetY = ref(0)
  const internalValue = ref(props.defaultValue ?? '')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-segmented-button'
  )

  const isControlled = computed(() => model.value !== undefined)

  const normalizedOptions = computed(() =>
    props.options
      .filter((option): option is SegmentedButtonOption =>
        Boolean(option && typeof option === 'object')
      )
      .map((option, index) => ({
        label: String(option.label ?? option.value ?? `Option ${index + 1}`),
        value: String(option.value ?? option.label ?? index),
        disabled: Boolean(option.disabled)
      }))
  )

  const selectedValue = computed(() => {
    if (isControlled.value) {
      return model.value ?? ''
    }

    if (internalValue.value) {
      return internalValue.value
    }

    return normalizedOptions.value.find((option) => !option.disabled)?.value ?? ''
  })

  const selectedIndex = computed(() =>
    normalizedOptions.value.findIndex((option) => option.value === selectedValue.value)
  )

  const indicatorTransitionStyle = computed(() => getSegmentedButtonIndicatorTransitionStyle())

  const indicatorTransformStyle = computed(() => ({
    width: `${indicatorWidth.value}px`,
    height: `${indicatorHeight.value}px`,
    transform: `translate3d(${indicatorOffsetX.value}px, ${indicatorOffsetY.value}px, 0)`
  }))

  const rootClasses = computed(() =>
    cn(
      'relative inline-flex w-fit items-center gap-[var(--spacing-xxs)]',
      'rounded-[var(--shape-button)] border border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-xxs)]',
      attrs.class as string | undefined
    )
  )

  const indicatorClasses = [
    'pointer-events-none absolute left-0 top-0 z-0',
    'rounded-[var(--shape-button)] bg-[var(--bg-selected)]',
    'motion-reduce:transition-none'
  ]

  const sharedOptionClasses = [
    'relative z-[1] inline-flex h-7 shrink-0 items-center justify-center gap-[var(--spacing-xs)] whitespace-nowrap',
    'rounded-[var(--shape-button)] border border-transparent px-[var(--spacing-sm)]',
    'text-label-sm',
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled)]'
  ]

  const optionClasses = (value: string, disabled: boolean) =>
    cn(
      sharedOptionClasses,
      value === selectedValue.value
        ? 'bg-transparent text-[var(--text-default)]'
        : 'bg-transparent text-[var(--text-muted)]',
      disabled && 'pr-[var(--spacing-xs)]'
    )

  const resolveOptionElement = (
    element: globalThis.Element | ComponentPublicInstance | null
  ): HTMLElement | null => {
    if (!element) {
      return null
    }

    if (element instanceof HTMLElement) {
      return element
    }

    const el = (element as ComponentPublicInstance).$el

    return el instanceof HTMLElement ? el : null
  }

  const setOptionRef = (
    element: globalThis.Element | ComponentPublicInstance | null,
    index: number
  ) => {
    const el = resolveOptionElement(element)

    if (!el) {
      return
    }

    optionRefs.value[index] = el
  }

  const setValue = (value: string) => {
    if (value === selectedValue.value) {
      return
    }

    if (!isControlled.value) {
      internalValue.value = value
    }

    model.value = value
    emit('change', value)
  }

  const selectOption = (value: string, disabled: boolean) => {
    if (disabled) {
      return
    }

    setValue(value)
  }

  const moveSelection = (direction: 'next' | 'prev') => {
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
        setValue(option.value)
        return
      }
    }
  }

  const onOptionKeydown = (event: globalThis.KeyboardEvent, value: string, disabled: boolean) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(value, disabled)
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

  const syncIndicator = () => {
    const rootEl = rootRef.value
    const activeOptionEl = optionRefs.value[selectedIndex.value]

    if (!rootEl || !activeOptionEl || selectedIndex.value < 0) {
      indicatorVisible.value = false
      return
    }

    const rootRect = rootEl.getBoundingClientRect()
    const optionRect = activeOptionEl.getBoundingClientRect()

    indicatorWidth.value = optionRect.width
    indicatorHeight.value = optionRect.height
    indicatorOffsetX.value = optionRect.left - rootRect.left
    indicatorOffsetY.value = optionRect.top - rootRect.top
    indicatorVisible.value = true
  }

  const scheduleIndicatorSync = () => {
    nextTick(() => {
      syncIndicator()
    })
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    scheduleIndicatorSync()

    if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
      resizeObserver = new ResizeObserver(() => {
        syncIndicator()
      })
      resizeObserver.observe(rootRef.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  watch(
    normalizedOptions,
    (options) => {
      if (isControlled.value) {
        scheduleIndicatorSync()
        return
      }

      const hasCurrentValue = options.some((option) => option.value === internalValue.value)

      if (!hasCurrentValue) {
        internalValue.value = options.find((option) => !option.disabled)?.value ?? ''
      }

      optionRefs.value = optionRefs.value.slice(0, options.length)
      scheduleIndicatorSync()
    },
    { immediate: true }
  )

  watch(selectedValue, scheduleIndicatorSync)
</script>

<template>
  <div
    ref="rootRef"
    role="radiogroup"
    :class="rootClasses"
    :data-testid="testId"
    :aria-label="ariaLabel"
  >
    <span
      v-show="indicatorVisible"
      :class="indicatorClasses"
      :style="[indicatorTransitionStyle, indicatorTransformStyle]"
      :data-testid="`${testId}__indicator`"
      aria-hidden="true"
    />
    <button
      v-for="(option, index) in normalizedOptions"
      :key="option.value"
      :ref="(element) => setOptionRef(element, index)"
      type="button"
      role="radio"
      :aria-checked="option.value === selectedValue"
      :disabled="option.disabled"
      :class="optionClasses(option.value, option.disabled)"
      :data-testid="`${testId}__option`"
      :data-state="option.value === selectedValue ? 'active' : 'inactive'"
      :data-disabled="option.disabled ? '' : undefined"
      @click="selectOption(option.value, option.disabled)"
      @keydown="onOptionKeydown($event, option.value, option.disabled)"
    >
      {{ option.label }}
      <i
        v-if="option.disabled"
        class="pi pi-lock shrink-0 text-[var(--text-disabled)]"
        aria-hidden="true"
        :data-testid="`${testId}__option-lock`"
      />
    </button>
  </div>
</template>
