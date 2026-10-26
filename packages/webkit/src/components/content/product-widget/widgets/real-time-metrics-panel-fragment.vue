<script setup lang="ts">
  import CardBox from '../../card-box/card-box.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import MockupElevator from '../parts/mockup-elevator.vue'

  defineOptions({ name: 'RealTimeMetricsPanelFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs through the panels only while it is. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const WIDTH = 100
  const HEIGHT = 32

  const PANELS = [
    {
      title: 'Requests per second',
      unit: 'req/s',
      series: [
        3788.4, 3997.2, 1369.2, 1560, 2100, 1344, 2413.2, 1387.2, 3226.8, 3720, 2445.6, 2748,
        3525.6, 2344.8, 4087.2, 1225.2, 1804.8, 3118.8, 2874, 3324, 2276.4, 1376.4, 1423.2, 2316
      ]
    },
    {
      title: 'Data transferred',
      unit: 'MB/s',
      series: [
        47.14, 60.23, 128.23, 208.98, 145.74, 74, 85.39, 92.02, 68.9, 91.17, 191.64, 56.83, 74.68,
        103.07, 144.72, 45.27, 81.82, 138.09, 50.37, 200.65, 118.03, 94.74, 51.9, 138.43
      ]
    },
    {
      title: 'Cache hit ratio',
      unit: '%',
      series: [
        81.27, 82.83, 90.98, 81.36, 78.49, 79.67, 85.11, 84.04, 94.26, 78.06, 88.79, 82.31, 83.32,
        93.41, 84.1, 88.77, 92.42, 79.08, 84.21, 91.15, 94.3, 82.64, 93.75, 79.35
      ]
    },
    {
      title: 'Status codes 5xx',
      unit: '%',
      series: [
        0.19, 0.18, 0.05, 0.4, 0.19, 0.26, 0.27, 0.22, 0.4, 0.35, 0.24, 0.38, 0.18, 0.3, 0.34, 0.16,
        0.35, 0.06, 0.28, 0.32, 0.11, 0.13, 0.23, 0.05
      ]
    }
  ]

  const linePoints = (series: number[]) => {
    const min = Math.min(...series)
    const max = Math.max(...series)
    const step = WIDTH / (series.length - 1)
    return series
      .map((value, index) => {
        const y = HEIGHT - ((value - min) / (max - min)) * HEIGHT
        return `${(index * step).toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ')
  }

  const areaPoints = (series: number[]) => `0,${HEIGHT} ${linePoints(series)} ${WIDTH},${HEIGHT}`

  const latest = (series: number[]) => {
    const value = series[series.length - 1]
    return value >= 100 ? Math.round(value).toLocaleString('en-US') : value.toFixed(2)
  }
</script>

<template>
  <ShellMockup
    kind="bare"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex h-full flex-col py-(--spacing-xs)">
      <ShellMockupPart
        :order="0"
        class="min-h-0 flex-1"
      >
        <MockupElevator
          :count="PANELS.length"
          :active="hover || !canHover"
        >
          <template #default="{ index }">
            <CardBox>
              <template #content>
                <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                  <div class="flex min-w-0 items-baseline justify-between gap-(--spacing-xs)">
                    <span class="min-w-0 truncate text-label-md text-(--text-default)">
                      {{ PANELS[index].title }}
                    </span>
                    <span class="shrink-0 text-body-sm text-(--text-muted)">Last 24 hours</span>
                  </div>

                  <p class="flex items-baseline gap-(--spacing-xxs)">
                    <span class="text-heading-md text-(--text-default)">
                      {{ latest(PANELS[index].series) }}
                    </span>
                    <span class="text-body-sm text-(--text-muted)">{{ PANELS[index].unit }}</span>
                  </p>

                  <svg
                    :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
                    preserveAspectRatio="none"
                    class="h-16 w-full text-(--primary)"
                    aria-hidden="true"
                  >
                    <polygon
                      :points="areaPoints(PANELS[index].series)"
                      fill="currentColor"
                      opacity="0.12"
                    />
                    <polyline
                      :points="linePoints(PANELS[index].series)"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      vector-effect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </template>
            </CardBox>
          </template>
        </MockupElevator>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
