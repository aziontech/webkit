# ExecutiveSummaryDashboard (`platform/dashboard/executive-summary-dashboard`)

> An executive summary dashboard: one page a lead reads to see how the quarter went. A page heading with the quarter Select and Export sits over a scorecard row of six StatTiles (revenue, monthly active users, net revenue retention, NPS, uptime and cost per request), each with its delta against last quarter and a Hint that defines it. Below, a trend grid of small multiples, one ChartCard per metric with a compact Chart (Area or Line) over the last 12 months and a Tag with the twelve-month change, shares one active index so hovering a month moves the crosshair on every card. A side column holds the goals, a Card of goal bars where each goal shows its label, a status Tag (On track, At risk, Off track), a Progress of current against target and both figures, and the commentary, a Card of Item rows with the author Avatar, role, date and the note itself. Its page-level parts are `PageHeader`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/executive-summary-dashboard/executive-summary-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/executive-summary-dashboard")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [Progress](../../../components/progress.md), [Select](../../../components/select.md), [Skeleton](../../../components/skeleton.md), [StatTile](../../../components/stat-tile.md), [Tag](../../../components/tag.md)
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

executive summary; executive dashboard; scorecard; quarterly report; business kpis; leadership dashboard; resumo executivo; painel executivo; indicadores do trimestre

The one page a lead reads to see how the quarter went: the headline results against last quarter, the
twelve-month trend behind each one, progress on the quarter's goals and the notes the leads wrote when
they reviewed it. It favours a few numbers read in seconds over detail; every figure links back to its
own dashboard for the breakdown.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A recurring review (quarterly, monthly) where readers need results, trends, goals and context together.
- The audience reads the page, they do not investigate on it.
- There are a handful of headline metrics (about six) with targets.

## When not to use

- Investigating a metric by dimension: use `platform/dashboard/analytics-dashboard` or
  `platform/dashboard/data-dashboard`.
- Tracking one project's tasks and sprint: use `platform/dashboard/project-status-dashboard`.
- A total broken into categories: use `platform/dashboard/composition-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Executive summary` and one sentence on what it contains. Actions hold the quarter and Export.

### B. Quarter — `Select` (required)

The reporting period, labelled `Quarter`. It scopes every region, including goals and commentary.

### C. Export — `Button` (optional)

`Export` the summary for sharing outside the product.

### D. Scorecard — `StatTile` (required)

Six tiles in a region labelled `Scorecard`: `Revenue`, `Monthly active users`, `Net revenue retention`,
`NPS`, `Uptime`, `Cost per request`, each with its delta against last quarter. Only `Cost per request`
passes `inverse`; a rise there is bad.

### E. Metric definitions — `Hint` (required)

One sentence per tile and trend card. Executives may not know how NPS or net revenue retention are
computed; the `Hint` says so without adding text to the tile.

### F. Trend cards — `ChartCard` (required)

Small multiples in a region labelled `Trends`, one card per scorecard metric, all the same size, so
the reader compares shapes, not axes.

### G. Twelve-month change — `Tag` (required)

The trend card's change over twelve months (`+25.2%`), and each goal's status (`On track`, `At risk`,
`Off track`).

### H. Compact trends — `Chart` (required)

Area or Line over the last 12 months. Every trend card shares one `active-index`, so hovering a month
moves the crosshair on all of them and the reader reads one month across every metric.

### I. Goals and commentary — `Card` (required)

The side column: a goals `Card` titled with the quarter (`Q3 goals`) and a `Commentary` card.

### J. Loading rows — `Skeleton` (required)

Holds goal rows and note rows while the quarter loads.

### K. Goal progress — `Progress` (required)

Current against target for each goal, with an `aria-label` naming the goal, and both figures printed
beside it in tabular numbers.

### L. Empty regions — `EmptyState` (required)

Each region names the quarter in its empty state: trend cards
(`No results for Q3` / `Nothing was reported in this period. Select a later quarter.`), goals and
commentary (`Leads add notes here when they review the quarter.`).

### M. Notes — `Item` (required)

One `Item` per note: author, role, date and the note itself.

### N. Author — `Avatar` (required)

The author's initials beside each note.

## Do

- Keep every trend card the same size and form so shapes compare.
- Show the target next to the current value for every goal; a bar alone hides the gap.
- Use status words for goals (`On track`, `At risk`, `Off track`), with color as reinforcement.
- Link from each metric to the dashboard that explains it, when one exists.

## Don't

- Don't add more than about six scorecard tiles; the page is read, not explored.
- Don't give trend cards different periods or sizes.
- Don't mark growth metrics `inverse`; only cost and error style metrics read a rise as bad.
- Don't leave commentary empty without saying who fills it.

## Copy

- **Title:** `Executive summary`.
- **Description:** `Headline results for the quarter, progress on its goals, twelve-month trends and notes from the leads.`
- **Tile labels:** spelled-out metric, acronyms uppercase. `Net revenue retention`, `NPS`.
- **Goal status:** two words at most. `On track`, `At risk`, `Off track`.
- **Empty states:** name the period. `No goal results for Q3` / `Progress appears once the quarter reports its first month.`

## Accessibility

- The quarter `Select` trigger has `aria-label="Quarter"`; tiles and trends are regions labelled `Scorecard` and `Trends`.
- Each goal `Progress` has an `aria-label` with the goal name; current and target are visible text.
- Goal status is a word in a `Tag`, never color alone.
- Figures use `tabular-nums`.

## States

- Default: the reported quarter.
- Loading: tiles and charts render their own `Skeleton`; goals and commentary hold Skeleton rows.
- Empty: a quarter with nothing reported; tiles show a dash with no delta, every trend card keeps its box with an `EmptyState` that names the quarter, and goals and commentary say what fills them.
- Failed: the request for the quarter failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/project-status-dashboard` — one project against its plan.
- `platform/dashboard/composition-dashboard` — where a cost metric breaks down.
- `platform/dashboard/analytics-dashboard` — the detail behind a traffic metric.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the quarter loads, the tiles and charts render their own Skeleton and the goals and commentary hold Skeleton rows, so the page does not reflow when data arrives.
- `Empty` — A quarter with nothing reported. The tiles show a dash with no delta, every trend card keeps its box with an EmptyState that names the quarter and points to a later one, and the goals and commentary each say what fills them.
- `Failed` — The request for the quarter failed: the tiles read as dashes, and every trend card, the goals and the commentary keep their header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/executive-summary-dashboard", { variant })`, or the file under `blocks/platform/dashboard/executive-summary-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Progress from '@aziontech/webkit/progress'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs last quarter'
  const quarter = ref('Q3 2026')
  const activeIndex = ref(null)

  const quarters = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']

  const figures = [
    {
      id: 'revenue',
      label: 'Revenue',
      description: 'Recognized revenue for the quarter.',
      value: 4820000,
      format: 'currency',
      delta: 5.7,
      inverse: false
    },
    {
      id: 'active-users',
      label: 'Monthly active users',
      description: 'People who signed in at least once in the last month of the quarter.',
      value: 128400,
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

  const goals = [
    {
      id: 'revenue',
      label: 'Quarterly revenue',
      current: 4820000,
      target: 5000000,
      format: 'currency',
      status: {
        label: 'On track',
        severity: 'success'
      }
    },
    {
      id: 'active-users',
      label: 'Monthly active users',
      current: 128400,
      target: 140000,
      format: 'count',
      status: {
        label: 'At risk',
        severity: 'warning'
      }
    },
    {
      id: 'retention',
      label: 'Net revenue retention',
      current: 112,
      target: 110,
      format: 'percentage',
      status: {
        label: 'On track',
        severity: 'success'
      }
    },
    {
      id: 'nps',
      label: 'NPS',
      current: 47,
      target: 50,
      format: 'score',
      status: {
        label: 'On track',
        severity: 'success'
      }
    },
    {
      id: 'enterprise-deals',
      label: 'Enterprise deals closed',
      current: 18,
      target: 30,
      format: 'score',
      status: {
        label: 'Off track',
        severity: 'danger'
      }
    }
  ]

  const months = [
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

  const trends = [
    {
      id: 'revenue',
      title: 'Revenue',
      description: 'Recognized revenue per month.',
      mark: 'area',
      format: 'currency',
      min: 0,
      change: {
        label: '+25.2%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'revenue',
          name: 'Revenue',
          values: [
            1310000, 1340000, 1420000, 1380000, 1410000, 1470000, 1490000, 1520000, 1550000,
            1570000, 1610000, 1640000
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
      change: {
        label: '+30.8%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'active-users',
          name: 'Monthly active users',
          values: [
            98200, 101400, 104000, 103100, 107900, 111500, 114600, 117300, 122200, 124000, 126100,
            128400
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
      change: {
        label: '+5.7%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
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
      change: {
        label: '+23.7%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
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
      change: {
        label: '+0.05%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'uptime',
          name: 'Uptime',
          values: [
            99.94, 99.96, 99.91, 99.97, 99.98, 99.95, 99.99, 99.95, 99.91, 99.98, 99.94, 99.99
          ]
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
      change: {
        label: '−25.0%',
        severity: 'success',
        icon: 'pi pi-arrow-down-right'
      },
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

  const notes = [
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

  const formatters = {
    currency: (value) => money.format(value),
    count: (value) => compact.format(value),
    percentage: (value) => `${value.toFixed(0)}%`,
    uptime: (value) => `${value.toFixed(2)}%`,
    score: (value) => value.toFixed(0),
    cost: (value) => `${value.toFixed(4)}`
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Executive summary"
        description="Headline results for the quarter, progress on its goals, twelve-month trends and notes from the leads."
      >
        <template #actions>
          <div class="w-36">
            <Select
              v-model="quarter"
              size="medium"
            >
              <Select.Trigger aria-label="Quarter" />
              <Select.Content>
                <Select.Option
                  v-for="option in quarters"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
          <Button
            label="Export"
            kind="outlined"
            size="medium"
            icon="pi pi-download"
          />
        </template>
      </PageHeader>

      <section aria-label="Scorecard">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <li
            v-for="figure in figures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
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
          <ChartCard
            v-for="trend in trends"
            :key="trend.id"
            :span="1"
          >
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
                empty-description="Nothing was reported in this period. Select a later quarter."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis
                  kind="x"
                  :ticks="4"
                />
                <Chart.Area v-if="trend.mark === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
              </Chart>
            </ChartCard.Content>
          </ChartCard>
        </section>

        <div class="flex min-w-0 flex-col gap-(--spacing-md) xl:col-span-4">
          <Card :title="quarter + ' goals'">
            <template #content>
              <ul
                v-if="loading"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="index in 5"
                  :key="index"
                  class="flex flex-col gap-(--spacing-xs)"
                >
                  <Skeleton
                    width="60%"
                    height="1rem"
                  />
                  <Skeleton height="0.5rem" />
                  <Skeleton
                    width="40%"
                    height="0.75rem"
                  />
                </li>
              </ul>
              <ul
                v-else-if="goals.length"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="goal in goals"
                  :key="goal.id"
                  class="flex flex-col gap-(--spacing-xs)"
                >
                  <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
                    <span class="truncate text-label-md text-(--text-default)">{{
                      goal.label
                    }}</span>
                    <Tag
                      :label="goal.status.label"
                      :severity="goal.status.severity"
                      size="small"
                    />
                  </div>
                  <Progress
                    :value="goal.current"
                    :max="goal.target"
                    size="small"
                    :aria-label="goal.label"
                    :aria-valuetext="
                      formatters[goal.format](goal.current) +
                      ' of ' +
                      formatters[goal.format](goal.target)
                    "
                  />
                  <div
                    class="flex items-center justify-between gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    <span class="tabular-nums">
                      {{ formatters[goal.format](goal.current) }} of
                      {{ formatters[goal.format](goal.target) }}
                    </span>
                    <span class="tabular-nums"
                      >{{ Math.round((goal.current / goal.target) * 100) }}%</span
                    >
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
          </Card>

          <Card
            title="Commentary"
            :padded="false"
          >
            <template #content>
              <Item.List
                key="item.list-1"
                v-if="loading"
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
                      kind="circle"
                      width="2rem"
                      height="2rem"
                    />
                  </Item.Media>
                  <Item.Content>
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Skeleton
                        width="45%"
                        height="1rem"
                      />
                      <Skeleton height="2.5rem" />
                    </div>
                  </Item.Content>
                </Item>
              </Item.List>
              <Item.List
                key="item.list-2"
                v-else-if="notes.length"
              >
                <Item
                  v-for="note in notes"
                  :key="note.id"
                  size="small"
                  role="listitem"
                >
                  <Item.Media>
                    <Avatar
                      :label="note.initials"
                      size="medium"
                    />
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
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
```
