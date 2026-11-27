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
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import { FormValue } from '../../input/parts/form-value'

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
      /** Form field name: a hidden input carries the selected value, so a native form submits it. */
      name?: string
      /** Shows each option's label beside its icon. Set false for icon-only segments: the label stays as the option's accessible name. */
      showLabels?: boolean
    }>(),
    {
      options: () => [],
      ariaLabel: '',
      defaultValue: undefined,
      size: 'large',
      fluid: false,
      disabled: false,
      name: '',
      showLabels: true
    }
  )

  const model = defineModel<TValue | undefined>({ default: undefined })

  const attrs = useAttrs()
  const { t } = useTranslate({ toggleGroup: en.toggleGroup })
  const rootEl = ref<HTMLElement | null>(null)
  const dir = useDirection(rootEl)
  const optionEls = ref<HTMLElement[]>([])
  const indicatorVisible = ref(false)
  const indicatorWidth = ref(0)
  const indicatorHeight = ref(0)
  const indicatorOffsetX = ref(0)
  const indicatorOffsetY = ref(0)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'toggle-group')

  const forwardedAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest['class']
    return rest
  })

  const normalizedOptions = computed(() =>
    props.options
      .filter((option): option is ToggleGroupOption => typeof option === 'object' && !!option)
      .map((option, index) => ({
        label: String(
          option.label ?? option.value ?? t('toggleGroup.option', { index: index + 1 })
        ),
        value: String(option.value ?? option.label ?? index),
        disabled: props.disabled || Boolean(option.disabled),
        locked: Boolean(option.locked),
        icon: option.icon ?? ''
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

  const setOptionEl = (
    element: globalThis.Element | ComponentPublicInstance | null,
    index: number
  ) => {
    const el = resolveOptionElement(element)
    if (el) optionEls.value[index] = el
  }

  const setValue = (value: string) => {
    if (value !== selectedValue.value) model.value = value as TValue
  }

  const selectOption = (value: string, disabled: boolean) => {
    if (!disabled) setValue(value)
  }

  const moveSelection = (direction: 'next' | 'prev' | 'first' | 'last') => {
    if (!normalizedOptions.value.length) {
      return
    }

    const directionStep = direction === 'next' || direction === 'first' ? 1 : -1
    let index =
      direction === 'first'
        ? -1
        : direction === 'last'
          ? normalizedOptions.value.length
          : selectedIndex.value

    for (let i = 0; i < normalizedOptions.value.length; i += 1) {
      index =
        (index + directionStep + normalizedOptions.value.length) % normalizedOptions.value.length
      const option = normalizedOptions.value[index]

      if (!option.disabled) {
        setValue(option.value)
        optionEls.value[index]?.focus()
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

    const move = KEY_MOVES[key]

    if (move) {
      event.preventDefault()
      moveSelection(move)
    }
  }

  const syncIndicator = () => {
    const root = rootEl.value
    const activeOptionEl = optionEls.value[selectedIndex.value]

    if (!root || !activeOptionEl || selectedIndex.value < 0 || !activeOptionEl.offsetParent) {
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

    if (rootEl.value) {
      resizeObserver.observe(rootEl.value)
    }

    optionEls.value.forEach((el) => {
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
      optionEls.value = optionEls.value.slice(0, options.length)
      scheduleIndicatorSync()
    },
    { immediate: true }
  )

  watch(selectedValue, scheduleIndicatorSync)
</script>

<script lang="ts">
  const ROOT_CLASS =
    'group/toggle-group relative inline-flex w-fit max-w-full min-w-0 flex-wrap items-stretch gap-(--spacing-2xs) rounded-(--shape-button) border border-(--border-muted) ' +
    'bg-(--bg-surface) p-(--spacing-2xs) data-[size=small]:min-h-7 data-[size=medium]:min-h-8 data-[size=large]:min-h-10 ' +
    'data-[fluid]:flex data-[fluid]:w-full'

  const resolveOptionElement = (element: unknown): HTMLElement | null => {
    const el = element instanceof HTMLElement ? element : (element as { $el?: unknown } | null)?.$el
    return el instanceof HTMLElement ? el : null
  }

  const KEY_MOVES: Partial<Record<string, 'next' | 'prev' | 'first' | 'last'>> = {
    ArrowRight: 'next',
    ArrowDown: 'next',
    ArrowLeft: 'prev',
    ArrowUp: 'prev',
    Home: 'first',
    End: 'last'
  }

  const INDICATOR_CLASS =
    'pointer-events-none absolute top-0 z-0 rounded-(--shape-button) bg-(--bg-selected) transition-[transform,width,height] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none'

  const OPTION_CLASS =
    'relative z-1 inline-flex items-center justify-center gap-(--spacing-xs) text-center ' +
    'group-data-[size=small]/toggle-group:min-h-4.5 group-data-[size=medium]/toggle-group:min-h-5.5 group-data-[size=large]/toggle-group:min-h-7.5 ' +
    'pointer-coarse:min-h-11! pointer-coarse:min-w-11 group-data-[fluid]/toggle-group:flex-[1_1_auto] ' +
    'rounded-(--shape-button) bg-transparent outline outline-transparent -outline-offset-1 ' +
    'group-data-[size=small]/toggle-group:px-(--spacing-xs) group-data-[size=medium]/toggle-group:px-(--spacing-sm) group-data-[size=large]/toggle-group:px-(--spacing-md) ' +
    'group-data-[size=small]/toggle-group:text-label-sm group-data-[size=medium]/toggle-group:text-label-sm group-data-[size=large]/toggle-group:text-label-md ' +
    'enabled:data-[state=active]:text-(--text-default) enabled:data-[state=inactive]:text-(--text-muted) ' +
    'data-[locked]:pe-(--spacing-xs) ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-(--text-disabled)'

  /**
   * One segment, typed with the model's union. A number value becomes its string; `locked` draws a lock
   * after the label, `disabled` alone draws none; `icon` is an Azion icon class drawn before the label.
   */
  export type ToggleGroupOption<TOptionValue extends string | number = string | number> = {
    label?: string | number
    value?: TOptionValue
    disabled?: boolean
    locked?: boolean
    icon?: string
  }

  /** Size token. Sets the group's own height on the 28 / 32 / 40 rhythm. */
  export type ToggleGroupSize = 'small' | 'medium' | 'large'
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    ref="rootEl"
    role="radiogroup"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-size="size"
    :data-fluid="fluid || null"
    :data-disabled="disabled || null"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
  >
    <span
      v-show="indicatorVisible"
      :class="INDICATOR_CLASS"
      :style="indicatorTransformStyle"
      :data-testid="`${testId}__indicator`"
      aria-hidden="true"
    />
    <button
      v-for="(option, index) in normalizedOptions"
      :key="option.value"
      :ref="(element) => setOptionEl(element, index)"
      type="button"
      role="radio"
      :aria-checked="option.value === selectedValue"
      :tabindex="option.value === tabStopValue ? 0 : -1"
      :disabled="option.disabled"
      :data-testid="`${testId}__option`"
      :data-state="option.value === selectedValue ? 'active' : 'inactive'"
      :title="!showLabels && option.icon ? option.label : undefined"
      :data-disabled="option.disabled ? '' : undefined"
      :data-locked="option.locked || null"
      :class="OPTION_CLASS"
      @click="selectOption(option.value, option.disabled)"
      @keydown="onOptionKeydown($event, option.value, option.disabled)"
    >
      <span
        aria-hidden="true"
        data-slot="touch-target"
        class="absolute hidden inset-x-0 inset-y-[min(0rem,calc(50%-22px))] pointer-coarse:block"
      />
      <i
        v-if="option.icon"
        :class="[option.icon, 'shrink-0']"
        aria-hidden="true"
      />
      <span
        v-if="showLabels || !option.icon"
        class="min-w-0 wrap-anywhere"
        >{{ option.label }}</span
      >
      <span
        v-else
        class="sr-only"
        >{{ option.label }}</span
      >
      <i
        v-if="option.locked"
        class="az az-lock shrink-0 text-(--text-disabled)"
        aria-hidden="true"
        :data-testid="`${testId}__option-lock`"
      />
    </button>
    <FormValue
      :name="name"
      :value="selectedValue"
      :disabled="disabled"
    />
  </div>
</template>
