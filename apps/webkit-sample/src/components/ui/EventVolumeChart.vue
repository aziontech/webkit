<script setup>
  // THE VOLUME BAR — event count over the applied window, above the log it belongs to,
  // and the control that narrows that window.
  //
  // WHY THE PAGE OPENS WITH A CHART AT ALL. A log answers "what happened"; the reader
  // arrives asking "when did it start". Ten pages of rows cannot answer that, and the
  // answer is one glance at a shape: a flat band with one spike is a different incident
  // from a rising ramp. So the chart is not decoration on a table, it is the table's
  // index — which is why it shares the table's exact query (same filters, same search)
  // and its window is the applied period, not a period of its own.
  //
  // AND IT IS THE TIME FILTER. Once the shape has shown WHEN, the next move is always
  // "show me only that" — so the chart takes a crosshair pointer and the gesture that
  // goes with it: click a bar for its bucket, drag across bars for a span. Both commit a
  // `{ start, end }` window, the same shape the Period field's `Custom…` calendar
  // produces, so the cut lands as a normal chip the reader can see and clear. Reaching
  // for the filter bar to type a time the chart is already showing is the round trip this
  // removes.
  //
  // EACH BAR IS STACKED BY LEVEL, in the four Tag severities the Level column already
  // uses (src/lib/real-time-events.js maps level → severity once, for every surface). A
  // single-tone bar can only say "how much"; stacked, the same pixels also say "how bad",
  // so a spike that is all Info reads differently from one that is half Error without the
  // reader touching anything. Error sits at the BOTTOM because a stack is read from the
  // baseline up: the count that matters is measured against the axis.
  //
  // THE LEGEND FOLLOWS THE CROSSHAIR, and it is the chart's own element — not a Tooltip
  // (text-only by contract, so it cannot hold a swatch/label/count table) and not a
  // Popover. Popover anchors a teleported panel to a trigger ONCE, on open: it has no way
  // to re-anchor as the pointer travels, so a Popover legend is either pinned in one place
  // while the pointer moves away from it, or 32 separate popovers flashing in and out —
  // one per bar the pointer crosses. A card positioned by `left` inside the chart glides
  // between buckets with its numbers changing in place: one element, one entrance, and it
  // stays under the pointer where the reading is happening.
  //
  // BARS AS FLEX CHILDREN, not an SVG. A histogram is a row of rectangles whose heights
  // are percentages; `flex-1` gives every bucket the same width at any container size
  // with no viewBox to keep in sync, and no `preserveAspectRatio` to distort. (The
  // sparkline in MetricPanel.vue IS an SVG, because a polyline between points is not
  // something layout can express.)
  import { computed, onBeforeUnmount, ref } from 'vue'

  import { formatEventClock, formatEventStamp, LEVEL_ORDER } from '../../lib/real-time-events'

  const props = defineProps({
    // [{ at: Date, end: Date, total: number, levels: Record<level, number> }], oldest first.
    buckets: { type: Array, default: () => [] },
    // The applied window, e.g. "Last 24 hours" — named in the accessible summary.
    windowLabel: { type: String, default: '' }
  })

  const emit = defineEmits(['select-range'])

  // Bottom-up paint order: the column is `justify-end`, so the LAST child sits on the
  // axis. Reversing the severity order puts Error there and Debug on top.
  const STACK_ORDER = [...LEVEL_ORDER].reverse()

  const hovered = ref(-1)
  // Drag anchor. `-1` means no gesture in flight; while dragging, the band between the
  // anchor and the hovered bucket is the pending selection.
  const anchor = ref(-1)

  const peak = computed(() => Math.max(1, ...props.buckets.map((bucket) => bucket.total)))

  const busiestIndex = computed(() =>
    props.buckets.reduce(
      (highest, bucket, index) =>
        bucket.total > (props.buckets[highest]?.total ?? 0) ? index : highest,
      0
    )
  )

  const busiest = computed(() => props.buckets[busiestIndex.value] ?? null)

  // The bucket the card is describing right now — the whole morph is this one lookup.
  const active = computed(() => props.buckets[hovered.value] ?? null)

  const share = (value) => `${((value / peak.value) * 100).toFixed(2)}%`

  // The crosshair and the card ride the same number: the centre of the hovered bucket, as
  // a percentage of the row. A percentage rather than a pixel offset so a panel resize
  // moves them with the bars instead of leaving them behind.
  const centre = computed(() =>
    props.buckets.length && hovered.value >= 0
      ? `${((hovered.value + 0.5) / props.buckets.length) * 100}%`
      : '0%'
  )

  // Near an edge the card cannot stay centred without leaving the chart, so it pivots on
  // its own edge instead. Three states, expressed as a `data-` value the template styles.
  const cardAlign = computed(() => {
    const count = props.buckets.length
    if (!count || hovered.value < 0) return 'center'
    if (hovered.value < count / 5) return 'start'
    if (hovered.value > (count * 4) / 5) return 'end'
    return 'center'
  })

  const selection = computed(() => {
    if (anchor.value < 0 || hovered.value < 0) return null
    return {
      from: Math.min(anchor.value, hovered.value),
      to: Math.max(anchor.value, hovered.value)
    }
  })

  const isSelected = (index) => {
    const range = selection.value
    return Boolean(range && index >= range.from && index <= range.to)
  }

  const onEnter = (index) => {
    hovered.value = index
  }

  const onLeave = () => {
    // A drag that leaves the row keeps its band: the pointer is still down, and the
    // window release commits it.
    if (anchor.value < 0) hovered.value = -1
  }

  // ── The gesture ───────────────────────────────────────────────────────────
  // Pointer capture on the WINDOW, not the bar: a drag that runs off the chart (or off
  // the viewport) still commits on release, and a release outside never leaves the band
  // painted with no gesture behind it.
  const commit = () => {
    const range = selection.value
    anchor.value = -1
    if (!range) return
    const from = props.buckets[range.from]
    const to = props.buckets[range.to]
    if (!from || !to) return
    emit('select-range', { start: from.at, end: to.end })
  }

  const onPointerUp = () => {
    commit()
    window.removeEventListener('pointerup', onPointerUp)
  }

  const onPointerDown = (index, event) => {
    // Left button only: a right-click is the browser's menu, not a selection.
    if (event.button !== 0) return
    anchor.value = index
    hovered.value = index
    window.addEventListener('pointerup', onPointerUp)
    // Stops the drag from becoming a text selection across the page.
    event.preventDefault()
  }

  onBeforeUnmount(() => window.removeEventListener('pointerup', onPointerUp))

  // Keyboard reads and drives the same thing: arrows walk the window, Enter filters to
  // the bucket under the caret. Clamped rather than wrapping — a window has two ends, and
  // jumping from the newest bucket to the oldest would lose the reader's place.
  const stepHovered = (delta) => {
    if (!props.buckets.length) return
    const from = hovered.value === -1 ? busiestIndex.value : hovered.value
    hovered.value = Math.min(Math.max(from + delta, 0), props.buckets.length - 1)
  }

  const applyHovered = () => {
    const bucket = active.value
    if (bucket) emit('select-range', { start: bucket.at, end: bucket.end })
  }

  // The axis: the window's start, middle and end. Three labels, because a label per
  // bucket is 32 timestamps nobody reads, and one label is not an axis.
  const axis = computed(() => {
    const { buckets } = props
    if (!buckets.length) return []
    return [buckets[0], buckets[Math.floor(buckets.length / 2)], buckets.at(-1)].map((bucket) =>
      formatEventClock(bucket.at)
    )
  })

  const summary = computed(() => {
    if (!busiest.value?.total) return `No events in the ${props.windowLabel.toLowerCase()}.`
    return `Busiest bucket at ${formatEventClock(busiest.value.at)} with ${busiest.value.total} events.`
  })

  const rowLabel = computed(
    () =>
      `Event volume, ${props.windowLabel.toLowerCase()}. ${summary.value} Use the arrow keys to read each bucket and Enter to filter the log to it.`
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
    <!-- `relative` is what the crosshair and the card are positioned against; it is on the
         row's wrapper rather than the row so the card can hang below the axis.
         `z-30` because the card overhangs INTO the table, and the table's own sticky
         header and frozen cells carry `z-20` / `z-10` in the same stacking context — at
         `z-10` the card was painted over by the column headers, losing its top two rows
         behind them. Measured, not guessed: the DS ships those two values. -->
    <div class="relative z-30">
      <div
        role="button"
        tabindex="0"
        :aria-label="rowLabel"
        class="flex h-20 w-full cursor-crosshair items-end gap-[1px] border-b border-[var(--border-default)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
        @pointerleave="onLeave"
        @keydown.left.prevent="stepHovered(-1)"
        @keydown.right.prevent="stepHovered(1)"
        @keydown.enter.prevent="applyHovered"
        @keydown.space.prevent="applyHovered"
      >
        <div
          v-for="(bucket, index) in buckets"
          :key="bucket.at.getTime()"
          :data-active="hovered === index || null"
          :data-selected="isSelected(index) || null"
          aria-hidden="true"
          class="flex h-full min-w-0 flex-1 flex-col justify-end transition-colors duration-fast-02 ease-productive-entrance data-[active]:bg-[var(--bg-hover)] data-[selected]:bg-[var(--bg-selected)] motion-reduce:transition-none"
          @pointerenter="onEnter(index)"
          @pointerdown="onPointerDown(index, $event)"
        >
          <div
            v-for="level in STACK_ORDER"
            :key="level"
            :data-level="level"
            class="w-full transition-[height] duration-fast-02 ease-productive-entrance data-[level=Debug]:bg-[var(--text-muted)] data-[level=Info]:bg-[var(--info-contrast)] data-[level=Warning]:bg-[var(--warning-contrast)] data-[level=Error]:bg-[var(--danger-contrast)] motion-reduce:transition-none"
            :style="{ height: share(bucket.levels[level]) }"
          />
        </div>
      </div>

      <!-- The crosshair: the line that says which bucket the card is about. Transitioned
           on `left` so it travels with the pointer instead of teleporting, and
           `pointer-events-none` so it can never sit between the pointer and a bar. -->
      <Transition
        enter-active-class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="opacity-0"
      >
        <div
          v-if="active"
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-[var(--border-strong)] transition-[left] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
          :style="{ left: centre }"
        />
      </Transition>

      <!-- THE LEGEND, following the crosshair. One card for the whole row: it fades in
           when the pointer enters the chart, slides between buckets with its numbers
           changing in place, and fades out on the way out — one entrance per sweep
           instead of one per bar. -->
      <Transition
        enter-active-class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="opacity-0"
      >
        <div
          v-if="active"
          role="status"
          :data-align="cardAlign"
          class="pointer-events-none absolute top-[calc(100%+var(--spacing-xxs))] z-30 w-max min-w-[var(--container-3xs)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-[var(--spacing-sm)] shadow-[var(--shadow-sm)] transition-[left] duration-fast-02 ease-productive-entrance data-[align=center]:-translate-x-1/2 data-[align=end]:-translate-x-full motion-reduce:transition-none"
          :style="{ left: centre }"
        >
          <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
            <p class="text-label-code-sm tabular-nums text-[var(--text-default)]">
              {{ formatEventStamp(active.at) }}
            </p>

            <dl
              class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-[var(--spacing-sm)] gap-y-[var(--spacing-xxs)]"
            >
              <template
                v-for="level in LEVEL_ORDER"
                :key="level"
              >
                <span
                  :data-level="level"
                  aria-hidden="true"
                  class="size-2 shrink-0 rounded-[var(--shape-elements)] data-[level=Debug]:bg-[var(--text-muted)] data-[level=Info]:bg-[var(--info-contrast)] data-[level=Warning]:bg-[var(--warning-contrast)] data-[level=Error]:bg-[var(--danger-contrast)]"
                />
                <dt class="min-w-0 truncate text-label-sm text-[var(--text-muted)]">{{ level }}</dt>
                <dd class="m-0 text-label-code-sm tabular-nums text-[var(--text-default)]">
                  {{ active.levels[level] }}
                </dd>
              </template>
            </dl>

            <div
              class="flex items-baseline justify-between gap-[var(--spacing-sm)] border-t border-[var(--border-muted)] pt-[var(--spacing-xs)]"
            >
              <span class="text-label-sm text-[var(--text-default)]">Total</span>
              <span class="text-label-code-sm tabular-nums text-[var(--text-default)]">
                {{ active.total }}
              </span>
            </div>

            <!-- The gesture is invisible without a line saying it is there, and a chart
                 nobody knows is clickable is a chart that is only ever read. -->
            <p class="text-body-sm text-[var(--text-muted)]">
              Click to filter to this bucket, or drag to select a span.
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <p class="sr-only">{{ summary }}</p>

    <div
      v-if="axis.length"
      class="flex items-center justify-between text-label-sm tabular-nums text-[var(--text-muted)]"
      aria-hidden="true"
    >
      <span
        v-for="(label, index) in axis"
        :key="index"
        >{{ label }}</span
      >
    </div>
  </div>
</template>
