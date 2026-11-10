<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardHeader', inheritAttrs: false })

  defineSlots<{
    /** Handle, title and controls in reading order. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__header`
  )
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-h-12 shrink-0 items-center gap-(--spacing-xs) px-(--spacing-md) pt-(--spacing-sm)"
  >
    <slot />
  </header>
</template>
