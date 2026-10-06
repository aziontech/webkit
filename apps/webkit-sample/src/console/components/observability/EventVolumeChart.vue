<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from 'vue'

  import { formatEventClock, formatEventStamp, LEVEL_ORDER } from '../../lib/data/real-time-events'

  interface Props {
    buckets?: unknown[]
    windowLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    buckets: () => [],
    windowLabel: ''
  })

  const emit = defineEmits<{
    'select-range': [value: unknown]
  }>()

  const STACK_ORDER = [...LEVEL_ORDER].reverse()

  const hovered = ref(-1)
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

  const active = computed(() => props.buckets[hovered.value] ?? null)

  const share = (value) => `${((value / peak.value) * 100).toFixed(2)}%`

  const centre = computed(() =>
    props.buckets.length && hovered.value >= 0
      ? `${((hovered.value + 0.5) / props.buckets.length) * 100}%`
      : '0%'
  )

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
    if (anchor.value < 0) hovered.value = -1
  }

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
    if (event.button !== 0) return
    anchor.value = index
    hovered.value = index
    window.addEventListener('pointerup', onPointerUp)
    event.preventDefault()
  }

  onBeforeUnmount(() => window.removeEventListener('pointerup', onPointerUp))

  const stepHovered = (delta) => {
    if (!props.buckets.length) return
    const from = hovered.value === -1 ? busiestIndex.value : hovered.value
    hovered.value = Math.min(Math.max(from + delta, 0), props.buckets.length - 1)
  }

  const applyHovered = () => {
    const bucket = active.value
    if (bucket) emit('select-range', { start: bucket.at, end: bucket.end })
  }

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
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="relative z-30">
      <div
        role="button"
        tabindex="0"
        :aria-label="rowLabel"
        class="flex h-20 w-full cursor-crosshair items-end gap-px border-b border-(--border-default) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
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
          class="flex h-full min-w-0 flex-1 flex-col justify-end transition-colors duration-fast-02 ease-productive-entrance data-active:bg-(--bg-hover) data-selected:bg-(--bg-selected) motion-reduce:transition-none"
          @pointerenter="onEnter(index)"
          @pointerdown="onPointerDown(index, $event)"
        >
          <div
            v-for="level in STACK_ORDER"
            :key="level"
            :data-level="level"
            class="w-full transition-[height] duration-fast-02 ease-productive-entrance data-[level=Debug]:bg-(--text-muted) data-[level=Info]:bg-(--info-contrast) data-[level=Warning]:bg-(--warning-contrast) data-[level=Error]:bg-(--danger-contrast) motion-reduce:transition-none"
            :style="{ height: share(bucket.levels[level]) }"
          />
        </div>
      </div>

      <Transition
        enter-active-class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="opacity-0"
      >
        <div
          v-if="active"
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-(--border-strong) transition-[left] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
          :style="{ left: centre }"
        />
      </Transition>

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
          class="pointer-events-none absolute top-[calc(100%+var(--spacing-xxs))] z-30 w-max min-w-(--container-3xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm) shadow-(--shadow-sm) transition-[left] duration-fast-02 ease-productive-entrance data-[align=center]:-translate-x-1/2 data-[align=end]:-translate-x-full motion-reduce:transition-none"
          :style="{ left: centre }"
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
            <p class="text-label-code-sm tabular-nums text-(--text-default)">
              {{ formatEventStamp(active.at) }}
            </p>

            <dl
              class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs)"
            >
              <template
                v-for="level in LEVEL_ORDER"
                :key="level"
              >
                <span
                  :data-level="level"
                  aria-hidden="true"
                  class="size-2 shrink-0 rounded-(--shape-elements) data-[level=Debug]:bg-(--text-muted) data-[level=Info]:bg-(--info-contrast) data-[level=Warning]:bg-(--warning-contrast) data-[level=Error]:bg-(--danger-contrast)"
                />
                <dt class="min-w-0 truncate text-label-sm text-(--text-muted)">{{ level }}</dt>
                <dd class="m-0 text-label-code-sm tabular-nums text-(--text-default)">
                  {{ active.levels[level] }}
                </dd>
              </template>
            </dl>

            <div
              class="flex items-baseline justify-between gap-(--spacing-sm) border-t border-(--border-muted) pt-(--spacing-xs)"
            >
              <span class="text-label-sm text-(--text-default)">Total</span>
              <span class="text-label-code-sm tabular-nums text-(--text-default)">
                {{ active.total }}
              </span>
            </div>

            <p class="text-body-sm text-(--text-muted)">
              Click to filter to this bucket, or drag to select a span.
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <p class="sr-only">{{ summary }}</p>

    <div
      v-if="axis.length"
      class="flex items-center justify-between text-label-sm tabular-nums text-(--text-muted)"
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
