<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { usePreferredReducedMotion } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Message from '../../feedback/message/message.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { type ChartSeries, formatCompact, formatShare, normalizeSeries } from '../_lib'

  defineOptions({ name: 'DonutChart', inheritAttrs: false })

  export type DonutChartKind = 'donut' | 'pie'
  export type DonutChartSize = 'small' | 'medium' | 'large'

  interface Props {
    /** One slice per series; a slice is the sum of its values. The first six take the categorical slots, the rest fold into Other. */
    series?: ChartSeries[]
    /** Ring or solid disc. */
    kind?: DonutChartKind
    /** Diameter of the ring: 128, 176 or 240 pixels. */
    size?: DonutChartSize
    /** Slices kept before the rest fold into Other. */
    cap?: number
    /** Name of the folded slice. */
    otherLabel?: string
    /** Caption under the total in the center. */
    totalLabel?: string
    /** Formats the center value and legend values. */
    formatValue?: (value: number) => string
    /** Renders a circular Skeleton and suppresses interaction. */
    loading?: boolean
    /** Holds the previous render at reduced opacity while new data loads. */
    refetching?: boolean
    /** Error message; when set, a danger Message replaces the ring. */
    error?: string
    /** Title of the empty state shown when every slice is zero. */
    emptyTitle?: string
    /** Shows the data table in place of the ring. The table is always present for assistive tech. */
    tableView?: boolean
    /** Accessible name of the chart. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    series: () => [],
    kind: 'donut',
    size: 'medium',
    cap: 6,
    otherLabel: 'Other',
    totalLabel: 'Total',
    formatValue: formatCompact,
    loading: false,
    refetching: false,
    error: '',
    emptyTitle: 'No data available',
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
    /** Replaces the default danger Message. */
    error(): unknown
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const reducedMotion = usePreferredReducedMotion()
  const entered = ref(false)
  let frame = 0

  const RADIUS = { donut: 40, pie: 25 } as const
  const WIDTH = { donut: 14, pie: 50 } as const
  const LIFT = { donut: 4, pie: 0 } as const
  const GAP = 0.6

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-donut-chart')
  const summaryId = `${uid}-summary`

  const series = computed(() =>
    normalizeSeries(props.series, { cap: props.cap, otherLabel: props.otherLabel })
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

  const centerValue = computed(() =>
    props.formatValue(active.value ? active.value.total : total.value)
  )
  const centerCaption = computed(() =>
    active.value
      ? `${active.value.name}, ${formatShare(active.value.total, total.value)}`
      : props.totalLabel
  )

  const legend = computed(() =>
    series.value.map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      value: props.formatValue(entry.total),
      share: hidden.value.has(entry.id) ? '' : formatShare(entry.total, total.value),
      hidden: hidden.value.has(entry.id)
    }))
  )

  const summary = computed(
    () => `${visible.value.length} slices, ${props.formatValue(total.value)} in total.`
  )

  const announcement = computed(() =>
    active.value
      ? `${active.value.name}: ${props.formatValue(active.value.total)}, ${formatShare(active.value.total, total.value)}`
      : ''
  )

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

  onMounted(() => {
    if (showRing.value) scheduleEnter()
  })

  watch(showRing, (show) => {
    if (show) scheduleEnter()
    else {
      cancelEnter()
      entered.value = false
    }
  })

  onScopeDispose(cancelEnter)

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
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      setActive(current === null ? 0 : Math.min(last, current + 1))
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      setActive(current === null ? last : Math.max(0, current - 1))
    else if (event.key === 'Home') setActive(0)
    else if (event.key === 'End') setActive(last)
    else if (event.key === 'Escape') setActive(null)
    else if (event.key === 'Enter' || event.key === ' ') {
      const slice = current === null ? undefined : slices.value[current]
      if (slice) emit('slice-click', event, slice.entry.source)
    } else return
    event.preventDefault()
  }

  function toggle(event: MouseEvent, id: string) {
    const target = series.value.find((entry) => entry.id === id)
    if (!target) return
    hiddenSeries.value = hidden.value.has(id)
      ? hiddenSeries.value.filter((entry) => entry !== id)
      : [...hiddenSeries.value, id]
    setActive(null)
    emit('legend-toggle', event, target.source)
  }
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-loading="loading || null"
    :data-error="(!loading && hasError) || null"
    :data-empty="(!loading && !hasError && isEmpty) || null"
    :data-refetching="refetching || null"
    :data-table-view="tableView || null"
    :aria-busy="loading || refetching || undefined"
    class="m-0 flex min-w-0 flex-wrap items-center gap-(--spacing-md) transition-opacity duration-moderate-01 motion-reduce:transition-none data-[refetching]:opacity-60"
  >
    <Skeleton
      v-if="loading"
      kind="circle"
      :width="size === 'small' ? '128px' : size === 'large' ? '240px' : '176px'"
      :height="size === 'small' ? '128px' : size === 'large' ? '240px' : '176px'"
      :data-testid="`${testId}__skeleton`"
    />
    <div
      v-else-if="hasError"
      class="flex flex-1 items-center justify-center p-(--spacing-md)"
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
      class="flex flex-1 items-center justify-center"
    >
      <slot name="empty">
        <EmptyState
          :title="emptyTitle"
          size="small"
          :data-testid="`${testId}__empty`"
        />
      </slot>
    </div>
    <table
      v-else-if="tableView"
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
            v-for="heading in ['Name', 'Value', 'Share']"
            :key="heading"
            scope="col"
            class="border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-start text-label-sm text-(--text-muted)"
          >
            {{ heading }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in legend"
          :key="entry.id"
        >
          <th
            scope="row"
            class="border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-xxs) text-start text-body-sm"
          >
            {{ entry.name }}
          </th>
          <td
            class="border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-xxs) tabular-nums"
          >
            {{ entry.value }}
          </td>
          <td
            class="border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-xxs) tabular-nums"
          >
            {{ entry.share }}
          </td>
        </tr>
      </tbody>
    </table>
    <template v-else>
      <div
        role="group"
        aria-roledescription="chart"
        tabindex="0"
        :aria-label="ariaLabel || undefined"
        :aria-describedby="summaryId"
        :data-size="size"
        :data-testid="`${testId}__ring`"
        class="relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[size=large]:size-60 data-[size=medium]:size-44 data-[size=small]:size-32"
        @keydown="onKeydown"
        @click="onRingClick"
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
            :r="RADIUS[kind]"
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
              '--donut-dash': slice.dash,
              '--donut-width': `${WIDTH[kind]}`,
              '--donut-lift': `${WIDTH[kind] + LIFT[kind]}`,
              transitionDelay: slice.delay
            }"
            class="cursor-pointer [stroke-dasharray:0_100] [stroke-width:var(--donut-width)] transition-[stroke-dasharray,stroke-width,opacity] duration-slow-02 ease-productive-entrance motion-reduce:transition-none data-[active]:[stroke-width:var(--donut-lift)] data-[dimmed]:opacity-40 data-[entered]:[stroke-dasharray:var(--donut-dash)]"
            @pointerenter="setActive(index)"
          />
        </svg>
        <div
          v-if="kind === 'donut'"
          class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-(--spacing-xxs) px-(--spacing-lg) text-center"
          :data-testid="`${testId}__center`"
        >
          <slot
            name="center"
            :total="total"
            :active="active ? active.source : null"
          >
            <span class="text-heading-md tabular-nums text-(--text-default)">{{
              centerValue
            }}</span>
            <span class="line-clamp-2 text-body-sm text-(--text-muted)">{{ centerCaption }}</span>
          </slot>
        </div>
      </div>
      <ul
        v-if="legend.length > 1"
        :data-testid="`${testId}__legend`"
        class="m-0 flex min-w-0 grow basis-48 list-none flex-col gap-(--spacing-xxs) p-0"
      >
        <li
          v-for="entry in legend"
          :key="entry.id"
        >
          <button
            type="button"
            :aria-pressed="!entry.hidden"
            :data-hidden="entry.hidden || null"
            :data-testid="`${testId}__legend-item`"
            class="inline-flex min-h-6 w-full items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xxs) text-start text-body-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[hidden]:text-(--text-muted)"
            @click="toggle($event, entry.id)"
          >
            <span
              :data-hidden="entry.hidden || null"
              :style="{ '--donut-key': entry.color }"
              class="size-2.5 shrink-0 rounded-(--shape-flat) bg-(--donut-key) data-[hidden]:opacity-30"
            />
            <span class="min-w-0 flex-1 truncate">{{ entry.name }}</span>
            <span class="tabular-nums text-(--text-muted)">{{ entry.value }}</span>
            <span class="w-10 text-end tabular-nums text-(--text-muted)">{{ entry.share }}</span>
          </button>
        </li>
      </ul>
    </template>

    <p
      :id="summaryId"
      class="sr-only"
    >
      {{ summary }}
    </p>
    <p
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__live`"
    >
      {{ announcement }}
    </p>
    <table
      v-if="showRing"
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
          <th scope="col">Name</th>
          <th scope="col">Value</th>
          <th scope="col">Share</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in legend"
          :key="entry.id"
        >
          <th scope="row">{{ entry.name }}</th>
          <td>{{ entry.value }}</td>
          <td>{{ entry.share }}</td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>
