<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { type TabViewContext, TabViewInjectionKey } from './injection-key'

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

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId}__list`
  )

  /** TODO: tokenizar — Figma `--tabview/tabviewnavbg` (transparent nav). */
  const listClasses = computed(() =>
    cn(
      'flex shrink-0 items-end gap-spacing-elements-xs bg-transparent',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    role="tablist"
    :class="listClasses"
    :data-testid="testId"
    @keydown="context.onListKeydown"
  >
    <slot />
  </div>
</template>
