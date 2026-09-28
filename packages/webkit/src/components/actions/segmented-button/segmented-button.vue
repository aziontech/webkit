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

  /** Size token. Sets the group's own height on the 28 / 32 / 40 rhythm. */
  export type SegmentedButtonSize = 'small' | 'medium' | 'large'

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
    /** Size token, on the same 28 / 32 / 40 rhythm every other control uses. */
    size?: SegmentedButtonSize
    /** Stretches the group to its container and lets the options share that width. */
    fluid?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    ariaLabel: undefined,
    defaultValue: undefined,
    size: 'large',
    fluid: false
  })

  const model = defineModel<string | undefined>({ default: undefined })

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

  // The root owns the height (28 / 32 / 40, Button's steps) and the options stretch into
  // it; the indicator is measured from the option's layout box, so there is no second
  // source of truth. Fluid pins the root to its container AND grows the options into it.
  // It is a data attribute rather than a consumer class because the options need to read
  // it too, through the root's group variant.
  const rootClasses = computed(() =>
    cn(
      'group relative inline-flex w-fit items-stretch gap-(--spacing-xxs)',
      'rounded-(--shape-button) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-xxs)',
      'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10',
      'data-[fluid]:flex data-[fluid]:w-full',
      attrs.class as string | undefined
    )
  )

  const indicatorClasses = [
    'pointer-events-none absolute left-0 top-0 z-0',
    'rounded-(--shape-button) bg-(--bg-selected)',
    'motion-reduce:transition-none'
  ]

  const sharedOptionClasses = [
    'relative z-1 inline-flex shrink-0 items-center justify-center gap-(--spacing-xs) whitespace-nowrap',
    // Fluid: grow from a zero basis so the longest label sets the floor and nothing is
    // clipped while there is room. The zero min-width is for when there is NOT room:
    // without it the options keep their full labels and the last one overflows the group's
    // border (measured: a 430px row inside a 322px box at a 390px viewport); with it the
    // labels ellipsize inside the bar.
    'group-data-[fluid]:min-w-0 group-data-[fluid]:flex-1',
    'rounded-(--shape-button) border border-transparent',
    // Horizontal padding and type follow the group's size through the root's
    // `data-size`, so the option never has to be told twice.
    'group-data-[size=small]:px-(--spacing-xs) group-data-[size=medium]:px-(--spacing-sm) group-data-[size=large]:px-(--spacing-md)',
    'group-data-[size=small]:text-label-sm group-data-[size=medium]:text-label-sm group-data-[size=large]:text-label-md',
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--bg-disabled) disabled:text-(--text-disabled)'
  ]

  const optionClasses = (value: string, disabled: boolean) =>
    cn(
      sharedOptionClasses,
      value === selectedValue.value
        ? 'bg-transparent text-(--text-default)'
        : 'bg-transparent text-(--text-muted)',
      disabled && 'pr-(--spacing-xs)'
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

  // Layout metrics, not the client rect: a rect is the visual box, so an ancestor's
  // entrance animation (popupScaleIn starts at scale 0.9) sizes the pill to 90% of its
  // option, and a transform never fires the ResizeObserver to correct it. Offsets are
  // relative to the positioned root's padding edge, the origin the absolute indicator
  // resolves against. A null offsetParent means not laid out: hide instead of writing 0.
  const syncIndicator = () => {
    const rootEl = rootRef.value
    const activeOptionEl = optionRefs.value[selectedIndex.value]

    if (!rootEl || !activeOptionEl || selectedIndex.value < 0 || !activeOptionEl.offsetParent) {
      indicatorVisible.value = false
      return
    }

    indicatorWidth.value = activeOptionEl.offsetWidth
    indicatorHeight.value = activeOptionEl.offsetHeight
    indicatorOffsetX.value = activeOptionEl.offsetLeft
    indicatorOffsetY.value = activeOptionEl.offsetTop
    indicatorVisible.value = true
  }

  const scheduleIndicatorSync = () => {
    nextTick(() => {
      syncIndicator()
      observeMeasuredElements()
    })
  }

  let resizeObserver: ResizeObserver | null = null

  // Observe every element the indicator is measured FROM, not only the root: in fluid
  // mode the root is pinned to its container, so an option can change width (the webfont
  // swap does, right after mount) with the root's box untouched. Measured: a 217px pill on
  // a 215px option until the next selection. Re-established when the option set changes,
  // because the old entries point at detached nodes.
  const observeMeasuredElements = () => {
    if (!resizeObserver) {
      return
    }

    resizeObserver.disconnect()

    if (rootRef.value) {
      resizeObserver.observe(rootRef.value)
    }

    optionRefs.value.forEach((el) => {
      if (el) {
        resizeObserver?.observe(el)
      }
    })
  }

  onMounted(() => {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        syncIndicator()
      })
    }

    scheduleIndicatorSync()
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
    :data-size="size"
    :data-fluid="fluid || null"
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
      <span class="min-w-0 truncate">{{ option.label }}</span>
      <i
        v-if="option.disabled"
        class="pi pi-lock shrink-0 text-(--text-disabled)"
        aria-hidden="true"
        :data-testid="`${testId}__option-lock`"
      />
    </button>
  </div>
</template>
