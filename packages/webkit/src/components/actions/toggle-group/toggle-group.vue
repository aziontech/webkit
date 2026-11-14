<script setup lang="ts" generic="TValue extends string = string">
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

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'ToggleGroup',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Segmented choices shown as a mutually exclusive group. */
      options?: ToggleGroupOption[]
      /** Accessible name when no visible group label is associated. */
      ariaLabel?: string
      /** Initial selection when `v-model` is not set. */
      defaultValue?: string
      /** Size token, on the same 28 / 32 / 40 rhythm every other control uses. */
      size?: ToggleGroupSize
      /** Stretches the group to its container and lets the options share that width. */
      fluid?: boolean
      /** Disables every option of the group. */
      disabled?: boolean
    }>(),
    {
      options: () => [],
      ariaLabel: '',
      defaultValue: undefined,
      size: 'large',
      fluid: false,
      disabled: false
    }
  )

  const model = defineModel<TValue | undefined>({ default: undefined })

  const attrs = useAttrs()
  const { t } = useTranslate({ toggleGroup: en.toggleGroup })
  const rootRef = ref<HTMLElement | null>(null)
  const dir = useDirection(rootRef)
  const optionRefs = ref<HTMLElement[]>([])
  const indicatorVisible = ref(false)
  const indicatorWidth = ref(0)
  const indicatorHeight = ref(0)
  const indicatorOffsetX = ref(0)
  const indicatorOffsetY = ref(0)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-toggle-group'
  )

  const forwardedAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest['class']
    return rest
  })

  const normalizedOptions = computed(() =>
    props.options
      .filter((option): option is ToggleGroupOption =>
        Boolean(option && typeof option === 'object')
      )
      .map((option, index) => ({
        label: String(
          option.label ?? option.value ?? t('toggleGroup.option', { index: index + 1 })
        ),
        value: String(option.value ?? option.label ?? index),
        disabled: props.disabled || Boolean(option.disabled),
        locked: option.locked ?? Boolean(option.disabled)
      }))
  )

  const selectedValue = computed(() => {
    if (model.value !== undefined) {
      return model.value
    }

    const options = normalizedOptions.value

    if (props.defaultValue && options.some((option) => option.value === props.defaultValue)) {
      return props.defaultValue
    }

    return options.find((option) => !option.disabled)?.value ?? ''
  })

  const selectedIndex = computed(() =>
    normalizedOptions.value.findIndex((option) => option.value === selectedValue.value)
  )

  const tabStopValue = computed(() => {
    const options = normalizedOptions.value
    const selected = options.find((option) => option.value === selectedValue.value)
    if (selected && !selected.disabled) return selected.value
    return options.find((option) => !option.disabled)?.value
  })

  const indicatorTransformStyle = computed(() => ({
    left: '0',
    width: `${indicatorWidth.value}px`,
    height: `${indicatorHeight.value}px`,
    transform: `translate3d(${indicatorOffsetX.value}px, ${indicatorOffsetY.value}px, 0)`
  }))

  const rootClasses = computed(() =>
    cn(
      'group relative inline-flex w-fit max-w-full min-w-0 items-stretch gap-(--spacing-xxs)',
      'rounded-(--shape-button) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-xxs)',
      'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10',
      'data-[fluid]:flex data-[fluid]:w-full',
      attrs.class as string | undefined
    )
  )

  const indicatorClasses = [
    'pointer-events-none absolute top-0 z-0',
    'rounded-(--shape-button) bg-(--bg-selected)',
    'transition-[transform,width,height] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none'
  ]

  const sharedOptionClasses = [
    'relative z-1 inline-flex min-w-0 items-center justify-center gap-(--spacing-xs) whitespace-nowrap',
    'group-data-[fluid]:min-w-0 group-data-[fluid]:flex-1',
    'rounded-(--shape-button) border border-transparent',
    'group-data-[size=small]:px-(--spacing-xs) group-data-[size=medium]:px-(--spacing-sm) group-data-[size=large]:px-(--spacing-md)',
    'group-data-[size=small]:text-label-sm group-data-[size=medium]:text-label-sm group-data-[size=large]:text-label-md',
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--bg-disabled) disabled:text-(--text-disabled)'
  ]

  const optionClasses = (value: string, locked: boolean) =>
    cn(
      sharedOptionClasses,
      value === selectedValue.value
        ? 'bg-transparent text-(--text-default)'
        : 'bg-transparent text-(--text-muted)',
      locked && 'pe-(--spacing-xs)'
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

    model.value = value as TValue
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
        optionRefs.value[index]?.focus()
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

    const key = logicalArrowKey(event.key, dir.value)

    if (key === 'ArrowRight') {
      event.preventDefault()
      moveSelection('next')
      return
    }

    if (key === 'ArrowLeft') {
      event.preventDefault()
      moveSelection('prev')
    }
  }

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
      optionRefs.value = optionRefs.value.slice(0, options.length)
      scheduleIndicatorSync()
    },
    { immediate: true }
  )

  watch(selectedValue, scheduleIndicatorSync)
</script>

<script lang="ts">
  /** One segment; type a list as ToggleGroupOption of the model's union so each value is one of it. A number value is coerced to its string. `locked` draws the trailing lock icon; a disabled option without `locked` still draws it until 7.0. */
  export type ToggleGroupOption<TOptionValue extends string | number = string | number> = {
    label?: string | number
    value?: TOptionValue
    disabled?: boolean
    locked?: boolean
  }

  /** Size token. Sets the group's own height on the 28 / 32 / 40 rhythm. */
  export type ToggleGroupSize = 'small' | 'medium' | 'large'
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    ref="rootRef"
    role="radiogroup"
    :class="rootClasses"
    :data-size="size"
    :data-fluid="fluid || null"
    :data-disabled="disabled || null"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
  >
    <span
      v-show="indicatorVisible"
      :class="indicatorClasses"
      :style="indicatorTransformStyle"
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
      :tabindex="option.value === tabStopValue ? 0 : -1"
      :disabled="option.disabled"
      :class="optionClasses(option.value, option.locked)"
      :data-testid="`${testId}__option`"
      :data-state="option.value === selectedValue ? 'active' : 'inactive'"
      :data-disabled="option.disabled ? '' : undefined"
      @click="selectOption(option.value, option.disabled)"
      @keydown="onOptionKeydown($event, option.value, option.disabled)"
    >
      <span
        aria-hidden="true"
        data-slot="touch-target"
        class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
      />
      <span class="min-w-0 truncate">{{ option.label }}</span>
      <i
        v-if="option.locked"
        class="pi pi-lock shrink-0 text-(--text-disabled)"
        aria-hidden="true"
        :data-testid="`${testId}__option-lock`"
      />
    </button>
  </div>
</template>
