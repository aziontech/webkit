<script setup lang="ts">
  import { usePreferredReducedMotion, useResizeObserver } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, useId } from 'vue'

  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { formatCompact, formatSignedPercent, isFiniteNumber, linePath } from '../_lib'
  import { useCountUp } from './composables/use-count-up'

  defineOptions({ name: 'StatTile', inheritAttrs: false })

  export type StatTileSize = 'small' | 'medium' | 'large'
  export type StatTileTrend = 'good' | 'bad' | 'flat'

  interface Props {
    /** Metric name, in sentence case. Fallback for the default slot. */
    label?: string
    /** The current value. It counts up from the previous value on change; null renders a dash. */
    value?: number | null
    /** Formats the figure. */
    formatValue?: (value: number) => string
    /** Signed change against the named period, in percent. Null hides the delta. */
    delta?: number | null
    /** The comparison period, read after the delta. */
    deltaLabel?: string
    /** A rise is bad for this metric; flips the delta between success and danger. */
    inverse?: boolean
    /** Sparkline values, oldest first. Empty hides the sparkline. */
    trend?: number[]
    /** Scale of the figure. */
    size?: StatTileSize
    /** Renders Skeleton lines in place of the figure, delta and sparkline. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    value: null,
    formatValue: formatCompact,
    delta: null,
    deltaLabel: '',
    inverse: false,
    trend: () => [],
    size: 'medium',
    loading: false
  })

  defineSlots<{
    /** Replaces the label text. */
    default(): unknown
    /** Trailing content beside the label, such as an info icon or a menu. */
    aside(): unknown
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const reducedMotion = usePreferredReducedMotion()
  const { display } = useCountUp(() => props.value)
  const entered = ref(false)
  const sparkRef = ref<globalThis.HTMLDivElement | null>(null)
  const measuredWidth = ref(0)
  let frame = 0
  let measureFrame = 0

  useResizeObserver(sparkRef, ([entry]) => {
    if (measureFrame) globalThis.cancelAnimationFrame(measureFrame)
    measureFrame = globalThis.requestAnimationFrame(() => {
      measureFrame = 0
      measuredWidth.value = entry.contentRect.width
    })
  })

  const SPARK_WIDTH = 100
  const SPARK_HEIGHT = 24

  const sparkWidth = computed(() =>
    measuredWidth.value > 0 ? Math.round(measuredWidth.value) : SPARK_WIDTH
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-stat-tile')
  const labelId = `${uid}-label`

  const figure = computed(() => (display.value === null ? '–' : props.formatValue(display.value)))
  const finalFigure = computed(() =>
    isFiniteNumber(props.value) ? props.formatValue(props.value) : 'No value'
  )

  const trendKind = computed<StatTileTrend | null>(() => {
    if (!isFiniteNumber(props.delta)) return null
    if (Number(Math.abs(props.delta).toFixed(2)) === 0) return 'flat'
    return props.delta > 0 !== props.inverse ? 'good' : 'bad'
  })
  const deltaText = computed(() =>
    isFiniteNumber(props.delta) ? formatSignedPercent(props.delta) : ''
  )
  const deltaIcon = computed(() => {
    if (!isFiniteNumber(props.delta) || trendKind.value === 'flat') return 'pi pi-minus'
    return props.delta > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
  })
  const deltaMeaning = computed(() => {
    if (trendKind.value === 'good') return 'better'
    if (trendKind.value === 'bad') return 'worse'
    return 'unchanged'
  })

  const spark = computed(() => {
    const values = props.trend.filter(isFiniteNumber)
    if (values.length < 2) return null
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const step = sparkWidth.value / (values.length - 1)
    const points = values.map(
      (value, index) =>
        [index * step, SPARK_HEIGHT - 2 - ((value - min) / span) * (SPARK_HEIGHT - 4)] as const
    )
    return {
      history: linePath(points.slice(0, -1), 'monotone'),
      current: linePath(points.slice(-2), 'linear')
    }
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
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-loading="loading || null"
    :aria-labelledby="labelId"
    :aria-busy="loading || undefined"
    class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
  >
    <div class="flex items-center justify-between gap-(--spacing-xs)">
      <span
        :id="labelId"
        class="truncate text-body-sm text-(--text-muted)"
      >
        <slot>{{ label }}</slot>
      </span>
      <slot name="aside" />
    </div>

    <template v-if="loading">
      <Skeleton
        width="60%"
        height="2rem"
        :data-testid="`${testId}__skeleton`"
      />
      <Skeleton
        width="40%"
        height="1rem"
      />
    </template>
    <template v-else>
      <span
        aria-hidden="true"
        :data-size="size"
        :data-testid="`${testId}__value`"
        class="text-(--text-default) data-[size=large]:text-big-number-lg data-[size=medium]:text-big-number-md data-[size=small]:text-big-number-sm"
      >
        {{ figure }}
      </span>
      <span class="sr-only">{{ finalFigure }}</span>

      <span
        v-if="trendKind"
        class="flex flex-wrap items-center gap-x-(--spacing-xs)"
        :data-testid="`${testId}__delta`"
      >
        <span
          :data-trend="trendKind"
          class="inline-flex items-center gap-(--spacing-xxs) text-label-sm tabular-nums data-[trend=bad]:text-(--danger-contrast) data-[trend=flat]:text-(--text-muted) data-[trend=good]:text-(--success-contrast)"
        >
          <i
            :class="deltaIcon"
            aria-hidden="true"
          />
          {{ deltaText }}
          <span class="sr-only">{{ deltaMeaning }}</span>
        </span>
        <span
          v-if="deltaLabel"
          class="text-body-sm text-(--text-muted)"
        >
          {{ deltaLabel }}
        </span>
      </span>

      <div
        v-if="spark"
        ref="sparkRef"
        class="relative mt-(--spacing-xxs) h-6 w-full"
      >
        <svg
          :viewBox="`0 0 ${sparkWidth} ${SPARK_HEIGHT}`"
          :preserveAspectRatio="measuredWidth > 0 ? undefined : 'none'"
          aria-hidden="true"
          :data-testid="`${testId}__sparkline`"
          class="absolute inset-0 block size-full overflow-visible"
        >
          <path
            :d="spark.history"
            fill="none"
            stroke="var(--chart-series-other)"
            stroke-width="1.5"
            stroke-linecap="round"
            pathLength="1"
            :data-entered="entered || null"
            class="[stroke-dasharray:1.02_1.02] [stroke-dashoffset:1.02] transition-[stroke-dashoffset] duration-slow-02 ease-productive-entrance motion-reduce:transition-none data-[entered]:[stroke-dashoffset:0]"
          />
          <path
            :d="spark.current"
            fill="none"
            stroke="var(--chart-series-1)"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </template>
  </section>
</template>
