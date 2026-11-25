<script setup lang="ts">
  import { computed } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'RealTimeEventsVolumeFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the pointer reads the volume bars toward the error spike while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const { formatNumber } = useLocale()

  const LEVEL_ORDER = ['Error', 'Warning', 'Info', 'Debug'] as const
  const STACK_ORDER = [...LEVEL_ORDER].reverse()

  type EventLevel = (typeof LEVEL_ORDER)[number]

  const BUCKET_COUNT = 32
  const BUCKET_MINUTES = 45
  const WINDOW_START = 14 * 60 + 20
  const SPIKE = 27
  const WOBBLE = [3, -2, 5, 0, -4, 2, 6, -1]

  const BUCKETS = Array.from({ length: BUCKET_COUNT }, (_, index) => {
    const total =
      Math.round(18 + 58 * (index / (BUCKET_COUNT - 1)) ** 1.4) +
      WOBBLE[index % WOBBLE.length] +
      (index === SPIKE ? 34 : 0)
    const error = Math.round(total * (index === SPIKE ? 0.46 : 0.18))
    const warning = Math.round(total * 0.27)
    const debug = Math.round(total * 0.08)
    const levels: Record<EventLevel, number> = {
      Error: error,
      Warning: warning,
      Info: total - error - warning - debug,
      Debug: debug
    }
    return { index, total, levels }
  })

  const PEAK = Math.max(...BUCKETS.map((bucket) => bucket.total))
  const TOTAL = BUCKETS.reduce((sum, bucket) => sum + bucket.total, 0)
  const ERRORS = BUCKETS.reduce((sum, bucket) => sum + bucket.levels.Error, 0)

  const pad = (value: number) => String(value).padStart(2, '0')

  const clock = (index: number) => {
    const minutes = (WINDOW_START + index * BUCKET_MINUTES) % 1440
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
  }

  const stamp = (index: number) => {
    const day = WINDOW_START + index * BUCKET_MINUTES >= 1440 ? 16 : 15
    return `Oct ${day}, 2026 ${clock(index)}`
  }

  const AXIS = [0, BUCKET_COUNT / 2, BUCKET_COUNT - 1].map(clock)

  const share = (value: number) => `${((value / PEAK) * 100).toFixed(2)}%`

  interface Frame {
    cursor: MockupCursorTarget
    hovered: number
    forward: number
    back: number
  }

  const bar = (index: number, y = 0.55): MockupCursorTarget => ({ key: `bar-${index}`, x: 0.5, y })

  const FRAMES: Frame[] = [
    { cursor: bar(14, 1.9), hovered: -1, forward: 0, back: 0 },
    { cursor: bar(17), hovered: 17, forward: 220, back: 420 },
    { cursor: bar(21), hovered: 21, forward: 300, back: 280 },
    { cursor: bar(24), hovered: 24, forward: 300, back: 280 },
    { cursor: bar(SPIKE), hovered: SPIKE, forward: 320, back: 280 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const activeBucket = computed(() => BUCKETS[frame.value.hovered] ?? null)

  const centre = computed(() =>
    frame.value.hovered >= 0 ? `${((frame.value.hovered + 0.5) / BUCKET_COUNT) * 100}%` : '0%'
  )

  const cardAlign = computed(() => {
    const index = frame.value.hovered
    if (index < BUCKET_COUNT / 5) return 'start'
    if (index > (BUCKET_COUNT * 4) / 5) return 'end'
    return 'center'
  })

  const BAR_SEGMENT_CLASS =
    'w-full ' +
    'data-[level=Debug]:bg-(--text-muted) data-[level=Info]:bg-(--info-foreground) data-[level=Warning]:bg-(--warning-foreground) data-[level=Error]:bg-(--danger-foreground)'

  const BUCKET_CARD_CLASS =
    'absolute top-0 start-0 w-max min-w-(--container-3xs) rounded-(--shape-control) border border-(--border-default) ' +
    'bg-(--bg-surface-raised) p-(--spacing-sm) shadow-(--shadow-sm) ' +
    'data-[align=center]:-translate-x-1/2 rtl:data-[align=center]:translate-x-1/2 data-[align=end]:-translate-x-full rtl:data-[align=end]:translate-x-full'

  const MOVER_CLASS =
    'relative w-full translate-x-(--console-mockup-bucket-offset) rtl:-translate-x-(--console-mockup-bucket-offset) transition-[translate] duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none'

  const LEGEND_SWATCH_CLASS =
    'size-2 shrink-0 rounded-(--shape-control) ' +
    'data-[level=Debug]:bg-(--text-muted) data-[level=Info]:bg-(--info-foreground) data-[level=Warning]:bg-(--warning-foreground) data-[level=Error]:bg-(--danger-foreground)'
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:84%]"
    :active="active"
    stage-class="flex flex-col gap-(--spacing-sm) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Jane"
  >
    <ConsoleMockupShellItem :order="0">
      <dl class="flex flex-wrap items-end gap-(--spacing-xl)">
        <div class="flex flex-col">
          <dt class="text-label-sm text-(--text-muted)">Events</dt>
          <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
            {{ formatNumber(TOTAL) }}
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-label-sm text-(--text-muted)">Errors</dt>
          <dd class="m-0 text-heading-xs tabular-nums text-(--danger-foreground)">
            {{ formatNumber(ERRORS) }}
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-label-sm text-(--text-muted)">Avg request time</dt>
          <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">518 ms</dd>
        </div>
      </dl>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="1">
      <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
        <div class="relative z-30">
          <div class="flex h-20 w-full items-end gap-px border-b border-(--border-default)">
            <div
              v-for="bucket in BUCKETS"
              :key="bucket.index"
              :data-cursor="`bar-${bucket.index}`"
              :data-active="frame.hovered === bucket.index || null"
              class="flex h-full min-w-0 flex-1 flex-col justify-end transition-colors duration-fast-02 ease-productive-entrance data-active:bg-(--bg-hover) motion-reduce:transition-none"
            >
              <div
                v-for="level in STACK_ORDER"
                :key="level"
                :data-level="level"
                :class="BAR_SEGMENT_CLASS"
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
              v-if="activeBucket"
              class="pointer-events-none absolute inset-0 overflow-x-clip"
            >
              <div
                :class="MOVER_CLASS"
                class="h-full"
                :style="{ '--console-mockup-bucket-offset': centre }"
              >
                <div
                  class="absolute inset-y-0 start-0 w-px -translate-x-1/2 rtl:translate-x-1/2 bg-(--border-strong)"
                />
              </div>
            </div>
          </Transition>

          <Transition
            enter-active-class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="opacity-0"
          >
            <div
              v-if="activeBucket"
              class="pointer-events-none absolute inset-x-0 top-[calc(100%+var(--spacing-2xs))] z-30 overflow-x-clip"
            >
              <div
                :class="MOVER_CLASS"
                :style="{ '--console-mockup-bucket-offset': centre }"
              >
                <div
                  :data-align="cardAlign"
                  :class="BUCKET_CARD_CLASS"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                    <p class="text-label-code-sm tabular-nums text-(--text-default)">
                      {{ stamp(activeBucket.index) }}
                    </p>

                    <dl
                      class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs)"
                    >
                      <template
                        v-for="level in LEVEL_ORDER"
                        :key="level"
                      >
                        <span
                          :data-level="level"
                          aria-hidden="true"
                          :class="LEGEND_SWATCH_CLASS"
                        />
                        <dt class="min-w-0 truncate text-label-sm text-(--text-muted)">
                          {{ level }}
                        </dt>
                        <dd class="m-0 text-label-code-sm tabular-nums text-(--text-default)">
                          {{ activeBucket.levels[level] }}
                        </dd>
                      </template>
                    </dl>

                    <div
                      class="flex items-baseline justify-between gap-(--spacing-sm) border-t border-(--border-muted) pt-(--spacing-xs)"
                    >
                      <span class="text-label-sm text-(--text-default)">Total</span>
                      <span class="text-label-code-sm tabular-nums text-(--text-default)">
                        {{ activeBucket.total }}
                      </span>
                    </div>

                    <p class="text-body-sm text-(--text-muted)">
                      Click to filter to this bucket, or drag to select a span.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div
          class="flex items-center justify-between text-label-sm tabular-nums text-(--text-muted)"
          aria-hidden="true"
        >
          <span
            v-for="(label, index) in AXIS"
            :key="index"
            >{{ label }}</span
          >
        </div>
      </div>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
