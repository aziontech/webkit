<script setup lang="ts">
  import { computed, ref } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../../composables/use-direction'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import { clamp, fitWindow, minimapLinesOf } from '../lib/trace-model'
  import type { TraceDrag, TraceEdge, TraceRange, TraceSpan } from '../types'

  defineOptions({ name: 'TraceMinimap', inheritAttrs: false })

  interface Props {
    /** Every span, drawn as a line on the track. */
    spans: TraceSpan[]
    /** Ids of the spans in the trace. */
    known: Set<string>
    /** Length of the run in milliseconds. */
    total: number
    /** Smallest window in milliseconds. */
    minSpan: number
    /** The window shown now. */
    win: TraceRange
    /** The window is narrower than the run. */
    zoomed: boolean
    /** Formats a duration in milliseconds. */
    format: (ms: number) => string
    /** Test id of the owning Trace; each part appends its own name. */
    testId: string
  }

  const props = defineProps<Props>()

  const range = defineModel<TraceRange | null>('range', { required: true })

  const STEP_SHARE = 0.01
  const PAGE_SHARE = 0.1

  const { t } = useTranslate({ trace: en.trace })
  const trackEl = ref<HTMLElement | null>(null)
  const dir = useDirection(trackEl)
  let drag: TraceDrag | null = null

  const minimapLines = computed(() => minimapLinesOf(props.spans, props.known, props.total))

  const windowStyle = computed(() => ({
    '--trace-window-start': String(props.win[0] / props.total),
    '--trace-window-size': String((props.win[1] - props.win[0]) / props.total)
  }))

  const setWindow = (a: number, b: number): void => {
    const [low, high] = fitWindow(a, b, props.total, props.minSpan)
    range.value = low <= 0 && high >= props.total ? null : [low, high]
  }

  const msAt = (event: PointerEvent): number => {
    const track = trackEl.value
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    const share = rect.width ? (event.clientX - rect.left) / rect.width : 0
    return clamp(dir.value === 'rtl' ? 1 - share : share, 0, 1) * props.total
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
    const [low, high] = props.win
    drag = {
      mode: props.zoomed && at >= low && at <= high ? 'pan' : 'draw',
      anchor: at,
      origin: [low, high]
    }
    capture(event)
  }

  const onThumbDown = (event: PointerEvent, edge: TraceEdge): void => {
    if (event.button !== 0) return
    drag = { mode: edge, anchor: msAt(event), origin: [props.win[0], props.win[1]] }
    capture(event)
  }

  const onTrackMove = (event: PointerEvent): void => {
    if (!drag) return
    const at = msAt(event)
    const [low, high] = drag.origin
    if (drag.mode === 'draw') {
      if (Math.abs(at - drag.anchor) >= props.minSpan / 2) setWindow(drag.anchor, at)
    } else if (drag.mode === 'start') setWindow(Math.min(at, high - props.minSpan), high)
    else if (drag.mode === 'end') setWindow(low, Math.max(at, low + props.minSpan))
    else {
      const start = clamp(low + at - drag.anchor, 0, props.total - (high - low))
      setWindow(start, start + high - low)
    }
  }

  const onTrackUp = (): void => {
    drag = null
  }

  const thumbLimits = (edge: TraceEdge): [number, number] =>
    edge === 'start'
      ? [0, props.win[1] - props.minSpan]
      : [props.win[0] + props.minSpan, props.total]

  const KEY_STEPS = new Map<string, number>([
    ['ArrowRight', STEP_SHARE],
    ['ArrowUp', STEP_SHARE],
    ['ArrowLeft', -STEP_SHARE],
    ['ArrowDown', -STEP_SHARE],
    ['PageUp', PAGE_SHARE],
    ['PageDown', -PAGE_SHARE]
  ])

  const onThumbKey = (event: KeyboardEvent, edge: TraceEdge): void => {
    const key = logicalArrowKey(event.key, dir.value)
    const [low, high] = props.win
    const [min, max] = thumbLimits(edge)
    const current = edge === 'start' ? low : high
    const step = KEY_STEPS.get(key)
    let next: number | null = null
    if (step !== undefined) next = current + props.total * step
    else if (key === 'Home') next = min
    else if (key === 'End') next = max
    else if (key !== 'Escape') return
    event.preventDefault()
    if (next === null) {
      range.value = null
      return
    }
    const value = clamp(next, min, max)
    if (edge === 'start') setWindow(value, high)
    else setWindow(low, value)
  }

  const thumbs = computed(() =>
    (['start', 'end'] as const).map((edge) => {
      const [min, max] = thumbLimits(edge)
      const value = edge === 'start' ? props.win[0] : props.win[1]
      return {
        edge,
        label: edge === 'start' ? t('trace.zoomStart') : t('trace.zoomEnd'),
        min: Math.round(min),
        max: Math.round(max),
        now: Math.round(value),
        text: props.format(value)
      }
    })
  )

  const MINIMAP_CLASS =
    '[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted) ' +
    'group-data-[view=timeline]/trace:grid-cols-1 @max-xl/trace:group-data-[view=waterfall]/trace:grid-cols-1'
  const MINIMAP_LABEL_CLASS =
    'flex min-w-0 items-center gap-(--spacing-xs) border-e border-(--border-muted) px-(--spacing-sm) py-(--spacing-2xs) ' +
    'group-data-[view=timeline]/trace:border-e-0 group-data-[view=timeline]/trace:border-b ' +
    '@max-xl/trace:group-data-[view=waterfall]/trace:border-e-0 @max-xl/trace:group-data-[view=waterfall]/trace:border-b'
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
</script>

<template>
  <div
    v-bind="$attrs"
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
        @click="range = null"
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
</template>
