<script setup lang="ts">
  import { useElementSize, usePreferredReducedMotion } from '@vueuse/core'
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

  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Message from '../../feedback/message/message.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import {
    categoryLayout,
    type ChartLabel,
    type ChartMarkKind,
    type ChartPoint,
    type ChartSeries,
    formatCompact,
    formatLabel as formatCategoryLabel,
    hasAnyValue,
    isFiniteNumber,
    linearScale,
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
    /** Floor of the value axis. Marks grow from one baseline. */
    min?: number
    /** Ceiling of the value axis. When absent, the nice ceiling of the visible data. */
    max?: number
    /** Series kept before the rest fold into Other. */
    cap?: number
    /** Name of the folded series. */
    otherLabel?: string
    /** Formats ticks, tooltip values and legend totals. */
    formatValue?: (value: number) => string
    /** Formats category labels on the axis and in the tooltip. */
    formatLabel?: (label: ChartLabel) => string
    /** Minimum plot height in pixels; the plot grows to fill a taller container. */
    height?: number
    /** Renders a Skeleton sized to the plot and suppresses interaction. */
    loading?: boolean
    /** Holds the previous render at reduced opacity while new data loads. */
    refetching?: boolean
    /** Error message; when set, the plot renders a danger Message instead of marks. */
    error?: string
    /** Title of the empty state shown when no series has a value. */
    emptyTitle?: string
    /** Shows the data table in place of the marks. The table is always present for assistive tech. */
    tableView?: boolean
    /** Accessible name of the chart when it is not inside a ChartCard with a title. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    series: () => [],
    labels: () => [],
    orientation: 'vertical',
    min: 0,
    max: undefined,
    cap: 6,
    otherLabel: 'Other',
    formatValue: formatCompact,
    formatLabel: formatCategoryLabel,
    height: 240,
    loading: false,
    refetching: false,
    error: '',
    emptyTitle: 'No data available',
    tableView: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'point-click': [event: MouseEvent | globalThis.KeyboardEvent, point: ChartPoint]
    'legend-toggle': [event: MouseEvent, series: ChartSeries]
  }>()

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })
  const hiddenSeries = defineModel<string[]>('hiddenSeries', { default: () => [] })

  defineSlots<{
    /** The parts: Grid, Axis, Line, Area, Bar, Crosshair, Tooltip, Legend, in paint order. */
    default(): unknown
    /** Replaces the default EmptyState. */
    empty(): unknown
    /** Replaces the default danger Message. */
    error(): unknown
  }>()

  const attrs = useAttrs()
  const card = inject(ChartCardInjectionKey, null)
  const uid = useId()
  const reducedMotion = usePreferredReducedMotion()
  const stageRef = ref<globalThis.HTMLElement | null>(null)
  const { width: stageWidth, height: stageHeight } = useElementSize(stageRef)

  const marks = shallowReactive(new Map<symbol, () => ChartMarkRegistration>())
  const axes = shallowReactive(new Map<symbol, () => ChartAxisKind>())
  const emphasized = ref<string | null>(null)
  const entered = ref(false)
  let frame = 0

  const LABEL_CHAR_WIDTH = 7
  const LABEL_GUTTER = 12
  const CATEGORY_LABEL_LIMIT = 160

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-chart')
  const summaryId = `${uid}-summary`
  const liveId = `${uid}-live`

  const vertical = computed(() => props.orientation === 'vertical')
  const series = computed(() =>
    normalizeSeries(props.series, { cap: props.cap, otherLabel: props.otherLabel })
  )
  const hidden = computed<ReadonlySet<string>>(() => new Set(hiddenSeries.value))
  const visibleSeries = computed(() => series.value.filter((entry) => !hidden.value.has(entry.id)))
  const count = computed(() =>
    Math.max(props.labels.length, ...series.value.map((entry) => entry.values.length), 0)
  )
  const labels = computed<ChartLabel[]>(() =>
    Array.from({ length: count.value }, (_, index) => props.labels[index] ?? String(index + 1))
  )

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
    if (!registrations.length) return Math.max(0, ...finiteValues([]))
    return registrations.reduce((max, mark) => {
      const value = mark.stacked
        ? stackedMax(
            resolveSeries(mark.ids).map((entry) => entry.values),
            count.value
          )
        : Math.max(0, ...finiteValues(mark.ids))
      return Math.max(max, value)
    }, 0)
  })

  const ticks = computed(() => niceTicks(props.min, props.max ?? dataMax.value, 4))
  const domainMax = computed(() => props.max ?? ticks.value.max)
  const valueTicks = computed(() =>
    ticks.value.ticks.filter((tick) => tick >= props.min && tick <= domainMax.value)
  )

  const insets = computed(() => {
    const hasX = axisKinds.value.has('x')
    const hasY = axisKinds.value.has('y')
    const valueWidth =
      Math.max(1, ...valueTicks.value.map((tick) => props.formatValue(tick).length)) *
        LABEL_CHAR_WIDTH +
      LABEL_GUTTER
    const categoryWidth = Math.min(
      CATEGORY_LABEL_LIMIT,
      Math.max(1, ...labels.value.map((label) => props.formatLabel(label).length)) *
        LABEL_CHAR_WIDTH +
        LABEL_GUTTER
    )
    const labeled = markList.value.some((mark) => mark.labeled)
    return {
      top: 8,
      right: vertical.value ? 8 : labeled ? 56 : 16,
      bottom: hasX ? 28 : 8,
      left: hasY ? (vertical.value ? valueWidth : categoryWidth) : 8
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
          [plot.value.left, plot.value.left + plot.value.width]
        )
  )
  const baseline = computed(() => valueScale.value(props.min))
  const category = computed(() =>
    vertical.value
      ? categoryLayout(count.value, plot.value.left, plot.value.width, banded.value)
      : categoryLayout(count.value, plot.value.top, plot.value.height, true)
  )

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
        ? `, from ${props.formatLabel(first)} to ${props.formatLabel(last)}`
        : ''
    return `${visibleSeries.value.length} series over ${count.value} points${range}.`
  })

  const pointAt = (index: number): ChartPoint => ({
    index,
    label: labels.value[index] ?? String(index + 1),
    values: Object.fromEntries(
      visibleSeries.value.map((entry) => [entry.id, entry.values[index] ?? null])
    )
  })

  const announcement = computed(() => {
    const index = activeIndex.value
    if (index === null || !showMarks.value) return ''
    const label = labels.value[index]
    const readings = visibleSeries.value
      .map((entry) => {
        const value = entry.values[index]
        return `${entry.name} ${isFiniteNumber(value) ? props.formatValue(value) : 'no data'}`
      })
      .join(', ')
    return `${label === undefined ? '' : props.formatLabel(label)}: ${readings}`
  })

  const formatCell = (value: number | null | undefined) =>
    isFiniteNumber(value) ? props.formatValue(value) : ''

  const markKindOf = (id: string): ChartMarkKind =>
    markList.value.find((mark) => !mark.ids.length || mark.ids.includes(id))?.kind ?? 'line'

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
    if (activeIndex.value !== index) activeIndex.value = index
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

  function onPointerMove(event: globalThis.PointerEvent) {
    const stage = stageRef.value
    if (!stage || !count.value) return
    const rect = stage.getBoundingClientRect()
    const offset = vertical.value ? event.clientX - rect.left : event.clientY - rect.top
    setActiveIndex(category.value.indexAt(offset))
  }

  function onPointerLeave() {
    setActiveIndex(null)
  }

  function onClick(event: MouseEvent) {
    if (activeIndex.value === null) return
    emit('point-click', event, pointAt(activeIndex.value))
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    const last = count.value - 1
    if (last < 0) return
    const current = activeIndex.value
    const forward = vertical.value ? 'ArrowRight' : 'ArrowDown'
    const backward = vertical.value ? 'ArrowLeft' : 'ArrowUp'
    if (event.key === forward) setActiveIndex(current === null ? 0 : Math.min(last, current + 1))
    else if (event.key === backward)
      setActiveIndex(current === null ? last : Math.max(0, current - 1))
    else if (event.key === 'Home') setActiveIndex(0)
    else if (event.key === 'End') setActiveIndex(last)
    else if (event.key === 'Escape') setActiveIndex(null)
    else if (event.key === 'Enter' || event.key === ' ') {
      if (current !== null) emit('point-click', event, pointAt(current))
    } else return
    event.preventDefault()
  }

  provide(ChartInjectionKey, {
    testId: testId.value,
    orientation: computed(() => props.orientation),
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
    formatValue: (value: number) => props.formatValue(value),
    formatLabel: (label: ChartLabel) => props.formatLabel(label),
    resolveSeries,
    markKindOf,
    setActiveIndex,
    setEmphasized,
    toggleSeries,
    registerMark,
    registerAxis
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
    :aria-busy="loading || refetching || undefined"
    :style="{ '--chart-plot-min': `${height}px` }"
    class="relative m-0 grid h-full min-w-0 grid-cols-1 grid-rows-[minmax(var(--chart-plot-min),1fr)_auto] transition-opacity duration-moderate-01 motion-reduce:transition-none data-[refetching]:opacity-60"
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
        <Message
          severity="danger"
          :label="error"
          :data-testid="`${testId}__error`"
        />
      </slot>
    </div>
    <div
      v-else-if="isEmpty"
      class="col-start-1 row-start-1 flex items-center justify-center"
    >
      <slot name="empty">
        <EmptyState
          :title="emptyTitle"
          size="small"
          :data-testid="`${testId}__empty`"
        />
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
              Label
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
              {{ formatLabel(label) }}
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
        aria-roledescription="chart"
        tabindex="0"
        :aria-label="accessibleName"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        :data-testid="`${testId}__plot`"
        :style="{ minHeight: `${height}px` }"
        class="col-start-1 row-start-1 min-h-0 min-w-0 cursor-crosshair rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        @pointermove="onPointerMove"
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
    <table
      v-if="showMarks"
      class="sr-only"
      :data-testid="`${testId}__twin`"
    >
      <caption>
        {{
          ariaLabel || summary
        }}
      </caption>
      <thead>
        <tr>
          <th scope="col">Label</th>
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
          v-for="(label, index) in labels"
          :key="index"
        >
          <th scope="row">{{ formatLabel(label) }}</th>
          <td
            v-for="entry in visibleSeries"
            :key="entry.id"
          >
            {{ formatCell(entry.values[index]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>
