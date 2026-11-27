<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardContent', inheritAttrs: false })

  export interface ChartCardContentProps {
    /** Inner padding; off for an edge-to-edge plot (the same name as Card). */
    padded?: boolean
  }

  const props = withDefaults(defineProps<ChartCardContentProps>(), {
    padded: true
  })

  defineSlots<{
    /** The chart. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  useChartCardContext()

  const unpadded = computed<boolean>(() => !props.padded)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'chart-card-content'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-flush="unpadded || null"
    class="flex min-h-0 flex-1 flex-col p-(--spacing-md) data-[flush]:p-0"
  >
    <slot />
  </div>
</template>
