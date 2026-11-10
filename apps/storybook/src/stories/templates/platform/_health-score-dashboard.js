import BarList from '@aziontech/webkit/bar-list'
import CardBox from '@aziontech/webkit/card-box'
import Chart, {
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
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import Skeleton from '@aziontech/webkit/skeleton'
import Tag from '@aziontech/webkit/tag'
import Tracker from '@aziontech/webkit/tracker'
import { computed, ref } from 'vue'

export const HEALTH_COMPONENTS = {
  BarList,
  CardBox,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
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
  'Item.Actions': Item.Actions,
  Select,
  'Select.Trigger': SelectTrigger,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption,
  Skeleton,
  Tag,
  Tracker
}

const IMPORTS = [
  "import BarList from '@aziontech/webkit/bar-list'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Item from '@aziontech/webkit/item'",
  "import Select from '@aziontech/webkit/select'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tracker from '@aziontech/webkit/tracker'",
  "import { computed, ref } from 'vue'"
]

const PERIODS = [
  { label: 'Last hour', phrase: 'the last hour' },
  { label: 'Last 24 hours', phrase: 'the last 24 hours' },
  { label: 'Last 7 days', phrase: 'the last 7 days' }
]

const HOURS = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`)

const OVERALL = [
  84, 85, 86, 86, 85, 84, 82, 79, 74, 71, 73, 76, 78, 77, 75, 72, 70, 74, 78, 81, 83, 84, 85, 84
]

const BANDS = {
  good: { label: 'Good', severity: 'success' },
  fair: { label: 'Fair', severity: 'warning' },
  poor: { label: 'Poor', severity: 'danger' }
}

const bandOf = (score) => {
  if (score >= 80) return BANDS.good
  if (score >= 50) return BANDS.fair
  return BANDS.poor
}

const APPLICATIONS = [
  { id: 'video-calls', name: 'Video calls', cause: 'packet loss', base: 52, dip: 18 },
  { id: 'file-storage', name: 'File storage', cause: 'slow server response', base: 66, dip: 14 },
  { id: 'crm', name: 'CRM', cause: 'slow DNS lookups', base: 74, dip: 10 },
  { id: 'mail', name: 'Mail', cause: 'Wi-Fi signal', base: 83, dip: 8 },
  { id: 'chat', name: 'Chat', cause: 'Wi-Fi signal', base: 88, dip: 6 },
  { id: 'docs', name: 'Docs', cause: 'high latency', base: 91, dip: 4 }
]

const LOCATIONS = [
  { id: 'travel', name: 'Travel', cause: 'high latency', score: 58 },
  { id: 'home', name: 'Home', cause: 'Wi-Fi signal', score: 71 },
  { id: 'south-branch', name: 'South branch', cause: 'packet loss', score: 76 },
  { id: 'north-branch', name: 'North branch', cause: 'slow DNS lookups', score: 84 },
  { id: 'main-office', name: 'Main office', cause: 'slow server response', score: 89 }
]

const hourlyScores = (application) =>
  HOURS.map((_, index) => {
    const busy = index >= 8 && index <= 17
    const swing = Math.round(Math.sin(index * 1.7 + application.base) * 4)
    return Math.max(0, Math.min(100, application.base + (busy ? -application.dip : 6) + swing))
  })

const HOURLY = APPLICATIONS.map((application) => {
  const scores = hourlyScores(application)
  const current = scores[scores.length - 1]
  return {
    id: application.id,
    name: application.name,
    band: bandOf(current),
    blocks: scores.map((score, index) => {
      const band = bandOf(score)
      return {
        id: `${application.id}-${HOURS[index]}`,
        severity: band.severity,
        label: `${HOURS[index]} · ${score} · ${band.label}`
      }
    })
  }
})

const INCIDENTS = [
  {
    id: 'incident-03',
    name: 'Video calls',
    scope: 'Application',
    icon: 'pi pi-th-large',
    devices: 34,
    share: 12,
    cause: 'Packet loss',
    opened: '2026-11-10T09:40:00Z',
    openedLabel: '09:40',
    band: BANDS.poor
  },
  {
    id: 'incident-02',
    name: 'Travel',
    scope: 'Location',
    icon: 'pi pi-map-marker',
    devices: 9,
    share: 31,
    cause: 'High latency',
    opened: '2026-11-10T07:15:00Z',
    openedLabel: '07:15',
    band: BANDS.fair
  },
  {
    id: 'incident-01',
    name: 'File storage',
    scope: 'Application',
    icon: 'pi pi-th-large',
    devices: 18,
    share: 7,
    cause: 'Slow server response',
    opened: '2026-11-10T06:02:00Z',
    openedLabel: '06:02',
    band: BANDS.fair
  }
]

const average = (values) =>
  Math.round(values.reduce((total, value) => total + value, 0) / values.length)

const OVERALL_SCORE = average(OVERALL)

const STATES = {
  default: { loading: false, empty: false, period: 'Last 24 hours' },
  loading: { loading: true, empty: false, period: 'Last 24 hours' },
  empty: { loading: false, empty: true, period: 'Last hour' }
}

const dataFor = (state) => {
  const { loading, empty } = STATES[state]
  return {
    loading,
    periods: PERIODS,
    hours: HOURS,
    overall: empty
      ? { score: null, band: null, cause: '', series: [] }
      : {
          score: OVERALL_SCORE,
          band: bandOf(OVERALL_SCORE),
          cause: 'packet loss',
          series: [{ id: 'score', name: 'Score', values: OVERALL }]
        },
    applications: empty
      ? []
      : APPLICATIONS.map((application) => ({
          id: application.id,
          name: `${application.name} · ${application.cause}`,
          value: average(hourlyScores(application))
        })),
    locations: empty
      ? []
      : LOCATIONS.map((location) => ({
          id: location.id,
          name: `${location.name} · ${location.cause}`,
          value: location.score
        })),
    hourly: empty ? [] : HOURLY,
    incidents: empty ? [] : INCIDENTS
  }
}

const formatScore = (value) => value.toFixed(0)

export const healthSetup = (state) => () => {
  const period = ref(STATES[state].period)
  return {
    ...dataFor(state),
    formatScore,
    period,
    phrase: computed(() => PERIODS.find((option) => option.label === period.value).phrase),
    activeIndex: ref(null)
  }
}

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const healthScript = (state) => {
  const data = dataFor(state)
  return [
    ...IMPORTS,
    '',
    `const loading = ${data.loading}`,
    `const period = ref('${STATES[state].period}')`,
    'const activeIndex = ref(null)',
    '',
    literal('periods', data.periods),
    '',
    'const phrase = computed(() => periods.find((option) => option.label === period.value).phrase)',
    '',
    literal('hours', data.hours),
    '',
    literal('overall', data.overall),
    '',
    literal('applications', data.applications),
    '',
    literal('locations', data.locations),
    '',
    literal('hourly', data.hourly),
    '',
    literal('incidents', data.incidents),
    '',
    'const formatScore = (value) => value.toFixed(0)'
  ]
}

export const HEALTH_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex flex-col gap-(--layout-group-gap)">
    <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow basis-96 flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Experience score</h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          How people experience each application: the overall score, the score per application and location, each hour of the period and the incidents still open.
        </p>
      </div>
      <div class="w-44 shrink-0">
        <Select v-model="period" size="medium">
          <Select.Trigger aria-label="Period" />
          <Select.Content>
            <Select.Option v-for="option in periods" :key="option.label" :value="option.label">
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]">
      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Overall score</ChartCard.Title>
            <Hint text="Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50." />
          </span>
          <ChartCard.Controls>
            <Tag
              v-if="overall.band && !loading"
              :label="overall.band.label"
              :severity="overall.band.severity"
              size="small"
            />
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <div class="grid grid-cols-1 items-center gap-(--spacing-lg) md:grid-cols-[minmax(0,12rem)_1fr]">
            <div v-if="loading" aria-busy="true" class="flex flex-col gap-(--spacing-xs)">
              <Skeleton width="6rem" height="2.5rem" />
              <Skeleton width="80%" height="1rem" />
            </div>
            <div v-else class="flex flex-col gap-(--spacing-xxs)">
              <p class="flex items-baseline gap-(--spacing-xxs)">
                <span class="text-heading-lg tabular-nums text-(--text-default)">
                  {{ overall.score === null ? '–' : formatScore(overall.score) }}
                </span>
                <span class="text-body-sm text-(--text-muted)">/ 100</span>
              </p>
              <p v-if="overall.cause" class="text-pretty text-body-sm text-(--text-muted)">
                Top cause: {{ overall.cause }}
              </p>
            </div>
            <Chart
              v-model:active-index="activeIndex"
              :series="overall.series"
              :labels="hours"
              :min="0"
              :max="100"
              :format-value="formatScore"
              :height="200"
              :empty-title="'No samples in ' + phrase"
              empty-description="Scores appear once devices report their first samples. Choose a longer period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" :ticks="6" />
              <Chart.Line curve="monotone" />
              <Chart.Crosshair />
              <Chart.Tooltip />
            </Chart>
          </div>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Score per application</ChartCard.Title>
            <Hint text="Lowest first, with the cause of most poor samples." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="applications"
            sort="ascending"
            :format-value="formatScore"
            :empty-title="'No application samples in ' + phrase"
            :loading="loading"
            aria-label="Score per application"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Score per location</ChartCard.Title>
            <Hint text="Lowest first, with the cause of most poor samples." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="locations"
            sort="ascending"
            :color="2"
            :format-value="formatScore"
            :empty-title="'No location samples in ' + phrase"
            :loading="loading"
            aria-label="Score per location"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Hourly score</ChartCard.Title>
            <Hint text="One block per hour for each application, colored by its band." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <ul v-if="loading" aria-busy="true" class="flex flex-col gap-(--spacing-sm)">
            <li
              v-for="index in 4"
              :key="index"
              class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
            >
              <Skeleton width="70%" height="1rem" />
              <Tracker :items="[]" loading />
              <Skeleton width="3rem" height="1.25rem" />
            </li>
          </ul>
          <ul v-else-if="hourly.length" class="flex flex-col gap-(--spacing-sm)">
            <li
              v-for="application in hourly"
              :key="application.id"
              class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
            >
              <span class="truncate text-label-md text-(--text-default)">{{ application.name }}</span>
              <Tracker :items="application.blocks" :aria-label="application.name + ', score per hour'" />
              <span class="flex md:justify-end">
                <Tag :label="application.band.label" :severity="application.band.severity" size="small" />
              </span>
            </li>
          </ul>
          <EmptyState
            v-else
            size="small"
            icon="pi pi-chart-bar"
            :title="'No samples in ' + phrase"
            description="Each application gets a row once its first sample arrives. Choose a longer period."
          />
        </ChartCard.Content>
      </ChartCard>
    </div>

    <CardBox title="Open incidents" :padded="false">
      <template #content>
        <Item.List v-if="loading" aria-busy="true">
          <Item v-for="index in 3" :key="index" size="small" role="listitem">
            <Item.Media>
              <Skeleton kind="shape" width="2rem" height="2rem" />
            </Item.Media>
            <Item.Content class="gap-(--spacing-xs)">
              <Skeleton width="30%" height="1rem" />
              <Skeleton width="55%" height="0.75rem" />
            </Item.Content>
          </Item>
        </Item.List>
        <Item.List v-else-if="incidents.length">
          <Item v-for="incident in incidents" :key="incident.id" size="small" role="listitem">
            <Item.Media kind="icon">
              <i :class="incident.icon" aria-hidden="true" />
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ incident.name }} · {{ incident.cause }}</Item.Title>
              <Item.Description>
                {{ incident.scope }} · {{ incident.devices }} devices, {{ incident.share }}% of samples · Opened
                <time :datetime="incident.opened">{{ incident.openedLabel }}</time>
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <Tag :label="incident.band.label" :severity="incident.band.severity" size="small" />
            </Item.Actions>
          </Item>
        </Item.List>
        <div v-else class="p-(--spacing-md)">
          <EmptyState
            size="small"
            icon="pi pi-check-circle"
            :title="'No open incidents in ' + phrase"
            description="An incident opens when an application or a location stays poor for several samples in a row."
          />
        </div>
      </template>
    </CardBox>
  </main>
</div>`
