<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import Dropdown from '@aziontech/webkit/dropdown'
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
  import { toast } from '@aziontech/webkit/toast'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  import {
    PROJECT_COMPARISON,
    PROJECT_DEFAULT,
    PROJECT_FORMATTERS,
    PROJECT_OPTIONS,
    PROJECT_OWNER_COLUMNS,
    PROJECT_SPRINT_DAYS,
    PROJECT_SPRINT_DEFAULT,
    PROJECT_SPRINTS,
    resolveProjectStatus
  } from '../../lib/data/dashboards/project-status'

  interface Props {
    period: string
    comparison: string
    loading?: boolean
    refetching?: boolean
    empty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    refetching: false,
    empty: false
  })

  const project = ref(PROJECT_DEFAULT)
  const sprint = ref(PROJECT_SPRINT_DEFAULT)

  const data = computed(() => resolveProjectStatus({ empty: props.empty }))

  const labelOf = (options: { value: string; label: string }[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? value

  const projectLabel = labelOf(PROJECT_OPTIONS)
  const sprintLabel = labelOf(PROJECT_SPRINTS)

  const CSV = {
    completion: () => ({
      columns: [
        { id: 'name', header: 'Status' },
        { id: 'tasks', header: 'Tasks' }
      ],
      rows: data.value.completion.map((entry) => ({ name: entry.name, tasks: entry.values[0] }))
    }),
    burndown: () => ({
      columns: [
        { id: 'day', header: 'Day' },
        ...data.value.burndown.map((entry) => ({ id: entry.id, header: entry.name }))
      ],
      rows: PROJECT_SPRINT_DAYS.map((day, index) => ({
        day,
        ...Object.fromEntries(data.value.burndown.map((entry) => [entry.id, entry.values[index]]))
      }))
    }),
    milestones: () => ({
      columns: [
        { id: 'date', header: 'Date' },
        { id: 'title', header: 'Milestone' },
        { id: 'status', header: 'Status' }
      ],
      rows: data.value.milestones
    }),
    'at-risk': () => ({
      columns: [
        { id: 'title', header: 'Task' },
        { id: 'reason', header: 'Reason' },
        { id: 'tag', header: 'Status' }
      ],
      rows: data.value.atRisk
    }),
    owners: () => ({
      columns: PROJECT_OWNER_COLUMNS.map((column) => ({ id: column.id, header: column.header })),
      rows: data.value.owners
    })
  }

  const onOption = async (card: keyof typeof CSV, value: unknown) => {
    if (value === 'export') {
      const fileName = `${project.value}-${sprint.value}-${card}.csv`
      downloadCsv(fileName, toCsv(CSV[card]()))
      toast.success('CSV exported.', { description: fileName })
      return
    }
    try {
      await globalThis.navigator.clipboard.writeText(globalThis.location.href)
      toast.success('Link copied.')
    } catch {
      toast.error('The link could not be copied.')
    }
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <div
      role="group"
      aria-label="Project filters"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
    >
      <div class="w-full sm:w-auto sm:min-w-48">
        <Select
          v-model="project"
          size="medium"
          :display-value="projectLabel"
        >
          <Select.Trigger aria-label="Project" />
          <Select.Content>
            <Select.Option
              v-for="option in PROJECT_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
      <div class="w-full sm:w-auto sm:min-w-64">
        <Select
          v-model="sprint"
          size="medium"
          :display-value="sprintLabel"
        >
          <Select.Trigger aria-label="Sprint" />
          <Select.Content>
            <Select.Option
              v-for="option in PROJECT_SPRINTS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </div>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
      <li
        v-for="figure in data.figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="figure.value"
          :format-value="PROJECT_FORMATTERS[figure.format]"
          :delta="figure.delta"
          :delta-label="PROJECT_COMPARISON"
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
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onOption('completion', value)"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Completion"
                />
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option
                  value="link"
                  label="Copy link"
                />
                <Dropdown.Option
                  value="export"
                  label="Export CSV"
                />
              </Dropdown.Group>
            </Dropdown>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <DonutChart
            :series="data.completion"
            total-label="Tasks"
            :format-value="PROJECT_FORMATTERS.count"
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
              v-if="data.behind && !loading"
              :label="data.behind.label"
              :severity="data.behind.severity"
              :icon="data.behind.icon"
              size="small"
            />
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onOption('burndown', value)"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Sprint burndown"
                />
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option
                  value="link"
                  label="Copy link"
                />
                <Dropdown.Option
                  value="export"
                  label="Export CSV"
                />
              </Dropdown.Group>
            </Dropdown>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            :series="data.burndown"
            :labels="PROJECT_SPRINT_DAYS"
            :format-value="PROJECT_FORMATTERS.points"
            empty-title="Nothing to burn down"
            empty-description="The burndown starts once the sprint has estimated tasks."
            :loading="loading"
            :refetching="refetching"
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
            <Hint text="Dated checkpoints to cutover, oldest first." />
          </span>
          <ChartCard.Controls>
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onOption('milestones', value)"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Milestones"
                />
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option
                  value="link"
                  label="Copy link"
                />
                <Dropdown.Option
                  value="export"
                  label="Export CSV"
                />
              </Dropdown.Group>
            </Dropdown>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content :flush="!loading && data.milestones.length > 0">
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
          <Item.List v-else-if="data.milestones.length">
            <Item
              v-for="milestone in data.milestones"
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
              v-if="data.atRisk.length && !loading"
              :label="`${data.atRisk.length} open`"
              severity="secondary"
              size="small"
            />
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onOption('at-risk', value)"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for At risk"
                />
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option
                  value="link"
                  label="Copy link"
                />
                <Dropdown.Option
                  value="export"
                  label="Export CSV"
                />
              </Dropdown.Group>
            </Dropdown>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content :flush="!loading && data.atRisk.length > 0">
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
          <Item.List v-else-if="data.atRisk.length">
            <Item
              v-for="entry in data.atRisk"
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
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onOption('owners', value)"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Owners"
                />
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option
                  value="link"
                  label="Copy link"
                />
                <Dropdown.Option
                  value="export"
                  label="Export CSV"
                />
              </Dropdown.Group>
            </Dropdown>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <TableRoot
            :data="data.owners"
            :columns="PROJECT_OWNER_COLUMNS"
            row-key="id"
            enable-sorting
            header-kind="compact"
            border
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
              <span class="tabular-nums">{{ PROJECT_FORMATTERS.count(row.open) }}</span>
            </template>
            <template #cell-done="{ row }">
              <span class="tabular-nums">{{ PROJECT_FORMATTERS.count(row.done) }}</span>
            </template>
            <template #cell-overdue="{ row }">
              <Tag
                v-if="row.overdue"
                :label="PROJECT_FORMATTERS.count(row.overdue)"
                severity="danger"
                size="small"
              />
              <span
                v-else
                class="tabular-nums text-(--text-muted)"
              >
                0
              </span>
            </template>
          </TableRoot>
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
