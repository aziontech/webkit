<script setup lang="ts">
  import { usePreferredReducedMotion, useResizeObserver } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, useId } from 'vue'

  import {
    areaPath,
    barPath,
    categoryLayout,
    type ChartColor,
    colorToken,
    isFiniteNumber,
    linearScale,
    linePath
  } from '../_lib'

  defineOptions({ name: 'SparkChart', inheritAttrs: false })

  /** Mark drawn for the series. */
  export type SparkChartKind = 'area' | 'line' | 'bar'
  /** Height of the spark: 32, 48 or 64 pixels. */
  export type SparkChartSize = 'small' | 'medium' | 'large'

  interface Props {
    /** The series, oldest first; null leaves a gap. */
    values?: (number | null)[]
    /** Mark drawn for the series. */
    kind?: SparkChartKind
    /** Hue of the mark: a categorical slot (1–6), other, or a status. */
    color?: ChartColor
    /** Height: 32, 48 or 64 pixels. Width follows the container. */
    size?: SparkChartSize
    /** Starts the value range at zero instead of the lowest value; bars always start at zero. */
    fromZero?: boolean
    /** Accessible name; when set the chart is an image, when empty it is decorative. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    values: () => [],
    kind: 'area',
    color: 1,
    size: 'medium',
    fromZero: false,
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const gradientId = `spark-chart-${useId()}`
  const reducedMotion = usePreferredReducedMotion()
  const entered = ref(false)
  const rootRef = ref<globalThis.HTMLDivElement | null>(null)
  const measuredWidth = ref(0)
  let frame = 0
  let measureFrame = 0

  useResizeObserver(rootRef, ([entry]) => {
    if (measureFrame) globalThis.cancelAnimationFrame(measureFrame)
    measureFrame = globalThis.requestAnimationFrame(() => {
      measureFrame = 0
      measuredWidth.value = entry.contentRect.width
    })
  })

  const FALLBACK_WIDTH = 100
  const HEIGHTS: Record<SparkChartSize, number> = { small: 32, medium: 48, large: 64 }
  const STROKE_INSET = 1
  const BAR_GAP = 1
  const BAR_RADIUS = 1

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-spark-chart')
  const width = computed(() =>
    measuredWidth.value > 0 ? Math.round(measuredWidth.value) : FALLBACK_WIDTH
  )
  const height = computed(() => HEIGHTS[props.size])
  const hue = computed(() => colorToken(props.color))
  const finite = computed(() => props.values.filter(isFiniteNumber))
  const hasValue = computed(() => finite.value.length > 0)

  const stroke = computed(() => {
    if (!hasValue.value || props.kind === 'bar') return null
    const low = Math.min(...finite.value)
    const high = Math.max(...finite.value)
    const floor = props.fromZero ? Math.min(0, low) : low
    const domain: [number, number] = high === floor ? [floor - 1, high + 1] : [floor, high]
    const scale = linearScale(domain, [height.value - STROKE_INSET, STROKE_INSET])
    const layout = categoryLayout(
      props.values.length,
      STROKE_INSET,
      width.value - STROKE_INSET * 2,
      false
    )
    const upper = props.values.map((value, index) =>
      isFiniteNumber(value) ? ([layout.position(index), scale(value)] as const) : null
    )
    const lower = upper.map((point) => (point ? ([point[0], height.value] as const) : null))
    return {
      edge: linePath(upper, 'linear'),
      fill: props.kind === 'area' ? areaPath(upper, lower, 'linear') : ''
    }
  })

  const bars = computed(() => {
    if (!hasValue.value || props.kind !== 'bar') return []
    const low = Math.min(0, ...finite.value)
    const high = Math.max(0, ...finite.value)
    const scale = linearScale([low, high], [height.value, 0])
    const base = scale(0)
    const layout = categoryLayout(props.values.length, 0, width.value, true)
    const thickness = Math.max(1, layout.bandwidth - BAR_GAP)
    return props.values.flatMap((value, index) => {
      if (!isFiniteNumber(value)) return []
      const end = scale(value)
      const d = barPath(
        layout.position(index) - thickness / 2,
        Math.min(base, end),
        thickness,
        Math.abs(end - base),
        BAR_RADIUS,
        'top'
      )
      return d ? [{ key: index, d }] : []
    })
  })

  onMounted(() => {
    if (reducedMotion.value === 'reduce') {
      entered.value = true
      return
    }
    frame = globalThis.requestAnimationFrame(() => {
      frame = globalThis.requestAnimationFrame(() => {
        frame = 0
        entered.value = true
      })
    })
  })

  onScopeDispose(() => {
    if (frame) globalThis.cancelAnimationFrame(frame)
    if (measureFrame) globalThis.cancelAnimationFrame(measureFrame)
  })
</script>

<template>
  <div
    v-bind="$attrs"
    ref="rootRef"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    class="relative block w-full min-w-0 data-[size=large]:h-16 data-[size=medium]:h-12 data-[size=small]:h-8"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :preserveAspectRatio="measuredWidth > 0 ? undefined : 'none'"
      :role="ariaLabel ? 'img' : undefined"
      :aria-label="ariaLabel || undefined"
      :aria-hidden="ariaLabel ? undefined : 'true'"
      class="absolute inset-0 block size-full overflow-visible [--spark-bar-from:1_0]"
    >
      <template v-if="stroke">
        <defs v-if="kind === 'area'">
          <linearGradient
            :id="gradientId"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              :stop-color="hue"
              stop-opacity="0.4"
            />
            <stop
              offset="1"
              :stop-color="hue"
              stop-opacity="0"
            />
          </linearGradient>
        </defs>
        <path
          v-if="kind === 'area'"
          :d="stroke.fill"
          :fill="`url(#${gradientId})`"
          :data-entered="entered || null"
          class="opacity-0 transition-opacity duration-slow-01 ease-productive-entrance motion-reduce:transition-none data-[entered]:opacity-100"
        />
        <path
          :d="stroke.edge"
          fill="none"
          :stroke="hue"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
          :data-entered="entered || null"
          class="[stroke-dasharray:1.02_1.02] [stroke-dashoffset:1.02] transition-[stroke-dashoffset] duration-slow-02 ease-productive-entrance motion-reduce:transition-none data-[entered]:[stroke-dashoffset:0]"
        />
      </template>
      <path
        v-for="bar in bars"
        :key="bar.key"
        :d="bar.d"
        :fill="hue"
        :data-entered="entered || null"
        class="origin-bottom [scale:var(--spark-bar-from)] [transform-box:fill-box] transition-[scale] duration-slow-01 ease-productive-entrance motion-reduce:transition-none data-[entered]:[scale:1]"
      />
    </svg>
  </div>
</template>
