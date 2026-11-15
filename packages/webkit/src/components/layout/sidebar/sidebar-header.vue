<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'SidebarHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'sidebar-header')
</script>

<template>
  <div
    :class="cn('w-full shrink-0', attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
