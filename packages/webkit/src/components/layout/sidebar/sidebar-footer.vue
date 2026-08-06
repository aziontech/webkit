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

  const rootClasses = computed(() =>
    cn(
      'w-full shrink-0',
      // Inside a collapsible sidebar the band — separator plus the space above it — is the
      // sidebar's own footer region, which wraps the collapse trigger as well. Adding it here
      // too would draw a line that stops short of the trigger and push this content half a
      // padding below the trigger it is meant to line up with.
      ctx?.collapsible ? undefined : 'border-t border-[var(--border-muted)] pt-[var(--spacing-md)]',
      attrs.class
    )
  )
</script>

<template>
  <div
    :class="rootClasses"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
