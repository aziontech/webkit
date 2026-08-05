<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'BreadcrumbList',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-breadcrumb-list'
  )
</script>

<template>
  <ol
    v-bind="attrs"
    :class="
      cn(
        'flex min-w-0 flex-nowrap items-center gap-[var(--spacing-xxs)] rounded-[var(--shape-button)]',
        '[&>li]:min-w-0',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
  >
    <slot />
  </ol>
</template>
