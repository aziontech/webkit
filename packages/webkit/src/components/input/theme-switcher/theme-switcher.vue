<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'ThemeSwitcher',
    inheritAttrs: false
  })

  export type ThemeSwitcherValue = 'system' | 'dark' | 'light'

  /** Size token. Sets the control's height on the 28 / 32 / 40 rhythm every other control uses. */
  export type ThemeSwitcherSize = 'small' | 'medium' | 'large'

  export interface ThemeSwitcherProps {
    /** Size token, matching the height of a neighbouring IconButton, Select or ToggleGroup of the same size. */
    size?: ThemeSwitcherSize
    /** Disables the whole control and applies disabled tokens. */
    disabled?: boolean
    /** Accessible name for the icon-only segmented group. Empty uses the locale catalog (`Theme`). */
    ariaLabel?: string
  }
  const props = withDefaults(defineProps<ThemeSwitcherProps>(), {
    size: 'medium',
    disabled: false,
    ariaLabel: ''
  })

  const model = defineModel<ThemeSwitcherValue>({ default: 'system' })

  const attrs = useAttrs()
  const dir = useDirection()
  const { t } = useTranslate({ themeSwitcher: en.themeSwitcher })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'theme-switcher')

  const MODES = [
    { value: 'system', icon: 'az az-desktop', key: 'themeSwitcher.system' },
    { value: 'dark', icon: 'az az-moon', key: 'themeSwitcher.dark' },
    { value: 'light', icon: 'az az-sun', key: 'themeSwitcher.light' }
  ] as const

  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const segmentEls = ref<globalThis.HTMLButtonElement[]>([])
  const indicator = ref<Record<string, string> | null>(null)

  const selectedIndex = computed(() => MODES.findIndex((mode) => mode.value === model.value))

  function setSegmentEl(el: globalThis.HTMLButtonElement | null, index: number) {
    if (el) {
      segmentEls.value[index] = el
    }
  }

  function select(next: ThemeSwitcherValue) {
    if (!props.disabled) {
      model.value = next
    }
  }

  function focusSegment(index: number) {
    segmentEls.value[index]?.focus()
  }

  function onKeydown(event: globalThis.KeyboardEvent, index: number) {
    if (props.disabled) {
      return
    }

    const last = MODES.length - 1
    let target: number | null = null

    switch (logicalArrowKey(event.key, dir.value)) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = index === last ? 0 : index + 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        target = index === 0 ? last : index - 1
        break
      case 'Home':
        target = 0
        break
      case 'End':
        target = last
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        select(MODES[index].value)
        return
      default:
        return
    }

    event.preventDefault()
    select(MODES[target].value)
    focusSegment(target)
  }

  function syncIndicator() {
    const activeSegmentEl = segmentEls.value[selectedIndex.value]

    indicator.value =
      rootEl.value && activeSegmentEl
        ? {
            left: '0',
            width: `${activeSegmentEl.offsetWidth}px`,
            height: `${activeSegmentEl.offsetHeight}px`,
            transform: `translate3d(${activeSegmentEl.offsetLeft}px, ${activeSegmentEl.offsetTop}px, 0)`
          }
        : null
  }

  function scheduleIndicatorSync() {
    nextTick(() => {
      syncIndicator()
    })
  }

  let resizeObserver: globalThis.ResizeObserver | null = null

  onMounted(() => {
    scheduleIndicatorSync()

    if (typeof ResizeObserver !== 'undefined' && rootEl.value) {
      resizeObserver = new ResizeObserver(() => {
        syncIndicator()
      })
      resizeObserver.observe(rootEl.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  watch(() => [model.value, props.size], scheduleIndicatorSync)

  const ROOT_CLASS =
    'group relative inline-flex w-fit shrink-0 items-stretch gap-(--spacing-2xs) p-(--spacing-2xs) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10'

  const SEGMENT_CLASS =
    'relative z-(--z-control) inline-flex shrink-0 items-center justify-center rounded-(--shape-button) cursor-pointer group-data-[size=small]:w-6 group-data-[size=medium]:w-7 group-data-[size=large]:w-9 text-label-sm group-data-[size=large]:text-label-md data-[state=active]:text-(--text-default) data-[state=inactive]:text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) [&:not([data-state=active])]:hover:bg-(--bg-hover) hover:text-(--text-default) disabled:cursor-not-allowed disabled:text-(--text-disabled)'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    role="radiogroup"
    :aria-label="ariaLabel || t('themeSwitcher.label')"
    :aria-disabled="disabled || undefined"
    :data-size="size"
    :data-disabled="disabled || undefined"
    :data-testid="testId"
    :class="cn(ROOT_CLASS, attrs.class as string)"
  >
    <span
      v-show="indicator"
      aria-hidden="true"
      :data-testid="`${testId}__indicator`"
      :style="indicator ?? undefined"
      class="pointer-events-none absolute top-0 z-0 rounded-(--shape-button) bg-(--bg-selected) transition-transform duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    />
    <Tooltip
      v-for="(mode, index) in MODES"
      :key="mode.value"
      :content="t(mode.key)"
      side="bottom"
    >
      <button
        :ref="(el) => setSegmentEl(el as globalThis.HTMLButtonElement | null, index)"
        type="button"
        role="radio"
        :aria-checked="mode.value === model"
        :aria-label="t(mode.key)"
        :data-state="mode.value === model ? 'active' : 'inactive'"
        :tabindex="mode.value === model ? 0 : -1"
        :disabled="disabled"
        :class="SEGMENT_CLASS"
        @click="select(mode.value)"
        @keydown="onKeydown($event, index)"
      >
        <span
          aria-hidden="true"
          data-slot="touch-target"
          class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
        />
        <i
          :class="mode.icon"
          class="shrink-0 text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  </div>
</template>
