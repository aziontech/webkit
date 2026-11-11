<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Tag, { type TagSeverity } from '../../content/tag/tag.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Separator from '../../layout/separator/separator.vue'
  import { formatCompact, formatSignedPercent, isFiniteNumber } from '../_lib'
  import SparkChart from '../spark-chart/spark-chart.vue'
  import { useCountUp } from './composables/use-count-up'

  defineOptions({ name: 'StatTile', inheritAttrs: false })

  export type StatTileTrend = 'good' | 'bad' | 'flat'

  interface Props {
    /** Metric name, in sentence case. Fallback for the default slot. */
    label?: string
    /** The current value. It counts up from the previous value on change; null renders a dash. */
    value?: number | null
    /** Formats the figure. */
    formatValue?: (value: number) => string
    /** Unit read after the figure, in a muted tone. Empty hides it. */
    unit?: string
    /** Signed change against the named period, in percent. Null hides the delta. */
    delta?: number | null
    /** The comparison period, read after the delta. */
    deltaLabel?: string
    /** A rise is bad for this metric; flips the delta between success and danger. */
    inverse?: boolean
    /** Sparkline values, oldest first. Empty hides the sparkline. */
    trend?: number[]
    /** Renders Skeleton lines in place of the figure, delta and sparkline. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    value: null,
    formatValue: formatCompact,
    unit: '',
    delta: null,
    deltaLabel: '',
    inverse: false,
    trend: () => [],
    loading: false
  })

  defineSlots<{
    /** Replaces the label text. */
    default(): unknown
    /** Trailing content beside the label, such as an info icon or a menu. */
    aside(): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ statTile: en.statTile })
  const valueText = (value: number): string =>
    props.formatValue === formatCompact
      ? formatCompact(value, locale.value)
      : props.formatValue(value)
  const uid = useId()
  const { display } = useCountUp(() => props.value)

  const PLACEHOLDER_TREND = [5, 4, 6, 5, 8, 6, 5, 10, 7, 6, 8, 11, 7, 6, 9, 5, 7]
  const TREND_SEVERITY: Record<StatTileTrend, TagSeverity> = {
    good: 'success',
    bad: 'danger',
    flat: 'secondary'
  }

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-stat-tile')
  const labelId = `${uid}-label`

  const hasValue = computed(() => isFiniteNumber(props.value))
  const figure = computed(() => (display.value === null ? '–' : valueText(display.value)))
  const finalFigure = computed(() =>
    isFiniteNumber(props.value)
      ? [valueText(props.value), props.unit].filter(Boolean).join(' ')
      : t('statTile.noValue')
  )

  const trendKind = computed<StatTileTrend | null>(() => {
    if (!isFiniteNumber(props.delta)) return null
    if (Number(Math.abs(props.delta).toFixed(2)) === 0) return 'flat'
    return props.delta > 0 !== props.inverse ? 'good' : 'bad'
  })
  const deltaText = computed(() =>
    isFiniteNumber(props.delta) ? formatSignedPercent(props.delta, 2, locale.value) : ''
  )
  const deltaIcon = computed(() => {
    if (!isFiniteNumber(props.delta) || trendKind.value === 'flat') return 'pi pi-minus'
    return props.delta > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
  })
  const deltaMeaning = computed(() => {
    if (trendKind.value === 'good') return t('statTile.better')
    if (trendKind.value === 'bad') return t('statTile.worse')
    return t('statTile.unchanged')
  })

  const hasTrend = computed(() => props.trend.filter(isFiniteNumber).length > 1)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-loading="loading || null"
    :aria-labelledby="labelId"
    :aria-busy="loading || undefined"
    class="@container/stat-tile flex min-w-0 flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <div
      class="flex min-h-20 flex-1 flex-col justify-center gap-(--spacing-xxs) p-(--spacing-md) @max-3xs/stat-tile:p-(--spacing-sm)"
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
        :data-testid="`${testId}__skeleton`"
      />
      <div
        v-else
        class="flex min-w-0 flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-xxs)"
      >
        <span
          aria-hidden="true"
          class="inline-flex shrink-0 items-baseline gap-(--spacing-xxs) whitespace-nowrap text-big-number-sm"
        >
          <span
            :data-testid="`${testId}__value`"
            class="text-(--text-default)"
          >
            {{ figure }}
          </span>
          <span
            v-if="unit && hasValue"
            :data-testid="`${testId}__unit`"
            class="text-(--text-muted)"
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
            {{ deltaText }}
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
      class="relative pt-(--spacing-xs)"
    >
      <SparkChart
        :values="PLACEHOLDER_TREND"
        color="other"
        size="medium"
        class="opacity-30"
      />
      <Separator class="absolute inset-x-0 top-0" />
      <Tag
        severity="secondary"
        size="small"
        rounded
        :label="t('statTile.noData')"
        class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  </section>
</template>
