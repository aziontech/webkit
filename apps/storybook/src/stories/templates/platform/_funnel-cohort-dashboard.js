import Button from '@aziontech/webkit/button'
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
import Dropdown, {
  DropdownGroup,
  DropdownOption,
  DropdownTrigger
} from '@aziontech/webkit/dropdown'
import EmptyState from '@aziontech/webkit/empty-state'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import StatTile from '@aziontech/webkit/stat-tile'
import TableRoot from '@aziontech/webkit/table-root'
import { computed, ref } from 'vue'

export const FUNNEL_COMPONENTS = {
  Button,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
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
  Select,
  'Select.Trigger': SelectTrigger,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption,
  StatTile,
  TableRoot
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import Dropdown from '@aziontech/webkit/dropdown'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Select from '@aziontech/webkit/select'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import { computed, ref } from 'vue'"
]

const DEFAULT_PERIOD = '6w'
const DEFAULT_SEGMENT = 'all'

const PERIODS = [
  { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' },
  { value: '6w', label: 'Last 6 weeks', comparison: 'vs previous 6 weeks' },
  { value: '90d', label: 'Last 90 days', comparison: 'vs previous 90 days' }
]

const SEGMENTS = [
  { value: 'all', label: 'All users' },
  { value: 'self-serve', label: 'Self-serve' },
  { value: 'sales-assisted', label: 'Sales-assisted' },
  { value: 'partners', label: 'Partner referrals' }
]

const SEGMENTS_WITH_DATA = ['all', 'self-serve', 'sales-assisted']

const FIGURES = [
  {
    id: 'visitors',
    label: 'Visitors',
    description: 'Unique people who visited the product site in the period.',
    value: 48_200,
    format: 'number',
    delta: 8.2,
    trend: [7_600, 7_900, 8_100, 7_800, 8_300, 8_500]
  },
  {
    id: 'sign-ups',
    label: 'Sign-ups',
    description: 'Visitors who created an account in the period.',
    value: 6_748,
    format: 'number',
    delta: 4.1,
    trend: [1_084, 1_136, 1_052, 1_210, 1_098, 1_168]
  },
  {
    id: 'activated',
    label: 'Activated',
    description: 'New accounts that created their first project.',
    value: 3_914,
    format: 'number',
    delta: -2.6,
    trend: [630, 660, 610, 700, 640, 674]
  },
  {
    id: 'paid',
    label: 'Paid',
    description: 'Activated accounts that started a paid plan.',
    value: 1_135,
    format: 'number',
    delta: 5.3,
    trend: [180, 192, 176, 204, 188, 195]
  },
  {
    id: 'conversion',
    label: 'Overall conversion',
    description: 'Paid accounts as a share of visitors, from the first visit to the first payment.',
    value: 2.35,
    format: 'share',
    delta: -2.7,
    trend: [2.37, 2.43, 2.17, 2.62, 2.27, 2.29]
  }
]

const STAGES = ['Visited', 'Signed up', 'Activated', 'Paid']

const FUNNEL = [{ id: 'users', name: 'Users', values: [48_200, 6_748, 3_914, 1_135] }]

const STEPS = [
  { id: 'visited', step: 'Visited', users: 48_200, share: 100, dropoff: null, from: '' },
  { id: 'signed-up', step: 'Signed up', users: 6_748, share: 14, dropoff: 86, from: 'Visited' },
  {
    id: 'activated',
    step: 'Activated',
    users: 3_914,
    share: 8.12,
    dropoff: 42,
    from: 'Signed up'
  },
  { id: 'paid', step: 'Paid', users: 1_135, share: 2.35, dropoff: 71, from: 'Activated' }
]

const STEP_COLUMNS = [
  { id: 'step', accessorKey: 'step', header: 'Step', align: 'start', principal: true },
  { id: 'users', accessorKey: 'users', header: 'Users', align: 'end' },
  { id: 'share', accessorKey: 'share', header: 'Of visitors', align: 'end', minWidth: 112 },
  { id: 'dropoff', accessorKey: 'dropoff', header: 'Drop-off', align: 'end', minWidth: 208 }
]

const WEEKS = [1, 2, 3, 4, 5, 6].map((week) => ({
  key: `week${week}`,
  label: `Week ${week}`,
  slot: `cell-week${week}`
}))

const COHORTS = [
  ['Sep 28', 1_084, [58, 41, 34, 30, 27, 25]],
  ['Oct 5', 1_136, [61, 45, 38, 33, 30, null]],
  ['Oct 12', 1_052, [55, 39, 32, 28, null, null]],
  ['Oct 19', 1_210, [66, 52, 45, null, null, null]],
  ['Oct 26', 1_098, [70, 57, null, null, null, null]],
  ['Nov 2', 1_168, [72, null, null, null, null, null]]
].map(([cohort, size, retention]) => ({
  id: cohort.toLowerCase().replace(' ', '-'),
  cohort,
  size,
  ...Object.fromEntries(WEEKS.map((week, index) => [week.key, retention[index]]))
}))

const RETENTION = COHORTS.map((row) => ({
  id: row.id,
  name: `${row.cohort} cohort`,
  values: WEEKS.map((week) => row[week.key])
}))

const COHORT_COLUMNS = [
  { id: 'cohort', accessorKey: 'cohort', header: 'Cohort', align: 'start', principal: true },
  { id: 'size', accessorKey: 'size', header: 'Users', align: 'end' },
  ...WEEKS.map((week) => ({ id: week.key, accessorKey: week.key, header: week.label, align: 'end' }))
]

const grouped = new Intl.NumberFormat('en-US')
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const FORMATTERS = {
  number: (value) => grouped.format(value),
  compact: (value) => compact.format(value),
  percent: (value) => (value === null ? '—' : `${value.toFixed(0)}%`),
  share: (value) => `${value.toFixed(1)}%`,
  drop: (value) => `−${value.toFixed(1)}%`
}

const FORMATTERS_SOURCE = `const grouped = new Intl.NumberFormat('en-US')
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const formatters = {
  number: (value) => grouped.format(value),
  compact: (value) => compact.format(value),
  percent: (value) => (value === null ? '—' : \`\${value.toFixed(0)}%\`),
  share: (value) => \`\${value.toFixed(1)}%\`,
  drop: (value) => \`−\${value.toFixed(1)}%\`
}`

const STATES = {
  default: { loading: false, segment: DEFAULT_SEGMENT },
  loading: { loading: true, segment: DEFAULT_SEGMENT },
  empty: { loading: false, segment: 'partners' }
}

const blank = (figure) => ({ ...figure, value: null, delta: null, trend: [] })

const optionLabel = (options) => (value) =>
  options.find((option) => option.value === value)?.label ?? ''

export const funnelSetup = (state) => () => {
  const { loading, segment: initialSegment } = STATES[state]
  const period = ref(DEFAULT_PERIOD)
  const segment = ref(initialSegment)
  const comparison = computed(
    () => PERIODS.find((option) => option.value === period.value)?.comparison ?? ''
  )
  const matches = computed(() => SEGMENTS_WITH_DATA.includes(segment.value))
  const view = computed(() =>
    matches.value
      ? { figures: FIGURES, funnel: FUNNEL, steps: STEPS, retention: RETENTION, cohorts: COHORTS }
      : { figures: FIGURES.map(blank), funnel: [], steps: [], retention: [], cohorts: [] }
  )
  const clearFilters = () => {
    period.value = DEFAULT_PERIOD
    segment.value = DEFAULT_SEGMENT
  }
  return {
    loading,
    periods: PERIODS,
    segments: SEGMENTS,
    stages: STAGES,
    stepColumns: STEP_COLUMNS,
    weeks: WEEKS,
    weekLabels: WEEKS.map((week) => week.label),
    cohortColumns: COHORT_COLUMNS,
    formatters: FORMATTERS,
    period,
    segment,
    periodLabel: optionLabel(PERIODS),
    segmentLabel: optionLabel(SEGMENTS),
    comparison,
    view,
    activeIndex: ref(null),
    clearFilters
  }
}

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const funnelScript = (state) => {
  const { loading, segment } = STATES[state]
  return [
    ...IMPORTS,
    '',
    `const loading = ${loading}`,
    '',
    literal('periods', PERIODS),
    '',
    literal('segments', SEGMENTS),
    '',
    literal('segmentsWithData', SEGMENTS_WITH_DATA),
    '',
    literal('figures', FIGURES),
    '',
    literal('stages', STAGES),
    '',
    literal('funnel', FUNNEL),
    '',
    literal('steps', STEPS),
    '',
    literal('stepColumns', STEP_COLUMNS),
    '',
    literal('weeks', WEEKS),
    '',
    'const weekLabels = weeks.map((week) => week.label)',
    '',
    literal('cohorts', COHORTS),
    '',
    literal('retention', RETENTION),
    '',
    literal('cohortColumns', COHORT_COLUMNS),
    '',
    FORMATTERS_SOURCE,
    '',
    `const period = ref('${DEFAULT_PERIOD}')`,
    `const segment = ref('${segment}')`,
    '',
    'const optionLabel = (options) => (value) =>',
    "  options.find((option) => option.value === value)?.label ?? ''",
    'const periodLabel = optionLabel(periods)',
    'const segmentLabel = optionLabel(segments)',
    'const comparison = computed(',
    "  () => periods.find((option) => option.value === period.value)?.comparison ?? ''",
    ')',
    '',
    'const matches = computed(() => segmentsWithData.includes(segment.value))',
    'const view = computed(() =>',
    '  matches.value',
    '    ? { figures, funnel, steps, retention, cohorts }',
    '    : {',
    '        figures: figures.map((figure) => ({ ...figure, value: null, delta: null, trend: [] })),',
    '        funnel: [],',
    '        steps: [],',
    '        retention: [],',
    '        cohorts: []',
    '      }',
    ')',
    '',
    'const activeIndex = ref(null)',
    '',
    'const clearFilters = () => {',
    `  period.value = '${DEFAULT_PERIOD}'`,
    `  segment.value = '${DEFAULT_SEGMENT}'`,
    '}'
  ]
}

const cardHeader = ({ title, description }) => `<ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
        <ChartCard.Title>${title}</ChartCard.Title>
        <Hint text="${description}" />
      </span>
      <ChartCard.Controls>
        <Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="More options for ${title}" />
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option value="export" label="Export CSV" />
          </Dropdown.Group>
        </Dropdown>
      </ChartCard.Controls>
    </ChartCard.Header>`

const CLEAR_FILTERS = '<Button label="Clear filters" kind="outlined" size="small" @click="clearFilters" />'

const EMPTY_DESCRIPTION = 'Choose another segment or widen the period.'

const filterSelect = ({ model, options, label, aria }) => `<div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
      <Select v-model="${model}" size="medium" class="w-full" :display-value="${label}">
        <Select.Trigger aria-label="${aria}" />
        <Select.Content>
          <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>
    </div>`

export const FUNNEL_TEMPLATE = `<div class="flex min-w-0 flex-col gap-(--spacing-lg) p-(--spacing-lg)">
  <header class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <h1 class="text-balance text-heading-sm text-(--text-default)">Funnel and retention</h1>
    <p class="text-pretty text-body-sm text-(--text-muted)">
      How visitors move from a first visit to a paid plan, and how many of each weekly sign-up cohort keep coming back.
    </p>
  </header>

  <div role="group" aria-label="Filters" class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
    ${filterSelect({ model: 'period', options: 'periods', label: 'periodLabel', aria: 'Period' })}
    ${filterSelect({ model: 'segment', options: 'segments', label: 'segmentLabel', aria: 'Segment' })}
  </div>

  <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
    <li v-for="figure in view.figures" :key="figure.id" class="flex min-w-0 flex-col">
      <StatTile
        :label="figure.label"
        :value="figure.value"
        :format-value="formatters[figure.format]"
        :delta="figure.delta"
        :delta-label="comparison"
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
      title: 'Conversion funnel',
      description: 'Unique users who reached each step in the period, in order, with the share lost between steps.'
    })}
    <ChartCard.Content>
      <div
        :data-empty="(!loading && !view.steps.length) || null"
        class="grid min-w-0 grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-2 data-empty:xl:grid-cols-1"
      >
        <Chart
          :series="view.funnel"
          :labels="stages"
          orientation="horizontal"
          :format-value="formatters.compact"
          :height="200"
          empty-title="No visitors match these filters"
          empty-description="${EMPTY_DESCRIPTION}"
          :loading="loading"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Bar labeled />
          <Chart.Tooltip />
          <template #empty-actions>
            ${CLEAR_FILTERS}
          </template>
        </Chart>

        <TableRoot
          v-if="loading || view.steps.length"
          :data="view.steps"
          :columns="stepColumns"
          row-key="id"
          header-kind="compact"
          border
          :loading="loading"
        >
          <template #cell-users="{ row }">
            <span class="tabular-nums">{{ formatters.number(row.users) }}</span>
          </template>
          <template #cell-share="{ row }">
            <span class="tabular-nums">{{ formatters.share(row.share) }}</span>
          </template>
          <template #cell-dropoff="{ row }">
            <span v-if="row.dropoff === null" class="text-(--text-muted)">—</span>
            <span v-else class="tabular-nums">{{ formatters.drop(row.dropoff) }} from {{ row.from }}</span>
          </template>
        </TableRoot>
      </div>
    </ChartCard.Content>
    </ChartCard>

    <ChartCard :span="6">
    ${cardHeader({
      title: 'Retention by cohort',
      description: 'Share of each weekly sign-up cohort still active in each week since sign-up.'
    })}
    <ChartCard.Content>
      <Chart
        v-model:active-index="activeIndex"
        :series="view.retention"
        :labels="weekLabels"
        :max="100"
        :format-value="formatters.percent"
        empty-title="No cohorts match these filters"
        empty-description="${EMPTY_DESCRIPTION}"
        :loading="loading"
      >
        <Chart.Grid />
        <Chart.Axis kind="y" />
        <Chart.Axis kind="x" />
        <Chart.Line markers />
        <Chart.Crosshair />
        <Chart.Tooltip />
        <Chart.Legend />
        <template #empty-actions>
          ${CLEAR_FILTERS}
        </template>
      </Chart>
    </ChartCard.Content>
    </ChartCard>

    <ChartCard :span="6">
    ${cardHeader({
      title: 'Weekly cohorts',
      description: 'Users who signed up each week, and the share of them active in each week since. A dash marks a week that has not ended yet.'
    })}
    <ChartCard.Content>
      <TableRoot
        :data="view.cohorts"
        :columns="cohortColumns"
        row-key="id"
        header-kind="compact"
        border
        :loading="loading"
      >
        <template #empty>
          <EmptyState
            size="small"
            icon="pi pi-filter-slash"
            title="No cohorts match these filters"
            description="${EMPTY_DESCRIPTION}"
          >
            <template #actions>
              ${CLEAR_FILTERS}
            </template>
          </EmptyState>
        </template>
        <template #cell-size="{ row }">
          <span class="tabular-nums">{{ formatters.number(row.size) }}</span>
        </template>
        <template v-for="week in weeks" :key="week.key" #[week.slot]="{ row }">
          <span
            :data-pending="row[week.key] === null || null"
            class="tabular-nums data-pending:text-(--text-muted)"
          >
            {{ formatters.percent(row[week.key]) }}
          </span>
        </template>
      </TableRoot>
    </ChartCard.Content>
    </ChartCard>
  </div>
</div>`
