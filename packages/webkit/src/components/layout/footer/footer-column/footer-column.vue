<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  defineOptions({
    name: 'FooterColumn',
    inheritAttrs: false
  })

  export interface FooterColumnProps {
    /** Column group label, rendered above the links and used as the accessible name of the column landmark. */
    title: string
  }

  defineProps<FooterColumnProps>()

  defineSlots<{
    /** The Footer.Link items of this column. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const titleId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'footer-column')
</script>

<template>
  <nav
    v-bind="$attrs"
    :aria-labelledby="titleId"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-md) border-0 p-(--spacing-lg) md:border-e md:border-e-(length:--border-width-default) md:border-e-(--border-default) md:last:border-e-0"
  >
    <span
      :id="titleId"
      class="text-label-sm text-(--text-muted)"
    >
      {{ title }}
    </span>
    <div class="flex flex-col items-start gap-(--spacing-xs)">
      <slot />
    </div>
  </nav>
</template>
