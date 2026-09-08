<script setup lang="ts">
  import { computed, inject, useAttrs, useId } from 'vue'

  import { FooterInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FooterColumn',
    inheritAttrs: false
  })

  interface Props {
    /** Column group label, rendered above the links and used as the accessible name of the column landmark. */
    title: string
  }

  defineProps<Props>()

  defineSlots<{
    /** The Footer.Link items of this column. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FooterInjectionKey, null)
  const titleId = useId()

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'layout-footer'}__column`
  )
</script>

<template>
  <nav
    v-bind="$attrs"
    :aria-labelledby="titleId"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-md) border-0 p-(--spacing-lg) md:border-r md:border-r-(length:--border-width-default) md:border-r-(--border-default) md:last:border-r-0"
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
