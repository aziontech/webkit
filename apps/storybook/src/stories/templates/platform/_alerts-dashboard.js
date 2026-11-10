import BarList from '@aziontech/webkit/bar-list'
import CardBox from '@aziontech/webkit/card-box'
import Chart, {
  ChartAxis,
  ChartBar,
  ChartCrosshair,
  ChartGrid,
  ChartLegend,
  ChartTooltip
} from '@aziontech/webkit/chart'
import ChartCard, {
  ChartCardContent,
  ChartCardControls,
  ChartCardHeader,
  ChartCardTitle
} from '@aziontech/webkit/chart-card'
import EmptyState from '@aziontech/webkit/empty-state'
import Hint from '@aziontech/webkit/hint'
import Select from '@aziontech/webkit/select'
import SeverityTag from '@aziontech/webkit/severity-tag'
import Skeleton from '@aziontech/webkit/skeleton'
import StatTile from '@aziontech/webkit/stat-tile'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

export const ALERTS_COMPONENTS = {
  BarList,
  CardBox,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Bar': ChartBar,
  'Chart.Crosshair': ChartCrosshair,
  'Chart.Tooltip': ChartTooltip,
  'Chart.Legend': ChartLegend,
  ChartCard,
  'ChartCard.Header': ChartCardHeader,
  'ChartCard.Title': ChartCardTitle,
  'ChartCard.Controls': ChartCardControls,
  'ChartCard.Content': ChartCardContent,
  EmptyState,
  Hint,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  SeverityTag,
  Skeleton,
  StatTile,
  TableRoot,
  Tag
}

const IMPORTS = [
  "import BarList from '@aziontech/webkit/bar-list'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Select from '@aziontech/webkit/select'",
  "import SeverityTag from '@aziontech/webkit/severity-tag'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { ref } from 'vue'"
]

const LEVELS = [
  { id: 'critical', name: 'Critical', base: 1.2, rank: 5 },
  { id: 'high', name: 'High', base: 3.4, rank: 4 },
  { id: 'medium', name: 'Medium', base: 7.5, rank: 3 },
  { id: 'low', name: 'Low', base: 11, rank: 2 },
  { id: 'info', name: 'Info', base: 14, rank: 1 }
]

const RANK = Object.fromEntries(LEVELS.map((level) => [level.id, level.rank]))

const PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' }
]

const DAY_MS = 86_400_000
const LAST_DAY = Date.UTC(2026, 10, 10)
const DAYS = 30

const DATE_LABEL = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC'
})

const LABELS = Array.from({ length: DAYS }, (_, index) =>
  DATE_LABEL.format(new Date(LAST_DAY - (DAYS - 1 - index) * DAY_MS))
)

const dailyCount = (level, index) => {
  const wave = Math.sin(index * 0.7 + level.rank) * 0.35 + Math.cos(index * 0.23) * 0.25
  const surge = index >= 21 && index <= 23 ? 1.8 : 1
  return Math.max(0, Math.round(level.base * (1 + wave) * surge))
}

const SERIES = LEVELS.map((level) => ({
  id: level.id,
  name: level.name,
  color: `severity-${level.id}`,
  values: LABELS.map((_, index) => dailyCount(level, index))
}))

const OPEN_BY_LEVEL = [
  { id: 'critical', count: 3 },
  { id: 'high', count: 6 },
  { id: 'medium', count: 14 },
  { id: 'low', count: 11 },
  { id: 'info', count: 8 }
]

const FIGURES = [
  {
    id: 'open',
    label: 'Open',
    description: 'Alerts nobody has closed yet, at any severity.',
    value: 42,
    delta: 10.5,
    inverse: true,
    format: 'count'
  },
  {
    id: 'critical-high',
    label: 'Critical or high open',
    description: 'Open alerts at the two highest severity levels.',
    value: 9,
    delta: 28.6,
    inverse: true,
    format: 'count'
  },
  {
    id: 'raised',
    label: 'Alerts in the period',
    description: 'Every alert raised in the period, open or closed.',
    value: SERIES.reduce((total, series) => total + series.values.reduce((a, b) => a + b, 0), 0),
    delta: 4.2,
    inverse: true,
    format: 'count'
  },
  {
    id: 'false-positives',
    label: 'False positives',
    description: 'Share of the alerts closed in the period that were marked as false positives.',
    value: 6,
    delta: -14.3,
    inverse: true,
    format: 'percentage'
  }
]

const TYPES = [
  { id: 'unusual-location', name: 'Sign-in from an unusual location', value: 214 },
  { id: 'failed-sign-ins', name: 'Repeated failed sign-ins', value: 188 },
  { id: 'new-device', name: 'Sign-in from a new device', value: 141 },
  { id: 'off-hours', name: 'Access outside working hours', value: 97 },
  { id: 'mass-download', name: 'Mass download', value: 63 },
  { id: 'new-destination', name: 'Data sent to a new destination', value: 41 },
  { id: 'privilege-change', name: 'Privilege change', value: 22 },
  { id: 'impossible-travel', name: 'Impossible travel', value: 9 }
]

const ENTITIES = [
  ['ana.ribeiro', 'User', 92, 'critical', 4],
  ['build-runner-07', 'Service account', 84, 'high', 3],
  ['laptop-0418', 'Device', 77, 'high', 2],
  ['mark.chen', 'User', 63, 'medium', 3],
  ['reporting-api', 'Service account', 58, 'medium', 1],
  ['lucia.alves', 'User', 41, 'low', 2]
].map(([name, type, score, level, alerts], index) => ({
  id: `entity-${String(index + 1).padStart(2, '0')}`,
  name,
  type,
  score,
  level,
  alerts
}))

const ENTITY_COLUMNS = [
  { id: 'name', accessorKey: 'name', header: 'Entity', align: 'start', principal: true, grow: 2 },
  { id: 'type', accessorKey: 'type', header: 'Type', align: 'start', minWidth: 136 },
  {
    id: 'score',
    accessorKey: 'score',
    header: 'Risk score',
    align: 'start',
    enableSorting: true,
    minWidth: 160
  },
  {
    id: 'alerts',
    accessorKey: 'alerts',
    header: 'Open alerts',
    align: 'end',
    enableSorting: true,
    minWidth: 104
  }
]

const ALERTS = [
  ['critical', 'Data sent to a new destination', 'ana.ribeiro', 'Nov 10, 09:42', 'Open'],
  ['critical', 'Impossible travel', 'ana.ribeiro', 'Nov 10, 07:15', 'Investigating'],
  ['critical', 'Privilege change', 'build-runner-07', 'Nov 9, 22:08', 'Open'],
  ['high', 'Mass download', 'laptop-0418', 'Nov 9, 18:31', 'Investigating'],
  ['high', 'Repeated failed sign-ins', 'build-runner-07', 'Nov 9, 16:02', 'Open'],
  ['high', 'Sign-in from a new device', 'mark.chen', 'Nov 9, 11:47', 'Open'],
  ['medium', 'Access outside working hours', 'reporting-api', 'Nov 9, 03:20', 'Open'],
  ['medium', 'Sign-in from an unusual location', 'mark.chen', 'Nov 8, 21:55', 'Open'],
  ['medium', 'Repeated failed sign-ins', 'lucia.alves', 'Nov 8, 14:09', 'Investigating'],
  ['low', 'Sign-in from a new device', 'lucia.alves', 'Nov 8, 09:36', 'Open'],
  ['low', 'Access outside working hours', 'laptop-0418', 'Nov 7, 23:12', 'Open'],
  ['info', 'Sign-in from an unusual location', 'mark.chen', 'Nov 7, 10:48', 'Open']
].map(([level, title, entity, opened, status], index) => ({
  id: `alert-${String(index + 1).padStart(2, '0')}`,
  level,
  rank: RANK[level],
  title,
  entity,
  opened,
  status
}))

const ALERT_COLUMNS = [
  {
    id: 'severity',
    accessorKey: 'rank',
    header: 'Severity',
    align: 'start',
    enableSorting: true,
    minWidth: 120
  },
  { id: 'title', accessorKey: 'title', header: 'Alert', align: 'start', principal: true, grow: 2 },
  { id: 'entity', accessorKey: 'entity', header: 'Entity', align: 'start', minWidth: 160 },
  { id: 'opened', accessorKey: 'opened', header: 'Opened', align: 'start', minWidth: 136 },
  { id: 'status', accessorKey: 'status', header: 'Status', align: 'start', minWidth: 128 }
]

const STATUS_SEVERITY = { Open: 'secondary', Investigating: 'info' }

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export const formatters = {
  count: (value) => compact.format(value),
  percentage: (value) => `${value.toFixed(0)}%`
}

const FORMATTERS_SOURCE = `const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const formatters = {
  count: (value) => compact.format(value),
  percentage: (value) => \`\${value.toFixed(0)}%\`
}`

const STATES = {
  default: { loading: false, empty: false },
  loading: { loading: true, empty: false },
  empty: { loading: false, empty: true }
}

const dataFor = (state) => {
  const { loading, empty } = STATES[state]
  const openTotal = OPEN_BY_LEVEL.reduce((total, level) => total + level.count, 0)
  return {
    loading,
    periods: PERIODS,
    figures: empty ? FIGURES.map((figure) => ({ ...figure, value: null, delta: null })) : FIGURES,
    labels: LABELS,
    series: empty ? [] : SERIES,
    openByLevel: empty ? [] : OPEN_BY_LEVEL,
    openTotal: empty ? 0 : openTotal,
    types: empty ? [] : TYPES,
    entities: empty ? [] : ENTITIES,
    entityColumns: ENTITY_COLUMNS,
    alerts: empty ? [] : ALERTS,
    alertColumns: ALERT_COLUMNS,
    statusSeverity: STATUS_SEVERITY
  }
}

export const alertsSetup = (state) => () => ({
  ...dataFor(state),
  formatters,
  comparison: 'vs previous period',
  period: ref('30d'),
  activeIndex: ref(null)
})

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const alertsScript = (state) => {
  const data = dataFor(state)
  return [
    ...IMPORTS,
    '',
    `const loading = ${data.loading}`,
    "const comparison = 'vs previous period'",
    "const period = ref('30d')",
    'const activeIndex = ref(null)',
    `const openTotal = ${data.openTotal}`,
    '',
    literal('periods', data.periods),
    '',
    literal('figures', data.figures),
    '',
    literal('labels', data.labels),
    '',
    literal('series', data.series),
    '',
    literal('openByLevel', data.openByLevel),
    '',
    literal('types', data.types),
    '',
    literal('entities', data.entities),
    '',
    literal('entityColumns', data.entityColumns),
    '',
    literal('alerts', data.alerts),
    '',
    literal('alertColumns', data.alertColumns),
    '',
    literal('statusSeverity', data.statusSeverity),
    '',
    FORMATTERS_SOURCE
  ]
}

const cardHeader = (title, description) => `<ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>${title}</ChartCard.Title>
            <Hint text="${description}" />
          </span>
        </ChartCard.Header>`

export const ALERTS_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex flex-col gap-(--layout-group-gap)">
    <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow basis-(--container-md) flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Alerts</h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          What is open, how severe it is, what kind it is and who is involved.
        </p>
      </div>
      <div class="w-44 shrink-0">
        <Select
          v-model="period"
          size="medium"
          :display-value="(value) => periods.find((option) => option.value === value)?.label ?? value"
        >
          <Select.Trigger aria-label="Period" />
          <Select.Content>
            <Select.Option v-for="option in periods" :key="option.value" :value="option.value">
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </header>

    <section aria-label="Summary">
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li v-for="figure in figures" :key="figure.id" class="flex min-w-0 flex-col">
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="formatters[figure.format]"
            :delta="figure.delta"
            :delta-label="comparison"
            :inverse="figure.inverse"
            :loading="loading"
          >
            <template #aside>
              <Hint :text="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>
    </section>

    <div class="grid grid-cols-1 items-stretch gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]">
      <ChartCard :span="8">
        ${cardHeader('Alerts per day', 'Alerts raised each day, stacked by severity level.')}
        <ChartCard.Content>
          <Chart
            v-model:active-index="activeIndex"
            :series="series"
            :labels="labels"
            :format-value="formatters.count"
            :height="240"
            empty-title="No alerts in this period"
            empty-description="Nothing was raised in the last 30 days. Choose a longer period."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" :ticks="6" />
            <Chart.Bar stacked />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend />
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <div class="lg:col-span-4">
        <CardBox title="Open by severity">
          <template #content>
            <ul v-if="loading" aria-busy="true" class="flex flex-col gap-(--spacing-md)">
              <li v-for="index in 5" :key="index" class="flex items-center justify-between gap-(--spacing-sm)">
                <Skeleton width="30%" height="1.25rem" />
                <Skeleton width="20%" height="1rem" />
              </li>
            </ul>
            <ul v-else-if="openByLevel.length" class="flex flex-col gap-(--spacing-md)">
              <li v-for="level in openByLevel" :key="level.id" class="flex items-center justify-between gap-(--spacing-sm)">
                <SeverityTag :level="level.id" />
                <span class="flex items-baseline gap-(--spacing-xs) tabular-nums">
                  <span class="text-body-md text-(--text-default)">{{ level.count }}</span>
                  <span class="w-10 text-right text-body-sm text-(--text-muted)">{{ Math.round((level.count / openTotal) * 100) }}%</span>
                </span>
              </li>
            </ul>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-check-circle"
              title="No open alerts"
              description="Every alert raised in the period has been closed."
            />
          </template>
        </CardBox>
      </div>

      <ChartCard :span="4">
        ${cardHeader('By type', 'Alerts raised in the period, by the kind of behavior that raised them.')}
        <ChartCard.Content>
          <BarList
            :items="types"
            :format-value="formatters.count"
            empty-title="No alerts in this period"
            :loading="loading"
            aria-label="Alerts by type"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="8">
        ${cardHeader('Highest risk', 'The entities with the highest risk score, from the severity and number of their open alerts.')}
        <ChartCard.Content>
          <TableRoot
            v-if="loading || entities.length"
            :data="entities"
            :columns="entityColumns"
            row-key="id"
            enable-sorting
            header-kind="compact"
            border
            :loading="loading"
          >
            <template #cell-type="{ row }">
              <Tag :label="row.type" severity="secondary" size="small" />
            </template>
            <template #cell-score="{ row }">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                <span class="w-8 shrink-0 text-right tabular-nums">{{ row.score }}</span>
                <SeverityTag :level="row.level" size="small" />
              </div>
            </template>
            <template #cell-alerts="{ row }">
              <span class="tabular-nums">{{ row.alerts }}</span>
            </template>
          </TableRoot>
          <EmptyState
            v-else
            size="small"
            icon="pi pi-users"
            title="No entity has risk yet"
            description="Entities appear here once an alert names them."
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="12">
        ${cardHeader('Open alerts', 'Every open alert, most severe first.')}
        <ChartCard.Content>
          <TableRoot
            v-if="loading || alerts.length"
            :data="alerts"
            :columns="alertColumns"
            row-key="id"
            enable-sorting
            paginated
            :page-size="10"
            :rows-per-page-options="[10, 25, 50]"
            header-kind="compact"
            border
            :loading="loading"
          >
            <template #cell-severity="{ row }">
              <SeverityTag :level="row.level" size="small" />
            </template>
            <template #cell-status="{ row }">
              <Tag :label="row.status" :severity="statusSeverity[row.status]" size="small" />
            </template>
          </TableRoot>
          <EmptyState
            v-else
            size="small"
            icon="pi pi-bell"
            title="No open alerts"
            description="Alerts appear here when a detection rule matches. Choose a longer period to see closed ones."
          />
        </ChartCard.Content>
      </ChartCard>
    </div>
  </main>
</div>`
