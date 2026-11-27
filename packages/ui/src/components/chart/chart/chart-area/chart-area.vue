<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import {
    areaPath,
    type ChartCurve,
    isFiniteNumber,
    keepIds,
    linePath,
    stackValues
  } from '../../lib'
  import { useChartContext } from '../composables/use-chart-context'
  import ChartSeriesLayer from '../parts/chart-series-layer.vue'

  defineOptions({ name: 'ChartArea', inheritAttrs: false })

  export interface ChartAreaProps {
    /** Ids of the series drawn as areas; empty draws every visible series. */
    ids?: string[]
    /** Stacks the areas on top of each other instead of overlapping them. */
    stacked?: boolean
    /** Edge interpolation between points. */
    curve?: ChartCurve
  }

  const props = withDefaults(defineProps<ChartAreaProps>(), {
    ids: () => [],
    stacked: false,
    curve: 'linear'
  })

  const attrs = useAttrs()
  const ctx = useChartContext()
  const ids = computed<readonly string[]>((previous) => keepIds(previous, props.ids))

  onScopeDispose(
    ctx.registerMark(() => ({
      type: 'area',
      stacked: props.stacked,
      labeled: false,
      ids: ids.value
    }))
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-area')

  const areas = computed(() => {
    const layout = ctx.category.value
    const scale = ctx.valueScale.value
    const base = ctx.baseline.value
    const list = ctx.resolveSeries(ids.value)
    const count = ctx.labels.value.length
    const layers = props.stacked
      ? stackValues(
          list.map((entry) => entry.values),
          count
        )
      : []
    return list.map((entry, order) => {
      const layer = layers[order]
      const upper = entry.values.map((value, index) => {
        if (!isFiniteNumber(value)) return null
        const top = layer ? (layer.upper[index] ?? value) : value
        return [layout.position(index), scale(top)] as const
      })
      const lower = entry.values.map((value, index) => {
        if (!isFiniteNumber(value)) return null
        const bottom = layer ? scale(layer.lower[index] ?? 0) : base
        return [layout.position(index), bottom] as const
      })
      return {
        id: entry.id,
        color: entry.color,
        delay: `calc(${duration['fast-01']} * ${order})`,
        fill: areaPath(upper, lower, props.curve),
        stroke: linePath(upper, props.curve)
      }
    })
  })

  const washOpacity = computed(() => (props.stacked ? 0.24 : 0.1))
</script>

<template>
  <ChartSeriesLayer
    v-bind="$attrs"
    :data-testid="testId"
    :series="areas"
  >
    <template #under="{ item: area }">
      <path
        :d="area.fill"
        :fill="area.color"
        :fill-opacity="washOpacity"
        :data-entered="ctx.entered.value || null"
        :style="{ transitionDelay: area.delay }"
        class="opacity-0 transition-opacity duration-slow-01 ease-productive-entrance motion-reduce:transition-none data-[entered]:opacity-100"
      />
    </template>
  </ChartSeriesLayer>
</template>
