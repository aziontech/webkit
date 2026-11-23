<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Input from '../../input/input/input.vue'
  import { useTraceDetail } from './composables/use-trace-detail'
  import { useTraceNavigation } from './composables/use-trace-navigation'
  import {
    buildLanes,
    buildRows,
    childrenOf,
    criticalPathOf,
    fitWindow,
    placeSpan,
    shownIds,
    slowestOf,
    timelineOrderOf
  } from './lib/trace-model'
  import { axisTicks, spanLabel } from './lib/trace-text'
  import TraceDetail from './parts/trace-detail.vue'
  import TraceMinimap from './parts/trace-minimap.vue'
  import TraceRows from './parts/trace-rows.vue'
  import TraceTimeline from './parts/trace-timeline.vue'
  import type { TracePlaced, TraceRange, TraceRow, TraceSpan, TraceView } from './types'

  export type { TraceRange, TraceSpan, TraceSpanEvent, TraceSpanStatus, TraceView } from './types'

  defineOptions({
    name: 'Trace',
    inheritAttrs: false
  })

  export interface TraceProps {
    /** Spans of the trace, each `{ id, parentId?, name, service?, icon?, start, duration, status?, message?, attributes? }` in milliseconds. */
    spans?: TraceSpan[]
    /** Accessible name of the waterfall. Empty uses the locale catalog. */
    ariaLabel?: string
    /** Draws the outer border and radius. Off for a trace inside a card or panel that has its own. */
    bordered?: boolean
    /** Shows placeholder rows while the spans load; search and selection wait. */
    loading?: boolean
    /** Shows a minimap under the axis to zoom the waterfall into a window of the run. Supports v-model:range. */
    zoomable?: boolean
    /** Flags the span that took longest, other than the root, in its row and its details. */
    highlightSlowest?: boolean
    /** Draws the critical path of the run under the bars and flags the spans on it in their rows and details. */
    highlightCriticalPath?: boolean
  }

  const props = withDefaults(defineProps<TraceProps>(), {
    spans: () => [],
    ariaLabel: '',
    bordered: true,
    loading: false,
    zoomable: false,
    highlightSlowest: false,
    highlightCriticalPath: false
  })

  /** Id of the span whose details show under the waterfall. Supports v-model:selected-key. */
  const current = defineModel<string>('selectedKey', { default: '' })

  const range = defineModel<TraceRange | null>('range', { default: null })

  /** View the reader picked: waterfall, timeline or tree. Supports v-model:view. */
  const layout = defineModel<TraceView>('view', { default: 'waterfall' })

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ trace: en.trace })
  const uid = useId()
  const detailId = `${uid}-detail`
  const LOADING_ROWS = 5

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'trace')
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const gridEl = ref<HTMLElement | null>(null)
  const search = ref<string>('')
  const collapsed = ref<Set<string>>(new Set())
  const focusedId = ref<string>('')

  const known = computed(() => new Set(props.spans.map((span) => span.id)))
  const children = computed(() => childrenOf(props.spans, known.value))
  const total = computed<number>(() =>
    props.spans.reduce((max, span) => Math.max(max, span.start + span.duration), 1)
  )
  const minSpan = computed<number>(() => Math.min(total.value, Math.max(1, total.value * 0.01)))
  const win = computed<TraceRange>(() =>
    range.value
      ? fitWindow(range.value[0], range.value[1], total.value, minSpan.value)
      : [0, total.value]
  )
  const zoomed = computed<boolean>(() => win.value[0] > 0 || win.value[1] < total.value)

  const slowestId = computed<string>(() =>
    props.highlightSlowest ? slowestOf(props.spans, known.value) : ''
  )
  const criticalPath = computed<Map<string, TraceRange[]>>(() =>
    props.highlightCriticalPath ? criticalPathOf(children.value) : new Map()
  )

  const term = computed<string>(() => search.value.trim().toLocaleLowerCase())
  const matches = (span: TraceSpan): boolean =>
    span.name.toLocaleLowerCase().includes(term.value) ||
    (span.service ?? '').toLocaleLowerCase().includes(term.value)
  const shown = computed<Set<string> | null>(() =>
    term.value ? shownIds(children.value, matches) : null
  )
  const dimmed = (span: TraceSpan): boolean => Boolean(term.value) && !matches(span)

  const place = (span: TraceSpan, depth: number) =>
    placeSpan(span, depth, win.value, criticalPath.value)
  const rows = computed<TraceRow[]>(() =>
    buildRows(children.value, shown.value, collapsed.value, place)
  )
  const lanes = computed(() =>
    layout.value === 'timeline' ? buildLanes(children.value, place) : []
  )
  const timelineOrder = computed<string[]>(() => timelineOrderOf(lanes.value))

  const hasContent = computed<boolean>(() =>
    layout.value === 'timeline'
      ? props.spans.length > 0 && (!shown.value || shown.value.size > 0)
      : rows.value.length > 0
  )

  const viewOptions = computed(() =>
    (['waterfall', 'timeline', 'tree'] as const).map((value) => ({
      value,
      label: t(`trace.${value}`)
    }))
  )

  const secondsFormat = computed(
    () =>
      new Intl.NumberFormat(locale.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  )

  const formatDuration = (ms: number): string =>
    ms >= 1000
      ? t('trace.seconds', { value: secondsFormat.value.format(ms / 1000) })
      : t('trace.milliseconds', { value: Math.round(ms) })

  const ticks = computed(() => axisTicks(win.value, formatDuration))

  const tabStop = computed<string>(() => {
    const ids =
      layout.value === 'timeline' ? timelineOrder.value : rows.value.map((row) => row.span.id)
    if (ids.includes(focusedId.value)) return focusedId.value
    if (ids.includes(current.value)) return current.value
    return ids[0] ?? ''
  })

  const detail = computed<TraceSpan | null>(() =>
    props.loading ? null : (props.spans.find((span) => span.id === current.value) ?? null)
  )

  const { detailFacts, detailEvents, detailAttributes } = useTraceDetail({
    detail,
    children,
    criticalPath,
    total,
    t,
    format: formatDuration
  })

  const rowLabel = (row: TracePlaced): string => spanLabel(row, slowestId.value, t, formatDuration)

  const { toggle, close } = useTraceNavigation({
    gridEl,
    rows,
    timelineOrder,
    shown,
    collapsed,
    focusedId,
    current,
    timeline: () => layout.value === 'timeline'
  })

  const ROOT_CLASS =
    'group/trace @container/trace flex w-full min-w-0 flex-col overflow-hidden bg-(--bg-surface) ' +
    'data-bordered:rounded-(--shape-card) data-bordered:border data-bordered:border-(--border-default)'

  const AXIS_CLASS =
    '[--trace-name:min(55%,13rem)] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted) ' +
    'data-[view=timeline]:grid-cols-1 data-[view=tree]:grid-cols-[minmax(0,1fr)_auto]'

  const TICK_CLASS =
    'absolute inset-y-0 start-(--trace-tick-at) flex w-0 items-center justify-center ' +
    'data-[edge=end]:justify-end data-[edge=start]:justify-start ' +
    '@max-xs/trace:data-[density=mid]:hidden @max-xl/trace:data-[density=quarter]:hidden'

  const GRID_LINES_CLASS =
    '[--trace-name:min(55%,13rem)] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'pointer-events-none absolute inset-y-0 start-[calc(var(--trace-name)+var(--spacing-md))] end-(--spacing-md) hidden ' +
    '@xl/trace:block ' +
    'data-[view=timeline]:start-(--spacing-md)'

  const SKELETON_CLASS =
    '[--trace-name:min(55%,13rem)] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid min-h-9 grid-cols-[var(--trace-name)_minmax(0,1fr)] items-center border-b border-(--border-muted) ' +
    'last:border-b-0'
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-bordered="bordered || null"
    :data-loading="loading || null"
    :data-view="layout"
    :aria-busy="loading || undefined"
    :class="ROOT_CLASS"
  >
    <div
      class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-muted) p-(--spacing-xs)"
    >
      <Input
        v-model="search"
        size="medium"
        :disabled="loading"
        :placeholder="t('trace.search')"
        :aria-label="t('trace.search')"
        :data-testid="`${testId}__search`"
        class="max-w-80 min-w-0 flex-1 basis-40"
      >
        <template #leading>
          <i
            class="az az-search text-(--text-muted)"
            aria-hidden="true"
          />
        </template>
      </Input>
      <ToggleGroup
        v-model="layout"
        :options="viewOptions"
        size="medium"
        :aria-label="t('trace.view')"
        :data-testid="`${testId}__view`"
        class="ms-auto shrink-0"
      />
    </div>

    <div
      :data-view="layout"
      :class="AXIS_CLASS"
    >
      <div
        v-if="layout !== 'timeline'"
        class="flex items-center border-e border-(--border-muted) py-(--spacing-xs) ps-[calc(var(--spacing-xs)+1.25rem+var(--spacing-2xs))] pe-(--spacing-sm)"
      >
        <span class="text-label-sm text-(--text-muted)">{{ t('trace.span') }}</span>
      </div>
      <div
        v-if="layout === 'tree'"
        class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-xs)"
      >
        <span class="w-20 text-end text-label-sm text-(--text-muted)">{{
          t('trace.startedAt')
        }}</span>
        <span class="w-20 text-end text-label-sm text-(--text-muted)">{{
          t('trace.duration')
        }}</span>
      </div>
      <div
        v-else
        class="flex items-center px-(--spacing-md)"
        aria-hidden="true"
      >
        <div
          class="relative h-(--size-10) w-full"
          :data-testid="`${testId}__axis`"
        >
          <span
            v-for="tick in ticks"
            :key="tick.at"
            :data-edge="tick.edge"
            :data-density="tick.density"
            :style="{ '--trace-tick-at': `${tick.at * 100}%` }"
            :class="TICK_CLASS"
          >
            <span class="text-label-sm whitespace-nowrap text-(--text-muted) tabular-nums">{{
              tick.label
            }}</span>
          </span>
        </div>
      </div>
    </div>

    <TraceMinimap
      v-if="zoomable && spans.length && layout !== 'tree'"
      v-model:range="range"
      :spans="spans"
      :known="known"
      :total="total"
      :min-span="minSpan"
      :win="win"
      :zoomed="zoomed"
      :format="formatDuration"
      :test-id="testId"
    />

    <div
      ref="gridEl"
      class="relative"
    >
      <div
        v-if="layout !== 'tree'"
        aria-hidden="true"
        :data-view="layout"
        :class="GRID_LINES_CLASS"
      >
        <span class="absolute inset-y-0 start-1/4 w-px bg-(--border-muted)" />
        <span class="absolute inset-y-0 start-1/2 w-px bg-(--border-muted)" />
        <span class="absolute inset-y-0 start-3/4 w-px bg-(--border-muted)" />
      </div>

      <div
        v-if="loading"
        role="status"
        :aria-label="t('trace.loading')"
        :data-testid="`${testId}__loading`"
        class="flex flex-col"
      >
        <div
          v-for="n in LOADING_ROWS"
          :key="n"
          :data-testid="`${testId}__skeleton`"
          :class="SKELETON_CLASS"
        >
          <span class="px-(--spacing-sm) py-(--spacing-xs)">
            <Skeleton
              height="0.75rem"
              width="70%"
            />
          </span>
          <span class="px-(--spacing-md) py-(--spacing-xs)">
            <Skeleton height="0.75rem" />
          </span>
        </div>
      </div>

      <TraceTimeline
        v-else-if="layout === 'timeline' && hasContent"
        :lanes="lanes"
        :tab-stop="tabStop"
        :selected-key="current"
        :slowest-id="slowestId"
        :label="ariaLabel || t('trace.label')"
        :described-by="detail ? detailId : ''"
        :span-label="rowLabel"
        :format="formatDuration"
        :dimmed="dimmed"
        :test-id="testId"
      />

      <TraceRows
        v-else-if="layout !== 'timeline' && rows.length"
        :rows="rows"
        :layout="layout"
        :tab-stop="tabStop"
        :selected-key="current"
        :slowest-id="slowestId"
        :label="ariaLabel || t('trace.label')"
        :described-by="detail ? detailId : ''"
        :span-label="rowLabel"
        :format="formatDuration"
        :test-id="testId"
        @toggle="(_event: MouseEvent, row: TraceRow) => toggle(row)"
      />

      <div
        v-else
        class="p-(--spacing-md)"
        :data-testid="`${testId}__empty`"
      >
        <EmptyState
          size="small"
          :icon="term ? 'az az-search' : 'az az-sitemap'"
          :title="term ? t('trace.noMatch', { query: search.trim() }) : t('trace.emptyTitle')"
        >
          <template
            v-if="term"
            #actions
          >
            <Button
              :label="t('trace.clearSearch')"
              variant="ghost"
              size="medium"
              @click="search = ''"
            />
          </template>
        </EmptyState>
      </div>
    </div>

    <TraceDetail
      v-if="detail"
      :id="detailId"
      :detail="detail"
      :slowest="detail.id === slowestId"
      :critical="criticalPath.has(detail.id)"
      :facts="detailFacts"
      :events="detailEvents"
      :attributes="detailAttributes"
      :test-id="testId"
      @close="close"
    />
  </div>
</template>
