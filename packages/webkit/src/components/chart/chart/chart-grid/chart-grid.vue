<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartGrid', inheritAttrs: false })

  const attrs = useAttrs()
  const ctx = useChartContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__grid`
  )
  const vertical = computed(() => ctx.orientation.value === 'vertical')
  const plot = computed(() => ctx.plot.value)
  const lines = computed(() =>
    ctx.valueTicks.value.map((tick) => ({
      tick,
      at: Math.round(ctx.valueScale.value(tick)) + 0.5
    }))
  )
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
    <g
      stroke="var(--chart-grid)"
      stroke-width="1"
      shape-rendering="crispEdges"
    >
      <template
        v-for="line in lines"
        :key="line.tick"
      >
        <line
          v-if="vertical"
          :x1="plot.left"
          :x2="plot.left + plot.width"
          :y1="line.at"
          :y2="line.at"
        />
        <line
          v-else
          :x1="line.at"
          :x2="line.at"
          :y1="plot.top"
          :y2="plot.top + plot.height"
        />
      </template>
    </g>
  </svg>
</template>
