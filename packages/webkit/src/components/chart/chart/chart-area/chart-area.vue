<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { areaPath, type ChartCurve, isFiniteNumber, linePath, stackValues } from '../../_lib'
  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartArea', inheritAttrs: false })

  interface Props {
    /** Ids of the series drawn as areas; empty draws every visible series. */
    ids?: string[]
    /** Stacks the areas on top of each other instead of overlapping them. */
    stacked?: boolean
    /** Edge interpolation between points. */
    curve?: ChartCurve
  }

  const props = withDefaults(defineProps<Props>(), {
    ids: () => [],
    stacked: false,
    curve: 'monotone'
  })

  const attrs = useAttrs()
  const ctx = useChartContext()

  onScopeDispose(
    ctx.registerMark(() => ({
      kind: 'area',
      stacked: props.stacked,
      labeled: false,
      ids: props.ids
    }))
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__area`
  )

  const areas = computed(() => {
    const layout = ctx.category.value
    const scale = ctx.valueScale.value
    const base = ctx.baseline.value
    const list = ctx.resolveSeries(props.ids)
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
        edge: linePath(upper, props.curve)
      }
    })
  })

  const washOpacity = computed(() => (props.stacked ? 0.24 : 0.1))
  const dimmed = (id: string) => ctx.emphasized.value !== null && ctx.emphasized.value !== id
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
      v-for="area in areas"
      :key="area.id"
      :data-series="area.id"
      :data-dimmed="dimmed(area.id) || null"
      class="transition-opacity duration-moderate-01 motion-reduce:transition-none data-[dimmed]:opacity-30"
    >
      <path
        :d="area.fill"
        :fill="area.color"
        :fill-opacity="washOpacity"
        :data-entered="ctx.entered.value || null"
        :style="{ transitionDelay: area.delay }"
        class="opacity-0 transition-opacity duration-slow-01 ease-productive-entrance motion-reduce:transition-none data-[entered]:opacity-100"
      />
      <path
        :d="area.edge"
        fill="none"
        :stroke="area.color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        :data-entered="ctx.entered.value || null"
        :style="{ transitionDelay: area.delay }"
        class="[stroke-dasharray:1.02_1.02] [stroke-dashoffset:1.02] transition-[stroke-dashoffset] duration-slow-02 ease-productive-entrance motion-reduce:transition-none data-[entered]:[stroke-dashoffset:0]"
      />
    </g>
  </svg>
</template>
