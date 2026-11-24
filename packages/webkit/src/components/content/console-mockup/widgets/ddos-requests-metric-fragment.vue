<script setup lang="ts">
  import Tag from '../../tag/tag.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'DdosRequestsMetricFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the cursor reads the attack peak off the chart, tooltip included, while it is. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const PEAK_TOOLTIP_CLASS =
    'absolute z-1 flex -translate-x-1/2 translate-y-12 flex-col gap-(--spacing-2xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) ' +
    'py-(--spacing-xs) whitespace-nowrap opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance ' +
    'data-[state=open]:opacity-100 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:86%]"
    :active="active"
    stage-class="py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Alex"
  >
    <ConsoleMockupShellItem :order="0">
      <div
        class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
      >
        <span class="flex items-center gap-(--spacing-xs)">
          <Tag
            icon="az az-azion"
            severity="neutral"
            size="small"
          />
          <span class="truncate text-label-md text-(--text-default)">
            Total Requests per Second
          </span>
        </span>

        <span class="flex flex-col gap-(--spacing-sm)">
          <span class="text-body-xs text-(--text-muted)">
            Average of requests per second made from customers to your domain. Displays the average
            number of requests per second.
          </span>
          <span class="flex">
            <Tag
              label="Sum"
              icon="az az-calculator"
              severity="info"
              size="small"
            />
          </span>
        </span>

        <ConsoleMockupShellItem :order="1">
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
                    class="fill-[color-mix(in_srgb,var(--chart-series-1)_16%,transparent)]"
                  />
                  <polyline
                    :points="line"
                    fill="none"
                    stroke-width="2"
                    stroke-linejoin="round"
                    vector-effect="non-scaling-stroke"
                    class="stroke-(--chart-series-1)"
                  />
                  <line
                    :x1="x(PEAK)"
                    :x2="x(PEAK)"
                    y1="0"
                    :y2="HEIGHT"
                    :data-state="frame.tip ? 'open' : 'closed'"
                    vector-effect="non-scaling-stroke"
                    class="stroke-(--text-muted) opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance data-[state=open]:opacity-100 motion-reduce:transition-none"
                  />
                </svg>

                <span
                  :style="peakStyle"
                  data-cursor="peak"
                  class="absolute size-2 -translate-1/2"
                />

                <span
                  :style="peakStyle"
                  :data-state="frame.tip ? 'open' : 'closed'"
                  :class="PEAK_TOOLTIP_CLASS"
                >
                  <span class="text-label-sm text-(--text-default)">
                    Oct 16, 2026, 02:02:40 PM
                  </span>
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="size-2 rounded-full bg-(--chart-series-1)" />
                    <span class="text-body-xs text-(--text-muted)">
                      Edge Requests Total Per Second
                    </span>
                    <span class="text-label-sm text-(--text-default)">48,213</span>
                  </span>
                </span>
              </div>
            </div>

            <span class="flex justify-between ps-(--spacing-xl)">
              <span
                v-for="time in TIMES"
                :key="time"
                class="text-body-xs text-(--text-muted)"
              >
                {{ time }}
              </span>
            </span>

            <span class="flex items-center justify-center gap-(--spacing-xs)">
              <span class="size-2 rounded-full bg-(--chart-series-1)" />
              <span class="text-body-xs text-(--text-muted)"> Edge Requests Total Per Second </span>
            </span>
          </div>
        </ConsoleMockupShellItem>
      </div>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
