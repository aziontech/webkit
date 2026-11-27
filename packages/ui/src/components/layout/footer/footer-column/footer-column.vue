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

  const ROOT_CLASS =
    'flex min-w-0 flex-col gap-(--spacing-md) border-0 p-(--spacing-lg) md:border-e md:border-e-(length:--border-width-default) md:border-e-(--border-default) md:last:border-e-0 ' +
    'group-data-[variant=console]/footer:md:border-e-0 group-data-[variant=console]/footer:p-0'

  const LINKS_CLASS =
    'flex flex-col items-start gap-(--spacing-xs) pointer-coarse:gap-0 ' +
    'group-data-[variant=console]/footer:flex-row group-data-[variant=console]/footer:flex-wrap group-data-[variant=console]/footer:items-center ' +
    'group-data-[variant=console]/footer:gap-x-(--spacing-md)'
</script>

<template>
  <nav
    v-bind="$attrs"
    :aria-labelledby="titleId"
    :data-testid="testId"
    :class="ROOT_CLASS"
  >
    <span
      :id="titleId"
      class="text-label-sm text-(--text-muted) group-data-[variant=console]/footer:sr-only"
    >
      {{ title }}
    </span>
    <div :class="LINKS_CLASS">
      <slot />
    </div>
  </nav>
</template>
