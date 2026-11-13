<script setup lang="ts">
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { useChartContext } from '../composables/use-chart-context'
  import type { ChartAxisKind } from '../injection-key'

  defineOptions({ name: 'ChartAxis', inheritAttrs: false })

  interface Props {
    /** Which axis this is: the category axis or the value axis, by orientation. */
    kind: ChartAxisKind
    /** The most category labels drawn; the rest are thinned. */
    ticks?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    ticks: 6
  })

  const attrs = useAttrs()
  const ctx = useChartContext()

  onScopeDispose(ctx.registerAxis(() => props.kind))

  const LABEL_OFFSET = 8
  const LABEL_DROP = 18
  const LABEL_CHAR_WIDTH = 7
  const LABEL_GUTTER = 12
  const LABEL_SPACING = 16

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__axis-${props.kind}`
  )
  const vertical = computed(() => ctx.orientation.value === 'vertical')
  const plot = computed(() => ctx.plot.value)
  const showsCategories = computed(() => (props.kind === 'x') === vertical.value)

  const truncate = (text: string) => {
    if (vertical.value) return text
    const limit = Math.max(4, Math.floor((plot.value.left - LABEL_GUTTER) / LABEL_CHAR_WIDTH))
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text
  }

  const widest = (texts: string[]) =>
    Math.max(0, ...texts.map((text) => text.length)) * LABEL_CHAR_WIDTH + LABEL_SPACING

  const fitEvery = (count: number, span: number, texts: string[]) => {
    if (count <= 1 || span <= 0) return 1
    return Math.max(1, Math.ceil(widest(texts) / (span / (count - 1))))
  }

  const categoryTicks = computed(() => {
    const layout = ctx.category.value
    const total = ctx.labels.value.length
    const texts = ctx.labels.value.map((label) => truncate(ctx.formatLabel(label)))
    const every = vertical.value
      ? Math.max(
          Math.ceil(total / Math.max(1, props.ticks)),
          fitEvery(total, plot.value.width, texts)
        )
      : 1
    return texts.flatMap((text, index) => {
      if (index % every !== 0) return []
      const at = layout.position(index)
      let anchor: 'start' | 'middle' | 'end' = 'middle'
      if (vertical.value && !layout.banded && total > 1) {
        if (index === 0) anchor = 'start'
        else if (index === total - 1) anchor = 'end'
      }
      return [{ key: index, at, anchor, text }]
    })
  })

  const valueTicks = computed(() => {
    const ticks = ctx.valueTicks.value.map((tick) => ({
      key: tick,
      at: ctx.valueScale.value(tick),
      text: ctx.formatValue(tick)
    }))
    if (vertical.value) return ticks
    const every = fitEvery(
      ticks.length,
      plot.value.width,
      ticks.map((tick) => tick.text)
    )
    return ticks.filter((_, index) => index % every === 0)
  })

  const baseline = computed(() => Math.round(ctx.baseline.value) + 0.5)
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
    <template v-if="showsCategories">
      <line
        v-if="vertical"
        :x1="plot.left"
        :x2="plot.left + plot.width"
        :y1="baseline"
        :y2="baseline"
        stroke="var(--chart-axis)"
        stroke-width="1"
        shape-rendering="crispEdges"
      />
      <line
        v-else
        :x1="baseline"
        :x2="baseline"
        :y1="plot.top"
        :y2="plot.top + plot.height"
        stroke="var(--chart-axis)"
        stroke-width="1"
        shape-rendering="crispEdges"
      />
      <text
        v-for="tick in categoryTicks"
        :key="tick.key"
        :x="vertical ? tick.at : plot.left - LABEL_OFFSET"
        :y="vertical ? plot.top + plot.height + LABEL_DROP : tick.at"
        :dy="vertical ? undefined : '0.32em'"
        :text-anchor="vertical ? tick.anchor : 'end'"
        fill="var(--chart-label)"
        class="text-label-sm"
      >
        {{ tick.text }}
      </text>
    </template>
    <template v-else>
      <text
        v-for="tick in valueTicks"
        :key="tick.key"
        :x="vertical ? plot.left - LABEL_OFFSET : tick.at"
        :y="vertical ? tick.at : plot.top + plot.height + LABEL_DROP"
        :dy="vertical ? '0.32em' : undefined"
        :text-anchor="vertical ? 'end' : 'middle'"
        fill="var(--chart-label)"
        class="text-label-sm tabular-nums"
      >
        {{ tick.text }}
      </text>
    </template>
  </svg>
</template>
