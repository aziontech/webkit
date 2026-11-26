<script
  setup
  lang="ts"
  generic="T extends { id: string; color: string; delay: string; stroke: string }"
>
  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartSeriesLayer' })

  defineProps<{
    /** One group per entry: its id keys and dims the group, its stroke path draws the line. */
    series: readonly T[]
  }>()

  defineSlots<{
    /** Marks of one series drawn under its line. */
    under(props: { item: T }): unknown
    /** Marks of one series drawn over its line. */
    over(props: { item: T }): unknown
  }>()

  const ctx = useChartContext()
  const dimmed = (id: string) => ctx.emphasized.value !== null && ctx.emphasized.value !== id

  const STROKE_CLASS =
    '[stroke-dasharray:1.02_1.02] [stroke-dashoffset:1.02] transition-[stroke-dashoffset] duration-slow-02 ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[entered]:[stroke-dashoffset:0]'
</script>

<template>
  <svg
    aria-hidden="true"
    :width="ctx.size.value.width"
    :height="ctx.size.value.height"
    class="pointer-events-none col-start-1 row-start-1 overflow-visible"
  >
    <g
      v-for="item in series"
      :key="item.id"
      :data-series="item.id"
      :data-dimmed="dimmed(item.id) || null"
      class="transition-opacity duration-moderate-01 motion-reduce:transition-none data-[dimmed]:opacity-30"
    >
      <slot
        name="under"
        :item="item"
      />
      <path
        :d="item.stroke"
        fill="none"
        :stroke="item.color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        :data-entered="ctx.entered.value || null"
        :style="{ transitionDelay: item.delay }"
        :class="STROKE_CLASS"
      />
      <slot
        name="over"
        :item="item"
      />
    </g>
  </svg>
</template>
