<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardContent', inheritAttrs: false })

  interface Props {
    /** Inner padding; off for an edge-to-edge plot (the same name as Card). */
    padded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    padded: true
  })

  defineSlots<{
    /** The chart. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  const unpadded = computed<boolean>(() => !props.padded)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__content`
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
