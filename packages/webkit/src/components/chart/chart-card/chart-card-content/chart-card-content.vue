<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardContent', inheritAttrs: false })

  interface Props {
    /** No inner padding, for an edge-to-edge plot. */
    flush?: boolean
  }

  withDefaults(defineProps<Props>(), {
    flush: false
  })

  defineSlots<{
    /** The chart. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__content`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-flush="flush || null"
    class="flex min-h-0 flex-1 flex-col p-(--spacing-md) data-[flush]:p-0"
  >
    <slot />
  </div>
</template>
