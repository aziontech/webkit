<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { useChartEntrance } from '../../../composables/use-chart-entrance'
  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useElementListener } from '../../../composables/use-element-listener'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import ChartDataTable, { type ChartDataTableRow } from '../chart/parts/chart-data-table.vue'
  import ChartFrame from '../chart/parts/chart-frame.vue'
  import ChartLegendButton from '../chart/parts/chart-legend-button.vue'
  import {
    CHART_STATE_SLOTS,
    type ChartSeries,
    formatCompact,
    formatShare,
    normalizeSeries,
    STEP_BACKWARD,
    STEP_FORWARD,
    stepIndex
  } from '../lib'

  defineOptions({ name: 'DonutChart', inheritAttrs: false })

  export type DonutChartType = 'donut' | 'pie'
  export type DonutChartSize = 'small' | 'medium' | 'large'

  export interface DonutChartProps {
    /** One slice per series; a slice is the sum of its values. The first six take the categorical slots, the rest fold into Other. */
    series?: ChartSeries[]
    /** Ring or solid disc. */
    type?: DonutChartType
    /** Diameter of the ring: 128, 176 or 240 pixels. */
    size?: DonutChartSize
    /** Slices kept before the rest fold into Other. */
    cap?: number
    /** Name of the folded slice. Empty uses the locale catalog (`Other`). */
    otherLabel?: string
    /** Caption under the total in the center. Empty uses the locale catalog (`Total`). */
    totalLabel?: string
    /** Formats the center value and legend values. */
    formatValue?: (value: number) => string
    /** Renders a circular Skeleton and suppresses interaction. */
    loading?: boolean
    /** Holds the previous render at reduced opacity while new data loads. */
    refetching?: boolean
    /** Error message; when set, a danger Alert replaces the ring. */
    error?: string
    /** Title of the empty state shown when every slice is zero. Empty uses the locale catalog (`No data available`). */
    emptyTitle?: string
    /** Supporting line under the empty title: why the range is empty, or what to do next. */
    emptyDescription?: string
    /** Shows the data table in place of the ring. The table is always present for assistive tech. */
    tableView?: boolean
    /** Accessible name of the chart. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<DonutChartProps>(), {
    series: () => [],
    type: 'donut',
    size: 'medium',
    cap: 6,
    otherLabel: '',
    totalLabel: '',
    formatValue: formatCompact,
    loading: false,
    refetching: false,
    error: '',
    emptyTitle: '',
    emptyDescription: '',
    tableView: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'slice-click': [event: MouseEvent | globalThis.KeyboardEvent, series: ChartSeries]
    'legend-toggle': [event: MouseEvent, series: ChartSeries]
  }>()

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })
  const hiddenSeries = defineModel<string[]>('hiddenSeries', { default: () => [] })

  defineSlots<{
    /** Replaces the center readout. */
    center(props: { total: number; active: ChartSeries | null }): unknown
    /** Replaces the default EmptyState. */
    empty(): unknown
    /** Actions under the default EmptyState, such as a Clear filters button or a setup link. */
    'empty-actions'(): unknown
    /** Replaces the default danger Alert. */
    error(): unknown
  }>()

  const attrs = useAttrs()
  const dir = useDirection()
  const ringEl = ref<globalThis.HTMLElement | null>(null)
  const { t, locale } = useTranslate({ donutChart: en.donutChart })
  const valueText = (value: number): string =>
    props.formatValue === formatCompact
      ? formatCompact(value, locale.value)
      : props.formatValue(value)
  const shareText = (value: number, whole: number): string =>
    formatShare(value, whole, locale.value)
  const uid = useId()
  const { entered, scheduleEnter, resetEnter } = useChartEntrance()

  const RADIUS = { donut: 40, pie: 25 } as const
  const WIDTH = { donut: 14, pie: 50 } as const
  const LIFT = { donut: 4, pie: 0 } as const
  const GAP = 0.6

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'donut-chart')
  const summaryId = `${uid}-summary`

  const series = computed(() =>
    normalizeSeries(props.series, {
      cap: props.cap,
      otherLabel: props.otherLabel || t('donutChart.otherSeries')
    })
  )
  const hidden = computed<ReadonlySet<string>>(() => new Set(hiddenSeries.value))
  const visible = computed(() =>
    series.value.filter((entry) => !hidden.value.has(entry.id) && entry.total > 0)
  )
  const total = computed(() => visible.value.reduce((sum, entry) => sum + entry.total, 0))

  const hasError = computed(() => props.error.length > 0)
  const isEmpty = computed(() => series.value.every((entry) => entry.total <= 0))
  const showRing = computed(
    () => !props.loading && !hasError.value && !isEmpty.value && !props.tableView
  )

  const slices = computed(() => {
    let start = 0
    const gap = visible.value.length > 1 ? GAP : 0
    return visible.value.map((entry, order) => {
      const share = total.value ? (entry.total / total.value) * 100 : 0
      const length = Math.max(0, share - gap)
      const slice = {
        id: entry.id,
        color: entry.color,
        dash: `${length} ${100 - length}`,
        offset: -start,
        delay: `calc(${duration['fast-02']} * ${order})`,
        entry
      }
      start += share
      return slice
    })
  })

  const active = computed(() => {
    const index = activeIndex.value
    return index === null ? null : (slices.value[index]?.entry ?? null)
  })

  const centerValue = computed(() => valueText(active.value ? active.value.total : total.value))
  const centerCaption = computed(() =>
    active.value
      ? `${active.value.name}, ${shareText(active.value.total, total.value)}`
      : props.totalLabel || t('donutChart.total')
  )

  const legend = computed(() =>
    series.value.map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      value: valueText(entry.total),
      share: hidden.value.has(entry.id) ? '' : shareText(entry.total, total.value),
      hidden: hidden.value.has(entry.id)
    }))
  )

  const tableColumns = computed(() => [
    t('donutChart.name'),
    t('donutChart.value'),
    t('donutChart.share')
  ])
  const tableRows = computed(() =>
    legend.value.map<ChartDataTableRow>((entry) => ({
      key: entry.id,
      header: entry.name,
      cells: [entry.value, entry.share]
    }))
  )

  const summary = computed(() =>
    t('donutChart.summary', { count: visible.value.length, total: valueText(total.value) })
  )

  const announcement = computed(() =>
    active.value
      ? `${active.value.name}: ${valueText(active.value.total)}, ${shareText(active.value.total, total.value)}`
      : ''
  )

  onMounted(() => {
    if (showRing.value) scheduleEnter()
  })

  watch(showRing, (show) => {
    if (show) scheduleEnter()
    else resetEnter()
  })

  function setActive(index: number | null) {
    if (activeIndex.value !== index) activeIndex.value = index
  }

  function onRingClick(event: MouseEvent) {
    const index = activeIndex.value
    const slice = index === null ? undefined : slices.value[index]
    if (slice) emit('slice-click', event, slice.entry.source)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    const last = slices.value.length - 1
    if (last < 0) return
    const current = activeIndex.value
    const key = logicalArrowKey(event.key, dir.value)
    const target = stepIndex(key, current, last, STEP_FORWARD, STEP_BACKWARD)
    if (target !== undefined) setActive(target)
    else if (event.key === 'Escape') setActive(null)
    else if (event.key === 'Enter' || event.key === ' ') {
      const slice = current === null ? undefined : slices.value[current]
      if (slice) emit('slice-click', event, slice.entry.source)
    } else return
    event.preventDefault()
  }

  useElementListener(ringEl, 'keydown', onKeydown)
  useElementListener(ringEl, 'click', onRingClick)

  function toggle(event: MouseEvent, id: string) {
    const target = series.value.find((entry) => entry.id === id)
    if (!target) return
    hiddenSeries.value = hidden.value.has(id)
      ? hiddenSeries.value.filter((entry) => entry !== id)
      : [...hiddenSeries.value, id]
    setActive(null)
    emit('legend-toggle', event, target.source)
  }

  const SLICE_CLASS =
    'cursor-pointer [stroke-dasharray:0_100] [stroke-width:var(--donut-chart-width)] transition-[stroke-dasharray,stroke-width,opacity] duration-slow-02 ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[active]:[stroke-width:var(--donut-chart-lift)] ' +
    'data-[dimmed]:opacity-40 ' +
    'data-[entered]:[stroke-dasharray:var(--donut-chart-dash)]'
</script>

<template>
  <ChartFrame
    v-bind="$attrs"
    data-plain-ground
    :data-testid="testId"
    :data-type="type"
    :data-size="size"
    :loading="loading"
    :refetching="refetching"
    :error="error"
    :drawable="!isEmpty"
    :table-view="tableView"
    :empty-title="emptyTitle || t('donutChart.emptyTitle')"
    :empty-description="emptyDescription"
    empty-icon="az az-chart-pie"
    state-class="flex-1 not-data-[error]:data-[size=small]:min-h-32 not-data-[error]:data-[size=medium]:min-h-44 not-data-[error]:data-[size=large]:min-h-60"
    :state-size="size"
    :summary-id="summaryId"
    :summary="summary"
    :announcement="announcement"
    :test-id="testId"
    class="flex flex-wrap items-center gap-(--spacing-md) transition-opacity duration-moderate-01 motion-reduce:transition-none data-[refetching]:opacity-60"
  >
    <template #loading>
      <Skeleton
        variant="circle"
        :width="size === 'small' ? '128px' : size === 'large' ? '240px' : '176px'"
        :height="size === 'small' ? '128px' : size === 'large' ? '240px' : '176px'"
        :data-testid="`${testId}__loading`"
      />
    </template>
    <template #table>
      <ChartDataTable
        :data-testid="`${testId}__table`"
        :caption="ariaLabel || summary"
        :columns="tableColumns"
        :rows="tableRows"
      />
    </template>
    <div
      ref="ringEl"
      role="group"
      :aria-roledescription="t('donutChart.roleDescription')"
      tabindex="0"
      :aria-label="ariaLabel || undefined"
      :aria-describedby="summaryId"
      :data-size="size"
      :data-testid="`${testId}__ring`"
      class="relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[size=large]:size-60 data-[size=medium]:size-44 data-[size=small]:size-32"
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        class="block size-full overflow-visible"
        @pointerleave="setActive(null)"
      >
        <circle
          v-for="(slice, index) in slices"
          :key="slice.id"
          cx="50"
          cy="50"
          :r="RADIUS[type]"
          fill="none"
          :stroke="slice.color"
          pathLength="100"
          transform="rotate(-90 50 50)"
          :stroke-dashoffset="slice.offset"
          :data-series="slice.id"
          :data-entered="entered || null"
          :data-active="activeIndex === index || null"
          :data-dimmed="(activeIndex !== null && activeIndex !== index) || null"
          :style="{
            '--donut-chart-dash': slice.dash,
            '--donut-chart-width': `${WIDTH[type]}`,
            '--donut-chart-lift': `${WIDTH[type] + LIFT[type]}`,
            transitionDelay: slice.delay
          }"
          :class="SLICE_CLASS"
          @pointerenter="setActive(index)"
        />
      </svg>
      <div
        v-if="type === 'donut'"
        :data-size="size"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-(--spacing-2xs) px-(--spacing-lg) text-center data-[size=small]:px-(--spacing-md)"
        :data-testid="`${testId}__center`"
      >
        <slot
          name="center"
          :total="total"
          :active="active ? active.source : null"
        >
          <span
            :data-size="size"
            :data-testid="`${testId}__center-value`"
            class="text-big-number-sm tabular-nums text-(--text-default) data-[size=small]:text-label-code-md"
            >{{ centerValue }}</span
          >
          <span
            :data-size="size"
            class="line-clamp-2 text-body-sm text-(--text-muted) data-[size=small]:text-body-xs"
            >{{ centerCaption }}</span
          >
        </slot>
      </div>
    </div>
    <ul
      v-if="legend.length > 1"
      :data-testid="`${testId}__legend`"
      class="m-0 flex min-w-0 grow basis-48 list-none flex-col gap-(--spacing-2xs) p-0"
    >
      <li
        v-for="entry in legend"
        :key="entry.id"
      >
        <ChartLegendButton
          :color="entry.color"
          :pressed="!entry.hidden"
          :data-testid="`${testId}__legend-item`"
          class="w-full text-start"
          @click="toggle($event, entry.id)"
        >
          <span class="min-w-0 flex-1 truncate">{{ entry.name }}</span>
          <span class="text-label-code-md tabular-nums text-(--text-muted)">{{ entry.value }}</span>
          <span class="w-10 text-end text-label-code-md tabular-nums text-(--text-muted)">{{
            entry.share
          }}</span>
        </ChartLegendButton>
      </li>
    </ul>
    <template #twin>
      <ChartDataTable
        :data-testid="`${testId}__twin`"
        :caption="ariaLabel || summary"
        :columns="tableColumns"
        :rows="tableRows"
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
