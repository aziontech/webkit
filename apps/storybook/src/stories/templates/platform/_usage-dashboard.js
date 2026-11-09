import Chart, {
  ChartAxis,
  ChartBar,
  ChartCrosshair,
  ChartGrid,
  ChartLegend,
  ChartLine,
  ChartTooltip
} from '@aziontech/webkit/chart'
import ChartCard, {
  ChartCardContent,
  ChartCardControls,
  ChartCardHeader,
  ChartCardTitle
} from '@aziontech/webkit/chart-card'
import Dropdown from '@aziontech/webkit/dropdown'
import EmptyState from '@aziontech/webkit/empty-state'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import StatTile from '@aziontech/webkit/stat-tile'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

export const components = {
  StatTile,
  Hint,
  ChartCard,
  'ChartCard.Header': ChartCardHeader,
  'ChartCard.Title': ChartCardTitle,
  'ChartCard.Controls': ChartCardControls,
  'ChartCard.Content': ChartCardContent,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
  'Chart.Bar': ChartBar,
  'Chart.Crosshair': ChartCrosshair,
  'Chart.Tooltip': ChartTooltip,
  'Chart.Legend': ChartLegend,
  Dropdown,
  'Dropdown.Trigger': Dropdown.Trigger,
  'Dropdown.Group': Dropdown.Group,
  'Dropdown.Option': Dropdown.Option,
  EmptyState,
  IconButton,
  InputText,
  SegmentedButton,
  TableRoot,
  Tag,
  Tooltip
}

const IMPORTS = [
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import Dropdown from '@aziontech/webkit/dropdown'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { ref } from 'vue'"
]

const FORMATTERS = [
  "const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })",
  '',
  'const formatCount = (value) => compact.format(value)',
  '',
  'const formatBytes = (value) => {',
  "  const steps = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']",
  '  let current = value',
  '  let index = 0',
  '  while (current >= 1000 && index < steps.length - 1) {',
  '    current /= 1000',
  '    index += 1',
  '  }',
  '  return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`',
  '}'
]

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const formatCount = (value) => compact.format(value)

const formatBytes = (value) => {
  const steps = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let current = value
  let index = 0
  while (current >= 1000 && index < steps.length - 1) {
    current /= 1000
    index += 1
  }
  return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
}

const POINTS = 24

const seeded = (seed) => {
  let hash = 0x811c9dc5
  for (const char of seed) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return () => {
    hash ^= hash << 13
    hash ^= hash >>> 17
    hash ^= hash << 5
    hash >>>= 0
    return (hash % 10_000) / 10_000
  }
}

const wave = (seed, base, spread = 0.3) => {
  const next = seeded(seed)
  const phase = next() * Math.PI * 2
  return Array.from({ length: POINTS }, (_, index) => {
    const swing = Math.sin(phase + (index / POINTS) * Math.PI * 2)
    const noise = (next() - 0.5) * spread * 0.6
    return Math.round(Math.max(0, base * (1 + spread * 0.6 * swing + noise)))
  })
}

const sum = (values) => values.reduce((total, value) => total + value, 0)

const LABELS = Array.from({ length: POINTS }, (_, index) => `${String(index).padStart(2, '0')}:00`)

const CURRENT = wave('usage:current', 3.4e10)
const PREVIOUS = wave('usage:previous', 3.1e10)

const COMPARISON_DELTA = Math.round(((sum(CURRENT) - sum(PREVIOUS)) / sum(PREVIOUS)) * 10_000) / 100

const FIGURES = [
  [
    'requests',
    'Requests',
    'Requests served by every workload in the period.',
    'count',
    2.04e6,
    -1.83
  ],
  [
    'data-transferred',
    'Data transferred',
    'Data delivered to clients, in and out, by every workload in the period.',
    'bytes',
    null,
    COMPARISON_DELTA
  ],
  [
    'function-invocations',
    'Function invocations',
    'Times a function ran on a request in the period.',
    'count',
    6.1e5,
    18.58
  ],
  [
    'images-processed',
    'Images processed',
    'Images resized, cropped or converted by Image Processor in the period.',
    'count',
    8.4e4,
    16.72
  ],
  [
    'waf-requests',
    'WAF requests',
    'Requests inspected by a firewall with WAF rules in the period.',
    'count',
    1.3e6,
    2.78
  ],
  [
    'data-streamed',
    'Data streamed',
    'Log data sent to your Data Stream connectors in the period.',
    'bytes',
    2.6e9,
    -7.73
  ]
].map(([id, label, description, unit, base, delta]) => {
  const trend = base === null ? CURRENT : wave(`usage:${id}`, base)
  return { id, label, description, unit, value: sum(trend), delta, trend }
})

const WORKLOADS = [
  ['azion-com-prod', 3.4e11, 18_420_000],
  ['azion-com-br-prod', 1.9e11, 11_730_000],
  ['storefront-checkout', 1.2e11, 7_910_000],
  ['marketing-site', 7.6e10, 4_380_000],
  ['payments-api', 4.1e10, 6_240_000],
  ['campaign-landing', 2.3e10, 1_570_000],
  ['status-page', 9.8e9, 860_000],
  ['azion-stage-preview', 3.2e9, 210_000]
]

const COLUMNS = [
  {
    id: 'workload',
    accessorKey: 'workload',
    header: 'Workload',
    align: 'start',
    enableSorting: true,
    principal: true
  },
  {
    id: 'requests',
    accessorKey: 'requests',
    header: 'Requests',
    align: 'end',
    enableSorting: true,
    principal: false
  },
  {
    id: 'dataTransferred',
    accessorKey: 'dataTransferred',
    header: 'Data transferred',
    align: 'end',
    enableSorting: true,
    principal: false
  }
]

const DATA = {
  default: {
    loading: false,
    figures: FIGURES,
    comparison: {
      delta: COMPARISON_DELTA,
      labels: LABELS,
      series: [
        { id: 'current', name: 'This period', values: CURRENT },
        { id: 'previous', name: 'Previous period', values: PREVIOUS }
      ]
    },
    ranking: {
      labels: WORKLOADS.map(([name]) => name),
      series: [
        {
          id: 'requests',
          name: 'Data transferred by workload',
          values: WORKLOADS.map(([, bytes]) => bytes)
        }
      ]
    },
    rows: WORKLOADS.map(([workload, bytes, requests]) => ({
      id: workload,
      workload,
      requests,
      dataTransferred: formatBytes(bytes)
    }))
  }
}

DATA.loading = { ...DATA.default, loading: true }

DATA.empty = {
  loading: false,
  figures: FIGURES.map((figure) => ({ ...figure, value: null, delta: null, trend: [] })),
  comparison: { delta: null, labels: LABELS, series: [] },
  ranking: { labels: [], series: [] },
  rows: []
}

const literal = (value, depth = 0) => {
  const pad = '  '.repeat(depth + 1)
  const end = '  '.repeat(depth)
  if (value === null) return 'null'
  if (typeof value === 'string') return `'${value.replaceAll("'", "\\'")}'`
  if (typeof value !== 'object') return String(value)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    const inline = `[${value.map((item) => literal(item, depth)).join(', ')}]`
    if (value.every((item) => typeof item !== 'object' || item === null) && inline.length <= 90) {
      return inline
    }
    if (value.every((item) => typeof item === 'number')) {
      const rows = []
      for (let index = 0; index < value.length; index += 6) {
        rows.push(`${pad}${value.slice(index, index + 6).join(', ')}`)
      }
      return `[\n${rows.join(',\n')}\n${end}]`
    }
    return `[\n${value.map((item) => `${pad}${literal(item, depth + 1)}`).join(',\n')}\n${end}]`
  }
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item, depth + 1)}`)
  const inline = `{ ${entries.join(', ')} }`
  if (inline.length <= 90 && !inline.includes('\n')) return inline
  return `{\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${end}}`
}

export const scriptFor = (state) => {
  const data = DATA[state]
  return [
    ...IMPORTS,
    '',
    ...FORMATTERS,
    '',
    `const loading = ${data.loading}`,
    '',
    `const figures = ${literal(data.figures)}`,
    '',
    `const comparison = ${literal(data.comparison)}`,
    '',
    `const ranking = ${literal(data.ranking)}`,
    '',
    `const columns = ${literal(COLUMNS)}`,
    '',
    `const rows = ${literal(data.rows)}`,
    '',
    "const form = ref('line')",
    'const activeIndex = ref(null)',
    "const search = ref('')",
    '',
    "const FORMS = [\n  { label: 'Line', value: 'line' },\n  { label: 'Bar', value: 'bar' }\n]"
  ]
}

export const setupFor = (state) => () => ({
  ...DATA[state],
  columns: COLUMNS,
  formatCount,
  formatBytes,
  form: ref('line'),
  activeIndex: ref(null),
  search: ref(''),
  FORMS: [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]
})

const controls = (
  label,
  { wide = false, delta = false, forms = false } = {}
) => `<ChartCard.Controls>
        <span${wide ? ' data-wide' : ''}
          class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
        >
          <Tag label="Sum" severity="secondary" size="small" icon="pi pi-calculator" />${
            delta
              ? `
          <Tag
            v-if="comparison.delta !== null"
            :label="(comparison.delta > 0 ? '+' : '') + comparison.delta.toFixed(2) + '%'"
            :severity="comparison.delta > 0 ? 'success' : 'danger'"
            :icon="comparison.delta > 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-left'"
            size="small"
          />`
              : ''
          }${
            forms
              ? `
          <SegmentedButton
            v-model="form"
            :options="FORMS"
            size="small"
            aria-label="Chart form for ${label}"
          />`
              : ''
          }
        </span>
        <Tooltip text="Expand">
          <IconButton
            icon="pi pi-window-maximize"
            kind="transparent"
            size="small"
            aria-label="Expand ${label}"
          />
        </Tooltip>
        <Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <IconButton
              icon="pi pi-ellipsis-h"
              kind="transparent"
              size="small"
              aria-label="More options for ${label}"
            />
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option value="query" label="Copy query" />
            <Dropdown.Option value="export" label="Export CSV" />
          </Dropdown.Group>
        </Dropdown>
      </ChartCard.Controls>`

const header = (label, description, options) => `<ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
        <ChartCard.Title>${label}</ChartCard.Title>
        <Hint text="${description}" />
      </span>
      ${controls(label, options)}
    </ChartCard.Header>`

export const TEMPLATE = `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
  <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-3">
    <li v-for="figure in figures" :key="figure.id" class="flex min-w-0 flex-col">
      <StatTile
        :label="figure.label"
        :value="figure.value"
        :format-value="figure.unit === 'bytes' ? formatBytes : formatCount"
        :delta="figure.delta"
        delta-label="vs previous 24 hours"
        :trend="figure.trend"
        :loading="loading"
      >
        <template #aside>
          <Hint :text="figure.description" />
        </template>
      </StatTile>
    </li>
  </ul>

  <div
    class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
  >
    <ChartCard :span="12">
      ${header(
        'Data transferred, this period vs previous',
        'Data delivered by every workload in the selected period, drawn over the same span of the previous period.',
        { wide: true, delta: true, forms: true }
      )}
      <ChartCard.Content>
        <Chart
          v-model:active-index="activeIndex"
          :series="comparison.series"
          :labels="comparison.labels"
          :format-value="formatBytes"
          empty-title="No usage yet"
          empty-description="Usage appears here once a workload serves requests."
          :loading="loading"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Bar v-if="form === 'bar'" stacked />
          <Chart.Line v-else />
          <Chart.Crosshair />
          <Chart.Tooltip />
          <Chart.Legend totals />
        </Chart>
      </ChartCard.Content>
    </ChartCard>

    <ChartCard :span="6">
      ${header(
        'Data transferred by workload',
        'The workloads that delivered the most data in the period.'
      )}
      <ChartCard.Content>
        <Chart
          :series="ranking.series"
          :labels="ranking.labels"
          orientation="horizontal"
          :format-value="formatBytes"
          :height="256"
          empty-title="No usage yet"
          empty-description="Usage appears here once a workload serves requests."
          :loading="loading"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Bar labeled />
          <Chart.Tooltip />
        </Chart>
      </ChartCard.Content>
    </ChartCard>

    <ChartCard :span="6">
      ${header('Usage by workload', 'Requests and data transferred per workload in the period.')}
      <ChartCard.Content>
        <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
            <div class="min-w-36 grow basis-(--container-3xs)">
              <InputText
                v-model="search"
                size="medium"
                placeholder="Search workloads"
                aria-label="Search workloads"
              >
                <template #iconLeft>
                  <i class="pi pi-search" aria-hidden="true" />
                </template>
              </InputText>
            </div>
          </div>

          <TableRoot
            v-model:global-filter="search"
            :data="rows"
            :columns="columns"
            row-key="id"
            enable-sorting
            paginated
            :page-size="5"
            :rows-per-page-options="[5, 10, 25]"
            header-kind="compact"
            border
            :loading="loading"
          >
            <template #empty>
              <EmptyState
                v-if="!rows.length"
                size="small"
                icon="pi pi-chart-line"
                title="No usage yet"
                description="Usage appears here once a workload serves requests."
              />
              <EmptyState
                v-else
                size="small"
                icon="pi pi-search"
                title="No matching rows"
                description="Change the search."
              />
            </template>

            <template #cell-requests="{ row }">
              <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
            </template>
          </TableRoot>
        </div>
      </ChartCard.Content>
    </ChartCard>
  </div>
</div>`
