<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import CopyButton from '../../action/copy-button/copy-button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import Tag from '../../content/tag/tag.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Input from '../../input/input/input.vue'

  export type TraceSpanStatus = 'success' | 'error' | 'running'

  export interface TraceSpanEvent {
    /** Milliseconds from the start of the trace. */
    at: number
    /** What happened at that moment. */
    name: string
  }

  /** Visible window of the run clock: start and end in milliseconds. */
  export type TraceRange = [number, number]

  /** How the spans are drawn: tree and bars, bars in lanes, or the tree with times as text. */
  export type TraceView = 'waterfall' | 'timeline' | 'tree'

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

  type Placed = {
    span: TraceSpan
    status: TraceSpanStatus
    root: boolean
    offset: number
    width: number
    wide: boolean
    flip: boolean
    outside: boolean
    marks: { key: string; at: number }[]
    critical: boolean
    path: { key: string; offset: number; width: number }[]
  }

  type Lane = { key: string; depth: number; items: Placed[] }

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
    critical: boolean
    path: { key: string; offset: number; width: number }[]
  }

  type Edge = 'start' | 'end'

  type Drag = { mode: 'draw' | 'pan' | Edge; anchor: number; origin: TraceRange }

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

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'trace')
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const MIN_SHARE = 0.01
  const STEP_SHARE = 0.01
  const PAGE_SHARE = 0.1

  const gridEl = ref<HTMLElement | null>(null)
  const trackEl = ref<HTMLElement | null>(null)
  let drag: Drag | null = null
  const dir = useDirection(gridEl)

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

  const win = computed<TraceRange>(() => {
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

  const zoomed = computed<boolean>(() => win.value[0] > 0 || win.value[1] < total.value)

  const slowestId = computed<string>(() => {
    if (!props.highlightSlowest || props.spans.length < 2) return ''
    const nested = props.spans.filter((span) => span.parentId && known.value.has(span.parentId))
    const pool = nested.length ? nested : props.spans
    return pool.reduce((best, span) => (span.duration > best.duration ? span : best)).id
  })

  const endOf = (span: TraceSpan): number => span.start + span.duration

  const criticalPath = computed<Map<string, TraceRange[]>>(() => {
    const path = new Map<string, TraceRange[]>()
    if (!props.highlightCriticalPath) return path
    const latestFirst = (list: TraceSpan[]): TraceSpan[] =>
      [...list].sort((a, b) => endOf(b) - endOf(a))
    const follow = (span: TraceSpan, end: number): void => {
      const own: TraceRange[] = []
      let cursor = Math.min(end, endOf(span))
      latestFirst(childrenOf.value.get(span.id) ?? []).forEach((child) => {
        const reach = Math.min(endOf(child), endOf(span))
        if (reach > cursor || reach <= span.start || child.start >= cursor) return
        if (reach < cursor) own.push([reach, cursor])
        follow(child, reach)
        cursor = Math.max(child.start, span.start)
      })
      if (cursor > span.start) own.push([span.start, cursor])
      path.set(span.id, own.reverse())
    }
    const roots = latestFirst(childrenOf.value.get(null) ?? [])
    if (roots[0]) follow(roots[0], endOf(roots[0]))
    return path
  })

  const selfTimeOf = (span: TraceSpan): number | null => {
    const kids = childrenOf.value.get(span.id) ?? []
    if (!kids.length) return null
    let reach = span.start
    let covered = 0
    kids.forEach((child) => {
      const from = Math.max(child.start, reach)
      const to = Math.min(endOf(child), endOf(span))
      if (to > from) {
        covered += to - from
        reach = to
      }
    })
    return Math.max(0, span.duration - covered)
  }

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

  const placeSpan = (span: TraceSpan, depth: number): Placed => {
    const [low, high] = win.value
    const length = high - low
    const from = Math.max(span.start, low)
    const to = Math.min(endOf(span), high)
    const outside = to < from || span.start > high || endOf(span) < low
    const offset = outside ? 0 : clamp((from - low) / length, 0, 1)
    const width = outside ? 0 : Math.max((to - from) / length, 0.006)
    const marks = (span.events ?? [])
      .map((event, order) => ({ key: `${order}`, at: (event.at - low) / length }))
      .filter((mark) => mark.at >= 0 && mark.at <= 1)
    const status: TraceSpanStatus = span.status ?? 'success'
    const stretches = criticalPath.value.get(span.id)
    const path = (stretches ?? [])
      .map(([a, b], order) => {
        const lead = Math.max(a, low)
        const tail = Math.min(b, high)
        return {
          key: `${order}`,
          offset: clamp((lead - low) / length, 0, 1),
          width: tail > lead ? Math.max((tail - lead) / length, 0.004) : 0
        }
      })
      .filter((stretch) => stretch.width > 0)
    return {
      span,
      status,
      root: depth === 0 && status === 'success',
      offset,
      width,
      wide: width >= 0.14,
      flip: width < 0.14 && offset + width > 0.8,
      outside,
      marks,
      critical: Boolean(stretches),
      path
    }
  }

  const rows = computed<Row[]>(() => {
    const out: Row[] = []
    const walk = (parentId: string | null, depth: number): void => {
      const siblings = (childrenOf.value.get(parentId) ?? []).filter(
        (span) => !shown.value || shown.value.has(span.id)
      )
      siblings.forEach((span, index) => {
        const hasChildren = (childrenOf.value.get(span.id) ?? []).length > 0
        const expanded = hasChildren && (Boolean(shown.value) || !collapsed.value.has(span.id))
        out.push({
          ...placeSpan(span, depth),
          depth,
          parentId,
          hasChildren,
          expanded,
          posinset: index + 1,
          setsize: siblings.length
        })
        if (expanded) walk(span.id, depth + 1)
      })
    }
    walk(null, 0)
    return out
  })

  const lanes = computed<Lane[]>(() => {
    if (layout.value !== 'timeline') return []
    const levels: TraceSpan[][] = []
    const visit = (parentId: string | null, depth: number): void => {
      ;(childrenOf.value.get(parentId) ?? []).forEach((span) => {
        ;(levels[depth] ??= []).push(span)
        visit(span.id, depth + 1)
      })
    }
    visit(null, 0)
    const out: Lane[] = []
    levels.forEach((level, depth) => {
      const ends: number[] = []
      const packed: TraceSpan[][] = []
      ;[...level]
        .sort((a, b) => a.start - b.start)
        .forEach((span) => {
          let lane = ends.findIndex((end) => end <= span.start)
          if (lane < 0) {
            lane = ends.length
            packed.push([])
          }
          ends[lane] = endOf(span)
          packed[lane]?.push(span)
        })
      packed.forEach((spans, lane) =>
        out.push({
          key: `${depth}-${lane}`,
          depth,
          items: spans.map((span) => placeSpan(span, depth))
        })
      )
    })
    return out
  })

  const timelineOrder = computed<string[]>(() =>
    lanes.value
      .flatMap((lane, index) =>
        lane.items.filter((item) => !item.outside).map((item) => ({ item, index }))
      )
      .sort((a, b) => a.item.span.start - b.item.span.start || a.index - b.index)
      .map(({ item }) => item.span.id)
  )

  const anyMatch = computed<boolean>(() => !shown.value || shown.value.size > 0)

  const hasContent = computed<boolean>(() =>
    layout.value === 'timeline' ? props.spans.length > 0 && anyMatch.value : rows.value.length > 0
  )

  const dimmed = (span: TraceSpan): boolean => Boolean(term.value) && !matches(span)

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

  const ticks = computed(() =>
    [0, 0.25, 0.5, 0.75, 1].map((at) => ({
      at,
      edge: at === 0 ? 'start' : at === 1 ? 'end' : null,
      density: at === 0.5 ? 'mid' : at === 0.25 || at === 0.75 ? 'quarter' : null,
      label: formatDuration(win.value[0] + (win.value[1] - win.value[0]) * at)
    }))
  )

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
    const self = selfTimeOf(span)
    if (self !== null)
      facts.splice(2, 0, { label: t('trace.selfTime'), value: formatDuration(self) })
    const stretches = criticalPath.value.get(span.id)
    if (stretches) {
      const onPath = stretches.reduce((sum, [a, b]) => sum + b - a, 0)
      facts.push({ label: t('trace.onCriticalPath'), value: formatDuration(onPath) })
    }
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
          '--trace-line-offset': String(span.start / total.value),
          '--trace-line-width': String(span.duration / total.value),
          '--trace-line-top': String((index + 0.2) / count),
          '--trace-line-height': String(0.6 / count)
        }
      }
    })
  })

  const windowStyle = computed(() => ({
    '--trace-window-start': String(win.value[0] / total.value),
    '--trace-window-size': String((win.value[1] - win.value[0]) / total.value)
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
    const track = trackEl.value
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    const share = rect.width ? (event.clientX - rect.left) / rect.width : 0
    return clamp(dir.value === 'rtl' ? 1 - share : share, 0, 1) * total.value
  }

  const capture = (event: PointerEvent): void => {
    try {
      trackEl.value?.setPointerCapture?.(event.pointerId)
    } catch {
      return
    }
  }

  const onTrackDown = (event: PointerEvent): void => {
    if (event.button !== 0) return
    const at = msAt(event)
    const [low, high] = win.value
    drag = {
      mode: zoomed.value && at >= low && at <= high ? 'pan' : 'draw',
      anchor: at,
      origin: [low, high]
    }
    capture(event)
  }

  const onThumbDown = (event: PointerEvent, edge: Edge): void => {
    if (event.button !== 0) return
    drag = { mode: edge, anchor: msAt(event), origin: [win.value[0], win.value[1]] }
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
      ? [0, win.value[1] - minSpan.value]
      : [win.value[0] + minSpan.value, total.value]

  const onThumbKey = (event: KeyboardEvent, edge: Edge): void => {
    const key = logicalArrowKey(event.key, dir.value)
    const [low, high] = win.value
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
      const value = edge === 'start' ? win.value[0] : win.value[1]
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
    gridEl.value?.querySelector<HTMLElement>(`[data-span-id="${CSS.escape(id)}"]`) ?? null

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

  const select = (row: Row): void => pick(row.span.id)

  const close = (): void => {
    const id = current.value
    setSelected('')
    const reachable =
      layout.value === 'timeline'
        ? timelineOrder.value.includes(id)
        : rows.value.some((row) => row.span.id === id)
    if (id && reachable) void focusRow(id)
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

  const rowLabel = (row: Placed): string =>
    [
      row.span.name,
      row.span.service ?? '',
      `+${formatDuration(row.span.start)}`,
      formatDuration(row.span.duration),
      statusLabel(row.span.status),
      row.span.id === slowestId.value ? t('trace.slowest') : '',
      row.critical ? t('trace.criticalPath') : '',
      row.span.events?.length ? t('trace.eventCount', { count: row.span.events.length }) : ''
    ]
      .filter(Boolean)
      .join(', ')

  const pick = (id: string): void => {
    focusedId.value = id
    setSelected(current.value === id ? '' : id)
  }

  const onBarKeydown = (event: KeyboardEvent, id: string): void => {
    const order = timelineOrder.value
    const index = order.indexOf(id)
    const key = logicalArrowKey(event.key, dir.value)
    let target: string | undefined
    if (key === 'ArrowRight' || key === 'ArrowDown') target = order[index + 1]
    else if (key === 'ArrowLeft' || key === 'ArrowUp') target = order[index - 1]
    else if (key === 'Home') target = order[0]
    else if (key === 'End') target = order[order.length - 1]
    else if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      pick(id)
      return
    } else return
    event.preventDefault()
    if (target) void focusRow(target)
  }

  const detailId = `${uid}-detail`

  const LOADING_ROWS = 5

  const ROOT_CLASS =
    'group/trace @container/trace flex w-full min-w-0 flex-col overflow-hidden bg-(--bg-surface) ' +
    'data-bordered:rounded-(--shape-card) data-bordered:border data-bordered:border-(--border-default)'

  const AXIS_CLASS =
    '[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted) ' +
    'data-[view=timeline]:grid-cols-1 data-[view=tree]:grid-cols-[minmax(0,1fr)_auto]'

  const TICK_CLASS =
    'absolute inset-y-0 start-(--trace-tick-at) flex w-0 items-center justify-center ' +
    'data-[edge=end]:justify-end data-[edge=start]:justify-start ' +
    '@max-xs/trace:data-[density=mid]:hidden @max-xl/trace:data-[density=quarter]:hidden'

  const MINIMAP_CLASS =
    '[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted) ' +
    'group-data-[view=timeline]/trace:grid-cols-1'

  const MINIMAP_LABEL_CLASS =
    'flex min-w-0 items-center gap-(--spacing-xs) border-e border-(--border-muted) px-(--spacing-sm) py-(--spacing-2xs) ' +
    'group-data-[view=timeline]/trace:border-e-0 group-data-[view=timeline]/trace:border-b'

  const MINIMAP_LINE_CLASS =
    'pointer-events-none absolute start-[calc(var(--trace-line-offset)*100%)] top-[calc(var(--trace-line-top)*100%)] h-[max(1px,calc(var(--trace-line-height)*100%))] ' +
    'w-[max(1px,calc(var(--trace-line-width)*100%))] rounded-full ' +
    'data-[status=error]:bg-(--danger-border) data-[status=success]:bg-(--success-border) ' +
    'data-root:data-[status=success]:bg-(--info-border) ' +
    'data-[status=running]:bg-(--warning-border)'

  const WINDOW_CLASS =
    'pointer-events-none absolute inset-y-0 start-[calc(var(--trace-window-start)*100%)] w-[calc(var(--trace-window-size)*100%)] rounded-(--shape-button) border ' +
    'border-(--border-selected) bg-(--bg-selected)/40'

  const THUMB_CLASS =
    'pointer-events-auto absolute inset-y-0 w-3 cursor-ew-resize rounded-(--shape-button) ' +
    'after:absolute after:inset-y-(--spacing-2xs) after:start-1/2 after:w-0.5 after:-ms-px after:rounded-full after:bg-(--border-selected) focus-visible:ring-2 ' +
    'focus-visible:ring-(--ring-color) focus-visible:outline-none ' +
    'data-[edge=end]:-end-1.5 data-[edge=start]:-start-1.5 ' +
    'pointer-coarse:w-6 pointer-coarse:data-[edge=end]:-end-3 pointer-coarse:data-[edge=start]:-start-3'

  const GRID_LINES_CLASS =
    '[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'pointer-events-none absolute inset-y-0 start-[calc(var(--trace-name)+var(--spacing-md))] end-(--spacing-md) hidden ' +
    '@xl/trace:block ' +
    'data-[view=timeline]:start-(--spacing-md)'

  const SKELETON_CLASS =
    '[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid min-h-9 grid-cols-[var(--trace-name)_minmax(0,1fr)] items-center border-b border-(--border-muted) ' +
    'last:border-b-0'

  const FLAME_BAR_CLASS =
    'absolute inset-y-0 start-[calc(var(--trace-span-offset)*100%)] flex w-[calc(var(--trace-span-width)*100%)] min-w-1 cursor-pointer items-center overflow-hidden ' +
    'rounded-(--shape-button) border transition-opacity duration-150 ease-out outline-offset-1 ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none motion-reduce:transition-none ' +
    'data-dimmed:opacity-40 ' +
    'data-outside:hidden ' +
    'data-selected:outline-2 data-selected:outline-(--border-selected) ' +
    'data-[status=error]:border-(--danger-border) data-[status=error]:bg-(--danger) data-[status=success]:border-(--success-border) data-[status=success]:bg-(--success) ' +
    'data-root:data-[status=success]:border-(--info-border) data-root:data-[status=success]:bg-(--info) ' +
    'data-[status=running]:border-(--warning-border) data-[status=running]:bg-(--warning)'

  const FLAME_BAR_LABEL_CLASS =
    'truncate px-(--spacing-xs) text-label-sm whitespace-nowrap tabular-nums ' +
    'data-[status=error]:text-(--danger-foreground) data-[status=success]:text-(--success-foreground) ' +
    'data-root:data-[status=success]:text-(--info-foreground) ' +
    'data-[status=running]:text-(--warning-foreground)'

  const ROW_CLASS =
    '[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid min-h-9 w-full cursor-pointer grid-cols-[var(--trace-name)_minmax(0,1fr)] ' +
    'data-[view=tree]:grid-cols-[minmax(0,1fr)_auto] ' +
    'items-stretch border-b border-(--border-muted) text-start transition-colors duration-150 ease-out ' +
    'last:border-b-0 hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none focus-visible:ring-inset ' +
    'data-selected:bg-(--bg-selected) ' +
    'motion-reduce:transition-none pointer-coarse:min-h-11'

  const NAME_CELL_CLASS =
    'flex min-w-0 items-center gap-(--spacing-2xs) border-e border-(--border-muted) py-(--spacing-xs) ps-[calc(var(--spacing-xs)+var(--trace-span-depth)*var(--spacing-md))] ' +
    'pe-(--spacing-sm)'

  const BAR_CLASS =
    'absolute inset-y-0 start-[calc(var(--trace-span-offset)*100%)] w-[calc(var(--trace-span-width)*100%)] rounded-(--shape-button) border ' +
    'data-outside:hidden ' +
    'data-[status=error]:border-(--danger-border) data-[status=error]:bg-(--danger) data-[status=success]:border-(--success-border) data-[status=success]:bg-(--success) ' +
    'data-root:data-[status=success]:border-(--info-border) data-root:data-[status=success]:bg-(--info) ' +
    'data-[status=running]:border-(--warning-border) data-[status=running]:bg-(--warning)'

  const BAR_DURATION_CLASS =
    'pointer-events-none absolute start-full top-1/2 ms-(--spacing-2xs) -translate-y-1/2 text-label-sm whitespace-nowrap tabular-nums ' +
    'data-flip:start-auto data-flip:end-full data-flip:ms-0 data-flip:me-(--spacing-2xs) ' +
    'data-wide:start-(--spacing-xs) data-wide:ms-0 ' +
    'data-[status=error]:text-(--danger-foreground) data-[status=success]:text-(--success-foreground) ' +
    'data-root:data-[status=success]:text-(--info-foreground) ' +
    'data-[status=running]:text-(--warning-foreground)'
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

    <div
      v-if="zoomable && spans.length && layout !== 'tree'"
      :data-zoomed="zoomed || null"
      :data-testid="`${testId}__minimap`"
      :class="MINIMAP_CLASS"
    >
      <div :class="MINIMAP_LABEL_CLASS">
        <span class="truncate text-label-sm text-(--text-muted)">{{ t('trace.zoom') }}</span>
        <Button
          v-if="zoomed"
          :label="t('trace.resetZoom')"
          :data-testid="`${testId}__reset-zoom`"
          variant="ghost"
          size="small"
          class="ms-auto shrink-0"
          @click="resetZoom"
        />
      </div>
      <div class="px-(--spacing-md) py-(--spacing-xs)">
        <div
          ref="trackEl"
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
            :class="MINIMAP_LINE_CLASS"
          />
          <span
            :style="windowStyle"
            :data-testid="`${testId}__window`"
            :class="WINDOW_CLASS"
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
              :class="THUMB_CLASS"
              @pointerdown.stop="onThumbDown($event, thumb.edge)"
              @keydown="onThumbKey($event, thumb.edge)"
            />
          </span>
        </div>
      </div>
    </div>

    <div class="relative">
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

      <div
        v-else-if="layout === 'timeline' && hasContent"
        ref="gridEl"
        role="listbox"
        :aria-label="ariaLabel || t('trace.label')"
        :aria-describedby="detail ? detailId : undefined"
        :data-testid="`${testId}__timeline`"
        class="relative flex flex-col gap-(--spacing-xs) px-(--spacing-md) py-(--spacing-sm)"
      >
        <div
          v-for="(lane, index) in lanes"
          :key="lane.key"
          role="none"
          :data-level-start="(index > 0 && lanes[index - 1]?.depth !== lane.depth) || null"
          :data-testid="`${testId}__lane`"
          class="relative box-content h-(--size-6) pointer-coarse:h-(--size-11) data-level-start:border-t data-level-start:border-(--border-muted) data-level-start:pt-(--spacing-xs)"
        >
          <template
            v-for="item in lane.items"
            :key="item.span.id"
          >
            <span
              role="option"
              :tabindex="item.span.id === tabStop ? 0 : -1"
              :aria-selected="item.span.id === current"
              :aria-label="rowLabel(item)"
              :title="
                item.wide ? undefined : `${item.span.name} · ${formatDuration(item.span.duration)}`
              "
              :data-span-id="item.span.id"
              :data-status="item.status"
              :data-root="item.root || null"
              :data-outside="item.outside || null"
              :data-selected="item.span.id === current || null"
              :data-slowest="item.span.id === slowestId || null"
              :data-critical="item.critical || null"
              :data-dimmed="dimmed(item.span) || null"
              :data-testid="`${testId}__bar`"
              :style="{
                '--trace-span-offset': String(item.offset),
                '--trace-span-width': String(item.width)
              }"
              :class="FLAME_BAR_CLASS"
              @click="pick(item.span.id)"
              @focus="focusedId = item.span.id"
              @keydown="onBarKeydown($event, item.span.id)"
            >
              <span
                v-if="item.wide"
                :data-status="item.status"
                :data-root="item.root || null"
                aria-hidden="true"
                :class="FLAME_BAR_LABEL_CLASS"
                ><bdi>{{ item.span.name }}</bdi> · {{ formatDuration(item.span.duration) }}</span
              >
            </span>
            <span
              v-for="stretch in item.path"
              :key="`path-${item.span.id}-${stretch.key}`"
              :style="{
                '--trace-path-offset': String(stretch.offset),
                '--trace-path-width': String(stretch.width)
              }"
              :data-testid="`${testId}__path`"
              aria-hidden="true"
              class="pointer-events-none absolute -bottom-1 start-[calc(var(--trace-path-offset)*100%)] h-0.5 w-[calc(var(--trace-path-width)*100%)] rounded-full bg-(--text-default)"
            />
            <span
              v-for="mark in item.marks"
              :key="`event-${item.span.id}-${mark.key}`"
              :style="{ '--trace-event-at': String(mark.at) }"
              :data-testid="`${testId}__event`"
              aria-hidden="true"
              class="pointer-events-none absolute -inset-y-0.5 start-[calc(var(--trace-event-at)*100%)] -ms-px w-0.5 rounded-full bg-(--text-default) ring-1 ring-(--bg-surface)"
            />
          </template>
        </div>
      </div>

      <div
        v-else-if="layout !== 'timeline' && rows.length"
        ref="gridEl"
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
          :data-critical="row.critical || null"
          :data-testid="`${testId}__row`"
          :style="{
            '--trace-span-offset': String(row.offset),
            '--trace-span-width': String(row.width),
            '--trace-span-depth': String(row.depth)
          }"
          :data-view="layout"
          :class="ROW_CLASS"
          @click="select(row)"
          @focus="focusedId = row.span.id"
          @keydown="onKeydown($event, index)"
        >
          <span
            role="gridcell"
            :class="NAME_CELL_CLASS"
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
                  row.expanded ? 'az az-chevron-down' : 'az az-chevron-right rtl:-scale-x-100'
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
              v-if="row.span.status === 'error' || row.span.id === slowestId || row.critical"
              class="ms-auto flex shrink-0 items-center gap-(--spacing-2xs)"
              aria-hidden="true"
            >
              <i
                v-if="row.critical"
                class="az az-route text-(--text-default)"
                :data-testid="`${testId}__critical`"
              />
              <i
                v-if="row.span.id === slowestId"
                class="az az-clock text-(--text-default)"
                :data-testid="`${testId}__slowest`"
              />
              <i
                v-if="row.span.status === 'error'"
                class="az az-circle-alert text-(--danger-foreground)"
              />
            </span>
          </span>
          <span
            v-if="layout === 'tree'"
            role="gridcell"
            :data-testid="`${testId}__times`"
            class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-xs) text-label-sm tabular-nums"
          >
            <span class="w-20 text-end text-(--text-muted)"
              >+{{ formatDuration(row.span.start) }}</span
            >
            <span
              :data-status="row.status"
              :data-root="row.root || null"
              class="w-20 text-end data-[status=error]:text-(--text-danger) data-[status=success]:text-(--text-default) data-[status=running]:text-(--warning-foreground)"
              >{{ formatDuration(row.span.duration) }}</span
            >
          </span>
          <span
            v-else
            role="gridcell"
            class="flex items-center px-(--spacing-md) py-(--spacing-xs)"
          >
            <span class="relative h-(--size-6) w-full">
              <span
                :data-status="row.status"
                :data-root="row.root || null"
                :data-outside="row.outside || null"
                :data-testid="`${testId}__bar`"
                :class="BAR_CLASS"
              >
                <span
                  :data-status="row.status"
                  :data-root="row.root || null"
                  :data-wide="row.wide || null"
                  :data-flip="row.flip || null"
                  :class="BAR_DURATION_CLASS"
                  aria-hidden="true"
                  >{{ formatDuration(row.span.duration) }}</span
                >
              </span>
              <span
                v-for="stretch in row.path"
                :key="`path-${stretch.key}`"
                :style="{
                  '--trace-path-offset': String(stretch.offset),
                  '--trace-path-width': String(stretch.width)
                }"
                :data-testid="`${testId}__path`"
                aria-hidden="true"
                class="pointer-events-none absolute -bottom-1 start-[calc(var(--trace-path-offset)*100%)] h-0.5 w-[calc(var(--trace-path-width)*100%)] rounded-full bg-(--text-default)"
              />
              <span
                v-for="mark in row.marks"
                :key="mark.key"
                :style="{ '--trace-event-at': String(mark.at) }"
                :data-testid="`${testId}__event`"
                aria-hidden="true"
                class="pointer-events-none absolute -inset-y-0.5 start-[calc(var(--trace-event-at)*100%)] -ms-px w-0.5 rounded-full bg-(--text-default) ring-1 ring-(--bg-surface)"
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
        <Tag
          v-if="criticalPath.has(detail.id)"
          key="critical"
          severity="neutral"
          :label="t('trace.criticalPath')"
          size="small"
          :data-testid="`${testId}__critical-tag`"
        />
        <CopyButton
          :value="detail.name"
          :aria-label="t('trace.copyName')"
          variant="outline"
          class="shrink-0"
          size="small"
        />
        <span class="ms-auto flex">
          <Button
            :label="t('trace.close')"
            :data-testid="`${testId}__close`"
            variant="ghost"
            size="medium"
            @click="close"
          />
        </span>
      </div>

      <dl
        class="m-0 grid grid-cols-2 gap-(--spacing-sm) @xl/trace:grid-cols-4 @3xl/trace:grid-cols-6"
      >
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
