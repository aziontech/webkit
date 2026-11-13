import BarList from '@aziontech/webkit/bar-list'
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
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import SeverityTag from '@aziontech/webkit/severity-tag'
import StatTile from '@aziontech/webkit/stat-tile'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

export const ACTIVITY_COMPONENTS = {
  BarList,
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
  FieldSelect,
  FieldText,
  Hint,
  IconButton,
  SeverityTag,
  StatTile,
  TableRoot,
  Tag
}

const IMPORTS = [
  "import BarList from '@aziontech/webkit/bar-list'",
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import SeverityTag from '@aziontech/webkit/severity-tag'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { ref } from 'vue'"
]

const HOURS = 24

const ALLOWED = [
  412, 386, 341, 318, 296, 305, 352, 448, 571, 664, 718, 742, 731, 756, 769, 748, 702, 655, 598,
  541, 503, 476, 451, 430
]

const BLOCKED = [
  38, 35, 31, 29, 33, 30, 36, 47, 62, 71, 84, 79, 76, 91, 88, 82, 74, 69, 61, 55, 49, 46, 42, 40
]

const HELD = [6, 5, 4, 3, 4, 3, 5, 8, 11, 14, 16, 15, 13, 17, 18, 15, 13, 12, 10, 9, 8, 7, 6, 6]

const sum = (values) => values.reduce((total, value) => total + value, 0)

const TOTALS = {
  allowed: sum(ALLOWED),
  blocked: sum(BLOCKED),
  held: sum(HELD)
}

const REQUESTS = TOTALS.allowed + TOTALS.blocked + TOTALS.held
const APPROVED = 186
const DENIED = 41
const OVER_BUDGET = 73

const OUTCOMES = [
  { id: 'allowed', name: 'Allowed', color: 'success', values: ALLOWED },
  { id: 'blocked', name: 'Blocked', color: 'danger', values: BLOCKED },
  { id: 'held', name: 'Held', color: 'warning', values: HELD }
]

const FIGURES = [
  {
    id: 'requests',
    label: 'Requests',
    description: 'Every request the rules evaluated in the time range.',
    value: REQUESTS,
    delta: 8.4,
    inverse: false
  },
  {
    id: 'allowed',
    label: 'Allowed',
    description: 'Requests a rule let through to their destination.',
    value: TOTALS.allowed,
    delta: 7.9,
    inverse: false
  },
  {
    id: 'blocked',
    label: 'Blocked',
    description: 'Requests a rule stopped before they reached their destination.',
    value: TOTALS.blocked,
    delta: 12.6,
    inverse: true
  },
  {
    id: 'held',
    label: 'Held',
    description: 'Requests a rule paused until someone approves or denies them.',
    value: TOTALS.held,
    delta: 4.1,
    inverse: true
  },
  {
    id: 'approved',
    label: 'Approved',
    description: 'Held requests a reviewer approved.',
    value: APPROVED,
    delta: 3.2,
    inverse: false
  },
  {
    id: 'denied',
    label: 'Denied',
    description: 'Held requests a reviewer denied.',
    value: DENIED,
    delta: -9.5,
    inverse: true
  },
  {
    id: 'over-budget',
    label: 'Over budget',
    description: 'Requests that went past the spending or volume budget set for their actor.',
    value: OVER_BUDGET,
    delta: 21.7,
    inverse: true
  }
]

const split = (total, weights) => {
  const whole = sum(weights)
  const parts = weights.map((weight) => Math.floor((total * weight) / whole))
  parts[0] += total - sum(parts)
  return parts
}

const breakdown = (total, entries) => {
  const values = split(
    total,
    entries.map(([, weight]) => weight)
  )
  return entries.map(([name], index) => ({ id: name, name, value: values[index] }))
}

const ACTORS = breakdown(REQUESTS, [
  ['report-builder', 31],
  ['ticket-triage', 22],
  ['inventory-sync', 17],
  ['invoice-reader', 12],
  ['release-helper', 9],
  ['data-export', 6],
  ['calendar-sync', 3]
])

const CATEGORIES = breakdown(REQUESTS, [
  ['Read', 54],
  ['Write', 21],
  ['Search', 12],
  ['Export', 6],
  ['Delete', 4],
  ['Admin', 3]
])

const DESTINATIONS = breakdown(REQUESTS, [
  ['api.example.com', 38],
  ['storage.example.com', 19],
  ['crm.example.net', 16],
  ['billing.example.com', 11],
  ['mail.example.org', 9],
  ['docs.example.com', 7]
])

const option = (label) => ({ value: label, label })

const TIME_RANGES = ['Last hour', 'Last 24 hours', 'Last 7 days', 'Last 30 days'].map(option)

const ACTOR_OPTIONS = ['Any actor', ...ACTORS.map((actor) => actor.name)].map(option)

const OUTCOME_OPTIONS = ['Any outcome', 'Allowed', 'Blocked', 'Held', 'Approved', 'Denied'].map(
  option
)

const CATEGORY_OPTIONS = ['Any category', ...CATEGORIES.map((category) => category.name)].map(
  option
)

const COLUMNS = [
  ['time', 'Time', 'start'],
  ['actor', 'Actor', 'start'],
  ['outcome', 'Outcome', 'start'],
  ['category', 'Category', 'start'],
  ['severity', 'Severity', 'start'],
  ['destination', 'Destination', 'start'],
  ['method', 'Method', 'start'],
  ['rule', 'Rule', 'start']
].map(([id, header, align], index) => ({
  id,
  accessorKey: id,
  header,
  align,
  enableSorting: id === 'time' || id === 'actor' || id === 'destination',
  principal: index === 0
}))

const ROWS = [
  [
    '14:52:08',
    'report-builder',
    'allowed',
    'Read',
    'info',
    'api.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:51:47',
    'data-export',
    'blocked',
    'Export',
    'critical',
    'storage.example.com',
    'PUT',
    'No bulk export'
  ],
  [
    '14:51:12',
    'ticket-triage',
    'held',
    'Write',
    'medium',
    'crm.example.net',
    'PATCH',
    'Review customer changes'
  ],
  [
    '14:50:39',
    'invoice-reader',
    'allowed',
    'Read',
    'low',
    'billing.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:49:58',
    'release-helper',
    'approved',
    'Admin',
    'high',
    'api.example.com',
    'POST',
    'Approve admin actions'
  ],
  [
    '14:49:21',
    'inventory-sync',
    'blocked',
    'Delete',
    'high',
    'api.example.com',
    'DELETE',
    'No deletes outside hours'
  ],
  [
    '14:48:44',
    'report-builder',
    'allowed',
    'Search',
    'info',
    'docs.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:48:03',
    'ticket-triage',
    'denied',
    'Write',
    'medium',
    'mail.example.org',
    'POST',
    'Review outbound mail'
  ],
  [
    '14:47:26',
    'calendar-sync',
    'allowed',
    'Write',
    'low',
    'api.example.com',
    'PUT',
    'Scheduled writes'
  ],
  [
    '14:46:50',
    'data-export',
    'blocked',
    'Export',
    'critical',
    'storage.example.com',
    'PUT',
    'No bulk export'
  ],
  [
    '14:46:12',
    'invoice-reader',
    'allowed',
    'Read',
    'info',
    'billing.example.com',
    'GET',
    'Read-only access'
  ],
  [
    '14:45:37',
    'release-helper',
    'held',
    'Admin',
    'high',
    'api.example.com',
    'POST',
    'Approve admin actions'
  ]
].map(([time, actor, outcome, category, severity, destination, method, rule], index) => ({
  id: `request-${String(index + 1).padStart(2, '0')}`,
  time,
  actor,
  outcome,
  category,
  severity,
  destination,
  method,
  rule
}))

const OUTCOME_TAGS = {
  allowed: { label: 'Allowed', severity: 'success' },
  blocked: { label: 'Blocked', severity: 'danger' },
  held: { label: 'Held', severity: 'warning' },
  approved: { label: 'Approved', severity: 'secondary' },
  denied: { label: 'Denied', severity: 'secondary' }
}

export const outcomeTag = (outcome) => OUTCOME_TAGS[outcome]

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export const formatCount = (value) => compact.format(value)

const labelsFor = () =>
  Array.from({ length: HOURS }, (_, index) => new Date(Date.UTC(2026, 10, 9, 15 + index)))

const HELPERS_SOURCE = `const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const formatCount = (value) => compact.format(value)

const outcomeTags = ${JSON.stringify(OUTCOME_TAGS, null, 2)}

const outcomeTag = (outcome) => outcomeTags[outcome]`

const STATES = {
  default: { loading: false, empty: false },
  loading: { loading: true, empty: false },
  empty: { loading: false, empty: true }
}

const dataFor = (state) => {
  const { loading, empty } = STATES[state]
  const blank = loading || empty
  return {
    loading,
    figures: blank ? FIGURES.map((figure) => ({ ...figure, value: null, delta: null })) : FIGURES,
    outcomes: empty ? [] : OUTCOMES,
    actors: empty ? [] : ACTORS,
    categories: empty ? [] : CATEGORIES,
    destinations: empty ? [] : DESTINATIONS,
    columns: COLUMNS,
    rows: blank ? [] : ROWS
  }
}

const OPTIONS = {
  timeRanges: TIME_RANGES,
  actorOptions: ACTOR_OPTIONS,
  outcomeOptions: OUTCOME_OPTIONS,
  categoryOptions: CATEGORY_OPTIONS
}

export const activitySetup = (state) => () => ({
  ...dataFor(state),
  ...OPTIONS,
  labels: labelsFor(),
  formatCount,
  outcomeTag,
  comparison: 'vs prior day',
  timeRange: ref('Last 24 hours'),
  actor: ref('Any actor'),
  outcome: ref('Any outcome'),
  category: ref('Any category'),
  destination: ref(''),
  activeIndex: ref(null)
})

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const activityScript = (state) => {
  const data = dataFor(state)
  return [
    ...IMPORTS,
    '',
    `const loading = ${data.loading}`,
    "const comparison = 'vs prior day'",
    "const timeRange = ref('Last 24 hours')",
    "const actor = ref('Any actor')",
    "const outcome = ref('Any outcome')",
    "const category = ref('Any category')",
    "const destination = ref('')",
    'const activeIndex = ref(null)',
    '',
    `const labels = Array.from({ length: ${HOURS} }, (_, index) => new Date(Date.UTC(2026, 10, 9, 15 + index)))`,
    '',
    literal('timeRanges', TIME_RANGES),
    '',
    literal('actorOptions', ACTOR_OPTIONS),
    '',
    literal('outcomeOptions', OUTCOME_OPTIONS),
    '',
    literal('categoryOptions', CATEGORY_OPTIONS),
    '',
    literal('figures', data.figures),
    '',
    literal('outcomes', data.outcomes),
    '',
    literal('actors', data.actors),
    '',
    literal('categories', data.categories),
    '',
    literal('destinations', data.destinations),
    '',
    literal('columns', data.columns),
    '',
    literal('rows', data.rows),
    '',
    HELPERS_SOURCE
  ]
}

export const ACTIVITY_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex flex-col gap-(--layout-group-gap)">
    <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow basis-(--container-md) flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Request activity</h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          What each actor requested through the rules: what was allowed, blocked or held for approval,
          and what went over budget, per actor, category and destination.
        </p>
      </div>
      <IconButton icon="pi pi-refresh" kind="outlined" size="medium" aria-label="Refresh" />
    </header>

    <section
      aria-label="Filters"
      class="grid grid-cols-1 items-start gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-5"
    >
      <FieldSelect
        v-model="timeRange"
        input-id="activity-time-range"
        label="Time range"
        size="medium"
        :options="timeRanges"
      />
      <FieldSelect
        v-model="actor"
        input-id="activity-actor"
        label="Actor"
        size="medium"
        :options="actorOptions"
      />
      <FieldSelect
        v-model="outcome"
        input-id="activity-outcome"
        label="Outcome"
        size="medium"
        :options="outcomeOptions"
      />
      <FieldSelect
        v-model="category"
        input-id="activity-category"
        label="Category"
        size="medium"
        :options="categoryOptions"
      />
      <FieldText
        v-model="destination"
        input-id="activity-destination"
        label="Destination"
        placeholder="api.example.com"
        helper-text="Exact host."
        size="medium"
      />
    </section>

    <section aria-label="Outcomes">
      <ul class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-4 2xl:grid-cols-7">
        <li v-for="figure in figures" :key="figure.id" class="flex min-w-0 flex-col">
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="formatCount"
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

    <div
      class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
    >
      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Outcomes over time</ChartCard.Title>
            <Hint text="Requests per hour, stacked by the outcome the rules gave them." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            v-model:active-index="activeIndex"
            :series="outcomes"
            :labels="labels"
            :format-value="formatCount"
            empty-title="No requests in this time range"
            empty-description="Requests the rules evaluate appear here. Widen the time range to see older ones."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Bar stacked />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend totals />
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Actors</ChartCard.Title>
            <Hint text="Requests per actor, every outcome included." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="actors"
            :format-value="formatCount"
            empty-title="No request in this time range"
            :loading="loading"
            aria-label="Requests by actor"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Categories</ChartCard.Title>
            <Hint text="Requests per category of action, every outcome included." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="categories"
            :format-value="formatCount"
            :color="2"
            empty-title="No request in this time range"
            :loading="loading"
            aria-label="Requests by category"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Destinations</ChartCard.Title>
            <Hint text="Requests per destination host, every outcome included." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="destinations"
            :format-value="formatCount"
            :color="3"
            empty-title="No request in this time range"
            :loading="loading"
            aria-label="Requests by destination"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Requests</ChartCard.Title>
            <Hint text="The latest requests, newest first, with the rule that decided each one." />
          </span>
          <ChartCard.Controls>
            <Tag
              v-if="!loading && rows.length"
              :label="rows.length + ' requests'"
              severity="secondary"
              size="small"
            />
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <TableRoot
            v-if="loading || rows.length"
            :data="rows"
            :columns="columns"
            row-key="id"
            enable-sorting
            paginated
            :page-size="10"
            :rows-per-page-options="[10, 25, 50]"
            header-kind="compact"
            border
            :loading="loading"
          >
            <template #cell-outcome="{ row }">
              <Tag
                :label="outcomeTag(row.outcome).label"
                :severity="outcomeTag(row.outcome).severity"
                size="small"
              />
            </template>
            <template #cell-severity="{ row }">
              <SeverityTag :level="row.severity" size="small" />
            </template>
            <template #cell-method="{ row }">
              <span class="font-mono text-body-sm">{{ row.method }}</span>
            </template>
          </TableRoot>
          <EmptyState
            v-else
            size="small"
            icon="pi pi-list"
            title="No requests in this time range"
            description="Requests the rules evaluate appear here. Widen the time range to see older ones."
          />
        </ChartCard.Content>
      </ChartCard>
    </div>
  </main>
</div>`
