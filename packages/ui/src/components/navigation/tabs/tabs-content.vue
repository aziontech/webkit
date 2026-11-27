<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabsContext, TabsInjectionKey, type TabsValue } from './injection-key'

  defineOptions({
    name: 'TabsContent',
    inheritAttrs: false
  })

  export interface TabsContentProps {
    /** Tab value this panel is bound to. */
    value: TabsValue
  }

  const props = defineProps<TabsContentProps>()

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabsInjectionKey) as TabsContext | null

  if (!context) {
    throw new Error('Tabs.Content must be used within Tabs.')
  }

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tabs-content')

  const isActive = computed(() => context.value.value === props.value)

  const passthroughAttrs = computed(() => {
    const { class: omittedClass, ...rest } = attrs
    void omittedClass
    return rest
  })

  const tabId = computed(() => context.tabId(props.value))
  const panelId = computed(() => context.panelId(props.value))

  context.registerPanel(props.value)
  onBeforeUnmount(() => context.unregisterPanel(props.value))

  const contentKey = computed(() => String(context.value.value))

  const motionReady = ref(true)

  const slide = computed(() => {
    const direction = context.slideDirection.value
    if (direction === 'right') return 'end'
    if (direction === 'left') return 'start'
    return undefined
  })

  const runEnterMotion = () => {
    motionReady.value = false
    if (typeof globalThis.requestAnimationFrame !== 'function') return
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
    }
  )

  const PANEL_CLASS =
    'w-full translate-x-0 opacity-100 transition-[translate,opacity] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none motion-safe:data-[motion=enter]:opacity-0 motion-safe:data-[slide=end]:translate-x-(--spacing-md) ' +
    'motion-safe:data-[slide=start]:-translate-x-(--spacing-md) motion-safe:rtl:data-[slide=end]:-translate-x-(--spacing-md) ' +
    'motion-safe:rtl:data-[slide=start]:translate-x-(--spacing-md)'
</script>

<template>
  <div
    tabindex="0"
    v-bind="passthroughAttrs"
    role="tabpanel"
    :id="panelId"
    :class="
      cn(
        'relative w-full shrink-0 pt-(--layout-group-gap) data-[state=inactive]:hidden',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
    :data-state="isActive ? 'active' : 'inactive'"
    :aria-labelledby="tabId"
    :hidden="!isActive ? true : undefined"
  >
    <div
      v-if="isActive"
      :key="contentKey"
      :data-motion="motionReady ? undefined : 'enter'"
      :data-slide="motionReady ? undefined : slide"
      :class="PANEL_CLASS"
    >
      <slot />
    </div>
  </div>
</template>
