<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'RealTimeEventsVolumeFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the pointer reads the volume bars toward the error spike while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const stage = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
  const { position } = useMockupCursor(stage, () => frame.value.cursor)

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

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced) {
      step.value = target
      return
    }
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:84%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative flex flex-col gap-(--spacing-sm) py-(--spacing-xs)"
    >
      <ShellMockupPart :order="0">
        <dl class="flex flex-wrap items-end gap-(--spacing-xl)">
          <div class="flex flex-col">
            <dt class="text-label-sm text-(--text-muted)">Events</dt>
            <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
              {{ TOTAL.toLocaleString('en-US') }}
            </dd>
          </div>
          <div class="flex flex-col">
            <dt class="text-label-sm text-(--text-muted)">Errors</dt>
            <dd class="m-0 text-heading-xs tabular-nums text-(--danger-contrast)">
              {{ ERRORS.toLocaleString('en-US') }}
            </dd>
          </div>
          <div class="flex flex-col">
            <dt class="text-label-sm text-(--text-muted)">Avg request time</dt>
            <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">518 ms</dd>
          </div>
        </dl>
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
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
                  class="w-full data-[level=Debug]:bg-(--text-muted) data-[level=Info]:bg-(--info-contrast) data-[level=Warning]:bg-(--warning-contrast) data-[level=Error]:bg-(--danger-contrast)"
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
                v-if="activeBucket"
                :data-align="cardAlign"
                class="pointer-events-none absolute top-[calc(100%+var(--spacing-xxs))] z-30 w-max min-w-(--container-3xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm) shadow-(--shadow-sm) transition-[left] duration-fast-02 ease-productive-entrance data-[align=center]:-translate-x-1/2 data-[align=end]:-translate-x-full motion-reduce:transition-none"
                :style="{ left: centre }"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                  <p class="text-label-code-sm tabular-nums text-(--text-default)">
                    {{ stamp(activeBucket.index) }}
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
      </ShellMockupPart>

      <MockupCursor
        name="Lia"
        :x="position.x"
        :y="position.y"
      />
    </div>
  </ShellMockup>
</template>
