import Button from '@aziontech/webkit/button'
import Chart, {
  ChartArea,
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
import DonutChart from '@aziontech/webkit/donut-chart'
import Dropdown, {
  DropdownGroup,
  DropdownOption,
  DropdownTrigger
} from '@aziontech/webkit/dropdown'
import EmptyState from '@aziontech/webkit/empty-state'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import ProgressBar from '@aziontech/webkit/progress-bar'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Select from '@aziontech/webkit/select'
import StatTile from '@aziontech/webkit/stat-tile'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

export const COMPOSITION_COMPONENTS = {
  Button,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
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
  DonutChart,
  Dropdown,
  'Dropdown.Trigger': DropdownTrigger,
  'Dropdown.Group': DropdownGroup,
  'Dropdown.Option': DropdownOption,
  EmptyState,
  Hint,
  IconButton,
  ProgressBar,
  SegmentedButton,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  StatTile,
  TableRoot,
  Tag
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import DonutChart from '@aziontech/webkit/donut-chart'",
  "import Dropdown from '@aziontech/webkit/dropdown'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import ProgressBar from '@aziontech/webkit/progress-bar'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Select from '@aziontech/webkit/select'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { ref } from 'vue'"
]

const LABELS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']

const CATEGORIES = [
  {
    id: 'compute',
    name: 'Compute',
    icon: 'pi pi-server',
    values: [
      11_800, 12_100, 12_400, 12_900, 13_300, 13_700, 14_200, 14_600, 15_100, 15_500, 16_200, 16_900
    ]
  },
  {
    id: 'database',
    name: 'Database',
    icon: 'pi pi-database',
    values: [7_200, 7_300, 7_500, 7_600, 7_800, 8_000, 8_100, 8_300, 8_600, 8_800, 9_100, 9_400]
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: 'pi pi-folder',
    values: [4_100, 4_300, 4_400, 4_600, 4_800, 5_000, 5_100, 5_300, 5_500, 5_600, 5_800, 6_000]
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: 'pi pi-globe',
    values: [3_000, 2_900, 3_100, 3_200, 3_400, 3_300, 3_500, 3_700, 3_600, 3_800, 3_900, 4_100]
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    icon: 'pi pi-chart-line',
    values: [1_500, 1_500, 1_600, 1_600, 1_700, 1_700, 1_800, 1_800, 1_900, 1_900, 2_000, 2_100]
  }
]

const LAST = LABELS.length - 1

const percentChange = (current, previous) =>
  previous ? Math.round(((current - previous) / previous) * 10_000) / 100 : 0

const TOTALS = LABELS.map((_, index) =>
  CATEGORIES.reduce((sum, category) => sum + category.values[index], 0)
)

const TOTAL = TOTALS[LAST]

const SERIES = CATEGORIES.map(({ id, name, values }) => ({ id, name, values }))

const SPLIT = CATEGORIES.map(({ id, name, values }) => ({ id, name, values: [values[LAST]] }))

const figureOf = (id, label, description, values) => ({
  id,
  label,
  description,
  value: values[LAST],
  delta: percentChange(values[LAST], values[LAST - 1]),
  trend: values
})

const FIGURES = [
  figureOf('total', 'Total spend', 'Everything billed to the organization this month.', TOTALS),
  ...CATEGORIES.slice(0, 3).map((category) =>
    figureOf(
      category.id,
      category.name,
      `Spend on ${category.name.toLowerCase()} this month, the share of the total it carries.`,
      category.values
    )
  )
]

const CATEGORY_OF = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]))

const CONTRIBUTORS = [
  ['web-app', 'compute', 6_200, 5_900],
  ['worker-pool', 'compute', 5_900, 5_600],
  ['orders-db', 'database', 5_400, 5_100],
  ['api-service', 'compute', 4_800, 4_700],
  ['analytics-warehouse', 'database', 4_000, 4_000],
  ['media-files', 'storage', 3_700, 3_400],
  ['public-egress', 'networking', 2_600, 2_500],
  ['backups', 'storage', 2_300, 2_400],
  ['logs-pipeline', 'monitoring', 2_100, 2_000],
  ['load-balancer', 'networking', 1_500, 1_400]
].map(([name, category, amount, previous], index) => ({
  id: name,
  rank: index + 1,
  name,
  icon: CATEGORY_OF[category].icon,
  category: CATEGORY_OF[category].name,
  amount,
  share: Math.round((amount / TOTAL) * 1_000) / 10,
  change: percentChange(amount, previous)
}))

const CONTRIBUTOR_COLUMNS = [
  {
    id: 'rank',
    accessorKey: 'rank',
    header: 'Rank',
    align: 'start',
    enableSorting: true,
    minWidth: 64
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    align: 'start',
    enableSorting: true,
    principal: true,
    grow: 2
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    align: 'start',
    enableSorting: true,
    minWidth: 120
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'Amount',
    align: 'end',
    enableSorting: true,
    minWidth: 104
  },
  {
    id: 'share',
    accessorKey: 'share',
    header: 'Share of total',
    align: 'start',
    enableSorting: true,
    minWidth: 160
  },
  {
    id: 'change',
    accessorKey: 'change',
    header: 'Change',
    align: 'end',
    enableSorting: true,
    minWidth: 104
  }
]

const PERIODS = [
  { label: 'Last 12 months', value: '12m' },
  { label: 'Last 6 months', value: '6m' },
  { label: 'This year', value: 'ytd' }
]

const FORMS = [
  { label: 'Area', value: 'area' },
  { label: 'Bar', value: 'bar' }
]

const spendFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1
})

const amountFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const FORMATTERS = {
  spend: (value) => spendFormat.format(value),
  amount: (value) => amountFormat.format(value),
  share: (value) => `${value.toFixed(1)}%`,
  change: (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

const FORMATTERS_SOURCE = `const spendFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1
})

const amountFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const formatters = {
  spend: (value) => spendFormat.format(value),
  amount: (value) => amountFormat.format(value),
  share: (value) => \`\${value.toFixed(1)}%\`,
  change: (value) => \`\${value > 0 ? '+' : ''}\${value.toFixed(1)}%\`
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
    series: empty ? [] : SERIES,
    split: empty ? [] : SPLIT,
    contributors: empty ? [] : CONTRIBUTORS,
    contributorColumns: CONTRIBUTOR_COLUMNS,
    periods: PERIODS,
    forms: FORMS
  }
}

const COMPARISON = 'vs previous month'

export const compositionSetup = (state) => () => ({
  ...dataFor(state),
  formatters: FORMATTERS,
  comparison: COMPARISON,
  period: ref('12m'),
  trendForm: ref('area')
})

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const compositionScript = (state) => {
  const data = dataFor(state)
  return [
    ...IMPORTS,
    '',
    `const loading = ${data.loading}`,
    `const comparison = '${COMPARISON}'`,
    '',
    literal('figures', data.figures),
    '',
    literal('labels', data.labels),
    '',
    literal('series', data.series),
    '',
    literal('split', data.split),
    '',
    literal('contributors', data.contributors),
    '',
    literal('contributorColumns', data.contributorColumns),
    '',
    literal('periods', data.periods),
    '',
    literal('forms', data.forms),
    '',
    FORMATTERS_SOURCE,
    '',
    "const period = ref('12m')",
    "const trendForm = ref('area')"
  ]
}

const menu = (title) => `<Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="More options for ${title}" />
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option value="export" label="Export CSV" />
          </Dropdown.Group>
        </Dropdown>`

const cardHeader = ({ title, description, controls = '' }) => `<ChartCard.Header>
        <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
          <ChartCard.Title>${title}</ChartCard.Title>
          <Hint text="${description}" />
        </span>
        <ChartCard.Controls>${controls}
          ${menu(title)}
        </ChartCard.Controls>
      </ChartCard.Header>`

const EMPTY_TITLE = 'No spend in this range'
const EMPTY_DESCRIPTION = 'Nothing was billed to the organization in the selected period.'

const EMPTY_COPY = `empty-title="${EMPTY_TITLE}"
          empty-description="${EMPTY_DESCRIPTION}"`

export const COMPOSITION_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex flex-col gap-(--spacing-lg)">
    <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Cost breakdown</h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          How the organization’s spend splits across categories and the resources that drive it.
        </p>
      </div>
      <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:flex-nowrap">
        <div class="w-full md:w-48">
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
        <div class="w-full md:w-fit">
          <Button label="Export CSV" icon="pi pi-download" kind="outlined" size="medium" class="w-full" />
        </div>
      </div>
    </header>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
      <li v-for="figure in figures" :key="figure.id" class="flex min-w-0 flex-col">
        <StatTile
          :label="figure.label"
          :value="figure.value"
          :format-value="formatters.spend"
          :delta="figure.delta"
          :delta-label="comparison"
          inverse
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
      <ChartCard :span="8">
      ${cardHeader({
        title: 'Spend by category',
        description:
          'Monthly spend stacked by category; the top edge is the total. Legend totals sum the whole range.',
        controls: `
          <SegmentedButton v-model="trendForm" :options="forms" size="small" aria-label="Chart form for Spend by category" />`
      })}
      <ChartCard.Content>
        <Chart
          :series="series"
          :labels="labels"
          :format-value="formatters.spend"
          ${EMPTY_COPY}
          :loading="loading"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Bar v-if="trendForm === 'bar'" stacked />
          <Chart.Area v-else stacked />
          <Chart.Crosshair />
          <Chart.Tooltip />
          <Chart.Legend totals />
        </Chart>
      </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
      ${cardHeader({
        title: 'Current split',
        description: 'This month’s spend by category, with the total in the center.'
      })}
      <ChartCard.Content>
        <DonutChart
          :series="split"
          :format-value="formatters.spend"
          total-label="This month"
          ${EMPTY_COPY}
          :loading="loading"
          aria-label="Current split"
        />
      </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="12">
      ${cardHeader({
        title: 'Top contributors',
        description:
          'The resources that cost the most this month, their share of the total and the change against last month.'
      })}
      <ChartCard.Content>
        <TableRoot
          :data="contributors"
          :columns="contributorColumns"
          row-key="id"
          enable-sorting
          header-kind="compact"
          border
          :loading="loading"
        >
          <template #empty>
            <EmptyState
              size="small"
              icon="pi pi-chart-bar"
              title="${EMPTY_TITLE}"
              description="${EMPTY_DESCRIPTION}"
            />
          </template>

          <template #cell-rank="{ row }">
            <span class="tabular-nums text-(--text-muted)">{{ row.rank }}</span>
          </template>

          <template #cell-name="{ row }">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i :class="row.icon" class="shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
              <span class="truncate">{{ row.name }}</span>
            </div>
          </template>

          <template #cell-category="{ row }">
            <Tag :label="row.category" severity="secondary" size="small" />
          </template>

          <template #cell-amount="{ row }">
            <span class="tabular-nums">{{ formatters.amount(row.amount) }}</span>
          </template>

          <template #cell-share="{ row }">
            <div class="flex w-full min-w-0 items-center gap-(--spacing-sm)">
              <div class="w-16 shrink-0">
                <ProgressBar :value="row.share" size="small" :aria-label="row.name + ' share of total'" />
              </div>
              <span class="tabular-nums">{{ formatters.share(row.share) }}</span>
            </div>
          </template>

          <template #cell-change="{ row }">
            <Tag
              :label="formatters.change(row.change)"
              :severity="row.change > 0 ? 'danger' : row.change < 0 ? 'success' : 'secondary'"
              :icon="row.change > 0 ? 'pi pi-arrow-up-right' : row.change < 0 ? 'pi pi-arrow-down-right' : 'pi pi-minus'"
              size="small"
            />
          </template>
        </TableRoot>
      </ChartCard.Content>
      </ChartCard>
    </div>
  </main>
</div>`
