<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { type ChartCurve, isFiniteNumber, linePath } from '../../_lib'
  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartLine', inheritAttrs: false })

  interface Props {
    /** Ids of the series drawn as lines; empty draws every visible series. */
    ids?: string[]
    /** Line interpolation between points. */
    curve?: ChartCurve
    /** Draws a marker on every point, not only at the active index. */
    markers?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    ids: () => [],
    curve: 'monotone',
    markers: false
  })

  const attrs = useAttrs()
  const ctx = useChartContext()

  onScopeDispose(
    ctx.registerMark(() => ({ kind: 'line', stacked: false, labeled: false, ids: props.ids }))
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__line`
  )

  const lines = computed(() => {
    const layout = ctx.category.value
    const scale = ctx.valueScale.value
    return ctx.resolveSeries(props.ids).map((entry, order) => {
      const points = entry.values.map((value, index) =>
        isFiniteNumber(value) ? ([layout.position(index), scale(value)] as const) : null
      )
      return {
        id: entry.id,
        color: entry.color,
        delay: `calc(${duration['fast-01']} * ${order})`,
        d: linePath(points, props.curve),
        points
      }
    })
  })

  const dimmed = (id: string) => ctx.emphasized.value !== null && ctx.emphasized.value !== id

  const markersOf = (points: ReadonlyArray<readonly [number, number] | null>) => {
    const active = ctx.activeIndex.value
    return points.flatMap((point, index) =>
      point && (props.markers || index === active) ? [{ index, x: point[0], y: point[1] }] : []
    )
  }
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
      v-for="line in lines"
      :key="line.id"
      :data-series="line.id"
      :data-dimmed="dimmed(line.id) || null"
      class="transition-opacity duration-moderate-01 motion-reduce:transition-none data-[dimmed]:opacity-30"
    >
      <path
        :d="line.d"
        fill="none"
        :stroke="line.color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        :data-entered="ctx.entered.value || null"
        :style="{ transitionDelay: line.delay }"
        class="[stroke-dasharray:1.02_1.02] [stroke-dashoffset:1.02] transition-[stroke-dashoffset] duration-slow-02 ease-productive-entrance motion-reduce:transition-none data-[entered]:[stroke-dashoffset:0]"
      />
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
    </g>
  </svg>
</template>
