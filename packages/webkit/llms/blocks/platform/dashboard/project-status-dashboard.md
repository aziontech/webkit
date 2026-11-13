# ProjectStatusDashboard (`platform/dashboard/project-status-dashboard`)

> A project status dashboard: where a project stands against its plan, for one project and sprint at a time. The page opens with a PageHeader whose actions hold two Selects (project and sprint), then a row of four StatTiles (completion, tasks done, open tasks and overdue, each against the previous sprint), over a 12-column grid of ChartCards. A DonutChart splits every task by status (done, in progress, not started, and blocked in the danger color) beside the sprint burndown, a Chart of two Lines (actual story points left against the ideal straight line to zero) tagged with how far behind the sprint runs. The milestone timeline and the at-risk list share the next row: the timeline is an Item list with the date, title and a StatusIndicator per checkpoint, since there is no timeline component; the at-risk list is Item rows with the reason and a Tag. The owners table closes the grid, a TableRoot with each owner’s Avatar and name, open and done counts, and overdue as a danger Tag. Every card carries the same header: title with a Hint, its tags, and a menu with Copy link and Export CSV. Built from `PageHeader`, `StatTile`, `ChartCard`, `DonutChart`, `Chart`, `Item`, `StatusIndicator`, `TableRoot`, `Avatar`, `Tag`, `Select`, `Hint`, `DropdownMenu`, `EmptyState`, `Skeleton` and `Button`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/project-status-dashboard/project-status-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/project-status-dashboard")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [DonutChart](../../../components/donut-chart.md), [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [Select](../../../components/select.md), [Skeleton](../../../components/skeleton.md), [StatTile](../../../components/stat-tile.md), [StatusIndicator](../../../components/status-indicator.md), `TableRoot`, [Tag](../../../components/tag.md)
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

project status; sprint dashboard; project dashboard; tasks done; burndown; overdue tasks; status do projeto; painel do projeto; andamento da sprint

Where one project stands against its plan, one project and sprint at a time. A lead or a team member
opens it before a stand-up or a review to see completion, the sprint burndown, the next milestones,
what is at risk and who carries the open work. The page heading (`Project status`) sits over a filter
row that picks the project and the sprint; every region reads that pair.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- Work is tracked as tasks with status, estimates, owners and due dates, grouped in sprints.
- The reader needs the plan (ideal burndown, milestones) next to the actual.
- Risks have reasons the reader can act on, not only a count.

## When not to use

- Results for a whole quarter across teams: use `platform/dashboard/executive-summary-dashboard`.
- The full task list with filters and bulk actions: use `platform/view/table-view`.
- Live service health: use `platform/dashboard/service-monitoring-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Project status` and one sentence on what it shows. Actions hold the project and sprint selects.

### B. Project and sprint — `Select` (required)

Two selects labelled `Project` and `Sprint` in the page heading actions. The sprint label carries its
dates (`Sprint 6 · Oct 27 to Nov 7` in the SFC).

### C. Sprint tiles — `StatTile` (required)

`Completion`, `Tasks done`, `Open tasks`, `Overdue`, each against the previous sprint. `Open tasks` and
`Overdue` pass `inverse`.

### D. Definitions — `Hint` (required)

One sentence on every tile and card title.

### E. Cards — `ChartCard` (required)

`Completion` and `Sprint burndown` share a row; `Milestones` and `At risk` share the next; `Owners`
closes the grid. Every card has the same header: title with `Hint`, its tags, and a menu.

### F. Card menu — `DropdownMenu` (optional)

`Copy link` and `Export CSV`.

### G. Card menu trigger — `IconButton` (optional)

Icon-only, `aria-label="More options for Completion"` and so on.

### H. Tasks by status — `DonutChart` (required)

Done, in progress, not started and blocked; blocked takes the danger color because it means a state.
The center shows the task count.

### I. Add tasks — `Button` (required in the empty state)

The completion card's one setup action when the project has no tasks.

### J. Card tags — `Tag` (required)

How far behind the sprint runs on the burndown (`23 pts behind`), the open count on At risk, each
at-risk reason (`Blocked`, `Overdue`, `Behind`), and overdue counts in the owners table as a danger tag.

### K. Sprint burndown — `Chart` (required)

Two lines: `Actual` story points left against `Ideal`, the straight line to zero. The ideal line is the
reference; keep it quieter than the actual.

### L. Loading rows — `Skeleton` (required)

Holds milestone and at-risk rows while the sprint loads.

### M. Milestones and at-risk rows — `Item` (required)

The milestone timeline is an `Item` list with the date, title and status of each checkpoint (there is
no timeline component). At risk lists each task with its reason and a `Tag`.

### N. Milestone status — `StatusIndicator` (required)

`Done`, `At risk`, `Upcoming` in words beside each milestone.

### O. Empty regions — `EmptyState` (required)

Every card says what will appear: `No tasks yet` / `Progress appears here once the project has tasks.`,
`Nothing to burn down`, `No milestones yet`, `Nothing at risk`, `No owners yet`.

### P. Owners — `TableRoot` (required)

Each owner with open and done counts and overdue as a danger `Tag`, in tabular figures.

### Q. Owner identity — `Avatar` (required)

The owner's initials beside the name.

## Do

- Write the reason next to every at-risk task; a count alone does not tell anyone what to do.
- Keep milestone status in words and in order of date.
- Mark open and overdue tiles as `inverse`.
- Offer exactly one setup action (`Add tasks`) when the project is empty.

## Don't

- Don't color the donut's categories with status hues except for the one that means a state (blocked).
- Don't make the ideal line louder than the actual.
- Don't hide an empty card; keep its box and say what fills it.

## Copy

- **Title:** `Project status`. **Description:** `Progress, milestones and risks for the selected project and sprint.`
- **Sprint labels:** name, a middle dot, the date range written with `to`. `Sprint 5 · Oct 13 to Oct 24`.
- **At-risk reason:** one sentence with a period, the cause and its effect. `Blocked by a library upgrade waiting on security review.`
- **Behind tag:** amount plus unit. `23 pts behind`.
- **Empty state:** `Nothing at risk` / `Tasks that are blocked, overdue or behind appear here.`

## Accessibility

- Both selects have `aria-label`s (`Project`, `Sprint`).
- The donut has `aria-label="Tasks by status"` and a legend with counts.
- Status is written (`StatusIndicator`, `Tag`), never color alone.
- Figures use `tabular-nums`.

## States

- Default: the selected project and sprint.
- Loading: tiles, both charts and the table hold their place with a `Skeleton`; the two lists show Skeleton rows.
- Empty: a project with no tasks; tiles show a dash with no delta or trend, every card keeps its box with an `EmptyState`, and the completion card offers `Add tasks`.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/executive-summary-dashboard` — goals and trends across a quarter.
- `platform/view/table-view` — the task list itself.
- `StatusIndicator` / `Tag` — status in words.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the first response loads, the tiles, both charts and the table hold their place with a Skeleton, and the two lists show Skeleton rows, so the grid does not reflow when data arrives.
- `Empty` — A project with no tasks yet. The tiles show a dash with no delta or trend, every card keeps its box with an EmptyState that says what will appear there, and the completion card carries the one setup action, Add tasks.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/project-status-dashboard", { variant })`, or the file under `blocks/platform/dashboard/project-status-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  type FigureFormat = 'count' | 'percentage'

  interface Figure {
    id: string
    label: string
    description: string
    value: number | null
    format: FigureFormat
    delta: number | null
    inverse: boolean
    trend: number[]
  }

  interface Variation {
    label: string
    severity: TagSeverity
    icon: string
  }

  interface Milestone {
    id: string
    date: string
    day: string
    title: string
    description: string
    status: string
    severity: StatusIndicatorSeverity
  }

  interface OwnerRow {
    id: string
    owner: string
    initials: string
    open: number
    done: number
    overdue: number
  }

  interface RiskItem {
    id: string
    title: string
    reason: string
    tag: string
    severity: TagSeverity
  }

  const loading = false
  const comparison = 'vs previous sprint'

  const projects: SelectOptionItem[] = [
    {
      value: 'product-launch',
      label: 'Product launch'
    },
    {
      value: 'website-redesign',
      label: 'Website redesign'
    },
    {
      value: 'billing-migration',
      label: 'Billing migration'
    }
  ]

  const sprints: SelectOptionItem[] = [
    {
      value: 'sprint-6',
      label: 'Sprint 6 · Oct 27 to Nov 7'
    },
    {
      value: 'sprint-5',
      label: 'Sprint 5 · Oct 13 to Oct 24'
    },
    {
      value: 'sprint-4',
      label: 'Sprint 4 · Sep 29 to Oct 10'
    }
  ]

  const figures: Figure[] = [
    {
      id: 'completion',
      label: 'Completion',
      description: 'Share of the project’s tasks marked done.',
      value: 58,
      format: 'percentage',
      delta: 13.7,
      inverse: false,
      trend: [41, 43, 46, 48, 50, 52, 55, 58]
    },
    {
      id: 'done',
      label: 'Tasks done',
      description: 'Tasks marked done since the project started.',
      value: 74,
      format: 'count',
      delta: 23.3,
      inverse: false,
      trend: [52, 55, 58, 61, 64, 67, 71, 74]
    },
    {
      id: 'open',
      label: 'Open tasks',
      description: 'Tasks not done yet: in progress, blocked or not started.',
      value: 54,
      format: 'count',
      delta: -8.5,
      inverse: true,
      trend: [61, 60, 58, 58, 57, 56, 55, 54]
    },
    {
      id: 'overdue',
      label: 'Overdue',
      description: 'Open tasks past their due date. A rise is a risk to the launch date.',
      value: 7,
      format: 'count',
      delta: 75,
      inverse: true,
      trend: [3, 3, 4, 4, 5, 5, 6, 7]
    }
  ]

  const completion: ChartSeries[] = [
    {
      id: 'done',
      name: 'Done',
      values: [74]
    },
    {
      id: 'in-progress',
      name: 'In progress',
      values: [29]
    },
    {
      id: 'not-started',
      name: 'Not started',
      values: [19]
    },
    {
      id: 'blocked',
      name: 'Blocked',
      values: [6],
      color: 'danger'
    }
  ]

  const sprintDays = [
    'Oct 27',
    'Oct 28',
    'Oct 29',
    'Oct 30',
    'Oct 31',
    'Nov 3',
    'Nov 4',
    'Nov 5',
    'Nov 6',
    'Nov 7'
  ]

  const burndown: ChartSeries[] = [
    {
      id: 'actual',
      name: 'Actual',
      values: [80, 77, 70, 66, 58, 55, 47, 41, null, null]
    },
    {
      id: 'ideal',
      name: 'Ideal',
      values: [80, 71, 62, 53, 44, 36, 27, 18, 9, 0]
    }
  ]

  const behind: Variation | null = {
    label: '23 pts behind',
    severity: 'warning',
    icon: 'pi pi-clock'
  }

  const milestones: Milestone[] = [
    {
      id: 'scope',
      date: '2026-10-06',
      day: 'Oct 6',
      title: 'Scope signed off',
      description: 'Requirements and launch criteria approved.',
      status: 'Done',
      severity: 'success'
    },
    {
      id: 'design-freeze',
      date: '2026-10-20',
      day: 'Oct 20',
      title: 'Design freeze',
      description: 'Final screens handed off to engineering.',
      status: 'Done',
      severity: 'success'
    },
    {
      id: 'beta',
      date: '2026-11-03',
      day: 'Nov 3',
      title: 'Internal beta',
      description: 'Build shared with 120 internal testers.',
      status: 'Done',
      severity: 'success'
    },
    {
      id: 'feature-complete',
      date: '2026-11-10',
      day: 'Nov 10',
      title: 'Feature complete',
      description: 'Every launch task merged and in testing.',
      status: 'At risk',
      severity: 'warning'
    },
    {
      id: 'release-candidate',
      date: '2026-11-14',
      day: 'Nov 14',
      title: 'Release candidate',
      description: 'Final build frozen for sign-off.',
      status: 'Upcoming',
      severity: 'neutral'
    },
    {
      id: 'launch',
      date: '2026-11-17',
      day: 'Nov 17',
      title: 'Public launch',
      description: 'Available to every customer.',
      status: 'Upcoming',
      severity: 'neutral'
    }
  ]

  const owners: OwnerRow[] = [
    {
      id: 'amy-chen',
      owner: 'Amy Chen',
      initials: 'AS',
      open: 12,
      done: 18,
      overdue: 3
    },
    {
      id: 'marcus-lee',
      owner: 'Marcus Lee',
      initials: 'ML',
      open: 10,
      done: 15,
      overdue: 0
    },
    {
      id: 'priya-nair',
      owner: 'Priya Nair',
      initials: 'PN',
      open: 9,
      done: 14,
      overdue: 2
    },
    {
      id: 'tom-s-ortega',
      owner: 'Tomás Ortega',
      initials: 'TO',
      open: 8,
      done: 11,
      overdue: 1
    },
    {
      id: 'hannah-kim',
      owner: 'Hannah Kim',
      initials: 'HK',
      open: 8,
      done: 9,
      overdue: 0
    },
    {
      id: 'david-chen',
      owner: 'David Chen',
      initials: 'DC',
      open: 7,
      done: 7,
      overdue: 1
    }
  ]

  const ownerColumns: TableColumn[] = [
    {
      id: 'owner',
      accessorKey: 'owner',
      header: 'Owner',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'open',
      accessorKey: 'open',
      header: 'Open',
      align: 'end',
      enableSorting: true
    },
    {
      id: 'done',
      accessorKey: 'done',
      header: 'Done',
      align: 'end',
      enableSorting: true
    },
    {
      id: 'overdue',
      accessorKey: 'overdue',
      header: 'Overdue',
      align: 'end',
      enableSorting: true
    }
  ]

  const atRisk: RiskItem[] = [
    {
      id: 'payment-flow',
      title: 'Payment flow on older devices',
      reason: 'Blocked by a library upgrade waiting on security review.',
      tag: 'Blocked',
      severity: 'danger'
    },
    {
      id: 'release-notes',
      title: 'Release notes',
      reason: 'Due Nov 3; waiting on the final feature list.',
      tag: 'Overdue',
      severity: 'danger'
    },
    {
      id: 'store-listing',
      title: 'Localized store listing',
      reason: 'Translations for 4 of 9 languages are still missing.',
      tag: 'Behind',
      severity: 'warning'
    },
    {
      id: 'load-test',
      title: 'Load test at launch volume',
      reason: 'Starts after feature complete, leaving 4 days to fix findings.',
      tag: 'At risk',
      severity: 'warning'
    }
  ]

  const formatters = {
    count: (value: number) => new Intl.NumberFormat('en-US').format(value),
    percentage: (value: number) => `${value.toFixed(0)}%`,
    points: (value: number) => `${value} pts`
  }

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? value

  const project = ref('product-launch')
  const sprint = ref('sprint-6')
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Project status"
        description="Progress, milestones and risks for the selected project and sprint."
      >
        <template #actions>
          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
            <div class="w-full sm:w-fit sm:min-w-48">
              <Select
                v-model="project"
                size="medium"
                class="w-full"
                :display-value="labelOf(projects)"
              >
                <Select.Trigger aria-label="Project" />
                <Select.Content>
                  <Select.Option
                    v-for="option in projects"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>
            <div class="w-full sm:w-fit sm:min-w-64">
              <Select
                v-model="sprint"
                size="medium"
                class="w-full"
                :display-value="labelOf(sprints)"
              >
                <Select.Trigger aria-label="Sprint" />
                <Select.Content>
                  <Select.Option
                    v-for="option in sprints"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>
          </div>
        </template>
      </PageHeader>

      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
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
            :trend="figure.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint :text="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Completion</ChartCard.Title>
              <Hint text="Every task in the project, by its current status." />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Completion"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <DonutChart
              :series="completion"
              total-label="Tasks"
              :format-value="formatters.count"
              empty-title="No tasks yet"
              empty-description="Progress appears here once the project has tasks."
              :loading="loading"
              aria-label="Tasks by status"
            >
              <template #empty-actions>
                <Button
                  label="Add tasks"
                  kind="primary"
                  size="medium"
                  icon="pi pi-plus"
                />
              </template>
            </DonutChart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Sprint burndown</ChartCard.Title>
              <Hint
                text="Story points left in the sprint each working day, against a straight line to zero."
              />
            </span>
            <ChartCard.Controls>
              <Tag
                label="Story points"
                severity="secondary"
                size="small"
                icon="pi pi-chart-line"
              />
              <Tag
                v-if="behind && !loading"
                :label="behind.label"
                :severity="behind.severity"
                :icon="behind.icon"
                size="small"
              />
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Sprint burndown"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="burndown"
              :labels="sprintDays"
              :format-value="formatters.points"
              empty-title="Nothing to burn down"
              empty-description="The burndown starts once the sprint has estimated tasks."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Line
                :ids="['ideal']"
                curve="linear"
              />
              <Chart.Line
                :ids="['actual']"
                curve="linear"
                markers
              />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Milestones</ChartCard.Title>
              <Hint text="Dated checkpoints to launch, oldest first." />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Milestones"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content :flush="!loading && milestones.length > 0">
            <div
              v-if="loading"
              class="flex flex-col gap-(--spacing-md)"
            >
              <div
                v-for="row in 6"
                :key="row"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <Skeleton
                  width="60%"
                  height="0.875rem"
                />
                <Skeleton
                  width="90%"
                  height="0.75rem"
                />
              </div>
            </div>
            <Item.List v-else-if="milestones.length">
              <Item
                v-for="milestone in milestones"
                :key="milestone.id"
                role="listitem"
                size="small"
              >
                <Item.Media>
                  <time
                    :datetime="milestone.date"
                    class="w-12 text-label-sm tabular-nums text-(--text-muted)"
                  >
                    {{ milestone.day }}
                  </time>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ milestone.title }}</Item.Title>
                  <Item.Description>{{ milestone.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <StatusIndicator
                    :label="milestone.status"
                    :severity="milestone.severity"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-flag"
              title="No milestones yet"
              description="Milestones appear here once the project has dated checkpoints."
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>At risk</ChartCard.Title>
              <Hint text="Tasks that threaten the next milestone, with the reason." />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="atRisk.length && !loading"
                :label="atRisk.length + ' open'"
                severity="secondary"
                size="small"
              />
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for At risk"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content :flush="!loading && atRisk.length > 0">
            <div
              v-if="loading"
              class="flex flex-col gap-(--spacing-md)"
            >
              <div
                v-for="row in 4"
                :key="row"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <Skeleton
                  width="60%"
                  height="0.875rem"
                />
                <Skeleton
                  width="90%"
                  height="0.75rem"
                />
              </div>
            </div>
            <Item.List v-else-if="atRisk.length">
              <Item
                v-for="entry in atRisk"
                :key="entry.id"
                role="listitem"
                size="small"
              >
                <Item.Content>
                  <Item.Title>{{ entry.title }}</Item.Title>
                  <Item.Description>{{ entry.reason }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <Tag
                    :label="entry.tag"
                    :severity="entry.severity"
                    size="small"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-check-circle"
              title="Nothing at risk"
              description="Tasks that are blocked, overdue or behind appear here."
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Owners</ChartCard.Title>
              <Hint text="Tasks per owner. Overdue counts open tasks past their due date." />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Owners"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              :data="owners"
              :columns="ownerColumns"
              row-key="id"
              enable-sorting
              header-kind="compact"
              bordered
              :loading="loading"
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="pi pi-users"
                  title="No owners yet"
                  description="Owners appear once tasks are assigned."
                />
              </template>
              <template #cell-owner="{ row }">
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    :alt="row.owner"
                    :label="row.initials"
                    size="small"
                    kind="circle"
                  />
                  <span class="truncate">{{ row.owner }}</span>
                </span>
              </template>
              <template #cell-open="{ row }">
                <span class="tabular-nums">{{ formatters.count(row.open) }}</span>
              </template>
              <template #cell-done="{ row }">
                <span class="tabular-nums">{{ formatters.count(row.done) }}</span>
              </template>
              <template #cell-overdue="{ row }">
                <Tag
                  v-if="row.overdue"
                  :label="formatters.count(row.overdue)"
                  severity="danger"
                  size="small"
                />
                <span
                  v-else
                  class="tabular-nums text-(--text-muted)"
                  >0</span
                >
              </template>
            </TableRoot>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
```
