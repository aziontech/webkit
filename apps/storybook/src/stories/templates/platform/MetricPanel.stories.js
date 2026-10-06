import CardBox from '@aziontech/webkit/card-box'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../../_shared/story-source'

const WIDTH = 100
const HEIGHT = 32
const POINTS = 24

const seriesFor = (seed, min, max) => {
  let hash = 0x811c9dc5
  for (const char of seed) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return Array.from({ length: POINTS }, () => {
    hash ^= hash << 13
    hash ^= hash >>> 17
    hash ^= hash << 5
    hash >>>= 0
    return min + ((hash % 1000) / 1000) * (max - min)
  })
}

const sparkline = (series) => {
  const min = Math.min(...series)
  const max = Math.max(...series)
  const step = WIDTH / (series.length - 1)
  const points = series
    .map((value, index) => {
      const y = HEIGHT - ((value - min) / (max - min)) * HEIGHT
      return `${(index * step).toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return { points, area: `0,${HEIGHT} ${points} ${WIDTH},${HEIGHT}` }
}

const latestOf = (series) => {
  const value = series.at(-1)
  return value >= 100 ? Math.round(value).toLocaleString('en-US') : value.toFixed(2)
}

const panel = (title, unit, [min, max]) => {
  const series = seriesFor(`${title}:24h`, min, max)
  return { title, unit, value: latestOf(series), ...sparkline(series) }
}

const PANELS = [
  panel('Requests per second', 'req/s', [1200, 4800]),
  panel('Data transferred', 'MB/s', [40, 210]),
  panel('Cache hit ratio', '%', [78, 97]),
  panel('Status codes 5xx', '%', [0, 0.4])
]

const STRIP = [
  { label: 'Requests', value: '48.2', unit: 'M', hint: 'Requests handled at the edge.' },
  { label: 'Data Transferred', value: '6.4', unit: 'TB', hint: 'Bytes delivered to clients.' },
  { label: 'Bandwidth Saved', value: '71', unit: '%', hint: 'Served from cache, not your origin.' },
  { label: 'Status 5xx', value: '0.03', unit: '%', hint: 'Share of responses that failed.' }
]

const text = (value) => `'${value.replaceAll("'", "\\'")}'`

const objectLiteral = (item) => {
  const entries = Object.entries(item).map(([key, value]) => `${key}: ${text(value)}`)
  const inline = `  { ${entries.join(', ')} }`
  return inline.length <= 100
    ? inline
    : `  {\n${entries.map((entry) => `    ${entry}`).join(',\n')}\n  }`
}

const declare = (name, items) => `const ${name} = [\n${items.map(objectLiteral).join(',\n')}\n]`

const CARD_IMPORT = "import CardBox from '@aziontech/webkit/card-box'"
const TOOLTIP_IMPORT = "import Tooltip from '@aziontech/webkit/tooltip'"

const components = { CardBox, Tooltip }

const [requests] = PANELS

const PANEL_IMPORTS = [
  CARD_IMPORT,
  '',
  `const points = ${text(requests.points)}`,
  `const area = ${text(requests.area)}`
]

const panelBody = ({
  title,
  value,
  unit,
  points,
  area
}) => `<div class="flex min-w-0 flex-col gap-(--spacing-sm)">
  <div class="flex min-w-0 items-baseline justify-between gap-(--spacing-xs)">
    <h3 class="min-w-0 truncate text-label-md text-(--text-default)">${title}</h3>
    <span class="shrink-0 text-body-sm text-(--text-muted)">Last 24 hours</span>
  </div>
  <p class="flex items-baseline gap-(--spacing-xxs)">
    <span class="text-heading-md text-(--text-default)">${value}</span>
    <span class="text-body-sm text-(--text-muted)">${unit}</span>
  </p>
  <svg viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="none" class="h-16 w-full text-(--primary)" aria-hidden="true">
    <polygon :points="${area}" fill="currentColor" opacity="0.12" />
    <polyline
      :points="${points}"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</div>`

const indentBy = (markup, depth) =>
  markup
    .split('\n')
    .map((line) => (line ? `${'  '.repeat(depth)}${line}` : line))
    .join('\n')

const PANEL_TEMPLATE = `<div class="max-w-(--container-md)">
  <CardBox>
    <template #content>
${indentBy(panelBody({ title: requests.title, value: requests.value, unit: requests.unit, points: 'points', area: 'area' }), 3)}
    </template>
  </CardBox>
</div>`

const DASHBOARD_IMPORTS = [
  CARD_IMPORT,
  TOOLTIP_IMPORT,
  '',
  declare('strip', STRIP),
  '',
  declare('panels', PANELS)
]

const DASHBOARD_TEMPLATE = `<section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
  <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
    <li v-for="metric in strip" :key="metric.label" class="grid">
      <CardBox>
        <template #content>
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <Tooltip :text="metric.hint">
              <span class="min-w-0 truncate text-body-sm text-(--text-muted)">{{ metric.label }}</span>
            </Tooltip>
            <p class="flex items-baseline gap-(--spacing-xxs)">
              <span class="text-heading-lg text-(--text-default)">{{ metric.value }}</span>
              <span class="text-body-md text-(--text-muted)">{{ metric.unit }}</span>
            </p>
          </div>
        </template>
      </CardBox>
    </li>
  </ul>

  <div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2">
    <CardBox v-for="panel in panels" :key="panel.title">
      <template #content>
${indentBy(
  panelBody({
    title: '{{ panel.title }}',
    value: '{{ panel.value }}',
    unit: '{{ panel.unit }}',
    points: 'panel.points',
    area: 'panel.area'
  }),
  4
)}
      </template>
    </CardBox>
  </div>
</section>`

const meta = {
  title: 'Templates/Platform/Observe/MetricPanel',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A metric panel from the Observe dashboards: a CardBox with the metric’s name and its period on one line, the latest value set large beside its unit, and an inline SVG sparkline that fills the width and takes its stroke and fill from the primary token through currentColor. Real-Time Metrics and Edge Pulse render a KPI strip of four tiles above a two-column grid of these panels. Built from CardBox and Tooltip; the sparkline is plain SVG.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Panel = {
  render: () => ({
    components,
    setup: () => ({ points: requests.points, area: requests.area }),
    template: PANEL_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'One panel on its own: Requests per second over the last 24 hours, with the sparkline’s polyline and area points precomputed.'
      },
      source: { code: toSfc(PANEL_IMPORTS, PANEL_TEMPLATE) }
    }
  }
}

export const Dashboard = {
  render: () => ({
    components,
    setup: () => ({ strip: STRIP, panels: PANELS }),
    template: DASHBOARD_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Real-Time Metrics layout: four KPI tiles, each label wrapped in a Tooltip with its hint, over the four panels in a two-column grid.'
      },
      source: { code: toSfc(DASHBOARD_IMPORTS, DASHBOARD_TEMPLATE) }
    }
  }
}
