<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { barPath, isFiniteNumber, stackValues } from '../../_lib'
  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartBar', inheritAttrs: false })

  interface Props {
    /** Ids of the series drawn as bars; empty draws every visible series. */
    ids?: string[]
    /** Stacks the series in one bar per category instead of grouping them side by side. */
    stacked?: boolean
    /** Draws the formatted value at each bar end, for ordered bars. */
    labeled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    ids: () => [],
    stacked: false,
    labeled: false
  })

  const attrs = useAttrs()
  const ctx = useChartContext()

  onScopeDispose(
    ctx.registerMark(() => ({
      kind: 'bar',
      stacked: props.stacked,
      labeled: props.labeled,
      ids: props.ids
    }))
  )

  const MAX_THICKNESS = 24
  const GAP = 2
  const RADIUS = 4
  const LABEL_OFFSET = 6

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__bar`
  )
  const vertical = computed(() => ctx.orientation.value === 'vertical')

  interface BarMark {
    key: string
    id: string
    index: number
    d: string
    color: string
    delay: string
  }

  interface BarLabel {
    key: number
    x: number
    y: number
    text: string
  }

  const layout = computed(() => {
    const category = ctx.category.value
    const scale = ctx.valueScale.value
    const base = ctx.baseline.value
    const list = ctx.resolveSeries(props.ids)
    const count = ctx.labels.value.length
    const band = category.bandwidth
    const bars: BarMark[] = []
    const labels: BarLabel[] = []
    const isVertical = vertical.value

    const place = (center: number, offset: number, thickness: number, from: number, to: number) => {
      const start = center + offset
      const low = Math.min(from, to)
      const length = Math.abs(to - from)
      return isVertical
        ? barPath(start, low, thickness, length, RADIUS, 'top')
        : barPath(low, start, length, thickness, RADIUS, 'right')
    }

    const delayOf = (index: number) => `calc(${duration['fast-01']} * ${Math.min(index, 12) / 2})`

    if (props.stacked) {
      const thickness = Math.max(2, Math.min(MAX_THICKNESS, band * 0.6))
      const layers = stackValues(
        list.map((entry) => entry.values),
        count
      )
      for (let index = 0; index < count; index += 1) {
        const center = category.position(index)
        let top = -1
        layers.forEach((layer, order) => {
          if ((layer.upper[index] ?? 0) > (layer.lower[index] ?? 0)) top = order
        })
        layers.forEach((layer, order) => {
          const lower = layer.lower[index] ?? 0
          const upper = layer.upper[index] ?? 0
          if (upper <= lower) return
          const entry = list[order]
          if (!entry) return
          const gap = lower > 0 ? GAP : 0
          const from = isVertical ? scale(lower) - gap : scale(lower) + gap
          const to = scale(upper)
          if (Math.abs(to - from) <= 0) return
          const d =
            order === top
              ? place(center, -thickness / 2, thickness, from, to)
              : isVertical
                ? `M${center - thickness / 2},${Math.min(from, to)}h${thickness}v${Math.abs(to - from)}h${-thickness}Z`
                : `M${Math.min(from, to)},${center - thickness / 2}h${Math.abs(to - from)}v${thickness}h${-Math.abs(to - from)}Z`
          bars.push({
            key: `${entry.id}-${index}`,
            id: entry.id,
            index,
            d,
            color: entry.color,
            delay: delayOf(index)
          })
        })
        const total = layers[layers.length - 1]?.upper[index] ?? 0
        if (props.labeled && total > 0) labels.push(labelAt(index, center, scale(total), total))
      }
    } else {
      const series = Math.max(1, list.length)
      const thickness = Math.max(
        2,
        Math.min(MAX_THICKNESS, (band * 0.72 - (series - 1) * GAP) / series)
      )
      const group = series * thickness + (series - 1) * GAP
      for (let index = 0; index < count; index += 1) {
        const center = category.position(index)
        list.forEach((entry, order) => {
          const value = entry.values[index]
          if (!isFiniteNumber(value)) return
          const offset = -group / 2 + order * (thickness + GAP)
          const end = scale(value)
          const d = place(center, offset, thickness, base, end)
          if (!d) return
          bars.push({
            key: `${entry.id}-${index}`,
            id: entry.id,
            index,
            d,
            color: entry.color,
            delay: delayOf(index)
          })
          if (props.labeled && series === 1) labels.push(labelAt(index, center, end, value))
        })
      }
    }

    function labelAt(index: number, center: number, end: number, value: number): BarLabel {
      return isVertical
        ? { key: index, x: center, y: end - LABEL_OFFSET, text: ctx.formatValue(value) }
        : { key: index, x: end + LABEL_OFFSET, y: center, text: ctx.formatValue(value) }
    }

    return { bars, labels }
  })

  const growFrom = computed(() => (vertical.value ? '1 0' : '0 1'))

  const dimmed = (bar: BarMark) => {
    const active = ctx.activeIndex.value
    const emphasized = ctx.emphasized.value
    return (
      (active !== null && active !== bar.index) || (emphasized !== null && emphasized !== bar.id)
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
        class="origin-bottom [scale:var(--chart-bar-from)] [transform-box:fill-box] transition-[scale] duration-slow-01 ease-productive-entrance motion-reduce:transition-none data-[entered]:[scale:1] data-[orientation=horizontal]:origin-left"
      />
    </g>
    <text
      v-for="label in layout.labels"
      :key="label.key"
      :x="label.x"
      :y="label.y"
      :dy="vertical ? undefined : '0.32em'"
      :text-anchor="vertical ? 'middle' : 'start'"
      fill="var(--chart-label)"
      class="text-label-sm tabular-nums"
    >
      {{ label.text }}
    </text>
  </svg>
</template>
