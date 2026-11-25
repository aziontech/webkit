<script setup lang="ts">
  import { computed, onScopeDispose, useAttrs } from 'vue'

  import { type ChartThresholdSeverity, isFiniteNumber, thresholdToken } from '../../lib'
  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartReference', inheritAttrs: false })

  export interface ChartReferenceProps {
    /** Value the reference line is drawn at. Leave unset and set `from` and `to` for a band. */
    value?: number
    /** One bound of a reference band, used when `value` is unset. */
    from?: number
    /** The other bound of a reference band, used when `value` is unset. */
    to?: number
    /** Name of the reference, drawn at the end of the line or inside the band and read in the chart summary. */
    label?: string
    /** Colour of the line, band and label: neutral, the status that crossing it means, or a findings level; the same tone as a GaugeChart band. */
    severity?: ChartThresholdSeverity
  }

  const props = withDefaults(defineProps<ChartReferenceProps>(), {
    value: undefined,
    from: undefined,
    to: undefined,
    label: '',
    severity: 'neutral'
  })

  const LABEL_GAP = 4
  const LABEL_ROOM = 16

  const attrs = useAttrs()
  const ctx = useChartContext()

  const bounds = computed(() => {
    if (isFiniteNumber(props.value)) return { low: props.value, high: props.value, band: false }
    if (isFiniteNumber(props.from) && isFiniteNumber(props.to))
      return {
        low: Math.min(props.from, props.to),
        high: Math.max(props.from, props.to),
        band: true
      }
    return null
  })

  onScopeDispose(
    ctx.registerReference(() => (bounds.value ? { ...bounds.value, label: props.label } : null))
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-reference')
  const vertical = computed(() => ctx.orientation.value === 'vertical')
  const plot = computed(() => ctx.plot.value)
  const tone = computed(() => thresholdToken(props.severity))

  const shape = computed(() => {
    const entry = bounds.value
    if (!entry) return null
    const box = plot.value
    const start = vertical.value ? box.top : box.left
    const end = vertical.value ? box.top + box.height : box.left + box.width
    const a = ctx.valueScale.value(entry.low)
    const b = ctx.valueScale.value(entry.high)
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    if (hi < start - 0.5 || lo > end + 0.5) return null
    const near = Math.max(start, lo)
    const far = Math.min(end, hi)
    const edges = (entry.band ? [a, b] : [b])
      .filter((at) => at >= start - 0.5 && at <= end + 0.5)
      .map((at) => Math.round(at) + 0.5)
    return { band: entry.band, near, far, edges, at: edges[0] ?? near }
  })

  const readingsAtEnd = computed<number[]>(() => {
    const last = ctx.category.value.count - 1
    if (last < 0) return []
    return ctx.series.value
      .filter((entry) => !ctx.hidden.value.has(entry.id))
      .map((entry) => entry.values[last])
      .filter(isFiniteNumber)
      .map((value) => ctx.valueScale.value(value))
  })

  const bandLabelY = (near: number, far: number): { y: number; hanging: boolean } => {
    const box = plot.value
    const clear = (top: number) =>
      readingsAtEnd.value.every((at) => at < top - 2 || at > top + LABEL_ROOM + 2)
    const inside = near + LABEL_GAP
    if (far - near >= LABEL_ROOM + LABEL_GAP && clear(inside)) return { y: inside, hanging: true }
    const above = near - LABEL_GAP - LABEL_ROOM
    if (above >= box.top && clear(above)) return { y: near - LABEL_GAP, hanging: false }
    const below = far + LABEL_GAP
    if (below + LABEL_ROOM <= box.top + box.height && clear(below))
      return { y: below, hanging: true }
    return { y: inside, hanging: true }
  }

  const labelBox = computed(() => {
    const current = shape.value
    if (!current || !props.label) return null
    const box = plot.value
    const rtl = ctx.rtl.value
    if (vertical.value) {
      const x = rtl ? box.left + LABEL_GAP : box.left + box.width - LABEL_GAP
      const anchor = rtl ? 'start' : 'end'
      if (current.band) return { x, anchor, ...bandLabelY(current.near, current.far) }
      const above = current.at - box.top > LABEL_ROOM
      return {
        x,
        y: above ? current.at - LABEL_GAP : current.at + LABEL_GAP,
        anchor,
        hanging: !above
      }
    }
    const edge = current.band ? (rtl ? current.far : current.near) : current.at
    return {
      x: rtl ? edge - LABEL_GAP : edge + LABEL_GAP,
      y: box.top + LABEL_GAP,
      anchor: rtl ? 'end' : 'start',
      hanging: true
    }
  })
</script>

<template>
  <svg
    v-bind="$attrs"
    :data-testid="testId"
    :data-severity="severity"
    :data-type="shape ? (shape.band ? 'band' : 'line') : null"
    aria-hidden="true"
    direction="ltr"
    :width="ctx.size.value.width"
    :height="ctx.size.value.height"
    class="pointer-events-none col-start-1 row-start-1 overflow-visible"
  >
    <template v-if="shape">
      <template v-if="shape.band">
        <rect
          v-if="vertical"
          :x="plot.left"
          :y="shape.near"
          :width="plot.width"
          :height="Math.max(0, shape.far - shape.near)"
          :fill="tone"
          fill-opacity="0.12"
          :data-testid="`${testId}__band`"
        />
        <rect
          v-else
          :x="shape.near"
          :y="plot.top"
          :width="Math.max(0, shape.far - shape.near)"
          :height="plot.height"
          :fill="tone"
          fill-opacity="0.12"
          :data-testid="`${testId}__band`"
        />
      </template>
      <g
        :stroke="tone"
        stroke-width="1"
        stroke-dasharray="4 3"
        shape-rendering="crispEdges"
      >
        <template
          v-for="edge in shape.edges"
          :key="edge"
        >
          <line
            v-if="vertical"
            :x1="plot.left"
            :x2="plot.left + plot.width"
            :y1="edge"
            :y2="edge"
            :data-testid="`${testId}__line`"
          />
          <line
            v-else
            :x1="edge"
            :x2="edge"
            :y1="plot.top"
            :y2="plot.top + plot.height"
            :data-testid="`${testId}__line`"
          />
        </template>
      </g>
      <text
        v-if="labelBox"
        :x="labelBox.x"
        :y="labelBox.y"
        :text-anchor="labelBox.anchor"
        :dominant-baseline="labelBox.hanging ? 'hanging' : undefined"
        :fill="tone"
        stroke="var(--bg-surface)"
        stroke-width="3"
        stroke-linejoin="round"
        paint-order="stroke"
        class="text-label-sm tabular-nums"
        :data-testid="`${testId}__label`"
      >
        {{ label }}
      </text>
    </template>
  </svg>
</template>
