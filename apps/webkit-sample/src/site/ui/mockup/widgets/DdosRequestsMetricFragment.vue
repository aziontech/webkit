<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'DdosRequestsMetricFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the cursor reads the attack peak off the chart, tooltip included, while it is. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const SERIES = [
    1184, 1212, 1236, 1198, 1251, 1274, 1229, 1262, 1305, 1288, 1241, 1276, 1310, 1295, 1268, 18412,
    48213, 9640, 1342, 1318, 1287, 1302, 1336, 1291, 1264, 1309, 1327, 1298, 1315, 1283, 1306
  ]

  const PEAK = SERIES.indexOf(Math.max(...SERIES))
  const CEILING = 50000
  const WIDTH = 360
  const HEIGHT = 140

  const TICKS = ['50k', '25k', '0']
  const TIMES = ['14:00', '14:01', '14:02', '14:03', '14:04', '14:05']

  const x = (index: number) => (index / (SERIES.length - 1)) * WIDTH
  const y = (value: number) => HEIGHT - (value / CEILING) * HEIGHT

  const line = SERIES.map((value, index) => `${x(index)},${y(value)}`).join(' ')
  const area = `0,${HEIGHT} ${line} ${WIDTH},${HEIGHT}`

  const peakStyle = {
    left: `${(x(PEAK) / WIDTH) * 100}%`,
    top: `${(y(SERIES[PEAK]) / HEIGHT) * 100}%`
  }

  interface Frame {
    cursor: MockupCursorTarget
    tip: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'peak', x: 15, y: 10 }
  const PEAK_POINT: MockupCursorTarget = { key: 'peak', x: 0.5, y: 0.5 }

  const FRAMES: Frame[] = [
    { cursor: IDLE, tip: false, forward: 0, back: 0 },
    { cursor: PEAK_POINT, tip: false, forward: 120, back: 160 },
    { cursor: PEAK_POINT, tip: true, forward: 640, back: 420 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stage, () => frame.value.cursor)

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
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:86%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative py-(--spacing-xs)"
    >
      <MockupPart :order="0">
        <div
          class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <Tag
              icon="ai ai-azion"
              severity="secondary"
              size="small"
            />
            <span class="truncate text-label-md text-(--text-default)">
              Total Requests per Second
            </span>
          </span>

          <span class="flex flex-col gap-(--spacing-sm)">
            <span class="text-body-xs text-(--text-muted)">
              Average of requests per second made from customers to your domain. Displays the
              average number of requests per second.
            </span>
            <span class="flex">
              <Tag
                label="Sum"
                icon="pi pi-calculator"
                severity="info"
                size="small"
              />
            </span>
          </span>

          <MockupPart :order="1">
            <div class="flex flex-col gap-(--spacing-sm)">
              <div class="flex gap-(--spacing-xs)">
                <span class="flex h-28 shrink-0 flex-col justify-between">
                  <span
                    v-for="tick in TICKS"
                    :key="tick"
                    class="text-body-xs text-(--text-muted)"
                  >
                    {{ tick }}
                  </span>
                </span>
                <div class="relative h-28 min-w-0 flex-1">
                  <svg
                    :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
                    preserveAspectRatio="none"
                    class="absolute inset-0 size-full overflow-visible"
                    aria-hidden="true"
                  >
                    <line
                      v-for="row in 3"
                      :key="row"
                      x1="0"
                      :x2="WIDTH"
                      :y1="((row - 1) / 2) * HEIGHT"
                      :y2="((row - 1) / 2) * HEIGHT"
                      vector-effect="non-scaling-stroke"
                      class="stroke-(--border-default)"
                    />
                    <polygon
                      :points="area"
                      class="fill-[color-mix(in_srgb,var(--primary)_16%,transparent)]"
                    />
                    <polyline
                      :points="line"
                      fill="none"
                      stroke-width="2"
                      stroke-linejoin="round"
                      vector-effect="non-scaling-stroke"
                      class="stroke-(--primary)"
                    />
                    <line
                      :x1="x(PEAK)"
                      :x2="x(PEAK)"
                      y1="0"
                      :y2="HEIGHT"
                      :data-shown="frame.tip || null"
                      vector-effect="non-scaling-stroke"
                      class="stroke-(--text-muted) opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance data-shown:opacity-100 motion-reduce:transition-none"
                    />
                  </svg>

                  <span
                    :style="peakStyle"
                    data-cursor="peak"
                    class="absolute size-2 -translate-1/2"
                  />

                  <span
                    :style="peakStyle"
                    :data-shown="frame.tip || null"
                    class="absolute z-1 flex -translate-x-1/2 translate-y-12 flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs) whitespace-nowrap opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance data-shown:opacity-100 motion-reduce:transition-none"
                  >
                    <span class="text-label-sm text-(--text-default)">
                      Oct 16, 2026, 02:02:40 PM
                    </span>
                    <span class="flex items-center gap-(--spacing-xs)">
                      <span class="size-2 rounded-full bg-(--primary)" />
                      <span class="text-body-xs text-(--text-muted)">
                        Edge Requests Total Per Second
                      </span>
                      <span class="text-label-sm text-(--text-default)">48,213</span>
                    </span>
                  </span>
                </div>
              </div>

              <span class="flex justify-between pl-(--spacing-xl)">
                <span
                  v-for="time in TIMES"
                  :key="time"
                  class="text-body-xs text-(--text-muted)"
                >
                  {{ time }}
                </span>
              </span>

              <span class="flex items-center justify-center gap-(--spacing-xs)">
                <span class="size-2 rounded-full bg-(--primary)" />
                <span class="text-body-xs text-(--text-muted)">
                  Edge Requests Total Per Second
                </span>
              </span>
            </div>
          </MockupPart>
        </div>
      </MockupPart>

      <MockupCursor
        name="Rafael"
        :x="position.x"
        :y="position.y"
        :pressed="false"
      />
    </div>
  </ShellMockup>
</template>
