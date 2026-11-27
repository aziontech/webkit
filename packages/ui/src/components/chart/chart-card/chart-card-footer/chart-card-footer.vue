<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardFooter', inheritAttrs: false })

  defineSlots<{
    /** Period, source, or a link. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  useChartCardContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-card-footer')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-h-12 shrink-0 flex-wrap items-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)"
  >
    <slot />
  </div>
</template>
