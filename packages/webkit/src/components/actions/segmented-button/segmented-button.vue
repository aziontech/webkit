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

  // THE GROUP OWNS THE HEIGHT, THE OPTIONS FILL IT.
  //
  // Before this the root had no height of its own: it was whatever a `h-7` option plus
  // 4px of padding and 1px of border added up to, which was 38px — a number on nobody's
  // rhythm, 6px taller than a 32px field and 2px shorter than a 40px button, so the
  // group could not be lined up with anything it shared a row with.
  //
  // Now the root takes the height (28 / 32 / 40, the same steps Button uses) and the
  // options `items-stretch` into what is left inside the padding. The indicator is
  // measured from the option's own layout box (see `syncIndicator`), so it follows
  // without a second source of truth for the height.
  //
  // FLUID IS A SHARE OF THE ROW, NOT JUST A WIDER BOX.
  //
  // `class="w-full"` was the only way to widen the group, and it widened the wrong thing:
  // the root stretched, the options kept hugging their labels, and the reader got a bar
  // with two pills bunched at its left and dead space to the right — a control that looks
  // like it failed to lay out. Fluid is therefore one answer for both halves: the root
  // takes the container's width (`data-fluid`) and the options grow into it, so the group
  // reads as a segmented BAR whose parts divide the row between them.
  //
  // It is `data-fluid` and not a consumer class because the options need to know too, and
  // they read it through the root's `group` — a class on the root can never reach them.
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
    // `flex-1` over an explicit equal width: `basis-0` plus a flex item's own
    // `min-width: auto` means each option is at least its label and then takes an equal
    // share of what is left, so the longest label sets the floor and NOTHING is clipped
    // while there is room — which an equal split would do the moment one label is longer.
    //
    // `min-w-0` is what happens when there is NOT room. `min-width: auto` is a floor a
    // flex item cannot go under, so without this the options keep their full labels and
    // the last one walks straight out through the group's right border — measured at a
    // 390px viewport, a 430px row inside a 322px box, the second answer half outside the
    // card with no border beside it. A fluid group is told it owns the row, so it has to
    // own the narrow row too: the options give up width and the labels ellipsize, which
    // keeps both answers inside one bordered bar the reader can still read and press.
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

  // LAYOUT METRICS, NOT `getBoundingClientRect`.
  //
  // A rect is the VISUAL box, so any ancestor mid-animation scales it — mount this
  // inside a popover and the first measurement lands on the entrance animation's first
  // frame (`popupScaleIn` starts at `scale(0.9)`), sizing the indicator to 90% of its
  // option. Nothing ever corrects it: a transform does not change the layout box, so
  // the ResizeObserver below never fires, and the pill stays short for the whole life
  // of that mount — on every open, which is where it gets noticed.
  //
  // `offsetWidth` / `offsetLeft` read the layout box, which no transform can touch, and
  // the options are direct children of this positioned root, so their offsets are
  // already relative to it. They are relative to the root's PADDING edge, which is also
  // the origin an `absolute; left: 0; top: 0` indicator resolves against — so the pill
  // lands exactly on its option instead of the root's border width to the right of it.
  //
  // `offsetParent` is null while an element is not laid out (`display: none`, a panel
  // that has not opened yet); measuring then would write a zero-width pill, so the
  // indicator stays hidden until there is something real to measure.
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

  // THE OPTIONS ARE OBSERVED, NOT ONLY THE ROOT.
  //
  // Watching the root alone is enough while the group hugs its labels: the root's width
  // IS the options' width there, so anything that resizes a label resizes the root and
  // the observer fires. Fluid breaks that link — the root is pinned to its container, so
  // an option can change width with the root's box untouched, and nothing asks for a new
  // measurement. The webfont swap does exactly that, and it is the FIRST thing to happen
  // after mount: measured, the pill landed 217px wide on a 215px option and stayed wrong
  // until the next selection change — a 2px overhang on the first paint, in the one mode
  // where it could not self-correct.
  //
  // So every element the indicator is measured FROM is observed. Re-established whenever
  // the option set changes, because the old entries point at detached nodes.
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
