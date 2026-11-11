<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { isFiniteNumber } from '../../_lib'
  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartScatter', inheritAttrs: false })

  interface Props {
    /** Ids of the series drawn as dots; empty draws every visible series. */
    ids?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    ids: () => []
  })

  const attrs = useAttrs()
  const ctx = useChartContext()

  onScopeDispose(
    ctx.registerMark(() => ({ kind: 'scatter', stacked: false, labeled: false, ids: props.ids }))
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__scatter`
  )

  const groups = computed(() => {
    const layout = ctx.category.value
    const scale = ctx.valueScale.value
    const vertical = ctx.orientation.value === 'vertical'
    return ctx.resolveSeries(props.ids).map((entry, order) => ({
      id: entry.id,
      color: entry.color,
      delay: `calc(${duration['fast-01']} * ${order})`,
      dots: entry.values.flatMap((value, index) => {
        if (!isFiniteNumber(value)) return []
        const along = layout.position(index)
        const across = scale(value)
        return [{ index, x: vertical ? along : across, y: vertical ? across : along }]
      })
    }))
  })

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
      v-for="group in groups"
      :key="group.id"
      :data-series="group.id"
      :data-dimmed="dimmed(group.id) || null"
      :data-entered="ctx.entered.value || null"
      :style="{ transitionDelay: group.delay }"
      class="opacity-0 transition-opacity duration-slow-01 ease-productive-entrance motion-reduce:transition-none data-[entered]:opacity-100 data-[entered]:data-[dimmed]:opacity-30"
    >
      <circle
        v-for="dot in group.dots"
        :key="dot.index"
        :cx="dot.x"
        :cy="dot.y"
        :r="ctx.activeIndex.value === dot.index ? 6 : 4"
        :fill="group.color"
        :data-active="ctx.activeIndex.value === dot.index || null"
        stroke="var(--bg-surface)"
        stroke-width="1.5"
      />
    </g>
  </svg>
</template>
