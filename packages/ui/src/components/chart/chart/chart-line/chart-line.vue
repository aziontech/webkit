<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { type ChartCurve, isFiniteNumber, keepIds, linePath } from '../../lib'
  import { useChartContext } from '../composables/use-chart-context'
  import ChartSeriesLayer from '../parts/chart-series-layer.vue'

  defineOptions({ name: 'ChartLine', inheritAttrs: false })

  export interface ChartLineProps {
    /** Ids of the series drawn as lines; empty draws every visible series. */
    ids?: string[]
    /** Line interpolation between points. */
    curve?: ChartCurve
    /** Draws a marker on every point, not only at the active index. */
    markers?: boolean
  }

  const props = withDefaults(defineProps<ChartLineProps>(), {
    ids: () => [],
    curve: 'linear',
    markers: false
  })

  const attrs = useAttrs()
  const ctx = useChartContext()
  const ids = computed<readonly string[]>((previous) => keepIds(previous, props.ids))

  onScopeDispose(
    ctx.registerMark(() => ({ type: 'line', stacked: false, labeled: false, ids: ids.value }))
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-line')

  const lines = computed(() => {
    const layout = ctx.category.value
    const scale = ctx.valueScale.value
    return ctx.resolveSeries(ids.value).map((entry, order) => {
      const points = entry.values.map((value, index) =>
        isFiniteNumber(value) ? ([layout.position(index), scale(value)] as const) : null
      )
      return {
        id: entry.id,
        color: entry.color,
        delay: `calc(${duration['fast-01']} * ${order})`,
        stroke: linePath(points, props.curve),
        points
      }
    })
  })

  const markersOf = (points: ReadonlyArray<readonly [number, number] | null>) => {
    const active = ctx.activeIndex.value
    if (!props.markers) {
      const point = active === null ? null : points[active]
      return point ? [{ index: active as number, x: point[0], y: point[1] }] : []
    }
    return points.flatMap((point, index) => (point ? [{ index, x: point[0], y: point[1] }] : []))
  }
</script>

<template>
  <ChartSeriesLayer
    v-bind="$attrs"
    :data-testid="testId"
    :series="lines"
  >
    <template #over="{ item: line }">
      <circle
        v-for="marker in markersOf(line.points)"
        :key="marker.index"
        :cx="marker.x"
        :cy="marker.y"
        r="4"
        :fill="line.color"
        stroke="var(--bg-surface)"
        stroke-width="2"
      />
    </template>
  </ChartSeriesLayer>
</template>
