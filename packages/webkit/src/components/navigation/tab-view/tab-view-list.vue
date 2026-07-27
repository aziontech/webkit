<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabViewContext, TabViewInjectionKey, type TabViewValue } from './injection-key'
  import { getTabViewIndicatorTransitionStyle } from './presets/transitions'

  defineOptions({
    name: 'TabViewList',
    inheritAttrs: false
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabViewInjectionKey) as TabViewContext | null

  if (!context) {
    throw new Error('TabView.List must be used within TabView (Root).')
  }

  const listRef = ref<HTMLElement | null>(null)
  const indicatorVisible = ref(false)
  const indicatorWidth = ref(0)
  const indicatorHeight = ref(0)
  const indicatorOffsetX = ref(0)
  const indicatorOffsetY = ref(0)
  const canScrollStart = ref(false)
  const canScrollEnd = ref(false)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId}__list`
  )

  const indicatorTarget = computed<TabViewValue | null>(() => context.value.value)

  const indicatorTransitionStyle = computed(() => getTabViewIndicatorTransitionStyle())

  const indicatorTransformStyle = computed(() => ({
    width: `${indicatorWidth.value}px`,
    height: `${indicatorHeight.value}px`,
    transform: `translate3d(${indicatorOffsetX.value}px, ${indicatorOffsetY.value}px, 0)`
  }))

  // Edge-fade affordance (same intent as the table's frozen-edge gradient): a gradient
  // overlay on the scrollable side(s) fades the tabs into the nav background, hinting at
  // off-screen tabs. Rendered as elements (not a mask) so their appearance/removal can use
  // the semantic fade-in / fade-out animation utilities; a non-scrollable edge renders
  // nothing, so the first / last tab is never covered at rest.
  const updateScrollAffordance = () => {
    const el = listRef.value
    if (!el) return
    canScrollStart.value = el.scrollLeft > 1
    canScrollEnd.value = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1
  }

  /**
   * TODO: tokenizar — Figma `--tabview/tabviewnavbg` (transparent nav).
   * `overflow-x-auto` lets the tab row scroll horizontally on narrow (mobile) viewports
   * instead of overflowing; the scrollbar is hidden so the bar stays clean, and the tabs
   * remain `shrink-0` so they keep their intrinsic width and scroll rather than compress.
   */
  const listClasses = computed(() =>
    cn(
      'relative flex w-full shrink-0 items-end gap-[var(--spacing-xs)] overflow-x-auto bg-transparent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      attrs.class as string | undefined
    )
  )

  const indicatorClasses = [
    'pointer-events-none absolute left-0 top-0 z-0',
    'rounded-[var(--shape-button)] bg-[var(--secondary-selected)]',
    'motion-reduce:transition-none'
  ]

  const syncIndicator = () => {
    const listEl = listRef.value
    const targetValue = indicatorTarget.value

    if (!listEl || targetValue === null) {
      indicatorVisible.value = false
      return
    }

    const tab = context.tabs.value.find((entry) => entry.value === targetValue)
    const tabEl = tab?.el.value

    if (!tabEl || tab?.disabled) {
      indicatorVisible.value = false
      return
    }

    const listRect = listEl.getBoundingClientRect()
    const tabRect = tabEl.getBoundingClientRect()

    indicatorWidth.value = tabRect.width
    indicatorHeight.value = tabRect.height
    // Offsets are relative to the list's scrolled content origin (add scrollLeft/Top), so
    // the absolutely-positioned indicator — which scrolls with the content — stays aligned
    // with its tab when the list scrolls horizontally on mobile.
    indicatorOffsetX.value = tabRect.left - listRect.left + listEl.scrollLeft
    indicatorOffsetY.value = tabRect.top - listRect.top + listEl.scrollTop
    indicatorVisible.value = true
  }

  const scheduleIndicatorSync = () => {
    nextTick(() => {
      syncIndicator()
      updateScrollAffordance()
    })
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    scheduleIndicatorSync()
    listRef.value?.addEventListener('scroll', updateScrollAffordance, { passive: true })

    if (typeof ResizeObserver !== 'undefined' && listRef.value) {
      resizeObserver = new ResizeObserver(() => {
        syncIndicator()
        updateScrollAffordance()
      })
      resizeObserver.observe(listRef.value)
    }
  })

  onBeforeUnmount(() => {
    listRef.value?.removeEventListener('scroll', updateScrollAffordance)
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  watch(indicatorTarget, scheduleIndicatorSync)
  watch(() => context.tabs.value, scheduleIndicatorSync, { deep: true })
</script>

<template>
  <div class="relative w-full">
    <div
      ref="listRef"
      role="tablist"
      :class="listClasses"
      :data-testid="testId"
      :data-fade-start="canScrollStart || null"
      :data-fade-end="canScrollEnd || null"
      @keydown="context.onListKeydown"
    >
      <span
        v-show="indicatorVisible"
        :class="indicatorClasses"
        :style="[indicatorTransitionStyle, indicatorTransformStyle]"
        :data-testid="`${testId}__indicator`"
        aria-hidden="true"
      />
      <slot />
    </div>

    <Transition
      enter-active-class="animate-fade-in motion-reduce:animate-none"
      leave-active-class="animate-fade-out motion-reduce:animate-none"
    >
      <span
        v-if="canScrollStart"
        :data-testid="`${testId}__fade-start`"
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 left-0 z-10 w-[var(--spacing-6)] bg-gradient-to-r from-[var(--bg-canvas)] to-transparent"
      />
    </Transition>
    <Transition
      enter-active-class="animate-fade-in motion-reduce:animate-none"
      leave-active-class="animate-fade-out motion-reduce:animate-none"
    >
      <span
        v-if="canScrollEnd"
        :data-testid="`${testId}__fade-end`"
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 right-0 z-10 w-[var(--spacing-6)] bg-gradient-to-l from-[var(--bg-canvas)] to-transparent"
      />
    </Transition>
  </div>
</template>
