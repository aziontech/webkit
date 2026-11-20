# DashboardHealthScore (`dashboard/dashboard-health-score`)

> A health score dashboard: how well something performs for the people who use it, read as one score out of 100 and its bands. A page heading with the period Select sits over the overall score, a ChartCard with the figure, its band Tag (Good at 80 or more, Fair from 50 to 79, Poor under 50), the top cause of poor samples and a Line Chart of the score per hour. Two ChartCards rank the score per application and per location in a BarList, lowest first, each row naming its top cause. An hourly score card gives every application a Tracker strip, one block per hour colored by band, with its current band Tag at the end of the row. Under the grid, a Card lists the open incidents as Item rows: what is affected, the cause, how many devices and what share of samples, when it opened, and its band. Built from `BarList`, `Card`, `Chart`, `ChartCard`, `EmptyState`, `Hint`, `Item`, `PageHeader`, `Select`, `Skeleton`, `StatTile`, `Tag`, `Tracker` and `Alert`. The RealUser variant shows the real-user web vitals behind such a score: median page load time, largest contentful paint, first input delay and sessions, with a trend tile per vital. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-health-score/dashboard-health-score.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-health-score")`
- Components: [Alert](../../components/alert.md), [BarList](../../components/bar-list.md), [Card](../../components/card.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [Item](../../components/item.md), [PageHeader](../../components/page-header.md), [Select](../../components/select.md), [Skeleton](../../components/skeleton.md), [StatTile](../../components/stat-tile.md), [Tag](../../components/tag.md), [Tracker](../../components/tracker.md), `use-locale`
- Skills: `webkit-data-viz`, `webkit-ui-states`

## Asked as

health score; health dashboard; performance score; web vitals; score bands; quality score; pontuação de saúde; painel de saúde; nota de desempenho; real user monitoring; rum; core web vitals; page load time; monitoramento de usuário real; banded score

The page that answers "how well does this work for the people who use it, and where is it worst?".
Experience is reduced to one score out of 100 with three bands (Good at 80 or more, Fair from 50 to 79,
Poor under 50). The page shows the overall score and its trend, ranks applications and locations
lowest first with the top cause of poor samples, gives each application an hour-by-hour strip, and ends
in the open incidents that need someone's attention.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-health-score when many signals roll up into one banded score (including real-user web vitals).
- Many raw signals (latency, packet loss, DNS time, Wi-Fi signal) are combined into one score the
  reader can act on.
- The score has fixed bands that mean the same thing everywhere on the page.
- The reader's job is to find the worst application or place and the cause behind it.

## When not to use

- The raw metrics themselves (p50, p95, error rate) matter more than a score: use
  `dashboard/dashboard-service-monitoring`.
- A pass or fail verdict per item: use `dashboard/dashboard-scan-results`.
- Alerts triaged by severity: use `dashboard/dashboard-alerts`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Experience score` with one sentence on what it measures. Actions hold the period.

### B. Period — `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

`Last hour`, `Last 24 hours`, `Last 7 days`, labelled `Period`. Empty states name the period back to
the reader.

### C. Cards — `ChartCard` (required)

`Overall score` spans the grid; `Score per application` and `Score per location` share a row;
`Hourly score` follows.

### D. Definitions — `Hint` (required)

The overall score's `Hint` states the bands:
`Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50.`

### E. Overall figure — `StatTile` (required)

The overall score as a `StatTile` with `variant="sans"`, labelled `Overall score`, the unit `/ 100` and
no delta, with the top cause of poor samples under it. The tile owns its loading Skeleton and prints
a dash when the period has no score; never hand-build the figure.

### F. Band — `Tag` (required)

The band word (`Good`, `Fair`, `Poor`) with its status severity, beside the overall score, at the end
of every hourly row and on each incident. The band is always written; color reinforces it.

### G. Loading placeholders — `Skeleton` (required)

Holds the hourly row labels, band tags and incident rows while the period loads.

### H. Score per hour — `Chart` (required)

A line of the overall score per hour beside the figure and the top cause of poor samples.

### I. Rankings — `BarList` (required)

Score per application and per location, sorted lowest first, because the reader looks for the worst.
Each row names its top cause (`Video calls · packet loss`).

### J. Hourly strips — `Tracker` (required)

One strip per application, one block per hour colored by band, with an `aria-label`
(`Video calls, score per hour`) and a label on each block (`08:00 · 35 · Poor`).

### K. Empty regions — `EmptyState` (required)

Every region names the period and what fills it: `No samples in the last 24 hours` /
`Scores appear once devices report their first samples. Select a longer period.`

### L. Open incidents — `Card` (required)

A card titled `Open incidents` under the grid.

### M. Incident rows — `Item` (required)

One `Item` per incident, with `href` to the incident's page (`/incidents/incident-03`) so the whole row
is a link: what is affected, the cause, how many devices and what share of samples, when it opened,
and its band.

### N. Real-user monitoring — `PageHeader`, `Select`, `StatTile`, `Hint` (optional)

Variant RealUser only: the timings measured in the reader's browsers that such a score is built
from. Title `Real-user monitoring`, and a medium Period `Select` (`Last hour`, `Last 24 hours`,
`Last 7 days`, `Last 30 days`) in the `PageHeader` actions drives every figure. Four vitals
`StatTile`s (`variant="sans"`) lead: `Page load time`, `Largest contentful paint`, `First input delay`,
`Sessions`, each a median value beside its unit (`s`, `ms`, `K`) with no delta, and a `Hint` in the
aside that defines the timing. Under them, a two-column grid of trend `StatTile`s, one per vital,
each with the latest value, its unit, a sparkline of the period and the period name in the aside.
A timing has no "previous period" the reader acts on here, so these tiles carry no delta and no
`inverse`.

### O. Load failure — `Alert` (required)

With `error` set, a danger `Alert` with Retry takes the place of each region's content, naming what
did not load (`Couldn't load overall score.`); the score shows a dash with no band.

## Data

The block takes its records through props and emits every action; it fetches nothing. `HealthScoreOverall`, `HealthScoreHourlyRow`, `HealthScoreIncident`, `HealthScoreBand`, `HealthScorePeriod` and `HealthScoreDashboardProps` are exported from `dashboard-health-score.vue`, and `sample.ts` holds the sample score, rankings, hourly rows and incidents the block renders when a data prop is left out (and never while `loading` or `error` is set). The RealUser variant is a separate page and keeps its own sample figures.

| Prop / model     | Type                     | What it does                                                                                                               |
| ---------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `overall`        | `HealthScoreOverall`     | The score, its band, the top cause and the score line with its labels. `score: null` shows a dash, no band.                |
| `applications`   | `BarListItem[]`          | Score per application, lowest first; the cause goes in the name (`Video calls · packet loss`).                             |
| `locations`      | `BarListItem[]`          | Score per location, the same shape.                                                                                        |
| `hourly`         | `HealthScoreHourlyRow[]` | One tracker row per application with one block per hour.                                                                   |
| `incidents`      | `HealthScoreIncident[]`  | The incidents still open, each linking to `/incidents/<id>`. Pass `[]` for `No open incidents`.                            |
| `loading`        | `boolean`                | The period is loading: every region shows its Skeleton.                                                                    |
| `error`          | `string`                 | Why the request failed, shown after `Couldn't load overall score.` (hourly score, open incidents…) in each danger `Alert`. |
| `v-model:period` | `HealthScorePeriod`      | The period every region reads and the empty states name; refetch when it changes. Defaults to `Last 24 hours`.             |

| Event   | Payload   | When                              |
| ------- | --------- | --------------------------------- |
| `retry` | `(event)` | Retry in any of the error alerts. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import DashboardHealthScore, { type HealthScorePeriod } from './dashboard-health-score.vue'

  const period = ref<HealthScorePeriod>('Last 24 hours')
  const { data, pending, error, refresh } = useExperienceScore(period)
</script>

<template>
  <DashboardHealthScore
    v-model:period="period"
    :overall="data?.overall"
    :applications="data?.applications ?? []"
    :locations="data?.locations ?? []"
    :hourly="data?.hourly ?? []"
    :incidents="data?.incidents ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Use the same three bands, with the same thresholds and words, in every region.
- Sort rankings lowest first.
- Name the top cause next to every poor score, so the reader knows what to fix.
- State the band thresholds in the overall `Hint`.

## Don't

- Don't show a score without its band word.
- Don't use the status colors for anything other than the bands on this page.
- Don't average away the worst hour; the hourly strip exists to show it.
- Don't sort rankings best first.

## Copy

- **Title:** `Experience score`.
- **Band words:** one word each. `Good`, `Fair`, `Poor`.
- **Cause:** subject, a middle dot, the cause in lowercase. `CRM · slow DNS lookups`.
- **RealUser:** title `Real-user monitoring`, description `Real-user timings collected in the browser, for the selected period.`; tile labels are the timing in sentence case (`First input delay`); the aside of a trend tile is the period name (`Last 24 hours`).
- **Empty state:** name the period. `No open incidents in the last 24 hours` / `An incident opens when an application or a location stays poor for several samples in a row.`

## Accessibility

- Each `Tracker` has an `aria-label` naming its application, and each block a label with time, score and band.
- Bands are always words; the strip is never color alone.
- Rankings carry an `aria-label` (`Score per application`, `Score per location`).
- Loading regions set `aria-busy="true"`.
- Scores use `tabular-nums`.

## States

- Default: the scored period.
- Loading: `loading`; the chart, rankings and trackers render their own `Skeleton`; incidents hold Skeleton rows.
- Empty: a period with no samples (`overall.score: null`, every list `[]`); the score shows a dash with no band, and every region keeps its box with an empty state that names the period and says what fills it.
- RealUser: the real-user monitoring page; the vitals and the trend tiles follow the Period select.
- Error: `error`; the score shows a dash, and every region keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `dashboard/dashboard-service-monitoring` — the raw latency and error metrics.
- `dashboard/dashboard-alerts` — when incidents are triaged as alerts by severity.
- `Tracker` — hour-by-hour status strips.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the period loads, the chart, the rankings and the trackers render their own Skeleton and the incidents hold Skeleton rows, so the page does not reflow when data arrives.
- `Empty` — A period with no samples. The score shows a dash with no band, and every region keeps its box with an empty state that names the period and says what fills it.
- `Error` — The request for the period failed: the score shows a dash, and every card keeps its header with a danger Alert that names what did not load and offers Retry.
- `RealUser` — Real-user monitoring: a Period Select in the header drives four vitals StatTiles (page load time, largest contentful paint, first input delay, sessions) that read a median value beside its unit with no delta and a Hint on the label, over a two-column grid of trend StatTiles with the latest value, a sparkline of the period and the period name in the aside.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-health-score", { variant })`, or the file under `blocks/dashboard/dashboard-health-score/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Tracker, { type TrackerItem } from '@aziontech/webkit/tracker'
  import { computed, ref } from 'vue'

  import {
    sampleApplications,
    sampleHourly,
    sampleIncidents,
    sampleLocations,
    sampleOverall
  } from './sample'

  /** The period every region reads. */
  export type HealthScorePeriod = 'Last hour' | 'Last 24 hours' | 'Last 7 days'

  /** A score band in words with its color. */
  export interface HealthScoreBand {
    /** Good, Fair or Poor. */
    label: string
    /** The band color. */
    severity: TagSeverity
  }

  /** The overall score of the period. */
  export interface HealthScoreOverall {
    /** Average score out of 100; null when the period has no samples. */
    score: number | null
    /** The band of the score; null when the period has no samples. */
    band: HealthScoreBand | null
    /** The cause of most poor samples, lowercase; empty hides the line. */
    cause: string
    /** One label per point of the chart. */
    labels: string[]
    /** The score line over the period. */
    series: ChartSeries[]
  }

  /** One application row of the Hourly score tracker. */
  export interface HealthScoreHourlyRow {
    /** Stable key. */
    id: string
    /** Application name. */
    name: string
    /** The band of the application over the period. */
    band: HealthScoreBand
    /** One block per hour, colored by its band. */
    blocks: TrackerItem[]
  }

  /** One open incident. */
  export interface HealthScoreIncident {
    /** Stable key, used in the incident link. */
    id: string
    /** The application or location affected. */
    name: string
    /** Application or Location. */
    scope: string
    /** Icon class of the scope. */
    icon: string
    /** Devices affected. */
    devices: number
    /** Share of the samples affected, in percent. */
    share: number
    /** What causes the poor samples. */
    cause: string
    /** When it opened, as an ISO date. */
    opened: string
    /** When it opened, as shown. */
    openedLabel: string
    /** The band of the affected samples. */
    band: HealthScoreBand
  }

  export interface HealthScoreDashboardProps {
    /** The overall score and its line. Left out, the sample renders. */
    overall?: HealthScoreOverall
    /** Score per application, with its top cause in the name. Left out, the sample renders. */
    applications?: BarListItem[]
    /** Score per location, with its top cause in the name. Left out, the sample renders. */
    locations?: BarListItem[]
    /** One tracker row per application. Left out, the sample renders. */
    hourly?: HealthScoreHourlyRow[]
    /** The incidents still open; pass an empty list when none is. Left out, the sample renders. */
    incidents?: HealthScoreIncident[]
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<HealthScoreDashboardProps>(), {
    overall: undefined,
    applications: undefined,
    locations: undefined,
    hourly: undefined,
    incidents: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  const period = defineModel<HealthScorePeriod>('period', { default: 'Last 24 hours' })

  const blocked = computed(() => props.loading || props.error !== '')
  const noScore: HealthScoreOverall = { score: null, band: null, cause: '', labels: [], series: [] }
  const overall = computed(() => props.overall ?? (blocked.value ? noScore : sampleOverall))
  const applications = computed(
    () => props.applications ?? (blocked.value ? [] : sampleApplications)
  )
  const locations = computed(() => props.locations ?? (blocked.value ? [] : sampleLocations))
  const hourly = computed(() => props.hourly ?? (blocked.value ? [] : sampleHourly))
  const incidents = computed(() => props.incidents ?? (blocked.value ? [] : sampleIncidents))

  const activeIndex = ref<number | null>(null)

  const periods: { label: HealthScorePeriod; phrase: string }[] = [
    {
      label: 'Last hour',
      phrase: 'the last hour'
    },
    {
      label: 'Last 24 hours',
      phrase: 'the last 24 hours'
    },
    {
      label: 'Last 7 days',
      phrase: 'the last 7 days'
    }
  ]

  const phrase = computed(
    () => periods.find((option) => option.label === period.value)?.phrase ?? ''
  )

  const formatScore = (value: number) => value.toFixed(0)
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Experience score"
        description="How people experience each application: the overall score, the score per application and location, each hour of the period and the incidents still open."
      >
        <template #actions>
          <div class="w-44 shrink-0">
            <Select
              variant="ghost"
              v-model="period"
              size="medium"
            >
              <Select.Trigger aria-label="Period" />
              <Select.Content>
                <Select.Item
                  v-for="option in periods"
                  :key="option.label"
                  :value="option.label"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
        </template>
      </PageHeader>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Overall score</ChartCard.Title>
              <Hint
                content="Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50."
              />
            </span>
            <ChartCard.Action>
              <Tag
                v-if="overall.band && !loading"
                :label="overall.band.label"
                :severity="overall.band.severity"
                size="small"
              />
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load overall score. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else
              class="grid grid-cols-1 items-center gap-(--spacing-lg) md:grid-cols-[minmax(0,12rem)_1fr]"
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                <StatTile
                  label="Overall score"
                  variant="sans"
                  unit="/ 100"
                  :value="overall.score"
                  :format-value="formatScore"
                  :loading="loading"
                  :error="error"
                />
                <p
                  v-if="overall.cause && !loading"
                  class="text-pretty text-body-sm text-(--text-muted)"
                >
                  Top cause: {{ overall.cause }}
                </p>
              </div>
              <Chart
                v-model:active-index="activeIndex"
                :series="overall.series"
                :labels="overall.labels"
                :min="0"
                :max="100"
                :format-value="formatScore"
                :height="200"
                :empty-title="'No samples in ' + phrase"
                empty-description="Scores appear once devices report their first samples. Select a longer period."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis
                  type="x"
                  :ticks="6"
                />
                <Chart.Line curve="monotone" />
                <Chart.Crosshair />
                <Chart.Tooltip />
              </Chart>
            </div>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Score per application</ChartCard.Title>
              <Hint content="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load score per application. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Score per location</ChartCard.Title>
              <Hint content="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load score per location. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Hourly score</ChartCard.Title>
              <Hint content="One block per hour for each application, colored by its band." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load hourly score. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <ul
              v-else-if="loading"
              aria-busy="true"
              class="flex flex-col gap-(--spacing-sm)"
            >
              <li
                v-for="index in 4"
                :key="index"
                class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
              >
                <Skeleton
                  width="70%"
                  height="1rem"
                />
                <Tracker
                  :items="[]"
                  loading
                />
                <Skeleton
                  width="3rem"
                  height="1.25rem"
                />
              </li>
            </ul>
            <ul
              v-else-if="hourly.length"
              class="flex flex-col gap-(--spacing-sm)"
            >
              <li
                v-for="application in hourly"
                :key="application.id"
                class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
              >
                <span class="truncate text-label-md text-(--text-default)">{{
                  application.name
                }}</span>
                <Tracker
                  :items="application.blocks"
                  :aria-label="application.name + ', score per hour'"
                />
                <span class="flex md:justify-end">
                  <Tag
                    :label="application.band.label"
                    :severity="application.band.severity"
                    size="small"
                  />
                </span>
              </li>
            </ul>
            <EmptyState
              v-else
              size="small"
              icon="az az-chart-bar"
              :title="'No samples in ' + phrase"
              description="Each application gets a row once its first sample arrives. Select a longer period."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>

      <Card
        title="Open incidents"
        :padded="error !== ''"
      >
        <template #default>
          <Alert
            v-if="error"
            severity="danger"
            :label="`Couldn't load open incidents. ${error}`"
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
          <Item.List
            v-else-if="loading"
            key="item.list-1"
            aria-busy="true"
          >
            <Item
              v-for="index in 3"
              :key="index"
              size="small"
              role="listitem"
            >
              <Item.Media>
                <Skeleton
                  variant="rectangle"
                  width="2rem"
                  height="2rem"
                />
              </Item.Media>
              <Item.Content>
                <div class="flex flex-col gap-(--spacing-xs)">
                  <Skeleton
                    width="30%"
                    height="1rem"
                  />
                  <Skeleton
                    width="55%"
                    height="0.75rem"
                  />
                </div>
              </Item.Content>
            </Item>
          </Item.List>
          <Item.List
            key="item.list-2"
            v-else-if="incidents.length"
          >
            <Item
              v-for="incident in incidents"
              :key="incident.id"
              :href="`/incidents/${incident.id}`"
              size="small"
            >
              <Item.Media type="icon">
                <i
                  :class="incident.icon"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ incident.name }} · {{ incident.cause }}</Item.Title>
                <Item.Description>
                  {{ incident.scope }} · {{ incident.devices }} devices, {{ incident.share }}% of
                  samples · Opened
                  <time :datetime="incident.opened">{{ incident.openedLabel }}</time>
                </Item.Description>
              </Item.Content>
              <Item.Actions>
                <Tag
                  :label="incident.band.label"
                  :severity="incident.band.severity"
                  size="small"
                />
              </Item.Actions>
            </Item>
          </Item.List>
          <div
            v-else
            class="p-(--spacing-md)"
          >
            <EmptyState
              size="small"
              icon="az az-circle-check"
              :title="'No open incidents in ' + phrase"
              description="An incident opens when an application or a location stays poor for several samples in a row."
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { BarListItem } from '@aziontech/webkit/bar-list'

import type {
  HealthScoreHourlyRow,
  HealthScoreIncident,
  HealthScoreOverall
} from './dashboard-health-score.vue'

const hours: string[] = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
]

export const sampleOverall: HealthScoreOverall = {
  score: 79,
  band: {
    label: 'Fair',
    severity: 'warning'
  },
  cause: 'packet loss',
  labels: hours,
  series: [
    {
      id: 'score',
      name: 'Score',
      values: [
        84, 85, 86, 86, 85, 84, 82, 79, 74, 71, 73, 76, 78, 77, 75, 72, 70, 74, 78, 81, 83, 84, 85,
        84
      ]
    }
  ]
}

export const sampleApplications: BarListItem[] = [
  {
    id: 'video-calls',
    name: 'Video calls · packet loss',
    value: 48
  },
  {
    id: 'file-storage',
    name: 'File storage · slow server response',
    value: 64
  },
  {
    id: 'crm',
    name: 'CRM · slow DNS lookups',
    value: 73
  },
  {
    id: 'mail',
    name: 'Mail · Wi-Fi signal',
    value: 83
  },
  {
    id: 'chat',
    name: 'Chat · Wi-Fi signal',
    value: 89
  },
  {
    id: 'docs',
    name: 'Docs · high latency',
    value: 93
  }
]

export const sampleLocations: BarListItem[] = [
  {
    id: 'travel',
    name: 'Travel · high latency',
    value: 58
  },
  {
    id: 'home',
    name: 'Home · Wi-Fi signal',
    value: 71
  },
  {
    id: 'south-branch',
    name: 'South branch · packet loss',
    value: 76
  },
  {
    id: 'north-branch',
    name: 'North branch · slow DNS lookups',
    value: 84
  },
  {
    id: 'main-office',
    name: 'Main office · slow server response',
    value: 89
  }
]

export const sampleHourly: HealthScoreHourlyRow[] = [
  {
    id: 'video-calls',
    name: 'Video calls',
    band: {
      label: 'Fair',
      severity: 'warning'
    },
    blocks: [
      {
        id: 'video-calls-00:00',
        severity: 'warning',
        label: '00:00 · 62 · Fair'
      },
      {
        id: 'video-calls-01:00',
        severity: 'warning',
        label: '01:00 · 57 · Fair'
      },
      {
        id: 'video-calls-02:00',
        severity: 'warning',
        label: '02:00 · 54 · Fair'
      },
      {
        id: 'video-calls-03:00',
        severity: 'warning',
        label: '03:00 · 60 · Fair'
      },
      {
        id: 'video-calls-04:00',
        severity: 'warning',
        label: '04:00 · 61 · Fair'
      },
      {
        id: 'video-calls-05:00',
        severity: 'warning',
        label: '05:00 · 55 · Fair'
      },
      {
        id: 'video-calls-06:00',
        severity: 'warning',
        label: '06:00 · 56 · Fair'
      },
      {
        id: 'video-calls-07:00',
        severity: 'warning',
        label: '07:00 · 62 · Fair'
      },
      {
        id: 'video-calls-08:00',
        severity: 'danger',
        label: '08:00 · 35 · Poor'
      },
      {
        id: 'video-calls-09:00',
        severity: 'danger',
        label: '09:00 · 30 · Poor'
      },
      {
        id: 'video-calls-10:00',
        severity: 'danger',
        label: '10:00 · 34 · Poor'
      },
      {
        id: 'video-calls-11:00',
        severity: 'danger',
        label: '11:00 · 38 · Poor'
      },
      {
        id: 'video-calls-12:00',
        severity: 'danger',
        label: '12:00 · 33 · Poor'
      },
      {
        id: 'video-calls-13:00',
        severity: 'danger',
        label: '13:00 · 30 · Poor'
      },
      {
        id: 'video-calls-14:00',
        severity: 'danger',
        label: '14:00 · 36 · Poor'
      },
      {
        id: 'video-calls-15:00',
        severity: 'danger',
        label: '15:00 · 37 · Poor'
      },
      {
        id: 'video-calls-16:00',
        severity: 'danger',
        label: '16:00 · 32 · Poor'
      },
      {
        id: 'video-calls-17:00',
        severity: 'danger',
        label: '17:00 · 31 · Poor'
      },
      {
        id: 'video-calls-18:00',
        severity: 'warning',
        label: '18:00 · 61 · Fair'
      },
      {
        id: 'video-calls-19:00',
        severity: 'warning',
        label: '19:00 · 60 · Fair'
      },
      {
        id: 'video-calls-20:00',
        severity: 'warning',
        label: '20:00 · 54 · Fair'
      },
      {
        id: 'video-calls-21:00',
        severity: 'warning',
        label: '21:00 · 57 · Fair'
      },
      {
        id: 'video-calls-22:00',
        severity: 'warning',
        label: '22:00 · 62 · Fair'
      },
      {
        id: 'video-calls-23:00',
        severity: 'warning',
        label: '23:00 · 58 · Fair'
      }
    ]
  },
  {
    id: 'file-storage',
    name: 'File storage',
    band: {
      label: 'Fair',
      severity: 'warning'
    },
    blocks: [
      {
        id: 'file-storage-00:00',
        severity: 'warning',
        label: '00:00 · 72 · Fair'
      },
      {
        id: 'file-storage-01:00',
        severity: 'warning',
        label: '01:00 · 68 · Fair'
      },
      {
        id: 'file-storage-02:00',
        severity: 'warning',
        label: '02:00 · 73 · Fair'
      },
      {
        id: 'file-storage-03:00',
        severity: 'warning',
        label: '03:00 · 76 · Fair'
      },
      {
        id: 'file-storage-04:00',
        severity: 'warning',
        label: '04:00 · 70 · Fair'
      },
      {
        id: 'file-storage-05:00',
        severity: 'warning',
        label: '05:00 · 69 · Fair'
      },
      {
        id: 'file-storage-06:00',
        severity: 'warning',
        label: '06:00 · 75 · Fair'
      },
      {
        id: 'file-storage-07:00',
        severity: 'warning',
        label: '07:00 · 74 · Fair'
      },
      {
        id: 'file-storage-08:00',
        severity: 'danger',
        label: '08:00 · 49 · Poor'
      },
      {
        id: 'file-storage-09:00',
        severity: 'warning',
        label: '09:00 · 51 · Fair'
      },
      {
        id: 'file-storage-10:00',
        severity: 'warning',
        label: '10:00 · 56 · Fair'
      },
      {
        id: 'file-storage-11:00',
        severity: 'warning',
        label: '11:00 · 52 · Fair'
      },
      {
        id: 'file-storage-12:00',
        severity: 'danger',
        label: '12:00 · 48 · Poor'
      },
      {
        id: 'file-storage-13:00',
        severity: 'warning',
        label: '13:00 · 53 · Fair'
      },
      {
        id: 'file-storage-14:00',
        severity: 'warning',
        label: '14:00 · 56 · Fair'
      },
      {
        id: 'file-storage-15:00',
        severity: 'warning',
        label: '15:00 · 50 · Fair'
      },
      {
        id: 'file-storage-16:00',
        severity: 'danger',
        label: '16:00 · 49 · Poor'
      },
      {
        id: 'file-storage-17:00',
        severity: 'warning',
        label: '17:00 · 54 · Fair'
      },
      {
        id: 'file-storage-18:00',
        severity: 'warning',
        label: '18:00 · 75 · Fair'
      },
      {
        id: 'file-storage-19:00',
        severity: 'warning',
        label: '19:00 · 69 · Fair'
      },
      {
        id: 'file-storage-20:00',
        severity: 'warning',
        label: '20:00 · 70 · Fair'
      },
      {
        id: 'file-storage-21:00',
        severity: 'warning',
        label: '21:00 · 76 · Fair'
      },
      {
        id: 'file-storage-22:00',
        severity: 'warning',
        label: '22:00 · 73 · Fair'
      },
      {
        id: 'file-storage-23:00',
        severity: 'warning',
        label: '23:00 · 68 · Fair'
      }
    ]
  },
  {
    id: 'crm',
    name: 'CRM',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'crm-00:00',
        severity: 'warning',
        label: '00:00 · 76 · Fair'
      },
      {
        id: 'crm-01:00',
        severity: 'success',
        label: '01:00 · 81 · Good'
      },
      {
        id: 'crm-02:00',
        severity: 'success',
        label: '02:00 · 84 · Good'
      },
      {
        id: 'crm-03:00',
        severity: 'warning',
        label: '03:00 · 78 · Fair'
      },
      {
        id: 'crm-04:00',
        severity: 'warning',
        label: '04:00 · 77 · Fair'
      },
      {
        id: 'crm-05:00',
        severity: 'success',
        label: '05:00 · 83 · Good'
      },
      {
        id: 'crm-06:00',
        severity: 'success',
        label: '06:00 · 82 · Good'
      },
      {
        id: 'crm-07:00',
        severity: 'warning',
        label: '07:00 · 76 · Fair'
      },
      {
        id: 'crm-08:00',
        severity: 'warning',
        label: '08:00 · 63 · Fair'
      },
      {
        id: 'crm-09:00',
        severity: 'warning',
        label: '09:00 · 68 · Fair'
      },
      {
        id: 'crm-10:00',
        severity: 'warning',
        label: '10:00 · 64 · Fair'
      },
      {
        id: 'crm-11:00',
        severity: 'warning',
        label: '11:00 · 60 · Fair'
      },
      {
        id: 'crm-12:00',
        severity: 'warning',
        label: '12:00 · 65 · Fair'
      },
      {
        id: 'crm-13:00',
        severity: 'warning',
        label: '13:00 · 68 · Fair'
      },
      {
        id: 'crm-14:00',
        severity: 'warning',
        label: '14:00 · 62 · Fair'
      },
      {
        id: 'crm-15:00',
        severity: 'warning',
        label: '15:00 · 61 · Fair'
      },
      {
        id: 'crm-16:00',
        severity: 'warning',
        label: '16:00 · 66 · Fair'
      },
      {
        id: 'crm-17:00',
        severity: 'warning',
        label: '17:00 · 67 · Fair'
      },
      {
        id: 'crm-18:00',
        severity: 'warning',
        label: '18:00 · 77 · Fair'
      },
      {
        id: 'crm-19:00',
        severity: 'warning',
        label: '19:00 · 78 · Fair'
      },
      {
        id: 'crm-20:00',
        severity: 'success',
        label: '20:00 · 84 · Good'
      },
      {
        id: 'crm-21:00',
        severity: 'success',
        label: '21:00 · 81 · Good'
      },
      {
        id: 'crm-22:00',
        severity: 'warning',
        label: '22:00 · 76 · Fair'
      },
      {
        id: 'crm-23:00',
        severity: 'success',
        label: '23:00 · 80 · Good'
      }
    ]
  },
  {
    id: 'mail',
    name: 'Mail',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'mail-00:00',
        severity: 'success',
        label: '00:00 · 93 · Good'
      },
      {
        id: 'mail-01:00',
        severity: 'success',
        label: '01:00 · 89 · Good'
      },
      {
        id: 'mail-02:00',
        severity: 'success',
        label: '02:00 · 85 · Good'
      },
      {
        id: 'mail-03:00',
        severity: 'success',
        label: '03:00 · 90 · Good'
      },
      {
        id: 'mail-04:00',
        severity: 'success',
        label: '04:00 · 93 · Good'
      },
      {
        id: 'mail-05:00',
        severity: 'success',
        label: '05:00 · 87 · Good'
      },
      {
        id: 'mail-06:00',
        severity: 'success',
        label: '06:00 · 86 · Good'
      },
      {
        id: 'mail-07:00',
        severity: 'success',
        label: '07:00 · 91 · Good'
      },
      {
        id: 'mail-08:00',
        severity: 'warning',
        label: '08:00 · 78 · Fair'
      },
      {
        id: 'mail-09:00',
        severity: 'warning',
        label: '09:00 · 72 · Fair'
      },
      {
        id: 'mail-10:00',
        severity: 'warning',
        label: '10:00 · 73 · Fair'
      },
      {
        id: 'mail-11:00',
        severity: 'warning',
        label: '11:00 · 79 · Fair'
      },
      {
        id: 'mail-12:00',
        severity: 'warning',
        label: '12:00 · 76 · Fair'
      },
      {
        id: 'mail-13:00',
        severity: 'warning',
        label: '13:00 · 71 · Fair'
      },
      {
        id: 'mail-14:00',
        severity: 'warning',
        label: '14:00 · 75 · Fair'
      },
      {
        id: 'mail-15:00',
        severity: 'warning',
        label: '15:00 · 79 · Fair'
      },
      {
        id: 'mail-16:00',
        severity: 'warning',
        label: '16:00 · 74 · Fair'
      },
      {
        id: 'mail-17:00',
        severity: 'warning',
        label: '17:00 · 71 · Fair'
      },
      {
        id: 'mail-18:00',
        severity: 'success',
        label: '18:00 · 91 · Good'
      },
      {
        id: 'mail-19:00',
        severity: 'success',
        label: '19:00 · 92 · Good'
      },
      {
        id: 'mail-20:00',
        severity: 'success',
        label: '20:00 · 86 · Good'
      },
      {
        id: 'mail-21:00',
        severity: 'success',
        label: '21:00 · 86 · Good'
      },
      {
        id: 'mail-22:00',
        severity: 'success',
        label: '22:00 · 92 · Good'
      },
      {
        id: 'mail-23:00',
        severity: 'success',
        label: '23:00 · 91 · Good'
      }
    ]
  },
  {
    id: 'chat',
    name: 'Chat',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'chat-00:00',
        severity: 'success',
        label: '00:00 · 94 · Good'
      },
      {
        id: 'chat-01:00',
        severity: 'success',
        label: '01:00 · 98 · Good'
      },
      {
        id: 'chat-02:00',
        severity: 'success',
        label: '02:00 · 93 · Good'
      },
      {
        id: 'chat-03:00',
        severity: 'success',
        label: '03:00 · 90 · Good'
      },
      {
        id: 'chat-04:00',
        severity: 'success',
        label: '04:00 · 96 · Good'
      },
      {
        id: 'chat-05:00',
        severity: 'success',
        label: '05:00 · 97 · Good'
      },
      {
        id: 'chat-06:00',
        severity: 'success',
        label: '06:00 · 91 · Good'
      },
      {
        id: 'chat-07:00',
        severity: 'success',
        label: '07:00 · 92 · Good'
      },
      {
        id: 'chat-08:00',
        severity: 'success',
        label: '08:00 · 86 · Good'
      },
      {
        id: 'chat-09:00',
        severity: 'success',
        label: '09:00 · 83 · Good'
      },
      {
        id: 'chat-10:00',
        severity: 'warning',
        label: '10:00 · 78 · Fair'
      },
      {
        id: 'chat-11:00',
        severity: 'success',
        label: '11:00 · 82 · Good'
      },
      {
        id: 'chat-12:00',
        severity: 'success',
        label: '12:00 · 86 · Good'
      },
      {
        id: 'chat-13:00',
        severity: 'success',
        label: '13:00 · 81 · Good'
      },
      {
        id: 'chat-14:00',
        severity: 'warning',
        label: '14:00 · 78 · Fair'
      },
      {
        id: 'chat-15:00',
        severity: 'success',
        label: '15:00 · 84 · Good'
      },
      {
        id: 'chat-16:00',
        severity: 'success',
        label: '16:00 · 85 · Good'
      },
      {
        id: 'chat-17:00',
        severity: 'success',
        label: '17:00 · 80 · Good'
      },
      {
        id: 'chat-18:00',
        severity: 'success',
        label: '18:00 · 91 · Good'
      },
      {
        id: 'chat-19:00',
        severity: 'success',
        label: '19:00 · 97 · Good'
      },
      {
        id: 'chat-20:00',
        severity: 'success',
        label: '20:00 · 96 · Good'
      },
      {
        id: 'chat-21:00',
        severity: 'success',
        label: '21:00 · 90 · Good'
      },
      {
        id: 'chat-22:00',
        severity: 'success',
        label: '22:00 · 93 · Good'
      },
      {
        id: 'chat-23:00',
        severity: 'success',
        label: '23:00 · 98 · Good'
      }
    ]
  },
  {
    id: 'docs',
    name: 'Docs',
    band: {
      label: 'Good',
      severity: 'success'
    },
    blocks: [
      {
        id: 'docs-00:00',
        severity: 'success',
        label: '00:00 · 97 · Good'
      },
      {
        id: 'docs-01:00',
        severity: 'success',
        label: '01:00 · 93 · Good'
      },
      {
        id: 'docs-02:00',
        severity: 'success',
        label: '02:00 · 98 · Good'
      },
      {
        id: 'docs-03:00',
        severity: 'success',
        label: '03:00 · 100 · Good'
      },
      {
        id: 'docs-04:00',
        severity: 'success',
        label: '04:00 · 95 · Good'
      },
      {
        id: 'docs-05:00',
        severity: 'success',
        label: '05:00 · 94 · Good'
      },
      {
        id: 'docs-06:00',
        severity: 'success',
        label: '06:00 · 99 · Good'
      },
      {
        id: 'docs-07:00',
        severity: 'success',
        label: '07:00 · 100 · Good'
      },
      {
        id: 'docs-08:00',
        severity: 'success',
        label: '08:00 · 84 · Good'
      },
      {
        id: 'docs-09:00',
        severity: 'success',
        label: '09:00 · 85 · Good'
      },
      {
        id: 'docs-10:00',
        severity: 'success',
        label: '10:00 · 91 · Good'
      },
      {
        id: 'docs-11:00',
        severity: 'success',
        label: '11:00 · 88 · Good'
      },
      {
        id: 'docs-12:00',
        severity: 'success',
        label: '12:00 · 83 · Good'
      },
      {
        id: 'docs-13:00',
        severity: 'success',
        label: '13:00 · 87 · Good'
      },
      {
        id: 'docs-14:00',
        severity: 'success',
        label: '14:00 · 91 · Good'
      },
      {
        id: 'docs-15:00',
        severity: 'success',
        label: '15:00 · 86 · Good'
      },
      {
        id: 'docs-16:00',
        severity: 'success',
        label: '16:00 · 83 · Good'
      },
      {
        id: 'docs-17:00',
        severity: 'success',
        label: '17:00 · 89 · Good'
      },
      {
        id: 'docs-18:00',
        severity: 'success',
        label: '18:00 · 100 · Good'
      },
      {
        id: 'docs-19:00',
        severity: 'success',
        label: '19:00 · 94 · Good'
      },
      {
        id: 'docs-20:00',
        severity: 'success',
        label: '20:00 · 95 · Good'
      },
      {
        id: 'docs-21:00',
        severity: 'success',
        label: '21:00 · 100 · Good'
      },
      {
        id: 'docs-22:00',
        severity: 'success',
        label: '22:00 · 99 · Good'
      },
      {
        id: 'docs-23:00',
        severity: 'success',
        label: '23:00 · 93 · Good'
      }
    ]
  }
]

export const sampleIncidents: HealthScoreIncident[] = [
  {
    id: 'incident-03',
    name: 'Video calls',
    scope: 'Application',
    icon: 'az az-layout-grid',
    devices: 34,
    share: 12,
    cause: 'Packet loss',
    opened: '2026-11-10T09:40:00Z',
    openedLabel: '09:40',
    band: {
      label: 'Poor',
      severity: 'danger'
    }
  },
  {
    id: 'incident-02',
    name: 'Travel',
    scope: 'Location',
    icon: 'az az-map-pin',
    devices: 9,
    share: 31,
    cause: 'High latency',
    opened: '2026-11-10T07:15:00Z',
    openedLabel: '07:15',
    band: {
      label: 'Fair',
      severity: 'warning'
    }
  },
  {
    id: 'incident-01',
    name: 'File storage',
    scope: 'Application',
    icon: 'az az-layout-grid',
    devices: 18,
    share: 7,
    cause: 'Slow server response',
    opened: '2026-11-10T06:02:00Z',
    openedLabel: '06:02',
    band: {
      label: 'Fair',
      severity: 'warning'
    }
  }
]
```
