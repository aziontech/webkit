<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabsContext, TabsInjectionKey, type TabsValue } from './injection-key'
  import { getTabViewIndicatorTransitionStyle } from './presets/transitions'

  defineOptions({
    name: 'TabsList',
    inheritAttrs: false
  })

  /** Where the tabs sit in the row. */
  export type TabsListAlign = 'start' | 'center'

  interface Props {
    /** Where the tabs sit in the row: `center` for a page whose content below is centred. */
    align?: TabsListAlign
  }

  withDefaults(defineProps<Props>(), {
    align: 'start'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabsInjectionKey) as TabsContext | null

  if (!context) {
    throw new Error('Tabs.List must be used within Tabs (Root).')
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

  const indicatorTarget = computed<TabsValue | null>(() => context.value.value)

  const indicatorTransitionStyle = computed(() => getTabViewIndicatorTransitionStyle())

  const indicatorTransformStyle = computed(() => ({
    left: '0',
    width: `${indicatorWidth.value}px`,
    height: `${indicatorHeight.value}px`,
    transform: `translate3d(${indicatorOffsetX.value}px, ${indicatorOffsetY.value}px, 0)`
  }))

  const updateScrollAffordance = () => {
    const el = listRef.value
    if (!el) return
    const scrolled = Math.abs(el.scrollLeft)
    canScrollStart.value = scrolled > 1
    canScrollEnd.value = Math.ceil(scrolled + el.clientWidth) < el.scrollWidth - 1
  }

  const listClasses = computed(() =>
    cn(
      'relative flex w-full shrink-0 items-end gap-(--spacing-xs) overflow-x-auto bg-transparent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden data-[align=center]:justify-center-safe',
      attrs.class as string | undefined
    )
  )

  const indicatorClasses = [
    'pointer-events-none absolute top-0 z-0',
    'rounded-(--shape-button) bg-(--secondary-mask)',
    'border-(length:--border-width-default) border-(--border-muted)',
    'shadow-(--shadow-xs)',
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
      :data-align="align"
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
        class="pointer-events-none absolute inset-y-0 start-0 z-10 w-(--spacing-6) bg-gradient-to-r from-(--bg-canvas) to-transparent rtl:bg-gradient-to-l"
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
        class="pointer-events-none absolute inset-y-0 end-0 z-10 w-(--spacing-6) bg-gradient-to-l from-(--bg-canvas) to-transparent rtl:bg-gradient-to-r"
      />
    </Transition>
  </div>
</template>
