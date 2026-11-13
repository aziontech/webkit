import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Chart, {
  ChartArea,
  ChartAxis,
  ChartCrosshair,
  ChartGrid,
  ChartLine,
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
import Item from '@aziontech/webkit/item'
import ProgressBar from '@aziontech/webkit/progress-bar'
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import Skeleton from '@aziontech/webkit/skeleton'
import StatTile from '@aziontech/webkit/stat-tile'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

export const SUMMARY_COMPONENTS = {
  Avatar,
  Button,
  CardBox,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
  'Chart.Area': ChartArea,
  'Chart.Crosshair': ChartCrosshair,
  'Chart.Tooltip': ChartTooltip,
  ChartCard,
  'ChartCard.Header': ChartCardHeader,
  'ChartCard.Title': ChartCardTitle,
  'ChartCard.Controls': ChartCardControls,
  'ChartCard.Content': ChartCardContent,
  EmptyState,
  Hint,
  Item,
  'Item.List': Item.List,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  ProgressBar,
  Select,
  'Select.Trigger': SelectTrigger,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption,
  Skeleton,
  StatTile,
  Tag
}

const IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Item from '@aziontech/webkit/item'",
  "import ProgressBar from '@aziontech/webkit/progress-bar'",
  "import Select from '@aziontech/webkit/select'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { ref } from 'vue'"
]

const QUARTERS = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']

const MONTHS = [
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
  'Sep 2026'
]

const FIGURES = [
  {
    id: 'revenue',
    label: 'Revenue',
    description: 'Recognized revenue for the quarter.',
    value: 4_820_000,
    format: 'currency',
    delta: 5.7,
    inverse: false
  },
  {
    id: 'active-users',
    label: 'Monthly active users',
    description: 'People who signed in at least once in the last month of the quarter.',
    value: 128_400,
    format: 'count',
    delta: 5.1,
    inverse: false
  },
  {
    id: 'retention',
    label: 'Net revenue retention',
    description: 'Revenue kept from existing customers, expansion included, over twelve months.',
    value: 112,
    format: 'percentage',
    delta: 1.8,
    inverse: false
  },
  {
    id: 'nps',
    label: 'NPS',
    description: 'Net promoter score from the quarterly customer survey.',
    value: 47,
    format: 'score',
    delta: 6.8,
    inverse: false
  },
  {
    id: 'uptime',
    label: 'Uptime',
    description: 'Share of minutes every public service answered, averaged over the quarter.',
    value: 99.97,
    format: 'uptime',
    delta: 0.02,
    inverse: false
  },
  {
    id: 'cost-per-request',
    label: 'Cost per request',
    description: 'Infrastructure spend divided by requests served. A rise is a regression.',
    value: 0.00217,
    format: 'cost',
    delta: -7.1,
    inverse: true
  }
]

const GOALS = [
  {
    id: 'revenue',
    label: 'Quarterly revenue',
    current: 4_820_000,
    target: 5_000_000,
    format: 'currency',
    status: { label: 'On track', severity: 'success' }
  },
  {
    id: 'active-users',
    label: 'Monthly active users',
    current: 128_400,
    target: 140_000,
    format: 'count',
    status: { label: 'At risk', severity: 'warning' }
  },
  {
    id: 'retention',
    label: 'Net revenue retention',
    current: 112,
    target: 110,
    format: 'percentage',
    status: { label: 'On track', severity: 'success' }
  },
  {
    id: 'nps',
    label: 'NPS',
    current: 47,
    target: 50,
    format: 'score',
    status: { label: 'On track', severity: 'success' }
  },
  {
    id: 'enterprise-deals',
    label: 'Enterprise deals closed',
    current: 18,
    target: 30,
    format: 'score',
    status: { label: 'Off track', severity: 'danger' }
  }
]

const TRENDS = [
  {
    id: 'revenue',
    title: 'Revenue',
    description: 'Recognized revenue per month.',
    mark: 'area',
    format: 'currency',
    min: 0,
    change: { label: '+25.2%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'revenue',
        name: 'Revenue',
        values: [
          1_310_000, 1_340_000, 1_420_000, 1_380_000, 1_410_000, 1_470_000, 1_490_000, 1_520_000,
          1_550_000, 1_570_000, 1_610_000, 1_640_000
        ]
      }
    ]
  },
  {
    id: 'active-users',
    title: 'Monthly active users',
    description: 'People who signed in at least once in the month.',
    mark: 'area',
    format: 'count',
    min: 0,
    change: { label: '+30.8%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'active-users',
        name: 'Monthly active users',
        values: [
          98_200, 101_400, 104_000, 103_100, 107_900, 111_500, 114_600, 117_300, 122_200, 124_000,
          126_100, 128_400
        ]
      }
    ]
  },
  {
    id: 'retention',
    title: 'Net revenue retention',
    description: 'Trailing twelve months, measured at month end.',
    mark: 'line',
    format: 'percentage',
    min: 100,
    change: { label: '+5.7%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'retention',
        name: 'Net revenue retention',
        values: [106, 106, 107, 107, 108, 109, 109, 110, 110, 111, 111, 112]
      }
    ]
  },
  {
    id: 'nps',
    title: 'NPS',
    description: 'Net promoter score from the monthly pulse survey.',
    mark: 'line',
    format: 'score',
    min: 0,
    change: { label: '+23.7%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'nps',
        name: 'NPS',
        values: [38, 39, 41, 40, 42, 43, 42, 44, 44, 45, 46, 47]
      }
    ]
  },
  {
    id: 'uptime',
    title: 'Uptime',
    description: 'Share of minutes every public service answered.',
    mark: 'line',
    format: 'uptime',
    min: 99.8,
    change: { label: '+0.05%', severity: 'success', icon: 'pi pi-arrow-up-right' },
    series: [
      {
        id: 'uptime',
        name: 'Uptime',
        values: [99.94, 99.96, 99.91, 99.97, 99.98, 99.95, 99.99, 99.95, 99.91, 99.98, 99.94, 99.99]
      }
    ]
  },
  {
    id: 'cost-per-request',
    title: 'Cost per request',
    description: 'Infrastructure spend divided by requests served.',
    mark: 'line',
    format: 'cost',
    min: 0,
    change: { label: '−25.0%', severity: 'success', icon: 'pi pi-arrow-down-right' },
    series: [
      {
        id: 'cost-per-request',
        name: 'Cost per request',
        values: [
          0.0028, 0.0028, 0.0027, 0.0027, 0.0026, 0.0025, 0.0024, 0.0023, 0.0023, 0.0022, 0.0022,
          0.0021
        ]
      }
    ]
  }
]

const NOTES = [
  {
    id: 'note-04',
    author: 'Maria Santos',
    initials: 'MS',
    role: 'Head of Finance',
    date: '2026-09-30',
    dateLabel: 'Sep 30, 2026',
    body: 'Revenue closed at 96% of the goal. Two enterprise renewals slipped into October; both are signed and land in Q4.'
  },
  {
    id: 'note-03',
    author: 'David Kim',
    initials: 'DK',
    role: 'VP of Product',
    date: '2026-09-26',
    dateLabel: 'Sep 26, 2026',
    body: 'Monthly active users grew 5.1% after the new onboarding shipped in August. First-week activation rose from 41% to 48%.'
  },
  {
    id: 'note-02',
    author: 'Priya Nair',
    initials: 'PN',
    role: 'Head of Customer Success',
    date: '2026-09-19',
    dateLabel: 'Sep 19, 2026',
    body: 'NPS reached 47, the highest in a year. Detractors still cite slow replies on weekends, so a weekend support rotation starts in October.'
  },
  {
    id: 'note-01',
    author: 'Lucas Moreau',
    initials: 'LM',
    role: 'VP of Engineering',
    date: '2026-09-12',
    dateLabel: 'Sep 12, 2026',
    body: 'Cost per request fell 7.1% after batch jobs moved to off-peak capacity. Uptime held at 99.97%, with one 14-minute incident on Aug 21.'
  }
]

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2
})

export const formatters = {
  currency: (value) => money.format(value),
  count: (value) => compact.format(value),
  percentage: (value) => `${value.toFixed(0)}%`,
  uptime: (value) => `${value.toFixed(2)}%`,
  score: (value) => value.toFixed(0),
  cost: (value) => `$${value.toFixed(4)}`
}

const FORMATTERS_SOURCE = `const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2
})

const formatters = {
  currency: (value) => money.format(value),
  count: (value) => compact.format(value),
  percentage: (value) => \`\${value.toFixed(0)}%\`,
  uptime: (value) => \`\${value.toFixed(2)}%\`,
  score: (value) => value.toFixed(0),
  cost: (value) => \`$\${value.toFixed(4)}\`
}`

const STATES = {
  default: { loading: false, empty: false, quarter: 'Q3 2026' },
  loading: { loading: true, empty: false, quarter: 'Q3 2026' },
  empty: { loading: false, empty: true, quarter: 'Q3 2025' }
}

const dataFor = (state) => {
  const { loading, empty } = STATES[state]
  return {
    loading,
    quarters: QUARTERS,
    figures: empty ? FIGURES.map((figure) => ({ ...figure, value: null, delta: null })) : FIGURES,
    goals: empty ? [] : GOALS,
    months: MONTHS,
    trends: empty ? TRENDS.map((trend) => ({ ...trend, change: null, series: [] })) : TRENDS,
    notes: empty ? [] : NOTES
  }
}

export const summarySetup = (state) => () => ({
  ...dataFor(state),
  formatters,
  comparison: 'vs last quarter',
  quarter: ref(STATES[state].quarter),
  activeIndex: ref(null)
})

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const summaryScript = (state) => {
  const data = dataFor(state)
  return [
    ...IMPORTS,
    '',
    `const loading = ${data.loading}`,
    "const comparison = 'vs last quarter'",
    `const quarter = ref('${STATES[state].quarter}')`,
    'const activeIndex = ref(null)',
    '',
    literal('quarters', data.quarters),
    '',
    literal('figures', data.figures),
    '',
    literal('goals', data.goals),
    '',
    literal('months', data.months),
    '',
    literal('trends', data.trends),
    '',
    literal('notes', data.notes),
    '',
    FORMATTERS_SOURCE
  ]
}

export const SUMMARY_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex flex-col gap-(--layout-group-gap)">
    <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Executive summary</h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          Headline results for the quarter, progress on its goals, twelve-month trends and notes from the leads.
        </p>
      </div>
      <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto">
        <div class="w-36">
          <Select v-model="quarter" size="medium">
            <Select.Trigger aria-label="Quarter" />
            <Select.Content>
              <Select.Option v-for="option in quarters" :key="option" :value="option">
                {{ option }}
              </Select.Option>
            </Select.Content>
          </Select>
        </div>
        <Button label="Export" kind="outlined" size="medium" icon="pi pi-download" />
      </div>
    </header>

    <section aria-label="Scorecard">
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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

    <div class="grid grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-12">
      <section
        aria-label="Trends"
        class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] md:grid-cols-2 md:[--chart-grid-columns:2] xl:col-span-8"
      >
        <ChartCard v-for="trend in trends" :key="trend.id" :span="1">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>{{ trend.title }}</ChartCard.Title>
              <Hint :text="trend.description" />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="trend.change && !loading"
                :label="trend.change.label"
                :severity="trend.change.severity"
                :icon="trend.change.icon"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="trend.series"
              :labels="months"
              :min="trend.min"
              :format-value="formatters[trend.format]"
              :height="160"
              :empty-title="'No results for ' + quarter"
              empty-description="Nothing was reported in this period. Choose a later quarter."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" :ticks="4" />
              <Chart.Area v-if="trend.mark === 'area'" />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
      </section>

      <div class="flex min-w-0 flex-col gap-(--spacing-md) xl:col-span-4">
        <CardBox :title="quarter + ' goals'">
          <template #content>
            <ul v-if="loading" aria-busy="true" class="flex flex-col gap-(--spacing-md)">
              <li v-for="index in 5" :key="index" class="flex flex-col gap-(--spacing-xs)">
                <Skeleton width="60%" height="1rem" />
                <Skeleton height="0.5rem" />
                <Skeleton width="40%" height="0.75rem" />
              </li>
            </ul>
            <ul v-else-if="goals.length" class="flex flex-col gap-(--spacing-md)">
              <li v-for="goal in goals" :key="goal.id" class="flex flex-col gap-(--spacing-xs)">
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
                  <span class="truncate text-label-md text-(--text-default)">{{ goal.label }}</span>
                  <Tag :label="goal.status.label" :severity="goal.status.severity" size="small" />
                </div>
                <ProgressBar
                  :value="goal.current"
                  :max="goal.target"
                  size="small"
                  :aria-label="goal.label"
                  :aria-valuetext="formatters[goal.format](goal.current) + ' of ' + formatters[goal.format](goal.target)"
                />
                <div class="flex items-center justify-between gap-(--spacing-sm) text-body-sm text-(--text-muted)">
                  <span class="tabular-nums">
                    {{ formatters[goal.format](goal.current) }} of {{ formatters[goal.format](goal.target) }}
                  </span>
                  <span class="tabular-nums">{{ Math.round((goal.current / goal.target) * 100) }}%</span>
                </div>
              </li>
            </ul>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-flag"
              :title="'No goal results for ' + quarter"
              description="Progress appears once the quarter reports its first month."
            />
          </template>
        </CardBox>

        <CardBox title="Commentary" :padded="false">
          <template #content>
            <Item.List v-if="loading" aria-busy="true">
              <Item v-for="index in 3" :key="index" size="small" role="listitem">
                <Item.Media>
                  <Skeleton kind="circle" width="2rem" height="2rem" />
                </Item.Media>
                <Item.Content class="gap-(--spacing-xs)">
                  <Skeleton width="45%" height="1rem" />
                  <Skeleton height="2.5rem" />
                </Item.Content>
              </Item>
            </Item.List>
            <Item.List v-else-if="notes.length">
              <Item v-for="note in notes" :key="note.id" size="small" role="listitem">
                <Item.Media>
                  <Avatar :label="note.initials" size="medium" />
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ note.author }}</Item.Title>
                  <Item.Description>
                    {{ note.role }} · <time :datetime="note.date">{{ note.dateLabel }}</time>
                  </Item.Description>
                  <p class="mt-(--spacing-xs) text-pretty text-body-sm text-(--text-default)">
                    {{ note.body }}
                  </p>
                </Item.Content>
              </Item>
            </Item.List>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-comment"
              :title="'No notes for ' + quarter"
              description="Leads add notes here when they review the quarter."
            />
          </template>
        </CardBox>
      </div>
    </div>
  </main>
</div>`
