import Chart, {
  ChartArea,
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
import Dropdown, {
  DropdownGroup,
  DropdownOption,
  DropdownTrigger
} from '@aziontech/webkit/dropdown'
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

export const TRAFFIC_COMPONENTS = {
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
  'Chart.Area': ChartArea,
  'Chart.Bar': ChartBar,
  'Chart.Crosshair': ChartCrosshair,
  'Chart.Tooltip': ChartTooltip,
  'Chart.Legend': ChartLegend,
  ChartCard,
  'ChartCard.Header': ChartCardHeader,
  'ChartCard.Title': ChartCardTitle,
  'ChartCard.Controls': ChartCardControls,
  'ChartCard.Content': ChartCardContent,
  Dropdown,
  'Dropdown.Trigger': DropdownTrigger,
  'Dropdown.Group': DropdownGroup,
  'Dropdown.Option': DropdownOption,
  EmptyState,
  Hint,
  IconButton,
  InputText,
  SegmentedButton,
  StatTile,
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

const wave = (seed, base, spread) => {
  let state = seed
  return Array.from({ length: 12 }, (_, index) => {
    state = (state * 9301 + 49297) % 233280
    const noise = state / 233280 - 0.5
    const swing = Math.sin(seed + (index / 12) * Math.PI * 2)
    return Math.round(Math.max(0, base * (1 + spread * 0.6 * swing + spread * 0.6 * noise)))
  })
}

const LABELS = [
  '11:00',
  '13:00',
  '15:00',
  '17:00',
  '19:00',
  '21:00',
  '23:00',
  '01:00',
  '03:00',
  '05:00',
  '07:00',
  '09:00'
]

const FIGURES = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Sum of requests served by every workload in the period.',
    value: 48_920_000,
    format: 'count',
    delta: -1.83,
    inverse: false,
    trend: wave(3, 2_040_000, 0.3)
  },
  {
    id: 'data-transferred',
    label: 'Data transferred',
    description: 'Sum of data delivered to users by every workload in the period.',
    value: 222_000_000_000,
    format: 'bytes',
    delta: -13.26,
    inverse: false,
    trend: wave(5, 9_200_000_000, 0.3)
  },
  {
    id: 'cache-hit-ratio',
    label: 'Cache hit ratio',
    description: 'Share of requests answered from cache without reaching the origin.',
    value: 91,
    format: 'percentage',
    delta: 18.04,
    inverse: false,
    trend: wave(7, 91, 0.06)
  },
  {
    id: 'status-5xx',
    label: 'Status 5xx',
    description: 'Requests that ended in a server error. A rise is a regression.',
    value: 158_600,
    format: 'count',
    delta: -5.47,
    inverse: true,
    trend: wave(11, 6_600, 0.6)
  }
]

const REQUESTS = [{ id: 'requests', name: 'Requests', values: wave(13, 2_040_000, 0.3) }]

const STATUS_CODES = [
  { id: '2xx', name: 'Status 2xx', values: wave(17, 1_700_000, 0.3) },
  { id: '3xx', name: 'Status 3xx', values: wave(19, 240_000, 0.3) },
  { id: '4xx', name: 'Status 4xx', values: wave(23, 61_000, 0.45) },
  { id: '5xx', name: 'Status 5xx', values: wave(29, 6_600, 0.6) }
]

const COUNTRIES = ['Brazil', 'United States', 'Germany', 'India', 'Mexico', 'Argentina']

const COUNTRY_REQUESTS = [
  {
    id: 'requests',
    name: 'Requests by country',
    values: [1_048_210, 531_620, 118_930, 92_480, 69_870, 48_420]
  }
]

const HOSTS = [
  ['www.example.com', 'Storefront', 1_284_310],
  ['api.example.com', 'Checkout API', 712_480],
  ['shop.example.com', 'Storefront', 498_210],
  ['docs.example.com', 'Docs', 231_640],
  ['status.example.com', 'Status page', 96_120],
  ['cdn.example.com', 'Media', 61_870],
  ['blog.example.com', 'Docs', 28_940]
].map(([host, workload, requests]) => ({ id: host, host, workload, requests }))

const HOST_COLUMNS = [
  {
    id: 'host',
    accessorKey: 'host',
    header: 'Host',
    align: 'start',
    enableSorting: true,
    principal: true
  },
  {
    id: 'workload',
    accessorKey: 'workload',
    header: 'Workload',
    align: 'start',
    enableSorting: true
  },
  { id: 'requests', accessorKey: 'requests', header: 'Requests', align: 'end', enableSorting: true }
]

const VARIATIONS = {
  requests: { label: '+10.03%', severity: 'success', icon: 'pi pi-arrow-up-right' },
  statusCodes: { label: '+14.66%', severity: 'success', icon: 'pi pi-arrow-up-right' }
}

const FORMS = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' }
]

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const formatCount = (value) => compact.format(value)

const formatBytes = (value) => {
  const steps = ['B', 'KB', 'MB', 'GB', 'TB']
  let current = value
  let index = 0
  while (current >= 1000 && index < steps.length - 1) {
    current /= 1000
    index += 1
  }
  return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
}

const formatPercentage = (value) => `${value.toFixed(0)}%`

const FORMATTERS_SOURCE = `const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const formatters = {
  count: (value) => compact.format(value),
  bytes: (value) => {
    const steps = ['B', 'KB', 'MB', 'GB', 'TB']
    let current = value
    let index = 0
    while (current >= 1000 && index < steps.length - 1) {
      current /= 1000
      index += 1
    }
    return \`\${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} \${steps[index]}\`
  },
  percentage: (value) => \`\${value.toFixed(0)}%\`
}`

const STATES = {
  default: { loading: false, empty: false },
  loading: { loading: true, empty: false },
  empty: { loading: false, empty: true }
}

const dataFor = (state) => {
  const { loading, empty } = STATES[state]
  return {
    loading,
    figures: empty
      ? FIGURES.map((figure) => ({ ...figure, value: null, delta: null, trend: [] }))
      : FIGURES,
    labels: LABELS,
    requests: empty ? [] : REQUESTS,
    statusCodes: empty ? [] : STATUS_CODES,
    countries: empty ? [] : COUNTRIES,
    countryRequests: empty ? [] : COUNTRY_REQUESTS,
    hosts: empty ? [] : HOSTS,
    hostColumns: HOST_COLUMNS,
    variations: empty ? { requests: null, statusCodes: null } : VARIATIONS,
    forms: FORMS
  }
}

export const trafficSetup = (state) => () => ({
  ...dataFor(state),
  formatters: { count: formatCount, bytes: formatBytes, percentage: formatPercentage },
  comparison: 'vs previous 24 hours',
  requestsForm: ref('line'),
  statusForm: ref('line'),
  activeIndex: ref(null),
  search: ref('')
})

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const trafficScript = (state) => {
  const data = dataFor(state)
  return [
    ...IMPORTS,
    '',
    `const loading = ${data.loading}`,
    "const comparison = 'vs previous 24 hours'",
    '',
    literal('figures', data.figures),
    '',
    literal('labels', data.labels),
    '',
    literal('requests', data.requests),
    '',
    literal('statusCodes', data.statusCodes),
    '',
    literal('countries', data.countries),
    '',
    literal('countryRequests', data.countryRequests),
    '',
    literal('hosts', data.hosts),
    '',
    literal('hostColumns', data.hostColumns),
    '',
    literal('variations', data.variations),
    '',
    literal('forms', data.forms),
    '',
    FORMATTERS_SOURCE,
    '',
    "const requestsForm = ref('line')",
    "const statusForm = ref('line')",
    'const activeIndex = ref(null)',
    "const search = ref('')"
  ]
}

const cardControls = ({ title, wide, variation, form }) => `<ChartCard.Controls>
        <span${wide ? ' data-wide' : ''} class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex">
          <Tag label="Sum" severity="secondary" size="small" icon="pi pi-calculator" />${
            variation
              ? `
          <Tag
            v-if="${variation}"
            :label="${variation}.label"
            :severity="${variation}.severity"
            :icon="${variation}.icon"
            size="small"
          />`
              : ''
          }${
            form
              ? `
          <SegmentedButton v-model="${form}" :options="forms" size="small" aria-label="Chart form for ${title}" />`
              : ''
          }
        </span>
        <Tooltip text="Expand">
          <IconButton icon="pi pi-window-maximize" kind="transparent" size="small" aria-label="Expand ${title}" />
        </Tooltip>
        <Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="More options for ${title}" />
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option value="query" label="Copy query" />
            <Dropdown.Option value="export" label="Export CSV" />
          </Dropdown.Group>
        </Dropdown>
      </ChartCard.Controls>`

const cardHeader = (options) => `<ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
        <ChartCard.Title>${options.title}</ChartCard.Title>
        <Hint text="${options.description}" />
      </span>
      ${cardControls(options)}
    </ChartCard.Header>`

const EMPTY_COPY = `empty-title="No traffic yet"
        empty-description="Metrics appear here once a workload serves requests."`

export const TRAFFIC_TEMPLATE = `<div class="flex min-w-0 flex-col gap-(--spacing-md)">
  <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
    <li v-for="figure in figures" :key="figure.id" class="flex min-w-0 flex-col">
      <StatTile
        :label="figure.label"
        :value="figure.value"
        :format-value="formatters[figure.format]"
        :delta="figure.delta"
        :delta-label="comparison"
        :inverse="figure.inverse"
        :trend="figure.trend"
        :loading="loading"
      >
        <template #aside>
          <Hint :text="figure.description" />
        </template>
      </StatTile>
    </li>
  </ul>

  <div class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]">
    <ChartCard :span="12">
    ${cardHeader({
      title: 'Requests over time',
      description: 'Sum of requests served by every workload, per interval.',
      wide: true,
      variation: 'variations.requests',
      form: 'requestsForm'
    })}
    <ChartCard.Content>
      <Chart
        v-model:active-index="activeIndex"
        :series="requests"
        :labels="labels"
        :format-value="formatters.count"
        ${EMPTY_COPY}
        :loading="loading"
      >
        <Chart.Grid />
        <Chart.Axis kind="y" />
        <Chart.Axis kind="x" />
        <Chart.Bar v-if="requestsForm === 'bar'" />
        <Chart.Area v-else curve="monotone" />
        <Chart.Crosshair />
        <Chart.Tooltip />
        <Chart.Legend totals />
      </Chart>
    </ChartCard.Content>
    </ChartCard>

    <ChartCard :span="6">
    ${cardHeader({
      title: 'Status codes',
      description: 'Sum of requests per status class. Switch to Bar to stack the classes.',
      variation: 'variations.statusCodes',
      form: 'statusForm'
    })}
    <ChartCard.Content>
      <Chart
        v-model:active-index="activeIndex"
        :series="statusCodes"
        :labels="labels"
        :format-value="formatters.count"
        ${EMPTY_COPY}
        :loading="loading"
      >
        <Chart.Grid />
        <Chart.Axis kind="y" />
        <Chart.Axis kind="x" />
        <Chart.Bar v-if="statusForm === 'bar'" stacked />
        <Chart.Line v-else />
        <Chart.Crosshair />
        <Chart.Tooltip />
        <Chart.Legend totals />
      </Chart>
    </ChartCard.Content>
    </ChartCard>

    <ChartCard :span="6">
    ${cardHeader({
      title: 'Requests by country',
      description: 'Sum of requests per country of origin, top countries first.'
    })}
    <ChartCard.Content>
      <Chart
        :series="countryRequests"
        :labels="countries"
        orientation="horizontal"
        :format-value="formatters.count"
        :height="240"
        ${EMPTY_COPY}
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

    <ChartCard :span="12">
    ${cardHeader({
      title: 'Top hosts',
      description: 'Hosts that served the most requests in the period, with their workload.',
      wide: true
    })}
    <ChartCard.Content>
      <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
          <div class="min-w-36 grow basis-(--container-3xs)">
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search hosts or workloads"
              aria-label="Search hosts or workloads"
            >
              <template #iconLeft>
                <i class="pi pi-search" aria-hidden="true" />
              </template>
            </InputText>
          </div>
        </div>

        <TableRoot
          v-model:global-filter="search"
          :data="hosts"
          :columns="hostColumns"
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
              v-if="!hosts.length"
              size="small"
              icon="pi pi-chart-line"
              title="No traffic yet"
              description="Metrics appear here once a workload serves requests."
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
            <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
          </template>
        </TableRoot>
      </div>
    </ChartCard.Content>
    </ChartCard>
  </div>
</div>`
