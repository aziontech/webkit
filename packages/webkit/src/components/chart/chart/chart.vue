<script setup lang="ts">
  import { useElementSize, useMounted, usePreferredReducedMotion } from '@vueuse/core'
  import {
    computed,
    inject,
    onScopeDispose,
    provide,
    ref,
    shallowReactive,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Alert from '../../feedback/alert/alert.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import {
    categoryLayout,
    type ChartLabel,
    type ChartLabelScale,
    type ChartPoint,
    type ChartRange,
    type ChartSeries,
    formatCompact,
    formatLabel as formatCategoryLabel,
    hasAnyValue,
    isFiniteNumber,
    labelValue,
    linearLayout,
    linearScale,
    maxOf,
    mirrorLayout,
    niceTicks,
    normalizeSeries,
    stackedMax
  } from '../_lib'
  import { ChartCardInjectionKey } from '../chart-card/injection-key'
  import {
    type ChartAxisKind,
    ChartInjectionKey,
    type ChartMarkRegistration,
    type ChartOrientation
  } from './injection-key'

  defineOptions({ name: 'Chart', inheritAttrs: false })

  interface Props {
    /** Series to plot. The first six take the fixed categorical slots in order; the rest fold into Other. */
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

  const props = withDefaults(defineProps<Props>(), {
    series: () => [],
    labels: () => [],
    orientation: 'vertical',
    labelScale: 'category',
    min: 0,
    max: undefined,
    cap: 6,
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
    /** The parts: Grid, Axis, Brush, Line, Area, Bar, Scatter, Crosshair, Tooltip, Legend, in paint order. */
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
  const valueText = (value: number): string =>
    props.formatValue === formatCompact
      ? formatCompact(value, locale.value)
      : props.formatValue(value)
  const mounted = useMounted()
  const labelZone = computed<string | undefined>(
    () => props.timeZone || (mounted.value ? undefined : 'UTC')
  )
  const labelText = (label: ChartLabel): string =>
    props.formatLabel === formatCategoryLabel
      ? formatCategoryLabel(label, locale.value, labelZone.value)
      : props.formatLabel(label)
  const card = inject(ChartCardInjectionKey, null)
  const uid = useId()
  const reducedMotion = usePreferredReducedMotion()
  const direction = useDirection()
  const rtl = computed(() => direction.value === 'rtl')
  const stageRef = ref<globalThis.HTMLElement | null>(null)
  const { width: stageWidth, height: stageHeight } = useElementSize(stageRef)

  const marks = shallowReactive(new Map<symbol, () => ChartMarkRegistration>())
  const axes = shallowReactive(new Map<symbol, () => ChartAxisKind>())
  const brushes = shallowReactive(new Set<symbol>())
  const emphasized = ref<string | null>(null)
  const focusedSeries = ref<string | null>(null)
  const draft = ref<ChartRange | null>(null)
  const committed = ref(false)
  const entered = ref(false)
  let frame = 0

  const LABEL_CHAR_WIDTH = 7
  const LABEL_GUTTER = 12
  const CATEGORY_LABEL_LIMIT = 160
  const TWIN_ROW_LIMIT = 1000

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-chart')
  const summaryId = `${uid}-summary`
  const liveId = `${uid}-live`

  const vertical = computed(() => props.orientation === 'vertical')
  const series = computed(() =>
    normalizeSeries(props.series, {
      cap: props.cap,
      otherLabel: props.otherLabel || t('chart.otherSeries')
    })
  )
  const hidden = computed<ReadonlySet<string>>(() => new Set(hiddenSeries.value))
  const visibleSeries = computed(() => series.value.filter((entry) => !hidden.value.has(entry.id)))
  const count = computed(() =>
    Math.max(props.labels.length, ...series.value.map((entry) => entry.values.length), 0)
  )
  const labels = computed<ChartLabel[]>(() =>
    Array.from({ length: count.value }, (_, index) => props.labels[index] ?? String(index + 1))
  )

  const twinRows = computed(() => {
    const total = labels.value.length
    if (total <= TWIN_ROW_LIMIT) return labels.value.map((label, index) => ({ label, index }))
    const step = (total - 1) / (TWIN_ROW_LIMIT - 1)
    return Array.from({ length: TWIN_ROW_LIMIT }, (_, row) => {
      const index = Math.round(row * step)
      return { label: labels.value[index], index }
    })
  })

  const hasError = computed(() => props.error.length > 0)
  const isEmpty = computed(() => count.value === 0 || !hasAnyValue(series.value))
  const showMarks = computed(
    () => !props.loading && !hasError.value && !isEmpty.value && !props.tableView
  )

  const markList = computed(() => [...marks.values()].map((read) => read()))
  const axisKinds = computed(() => new Set([...axes.values()].map((read) => read())))
  const banded = computed(
    () => !vertical.value || markList.value.some((mark) => mark.kind === 'bar')
  )

  const resolveSeries = (ids: readonly string[]) =>
    ids.length ? visibleSeries.value.filter((entry) => ids.includes(entry.id)) : visibleSeries.value

  const finiteValues = (ids: readonly string[]) =>
    resolveSeries(ids).flatMap((entry) => entry.values.filter(isFiniteNumber))

  const dataMax = computed(() => {
    const registrations = markList.value
    if (!registrations.length) return maxOf(finiteValues([]))
    return registrations.reduce((max, mark) => {
      const value = mark.stacked
        ? stackedMax(
            resolveSeries(mark.ids).map((entry) => entry.values),
            count.value
          )
        : maxOf(finiteValues(mark.ids))
      return Math.max(max, value)
    }, 0)
  })

  const ticks = computed(() => niceTicks(props.min, props.max ?? dataMax.value, 4))
  const fitted = computed(() => markList.value.some((mark) => mark.fit))
  const domainMax = computed(() => {
    if (props.max !== undefined) return props.max
    return fitted.value && dataMax.value > props.min ? dataMax.value : ticks.value.max
  })
  const valueTicks = computed(() =>
    ticks.value.ticks.filter((tick) => tick >= props.min && tick <= domainMax.value)
  )

  const insets = computed(() => {
    const hasX = axisKinds.value.has('x')
    const hasY = axisKinds.value.has('y')
    const valueWidth =
      Math.max(1, ...valueTicks.value.map((tick) => valueText(tick).length)) * LABEL_CHAR_WIDTH +
      LABEL_GUTTER
    const categoryWidth = Math.min(
      CATEGORY_LABEL_LIMIT,
      maxOf(
        labels.value.map((label) => labelText(label).length),
        1
      ) *
        LABEL_CHAR_WIDTH +
        LABEL_GUTTER
    )
    const labeled = markList.value.some((mark) => mark.labeled)
    const far = vertical.value ? 8 : labeled ? 56 : 16
    const near = hasY ? (vertical.value ? valueWidth : categoryWidth) : 8
    return {
      top: 8,
      right: rtl.value ? near : far,
      bottom: hasX ? 28 : 8,
      left: rtl.value ? far : near
    }
  })

  const size = computed(() => ({ width: stageWidth.value, height: stageHeight.value }))
  const plot = computed(() => ({
    left: insets.value.left,
    top: insets.value.top,
    width: Math.max(0, size.value.width - insets.value.left - insets.value.right),
    height: Math.max(0, size.value.height - insets.value.top - insets.value.bottom)
  }))

  const valueScale = computed(() =>
    vertical.value
      ? linearScale(
          [props.min, domainMax.value],
          [plot.value.top + plot.value.height, plot.value.top]
        )
      : linearScale(
          [props.min, domainMax.value],
          rtl.value
            ? [plot.value.left + plot.value.width, plot.value.left]
            : [plot.value.left, plot.value.left + plot.value.width]
        )
  )
  const baseline = computed(() => valueScale.value(props.min))
  const category = computed(() => {
    const start = vertical.value ? plot.value.left : plot.value.top
    const length = vertical.value ? plot.value.width : plot.value.height
    const layout =
      props.labelScale === 'linear'
        ? linearLayout(labels.value.map(labelValue), start, length)
        : categoryLayout(count.value, start, length, vertical.value ? banded.value : true)
    return vertical.value && rtl.value ? mirrorLayout(layout, start, length) : layout
  })

  const selection = computed<ChartRange | null>(() => {
    const current = draft.value ?? range.value
    if (!current) return null
    const last = count.value - 1
    const from = Math.max(0, Math.min(current[0], current[1]))
    const to = Math.min(last, Math.max(current[0], current[1]))
    return from <= to ? [from, to] : null
  })
  const hasBrush = computed(() => brushes.size > 0)

  const accessibleName = computed(() => props.ariaLabel || undefined)
  const labelledBy = computed(() =>
    !props.ariaLabel && card?.hasTitle.value ? card.titleId : undefined
  )
  const describedBy = computed(() =>
    card?.hasDescription.value ? `${card.descriptionId} ${summaryId}` : summaryId
  )

  const summary = computed(() => {
    const first = labels.value[0]
    const last = labels.value[labels.value.length - 1]
    const range =
      first !== undefined && last !== undefined
        ? t('chart.summaryRange', { from: labelText(first), to: labelText(last) })
        : ''
    return t('chart.summary', {
      series: visibleSeries.value.length,
      points: count.value,
      range
    })
  })

  const pointAt = (index: number): ChartPoint => ({
    index,
    label: labels.value[index] ?? String(index + 1),
    values: Object.fromEntries(
      visibleSeries.value.map((entry) => [entry.id, entry.values[index] ?? null])
    )
  })

  const rangeText = (key: 'chart.rangeDraft' | 'chart.rangeSelected', span: ChartRange) => {
    const from = labels.value[span[0]]
    const to = labels.value[span[1]]
    return t(key, {
      from: from === undefined ? '' : labelText(from),
      to: to === undefined ? '' : labelText(to)
    })
  }

  const announcement = computed(() => {
    if (!showMarks.value) return ''
    if (draft.value && selection.value) return rangeText('chart.rangeDraft', selection.value)
    if (committed.value && selection.value) return rangeText('chart.rangeSelected', selection.value)
    const index = activeIndex.value
    if (index === null) return ''
    const label = labels.value[index]
    const focus = visibleSeries.value.some((entry) => entry.id === focusedSeries.value)
      ? focusedSeries.value
      : null
    const readings = visibleSeries.value
      .filter((entry) => focus === null || entry.id === focus)
      .map((entry) => {
        const value = entry.values[index]
        return `${entry.name} ${isFiniteNumber(value) ? valueText(value) : t('chart.noData')}`
      })
      .join(', ')
    return `${label === undefined ? '' : labelText(label)}: ${readings}`
  })

  const formatCell = (value: number | null | undefined) =>
    isFiniteNumber(value) ? valueText(value) : ''

  function cancelEnter() {
    if (frame) globalThis.cancelAnimationFrame(frame)
    frame = 0
  }

  function scheduleEnter() {
    cancelEnter()
    entered.value = false
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
  }

  watch(
    [showMarks, () => stageWidth.value > 0],
    ([show, measured]) => {
      if (show && measured) scheduleEnter()
      else if (!show) {
        cancelEnter()
        entered.value = false
      }
    },
    { immediate: true }
  )

  onScopeDispose(cancelEnter)

  function setActiveIndex(index: number | null) {
    committed.value = false
    if (activeIndex.value !== index) activeIndex.value = index
  }

  function setFocusedSeries(id: string | null) {
    focusedSeries.value = id
    emphasized.value = id
  }

  function commitRange(span: ChartRange | null) {
    draft.value = null
    if (!span) return
    range.value = [Math.min(span[0], span[1]), Math.max(span[0], span[1])]
    committed.value = true
  }

  function setEmphasized(id: string | null) {
    emphasized.value = id
  }

  function toggleSeries(event: MouseEvent, id: string) {
    const target = series.value.find((entry) => entry.id === id)
    if (!target) return
    hiddenSeries.value = hidden.value.has(id)
      ? hiddenSeries.value.filter((entry) => entry !== id)
      : [...hiddenSeries.value, id]
    emit('legend-toggle', event, target.source)
  }

  function registerMark(read: () => ChartMarkRegistration) {
    const key = Symbol('mark')
    marks.set(key, read)
    return () => {
      marks.delete(key)
    }
  }

  function registerAxis(read: () => ChartAxisKind) {
    const key = Symbol('axis')
    axes.set(key, read)
    return () => {
      axes.delete(key)
    }
  }

  function registerBrush() {
    const key = Symbol('brush')
    brushes.add(key)
    return () => {
      brushes.delete(key)
    }
  }

  function indexAtPointer(event: globalThis.PointerEvent): number | null {
    const stage = stageRef.value
    if (!stage || !count.value) return null
    const rect = stage.getBoundingClientRect()
    const offset = vertical.value ? event.clientX - rect.left : event.clientY - rect.top
    return category.value.indexAt(offset)
  }

  function onPointerDown(event: globalThis.PointerEvent) {
    if (!hasBrush.value || event.button !== 0) return
    const index = indexAtPointer(event)
    if (index === null) return
    draft.value = [index, index]
    setActiveIndex(index)
    try {
      stageRef.value?.setPointerCapture?.(event.pointerId)
    } catch {
      return
    }
  }

  function onPointerMove(event: globalThis.PointerEvent) {
    const index = indexAtPointer(event)
    if (index === null) return
    if (draft.value) draft.value = [draft.value[0], index]
    setActiveIndex(index)
  }

  function onPointerUp() {
    if (draft.value) commitRange(draft.value)
  }

  function onPointerCancel() {
    draft.value = null
  }

  function onPointerLeave() {
    if (!draft.value) setActiveIndex(null)
  }

  function onClick(event: MouseEvent) {
    if (activeIndex.value === null) return
    emit('point-click', event, pointAt(activeIndex.value))
  }

  function stepSeries(delta: number) {
    const list = visibleSeries.value
    if (list.length < 2) return
    const at = list.findIndex((entry) => entry.id === focusedSeries.value)
    const next = at === -1 ? (delta > 0 ? 0 : list.length - 1) : at + delta
    const target = list[next]
    setFocusedSeries(target ? target.id : null)
    if (activeIndex.value === null) setActiveIndex(0)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    const last = count.value - 1
    if (last < 0) return
    const current = activeIndex.value
    const key = logicalArrowKey(event.key, direction.value)
    const forward = vertical.value ? 'ArrowRight' : 'ArrowDown'
    const backward = vertical.value ? 'ArrowLeft' : 'ArrowUp'
    const nextSeries = vertical.value ? 'ArrowDown' : 'ArrowRight'
    const previousSeries = vertical.value ? 'ArrowUp' : 'ArrowLeft'
    let target: number | null = null
    if (key === forward) target = current === null ? 0 : Math.min(last, current + 1)
    else if (key === backward) target = current === null ? last : Math.max(0, current - 1)
    else if (key === 'Home') target = 0
    else if (key === 'End') target = last

    if (target !== null) {
      if (hasBrush.value && event.shiftKey) {
        const anchor = draft.value?.[0] ?? current ?? target
        draft.value = [anchor, target]
      } else if (draft.value) draft.value = null
      setActiveIndex(target)
    } else if (key === nextSeries) stepSeries(1)
    else if (key === previousSeries) stepSeries(-1)
    else if (key === 'Escape') {
      if (draft.value) draft.value = null
      else if (focusedSeries.value !== null) setFocusedSeries(null)
      else if (current !== null) setActiveIndex(null)
      else if (range.value) range.value = null
    } else if (key === 'Enter' || key === ' ') {
      if (draft.value) commitRange(draft.value)
      else if (current !== null) {
        if (hasBrush.value) commitRange([current, current])
        emit('point-click', event, pointAt(current))
      }
    } else return
    event.preventDefault()
  }

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
    registerMark,
    registerAxis,
    registerBrush
  })
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-loading="loading || null"
    :data-error="(!loading && hasError) || null"
    :data-empty="(!loading && !hasError && isEmpty) || null"
    :data-refetching="refetching || null"
    :data-table-view="tableView || null"
    :data-active="activeIndex !== null || null"
    :data-label-scale="labelScale"
    :data-brushing="draft !== null || null"
    :aria-busy="loading || refetching || undefined"
    :style="{ '--chart-plot-min': `${height}px` }"
    class="relative m-0 grid h-full min-w-0 grid-cols-1 grid-rows-[minmax(var(--chart-plot-min),1fr)_auto] [&_svg]:transition-opacity [&_svg]:duration-moderate-01 motion-reduce:[&_svg]:transition-none data-[refetching]:[&_svg]:opacity-60"
  >
    <div
      v-if="loading"
      class="col-start-1 row-start-1 flex min-h-0"
    >
      <Skeleton
        width="100%"
        height="100%"
        :data-testid="`${testId}__skeleton`"
      />
    </div>
    <div
      v-else-if="hasError"
      class="col-start-1 row-start-1 flex items-center justify-center p-(--spacing-md)"
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
      class="col-start-1 row-start-1 flex items-stretch"
    >
      <slot name="empty">
        <EmptyState
          :title="emptyTitle || t('chart.emptyTitle')"
          :description="emptyDescription"
          :icon="vertical ? 'pi pi-chart-line' : 'pi pi-chart-bar'"
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
      v-else-if="tableView"
      class="col-start-1 row-start-1 min-h-0 overflow-auto"
    >
      <table
        :data-testid="`${testId}__table`"
        class="w-full border-collapse text-body-sm text-(--text-default)"
      >
        <caption class="sr-only">
          {{
            ariaLabel || summary
          }}
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              class="border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-start text-label-sm text-(--text-muted)"
            >
              {{ t('chart.label') }}
            </th>
            <th
              v-for="entry in visibleSeries"
              :key="entry.id"
              scope="col"
              class="border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-end text-label-sm text-(--text-muted)"
            >
              {{ entry.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(label, index) in labels"
            :key="index"
          >
            <th
              scope="row"
              class="border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-xxs) text-start text-body-sm"
            >
              {{ labelText(label) }}
            </th>
            <td
              v-for="entry in visibleSeries"
              :key="entry.id"
              class="border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-xxs) text-end tabular-nums"
            >
              {{ formatCell(entry.values[index]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <template v-else>
      <div
        ref="stageRef"
        role="group"
        :aria-roledescription="t('chart.roleDescription')"
        tabindex="0"
        :aria-label="accessibleName"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        :data-testid="`${testId}__plot`"
        :data-brush="hasBrush || null"
        :style="{ minHeight: `${height}px` }"
        class="col-start-1 row-start-1 min-h-0 min-w-0 cursor-crosshair rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[brush]:touch-pan-y"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @pointerleave="onPointerLeave"
        @click="onClick"
        @keydown="onKeydown"
      />
      <slot />
    </template>

    <p
      :id="summaryId"
      class="sr-only"
    >
      {{ summary }}
    </p>
    <p
      :id="liveId"
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__live`"
    >
      {{ announcement }}
    </p>
    <div
      v-if="showMarks"
      class="sr-only"
    >
      <table :data-testid="`${testId}__twin`">
        <caption>
          {{
            ariaLabel || summary
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ t('chart.label') }}</th>
            <th
              v-for="entry in visibleSeries"
              :key="entry.id"
              scope="col"
            >
              {{ entry.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="{ label, index } in twinRows"
            :key="index"
          >
            <th scope="row">{{ labelText(label) }}</th>
            <td
              v-for="entry in visibleSeries"
              :key="entry.id"
            >
              {{ formatCell(entry.values[index]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>
