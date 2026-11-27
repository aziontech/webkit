<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardControls', inheritAttrs: false })

  defineSlots<{
    /** The consumer's tags, buttons and dropdown. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  useChartCardContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'chart-card-controls'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="ms-auto flex max-w-full shrink-0 flex-wrap items-center gap-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
