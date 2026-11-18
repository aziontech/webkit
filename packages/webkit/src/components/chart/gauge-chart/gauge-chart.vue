<script setup lang="ts">
  import { usePreferredReducedMotion } from '@vueuse/core'
  import { computed, inject, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Alert from '../../feedback/alert/alert.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { ChartCardInjectionKey } from '../chart-card/injection-key'
  import { type ChartThreshold, formatCompact, isFiniteNumber, thresholdToken } from '../lib'

  defineOptions({ name: 'GaugeChart', inheritAttrs: false })

  export type GaugeChartSize = 'small' | 'medium' | 'large'

  export type { ChartThreshold, ChartThresholdSeverity } from '../lib'

  export interface GaugeChartProps {
    /** The reading. Null or absent renders the empty state. */
    value?: number | null
    /** Start of the scale. */
    min?: number
    /** End of the scale. */
    max?: number
    /** Caption under the reading: what is measured, or the unit. */
    label?: string
    /** Bands from low to high; the arc takes the color of the band the value falls in, and each band start is marked on the track. */
    thresholds?: ChartThreshold[]
    /** Formats the reading and the scale ends. */
    formatValue?: (value: number) => string
    /** Width of the dial: 160, 224 or 288 pixels. */
    size?: GaugeChartSize
    /** Renders a Skeleton sized to the dial. */
    loading?: boolean
    /** Holds the previous reading at reduced opacity while new data loads. */
    refetching?: boolean
    /** Error message; when set, a danger Alert replaces the dial. */
    error?: string
    /** Title of the empty state shown when there is no reading. Empty uses the locale catalog (`No data available`). */
    emptyTitle?: string
    /** Supporting line under the empty title: why there is no reading, or what to do next. */
    emptyDescription?: string
    /** Accessible name of the meter when it is not inside a ChartCard with a title. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<GaugeChartProps>(), {
    value: null,
    min: 0,
    max: 100,
    label: '',
    thresholds: () => [],
    formatValue: formatCompact,
    size: 'medium',
    loading: false,
    refetching: false,
    error: '',
    emptyTitle: '',
    emptyDescription: '',
    ariaLabel: ''
  })

  defineSlots<{
    /** Replaces the reading and caption under the arc. */
    value(props: { value: number; text: string; status: string }): unknown
    /** Replaces the default EmptyState. */
    empty(): unknown
    /** Actions under the default EmptyState. */
    'empty-actions'(): unknown
    /** Replaces the default danger Alert. */
    error(): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ gaugeChart: en.gaugeChart })
  const card = inject(ChartCardInjectionKey, null)
  const direction = useDirection()
  const reducedMotion = usePreferredReducedMotion()
  const entered = ref(false)
  let frame = 0

  const ARC = 'M10 60A50 50 0 0 1 110 60'
  const rangeId = `${useId()}-range`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'gauge-chart')
  const valueText = (value: number): string =>
    props.formatValue === formatCompact
      ? formatCompact(value, locale.value)
      : props.formatValue(value)

  const hasError = computed(() => props.error.length > 0)
  const isEmpty = computed(() => !isFiniteNumber(props.value))
  const showDial = computed(() => !props.loading && !hasError.value && !isEmpty.value)
  const span = computed(() => (props.max > props.min ? props.max - props.min : 1))
  const reading = computed(() => (isFiniteNumber(props.value) ? props.value : props.min))
  const share = (value: number) =>
    Math.min(100, Math.max(0, ((value - props.min) / span.value) * 100))

  const bands = computed(() =>
    [...props.thresholds]
      .filter((band) => isFiniteNumber(band.value))
      .sort((a, b) => a.value - b.value)
  )
  const band = computed(() => {
    let current: ChartThreshold | null = null
    for (const entry of bands.value) if (reading.value >= entry.value) current = entry
    return current
  })
  const color = computed(() =>
    band.value ? thresholdToken(band.value.severity) : 'var(--chart-series-1)'
  )
  const filled = computed(() => share(reading.value))
  const ticks = computed(() =>
    bands.value
      .filter((entry) => entry.value > props.min && entry.value < props.max)
      .map((entry) => {
        const angle = Math.PI * (1 - share(entry.value) / 100)
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return {
          key: entry.value,
          x1: 60 + 43 * cos,
          y1: 60 - 43 * sin,
          x2: 60 + 57 * cos,
          y2: 60 - 57 * sin
        }
      })
  )

  const text = computed(() => valueText(reading.value))
  const status = computed(() => band.value?.label ?? '')
  const valueLabel = computed(() =>
    status.value
      ? t('gaugeChart.valueWithStatus', { value: text.value, status: status.value })
      : text.value
  )
  const rangeLabel = computed(() =>
    t('gaugeChart.range', { min: valueText(props.min), max: valueText(props.max) })
  )
  const accessibleName = computed(() => props.ariaLabel || props.label || undefined)
  const labelledBy = computed(() =>
    !props.ariaLabel && card?.hasTitle.value ? card.titleId : undefined
  )

  function cancelEnter() {
    if (frame) globalThis.cancelAnimationFrame(frame)
    frame = 0
  }

  function scheduleEnter() {
    cancelEnter()
    entered.value = false
    if (
      reducedMotion.value === 'reduce' ||
      typeof globalThis.requestAnimationFrame !== 'function'
    ) {
      entered.value = true
      return
    }
    frame = globalThis.requestAnimationFrame(() => {
      frame = globalThis.requestAnimationFrame(() => {
        frame = 0
        entered.value = true
      })
    })
  }

  watch(
    showDial,
    (show) => {
      if (show && typeof window !== 'undefined') scheduleEnter()
      else {
        cancelEnter()
        entered.value = false
      }
    },
    { immediate: true }
  )

  onScopeDispose(cancelEnter)
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    data-graphic
    :data-size="size"
    :data-loading="loading || null"
    :data-error="(!loading && hasError) || null"
    :data-empty="(!loading && !hasError && isEmpty) || null"
    :data-refetching="refetching || null"
    :aria-busy="loading || refetching || undefined"
    class="m-0 flex min-w-0 flex-col items-center transition-opacity duration-moderate-01 motion-reduce:transition-none data-[refetching]:opacity-60"
  >
    <div
      v-if="loading"
      :data-size="size"
      class="aspect-[15/8] w-full data-[size=large]:max-w-72 data-[size=medium]:max-w-56 data-[size=small]:max-w-40"
    >
      <Skeleton
        width="100%"
        height="100%"
        :data-testid="`${testId}__loading`"
      />
    </div>
    <div
      v-else-if="hasError"
      class="flex w-full items-center justify-center p-(--spacing-md)"
    >
      <slot name="error">
        <Alert
          severity="danger"
          :label="error"
          :data-testid="`${testId}__error`"
        />
      </slot>
    </div>
    <div
      v-else-if="isEmpty"
      class="flex w-full items-stretch"
    >
      <slot name="empty">
        <EmptyState
          :title="emptyTitle || t('gaugeChart.emptyTitle')"
          :description="emptyDescription"
          icon="az az-gauge"
          size="small"
          bordered
          :data-testid="`${testId}__empty`"
        >
          <template
            v-if="$slots['empty-actions']"
            #actions
          >
            <slot name="empty-actions" />
          </template>
        </EmptyState>
      </slot>
    </div>
    <div
      v-else
      role="meter"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="reading"
      :aria-valuetext="valueLabel"
      :aria-label="accessibleName"
      :aria-labelledby="labelledBy"
      :aria-describedby="rangeId"
      :data-size="size"
      :data-severity="band ? band.severity : null"
      :data-testid="`${testId}__meter`"
      class="relative flex w-full flex-col items-center data-[size=large]:max-w-72 data-[size=medium]:max-w-56 data-[size=small]:max-w-40"
    >
      <svg
        viewBox="0 0 120 64"
        aria-hidden="true"
        class="block w-full overflow-visible"
      >
        <g :transform="direction === 'rtl' ? 'translate(120 0) scale(-1 1)' : undefined">
          <path
            :d="ARC"
            fill="none"
            stroke="var(--border-muted)"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            :d="ARC"
            fill="none"
            :stroke="color"
            stroke-width="10"
            stroke-linecap="round"
            pathLength="100"
            :data-entered="entered || null"
            :data-testid="`${testId}__arc`"
            :style="{ '--gauge-chart-dash': `${filled} 100` }"
            class="[stroke-dasharray:0_100] transition-[stroke-dasharray,stroke] duration-slow-02 ease-productive-entrance motion-reduce:transition-none data-[entered]:[stroke-dasharray:var(--gauge-chart-dash)]"
          />
          <line
            v-for="tick in ticks"
            :key="tick.key"
            :x1="tick.x1"
            :y1="tick.y1"
            :x2="tick.x2"
            :y2="tick.y2"
            stroke="var(--bg-surface)"
            stroke-width="1.5"
          />
        </g>
      </svg>
      <div
        class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-(--spacing-2xs) px-(--spacing-lg) text-center"
        :data-testid="`${testId}__value`"
      >
        <slot
          name="value"
          :value="reading"
          :text="text"
          :status="status"
        >
          <span
            :data-size="size"
            class="tabular-nums text-(--text-default) data-[size=large]:text-big-number-md data-[size=medium]:text-big-number-sm data-[size=small]:text-heading-sm"
            >{{ text }}</span
          >
          <span
            v-if="label || status"
            class="line-clamp-2 text-body-sm text-(--text-muted)"
            >{{ status && label ? `${label}, ${status}` : label || status }}</span
          >
        </slot>
      </div>
    </div>
    <div
      v-if="showDial"
      :id="rangeId"
      :data-size="size"
      class="mt-(--spacing-2xs) flex w-full justify-between text-label-sm tabular-nums text-(--text-muted) data-[size=large]:max-w-72 data-[size=medium]:max-w-56 data-[size=small]:max-w-40"
    >
      <span aria-hidden="true">{{ valueText(min) }}</span>
      <span class="sr-only">{{ rangeLabel }}</span>
      <span aria-hidden="true">{{ valueText(max) }}</span>
    </div>
  </figure>
</template>
