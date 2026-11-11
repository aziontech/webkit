<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardControls', inheritAttrs: false })

  defineSlots<{
    /** The consumer's tags, buttons and dropdown. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__controls`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="ms-auto flex max-w-full shrink-0 flex-wrap items-center gap-(--spacing-xs) @max-xs/chart-card:ms-0 @max-xs/chart-card:w-full"
  >
    <slot />
  </div>
</template>
