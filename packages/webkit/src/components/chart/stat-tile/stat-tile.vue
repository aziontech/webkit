<script setup lang="ts">
  import { computed, inject, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Tag, { type TagSeverity } from '../../content/tag/tag.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Separator from '../../layout/separator/separator.vue'
  import { ChartCardInjectionKey } from '../chart-card/injection-key'
  import { formatCompact, formatSignedPercent, isFiniteNumber } from '../lib'
  import SparkChart from '../spark-chart/spark-chart.vue'
  import { StatTileGroupInjectionKey } from '../stat-tile-group/injection-key'
  import { useCountUp } from './composables/use-count-up'

  defineOptions({ name: 'StatTile', inheritAttrs: false })

  export type StatTileTrend = 'good' | 'bad' | 'flat'
  /** Figure face: the big-number mono figure or the large heading figure. */
  export type StatTileVariant = 'mono' | 'sans'

  export interface StatTileProps {
    /** Metric name, in sentence case. Fallback for the default slot. */
    label?: string
    /** The current value. It counts up from the previous value on change; null renders a dash. */
    value?: number | null
    /** Formats the figure. */
    formatValue?: (value: number) => string
    /** Figure face: mono is the big-number mono figure, sans the large heading figure. */
    variant?: StatTileVariant
    /** Unit read after the figure, smaller and in a muted sans tone. Empty hides it. */
    unit?: string
    /** Signed change against the named period, in percent, printed with at most two decimals and no trailing zeros. Null hides the delta. */
    delta?: number | null
    /** The comparison period, read after the delta. */
    deltaLabel?: string
    /** A rise is bad for this metric; flips the delta between success and danger. */
    inverse?: boolean
    /** Sparkline values, oldest first. Empty hides the sparkline. */
    trend?: (number | null)[]
    /** Renders Skeleton lines in place of the figure, delta and sparkline. */
    loading?: boolean
    /** Why the value failed to load. When set, the tile shows a dash and a neutral band that says it could not load, never No data. */
    error?: string
  }

  const props = withDefaults(defineProps<StatTileProps>(), {
    label: '',
    value: null,
    formatValue: formatCompact,
    variant: 'mono',
    unit: '',
    delta: null,
    deltaLabel: '',
    inverse: false,
    trend: () => [],
    loading: false,
    error: ''
  })

  defineSlots<{
    /** Replaces the label text. */
    default(): unknown
    /** Trailing content beside the label, such as an info icon or a menu. */
    aside(): unknown
  }>()

  const attrs = useAttrs()
  const group = inject(StatTileGroupInjectionKey, null)
  const card = inject(ChartCardInjectionKey, null)
  const { t, locale } = useTranslate({ statTile: en.statTile })
  const valueText = (value: number): string =>
    props.formatValue === formatCompact
      ? formatCompact(value, locale.value)
      : props.formatValue(value)
  const uid = useId()
  const { display } = useCountUp(() => props.value)

  const TREND_SEVERITY: Record<StatTileTrend, TagSeverity> = {
    good: 'success',
    bad: 'danger',
    flat: 'neutral'
  }

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'stat-tile')
  const labelId = `${uid}-label`

  const failed = computed(() => !props.loading && props.error.length > 0)
  const hasValue = computed(() => !failed.value && isFiniteNumber(props.value))
  const figure = computed(() =>
    failed.value || display.value === null ? '–' : valueText(display.value)
  )
  const sizeFigure = computed(() =>
    !failed.value && isFiniteNumber(props.value) ? valueText(props.value) : figure.value
  )
  const finalFigure = computed(() => {
    if (failed.value) return `${t('statTile.loadError')}. ${props.error}`
    return isFiniteNumber(props.value)
      ? [valueText(props.value), props.unit].filter(Boolean).join(' ')
      : t('statTile.noValue')
  })

  const trendKind = computed<StatTileTrend | null>(() => {
    if (failed.value || !isFiniteNumber(props.delta)) return null
    if (Number(Math.abs(props.delta).toFixed(2)) === 0) return 'flat'
    return props.delta > 0 !== props.inverse ? 'good' : 'bad'
  })
  const deltaText = computed(() =>
    isFiniteNumber(props.delta) ? formatSignedPercent(props.delta, 2, locale.value) : ''
  )
  const deltaIcon = computed(() => {
    if (!isFiniteNumber(props.delta) || trendKind.value === 'flat') return 'az az-minus'
    return props.delta > 0 ? 'az az-arrow-up' : 'az az-arrow-down'
  })
  const deltaMeaning = computed(() => {
    if (trendKind.value === 'good') return t('statTile.better')
    if (trendKind.value === 'bad') return t('statTile.worse')
    return t('statTile.unchanged')
  })

  const hasTrend = computed(() => props.trend.filter(isFiniteNumber).length > 1)

  const ROOT_CLASS =
    'group/stat-tile @container/stat-tile flex min-w-0 flex-col overflow-hidden border-(--border-default) ' +
    'not-data-[grouped]:not-data-[carded]:rounded-(--shape-card) not-data-[grouped]:not-data-[carded]:border not-data-[grouped]:not-data-[carded]:bg-(--bg-surface) ' +
    'data-[grouped]:border-e data-[grouped]:border-b'
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :data-testid="testId"
    data-plain-ground
    :data-loading="loading || null"
    :data-error="failed || null"
    :data-variant="variant"
    :data-grouped="group ? '' : null"
    :data-carded="card && !group ? '' : null"
    :aria-labelledby="labelId"
    :aria-busy="loading || undefined"
    :class="ROOT_CLASS"
  >
    <div
      class="flex min-h-20 flex-1 flex-col justify-center gap-(--spacing-2xs) p-(--spacing-md) @max-3xs/stat-tile:p-(--spacing-sm)"
    >
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <span
          :id="labelId"
          class="min-w-0 truncate text-label-sm text-(--text-muted)"
        >
          <slot>{{ label }}</slot>
        </span>
        <slot name="aside" />
      </div>

      <Skeleton
        v-if="loading"
        width="60%"
        height="1.5rem"
        :data-testid="`${testId}__loading`"
      />
      <div
        v-else
        class="flex min-w-0 flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs) group-data-[grouped]/stat-tile:justify-between"
      >
        <span
          aria-hidden="true"
          dir="ltr"
          class="inline-flex shrink-0 items-baseline gap-(--spacing-2xs) whitespace-nowrap"
        >
          <span
            class="relative text-(--text-default) group-data-[variant=mono]/stat-tile:text-big-number-sm group-data-[variant=sans]/stat-tile:text-heading-lg"
          >
            <span class="invisible">{{ sizeFigure }}</span>
            <span
              :data-testid="`${testId}__value`"
              class="absolute inset-y-0 start-0"
              >{{ figure }}</span
            >
          </span>
          <span
            v-if="unit && hasValue"
            :data-testid="`${testId}__unit`"
            class="text-(--text-muted) group-data-[variant=mono]/stat-tile:text-body-xs group-data-[variant=sans]/stat-tile:text-body-md"
          >
            {{ unit }}
          </span>
        </span>
        <span class="sr-only">{{ finalFigure }}</span>

        <span
          v-if="trendKind"
          class="flex min-w-0 max-w-full items-center gap-(--spacing-xs)"
          :data-testid="`${testId}__delta`"
        >
          <Tag
            :severity="TREND_SEVERITY[trendKind]"
            size="small"
            :icon="deltaIcon"
            :data-trend="trendKind"
            :data-testid="`${testId}__delta-tag`"
            class="shrink-0 tabular-nums"
          >
            <span dir="ltr">{{ deltaText }}</span>
            <span class="sr-only">{{ deltaMeaning }}</span>
          </Tag>
          <span
            v-if="deltaLabel"
            class="min-w-0 truncate text-label-sm text-(--text-muted)"
          >
            {{ deltaLabel }}
          </span>
        </span>
      </div>
    </div>

    <SparkChart
      v-if="!loading && hasTrend && hasValue"
      :values="trend"
      size="medium"
      :data-testid="`${testId}__sparkline`"
      class="mt-(--spacing-xs)"
    />
    <div
      v-else-if="!loading && !hasValue"
      :data-testid="`${testId}__empty`"
      class="relative mt-(--spacing-xs) h-12"
    >
      <Separator class="absolute inset-x-0 top-0" />
      <Tag
        severity="neutral"
        size="small"
        rounded
        :label="failed ? t('statTile.loadError') : t('statTile.noData')"
        :data-testid="`${testId}__empty-label`"
        class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  </div>
</template>
