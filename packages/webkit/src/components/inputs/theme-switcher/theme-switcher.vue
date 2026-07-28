<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'ThemeSwitcher',
    inheritAttrs: false
  })

  export type ThemeSwitcherValue = 'system' | 'dark' | 'light'

  interface Props {
    /** Selected theme mode. Bind with `v-model:value`. */
    value?: ThemeSwitcherValue
    /** Disables the whole control and applies disabled tokens. */
    disabled?: boolean
    /** Accessible name for the icon-only segmented group. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 'system',
    disabled: false,
    ariaLabel: 'Theme'
  })

  const emit = defineEmits<{
    'update:value': [value: ThemeSwitcherValue]
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-theme-switcher'
  )

  const MODES = [
    { value: 'system', icon: 'pi pi-desktop', label: 'System' },
    { value: 'dark', icon: 'pi pi-moon', label: 'Dark' },
    { value: 'light', icon: 'pi pi-sun', label: 'Light' }
  ] as const

  const rootRef = ref<globalThis.HTMLElement | null>(null)
  const segmentRefs = ref<globalThis.HTMLButtonElement[]>([])
  const indicatorVisible = ref(false)
  const indicatorOffsetX = ref(0)
  const indicatorOffsetY = ref(0)

  const selectedIndex = computed(() => MODES.findIndex((mode) => mode.value === props.value))

  function setSegmentRef(el: globalThis.HTMLButtonElement | null, index: number) {
    if (el) {
      segmentRefs.value[index] = el
    }
  }

  function select(next: ThemeSwitcherValue) {
    if (!props.disabled) {
      emit('update:value', next)
    }
  }

  function focusSegment(index: number) {
    segmentRefs.value[index]?.focus()
  }

  function onKeydown(event: globalThis.KeyboardEvent, index: number) {
    if (props.disabled) {
      return
    }

    const last = MODES.length - 1
    let target: number | null = null

    switch (event.key) {
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
    const activeSegmentEl = segmentRefs.value[selectedIndex.value]

    if (!rootRef.value || !activeSegmentEl || selectedIndex.value < 0) {
      indicatorVisible.value = false
      return
    }

    // offsetLeft/offsetTop are measured from the positioned root's padding edge —
    // the same origin as the indicator's `left-0 top-0` anchor — so the indicator
    // lands exactly over the equally sized segment (no border-width drift that a
    // getBoundingClientRect delta would introduce).
    indicatorOffsetX.value = activeSegmentEl.offsetLeft
    indicatorOffsetY.value = activeSegmentEl.offsetTop
    indicatorVisible.value = true
  }

  function scheduleIndicatorSync() {
    nextTick(() => {
      syncIndicator()
    })
  }

  let resizeObserver: globalThis.ResizeObserver | null = null

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

  watch(() => props.value, scheduleIndicatorSync)

  const ROOT_CLASS =
    'relative inline-flex h-7 w-fit items-center gap-[var(--spacing-xxs)] p-[var(--spacing-xxs)] rounded-full border-solid border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface)]'

  const SEGMENT_CLASS =
    'relative z-[var(--z-input-field)] inline-flex h-5 w-7 shrink-0 items-center justify-center rounded-full cursor-pointer text-label-sm text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] [&:not([data-state=active])]:hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]'
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled || undefined"
    :data-testid="testId"
    :class="cn(ROOT_CLASS, attrs.class as string)"
  >
    <span
      v-show="indicatorVisible"
      aria-hidden="true"
      :data-testid="`${testId}__indicator`"
      :style="{ transform: `translate3d(${indicatorOffsetX}px, ${indicatorOffsetY}px, 0)` }"
      class="pointer-events-none absolute left-0 top-0 z-0 h-5 w-7 rounded-full bg-[var(--bg-selected)] transition-transform duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    />
    <Tooltip
      v-for="(mode, index) in MODES"
      :key="mode.value"
      :text="mode.label"
      placement="bottom"
    >
      <button
        :ref="(el) => setSegmentRef(el as globalThis.HTMLButtonElement | null, index)"
        type="button"
        role="radio"
        :aria-checked="mode.value === value"
        :aria-label="mode.label"
        :data-state="mode.value === value ? 'active' : 'inactive'"
        :tabindex="mode.value === value ? 0 : -1"
        :disabled="disabled"
        :class="SEGMENT_CLASS"
        @click="select(mode.value)"
        @keydown="onKeydown($event, index)"
      >
        <i
          :class="mode.icon"
          class="shrink-0 text-[length:inherit] leading-none"
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  </div>
</template>
