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
        // A long segment has to be able to shrink and ellipsize instead of
        // pushing the trail past the viewport, and the shrink chain only works
        // if every flex level can go below its content width. The list owns the
        // rule for its own children so it holds for a hand-composed trail too,
        // where the <li> comes from the consumer.
        '[&>li]:min-w-0',
        // Escalation for a trail that cannot fit even fully ellipsized (many
        // segments on a narrow screen): scroll the row instead of bleeding it
        // off-screen. Shrinking happens first, so the scrollbar only appears
        // once truncation is exhausted.
        'overflow-x-auto',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
  >
    <slot />
  </ol>
</template>
