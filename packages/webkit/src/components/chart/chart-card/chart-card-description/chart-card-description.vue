<script setup lang="ts">
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardDescription', inheritAttrs: false })

  defineSlots<{
    /** Plain-text description. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  onScopeDispose(ctx.registerDescription())

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__description`
  )
</script>

<template>
  <p
    v-bind="$attrs"
    :id="ctx.descriptionId"
    :data-testid="testId"
    class="m-0 px-(--spacing-md) text-body-sm text-(--text-muted)"
  >
    <slot />
  </p>
</template>
