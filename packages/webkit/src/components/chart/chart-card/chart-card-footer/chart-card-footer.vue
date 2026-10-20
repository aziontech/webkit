<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardFooter', inheritAttrs: false })

  defineSlots<{
    /** Period, source, or a link. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__footer`
  )
</script>

<template>
  <footer
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-h-12 shrink-0 items-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)"
  >
    <slot />
  </footer>
</template>
