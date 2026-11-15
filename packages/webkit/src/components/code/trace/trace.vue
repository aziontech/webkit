<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import Tag from '../../content/tag/tag.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Input from '../../inputs/input/input.vue'

  export type TraceSpanStatus = 'success' | 'error' | 'running'

  export interface TraceSpanEvent {
    /** Milliseconds from the start of the trace. */
    at: number
    /** What happened at that moment. */
    name: string
  }

  /** Visible window of the run clock: start and end in milliseconds. */
  export type TraceRange = [number, number]

  export interface TraceSpan {
    /** Stable key of the span. */
    id: string
    /** The span this one ran inside. Unset or unknown makes it a root span. */
    parentId?: string
    /** What the span measured. */
    name: string
    /** The service or kind that ran it, printed after the name. */
    service?: string
    /** Icon class shown before the name. */
    icon?: string
    /** Milliseconds from the start of the trace. */
    start: number
    /** Milliseconds the span lasted. */
    duration: number
    /** Outcome of the span. Unset reads as success. */
    status?: TraceSpanStatus
    /** One line about the outcome, shown in the details of a failed span. */
    message?: string
    /** Extra facts listed in the details. */
    attributes?: Record<string, string | number>
    /** Moments inside the span, drawn as markers on its bar and listed in the details. */
    events?: TraceSpanEvent[]
  }

  type Row = {
    span: TraceSpan
    depth: number
    parentId: string | null
    hasChildren: boolean
    expanded: boolean
    posinset: number
    setsize: number
    status: TraceSpanStatus
    root: boolean
    offset: number
    width: number
    wide: boolean
    flip: boolean
    outside: boolean
    marks: { key: string; at: number }[]
  }

  type Edge = 'start' | 'end'

  type Drag = { mode: 'draw' | 'pan' | Edge; anchor: number; origin: TraceRange }

  defineOptions({
    name: 'Trace',
    inheritAttrs: false
  })

  interface Props {
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
  }

  const props = withDefaults(defineProps<Props>(), {
    spans: () => [],
    ariaLabel: '',
    bordered: true,
    loading: false,
    zoomable: false,
    highlightSlowest: false
  })

  /** Id of the span whose details show under the waterfall. Supports v-model:selected. */
  const current = defineModel<string>('selected', { default: '' })

  const range = defineModel<TraceRange | null>('range', { default: null })

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ trace: en.trace })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'code-trace'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const MIN_SHARE = 0.01
  const STEP_SHARE = 0.01
  const PAGE_SHARE = 0.1

  const gridRef = ref<HTMLElement | null>(null)
  const trackRef = ref<HTMLElement | null>(null)
  let drag: Drag | null = null
  const dir = useDirection(gridRef)

  const search = ref<string>('')
  const collapsed = ref<Set<string>>(new Set())
  const focusedId = ref<string>('')

  const known = computed(() => new Set(props.spans.map((span) => span.id)))

  const childrenOf = computed(() => {
    const map = new Map<string | null, TraceSpan[]>()
    props.spans.forEach((span) => {
      const key = span.parentId && known.value.has(span.parentId) ? span.parentId : null
      const list = map.get(key) ?? []
      list.push(span)
      map.set(key, list)
    })
    map.forEach((list) => list.sort((a, b) => a.start - b.start))
    return map
  })

  const total = computed<number>(() =>
    props.spans.reduce((max, span) => Math.max(max, span.start + span.duration), 1)
  )

  const minSpan = computed<number>(() =>
    Math.min(total.value, Math.max(1, total.value * MIN_SHARE))
  )

  const clamp = (value: number, low: number, high: number): number =>
    Math.min(high, Math.max(low, value))

  const view = computed<TraceRange>(() => {
    const win = range.value
    if (!win) return [0, total.value]
    let low = clamp(Math.min(win[0], win[1]), 0, total.value)
    let high = clamp(Math.max(win[0], win[1]), 0, total.value)
    if (high - low < minSpan.value) {
      high = Math.min(total.value, low + minSpan.value)
      low = Math.max(0, high - minSpan.value)
    }
    return [low, high]
  })

  const zoomed = computed<boolean>(() => view.value[0] > 0 || view.value[1] < total.value)

  const slowestId = computed<string>(() => {
    if (!props.highlightSlowest || props.spans.length < 2) return ''
    const nested = props.spans.filter((span) => span.parentId && known.value.has(span.parentId))
    const pool = nested.length ? nested : props.spans
    return pool.reduce((best, span) => (span.duration > best.duration ? span : best)).id
  })

  const term = computed<string>(() => search.value.trim().toLocaleLowerCase())

  const matches = (span: TraceSpan): boolean =>
    span.name.toLocaleLowerCase().includes(term.value) ||
    (span.service ?? '').toLocaleLowerCase().includes(term.value)

  const shown = computed<Set<string> | null>(() => {
    if (!term.value) return null
    const keep = new Set<string>()
    const visit = (span: TraceSpan): boolean => {
      const kids = (childrenOf.value.get(span.id) ?? []).map(visit)
      const hit = matches(span) || kids.some(Boolean)
      if (hit) keep.add(span.id)
      return hit
    }
    ;(childrenOf.value.get(null) ?? []).forEach(visit)
    return keep
  })

  const rows = computed<Row[]>(() => {
    const out: Row[] = []
    const walk = (parentId: string | null, depth: number): void => {
      const siblings = (childrenOf.value.get(parentId) ?? []).filter(
        (span) => !shown.value || shown.value.has(span.id)
      )
      siblings.forEach((span, index) => {
        const hasChildren = (childrenOf.value.get(span.id) ?? []).length > 0
        const expanded = hasChildren && (Boolean(shown.value) || !collapsed.value.has(span.id))
        const [low, high] = view.value
        const length = high - low
        const from = Math.max(span.start, low)
        const to = Math.min(span.start + span.duration, high)
        const outside = to < from || span.start > high || span.start + span.duration < low
        const offset = outside ? 0 : clamp((from - low) / length, 0, 1)
        const width = outside ? 0 : Math.max((to - from) / length, 0.006)
        const marks = (span.events ?? [])
          .map((event, order) => ({ key: `${order}`, at: (event.at - low) / length }))
          .filter((mark) => mark.at >= 0 && mark.at <= 1)
        const status: TraceSpanStatus = span.status ?? 'success'
        const root = depth === 0 && status === 'success'
        out.push({
          span,
          depth,
          parentId,
          hasChildren,
          expanded,
          posinset: index + 1,
          setsize: siblings.length,
          status,
          root,
          offset,
          width,
          wide: width >= 0.14,
          flip: width < 0.14 && offset + width > 0.8,
          outside,
          marks
        })
        if (expanded) walk(span.id, depth + 1)
      })
    }
    walk(null, 0)
    return out
  })

  const secondsFormat = computed(
    () =>
      new Intl.NumberFormat(locale.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  )

  const formatDuration = (ms: number): string =>
    ms >= 1000
      ? t('trace.seconds', { value: secondsFormat.value.format(ms / 1000) })
      : t('trace.milliseconds', { value: Math.round(ms) })

  const ticks = computed(() =>
    [0, 0.25, 0.5, 0.75, 1].map((at) => ({
      at,
      edge: at === 0 ? 'start' : at === 1 ? 'end' : null,
      label: formatDuration(view.value[0] + (view.value[1] - view.value[0]) * at)
    }))
  )

  const tabStop = computed<string>(() => {
    const ids = rows.value.map((row) => row.span.id)
    if (ids.includes(focusedId.value)) return focusedId.value
    if (ids.includes(current.value)) return current.value
    return ids[0] ?? ''
  })

  const detail = computed<TraceSpan | null>(() =>
    props.loading ? null : (props.spans.find((span) => span.id === current.value) ?? null)
  )

  const detailFacts = computed(() => {
    const span = detail.value
    if (!span) return []
    const facts = [
      { label: t('trace.startedAt'), value: `+${formatDuration(span.start)}` },
      { label: t('trace.duration'), value: formatDuration(span.duration) },
      {
        label: t('trace.share'),
        value: t('trace.percent', { value: Math.round((span.duration / total.value) * 100) })
      }
    ]
    if (span.service) facts.unshift({ label: t('trace.service'), value: span.service })
    return facts
  })

  const detailEvents = computed(() =>
    [...(detail.value?.events ?? [])]
      .sort((a, b) => a.at - b.at)
      .map((event, order) => ({
        key: `${order}`,
        time: `+${formatDuration(event.at)}`,
        name: event.name
      }))
  )

  const minimapLines = computed(() => {
    const ordered = [...props.spans].sort((a, b) => a.start - b.start)
    const count = Math.max(1, ordered.length)
    return ordered.map((span, index) => {
      const status: TraceSpanStatus = span.status ?? 'success'
      const root = !(span.parentId && known.value.has(span.parentId)) && status === 'success'
      return {
        id: span.id,
        status,
        root,
        style: {
          '--line-offset': String(span.start / total.value),
          '--line-width': String(span.duration / total.value),
          '--line-top': String((index + 0.2) / count),
          '--line-height': String(0.6 / count)
        }
      }
    })
  })

  const windowStyle = computed(() => ({
    '--window-start': String(view.value[0] / total.value),
    '--window-size': String((view.value[1] - view.value[0]) / total.value)
  }))

  const setWindow = (a: number, b: number): void => {
    let low = clamp(Math.min(a, b), 0, total.value)
    let high = clamp(Math.max(a, b), 0, total.value)
    if (high - low < minSpan.value) {
      high = Math.min(total.value, low + minSpan.value)
      low = Math.max(0, high - minSpan.value)
    }
    range.value = low <= 0 && high >= total.value ? null : [low, high]
  }

  const resetZoom = (): void => {
    range.value = null
  }

  const msAt = (event: PointerEvent): number => {
    const track = trackRef.value
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    const share = rect.width ? (event.clientX - rect.left) / rect.width : 0
    return clamp(dir.value === 'rtl' ? 1 - share : share, 0, 1) * total.value
  }

  const capture = (event: PointerEvent): void => {
    try {
      trackRef.value?.setPointerCapture?.(event.pointerId)
    } catch {
      return
    }
  }

  const onTrackDown = (event: PointerEvent): void => {
    if (event.button !== 0) return
    const at = msAt(event)
    const [low, high] = view.value
    drag = {
      mode: zoomed.value && at >= low && at <= high ? 'pan' : 'draw',
      anchor: at,
      origin: [low, high]
    }
    capture(event)
  }

  const onThumbDown = (event: PointerEvent, edge: Edge): void => {
    if (event.button !== 0) return
    drag = { mode: edge, anchor: msAt(event), origin: [view.value[0], view.value[1]] }
    capture(event)
  }

  const onTrackMove = (event: PointerEvent): void => {
    if (!drag) return
    const at = msAt(event)
    const [low, high] = drag.origin
    if (drag.mode === 'draw') {
      if (Math.abs(at - drag.anchor) >= minSpan.value / 2) setWindow(drag.anchor, at)
    } else if (drag.mode === 'start') setWindow(Math.min(at, high - minSpan.value), high)
    else if (drag.mode === 'end') setWindow(low, Math.max(at, low + minSpan.value))
    else {
      const start = clamp(low + at - drag.anchor, 0, total.value - (high - low))
      setWindow(start, start + high - low)
    }
  }

  const onTrackUp = (): void => {
    drag = null
  }

  const thumbLimits = (edge: Edge): [number, number] =>
    edge === 'start'
      ? [0, view.value[1] - minSpan.value]
      : [view.value[0] + minSpan.value, total.value]

  const onThumbKey = (event: KeyboardEvent, edge: Edge): void => {
    const key = logicalArrowKey(event.key, dir.value)
    const [low, high] = view.value
    const [min, max] = thumbLimits(edge)
    const current = edge === 'start' ? low : high
    let next: number | null = null
    if (key === 'ArrowRight' || key === 'ArrowUp') next = current + total.value * STEP_SHARE
    else if (key === 'ArrowLeft' || key === 'ArrowDown') next = current - total.value * STEP_SHARE
    else if (key === 'PageUp') next = current + total.value * PAGE_SHARE
    else if (key === 'PageDown') next = current - total.value * PAGE_SHARE
    else if (key === 'Home') next = min
    else if (key === 'End') next = max
    else if (key === 'Escape') {
      event.preventDefault()
      resetZoom()
      return
    } else return
    event.preventDefault()
    const value = clamp(next, min, max)
    if (edge === 'start') setWindow(value, high)
    else setWindow(low, value)
  }

  const thumbs = computed(() =>
    (['start', 'end'] as const).map((edge) => {
      const [min, max] = thumbLimits(edge)
      const value = edge === 'start' ? view.value[0] : view.value[1]
      return {
        edge,
        label: edge === 'start' ? t('trace.zoomStart') : t('trace.zoomEnd'),
        min: Math.round(min),
        max: Math.round(max),
        now: Math.round(value),
        text: formatDuration(value)
      }
    })
  )

  const detailAttributes = computed(() =>
    Object.entries(detail.value?.attributes ?? {}).map(([key, value]) => ({
      key,
      value: String(value)
    }))
  )

  const setSelected = (id: string): void => {
    current.value = id
  }

  const rowElement = (id: string): HTMLElement | null =>
    gridRef.value?.querySelector<HTMLElement>(`[data-span-id="${CSS.escape(id)}"]`) ?? null

  const focusRow = async (id: string): Promise<void> => {
    focusedId.value = id
    await nextTick()
    rowElement(id)?.focus()
  }

  const toggle = (row: Row): void => {
    if (!row.hasChildren || shown.value) return
    const next = new Set(collapsed.value)
    if (next.has(row.span.id)) next.delete(row.span.id)
    else next.add(row.span.id)
    collapsed.value = next
  }

  const select = (row: Row): void => {
    focusedId.value = row.span.id
    setSelected(current.value === row.span.id ? '' : row.span.id)
  }

  const close = (): void => {
    const id = current.value
    setSelected('')
    if (id && rows.value.some((row) => row.span.id === id)) void focusRow(id)
  }

  const onKeydown = (event: KeyboardEvent, index: number): void => {
    const row = rows.value[index]
    if (!row) return
    const key = logicalArrowKey(event.key, dir.value)
    const go = (target: Row | undefined): void => {
      event.preventDefault()
      if (target) void focusRow(target.span.id)
    }
    switch (key) {
      case 'ArrowDown':
        return go(rows.value[index + 1])
      case 'ArrowUp':
        return go(rows.value[index - 1])
      case 'Home':
        return go(rows.value[0])
      case 'End':
        return go(rows.value[rows.value.length - 1])
      case 'ArrowRight':
        event.preventDefault()
        if (row.hasChildren && !row.expanded) toggle(row)
        else if (row.expanded) void focusRow(rows.value[index + 1]?.span.id ?? row.span.id)
        return
      case 'ArrowLeft':
        event.preventDefault()
        if (row.expanded && !shown.value) toggle(row)
        else if (row.parentId) void focusRow(row.parentId)
        return
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(row)
        return
      default:
    }
  }

  const statusLabel = (status?: TraceSpanStatus): string => {
    if (status === 'error') return t('trace.failed')
    if (status === 'running') return t('trace.running')
    return ''
  }

  const rowLabel = (row: Row): string =>
    [
      row.span.name,
      row.span.service ?? '',
      `+${formatDuration(row.span.start)}`,
      formatDuration(row.span.duration),
      statusLabel(row.span.status),
      row.span.id === slowestId.value ? t('trace.slowest') : '',
      row.span.events?.length ? t('trace.eventCount', { count: row.span.events.length }) : ''
    ]
      .filter(Boolean)
      .join(', ')

  const detailId = `${uid}-detail`

  const LOADING_ROWS = 5
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-bordered="bordered || null"
    :data-loading="loading || null"
    :aria-busy="loading || undefined"
    class="@container/trace flex w-full min-w-0 flex-col overflow-hidden bg-(--bg-surface) data-bordered:rounded-(--shape-card) data-bordered:border data-bordered:border-(--border-default)"
  >
    <div
      class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted)"
    >
      <div class="border-e border-(--border-muted) p-(--spacing-xs)">
        <Input
          v-model="search"
          size="medium"
          :disabled="loading"
          :placeholder="t('trace.search')"
          :aria-label="t('trace.search')"
          :data-testid="`${testId}__search`"
          class="w-full"
        >
          <template #prefix>
            <i
              class="ai ai-search text-(--text-muted)"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <div
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
            :style="{ '--tick-at': `${tick.at * 100}%` }"
            class="absolute inset-y-0 start-(--tick-at) flex w-0 items-center justify-center data-[edge=end]:justify-end data-[edge=start]:justify-start"
          >
            <span class="text-label-sm whitespace-nowrap text-(--text-muted) tabular-nums">{{
              tick.label
            }}</span>
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="zoomable && spans.length"
      :data-zoomed="zoomed || null"
      :data-testid="`${testId}__minimap`"
      class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted)"
    >
      <div
        class="flex min-w-0 items-center gap-(--spacing-xs) border-e border-(--border-muted) px-(--spacing-sm) py-(--spacing-2xs)"
      >
        <span class="truncate text-label-sm text-(--text-muted)">{{ t('trace.zoom') }}</span>
        <Button
          v-if="zoomed"
          :label="t('trace.resetZoom')"
          :data-testid="`${testId}__reset-zoom`"
          kind="transparent"
          size="small"
          class="ms-auto shrink-0"
          @click="resetZoom"
        />
      </div>
      <div class="px-(--spacing-md) py-(--spacing-xs)">
        <div
          ref="trackRef"
          :data-testid="`${testId}__track`"
          class="relative h-8 cursor-crosshair touch-none rounded-(--shape-button) bg-(--bg-canvas) select-none"
          @pointerdown="onTrackDown"
          @pointermove="onTrackMove"
          @pointerup="onTrackUp"
          @pointercancel="onTrackUp"
        >
          <span
            v-for="line in minimapLines"
            :key="line.id"
            :data-status="line.status"
            :data-root="line.root || null"
            :style="line.style"
            aria-hidden="true"
            class="pointer-events-none absolute start-[calc(var(--line-offset)*100%)] top-[calc(var(--line-top)*100%)] h-[max(1px,calc(var(--line-height)*100%))] w-[max(1px,calc(var(--line-width)*100%))] rounded-full data-[status=error]:bg-(--danger-border) data-[status=success]:bg-(--success-border) data-root:data-[status=success]:bg-(--info-border) data-[status=running]:bg-(--warning-border)"
          />
          <span
            :style="windowStyle"
            :data-testid="`${testId}__window`"
            class="pointer-events-none absolute inset-y-0 start-[calc(var(--window-start)*100%)] w-[calc(var(--window-size)*100%)] rounded-(--shape-button) border border-(--border-selected) bg-(--bg-selected)/40"
          >
            <span
              v-for="thumb in thumbs"
              :key="thumb.edge"
              role="slider"
              tabindex="0"
              aria-orientation="horizontal"
              :aria-label="thumb.label"
              :aria-valuemin="thumb.min"
              :aria-valuemax="thumb.max"
              :aria-valuenow="thumb.now"
              :aria-valuetext="thumb.text"
              :data-edge="thumb.edge"
              :data-testid="`${testId}__thumb`"
              class="pointer-events-auto absolute inset-y-0 w-3 cursor-ew-resize rounded-(--shape-button) after:absolute after:inset-y-(--spacing-2xs) after:start-1/2 after:w-0.5 after:-ms-px after:rounded-full after:bg-(--border-selected) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none data-[edge=end]:-end-1.5 data-[edge=start]:-start-1.5 pointer-coarse:w-6 pointer-coarse:data-[edge=end]:-end-3 pointer-coarse:data-[edge=start]:-start-3"
              @pointerdown.stop="onThumbDown($event, thumb.edge)"
              @keydown="onThumbKey($event, thumb.edge)"
            />
          </span>
        </div>
      </div>
    </div>

    <div class="relative">
      <div
        aria-hidden="true"
        class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] pointer-events-none absolute inset-y-0 start-[calc(var(--trace-name)+var(--spacing-md))] end-(--spacing-md) hidden @xl/trace:block"
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
          class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] grid min-h-9 grid-cols-[var(--trace-name)_minmax(0,1fr)] items-center border-b border-(--border-muted) last:border-b-0"
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

      <div
        v-else-if="rows.length"
        ref="gridRef"
        role="treegrid"
        :aria-label="ariaLabel || t('trace.label')"
        :aria-describedby="detail ? detailId : undefined"
        :data-testid="`${testId}__grid`"
        class="relative flex flex-col"
      >
        <div
          v-for="(row, index) in rows"
          :key="row.span.id"
          role="row"
          :tabindex="row.span.id === tabStop ? 0 : -1"
          :aria-level="row.depth + 1"
          :aria-posinset="row.posinset"
          :aria-setsize="row.setsize"
          :aria-expanded="row.hasChildren ? row.expanded : undefined"
          :aria-selected="row.span.id === current"
          :aria-label="rowLabel(row)"
          :data-span-id="row.span.id"
          :data-selected="row.span.id === current || null"
          :data-slowest="row.span.id === slowestId || null"
          :data-testid="`${testId}__row`"
          :style="{
            '--span-offset': String(row.offset),
            '--span-width': String(row.width),
            '--span-depth': String(row.depth)
          }"
          class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] grid min-h-9 w-full cursor-pointer grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted) text-start transition-colors duration-150 ease-out last:border-b-0 hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none focus-visible:ring-inset data-selected:bg-(--bg-selected) motion-reduce:transition-none pointer-coarse:min-h-11"
          @click="select(row)"
          @focus="focusedId = row.span.id"
          @keydown="onKeydown($event, index)"
        >
          <span
            role="gridcell"
            class="flex min-w-0 items-center gap-(--spacing-2xs) border-e border-(--border-muted) py-(--spacing-xs) ps-[calc(var(--spacing-xs)+var(--span-depth)*var(--spacing-md))] pe-(--spacing-sm)"
          >
            <span
              v-if="row.hasChildren"
              :data-testid="`${testId}__toggle`"
              class="flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) hover:bg-(--bg-active) hover:text-(--text-default)"
              aria-hidden="true"
              @click.stop="toggle(row)"
            >
              <i
                :class="
                  row.expanded ? 'ai ai-chevron-down' : 'ai ai-chevron-right rtl:-scale-x-100'
                "
                class="text-[0.7em]"
              />
            </span>
            <span
              v-else
              class="size-5 shrink-0"
              aria-hidden="true"
            />
            <i
              v-if="row.span.icon"
              :class="row.span.icon"
              class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="truncate text-body-code-sm text-(--text-default)"
              ><bdi>{{ row.span.name }}</bdi></span
            >
            <span
              v-if="row.span.service"
              class="hidden shrink-0 truncate text-label-sm text-(--text-muted) @3xl/trace:block"
              ><bdi>{{ row.span.service }}</bdi></span
            >
            <span
              v-if="row.span.status === 'error' || row.span.id === slowestId"
              class="ms-auto flex shrink-0 items-center gap-(--spacing-2xs)"
              aria-hidden="true"
            >
              <i
                v-if="row.span.id === slowestId"
                class="ai ai-clock text-(--text-default)"
                :data-testid="`${testId}__slowest`"
              />
              <i
                v-if="row.span.status === 'error'"
                class="ai ai-circle-alert text-(--danger-foreground)"
              />
            </span>
          </span>
          <span
            role="gridcell"
            class="flex items-center px-(--spacing-md) py-(--spacing-xs)"
          >
            <span class="relative h-(--size-6) w-full">
              <span
                :data-status="row.status"
                :data-root="row.root || null"
                :data-outside="row.outside || null"
                :data-testid="`${testId}__bar`"
                class="absolute inset-y-0 start-[calc(var(--span-offset)*100%)] w-[calc(var(--span-width)*100%)] rounded-(--shape-button) border data-outside:hidden data-[status=error]:border-(--danger-border) data-[status=error]:bg-(--danger) data-[status=success]:border-(--success-border) data-[status=success]:bg-(--success) data-root:data-[status=success]:border-(--info-border) data-root:data-[status=success]:bg-(--info) data-[status=running]:border-(--warning-border) data-[status=running]:bg-(--warning)"
              >
                <span
                  :data-status="row.status"
                  :data-root="row.root || null"
                  :data-wide="row.wide || null"
                  :data-flip="row.flip || null"
                  class="pointer-events-none absolute start-full top-1/2 ms-(--spacing-2xs) -translate-y-1/2 text-label-sm whitespace-nowrap tabular-nums data-flip:start-auto data-flip:end-full data-flip:ms-0 data-flip:me-(--spacing-2xs) data-wide:start-(--spacing-xs) data-wide:ms-0 data-[status=error]:text-(--danger-foreground) data-[status=success]:text-(--success-foreground) data-root:data-[status=success]:text-(--info-foreground) data-[status=running]:text-(--warning-foreground)"
                  aria-hidden="true"
                  >{{ formatDuration(row.span.duration) }}</span
                >
              </span>
              <span
                v-for="mark in row.marks"
                :key="mark.key"
                :style="{ '--event-at': String(mark.at) }"
                :data-testid="`${testId}__event`"
                aria-hidden="true"
                class="pointer-events-none absolute -inset-y-0.5 start-[calc(var(--event-at)*100%)] -ms-px w-0.5 rounded-full bg-(--text-default) ring-1 ring-(--bg-surface)"
              />
            </span>
          </span>
        </div>
      </div>

      <div
        v-else
        class="p-(--spacing-md)"
        :data-testid="`${testId}__empty`"
      >
        <EmptyState
          size="small"
          :icon="term ? 'ai ai-search' : 'ai ai-sitemap'"
          :title="term ? t('trace.noMatch', { query: search.trim() }) : t('trace.empty')"
        >
          <template
            v-if="term"
            #actions
          >
            <Button
              :label="t('trace.clearSearch')"
              kind="transparent"
              size="medium"
              @click="search = ''"
            />
          </template>
        </EmptyState>
      </div>
    </div>

    <section
      v-if="detail"
      :id="detailId"
      :aria-label="t('trace.details', { name: detail.name })"
      :data-testid="`${testId}__detail`"
      class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <i
          v-if="detail.icon"
          :class="detail.icon"
          class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate text-body-code-sm text-(--text-default)"
          ><bdi>{{ detail.name }}</bdi></span
        >
        <Tag
          v-if="detail.status === 'error'"
          key="failed"
          severity="danger"
          :label="t('trace.failed')"
          size="small"
        />
        <Tag
          v-else-if="detail.status === 'running'"
          key="running"
          severity="warning"
          :label="t('trace.running')"
          size="small"
        />
        <Tag
          v-if="detail.id === slowestId"
          key="slowest"
          severity="info"
          :label="t('trace.slowest')"
          size="small"
          :data-testid="`${testId}__slowest-tag`"
        />
        <CopyButton
          :value="detail.name"
          :aria-label="t('trace.copyName')"
          kind="outlined"
          class="shrink-0"
          size="small"
        />
        <span class="ms-auto flex">
          <Button
            :label="t('trace.close')"
            :data-testid="`${testId}__close`"
            kind="transparent"
            size="medium"
            @click="close"
          />
        </span>
      </div>

      <dl class="m-0 grid grid-cols-2 gap-(--spacing-sm) @xl/trace:grid-cols-4">
        <div
          v-for="fact in detailFacts"
          :key="fact.label"
          class="flex min-w-0 flex-col gap-(--spacing-2xs)"
        >
          <dt class="text-label-sm text-(--text-muted)">{{ fact.label }}</dt>
          <dd class="m-0 truncate text-body-sm text-(--text-default) tabular-nums">
            {{ fact.value }}
          </dd>
        </div>
      </dl>

      <p
        v-if="detail.message"
        class="text-body-sm text-(--danger-foreground)"
      >
        {{ detail.message }}
      </p>

      <div
        v-if="detailEvents.length"
        :data-testid="`${testId}__events`"
        class="flex flex-col gap-(--spacing-xs) border-t border-(--border-muted) pt-(--spacing-sm)"
      >
        <p class="text-label-sm text-(--text-default)">{{ t('trace.events') }}</p>
        <dl
          class="m-0 grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-x-(--spacing-md) gap-y-(--spacing-2xs)"
        >
          <template
            v-for="item in detailEvents"
            :key="item.key"
          >
            <dt class="truncate text-label-sm text-(--text-muted) tabular-nums">
              {{ item.time }}
            </dt>
            <dd class="m-0 min-w-0 text-label-code-sm break-words text-(--text-default)">
              <bdi>{{ item.name }}</bdi>
            </dd>
          </template>
        </dl>
      </div>

      <div
        v-if="detailAttributes.length"
        class="flex flex-col gap-(--spacing-xs) border-t border-(--border-muted) pt-(--spacing-sm)"
      >
        <p class="text-label-sm text-(--text-default)">{{ t('trace.attributes') }}</p>
        <dl
          class="m-0 grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-x-(--spacing-md) gap-y-(--spacing-2xs)"
        >
          <template
            v-for="item in detailAttributes"
            :key="item.key"
          >
            <dt class="truncate text-label-sm text-(--text-muted)">
              <bdi>{{ item.key }}</bdi>
            </dt>
            <dd class="m-0 min-w-0 text-label-code-sm break-words text-(--text-default)">
              <bdi>{{ item.value }}</bdi>
            </dd>
          </template>
        </dl>
      </div>
    </section>
  </div>
</template>
