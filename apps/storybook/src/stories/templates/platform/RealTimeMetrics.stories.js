import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  componentsFor,
  FILTER_BUTTON,
  FILTER_CHIPS,
  FILTER_SCRIPT,
  page,
  pageHeading,
  runScript,
  scriptOf
} from './_observe-markup'

const SERIES = `const periods = [
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
]

const seriesFor = (seed, points, min, max) => {
  let h = 0x811c9dc5
  for (const char of seed) {
    h ^= char.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return Array.from({ length: points }, () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return min + ((h % 1000) / 1000) * (max - min)
  })
}

const panel = (title, unit, period, [min, max]) => ({
  title,
  unit,
  series: seriesFor(title + ':' + period, 24, min, max)
})`

const METRICS = `const metricsFor = (period) => ({
  strip: [
    { label: 'Requests', value: '48.2', unit: 'M', hint: 'Requests handled at the edge.' },
    { label: 'Data Transferred', value: '6.4', unit: 'TB', hint: 'Bytes delivered to clients.' },
    {
      label: 'Bandwidth Saved',
      value: '71',
      unit: '%',
      hint: 'Served from cache, not your origin.'
    },
    { label: 'Status 5xx', value: '0.03', unit: '%', hint: 'Share of responses that failed.' }
  ],
  panels: [
    panel('Requests per second', 'req/s', period, [1200, 4800]),
    panel('Data transferred', 'MB/s', period, [40, 210]),
    panel('Cache hit ratio', '%', period, [78, 97]),
    panel('Status codes 5xx', '%', period, [0, 0.4])
  ]
})`

const PULSE = `const metricsFor = (period) => ({
  strip: [
    {
      label: 'Page Load Time',
      value: '1.24',
      unit: 's',
      hint: 'Median, as measured in the browser.'
    },
    {
      label: 'Largest Contentful Paint',
      value: '1.86',
      unit: 's',
      hint: 'Median LCP across sessions.'
    },
    {
      label: 'First Input Delay',
      value: '18',
      unit: 'ms',
      hint: 'Median delay before the page responds.'
    },
    { label: 'Sessions', value: '412', unit: 'K', hint: 'Real user sessions measured.' }
  ],
  panels: [
    panel('Page load time', 's', period, [0.9, 2.4]),
    panel('Largest contentful paint', 's', period, [1.2, 3.1]),
    panel('First input delay', 'ms', period, [8, 46]),
    panel('Sessions', 'k', period, [8, 32])
  ]
})`

const STATE = `const filters = ref({ period: ['24h'] })

const filterFields = [
  { id: 'period', label: 'Period', kind: 'range', options: periods, match: () => true }
]

const period = computed(() => filters.value.period?.[0] ?? '24h')
const windowLabel = computed(
  () => periods.find((entry) => entry.value === period.value)?.label ?? 'Last 24 hours'
)
const data = computed(() => metricsFor(period.value))

const WIDTH = 100
const HEIGHT = 32

const sparkline = (series) => {
  const min = Math.min(...series)
  const max = Math.max(...series)
  const low = max === min ? min - 1 : min
  const high = max === min ? max + 1 : max
  const step = series.length > 1 ? WIDTH / (series.length - 1) : 0
  const points = series
    .map((value, index) => {
      const y = HEIGHT - ((value - low) / (high - low)) * HEIGHT
      return (index * step).toFixed(2) + ',' + y.toFixed(2)
    })
    .join(' ')
  const latest = series.at(-1)
  return {
    points,
    area: '0,' + HEIGHT + ' ' + points + ' ' + WIDTH + ',' + HEIGHT,
    latest: latest >= 100 ? Math.round(latest).toLocaleString() : latest.toFixed(2)
  }
}

const panels = computed(() =>
  data.value.panels.map((entry) => ({ ...entry, ...sparkline(entry.series) }))
)`

const bodyOf = (metrics) => [SERIES, metrics, STATE, FILTER_SCRIPT].join('\n\n')

const STRIP = `<ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
  <li v-for="metric in data.strip" :key="metric.label" class="flex">
    <CardBox class="w-full">
      <template #content>
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <Tooltip :text="metric.hint">
            <span class="min-w-0 truncate text-body-sm text-(--text-muted)">
              {{ metric.label }}
            </span>
          </Tooltip>
          <p class="flex items-baseline gap-(--spacing-xxs)">
            <span class="text-heading-lg text-(--text-default)">
              {{ metric.value }}
            </span>
            <span v-if="metric.unit" class="text-body-md text-(--text-muted)">{{ metric.unit }}</span>
          </p>
        </div>
      </template>
    </CardBox>
  </li>
</ul>`

const PANELS = `<div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2">
  <CardBox v-for="panel in panels" :key="panel.title">
    <template #content>
      <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
        <div class="flex min-w-0 items-baseline justify-between gap-(--spacing-xs)">
          <h3 class="min-w-0 truncate text-label-md text-(--text-default)">{{ panel.title }}</h3>
          <span class="shrink-0 text-body-sm text-(--text-muted)">{{ windowLabel }}</span>
        </div>

        <p class="flex items-baseline gap-(--spacing-xxs)">
          <span class="text-heading-md text-(--text-default)">{{ panel.latest }}</span>
          <span v-if="panel.unit" class="text-body-sm text-(--text-muted)">{{ panel.unit }}</span>
        </p>

        <svg viewBox="0 0 100 32" preserveAspectRatio="none" class="h-16 w-full text-(--primary)" aria-hidden="true">
          <polygon :points="panel.area" fill="currentColor" opacity="0.12" />
          <polyline
            :points="panel.points"
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
</div>`

const markupOf = (heading) =>
  page(`<main class="layout-column flex min-h-full flex-col">
${indent(pageHeading(heading))}

  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(FILTER_BUTTON, 3)}
${indent(FILTER_CHIPS, 3)}

${indent(STRIP, 3)}

${indent(PANELS, 3)}
    </section>
  </section>
</main>`)

const story = (heading, metrics, description) => {
  const markup = markupOf(heading)
  const body = bodyOf(metrics)
  return {
    render: () => ({
      components: componentsFor(markup),
      setup: () => runScript(body),
      template: markup
    }),
    parameters: {
      docs: {
        description: { story: description },
        source: { code: toSfc(scriptOf(markup, body), markup) }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Observe/RealTimeMetrics',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Real-Time Metrics page as the console renders it at /real-time-metrics: the medium page heading, the period Filter button over its applied chip, a strip of four KPI tiles whose labels open their hint in a Tooltip, and a two-column grid of metric panels, each the series’ latest value over an inline SVG sparkline labelled with the period. The Filter popover is the console’s list filter with one range field, Period (last hour, 24 hours, 7 days or 30 days); picking a period redraws every panel, and the period chip reopens the popover or removes it. The same page renders every per-product dashboard of the Real-Time Metrics menu (`?dashboard=` swaps the heading and description), and Edge Pulse at /edge-pulse with its real-user timings. The panel on its own is the MetricPanel template. Built from `Button`, `Badge`, `Popover`, `InputText`, `Avatar`, `CalendarRoot`, `IconButton`, `Chip`, `CardBox` and `Tooltip`; the sparkline is plain SVG.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  {
    title: 'Real-Time Metrics',
    description:
      'Traffic as the edge served it — requests, data transferred and errors, for the selected period.'
  },
  METRICS,
  'The last 24 hours of traffic: requests, data transferred, bandwidth saved and 5xx share in the strip, and their four series in the panels. Open Filter and pick another period to redraw the panels.'
)

export const ProductDashboard = story(
  {
    title: 'Functions',
    description: 'Invocations, errors and duration of your functions.'
  },
  METRICS,
  'A per-product dashboard from the Real-Time Metrics menu, here Functions: the heading and description come from the dashboard, the filter, strip and panels stay the same.'
)

export const EdgePulse = story(
  {
    title: 'Edge Pulse',
    description: 'Real-user timings collected in the browser, for the selected period.'
  },
  PULSE,
  'Edge Pulse renders the same page with the real-user timings collected in the browser: page load time, largest contentful paint, first input delay and sessions.'
)
