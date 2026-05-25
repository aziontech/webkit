<script setup lang="ts">
  import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabViewContext, TabViewInjectionKey, type TabViewValue } from './injection-key'
  import { getTabViewPanelTransitionStyle, tabViewEnterOffsetClasses } from './presets/transitions'

  defineOptions({
    name: 'TabViewPanel',
    inheritAttrs: false
  })

  interface Props {
    /** Tab value this panel is bound to. */
    value: TabViewValue
  }

  const props = defineProps<Props>()

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabViewInjectionKey) as TabViewContext | null

  if (!context) {
    throw new Error('TabView.Panel must be used within TabView (Root).')
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId}__panel`
  )

  const isActive = computed(() => context.value.value === props.value)

  const panelClasses = computed(() =>
    cn('relative w-full shrink-0', !isActive.value && 'hidden', attrs.class as string | undefined)
  )

  const tabId = computed(() => context.tabId(props.value))
  const panelId = computed(() => context.panelId(props.value))

  const contentKey = computed(() => String(context.value.value))

  const motionReady = ref(false)

  const enterOffsetClass = computed(() => {
    const direction = context.slideDirection.value

    if (direction === 'right') {
      return tabViewEnterOffsetClasses.right
    }

    if (direction === 'left') {
      return tabViewEnterOffsetClasses.left
    }

    return tabViewEnterOffsetClasses.none
  })

  const contentMotionClasses = computed(() =>
    cn(
      'w-full transform motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none',
      motionReady.value ? 'translate-x-0 opacity-100' : cn(enterOffsetClass.value, 'opacity-0')
    )
  )

  const contentTransitionStyle = computed(() => getTabViewPanelTransitionStyle())

  const runEnterMotion = () => {
    motionReady.value = false
    nextTick(() => {
      globalThis.requestAnimationFrame(() => {
        motionReady.value = true
      })
    })
  }

  watch(
    () => context.value.value,
    (activeValue) => {
      if (activeValue === props.value) {
        runEnterMotion()
      }
    },
    { immediate: true }
  )
</script>

<template>
  <div
    role="tabpanel"
    :id="panelId"
    :class="panelClasses"
    :data-testid="testId"
    :data-state="isActive ? 'active' : 'inactive'"
    :aria-labelledby="tabId"
    :hidden="!isActive ? true : undefined"
    tabindex="0"
  >
    <div
      v-if="isActive"
      :key="contentKey"
      :class="contentMotionClasses"
      :style="contentTransitionStyle"
    >
      <slot />
    </div>
  </div>
</template>
