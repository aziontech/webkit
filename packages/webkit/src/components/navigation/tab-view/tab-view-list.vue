<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
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

  /** TODO: tokenizar — Figma `--tabview/tabviewnavbg` (transparent nav). */
  const listClasses = computed(() =>
    cn(
      'relative flex shrink-0 items-end gap-spacing-elements-xs bg-transparent',
      attrs.class as string | undefined
    )
  )

  const indicatorClasses = [
    'pointer-events-none absolute left-0 top-0 z-0',
    'rounded-[var(--shape-elements)] bg-[var(--secondary-selected)]',
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
    indicatorOffsetX.value = tabRect.left - listRect.left
    indicatorOffsetY.value = tabRect.top - listRect.top
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

    if (typeof ResizeObserver !== 'undefined' && listRef.value) {
      resizeObserver = new ResizeObserver(() => {
        syncIndicator()
      })
      resizeObserver.observe(listRef.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  watch(indicatorTarget, scheduleIndicatorSync)
  watch(() => context.tabs.value, scheduleIndicatorSync, { deep: true })
</script>

<template>
  <div
    ref="listRef"
    role="tablist"
    :class="listClasses"
    :data-testid="testId"
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
</template>
