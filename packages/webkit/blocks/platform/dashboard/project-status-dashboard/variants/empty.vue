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
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  type FigureFormat = 'count' | 'percentage'

  interface SelectOption {
    value: string
    label: string
  }

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

  const projects: SelectOption[] = [
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

  const sprints: SelectOption[] = [
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
      value: null,
      format: 'percentage',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'done',
      label: 'Tasks done',
      description: 'Tasks marked done since the project started.',
      value: null,
      format: 'count',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'open',
      label: 'Open tasks',
      description: 'Tasks not done yet: in progress, blocked or not started.',
      value: null,
      format: 'count',
      delta: null,
      inverse: true,
      trend: []
    },
    {
      id: 'overdue',
      label: 'Overdue',
      description: 'Open tasks past their due date. A rise is a risk to the launch date.',
      value: null,
      format: 'count',
      delta: null,
      inverse: true,
      trend: []
    }
  ]

  const completion: ChartSeries[] = []

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

  const burndown: ChartSeries[] = []

  const behind = null as Variation | null

  const milestones: Milestone[] = []

  const owners: OwnerRow[] = []

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

  const atRisk: RiskItem[] = []

  const formatters = {
    count: (value: number) => new Intl.NumberFormat('en-US').format(value),
    percentage: (value: number) => `${value.toFixed(0)}%`,
    points: (value: number) => `${value} pts`
  }

  const labelOf = (options: SelectOption[]) => (value: string) =>
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
