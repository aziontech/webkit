<script setup lang="ts">
  import { useElementSize, useMounted } from '@vueuse/core'
  import { computed, provide, ref, useAttrs, useId } from 'vue'

  import { useChartEntrance } from '../../../composables/use-chart-entrance'
  import { useChartLabelling } from '../../../composables/use-chart-labelling'
  import { useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import {
    CHART_STATE_SLOTS,
    type ChartLabel,
    type ChartLabelScale,
    type ChartPoint,
    type ChartRange,
    type ChartSeries,
    formatCompact,
    formatLabel as formatCategoryLabel,
    hasAnyValue
  } from '../lib'
  import { useChartFormat } from './composables/use-chart-format'
  import { useChartInteraction } from './composables/use-chart-interaction'
  import { useChartReadout } from './composables/use-chart-readout'
  import { useChartRegistry } from './composables/use-chart-registry'
  import { useChartScales } from './composables/use-chart-scales'
  import { useChartSeries } from './composables/use-chart-series'
  import { ChartInjectionKey, type ChartOrientation } from './injection-key'
  import { chartPoint } from './lib/chart-layout'
  import ChartDataTable from './parts/chart-data-table.vue'
  import ChartFrame from './parts/chart-frame.vue'

  defineOptions({ name: 'Chart', inheritAttrs: false })

  export interface ChartProps {
    /** Series to plot. The first eight take the fixed categorical slots in order; the rest fold into Other. */
    series?: ChartSeries[]
    /** One category label per index: a string, a number, or a Date. */
    labels?: ChartLabel[]
    /** Value axis direction. Horizontal lays categories down the side, for ordered bars. */
    orientation?: ChartOrientation
    /** How categories sit along their axis. `linear` places numeric or Date labels by value, for scatter plots and uneven time buckets. */
    labelScale?: ChartLabelScale
    /** Floor of the value axis. Marks grow from one baseline. */
    min?: number
    /** Ceiling of the value axis. When absent, the nice ceiling of the visible data. */
    max?: number
    /** Series kept before the rest fold into Other. */
    cap?: number
    /** Name of the folded series. Empty uses the locale catalog (`Other`). */
    otherLabel?: string
    /** Formats ticks, tooltip values and legend totals. */
    formatValue?: (value: number) => string
    /** Formats category labels on the axis and in the tooltip. */
    formatLabel?: (label: ChartLabel) => string
    /** IANA time zone the default label format prints Date labels in. Empty prints UTC on the server and in the first client render, then the runtime's zone. */
    timeZone?: string
    /** Minimum plot height in pixels; the plot grows to fill a taller container. */
    height?: number
    /** Renders a Skeleton sized to the plot and suppresses interaction. */
    loading?: boolean
    /** Holds the previous render at reduced opacity while new data loads. */
    refetching?: boolean
    /** Error message; when set, the plot renders a danger Alert instead of marks. */
    error?: string
    /** Title of the empty state shown when no series has a value. Empty uses the locale catalog (`No data available`). */
    emptyTitle?: string
    /** Supporting line under the empty title: why the range is empty, or what to do next. */
    emptyDescription?: string
    /** Shows the data table in place of the marks. The table is always present for assistive tech. */
    tableView?: boolean
    /** Accessible name of the chart when it is not inside a ChartCard with a title. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ChartProps>(), {
    series: () => [],
    labels: () => [],
    orientation: 'vertical',
    labelScale: 'category',
    min: 0,
    max: undefined,
    cap: 8,
    otherLabel: '',
    formatValue: formatCompact,
    formatLabel: formatCategoryLabel,
    timeZone: '',
    height: 240,
    loading: false,
    refetching: false,
    error: '',
    emptyTitle: '',
    emptyDescription: '',
    tableView: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'point-click': [event: MouseEvent | globalThis.KeyboardEvent, point: ChartPoint]
    'legend-toggle': [event: MouseEvent, series: ChartSeries]
  }>()

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })
  const hiddenSeries = defineModel<string[]>('hiddenSeries', { default: () => [] })
  const range = defineModel<ChartRange | null>('range', { default: null })

  defineSlots<{
    /** The parts: Grid, Axis, Brush, Line, Area, Bar, Scatter, Reference, Crosshair, Tooltip, Legend, in paint order. */
    default(): unknown
    /** Replaces the default EmptyState. */
    empty(): unknown
    /** Actions under the default EmptyState, such as a Clear filters button or a setup link. */
    'empty-actions'(): unknown
    /** Replaces the default danger Alert. */
    error(): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ chart: en.chart })
  const mounted = useMounted()
  const { valueText, labelText } = useChartFormat({
    locale,
    mounted,
    labels: () => props.labels,
    timeZone: () => props.timeZone,
    formatValue: () => props.formatValue,
    formatLabel: () => props.formatLabel
  })
  const uid = useId()
  const direction = useDirection()
  const rtl = computed(() => direction.value === 'rtl')
  const stageEl = ref<globalThis.HTMLElement | null>(null)
  const { width: stageWidth, height: stageHeight } = useElementSize(stageEl)

  const registry = useChartRegistry(mounted)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart')
  const summaryId = `${uid}-summary`
  const vertical = computed(() => props.orientation === 'vertical')

  const { series, hidden, visibleSeries, count, labels, resolveSeries, toggleSeries } =
    useChartSeries({
      series: () => props.series,
      labels: () => props.labels,
      cap: () => props.cap,
      otherLabel: () => props.otherLabel || t('chart.otherSeries'),
      hiddenSeries,
      toggled: (event, source) => emit('legend-toggle', event, source)
    })

  const isEmpty = computed(() => count.value === 0 || !hasAnyValue(series.value))
  const showMarks = computed(
    () => !props.loading && !props.error && !isEmpty.value && !props.tableView
  )

  const { draft, committed, focusedSeries, emphasized, setActiveIndex, setEmphasized } =
    useChartInteraction({
      stageEl,
      activeIndex,
      range,
      count,
      vertical,
      direction,
      hasBrush: registry.hasBrush,
      category: () => category.value,
      visibleSeries,
      pick: (event, index) =>
        emit('point-click', event, chartPoint(labels.value, visibleSeries.value, index))
    })

  const { size, plot, valueTicks, valueScale, baseline, category, selection } = useChartScales({
    registry,
    labels,
    count,
    resolveSeries,
    min: () => props.min,
    max: () => props.max,
    vertical,
    rtl,
    labelScale: () => props.labelScale,
    width: stageWidth,
    height: stageHeight,
    span: () => draft.value ?? range.value,
    valueText,
    labelText
  })

  const { accessibleName, labelledBy, describedBy } = useChartLabelling(
    () => props.ariaLabel,
    summaryId
  )

  const { summary, announcement, tableColumns, tableRows, twinTableRows } = useChartReadout({
    text: { t, value: valueText, label: labelText },
    labels,
    visibleSeries,
    references: registry.referenceList,
    selection,
    activeIndex,
    focusedSeries,
    draft,
    committed,
    showMarks
  })

  const { entered } = useChartEntrance({ show: showMarks, ready: () => stageWidth.value > 0 })

  provide(ChartInjectionKey, {
    testId: testId.value,
    orientation: computed(() => props.orientation),
    labelScale: computed(() => props.labelScale),
    rtl,
    series,
    visibleSeries,
    hidden,
    labels,
    size,
    plot,
    valueScale,
    valueTicks,
    baseline,
    category,
    activeIndex,
    emphasized,
    entered,
    selection,
    brushing: computed(() => draft.value !== null),
    formatValue: (value: number) => valueText(value),
    formatLabel: (label: ChartLabel) => labelText(label),
    resolveSeries,
    setActiveIndex,
    setEmphasized,
    toggleSeries,
    registerMark: registry.registerMark,
    registerAxis: registry.registerAxis,
    registerBrush: registry.registerBrush,
    registerReference: registry.registerReference
  })

  const ROOT_CLASS =
    'relative m-0 grid h-full min-w-0 grid-cols-1 grid-rows-[minmax(var(--chart-plot-min),1fr)_auto] ' +
    '[&_svg]:transition-opacity [&_svg]:duration-moderate-01 motion-reduce:[&_svg]:transition-none ' +
    'data-[refetching]:[&_svg]:opacity-60'
</script>

<template>
  <ChartFrame
    v-bind="$attrs"
    data-plain-ground
    :data-testid="testId"
    :data-orientation="orientation"
    :data-active="activeIndex !== null || null"
    :data-label-scale="labelScale"
    :data-brushing="draft !== null || null"
    :loading="loading"
    :refetching="refetching"
    :error="error"
    :drawable="!isEmpty"
    :table-view="tableView"
    :empty-title="emptyTitle || t('chart.emptyTitle')"
    :empty-description="emptyDescription"
    :empty-icon="vertical ? 'az az-chart-line' : 'az az-chart-bar'"
    state-class="col-start-1 row-start-1"
    :summary-id="summaryId"
    :summary="summary"
    :live-id="`${uid}-live`"
    :announcement="announcement"
    :test-id="testId"
    :style="{ '--chart-plot-min': `${height}px` }"
    :class="ROOT_CLASS"
  >
    <template #loading>
      <div class="col-start-1 row-start-1 flex min-h-0">
        <Skeleton
          width="100%"
          height="100%"
          :data-testid="`${testId}__loading`"
        />
      </div>
    </template>
    <template #table>
      <div class="col-start-1 row-start-1 min-h-0 overflow-auto">
        <ChartDataTable
          :data-testid="`${testId}__table`"
          :caption="ariaLabel || summary"
          :columns="tableColumns"
          :rows="tableRows"
        />
      </div>
    </template>
    <div
      ref="stageEl"
      role="group"
      :aria-roledescription="t('chart.roleDescription')"
      tabindex="0"
      :aria-label="accessibleName"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :data-testid="`${testId}__plot`"
      :data-brush="registry.hasBrush.value || null"
      :style="{ minHeight: `${height}px` }"
      class="col-start-1 row-start-1 min-h-0 min-w-0 cursor-crosshair rounded-(--shape-control) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[brush]:touch-pan-y"
    />
    <slot />
    <template #twin>
      <ChartDataTable
        v-memo="[twinTableRows, tableColumns, ariaLabel, summary, testId]"
        :data-testid="`${testId}__twin`"
        :caption="ariaLabel || summary"
        :columns="tableColumns"
        :rows="twinTableRows"
      />
    </template>
    <template
      v-for="name in CHART_STATE_SLOTS.filter((slot) => $slots[slot])"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ChartFrame>
</template>
