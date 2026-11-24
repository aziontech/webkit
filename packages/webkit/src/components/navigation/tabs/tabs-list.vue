<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabsContext, TabsInjectionKey, type TabsValue } from './injection-key'

  defineOptions({
    name: 'TabsList',
    inheritAttrs: false
  })

  /** Where the tabs sit in the row. */
  export type TabsListAlign = 'start' | 'center'

  export interface TabsListProps {
    /** Where the tabs sit in the row: `center` for a page whose content below is centred. */
    align?: TabsListAlign
  }

  withDefaults(defineProps<TabsListProps>(), {
    align: 'start'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabsInjectionKey) as TabsContext | null

  if (!context) {
    throw new Error('Tabs.List must be used within Tabs.')
  }

  const listEl = ref<HTMLElement | null>(null)
  const indicatorVisible = ref(false)
  const indicatorWidth = ref(0)
  const indicatorHeight = ref(0)
  const indicatorOffsetX = ref(0)
  const indicatorOffsetY = ref(0)
  const canScrollStart = ref(false)
  const canScrollEnd = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tabs-list')

  const indicatorTarget = computed<TabsValue | null>(() => context.value.value)

  const indicatorTransformStyle = computed(() => ({
    left: '0',
    width: `${indicatorWidth.value}px`,
    height: `${indicatorHeight.value}px`,
    transform: `translate3d(${indicatorOffsetX.value}px, ${indicatorOffsetY.value}px, 0)`
  }))

  const updateScrollAffordance = () => {
    const el = listEl.value
    if (!el) return
    const scrolled = Math.abs(el.scrollLeft)
    canScrollStart.value = scrolled > 1
    canScrollEnd.value = Math.ceil(scrolled + el.clientWidth) < el.scrollWidth - 1
  }

  let resizeObserver: ResizeObserver | null = null

  const LIST_CLASS =
    'relative flex w-full shrink-0 items-end gap-(--spacing-xs) overflow-x-auto bg-transparent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden data-[align=center]:justify-center-safe'

  const scheduleIndicatorSync = () => {
    nextTick(() => {
      observeSizes()
      syncIndicator()
      updateScrollAffordance()
    })
  }

  const syncIndicator = () => {
    const list = listEl.value
    const targetValue = indicatorTarget.value

    if (!list || targetValue === null) {
      indicatorVisible.value = false
      return
    }

    const tab = context.tabs.value.find((entry) => entry.value === targetValue)
    const tabEl = tab?.el.value

    if (!tabEl || tab?.disabled) {
      indicatorVisible.value = false
      return
    }

    const listRect = list.getBoundingClientRect()
    const tabRect = tabEl.getBoundingClientRect()
    const layoutWidth = Number.parseFloat(getComputedStyle(list).width)
    const scale = layoutWidth > 0 && listRect.width > 0 ? listRect.width / layoutWidth : 1

    indicatorWidth.value = tabRect.width / scale
    indicatorHeight.value = tabRect.height / scale
    indicatorOffsetX.value =
      (tabRect.left - listRect.left) / scale - list.clientLeft + list.scrollLeft
    indicatorOffsetY.value = (tabRect.top - listRect.top) / scale - list.clientTop + list.scrollTop
    indicatorVisible.value = true
  }

  const revealTab = (tabEl: HTMLElement | null | undefined) => {
    const list = listEl.value
    if (!list || !tabEl || list.scrollWidth <= list.clientWidth) return
    const listRect = list.getBoundingClientRect()
    const tabRect = tabEl.getBoundingClientRect()
    const edge = Math.min(24, Math.max(0, (listRect.width - tabRect.width) / 2))
    if (tabRect.left < listRect.left + edge) {
      list.scrollLeft -= listRect.left + edge - tabRect.left
    } else if (tabRect.right > listRect.right - edge) {
      list.scrollLeft += tabRect.right - (listRect.right - edge)
    }
  }

  const revealActive = () =>
    revealTab(context.tabs.value.find((entry) => entry.value === indicatorTarget.value)?.el.value)

  const onFocusin = (event: globalThis.FocusEvent) => {
    const tabEl = context.tabs.value.find((entry) => entry.el.value === event.target)?.el.value
    if (!tabEl) return
    nextTick(() => {
      revealTab(tabEl)
      updateScrollAffordance()
    })
  }

  const scheduleReveal = () => {
    nextTick(() => {
      revealActive()
      syncIndicator()
      updateScrollAffordance()
    })
  }

  const observeSizes = () => {
    if (!resizeObserver || !listEl.value) return
    resizeObserver.disconnect()
    resizeObserver.observe(listEl.value)
    for (const tab of context.tabs.value) {
      if (tab.el.value) resizeObserver.observe(tab.el.value)
    }
  }

  onMounted(() => {
    scheduleIndicatorSync()
    scheduleReveal()
    listEl.value?.addEventListener('scroll', updateScrollAffordance, { passive: true })

    if (typeof ResizeObserver !== 'undefined' && listEl.value) {
      resizeObserver = new ResizeObserver(() => {
        syncIndicator()
        updateScrollAffordance()
      })
      observeSizes()
    }
  })

  onBeforeUnmount(() => {
    listEl.value?.removeEventListener('scroll', updateScrollAffordance)
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  watch(indicatorTarget, () => {
    scheduleIndicatorSync()
    scheduleReveal()
  })
  watch(() => context.tabs.value, scheduleIndicatorSync, { deep: true })

  const INDICATOR_CLASS =
    'pointer-events-none absolute top-0 z-0 rounded-(--shape-button) bg-(--secondary-mask) border-(length:--border-width-default) border-(--border-muted) shadow-(--shadow-xs) ' +
    'transition-[transform,width,height] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div class="relative w-full">
    <div
      ref="listEl"
      role="tablist"
      :class="cn(LIST_CLASS, attrs.class as string | undefined)"
      :data-align="align"
      :data-testid="testId"
      :data-fade-start="canScrollStart || null"
      :data-fade-end="canScrollEnd || null"
      @keydown="context.onListKeydown"
      @focusin="onFocusin"
    >
      <span
        v-show="indicatorVisible"
        :class="INDICATOR_CLASS"
        :style="indicatorTransformStyle"
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
