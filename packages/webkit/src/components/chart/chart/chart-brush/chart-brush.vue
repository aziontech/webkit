<script setup lang="ts">
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartBrush', inheritAttrs: false })

  const attrs = useAttrs()
  const ctx = useChartContext()

  onScopeDispose(ctx.registerBrush())

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__brush`
  )

  const band = computed(() => {
    const span = ctx.selection.value
    if (!span) return null
    const layout = ctx.category.value
    const plot = ctx.plot.value
    const half = layout.banded ? layout.bandwidth / 2 : 0
    const edges = [
      layout.position(span[0]) - half,
      layout.position(span[0]) + half,
      layout.position(span[1]) - half,
      layout.position(span[1]) + half
    ]
    const vertical = ctx.orientation.value === 'vertical'
    const low = vertical ? plot.left : plot.top
    const high = vertical ? plot.left + plot.width : plot.top + plot.height
    const from = Math.max(low, Math.min(...edges))
    const to = Math.min(high, Math.max(...edges))
    const length = Math.max(2, to - from)
    return vertical
      ? { x: from, y: plot.top, width: length, height: plot.height }
      : { x: plot.left, y: from, width: plot.width, height: length }
  })
</script>

<template>
  <svg
    v-bind="$attrs"
    :data-testid="testId"
    aria-hidden="true"
    :width="ctx.size.value.width"
    :height="ctx.size.value.height"
    :data-brushing="ctx.brushing.value || null"
    class="pointer-events-none col-start-1 row-start-1 overflow-visible"
  >
    <rect
      v-if="band"
      :x="band.x"
      :y="band.y"
      :width="band.width"
      :height="band.height"
      fill="var(--bg-selected)"
      stroke="var(--border-selected)"
      stroke-width="1"
      shape-rendering="crispEdges"
    />
  </svg>
</template>
