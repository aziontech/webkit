<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabViewContext, TabViewInjectionKey } from './injection-key'

  defineOptions({
    name: 'TabViewContent',
    inheritAttrs: false
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabViewInjectionKey) as TabViewContext | null

  if (!context) {
    throw new Error('TabView.Content must be used within TabView (Root).')
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId}__content`
  )

  const contentClasses = computed(() =>
    cn('relative isolate w-full', attrs.class as string | undefined)
  )
</script>

<template>
  <div
    :class="contentClasses"
    :data-testid="testId"
    data-tab-view-content=""
  >
    <slot />
  </div>
</template>
