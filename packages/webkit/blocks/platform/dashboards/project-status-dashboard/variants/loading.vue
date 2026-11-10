<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = true
  const comparison = 'vs previous sprint'

  const projects = [
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

  const sprints = [
    {
      value: 'sprint-6',
      label: 'Sprint 6 · Oct 27 – Nov 7'
    },
    {
      value: 'sprint-5',
      label: 'Sprint 5 · Oct 13 – Oct 24'
    },
    {
      value: 'sprint-4',
      label: 'Sprint 4 · Sep 29 – Oct 10'
    }
  ]

  const figures = [
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

  const completion = [
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

  const burndown = [
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

  const behind = {
    label: '23 pts behind',
    severity: 'warning',
    icon: 'pi pi-clock'
  }

  const milestones = [
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

  const owners = [
    {
      id: 'ana-souza',
      owner: 'Ana Souza',
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

  const ownerColumns = [
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

  const atRisk = [
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
    count: (value) => new Intl.NumberFormat('en-US').format(value),
    percentage: (value) => `${value.toFixed(0)}%`,
    points: (value) => `${value} pts`
  }

  const labelOf = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? value

  const project = ref('product-launch')
  const sprint = ref('sprint-6')
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-w-0 flex-col gap-(--spacing-lg)">
      <header class="flex min-w-0 flex-col gap-(--spacing-md)">
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <h1 class="text-balance text-heading-sm text-(--text-default)">Project status</h1>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            Progress, milestones and risks for the selected project and sprint.
          </p>
        </div>
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
      </header>

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
    </main>
  </div>
</template>
