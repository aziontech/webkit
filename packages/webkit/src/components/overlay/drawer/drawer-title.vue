<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
  const testId = computed(() => String(attrs['data-testid'] ?? 'drawer-title'))
</script>

<template>
  <h2
    :id="ctx?.titleId"
    :class="cn('text-title-lg text-(--text-default)', attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <slot />
  </h2>
</template>
