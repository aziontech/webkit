<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { SidebarInjectionKey } from './injection-key'

  defineOptions({
    name: 'SidebarHeader',
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
      `${ctx?.testId ?? 'layout-sidebar'}__header-region`
  )
</script>

<template>
  <div
    :class="cn('w-full shrink-0', attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
