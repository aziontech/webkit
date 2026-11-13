<script setup lang="ts">
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardTitle', inheritAttrs: false })

  defineSlots<{
    /** Plain-text title. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  onScopeDispose(ctx.registerTitle())

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__title`
  )
</script>

<template>
  <h3
    v-bind="$attrs"
    :id="ctx.titleId"
    :data-testid="testId"
    class="m-0 min-w-0 flex-1 truncate text-label-md text-(--text-default)"
  >
    <slot />
  </h3>
</template>
