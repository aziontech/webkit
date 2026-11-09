<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartCrosshair', inheritAttrs: false })

  const attrs = useAttrs()
  const ctx = useChartContext()
  const moving = ref(false)

  watch(
    () => ctx.activeIndex.value,
    (next, previous) => {
      moving.value = next !== null && previous !== null
    }
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__crosshair`
  )
  const vertical = computed(() => ctx.orientation.value === 'vertical')
  const plot = computed(() => ctx.plot.value)
  const offset = computed(() => {
    const index = ctx.activeIndex.value
    return index === null ? null : Math.round(ctx.category.value.position(index)) + 0.5
  })
</script>

<template>
  <svg
    v-bind="$attrs"
    :data-testid="testId"
    aria-hidden="true"
    :width="ctx.size.value.width"
    :height="ctx.size.value.height"
    class="pointer-events-none col-start-1 row-start-1 overflow-visible"
  >
    <line
      v-if="offset !== null"
      :x1="vertical ? 0 : plot.left"
      :x2="vertical ? 0 : plot.left + plot.width"
      :y1="vertical ? plot.top : 0"
      :y2="vertical ? plot.top + plot.height : 0"
      :data-moving="moving || null"
      :style="{ translate: vertical ? `${offset}px 0` : `0 ${offset}px` }"
      stroke="var(--chart-crosshair)"
      stroke-width="1"
      shape-rendering="crispEdges"
      class="data-[moving]:transition-[translate] data-[moving]:duration-fast-02 data-[moving]:ease-productive-entrance motion-reduce:transition-none"
    />
  </svg>
</template>
