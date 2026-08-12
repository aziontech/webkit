<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { SidebarInjectionKey } from './injection-key'

  defineOptions({
    name: 'SidebarFooter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(SidebarInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      `${ctx?.testId ?? 'layout-sidebar'}__footer-region`
  )

  // The separator above the footer belongs to the Sidebar's footer region, which
  // spans the rail edge-to-edge; this component only lays out its own content.
  const rootClasses = computed(() => cn('w-full shrink-0', attrs.class))
</script>

<template>
  <div
    :class="rootClasses"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
