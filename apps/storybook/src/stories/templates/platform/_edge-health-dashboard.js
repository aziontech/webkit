import Chart from '@aziontech/webkit/chart'
import ChartCard from '@aziontech/webkit/chart-card'
import EmptyState from '@aziontech/webkit/empty-state'
import Hint from '@aziontech/webkit/hint'
import Item from '@aziontech/webkit/item'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Skeleton from '@aziontech/webkit/skeleton'
import StatTile from '@aziontech/webkit/stat-tile'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import Tag from '@aziontech/webkit/tag'

export const components = {
  Chart,
  'Chart.Grid': Chart.Grid,
  'Chart.Axis': Chart.Axis,
  'Chart.Line': Chart.Line,
  'Chart.Crosshair': Chart.Crosshair,
  'Chart.Tooltip': Chart.Tooltip,
  'Chart.Legend': Chart.Legend,
  ChartCard,
  'ChartCard.Header': ChartCard.Header,
  'ChartCard.Title': ChartCard.Title,
  'ChartCard.Controls': ChartCard.Controls,
  'ChartCard.Content': ChartCard.Content,
  EmptyState,
  Hint,
  Item,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  SegmentedButton,
  Skeleton,
  StatTile,
  StatusIndicator,
  Tag
}

const IMPORTS = [
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Item from '@aziontech/webkit/item'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import StatusIndicator from '@aziontech/webkit/status-indicator'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { ref } from 'vue'"
]

const WINDOWS = [
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '24h', value: '24h' }
]

const WINDOW_CLOCK = {
  '1h': { points: 12, step: 5, end: 11 * 60 },
  '6h': { points: 24, step: 15, end: 11 * 60 },
  '24h': { points: 24, step: 60, end: 11 * 60 }
}

const STATES = {
  operational: { label: 'Operational', severity: 'success' },
  degraded: { label: 'Degraded', severity: 'warning' },
  down: { label: 'Down', severity: 'danger' }
}

const WORKLOADS = [
  { id: 'azion-com-prod', state: 'operational', latency: 142 },
  { id: 'azion-com-br-prod', state: 'degraded', latency: 860 },
  { id: 'azion-stage-preview', state: 'down', latency: 2310 },
  { id: 'campaign-landing', state: 'operational', latency: 98 },
  { id: 'docs-azion', state: 'operational', latency: 121 },
  { id: 'workload_01', state: 'operational', latency: 176 }
]

const ALERTS = [
  {
    id: 'stage-5xx',
    severity: 'danger',
    level: 'Critical',
    title: 'Status 5xx above 5%',
    workload: 'azion-stage-preview',
    opened: '12 minutes ago'
  },
  {
    id: 'br-latency',
    severity: 'warning',
    level: 'Warning',
    title: 'p95 latency above 800 ms',
    workload: 'azion-com-br-prod',
    opened: '34 minutes ago'
  },
  {
    id: 'br-origin',
    severity: 'warning',
    level: 'Warning',
    title: 'Origin timeouts rising',
    workload: 'azion-com-br-prod',
    opened: '1 hour ago'
  },
  {
    id: 'docs-cache',
    severity: 'info',
    level: 'Info',
    title: 'Cache hit ratio below 80%',
    workload: 'docs-azion',
    opened: '3 hours ago'
  }
]

const hash = (seed) => {
  let h = 0x811c9dc5
  for (const char of seed) {
    h ^= char.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h || 1
}

const random = (seed) => {
  let h = hash(seed)
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return (h % 10_000) / 10_000
  }
}

const wave = (seed, points, base, spread) => {
  const next = random(seed)
  const phase = next() * Math.PI * 2
  return Array.from({ length: points }, (_, index) => {
    const swing = Math.sin(phase + (index / points) * Math.PI * 2)
    const noise = (next() - 0.5) * spread
    return Math.round(Math.max(0, base * (1 + spread * 0.5 * swing + noise)) * 100) / 100
  })
}

const deltaOf = (seed) => Math.round((random(`delta:${seed}`)() - 0.45) * 3600) / 100

const clock = (minutes) => {
  const wrapped = ((minutes % 1440) + 1440) % 1440
  const hours = String(Math.floor(wrapped / 60)).padStart(2, '0')
  const rest = String(wrapped % 60).padStart(2, '0')
  return `${hours}:${rest}`
}

const labelsFor = (window) => {
  const { points, step, end } = WINDOW_CLOCK[window]
  return Array.from({ length: points }, (_, index) => clock(end - (points - 1 - index) * step))
}

const LATENCY_SERIES = [
  { id: 'p50', name: 'p50', base: 120 },
  { id: 'p95', name: 'p95', base: 410 },
  { id: 'p99', name: 'p99', base: 920 }
]

const ERROR_SERIES = [
  { id: '4xx', name: 'Status 4xx', color: 'warning', base: 2.4 },
  { id: '5xx', name: 'Status 5xx', color: 'danger', base: 0.6 }
]

const byWindow = (prefix, definitions, empty) =>
  Object.fromEntries(
    WINDOWS.map(({ value }) => {
      const labels = labelsFor(value)
      const series = empty
        ? []
        : definitions.map(({ base, ...entry }) => ({
            ...entry,
            values: wave(
              `${prefix}:${entry.id}:${value}`,
              labels.length,
              base,
              prefix === 'errors' ? 0.5 : 0.35
            )
          }))
      return [value, { labels, series }]
    })
  )

const workloadsFor = (empty) =>
  WORKLOADS.map(({ id, state, latency }) => ({
    id,
    name: id,
    status: STATES[state],
    latency: empty ? null : latency,
    delta: empty ? null : deltaOf(`${id}:24h`),
    trend: empty ? [] : wave(`${id}:24h`, 24, latency, 0.3)
  }))

export const dashboardState = ({ loading = false, empty = false } = {}) => ({
  loading,
  empty,
  windows: WINDOWS,
  workloads: workloadsFor(empty),
  latency: byWindow('latency', LATENCY_SERIES, empty),
  errorRate: byWindow('errors', ERROR_SERIES, empty),
  alerts: empty ? [] : ALERTS
})

const pad = (depth) => '  '.repeat(depth)

const isFlat = (value) => value.every((entry) => typeof entry !== 'object' || entry === null)

const js = (value, depth = 0) => {
  if (value === null) return 'null'
  if (typeof value === 'string') return `'${value.replaceAll("'", "\\'")}'`
  if (typeof value !== 'object') return String(value)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    if (isFlat(value)) return `[${value.map((entry) => js(entry)).join(', ')}]`
    return `[\n${value.map((entry) => `${pad(depth + 1)}${js(entry, depth + 1)}`).join(',\n')}\n${pad(depth)}]`
  }
  const entries = Object.entries(value).map(([key, entry]) => {
    const name = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `'${key}'`
    return `${name}: ${js(entry, depth + 1)}`
  })
  const inline = `{ ${entries.join(', ')} }`
  if (!inline.includes('\n') && pad(depth).length + inline.length <= 100) return inline
  return `{\n${entries.map((entry) => `${pad(depth + 1)}${entry}`).join(',\n')}\n${pad(depth)}}`
}

export const dashboardScript = (state) => [
  ...IMPORTS,
  '',
  `const loading = ${state.loading}`,
  `const empty = ${state.empty}`,
  '',
  "const latencyWindow = ref('24h')",
  "const errorWindow = ref('24h')",
  '',
  'const formatLatency = (value) => `${Math.round(value)} ms`',
  'const formatRate = (value) => {',
  '  const digits = value === 0 || value >= 10 ? 0 : value >= 1 ? 1 : 2',
  '  return `${value.toFixed(digits)}%`',
  '}',
  '',
  `const windows = ${js(state.windows)}`,
  '',
  `const workloads = ${js(state.workloads)}`,
  '',
  `const latency = ${js(state.latency)}`,
  '',
  `const errorRate = ${js(state.errorRate)}`,
  '',
  `const alerts = ${js(state.alerts)}`
]

export const formatLatency = (value) => `${Math.round(value)} ms`

export const formatRate = (value) => {
  const digits = value === 0 || value >= 10 ? 0 : value >= 1 ? 1 : 2
  return `${value.toFixed(digits)}%`
}

export const DASHBOARD_TEMPLATE = `<div class="flex min-w-0 flex-col gap-(--spacing-md)">
  <ul class="grid grid-cols-1 gap-(--spacing-md) lg:grid-cols-2 2xl:grid-cols-3">
    <li v-for="workload in workloads" :key="workload.id" class="flex min-w-0 flex-col">
      <StatTile
        :label="workload.name"
        :value="workload.latency"
        :format-value="formatLatency"
        :delta="workload.delta"
        delta-label="p95 latency vs previous 24 hours"
        inverse
        :trend="workload.trend"
        :loading="loading"
      >
        <template #aside>
          <StatusIndicator
            v-if="!loading && !empty"
            :severity="workload.status.severity"
            :label="workload.status.label"
          />
        </template>
      </StatTile>
    </li>
  </ul>

  <div class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] xl:grid-cols-12 xl:[--chart-grid-columns:12]">
    <div class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] xl:col-span-8">
      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Latency</ChartCard.Title>
            <Hint text="Time to the first byte at the edge, by percentile, across every workload." />
          </span>
          <ChartCard.Controls>
            <SegmentedButton v-model="latencyWindow" :options="windows" size="small" aria-label="Window for Latency" />
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            :series="latency[latencyWindow].series"
            :labels="latency[latencyWindow].labels"
            :format-value="formatLatency"
            empty-title="No traffic yet"
            empty-description="Latency appears here once a workload serves requests."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Line />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend />
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Error rate</ChartCard.Title>
            <Hint text="Share of responses with a 4xx or 5xx status, across every workload." />
          </span>
          <ChartCard.Controls>
            <SegmentedButton v-model="errorWindow" :options="windows" size="small" aria-label="Window for Error rate" />
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            :series="errorRate[errorWindow].series"
            :labels="errorRate[errorWindow].labels"
            :format-value="formatRate"
            empty-title="No traffic yet"
            empty-description="Error rates appear here once a workload serves requests."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Line />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend />
          </Chart>
        </ChartCard.Content>
      </ChartCard>
    </div>

    <ChartCard :span="4">
      <ChartCard.Header>
        <ChartCard.Title>Open alerts</ChartCard.Title>
        <ChartCard.Controls v-if="!loading && alerts.length">
          <Tag :label="String(alerts.length)" severity="secondary" size="small" />
        </ChartCard.Controls>
      </ChartCard.Header>
      <ChartCard.Content :flush="!loading && alerts.length > 0">
        <div v-if="loading" class="flex flex-col gap-(--spacing-sm)">
          <Skeleton v-for="row in 4" :key="row" width="100%" height="3rem" />
        </div>
        <ul v-else-if="alerts.length" class="m-0 flex list-none flex-col p-0">
          <li v-for="alert in alerts" :key="alert.id" class="border-b border-(--border-muted) last:border-b-0">
            <Item size="small">
              <Item.Content>
                <Item.Title>{{ alert.title }}</Item.Title>
                <Item.Description>{{ alert.workload }}</Item.Description>
                <Item.Description>Opened {{ alert.opened }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Tag :label="alert.level" :severity="alert.severity" size="small" />
              </Item.Actions>
            </Item>
          </li>
        </ul>
        <EmptyState
          v-else
          size="small"
          icon="pi pi-check-circle"
          title="No open alerts"
          description="Alerts appear here when a workload crosses a threshold."
        />
      </ChartCard.Content>
    </ChartCard>
  </div>
</div>`
