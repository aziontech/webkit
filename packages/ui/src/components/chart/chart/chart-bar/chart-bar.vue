<script setup lang="ts">
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { keepIds } from '../../lib'
  import { useChartContext } from '../composables/use-chart-context'
  import { barLayout, type BarMark } from './lib/bar-layout'

  defineOptions({ name: 'ChartBar', inheritAttrs: false })

  /** Bar form: `default` draws separate rounded bars, `histogram` solid columns that fill their bucket. */
  export type ChartBarType = 'default' | 'histogram'

  export interface ChartBarProps {
    /** Ids of the series drawn as bars; empty draws every visible series. */
    ids?: string[]
    /** Stacks the series in one bar per category instead of grouping them side by side. */
    stacked?: boolean
    /** Draws the formatted value at each bar end, for ordered bars. */
    showLabels?: boolean
    /** Bar form. `histogram` fills each category band less 1px, stacks segments with no gap, squares both ends and ends the value axis at the tallest column, for event volume over time buckets. */
    type?: ChartBarType
  }

  const props = withDefaults(defineProps<ChartBarProps>(), {
    ids: () => [],
    stacked: false,
    showLabels: false,
    type: 'default'
  })

  const attrs = useAttrs()
  const ctx = useChartContext()
  const ids = computed<readonly string[]>((previous) => keepIds(previous, props.ids))

  onScopeDispose(
    ctx.registerMark(() => ({
      type: 'bar',
      stacked: props.stacked,
      labeled: props.showLabels,
      ids: ids.value,
      fit: props.type === 'histogram'
    }))
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-bar')
  const vertical = computed(() => ctx.orientation.value === 'vertical')
  const histogram = computed(() => props.type === 'histogram')

  const layout = computed(() =>
    barLayout(
      {
        category: ctx.category.value,
        scale: ctx.valueScale.value,
        baseline: ctx.baseline.value,
        series: ctx.resolveSeries(ids.value),
        count: ctx.labels.value.length,
        vertical: vertical.value,
        rtl: ctx.rtl.value,
        histogram: histogram.value,
        showLabels: props.showLabels,
        formatValue: ctx.formatValue
      },
      props.stacked
    )
  )

  const growFrom = computed(() => (vertical.value ? '1 0' : '0 1'))

  const dimmed = (bar: BarMark) => {
    const active = ctx.activeIndex.value
    const emphasized = ctx.emphasized.value
    return (
      (active !== null && active !== bar.index) || (emphasized !== null && emphasized !== bar.id)
    )
  }

  const BAR_CLASS =
    'origin-bottom [scale:var(--chart-bar-from)] [transform-box:fill-box] transition-[scale] duration-slow-01 ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[entered]:[scale:1] ' +
    'data-[orientation=horizontal]:origin-[0%_50%] data-[orientation=horizontal]:data-[rtl]:origin-[100%_50%]'
</script>

<template>
  <svg
    v-bind="$attrs"
    :data-testid="testId"
    :data-type="type"
    aria-hidden="true"
    direction="ltr"
    :width="ctx.size.value.width"
    :height="ctx.size.value.height"
    class="pointer-events-none col-start-1 row-start-1 overflow-visible"
  >
    <g
      v-for="bar in layout.bars"
      :key="bar.key"
      :data-series="bar.id"
      :data-dimmed="dimmed(bar) || null"
      class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[dimmed]:opacity-40"
    >
      <path
        :d="bar.d"
        :fill="bar.color"
        :data-orientation="ctx.orientation.value"
        :data-entered="ctx.entered.value || null"
        :style="{ '--chart-bar-from': growFrom, transitionDelay: bar.delay }"
        :data-rtl="ctx.rtl.value || null"
        :class="BAR_CLASS"
      />
    </g>
    <text
      v-for="label in layout.labels"
      :key="label.key"
      :x="label.x"
      :y="label.y"
      :dy="vertical ? undefined : '0.32em'"
      :text-anchor="vertical ? 'middle' : ctx.rtl.value ? 'end' : 'start'"
      fill="var(--chart-label)"
      class="text-label-sm tabular-nums"
    >
      {{ label.text }}
    </text>
  </svg>
</template>
